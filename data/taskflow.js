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
   * INBOX — triaged. `draft` is a suggested reply, never sent automatically.
   * ------------------------------------------------------------------------ */
  inbox: [
    {
      id: "in-amy-nongaap",
      bucket: "reply",
      subject: "Re: Ashville 1: Davis Polk Diligence Requests",
      from: "ashockley@edgeconnex.com",
      fromName: "Amy Shockley",
      receivedUtc: "2026-08-10T12:59:52Z",
      tag: "ashville",
      why: "Two direct questions to you, and her answer gates the senior-indebtedness piece of the DPW financials response.",
      draft:
"Hi Amy,\n\n" +
"On the Non-GAAP language — the chain below has what we've agreed so far; I'll confirm by end of day whether anything else still needs sign-off and flag it if so.\n\n" +
"On the parent: for this request it's the issuer's direct parent, not the ECX topco. I'll send the entity name and the structure chart reference so the senior indebtedness figure is drawn at the right level.\n\n" +
"Thanks,\nAditya",
      webLink: "https://outlook.office365.com/owa/?ItemID=AAMkAGRiZTVlNjlmLTBhZGYtNDRhYi05NzMzLWRmNzIyOGJmN2Y3NABGAAAAAAAcqWuLqEZVSqb1h236JFxbBwBiG54edwtBTKT4tXRW1gjnAAAAAAEMAABiG54edwtBTKT4tXRW1gjnAAAeGZoPAAA%3D&exvsurl=1&viewmodel=ReadMessageItem",
    },
    {
      id: "in-alexis-contracts",
      bucket: "reply",
      subject: "Executed Ashville contracts.",
      from: "amartirosian@edgeconnex.com",
      fromName: "Alexis Martirosian",
      receivedUtc: "2026-08-10T16:30:48Z",
      tag: "ashville",
      why: "Alexis tagged you by name to push these to Davis Polk. Jackson has already loaded them into the engine.",
      draft:
"Thanks Alexis — I'll get these over to Davis Polk today and note them against the diligence list.\n\n" +
"Jackson, thanks for loading them into the engine.\n\n" +
"Best,\nAditya",
      webLink: "https://outlook.office365.com/owa/?ItemID=AAMkAGRiZTVlNjlmLTBhZGYtNDRhYi05NzMzLWRmNzIyOGJmN2Y3NABGAAAAAAAcqWuLqEZVSqb1h236JFxbBwBiG54edwtBTKT4tXRW1gjnAAAAAAEMAABiG54edwtBTKT4tXRW1gjnAAAeGZorAAA%3D&exvsurl=1&viewmodel=ReadMessageItem",
    },
    {
      id: "in-rithika-boardslides",
      bucket: "reply",
      subject: "Re: MOR Financing Board Slides August 2026 Update",
      from: "rnistala@edgeconnex.com",
      fromName: "Rithika Nistala",
      receivedUtc: "2026-08-10T10:52:29Z",
      tag: "internal",
      why: "Second ask from Rithika — she needs the updated deck by 8/11, and the Q2 CFO Update is 5:30 AM MT that morning.",
      draft:
"Hi Rithika,\n\n" +
"Thanks for the bump — I'll get my sections of the financing update back to you today so you have a clean version for tomorrow.\n\n" +
"If anything is still open by this evening I'll flag it rather than hold the deck.\n\n" +
"Best,\nAditya",
      webLink: "https://outlook.office365.com/owa/?ItemID=AAMkAGRiZTVlNjlmLTBhZGYtNDRhYi05NzMzLWRmNzIyOGJmN2Y3NABGAAAAAAAcqWuLqEZVSqb1h236JFxbBwBiG54edwtBTKT4tXRW1gjnAAAAAAEMAABiG54edwtBTKT4tXRW1gjnAAAeGZn9AAA%3D&exvsurl=1&viewmodel=ReadMessageItem",
    },
    {
      id: "in-scott-google",
      bucket: "reply",
      subject: "Re: [Inputs requested] ECX - Google - valuation inputs",
      from: "sgraff@edgeconnex.com",
      fromName: "Scott Graff",
      receivedUtc: "2026-08-10T11:29:50Z",
      tag: "ashville",
      why: "Scott is waiting on a date — he asked whether the near-final OM lands this week and said he'd rather wait for the final than take a draft.",
      draft:
"Hi Scott,\n\n" +
"We're working through comments on the OM now — I'd expect a near-final version later this week, and I'll send it over as soon as it's clean rather than share the current draft.\n\n" +
"If Google needs something sooner, let me know and we'll look at what we can share in the interim.\n\n" +
"Best,\nAditya",
      webLink: "https://outlook.office365.com/owa/?ItemID=AAMkAGRiZTVlNjlmLTBhZGYtNDRhYi05NzMzLWRmNzIyOGJmN2Y3NABGAAAAAAAcqWuLqEZVSqb1h236JFxbBwBiG54edwtBTKT4tXRW1gjnAAAAAAEMAABiG54edwtBTKT4tXRW1gjnAAAeGZoBAAA%3D&exvsurl=1&viewmodel=ReadMessageItem",
    },

    {
      id: "in-canyon-ca",
      bucket: "action",
      subject: "Project Canyon | Credit Agreement",
      from: "BJansen@kslaw.com",
      fromName: "Brooke Jansen (King & Spalding)",
      receivedUtc: "2026-08-09T21:32:38Z",
      tag: "canyon",
      why: "Initial credit agreement draft for ECX & EQT review — clean and marked against the pre-signing precedent. No reply owed yet; the review is the deliverable.",
      draft: "",
      webLink: "https://outlook.office365.com/owa/?ItemID=AAMkAGRiZTVlNjlmLTBhZGYtNDRhYi05NzMzLWRmNzIyOGJmN2Y3NABGAAAAAAAcqWuLqEZVSqb1h236JFxbBwBiG54edwtBTKT4tXRW1gjnAAAAAAEMAABiG54edwtBTKT4tXRW1gjnAAAeGZn8AAA%3D&exvsurl=1&viewmodel=ReadMessageItem",
    },
    {
      id: "in-winstead-mud",
      bucket: "action",
      subject: "RE: Austin Development - Wastewater Structure and Road Financing",
      from: "jcox@winstead.com",
      fromName: "Winstead (J. Cox)",
      receivedUtc: "2026-08-10T14:40:45Z",
      tag: "austin",
      why: "Read before tomorrow's 1:00 PM call — tax-exempt bonds look unavailable (tax base needs 10+ independent taxpayers), and Randy Scott has confirmed he isn't the MUD-law expert.",
      draft: "",
      webLink: "https://outlook.office365.com/owa/?ItemID=AAMkAGRiZTVlNjlmLTBhZGYtNDRhYi05NzMzLWRmNzIyOGJmN2Y3NABGAAAAAAAcqWuLqEZVSqb1h236JFxbBwBiG54edwtBTKT4tXRW1gjnAAAAAAEMAABiG54edwtBTKT4tXRW1gjnAAAeGZocAAA%3D&exvsurl=1&viewmodel=ReadMessageItem",
    },
    {
      id: "in-scioto-reschedule",
      bucket: "action",
      subject: "RE: Project Scioto- preliminary call to discuss financing options",
      from: "dorina.yessios@aoshearman.com",
      fromName: "Dorina Yessios (A&O Shearman)",
      receivedUtc: "2026-08-10T13:01:27Z",
      tag: "scioto",
      why: "Call moved to Thursday 2:00 PM EST and Grace was asked to reissue the invite — the Tue 8/11 and Wed 8/12 Scioto holds still on your calendar are stale.",
      draft: "",
      webLink: "https://outlook.office365.com/owa/?ItemID=AAMkAGRiZTVlNjlmLTBhZGYtNDRhYi05NzMzLWRmNzIyOGJmN2Y3NABGAAAAAAAcqWuLqEZVSqb1h236JFxbBwBiG54edwtBTKT4tXRW1gjnAAAAAAEMAABiG54edwtBTKT4tXRW1gjnAAAeGZoRAAA%3D&exvsurl=1&viewmodel=ReadMessageItem",
    },

    {
      id: "in-clay-leroy",
      bucket: "waiting",
      subject: "RE: [External] Project Leroy: Upsize",
      from: "Clay.Macfarlane@Blackstone.com",
      fromName: "Clay Macfarlane (Blackstone)",
      receivedUtc: "2026-08-10T16:58:20Z",
      tag: "leroy",
      why: "Clay is happy to take the call on the CA turn, MB/local counsel and the Austin addition — a time still needs to land. Matt Martin separately asked for AUS time.",
      draft: "",
      webLink: "https://outlook.office365.com/owa/?ItemID=AAMkAGRiZTVlNjlmLTBhZGYtNDRhYi05NzMzLWRmNzIyOGJmN2Y3NABGAAAAAAAcqWuLqEZVSqb1h236JFxbBwBiG54edwtBTKT4tXRW1gjnAAAAAAEMAABiG54edwtBTKT4tXRW1gjnAAAeGZowAAA%3D&exvsurl=1&viewmodel=ReadMessageItem",
    },
    {
      id: "in-matthew-vdr",
      bucket: "waiting",
      subject: "Re: ECX - VDR Set Up and KYC/Lien Search",
      from: "matthew.way@edgeconnex.com",
      fromName: "Matthew Way",
      receivedUtc: "2026-08-10T17:33:10Z",
      tag: "ashville",
      why: "Three executed LPAs are up on Box. Matthew is still waiting on the structure chart and consents/resolutions from the ECX side — that request lands partly on you.",
      draft: "",
      webLink: "https://outlook.office365.com/owa/?ItemID=AAMkAGRiZTVlNjlmLTBhZGYtNDRhYi05NzMzLWRmNzIyOGJmN2Y3NABGAAAAAAAcqWuLqEZVSqb1h236JFxbBwBiG54edwtBTKT4tXRW1gjnAAAAAAEMAABiG54edwtBTKT4tXRW1gjnAAAeGZozAAA%3D&exvsurl=1&viewmodel=ReadMessageItem",
    },
    {
      id: "in-austin-directive",
      bucket: "waiting",
      subject: "Re: Austin - campus (impact of governor's directive)",
      from: "lyoungers@edgeconnex.com",
      fromName: "Lisa Youngers / Chris Jenkins",
      receivedUtc: "2026-08-10T17:19:13Z",
      tag: "austin",
      why: "Intel still being gathered in Texas. PUCT public meetings Fri 8/14 and Thu 8/20; Lisa is leading consensus on the question set, consultant call held 8/10.",
      draft: "",
      webLink: "https://outlook.office365.com/owa/?ItemID=AAMkAGRiZTVlNjlmLTBhZGYtNDRhYi05NzMzLWRmNzIyOGJmN2Y3NABGAAAAAAAcqWuLqEZVSqb1h236JFxbBwBiG54edwtBTKT4tXRW1gjnAAAAAAEMAABiG54edwtBTKT4tXRW1gjnAAAeGZoyAAA%3D&exvsurl=1&viewmodel=ReadMessageItem",
    },
    {
      id: "in-dpw-regframework",
      bucket: "waiting",
      subject: "Re: Ashville - Regulatory Framework",
      from: "lgodschalx@edgeconnex.com",
      fromName: "Laura Godschalx → Dickinson Wright",
      receivedUtc: "2026-08-10T13:39:21Z",
      tag: "ashville",
      why: "Laura chased Dickinson Wright on Elli Park's request; nothing back yet.",
      draft: "",
      webLink: "https://outlook.office365.com/owa/?ItemID=AAMkAGRiZTVlNjlmLTBhZGYtNDRhYi05NzMzLWRmNzIyOGJmN2Y3NABGAAAAAAAcqWuLqEZVSqb1h236JFxbBwBiG54edwtBTKT4tXRW1gjnAAAAAAEMAABiG54edwtBTKT4tXRW1gjnAAAeGZoVAAA%3D&exvsurl=1&viewmodel=ReadMessageItem",
    },

    {
      id: "in-ms-ratings",
      bucket: "fyi",
      subject: "RE: [EXTERNAL] Re: Project Ashville Weekly Sync",
      from: "Maya.Matejcek@morganstanley.com",
      fromName: "Maya Matejcek (Morgan Stanley)",
      receivedUtc: "2026-08-10T13:56:11Z",
      tag: "ashville",
      why: "MS confirmed the executed docs went over last week and had no comments; Rithika cleared sharing with the rating agencies. Nothing owed from you.",
      draft: "",
      webLink: "https://outlook.office365.com/owa/?ItemID=AAMkAGRiZTVlNjlmLTBhZGYtNDRhYi05NzMzLWRmNzIyOGJmN2Y3NABGAAAAAAAcqWuLqEZVSqb1h236JFxbBwBiG54edwtBTKT4tXRW1gjnAAAAAAEMAABiG54edwtBTKT4tXRW1gjnAAAeGZoWAAA%3D&exvsurl=1&viewmodel=ReadMessageItem",
    },
    {
      id: "in-ppa-scale",
      bucket: "fyi",
      subject: "RE: Power agreement - Ashville PCX",
      from: "peter.tolson@aoshearman.com",
      fromName: "Peter Tolson (A&O Shearman) / Raj Chudgar",
      receivedUtc: "2026-08-10T12:02:04Z",
      tag: "ashville",
      why: "A&O is sending Scale a redline of the version they already hold; Raj agreed to get it out ahead of the next round. Watch only — this is the PPA that still needs uploading for DPW.",
      draft: "",
      webLink: "https://outlook.office365.com/owa/?ItemID=AAMkAGRiZTVlNjlmLTBhZGYtNDRhYi05NzMzLWRmNzIyOGJmN2Y3NABGAAAAAAAcqWuLqEZVSqb1h236JFxbBwBiG54edwtBTKT4tXRW1gjnAAAAAAEMAABiG54edwtBTKT4tXRW1gjnAAAeGZoFAAA%3D&exvsurl=1&viewmodel=ReadMessageItem",
    },
    {
      id: "in-pm-reports",
      bucket: "fyi",
      subject: "PM / PMO status reports — 5 forwards from Laura",
      from: "lgodschalx@edgeconnex.com",
      fromName: "Laura Godschalx",
      receivedUtc: "2026-08-10T15:25:08Z",
      tag: "internal",
      why: "Grouped: EDCATL11 BCEI weekly touchpoint (8/5), PCX PMO weekly (8/7), New Albany South touchpoint #86 (8/7), PHX11 and PHX12 project updates (8/4). Skim-when-you-can.",
      draft: "",
      webLink: "https://outlook.office365.com/owa/?ItemID=AAMkAGRiZTVlNjlmLTBhZGYtNDRhYi05NzMzLWRmNzIyOGJmN2Y3NABGAAAAAAAcqWuLqEZVSqb1h236JFxbBwBiG54edwtBTKT4tXRW1gjnAAAAAAEMAABiG54edwtBTKT4tXRW1gjnAAAeGZokAAA%3D&exvsurl=1&viewmodel=ReadMessageItem",
    },
    {
      id: "in-market-updates",
      bucket: "fyi",
      subject: "Market updates — TD, Citi, SMBC, IG data centre biweekly",
      from: "multiple",
      fromName: "TD Securities / Citi / SMBC",
      receivedUtc: "2026-08-10T12:39:06Z",
      tag: "market",
      why: "Grouped: TD ABS secondary levels + market commentary (8/10), TD data centre bond market update, Citi data centre monthly (July), SMBC digital infra ABS week of 8/7, IG data centre biweekly.",
      draft: "",
      webLink: "https://outlook.office365.com/owa/?ItemID=AAMkAGRiZTVlNjlmLTBhZGYtNDRhYi05NzMzLWRmNzIyOGJmN2Y3NABGAAAAAAAcqWuLqEZVSqb1h236JFxbBwBiG54edwtBTKT4tXRW1gjnAAAAAAEMAABiG54edwtBTKT4tXRW1gjnAAAeGZoMAAA%3D&exvsurl=1&viewmodel=ReadMessageItem",
    },
    {
      id: "in-ashville-dd-consents",
      bucket: "fyi",
      subject: "Re: Ashville Due Diligence",
      from: "lgodschalx@edgeconnex.com",
      fromName: "Laura Godschalx",
      receivedUtc: "2026-08-10T11:45:24Z",
      tag: "ashville",
      why: "Laura confirmed to Eric Ramberg that the financing consents will be drafted and executed separately — resolves an open thread, no action.",
      draft: "",
      webLink: "https://outlook.office365.com/owa/?ItemID=AAMkAGRiZTVlNjlmLTBhZGYtNDRhYi05NzMzLWRmNzIyOGJmN2Y3NABGAAAAAAAcqWuLqEZVSqb1h236JFxbBwBiG54edwtBTKT4tXRW1gjnAAAAAAEMAABiG54edwtBTKT4tXRW1gjnAAAeGZoCAAA%3D&exvsurl=1&viewmodel=ReadMessageItem",
    },
    {
      id: "in-rbc-connect",
      bucket: "fyi",
      subject: "Re: EdgeConnex/RBC Connect",
      from: "lgodschalx@edgeconnex.com",
      fromName: "Laura Godschalx → RBC",
      receivedUtc: "2026-08-10T13:09:06Z",
      tag: "market",
      why: "Laura is holding RBC for September and Sara is finding times — no action from you now, but it lands on the bank-relationship tracker.",
      draft: "",
      webLink: "https://outlook.office365.com/owa/?ItemID=AAMkAGRiZTVlNjlmLTBhZGYtNDRhYi05NzMzLWRmNzIyOGJmN2Y3NABGAAAAAAAcqWuLqEZVSqb1h236JFxbBwBiG54edwtBTKT4tXRW1gjnAAAAAAEMAABiG54edwtBTKT4tXRW1gjnAAAeGZoSAAA%3D&exvsurl=1&viewmodel=ReadMessageItem",
    },
  ],
};
