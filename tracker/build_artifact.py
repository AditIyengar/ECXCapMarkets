#!/usr/bin/env python3
"""Assemble ECX_Tracker_v51 artifact edition: CSP-safe, self-contained, downloads-capability-aware."""
import os, re, sys

SP = os.path.dirname(os.path.abspath(__file__))
SRC = "/root/.claude/uploads/e34b41c2-2c1f-598a-a116-f36c85048c26/584d191c-ECX_Tracker_v50.html"
OUT = os.path.join(SP, "ECX_Tracker_v51_artifact.html")

lines = open(SRC, encoding="utf-8").read().split("\n")
# 1-indexed landmarks verified against v50
assert "<title>ECX Fundraising Tracker v50</title>" in lines[290]
assert lines[292].strip().startswith('<script src="https://cdnjs.cloudflare.com/ajax/libs/react/')
assert lines[294].strip() == "<style>"
assert lines[302].strip() == "</head>"
assert lines[304].lstrip().startswith('<div id="root">')
assert lines[318 - 1 + 1].strip() == "<script>"  # line 319

orig_style = "\n".join(lines[294:302 + 1 - 1])  # <style> .. lines up to before </head>; lines[294]..lines[301]
assert "</style>" in orig_style and "DM Sans" in orig_style

app_js = "\n".join(lines[318:10981])  # lines 319..10981 (incl. closing </script>)
assert app_js.lstrip().startswith("<script>") and app_js.rstrip().endswith("</script>")
tail_js = "\n".join(lines[10981:])
assert tail_js.lstrip().startswith("<script>") and tail_js.rstrip().endswith("</html>")
tail_js = tail_js[: tail_js.rindex("</script>") + len("</script>")]

fonts_css = open(os.path.join(SP, "fonts/fonts_embedded.css"), encoding="utf-8").read()
bank_icons_js = open(os.path.join(SP, "icons/bank_icons.js"), encoding="utf-8").read()
react_js = open(os.path.join(SP, "deps/react.min.js"), encoding="utf-8").read()
react_dom_js = open(os.path.join(SP, "deps/react-dom.min.js"), encoding="utf-8").read()

def patch(text, old, new, count=1, label=""):
    n = text.count(old)
    if n != count:
        sys.exit(f"PATCH FAIL [{label}]: expected {count} occurrence(s), found {n}")
    return text.replace(old, new, count)

# --- app script patches ---
# 1. Embedded icon map + BankLogo reads it instead of Google's favicon service
app_js = patch(app_js, "var BANK_DOMAINS = {",
               bank_icons_js + "\nvar BANK_DOMAINS = {", 1, "BANK_ICONS injection")
app_js = patch(app_js,
               "  var domain = BANK_DOMAINS[props.name];\n  var size = props.size || 30;\n  if (!domain || failed) {",
               "  var domain = BANK_DOMAINS[props.name];\n  var size = props.size || 30;\n  if (!domain || failed || !BANK_ICONS[domain]) {",
               1, "BankLogo guard")
app_js = patch(app_js,
               'src: "https://www.google.com/s2/favicons?domain=" + domain + "&sz=64"',
               "src: BANK_ICONS[domain]", 1, "BankLogo src")

# 2. Route the two .txt exports through the shared save helper
txt_export = '''    var blob = new Blob([digest()], { type: "text/plain" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "ECX_Tracker_%s_" + new Date().toISOString().slice(0, 10) + ".txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 500);'''
txt_export_new = '''    window.ECX_SAVE_FILE("ECX_Tracker_%s_" + new Date().toISOString().slice(0, 10) + ".txt", digest(), "text/plain");'''
for tag in ("ApprovedInputs", "Inputs"):
    app_js = patch(app_js, txt_export % tag, txt_export_new % tag, 1, f"txt export {tag}")

# --- tail (Save button) script patches ---
tail_js = patch(tail_js, "var VERSION = 'v12';", "var VERSION = 'v51';", 1, "VERSION")
tail_js = patch(tail_js, "sessionStorage.getItem('ecx_save_count') || '12'",
                "sessionStorage.getItem('ecx_save_count') || '51'", 1, "save count seed")

old_dosave = """      var bytes = new TextEncoder().encode(html);
      var blob = new Blob([bytes], { type: 'text/html;charset=utf-8' });
      var url = URL.createObjectURL(blob);
      var link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(function() { URL.revokeObjectURL(url); }, 2000);"""
new_dosave = """      if (window.claude && window.claude.downloads && window.claude.downloads.save) {
        window.claude.downloads.save({ filename: filename, data: html }).catch(function (err) {
          if (err && (err.code === 'extension_not_enabled' || err.code === 'rejected_extension')) {
            window.claude.downloads.save({ filename: filename + '.txt', data: html }).catch(function () {});
          }
        });
      } else {
        var bytes = new TextEncoder().encode(html);
        var blob = new Blob([bytes], { type: 'text/html;charset=utf-8' });
        var url = URL.createObjectURL(blob);
        var link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(function() { URL.revokeObjectURL(url); }, 2000);
      }"""
tail_js = patch(tail_js, old_dosave, new_dosave, 1, "doSave")

# Autosave would pop a viewer confirmation every 5 minutes in the artifact — disable it there.
old_autosave = """    // Autosave every 5 min if dirty
    setInterval(function() {"""
new_autosave = """    // Autosave every 5 min if dirty (skipped in the artifact viewer: each save
    // prompts the viewer for confirmation there, so only manual saves make sense)
    if (window.claude && window.claude.downloads) return;
    setInterval(function() {"""
tail_js = patch(tail_js, old_autosave, new_autosave, 1, "autosave gate")

save_helper = """<script>
// Shared file-save helper. Uses the claude.ai artifact downloads capability when
// present (window.claude.downloads — viewer confirms each save); otherwise falls
// back to a plain anchor download (when the file is opened directly in a browser).
window.ECX_SAVE_FILE = function (filename, data, mime) {
  if (window.claude && window.claude.downloads && window.claude.downloads.save) {
    window.claude.downloads.save({ filename: filename, data: data }).catch(function () {});
    return;
  }
  try {
    var blob = data instanceof Blob ? data : new Blob([data], { type: mime || "application/octet-stream" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 500);
  } catch (e) { console.error("Save failed:", e); }
};
</script>"""

loading = ('<div id="root"><div style="min-height:100vh;display:flex;align-items:center;justify-content:center;'
           'background:#F1F5F9;color:#64748B;font-family:\'DM Sans\',\'Segoe UI\',sans-serif;font-size:14px;">'
           'Loading ECX Fundraising Tracker…</div></div>')

out = "\n".join([
    "<!-- ECX Fundraising Tracker v51 — artifact edition of v50. Fully self-contained:",
    "     React 18.2.0 + ReactDOM inlined (cdnjs UMD builds), DM Sans / Libre Baskerville",
    "     embedded as woff2 data URIs, bank logos embedded in BANK_ICONS (Google s2 /",
    "     DuckDuckGo favicons fetched at build time). Old claude.ai postMessage shim and",
    "     html-to-image removed (unused by app code). Save/export buttons use the artifact",
    "     downloads capability when available; 5-min autosave disabled in the viewer. -->",
    "<title>ECX Fundraising Tracker v51</title>",
    "<style>",
    fonts_css,
    "</style>",
    orig_style,
    "</style>",
    "<script>" + react_js + "</script>",
    "<script>" + react_dom_js + "</script>",
    loading,
    save_helper,
    app_js,
    tail_js,
    "",
])
open(OUT, "w", encoding="utf-8").write(out)
print(f"OK -> {OUT} ({len(out):,} bytes)")
