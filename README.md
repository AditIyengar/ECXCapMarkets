# ECX Capital Markets — Corporate Finance dashboards

Two static, self-contained dashboards for the EdgeConneX Corporate Finance / Capital Markets
team. Both are plain HTML that read a committed data file — no build step, no server, no keys.

| | What it is | Data refreshed by |
|---|---|---|
| [`index.html`](index.html) | **Bank Conversation Dashboard** — lender relationships, commitments, fees | Ad-hoc Claude session (SharePoint + Outlook) |
| [`taskflow/index.html`](taskflow/index.html) | **TaskFlow** — to-do board, Outlook calendar, Outlook cleanup | Scheduled Claude Code session — see [REFRESH.md](REFRESH.md) |

---

## TaskFlow — the desk site

Successor to the TaskFlow Claude artifact, rebuilt as a real site. Three tabs:

- **Board** — tasks grouped by project (Austin, Ashville, Scioto, Canyon, Leroy, Enigma, AI),
  with due/overdue chips, a "needs attention" strip, search, and per-project filtering
- **Calendar** — Outlook month grid + day agenda in Mountain Time, with all-day location holds,
  tentative flags, and automatic detection of overlapping meetings
- **Outlook cleanup** — one-button scan that finds the automated construction and PM status
  reports loose in your Inbox and lists them against their destination folder, with an Outlook
  deep link per message and a filing rule that stops them piling up again

**The architecture:** Claude Code is the backend. A scheduled session pulls the calendar, scans
the inbox, and pushes `data/taskflow.js`. The page is static and keyless. Your own edits —
completions, added tasks, deletions, filing tick-offs — live in `localStorage` keyed by item id,
so a data refresh never clobbers them and never resurrects something you deleted.

The page never sends mail, moves mail, or changes anything in Outlook — the Microsoft 365
connector is read-only, so cleanup produces a worklist and a rule rather than executing moves.

---

## Bank Conversation Dashboard

Tracks bank and lender relationships across the debt portfolio:

- **Who we've spoken to** — every bank/lender conversation, with dates
- **What was discussed** — call notes per meeting (appetite, pricing, structure, next steps)
- **Materials shared** — teasers, term sheets, RfP packages, models, rating packages
- **Commitments & facilities** — per-bank lender commitments across facilities
- **Fees** — upfront/arranger fees paid per bank where recorded

## Sources

Data is extracted from (as of 2026-07-23):

1. **SharePoint** — `Corporate Finance_Team / 12. Portfolio Management - Loans Outstanding /`
   - `07. Bank Conversation Tracker - Claude/CF Pipeline Transcipt/` — weekly CF Pipeline call notes
     & transcripts (Mar–Apr 2026, 46 meeting records)
   - `07. Bank Conversation Tracker - Claude/Resources/Syndication Trackers/` — per-project
     syndication trackers (Wahoo, Shiner, Tarpon, Walleye, Beluga: lender roles, commitments, fee tiers)
   - `04. Debt Overviews / 02. Portfolio Commitments / EdgeConneX Commitments (Q2.2026)_VF.xlsx` —
     **authoritative** per-bank commitments across 22 facilities ($24.79bn, reconciled)
   - `04. Debt Overviews / 09. Lender Fees / Lender Fees Summary_7.21.26_VF.xlsx` —
     bank × deal fee matrix for 2025–2026 transactions ($259.5m total, reconciled)
2. **Outlook email** — `Call Notes: {Bank}` threads sent to the DCM distribution list
   (12 meeting records, Jul 2026: SMBC, MUFG, BMO, Barclays, Apollo/Apterra, CIBC, CPPIB…)

## Structure

```
index.html                       — Bank Conversation Dashboard (self-contained)
data/data.js                     — its dataset (banks, meetings, facilities, commitments, fees)
taskflow/index.html              — TaskFlow desk site (self-contained)
data/taskflow.js                 — its dataset (projects, tasks, calendar, cleanup scans)
tools/build-standalone.js        — inlines the dataset into one shareable file
dist/taskflow-standalone.html    — generated; the exact page published to the artifact URL
REFRESH.md                       — refresh contract, publishing steps, scheduling
```

Open either file in a browser, or serve the repo with GitHub Pages — both render entirely
client-side from their data file.

## Refreshing the bank data

The dataset is a point-in-time extraction. To refresh, re-run a Claude session with access to
the SharePoint folder and mailbox, and ask it to regenerate `data/data.js` following the schema
documented at the top of that file. The dashboard itself does not need to change.

## Known data caveats

- The commitments workbook grid flattens on extraction: facility totals and per-bank portfolio
  totals are verified against workbook subtotals, but some individual bank × facility cells are
  only attributed where confidently parseable (full caveat list is shown on the dashboard's
  Facilities tab).
- Beluga figures are EUR (accordion book still open as of 2/20/26 tracker).
- Wahoo fee-tier bps interpretation (old money 10/5/0 bps vs 25 bps new money) needs confirmation.
- The mailbox history starts mid-July 2026, so email-sourced meetings only cover that period;
  earlier meetings come from the SharePoint call notes.
