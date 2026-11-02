"""Shared helpers for the pipeline-sync tests: synthetic sheets / stores and a local store
simulator that applies planned batches the way ArtifactData would (set / update with
if_version pins). Nothing here talks to the live store."""
import copy
import json
import os
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
TOOL_DIR = os.path.dirname(HERE)
FIXTURES = os.path.join(HERE, "fixtures")
if TOOL_DIR not in sys.path:
    sys.path.append(TOOL_DIR)

import parse_sheet  # noqa: E402
import plan_sync  # noqa: E402

TEXT_FIELDS = plan_sync.TEXT_FIELDS
SECTIONS = [("pipeline", "Pipeline"), ("jvs", "JVs"), ("corporate", "Corporate"), ("misc", "Miscellaneous"),
            ("closed", "Closed"), ("removed", "Removed")]
NOW = "2026-11-03T15:00:00.000Z"          # 10:00 EST, asOf 2026-11-03
NOW2 = "2026-11-03T16:00:00.000Z"
SEED_AT = "2026-10-29T19:17:33.000Z"


def row(rid, section="pipeline", **fields):
    r = {"id": rid, "section": section, "order": 0, "sheetRow": 0, "marker": ""}
    for f in TEXT_FIELDS:
        r[f] = ""
    r["project"] = "Project " + rid.replace("-", " ").title()
    r["site"] = "Site " + rid
    r["sponsor"] = "Herndon"
    r["region"] = "EMEA"
    r["status"] = "Live"
    r["statusUpdate"] = "x first point on %s x second point" % rid
    r.update(fields)
    return r


def sheet(rows, read_at="2026-11-03T14:59:00.000Z", warnings=None):
    """A parsed sheet: rows in sheet order; order / sheetRow / sections laid out like the real
    sheet (header row 7, a blank row and a label row before every section after Pipeline)."""
    rows = [copy.deepcopy(r) for r in rows]
    by_sec = {k: [r for r in rows if r["section"] == k] for k, _ in SECTIONS}
    out_rows, sections, r_no = [], [], 8
    for i, (key, label) in enumerate(SECTIONS):
        if i:
            r_no += 1
            sections.append({"key": key, "label": label, "order": i, "labelRow": r_no})
            r_no += 1
        else:
            sections.append({"key": key, "label": label, "order": 0, "labelRow": None})
        for n, r in enumerate(by_sec[key], 1):
            r["order"] = n
            r["sheetRow"] = r_no
            r_no += 1
            out_rows.append(r)
        sections[-1]["rowCount"] = len(by_sec[key])
    return {"readAt": read_at, "sheetDate": "2026-11-03", "sections": sections, "rows": out_rows,
            "warnings": list(warnings or [])}


def baseline_doc(sh, aliases=None, synced=SEED_AT):
    b = copy.deepcopy(sh)
    b["syncedAt"] = synced
    b["aliases"] = dict(aliases or {})
    return b


def doc_from_row(r, **over):
    d = {f: r[f] for f in TEXT_FIELDS}
    d.update({"section": r["section"], "order": r["order"], "sheetRow": r["sheetRow"], "marker": r.get("marker", ""),
              "trackerProject": None, "stage": "", "paused": False, "updatedAt": SEED_AT, "updatedBy": "Claude",
              "history": []})
    d.update(over)
    return d


def merge_update(dst, patch):
    """An ArtifactData update (db.d.ts): nested objects merge recursively; anything else (arrays
    included) replaces the field wholesale."""
    for k, v in patch.items():
        if isinstance(v, dict) and isinstance(dst.get(k), dict):
            merge_update(dst[k], v)
        else:
            dst[k] = copy.deepcopy(v)
    return dst


class Store(object):
    """A local copy of the store: pipeline docs, config, sheetSync and versions."""

    def __init__(self, docs, config=None, sheet_sync=None, versions=None):
        self.docs = copy.deepcopy(docs)
        self.config = copy.deepcopy(config) if config is not None else {"asOf": "2026-10-29", "calls": [],
                                                                          "lastCall": None, "seededAt": SEED_AT}
        self.sheet_sync = copy.deepcopy(sheet_sync)
        if versions is None:
            versions = {i: 2 for i in docs}
            versions["pipelineMeta/config"] = 2
            if sheet_sync is not None:
                versions["pipelineMeta/sheetSync"] = 1
        self.versions = dict(versions)

    @classmethod
    def from_sheet(cls, sh, synced=True, **doc_over):
        docs = {r["id"]: doc_from_row(r, **doc_over.get(r["id"], {})) for r in sh["rows"]}
        return cls(docs, sheet_sync=baseline_doc(sh) if synced else None)

    def plan(self, new_sheet, now=NOW, bootstrap=None, accept=False):
        if bootstrap is not None:
            base = bootstrap
        else:
            base = self.sheet_sync
        return plan_sync.build_plan(new_sheet, base, copy.deepcopy(self.docs), dict(self.versions),
                                    copy.deepcopy(self.config), now, bootstrap=bootstrap is not None,
                                    accept_store_diffs=accept)

    def apply(self, batches):
        """Apply like ArtifactData batch: a pinned entry must match the current version; set without
        a pin must create; update merges like the real store. Raises on any pin mismatch."""
        for batch in batches:
            assert len(batch) <= 50
            ids = [(e["collection"], e["doc_id"]) for e in batch]
            assert len(ids) == len(set(ids)), "a document addressed twice in one batch"
            for e in batch:
                key = e["doc_id"] if e["collection"] == "pipeline" else "pipelineMeta/" + e["doc_id"]
                exists = key in self.versions
                if exists and e.get("if_version") != self.versions[key]:
                    raise AssertionError("version conflict on %s: pin %r, store %r" % (key, e.get("if_version"),
                                                                                       self.versions[key]))
                if not exists and e["op"] != "set":
                    raise AssertionError("update of a missing doc " + key)
            for e in batch:
                key = e["doc_id"] if e["collection"] == "pipeline" else "pipelineMeta/" + e["doc_id"]
                data = copy.deepcopy(e["data"])
                if e["collection"] == "pipeline":
                    target = self.docs
                    if e["op"] == "set":
                        target[e["doc_id"]] = data
                    else:
                        merge_update(target[e["doc_id"]], data)
                elif e["doc_id"] == "config":
                    if e["op"] == "set":
                        self.config = data
                    else:
                        merge_update(self.config, data)
                elif e["doc_id"] == "sheetSync":
                    if e["op"] == "set" or self.sheet_sync is None:
                        self.sheet_sync = data
                    else:
                        merge_update(self.sheet_sync, data)
                else:
                    raise AssertionError("unexpected doc " + key)
                self.versions[key] = self.versions.get(key, 0) + 1

    def write(self, d):
        os.makedirs(os.path.join(d, "pipeline"))
        os.makedirs(os.path.join(d, "pipelineMeta"))
        for i, body in self.docs.items():
            dump(os.path.join(d, "pipeline", i + ".json"), body)
        dump(os.path.join(d, "pipelineMeta", "config.json"), self.config)
        if self.sheet_sync is not None:
            dump(os.path.join(d, "pipelineMeta", "sheetSync.json"), self.sheet_sync)
        dump(os.path.join(d, "versions.json"), self.versions)


def entries(plan):
    return [e for b in plan["batches"] for e in b]


def pipeline_entries(plan):
    return [e for e in entries(plan) if e["collection"] == "pipeline"]


def entry(plan, doc_id, collection="pipeline"):
    found = [e for e in entries(plan) if e["doc_id"] == doc_id and e["collection"] == collection]
    return found[0] if found else None


def dump(path, obj):
    with open(path, "w", encoding="utf-8") as fh:
        json.dump(obj, fh, ensure_ascii=False, indent=1)


def load(path):
    with open(path, encoding="utf-8") as fh:
        return json.load(fh)


def run_tool(script, *args):
    p = subprocess.run([sys.executable, "-I", os.path.join(TOOL_DIR, script)] + list(args),
                       stdout=subprocess.PIPE, stderr=subprocess.PIPE, universal_newlines=True)
    return p.returncode, p.stdout, p.stderr


def fixture_text(name):
    with open(os.path.join(FIXTURES, name), encoding="utf-8") as fh:
        return fh.read()
