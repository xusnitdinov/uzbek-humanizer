#!/usr/bin/env node
import { readFile } from "node:fs/promises";

const DIMENSIONS = ["naturalness", "context_fit", "register_fidelity", "ui_brevity"];
const PRESETS = new Set(["product-default", "quiz-formal", "assistant-friendly", "marketing-warm"]);
const root = new URL("../eval/live-bakeoff/", import.meta.url);

if (process.argv.includes("--help") || process.argv.includes("-h")) {
  console.log("Usage: node skills/uzbek-humanizer/scripts/run-live-bakeoff.mjs");
  console.log("Validates live-bakeoff prompts and candidates, then enforces quality thresholds.");
  process.exit(0);
}

const fail = (message) => {
  console.error(`FAIL: ${message}`);
  process.exit(1);
};

let prompts;
let candidates;
try {
  const [promptText, candidateText] = await Promise.all([
    readFile(new URL("prompts.jsonl", root), "utf8"),
    readFile(new URL("candidates.json", root), "utf8"),
  ]);
  prompts = promptText.trim().split(/\r?\n/).filter(Boolean).map((line, index) => {
    try { return JSON.parse(line); } catch { fail(`prompts.jsonl line ${index + 1} is not valid JSON`); }
  });
  candidates = JSON.parse(candidateText);
} catch (error) {
  fail(`could not load bakeoff fixtures: ${error.message}`);
}

const errors = [];
const ids = new Set();
for (const [index, prompt] of prompts.entries()) {
  if (!prompt || typeof prompt !== "object" || !["id", "preset", "input", "domain"].every((key) => typeof prompt[key] === "string" && prompt[key].trim())) {
    errors.push(`prompt line ${index + 1} must contain non-empty id, preset, input, and domain`);
    continue;
  }
  if (ids.has(prompt.id)) errors.push(`duplicate prompt id: ${prompt.id}`);
  ids.add(prompt.id);
  if (!PRESETS.has(prompt.preset)) errors.push(`prompt ${prompt.id} has unsupported preset: ${prompt.preset}`);
}

const scores = [];
let nativeYes = 0;
for (const id of ids) {
  const candidate = candidates[id];
  if (!candidate || typeof candidate !== "object") {
    errors.push(`missing candidate for ${id}`);
    continue;
  }
  if (typeof candidate.output !== "string" || !candidate.output.trim()) errors.push(`candidate ${id} needs a non-empty output`);
  if (typeof candidate.notes !== "string") errors.push(`candidate ${id} needs string notes`);
  if (typeof candidate.native_yes !== "boolean") errors.push(`candidate ${id} needs boolean native_yes`);
  if (candidate.native_yes === true) nativeYes++;
  for (const dimension of DIMENSIONS) {
    if (!Number.isInteger(candidate[dimension]) || candidate[dimension] < 1 || candidate[dimension] > 5) {
      errors.push(`candidate ${id} has invalid ${dimension}; expected integer 1–5`);
    } else {
      scores.push(candidate[dimension]);
    }
  }
}
for (const id of Object.keys(candidates)) {
  if (!ids.has(id)) errors.push(`candidate ${id} has no matching prompt`);
}
if (errors.length) fail(`schema validation failed:\n- ${errors.join("\n- ")}`);

const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
const nativeRate = (nativeYes / prompts.length) * 100;
console.log("Live bakeoff summary");
console.log(`Prompts: ${prompts.length}`);
console.log(`Dimension average: ${average.toFixed(2)} / 5.00 (gate: 4.70)`);
console.log(`Native yes: ${nativeYes}/${prompts.length} (${nativeRate.toFixed(1)}%; gate: 95.0%)`);

if (average < 4.7 || nativeRate < 95) {
  fail(`quality gate failed${average < 4.7 ? `: average ${average.toFixed(2)} < 4.70` : ""}${average < 4.7 && nativeRate < 95 ? ";" : ""}${nativeRate < 95 ? ` native rate ${nativeRate.toFixed(1)}% < 95.0%` : ""}`);
}
console.log("PASS: live bakeoff quality gates met.");
