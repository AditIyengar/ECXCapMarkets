  /* --------------------------------------------------------------------------
   * OUTLOOK CLEANUP
   *
   * Filing plans computed at refresh time. Each scan names a destination folder
   * that must ALREADY EXIST in the mailbox, plus the messages sitting in the
   * Inbox that belong in it.
   *
   * The page cannot move mail — it has no mailbox credentials, and the
   * Microsoft 365 connector used at refresh time is read-only (search and read
   * only; no move/update tool). So a scan produces a worklist and a filing
   * rule, not an executed move. `rule` is the durable fix: set it once in
   * Outlook and future reports file themselves.
   *
   * scan { id, title, blurb, destination, destinationExists, scannedAt,
   *        rule: { from, subjectAny[], action },
   *        items: [{ id, subject, fromName, receivedUtc, site, confidence,
   *                  webLink }] }
   *   confidence ∈ high | review   — "review" means eyeball it before filing
   * ------------------------------------------------------------------------ */
  cleanup: {
    folders: [
      "Ashville", "Austin Series", "Bank Meetings", "Company", "Const. Updates",
      "IT", "Project Canyon", "Project Etna", "Project Leroy", "Project Liverpool",
      "Project Narwhal", "Sugar Admin"
    ],
    scans: [
      {
        id: "scan-const-updates",
        title: "Construction reports → Const. Updates",
        blurb: "Automated weekly construction and PM status reports, all forwarded by Laura. " +
               "Const. Updates already holds 24 of these; these are the ones still loose in the Inbox.",
        destination: "Inbox / Const. Updates",
        destinationExists: true,
        scannedAt: "2026-08-10T18:00:00Z",
        rule: {
          from: "lgodschalx@edgeconnex.com",
          subjectAny: [
            "Construction Weekly Review",
            "Construction Status Report",
            "Construction Report for",
            "Weekly Construction Report",
            "Weekly Touchpoint - PM Report",
            "PM Touchpoint Report",
            "PMO Weekly Status Update",
            "Edge PHX"
          ],
          action: "Move to folder: Const. Updates  ·  Stop processing more rules"
        },
        items: [
          { id: "cu-1", subject: "Fw: EDCATL11- BCEI + ECX Weekly Touchpoint - PM Report From 8/5/2026", fromName: "Laura Godschalx", receivedUtc: "2026-08-10T15:25:08Z", site: "EDCATL11", confidence: "high",
            webLink: "https://outlook.office365.com/owa/?ItemID=AAMkAGRiZTVlNjlmLTBhZGYtNDRhYi05NzMzLWRmNzIyOGJmN2Y3NABGAAAAAAAcqWuLqEZVSqb1h236JFxbBwBiG54edwtBTKT4tXRW1gjnAAAAAAEMAABiG54edwtBTKT4tXRW1gjnAAAeGZokAAA%3D&exvsurl=1&viewmodel=ReadMessageItem" },
          { id: "cu-2", subject: "Fw: PCX PMO Weekly Status Update 07-Aug-2026 - All Projects", fromName: "Laura Godschalx", receivedUtc: "2026-08-10T15:02:27Z", site: "All projects", confidence: "high",
            webLink: "https://outlook.office365.com/owa/?ItemID=AAMkAGRiZTVlNjlmLTBhZGYtNDRhYi05NzMzLWRmNzIyOGJmN2Y3NABGAAAAAAAcqWuLqEZVSqb1h236JFxbBwBiG54edwtBTKT4tXRW1gjnAAAAAAEMAABiG54edwtBTKT4tXRW1gjnAAAeGZohAAA%3D&exvsurl=1&viewmodel=ReadMessageItem" },
          { id: "cu-3", subject: "Fw: New Albany South _PM Touchpoint Report N°86 (Aug 7th, 2026)", fromName: "Laura Godschalx", receivedUtc: "2026-08-10T15:00:37Z", site: "New Albany South", confidence: "high",
            webLink: "https://outlook.office365.com/owa/?ItemID=AAMkAGRiZTVlNjlmLTBhZGYtNDRhYi05NzMzLWRmNzIyOGJmN2Y3NABGAAAAAAAcqWuLqEZVSqb1h236JFxbBwBiG54edwtBTKT4tXRW1gjnAAAAAAEMAABiG54edwtBTKT4tXRW1gjnAAAeGZogAAA%3D&exvsurl=1&viewmodel=ReadMessageItem" },
          { id: "cu-4", subject: "Fw: Edge PHX11 Project Update 8/4/26", fromName: "Laura Godschalx", receivedUtc: "2026-08-10T14:46:32Z", site: "PHX11", confidence: "high",
            webLink: "https://outlook.office365.com/owa/?ItemID=AAMkAGRiZTVlNjlmLTBhZGYtNDRhYi05NzMzLWRmNzIyOGJmN2Y3NABGAAAAAAAcqWuLqEZVSqb1h236JFxbBwBiG54edwtBTKT4tXRW1gjnAAAAAAEMAABiG54edwtBTKT4tXRW1gjnAAAeGZoeAAA%3D&exvsurl=1&viewmodel=ReadMessageItem" },
          { id: "cu-5", subject: "Fw: Edge PHX12 Project Update 8/4/26", fromName: "Laura Godschalx", receivedUtc: "2026-08-10T14:38:54Z", site: "PHX12", confidence: "high",
            webLink: "https://outlook.office365.com/owa/?ItemID=AAMkAGRiZTVlNjlmLTBhZGYtNDRhYi05NzMzLWRmNzIyOGJmN2Y3NABGAAAAAAAcqWuLqEZVSqb1h236JFxbBwBiG54edwtBTKT4tXRW1gjnAAAAAAEMAABiG54edwtBTKT4tXRW1gjnAAAeGZobAAA%3D&exvsurl=1&viewmodel=ReadMessageItem" },
          { id: "cu-6", subject: "Fw: New Albany South _PM Touchpoint Report N°85 (July 31st, 2026)", fromName: "Laura Godschalx", receivedUtc: "2026-07-31T16:53:27Z", site: "New Albany South", confidence: "high",
            webLink: "https://outlook.office365.com/owa/?ItemID=AAMkAGRiZTVlNjlmLTBhZGYtNDRhYi05NzMzLWRmNzIyOGJmN2Y3NABGAAAAAAAcqWuLqEZVSqb1h236JFxbBwBiG54edwtBTKT4tXRW1gjnAAAAAAEMAABiG54edwtBTKT4tXRW1gjnAAAYsLzzAAA%3D&exvsurl=1&viewmodel=ReadMessageItem" },
          { id: "cu-7", subject: "Fw: EDCATL11- BCEI + ECX Weekly Touchpoint - PM Report From 7/29/2026", fromName: "Laura Godschalx", receivedUtc: "2026-07-31T16:39:41Z", site: "EDCATL11", confidence: "high",
            webLink: "https://outlook.office365.com/owa/?ItemID=AAMkAGRiZTVlNjlmLTBhZGYtNDRhYi05NzMzLWRmNzIyOGJmN2Y3NABGAAAAAAAcqWuLqEZVSqb1h236JFxbBwBiG54edwtBTKT4tXRW1gjnAAAAAAEMAABiG54edwtBTKT4tXRW1gjnAAAYsLzvAAA%3D&exvsurl=1&viewmodel=ReadMessageItem" },
          { id: "cu-8", subject: "Fw: EDCAUS11/16_ ECX/BCEI Construction Weekly Review_07.30.2026", fromName: "Laura Godschalx", receivedUtc: "2026-07-31T16:36:25Z", site: "EDCAUS11/16", confidence: "high",
            webLink: "https://outlook.office365.com/owa/?ItemID=AAMkAGRiZTVlNjlmLTBhZGYtNDRhYi05NzMzLWRmNzIyOGJmN2Y3NABGAAAAAAAcqWuLqEZVSqb1h236JFxbBwBiG54edwtBTKT4tXRW1gjnAAAAAAEMAABiG54edwtBTKT4tXRW1gjnAAAYsLzuAAA%3D&exvsurl=1&viewmodel=ReadMessageItem" },
          { id: "cu-9", subject: "Fw: EDCATL12&13 - BCEI + ECX Weekly Touchpoint - PM Report (7/29/2026)", fromName: "Laura Godschalx", receivedUtc: "2026-07-31T16:32:29Z", site: "EDCATL12/13", confidence: "high",
            webLink: "https://outlook.office365.com/owa/?ItemID=AAMkAGRiZTVlNjlmLTBhZGYtNDRhYi05NzMzLWRmNzIyOGJmN2Y3NABGAAAAAAAcqWuLqEZVSqb1h236JFxbBwBiG54edwtBTKT4tXRW1gjnAAAAAAEMAABiG54edwtBTKT4tXRW1gjnAAAYsLzsAAA%3D&exvsurl=1&viewmodel=ReadMessageItem" },
          { id: "cu-10", subject: "Fw: EDCAUS11/16_ ECX/BCEI Construction Weekly Review_07.23.2026", fromName: "Laura Godschalx", receivedUtc: "2026-07-27T23:41:03Z", site: "EDCAUS11/16", confidence: "high",
            webLink: "https://outlook.office365.com/owa/?ItemID=AAMkAGRiZTVlNjlmLTBhZGYtNDRhYi05NzMzLWRmNzIyOGJmN2Y3NABGAAAAAAAcqWuLqEZVSqb1h236JFxbBwBiG54edwtBTKT4tXRW1gjnAAAAAAEMAABiG54edwtBTKT4tXRW1gjnAAAVeawGAAA%3D&exvsurl=1&viewmodel=ReadMessageItem" },
          { id: "cu-11", subject: "Fw: New Albany South _PM Touchpoint Report N°84 (July 24th, 2026)", fromName: "Laura Godschalx", receivedUtc: "2026-07-24T20:59:13Z", site: "New Albany South", confidence: "high",
            webLink: "https://outlook.office365.com/owa/?ItemID=AAMkAGRiZTVlNjlmLTBhZGYtNDRhYi05NzMzLWRmNzIyOGJmN2Y3NABGAAAAAAAcqWuLqEZVSqb1h236JFxbBwBiG54edwtBTKT4tXRW1gjnAAAAAAEMAABiG54edwtBTKT4tXRW1gjnAAATZQncAAA%3D&exvsurl=1&viewmodel=ReadMessageItem" },
          { id: "cu-12", subject: "Fw: AUS02 ECX/BCEI Construction Weekly Review-07/22", fromName: "Laura Godschalx", receivedUtc: "2026-07-24T20:58:24Z", site: "AUS02", confidence: "high",
            webLink: "https://outlook.office365.com/owa/?ItemID=AAMkAGRiZTVlNjlmLTBhZGYtNDRhYi05NzMzLWRmNzIyOGJmN2Y3NABGAAAAAAAcqWuLqEZVSqb1h236JFxbBwBiG54edwtBTKT4tXRW1gjnAAAAAAEMAABiG54edwtBTKT4tXRW1gjnAAATZQnbAAA%3D&exvsurl=1&viewmodel=ReadMessageItem" },
          { id: "cu-13", subject: "Fw: Austin GW Campus - Coordination Call - AGENDA 8-5-26", fromName: "Laura Godschalx", receivedUtc: "2026-08-10T12:19:19Z", site: "Austin GW", confidence: "review",
            webLink: "https://outlook.office365.com/owa/?ItemID=AAMkAGRiZTVlNjlmLTBhZGYtNDRhYi05NzMzLWRmNzIyOGJmN2Y3NABGAAAAAAAcqWuLqEZVSqb1h236JFxbBwBiG54edwtBTKT4tXRW1gjnAAAAAAEMAABiG54edwtBTKT4tXRW1gjnAAAeGZoLAAA%3D&exvsurl=1&viewmodel=ReadMessageItem" }
        ],
        notes: [
          "Three identical copies of the Austin GW Campus agenda arrived on 8/10 (12:00, 12:09, 12:19). Only the last is listed — the other two are duplicates.",
          "The Austin GW agenda is marked 'review': it is a coordination-call agenda rather than a construction status report, so the rule below deliberately does not catch it."
        ]
      }
    ]
  }
