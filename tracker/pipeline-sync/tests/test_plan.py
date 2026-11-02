"""plan_sync.py on synthetic scenarios: one test per rule of the spec, each re-planned after
its writes are applied (idempotency)."""
import copy
import datetime
import os
import tempfile
import unittest

from synth import (NOW, NOW2, Store, baseline_doc, doc_from_row, entries, entry, load, pipeline_entries,
                   plan_sync, row, run_tool, sheet)

TF = plan_sync.TEXT_FIELDS
TRACKER_ONLY = ("stage", "paused", "trackerProject")


def base_rows():
    return [row("alpha"), row("bravo"), row("charlie"), row("delta"),
            row("echo", "jvs"), row("foxtrot", "jvs"),
            row("golf", "closed"), row("hotel", "removed")]


def edit(rows, rid, **fields):
    rows = copy.deepcopy(rows)
    for r in rows:
        if r["id"] == rid:
            r.update(fields)
    return rows


class Base(unittest.TestCase):
    def setUp(self):
        self.rows = base_rows()
        self.s0 = sheet(self.rows)
        self.store = Store.from_sheet(self.s0)

    def run_and_apply(self, new_sheet, store=None, now=NOW):
        store = store or self.store
        p = store.plan(new_sheet, now=now)
        self.assertIsNone(p["summary"]["abort"], p["summary"]["abort"])
        store.apply(p["batches"])
        return p

    def assertIdempotent(self, new_sheet, store=None):
        store = store or self.store
        again = store.plan(new_sheet, now=NOW2)
        self.assertEqual(entries(again), [], "re-plan after applying should write nothing")
        self.assertEqual(again["summary"]["changes"], [])
        self.assertEqual(again["summary"]["conflicts"], [])
        return again

    def assertNoTrackerOnlyFields(self, plan):
        for e in pipeline_entries(plan):
            if e["op"] == "update":
                for k in TRACKER_ONLY:
                    self.assertNotIn(k, e["data"])


class NoChange(Base):
    def test_no_change_no_batches(self):
        p = self.store.plan(sheet(self.rows))
        self.assertEqual(p["batches"], [])
        s = p["summary"]
        self.assertEqual((s["writes"], s["batches"], s["baselineWritten"], s["configAsOf"]), (0, 0, False, None))
        self.assertEqual(s["flags"], [])

    def test_read_time_and_sheet_date_alone_are_no_change(self):
        s1 = sheet(self.rows, read_at="2026-11-03T18:00:00.000Z")
        s1["sheetDate"] = "2026-11-04"
        self.assertEqual(self.store.plan(s1)["batches"], [])

    def test_positions_differ_only(self):
        self.store.docs["bravo"]["sheetRow"] = 99        # stale position in the store
        p = self.run_and_apply(sheet(self.rows))
        e = entry(p, "bravo")
        self.assertEqual(e["data"], {"sheetRow": 9})
        self.assertEqual(e["if_version"], 2)
        self.assertIdempotent(sheet(self.rows))


class FieldChanges(Base):
    def test_field_change_applied(self):
        s1 = sheet(edit(self.rows, "bravo", amount="500m", status="Signed"))
        p = self.run_and_apply(s1)
        e = entry(p, "bravo")
        self.assertEqual(e["op"], "update")
        self.assertEqual(e["if_version"], 2)
        d = e["data"]
        self.assertEqual(set(d), {"amount", "status", "updatedAt", "updatedBy", "history"})
        self.assertEqual((d["amount"], d["status"], d["updatedAt"], d["updatedBy"]), ("500m", "Signed", NOW, "Excel"))
        self.assertEqual(d["history"], [
            {"at": NOW, "by": "Excel", "field": "amount", "from": "", "to": "500m"},
            {"at": NOW, "by": "Excel", "field": "status", "from": "Live", "to": "Signed"}])
        self.assertEqual(entry(p, "config", "pipelineMeta")["data"], {"asOf": "2026-11-03"})
        last = p["batches"][-1][-1]
        self.assertEqual((last["op"], last["doc_id"], last["if_version"]), ("set", "sheetSync", 1))   # pinned replace
        self.assertEqual(last["data"]["rows"], s1["rows"])
        self.assertEqual(last["data"]["syncedAt"], NOW)
        self.assertEqual(len(pipeline_entries(p)), 1)
        self.assertEqual(self.store.docs["bravo"]["amount"], "500m")
        self.assertIdempotent(s1)

    def test_conflict_tracker_wins_and_is_reported_once(self):
        self.store.docs["bravo"]["status"] = "Terms agreed"          # team edit in the tracker
        s1 = sheet(edit(self.rows, "bravo", status="Signed", amount="1bn"))
        p = self.run_and_apply(s1)
        d = entry(p, "bravo")["data"]
        self.assertNotIn("status", d)
        self.assertEqual(d["amount"], "1bn")                         # the other field still applies
        self.assertEqual(p["summary"]["conflicts"], [
            {"docId": "bravo", "field": "status", "base": "Live", "sheet": "Signed", "store": "Terms agreed"}])
        self.assertEqual(self.store.sheet_sync["rows"], s1["rows"])  # baseline advanced anyway
        again = self.assertIdempotent(s1)
        self.assertEqual(again["summary"]["conflicts"], [])

    def test_conflict_only_still_advances_baseline(self):
        self.store.docs["bravo"]["status"] = "Terms agreed"
        s1 = sheet(edit(self.rows, "bravo", status="Signed"))
        p = self.run_and_apply(s1)
        self.assertEqual(pipeline_entries(p), [])
        self.assertEqual([e["doc_id"] for e in entries(p)], ["config", "sheetSync"])
        self.assertIdempotent(s1)

    def test_tracker_only_edit_preserved(self):
        self.store.docs["charlie"]["description"] = "typed in the tracker"
        self.store.docs["charlie"]["stage"] = "terms"
        self.store.docs["charlie"]["paused"] = True
        self.store.docs["charlie"]["trackerProject"] = "Project Charlie - X"
        team = doc_from_row(row("team-deal"), section="pipeline", order=9, sheetRow=None, updatedBy="AI")
        self.store.docs["team-deal"] = team
        self.store.versions["team-deal"] = 1
        s1 = sheet(edit(self.rows, "alpha", tenor="5y"))
        p = self.run_and_apply(s1)
        self.assertIsNone(entry(p, "charlie"))
        self.assertIsNone(entry(p, "team-deal"))
        self.assertEqual(self.store.docs["charlie"]["description"], "typed in the tracker")
        self.assertEqual((self.store.docs["charlie"]["stage"], self.store.docs["charlie"]["paused"]), ("terms", True))
        self.assertNoTrackerOnlyFields(p)
        self.assertIdempotent(s1)

    def test_store_already_equal_to_sheet(self):
        self.store.docs["delta"]["ltc"] = "70%"
        s1 = sheet(edit(self.rows, "delta", ltc="70%"))
        p = self.run_and_apply(s1)
        self.assertEqual(pipeline_entries(p), [])
        self.assertEqual(p["summary"]["changes"], [])
        self.assertEqual(p["summary"]["conflicts"], [])

    def test_bullet_whitespace_only_is_no_change(self):
        self.store.docs["alpha"]["statusUpdate"] = "x first  point on alpha\nx second point"   # tracker spacing
        s1 = sheet(edit(self.rows, "alpha", statusUpdate="x first point on alpha   x  second point",
                        keyIssues=""))
        p = self.store.plan(s1)
        self.assertEqual(pipeline_entries(p), [])
        self.assertEqual(p["summary"]["conflicts"], [])

    def test_bullet_real_change_applies_and_compares_by_bullets(self):
        self.store.docs["alpha"]["statusUpdate"] = "x first  point on alpha x second point"
        s1 = sheet(edit(self.rows, "alpha", statusUpdate="x first point on alpha x second point x third"))
        p = self.run_and_apply(s1)
        self.assertEqual(entry(p, "alpha")["data"]["statusUpdate"], "x first point on alpha x second point x third")
        self.assertIdempotent(s1)

    def test_bullet_rule_matches_the_page(self):
        b = plan_sync.pipe_bullets
        self.assertEqual(b("x a x b"), ["a", "b"])
        self.assertEqual(b("  x a\n x  b  "), ["a", "b"])
        self.assertEqual(b("- a - b-c"), ["a", "b-c"])
        self.assertEqual(b("xylophone x a"), ["xylophone x a"])
        self.assertEqual(b("Mistral risk"), ["Mistral risk"])
        self.assertEqual(b(""), [])
        self.assertTrue(plan_sync.same("keyIssues", "x a  b", "x a b"))
        self.assertFalse(plan_sync.same("description", "a  b", "a b"))   # non-bullet fields compare exactly


class NewRows(Base):
    def test_new_row_in_the_middle(self):
        rows = copy.deepcopy(self.rows)
        rows.insert(2, row("newco", project="Project Newco", status="Signed"))
        s1 = sheet(rows)
        p = self.run_and_apply(s1)
        e = entry(p, "newco")
        self.assertEqual(e["op"], "set")
        self.assertNotIn("if_version", e)
        d = e["data"]
        self.assertEqual(list(d)[:26], TF)
        self.assertEqual((d["section"], d["order"], d["sheetRow"], d["trackerProject"], d["marker"]),
                         ("pipeline", 3, 10, None, ""))
        self.assertEqual((d["stage"], d["paused"], d["updatedAt"], d["updatedBy"]), ("", False, NOW, "Excel"))
        self.assertEqual(d["history"], [{"at": NOW, "by": "Excel", "field": "created", "from": "", "to": "Project Newco"}])
        self.assertEqual(entry(p, "charlie")["data"], {"order": 4, "sheetRow": 11})
        self.assertEqual(entry(p, "delta")["data"], {"order": 5, "sheetRow": 12})
        self.assertEqual(entry(p, "echo")["data"], {"sheetRow": 15})         # jvs: same order, new row
        self.assertIsNone(entry(p, "alpha"))
        self.assertEqual([e["doc_id"] for e in pipeline_entries(p)],
                         ["newco", "charlie", "delta", "echo", "foxtrot", "golf", "hotel"])   # sheet order
        self.assertEqual(p["summary"]["newRows"], ["newco"])
        self.assertIdempotent(s1)

    def test_kickoff_and_paused_mapping(self):
        rows = self.rows + [row("k1", status="Kick-off"), row("k2", status="KICK-OFF"), row("p1", status="Paused"),
                            row("p2", status="paused"), row("z1", status="Kick off")]
        p = self.run_and_apply(sheet(rows))
        got = {i: (entry(p, i)["data"]["stage"], entry(p, i)["data"]["paused"]) for i in ("k1", "k2", "p1", "p2", "z1")}
        self.assertEqual(got, {"k1": ("launch", False), "k2": ("launch", False), "p1": ("", True),
                               "p2": ("", True), "z1": ("", False)})

    def test_team_created_slug_collision(self):
        self.store.docs["newco"] = doc_from_row(row("newco", project="Project Newco"), order=5, sheetRow=None,
                                                updatedBy="AI", history=[{"at": NOW, "by": "AI", "field": "created",
                                                                          "from": "", "to": "Project Newco"}])
        self.store.versions["newco"] = 1
        s1 = sheet(self.rows + [row("newco", project="Project Newco")])
        team = copy.deepcopy(self.store.docs["newco"])
        p = self.store.plan(s1)
        self.assertIsNone(entry(p, "newco"))
        self.assertEqual([f["kind"] for f in p["summary"]["flags"]], ["collision"])
        self.assertIn("added in the tracker", p["summary"]["flags"][0]["message"])
        self.assertEqual(p["summary"]["newRows"], [])
        self.assertNotIn("newco", [r["id"] for r in p["next_baseline"]["rows"]])     # never linked
        self.assertEqual(p["next_baseline"]["collisions"], ["newco"])
        self.store.apply(p["batches"])
        again = self.assertIdempotent(s1)               # used to link the row and write newco.sheetRow
        self.assertEqual(again["summary"]["flags"], [])                              # reported once
        self.assertEqual(self.store.docs["newco"], team)
        # once the team's doc is gone, the Excel row is created normally
        del self.store.docs["newco"], self.store.versions["newco"]
        p = self.run_and_apply(s1, now=NOW2)
        self.assertEqual(p["summary"]["newRows"], ["newco"])
        self.assertEqual(self.store.sheet_sync["collisions"], [])

    def test_collision_in_a_held_section_is_reported_once(self):
        self.store.docs["newco"] = doc_from_row(row("newco"), order=5, sheetRow=None, updatedBy="AI")
        self.store.versions["newco"] = 1
        st = self.store
        st.docs["alpha"]["order"], st.docs["bravo"]["order"] = 2, 1        # the team reordered Pipeline
        s1 = sheet([row("newco")] + self.rows)                              # the Excel adds Newco on top
        p = self.run_and_apply(s1)
        self.assertEqual(sorted(f["kind"] for f in p["summary"]["flags"]), ["collision", "reordered"])
        again = self.assertIdempotent(s1)
        self.assertEqual(again["summary"]["flags"], [])     # "reordered" used to repeat every hour

    def test_row_created_by_an_earlier_partial_sync_is_linked(self):
        s1 = sheet(self.rows + [row("newco")])
        first = self.store.plan(s1)
        created = entry(first, "newco")
        self.store.docs["newco"] = copy.deepcopy(created["data"])     # only that write landed
        self.store.versions["newco"] = 1
        p = self.store.plan(s1)
        self.assertIsNone(entry(p, "newco"))
        self.assertEqual(p["summary"]["flags"], [])
        self.store.apply(p["batches"])
        self.assertIdempotent(s1)


    def test_old_name_reused_after_a_rename_is_created_under_the_next_id(self):
        # Foo is renamed Bar (alias bar -> foo); then a new deal named Foo is added. Its id "foo" is
        # the renamed deal's doc: it is created as foo-2 (PIPE_create's rule), and later runs plan
        # normally (this used to flag it, keep it in the baseline and make every later run exit 2).
        rows = edit(self.rows, "alpha", project="Project Foo")
        rows[0]["id"] = "foo"
        st = Store.from_sheet(sheet(rows))
        renamed = edit(rows, "foo", project="Project Bar")
        renamed[0]["id"] = "bar"
        self.run_and_apply(sheet(renamed), store=st)
        self.assertEqual(st.sheet_sync["aliases"], {"bar": "foo"})
        s2 = sheet(renamed + [row("foo", project="Project Foo", site="Elsewhere", sponsor="McN")])
        p = self.run_and_apply(s2, store=st, now=NOW2)
        self.assertEqual(p["summary"]["newRows"], ["foo-2"])
        self.assertEqual(p["summary"]["flags"], [])
        self.assertEqual((st.docs["foo-2"]["site"], st.docs["foo"]["project"]), ("Elsewhere", "Project Bar"))
        self.assertEqual(st.sheet_sync["aliases"], {"bar": "foo", "foo": "foo-2"})
        again = st.plan(s2, now="2026-11-03T17:00:00.000Z")
        self.assertEqual(entries(again), [])
        s3 = sheet(edit(renamed, "bar", amount="7") + [row("foo", project="Project Foo", site="Elsewhere",
                                                           sponsor="McN", amount="8")])
        p3 = st.plan(s3, now="2026-11-03T18:00:00.000Z")
        self.assertEqual(sorted((e["doc_id"], e["data"].get("amount")) for e in pipeline_entries(p3)),
                         [("foo", "7"), ("foo-2", "8")])

    def test_next_id_created_by_an_earlier_partial_sync_is_linked(self):
        rows = edit(self.rows, "alpha", project="Project Foo")
        rows[0]["id"] = "foo"
        st = Store.from_sheet(sheet(rows))
        renamed = edit(rows, "foo", project="Project Bar")
        renamed[0]["id"] = "bar"
        self.run_and_apply(sheet(renamed), store=st)
        s2 = sheet(renamed + [row("foo", project="Project Foo", site="Elsewhere", sponsor="McN")])
        first = st.plan(s2, now=NOW2)
        st.docs["foo-2"] = copy.deepcopy(entry(first, "foo-2")["data"])   # only the create landed
        st.versions["foo-2"] = 1
        p = st.plan(s2, now=NOW2)
        self.assertEqual(p["summary"]["newRows"], [])                  # not created a second time as foo-3
        self.assertEqual(p["next_baseline"]["aliases"], {"bar": "foo", "foo": "foo-2"})
        st.apply(p["batches"])
        self.assertEqual(entries(st.plan(s2, now="2026-11-03T17:00:00.000Z")), [])

class Renames(Base):
    def test_rename_same_site_and_sponsor(self):
        rows = edit(self.rows, "bravo", id="bravo-ii", project="Project Bravo II", amount="2bn")
        s1 = sheet(rows)
        p = self.run_and_apply(s1)
        self.assertIsNone(entry(p, "bravo-ii"))
        d = entry(p, "bravo")["data"]
        self.assertEqual((d["project"], d["amount"]), ("Project Bravo II", "2bn"))
        self.assertEqual([h["field"] for h in d["history"]], ["project", "amount"])
        self.assertEqual(p["summary"]["renames"], [{"docId": "bravo", "sheetId": "bravo-ii", "from": "Project Bravo",
                                                    "to": "Project Bravo II", "section": "pipeline"}])
        self.assertEqual(self.store.sheet_sync["aliases"], {"bravo-ii": "bravo"})
        self.assertEqual(p["summary"]["flags"], [])
        self.assertIdempotent(s1)
        # a later Excel edit on the renamed row lands on the original doc
        s2 = sheet(edit(rows, "bravo-ii", tenor="7y"))
        p2 = self.run_and_apply(s2)
        self.assertEqual(entry(p2, "bravo")["data"]["tenor"], "7y")
        self.assertEqual(self.store.sheet_sync["aliases"], {"bravo-ii": "bravo"})
        self.assertIdempotent(s2)

    def test_rename_by_sixty_percent_of_fields(self):
        r = dict(row("bravo"), currency="EUR", amount="1bn", tenor="5", ltc="60%", capacity="10 MW")
        rows = [r if x["id"] == "bravo" else x for x in self.rows]
        self.store = Store.from_sheet(sheet(rows))
        # new name, new site, new sponsor; the other fields are the same
        s1 = sheet(edit(rows, "bravo", id="brava", project="Project Brava", site="Elsewhere", sponsor="McNair"))
        p = self.run_and_apply(s1)
        self.assertEqual(entry(p, "bravo")["data"]["project"], "Project Brava")
        self.assertEqual(entry(p, "bravo")["data"]["site"], "Elsewhere")
        self.assertIsNone(entry(p, "brava"))
        self.assertIdempotent(s1)

    def test_rename_needs_the_tracker_to_agree(self):
        self.store.docs["bravo"]["project"] = "Project Bravo (renamed by team)"
        s1 = sheet(edit(self.rows, "bravo", id="bravo-ii", project="Project Bravo II"))
        p = self.run_and_apply(s1)
        self.assertIsNone(entry(p, "bravo"))
        self.assertEqual(p["summary"]["conflicts"][0]["field"], "project")
        self.assertIdempotent(s1)

    def test_rename_ambiguity(self):
        rows = [x for x in self.rows if x["id"] != "bravo"]
        rows.insert(1, row("bravo-a", project="Project Bravo A", site="Site bravo"))
        rows.insert(2, row("bravo-b", project="Project Bravo B", site="Site bravo"))
        s1 = sheet(rows)
        p = self.run_and_apply(s1)
        kinds = sorted(f["kind"] for f in p["summary"]["flags"])
        self.assertEqual(kinds, ["missing", "rename-ambiguous"])
        self.assertEqual(sorted(p["summary"]["newRows"]), ["bravo-a", "bravo-b"])
        self.assertEqual(p["summary"]["renames"], [])
        self.assertNotIn("project", (entry(p, "bravo") or {"data": {}})["data"])
        self.assertIdempotent(s1)

    def test_rename_not_across_sections(self):
        rows = [x for x in self.rows if x["id"] != "bravo"] + [row("bravo-ii", "jvs", site="Site bravo")]
        p = self.store.plan(sheet(rows))
        self.assertEqual(p["summary"]["renames"], [])
        self.assertEqual(p["summary"]["newRows"], ["bravo-ii"])


    def test_rename_reverted_in_the_excel_is_applied(self):
        renamed = edit(self.rows, "bravo", project="Project Bravo II")
        renamed[1]["id"] = "bravo-ii"
        self.run_and_apply(sheet(renamed))
        self.assertEqual(self.store.docs["bravo"]["project"], "Project Bravo II")
        p = self.run_and_apply(sheet(self.rows), now=NOW2)          # the typo is fixed in the Excel
        self.assertEqual(p["summary"]["flags"], [])                 # used to flag a collision and "missing"
        self.assertEqual(entry(p, "bravo")["data"]["project"], "Project Bravo")
        self.assertEqual(self.store.sheet_sync["aliases"], {})
        self.assertEqual(entries(self.store.plan(sheet(self.rows), now="2026-11-03T17:00:00.000Z")), [])

class MissingRows(Base):
    def test_row_missing_from_sheet(self):
        s1 = sheet([x for x in self.rows if x["id"] != "charlie"])
        p = self.run_and_apply(s1)
        self.assertEqual([(f["kind"], f["docId"]) for f in p["summary"]["flags"]], [("missing", "charlie")])
        self.assertIn("remove it in the tracker if intended", p["summary"]["flags"][0]["message"])
        self.assertIsNone(entry(p, "charlie"))
        self.assertTrue(all(e["op"] != "delete" for e in entries(p)))
        self.assertEqual(entry(p, "delta")["data"], {"order": 3, "sheetRow": 10})
        self.assertIn("charlie", self.store.docs)
        again = self.assertIdempotent(s1)
        self.assertEqual(again["summary"]["flags"], [])          # reported once

    def test_deleted_in_tracker_is_not_recreated(self):
        del self.store.docs["charlie"]
        del self.store.versions["charlie"]
        s1 = sheet(edit(self.rows, "charlie", amount="3bn"))
        p = self.run_and_apply(s1)
        self.assertIsNone(entry(p, "charlie"))
        self.assertEqual([f["kind"] for f in p["summary"]["flags"]], ["deleted-in-tracker"])
        self.assertIdempotent(s1)


class Sections(Base):
    def test_section_move_applied(self):
        rows = [x for x in self.rows if x["id"] != "bravo"]
        rows.insert(5, dict(row("bravo"), section="closed"))     # first row of Closed, before golf
        s1 = sheet(rows)
        p = self.run_and_apply(s1)
        d = entry(p, "bravo")["data"]
        self.assertEqual((d["section"], d["order"], d["sheetRow"]), ("closed", 1, 21))
        self.assertEqual([h["field"] for h in d["history"]], ["section"])
        self.assertEqual(d["history"][0], {"at": NOW, "by": "Excel", "field": "section", "from": "pipeline", "to": "closed"})
        self.assertEqual(entry(p, "golf")["data"], {"order": 2})
        self.assertEqual(entry(p, "charlie")["data"], {"order": 2, "sheetRow": 9})
        self.assertIdempotent(s1)

    def test_section_move_conflicting_with_tracker_move(self):
        self.store.docs["bravo"].update({"section": "removed", "order": 2})
        rows = [x for x in self.rows if x["id"] != "bravo"]
        rows.insert(5, dict(row("bravo"), section="closed"))
        s1 = sheet(rows)
        p = self.run_and_apply(s1)
        d = entry(p, "bravo")["data"]
        self.assertEqual(d, {"sheetRow": 21})                    # housekeeping only
        self.assertEqual(p["summary"]["conflicts"], [{"docId": "bravo", "field": "section", "base": "pipeline",
                                                      "sheet": "closed", "store": "removed"}])
        self.assertEqual(self.store.docs["bravo"]["section"], "removed")
        self.assertIdempotent(s1)

    def test_tracker_move_alone_is_kept(self):
        self.store.docs["bravo"].update({"section": "closed", "order": 9})
        p = self.store.plan(sheet(edit(self.rows, "alpha", tenor="3")))
        self.assertIsNone(entry(p, "bravo"))


class Reorders(Base):
    def test_tracker_reorder_plus_sheet_insertion(self):
        # the team swapped bravo and charlie in the tracker
        self.store.docs["bravo"]["order"], self.store.docs["charlie"]["order"] = 3, 2
        rows = copy.deepcopy(self.rows)
        rows.insert(1, row("newco"))
        s1 = sheet(rows)
        p = self.run_and_apply(s1)
        self.assertEqual([f["kind"] for f in p["summary"]["flags"]], ["reordered"])
        self.assertIn("Excel order not applied", p["summary"]["flags"][0]["message"])
        self.assertEqual(entry(p, "bravo")["data"], {"sheetRow": 10})       # no order write
        self.assertEqual(entry(p, "charlie")["data"], {"sheetRow": 11})
        self.assertEqual(entry(p, "newco")["data"]["order"], 2)            # the sheet's order
        self.assertEqual(entry(p, "echo")["data"], {"sheetRow": 15})        # other sections untouched
        self.assertEqual((self.store.docs["bravo"]["order"], self.store.docs["charlie"]["order"]), (3, 2))
        again = self.assertIdempotent(s1)
        self.assertEqual(again["summary"]["flags"], [])

    def test_sheet_reorder_applied_when_tracker_did_not_reorder(self):
        rows = copy.deepcopy(self.rows)
        rows[1], rows[2] = rows[2], rows[1]
        s1 = sheet(rows)
        p = self.run_and_apply(s1)
        self.assertEqual(entry(p, "bravo")["data"], {"order": 3, "sheetRow": 10})
        self.assertEqual(entry(p, "charlie")["data"], {"order": 2, "sheetRow": 9})
        self.assertFalse(any("history" in e["data"] or "updatedAt" in e["data"] for e in pipeline_entries(p)))
        self.assertIdempotent(s1)

    def test_hold_persists_after_the_baseline_advances(self):
        self.store.docs["bravo"]["order"] = 10                    # team moved bravo to the end
        rows = copy.deepcopy(self.rows)
        rows.insert(4, row("newco"))                              # Excel adds a row at the end of Pipeline
        s1 = sheet(rows)
        p = self.run_and_apply(s1)
        self.assertEqual([f["kind"] for f in p["summary"]["flags"]], ["reordered"])
        self.assertEqual(self.store.sheet_sync["orderHeld"], ["pipeline"])
        self.assertIdempotent(s1)
        s2 = sheet([r for r in rows if r["id"] != "delta"])        # later the Excel drops delta
        p2 = self.run_and_apply(s2)
        self.assertFalse(any("order" in e["data"] for e in pipeline_entries(p2)))
        self.assertEqual(self.store.docs["bravo"]["order"], 10)
        self.assertEqual(self.store.sheet_sync["orderHeld"], ["pipeline"])
        self.assertIdempotent(s2)

    def test_hold_released_when_excel_and_tracker_agree(self):
        self.store.docs["bravo"]["order"] = 10                    # team moved bravo to the end
        rows = copy.deepcopy(self.rows)
        rows.insert(3, rows.pop(1))                               # the Excel does the same
        s1 = sheet(rows)
        p = self.run_and_apply(s1)
        self.assertEqual(p["summary"]["flags"], [])
        self.assertEqual(entry(p, "bravo")["data"], {"order": 4, "sheetRow": 11})
        self.assertEqual(self.store.sheet_sync["orderHeld"], [])
        self.assertIdempotent(s1)

    def test_tracker_reorder_alone_is_not_flagged(self):
        self.store.docs["bravo"]["order"], self.store.docs["charlie"]["order"] = 3, 2
        p = self.store.plan(sheet(edit(self.rows, "alpha", tenor="3")))
        self.assertEqual(p["summary"]["flags"], [])
        self.assertIsNone(entry(p, "bravo"))


    def test_tracker_created_deal_moved_up_is_not_undone(self):
        st = self.store
        st.docs["tango"] = doc_from_row(row("tango"), order=5, sheetRow=None, updatedBy="AI")
        st.versions["tango"] = 1
        # PIPE_reorder's strict swaps: tango up past delta, charlie and bravo
        for other in ("delta", "charlie", "bravo"):
            st.docs["tango"]["order"], st.docs[other]["order"] = st.docs[other]["order"], st.docs["tango"]["order"]
        p = st.plan(sheet(self.rows))                               # the Excel did not change
        self.assertEqual(entries(p), [])                            # used to write bravo/charlie/delta back
        # an Excel insertion above still renumbers the rows the Excel moved, and only those
        rows = [row("zulu")] + self.rows
        p = self.run_and_apply(sheet(rows))
        self.assertEqual(sorted(e["doc_id"] for e in pipeline_entries(p) if "order" in e["data"]),
                         ["alpha", "zulu"])
        self.assertIsNone(entry(p, "tango"))
        self.assertIdempotent(sheet(rows))

class DuplicateNames(Base):
    def setUp(self):
        self.rows = [row("mirai", project="Project Mirai", site="Kyotonabe + Yawata"), row("salar"),
                     row("mirai-removed", "removed", project="Project Mirai", site="Kyotonabe", sponsor="McNair")]
        self.s0 = sheet(self.rows)
        self.store = Store.from_sheet(self.s0)

    def test_edit_on_the_removed_duplicate(self):
        s1 = sheet(edit(self.rows, "mirai-removed", amount="[30]bn"))
        p = self.run_and_apply(s1)
        self.assertEqual(entry(p, "mirai-removed")["data"]["amount"], "[30]bn")
        self.assertIsNone(entry(p, "mirai"))
        self.assertIdempotent(s1)

    def test_first_duplicate_deleted_does_not_shift_onto_it(self):
        # the pipeline Mirai row is deleted: the parser now calls the Removed one "mirai"
        rows = [row("salar"), dict(self.rows[2], id="mirai")]
        s1 = sheet(rows)
        p = self.run_and_apply(s1)
        self.assertIsNone(entry(p, "mirai"))
        self.assertEqual(entry(p, "mirai-removed")["data"], {"sheetRow": 19})
        self.assertEqual([(f["kind"], f["docId"]) for f in p["summary"]["flags"]], [("missing", "mirai")])
        self.assertEqual(self.store.docs["mirai"]["site"], "Kyotonabe + Yawata")
        self.assertEqual(self.store.sheet_sync["aliases"], {"mirai": "mirai-removed"})
        self.assertIdempotent(s1)
        s2 = sheet(edit(rows, "mirai", amount="[40]bn"))
        p2 = self.run_and_apply(s2)
        self.assertEqual(entry(p2, "mirai-removed")["data"]["amount"], "[40]bn")
        self.assertIsNone(entry(p2, "mirai"))

    def test_duplicate_moves_section(self):
        rows = [dict(self.rows[0], section="closed"), row("salar"), self.rows[2]]
        rows = [rows[1], rows[0], rows[2]]
        s1 = sheet(rows)
        p = self.run_and_apply(s1)
        self.assertEqual(entry(p, "mirai")["data"]["section"], "closed")
        self.assertIsNone(entry(p, "mirai-removed"))
        self.assertIdempotent(s1)


    def test_new_deal_reusing_a_closed_deals_name(self):
        old = row("gotham", "closed", project="Project Gotham", site="NY01", sponsor="McN", amount="$400m")
        st = Store.from_sheet(sheet([row("salar"), old]))
        st.docs["gotham"]["stage"] = "closed"
        new = row("gotham", project="Project Gotham", site="NY02", sponsor="Herndon", amount="$250m")
        s1 = sheet([row("salar"), new, dict(old, id="gotham-closed")])     # the parser renames the old row
        p = self.run_and_apply(s1, store=st)
        d = st.docs["gotham"]
        self.assertEqual((d["section"], d["site"], d["amount"], d["stage"]), ("closed", "NY01", "$400m", "closed"))
        self.assertEqual(p["summary"]["newRows"], ["gotham-2"])
        self.assertEqual((st.docs["gotham-2"]["site"], st.docs["gotham-2"]["section"]), ("NY02", "pipeline"))
        self.assertEqual(p["summary"]["changes"], [])
        self.assertIdempotent(s1, store=st)

    def test_names_sharing_a_slug_are_paired_by_content(self):
        old = row("gotham", "closed", project="Project Gotham", site="NY01", sponsor="McN")
        st = Store.from_sheet(sheet([row("salar"), old]))
        new = row("gotham", project="Gotham [new]", site="NY02", sponsor="Herndon")   # same slug, other name
        s1 = sheet([row("salar"), new, dict(old, id="gotham-closed")])
        p = self.run_and_apply(s1, store=st)
        self.assertEqual(st.docs["gotham"]["site"], "NY01")
        self.assertEqual(p["summary"]["newRows"], ["gotham-2"])
        self.assertIdempotent(s1, store=st)

    def test_duplicate_name_inserted_above_in_the_same_section(self):
        self.store.docs["mirai"].update(stage="terms", trackerProject="Mirai JV")
        third = row("mirai", project="Project Mirai", site="Osaka Phase 2", sponsor="McN", amount="[10]bn",
                    status="Kick-off", statusUpdate="x a different deal")
        s1 = sheet([third, dict(self.rows[0], id="mirai-pipeline"), self.rows[1], self.rows[2]])
        p = self.run_and_apply(s1)
        d = self.store.docs["mirai"]
        self.assertEqual((d["site"], d["stage"], d["trackerProject"]), ("Kyotonabe + Yawata", "terms", "Mirai JV"))
        self.assertEqual(p["summary"]["newRows"], ["mirai-2"])
        self.assertEqual(self.store.docs["mirai-2"]["site"], "Osaka Phase 2")
        self.assertEqual(p["summary"]["changes"], [])
        self.assertIdempotent(s1)

    def test_deleted_duplicate_restored(self):
        rows = [row("salar"), dict(self.rows[2], id="mirai")]           # the Pipeline Mirai row is deleted
        self.run_and_apply(sheet(rows))
        p = self.run_and_apply(self.s0, now=NOW2)                       # ...and restored (undo)
        d = self.store.docs["mirai-removed"]
        self.assertEqual((d["section"], d["site"]), ("removed", "Kyotonabe"))   # not pulled into Pipeline
        self.assertEqual(p["summary"]["changes"], [])
        self.assertEqual([f["kind"] for f in p["summary"]["flags"]], ["collision"])   # doc mirai is unlinked
        self.assertIn("no longer linked to an Excel row", p["summary"]["flags"][0]["message"])
        again = self.assertIdempotent(self.s0)                          # used to exit 2 from here on
        self.assertEqual(again["summary"]["flags"], [])

class History(Base):
    def test_prepend_cap_and_dedupe(self):
        old = [{"at": "2026-10-%02dT10:00:00.000Z" % (30 - i % 28), "by": "AI", "field": "status", "from": "a",
                "to": "b%d" % i} for i in range(40)]
        old.insert(0, {"at": NOW, "by": "Excel", "field": "amount", "from": "", "to": "500m"})   # earlier attempt
        old.append("junk")
        self.store.docs["bravo"]["history"] = old
        long_value = "y" * 2500
        s1 = sheet(edit(self.rows, "bravo", amount="500m", description=long_value))
        p = self.store.plan(s1)
        h = entry(p, "bravo")["data"]["history"]
        self.assertEqual(len(h), 40)
        self.assertEqual([(x["field"], x["at"]) for x in h[:2]], [("amount", NOW), ("description", NOW)])
        self.assertEqual(sum(1 for x in h if x["field"] == "amount" and x["at"] == NOW), 1)
        self.assertEqual(len(h[1]["to"]), 2000)
        self.assertTrue(h[1]["to"].endswith("…"))
        ts = [plan_sync.ts_ms(x["at"]) for x in h]
        self.assertEqual(ts, sorted(ts, reverse=True))
        self.assertTrue(all(set(x) == {"at", "by", "field", "from", "to"} for x in h))

    def test_cap_counts_utf16_units(self):
        self.assertEqual(plan_sync.cap("a" * 2000), "a" * 2000)
        s = plan_sync.cap("\U0001F600" * 1500)
        self.assertLessEqual(len(s.encode("utf-16-le")) // 2, 2000)
        self.assertTrue(s.endswith("…"))

    def test_positions_write_no_history(self):
        rows = copy.deepcopy(self.rows)
        rows.insert(0, row("first"))
        p = self.store.plan(sheet(rows))
        for e in pipeline_entries(p):
            if e["doc_id"] != "first":
                self.assertTrue(set(e["data"]) <= {"order", "sheetRow"}, e)


class Batching(unittest.TestCase):
    def test_split_by_count_and_baseline_last(self):
        rows = [row("r%02d" % i) for i in range(60)]
        st = Store.from_sheet(sheet(rows))
        s1 = sheet([row("new")] + rows)                     # every row shifts: 60 position updates
        p = st.plan(s1)
        self.assertIsNone(p["summary"]["abort"])
        sizes = [len(b) for b in p["batches"]]
        self.assertTrue(all(n <= 40 for n in sizes), sizes)
        self.assertEqual(sum(sizes), 63)                    # 61 docs + config + baseline
        self.assertEqual(p["batches"][-1][-1]["doc_id"], "sheetSync")
        self.assertEqual(p["batches"][-1][-2]["doc_id"], "config")
        st.apply(p["batches"])
        self.assertEqual(entries(st.plan(s1, now=NOW2)), [])

    def test_recovery_after_a_failed_batch(self):
        """Batch 2 fails (e.g. a version conflict): re-reading and re-planning finishes the job with
        the same end state as a clean run, and a section is never left half renumbered."""
        rows = [row("p%d" % i) for i in range(4)] + [row("j%d" % i, "jvs") for i in range(4)] + \
               [row("c%d" % i, "closed") for i in range(4)]
        st = Store.from_sheet(sheet(rows))
        new = copy.deepcopy(rows)
        new.insert(0, row("p-new"))
        new.insert(5, row("j-new", "jvs"))
        new[9]["amount"] = "1bn"
        s1 = sheet(new)
        saved = plan_sync.MAX_BATCH_ENTRIES
        plan_sync.MAX_BATCH_ENTRIES = 6
        try:
            clean = copy.deepcopy(st)
            p = clean.plan(s1)
            self.assertGreaterEqual(len(p["batches"]), 2)
            sec_of = {r["id"]: r["section"] for r in s1["rows"]}
            where = {}
            for bi, b in enumerate(p["batches"]):
                for e in b:
                    if e["collection"] == "pipeline":
                        where.setdefault(sec_of[e["doc_id"]], set()).add(bi)
            self.assertTrue(all(len(v) == 1 for v in where.values()), where)   # no section split
            clean.apply(p["batches"])
            part = copy.deepcopy(st)
            part.apply(p["batches"][:1])
            p2 = part.plan(s1, now=NOW2)
            self.assertIsNone(p2["summary"]["abort"])
            self.assertEqual(p2["summary"]["flags"], [])
            part.apply(p2["batches"])
        finally:
            plan_sync.MAX_BATCH_ENTRIES = saved

        def strip(docs):
            return {i: dict((k, v) for k, v in d.items() if k not in ("updatedAt", "history")) for i, d in docs.items()}
        self.assertEqual(strip(part.docs), strip(clean.docs))
        self.assertEqual(part.config, clean.config)
        self.assertEqual(entries(part.plan(s1, now=NOW2)), [])

    def test_half_applied_renumbering_is_finished_not_held(self):
        rows = [row("p%02d" % i) for i in range(45)]
        st = Store.from_sheet(sheet(rows))
        s1 = sheet(list(reversed(rows)))                 # 45 position updates in one section: 2 batches
        p = st.plan(s1)
        self.assertGreater(len(p["batches"]), 1)
        st.apply(p["batches"][:1])                       # batch 2 failed (e.g. a version conflict)
        p2 = st.plan(s1, now=NOW2)
        self.assertEqual(p2["summary"]["flags"], [])     # used to hold the section, scrambled
        st.apply(p2["batches"])
        got = sorted(st.docs, key=lambda i: (st.docs[i]["order"], st.docs[i]["sheetRow"], i))
        self.assertEqual(got, [r["id"] for r in s1["rows"]])
        self.assertEqual(entries(st.plan(s1, now="2026-11-03T17:00:00.000Z")), [])

    def test_split_by_size(self):
        rows = [row("r%02d" % i) for i in range(8)]
        st = Store.from_sheet(sheet(rows))
        for d in st.docs.values():      # long histories (40 lines x 2 cells x 1800 chars): ~145 KB per doc
            d["history"] = [{"at": "2026-11-0%dT10:00:00.000Z" % (1 + k % 2), "by": "AI", "field": "f%d" % k,
                             "from": "a" * 1800, "to": "b" * 1800} for k in range(40)]
        p = st.plan(sheet([dict(r, amount="9bn") for r in rows]))
        self.assertIsNone(p["summary"]["abort"])
        self.assertGreater(len(p["batches"]), 2)
        for b in p["batches"]:
            self.assertLess(sum(plan_sync._size(e) for e in b), 1024 * 1024)
        self.assertEqual(p["batches"][-1][-1]["doc_id"], "sheetSync")


class SafetyAbort(unittest.TestCase):
    def assertAborts(self, plan, fragment):
        self.assertEqual(plan["batches"], [])
        self.assertIn(fragment, plan["summary"]["abort"] or "")
        self.assertEqual(plan["summary"]["writes"], 0)

    def test_doc_over_the_store_limit_aborts(self):
        rows = [row("r%02d" % i) for i in range(12)]
        st = Store.from_sheet(sheet(rows))
        p = st.plan(sheet([dict(r, description=("%s " % r["id"]) * 15000) for r in rows]))   # baseline ~730 KB
        self.assertAborts(p, "pipelineMeta/sheetSync would be")
        self.assertIn("256 KiB", p["summary"]["abort"])

    def test_updated_doc_size_counts_the_whole_doc(self):
        rows = [row("a")]
        st = Store.from_sheet(sheet(rows))
        st.docs["a"]["description"] = "y" * 120000
        st.docs["a"]["history"] = [{"at": NOW, "by": "AI", "field": "f%d" % k, "from": "z" * 1900, "to": "z" * 1900}
                                   for k in range(30)]
        p = st.plan(sheet([dict(rows[0], amount="1")]))  # a small patch to a doc that ends up ~240 KB
        self.assertAborts(p, "pipeline/a would be")

    def test_too_many_touched(self):
        rows = [row("r%02d" % i) for i in range(30)]
        st = Store.from_sheet(sheet(rows))
        self.assertAborts(st.plan(sheet([dict(r, amount="x") for r in rows])), "change fields on 30 rows")
        ok = st.plan(sheet([dict(r, amount="x") if i < 25 else r for i, r in enumerate(rows)]))
        self.assertIsNone(ok["summary"]["abort"])

    def test_too_many_created(self):
        rows = [row("a")]
        st = Store.from_sheet(sheet(rows))
        self.assertAborts(st.plan(sheet(rows + [row("n%d" % i, site="s%d" % i) for i in range(7)])), "create 7 rows")
        self.assertIsNone(st.plan(sheet(rows + [row("n%d" % i, site="s%d" % i) for i in range(6)]))["summary"]["abort"])

    def test_too_many_missing(self):
        rows = [row("r%d" % i) for i in range(8)]
        st = Store.from_sheet(sheet(rows))
        self.assertAborts(st.plan(sheet(rows[:3])), "5 rows are missing")
        self.assertIsNone(st.plan(sheet(rows[:4]))["summary"]["abort"])

    def test_structural_difference(self):
        rows = [row("a")]
        st = Store.from_sheet(sheet(rows))
        s1 = sheet(rows)
        s1["sections"] = [s for s in s1["sections"] if s["key"] != "misc"]
        self.assertAborts(st.plan(s1), "sections changed")

    def test_missing_version(self):
        rows = [row("a"), row("b")]
        st = Store.from_sheet(sheet(rows))
        del st.versions["b"]
        self.assertAborts(st.plan(sheet(edit(rows, "b", amount="1"))), "no integer version for pipeline/b")


class Bootstrap(unittest.TestCase):
    def test_bootstrap_clean_store(self):
        rows = [row("a"), row("b")]
        s0 = sheet(rows)
        st = Store.from_sheet(s0, synced=False)
        p = st.plan(s0, bootstrap=s0)
        self.assertEqual([(e["op"], e["doc_id"]) for e in entries(p)], [("set", "sheetSync")])
        self.assertNotIn("if_version", entries(p)[0])
        st.apply(p["batches"])
        self.assertEqual(entries(st.plan(s0, now=NOW2)), [])

    def test_bootstrap_with_differences_needs_a_human(self):
        rows = [row("a"), row("b")]
        s0 = sheet(rows)
        st = Store.from_sheet(s0, synced=False)
        st.docs["b"]["status"] = "edited in the tracker"
        p = st.plan(s0, bootstrap=s0)
        self.assertEqual(p["batches"], [])
        self.assertIn("bootstrap", p["summary"]["abort"])
        self.assertEqual(p["summary"]["bootstrapDiffs"], [{"docId": "b", "field": "status", "sheet": "Live",
                                                           "store": "edited in the tracker"}])
        ok = st.plan(s0, bootstrap=s0, accept=True)
        self.assertEqual([e["doc_id"] for e in entries(ok)], ["sheetSync"])

    def test_baseline_without_version_is_an_input_error(self):
        rows = [row("a")]
        st = Store.from_sheet(sheet(rows))
        del st.versions["pipelineMeta/sheetSync"]
        with self.assertRaises(plan_sync.InputError):
            st.plan(sheet(rows))


class BaselineDoc(Base):
    def test_baseline_is_a_pinned_set_and_aliases_do_not_go_stale(self):
        # The store's update merges nested objects, so an update could never drop an alias.
        foo = row("foo", project="Project Foo", site="Site F")
        st = Store.from_sheet(sheet([foo, row("other")]))
        self.run_and_apply(sheet([dict(foo, id="bar", project="Project Bar"), row("other")]), store=st)
        s2 = sheet([dict(foo, id="baz", project="Project Baz"), row("other")])
        p = self.run_and_apply(s2, store=st, now=NOW2)
        last = p["batches"][-1][-1]
        self.assertEqual((last["op"], last["doc_id"], last["if_version"]), ("set", "sheetSync", 2))
        self.assertEqual(st.sheet_sync["aliases"], {"baz": "foo"})
        self.assertEqual(entries(st.plan(s2, now="2026-11-03T17:00:00.000Z")), [])
        s3 = sheet([dict(foo, id="baz", project="Project Baz"), row("other"), row("bar", site="New")])
        self.run_and_apply(s3, store=st, now="2026-11-03T18:00:00.000Z")       # the old name is reused
        self.assertEqual(entries(st.plan(s3, now="2026-11-03T19:00:00.000Z")), [])

    def test_parse_warning_is_reported_once(self):
        w = "row 9: column B (leadB) holds 'JJ'; the tracker has no field for it, so it is not synced"
        s1 = sheet(self.rows, warnings=[w])
        p = self.run_and_apply(s1)
        self.assertEqual([f["kind"] for f in p["summary"]["flags"]], ["parse-warning"])
        self.assertIn("sheetSync", [e["doc_id"] for e in entries(p)])    # so the run reports it (was 0 writes)
        again = self.assertIdempotent(s1)
        self.assertEqual(again["summary"]["flags"], [])
        p = self.run_and_apply(sheet(self.rows), now="2026-11-03T17:00:00.000Z")     # the cell is cleared
        self.assertEqual(self.store.sheet_sync["warnings"], [])

    def test_slug_is_parse_sheets_slugify(self):
        from synth import parse_sheet, fixture_text
        names = [r["project"] for name in ("sheet_2026-10-29.txt", "sheet_2026-11-02.txt")
                 for r in parse_sheet.parse_text(fixture_text(name), "x")["rows"]]
        names += ["(ACX) Project Nova", "Project Gotham [ needs new naming ]", " Project  A.B ", "Gotham [new]"]
        for n in names:
            self.assertEqual(plan_sync.slug(n), parse_sheet.slugify(n), n)


class Time(unittest.TestCase):
    def test_now_is_normalised(self):
        self.assertEqual(plan_sync.parse_now("2026-11-02T15:27:54-05:00")[1], "2026-11-02T20:27:54.000Z")
        self.assertEqual(plan_sync.parse_now("2026-11-02T20:27:54.123456Z")[1], "2026-11-02T20:27:54.123Z")
        with self.assertRaises(plan_sync.InputError):
            plan_sync.parse_now("2026-11-02T20:27:54")          # no zone

    def test_new_york_date(self):
        cases = {"2026-11-03T04:30:00Z": "2026-11-02", "2026-11-03T05:30:00Z": "2026-11-03",
                 "2026-07-01T03:59:00Z": "2026-06-30", "2026-07-01T04:00:00Z": "2026-07-01",
                 "2026-03-08T06:59:00Z": "2026-03-08", "2026-11-01T05:30:00Z": "2026-11-01"}
        for s, want in cases.items():
            t = plan_sync.parse_now(s)[0]
            self.assertEqual(plan_sync.ny_date(t), want, s)
            self.assertEqual(plan_sync._ny_date_rule(t), want, s)
        # the fallback rule agrees with the tz database hour by hour across two years
        t = datetime.datetime(2026, 1, 1, tzinfo=datetime.timezone.utc)
        while t.year < 2028:
            self.assertEqual(plan_sync._ny_date_rule(t), plan_sync.ny_date(t), t)
            t += datetime.timedelta(hours=1)

    def test_ts_ms(self):
        self.assertEqual(plan_sync.ts_ms("1970-01-01T00:00:01.500Z"), 1500)
        self.assertEqual(plan_sync.ts_ms("1970-01-01T01:00:00+01:00"), 0)
        self.assertEqual(plan_sync.ts_ms("garbage"), 0)


class Cli(unittest.TestCase):
    def test_end_to_end_and_exit_codes(self):
        rows = [row("a"), row("b")]
        s0 = sheet(rows)
        st = Store.from_sheet(s0)
        with tempfile.TemporaryDirectory() as d:
            st.write(os.path.join(d, "store"))
            sheet_json = os.path.join(d, "sheet.json")
            from synth import dump
            dump(sheet_json, sheet(edit(rows, "b", amount="9")))
            args = ["--sheet", sheet_json, "--baseline", os.path.join(d, "store", "pipelineMeta", "sheetSync.json"),
                    "--store", os.path.join(d, "store"), "--versions", os.path.join(d, "store", "versions.json"),
                    "--now", NOW]
            code, so, se = run_tool("plan_sync.py", *(args + ["--out", os.path.join(d, "out")]))
            self.assertEqual(code, 0, se)
            out = os.path.join(d, "out")
            b1 = load(os.path.join(out, "batches", "batch_01.json"))
            self.assertEqual([e["doc_id"] for e in b1], ["b", "config", "sheetSync"])
            refs = load(os.path.join(out, "batches", "batch_01.writes.json"))
            for e, r in zip(b1, refs):
                self.assertEqual(load(r["file_path"]), e["data"])
                self.assertEqual(r.get("if_version"), e.get("if_version"))
                self.assertNotIn("data", r)
            self.assertEqual(load(os.path.join(out, "sheetSync_next.json"))["rows"], load(sheet_json)["rows"])
            summ = load(os.path.join(out, "summary.json"))
            self.assertEqual((summ["writes"], summ["abort"]), (3, None))
            for k in ("changes", "newRows", "conflicts", "flags", "writes", "abort"):
                self.assertIn(k, summ)
            with open(os.path.join(out, "report.md"), encoding="utf-8") as fh:
                self.assertIn("amount", fh.read())
            # versions.json slips are bad input (exit 2: re-check step 4), not a safety abort (exit 3)
            vfile = os.path.join(d, "store", "versions.json")
            good = load(vfile)
            slips = {"missing": {k: v for k, v in good.items() if k != "b"},                 # b has a planned write
                     "typo": {("aa" if k == "a" else k): v for k, v in good.items()},       # a has none
                     "string": dict(good, b=str(good["b"]))}
            for name, bad in sorted(slips.items()):
                vpath = os.path.join(d, "versions_%s.json" % name)
                dump(vpath, bad)
                argv = [vpath if x == vfile else x for x in args] + ["--out", os.path.join(d, "out_" + name)]
                code, so, se = run_tool("plan_sync.py", *argv)
                self.assertEqual(code, 2, (name, so, se))
                self.assertIn("PLAN ERROR: versions.json", se)
            # deterministic
            code, so, se = run_tool("plan_sync.py", *(args + ["--out", os.path.join(d, "out2")]))
            self.assertEqual(load(os.path.join(d, "out2", "batches", "batch_01.json")), b1)
            # a non-empty --out is refused
            code, so, se = run_tool("plan_sync.py", *(args + ["--out", out]))
            self.assertEqual(code, 2)
            self.assertIn("new or empty", se)
            # abort exit code
            dump(sheet_json, sheet([]))
            code, so, se = run_tool("plan_sync.py", *(args + ["--out", os.path.join(d, "out3")]))
            self.assertEqual(code, 0, so + se)       # 2 missing rows: under the limit
            dump(sheet_json, dict(sheet(rows), sections=[]))
            code, so, se = run_tool("plan_sync.py", *(args + ["--out", os.path.join(d, "out4")]))
            self.assertEqual(code, 3, so + se)
            self.assertEqual(os.listdir(os.path.join(d, "out4", "batches")), ["data"])
            self.assertEqual(os.listdir(os.path.join(d, "out4", "batches", "data")), [])


if __name__ == "__main__":
    unittest.main()
