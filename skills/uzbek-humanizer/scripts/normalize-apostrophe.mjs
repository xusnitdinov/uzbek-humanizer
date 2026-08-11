#!/usr/bin/env node
/**
 * Normalize Uzbek Latin apostrophe-like characters.
 * oʻ/gʻ → U+02BB (ʻ)
 * tutuq → U+02BC (ʼ)
 *
 * Digraphs are protected before tutuq passes so `toʻgʻri` never becomes `toʼgʻri`.
 * English contractions and common bilingual tx()/locale EN segments are protected.
 *
 * Usage:
 *   node normalize-apostrophe.mjs <file>
 *   node normalize-apostrophe.mjs --check <file>
 *   node normalize-apostrophe.mjs --dry-run <file>
 *   node normalize-apostrophe.mjs --stdout <file>
 *   node normalize-apostrophe.mjs --self-test
 */
import fs from "node:fs";
import { fileURLToPath } from "node:url";

export const TURNED = "\u02BB"; // ʻ
export const TUTUQ = "\u02BC"; // ʼ
const MARK = `['\`\u2018\u2019\u02BB\u02BC]`;
const DIGRAPH_PH = "\u0000DG\u0000";

/** EN contractions / names we must not rewrite (no /g - rebuild when testing) */
const EN_SKIP_SRC =
  String.raw`\b(?:[Ii]'m|[Ww]e'd|[Yy]ou're|[Tt]hey're|[Ww]ho's|[Ww]hat's|[Ii]t's|[Tt]hat's|[Tt]here's|[Hh]ere's|[Ll]et's|[Ww]on't|[Cc]an't|[Ii]sn't|[Aa]ren't|[Hh]aven't|[Hh]asn't|[Dd]oesn't|[Dd]idn't|[Ss]houldn't|[Ww]ouldn't|[Cc]ouldn't|[Oo]'[Bb]rien|[Oo]'[Cc]onnor)\b`;

/**
 * Protect bilingual / English segments that must not be rewritten.
 * Order: stash whole EN segments first, then leftover contractions.
 */
function protectForeign(text) {
  const saved = [];
  const stash = (m) => {
    saved.push(m);
    return `\u0000P${saved.length - 1}\u0000`;
  };

  let out = text;

  // 0) Protect zones that should never be normalized
  out = out.replace(/```[\s\S]*?```/g, stash); // fenced code
  out = out.replace(/`[^`\n]+`/g, stash); // inline code
  out = out.replace(/\bhttps?:\/\/[^\s)]+/gi, stash); // URLs
  out = out.replace(/\b[a-z][a-z0-9+.-]*:\/\/[^\s)]+/gi, stash); // scheme URLs
  out = out.replace(/\{[A-Za-z0-9_.:-]+\}/g, stash); // placeholders {count}
  out = out.replace(/%\([A-Za-z0-9_.:-]+\)s/g, stash); // python-style placeholder
  out = out.replace(/%[sdif]/g, stash); // printf placeholders

  // 1) Protect 2nd+ quoted args inside tx(…) / t(…) / i18n.t(…)
  out = out.replace(/\b(?:tx|t|i18n\.t)\(([^)]*)\)/g, (full, inner) => {
    const argRe = /(["'`])((?:\\.|(?!\1).)*)\1/g;
    const pieces = [];
    let am;
    while ((am = argRe.exec(inner))) {
      pieces.push({
        start: am.index,
        end: am.index + am[0].length,
        raw: am[0],
      });
    }
    if (pieces.length < 2) return full;
    let rebuilt = inner;
    for (let p = pieces.length - 1; p >= 1; p--) {
      const piece = pieces[p];
      rebuilt =
        rebuilt.slice(0, piece.start) +
        stash(piece.raw) +
        rebuilt.slice(piece.end);
    }
    return full.slice(0, full.indexOf("(") + 1) + rebuilt + ")";
  });

  // 2) JSON-ish "en" / "ru" values
  out = out.replace(
    /(["'])(?:en|en-US|en-GB|ru|ru-RU)\1\s*:\s*(["'])(?:\\.|(?!\2).)*\2/gi,
    stash
  );

  // 3) Remaining EN contractions in Uzbek/host text
  out = out.replace(new RegExp(EN_SKIP_SRC, "gi"), stash);

  return { out, saved };
}

function restorePlaceholders(text, saved) {
  return text.replace(/\u0000P(\d+)\u0000/g, (_, i) => saved[Number(i)]);
}

function protectDigraphs(text) {
  const saved = [];
  const out = text.replace(new RegExp(`([OoGg])${TURNED}`, "g"), (m) => {
    saved.push(m);
    return `${DIGRAPH_PH}${saved.length - 1}${DIGRAPH_PH}`;
  });
  return { out, saved };
}

function restoreDigraphs(text, saved) {
  return text.replace(
    new RegExp(`${DIGRAPH_PH}(\\d+)${DIGRAPH_PH}`, "g"),
    (_, i) => saved[Number(i)]
  );
}

/**
 * @param {string} text
 * @returns {string}
 */
export function normalize(text) {
  const { out: foreignOut, saved: foreignSaved } = protectForeign(text);
  let out = foreignOut;

  // 1) o'/g' digraphs → TURNED (ASCII, curly, or mixed)
  out = out.replace(new RegExp(`([OoGg])${MARK}`, "g"), `$1${TURNED}`);

  // 2) Freeze digraphs so tutuq never rewrites oʻ / gʻ
  const { out: digOut, saved: digSaved } = protectDigraphs(out);
  out = digOut;

  // 3) tutuq: vowel + mark + letter (ma'no, a'lo) — vowels only, never TURNED-as-vowel
  out = out.replace(
    new RegExp(`([AaEeIiOoUu])${MARK}([A-Za-zÀ-ÿ${TURNED}${TUTUQ}])`, "g"),
    (_, a, b) => `${a}${TUTUQ}${b}`
  );

  // 4) consonant tutuq sites: san'at, mas'ul, qat'iy, jam'i, …
  out = out.replace(
    new RegExp(
      `\\b([Ss]an|[Mm]as|[Qq]at|[Jj]am|[Aa]'?z|[Mm]ehn|[Ii]nsho)${MARK}([A-Za-z${TURNED}${TUTUQ}])`,
      "g"
    ),
    (_, stem, rest) => `${stem.replace(/'/g, "")}${TUTUQ}${rest}`
  );

  // 5) remaining consonant + mark + vowel
  out = out.replace(
    new RegExp(
      `([NnMmLlRrTtDdSsZzKkQqGgHhPpBbVvYyJjXxCcFfWw])${MARK}([AaEeIiOoUu])`,
      "g"
    ),
    (_, c, v) => `${c}${TUTUQ}${v}`
  );

  out = restoreDigraphs(out, digSaved);
  out = restorePlaceholders(out, foreignSaved);
  return out;
}

export function lintReport(text) {
  const issues = [];
  const residual = text.replace(new RegExp(EN_SKIP_SRC, "gi"), "");
  if (/[A-Za-z]'[A-Za-z]/.test(residual)) {
    issues.push("ASCII apostrophe ' found in a word");
  }
  if (/[`\u2018\u2019]/.test(text)) issues.push("curly/grave quote mark found");
  // Digraph must stay TURNED, not TUTUQ
  if (/[OoGg]\u02BC/.test(text)) {
    issues.push("o/g digraph uses tutuq ʼ — should be ʻ (U+02BB)");
  }
  return issues;
}

function selfTest() {
  const cases = [
    ["to'g'ri", `to${TURNED}g${TURNED}ri`],
    [`to${TURNED}g${TURNED}ri`, `to${TURNED}g${TURNED}ri`],
    ["do'stim", `do${TURNED}stim`],
    [`do${TURNED}stim`, `do${TURNED}stim`],
    ["ma'no", `ma${TUTUQ}no`],
    [`ma${TUTUQ}no`, `ma${TUTUQ}no`],
    ["va'da", `va${TUTUQ}da`],
    ["Who's there?", "Who's there?"],
    ["I'm fine", "I'm fine"],
    ["What's up", "What's up"],
    [
      `tx("Guruh ishi chiqmadi", "Group project blows up", "Группа")`,
      `tx("Guruh ishi chiqmadi", "Group project blows up", "Группа")`,
    ],
    [
      `tx("to'g'ri", "Who's right?", "ok")`,
      `tx("to${TURNED}g${TURNED}ri", "Who's right?", "ok")`,
    ],
    [
      `{"uz":"to'g'ri","en":"Who's there?"}`,
      `{"uz":"to${TURNED}g${TURNED}ri","en":"Who's there?"}`,
    ],
  ];
  let failed = 0;
  for (const [input, expect] of cases) {
    const got = normalize(input);
    if (got !== expect) {
      console.error("FAIL", JSON.stringify(input), "→", JSON.stringify(got), "want", JSON.stringify(expect));
      failed += 1;
    }
  }
  // Extra: never produce oʼ digraph
  const bad = normalize("to'g'ri do'st");
  if (/[OoGg]\u02BC/.test(bad)) {
    console.error("FAIL digraph used tutuq:", bad);
    failed += 1;
  }
  if (failed) {
    console.error(`self-test: ${failed} failed`);
    process.exit(2);
  }
  console.log(`self-test: ${cases.length + 1} ok`);
}

function usage() {
  console.error(
    "Usage: node normalize-apostrophe.mjs [--check|--dry-run|--stdout|--self-test] [<file>]"
  );
}

const SCRIPT_PATH = fileURLToPath(import.meta.url);
const isMain =
  process.argv[1] &&
  fs.existsSync(process.argv[1]) &&
  fs.realpathSync(process.argv[1]) === fs.realpathSync(SCRIPT_PATH);

if (isMain) {
  const args = process.argv.slice(2);
  if (args.includes("--self-test")) {
    selfTest();
    process.exit(0);
  }

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
}
