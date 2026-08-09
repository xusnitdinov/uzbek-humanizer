#!/usr/bin/env node
/**
 * Lint banned EN calques / discourse RU in Uzbek copy drafts.
 */
import fs from "node:fs";

const BANNED = [
  /\bship\b/i,
  /\bvibe\b/i,
  /\bportladi\b/i,
  /\bteammate\b/i,
  /\bsystems\s+brain\b/i,
  /\bhard mode\b/i,
  /\bkaroche\b/i,
  /\bnormalni\b/i,
  /\bkruto\b/i,
  /\bchotki\b/i,
  /\bcheck qil/i,
  /\bsupport qil/i,
  /\bupdate qil/i,
];

const file = process.argv[2];
if (!file) {
  console.error("Usage: node lint-banned.mjs <file>");
  process.exit(1);
}
const text = fs.readFileSync(file, "utf8");
const hits = [];
for (const re of BANNED) {
  const m = text.match(re);
  if (m) hits.push(m[0]);
}
if (hits.length) {
  console.error("Banned patterns found:");
  for (const h of hits) console.error("-", h);
  process.exit(2);
}
console.log(`Clean: ${file}`);
