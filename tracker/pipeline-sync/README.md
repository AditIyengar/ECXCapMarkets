# CF Pipeline sync (Excel to tracker)

The tracker's CF Pipeline tab keeps its deals in the artifact's shared store, and the team edits them there. Some people still update `Corporate Finance Pipeline_NEW.xlsx` › `Pipeline (transactions)`. Every hour, the scheduled run reads the Excel and brings its changes into the tracker. It never undoes something the team typed in the tracker. The steps are in `RUNBOOK.md`.

## How it decides

The sync remembers the Excel as it was at the last sync. This is the "baseline", stored in the tracker as `pipelineMeta/sheetSync`. For every cell it compares three values: the Excel last time, the Excel now, and the tracker now.

| Excel then → now | Tracker | What happens |
|---|---|---|
| unchanged | anything | nothing (a tracker edit stays) |
| changed | still the old value | the Excel value is written, with a history line "by Excel" |
| changed | already the new value | nothing (already in sync) |
| changed | something else | **conflict**: the tracker keeps its value; the report shows all three |

- **Bullets.** The bullet columns (status update, key issues, technical / legal / other issues) are compared bullet by bullet, using the tracker's own "x … x …" rule. Spacing alone is never a change.
- **Positions** (the row number in the Excel, and the order within a section) are kept in step quietly: no history line, no "updated" stamp. A deal's order is only rewritten when the Excel moved it. If the team reordered a section in the tracker, the tracker's order wins and the report says so.
- **New Excel rows** become new deals. "Kick-off" maps to the stage Kick-off & sounding, and "Paused" sets paused.
- **Renamed rows** (same section, same site and sponsor, or mostly the same cells) keep their tracker deal; only the name changes. Renaming back works the same way.
- **Rows deleted from the Excel are never deleted from the tracker.** They are flagged once so someone can remove them by hand.
- **The same name twice** (Mirai in Pipeline and in Removed, or a new deal that reuses an old deal's name) is matched by section and content, not by the row's id, so one deal can never be written into another. A new deal whose name is already taken is created as `<name>-2`, the way the tracker names a second deal with the same name.
- **Tracker-only fields and deals** are never touched: stage, paused, the tracker project link, and deals added in the tracker. If a new Excel row would take the id of a deal added in the tracker, it is flagged once and not written (it is added later if that tracker deal is removed).
- **When a sync must stop.** If the sheet's layout changes (headers, columns, section labels), nothing is written and Aditya gets the error. The same happens if one run would change too much at once (field changes on more than 25 rows, more than 6 new rows, or more than 4 rows gone), or if a deal would grow past the store's 256 KiB document limit.
- **Every flag is raised once**, in the run that first sees it, so the hourly report does not repeat itself.
- **Hourly runs that find nothing write nothing.**
- **Before the first scheduled run**, the baseline has to be set up once with Aditya (see `RUNBOOK.md`), because the tracker already holds edits that differ from the Excel.

## Files

- `parse_sheet.py`: reads the Microsoft 365 connector's text dump of the workbook and writes the Pipeline sheet as JSON, with the same ids the store uses. It fails loudly (exit code 2) on any change to the sheet's structure.
- `plan_sync.py`: the three-way merge. It reads the parsed sheet, the baseline and a local copy of the store. It writes the ArtifactData batches, the new baseline, `report.md` and `summary.json`. It never talks to the store; the scheduled run applies the batches.
- `tests/`: synthetic scenarios for every rule, a seeded random test (edit, apply, re-plan: no further writes), and a replay of the real 11/2/26 first sync. The replay fixtures hold only the Pipeline sheet and the pipeline store.

```
python3 -I -m unittest discover tracker/pipeline-sync/tests
```
