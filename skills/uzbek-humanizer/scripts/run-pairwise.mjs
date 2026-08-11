#!/usr/bin/env node
import { readFile } from "node:fs/promises";

if (process.argv.includes("--help") || process.argv.includes("-h")) {
  console.log("Usage: node skills/uzbek-humanizer/scripts/run-pairwise.mjs");
  console.log("Validates pairwise labels and enforces an 80% spoken-preference floor.");
  process.exit(0);
}

const pairwiseUrl = new URL("../eval/pairwise.jsonl", import.meta.url);
const fail = (message) => {
  console.error(`FAIL: ${message}`);
  process.exit(1);
};

let pairs;
try {
  const text = await readFile(pairwiseUrl, "utf8");
  pairs = text.trim().split(/\r?\n/).filter(Boolean).map((line, index) => {
    try { return JSON.parse(line); } catch { fail(`pairwise.jsonl line ${index + 1} is not valid JSON`); }
  });
} catch (error) {
  fail(`could not load pairwise fixture: ${error.message}`);
}

const required = ["id", "prompt", "a", "b", "prefer", "why"];
const ids = new Set();
const errors = [];
let spokenWins = 0;
let labelAgreement = 0;
for (const [index, pair] of pairs.entries()) {
  if (!pair || typeof pair !== "object") {
    errors.push(`line ${index + 1} must be an object`);
    continue;
  }
  for (const field of required) {
    if (typeof pair[field] !== "string" || !pair[field].trim()) errors.push(`pair on line ${index + 1} needs non-empty ${field}`);
  }
  if (ids.has(pair.id)) errors.push(`duplicate pair id: ${pair.id}`);
  ids.add(pair.id);
  if (!["a", "b"].includes(pair.prefer)) {
    errors.push(`pair ${pair.id} has invalid prefer label: ${pair.prefer}`);
    continue;
  }
  labelAgreement++;
  if (pair.prefer === "b") spokenWins++;
}
if (errors.length) fail(`schema validation failed:\n- ${errors.join("\n- ")}`);

const spokenRate = spokenWins / pairs.length;
const agreementRate = labelAgreement / pairs.length;
console.log("Pairwise summary");
console.log(`Pairs: ${pairs.length}`);
console.log(`Preference-label agreement: ${labelAgreement}/${pairs.length} (${(agreementRate * 100).toFixed(1)}%)`);
console.log(`Spoken-side preference (b): ${spokenWins}/${pairs.length} (${(spokenRate * 100).toFixed(1)}%; gate: 80.0%)`);

if (spokenRate < 0.8) fail(`spoken-side preference ${spokenRate.toFixed(3)} is below 0.80`);
console.log("PASS: pairwise quality gate met.");
