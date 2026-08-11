#!/usr/bin/env node
/**
 * Lint banned EN calques / discourse RU / soft-wrong synonyms in Uzbek drafts.
 *
 * By default extracts Uzbek-facing text (tx first arg, "uz": values, ## Matn)
 * so English locale strings do not false-positive.
 *
 * Usage:
 *   node lint-banned.mjs <file>
 *   node lint-banned.mjs --matn-only <file>
 *   node lint-banned.mjs --whole-file <file>   # skip Uzbek extraction
 */
import fs from "node:fs";
import path from "node:path";
import { extractUzbekForLint } from "./extract-uzbek.mjs";

/** Meta English in teaching docs - not UZ cool-slang hits */
const SHIP_META =
  /\b(?:before|after|to|will|can|should|must|don't|do not|does not|did not|don't|when you|we|you)\s+ship\b/i;

const BANNED = [
  {
    id: "ship",
    re: /\bship\b/i,
    skip: (text, m) => {
      const i = text.indexOf(m);
      const window = text.slice(Math.max(0, i - 24), i + m.length);
      return (
        SHIP_META.test(window) ||
        /\bship\s+(?:order|date|hygiene)\b/i.test(window)
      );
    },
  },
  {
    id: "vibe",
    re: /\bvibe\b/i,
    skip: (text, m) => {
      const i = text.indexOf(m);
      const window = text.slice(Math.max(0, i - 20), i + m.length + 8);
      return /\b(?:telegram|akkurat|teaching|mode)\s+vibe\b/i.test(window);
    },
  },
  { id: "portladi", re: /\bportladi\b/i },
  { id: "teammate", re: /\bteammate\b/i },
  { id: "systems-brain", re: /\bsystems\s+brain\b/i },
  { id: "hard-mode", re: /\bhard\s+mode\b/i },
  { id: "karoche", re: /\bkaroche\b/i },
  { id: "normalni", re: /\bnormalni\b/i },
  { id: "kruto", re: /\bkruto\b/i },
  { id: "chotki", re: /\bchotki\b/i },
  { id: "check-qil", re: /\bcheck\s+qil/i },
  { id: "support-qil", re: /\bsupport\s+qil/i },
  { id: "update-qil", re: /\bupdate\s+qil/i },
  { id: "select-qil", re: /\bselect\s+qil/i },
  { id: "haqiqatan-ham", re: /\bhaqiqatan\s+ham\b/i },
  { id: "chelakni-tepdi", re: /\bchelakni\s+tepdi\b/i },
  { id: "hurmatli", re: /\bHurmatli\s+foydalanuvchi\b/i },
  { id: "place-en", re: /\b(Tashkent|Samarkand|Bukhara|Fergana)\b/i },
  // Soft-wrong: "failed/didn't work out" as chiqmadi when oʻxshamadi fits
  {
    id: "soft-chiqmadi-group",
    re: /\b(?:Guruh|Loyiha|Ish)\s+\w*\s*chiqmadi\b/i,
  },
  { id: "soft-chiqmadi-ishi", re: /\bishi\s+chiqmadi\b/i },
];

function extractMatn(text) {
  const blocks = [];
  const parts = text.split(/^##\s+/m);
  for (const part of parts) {
    if (/^Matn\b/i.test(part.trim()) || /^Matn\b/i.test(part)) {
      blocks.push(part.replace(/^Matn[^\n]*\n?/i, ""));
    }
  }
  return blocks.length ? blocks.join("\n") : text;
}

const args = process.argv.slice(2);
let matnOnly = false;
let wholeFile = false;
const files = [];
for (const a of args) {
  if (a === "--matn-only") matnOnly = true;
  else if (a === "--whole-file") wholeFile = true;
  else if (a.startsWith("-")) {
    console.error(
      "Usage: node lint-banned.mjs [--matn-only|--whole-file] <file>"
    );
    process.exit(1);
  } else files.push(a);
}

const file = files[0];
if (!file) {
  console.error(
    "Usage: node lint-banned.mjs [--matn-only|--whole-file] <file>"
  );
  process.exit(1);
}

let text = fs.readFileSync(file, "utf8");
if (matnOnly) {
  text = extractMatn(text);
} else if (!wholeFile) {
  const { text: uz, skipped } = extractUzbekForLint(text, {
    filePath: path.resolve(file),
  });
  if (skipped === "en-locale-path") {
    console.log(`Skip EN locale path: ${file}`);
    process.exit(0);
  }
  text = uz;
}

const hits = [];
for (const rule of BANNED) {
  const m = text.match(rule.re);
  if (!m) continue;
  if (rule.skip && rule.skip(text, m[0])) continue;
  hits.push(m[0]);
}
if (hits.length) {
  console.error("Banned patterns found:");
  for (const h of hits) console.error("-", h);
  process.exit(2);
}
console.log(`Clean: ${file}`);
