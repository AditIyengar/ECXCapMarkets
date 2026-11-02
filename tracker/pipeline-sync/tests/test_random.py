"""Seeded random scenarios: Excel edits and tracker edits mixed together. For every plan that is
not aborted: apply it to a local store, then check the invariants and that a re-plan writes
nothing. Deterministic (fixed seed)."""
import copy
import random
import unittest

from synth import NOW, NOW2, Store, entries, parse_sheet, plan_sync, row, sheet

TF = plan_sync.TEXT_FIELDS
SECS = plan_sync.SECTION_KEYS
WORDS = ["alpha", "bravo", "x signed x funded", "- one - two", "TBD", "", "5y", "EUR", "Kick-off", "Paused",
         "x a  x b", "x a x b", "Live"]


def initial(rng):
    rows = []
    for i in range(14):
        rows.append(row("deal-%02d" % i, rng.choice(SECS[:5]), status=rng.choice(WORDS), amount=rng.choice(WORDS)))
    return rows


def excel_edit(rng, rows, n_new):
    rows = copy.deepcopy(rows)
    for _ in range(rng.randint(0, 4)):
        k = rng.randrange(6)
        if k == 0 and rows:                                   # field edit
            r = rng.choice(rows)
            r[rng.choice(TF[1:])] = rng.choice(WORDS)
        elif k == 1:                                          # insert a row
            n_new[0] += 1
            rows.insert(rng.randrange(len(rows) + 1), row("new-%03d" % n_new[0], rng.choice(SECS),
                                                          status=rng.choice(WORDS)))
        elif k == 2 and len(rows) > 6:                        # delete a row
            rows.pop(rng.randrange(len(rows)))
        elif k == 3 and rows:                                 # move to another section
            rng.choice(rows)["section"] = rng.choice(SECS)
        elif k == 4 and len(rows) > 1:                        # swap two rows
            i, j = rng.randrange(len(rows)), rng.randrange(len(rows))
            rows[i], rows[j] = rows[j], rows[i]
        elif k == 5 and rows:                                 # rename (same site and sponsor)
            r = rng.choice(rows)
            n_new[0] += 1
            r["id"] = "renamed-%03d" % n_new[0]
            r["project"] = "Project Renamed %03d" % n_new[0]
    return rows


def tracker_edit(rng, store):
    ids = sorted(store.docs)
    for _ in range(rng.randint(0, 3)):
        k = rng.randrange(4)
        d = store.docs[rng.choice(ids)]
        if k == 0:
            d[rng.choice(TF)] = rng.choice(WORDS) + " (team)"
        elif k == 1:
            d["order"] = rng.randint(1, 20)
        elif k == 2:
            d["section"] = rng.choice(SECS)
        else:
            d["stage"] = rng.choice(["prep", "terms", ""])
            d["paused"] = rng.choice([True, False])


class RandomScenarios(unittest.TestCase):
    def test_invariants_and_idempotency(self):
        rng = random.Random(20261102)
        applied_runs = aborted = 0
        for trial in range(120):
            rows = initial(rng)
            store = Store.from_sheet(sheet(rows))
            n_new = [0]
            for step in range(4):
                tracker_edit(rng, store)
                rows = excel_edit(rng, rows, n_new)
                seen_ids = set()
                rows = [r for r in rows if not (r["id"] in seen_ids or seen_ids.add(r["id"]))]
                new_sheet = sheet(rows)
                before = copy.deepcopy(store)
                base = {r["id"]: r for r in before.sheet_sync["rows"]}
                aliases = before.sheet_sync.get("aliases") or {}
                p = store.plan(new_sheet, now=NOW)
                if p["summary"]["abort"]:
                    aborted += 1
                    self.assertEqual(p["batches"], [])
                    store = before
                    rows = [dict(r) for r in before.sheet_sync["rows"]]
                    continue
                for e in entries(p):
                    self.assertIn(e["op"], ("set", "update"))
                    if e["collection"] == "pipeline" and e["op"] == "update":
                        for k in ("stage", "paused", "trackerProject", "marker"):
                            self.assertNotIn(k, e["data"])
                        did = e["doc_id"]
                        # a field the tracker changed since the baseline is never overwritten
                        sheet_id = next((sid for sid, d in aliases.items() if d == did), did)
                        b = base.get(sheet_id)
                        for f in TF:
                            if f in e["data"] and b is not None:
                                self.assertTrue(plan_sync.same(f, before.docs[did][f], b[f]),
                                                (trial, step, did, f))
                store.apply(p["batches"])
                applied_runs += 1
                again = store.plan(new_sheet, now=NOW2)
                self.assertEqual(entries(again), [], (trial, step, again["summary"]))
                self.assertTrue(set(store.docs) >= set(before.docs))        # nothing deleted
        self.assertGreater(applied_runs, 300)


# ---- names reused, deleted and restored, renamed and reverted; deals added and moved in the tracker

NAMES = ["Project Mirai", "Project Mirai", "Project Gotham", "Gotham [new]", "Project Foo", "Project Bar",
         "Project Atlas", "Project Lyra", "Project Vega"]


def parsed(deals):
    """deals in sheet order -> a parsed sheet with parse_sheet's ids (slug; a repeat gets -<section>),
    or None where the parser would refuse the sheet (an id it cannot disambiguate)."""
    seen, rows = set(), []
    for key in SECS:
        for d in deals:
            if d["section"] != key:
                continue
            rid = parse_sheet.slugify(d["project"])
            if rid in seen:
                rid = rid + "-" + key
            if rid in seen:
                return None
            seen.add(rid)
            rows.append(dict(d, id=rid))
    return sheet(rows)


def excel_edit2(rng, deals, graveyard, n):
    deals = copy.deepcopy(deals)
    for _ in range(rng.randint(1, 3)):
        k = rng.randrange(7)
        if k == 0 and deals:                                  # field edit
            rng.choice(deals)[rng.choice(TF[1:])] = rng.choice(WORDS)
        elif k == 1:                                          # a new deal, often with a name already in use
            n[0] += 1
            deals.insert(rng.randrange(len(deals) + 1), row("x", rng.choice(SECS), project=rng.choice(NAMES),
                                                            site="S%d" % n[0], sponsor=rng.choice(["McN", "Herndon"]),
                                                            statusUpdate="x deal %d" % n[0]))
        elif k == 2 and len(deals) > 4:                       # delete, kept for an undo
            i = rng.randrange(len(deals))
            graveyard.append((i, deals.pop(i)))
        elif k == 3 and graveyard:                            # undo a delete
            i, d = graveyard.pop()
            deals.insert(min(i, len(deals)), d)
        elif k == 4 and len(deals) > 1:                       # swap two rows
            i, j = rng.randrange(len(deals)), rng.randrange(len(deals))
            deals[i], deals[j] = deals[j], deals[i]
        elif k == 5 and deals:                                # rename, and later maybe revert it
            d = rng.choice(deals)
            d.setdefault("_old", []).append(d["project"])
            d["project"] = rng.choice(NAMES + ["Project New %d" % n[0]])
        elif k == 6:
            ds = [d for d in deals if d.get("_old")]
            if ds:
                d = rng.choice(ds)
                d["project"] = d["_old"].pop()
    return deals


def tracker_edit2(rng, store, team):
    for _ in range(rng.randint(0, 2)):
        ids = sorted(store.docs)
        k = rng.randrange(4)
        if k == 0:                                            # PIPE_create: next order, no sheetRow
            sec = rng.choice(SECS)
            name = rng.choice(NAMES)
            base = plan_sync.slug(name) or "deal"
            did, m = base, 1
            while did in store.docs:
                m += 1
                did = "%s-%d" % (base, m)
            orders = [d.get("order") or 0 for d in store.docs.values() if d.get("section") == sec]
            d = {f: "" for f in TF}
            d.update(project=name, site="team", section=sec, order=int(max(orders + [0])) + 1, sheetRow=None,
                     trackerProject=None, marker="", updatedAt=NOW, updatedBy="AI",
                     history=[{"at": NOW, "by": "AI", "field": "created", "from": "", "to": name}])
            store.docs[did], store.versions[did] = d, 1
            team[did] = True
        elif k == 1:                                          # PIPE_reorder, strict swap with a neighbour
            did = rng.choice(ids)
            sec = store.docs[did].get("section")
            lst = sorted((i for i in ids if store.docs[i].get("section") == sec),
                         key=lambda i: plan_sync.cmp_key(plan_sync.clean_doc(i, store.docs[i])))
            i = lst.index(did)
            j = i + rng.choice([-1, 1])
            if 0 <= j < len(lst):
                a, b = store.docs[lst[i]], store.docs[lst[j]]
                a["order"], b["order"] = b.get("order"), a.get("order")
        elif k == 2:                                          # a field edit (never on the team's own deals)
            did = rng.choice([i for i in ids if i not in team] or ids)
            store.docs[did][rng.choice(TF)] = rng.choice(WORDS) + " (team)"
        else:
            did = rng.choice(ids)
            store.docs[did]["stage"] = rng.choice(["prep", "terms", ""])


class RandomNames(unittest.TestCase):
    def test_reused_names_undo_reverts_and_team_deals(self):
        rng = random.Random(20261103)
        applied_runs = 0
        for trial in range(80):
            deals = [row("x", rng.choice(SECS[:5]), project=NAMES[i % len(NAMES)], site="S0-%d" % i,
                         sponsor="McN", statusUpdate="x seed %d" % i) for i in range(8)]
            sh = parsed(deals)
            if sh is None:
                continue
            store = Store.from_sheet(sh)
            graveyard, n, team = [], [0], {}
            for step in range(5):
                tracker_edit2(rng, store, team)
                new_deals = excel_edit2(rng, deals, graveyard, n)
                new_sheet = parsed(new_deals)
                if new_sheet is None:
                    continue
                before = copy.deepcopy(store)
                p = store.plan(new_sheet, now=NOW)                  # never an InputError (a wedged sync)
                if p["summary"]["abort"]:
                    continue
                deals = new_deals
                base = {r["id"]: r for r in before.sheet_sync["rows"]}
                aliases = before.sheet_sync.get("aliases") or {}
                for e in entries(p):
                    if e["collection"] != "pipeline":
                        continue
                    self.assertNotIn(e["doc_id"], team, (trial, step, "a deal added in the tracker was written"))
                    if e["op"] == "update":
                        for k in ("stage", "paused", "trackerProject", "marker"):
                            self.assertNotIn(k, e["data"])
                        sid = next((x for x, d in aliases.items() if d == e["doc_id"]), e["doc_id"])
                        b = base.get(sid)
                        for f in TF:
                            if f in e["data"] and b is not None:
                                self.assertTrue(plan_sync.same(f, before.docs[e["doc_id"]][f], b[f]),
                                                (trial, step, e["doc_id"], f))
                    else:
                        self.assertNotIn(e["doc_id"], before.docs)
                store.apply(p["batches"])
                applied_runs += 1
                again = store.plan(new_sheet, now=NOW2)
                self.assertEqual(entries(again), [], (trial, step, again["summary"]))
                self.assertEqual(again["summary"]["flags"], [], (trial, step))     # every flag raised once
                self.assertTrue(set(store.docs) >= set(before.docs))
                for did in team:                                    # the team's deals are untouched
                    if did in before.docs:
                        self.assertEqual(store.docs[did], before.docs[did], (trial, step, did))
        self.assertGreater(applied_runs, 250)


if __name__ == "__main__":
    unittest.main()
