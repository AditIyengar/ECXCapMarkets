#!/usr/bin/env node
/* -----------------------------------------------------------------------------
 * Build the shareable single-file TaskFlow page.
 *
 *   node tools/build-standalone.js
 *
 * Inlines data/taskflow.js into taskflow/index.html and strips the document
 * wrapper, writing dist/taskflow-standalone.html.
 *
 * Two things consume the output:
 *   - the published artifact (see ARTIFACT_URL in REFRESH.md) — republish the
 *     same file path to keep the same URL and add a version entry
 *   - git history — dist/ is committed, so every refresh leaves a local,
 *     diffable snapshot of exactly what was published
 *
 * The wrapper is stripped because the artifact publisher supplies its own
 * <!doctype>/<html>/<head>/<body>; leaving ours in produces nested documents.
 * --------------------------------------------------------------------------- */
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SRC_HTML = path.join(ROOT, "taskflow", "index.html");
const SRC_DATA = path.join(ROOT, "data", "taskflow.js");
const OUT_DIR = path.join(ROOT, "dist");
const OUT = path.join(OUT_DIR, "taskflow-standalone.html");

function fail(msg) {
  console.error("build-standalone: " + msg);
  process.exit(1);
}

let html;
let data;
try {
  html = fs.readFileSync(SRC_HTML, "utf8");
  data = fs.readFileSync(SRC_DATA, "utf8");
} catch (e) {
  fail("could not read source files — " + e.message);
}

// Guard against shipping a dataset that would blank the page. The viewer shows
// nothing at all on a syntax error, so catch it here rather than in the browser.
try {
  new Function(data + "\n;return typeof window!=='undefined';");
} catch (e) {
  fail("data/taskflow.js is not valid JavaScript — " + e.message);
}

const DATA_TAG = '<script src="../data/taskflow.js"></script>';
if (!html.includes(DATA_TAG)) fail("data script tag not found in taskflow/index.html");
html = html.replace(DATA_TAG, "<script>\n" + data + "\n</script>");

// The sibling-dashboard link is a relative path that cannot resolve once the
// page is published on its own.
html = html.replace(/\s*<br><a href="\.\.\/index\.html">[^<]*<\/a>/, "");

const titleAt = html.indexOf("<title>");
const headEnd = html.indexOf("</head>");
const bodyOpen = html.indexOf("<body>");
const bodyClose = html.lastIndexOf("</body>");
if (titleAt < 0 || headEnd < 0 || bodyOpen < 0 || bodyClose < 0) {
  fail("could not find the document wrapper markers");
}

// Favicon travels as a publish parameter, not as markup.
const head = html.slice(titleAt, headEnd).trim().replace(/<link rel="icon"[\s\S]*?>\s*/, "");
const body = html.slice(bodyOpen + "<body>".length, bodyClose).trim();
const out = head + "\n\n" + body + "\n";

if (/<!doctype|<html[\s>]|<head>|<body>/i.test(out)) fail("document wrapper survived the strip");

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(OUT, out);

const asOf = (data.match(/as_of:\s*"([\d-]+)"/) || [])[1] || "unknown";
console.log(
  "wrote dist/taskflow-standalone.html — " +
  (Buffer.byteLength(out) / 1024).toFixed(0) + " KB, data as of " + asOf
);
console.log("next: republish that file to the artifact URL in REFRESH.md, label \"data " + asOf + "\"");
