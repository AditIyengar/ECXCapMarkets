#!/usr/bin/env python3
"""Parse the "Pipeline (transactions)" sheet of Corporate Finance Pipeline_NEW.xlsx.

    python3 -I parse_sheet.py <dump.txt> <out.json> [--read-at <ISO time>]

<dump.txt> is the Microsoft 365 connector's text dump of the workbook (read_resource on
the xlsx). It is untrusted data: it is only parsed, never executed, and the script is
meant to run with `python3 -I`. Standard library only.

Output (<out.json>):

    {readAt, sheetDate, sections: [{key, label, order, labelRow, rowCount}],
     rows: [{id, section, order, sheetRow, marker, <26 text fields>}], warnings: [..]}

The parsing is a port of the 10/29 normaliser (scratchpad pipeline/normalise/
parse_pipeline.py), minus its lender-token and curated-link parts: same row walk, same
cell trimming (str.strip), same slugify and duplicate-id rule, so the ids are the ids
the tracker's store already uses.

Any structural surprise is a hard failure (exit code 2, "PARSE ERROR: ..." on stderr):
missing or duplicated sheet marker, a column span other than A..AC (29 columns), a
truncated dump, a header label that changed, super-headers that moved, an unknown or
repeated section label, a row whose id cannot be derived. It never guesses.
"""
import datetime
import json
import re
import sys

SHEET_NAME = "Pipeline (transactions)"
SHEET_PREFIX = "## Sheet: "
HEAD_RE = re.compile(r"^## Sheet: (?P<name>.*?) — (?P<nrows>\d+) rows × (?P<ncols>\d+) columns "
                     r"\((?P<c0>[A-Z]+)(?P<r0>\d+):(?P<c1>[A-Z]+)(?P<r1>\d+)\)\s*$")
NCOLS = 29
LETTERS = [chr(65 + i) for i in range(26)] + ["AA", "AB", "AC"]

# Column letter -> (row key, the header label the sheet must carry in its header row).
# Labels as in the tracker's PIPE_SHEET_COLS (and the 10/29 sheet). Header cells are trimmed
# before the comparison (the sheet writes " Amount ").
COLUMNS = [
    ("A", "marker", ""), ("B", "leadB", "Lead"), ("C", "project", "Project Name"),
    ("D", "site", "Site Name / Asset"), ("E", "sponsor", "Sponsor (McN / Herndon)"),
    ("F", "region", "Region"), ("G", "currency", "Currency"), ("H", "amount", "Amount"),
    ("I", "amountUsd", "Amount (USD)"), ("J", "fundingDate", "Funding Date"),
    ("K", "fundingMonth", "Funding Date (Month)"), ("L", "status", "Status"),
    ("M", "fundingAtClose", "Funding @close (USD)"), ("N", "ecxLead", "Lead"),
    ("O", "ecxSupport", "Support"), ("P", "description", "Description"),
    ("Q", "statusUpdate", "Status Update"), ("R", "keyIssues", "Key Issues / Gating Items"),
    ("S", "lendersLead", "Lead"), ("T", "lendersOther", "Other"), ("U", "spacerU", ""),
    ("V", "issuesTechnical", "Technical"), ("W", "issuesLegal", "Legal"), ("X", "issuesOther", "Other"),
    ("Y", "tenor", "Tenor"), ("Z", "ltc", "LTC"), ("AA", "marginFee", "Margin / Fee"),
    ("AB", "upfrontFee", "Upfront Fee"), ("AC", "capacity", "Capacity"),
]
# The super-header row (directly above the header row) holds exactly these cells.
SUPER_HEADERS = {"S": "Lenders", "V": "Issues"}
# Columns the sheet has but the tracker does not carry; they are expected to stay empty.
UNSYNCED = {"B": "leadB", "U": "spacerU"}

# The tracker's PIPE_TEXT_FIELDS, in its order.
TEXT_FIELDS = ["project", "site", "sponsor", "region", "currency", "amount", "amountUsd", "fundingDate",
               "fundingMonth", "status", "fundingAtClose", "ecxLead", "ecxSupport", "description",
               "statusUpdate", "keyIssues", "lendersLead", "lendersOther", "issuesTechnical", "issuesLegal",
               "issuesOther", "tenor", "ltc", "marginFee", "upfrontFee", "capacity"]

SECTION_LABELS = {"JVs": "jvs", "Corporate": "corporate", "Miscellaneous": "misc",
                  "Closed": "closed", "Removed": "removed"}
MONTHS = {"Jan": 1, "Feb": 2, "Mar": 3, "Apr": 4, "May": 5, "Jun": 6, "Jul": 7,
          "Aug": 8, "Sep": 9, "Oct": 10, "Nov": 11, "Dec": 12}
ID_RE = re.compile(r"^[A-Za-z0-9_\-.~:@+]{1,200}$")


class ParseError(Exception):
    pass


def fail(msg):
    raise ParseError(msg)


def slugify(name):
    """The 10/29 normaliser's slugify (the store ids were made with it). NOT the page's
    PIPE_slugify, which differs for "(ACX) Project ..." names."""
    s = name
    s = re.sub(r"\[[^\]]*\]", " ", s)              # drop bracket notes: "[]", "[ needs new naming ]"
    s = re.sub(r"\(ACX\)", " acx ", s)
    s = re.sub(r"^\s*(acx\s+)?Project\s+", r"\1", s.strip())
    s = s.lower().replace(".", "-")
    s = re.sub(r"[^a-z0-9]+", "-", s).strip("-")
    return s


def find_block(lines):
    """Return (header line index, end index) of the Pipeline sheet block. The block ends at
    the next "## Sheet: " line or at the end of the file."""
    starts = []
    for i, line in enumerate(lines):
        if not line.startswith(SHEET_PREFIX):
            continue
        m = HEAD_RE.match(line)
        name = m.group("name") if m else line[len(SHEET_PREFIX):]
        if name == SHEET_NAME or name.startswith(SHEET_NAME + " (empty)"):
            starts.append(i)
    if not starts:
        fail('sheet marker "## Sheet: %s — N rows × 29 columns (A..:AC..)" not found' % SHEET_NAME)
    if len(starts) > 1:
        fail("sheet marker for %r appears %d times (lines %s)" % (SHEET_NAME, len(starts),
                                                                  ", ".join(str(i + 1) for i in starts)))
    start = starts[0]
    end = len(lines)
    for i in range(start + 1, len(lines)):
        if lines[i].startswith(SHEET_PREFIX):
            end = i
            break
    return start, end


def read_header(line):
    m = HEAD_RE.match(line)
    if not m:
        fail("cannot read the sheet's size and range from its marker line: %r" % line[:200])
    nrows, ncols = int(m.group("nrows")), int(m.group("ncols"))
    c0, r0, c1, r1 = m.group("c0"), int(m.group("r0")), m.group("c1"), int(m.group("r1"))
    if ncols != NCOLS or c0 != "A" or c1 != "AC":
        fail("unexpected column span %s..%s (%d columns); expected A..AC (29 columns)" % (c0, c1, ncols))
    if r1 < r0 or nrows != r1 - r0 + 1:
        fail("marker says %d rows but range is rows %d..%d" % (nrows, r0, r1))
    return nrows, r0, r1


def parse_body(body, first_row):
    """Return ({sheetRow: [29 raw cells]}, {cell: formula}, next row number). Handles
    "[k empty rows]" markers and cells whose embedded line breaks split one row over
    several physical lines (joined back with "\\n")."""
    rows, formulas = {}, {}
    r = first_row
    i = 0
    in_formulas = False
    while i < len(body):
        line = body[i]
        if in_formulas:
            fm = re.match(r"^([A-Z]+\d+): (=.*)$", line)
            if fm:
                formulas[fm.group(1)] = fm.group(2)
            elif line.strip():
                fail("unexpected line in the Formulas block: %r" % line[:200])
            i += 1
            continue
        if line == "Formulas:":
            in_formulas = True
            i += 1
            continue
        em = re.match(r"^\[(\d+) empty rows?\]$", line)
        if em:
            r += int(em.group(1))
            i += 1
            continue
        if line == "" and i == len(body) - 1:
            i += 1
            continue
        buf = line
        span = 1
        while buf.count("\t") < NCOLS - 1:
            if i + span >= len(body):
                fail("row %d ends before %d columns" % (r, NCOLS))
            buf = buf + "\n" + body[i + span]
            span += 1
        if buf.count("\t") != NCOLS - 1:
            fail("row %d has %d columns; expected %d" % (r, buf.count("\t") + 1, NCOLS))
        rows[r] = buf.split("\t")
        r += 1
        i += span
    return rows, formulas, r


def parse_date(raw):
    m = re.match(r"^(\d{1,2}) ([A-Z][a-z]{2}) (\d{4})$", raw or "")
    if m and m.group(2) in MONTHS:
        try:
            return datetime.date(int(m.group(3)), MONTHS[m.group(2)], int(m.group(1))).isoformat()
        except ValueError:
            return raw
    return raw


def parse_text(text, read_at):
    lines = text.split("\n")
    start, end = find_block(lines)
    nrows, r0, r1 = read_header(lines[start])
    rows, formulas, next_row = parse_body(lines[start + 1:end], r0)
    if next_row != r1 + 1:
        fail("the dump holds rows %d..%d but the marker says %d..%d (truncated or malformed dump)"
             % (r0, next_row - 1, r0, r1))
    if not rows:
        fail("the sheet has no rows")

    def cell(r, letter):
        return rows.get(r, [""] * NCOLS)[LETTERS.index(letter)].strip()

    def nonempty(r):
        return [(LETTERS[k], v.strip()) for k, v in enumerate(rows[r]) if v.strip()]

    header_rows = [r for r in sorted(rows) if cell(r, "C") == "Project Name"]
    if len(header_rows) != 1:
        fail("expected exactly one header row (column C = 'Project Name'), found %d" % len(header_rows))
    header_row = header_rows[0]
    bad = []
    for letter, key, label in COLUMNS:
        got = cell(header_row, letter)
        if got != label:
            bad.append("%s%d is %r, expected %r" % (letter, header_row, got, label))
    if bad:
        fail("header labels changed: " + "; ".join(bad))
    super_row = header_row - 1
    supers = dict(nonempty(super_row)) if super_row in rows else {}
    if supers != SUPER_HEADERS:
        fail("super-headers moved: row %d holds %s, expected %s" % (
            super_row, json.dumps(supers, ensure_ascii=False), json.dumps(SUPER_HEADERS)))

    sheet_date = None
    for r in sorted(rows):
        if r >= super_row:
            break
        cells = nonempty(r)
        for k, (letter, v) in enumerate(cells):
            if v == "Date:" and k + 1 < len(cells):
                sheet_date = parse_date(cells[k + 1][1])
                break
        if sheet_date is not None:
            break

    sections = [{"key": "pipeline", "label": "Pipeline", "order": 0, "labelRow": None}]
    cur = "pipeline"
    order_in = {"pipeline": 0}
    out_rows, seen, warnings = [], {}, []
    for r in sorted(rows):
        if r <= header_row:
            continue
        ne = nonempty(r)
        if not ne:
            continue
        if len(ne) == 1 and ne[0][0] == "C":
            label = ne[0][1]
            if label not in SECTION_LABELS:
                fail("unknown section label %r at row %d (a row with only column C filled is read as a "
                     "section label; known labels: %s)" % (label, r, ", ".join(SECTION_LABELS)))
            key = SECTION_LABELS[label]
            if key in order_in:
                fail("section label %r appears twice (row %d)" % (label, r))
            sections.append({"key": key, "label": label, "order": len(sections), "labelRow": r})
            cur = key
            order_in[key] = 0
            continue
        order_in[cur] += 1
        rec = {"id": None, "section": cur, "order": order_in[cur], "sheetRow": r, "marker": cell(r, "A")}
        for letter, key, label in COLUMNS:
            if key in TEXT_FIELDS:
                rec[key] = cell(r, letter)
        for letter, key in sorted(UNSYNCED.items()):
            v = cell(r, letter)
            if v:
                warnings.append("row %d: column %s (%s) holds %r; the tracker has no field for it, so it is "
                                "not synced" % (r, letter, key, v[:80]))
        base = slugify(rec["project"])
        if not base:
            fail("row %d has no usable project name in column C (%r), so it has no id" % (r, rec["project"]))
        rid = base
        if rid in seen:
            rid = base + "-" + cur
        if rid in seen:
            fail("cannot disambiguate id %r (rows %d and %d)" % (rid, seen[rid], r))
        if not ID_RE.match(rid) or rid in (".", ".."):
            fail("row %d: id %r is not a valid document id" % (r, rid))
        seen[rid] = r
        rec["id"] = rid
        out_rows.append(rec)

    counts = {}
    for rec in out_rows:
        counts[rec["section"]] = counts.get(rec["section"], 0) + 1
    for s in sections:
        s["rowCount"] = counts.get(s["key"], 0)
    return {"readAt": read_at, "sheetDate": sheet_date, "sections": sections, "rows": out_rows,
            "warnings": warnings}


def now_iso():
    t = datetime.datetime.now(datetime.timezone.utc)
    return t.strftime("%Y-%m-%dT%H:%M:%S.") + "%03dZ" % (t.microsecond // 1000)


def main(argv):
    args = list(argv)
    read_at = None
    if "--read-at" in args:
        k = args.index("--read-at")
        if k + 1 >= len(args):
            sys.stderr.write("usage: parse_sheet.py <dump.txt> <out.json> [--read-at ISO]\n")
            return 2
        read_at = args[k + 1]
        del args[k:k + 2]
    if len(args) != 2:
        sys.stderr.write("usage: parse_sheet.py <dump.txt> <out.json> [--read-at ISO]\n")
        return 2
    src, out = args
    try:
        with open(src, encoding="utf-8") as fh:
            text = fh.read()
        doc = parse_text(text, read_at or now_iso())
    except ParseError as e:
        sys.stderr.write("PARSE ERROR: %s\n" % e)
        return 2
    except (OSError, UnicodeDecodeError) as e:
        sys.stderr.write("PARSE ERROR: cannot read %s: %s\n" % (src, e))
        return 2
    with open(out, "w", encoding="utf-8") as fh:
        json.dump(doc, fh, ensure_ascii=False, indent=1)
        fh.write("\n")
    print("parsed %d rows in %d sections (%s); sheet date %s; %d warning(s)" % (
        len(doc["rows"]), len(doc["sections"]),
        ", ".join("%s %d" % (s["key"], s["rowCount"]) for s in doc["sections"]),
        doc["sheetDate"], len(doc["warnings"])))
    for w in doc["warnings"]:
        print("warning: " + w)
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
