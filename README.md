# ECX Capital Markets — Bank Conversation Dashboard

A dynamic dashboard for the EdgeConneX Corporate Finance / Capital Markets team that tracks
bank and lender relationships across the debt portfolio:

- **Who we've spoken to** — every bank/lender conversation, with dates
- **What was discussed** — call notes per meeting (appetite, pricing, structure, next steps)
- **Materials shared** — teasers, term sheets, RfP packages, models, rating packages
- **Commitments & facilities** — per-bank lender commitments across facilities
- **Fees** — upfront/arranger fees paid per bank where recorded

## Sources

Data is extracted from:

1. **SharePoint** — `Corporate Finance_Team / 12. Portfolio Management - Loans Outstanding /
   07. Bank Conversation Tracker - Claude/`
   - `Bank Conversation Tracker_2026.xlsx` (monthly lender call notes by bank & project)
   - `CF Pipeline Transcipt/` (CF pipeline call notes & transcripts)
   - `Resources/Syndication Trackers/` (per-project syndication trackers: commitments, tiers, fees)
2. **Outlook email** — bank meeting / call notes threads

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
