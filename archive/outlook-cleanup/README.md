# Archived — Outlook cleanup tab

Built 2026-08-10, archived the same day at the user's request ("remove that outlook cleanup
tab for now and archive it"). Nothing here is wired into the live site.

## What it did

A **Outlook cleanup** tab with one button. Pressing *Scan inbox* revealed the automated
construction / PM status reports sitting loose in the Inbox, matched against their destination
folder, with an Outlook deep link per message, a local "tick off" to track what you had filed,
and a copy-ready Outlook rule.

At archive time it was finding 13 messages — EDCATL11 ×2, EDCATL12/13, EDCAUS11/16 ×2, AUS02,
PHX11, PHX12, New Albany South ×3, and the PCX PMO weekly — all forwarded by Laura Godschalx.

## Why it worked the way it did

Two constraints shaped it, and both still hold:

1. **`Const. Updates` has no subfolders.** The mailbox folder listing showed
   `childFolderCount: 0` against a flat folder already holding 24 filed reports. There is one
   destination, not a per-site routing table. Re-check this before rebuilding — if subfolders
   get created, the scan should route to them.
2. **The Microsoft 365 connector is read-only.** It exposes search and read tools but no
   move/update/delete, so neither the page nor the refresh session can move mail. That is why
   the button produced a worklist plus an Outlook rule rather than executing the filing. The
   rule was the real fix — it files future reports on arrival.

If a write-capable mail connector becomes available, the scan already carries everything needed
to execute the moves: message ids are embedded in each `webLink`, and the destination folder is
named on the scan.

## Restoring it

| File | Goes back into |
|---|---|
| `dataset-section.js` | `data/taskflow.js` — paste as a top-level `cleanup:` key |
| `render.js` | `taskflow/index.html` — paste alongside the other render functions |

Then re-add the wiring that was removed:

- **Tab** — add `{ k: "cleanup", label: "Outlook cleanup", n: unfiled }` to the `defs` array in
  `renderTabs()`, and dispatch it in `render()`.
- **Derived state** — `scans()`, `scanItems(scan)`, `unfiledCount()` (see git history:
  `git log -S "unfiledCount" -- taskflow/index.html`).
- **Local state** — `L.filed` in the `load()` defaults, so tick-offs persist.
- **Click handlers** — `data-scan`, `data-filed`, `data-copyrule`, and add those three to the
  `closest(...)` selector in the click delegation.
- **Styles** — the `/* outlook cleanup */` block (`.scanbox`, `.scanhead`, `.scanblurb`,
  `.scanidle`, `.scanresult`, `.scansum`, `.notice`, `.rulebox`, `.scannotes`, `.scanstamp`).
- **KPI** — the "To file" tile.

The full working version is one commit: `git show 7942e76`.

## The filing rule

Worth keeping regardless of whether the tab comes back — setting this once in Outlook solves
the underlying problem without any of the above:

```
Apply this rule after the message arrives
  From: lgodschalx@edgeconnex.com
  and Subject contains any of:
    · Construction Weekly Review
    · Construction Status Report
    · Construction Report for
    · Weekly Construction Report
    · Weekly Touchpoint - PM Report
    · PM Touchpoint Report
    · PMO Weekly Status Update
    · Edge PHX
Do the following
  Move to folder: Const. Updates  ·  Stop processing more rules
```

Deliberately does **not** match the Austin GW Campus coordination-call agendas — those are
meeting agendas rather than status reports and should stay in the Inbox.
