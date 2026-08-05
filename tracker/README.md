# ECX Fundraising Tracker — Live Artifact Edition

**Live URL (stable across versions):** https://claude.ai/code/artifact/a64c39ce-7e3b-4d10-a556-5c889d6e0bdb

`ecx-tracker.html` is the **master** — the single live file, published under the stable name "ECX Fundraising Tracker — Master" (the artifact title never changes). Internal version numbers live only in the header's LAST_REFRESH stamp and the changelog; each release is archived as a copy under `tracker/versions/ECX_Tracker_v<NN>.html` (v60 onward; git history covers everything). Originally built from `ECX_Tracker_v50.html`. It is published as a claude.ai Artifact so the team opens one URL instead of passing versioned HTML files around. The artifact is private by default — share it with the team from the page's share menu.

## How this edition differs from the SharePoint file

Artifacts run under a strict Content-Security-Policy that blocks every external host, so the file was made fully self-contained:

- **React 18.2.0 + ReactDOM** inlined (previously cdnjs CDN).
- **DM Sans + Libre Baskerville** embedded as woff2 data URIs (previously Google Fonts).
- **Bank logos** embedded in a `BANK_ICONS` data-URI map, fetched at build time from Google's favicon service (DuckDuckGo/direct favicon.ico for the few Google misses). 45 of 50 mapped domains have real icons; the rest use the existing monogram fallback (`kgibank.com.tw`, `ctbcbank.com`, `entiebank.com.tw`, `feib.com.tw`, `fubon.com` — same banks that already fell back in v50, since Google has no 64px icon for them).
- **Old claude.ai postMessage shim removed** (lines 1–287 of v50: console/fetch/`URL.createObjectURL` overrides + `html-to-image`). App code never used it, and the `createObjectURL` override would have broken the Save button.
- **Save/export buttons** use the artifact `downloads` capability (`window.claude.downloads.save`, viewer confirms each save) when present, falling back to plain anchor downloads when the file is opened directly in a browser. The 5-minute autosave is disabled inside the artifact viewer (each save would pop a confirmation prompt).
- **Static pre-render snapshot** inside `<div id="root">` replaced with a small loading placeholder (it was stale v20-era markup and only visible for a flash).
- Outer `<html>/<head>/<body>` tags removed — the artifact publisher wraps the content in its own document skeleton.

Nothing else changed: all data, tabs, and behavior are identical to v50.

## Updating the live tracker (new versions)

1. Make the data/UI edits to `ecx-tracker.html` (same conventions as before — see the instructions doc).
2. Bump the version in the `<title>` tag.
3. Ask Claude to republish `tracker/ecx-tracker.html` — same file path (or, from another conversation, the URL above passed as `url`) keeps the same link. **Do not rename the file**: a new path mints a new URL.
4. Commit the new version to this repo (git history replaces the v24…v50 rollback-copies convention).

## Rebuilding from a SharePoint version

If a new version is produced in the old single-file workflow instead:

```
python3 fetch_assets.py     # re-fetch fonts + favicons (needs network)
python3 build_artifact.py   # assemble from the source v50-style file (edit SRC/OUT paths)
```

`build_artifact.py` asserts on v50's exact line landmarks and patch anchors — review its patches against the new source before trusting it on a later version.

## Known limits (unchanged by design — static file, no backend)

- Inputs/Review entries live in each person's browser (`localStorage`) until synced through Claude — they are not shared between viewers.
- The Save button exports the current DOM; inside the artifact viewer that export includes the viewer's wrapper markup, so treat it as an escape-hatch backup, not a re-uploadable source file. The source of truth is this repo + the artifact.
