"""parse_sheet.py: the real fixtures, the id rules and every structural guard."""
import json
import os
import tempfile
import unittest

from synth import FIXTURES, fixture_text, load, parse_sheet, run_tool

READ_AT = "2026-11-02T20:00:00.000Z"
F1029 = "sheet_2026-10-29.txt"
F1102 = "sheet_2026-11-02.txt"
TF = parse_sheet.TEXT_FIELDS


def parse(text):
    return parse_sheet.parse_text(text, READ_AT)


def lines_of(name):
    return fixture_text(name).split("\n")


def replace_line(lines, pred, fn):
    out, n = [], 0
    for line in lines:
        if pred(line):
            line = fn(line)
            n += 1
        out.append(line)
    assert n == 1, n
    return "\n".join(out)


def cells(line):
    return line.split("\t")


class RealSheets(unittest.TestCase):
    def test_1029_equals_the_proven_normalisation(self):
        got = parse(fixture_text(F1029))
        want = load(os.path.join(FIXTURES, "expected_rows_2026-10-29.json"))
        self.assertEqual(len(got["rows"]), 36)
        keys = ["id", "section", "order", "sheetRow", "marker"] + TF
        self.assertEqual([{k: r[k] for k in keys} for r in got["rows"]], want)
        self.assertEqual(set(got["rows"][0]), set(keys))      # leadB / spacerU are not carried
        self.assertEqual(got["sheetDate"], "2026-10-29")
        self.assertEqual(got["readAt"], READ_AT)
        self.assertEqual([s["key"] for s in got["sections"]], ["pipeline", "jvs", "corporate", "misc", "closed", "removed"])
        self.assertEqual([s["rowCount"] for s in got["sections"]], [22, 3, 3, 3, 4, 1])
        self.assertEqual(got["warnings"], [])

    def test_1102_has_gotham_inserted(self):
        a, b = parse(fixture_text(F1029)), parse(fixture_text(F1102))
        self.assertEqual(len(b["rows"]), 37)
        g = [r for r in b["rows"] if r["id"] == "gotham-refi"][0]
        self.assertEqual((g["section"], g["order"], g["sheetRow"], g["project"], g["status"]),
                         ("pipeline", 9, 16, "Project Gotham Refi", "Kick-off"))
        old = {r["id"]: r for r in a["rows"]}
        for r in b["rows"]:
            if r["id"] != "gotham-refi":
                self.assertEqual({f: r[f] for f in TF}, {f: old[r["id"]][f] for f in TF})
        self.assertEqual(b["sheetDate"], "2026-11-02")

    def test_ids_duplicate_rule_and_slugify(self):
        ids = [r["id"] for r in parse(fixture_text(F1029))["rows"]]
        self.assertIn("mirai", ids)
        self.assertIn("mirai-removed", ids)
        self.assertIn("acx-marvel-ii", ids)                   # "(ACX) Project Marvel II"
        self.assertIn("metropolis-ii", ids)                   # "Project Metropolis II [ needs new naming ]"
        self.assertIn("cmh12", ids)                           # "Project [] CMH12"
        self.assertIn("beluga-2-0", ids)                      # "Project Beluga 2.0 "
        self.assertEqual(parse_sheet.slugify("(ACX) Project Atlas "), "acx-atlas")
        self.assertEqual(parse_sheet.slugify("Project Gotham Refi"), "gotham-refi")

    def test_marker_column_and_trimming(self):
        rows = {r["id"]: r for r in parse(fixture_text(F1029))["rows"]}
        self.assertEqual(rows["liverpool"]["marker"], "`")
        self.assertEqual(rows["salar"]["amount"], "5.6bn")    # " 5.6bn " in the sheet
        self.assertEqual(rows["salar"]["currency"], "EUR")    # "EUR "
        self.assertEqual(rows["liverpool"]["fundingMonth"], "End of  October")   # inner spacing kept

    def test_other_sheets_after_the_block_are_ignored(self):
        text = fixture_text(F1102) + "## Sheet: Prioritization — 1 rows × 2 columns (B2:C2)\nsecret\t1\n"
        self.assertEqual(parse(text)["rows"], parse(fixture_text(F1102))["rows"])
        pre = "Workbook: 2 worksheets.\n1. Pipeline (transactions)\n2. X\n\n"
        self.assertEqual(parse(pre + text)["rows"], parse(fixture_text(F1102))["rows"])

    def test_multiline_cell_is_joined(self):
        lines = lines_of(F1102)

        def split_cell(line):
            c = cells(line)
            c[15] = "Facility\nincrease"
            return "\t".join(c)
        text = replace_line(lines, lambda l: "\tProject Leroy II\t" in l, split_cell)
        rows = {r["id"]: r for r in parse(text)["rows"]}
        self.assertEqual(rows["leroy-ii"]["description"], "Facility\nincrease")
        self.assertEqual(rows["leroy-ii"]["sheetRow"], 52)
        self.assertEqual(rows["mirai-removed"]["sheetRow"], 55)

    def test_unsynced_columns_warn(self):
        def put_b(line):
            c = cells(line)
            c[1] = "Sander"
            return "\t".join(c)
        text = replace_line(lines_of(F1102), lambda l: "\tProject Crane\t" in l, put_b)
        w = parse(text)["warnings"]
        self.assertEqual(len(w), 1)
        self.assertIn("column B", w[0])


class StructuralGuards(unittest.TestCase):
    def assertFails(self, text, fragment):
        with self.assertRaises(parse_sheet.ParseError) as cm:
            parse(text)
        self.assertIn(fragment, str(cm.exception))

    def test_missing_marker(self):
        text = "\n".join(l for l in lines_of(F1102) if not l.startswith("## Sheet:"))
        self.assertFails(text, "not found")

    def test_duplicate_marker(self):
        self.assertFails(fixture_text(F1102) + fixture_text(F1102), "appears 2 times")

    def test_column_count_in_marker(self):
        text = fixture_text(F1102).replace("29 columns (A3:AC55)", "30 columns (A3:AD55)", 1)
        self.assertFails(text, "column span")

    def test_column_count_in_a_row(self):
        text = replace_line(lines_of(F1102), lambda l: "\tProject Crane\t" in l, lambda l: l + "\textra")
        self.assertFails(text, "columns")

    def test_header_label_change(self):
        text = replace_line(lines_of(F1102), lambda l: "\tProject Name\t" in l,
                            lambda l: l.replace("\tStatus Update\t", "\tLatest Update\t"))
        self.assertFails(text, "header labels changed")

    def test_inserted_column_shifts_labels(self):
        def shift(line):
            c = cells(line)
            return "\t".join(c[:5] + ["New"] + c[5:-1])
        text = replace_line(lines_of(F1102), lambda l: "\tProject Name\t" in l, shift)
        self.assertFails(text, "header labels changed")

    def test_super_headers_moved(self):
        def move(line):
            c = cells(line)
            c[18], c[19] = "", "Lenders"
            return "\t".join(c)
        text = replace_line(lines_of(F1102), lambda l: "\tLenders\t" in l, move)
        self.assertFails(text, "super-headers moved")

    def test_unknown_section_label(self):
        def relabel(line):
            c = cells(line)
            c[2] = "Joint Ventures"
            return "\t".join(c)
        text = replace_line(lines_of(F1102), lambda l: cells(l)[2:3] == ["JVs"], relabel)
        self.assertFails(text, "unknown section label 'Joint Ventures'")

    def test_repeated_section_label(self):
        def relabel(line):
            c = cells(line)
            c[2] = "JVs"
            return "\t".join(c)
        text = replace_line(lines_of(F1102), lambda l: cells(l)[2:3] == ["Corporate"], relabel)
        self.assertFails(text, "appears twice")

    def test_truncated_dump(self):
        lines = lines_of(F1102)
        cut = next(i for i, l in enumerate(lines) if "\tProject Leroy II\t" in l)
        self.assertFails("\n".join(lines[:cut]), "truncated")

    def test_row_without_project_name(self):
        def blank_c(line):
            c = cells(line)
            c[2] = ""
            return "\t".join(c)
        text = replace_line(lines_of(F1102), lambda l: "\tProject Crane\t" in l, blank_c)
        self.assertFails(text, "no usable project name")

    def test_third_duplicate_cannot_be_disambiguated(self):
        lines = lines_of(F1102)
        k = next(i for i, l in enumerate(lines) if "\tProject Mirai\tKyotonabe\t" in l)
        lines.insert(k + 1, lines[k])
        text = "\n".join(lines).replace("53 rows × 29 columns (A3:AC55)", "54 rows × 29 columns (A3:AC56)")
        self.assertFails(text, "cannot disambiguate")


class Cli(unittest.TestCase):
    def test_ok_and_failure_exit_codes(self):
        with tempfile.TemporaryDirectory() as d:
            out = os.path.join(d, "s.json")
            code, so, se = run_tool("parse_sheet.py", os.path.join(FIXTURES, F1102), out, "--read-at", READ_AT)
            self.assertEqual(code, 0, se)
            self.assertEqual(load(out), parse(fixture_text(F1102)))
            bad = os.path.join(d, "bad.txt")
            with open(bad, "w", encoding="utf-8") as fh:
                fh.write(fixture_text(F1102).replace("\tStatus Update\t", "\tUpdate\t"))
            out2 = os.path.join(d, "s2.json")
            code, so, se = run_tool("parse_sheet.py", bad, out2)
            self.assertEqual(code, 2)
            self.assertIn("PARSE ERROR: header labels changed", se)
            self.assertFalse(os.path.exists(out2))


if __name__ == "__main__":
    unittest.main()
