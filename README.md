# ECX Capital Markets — Bank Conversation Dashboard

A dynamic dashboard for the EdgeConneX Corporate Finance / Capital Markets team that tracks
bank and lender relationships across the debt portfolio:

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
index.html      — the dashboard (single self-contained file, no external dependencies)
data/data.js    — extracted dataset (banks, meetings, facilities, commitments, fees)
```

Open `index.html` in a browser (or serve the repo with GitHub Pages) — the dashboard loads
`data/data.js` and renders entirely client-side.

## Refreshing the data

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
