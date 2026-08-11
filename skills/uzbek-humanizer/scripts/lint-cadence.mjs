#!/usr/bin/env node
/**
 * Cadence lint: rhythm/prosody checks for Uzbek copy.
 * Flags monotone sentence blocks, repetitive templates, abstract noun stacks.
 */
import fs from "node:fs";
import path from "node:path";
import { extractUzbekForLint } from "./extract-uzbek.mjs";

function usage() {
  console.error("Usage: node lint-cadence.mjs [--whole-file|--matn-only] <file>");
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
const sentences = text
  .split(/(?<=[.!?…])\s+/)
  .map((s) => s.trim())
  .filter(Boolean);

if (sentences.length >= 6) {
  const lens = sentences.map((s) => s.split(/\s+/).length);
  let monoRun = 1;
  for (let i = 1; i < lens.length; i++) {
    const near = Math.abs(lens[i] - lens[i - 1]) <= 1;
    monoRun = near ? monoRun + 1 : 1;
    if (monoRun >= 5) {
      findings.push("Monotone cadence: 5+ near-identical sentence lengths");
      break;
    }
  }
}

const repeats = [
  { re: /\bqilaman\b/gi, label: "qilaman" },
  { re: /\bboʻladi\b/gi, label: "boʻladi" },
  { re: /\bkerak\b/gi, label: "kerak" },
];
for (const r of repeats) {
  const n = (text.match(r.re) || []).length;
  if (n >= 6) findings.push(`Template overuse: "${r.label}" appears ${n} times`);
}

if (/\b(?:taʼminlash|amalga oshirish|jarayon|holat|imkoniyat|funksional)\b(?:\s+\b(?:taʼminlash|amalga oshirish|jarayon|holat|imkoniyat|funksional)\b){2,}/i.test(text)) {
  findings.push("Abstract noun stack: 3+ bureaucratic nouns in a row");
}

if (findings.length) {
  console.error(`Cadence findings (${findings.length}):`);
  for (const f of findings) console.error(`- ${f}`);
  process.exit(2);
}

console.log(`Clean: ${file}`);
