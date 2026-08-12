# Working conventions for this repo

Read this before touching `data/taskflow.js` or `taskflow/index.html`.

## Always combine like items

**One piece of work is one task.** Before adding anything to `data/taskflow.js`, scan the
project's existing tasks and merge rather than append when the new item is the same workstream.
Near-duplicates are the main way this board rots — three tasks that are really one make the
board look busier than the work is and split its context across rows nobody reads together.

Signals that two items should be one:

- Same counterparty and same artefact — "send GS questions", "circulate GS's questions back"
- Two directions of one exchange — outbound and inbound halves of the same Q&A loop
- A task and its own follow-up step — "draft X" plus "send X"
- The same document at different versions, unless each version genuinely needs its own decision

When merging:

1. **Keep the oldest id.** The site keys the user's completions off ids in `localStorage`;
   a new id detaches their tick and the task reappears open.
2. Fold both descriptions into the surviving `notes` and say what was merged and when.
3. Record the retired id in `source` (`"backlog; merged with t-aus22 on 2026-08-10"`).
4. Take the earlier `due` and the higher `priority`.
5. Say in `notes` what you deliberately did **not** merge, so the next pass does not
   re-litigate it.

Worked example — `s-aus11` absorbed `t-aus22` on 2026-08-10: "send GS questions once Laura has
reviewed" and "send the GS DD questions back over to the team" were the outbound and inbound
halves of one Goldman DD loop. Randy's BCEI responses and the request for Goldman's models stayed
separate: different artefacts, not different halves of the same one.

When it is genuinely ambiguous, merge and note the doubt rather than leaving two rows.

**The board merges as you type, too.** On commit, the quick-add box looks for an open task on the
same project with the same workstream label. If it finds one it appends an addendum to that task
rather than creating a row — the preview says `MERGES INTO <task>` before you press Enter, and the
row then shows a `+n merged` chip. Addenda take the earlier due date and the higher priority, and
live in `localStorage` alongside your other edits, so a data refresh preserves them.

## Six sections, and only six

Every deal project is sectioned by exactly these, in this order:

```
LTA report · Diligence requests · Appraisal · Lease · Permits · Bank Outreach
```

`group` must be one of those six for any task on a deal project — no new section names, no
`Other`. The non-deal projects (AI Projects, Stabilization, Internal) carry a single group each so
no headers render for them. The lexicon in `toConvention()` maps every workstream label onto one
of the six, so a typed task cannot invent a seventh.

## Titles carry the workstream

Every task title is `<workstream> — <punchy action>`, and the viewer renders the workstream in
bold so the board can be scanned by workstream without reading each line:

```
LTA report — review Austin v2
DD questions — GS, both directions
Rating agency — confirm slots with Macy
Model — ask Goldman for theirs
```

Name the workstream by its **artefact or counterparty** — LTA report, DD questions, DD responses,
Teaser, OM, Model, Structure chart, Board slides, Rating agency, Power contracts, Ground lease,
Punch list, Reliance letters, Credit agreement, Lease, Amort & sizing. Reuse an existing label
rather than coining a synonym; `Model` and `Financing model` splitting the same workstream defeats
the point. Keep the whole title under ~48 characters — if it will not fit, the action is doing too
much and probably wants splitting or the detail belongs in `notes`.

This is deliberately finer-grained than `group`, which is the broad heading tasks sit under
(Diligence, Structuring, Post-closing). A title reading "DD questions" under a "Diligence" header
is right, not redundant.

**The convention holds for tasks typed into the page too.** The quick-add box does not store what
you type — `toConvention()` in the viewer infers the workstream from a lexicon, reduces the
sentence to an imperative, and assigns the matching group, showing the result in the live preview
before you commit. "waiting on MS to follow up on the Ashville 1 financial model…" becomes
**Model — chase MS** under Ashville 1, with the sentence as typed kept in `notes`. Typing
`Teaser: send the trimmed version to GS` skips the inference and is taken verbatim. When adding a
new workstream label to the dataset, add it to that lexicon too, and put specific labels above
generic ones — a bare `diligence` must not outrank `punch list diligence`.

## Summaries are written, not clipped

Every task carries a `summary` — an authored one-liner under ~55 characters saying what the item
turns on ("Waiting on Laura's review before it can go out"), not the first words of `notes` cut
short. The full text lives in `notes` and only appears on hover. The viewer falls back to
mechanical truncation when `summary` is missing and it reads badly, so do not rely on it.

## Local state is fragile — treat an export as the source of truth

Completions, added tasks, deletions and merges live in the viewer's `localStorage`, not in
`data/taskflow.js`. That is fine on a stable origin (GitHub Pages) and **not** fine in a published
artifact iframe, which can hand out fresh storage on each deploy — so a republish silently discards
the user's ticks. The page now probes storage on load, warns in red when writes do not stick, shows
a running count of local changes, and offers **Copy for safekeeping** / **Restore local changes**.

When the user reports losing completions, ask them to hit *Copy for safekeeping* and paste the
blob. Fold it into the dataset permanently:

- a completed task becomes a `taskUpdates` entry with `status: "Done"` (bump `updateBatch`)
- a task they added becomes a real dataset task, keeping its `u-…` id so their tick stays attached
- an addendum becomes part of the target task's `notes`

That is the only way a completion becomes durable. Never tell the user their ticks are safe when
they are only in a published artifact.

## Never invent a figure

Deal sizes, pricing and dates are quoted from this page into real conversations. If a source does
not state it, leave the field `""` — the page renders "not captured". A traceable gap beats an
untraceable number. Every `projectMeta` fact carries a `sources` entry naming where it came from.

## Do not date things the user did not date

Leave `due` empty rather than inferring a deadline from neighbouring tasks. Suggest dates in chat
instead.

## The viewer is not part of a data refresh

Only `data/taskflow.js` changes on a refresh. Viewer changes are a separate commit. See
`REFRESH.md` for the full contract, the id-stability rules, and the publish steps.

## Verify in a browser before shipping

A JS syntax error in the dataset renders as a completely blank page. `node tools/build-standalone.js`
refuses to build on malformed data, but still load the page and check the console — the repo has
Chromium and `playwright-core` available for this.
