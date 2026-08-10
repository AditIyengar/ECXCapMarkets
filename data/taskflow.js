/* =============================================================================
 * TaskFlow dataset — ECX Corporate Finance desk
 * =============================================================================
 *
 * This file is DATA ONLY. It is regenerated end-to-end by a scheduled Claude
 * Code session (see REFRESH.md). `taskflow/index.html` is the viewer and must
 * never need editing during a refresh.
 *
 * The site layers the user's own edits (completions, new tasks, deletions,
 * handled email) on top of this file in localStorage. The rules that keep a
 * refresh from clobbering those edits:
 *
 *   - Every task/inbox id must be STABLE across refreshes. A task that already
 *     exists is matched by id; its title/notes/due are refreshed from here, but
 *     its status and completedAt come from the user's local state.
 *   - An id the user deleted locally is never resurrected.
 *   - `seedVersion` only needs bumping if the id scheme itself changes.
 *   - Bump `updateBatch` when you add entries to `taskUpdates` — those are
 *     applied exactly once per browser, then remembered.
 *
 * TIME ZONES
 *   Calendar events are stored as UTC instants (trailing "Z"). Microsoft Graph
 *   returns this mailbox's events with timeZone "UTC", so the wall-clock string
 *   it gives back IS the UTC time — do not re-interpret it as local. The viewer
 *   renders everything in meta.timezone.
 *
 * SCHEMA
 *   meta      { as_of, generated_at, timezone, owner, windows, sources, notes }
 *   projects  [{ id, name, color }]
 *   people    [{ email, name, short }]
 *   tasks     [{ id, projectId, title, due, priority, assignee, status,
 *                notes, source }]                 due/notes may be ""
 *   taskUpdates [{ id, status?, note? }]          one-shot patches, see above
 *   events    [{ id, title, startUtc, endUtc, allDay, tentative, organizer,
 *                tag, webLink }]                  tag drives the colour stripe
 *   inbox     [{ id, bucket, subject, from, fromName, receivedUtc, tag,
 *                why, draft, webLink }]
 *               bucket ∈ reply | action | waiting | fyi
 *               why    = one line on why it is in that bucket
 *               draft  = pre-written reply, or "" where a reply is not the ask
 * ============================================================================= */

window.TASKFLOW_DATA = {
  meta: {
    as_of: "2026-08-10",
    generated_at: "2026-08-10T18:00:00Z",
    timezone: "America/Denver",
    owner: { name: "Aditya Iyengar", email: "aiyengar@edgeconnex.com", short: "Me" },
    windows: {
      calendar_from: "2026-08-10",
      calendar_to: "2026-08-21",
      inbox_from: "2026-08-07",
    },
    sources: [
      "Outlook calendar — 40 events, 2026-08-10 → 2026-08-21",
      "Outlook inbox — 50 most recent messages, 2026-08-07 → 2026-08-10 (167 in window)",
      "Task backlog carried over from the TaskFlow artifact seed (updates through 8/10)",
    ],
    notes: [
      "Inbox triage covers the 50 most recent messages in the window, not all 167 — high-volume FYI threads are represented by one grouped entry rather than one per message.",
      "Draft replies are suggestions only. Nothing is ever sent from this site; you copy into Outlook and send yourself.",
    ],
  },

  projects: [
    { id: "proj-austin",    name: "Austin",     color: "#FF6B5E" },
    { id: "proj-ashville",  name: "Ashville 1", color: "#0FA3A3" },
    { id: "proj-ashville2", name: "Ashville 2", color: "#5B8DEF" },
    { id: "proj-enigma",    name: "Enigma",     color: "#7C6FF0" },
    { id: "proj-scioto",    name: "Scioto",     color: "#E0699B" },
    { id: "proj-canyon",    name: "Canyon",     color: "#C2882F" },
    { id: "proj-leroy",     name: "Leroy",      color: "#3FB86B" },
    { id: "proj-liverpool", name: "Liverpool",  color: "#5B8DEF" },
    { id: "proj-ai",        name: "AI Projects", color: "#FFB020" },
  ],

  people: [
    { email: "aiyengar@edgeconnex.com",  name: "Aditya Iyengar",   short: "Me" },
    { email: "lgodschalx@edgeconnex.com", name: "Laura Godschalx", short: "Laura" },
    { email: "rnistala@edgeconnex.com",  name: "Rithika Nistala",  short: "Rithika" },
    { email: "ashockley@edgeconnex.com", name: "Amy Shockley",     short: "Amy" },
    { email: "matthew.way@edgeconnex.com", name: "Matthew Way",    short: "Matthew" },
    { email: "amartirosian@edgeconnex.com", name: "Alexis Martirosian", short: "Alexis" },
    { email: "sgraff@edgeconnex.com",    name: "Scott Graff",      short: "Scott" },
    { email: "cwenger@edgeconnex.com",   name: "Chris Wenger",     short: "Chris W" },
    { email: "eholst@edgeconnex.com",    name: "Eelco Holst",      short: "Eelco" },
    { email: "szheng@edgeconnex.com",    name: "Shelly Zheng",     short: "Shelly" },
    { email: "",                          name: "Turner & Townsend", short: "T&T" },
  ],

  /* --------------------------------------------------------------------------
   * TASKS
   * `source` is free text — where the item came from, so a refresh can tell a
   * carried-over backlog item from one it just found in the mail.
   * ------------------------------------------------------------------------ */
  tasks: [
    // ---- Austin ----
    { id: "s-aus11", projectId: "proj-austin", title: "Send GS questions once Laura has reviewed", due: "2026-08-12", priority: "medium", assignee: "Me", status: "To Do",
      notes: "Blocked on Laura's review of the question list first — tracked in the AUS10 DD Tracker.", source: "backlog" },
    { id: "s-aus7", projectId: "proj-austin", title: "Finalize Austin structure chart", due: "2026-08-11", priority: "medium", assignee: "Me", status: "To Do",
      notes: "Per Laura's handover, ahead of lender diligence.", source: "backlog" },
    { id: "s-aus15", projectId: "proj-austin", title: "Finalize Austin 1 structure chart", due: "2026-08-11", priority: "medium", assignee: "Me", status: "To Do",
      notes: "Drafted; flagged to Laura it may be too much detail for teaser stage — finalize for lender diligence.", source: "backlog" },
    { id: "s-aus14", projectId: "proj-austin", title: "Review Randy's DD responses; check off and send to T&T & GS", due: "2026-08-12", priority: "high", assignee: "Me", status: "To Do",
      notes: "Randy (BCEI) came back 7/30 incl. AUS30 mass grading permit approval, EGU permit confirmation, Zone A floodplain. Confirm the full response set went to T&T and Goldman.", source: "backlog" },
    { id: "t-aus22", projectId: "proj-austin", title: "Send the GS DD questions back over to the team", due: "", priority: "medium", assignee: "Me", status: "To Do",
      notes: "Circulate Goldman's diligence questions internally so the owners can answer them. Sits next to two existing AUS10 DD items — 'Send GS questions once Laura has reviewed' (outbound to GS, blocked on Laura) and 'Review Randy's DD responses… send to T&T & GS'. Merge them if this is the same pass.", source: "added by request 2026-08-10" },
    { id: "t-aus20", projectId: "proj-austin", title: "Prep for Austin wastewater / road financing call (Tue 1:00 PM MT)", due: "2026-08-11", priority: "high", assignee: "Me", status: "To Do",
      notes: "Winstead's 8/10 read: tax-exempt bonds likely NOT available — tax base must include at least 10 independent taxpayers. Randy Scott confirmed he is not the MUD-law expert. Go in knowing the MUD financing route is the open question.", source: "email 8/10 — Winstead / BCEI thread" },
    { id: "t-aus21", projectId: "proj-austin", title: "Track PUCT public meetings on the governor's directive (8/14 and 8/20)", due: "2026-08-14", priority: "medium", assignee: "Me", status: "To Do",
      notes: "Laura Youngers 8/10: Texas PUCT holds public meetings Fri 8/14 and Thu 8/20 where process around the audit is expected. Chris Jenkins — Lisa leading consensus on the question set, consultant call held 8/10.", source: "email 8/10 — Austin campus (governor's directive)" },

    // ---- Ashville 1 ----
    { id: "s-ash13", projectId: "proj-ashville", title: "Go through the Ashville 1 OM and leave comments", due: "2026-08-11", priority: "high", assignee: "Me", status: "To Do",
      notes: "DPW circulated the revised Business section + full OM 7/29; checked in 8/5 asking for initial comments — now overdue on their clock. You and Rithika owe the pass; Eelco also asked to review.", source: "backlog" },
    { id: "s-ash14", projectId: "proj-ashville", title: "Chase responders on the DPW diligence request", due: "2026-08-11", priority: "high", assignee: "Me", status: "To Do",
      notes: "Internal round sent 8/10. Laura added Albert Ivezaj for financials; Matthew Way handling VDR/KYC (3 executed LPAs uploaded to Box 8/10, still awaiting structure chart + consents/resolutions from the ECX side). Amy Shockley has open questions back to you.", source: "backlog" },
    { id: "t-ash20", projectId: "proj-ashville", title: "Reply to Amy Shockley — Non-GAAP language + who the parent is", due: "2026-08-11", priority: "high", assignee: "Me", status: "To Do",
      notes: "Amy 8/10: is all the Non-GAAP language in the chain, or is more to be confirmed? And clarify who the parent is in this context so she can provide senior indebtedness. Gating the DPW financials response.", source: "email 8/10 — Ashville 1: Davis Polk Diligence Requests" },
    { id: "t-ash21", projectId: "proj-ashville", title: "Send the executed Ashville contracts to Davis Polk", due: "2026-08-11", priority: "high", assignee: "Me", status: "To Do",
      notes: "Alexis Martirosian circulated them 8/10 and flagged them for you specifically; Jackson has already loaded them into the engine. Closes one of the DPW diligence gaps.", source: "email 8/10 — Executed Ashville contracts" },
    { id: "s-ash15", projectId: "proj-ashville", title: "Follow up on signed construction contracts for the LTA report", due: "", priority: "medium", assignee: "T&T", status: "To Do",
      notes: "LTA v7 delivered 8/5 with final comments incorporated — last open item is folding in the signed construction contracts once received.", source: "backlog" },
    { id: "t-ash23", projectId: "proj-ashville", title: "Check with Shelly on the Ashville 1 power contracts", due: "", priority: "medium", assignee: "Me", status: "To Do",
      notes: "Shelly Zheng (szheng@edgeconnex.com) sits on the PowerConneX side — she is on the PCX entity discussion thread and the PCXCMH11 Ashville Phase 1 VG Turbines SRA payment (LM6000s). Feeds the diligence set: the latest PPA is still owed to Davis Polk, and A&O are sending Scale a redline of the power agreement.", source: "added by request 2026-08-10" },
    { id: "s-ash12", projectId: "proj-ashville", title: "Respond to Ares on the Ashville referendum", due: "", priority: "medium", assignee: "Me", status: "To Do",
      notes: "Reply still owed to Ares on the referendum question.", source: "backlog" },
    { id: "s-ash7", projectId: "proj-ashville", title: "Reply to Macy — technical advisor & rating agency meetings", due: "2026-08-11", priority: "medium", assignee: "Me", status: "To Do",
      notes: "Scheduling Ashville 1 sessions with the technical advisor and rating agencies — confirm availability and preferred slots. Rithika confirmed to MS on 8/10 that the materials are OK to share with the rating agencies.", source: "backlog" },
    { id: "s-ash2", projectId: "proj-ashville", title: "Revoke Newmark folder access & send updated RFS dates", due: "2026-08-11", priority: "medium", assignee: "Me", status: "To Do",
      notes: "From Laura's 'Ashville - Information' email. Two parts: confirm Newmark no longer has folder access, then share updated RFS dates.", source: "backlog" },
    { id: "s-ash10", projectId: "proj-ashville", title: "Launch Ashville 1", due: "2026-08-14", priority: "high", assignee: "Me", status: "To Do",
      notes: "Launch was targeted 8/10 per the handover plan. LTA report (v7 in), OM comments, and the DPW diligence set all feed readiness — OM comments are the long pole.", source: "backlog" },
    { id: "t-ash22", projectId: "proj-ashville", title: "Update the MOR financing board slides", due: "2026-08-11", priority: "high", assignee: "Me", status: "To Do",
      notes: "Rithika bumped this 8/10 — she needs an updated 'Board Presentation - Financing Update August 2026.pptx' ready by 8/11. Q2 CFO Update is 5:30 AM MT on 8/11.", source: "email 8/10 — MOR Financing Board Slides August 2026 Update" },

    // ---- Scioto ----
    { id: "t-sci1", projectId: "proj-scioto", title: "Prep for the Scioto financing options call", due: "2026-08-13", priority: "medium", assignee: "Me", status: "To Do",
      notes: "A&O Shearman (Dorina Yessios) coordinated with Laura on 8/10 to move this to Thursday 2:00 PM EST and asked Grace to reissue the invite — the Tue 8/11 and Wed 8/12 holds on your calendar are the stale versions.", source: "email 8/10 — Project Scioto preliminary call" },

    // ---- Canyon ----
    { id: "t-can1", projectId: "proj-canyon", title: "Review the Project Canyon credit agreement draft", due: "2026-08-13", priority: "medium", assignee: "Me", status: "To Do",
      notes: "King & Spalding (Brooke Jansen) circulated the initial draft 8/9, clean and marked against the precedent shared before the commitment papers were signed. ECX & EQT teams both on it.", source: "email 8/9 — Project Canyon | Credit Agreement" },

    // ---- Enigma ----
    { id: "s-eni3", projectId: "proj-enigma", title: "Engage counsel on scenario & consent analysis", due: "2026-08-14", priority: "medium", assignee: "Me", status: "To Do",
      notes: "Kicks off once EQT's model lands — stableco & ECX cash/NOI timing plus proposed debt repayments, expected around 8/5.", source: "backlog" },

    // ---- Leroy (post-closing) ----
    { id: "t-ler10", projectId: "proj-leroy", title: "Get time with Clay (Blackstone) on the Leroy upsize / Austin addition", due: "2026-08-12", priority: "medium", assignee: "Me", status: "To Do",
      notes: "Clay Macfarlane came back 8/10 — happy to cover the CA turn, MB/local counsel questions, and the Austin addition; Matt Martin separately asked for AUS time. Laura opened it, you are on the thread.", source: "email 8/10 — Project Leroy: Upsize" },
    { id: "s-ler1", projectId: "proj-leroy", title: "Finland: reliance letters — environmental report & geotech", due: "", priority: "medium", assignee: "Me", status: "To Do",
      notes: "Post-closing item following the 7/31 Finland closing/funding (Bx wired).", source: "backlog" },
    { id: "s-ler2", projectId: "proj-leroy", title: "Norway: reliance letters — environmental report & geotech", due: "", priority: "medium", assignee: "Me", status: "To Do",
      notes: "Same post-closing requirement as Finland.", source: "backlog" },
    { id: "s-ler3", projectId: "proj-leroy", title: "Finland: send updated Exhibit A to Bx (post-closing)", due: "", priority: "medium", assignee: "Me", status: "To Do",
      notes: "NMRK appraisal comments for Finland already sent. Updated Exhibit A needed post-closing — valuation could change at the next draw.", source: "backlog" },
    { id: "s-ler4", projectId: "proj-leroy", title: "Send request for updated Austin campus punch list", due: "2026-08-11", priority: "medium", assignee: "Me", status: "To Do",
      notes: "NMRK and T&T already engaged. ~2 weeks for the punch list; Bx to come back with questions after.", source: "backlog" },
    { id: "s-ler5", projectId: "proj-leroy", title: "Austin campus: pull together diligence for the punch list", due: "", priority: "medium", assignee: "Me", status: "To Do",
      notes: "Our side of the punch-list process while NMRK/T&T run their review.", source: "backlog" },
    { id: "s-ler6", projectId: "proj-leroy", title: "Austin campus: Rithika to work through open items and revert", due: "", priority: "medium", assignee: "Rithika", status: "In Progress",
      notes: "Rithika going through the open punch-list items to come back with a consolidated list.", source: "backlog" },

    // ---- AI Projects ----
    { id: "s-ai4", projectId: "proj-ai", title: "Reach out to Pradeep — bank relationship tracker", due: "", priority: "medium", assignee: "Me", status: "To Do",
      notes: "Kick off the bank relationship tracker build.", source: "backlog" },
    { id: "s-ai1", projectId: "proj-ai", title: "Bank relationship tracker", due: "", priority: "medium", assignee: "Me", status: "In Progress",
      notes: "Lender relationships across deals — coverage contacts, past participations, recent touchpoints. First cut already live in this repo as the Bank Conversation Dashboard.", source: "backlog" },
    { id: "s-ai2", projectId: "proj-ai", title: "Comps dashboard", due: "", priority: "medium", assignee: "Me", status: "To Do",
      notes: "Live dashboard of data-center financing comps — pricing, structure, tenor, sponsor across recent deals.", source: "backlog" },
    { id: "s-ai3", projectId: "proj-ai", title: "Legal agent", due: "", priority: "medium", assignee: "Me", status: "To Do",
      notes: "AI agent to first-pass legal documents — flag key terms, deviations from precedent, open issues for counsel.", source: "backlog" },
  ],

  /* One-shot patches applied exactly once per browser. Bump meta_updateBatch
   * below whenever you append here. */
  taskUpdates: [],
  updateBatch: 3,
  seedVersion: 6,

  /* --------------------------------------------------------------------------
   * CALENDAR — Outlook, 2026-08-10 → 2026-08-21. Instants are UTC.
   * ------------------------------------------------------------------------ */
  events: [
    { id: "ev-denver-1", title: "Denver", startUtc: "2026-08-06T00:00:00Z", endUtc: "2026-08-17T00:00:00Z", allDay: true, tentative: false, organizer: "Me", tag: "location" },
    { id: "ev-va-1", title: "Virginia", startUtc: "2026-08-17T00:00:00Z", endUtc: "2026-08-20T00:00:00Z", allDay: true, tentative: false, organizer: "Me", tag: "location" },
    { id: "ev-herndon-1", title: "Aditya — Herndon", startUtc: "2026-08-18T00:00:00Z", endUtc: "2026-08-21T00:00:00Z", allDay: true, tentative: false, organizer: "Me", tag: "location" },
    { id: "ev-denver-2", title: "Denver", startUtc: "2026-08-20T00:00:00Z", endUtc: "2026-08-31T00:00:00Z", allDay: true, tentative: false, organizer: "Me", tag: "location" },

    { id: "ev-0810-1", title: "Rithika flying into work", startUtc: "2026-08-10T13:00:00Z", endUtc: "2026-08-10T15:30:00Z", allDay: false, tentative: false, organizer: "Rithika", tag: "internal" },
    { id: "ev-0810-2", title: "Laura | Aditya Catch-up", startUtc: "2026-08-10T17:45:00Z", endUtc: "2026-08-10T18:15:00Z", allDay: false, tentative: false, organizer: "Me", tag: "internal" },
    { id: "ev-0810-3", title: "Aditya | Rithika: Standing Call", startUtc: "2026-08-10T19:00:00Z", endUtc: "2026-08-10T19:30:00Z", allDay: false, tentative: false, organizer: "Me", tag: "internal" },

    { id: "ev-0811-1", title: "Q2 CFO Update hosted by Joe Harar", startUtc: "2026-08-11T11:30:00Z", endUtc: "2026-08-11T12:00:00Z", allDay: false, tentative: false, organizer: "Alexandra Capon", tag: "internal" },
    { id: "ev-0811-2", title: "Project Scioto — call to discuss financing options", startUtc: "2026-08-11T16:00:00Z", endUtc: "2026-08-11T17:00:00Z", allDay: false, tentative: true, organizer: "Davis Polk", tag: "scioto" },
    { id: "ev-0811-3", title: "Laura / Aditya bi-weekly", startUtc: "2026-08-11T18:00:00Z", endUtc: "2026-08-11T18:30:00Z", allDay: false, tentative: false, organizer: "Laura", tag: "internal" },
    { id: "ev-0811-4", title: "Aditya | Rithika: Standing Call", startUtc: "2026-08-11T18:30:00Z", endUtc: "2026-08-11T19:00:00Z", allDay: false, tentative: false, organizer: "Me", tag: "internal" },
    { id: "ev-0811-5", title: "Austin Development — Wastewater Structure and Road Financing", startUtc: "2026-08-11T19:00:00Z", endUtc: "2026-08-11T20:00:00Z", allDay: false, tentative: false, organizer: "Randy Scott (BCEI)", tag: "austin" },
    { id: "ev-0811-6", title: "Real Estate / Liquidity Forecast Call", startUtc: "2026-08-11T19:00:00Z", endUtc: "2026-08-11T19:30:00Z", allDay: false, tentative: false, organizer: "Josh Bernstein", tag: "internal" },

    { id: "ev-0812-1", title: "CF Pipeline", startUtc: "2026-08-12T12:00:00Z", endUtc: "2026-08-12T13:00:00Z", allDay: false, tentative: false, organizer: "Laura", tag: "internal" },
    { id: "ev-0812-2", title: "Catch up ECX / HVG / AOS / K&S", startUtc: "2026-08-12T13:00:00Z", endUtc: "2026-08-12T13:30:00Z", allDay: false, tentative: false, organizer: "Laura", tag: "internal" },
    { id: "ev-0812-3", title: "Project Ashville Weekly Sync", startUtc: "2026-08-12T14:30:00Z", endUtc: "2026-08-12T15:00:00Z", allDay: false, tentative: false, organizer: "Morgan Stanley", tag: "ashville" },
    { id: "ev-0812-4", title: "Insurance — large campuses", startUtc: "2026-08-12T15:30:00Z", endUtc: "2026-08-12T16:00:00Z", allDay: false, tentative: true, organizer: "Laura", tag: "internal" },
    { id: "ev-0812-5", title: "Project Scioto — preliminary call to discuss financing options", startUtc: "2026-08-12T16:00:00Z", endUtc: "2026-08-12T17:00:00Z", allDay: false, tentative: true, organizer: "Grace McLeish", tag: "scioto" },
    { id: "ev-0812-6", title: "Aditya | Rithika: Standing Call", startUtc: "2026-08-12T19:00:00Z", endUtc: "2026-08-12T19:30:00Z", allDay: false, tentative: false, organizer: "Me", tag: "internal" },

    { id: "ev-0813-1", title: "Following: JJ off", startUtc: "2026-08-13T06:00:00Z", endUtc: "2026-08-13T06:15:00Z", allDay: false, tentative: false, organizer: "JJ Oui-Chaplain", tag: "internal" },
    { id: "ev-0813-2", title: "Ashville — ECX Weekly Team Call", startUtc: "2026-08-13T13:30:00Z", endUtc: "2026-08-13T14:00:00Z", allDay: false, tentative: false, organizer: "Davis Polk", tag: "ashville" },
    { id: "ev-0813-3", title: "Project Liverpool — Syndicated Facility — ICLA Weekly Call", startUtc: "2026-08-13T14:30:00Z", endUtc: "2026-08-13T15:15:00Z", allDay: false, tentative: false, organizer: "Natixis", tag: "liverpool" },
    { id: "ev-0813-4", title: "Aditya | Rithika: Standing Call", startUtc: "2026-08-13T19:00:00Z", endUtc: "2026-08-13T19:30:00Z", allDay: false, tentative: false, organizer: "Me", tag: "internal" },

    { id: "ev-0814-1", title: "Cash Flow Call", startUtc: "2026-08-14T15:00:00Z", endUtc: "2026-08-14T15:30:00Z", allDay: false, tentative: false, organizer: "Josh Bernstein", tag: "internal" },
    { id: "ev-0814-2", title: "Friday Lunch (Olive Garden)", startUtc: "2026-08-14T16:00:00Z", endUtc: "2026-08-14T17:00:00Z", allDay: false, tentative: true, organizer: "Sara Schultz", tag: "social" },
    { id: "ev-0814-3", title: "Aditya | Rithika: Standing Call", startUtc: "2026-08-14T19:00:00Z", endUtc: "2026-08-14T19:30:00Z", allDay: false, tentative: false, organizer: "Me", tag: "internal" },

    { id: "ev-0817-1", title: "Chris Out of Office", startUtc: "2026-08-17T12:00:00Z", endUtc: "2026-08-17T12:05:00Z", allDay: false, tentative: false, organizer: "Chris Wenger", tag: "internal" },
    { id: "ev-0817-2", title: "Aditya | Rithika: Standing Call", startUtc: "2026-08-17T19:00:00Z", endUtc: "2026-08-17T19:30:00Z", allDay: false, tentative: false, organizer: "Me", tag: "internal" },

    { id: "ev-0818-1", title: "Denver Wellness Month — Chair Massage Day", startUtc: "2026-08-18T19:00:00Z", endUtc: "2026-08-18T21:45:00Z", allDay: false, tentative: false, organizer: "Sara Schultz", tag: "social" },
    { id: "ev-0818-2", title: "Aditya | Rithika: Standing Call", startUtc: "2026-08-18T19:00:00Z", endUtc: "2026-08-18T19:30:00Z", allDay: false, tentative: false, organizer: "Me", tag: "internal" },

    { id: "ev-0819-1", title: "CF Pipeline", startUtc: "2026-08-19T12:00:00Z", endUtc: "2026-08-19T13:00:00Z", allDay: false, tentative: false, organizer: "Laura", tag: "internal" },
    { id: "ev-0819-2", title: "Catch up ECX / HVG / AOS / K&S", startUtc: "2026-08-19T13:00:00Z", endUtc: "2026-08-19T13:30:00Z", allDay: false, tentative: false, organizer: "Laura", tag: "internal" },
    { id: "ev-0819-3", title: "Project Ashville Weekly Sync", startUtc: "2026-08-19T14:30:00Z", endUtc: "2026-08-19T15:00:00Z", allDay: false, tentative: false, organizer: "Morgan Stanley", tag: "ashville" },
    { id: "ev-0819-4", title: "Aditya | Rithika: Standing Call", startUtc: "2026-08-19T19:00:00Z", endUtc: "2026-08-19T19:30:00Z", allDay: false, tentative: false, organizer: "Me", tag: "internal" },

    { id: "ev-0820-1", title: "Ashville — ECX Weekly Team Call", startUtc: "2026-08-20T13:30:00Z", endUtc: "2026-08-20T14:00:00Z", allDay: false, tentative: false, organizer: "Davis Polk", tag: "ashville" },
    { id: "ev-0820-2", title: "Project Liverpool — Syndicated Facility — ICLA Weekly Call", startUtc: "2026-08-20T14:30:00Z", endUtc: "2026-08-20T15:15:00Z", allDay: false, tentative: false, organizer: "Natixis", tag: "liverpool" },
    { id: "ev-0820-3", title: "Aditya | Rithika: Standing Call", startUtc: "2026-08-20T19:00:00Z", endUtc: "2026-08-20T19:30:00Z", allDay: false, tentative: false, organizer: "Me", tag: "internal" },

    { id: "ev-0821-1", title: "Cash Flow Call", startUtc: "2026-08-21T15:00:00Z", endUtc: "2026-08-21T15:30:00Z", allDay: false, tentative: false, organizer: "Josh Bernstein", tag: "internal" },
    { id: "ev-0821-2", title: "Friday Lunch (Super Chicken)", startUtc: "2026-08-21T16:00:00Z", endUtc: "2026-08-21T17:00:00Z", allDay: false, tentative: true, organizer: "Sara Schultz", tag: "social" },
    { id: "ev-0821-3", title: "Aditya | Rithika: Standing Call", startUtc: "2026-08-21T19:00:00Z", endUtc: "2026-08-21T19:30:00Z", allDay: false, tentative: false, organizer: "Me", tag: "internal" },
  ],

  /* --------------------------------------------------------------------------
   * PROJECT META — the deal sheet behind the Projects tab.
   *
   * Every field here must be SOURCED. `sources` names where each fact came
   * from; anything not evidenced is left as "" and shown on the page as "not
   * captured" rather than guessed. Sizes especially: a plausible-looking
   * number nobody can trace is worse than a blank.
   *
   * Active workstreams are NOT stored here — they are derived live from the
   * open tasks on each project, so the table cannot drift from the board.
   *
   * meta { projectId, codename, stage, stageKind, size, sizeNote, type,
   *        counterparties: [{ name, role }], notes[], sources[] }
   *   stageKind ∈ live | market | docs | closed | early   (drives the chip colour)
   * ------------------------------------------------------------------------ */
  projectMeta: [
    {
      projectId: "proj-austin",
      codename: "Austin campus / AUS10 series",
      stage: "Lender outreach live",
      stageKind: "market",
      size: "",
      sizeNote: "Campus size not captured. Goldman floated a $2bn Leroy upsize as an alternative home for Austin rather than financing the AUS10 series standalone; the campus was described as 6 individual buildings.",
      type: "Project finance — campus land + data centre / energy centre. Bridge via Goldman under discussion; MUFG treating the Energy Center as development + tolling rather than partly merchant.",
      counterparties: [
        { name: "Goldman Sachs", role: "Lead / bridge + diligence" },
        { name: "MUFG", role: "Energy Center financing" },
        { name: "SMBC", role: "Austin PF interest" },
        { name: "Blackstone", role: "Leroy upsize / Austin addition" },
        { name: "BCEI", role: "Developer (Randy Scott)" },
        { name: "Turner & Townsend", role: "Technical advisor / LTA" },
        { name: "Winstead", role: "MUD & wastewater counsel" },
        { name: "Newmark", role: "Appraisal" }
      ],
      notes: [
        "Teaser and lender model finalised and distributed w/o 8/3; bank list signed off by Eelco, Joe and Johan, with Morgan Stanley added 8/6.",
        "Winstead's 8/10 read: tax-exempt bonds likely unavailable — the tax base must include at least 10 independent taxpayers. The MUD financing route is the live question.",
        "Texas PUCT holds public meetings on the governor's directive 8/14 and 8/20; Lisa Youngers leading the consensus on ECX's question set."
      ],
      sources: [
        "CF Pipeline / GS call notes 2026-04-22 (AUS10 series / Leroy)",
        "MUFG call notes 2026-07-21 (Austin development financing)",
        "SMBC call notes 2026-07-22",
        "Email 2026-08-10 — Winstead / BCEI wastewater thread"
      ]
    },
    {
      projectId: "proj-ashville",
      codename: "Ashville 1",
      stage: "Pre-launch — OM in comments",
      stageKind: "docs",
      size: "",
      sizeNote: "Deal size not captured in the sources read so far.",
      type: "High-yield / 144A bond. Morgan Stanley's 7/28 market read had it pricing in the low 7s; rating agency and technical-advisor sessions being scheduled.",
      counterparties: [
        { name: "Morgan Stanley", role: "Lead / bookrunner" },
        { name: "Davis Polk", role: "ECX counsel" },
        { name: "Cahill Gordon", role: "Underwriter counsel" },
        { name: "SMBC", role: "HY market dialogue" },
        { name: "Dickinson Wright", role: "Regulatory framework" },
        { name: "Tatusko / Greenberg Traurig", role: "Local counsel" },
        { name: "Turner & Townsend", role: "LTA report" }
      ],
      notes: [
        "Launch was targeted 8/10 per the handover plan; the OM comment pass is the long pole and is now overdue on Davis Polk's clock (they chased 8/5).",
        "LTA report v7 delivered 8/5 with final comments incorporated — only the signed construction contracts remain to fold in.",
        "Rithika confirmed to Morgan Stanley on 8/10 that materials are cleared to share with the rating agencies."
      ],
      sources: [
        "SMBC call notes 2026-07-22 (Ashville HY market)",
        "Email 2026-08-10 — Project Ashville Weekly Sync thread",
        "Email 2026-08-10 — Ashville 1: Davis Polk Diligence Requests"
      ]
    },
    {
      projectId: "proj-ashville2",
      codename: "Ashville 2 — Ashville Energy Center Phase 2 (\"Unwrapped\")",
      stage: "Anchor investor sounding",
      stageKind: "market",
      size: "$500m+ anchor ticket",
      sizeNote: "Apterra indicated a minimum $500m anchor ticket with upside — that is a ticket, not the deal size. Total size not captured.",
      type: "Unwrapped backleverage / private placement to an anchor investor. Apterra's read: ANT paper priced at 8.5% unwrapped for Big Sky, and ECX screens better on balance sheet and sponsor.",
      counterparties: [
        { name: "Barclays", role: "Advising on backleverage & anchors" },
        { name: "Apterra", role: "Anchor investor candidate" },
        { name: "Apollo", role: "Term sheet" },
        { name: "Blackstone", role: "Term sheet" },
        { name: "Ares / Brookfield / Blue Owl / HPS", role: "Potential anchors (Barclays list)" },
        { name: "Santander / Deutsche Bank", role: "Backleverage — less liquid, more bespoke" },
        { name: "EQT", role: "Sponsor (Johan Hylander)" }
      ],
      notes: [
        "Apterra flagged mild pricing concern against another deal in the mid-500s.",
        "Technical walkthrough of the Energy Center held 7/20 with Apterra's Chief Risk Officer — power load swing solution (UIG microgrid control scheme) and plot plan."
      ],
      sources: [
        "Barclays call notes 2026-07-23 (Ashville 2 unwrapped)",
        "Apterra call notes 2026-07-15 and 2026-07-20"
      ]
    },
    {
      projectId: "proj-scioto",
      codename: "Scioto",
      stage: "Financing options",
      stageKind: "early",
      size: "",
      sizeNote: "Not captured — the deal is still at the options stage.",
      type: "Structure and financing options under review; Barclays has produced a targeted investor list (the \"Big Sky\" deck) for Scioto 2.",
      counterparties: [
        { name: "A&O Shearman", role: "Counsel (Dorina Yessios, Peter Tolson)" },
        { name: "Davis Polk", role: "Counsel" },
        { name: "Barclays", role: "Targeted investor list" },
        { name: "EQT", role: "Sponsor (Johan Hylander)" }
      ],
      notes: [
        "The preliminary financing-options call moved to Thursday 2:00 PM EST on 8/10; the Tue 8/11 and Wed 8/12 holds still sitting on the calendar are the stale invites."
      ],
      sources: [
        "Email 2026-08-10 — Project Scioto preliminary call",
        "Barclays call notes 2026-07-23"
      ]
    },
    {
      projectId: "proj-canyon",
      codename: "Canyon",
      stage: "Credit agreement drafting",
      stageKind: "docs",
      size: "",
      sizeNote: "Not captured.",
      type: "Committed facility — commitment papers already signed; King & Spalding circulated the initial credit agreement 8/9, marked against the pre-signing precedent.",
      counterparties: [
        { name: "King & Spalding", role: "Drafting counsel (Brooke Jansen)" },
        { name: "EQT", role: "Sponsor" }
      ],
      notes: [
        "Clean and marked versions both circulated to the ECX and EQT teams for review."
      ],
      sources: [
        "Email 2026-08-09 — Project Canyon | Credit Agreement"
      ]
    },
    {
      projectId: "proj-enigma",
      codename: "Enigma",
      stage: "Structuring",
      stageKind: "early",
      size: "",
      sizeNote: "Not captured.",
      type: "Forward sale. EQT ranked the structure options; the scenario work turns on stableco and ECX cash/NOI timing plus proposed debt repayments.",
      counterparties: [
        { name: "EQT", role: "Sponsor — structure rankings (Abbey)" },
        { name: "Counsel", role: "To be engaged on scenario & consent analysis" }
      ],
      notes: [
        "Forward Sale Structure Options call held 7/30; Eelco deferred to AMS on timing.",
        "Counsel engagement waits on EQT's model, expected around 8/5."
      ],
      sources: [
        "Calendar 2026-07-30 — Project Enigma | Forward Sale Structure Options",
        "Task backlog carried from the CF Pipeline notes"
      ]
    },
    {
      projectId: "proj-leroy",
      codename: "Leroy",
      stage: "Closed — upsize in negotiation",
      stageKind: "closed",
      size: "$1,000m",
      sizeNote: "Facility size per the Q2 2026 Commitments workbook (see the Bank Conversation Dashboard). A further upsize is live, and Goldman floated a $2bn increase as a way to house Austin.",
      type: "Land / early-stage facility with Blackstone. Post-closing obligations running on Finland and Norway; upsize negotiation covers power percentages and caps.",
      counterparties: [
        { name: "Blackstone", role: "Lender (Clay Macfarlane, Matt Martin)" },
        { name: "Wells Fargo", role: "Upsize negotiation" },
        { name: "Newmark", role: "Appraisal" },
        { name: "Turner & Townsend", role: "Punch list review" }
      ],
      notes: [
        "Finland closed and funded 7/31 (Blackstone wired); reliance letters and an updated Exhibit A are the open post-closing items, with Norway on the same pattern.",
        "Clay came back 8/10 offering time on the CA turn, MB/local counsel questions and the Austin addition."
      ],
      sources: [
        "Q2 2026 Commitments workbook via data/data.js facilities",
        "Wells Fargo call notes 2026-04-15 (Leroy upsize / ATL12)",
        "Email 2026-08-10 — Project Leroy: Upsize"
      ]
    },
    {
      projectId: "proj-liverpool",
      codename: "Liverpool",
      stage: "Syndicated — in life",
      stageKind: "closed",
      size: "",
      sizeNote: "Not captured in the datasets read so far; the facility does not appear under this codename in the Q2 2026 commitments extract.",
      type: "Syndicated facility, administered through a weekly ICLA lender call.",
      counterparties: [
        { name: "Natixis", role: "Agent / organiser (Jorge Bravo)" },
        { name: "Société Générale", role: "Lender" },
        { name: "BBVA", role: "Lender" }
      ],
      notes: [
        "Weekly ICLA call every Thursday, 8:30 AM MT."
      ],
      sources: [
        "Calendar — Project Liverpool Syndicated Facility ICLA Weekly Call"
      ]
    }
  ]
};
