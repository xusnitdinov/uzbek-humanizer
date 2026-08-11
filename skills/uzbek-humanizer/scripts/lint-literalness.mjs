#!/usr/bin/env node
/**
 * Literalness lint: catch translation smell even if grammar looks correct.
 */
import fs from "node:fs";
import path from "node:path";
import { extractUzbekForLint } from "./extract-uzbek.mjs";

function usage() {
  console.error(
    "Usage: node lint-literalness.mjs [--whole-file|--matn-only] <file>"
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

const patterns = [
  {
    id: "would-you-mind",
    re: /\bqarshi\s+emasmisiz\b/i,
    tip: "Literal EN shadow - prefer Iltimos, ...-ib qoʻying",
  },
  {
    id: "rocket-science",
    re: /\braketa\s+ilmi\b/i,
    tip: "Literal idiom calque - rewrite plain meaning",
  },
  {
    id: "chelakni-tepdi",
    re: /\bchelakni\s+tepdi\b/i,
    tip: "Literal idiom calque",
  },
  {
    id: "brochure-opener",
    re: /\bHurmatli\s+foydalanuvchi\b/i,
    tip: "False formality boilerplate",
  },
  {
    id: "filler-haqiqatan",
    re: /\bhaqiqatan\s+ham\b/i,
    tip: "AI filler intensity - usually removable",
  },
  {
    id: "translation-rhythm",
    re: /\b(?:imkoniyatlar\s+olami|maksimal\s+darajada|innovatsion\s+yechim)\b/i,
    tip: "Translation-smell brochure stack",
  },
  {
    id: "double-english-order",
    re: /\b(?:men|biz)\s+haqiqatan\s+ham\s+bu\b/i,
    tip: "EN word-order shadow",
  },
];

const findings = [];
for (const p of patterns) {
  const m = text.match(p.re);
  if (m) findings.push(`[${p.id}] "${m[0]}" → ${p.tip}`);
}

if (findings.length) {
  console.error(`Literalness findings (${findings.length}):`);
  for (const f of findings) console.error(`- ${f}`);
  process.exit(2);
}
console.log(`Clean: ${file}`);
