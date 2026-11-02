"""Real-data replay: the 10/29 sheet as the baseline, the pre-sync store of 11/2 and the 11/2 sheet
must give exactly the first sync that was made by hand on 11/2/26; re-planning after it gives
zero writes.

Fixtures (tests/fixtures): the "Pipeline (transactions)" block of the two workbook dumps, the
pre-sync store (replay_1102/store_pre: docs, config, versions) and the manual writes
(replay_1102/writes_1102.json). When the original scratchpad copies are on this machine the
tests also check the fixtures against them, and use the real post-sync store."""
import copy
import glob
import json
import os
import tempfile
import unittest

from synth import FIXTURES, Store, dump, entries, fixture_text, load, parse_sheet, plan_sync, run_tool

TF = plan_sync.TEXT_FIELDS
SCRATCH = "/tmp/claude-0/-home-user-ECXCapMarkets/e34b41c2-2c1f-598a-a116-f36c85048c26/scratchpad"
ORIG = {
    "pipeline_json": SCRATCH + "/pipeline/normalise/pipeline.json",
    "store_1102": SCRATCH + "/sheetsync/store_1102",
    "store_post": SCRATCH + "/sheetsync/store_post",
    "writes": SCRATCH + "/sheetsync/writes_1102.json",
    "dump_1102": SCRATCH + "/sheetsync/dump_1102/dump.txt",
    "dump_1029": "/root/.claude/projects/-home-user-ECXCapMarkets/e34b41c2-2c1f-598a-a116-f36c85048c26/tool-results/"
                 "mcp-Microsoft_365-read_resource-1793293728509.txt",
}
MANUAL_NOW = "2026-11-02T20:27:54.000Z"     # the manual sync's timestamp
OTHER_NOW = "2026-11-02T21:05:00.000Z"
REPLAY = os.path.join(FIXTURES, "replay_1102")


def read_store(d):
    docs = {os.path.basename(p)[:-5]: load(p) for p in glob.glob(os.path.join(d, "pipeline", "*.json"))}
    return docs, load(os.path.join(d, "pipelineMeta", "config.json")), load(os.path.join(d, "versions.json"))


def strip_times(obj):
    obj = copy.deepcopy(obj)
    for e in obj:
        d = e.get("data", {})
        for k in ("updatedAt", "syncedAt"):
            d.pop(k, None)
        for h in d.get("history", []) if isinstance(d.get("history"), list) else []:
            h.pop("at", None)
    return obj


class Replay(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.s1029 = parse_sheet.parse_text(fixture_text("sheet_2026-10-29.txt"), "2026-10-29T17:00:00.000Z")
        cls.s1102 = parse_sheet.parse_text(fixture_text("sheet_2026-11-02.txt"), "2026-11-02T20:20:00.000Z")
        docs, config, versions = read_store(os.path.join(REPLAY, "store_pre"))
        cls.pre = Store(docs, config=config, versions=versions)
        cls.writes = load(os.path.join(REPLAY, "writes_1102.json"))

    def first_sync(self, now=MANUAL_NOW):
        st = copy.deepcopy(self.pre)
        return st, st.plan(self.s1102, now=now, bootstrap=self.s1029, accept=True)

    def test_parse_1029_matches_the_seeded_rows(self):
        keys = ["id", "section", "order", "sheetRow", "marker"] + TF
        got = [{k: r[k] for k in keys} for r in self.s1029["rows"]]
        self.assertEqual(len(got), 36)
        self.assertEqual(got, load(os.path.join(FIXTURES, "expected_rows_2026-10-29.json")))
        if os.path.exists(ORIG["pipeline_json"]):
            ref = load(ORIG["pipeline_json"])["rows"]
            self.assertEqual(got, [{k: r[k] for k in keys} for r in ref])

    def test_store_pre_equals_the_seed_except_salar(self):
        docs = self.pre.docs
        diffs = [(r["id"], f) for r in self.s1029["rows"] for f in TF if docs[r["id"]][f] != r[f]]
        self.assertEqual(diffs, [("salar", "statusUpdate"), ("salar", "lendersOther")])

    def test_first_sync_reproduces_the_manual_one_exactly(self):
        st, p = self.first_sync()
        self.assertIsNone(p["summary"]["abort"])
        self.assertEqual(len(p["batches"]), 1)
        got = p["batches"][0]
        self.assertEqual(got[:-1], self.writes)                       # identical, timestamps included
        last = got[-1]
        self.assertEqual((last["op"], last["collection"], last["doc_id"]), ("set", "pipelineMeta", "sheetSync"))
        self.assertNotIn("if_version", last)
        self.assertEqual(last["data"]["rows"], self.s1102["rows"])
        self.assertEqual(last["data"]["sections"], self.s1102["sections"])
        self.assertEqual(last["data"]["aliases"], {})
        self.assertEqual(last["data"]["syncedAt"], MANUAL_NOW)
        s = p["summary"]
        self.assertEqual((s["changes"], s["conflicts"], s["flags"], s["newRows"]), ([], [], [], ["gotham-refi"]))
        self.assertEqual(len(s["positions"]), 28)
        self.assertEqual(sum(1 for x in s["positions"] if "order" in x), 14)
        self.assertEqual(len(s["bootstrapDiffs"]), 2)

    def test_first_sync_at_another_time_differs_only_in_timestamps(self):
        st, p = self.first_sync(OTHER_NOW)
        got = p["batches"][0]
        self.assertEqual(strip_times(got[:-1]), strip_times(self.writes))
        self.assertEqual(got[0]["data"]["updatedAt"], OTHER_NOW)

    def test_zero_text_field_writes_and_salar_preserved(self):
        st, p = self.first_sync()
        for e in entries(p):
            if e["collection"] == "pipeline" and e["op"] == "update":
                self.assertTrue(set(e["data"]) <= {"order", "sheetRow"}, e)
        self.assertEqual(next(e for e in entries(p) if e["doc_id"] == "salar")["data"], {"order": 15, "sheetRow": 22})
        st.apply(p["batches"])
        self.assertEqual(st.docs["salar"]["statusUpdate"], self.pre.docs["salar"]["statusUpdate"])
        self.assertEqual(st.docs["salar"]["lendersOther"], self.pre.docs["salar"]["lendersOther"])
        self.assertEqual(st.docs["salar"]["history"], self.pre.docs["salar"]["history"])

    def test_strict_bootstrap_stops_on_salar(self):
        st = copy.deepcopy(self.pre)
        p = st.plan(self.s1102, now=MANUAL_NOW, bootstrap=self.s1029)
        self.assertEqual(p["batches"], [])
        self.assertIn("bootstrap", p["summary"]["abort"])

    def test_applied_store_equals_the_post_sync_store_and_replans_to_zero(self):
        st, p = self.first_sync()
        st.apply(p["batches"])
        stores = [("simulated", st)]
        if os.path.isdir(ORIG["store_post"]):
            docs, config, versions = read_store(ORIG["store_post"])
            self.assertEqual(st.docs, docs)
            self.assertEqual(st.config, config)
            self.assertEqual({k: v for k, v in st.versions.items() if k != "pipelineMeta/sheetSync"}, versions)
            real = Store(docs, config=config, sheet_sync=st.sheet_sync,
                         versions=dict(versions, **{"pipelineMeta/sheetSync": 1}))
            stores.append(("store_post", real))
        for name, store in stores:
            again = store.plan(self.s1102, now="2026-11-02T21:30:00.000Z")
            self.assertEqual(entries(again), [], name)
            self.assertEqual(again["summary"]["flags"], [], name)
        # bootstrapping the live (post-sync) store from the 11/2 sheet writes only the baseline doc
        st2 = copy.deepcopy(st)
        st2.sheet_sync = None
        del st2.versions["pipelineMeta/sheetSync"]
        # RUNBOOK one-time setup, step 3: the plain bootstrap stops on exactly Salar's two tracker edits
        strict = st2.plan(self.s1102, now="2026-11-02T21:30:00.000Z", bootstrap=self.s1102)
        self.assertEqual(strict["batches"], [])
        self.assertIn("one-time setup", strict["summary"]["abort"])
        self.assertEqual([(x["docId"], x["field"]) for x in strict["summary"]["bootstrapDiffs"]],
                         [("salar", "statusUpdate"), ("salar", "lendersOther")])
        boot = st2.plan(self.s1102, now="2026-11-02T21:30:00.000Z", bootstrap=self.s1102, accept=True)
        self.assertEqual([(e["op"], e["doc_id"]) for e in entries(boot)], [("set", "sheetSync")])

    def test_cli_replay(self):
        with tempfile.TemporaryDirectory() as d:
            for name, out in (("sheet_2026-10-29.txt", "p1029.json"), ("sheet_2026-11-02.txt", "p1102.json")):
                code, so, se = run_tool("parse_sheet.py", os.path.join(FIXTURES, name), os.path.join(d, out),
                                        "--read-at", "2026-11-02T20:20:00.000Z")
                self.assertEqual(code, 0, se)
            store = os.path.join(REPLAY, "store_pre")
            code, so, se = run_tool("plan_sync.py", "--sheet", os.path.join(d, "p1102.json"),
                                    "--bootstrap", os.path.join(d, "p1029.json"), "--accept-store-diffs",
                                    "--store", store, "--versions", os.path.join(store, "versions.json"),
                                    "--now", MANUAL_NOW, "--out", os.path.join(d, "plan"))
            self.assertEqual(code, 0, so + se)
            b = load(os.path.join(d, "plan", "batches", "batch_01.json"))
            self.assertEqual(b[:-1], self.writes)
            self.assertFalse(os.path.exists(os.path.join(d, "plan", "batches", "batch_02.json")))
            # second run: the store after the writes, baseline = sheetSync_next.json
            st, p = self.first_sync()
            st.apply(p["batches"])
            st.write(os.path.join(d, "post"))
            self.assertEqual(load(os.path.join(d, "plan", "sheetSync_next.json"))["rows"], st.sheet_sync["rows"])
            code, so, se = run_tool("plan_sync.py", "--sheet", os.path.join(d, "p1102.json"),
                                    "--baseline", os.path.join(d, "post", "pipelineMeta", "sheetSync.json"),
                                    "--store", os.path.join(d, "post"),
                                    "--versions", os.path.join(d, "post", "versions.json"),
                                    "--now", "2026-11-02T21:30:00.000Z", "--out", os.path.join(d, "plan2"))
            self.assertEqual(code, 0, so + se)
            self.assertEqual(load(os.path.join(d, "plan2", "summary.json"))["writes"], 0)
            self.assertEqual(os.listdir(os.path.join(d, "plan2", "batches", "data")), [])


class RealMiraiMoves(unittest.TestCase):
    """The two real "Project Mirai" rows share most of their cells (the Removed one shares 62% of the
    live one's), and their ids depend on which comes first in the sheet. Moving one past the other
    must move that deal only, and undoing the move must undo only that."""
    KY, K = "\tProject Mirai\tKyotonabe + Yawata\t", "\tProject Mirai\tKyotonabe\t"

    @classmethod
    def setUpClass(cls):
        cls.text = fixture_text("sheet_2026-11-02.txt")
        cls.s1102 = parse_sheet.parse_text(cls.text, "2026-11-02T20:20:00.000Z")
        docs, config, versions = read_store(os.path.join(REPLAY, "store_pre"))
        st = Store(docs, config=config, versions=versions)
        s1029 = parse_sheet.parse_text(fixture_text("sheet_2026-10-29.txt"), "2026-10-29T17:00:00.000Z")
        st.apply(st.plan(cls.s1102, now=MANUAL_NOW, bootstrap=s1029, accept=True)["batches"])
        cls.post = st

    def moved(self, src, dst, below):
        lines = self.text.split("\n")
        line = lines.pop(next(i for i, x in enumerate(lines) if src in x))
        j = next(i for i, x in enumerate(lines) if dst in x)
        lines.insert(j + 1 if below else j, line)
        return parse_sheet.parse_text("\n".join(lines), "2026-11-03T15:00:00.000Z")

    def check(self, sh, moved_doc, now):
        st = self.post
        before = copy.deepcopy(st.docs)
        p = st.plan(sh, now=now)
        s = p["summary"]
        self.assertEqual((s["newRows"], s["flags"], s["conflicts"]), ([], [], []))
        self.assertEqual([(c["docId"], c["field"]) for c in s["changes"]], [(moved_doc, "section")])
        st.apply(p["batches"])
        for did in ("mirai", "mirai-removed"):
            for f in TF:
                self.assertEqual(st.docs[did][f], before[did][f], (did, f))     # no deal written into the other
        self.assertEqual(entries(st.plan(sh, now=now.replace("T15:", "T16:"))), [])

    def test_removed_mirai_revived_above_the_live_one(self):
        self.post = copy.deepcopy(self.post)
        sh = self.moved(self.K, self.KY, below=False)      # its id is now "mirai", the live one's "mirai-pipeline"
        self.assertEqual([(r["id"], r["site"]) for r in sh["rows"] if r["project"] == "Project Mirai"],
                         [("mirai", "Kyotonabe"), ("mirai-pipeline", "Kyotonabe + Yawata")])
        self.check(sh, "mirai-removed", "2026-11-03T15:05:00.000Z")
        self.assertEqual(self.post.docs["mirai-removed"]["section"], "pipeline")
        self.check(self.s1102, "mirai-removed", "2026-11-04T15:05:00.000Z")       # and back

    def test_live_mirai_moved_below_the_removed_one_and_back(self):
        self.post = copy.deepcopy(self.post)
        sh = self.moved(self.KY, self.K, below=True)       # the ids of the two rows swap
        self.check(sh, "mirai", "2026-11-03T15:05:00.000Z")
        self.assertEqual(self.post.sheet_sync["aliases"], {"mirai": "mirai-removed", "mirai-removed": "mirai"})
        self.check(self.s1102, "mirai", "2026-11-04T15:05:00.000Z")               # the undo used to overwrite doc mirai
        self.assertEqual(self.post.docs["mirai"]["section"], "pipeline")
        self.assertEqual(self.post.sheet_sync["aliases"], {})


class FixtureProvenance(unittest.TestCase):
    """The committed fixtures are exact extracts of the originals (checked when they are here)."""

    def block(self, path):
        with open(path, encoding="utf-8") as fh:
            lines = fh.read().split("\n")
        s, e = parse_sheet.find_block(lines)
        block = lines[s:e]
        while block and block[-1] == "":
            block.pop()
        return "\n".join(block) + "\n"

    def test_sheet_fixtures(self):
        for key, name in (("dump_1029", "sheet_2026-10-29.txt"), ("dump_1102", "sheet_2026-11-02.txt")):
            if not os.path.exists(ORIG[key]):
                self.skipTest("original dump not on this machine")
            self.assertEqual(self.block(ORIG[key]), fixture_text(name))
            with open(ORIG[key], encoding="utf-8") as fh:
                full = parse_sheet.parse_text(fh.read(), "x")
            self.assertEqual(full, parse_sheet.parse_text(fixture_text(name), "x"))

    def test_store_and_writes_fixtures(self):
        if not os.path.isdir(ORIG["store_1102"]):
            self.skipTest("original store snapshot not on this machine")
        self.assertEqual(read_store(ORIG["store_1102"]), read_store(os.path.join(REPLAY, "store_pre")))
        self.assertEqual(load(ORIG["writes"]), load(os.path.join(REPLAY, "writes_1102.json")))


if __name__ == "__main__":
    unittest.main()
