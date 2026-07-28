# ECX Capital Markets — Bank Conversation Dashboard: Team Handoff

Welcome to the DCM team's bank conversation dashboard project. This guide covers what the
dashboard is, where its data comes from, how to use it, and how to keep it up to date.

## What this is

A self-contained HTML dashboard tracking the corp finance / capital markets team's lender
relationships across the global debt portfolio:

| Question | Where it's answered |
|---|---|
| Which banks have we spoken to, and when? | **Bank Meetings** tab (58 records, Mar–Jul 2026) |
| What was discussed in each meeting? | Expandable meeting cards with discussion summaries and next steps |
| What materials were shared? | **Materials Shared** tab + per-meeting tags |
| Total lender commitments per bank? | **Banks** tab + Overview chart ($24.79bn across 123 lenders, Q2 2026) |
| Facilities and lender rosters? | **Facilities & Commitments** tab (22 facilities with roles/tickets) |
| Fees paid to each bank? | **Fees** tab ($259.5m combined 2025–26, 57 banks, by year) |

This replaces the earlier `ECX_Tracker_v24.html` (the ~600KB single-blob React tracker in the
SharePoint `Coding/` folder). The key improvement: **data and presentation are separated** —
`data/data.js` is a small documented dataset, `index.html` is the viewer and never needs editing
during a data refresh.

## Repository layout

```
index.html      the dashboard — open it in any browser, no install or server needed
data/data.js    the dataset (schema documented in the file header)
README.md       sources and data caveats
ONBOARDING.md   this guide
```

Branch: `claude/corp-finance-dashboard-0pfe6k` on `AditIyengar/ECXCapMarkets`.

## How to use it

1. Clone the repo (or download `index.html` + `data/`) and open `index.html` in a browser, **or**
   use the private artifact link (ask Aditya — it can be shared from the artifact's share menu).
2. Filters under the tabs scope everything: free-text search, bank, project, source
   (SharePoint vs email call notes), and date range. The ◐ button toggles dark mode.
3. Click meeting rows, bank cards, and facility cards to expand details.
4. Check the **Data caveats** card at the bottom of the Facilities tab before quoting numbers —
   it lists cells that could not be fully verified from the source extractions.

## Data sources (as of 2026-07-23)

All in SharePoint under `Corporate Finance_Team / 12. Portfolio Management - Loans Outstanding /`
plus the DCM mailbox:

1. `07. Bank Conversation Tracker - Claude / CF Pipeline Transcipt/` — weekly CF Pipeline call
   notes & transcripts (note the folder-name typo "Transcipt" is real)
2. `07. Bank Conversation Tracker - Claude / Resources / Syndication Trackers/` — per-project
   trackers (Wahoo, Shiner, Tarpon, Walleye, Beluga) for lender roles/tiers/fees
3. `04. Debt Overviews / 02. Portfolio Commitments / EdgeConneX Commitments (Q2.2026)_VF.xlsx` —
   **authoritative** per-bank commitments (Chris Wenger publishes this monthly to the DCM list)
4. `04. Debt Overviews / 09. Lender Fees / Lender Fees Summary_7.21.26_VF.xlsx` — bank × deal
   fee matrix, 2025–2026
5. **Outlook**: `Call Notes: {Bank}` emails to `dcm@edgeconnex.com` (the team convention —
   authored by Aditya, Sander, Marjolein, Rithika, Laura)

## How to refresh the data

The dataset is a point-in-time extraction; refresh it by re-running a Claude session (Claude Code
on the web with the Microsoft 365 connector, from this repo). Paste a prompt like:

> Refresh `data/data.js` for the bank conversation dashboard. Re-extract:
> (1) new CF Pipeline call notes/transcripts from the SharePoint "Bank Conversation Tracker -
> Claude/CF Pipeline Transcipt" folder, (2) new "Call Notes:" emails to the DCM list,
> (3) the latest "EdgeConneX Commitments" and "Lender Fees Summary" workbooks under
> 04. Debt Overviews. Follow the schema documented at the top of `data/data.js`, verify
> totals reconcile against the workbook subtotals, update `meta.as_of`, render-test
> `index.html`, and push to the branch.

Rules for a clean refresh:

- **Never edit `index.html` for a data update** — only `data/data.js` changes.
- Bank names must stay canonical (one spelling per institution) or the Banks tab rollups split;
  the existing dataset is the reference for spellings.
- Reconcile before pushing: facility totals vs the commitments workbook grand total, and the
  fee matrix vs the fee summary's 2025/2026/combined grand totals.
- Keep `meta.data_gaps` honest — add caveats for anything not fully verifiable.

## Known caveats (inherited by whoever refreshes next)

- Excel text extraction flattens grids: per-bank × per-facility cells are attributed only where
  confidently parseable; facility and portfolio totals are verified.
- Beluga figures are EUR; its accordion book was still open in the 2/20/26 tracker.
- Wahoo fee-tier bps interpretation (old money 10/5/0 bps vs 25 bps new money) still needs
  confirmation from the deal team.
- The mailbox history starts mid-July 2026; earlier meetings come from SharePoint only.
- "Narwhal" vs "Narluga" appear inconsistently in the source call notes (both Ares/holdco
  workstreams) and are kept as written.

## Ideas queued for future iterations

- Recurring scheduled refresh (weekly, after the Wednesday CF Pipeline call)
- GitHub Pages deployment for a permanent team URL
- Sync check against Chris Wenger's monthly commitments email (flag drift automatically)
- Per-bank contact details (the old v24 tracker had these; not yet migrated)
