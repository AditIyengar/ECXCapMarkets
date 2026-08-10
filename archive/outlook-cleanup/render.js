  /* ---- Outlook cleanup ---- */
  function ruleText(scan) {
    return [
      "Outlook rule — " + scan.title,
      "",
      "Apply this rule after the message arrives",
      "  From: " + scan.rule.from,
      "  and Subject contains any of:",
      scan.rule.subjectAny.map(function (x) { return "    · " + x; }).join("\n"),
      "",
      "Do the following",
      "  " + scan.rule.action
    ].join("\n");
  }

  function cleanupHTML() {
    var list = scans();
    if (!list.length) return '<div class="dashed">No cleanup routines defined yet.</div>';

    return list.map(function (scan) {
      var items = scanItems(scan);
      var unfiled = items.filter(function (m) { return !m.filed; });
      var run = !!S.scanRun[scan.id];

      var h = '<div class="card scanbox">';
      h += '<div class="scanhead"><div>';
      h += '<h2 class="display" style="font-size:15px">' + esc(scan.title) + "</h2>";
      h += '<div class="scanblurb">' + esc(scan.blurb) + "</div>";
      h += "</div>";
      h += '<button class="btn btn-primary" data-scan="' + scan.id + '">' +
           (run ? "Re-scan" : "Scan inbox") + "</button>";
      h += "</div>";

      if (!run) {
        h += '<div class="scanidle">Destination <b>' + esc(scan.destination) + "</b>" +
             (scan.destinationExists ? ' <span class="chip" style="background:var(--ok-bg);color:var(--ok-fg)">folder exists</span>'
                                     : ' <span class="chip" style="background:var(--danger-bg);color:var(--danger-fg)">folder missing</span>') +
             "</div>";
        return h + "</div>";
      }

      h += '<div class="scanresult">';
      h += '<div class="scansum"><b>' + unfiled.length + "</b> message" + (unfiled.length === 1 ? "" : "s") +
           " to file into <b>" + esc(scan.destination) + "</b>" +
           (items.length - unfiled.length ? " · " + (items.length - unfiled.length) + " already ticked off" : "") +
           "</div>";

      h += '<div class="notice"><b>This page cannot move mail.</b> It has no mailbox credentials, and the ' +
           'Microsoft 365 connector used at refresh time is read-only. So the scan gives you a worklist and a ' +
           'filing rule — the rule is the actual fix, because it files every future report automatically.</div>';

      h += '<div class="mail">' + items
        .sort(function (a, b) { return (a.filed === b.filed) ? (b.receivedUtc || "").localeCompare(a.receivedUtc || "") : (a.filed ? 1 : -1); })
        .map(function (m) {
          var s = '<div class="card item' + (m.filed ? " handled" : "") + '" style="border-left-color:' +
                  (m.confidence === "review" ? "var(--warn-fg)" : "var(--teal)") + '">';
          s += '<div class="line1"><div class="subj">' + esc(m.subject) + "</div>";
          if (m.filed) s += '<span class="chip" style="background:var(--ok-bg);color:var(--ok-fg)">Filed</span>';
          else if (m.confidence === "review") s += '<span class="chip" style="background:var(--warn-bg);color:var(--warn-fg)">Check first</span>';
          s += "</div>";
          s += '<div class="meta">' + esc(m.fromName) + " · " +
               new Date(m.receivedUtc).toLocaleString("en-US", { timeZone: TZ, month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) +
               (m.site ? " · " + esc(m.site) : "") + "</div>";
          s += '<div class="acts">';
          if (m.webLink) s += '<a class="btn btn-quiet btn-sm" href="' + esc(m.webLink) + '" target="_blank" rel="noopener" style="text-decoration:none;display:inline-block">Open in Outlook</a>';
          s += '<button class="btn btn-quiet btn-sm" data-filed="' + m.id + '">' + (m.filed ? "Untick" : "Tick off") + "</button>";
          s += "</div>";
          return s + "</div>";
        }).join("") + "</div>";

      h += '<div class="rulebox">';
      h += '<div class="rulehead"><b>Stop this recurring</b> — one Outlook rule files every future report on arrival.</div>';
      h += "<pre>" + esc(ruleText(scan)) + "</pre>";
      h += '<div class="acts">';
      h += '<button class="btn btn-teal btn-sm" data-copyrule="' + scan.id + '">Copy rule</button>';
      h += '<a class="btn btn-quiet btn-sm" href="https://outlook.office.com/mail/options/mail/rules" target="_blank" rel="noopener" style="text-decoration:none;display:inline-block">Open Outlook rules</a>';
      h += "</div></div>";

      if (scan.notes && scan.notes.length) {
        h += '<ul class="scannotes">' + scan.notes.map(function (n) { return "<li>" + esc(n) + "</li>"; }).join("") + "</ul>";
      }
      h += '<div class="scanstamp">Scanned ' +
           new Date(scan.scannedAt).toLocaleString("en-US", { timeZone: TZ, month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) +
           " by the refresh session. Ticking off is a local note to yourself — it does not move anything.</div>";
      h += "</div></div>";
      return h;
    }).join("");
  }
