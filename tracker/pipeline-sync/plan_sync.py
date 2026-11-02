#!/usr/bin/env python3
"""Plan a one-way sync of the CF Pipeline: live Excel -> the tracker's shared store.

    python3 -I plan_sync.py --sheet <parsed.json>
                            (--baseline <sheetSync.json> | --bootstrap <parsed.json> [--accept-store-diffs])
                            --store <dir> --versions <versions.json> --now <ISO time> --out <dir>

Inputs (all local files; this script never talks to the store):
  --sheet      the new sheet, as written by parse_sheet.py
  --baseline   the last-synced sheet: the body of pipelineMeta/sheetSync
               ({syncedAt, readAt, sheetDate, sections, rows, aliases, warnings})
  --bootstrap  use this parsed sheet as the baseline instead (pipelineMeta/sheetSync missing).
               The plan aborts if the store has any text difference against it, unless
               --accept-store-diffs is given (only after a human confirmed the baseline).
  --store      <dir>/pipeline/<id>.json (one file per doc, as ArtifactData list out_dir writes
               them) and <dir>/pipelineMeta/config.json (or <dir>/config.json)
  --versions   {doc_id: version, "pipelineMeta/config": v, "pipelineMeta/sheetSync": v}
  --now        the run's time, ISO 8601 with a zone (e.g. 2026-11-02T20:27:54.000Z)
  --out        a new or empty directory

Outputs in --out (deterministic for the same inputs):
  batches/batch_NN.json         ArtifactData batch entries {op, collection, doc_id, data, if_version}
  batches/batch_NN.writes.json  the same entries with file_path (batches/data/...) instead of data
  sheetSync_next.json           the new baseline doc body
  report.md, summary.json

Exit codes: 0 plan written (maybe zero writes), 3 safety abort (no batches), 2 bad input.
Standard library only; run with `python3 -I`.
"""
import copy
import datetime
import json
import math
import os
import re
import sys

# ---------------------------------------------------------------- the page's rules (ecx-tracker.html PIPE_*)

TEXT_FIELDS = ["project", "site", "sponsor", "region", "currency", "amount", "amountUsd", "fundingDate",
               "fundingMonth", "status", "fundingAtClose", "ecxLead", "ecxSupport", "description",
               "statusUpdate", "keyIssues", "lendersLead", "lendersOther", "issuesTechnical", "issuesLegal",
               "issuesOther", "tenor", "ltc", "marginFee", "upfrontFee", "capacity"]          # PIPE_TEXT_FIELDS
BULLET_FIELDS = ("statusUpdate", "keyIssues", "issuesTechnical", "issuesLegal", "issuesOther")  # PIPE_BULLET_FIELDS
SECTION_KEYS = ["pipeline", "jvs", "corporate", "misc", "closed", "removed"]                    # PIPE_SECTIONS_DEFAULT
SECTION_LABELS = {"pipeline": "Pipeline", "jvs": "JVs", "corporate": "Corporate", "misc": "Miscellaneous",
                  "closed": "Closed", "removed": "Removed"}
HISTORY_MAX = 40          # PIPE_HISTORY_MAX
HIST_CELL_MAX = 2000      # PIPE_HIST_CELL_MAX
ID_RE = re.compile(r"^[A-Za-z0-9_\-.~:@+]{1,200}$")                                             # PIPE_SEG_RE + PIPE_idOk

# ---------------------------------------------------------------- sync policy

BY = "Excel"
MAX_BATCH_ENTRIES = 40
MAX_BATCH_BYTES = 512 * 1024        # well under ArtifactData's 1 MiB batch body
MAX_ENTRY_BYTES = 900 * 1024
LIMIT_TOUCHED = 25                  # existing rows with applied field / section changes
LIMIT_CREATED = 6
LIMIT_MISSING = 4
RENAME_SHARE = 0.6
REPORT_CELL = 300                   # report.md shortens long values; summary.json keeps them whole

# JavaScript's \s and String.prototype.trim() set (WhiteSpace + LineTerminator).
_JS_WS = "[\t\n\x0b\x0c\r \xa0  -     　﻿]"
_TRIM_RE = re.compile(r"\A" + _JS_WS + r"+|" + _JS_WS + r"+\Z")
_RUN_RE = re.compile(_JS_WS + "+")
_SPLIT = {m: re.compile(r"(?:^|" + _JS_WS + r"+)" + re.escape(m) + _JS_WS + "+") for m in ("x", "-")}
_MARK = {m: re.compile(re.escape(m) + _JS_WS) for m in ("x", "-")}


class InputError(Exception):
    pass


def js_trim(s):
    return _TRIM_RE.sub("", s)


def pipe_str(v):
    """PIPE_str: null -> "", strings as they are, numbers / booleans as JS String() would print them."""
    if v is None:
        return ""
    if isinstance(v, str):
        return v
    if isinstance(v, bool):
        return "true" if v else "false"
    if isinstance(v, int):
        return str(v)
    if isinstance(v, float):
        if math.isnan(v):
            return "NaN"
        if math.isinf(v):
            return "Infinity" if v > 0 else "-Infinity"
        if v.is_integer() and abs(v) < 1e21:
            return str(int(v))
        return repr(v)
    return ""


def pipe_num(v):
    return v if isinstance(v, (int, float)) and not isinstance(v, bool) and math.isfinite(v) else None


def pipe_marker(text):
    t = js_trim(text)
    for m in ("x", "-"):
        if _MARK[m].match(t):
            return m
    return None


def pipe_bullets(text):
    """PIPE_bullets: "x a x b" (or "- a - b") -> ["a", "b"]; anything else is one bullet."""
    t = js_trim(pipe_str(text))
    if not t:
        return []
    m = pipe_marker(t)
    if m is None:
        return [t]
    return [js_trim(p) for p in _SPLIT[m].split(t) if js_trim(p)]


def bullet_key(text):
    return [_RUN_RE.sub(" ", b) for b in pipe_bullets(text)]


def same(field, a, b):
    """Field equality for the merge: bullet fields compare by their bullet lists with whitespace
    normalised (PIPE_sameValue, plus the whitespace rule); every other field compares exactly."""
    if a == b:
        return True
    if field in BULLET_FIELDS:
        return bullet_key(a) == bullet_key(b)
    return False


def _u16len(s):
    return len(s.encode("utf-16-le", "surrogatepass")) // 2


def cap(v):
    """PIPE_cap: at most 2000 UTF-16 units, the last one an ellipsis."""
    s = pipe_str(v)
    if _u16len(s) <= HIST_CELL_MAX:
        return s
    cut = s.encode("utf-16-le", "surrogatepass")[:2 * (HIST_CELL_MAX - 1)]
    return cut.decode("utf-16-le", "ignore") + "…"


_TS_RE = re.compile(r"^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2})(?:\.(\d+))?)?"
                    r"(Z|[+-]\d{2}:?\d{2})?)?$")


def ts_ms(v):
    """Date.parse() for the ISO forms the store holds; 0 when unreadable (PIPE_t)."""
    m = _TS_RE.match(pipe_str(v).strip())
    if not m:
        return 0
    try:
        y, mo, d = int(m.group(1)), int(m.group(2)), int(m.group(3))
        hh, mi, ss = int(m.group(4) or 0), int(m.group(5) or 0), int(m.group(6) or 0)
        frac = (m.group(7) or "0")[:3].ljust(3, "0")
        tz = m.group(8)
        off = 0
        if tz and tz != "Z":
            sign = -1 if tz[0] == "-" else 1
            digits = tz[1:].replace(":", "")
            off = sign * (int(digits[:2]) * 60 + int(digits[2:]))
        t = datetime.datetime(y, mo, d, hh, mi, ss, tzinfo=datetime.timezone.utc)
    except ValueError:
        return 0
    epoch = datetime.datetime(1970, 1, 1, tzinfo=datetime.timezone.utc)
    return int((t - epoch).total_seconds()) * 1000 + int(frac) - off * 60000


def merge_history(new_entries, current):
    """PIPE_saveFields' history: the new lines, then the doc's current lines minus any with the
    same at|by|field as a new one, newest first (stable), capped at 40."""
    seen = set(e["at"] + "|" + e["by"] + "|" + e["field"] for e in new_entries)
    hist = list(new_entries)
    for x in current if isinstance(current, list) else []:
        if not isinstance(x, dict):
            continue
        e = {k: pipe_str(x.get(k)) for k in ("at", "by", "field", "from", "to")}
        if e["at"] + "|" + e["by"] + "|" + e["field"] not in seen:
            hist.append(e)
    hist.sort(key=lambda e: -ts_ms(e["at"]))
    return hist[:HISTORY_MAX]


def clean_doc(doc_id, d):
    """PIPE_clean, for the fields the sync reads."""
    src = d if isinstance(d, dict) else {}
    r = {"id": doc_id}
    for f in TEXT_FIELDS:
        r[f] = pipe_str(src.get(f))
    sec = src.get("section")
    r["section"] = sec if isinstance(sec, str) and sec in SECTION_KEYS else "pipeline"
    r["order"] = pipe_num(src.get("order"))
    r["sheetRow"] = pipe_num(src.get("sheetRow"))
    return r


def cmp_key(r):
    """PIPE_cmp within one section."""
    return (1e9 if r["order"] is None else r["order"], 1e9 if r["sheetRow"] is None else r["sheetRow"], r["id"])


# ---------------------------------------------------------------- time

_NOW_RE = re.compile(r"^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?(Z|[+-]\d{2}:\d{2})$")


def parse_now(s):
    m = _NOW_RE.match(s or "")
    if not m:
        raise InputError("--now must be ISO 8601 with seconds and a zone, e.g. 2026-11-02T20:27:54.000Z; got %r" % s)
    frac = (m.group(7) or "0")[:6].ljust(6, "0")
    tz = m.group(8)
    if tz == "Z":
        tzinfo = datetime.timezone.utc
    else:
        sign = -1 if tz[0] == "-" else 1
        tzinfo = datetime.timezone(sign * datetime.timedelta(hours=int(tz[1:3]), minutes=int(tz[4:6])))
    try:
        t = datetime.datetime(int(m.group(1)), int(m.group(2)), int(m.group(3)), int(m.group(4)),
                              int(m.group(5)), int(m.group(6)), int(frac), tzinfo=tzinfo)
    except ValueError as e:
        raise InputError("--now: %s" % e)
    t = t.astimezone(datetime.timezone.utc)
    return t, t.strftime("%Y-%m-%dT%H:%M:%S.") + "%03dZ" % (t.microsecond // 1000)


def _ny_date_rule(t):
    """US Eastern time by the post-2007 rule (2nd Sunday of March 07:00 UTC .. 1st Sunday of
    November 06:00 UTC is EDT), for hosts without a tz database."""
    y = t.year
    mar1 = datetime.date(y, 3, 1)
    dst_on = mar1 + datetime.timedelta(days=(6 - mar1.weekday()) % 7 + 7)
    nov1 = datetime.date(y, 11, 1)
    dst_off = nov1 + datetime.timedelta(days=(6 - nov1.weekday()) % 7)
    utc = datetime.timezone.utc
    start = datetime.datetime(y, 3, dst_on.day, 7, tzinfo=utc)
    end = datetime.datetime(y, 11, dst_off.day, 6, tzinfo=utc)
    hours = -4 if start <= t < end else -5
    return (t + datetime.timedelta(hours=hours)).date().isoformat()


def ny_date(t):
    try:
        from zoneinfo import ZoneInfo
        return t.astimezone(ZoneInfo("America/New_York")).date().isoformat()
    except Exception:
        return _ny_date_rule(t)


# ---------------------------------------------------------------- inputs

def check_sheet(doc, label):
    if not isinstance(doc, dict) or not isinstance(doc.get("rows"), list) or not isinstance(doc.get("sections"), list):
        raise InputError("%s: expected an object with 'rows' and 'sections' lists" % label)
    seen = set()
    for i, r in enumerate(doc["rows"]):
        if not isinstance(r, dict):
            raise InputError("%s: row %d is not an object" % (label, i))
        rid = r.get("id")
        if not isinstance(rid, str) or not ID_RE.match(rid) or rid in (".", ".."):
            raise InputError("%s: row %d has a bad id %r" % (label, i, rid))
        if rid in seen:
            raise InputError("%s: id %r appears twice" % (label, rid))
        seen.add(rid)
        if r.get("section") not in SECTION_KEYS:
            raise InputError("%s: row %r has an unknown section %r" % (label, rid, r.get("section")))
        for k in ("order", "sheetRow"):
            if not isinstance(r.get(k), int) or isinstance(r.get(k), bool):
                raise InputError("%s: row %r has a non-integer %s" % (label, rid, k))
        for f in TEXT_FIELDS + ["marker"]:
            if f == "marker" and f not in r:
                continue
            if not isinstance(r.get(f), str):
                raise InputError("%s: row %r field %s is not a string" % (label, rid, f))
    for s in doc["sections"]:
        if not isinstance(s, dict) or s.get("key") not in SECTION_KEYS:
            raise InputError("%s: bad section entry %r" % (label, s))
    al = doc.get("aliases", {})
    if al is None:
        al = {}
    if not isinstance(al, dict) or not all(isinstance(k, str) and isinstance(v, str) and ID_RE.match(v)
                                           for k, v in al.items()):
        raise InputError("%s: 'aliases' must map sheet ids to doc ids" % label)


def _ints(doc):
    """A copy with integral floats (16.0) in row positions turned into ints, as a store round trip
    may hand numbers back either way."""
    if not isinstance(doc, dict):
        return doc
    doc = copy.deepcopy(doc)
    for r in doc.get("rows") or []:
        if isinstance(r, dict):
            for k in ("order", "sheetRow"):
                v = r.get(k)
                if isinstance(v, float) and v.is_integer():
                    r[k] = int(v)
    return doc


def sheet_content(doc):
    return {"rows": doc.get("rows"), "sections": doc.get("sections"), "aliases": doc.get("aliases") or {}}


# ---------------------------------------------------------------- the plan

def build_plan(sheet, baseline, store_docs, versions, config, now, bootstrap=False, accept_store_diffs=False):
    """Pure planning. store_docs: {doc_id: body}; versions: {doc_id | "pipelineMeta/...": int};
    config: the pipelineMeta/config body or None. Returns {batches, next_baseline, summary}."""
    sheet, baseline = _ints(sheet), _ints(baseline)
    check_sheet(sheet, "sheet")
    check_sheet(baseline, "bootstrap sheet" if bootstrap else "baseline")
    now_t, now_s = parse_now(now)
    today = ny_date(now_t)
    base_exists = "pipelineMeta/sheetSync" in versions
    if not bootstrap and not base_exists:
        raise InputError("versions.json has no version for pipelineMeta/sheetSync but --baseline was given "
                         "(use --bootstrap when the doc does not exist)")

    aliases_old = dict(baseline.get("aliases") or {})
    base_rows = list(baseline["rows"])
    base_by_id = {b["id"]: b for b in base_rows}

    def docid(b):
        return aliases_old.get(b["id"], b["id"])

    if len(set(docid(b) for b in base_rows)) != len(base_rows):
        raise InputError("baseline: two rows map to the same doc id (aliases)")
    sheet_rows = sorted(sheet["rows"], key=lambda r: r["sheetRow"])
    sheet_by_id = {s["id"]: s for s in sheet_rows}
    store = {i: clean_doc(i, d) for i, d in store_docs.items()}
    claimed = set(docid(b) for b in base_rows)

    changes, conflicts, flags, notes, positions, renames, new_rows_out = [], [], [], [], [], [], []
    abort = []

    def flag(kind, message, doc_id=None, **extra):
        f = {"kind": kind, "message": message}
        if doc_id is not None:
            f["docId"] = doc_id
        f.update(extra)
        flags.append(f)

    # structure: the section list must be the one the baseline knew
    sk = [s["key"] for s in sheet["sections"]]
    bk = [s["key"] for s in baseline["sections"]]
    if sk != bk:
        abort.append("the sheet's sections changed (baseline %s, now %s): looks like a sheet restructure"
                     % ("/".join(bk), "/".join(sk)))
    for w in sheet.get("warnings") or []:
        flag("parse-warning", pipe_str(w))

    # ---- match sheet rows to baseline rows
    match = {}          # sheet id -> (baseline row, kind)
    taken = set()
    fam = {}
    for b in base_rows:
        fam.setdefault(b["project"], []).append(b)
    sheet_fam = {}
    for s in sheet_rows:
        sheet_fam.setdefault((s["project"], s["section"]), []).append(s)
    # Duplicate project names (Mirai / mirai-removed): their ids depend on sheet order, so match
    # them by (name, section) when that is unique on both sides; otherwise by id.
    for s in sheet_rows:
        f = fam.get(s["project"], [])
        if len(f) < 2:
            continue
        cands = [o for o in f if o["section"] == s["section"]]
        if len(cands) == 1 and len(sheet_fam[(s["project"], s["section"])]) == 1 and cands[0]["id"] not in taken:
            match[s["id"]] = (cands[0], "name")
            taken.add(cands[0]["id"])
    for s in sheet_rows:
        if s["id"] in match:
            continue
        b = base_by_id.get(s["id"])
        if b is not None and b["id"] not in taken:
            match[s["id"]] = (b, "id")
            taken.add(b["id"])
    new_rows = [s for s in sheet_rows if s["id"] not in match]
    gone = [b for b in base_rows if b["id"] not in taken]

    # ---- renames: a baseline row gone + a new row in the same section, one-to-one
    def nonempty_share(b, n):
        fields = [f for f in TEXT_FIELDS if f != "project" and js_trim(b[f])]
        if not fields:
            return 0.0
        return sum(1 for f in fields if same(f, b[f], n[f])) / float(len(fields))

    def qualifies(b, n):
        if b["site"] and b["sponsor"] and b["site"] == n["site"] and b["sponsor"] == n["sponsor"]:
            return True
        return nonempty_share(b, n) >= RENAME_SHARE

    pure_new = [n for n in new_rows if n["id"] not in store and n["id"] not in claimed]
    gone_live = [b for b in gone if docid(b) in store]
    qual = {b["id"]: [n["id"] for n in pure_new if n["section"] == b["section"] and qualifies(b, n)]
            for b in gone_live}
    rev = {}
    for bid, ns in qual.items():
        for nid in ns:
            rev.setdefault(nid, []).append(bid)
    renamed_b, renamed_n = set(), set()
    for b in gone_live:
        ns = qual[b["id"]]
        if len(ns) == 1 and len(rev[ns[0]]) == 1:
            n = sheet_by_id[ns[0]]
            match[n["id"]] = (b, "rename")
            renamed_b.add(b["id"])
            renamed_n.add(n["id"])
            renames.append({"docId": docid(b), "sheetId": n["id"], "from": b["project"], "to": n["project"],
                            "section": n["section"]})
        elif ns:
            others = sorted(set(x for nid in ns for x in rev[nid]))
            flag("rename-ambiguous",
                 "%r disappeared from the Excel and %s could be its new name (candidates for the same rows: %s); "
                 "not treated as a rename: the old row is flagged as removed and the new row(s) are added - "
                 "merge them in the tracker if they are the same deal"
                 % (b["project"], " / ".join(repr(sheet_by_id[x]["project"]) for x in ns), ", ".join(others)),
                 docid(b), candidates=ns)

    # ---- new rows, collisions
    creates = []
    for n in new_rows:
        if n["id"] in renamed_n:
            continue
        if n["id"] in claimed:
            flag("collision", "new Excel row %r has id %r, which already belongs to another Excel row's doc; "
                 "not written" % (n["project"], n["id"]), n["id"])
            continue
        if n["id"] in store:
            d = store[n["id"]]
            raw_hist = store_docs[n["id"]].get("history") if isinstance(store_docs[n["id"]], dict) else None
            by_excel = any(isinstance(x, dict) and x.get("field") == "created" and x.get("by") == BY
                           for x in (raw_hist if isinstance(raw_hist, list) else []))
            if by_excel and all(same(f, d[f], n[f]) for f in TEXT_FIELDS):
                match[n["id"]] = (n, "adopt")
                notes.append("%s: already created by an earlier Excel sync with the same values; linked" % n["id"])
                continue
            flag("collision", "new Excel row %r maps to id %r, but the tracker already has a deal with that id "
                 "(created in the tracker); not written - check whether they are the same deal"
                 % (n["project"], n["id"]), n["id"])
            continue
        creates.append(n)

    # ---- rows missing from the sheet
    missing = []
    for b in gone:
        if b["id"] in renamed_b:
            continue
        did = docid(b)
        if did in store:
            missing.append(did)
            flag("missing", "%r (%s) is no longer in the Excel; it is still in the tracker (%s) - remove it in the "
                 "tracker if intended" % (b["project"], did, SECTION_LABELS.get(store[did]["section"])), did)
        else:
            notes.append("%s: removed from the Excel and not in the tracker either" % did)

    pairs = sorted(((sheet_by_id[sid], b, kind) for sid, (b, kind) in match.items()), key=lambda p: p[0]["sheetRow"])

    # ---- reorder analysis per section
    sheet_doc = {}
    for s, b, kind in pairs:
        sheet_doc[s["id"]] = s["id"] if kind == "adopt" else docid(b)
    reordered, excel_moved = {}, {}
    for key in SECTION_KEYS:
        seq = [docid(b) for b in sorted((b for b in base_rows if b["section"] == key),
                                        key=lambda b: (b["order"], b["sheetRow"]))]
        live = [i for i in seq if i in store and store[i]["section"] == key]
        reordered[key] = live != [r["id"] for r in sorted((store[i] for i in live), key=cmp_key)]
        now_seq = [(sheet_doc.get(s["id"], s["id"]), s["order"]) for s in sheet_rows if s["section"] == key]
        was_seq = [(docid(b), b["order"]) for b in base_rows if b["section"] == key]
        excel_moved[key] = now_seq != was_seq
        if reordered[key] and excel_moved[key]:
            flag("reordered", "section %s reordered in the tracker; Excel order not applied" % SECTION_LABELS[key],
                 section=key)

    # ---- per-row merge
    out = []            # (sheetRow, entry)
    touched = 0
    for s, b, kind in pairs:
        did = s["id"] if kind == "adopt" else docid(b)
        if did not in store:
            diff = [f for f in TEXT_FIELDS if not same(f, s[f], b[f])] + (["section"] if s["section"] != b["section"] else [])
            if diff:
                flag("deleted-in-tracker", "%r changed in the Excel (%s) but the deal was deleted in the tracker; "
                     "not re-created" % (s["project"], ", ".join(diff)), did)
            else:
                notes.append("%s: in the Excel but deleted in the tracker; not re-created" % did)
            continue
        d = store[did]
        raw = store_docs[did] if isinstance(store_docs[did], dict) else {}
        applied = []
        for f in TEXT_FIELDS:
            bv, sv, tv = b[f], s[f], d[f]
            if same(f, sv, bv) or same(f, tv, sv):
                continue
            if same(f, tv, bv):
                applied.append(f)
                changes.append({"docId": did, "field": f, "from": tv, "to": sv})
            else:
                conflicts.append({"docId": did, "field": f, "base": bv, "sheet": sv, "store": tv})
        moved = False
        if s["section"] != b["section"] and d["section"] != s["section"]:
            if d["section"] == b["section"]:
                moved = True
                changes.append({"docId": did, "field": "section", "from": d["section"], "to": s["section"]})
            else:
                conflicts.append({"docId": did, "field": "section", "base": b["section"], "sheet": s["section"],
                                  "store": d["section"]})
        patch = {}
        for f in applied:
            patch[f] = s[f]
        if moved:
            patch["section"] = s["section"]
        pos = {}
        if moved or (d["section"] == s["section"] and not reordered[s["section"]]):
            if d["order"] != s["order"]:
                pos["order"] = s["order"]
        if d["sheetRow"] != s["sheetRow"]:
            pos["sheetRow"] = s["sheetRow"]
        if moved and "order" in pos:
            patch["order"] = pos.pop("order")
        patch.update(pos)
        if pos:
            positions.append(dict({"docId": did}, **pos))
        if applied or moved:
            touched += 1
            hist = [{"at": now_s, "by": BY, "field": f, "from": cap(raw.get(f)), "to": cap(s[f])} for f in applied]
            if moved:
                hist.append({"at": now_s, "by": BY, "field": "section", "from": cap(raw.get("section")),
                             "to": s["section"]})
            patch["updatedAt"] = now_s
            patch["updatedBy"] = BY
            patch["history"] = merge_history(hist, raw.get("history"))
        if patch:
            out.append((s["sheetRow"], {"op": "update", "collection": "pipeline", "doc_id": did, "data": patch,
                                        "if_version": versions.get(did)}))

    for n in creates:
        body = {f: n[f] for f in TEXT_FIELDS}
        st = js_trim(n["status"]).lower()
        body.update({"section": n["section"], "order": n["order"], "sheetRow": n["sheetRow"], "trackerProject": None,
                     "marker": n.get("marker", ""), "stage": "launch" if st == "kick-off" else "",
                     "paused": st == "paused", "updatedAt": now_s, "updatedBy": BY,
                     "history": [{"at": now_s, "by": BY, "field": "created", "from": "", "to": cap(n["project"])}]})
        out.append((n["sheetRow"], {"op": "set", "collection": "pipeline", "doc_id": n["id"], "data": body}))
        new_rows_out.append(n["id"])
    out.sort(key=lambda x: x[0])
    entries = [e for _, e in out]

    # ---- safety limits and versions
    if touched > LIMIT_TOUCHED:
        abort.append("the plan would change fields on %d rows (limit %d)" % (touched, LIMIT_TOUCHED))
    if len(creates) > LIMIT_CREATED:
        abort.append("the plan would create %d rows (limit %d)" % (len(creates), LIMIT_CREATED))
    if len(missing) > LIMIT_MISSING:
        abort.append("%d rows are missing from the Excel (limit %d)" % (len(missing), LIMIT_MISSING))
    for e in entries:
        if e["op"] == "update" and not _is_version(e["if_version"]):
            abort.append("versions.json has no integer version for pipeline/%s" % e["doc_id"])
        if e["op"] == "set" and e["doc_id"] in versions:
            abort.append("versions.json lists pipeline/%s but the store has no file for it" % e["doc_id"])
    bootstrap_diffs = []
    if bootstrap:
        for b in base_rows:
            did = docid(b)
            if did not in store:
                bootstrap_diffs.append({"docId": did, "field": None, "sheet": b["project"], "store": None})
                continue
            for f in TEXT_FIELDS:
                if not same(f, store[did][f], b[f]):
                    bootstrap_diffs.append({"docId": did, "field": f, "sheet": b[f], "store": store[did][f]})
        if bootstrap_diffs and not accept_store_diffs:
            abort.append("bootstrap: the store has %d text difference(s) against the bootstrap sheet; report them "
                         "and ask before adopting it as the baseline" % len(bootstrap_diffs))

    # ---- config and baseline
    next_baseline = {"syncedAt": now_s, "readAt": sheet.get("readAt"), "sheetDate": sheet.get("sheetDate"),
                     "sections": sheet["sections"], "rows": sheet["rows"], "aliases": {},
                     "warnings": list(sheet.get("warnings") or [])}
    for s, b, kind in pairs:
        did = s["id"] if kind == "adopt" else docid(b)
        if did != s["id"]:
            next_baseline["aliases"][s["id"]] = did
    advanced = sheet_content(next_baseline) != sheet_content(baseline)
    tail = []
    as_of = None
    if entries or advanced:
        if config is None:
            flag("config", "pipelineMeta/config not found; asOf not updated")
        elif pipe_str(config.get("asOf")) != today:
            as_of = today
            if not _is_version(versions.get("pipelineMeta/config")):
                abort.append("versions.json has no integer version for pipelineMeta/config")
            tail.append({"op": "update", "collection": "pipelineMeta", "doc_id": "config", "data": {"asOf": today},
                         "if_version": versions.get("pipelineMeta/config")})
    write_base = (not base_exists) or advanced or bool(entries) or bool(tail)
    if write_base:
        if base_exists:
            if not _is_version(versions.get("pipelineMeta/sheetSync")):
                abort.append("versions.json has a bad version for pipelineMeta/sheetSync")
            tail.append({"op": "update", "collection": "pipelineMeta", "doc_id": "sheetSync", "data": next_baseline,
                         "if_version": versions.get("pipelineMeta/sheetSync")})
        else:
            tail.append({"op": "set", "collection": "pipelineMeta", "doc_id": "sheetSync", "data": next_baseline})

    groups = [[e] for e in entries] + ([tail] if tail else [])
    for g in groups:
        for e in g:
            if _size(e) > MAX_ENTRY_BYTES:
                abort.append("the write to %s/%s is %d bytes (limit %d)" % (e["collection"], e["doc_id"], _size(e),
                                                                           MAX_ENTRY_BYTES))
    if abort:
        groups = []
    batches = pack(groups)
    all_entries = [e for b in batches for e in b]
    summary = {
        "now": now_s, "asOfDate": today, "changes": changes, "newRows": new_rows_out, "conflicts": conflicts,
        "flags": flags, "renames": renames, "positions": positions, "notes": notes,
        "touched": touched, "created": len(creates), "missing": len(missing),
        "writes": len(all_entries), "batches": len(batches),
        "configAsOf": as_of if not abort else None, "baselineWritten": bool(write_base and not abort),
        "bootstrap": bool(bootstrap), "bootstrapDiffs": bootstrap_diffs,
        "abort": "; ".join(abort) if abort else None,
    }
    return {"batches": batches, "next_baseline": next_baseline, "summary": summary}


def _is_version(v):
    return isinstance(v, int) and not isinstance(v, bool) and v >= 1


def _size(e):
    return len(json.dumps(e, ensure_ascii=False, separators=(",", ":")).encode("utf-8"))


def pack(groups):
    """Split into batches of <= 40 entries and <= 512 KiB; a group (config + baseline) stays together,
    so the baseline doc is always the last entry of the last batch."""
    batches, cur, size = [], [], 2
    for g in groups:
        gs = sum(_size(e) + 1 for e in g)
        if cur and (len(cur) + len(g) > MAX_BATCH_ENTRIES or size + gs > MAX_BATCH_BYTES):
            batches.append(cur)
            cur, size = [], 2
        cur.extend(g)
        size += gs
    if cur:
        batches.append(cur)
    return batches


# ---------------------------------------------------------------- report

def _short(v, n=REPORT_CELL):
    s = pipe_str(v).replace("\n", " ↵ ")
    return s if len(s) <= n else s[:n - 1] + "…"


def _md(v):
    s = _short(v)
    return "“" + s.replace("|", "\\|") + "”" if s else "(empty)"


def render_report(summary, sheet, baseline_label):
    s = summary
    L = ["# CF Pipeline sync plan", "",
         "- Planned at: %s (asOf date %s, America/New_York)" % (s["now"], s["asOfDate"]),
         "- Sheet read at: %s; sheet date cell: %s" % (sheet.get("readAt"), sheet.get("sheetDate")),
         "- Baseline: %s" % baseline_label,
         "- Result: **%s**" % ("ABORTED - nothing to write" if s["abort"] else
                               "%d write(s) in %d batch(es)" % (s["writes"], s["batches"]) if s["writes"] else
                               "nothing to write"),
         "- Field changes applied: %d on %d row(s); new rows: %d; renames: %d; position updates: %d; "
         "conflicts: %d; flags: %d" % (len(s["changes"]), s["touched"], len(s["newRows"]), len(s["renames"]),
                                       len(s["positions"]), len(s["conflicts"]), len(s["flags"])), ""]
    if s["abort"]:
        L += ["## Aborted", "", s["abort"], "",
              "No batches were written. This usually means a sheet restructure or a parse problem; a human "
              "needs to look before anything is synced.", ""]
    if s["changes"]:
        L += ["## Changes from the Excel" + (" (not written: aborted)" if s["abort"] else ""), ""]
        for c in s["changes"]:
            L.append("- `%s` %s: %s → %s" % (c["docId"], c["field"], _md(c["from"]), _md(c["to"])))
        L.append("")
    if s["renames"]:
        L += ["## Renames", ""]
        for r in s["renames"]:
            L.append("- `%s`: %s → %s (Excel id `%s`; the tracker doc keeps its id)" % (
                r["docId"], _md(r["from"]), _md(r["to"]), r["sheetId"]))
        L.append("")
    if s["newRows"]:
        by_id = {r.get("id"): r for r in sheet.get("rows") or []}
        L += ["## New rows", ""]
        for i in s["newRows"]:
            r = by_id.get(i, {})
            L.append("- `%s`: %s (%s, Excel row %s; status %s)" % (i, _md(r.get("project")), SECTION_LABELS.get(
                r.get("section"), r.get("section")), r.get("sheetRow"), _md(r.get("status"))))
        L.append("")
    if s["conflicts"]:
        L += ["## Conflicts (the tracker wins; not written)", ""]
        for c in s["conflicts"]:
            L.append("- `%s` %s: Excel was %s, Excel now %s, tracker has %s" % (
                c["docId"], c["field"], _md(c["base"]), _md(c["sheet"]), _md(c["store"])))
        L.append("")
    if s["flags"]:
        L += ["## Flags", ""] + ["- [%s] %s" % (f["kind"], f["message"]) for f in s["flags"]] + [""]
    if s["positions"]:
        L += ["## Positions (housekeeping: order / sheetRow; no history lines)", ""]
        L += ["- `%s` %s" % (p["docId"], ", ".join("%s %s" % (k, p[k]) for k in ("order", "sheetRow") if k in p))
              for p in s["positions"]] + [""]
    if s["configAsOf"]:
        L += ["pipelineMeta/config asOf → %s" % s["configAsOf"], ""]
    if s["bootstrap"]:
        L += ["## Bootstrap differences (store vs bootstrap sheet)", ""]
        if s["bootstrapDiffs"]:
            for dif in s["bootstrapDiffs"]:
                if dif["field"] is None:
                    L.append("- `%s`: in the sheet, not in the store" % dif["docId"])
                else:
                    L.append("- `%s` %s: sheet %s, store %s" % (dif["docId"], dif["field"], _md(dif["sheet"]),
                                                                _md(dif["store"])))
        else:
            L.append("- none")
        L.append("")
    if s["notes"]:
        L += ["## Notes", ""] + ["- " + n for n in s["notes"]] + [""]
    return "\n".join(L)


# ---------------------------------------------------------------- CLI

def load_json(path, what):
    try:
        with open(path, encoding="utf-8") as fh:
            return json.load(fh)
    except (OSError, ValueError) as e:
        raise InputError("cannot read %s %s: %s" % (what, path, e))


def load_store(d):
    pdir = os.path.join(d, "pipeline")
    if not os.path.isdir(pdir):
        raise InputError("store: %s does not exist" % pdir)
    docs = {}
    for name in sorted(os.listdir(pdir)):
        if not name.endswith(".json"):
            continue
        did = name[:-5]
        if not ID_RE.match(did):
            raise InputError("store: bad doc file name %r" % name)
        body = load_json(os.path.join(pdir, name), "store doc")
        if not isinstance(body, dict):
            raise InputError("store: %s is not a JSON object" % name)
        docs[did] = body
    config = None
    for p in (os.path.join(d, "pipelineMeta", "config.json"), os.path.join(d, "config.json")):
        if os.path.isfile(p):
            config = load_json(p, "config")
            if not isinstance(config, dict):
                raise InputError("config %s is not a JSON object" % p)
            break
    return docs, config


def parse_args(argv):
    opts = {"accept": False}
    keys = {"--sheet": "sheet", "--baseline": "baseline", "--bootstrap": "bootstrap", "--store": "store",
            "--versions": "versions", "--now": "now", "--out": "out"}
    i = 0
    while i < len(argv):
        a = argv[i]
        if a == "--accept-store-diffs":
            opts["accept"] = True
            i += 1
            continue
        if a not in keys or i + 1 >= len(argv):
            raise InputError("bad argument %r" % a)
        opts[keys[a]] = argv[i + 1]
        i += 2
    for k in ("sheet", "store", "versions", "now", "out"):
        if k not in opts:
            raise InputError("missing --%s" % k)
    if ("baseline" in opts) == ("bootstrap" in opts):
        raise InputError("give exactly one of --baseline and --bootstrap")
    if opts["accept"] and "bootstrap" not in opts:
        raise InputError("--accept-store-diffs only goes with --bootstrap")
    return opts


def write_outputs(out, plan, report):
    bdir = os.path.join(out, "batches")
    ddir = os.path.join(bdir, "data")
    os.makedirs(ddir, exist_ok=True)
    out_abs = os.path.abspath(out)

    def dump(path, obj):
        with open(path, "w", encoding="utf-8") as fh:
            json.dump(obj, fh, ensure_ascii=False, indent=1)
            fh.write("\n")

    for bi, batch in enumerate(plan["batches"], 1):
        dump(os.path.join(bdir, "batch_%02d.json" % bi), batch)
        refs = []
        for ei, e in enumerate(batch, 1):
            name = "b%02d_e%02d_%s__%s.json" % (bi, ei, e["collection"], e["doc_id"])
            dump(os.path.join(ddir, name), e["data"])
            r = {"op": e["op"], "collection": e["collection"], "doc_id": e["doc_id"],
                 "file_path": os.path.join(out_abs, "batches", "data", name)}
            if "if_version" in e:
                r["if_version"] = e["if_version"]
            refs.append(r)
        dump(os.path.join(bdir, "batch_%02d.writes.json" % bi), refs)
    dump(os.path.join(out, "sheetSync_next.json"), plan["next_baseline"])
    dump(os.path.join(out, "summary.json"), plan["summary"])
    with open(os.path.join(out, "report.md"), "w", encoding="utf-8") as fh:
        fh.write(report + "\n")


def main(argv):
    try:
        o = parse_args(argv)
        if os.path.exists(o["out"]) and (not os.path.isdir(o["out"]) or os.listdir(o["out"])):
            raise InputError("--out %s must be a new or empty directory" % o["out"])
        sheet = load_json(o["sheet"], "sheet")
        if "bootstrap" in o:
            baseline = load_json(o["bootstrap"], "bootstrap sheet")
            label = "bootstrap from %s" % o["bootstrap"]
        else:
            baseline = load_json(o["baseline"], "baseline")
            label = "pipelineMeta/sheetSync (synced %s)" % (baseline.get("syncedAt") if isinstance(baseline, dict) else "?")
        docs, config = load_store(o["store"])
        versions = load_json(o["versions"], "versions")
        if not isinstance(versions, dict):
            raise InputError("versions.json must be an object")
        plan = build_plan(sheet, baseline, docs, versions, config, o["now"],
                          bootstrap="bootstrap" in o, accept_store_diffs=o["accept"])
    except InputError as e:
        sys.stderr.write("PLAN ERROR: %s\n" % e)
        return 2
    report = render_report(plan["summary"], sheet, label)
    os.makedirs(o["out"], exist_ok=True)
    write_outputs(o["out"], plan, report)
    s = plan["summary"]
    print("%s: %d write(s) in %d batch(es); %d change(s), %d new row(s), %d conflict(s), %d flag(s)" % (
        "ABORT" if s["abort"] else "ok", s["writes"], s["batches"], len(s["changes"]), len(s["newRows"]),
        len(s["conflicts"]), len(s["flags"])))
    if s["abort"]:
        print("abort: " + s["abort"])
        return 3
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
