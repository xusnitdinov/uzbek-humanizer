#!/usr/bin/env node
/**
 * Screen-level consistency lint for a single surface / Matn block.
 * Flags mixed address lanes, jumla/gap mixing, literary+chatty clash,
 * and repeated template stems.
 */
import fs from "node:fs";
import path from "node:path";
import { extractUzbekForLint } from "./extract-uzbek.mjs";

function usage() {
  console.error(
    "Usage: node lint-screen-consistency.mjs [--whole-file|--matn-only] <file>"
  );
}

const args = process.argv.slice(2);
let whole = false;
let matnOnly = false;
const files = [];
for (const a of args) {
  if (a === "--whole-file") whole = true;
  else if (a === "--matn-only") matnOnly = true;
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

let text = fs.readFileSync(file, "utf8");
if (matnOnly) {
  const blocks = text.split(/^##\s+/m);
  text = blocks
    .filter((b) => /^Matn\b/i.test(b.trim()))
    .map((b) => b.replace(/^Matn[^\n]*\n?/i, ""))
    .join("\n");
}
if (!whole && !matnOnly) {
  const { text: uz, skipped } = extractUzbekForLint(text, {
    filePath: path.resolve(file),
  });
  if (skipped === "en-locale-path") {
    console.log(`Skip EN locale path: ${file}`);
    process.exit(0);
  }
  text = uz;
}

const findings = [];

const hasSiz = /\b(Siz|sizning|Sizning)\b/.test(text) || /\w+(asiz|ysiz|ingiz)\b/i.test(text);
const hasSen =
  /\b(?:qilasan|kirasan|yozasan|oʻylaysan|o'ylaysan|kelasan|borasan)\b/i.test(
    text
  ) || /(^|[.!?]\s+)(Kel|Yoz|Qil)\b(?!\w)/.test(text);
if (hasSiz && hasSen) {
  findings.push("Mixed address lane: Siz forms + sen/-asan on one surface");
}

const hasJumla = /\bjumla\b/i.test(text);
const hasGap = /\bgap\b/i.test(text);
if (hasJumla && hasGap) {
  findings.push("Mixed stem lexicon: both jumla and gap on one surface");
}

const literary =
  /\b(?:mazkur|ushbu|amalga oshirish|taʼminlash|murojaatnomangiz)\b/i.test(
    text
  );
const chatty =
  /\b(?:xoʻp|mayli|karoche|gap yoʻq|judayam)\b/i.test(text);
if (literary && chatty) {
  findings.push("Literary + chatty mix on one surface");
}

const stems = [
  ...(text.match(/\b(?:belgilang|toping|tanlang|yuboring)\b/gi) || []),
];
if (stems.length >= 5) {
  const counts = new Map();
  for (const s of stems) {
    const k = s.toLowerCase();
    counts.set(k, (counts.get(k) || 0) + 1);
  }
  for (const [k, n] of counts) {
    if (n >= 4) findings.push(`Repeated template stem "${k}" x${n}`);
  }
}

if (findings.length) {
  console.error(`Screen-consistency findings (${findings.length}):`);
  for (const f of findings) console.error(`- ${f}`);
  process.exit(2);
}
console.log(`Clean: ${file}`);
