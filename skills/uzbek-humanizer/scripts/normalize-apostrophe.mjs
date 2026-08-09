#!/usr/bin/env node
/**
 * Normalize Uzbek Latin apostrophe-like characters.
 * oʻ/gʻ → U+02BB (ʻ)
 * tutuq → U+02BC (ʼ)
 *
 * Usage:
 *   node normalize-apostrophe.mjs <file>
 *   node normalize-apostrophe.mjs --check <file>   # exit 2 if would change
 *   node normalize-apostrophe.mjs --dry-run <file> # print only
 *   node normalize-apostrophe.mjs --stdout <file>
 */
import fs from "node:fs";

const TURNED = "\u02BB"; // ʻ
const TUTUQ = "\u02BC"; // ʼ
const MARK = `['\`\u2018\u2019\u02BB\u02BC]`;

/** EN contractions / names we must not rewrite */
const EN_SKIP =
  /\b(?:[Ii]'m|[Ww]e'd|[Yy]ou're|[Tt]hey're|[Ww]on't|[Cc]an't|[Ii]sn't|[Aa]ren't|[Hh]aven't|[Hh]asn't|[Dd]oesn't|[Dd]idn't|[Ss]houldn't|[Ww]ouldn't|[Cc]ouldn't|[Oo]'[Bb]rien|[Oo]'[Cc]onnor)\b/g;

function protectEn(text) {
  const saved = [];
  const out = text.replace(EN_SKIP, (m) => {
    saved.push(m);
    return `\u0000EN${saved.length - 1}\u0000`;
  });
  return { out, saved };
}

function restoreEn(text, saved) {
  return text.replace(/\u0000EN(\d+)\u0000/g, (_, i) => saved[Number(i)]);
}

function normalize(text) {
  const { out: protectedText, saved } = protectEn(text);
  let out = protectedText;
  // o'/g' digraphs (ASCII, curly, or mixed)
  out = out.replace(new RegExp(`([OoGg])${MARK}`, "g"), `$1${TURNED}`);
  // tutuq: vowel + mark + letter (ma'no, a'lo)
  out = out.replace(
    new RegExp(`([AaEeIiOoUuOo${TURNED}])${MARK}([A-Za-zÀ-ÿ${TURNED}${TUTUQ}])`, "g"),
    (_, a, b) => `${a}${TUTUQ}${b}`
  );
  // consonant tutuq sites: san'at, mas'ul, qat'iy, jam'i, a'zo
  out = out.replace(
    new RegExp(
      `\\b([Ss]an|[Mm]as|[Qq]at|[Jj]am|[Aa]'?z|[Mm]ehn|[Ii]nsho)${MARK}([A-Za-z${TURNED}${TUTUQ}])`,
      "g"
    ),
    (_, stem, rest) => `${stem.replace(/'/g, "")}${TUTUQ}${rest}`
  );
  // simpler pass for san'at-style remaining
  out = out.replace(
    new RegExp(`([NnMmLlRrTtDdSsZzKkQqGgHhPpBbVvYyJjXxCcFfWw])${MARK}([AaEeIiOoUu])`, "g"),
    (_, c, v) => `${c}${TUTUQ}${v}`
  );
  return restoreEn(out, saved);
}

function lintReport(text) {
  const issues = [];
  if (/[A-Za-z]'[A-Za-z]/.test(text) && !EN_SKIP.test(text)) {
    issues.push("ASCII apostrophe ' found in a word");
  }
  if (/[`\u2018\u2019]/.test(text)) issues.push("curly/grave quote mark found");
  return issues;
}

function usage() {
  console.error(
    "Usage: node normalize-apostrophe.mjs [--check|--dry-run|--stdout] <file>"
  );
}

const args = process.argv.slice(2);
let mode = "write";
const files = [];
for (const a of args) {
  if (a === "--check") mode = "check";
  else if (a === "--dry-run") mode = "dry-run";
  else if (a === "--stdout") mode = "stdout";
  else if (a.startsWith("-")) {
    usage();
    process.exit(1);
  } else files.push(a);
}

if (files.length !== 1) {
  usage();
  process.exit(1);
}

const file = files[0];
if (!fs.existsSync(file)) {
  console.error(`File not found: ${file}`);
  process.exit(1);
}

const raw = fs.readFileSync(file, "utf8");
const next = normalize(raw);

if (mode === "stdout" || mode === "dry-run") {
  process.stdout.write(next);
  if (mode === "dry-run" && next !== raw) {
    console.error("\n(would modify file)");
  }
  process.exit(next === raw ? 0 : mode === "check" ? 2 : 0);
}

if (mode === "check") {
  if (next !== raw) {
    console.error(`Would normalize: ${file}`);
    process.exit(2);
  }
  console.log(`Check ok: ${file}`);
  process.exit(0);
}

fs.writeFileSync(file, next);
const issues = lintReport(next);
if (issues.length) {
  console.error("Normalized with remaining issues:");
  for (const i of issues) console.error("-", i);
  process.exit(2);
}
console.log(`Normalized ${file}`);
