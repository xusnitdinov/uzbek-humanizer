#!/usr/bin/env node
/**
 * Normalize Uzbek Latin apostrophe-like characters.
 * oʻ/gʻ → U+02BB (ʻ)
 * tutuq → U+02BC (ʼ)
 *
 * Digraphs are protected before tutuq passes so `toʻgʻri` never becomes `toʼgʻri`.
 * English contractions and common bilingual tx()/locale EN segments are protected.
 * Inbound 2026-reform letters (ö/õ/ó/ò/ō, ğ, ş, ç) map to the current alphabet.
 * This script never emits ö/ğ/ş/ç. Outbound reform is explicit-request only.
 * Brand and ALL-CAPS tokens plus a case suffix stay tutuq (`Goʼda`, `PUBGʼga`),
 * not oʻ/gʻ. A real digraph (`toʻgʻri`, `TOʻGʻRI`) is unchanged.
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
const MARK = `['\`\u00B4\u2018\u2019\u02BB\u02BC]`;
const DIGRAPH_PH = "\u0000DG\u0000";
/** Longer suffixes first so `dagi` is not eaten as `da`. */
const CASE_SUFFIX =
  "dagi|dan|dek|day|ning|ni|lari|larini|larni|lar|cha|ga|ka|qa|mi|da";
/**
 * Brands whose final letter must not become oʻ/gʻ before a suffix.
 * Brief P0: Go, PUBG, Uzum. ALL-CAPS tokens are handled separately.
 */
const BRAND_SRC = "Go|PUBG|Uzum";

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

/**
 * Inbound only. ö õ ó ò ō → oʻ, ğ → gʻ, ş → sh, ç → ch.
 * Does not modernize output to the 2026 letters.
 */
function mapReformInbound(text) {
  let out = text;
  out = out.replace(/[ÖÕÓÒŌ]/g, `O${TURNED}`);
  out = out.replace(/[öõóòō]/g, `o${TURNED}`);
  out = out.replace(/Ğ/g, `G${TURNED}`);
  out = out.replace(/ğ/g, `g${TURNED}`);
  out = out.replace(/Ş/g, (m, i, s) => (/[A-Z]/.test(s[i + 1] || "") ? "SH" : "Sh"));
  out = out.replace(/ş/g, "sh");
  out = out.replace(/Ç/g, (m, i, s) => (/[A-Z]/.test(s[i + 1] || "") ? "CH" : "Ch"));
  out = out.replace(/ç/g, "ch");
  return out;
}

/**
 * Apostrophe before a suffix on a brand or ALL-CAPS token is tutuq, not oʻ/gʻ.
 * Lookbehind keeps the g in `to'g'ri` (a mark is not a letter, so \\b would match).
 * Known suffix list keeps `TO'G'RI` a digraph: the next piece is not `ga`/`da`.
 */
function protectBrandSuffixes(text, saved) {
  const stash = (m) => {
    saved.push(m);
    return `\u0000P${saved.length - 1}\u0000`;
  };
  const boundary = `(?<![A-Za-z\\u00B4'\`\u2018\u2019${TURNED}${TUTUQ}])`;
  let out = text.replace(
    new RegExp(`${boundary}(${BRAND_SRC})${MARK}(${CASE_SUFFIX})\\b`, "gi"),
    (_, brand, suf) => stash(`${brand}${TUTUQ}${suf}`)
  );
  out = out.replace(
    new RegExp(`${boundary}([A-Z]{2,})${MARK}(${CASE_SUFFIX})\\b`, "g"),
    (_, token, suf) => stash(`${token}${TUTUQ}${suf}`)
  );
  return out;
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
  let out = mapReformInbound(foreignOut);
  out = protectBrandSuffixes(out, foreignSaved);

  // 1) o'/g' digraphs → TURNED (ASCII, curly, acute, or mixed)
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

  // 6) leftover non-digraph mark before a case suffix: tool'da, edittools'da.
  // TURNED is excluded so toʻda stays a digraph.
  const RAW_MARK = `['\`\u00B4\u2018\u2019${TUTUQ}]`;
  out = out.replace(
    new RegExp(`([A-Za-z])${RAW_MARK}(${CASE_SUFFIX})\\b`, "g"),
    (_, stem, suf) => `${stem}${TUTUQ}${suf}`
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
    ["o\u00B4g\u00B4ri", `o${TURNED}g${TURNED}ri`],
    ["bo\u02BClmayapti", `bo${TURNED}lmayapti`],
    ["q\u00F6\u015Filaman", `qo${TURNED}shilaman`],
    ["\u00D5ZIDAN", `O${TURNED}ZIDAN`],
    ["Payme Go'da", `Payme Go${TUTUQ}da`],
    ["PUBG'ga", `PUBG${TUTUQ}ga`],
    ["Uzum'da", `Uzum${TUTUQ}da`],
    ["TO'G'RI", `TO${TURNED}G${TURNED}RI`],
    ["tool'da", `tool${TUTUQ}da`],
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
  const reform = normalize("To\u011Fri q\u00F6\u015Filaman \u00D5ZIDAN");
  if (/[ööğğşçõóòōÖĞŞÇÕÓÒŌ]/.test(reform)) {
    console.error("FAIL reform letters left in output:", reform);
    failed += 1;
  }
  const brand = normalize("Payme Go'da PUBG'ga");
  if (/Go\u02BB|G\u02BBga/.test(brand)) {
    console.error("FAIL brand suffix became a digraph:", brand);
    failed += 1;
  }
  if (failed) {
    console.error(`self-test: ${failed} failed`);
    process.exit(2);
  }
  console.log(`self-test: ${cases.length + 3} ok`);
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
