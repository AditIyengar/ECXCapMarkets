# v51 Changelog (8/4/26) — Live Artifact Edition

*(Paste into `ECX_Tracker_Upload_Instructions.md` to keep the changelog contiguous.)*

## v51 Changelog (8/4/26) — Shared Live Artifact
- **The tracker is now a live claude.ai Artifact**: https://claude.ai/code/artifact/a64c39ce-7e3b-4d10-a556-5c889d6e0bdb — one stable URL for the whole team instead of circulating versioned HTML files. Private by default; share with the team from the page's share menu. Each new version republishes to the same URL (with a version history in the artifact's version picker).
- **Fully self-contained for the artifact sandbox** (which blocks all external hosts): React/ReactDOM inlined; DM Sans + Libre Baskerville embedded as data-URI woff2; bank logos embedded at build time into a `BANK_ICONS` map (45/50 real icons; the 5 Taiwanese banks Google had no icon for keep the monogram fallback, same as v50). Verified offline in Chromium: app mounts, all 8 tabs render, zero network requests, zero console errors, all 14 font faces load, 0 broken logo images; all JS blocks pass `node --check`.
- **Legacy claude.ai shim removed** (the v1-era console/fetch/createObjectURL postMessage bridge + html-to-image at the top of the file) — unused by app code and its `createObjectURL` override would have broken the Save button inside the artifact.
- **Save/export wired to the artifact downloads capability**: Save button and the Inputs/Review .txt exports call `window.claude.downloads.save` (viewer confirms each save; `.html` falls back to `.txt` if the viewer's allowlist requires it) and keep the old anchor-download path when the file is opened outside the artifact. **5-minute autosave disabled inside the artifact** — it would prompt the viewer every 5 minutes; manual Save remains.
- **Stale static pre-render snapshot** in `#root` (v20-era markup, the "flash" noted in v31) replaced with a loading placeholder.
- **New source of truth**: `tracker/ecx-tracker.html` on the `AditIyengar/ECXCapMarkets` repo (branch `claude/shared-live-artifact-pncjxl`), with build scripts. Git history supersedes the v24–v50 rollback-copy convention; the SharePoint Coding folder copies remain as the pre-artifact archive.
- Versioning convention unchanged: bump the `<title>` version each sync; the artifact filename stays `ecx-tracker.html` (the URL is bound to the path — renaming would mint a new URL).
- Unchanged/by design: Inputs/Review entries are still per-browser until synced through Claude (no backend); logos/fonts no longer need internet at view time.
