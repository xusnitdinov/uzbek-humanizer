#!/usr/bin/env node
/**
 * Eval runner for uzbek-humanizer cases.jsonl.
 *
 * Structural mode: validate schema, unique ids, bucket coverage, lint examples,
 * plus trigger-queries / bakeoff-items schema checks.
 * Score mode: when case.candidate, --answers, or eval/goldens.json is present,
 * check expect_contains_any / expect_contains_all / legacy expect_contains /
 * expect_not.
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
const EVAL_DIR = path.join(SKILL_ROOT, "eval");
const CASES_PATH = path.join(EVAL_DIR, "cases.jsonl");
const GOLDENS_PATH = path.join(EVAL_DIR, "goldens.json");
const TRIGGER_PATH = path.join(EVAL_DIR, "trigger-queries.json");
const BAKEOFF_PATH = path.join(EVAL_DIR, "bakeoff-items.jsonl");
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

Reads eval/cases.jsonl, validates schema, scores against candidate /
answers / eval/goldens.json when present, validates trigger-queries and
bakeoff-items, lints examples/*.md Matn blocks.`);
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

function isStringArray(v) {
  return Array.isArray(v) && v.every((x) => typeof x === "string");
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
  for (const key of [
    "expect_contains",
    "expect_contains_any",
    "expect_contains_all",
    "expect_not",
  ]) {
    if (c[key] !== undefined && !isStringArray(c[key])) {
      issues.push(`line ${lineNo} id=${c.id}: ${key} must be an array of strings`);
    }
  }
  return issues;
}

function findDuplicateIds(rows) {
  const seen = new Map();
  const dupes = [];
  for (const { lineNo, case: c } of rows) {
    if (typeof c.id !== "string" || !c.id) continue;
    if (seen.has(c.id)) {
      dupes.push(
        `duplicate id "${c.id}" at lines ${seen.get(c.id)} and ${lineNo}`
      );
    } else {
      seen.set(c.id, lineNo);
    }
  }
  return dupes;
}

function resolveAnswersPath(cliPath) {
  if (cliPath) return path.resolve(cliPath);
  if (fs.existsSync(GOLDENS_PATH)) return GOLDENS_PATH;
  return null;
}

function loadAnswers(answersPath) {
  if (!answersPath) return { answers: {}, source: null };
  if (!fs.existsSync(answersPath)) {
    console.error(`Answers file not found: ${answersPath}`);
    process.exit(1);
  }
  const data = JSON.parse(fs.readFileSync(answersPath, "utf8"));
  if (data === null || typeof data !== "object" || Array.isArray(data)) {
    console.error("Answers file must be a JSON object map of id → output string");
    process.exit(1);
  }
  return { answers: data, source: answersPath };
}

function resolveOutput(c, answers) {
  if (typeof c.candidate === "string" && c.candidate.length) return c.candidate;
  if (typeof answers[c.id] === "string") return answers[c.id];
  return null;
}

function hasExpectations(c) {
  return (
    (Array.isArray(c.expect_contains) && c.expect_contains.length > 0) ||
    (Array.isArray(c.expect_contains_any) && c.expect_contains_any.length > 0) ||
    (Array.isArray(c.expect_contains_all) && c.expect_contains_all.length > 0) ||
    (Array.isArray(c.expect_not) && c.expect_not.length > 0)
  );
}

/**
 * Scoring:
 * - expect_contains_any: OR (any substring hits)
 * - expect_contains_all: AND (every substring must hit)
 * - expect_contains: legacy OR (prefer migrating flaky cases to any/all)
 * - expect_not: none of the substrings may appear
 */
function scoreCase(c, output) {
  const fails = [];

  if (Array.isArray(c.expect_contains_any) && c.expect_contains_any.length) {
    const hit = c.expect_contains_any.some((s) => output.includes(s));
    if (!hit) {
      fails.push(
        `expect_contains_any none of ${JSON.stringify(c.expect_contains_any)}`
      );
    }
  }

  if (Array.isArray(c.expect_contains_all) && c.expect_contains_all.length) {
    const missing = c.expect_contains_all.filter((s) => !output.includes(s));
    if (missing.length) {
      fails.push(`expect_contains_all missing ${JSON.stringify(missing)}`);
    }
  }

  // Legacy OR - same semantics as expect_contains_any
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

function validateTriggerQueries(filePath) {
  const issues = [];
  let trueCount = 0;
  let falseCount = 0;
  if (!fs.existsSync(filePath)) {
    return {
      issues: [`missing file: ${filePath}`],
      trueCount: 0,
      falseCount: 0,
      total: 0,
    };
  }
  let data;
  try {
    data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (e) {
    return {
      issues: [`invalid JSON: ${e.message}`],
      trueCount: 0,
      falseCount: 0,
      total: 0,
    };
  }
  if (!Array.isArray(data)) {
    return {
      issues: ["trigger-queries.json must be a JSON array"],
      trueCount: 0,
      falseCount: 0,
      total: 0,
    };
  }
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    if (row === null || typeof row !== "object" || Array.isArray(row)) {
      issues.push(`index ${i}: must be an object`);
      continue;
    }
    if (typeof row.query !== "string" || !row.query.trim()) {
      issues.push(`index ${i}: missing non-empty string "query"`);
    }
    if (typeof row.should_trigger !== "boolean") {
      issues.push(`index ${i}: "should_trigger" must be boolean`);
    } else if (row.should_trigger) {
      trueCount += 1;
    } else {
      falseCount += 1;
    }
  }
  return { issues, trueCount, falseCount, total: data.length };
}

function validateBakeoffItems(filePath) {
  const issues = [];
  if (!fs.existsSync(filePath)) {
    return { issues: [`missing file: ${filePath}`], total: 0 };
  }
  const { rows, errors } = loadJsonl(filePath);
  for (const e of errors) {
    issues.push(`line ${e.lineNo}: ${e.message}`);
  }
  const seen = new Map();
  for (const { lineNo, case: c } of rows) {
    if (c === null || typeof c !== "object" || Array.isArray(c)) {
      issues.push(`line ${lineNo}: must be a JSON object`);
      continue;
    }
    if (typeof c.id !== "string" || !c.id) {
      issues.push(`line ${lineNo}: missing non-empty "id"`);
    } else if (seen.has(c.id)) {
      issues.push(
        `duplicate id "${c.id}" at lines ${seen.get(c.id)} and ${lineNo}`
      );
    } else {
      seen.set(c.id, lineNo);
    }
    if (typeof c.input !== "string" || !c.input) {
      issues.push(`line ${lineNo} id=${c.id ?? "?"}: missing non-empty "input"`);
    }
  }
  return { issues, total: rows.length };
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
    return { target: tmp, temp: true };
  }
  return { target: filePath, temp: false };
}

function lintExamples() {
  const files = fs
    .readdirSync(EXAMPLES_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => path.join(EXAMPLES_DIR, f));
  const results = [];
  for (const file of files) {
    const { target, temp } = exampleLintTargets(file);
    try {
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
    } finally {
      if (temp) {
        try {
          fs.unlinkSync(target);
        } catch {
          // ignore cleanup races
        }
      }
    }
  }
  return results;
}

function main() {
  const { answersPath: cliAnswers } = parseArgs(process.argv.slice(2));
  const resolvedAnswersPath = resolveAnswersPath(cliAnswers);
  const { answers, source: answersSource } = loadAnswers(resolvedAnswersPath);
  const goldensAuto =
    !cliAnswers && answersSource === GOLDENS_PATH && fs.existsSync(GOLDENS_PATH);

  if (!fs.existsSync(CASES_PATH)) {
    console.error(`Cases file not found: ${CASES_PATH}`);
    process.exit(1);
  }

  const { rows, errors: parseErrors } = loadJsonl(CASES_PATH);
  const schemaIssues = [];
  for (const { lineNo, case: c } of rows) {
    schemaIssues.push(...validateSchema(c, lineNo));
  }
  const duplicateIdIssues = findDuplicateIds(rows);
  schemaIssues.push(...duplicateIdIssues);

  const byBucket = new Map();
  const results = [];
  let pass = 0;
  let fail = 0;
  let skipped = 0;
  let schemaFail = parseErrors.length + schemaIssues.length;

  const scoringEnabled =
    Object.keys(answers).length > 0 ||
    rows.some((r) => typeof r.case.candidate === "string");

  for (const { lineNo, case: c } of rows) {
    const bucket = typeof c.bucket === "string" ? c.bucket : "(invalid)";
    if (!byBucket.has(bucket)) {
      byBucket.set(bucket, { total: 0, pass: 0, fail: 0, skipped: 0 });
    }
    const b = byBucket.get(bucket);
    b.total += 1;

    const schemaBad = validateSchema(c, lineNo).length > 0;
    if (schemaBad || (typeof c.id === "string" && duplicateIdIssues.some((d) => d.includes(`"${c.id}"`)))) {
      results.push({
        id: c.id ?? `line-${lineNo}`,
        status: "fail",
        reason: "schema",
      });
      fail += 1;
      b.fail += 1;
      continue;
    }

    if (!hasExpectations(c)) {
      results.push({
        id: c.id,
        status: "skipped",
        reason: "no expectations (structural ok)",
      });
      skipped += 1;
      b.skipped += 1;
      continue;
    }

    const output = resolveOutput(c, answers);
    if (output === null) {
      results.push({
        id: c.id,
        status: "skipped",
        reason: "no candidate / answers",
      });
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
  const modeLabel = scoringEnabled
    ? goldensAuto
      ? "score via goldens.json (+ structural)"
      : "score (+ structural)"
    : "structural";
  console.log(`mode: ${modeLabel}`);
  if (answersSource) console.log(`answers: ${answersSource}`);
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

  const scoredFails = results.filter(
    (r) => r.status === "fail" && r.reason !== "schema"
  );
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

  console.log("Trigger queries:");
  const trigger = validateTriggerQueries(TRIGGER_PATH);
  console.log(
    `  total=${trigger.total} should_trigger=true:${trigger.trueCount} false:${trigger.falseCount}`
  );
  if (trigger.issues.length) {
    for (const issue of trigger.issues) console.log(`  FAIL ${issue}`);
  } else {
    console.log("  ok schema");
  }
  console.log("");

  console.log("Bakeoff items:");
  const bakeoff = validateBakeoffItems(BAKEOFF_PATH);
  console.log(`  total=${bakeoff.total}`);
  if (bakeoff.issues.length) {
    for (const issue of bakeoff.issues) console.log(`  FAIL ${issue}`);
  } else {
    console.log("  ok schema (id+input, unique ids)");
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
      if (lr.stderr)
        console.log(`       ${lr.stderr.split(/\r?\n/).join("\n       ")}`);
      if (lr.stdout)
        console.log(`       ${lr.stdout.split(/\r?\n/).join("\n       ")}`);
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
  console.log(`  trigger schema issues: ${trigger.issues.length}`);
  console.log(`  bakeoff schema issues: ${bakeoff.issues.length}`);
  console.log(`  lint example failures: ${lintFail}`);
  console.log(`  buckets: ${buckets.length}`);

  const exitFail =
    fail > 0 ||
    schemaFail > 0 ||
    lintFail > 0 ||
    parseErrors.length > 0 ||
    trigger.issues.length > 0 ||
    bakeoff.issues.length > 0;
  process.exit(exitFail ? 1 : 0);
}

main();
