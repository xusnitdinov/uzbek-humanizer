#!/usr/bin/env node
/**
 * Eval runner for uzbek-humanizer cases.jsonl.
 *
 * Structural mode (default, no answers): validate schema, bucket coverage,
 * lint examples. Score mode: when case.candidate or --answers id→output map
 * is present, check expect_contains / expect_not.
 *
 * Usage:
 *   node skills/uzbek-humanizer/scripts/run-eval.mjs
 *   node skills/uzbek-humanizer/scripts/run-eval.mjs --answers path.json
 */
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SKILL_ROOT = path.resolve(__dirname, "..");
const CASES_PATH = path.join(SKILL_ROOT, "eval", "cases.jsonl");
const EXAMPLES_DIR = path.join(SKILL_ROOT, "examples");
const LINT_BANNED = path.join(__dirname, "lint-banned.mjs");
const LINT_STIFF = path.join(__dirname, "lint-stiff.mjs");

const REQUIRED = ["id", "type", "input", "bucket"];

function parseArgs(argv) {
  let answersPath = null;
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--answers") {
      answersPath = argv[++i];
      if (!answersPath) {
        console.error("Missing path after --answers");
        process.exit(1);
      }
    } else if (argv[i] === "--help" || argv[i] === "-h") {
      console.log(`Usage: node run-eval.mjs [--answers path.json]

Reads eval/cases.jsonl, validates schema, optionally scores against
candidate / answers map, lints examples/*.md for banned patterns.`);
      process.exit(0);
    }
  }
  return { answersPath };
}

function loadJsonl(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  const lines = raw.split(/\r?\n/);
  const rows = [];
  const errors = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const lineNo = i + 1;
    try {
      rows.push({ lineNo, case: JSON.parse(line) });
    } catch (e) {
      errors.push({ lineNo, message: `Invalid JSON: ${e.message}` });
    }
  }
  return { rows, errors };
}

function validateSchema(c, lineNo) {
  const issues = [];
  if (c === null || typeof c !== "object" || Array.isArray(c)) {
    return [`line ${lineNo}: case must be a JSON object`];
  }
  for (const key of REQUIRED) {
    if (!(key in c) || c[key] === null || c[key] === "") {
      issues.push(`line ${lineNo} id=${c.id ?? "?"}: missing required "${key}"`);
    }
  }
  if (c.expect_contains !== undefined && !Array.isArray(c.expect_contains)) {
    issues.push(`line ${lineNo} id=${c.id}: expect_contains must be an array`);
  }
  if (c.expect_not !== undefined && !Array.isArray(c.expect_not)) {
    issues.push(`line ${lineNo} id=${c.id}: expect_not must be an array`);
  }
  return issues;
}

function loadAnswers(answersPath) {
  if (!answersPath) return {};
  const abs = path.resolve(answersPath);
  if (!fs.existsSync(abs)) {
    console.error(`Answers file not found: ${abs}`);
    process.exit(1);
  }
  const data = JSON.parse(fs.readFileSync(abs, "utf8"));
  if (data === null || typeof data !== "object" || Array.isArray(data)) {
    console.error("Answers file must be a JSON object map of id → output string");
    process.exit(1);
  }
  return data;
}

function resolveOutput(c, answers) {
  if (typeof c.candidate === "string" && c.candidate.length) return c.candidate;
  if (typeof answers[c.id] === "string") return answers[c.id];
  return null;
}

function hasExpectations(c) {
  return (
    (Array.isArray(c.expect_contains) && c.expect_contains.length > 0) ||
    (Array.isArray(c.expect_not) && c.expect_not.length > 0)
  );
}

/** expect_contains: any match passes (apostrophe / phrasing alternatives). */
function scoreCase(c, output) {
  const fails = [];
  if (Array.isArray(c.expect_contains) && c.expect_contains.length) {
    const hit = c.expect_contains.some((s) => output.includes(s));
    if (!hit) {
      fails.push(`expect_contains none of ${JSON.stringify(c.expect_contains)}`);
    }
  }
  if (Array.isArray(c.expect_not) && c.expect_not.length) {
    for (const s of c.expect_not) {
      if (output.includes(s)) fails.push(`expect_not hit "${s}"`);
    }
  }
  return fails;
}

function exampleLintTargets(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  const matn = raw.match(/## Matn\s*\n([\s\S]*?)(?=\n## |\s*$)/);
  if (matn) {
    const tmp = path.join(
      os.tmpdir(),
      `uzh-matn-${path.basename(filePath)}.txt`
    );
    fs.writeFileSync(tmp, matn[1].trim() + "\n", "utf8");
    return tmp;
  }
  return filePath;
}

function lintExamples() {
  const files = fs
    .readdirSync(EXAMPLES_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => path.join(EXAMPLES_DIR, f));
  const results = [];
  for (const file of files) {
    const target = exampleLintTargets(file);
    for (const [label, script] of [
      ["lint-banned", LINT_BANNED],
      ["lint-stiff", LINT_STIFF],
    ]) {
      const r = spawnSync(process.execPath, [script, target], {
        encoding: "utf8",
      });
      results.push({
        file: `${path.relative(SKILL_ROOT, file)} [${label}]`,
        ok: r.status === 0,
        status: r.status,
        stdout: (r.stdout || "").trim(),
        stderr: (r.stderr || "").trim(),
      });
    }
  }
  return results;
}

function main() {
  const { answersPath } = parseArgs(process.argv.slice(2));
  const answers = loadAnswers(answersPath);

  if (!fs.existsSync(CASES_PATH)) {
    console.error(`Cases file not found: ${CASES_PATH}`);
    process.exit(1);
  }

  const { rows, errors: parseErrors } = loadJsonl(CASES_PATH);
  const schemaIssues = [];
  for (const { lineNo, case: c } of rows) {
    schemaIssues.push(...validateSchema(c, lineNo));
  }

  const byBucket = new Map();
  const results = [];
  let pass = 0;
  let fail = 0;
  let skipped = 0;
  let schemaFail = parseErrors.length + schemaIssues.length;

  for (const { lineNo, case: c } of rows) {
    const bucket = typeof c.bucket === "string" ? c.bucket : "(invalid)";
    if (!byBucket.has(bucket)) {
      byBucket.set(bucket, { total: 0, pass: 0, fail: 0, skipped: 0 });
    }
    const b = byBucket.get(bucket);
    b.total += 1;

    const schemaBad = validateSchema(c, lineNo).length > 0;
    if (schemaBad) {
      results.push({ id: c.id ?? `line-${lineNo}`, status: "fail", reason: "schema" });
      fail += 1;
      b.fail += 1;
      continue;
    }

    if (!hasExpectations(c)) {
      results.push({ id: c.id, status: "skipped", reason: "no expectations (structural ok)" });
      skipped += 1;
      b.skipped += 1;
      continue;
    }

    const output = resolveOutput(c, answers);
    if (output === null) {
      results.push({ id: c.id, status: "skipped", reason: "no candidate / answers" });
      skipped += 1;
      b.skipped += 1;
      continue;
    }

    const scoreFails = scoreCase(c, output);
    if (scoreFails.length) {
      results.push({ id: c.id, status: "fail", reason: scoreFails.join("; ") });
      fail += 1;
      b.fail += 1;
    } else {
      results.push({ id: c.id, status: "pass", reason: "expectations met" });
      pass += 1;
      b.pass += 1;
    }
  }

  console.log("=== uzbek-humanizer eval ===");
  console.log(`cases: ${CASES_PATH}`);
  console.log(
    `mode: ${answersPath || rows.some((r) => typeof r.case.candidate === "string") ? "score (+ structural)" : "structural"}`
  );
  console.log("");

  if (parseErrors.length) {
    console.log("Parse errors:");
    for (const e of parseErrors) console.log(`  line ${e.lineNo}: ${e.message}`);
    console.log("");
  }
  if (schemaIssues.length) {
    console.log("Schema errors:");
    for (const s of schemaIssues) console.log(`  ${s}`);
    console.log("");
  }

  const scoredFails = results.filter((r) => r.status === "fail" && r.reason !== "schema");
  if (scoredFails.length) {
    console.log("Failed cases:");
    for (const r of scoredFails) console.log(`  ${r.id}: ${r.reason}`);
    console.log("");
  }

  console.log("Coverage by bucket:");
  const buckets = [...byBucket.keys()].sort();
  for (const bucket of buckets) {
    const b = byBucket.get(bucket);
    console.log(
      `  ${bucket}: total=${b.total} pass=${b.pass} fail=${b.fail} skipped=${b.skipped}`
    );
  }
  console.log("");

  console.log("Lint example Matn (lint-banned + lint-stiff):");
  const lintResults = lintExamples();
  let lintFail = 0;
  for (const lr of lintResults) {
    if (lr.ok) {
      console.log(`  ok  ${lr.file}`);
    } else {
      lintFail += 1;
      console.log(`  FAIL ${lr.file}`);
      if (lr.stderr) console.log(`       ${lr.stderr.split(/\r?\n/).join("\n       ")}`);
    }
  }
  console.log("");

  const total = rows.length;
  console.log("Summary:");
  console.log(`  total cases: ${total}`);
  console.log(`  pass: ${pass}`);
  console.log(`  fail: ${fail}`);
  console.log(`  skipped: ${skipped}`);
  console.log(`  schema/parse issues: ${schemaFail}`);
  console.log(`  lint example failures: ${lintFail}`);
  console.log(`  buckets: ${buckets.length}`);

  const exitFail = fail > 0 || schemaFail > 0 || lintFail > 0 || parseErrors.length > 0;
  process.exit(exitFail ? 1 : 0);
}

main();
