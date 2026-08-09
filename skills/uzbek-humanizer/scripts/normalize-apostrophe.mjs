#!/usr/bin/env node
/**
 * Normalize Uzbek Latin apostrophe-like characters.
 * oʻ/gʻ → U+02BB (ʻ)
 * tutuq candidates in known patterns → U+02BC (ʼ)
 * strips ASCII ' / ` / curly quotes used as letter marks
 */
import fs from "node:fs";

const TURNED = "\u02BB"; // ʻ
const TUTUQ = "\u02BC"; // ʼ
const MARKS = /['`\u2018\u2019\u02BB\u02BC]/g;

function normalize(text) {
  let out = text;
  // o'/g' style digraphs (letter + any mark)
  out = out.replace(/([OoGg])['`\u2018\u2019\u02BB\u02BC]/g, `$1${TURNED}`);
  // common tutuq sites: vowel + mark + vowel/consonant patterns like ma'no, san'at, a'lo
  out = out.replace(
    /([AaEeIiOoUuOoʻ])['`\u2018\u2019]([A-Za-zÀ-ÿʻʼ])/g,
    (_, a, b) => `${a}${TUTUQ}${b}`
  );
  return out;
}

function lintReport(text) {
  const issues = [];
  if (/[']/.test(text)) issues.push("ASCII apostrophe ' found");
  if (/[`]/g.test(text)) issues.push("grave ` found");
  return issues;
}

const file = process.argv[2];
if (!file) {
  console.error("Usage: node normalize-apostrophe.mjs <file>");
  process.exit(1);
}
const raw = fs.readFileSync(file, "utf8");
const next = normalize(raw);
fs.writeFileSync(file, next);
const issues = lintReport(next);
if (issues.length) {
  console.error("Normalized with remaining issues:");
  for (const i of issues) console.error("-", i);
  process.exit(2);
}
console.log(`Normalized ${file}`);
