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

## v52 Changelog (8/4/26) — Grouped Cards + One-Tab Inputs with Live Apply

### Grouped project cards (workstreams broken out on expand)
- **Project Leroy II**: one card, three workstreams broken out when expanded — Leroy Upsize (~$1bn, potential $2bn), Addition of Austin Campus ($300m McNair Parent close 30-May-26), Addition of Norway (TBD, feeds Salar). Card still ranks at $1bn. BMO's "Leroy Upsize" projects key renamed to "Project Leroy II" — BMO now exact-name linked to the card.
- **Project Narluga (HoldCo)** — merged card (was two: "Project Narluga" + "Narwhal IV"): $1.35bn combined, workstreams Narluga Initial Facility ($350m) and Narwhal IV Upsize ($1.0bn). Named to match the existing lender key "Project Narluga (HoldCo)", which had been linking to nothing — 7 lender cards (Apollo, Ares, Brookfield, Oaktree, etc.) now link and carry the exposure. Active Projects count 25 → 24.
- **Project Salar — Norway & Finland**: workstreams Norway ($2.58bn / 264MW) and Finland ($1.88bn / 192MW) broken out. Apollo's "Project Salar" key renamed to the exact card name (now linked). Note: "Project Vaasa — Finland" remains a separate card and overlaps Salar's Finland leg (both 192MW McNair) — candidate for consolidation, flagged to Aditya.
- **Wahoo — DevCo RCF (Closed tab)**: the four Wahoo closings (Wahoo I Jul-24 $1.2bn, Wahoo II Jan-25, Upsize I Dec-25 → $2.0bn, Upsize II Mar-26 → $2.5bn) now render as ONE grouped card; expanding shows every closing (each still expandable to full lender/fees/funds-flow detail). Bonus: Wahoo I (2024) is visible again — it matched no year filter before. Year-filter counts now computed from data.
- New card affordances: "▤ N workstreams" chip in the header; workstream sub-panels show name + size chip + description. Cards without workstreams unchanged.

### Inputs & Review — one tab, approval applies live
- **Single "✍️ Inputs & Review" tab** replaces Inputs + ✅ Review (old components retained as dead code). Compose (date / initials / entry text) gains two structured fields: **Link lender(s)** (dropdown → chips) and **documented call / meeting** checkbox.
- **Approve & apply**: approving an entry linked to lender(s) folds it into the tracker data instantly in that browser — note added to each linked lender card (source: "Team input — Inputs tab"), lastContact bumped only if marked as documented call and newer. Sorting, search, chips and stat boxes all reflect it immediately (memoized views recompute via a data-version bump). ↩ Undo cleanly reverses (note removed, lastContact restored).
- **Why not fully automatic for everyone**: the artifact runtime on this account has no shared-state capability (downloads + read-only MCP only), so a static page cannot push data to other viewers. Approved entries re-apply from localStorage on every open in that browser; the periodic Claude sync ("Copy sync digest" → paste to Claude) bakes them into the published version for the whole team, and baked ids (SYNCED_INPUT_IDS) auto-clear local queues — loop unchanged from v49/50.
- Sync digest now carries [lenders: …] and [documented call] tags so the bake applies exactly what the approver saw.
- QC: all JS blocks node --check clean; paren/brace/bracket balance zero; Playwright offline test green (approve→apply→undo on Apollo verified, incl. lastContact 7/23/26 → 8/3/26 → restore).

## v53 Changelog (8/4/26) — Inputs Sync: Ashville 1 & 2 Sized at $2.4bn Each
- Synced approved inputs digest entry [#1785867667640] (8/4/26 — AI): "ashville 1 and ashville 2 are 2.4BN each".
- **Project Scioto — Ashville 1**: Finance Size $4.8bn → **$2.4bn** (description + metric note the revision; the prior $4.8bn evidently covered both phases). Linked lenders' pipeline exposure adjusts automatically.
- **Project Scioto — Ashville 2**: Finance Size TBD → **$2.4bn**; now ranks in the size sort next to Ashville 1 instead of at the bottom. Capacity / building / timing still TBC (standing open item narrows to those).
- Id baked into SYNCED_INPUT_IDS — the entry auto-clears from browser queues on next open.

## v54 Changelog (8/4/26) — Multi-Region Tags (Global / NA)
- **Project Narluga (HoldCo), Project Leroy II and LC Facilities are now tagged both Global and NA** — two pills on the card, and the cards match both the Global and US region filters.
- Mechanics: a project's `region` can now hold multiple tags in one string ("Global / NA"). New helpers `REGION_TOKENS()` (split for display — one pill per tag) and `regionMatches()` (filtering — any tag matches; NA aliases to the US filter, EMEA to Europe). Applied on project cards, the lender-card project panel, project chips (border color = first tag), and both region filters (projects + lenders).
- Side fix: EMEA-tagged projects (Spigola, Vaasa, Salar, Herring) previously matched no filter option — they now correctly appear under Europe.

## v55 Changelog (8/4/26) — Start-Here Panel + Expected Close Dates
- **"🧭 New here? How this tracker works" panel** at the top of the Inputs & Review landing tab: condensed onboarding — what the tracker is, one-line tour of every tab, the 3-step Inputs workflow (add → approve applies live in your browser → sync digest bakes it in for everyone), and the backing sources. Collapsible; the collapsed state is remembered per browser (localStorage `ecx_intro_collapsed_v1`), so it greets newcomers and stays out of regulars' way.
- **Expected Close box on every Active Projects card** (green, next to Expected Size), sourced from `Corporate Finance Pipeline_NEW.xlsx` — Pipeline (transactions) sheet, "Funding Date" column, read live from SharePoint 8/4/26 (file lives in Eelco's OneDrive under M&A/Project Everest…/Resources; last modified 5/20/26). Populated: Leroy II 26Q2 · Metropolis I 26Q2 · Salar 26Q3 · Vaasa 26Q3 (via the combined Salar row) · Marvel III/Atlas 26Q2 · Mirai 26H1 · Narluga (HoldCo) 26Q1 · Metropolis II shows "Paused" (per file status). All other cards show TBD — their Funding Date cells are blank in the file. HoldCo workstreams carry their own close lines (Narluga 26Q1 / Narwhal IV TBD). Tab header notes the source.
- Observed in the pipeline file but NOT yet tracker cards (flagged, not added): **Project Orca II** (2nd EMEA securitization, 26Q4), **Project Copia** (US landbanking, EQT-led), **Project Nemo** (equipment facility $1-2bn — exists as a GS card chip only). Also: file shows Narluga funding 26Q1 (looks stale vs. the 15-May-26 target) and Metropolis I at $850m vs the card's $640m — worth a reconciliation pass on the next pipeline sync.

## v56 Changelog (8/4/26) — Bank Outreach on Active Projects
- **New "🏦 Bank Outreach" section** on expanded project cards + "🏦 N banks approached" header pill: every institution talked to about the deal, grouped by status — Lead/Mandated · Invited · Support · In dialogue · Proposal received · **Declined** (red, struck through). Hover for detail (invite tier, wallet %, decline reason, dates); chips click through to lender cards where one exists.
- **Sources:** the CANONICAL `Corporate Finance Pipeline_NEW.xlsx` (03. Finance Process/CF Pipeline — modified 8/4/26; the copy previously read for v55 closes sat in the M&A Resources folder and is stale): Pipeline sheet lead/support columns, **"Bank Matrix II"** sheet (incl. explicit "declined" cells) and **"Ashville Wallet"** invite tiers — plus Outlook-derived call notes already in the tracker (Vendace decline reasons etc.). 14 projects populated (~90 bank-status rows), incl. Ashville 1 (MS lead 60% wallet + 13 tiered invites), Salar (CACIB/Natixis/Rabo/SG mandated + 7 CLAs + Apollo/PIMCO proposals), Metropolis I (5 MLAs 87% approved), Liverpool→LC Facilities (BBVA/SG/NTX leads; ABN AMRO, Mizuho, BNP, CACIB, UniCredit, LBBW **declined**), Vendace syndication (BNP/BBVA/MUFG declined w/ reasons).
- **⚠ Pipeline deltas observed in the canonical 8/4 file, NOT yet applied to cards (need a deliberate resync):** Narluga moved to CLOSED (signed 21-May, funded $351m 10-Jun) while the tracker shows it active; Ashville 1 & 2 shown at [3.8]bn / 245MW each vs. the team-input $2.4bn baked in v53; Salar now EUR 5.6bn (card: $4.46bn) with Salar I (Finland, Oct-26) / Salar II (Norway) split; Leroy II now "adding Austin Campus, **Finland**" (not Norway), 26Q3; Metropolis I $800m Jun-26 (card: $640m); Narwhal IV $1.5bn 26Q3; Mirai REMOVED; new projects with no cards: Liverpool ($2.5bn LC program), Copia ($900m, BNP/BMO/RBC/Nomura/ING), Orca II & III, Beluga VAT (150-175m), Beluga 2.0, Vendace II, ICADE JV, Project Enigma; new Prioritization sheet with month-level targets and an Aditya lead column on several deals.

## v57 Changelog (8/4/26) — Lender Commitments Tab
- **New "Lender Commitments" tab** (between Lender Fees and Global Cap Table), built from **Chris Wenger's `EdgeConneX Commitments (07.17.2026).xlsx`** — Overview tab (banks × facilities, USD at EUR/USD 1.14, as of 6/30/2026), read live from `04. Debt Overviews/02. Portfolio Commitments/`.
- Mirrors the Lender Fees tab: summary cards (Total Commitments $24.79bn · 123 institutions · 22 facilities · largest = Blackstone $1.75bn), **Summary by Bank** sorted by total with expandable per-facility breakdowns (facility + region + amount, largest first), and a **Matrix — by Facility** view (all 22 facility columns, sticky bank column, column totals row). Bank-name filter box.
- Data QC: parsed with a per-row checksum against the file's own Total column and a per-facility tie-out against the file's Grand Total row — **every column ties to the dollar** (Apollo Capital Management + Apterra Beluga memo rows included, matching the file's Beluga total; RBC $1 rounding accepted). Totals computed in the component, never hardcoded (same convention as fees).
- Backleverage badges: Blackstone −$600m / Morgan Stanley +$600m per the file's Backleverage column; headline totals exclude it (footnoted).
- Note: the $24.79bn here is the commitments-file universe (incl. $1.88bn LCs, HoldCo investor commitments, ABS noteholders) — intentionally broader than the cap table's $22.06bn Notes Payable Overview universe.
- Guide sources table gains a "Commitments by bank" row. Refresh workflow: when Chris's next commitments file lands, ask Claude to "refresh the Lender Commitments tab from the latest commitments file".

## v58 Changelog (8/4/26) — Paying Rates on Cap Table + Outreach↔Lender Sync + Sort Caption
- **Cap table "Rate" column renamed "Rate — Paying" and now answers "what are we actually paying?"** The old sub-line was the file's All-In Cost = margin + the 6/30 spot index fixing (contractual float, NOT hedge-adjusted). Now: hedged floaters show a green effective line — "paying X% — SOFR/EURIBOR swapped @ Y%" (margin + the 6/30/26 swap fixed rate) or "capped — base ≤ strike (max X%)" — sourced from the **Hedging Summary (7.13.2026) sheet** in the same Debt Overview workbook (column pairing verified: Webster cap notional matches Notes Payable to the dollar; Wahoo T3 average matches to 0.01%). Swap rates loaded: Wahoo 3.25% · Beluga 2.18% · Gotham SFL 3.77% · Bluefin 3.61% · Tarpon SFL 3.45% · Shiner 3.32% · Walleye 3.71% · Metropolis 3.58%; caps: Webster 3.75%, Ares HoldCo 3.00% EUR tranche (second 4.50% SOFR cap footnoted). Unhedged rows now say "all-in @ spot — floats". Effective rate applies to the hedged notional (Hedge % column); expanded Terms line carries the instrument + rate. Note: current spot fixings ≈ swap rates, so the numbers barely move today — the label now makes the basis explicit.
- **Bank Outreach ↔ lender cards now can't disagree** (fixes "GS under Project Austin but Austin not on the GS card"): the two were separate structures — lender projects{} (drives card chips + pipeline stats) vs project outreach[] (v56). A load-time backfill reflects every outreach entry onto the bank's card: lead/invited/support/dialogue/proposal → projects{} (linked chip + Active Pipeline exposure, note prefixed with the status), declined → rejectedProjects{}. Normalized-name dedupe prevents duplicates against near-miss existing keys. Effects incl.: GS +Project Austin (pipeline $10.8bn), Salar leads/CLAs on all mandated banks' cards, Liverpool declines on BNP/Mizuho/CACIB rejected lists.
- **Active Lenders caption fixed**: said "sorted by most recent conversation" — the sort has been active-pipeline-first since v43; caption was stale. Now reads "sorted by active pipeline exposure (largest first; ties by most recent conversation)".

## v59 Changelog (8/5/26) — Outlook Sweep: Kutxabank + Santander NDA
- Swept Aditya's mailbox for call notes since 8/3 (answering "do notes auto-refresh?" — they don't; each sweep is a sync producing the next version).
- **New lender card: Kutxabank** (53 lenders) from Marjolein's "Meeting notes - Kutxabank 5/8" email to DCM: relationship call (Carmela Delso, Alejandro Mendezona, Naia Eroa) following the €20m Beluga transfer via SocGen sell-down — carried as an existing facility ($23m/€20m). Spanish bank expanding corporate banking (EQT relationship via Zelestra); EMEA/US/Australia; PF, LevFin, RE + LC; €30-50m sweet spot, max €115m; prefers BTS/hyperscale. Next step: add to the Project Salar invite list — linked to the Salar card (projects key + outreach entry, status "in dialogue"). Renders monogram (no embedded icon).
- **Santander**: NDA for the market catch-up workstream executed by ECX 8/4 and sent for countersignature (Santander redline 8/3) — note added; lastContact NOT bumped (document exchange, not a call — stays 7/23/26).
- Other 8/4-8/5 traffic reviewed and out of scope for lender cards: Austin campus DD/permit-matrix thread (Kimley-Horn), Ashville PCX PPA drafts (AO Shearman), Ashville LTA report final, Leroy PowerConneX punchlist (K&S) — project workstream documents, not bank conversations.

## v60 Changelog (8/5/26) — Last-Refresh Stamp + Weekday Auto-Refresh Routine
- **Header now shows freshness**: "🔄 Last refreshed [date/time ET] (vNN) · auto-sweeps Outlook call notes weekday evenings (ET)" under the tracker subtitle, driven by a LAST_REFRESH constant updated on every sync/refresh.
- **Automated refresh scheduled**: a routine fires every weekday at 6:30 PM ET (5:30 PM in winter — cron is UTC-fixed) into the tracker maintenance session. Each run: sweeps Aditya's Outlook + Bank Meetings folder for bank call/meeting notes since the last stamp, folds them into cards under the standing conventions (new cards as needed; lastContact only for documented calls; project/outreach links kept in lockstep), runs the full QC suite, republishes to the same artifact URL, updates the stamp, commits + pushes. Quiet stamp-only republish when nothing new; Aditya is pinged only on material changes or failures. Fallback: if a headless run can't reach the Microsoft 365 connector, it skips without touching anything and flags only on repeat failure.

## v61 Changelog (8/5/26) — Master Naming Convention
- **The published page is now permanently titled "ECX Fundraising Tracker — Master"** — the name no longer changes with each release. Version numbers appear only in the header's Last-refreshed stamp ("… (v61)"), this changelog, and the archive.
- **Releases are archived as copies in `tracker/versions/`** (`ECX_Tracker_v60.html`, `ECX_Tracker_v61.html`, …) alongside git history, replacing the version-in-title convention. The artifact URL and file path are unchanged.
- The weekday auto-refresh routine was updated to follow the same convention (stable title, stamp-only version bump, archive copy per release).

## v62 Changelog (8/5/26) — Guide Rewritten to Current State
- **📖 Guide fully rebuilt.** It had drifted badly: still described a versioned file saved into the SharePoint Coding folder ("v36 → v37"), listed only five tabs, and never mentioned the Master naming, the auto-refresh, the Commitments tab, Bank Outreach, Expected Close, workstreams or the hedge-adjusted cap-table rates.
- **What this tracker is** — rewritten around the permanent "ECX Fundraising Tracker — Master" page at one unchanging link, the header refresh stamp as the freshness signal, and the archive-per-release convention.
- **Sources table** now 8 rows and current: call notes (noting the automatic weekday sweep) · Lender Commitments from `EdgeConneX Commitments (07.17.2026).xlsx` Overview · Lender Fees from Chris's monthly summary · Global Cap Table from the June Debt Overview *Notes Payable Overview sheet only* plus the **Hedging Summary sheet** behind "Rate — Paying" · project sizes + Expected Close from `Corporate Finance Pipeline_NEW.xlsx` (pointing at the **canonical 03. Finance Process/CF Pipeline copy**, with a warning that stale copies exist under M&A folders) · **Bank Outreach** from Bank Matrix II / Ashville Wallet · closed deals · team inputs.
- **How it gets updated** — now three routes in priority order: automatic weekday-evening Outlook sweep, Inputs & Review approve-applies-live, and ask-Claude-on-request, plus how versioning/rollback works under the Master convention.
- **Reading each tab** — all 8 tabs documented with their current affordances (pipeline-exposure sort, stat boxes, workstream panels, Bank Outreach status groups incl. struck-through declines, grouped Wahoo family, commitments matrix, paying-rate column and the amber off-overview note).
- **New "⚠️ Conventions worth knowing" section**: the two deliberate commitment universes ($22.06bn cap table vs $24.8bn commitments file) and when to quote each; exact-name lender↔project linkage; Last Contact = documented conversation only; Inputs are per-browser until synced; every figure is footnoted to its source.

## v63 Changelog (8/5/26) — Auto-Refresh Sweep: Truist Lending Pause + AUS10 20-Bank Outreach List
- First automated weekday-evening run. Swept Aditya's mailbox for bank call/meeting notes since the v62 stamp (8/5/26, 1:06 PM ET). Two material threads found and applied; header stamp now reads 8/5/26, 6:30 PM ET (v63).
- **New lender card: Truist** (54 lenders), status **Capacity Limited** — from Mark Morrison (MD, Head of Digital Infrastructure IB, Truist Securities): Truist is "currently on a data center lending pause due to breaching our KRI sector lending limit" and has "had to pass on more than a handful of other Tier I relationship credit asks." Not a deal-specific decline — a house-level sector limit, so it is carried as capacity-limited rather than rejected. September meeting being scheduled; Joe in Austin Sept 2. Existing Wahoo facility $104.2m carried from the commitments file. lastContact 8/5/26 (documented email exchange with the coverage MD).
- **Project Austin bank outreach expanded 4 → 20 banks** from the "AUS10 Series: Bank Outreach List" thread (Aditya 7/31 list, confirmed by Johan 8/5): **Goldman Sachs lead/mandated**; Tier 1 invites — Barclays, BNP Paribas, Mizuho, MUFG, Natixis, Rabobank, SMBC, SocGen, TD; other invites — JP Morgan, Morgan Stanley, NordLB, RBC, Truist, Wells Fargo; Eelco added BBVA, ING, CACIB. In dialogue: BNP Paribas ("throw BNP a bone after Metropolis" — Johan) and CIBC (conditional on getting there on LCs). Morgan Stanley added by Joe following David Dulberg's departure from SocGen; Truist carried on the list with the pause noted, Joe wanting "to find a path with Truist."
- Lead Banks metric and card description updated to reflect the confirmed 20-bank list. The v58 outreach↔lender backfill propagates every new entry to the corresponding lender cards (Austin chips + Active Pipeline exposure), so the two views stay in lockstep.
- **Flagged:** 5 banks on the AUS10 list still have no lender card — Barclays, TD, NordLB, RBC, Wells Fargo. Their outreach chips render but don't click through. All five appear in the commitments file as existing lenders and are candidates for cards on a future sweep.
- QC: all 5 script blocks pass `node --check`; offline Playwright smoke test green (zero console/page errors, 54 lenders, Truist card renders with Austin chip + capacity-limited badge, Austin shows 20 banks across Lead/Invited/In-dialogue groups, GS↔Austin linkage intact). Archived to `tracker/versions/ECX_Tracker_v63.html`.

## v64 Changelog (8/6–8/7/26) — Auto-Refresh: Ares Call-Protection Hold, MS/Ashville Covenant Grid, SMBC ABS Market Read
Covers two auto-refresh sweeps (8/6 and 8/7). v63 was archived but never published — v64 supersedes it and carries all of its content forward. Header stamp now reads 8/7/26, 6:30 PM ET (v64).

**Ares / HoldCo — Narwhal IV term sheet on hold.** Johan Hylander (EQT) 8/6: "Let's hold off a minute as we are working through the repayment with Ares to see if we can reduce call protection and it might change things slightly in the term sheet." A&O Shearman had the TS and updated Credit Agreement ready for Latham / Ares; Laura had asked for the green light to send. New Ares note also captures the open commercial points carried from Ares' 7/23 summary (Margaret Osmulski), which were not previously in the tracker: ~$800m pro rata repayment of Tranches A1–A3 / B1–B3; commitment fee step (Ares proposal 100bps to the 6-month anniversary, then 150bps, vs 150bps flat in the TS); $1bn drawable at close + $500m activatable within 6 months with a cancellation fee on any unactivated amount; 10bps amendment fee limited to tranches with call protection outstanding (A4, B4, SA4, SB4); prepayment premium end-date mismatch (voluntary through Feb-27 vs mandatory April-26) now aligned in the draft; Ares running the co-investment process for all proposed lenders except Oaktree (GIC, PSP, BCI, IMCO, NPS, ADIA, CDPQ, CPPIB). Ares nextSteps, the HoldCo outreach chip, and the Narwhal IV workstream all reflect the hold. lastContact unchanged (2/10/26) — no call.

**Morgan Stanley — Ashville covenant grid + open model questions.** Akilesh Raman (Associate, MS GCM) resent the latest covenant grid on 8/7, clean plus a Litera redline against the 6/16/26 version — the same file Cahill sent to Davis Polk. Two model questions from counsel's OM comments remain open: how opex is estimated (which EC-incurred costs beyond the Power Plant Capacity Fee), and the assumed [8.0]% interest expense with the OpCo/HoldCo vs. PowerCo allocation. MS is finishing a model update reflecting the executed lease and will revert on both. Akilesh Raman and Maya Matejcek added to contactDetails. **David Dulberg** has started at MS (VP, Global Capital Markets, from SocGen) — contact details circulated by Eelco 8/6; he is the natural first call when the AUS10 teaser goes out. lastContact stays 7/28/26 (email exchanges, no call).

**SMBC — weekly ABS market read.** New Bond & Market Intelligence entry (8/7/26) from SMBC Nikko's Digital Infrastructure & Esoteric ABS update, delivering on the 7/22 commitment to send market colour: $9.4bn ABS priced across 11 deals this week (YTD ~$258.0bn, +13.3% YoY); July payrolls −23k with the curve repricing to one hike by January and <50% odds in September; **Texas running a verification of data center projects advancing through ERCOT interconnection** — the same programme as the Governor's 8/3 audit directive, and a constructive data point for both the AUS02 (Shiner) power situation and the AUS10 power story; DC ABS secondary on 8/7 — Vantage VDC 2025-1 A2 at +156, QTS QTSII 2026-2 A2 at +180, Vantage VDCR 2024-1 B at +250. lastContact stays 7/22/26 (research distribution).

**Project Austin (AUS10).** Outreach list expanded 4 → 20 banks off the "AUS10 Series: Bank Outreach List" thread (Aditya 7/31, confirmed by Johan 8/5): GS lead; Tier 1 — Barclays, BNP Paribas, Mizuho, MUFG, Natixis, Rabobank, SMBC, SocGen, TD; other — JP Morgan, Morgan Stanley, NordLB, RBC, Truist, Wells Fargo; plus BBVA, ING and CACIB added by Eelco/Johan. In dialogue: BNP Paribas ("throw BNP a bone after Metropolis") and CIBC (conditional on LCs). Per Joe Harar 8/6, the refreshed EdgeConneX Company Overview & Financial Snapshot (Q2 2026 — consolidated Herndon + McNair with Herndon / ACX / Chayora / McNair breakouts; 1H26 run-rate 2,581 contracted MW, $4.1bn revenue, $3.4bn EBITDA) goes out to AUS10 prospective lenders alongside the teaser and model.

**New lender card: Truist** (54 lenders), status **Capacity Limited** — Mark Morrison (MD, Head of Digital Infrastructure IB, Truist Securities): Truist is "currently on a data center lending pause due to breaching our KRI sector lending limit" and has "had to pass on more than a handful of other Tier I relationship credit asks." A house-level sector limit rather than a deal-specific decline, so it is carried as capacity-limited, not rejected. September meeting being scheduled; Joe in Austin Sept 2 and wants "to find a path with Truist." Existing Wahoo facility $104.2m carried from the commitments file. lastContact 8/5/26.

**Project Shiner (AUS02, closed).** Closed-deal description now records the 8/6/26 "Project Shiner — AUS02 Lender Power Update (Aug 2026)" deck circulated by Chris Wenger to the lender group and to Turntown, with the Texas Governor's 8/3 data center audit directive as backdrop.

**UI fix — note `materials` field now renders.** Ten notes already carried a `materials` field that no component displayed, so captured materials were invisible. Added a rendered materials chip (amber) above each note's body, so the standing "capture materials exchanged" convention actually surfaces in the UI — this retroactively exposes the materials on all pre-existing notes too.

**Flagged:** 5 banks on the AUS10 list still have no lender card — Barclays, TD, NordLB, RBC, Wells Fargo. Their outreach chips render but don't click through. All five appear in the commitments file as existing lenders (TD is also a Shiner lender) and are candidates for cards on a future sweep.

QC: all 5 script blocks pass `node --check`; offline Playwright smoke test green (zero console/page errors, zero external requests, 54 lenders, title unchanged as "ECX Fundraising Tracker — Master", Austin at 20 banks across Lead/Invited/In-dialogue, Ares hold + MS covenant grid + SMBC ERCOT text all rendering, lastContact values held where no call occurred). Archived to `tracker/versions/ECX_Tracker_v64.html`.

---

## v65 Changelog (8/10/26)

Released **8/10/26, 10:45 AM ET**. Sweep window: everything received since the v64 stamp (8/7/26, 6:30 PM ET). Title unchanged — "ECX Fundraising Tracker — Master". **This release also ships the v64 content, which was prepared but never published or committed** (see the v64 entry above); v64 and v65 are one release on the live artifact.

**Two new lender cards — closes two of the five gaps flagged in v64.**

- **RBC (new card).** Nanda Kamat, Global Head of Project Finance at RBC Capital Markets, came inbound 8/4 ("EdgeConneX/RBC Connect") asking for time with Laura, Joe and the team to discuss pipeline and "build on the success of Projects Walleye and Canyon," flagging September as realistic. Laura replied 8/10: a couple more projects are coming ahead of September, and Sara Schultz will revert with September times. Contacts captured for Nanda Kamat, Matthew Stone and Jason Lee. `lastContact` deliberately left unset — inbound email and reply, no call yet. Project link added to Project Austin; the AUS10 outreach chip now clicks through.
- **TD Securities (new card).** Sarah Hu's ABS origination desk runs weekly digital-infrastructure coverage into ECX — secondary trading levels plus an ABS new issue weekly — and Laura forwards TD's Data Center Bond Market Update internally. Contacts captured for Sarah Hu, Brad Dansker, Max Schleikorn and Sarah Rahman, with the materials cited. `lastContact` unset (research distribution, no conversation). TD is not a cold name: invited Tier III on Ashville 1 and an ECX Tier 1 invitee on AUS10, so both outreach entries were renamed from `TD` to `TD Securities` to keep the project links and Bank Outreach in lockstep with the new card key.

**Morgan Stanley — Ashville rating-agency track.** Added an 8/10 note off "RE: [EXTERNAL] Re: Project Ashville Weekly Sync": Maya Matejcek confirmed all executed docs went to the working group the prior week and signed off on the updated LTA report — "very detailed and positive on all the fact patterns of the project," no comments or questions — and asked for ECX's approval to send it to the rating agencies. Rithika had circulated the further-updated LTA report on 8/5; signed construction contracts still to be folded in. Flagged as an open item for ECX. Maya Matejcek's title and phone details filled in. `lastContact` stays 7/28/26 — email exchange, no call.

**Goldman Sachs — IG data centre coverage.** Added an 8/10 note for GS Investment Banking's biweekly "Investment Grade AI / Data Center Update" (published 8/2, forwarded internally 8/10 by Laura), summarising the spread move, record July supply and the Sopaipilla print, with the distribution list captured. No `lastContact` change — research distribution.

**Bond & Market Intelligence — new 8/10 entry (GS IG / data centre biweekly).** Full detail folded in: IG index touching +80 for the first time since April and ~3bp wider over ten days on a TMT-led selloff; GS's AI basket ~12bps wider; July issuance of $150bn as the busiest July on record after a record $240bn June, YTD $1.47trn. Project Sopaipilla priced 7/27 — $12.6bn senior secured fully amortizing, 22.3yr tenor / 15.7yr WAL, T+287.5 flat to IPTs, 7.534% coupon, A+/AA-, funding a 1GW El Paso AI campus; the sixth project-finance-style IG deal to market and widely called "Beignet 2.0". Plus NextEra/Brookfield's $100bn+ Paducah conversion, NVIDIA's reported ~$250bn guarantee behind OpenAI's Ohio campus, and the ~$15bn Anthropic/Google-backstopped Hubbard, Texas package. ECX relevance noted: Sopaipilla is now the freshest large PF-style IG data centre print and the direct reference point for Ashville bond pricing, and the Hubbard package is worth watching given Ashville's Anthropic offtake and Google wrap.

**Project updates.**

- **Project Scioto — Ashville 1:** description now carries the 8/10 rating-agency status (executed docs delivered, LTA report signed off by MS, awaiting ECX go-ahead to release it to the agencies, construction contracts pending).
- **Project Scioto — Ashville 2:** description now records the preliminary financing-options call with EQT and A&O Shearman, moved from Wed 8/12 to Thursday 8/13 at 2pm ET at A&O's request, with the participant list.
- **Project Austin:** RBC and TD outreach notes rewritten to point at the new cards.

**Excluded from the sweep** (per the standing conventions): Ashville PPA/PCX drafting with A&O, Davis Polk diligence requests, VDR/KYC setup, the Ashville regulatory-framework thread, Google valuation inputs, insurance, MOR board slides, Austin MUD wastewater/road financing with BCEI, and construction status reports — project-workstream traffic, not bank conversations.

**Flagged:** (1) **Project Canyon is not in the tracker at all.** King & Spalding circulated the first Credit Agreement draft on 8/9 ("ECX - Copia Bridge") against an executed Commitment Letter, with EQT, Grace McLeish, Laura, Matthew Way, Joe and Eelco on it. Legal-draft traffic is out of scope for the sweep, but a live financing with a signed commitment letter and no project card is a real gap — needs size, structure and lender identity before a card can be created. RBC cites Canyon as a success it wants to build on, and BMO's committee "knows a lot more from the Canyon process." (2) Three AUS10 banks still have no lender card: **Barclays, NordLB, Wells Fargo**.

QC: all 5 script blocks pass `node --check`; offline Playwright smoke test green — zero console/page errors, zero external requests, 56 active lenders (was 54), 24 active projects, title unchanged, stamp reads "8/10/26, 10:45 AM ET (v65)", and the new RBC / TD Securities cards plus the MS LTA note, GS Sopaipilla note and materials chips all render. Archived to `tracker/versions/ECX_Tracker_v65.html`.

---

## v66 Changelog (8/10/26) — new "❓ Ask" tab

Released **8/10/26, 11:20 AM ET**. Feature release, no data sweep. Title unchanged.

**New second tab: "❓ Ask".** A question box that answers from the tracker's own records. Type a question (or click one of the suggested chips), get a structured answer with the record it came from, and follow-up chips to drill in. Question history stacks newest-first with a Clear button.

**It is a lookup engine, not a chatbot — and that is a hard constraint, not a choice.** The artifact runs under a strict CSP that blocks every external request, and the only runtime capabilities available to this artifact are `downloads` and `mcp` — there is no model to call. So the tab resolves questions locally: it maps the question to an entity (lender, project, or code like AUS10 / CMH11 / JKT01) and an intent, then reads the answer out of `LENDERS`, `PROJECTS`, `CLOSED_PROJECTS`, `BOND_MARKET_NOTES`, `LENDER_COMMITS` and `LENDER_FEES`. It will not infer, estimate or speculate beyond what is written down, and the header says so.

Intents it answers directly:

- **last contact** — "when did we last speak to SMBC?" Returns lastContact, last fundraising call, the most recent note with a snippet, and restates the convention that lastContact only moves for a documented call or meeting.
- **contacts** — name, title, email, phone from `contactDetails`, plus the card's coverage note.
- **next steps** — the card's `nextSteps`, split into a list.
- **commitments / fees / exposure** — total commitments and a by-facility breakdown from the commitments workbook, fees by year with the largest fee events, plus `existingFacilities`. Bank-name matching is alias-aware, so "SocGen" finds "Societe Generale".
- **projects per lender** — every active outreach list the bank sits on, its card project notes, and anything it passed on.
- **project detail** — metrics, owner, expected close, outreach grouped by Lead / Invited / Support / In dialogue / Proposal / Declined, description and workstreams. Closed deals answer with their close date and lender group instead.
- **lead** — "who is leading Ashville 1?"
- **rejections** — every recorded pass, or just one bank's.
- **portfolio hygiene** — coldest relationships (oldest lastContact first, measured against the refresh stamp so answers are deterministic), banks on an outreach list with no lender card, and headline counts.
- **market** — searches the Bond & Market Intelligence feed, falling back to the newest entries.
- **what's new** — the newest notes across all cards.

Anything that does not map to an intent falls back to a **ranked keyword search** across every note, project description, market entry and card field, returning snippets labelled with their source. Two guards keep the fallback honest: a query only counts as answered if a reasonably distinctive term lands (a match on a single ubiquitous word is not an answer), and any query word that appears nowhere in the tracker is reported back by name — "Not found anywhere in the tracker: purple, elephant" — so a partial match never reads as a full one.

**Also fixed:** the Closed tab label was hardcoded to "(14)" while `CLOSED_PROJECTS` holds 18 — now computed from the array like the other tab counts.

**Noted, not changed:** the file still carries a dead `AIAssistant` component from the pre-artifact build that `fetch`es `api.anthropic.com` with a hardcoded model id. It is unreachable — no entry in `TABS` routes to it — and the CSP would block the call regardless. Left in place to keep this release to the feature; worth deleting on a future pass.

QC: all 5 script blocks pass `node --check`; offline Playwright run drove **21 real questions** through the tab — every one returned the expected answer shape, including the two deliberate nonsense queries, with zero console/page errors and zero external requests. Tab bar now reads Inputs & Review · ❓ Ask · Active Lenders (56) · Active Projects (24) · Closed 2025 & 2026 (18) · Fees · Commitments · Cap Table · Guide. Archived to `tracker/versions/ECX_Tracker_v66.html`.

---

## v67 Changelog (8/10/26) — full sweep

Released **8/10/26, 12:25 PM ET**. Full sweep: mailbox-wide since the v65 data cut (8/10 ~10:40 AM ET) **plus** a complete audit of the "Bank Meetings" folder with no date filter. Title unchanged.

**Coverage note — the "Bank Meetings" folder was being under-read.** Earlier sweeps queried that folder with a date filter, which the Graph search does not combine with `folderName`, so it silently returned nothing. Read without a filter it holds 24 items spanning 7/7–7/28/26. All of them were cross-checked against the tracker and **every one is already reflected**: CIBC catch-up 7/14 (card note 7/14, lastContact 7/15), SMBC meeting with Phil Green and Luke Hanson 7/16 (note 7/16), BMO 7/21, MUFG Austin Energy Center 7/21, Apollo/Apterra 7/22 and 7/23, SMBC catch-up 7/22, PIMCO Nordics 7/28, Santander 7/14. No backlog to recover. Future sweeps should read this folder without a date filter and rely on the cross-check instead.

**One substantive addition — Project Austin site infrastructure financing.** The wastewater and roads financing for the Austin campus, which sits alongside (not inside) the AUS10 debt raise:

- Winstead (Justin Cox) confirmed **tax-exempt MUD bonds are not available** here. Tax counsel's guidance is that the tax base must include at least 10 independent taxpayers, with no single taxpayer responsible for more than 75% of payments — ECX as effectively the sole landowner and taxpayer cannot meet that.
- The **taxable** route works mechanically: the MUD issues taxable bonds, reimburses ECX for eligible costs, then levies a debt-service property tax over 30 years. But it does not shift the cost the way a residential MUD does — as landowner, ECX would bear the bond repayment plus soft costs and taxes through its own property taxes. Worth understanding before treating this as developer reimbursement.
- The District has **no financial advisor appointed yet**; that consultant would run the taxable-bond numbers. Winstead offered to walk the group through what a taxable issue entails.
- Laura asked BCEI for a two-pager before committing to a call. Randy Scott (BCEI) is not the MUD-law expert and handed the questions to Winstead (Justin Cox, Ross Martin).

No lender card was created — Winstead and BCEI are counsel and a development partner, not lenders, per the standing convention.

**Excluded from the sweep:** construction and PM status reports (PHX11/PHX12, CHI03/04, ATL11/12/13, AUS02, AUS11/16, New Albany South, PCX PMO), the Austin GW Campus coordination-call notes, the AUS Campus Land Financing LTA report v2 forward, the Ashville VDR/KYC and structure-chart thread, Ashville due diligence, Google valuation inputs, and the MOR board slides — project-workstream traffic, not bank conversations.

**Still open from v65/v66, unchanged:** Project Canyon (Copia Bridge) has an executed commitment letter and a first Credit Agreement draft but no project card; Barclays, NordLB and Wells Fargo have no lender cards; the dead `AIAssistant` component is still in the file.

QC: all 5 script blocks pass `node --check`; offline Playwright smoke test green — zero console/page errors, zero external requests, 56 lenders / 24 active / 18 closed / 13 market entries, title unchanged, stamp reads v67, and the Ask tab returns the new MUD and tax-exempt-bond language when queried. Archived to `tracker/versions/ECX_Tracker_v67.html`.

---

## v68 Changelog (8/10/26) — new "LC Syndication" tab

Released **8/10/26, 1:05 PM ET**. Feature release built from a supplied source file, no Outlook sweep. Title unchanged.

**New tab: "LC Syndication"** (between Lender Commitments and Global Cap Table). Full transcription of *ECX — Letter of Credit Facility: Syndication Tracker v8.06, August 6, 2026* into the tracker's own data model and visual language.

**Source figures, verbatim.** Facility $2,500m · Approved $900m · Net to raise $1,600m · Probability-weighted subscription 0.46x. Column totals tie out exactly to the file: participation $2,250.0m, probability-weighted $1,632.5m, fronting $1,800.0m.

**Three tables.**

- **Active syndication list (17)** — #, institution, coverage bank, participation, probability, probability-weighted, fronting, timing, the three tick columns (bilat issuer / VDR access / KYC on time) and the full status comment with its as-of tag. BBVA, Natixis and SocGen carry a JLA badge and an APPROVED chip; each is $300m participation plus $600m fronting under an executed ICLA. Sort toggle for source order, probability-weighted, or participation.
- **Accordion candidates (3)** — Bank of Montreal, BNP Paribas, Credit Agricole, all at 0% for this close and targeted at the accordion, with their reasons.
- **Declined (7)** — ABN AMRO, Bank of America, LBBW, Mizuho, NAB, TD Bank, Unicredit, each with the decline reason captured for the next raise.

The tick columns were recovered positionally from the PDF (layout-preserving extraction, then each ✓ assigned to the nearest column centre) rather than guessed from the order they appear in the text stream. KYC on time is ticked only for the three JLAs; bilat issuer is ticked for Barclays, ING, MUFG, Rabobank, SMBC and Standard Chartered.

**Derived analysis, computed in-page and labelled as derived** so it is never confused with source data:

- **Coverage bar** showing approved $900m, probability-weighted syndication $732.5m, and the residual gap, with the arithmetic behind the 0.46x spelled out — excluding the approved JLAs, weighted commitments cover 46% of the $1,600m still to raise, leaving ~$868m to find.
- **By probability band** (100 / 75 / 50 / 15 / 0%) with bank counts, participation and weighted totals — the 75% band (ING, Rabobank, SMBC) is where the real money sits.
- **By coverage bank**, showing how the relationships split across Natixis, BBVA, SocGen and the JLAs directly.
- **Fronting summary**: $1,800m committed by the three JLAs; ING and SMBC would also front; Barclays, MUFG and Rabobank participate without fronting.
- **Milestones**: Bank Meeting 7/14 (marked held), CLA commitments due 8/10 (highlighted as due on the tracker's own refresh date), JLA commitments due 8/17.

**Lockstep with the lender cards.** Every institution resolves to its tracker lender card where one exists — SocGen, Citibank→CitiBank, ING→ING Bank, Standard Chartered→SCB, Credit Agricole→CACIB, Bank of Montreal→BMO, TD Bank→TD Securities — and the name is clickable, jumping to that card. The eight names with no card (Barclays Bank, NBC, Wells Fargo, ABN AMRO Bank, Bank of America, LBBW, NAB, Unicredit) are flagged both inline and in a lockstep panel.

**Also surfaced: the orphaned bilateral LC book.** `LC_SURETY_DATA` — the closed bilateral LC facilities and surety bonds — was in the file but its tab was never wired into the tab bar. It now renders as a secondary section at the bottom of this tab, as context for the syndicated facility. Clearly separated with its own source note.

**Ask tab extended.** The syndication rows are indexed, and a new intent handles LC questions: "What is left to raise on the LC facility?" returns the facility summary, conviction tiers, accordion, declines and milestones; "What is SMBC doing on the LC facility?" returns that bank's row; "Who is fronting on the LC facility?" and "Who declined the LC facility?" both answer directly. A new "LC facility" chip group was added to the suggestions.

**Fixed:** `LCS_m` was dropping the thousands separator on fractional values, rendering the $1,632.5m total as "$1632.5m".

QC: all 5 script blocks pass `node --check`; offline Playwright run confirms every source figure ties out on screen, all three tables render at 17/3/7 rows, the sort toggle works, clicking SMBC lands on the SMBC lender card, and all four LC questions answer correctly through the Ask tab — zero console/page errors, zero external requests. Archived to `tracker/versions/ECX_Tracker_v68.html`.

---

## v69 Changelog (8/11/26)

Released **8/11/26, 10:30 AM ET**. Sweep window: mailbox-wide since the v67 data cut (8/10, ~12:09 PM ET) plus the "Bank Meetings" folder read unfiltered. 65 messages in the window; 6 bank-relevant threads folded in. Title unchanged.

**Ares / Narwhal IV — the hold is lifted.** Johan Hylander 8/11: "TS looks good. Minor questions below. Otherwise happy for it to go across assuming Laura is ok." The 8/6 hold pending the ~$800m repayment and possible call-protection reduction is cleared, so the term sheet and updated Credit Agreement can go to Latham / Ares on Laura's sign-off. Three EQT questions remain: supplemental facility availability (EQT wants it pushed to 12 months); whether the revised covenant and restricted-payment package works for them, including read-across from **Project Enigma and Project Faraday**; and confirmation that the voluntary-repayment non-call is fixed, plus why A4/B4 carry make-whole to June 2027 while Supplemental A4/B4 run to February 2028. Card note, `projects{}`, `nextSteps`, the HoldCo workstream and the Ares outreach entry all updated. `lastContact` held at 2/10/26 — email only.

**Blackstone — first Leroy upsize engagement since January.** Caitlin Santiago 8/10: "Wednesday is best for us", offering 2–3pm, 3:30–4pm or 4:30–5pm ET; Clay Macfarlane sent a [HOLD] Zoom invite on 8/11 for the ECX/BX Project Leroy Upsize Sync. Wednesday is 8/12/26, slot still to be confirmed. Blackstone has put an unusually wide team on it — capital markets plus the BXCI ECX deal team (Macfarlane, Santiago, Nowack, Patel, Mandana, Martin, Bianco, Elaprolu, Lerman, Blinov), which is a useful read on how seriously they are treating the upsize. Leroy Austin & Finland materials circulated internally 8/10. `lastContact` stays 1/20/26 — the call has not happened yet.

**Morgan Stanley — yesterday's LTA sign-off partly walked back.** Three threads moved:

1. **The LTA report is NOT with the rating agencies.** Laura told Maya on 8/10 that ECX "noticed there are some inconsistencies in the report that may need updating" and would revert. This supersedes the open item logged in v65, where MS was waiting only on ECX's go-ahead.
2. **Equity commitment letter.** Maya asked for the latest draft to send to the agencies. Davis Polk (John Runne) confirmed they "began drafting but stopped when we paused" and will share a draft shortly; Laura committed to getting it to MS by COB.
3. **Covenant grid and model.** Laura asked Akilesh for a grid refreshed for financings since 6/16; Akilesh confirmed the only new transaction is the **Galaxy financing, leased to CoreWeave**, which bears on comparability. Laura also asked MS to confirm the model reflects readiness at **RFS + 90 days** (no LDs) — still open.

`lastContact` stays 7/28/26.

**Goldman Sachs — broad team engaged, and a practical file-transfer problem.** Aditya circulated materials to a wide GS group on 8/10 (including their leveraged finance / AI team); Nivedh Iyer confirmed they would review and revert. The lease draft never landed — too large for GS's mail filters — so GS raised an internal unblock request and offered to stand up a data room instead. Expect large documents to go via a GS-hosted room, not email. New GS names captured: Nivedh Iyer, Varun Rastogi, Bradley Mhangami, Miriam Wheeler, Jonathan Tan, Lilly Costello, Jisoo Kim.

**RBC — meeting slots on the table.** Laura offered three Herndon slots on 8/10: 14 September 12:00pm ET, 15 September 3–5pm, 18 September 3–5pm. Nanda Kamat: "Let us circle internally and revert." Card note and `nextSteps` updated; `lastContact` still unset (no call yet).

**Ashville 2 — the financing-options call ran today, not 8/13.** A&O reissued the invite as "UPDATED TIME" and the call moved forward to 8/11. Davis Polk (David Penna) circulated a one-pager the night before comparing key elements of the common financing options in the market. Participants widened: A&O added Jeffrey Pellegrino and Gordon Mak, EQT added Kerstin Fuerntrath, Davis Polk on for Penna, Garcia Laposse and Runne. Phase 2 structure still open.

**Structural fix — "LC Facilities" and the new LC Syndication tab were the same workstream, unlinked.** The sweep surfaced a "Project Liverpool — Syndicated Facility QA Log" forward, and Liverpool turns out to be the codename on the existing **LC Facilities** project — the same $2.5bn facility the v68 tab was built from. The two are now reconciled:

- The project's outreach list was rebuilt from the v8.06 syndication tracker: 3 JLAs, 14 further active names with their ticket sizes, probabilities, fronting posture and coverage bank, 3 accordion candidates and 7 declines. It previously showed only 3 leads and 6 declines from the 8/4 bank matrix, and was missing every active participant plus the 8/6 declines (Bank of America, NAB, TD Bank).
- The description now carries the headline economics and points at the LC Syndication tab; the teaser metrics were refreshed from "$100-500m / various relationship banks / April 2026" to the actual $2,500m facility, $900m approved, 0.46x weighted subscription and the CLA / JLA commitment dates.
- The LC Syndication tab header now shows the Project Liverpool codename and cross-references the project.

**Bug fixed in the Ask tab — a real routing defect, caught by this data.** Asking "Blackstone" returned the *closed project* "Project Leroy (Blackstone)" instead of the Blackstone lender card: project aliases were derived from parentheticals, so a project named after a lender swallowed that lender's name, and the router resolved projects before lenders. Project alias generation now discards any alias that is just a lender's name. "Blackstone" resolves to the card; "Project Leroy (Blackstone)" still resolves to the project. Regression-tested across 11 routing cases, all passing.

**Excluded from the sweep:** the ECX Bond offering-memorandum drafting thread, bond acreage / ground-lease and EHS wording, A&O resolutions, Ashville 1 Davis Polk diligence (operating income / non-GAAP), Turntown's Ashville OH report V7 edits, Google valuation inputs, construction and PM status reports, the Q2 CFO deck and a talent-acquisition all-hands — workstream traffic, not bank conversations.

**Flagged:** **Project Enigma** and **Project Faraday** appear in EQT's covenant question but exist nowhere in the tracker — most likely other EQT portfolio financings rather than ECX deals, so no cards were created. **Project Canyon** (Copia Bridge) still has an executed commitment letter and a first Credit Agreement draft with no project card. Barclays, NordLB and Wells Fargo still have no lender cards, and the dead `AIAssistant` component is still in the file.

QC: all 5 script blocks pass `node --check`; offline Playwright run green — zero console/page errors, zero external requests, 56 lenders / 24 active / 18 closed, note count up from 96 to 101, LC tab totals still tying to the source ($2,250m / $1,632.5m / $1,800m), and 11 of 11 Ask routing cases passing. Archived to `tracker/versions/ECX_Tracker_v69.html`.

---

## v70 Changelog (8/17/26) — call-notes sweep

Released **8/17/26, 11:45 AM ET**. Targeted sweep for bank meetings and call notes rather than a date-window pass: free-text searches across the mailbox plus the "Bank Meetings" folder read unfiltered. This closed a six-day gap (8/12–8/17) that included five substantive call notes. Title unchanged.

**⚑ Project Guadalupe is the external codename for the AUS10 raise.** Laura pitched it to Citi and JPM as "a 672MW IT project with an IG hyperscaler in Austin, TX with a combined behind-the-meter solution (together with a local partner) and outlook to grid connection" — with the **AUS10 financial model** attached, which is what ties the two together. Recorded as the codename on the existing Project Austin card rather than as a new project, matching the Ashville→Scioto and LC→Liverpool pattern. **Flagged, not silently reconciled:** the 672MW single-IG-hyperscaler framing does not match the card's 650MW committed + 350MW reserved multi-customer view. Someone should confirm which is current.

**AUS10 / Guadalupe lender feedback — six calls, folded onto each card and synthesised on the project.** The consensus: banks want a **dual structure**, an HY or IG bond alongside PF, either from the start or as a bridge into it, with DC and EC financed together and a HoldCo/OpCo combination open if priced right.

- **ING** — a DDTL is the best solution: dual track, bond for near-term buildings, DDTL for later-funding buildings to avoid carry. Has not done a BTM deal yet.
- **Mizuho** — 6–8 lender club, 18 months + 6-month extension, 144A or USPP takeout; likely too large for USPP given project-on-project and construction risk, so building-by-building takeout with a condo structure is possible. Institutional tranches fit. Prefers a two-tiered CLA.
- **RBC** and **BNP** — bond structures live, both still working internally.
- **Santander** — bank facility alongside an IG or HY bond, PF-focused, joint approach. Asked for their read on the QTS/MSFT precedent.
- **Barclays** — Laura's read: "nothing in particular, very similar to other calls."

`lastContact` and `lastFundraisingCall` moved to 8/14/26 for all six (the calls ran in the week of 8/10–8/14; the consolidated summary is dated 8/17).

**Deutsche Bank — 8/14 call, the most substantive of the sweep.** Five DB people across coverage, private credit infra, balance-sheet lending, digital infra and capital markets. **⚑ Ashville unwrapped would price in the mid 5s**, supported by equity capital from the wrapped piece — the first hard bank pricing datapoint on that trade. No market standard for credit enhancements; a credit wrap is best; Broadcom is very clean and DB can work with less clean. Non-IG tenants need lookthrough to the end tenant, with the preferred construct an MOU whereby CoreWeave drops the contract into an IG-rated SPV. DB has done more CoreWeave deals than any bank. APAC: Chinese hyperscalers ~25bps over US, free transferability rights won't work, leverage 8.5–9.5x vs 10–10.5x in the US, and **DB expects multiple project bonds in the next six months, at least one Malaysia and one Thailand**. Very active in bridge capital, HoldCo capital and APAC. Joe proposed DB for the 10yr Alibaba deal and the India discussions. `lastContact` → 8/14/26.

**Standard Chartered — 8/13 lunch with Sri (now global head of digital infra) and Chloe.** Very bullish, willing to step into more exotic structures. **⚑ Liverpool: SCB is looking to come in for $200m**, can do more fronting and more again if allowed to backleverage with other banks, with voting rights staying with them — the v8.06 syndication tracker still shows SCB at 15% with no ticket, so this supersedes it. Also: eager on India given the ECX and Adani relationships; excited by Walleye-style BTM combinations; and actively exploring lending beyond regular hyperscalers with CEO-level support — Anthropic (needs financials, also working their RCF), OpenAI (bullish via SoftBank), Mistral (sovereign play), Chinese hyperscalers. SCB to revert on Liverpool backleverage/voting and on backleverage capability for **Ashville II**. Laura wants SCB in a lead role on Guadalupe, Walleye II, Tarpon II or the Ashville bond. `lastContact` → 8/13/26.

**Blackstone — the Leroy upsize call happened on 8/12.** Laura, straight afterwards: "Thank you for the call earlier today", with a draft report sent that still needs updating. Intercompany balances for the Leroy entities followed on 8/14 as part of the upsizing and reshuffle. `lastContact` → 8/12/26, the first documented Leroy conversation since January.

**Three new lender cards — all three built from documented calls, closing flagged gaps.**

- **Bank of America** (new) — declined the LC facility, and the reasoning is now captured: no LC facility experience, less favourable capital treatment for US banks, unclear where it sits in the capital structure or how it leads to take-outs, and ECX interest coverage insufficient on their measure. Laura: "BOA really can't do anything — only devco." **⚑ She raised an open strategic question: should another bank become ECX's key cash-management provider, one that treats it as a genuine cross-sell?**
- **Barclays** (new) — AUS10 feedback, plus the $200m LC facility line and the Ashville 1 Tier II invite. No named contacts on file yet.
- **Wells Fargo** (new) — **⚑ the clearest approvals bottleneck in the group.** Still struggling with approvals on AUS10; a meeting is to be set with WF's risk team and Joe Harar to build internal support. Also struggling with internal capital allocation on the $100m LC facility line.

**Also captured:** Citi invited into Guadalupe 8/13 (Benjamin Mortimer, Raimund Riedl) with **views and appetite requested by Thursday 8/20**; JPM invited 8/14, with a delivery problem worth confirming ("just noticed my email didn't send — having some issues sending to JPM"); GS model exchange 8/13 with RAP and model to follow and a call early the following week; and a Morgan Stanley meeting planned for Monday 8/17.

**Project Austin outreach rebuilt** to 24 banks with each bank's actual feedback position, including three additions (Citi, Nomura, SCB) and the flag that **CIBC, NordLB, Truist, Rabobank and SCB never received the presentation** — LG proposes not to send, while still rating them CLA candidates.

**Corrections to earlier entries.** The Ashville 2 financing-options call ran on **8/13**, not 8/11 as v69 recorded — A&O reissued the invite and Dorina Yessios followed up the same afternoon with "thank you for your time today". Fixed.

**LC Syndication tab — a "developments since this snapshot" panel.** The v8.06 table is left exactly as transcribed; the SCB $200m target and the Bank of America decline reasoning are surfaced in a separate panel above the lockstep check, along with a note that the CLA (10 Aug) and JLA (17 Aug) commitment dates are now at or past due.

**New market-intelligence entry (8/17)** consolidating the structural feedback, market conditions (spreads wider; three months of increasing dual-tracking; **BTM premium compressed as a concern, with comfort now hinging on lease protections for power delay**; heavy Meta paper; deal size the recurring constraint), the precedents in play (Nexus as Mizuho's and RBC's anchor comp, Walleye on risk allocation, QTS/MSFT for public issuance without lease disclosure, plus the Equinix secured bond case study circulated 8/17), DB's pricing and credit views, the APAC read and SCB's customer appetite.

**Excluded:** the ECX Bond offering-memorandum drafting and KPMG diligence scheduling, bond acreage and ground-lease work, EHS wording, A&O resolutions, the EQT equity commitment letter drafting thread, Ashville EC updates, Turntown report edits, Google valuation inputs, construction and PM reports, and the Q2 CFO deck — workstream traffic, not bank conversations.

**Flagged:** **Copia** appears in SCB's pipeline rundown, which confirms Copia/Canyon is a live project — still no project card, and still no size or lender identity to build one from. **Project Enigma** and **Project Faraday** remain unexplained. Six names on active project outreach lists still lack cards: NordLB, NBC, ABN AMRO, LBBW, NAB, UniCredit (plus NIBC on Herring and Nordea on Vendace). The dead `AIAssistant` component is still in the file.

QC: all 5 script blocks pass `node --check`; offline Playwright run green — zero console/page errors, zero external requests, **59 lender cards** (was 56), 24 active projects, 14 market entries, **116 notes** (was 101), LC tab totals still tying to the source file, and 7 of 7 Ask routing cases passing including the three new cards. Archived to `tracker/versions/ECX_Tracker_v70.html`.

---

## v71 Changelog (8/17/26) — JPM receipt correction

Released **8/17/26, 12:05 PM ET**. Correction from Aditya, no sweep. Title unchanged.

**JP Morgan did receive the Project Guadalupe package.** v70 flagged the 8/14 send as unconfirmed because Laura had hit delivery problems ("just noticed my email didn't send — having some issues sending to JPM"). Aditya confirmed the package landed and that **Scott Wilcoxen said JPM will come back** with their views. The caveat is removed from both the JP Morgan card note and the Project Austin outreach entry, replaced with confirmed receipt and the pending response against the 8/20 deadline.

**Scott Wilcoxen added as a named contact** — coverage for Guadalupe / AUS10, now the first entry in the JP Morgan `contactDetails` ahead of Jason on the equipment facility. Previously the card recorded him only as "Scott + team" inside a note. No email or phone on file yet.

`lastContact` unchanged at 1/29/26 — the package and Wilcoxen's reply are email traffic, not a call.

QC: all 5 script blocks pass `node --check`; offline Playwright confirms the stamp, the corrected note and outreach text, Wilcoxen as the lead JPM contact, that the old "worth confirming receipt" caveat is gone from the data entirely, and 59 lenders / 24 projects / 116 notes unchanged — zero console/page errors, zero external requests. Archived to `tracker/versions/ECX_Tracker_v71.html`.

---

## v72 Changelog (8/17/26) — source-file cross-check + LC items on the Fees and Commitments tabs

Released **8/17/26, 12:40 PM ET**. Aditya supplied the two source workbooks for verification. Title unchanged.

### Cross-check result: both files tie out, zero mismatches

**Lender fees — `Lender_Fees_Summary_7.21.26_VF.xlsx`.** Compared cell by cell: **57 bank rows on both sides**, 14 deal columns for 2025 and 8 for 2026 in **identical order**, and **zero value mismatches** across every cell. Totals tie to the file's "By Deal & Year Total" row: 2025 $103,576,093.83, 2026 $155,924,007.40, combined $259,500,101.23. Bank-name aliases all resolved (OCBC ↔ Oversea-Chinese Banking Corporation Limited, Credit Agricole CIB ↔ Crédit Agricole Corporate and Investment Bank, PKO ↔ Powszechna Kasa Oszczednosci, ANZ ↔ Australia and New Zealand Banking Group, and the two separate Principal Insurance Company rows for Shiner I and II).

**Lender commitments — `EdgeConneX_Commitments_Q2.2026_VF.xlsx`.** **22 facility columns in identical order**, **123 bank rows on both sides**, **zero value mismatches**. Grand total $24,793,471,107 in the file versus $24,793,471,113 in the tracker — a **$6 difference**, purely from the tracker storing whole dollars. Every bank in the file is represented and no tracker row is absent from the file.

**Two provenance findings, both now recorded in the UI:**

1. **The commitments citation was pointing at a superseded filename.** The tracker cited `EdgeConneX Commitments (07.17.2026).xlsx`; the current file is `EdgeConneX_Commitments_Q2.2026_VF.xlsx`. The data is equivalent, so this is the same dataset under the Q2 name — `asOf 6/30/2026` is consistent. Source updated, with a note that it supersedes the earlier filename.
2. **The Q2 workbook has no Backleverage column.** The Blackstone −$600m / Morgan Stanley +$600m backleverage badges therefore cannot be verified against this file — they carry over from the prior version. Disclosed in the commitments footer rather than left implicit. Note this does not affect any total: both banks' gross commitments match the file exactly (Blackstone $1.75bn across Leroy and Walleye), and the badges were already excluded from headline totals.

Both tab footers now carry a dated verification line stating what was checked and what was found.

### LC items added to both tabs

**Commitments tab — "LC Syndication pipeline" panel.** All 17 active Project Liverpool names with participation, probability, probability-weighted amount, fronting and timing, sorted by weighted amount, with a totals row ($2,250m participation, $1,632.5m weighted, $1,800m fronting). Each row also shows that bank's **booked LC's commitment from the commitments workbook** alongside its syndication ticket, so the incremental ask is visible next to existing exposure. The panel sits **outside** the main table and is labelled as not part of the committed book, so nothing in it can move a total that ties to the source file's Grand Total row.

**Fees tab — "LC facility fees booked to date" panel.** Rolls up the six LC columns already in the table (SMBC LC Facilities, BBVA / SMBC / SCB / NTX LC Facility, and Rabo LC upfront in 2026) which are easy to miss spread across two year blocks. Same figures, same source, nothing added: **SMBC $250,000** and **Cooperatieve Rabobank U.A. $300,000**, total **$550,000**. The panel states plainly that the $2.5bn syndicated facility has **no fees booked yet** — CLA commitments were due 10 Aug and JLA 17 Aug 2026 — and points at the LC Syndication tab for its economics.

The LC columns already present in both tabs were left exactly as they are, since they tie to the source files.

**Bug caught by the smoke test and fixed before release:** the new panels referenced `h` (the `React.createElement` alias), which is scoped per tab function rather than global. Both panels threw `ReferenceError: h is not defined` on render and blanked the app. Each panel now declares its own alias. Worth remembering for future panels.

QC: all 5 script blocks pass `node --check`; offline Playwright clicked through **all 10 tabs** with every one rendering (zero console/page errors, zero external requests), both new panels verified present with their figures, and the fee and commitment totals confirmed still tying to the source workbooks. Archived to `tracker/versions/ECX_Tracker_v72.html`.

---

## v73 Changelog (8/17/26) — refresh-stamp time fix

Released **8/17/26, 11:58 AM ET** — and this time the stamp was generated from the clock rather than typed.

**The bug.** Aditya spotted that the header read "Last refreshed 8/17/26, 12:40 PM ET (v72)" while the actual time was 11:57 AM — the stamp was **43 minutes in the future**. Not a one-off: every recent release was stamped ahead of its real release time. Actual release times taken from the git commit timestamps:

| version | stamped | actually released | error |
|---|---|---|---|
| v67 | 12:25 PM ET | 12:16 PM ET | +9 min |
| v68 | 1:05 PM ET | 12:37 PM ET | +28 min |
| v69 | 10:30 AM ET | 10:16 AM ET | +14 min |
| v70 | 11:45 AM ET | 11:26 AM ET | +19 min |
| v71 | 12:05 PM ET | 11:34 AM ET | +31 min |
| v72 | 12:40 PM ET | 11:52 AM ET | +48 min |

**Root cause.** The clock was read once early in a run, then a rounded-forward guess was typed into `LAST_REFRESH` at edit time instead of re-reading it. The bias always ran forward, and grew with the length of the run.

**Why it mattered beyond cosmetics.** `LAST_REFRESH` is not decorative — `ASK_asOf()` parses it, and every staleness calculation keys off it: the "coldest lender relationships" ranking, the "N months ago" ages on last-contact answers, and the "due today" highlighting on the LC Syndication milestone chips. A stamp in the future silently biases all of them, and a refresh time that has not happened yet undermines trust in the whole page.

**The fix, structural rather than a one-off correction.** The stamp is now produced by the release script from `TZ=America/New_York date` and substituted in programmatically, so it can only ever reflect a real observed clock reading. Publishing lands a minute or two after the stamp is written, which means the stamp now sits very slightly in the **past** — the correct direction for a "last refreshed" label. Verified in the smoke test, which parses the rendered header, compares it against the shell clock, and fails if the delta is positive.

**Not rewritten:** the stamps inside `tracker/versions/ECX_Tracker_v67.html` through `v72.html`. Those are snapshots of what actually shipped, and editing them would falsify the archive. The table above is the correction of record; the git commit timestamps are authoritative for when each version really went out.

QC: all 5 script blocks pass `node --check`; offline Playwright confirms the rendered header matches `LAST_REFRESH`, the stamp is **1 minute behind** the real clock rather than ahead, `ASK_asOf()` still resolves to 8/17/26 and the staleness math continues to work — zero console/page errors, zero external requests. Archived to `tracker/versions/ECX_Tracker_v73.html`.

---

## v74 Changelog (8/18/26) — 8/18 Outlook sweep: FAB card, Ashville 2 private-credit call, Guadalupe two days from the deadline

Released **8/18/26, 11:46 AM ET** — stamp generated from `TZ=America/New_York date` per the v73 fix; the smoke test confirms it sits 1 minute behind the real clock.

### New lender card — FAB (First Abu Dhabi Bank), lender #60

The first full introductory call ran **18 Aug 2026** with **Sherzad Desai (Head of TMT), Kershel Pietersz (Head of Telecom) and Hicham (Trade Finance)**; the NDA was fully executed 17 Aug, so information sharing can now start. Card created with `status: dialogue`, `lastContact: 8/18/26` (a documented call, per the convention) and three notes covering the 8/18 call, the 8/17 "Heads up to non-CLAs" thread and Chris Wenger's 8/13–14 relationship read.

What the call produced:

- **Capital**: initial pool of **USD 750m available for ECX**, ACX bookable separately. OpCo tickets USD 50–200m in APAC, **up to USD 750m–1bn in the US**; Europe TBC. FAB can also provide back leverage.
- **LC facility**: FAB recently completed a **$2bn guarantee facility for another DC platform** and wants in on Liverpool for **both financial and performance LCs**. Hicham leads. Eelco Holst: "we should push them for a high Liverpool ticket."
- **Counterparty appetite**: big appetite for IG+ US tenants; comfortable with **Alibaba, Tencent, ByteDance**; limited appetite for Oracle but limits available; no neocloud mandate yet, though **exploring a relationship with Anthropic** ("trying to get comfortable… but have not done anything yet").
- **Pipeline**: FAB itself selected **Salar, the AUS10 series and Liverpool** for invitation. Laura Godschalx directed FAB be treated like Barclays on information flow — project update in ~2–3 weeks — and added to the list asked to share financials. Eelco's open question, recorded as such: whether and how to give FAB a look at Ashville 2.

FAB added to the outreach lists for **Project Austin (AUS10 / Guadalupe)**, **Project Salar — Norway & Finland** and **LC Facilities (Liverpool)**, and to **Ashville 2** as an explicit open question rather than an invitee. Ask-tab alias added so "FAB" and "First Abu Dhabi Bank" both resolve to the card.

### Project Scioto — Ashville 2: private credit vs syndicated, the counsel view

Folded in the **A&O Shearman and Davis Polk call summary** (notes by Rithika Nistala, circulated 8/17):

- **A&O Shearman** (Dorina Yessios, Jeff Pellegrino, Gordon Mak, Peter Tolson) — private credit gives more leverage and delayed-draw flexibility than a syndicated TLB but tighter covenants and stricter call premiums (1–2 years). Comps: Arc Data Centers / Carlyle (GS-led), Doral Renewables, Evocation / Crestline. PC lenders are restricting liability-management transactions and some now require ratings. ⚑ **Austin's BTM tolling arrangement flagged as a potential complication.**
- **Davis Polk** (David Penna, Costanza Garcia Laposse, John Runne) — run **1–2 HY quotes as a pricing benchmark**. Large PC lenders run these out of their RE groups, so docs look like traditional RE financing early and loosen post-close. Asset-plus-HoldCo has precedent (Switch, Rowan, Databank, Edged); standalone-asset HoldCo does not. Counsel ranking recorded verbatim — great: Milbank, Kirkland, Blackstone; good: Simpson, Paul Weiss; Blue Owl in the middle; not great: Cahill. Upfront rent can fund equity if the tenant signs early (up to $500m seen). ⚑ **No Google backstop means no step-in rights** — DP will review change-of-control / ROFO and lease language pre-execution at no cost. Total debt quantum ~$3.5bn.

Also captured: Laura circulated the proposed investor list to Johan Hylander (EQT) on 8/18 suggesting **Ares and Oaktree** be added, and SCB was added to the outreach list for the backleverage offer already described in the card text.

### Project Austin / Guadalupe — two days before the 8/20 appetite deadline

- **Citi** is engaging hardest of any invitee: Ben Mortimer confirmed receipt 8/18 and asked for a same-day window; the call landed in the afternoon and Citi put **thirteen** people on the invite. `lastContact` → 8/18/26.
- **BNP** returned a **formal written Q&A** on 8/17 after the 8/14 call — lease structure and tenant rating, early-termination fee schedule, risk allocation versus Walleye, what the ECX energy-centre guarantee covers, the customer buyout right, gas-lateral completion risk, the age of the Hull Street GE 7FA turbines, the Texas governor decision, whether the air permit comes before closing, why BCEI rather than ECX owns the EC, why Phase 2 costs more per MW, no cross-collateralisation between EC and DC, Hull Street outside the EC perimeter, and whether bond structures would be considered at closing.
- **Natixis** asked for lease and tolling detail for structuring (Pim Rothweiler), then Bobby Luo's four structuring questions on pass-through mechanics, the intercompany power contract, the FCSA counterparties and Hull Street's post-operational role. ⚑ **Amaury Chastan is out on mandatory block leave until 31 August** — James Kaiser is backup.
- **MUFG** cancelled the 8/18 DCM market-update call; substance moves to **Thursday 2pm**.
- **Wells Fargo's** 180-day cure question answered: per lease, i.e. per building, no cross-defaults — RFS with temporary power cancels out only the affected building.
- **Project milestone**: the **AUS11 / AUS12 generation permit was issued and approved 8/18**. Austin campus Phase 1 ESA and geotech reliance letters being collected for DD.

### Bond & Market Intelligence — two new entries (14 → 16)

- **8/18/26 — open energy-centre permits are now a market focus.** Davis Polk relayed that Cahill has told them **Morgan Stanley is fielding investor questions on the EC permit process**, because outstanding open permits have drawn heavy market focus on recent transactions. Cahill wants to walk the process; D&W runs point, so Chris and team may join. Flagged as an underwriter-side diligence and disclosure item rather than a project problem — and it lands the same week the AUS11/12 permit was approved, which helps that conversation.
- **8/17/26 — non-CLA outreach list for Austin.** Laura's call list (Bank of China $400m, KDB $250m, ICBC large tickets, Bank of Baroda $200m and a potential Liverpool back-leverage role for SCB, plus UOB, Clifford, Shinhan, Huntington, NordLB, KfW, LBBW, Lloyds, Scotia, Principal, PGIM, NAB Institutional, Apollo, Blackstone), Sander's APAC additions (DBS at $100m+ on Metropolis/Atlas, Sinopac, UOB, Woori, Clifford, FAB — and the OCBC question), and Marjolein's European read (NatWest keen on a larger Walleye ticket, Intesa capacity-constrained on DC, Sabadell max $75m, NAB not comfortable with energy centres on ESG grounds, ANZ unclear in the US, offer to test Nordea and SEB). ⚑ Sixteen of these names still have no lender card.

### Not done, deliberately

Pure workstream document traffic was left out per the standing convention: the Leroy Exhibit A upsize drafts, the K&S IC-loan punchlist, the Bastrop FCSA redline, the AdaniConneX JVA guarantee release, the Hithium MSA / AUS11-12 purchase orders and the Ashville 1 NOI-margin definition thread. Counsel and advisory firms (A&O Shearman, Davis Polk, King & Spalding, Cahill) still get no lender cards — their input lives in the project descriptions and market feed.

QC: all 5 script blocks pass `node --check`; offline Playwright confirms 60 lender cards, 24 active projects, 18 closed, 16 market notes, FAB present with 3 notes on all four project lists, the rendered header matching `LAST_REFRESH` and sitting **1 minute behind** the real clock, and 12/12 Ask-tab routing cases resolving correctly (including "Guadalupe" and "Liverpool" as codenames, and "Project Leroy (Blackstone)" still landing on the closed deal rather than the Blackstone card) — zero console/page errors, zero external requests. Archived to `tracker/versions/ECX_Tracker_v74.html`.

---

## v75 Changelog (8/18/26) — Project Austin renamed to Project Guadalupe across the board

Released **8/18/26, 11:55 AM ET**. Per Aditya: the card carries the name lenders actually see.

The tracker had been running a split identity — the card was titled "Project Austin" while every piece of outbound material, every bank thread and every lender note called the same financing **Project Guadalupe**. That split is now closed. Sixteen `Project Austin` references were repointed, plus two Austin-named project keys that had drifted:

| where | before | after |
|---|---|---|
| `PROJECTS` card title | `Project Austin` | **`Project Guadalupe`** |
| lender-card `projects` keys | `"Project Austin"` × 5 | `"Project Guadalupe"` |
| OHA card | `"Project Austin (GPU/HY)"` | `"Project Guadalupe (GPU/HY)"` |
| SMBC card | `"Austin PF"` | `"Project Guadalupe"` (old label noted inline) |
| `BUDGET_PIPELINE` row 12 | `property: "Project Austin"` | `property: "Project Guadalupe"` |
| `ASK_CODE_MAP` | `aus10 / aus 10 / austin campus` → Project Austin | all → **Project Guadalupe** |
| lender note prose | "the AUS10 (Project Austin) outreach list" × 3 | "the AUS10 (Project Guadalupe) outreach list" |
| Leroy II card | "standalone $6.4bn Project Austin campus PF" | "…Project Guadalupe campus PF (separate card, formerly titled Project Austin)" |
| `ASK_EXAMPLES` | "Which banks are on Project Austin?" | "Which banks are on Project Guadalupe?" |

**Ask tab widened rather than narrowed.** Renaming a card normally breaks every query that used the old name, so `ASK_CODE_MAP` gained `guadalupe`, `austin`, `project austin`, `aus10 series`, `aus 10 series` and `austin 10 series` alongside the existing `aus10`, `aus 10` and `austin campus`. All eight spellings now land on the same card — verified: `Project Guadalupe`, `Guadalupe`, `Project Austin`, `Austin`, `AUS10` and `austin campus` all resolve to "Project Guadalupe — 25 banks on the outreach list", and "who is leading Guadalupe" returns Goldman Sachs. Before this change, bare "Guadalupe" and "Liverpool" fell through to keyword search and landed on a lender note rather than the project.

**The codename banner was inverted, not deleted.** The description previously read "⚑ EXTERNAL CODENAME: PROJECT GUADALUPE". It now records the rename itself — that the card was titled Project Austin until 8/18/26, that AUS10 series / Austin Campus 10-series remains the internal shorthand, and that the Ask tab still answers to the old names. The 672MW single-IG-hyperscaler versus 650MW committed + 350MW reserved multi-customer discrepancy flagged in v70 is untouched and still open.

**Deliberately not renamed:** anything where "Austin" means the place or the asset rather than this financing — `Google JV — Austin / Atlanta` (a separate card), "Austin Campus (McNair/Herndon)" in the Leroy borrowing-base description, "BCEI owns Austin energy center", the AUS10 / AUS11 / AUS12 building references, and the Austin campus DD and permitting threads. Renaming those would have made the tracker wrong in the other direction.

QC: all 5 script blocks pass `node --check`; offline Playwright confirms exactly **1 card named Project Guadalupe and 0 named Project Austin**, all 24 lender cross-links pointing at the new name, 25 banks on the outreach list, every one of the 10 tabs rendering, 12/12 Ask routing cases correct, and the stamp 3 minutes behind the real clock — zero console/page errors, zero external requests. Archived to `tracker/versions/ECX_Tracker_v75.html`.
