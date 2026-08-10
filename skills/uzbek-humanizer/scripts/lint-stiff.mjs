#!/usr/bin/env node
/**
 * Stiff-copy / AI-tell linter for Uzbek Latin drafts.
 *
 * By default extracts Uzbek-facing text so EN locale / tx() EN args do not
 * false-positive. Product/quiz UI: flag -san forms unless --allow-sen.
 *
 * Usage:
 *   node lint-stiff.mjs <file>
 *   node lint-stiff.mjs --matn-only <file>
 *   node lint-stiff.mjs --whole-file <file>
 *   node lint-stiff.mjs --allow-sen <file>
 *   node lint-stiff.mjs --stdin < text.txt
 */
import fs from "node:fs";
import path from "node:path";
import { extractUzbekForLint } from "./extract-uzbek.mjs";

/** Back vowels that should take -lar not -ler */
const BACK = "aouoʻAOOUÓ";

const EN_APOS =
  /\b(?:[Ii]'m|[Ww]e'd|[Yy]ou're|[Tt]hey're|[Ww]ho's|[Ww]hat's|[Ii]t's|[Tt]hat's|[Ww]on't|[Cc]an't|[Ii]sn't|[Aa]ren't|[Hh]aven't|[Hh]asn't|[Dd]oesn't|[Dd]idn't|[Ss]houldn't|[Ww]ouldn't|[Cc]ouldn't|[Oo]'[Bb]rien|[Oo]'[Cc]onnor)\b/;

const SHIP_META =
  /\b(?:before|after|to|will|can|should|must|don't|do not|does not|did not|when you|we|you)\s+ship\b/i;

const RULES = [
  {
    id: "ascii-o-g",
    re: /[OoGg]['\u2018\u2019]/,
    tip: "Use oʻ/gʻ with ʻ (U+02BB), not ASCII/curly quotes",
  },
  {
    id: "digraph-tutuq",
    re: /[OoGg]\u02BC/,
    tip: "o/g digraph used tutuq ʼ - must be ʻ (U+02BB)",
  },
  {
    id: "ascii-apostrophe-any",
    re: /[A-Za-z]['\u2018\u2019][A-Za-z]/,
    tip: "Likely bad apostrophe in a word - check oʻ/gʻ/ʼ",
    skip: (text) => {
      const residual = text.replace(new RegExp(EN_APOS.source, "gi"), "");
      return !/[A-Za-z]['\u2018\u2019][A-Za-z]/.test(residual);
    },
  },
  {
    id: "en-select",
    re: /\bselect\s+qil/i,
    tip: "Calque - prefer belgilang / tanlang",
  },
  {
    id: "en-ship",
    re: /\bship\b/i,
    tip: "Fake EN cool - ban",
    skip: (text, m) => {
      const i = text.search(/\bship\b/i);
      const window = text.slice(Math.max(0, i - 24), i + m.length);
      return SHIP_META.test(window);
    },
  },
  {
    id: "en-vibe",
    re: /\bvibe\b/i,
    tip: "Fake EN cool - ban",
    skip: (text, m) => {
      const i = text.search(/\bvibe\b/i);
      const window = text.slice(Math.max(0, i - 20), i + m.length + 8);
      return /\b(?:telegram|akkurat|teaching|mode)\s+vibe\b/i.test(window);
    },
  },
  { id: "en-portladi", re: /\bportladi\b/i, tip: "Fake EN cool - ban" },
  {
    id: "en-teammate",
    re: /\bteammate\b/i,
    tip: "Use doʻstim / hamkasb / jamoa aʼzosi",
  },
  {
    id: "systems-brain",
    re: /\bsystems\s+brain\b/i,
    tip: "AI cosplay phrase - rewrite",
  },
  { id: "hard-mode", re: /\bhard\s+mode\b/i, tip: "Fake EN cool - ban" },
  {
    id: "check-qil",
    re: /\bcheck\s+qil/i,
    tip: "Prefer tekshiring / koʻrib chiqing",
  },
  {
    id: "support-qil",
    re: /\bsupport\s+qil/i,
    tip: "Prefer yordam bering / qoʻllab-quvvatlang",
  },
  { id: "update-qil", re: /\bupdate\s+qil/i, tip: "Prefer yangilang" },
  {
    id: "haqiqatan-ham",
    re: /\bhaqiqatan\s+ham\b/i,
    tip: "Stiff AI filler - soften or cut",
  },
  {
    id: "hurmatli-foydalanuvchi",
    re: /\bHurmatli\s+foydalanuvchi\b/i,
    tip: "Brochure AI opener - cut for product marketing",
  },
  {
    id: "innovatsion",
    re: /\b(innovatsion\s+yechim|imkoniyatlar\s+olami|maksimal\s+darajada)\b/i,
    tip: "Hype brochure stack - rewrite plain",
  },
  {
    id: "men-yoqtiraman",
    re: /\bMen\s+(?:haqiqatan\s+ham\s+)?(?:bu\s+)?\w{0,20}\s*yoqtiraman\b/i,
    tip: "Often stiff - prefer menga yoqadi / yoqdi",
  },
  {
    id: "qarshi-emasmisiz",
    re: /\bqarshi\s+emasmisiz\b/i,
    tip: "Literal EN would-you-mind - prefer soft imperative + Iltimos",
  },
  {
    id: "morph-berdimga",
    re: /\bberdimga\b/i,
    tip: "Broken morphology - berdim (+ dative on noun)",
  },
  {
    id: "morph-ler-back",
    re: new RegExp(
      `\\b[A-Za-z${"ʻʼ"}]*[${BACK}][A-Za-z${"ʻʼ"}]*ler(?:imiz|ingiz|i)?\\b`,
      "i"
    ),
    tip: "Back-vowel stem with -ler - prefer -lar (e.g. kitoblarimiz)",
  },
  {
    id: "place-en",
    re: /\b(Tashkent|Samarkand|Bukhara|Fergana|Andijan|Khiva|Kokand|Termez|Urgench)\b/i,
    tip: "EN place name in UZ text - use Toshkent/Samarqand/Buxoro/…",
  },
  {
    id: "register-mix-hint",
    re: /\b(Siz|Hurmatli)\b[\s\S]{0,80}\b\w+(?:san|asan)\b/i,
    tip: "Possible Siz + -san mix",
  },
  {
    id: "product-sen-asan",
    re: /\b(?:qilasan|kirasan|yozasan|oʻqisan|o'qisan|koʻrasan|ko'rasan|borasan|kelasan|turasan|yurasan|berasan|olasan)\b/i,
    tip: "Product/UI/quiz = Siz only - use qilasiz / Kirasiz (--allow-sen for youth)",
    productOnly: true,
  },
  {
    id: "product-bare-kel",
    re: /(^|[.!?]\s+)(Kel|Yoz|Qil|Bor|Tur|Ber)\b(?!\w)/,
    tip: "Bare sen-imperative on product - prefer Keling / Yozing",
    productOnly: true,
  },
  {
    id: "soft-chiqmadi-group",
    re: /\b(?:Guruh|Loyiha)\s+ishi\s+chiqmadi\b/i,
    tip: "Situation-natural: Guruh ishi oʻxshamadi (not chiqmadi)",
  },
  {
    id: "rusizm-default",
    re: /\b(karoche|normalni|kruto|chotki)\b/i,
    tip: "RU discourse - only in youth mode when asked",
  },
  {
    id: "chelakni-tepdi",
    re: /\bchelakni\s+tepdi\b/i,
    tip: "Literal idiom calque - say the real meaning",
  },
];

function extractMatn(text) {
  const blocks = [];
  const parts = text.split(/^##\s+/m);
  for (const part of parts) {
    if (/^Matn\b/i.test(part.trim()) || /^Matn\b/i.test(part)) {
      blocks.push(part.replace(/^Matn[^\n]*\n?/i, ""));
    }
  }
  return blocks.length ? blocks.join("\n") : text;
}

function lint(text, { allowSen = false } = {}) {
  const findings = [];
  for (const rule of RULES) {
    if (rule.productOnly && allowSen) continue;
    const m = text.match(rule.re);
    if (!m) continue;
    if (rule.skip && rule.skip(text, m[0])) continue;
    findings.push({ id: rule.id, match: m[0], tip: rule.tip });
  }
  return findings;
}

function usage() {
  console.error(
    "Usage: node lint-stiff.mjs [--matn-only|--whole-file|--allow-sen] <file> | --stdin"
  );
}

const args = process.argv.slice(2);
let matnOnly = false;
let wholeFile = false;
let allowSen = false;
let stdin = false;
const files = [];
for (const a of args) {
  if (a === "--matn-only") matnOnly = true;
  else if (a === "--whole-file") wholeFile = true;
  else if (a === "--allow-sen") allowSen = true;
  else if (a === "--stdin") stdin = true;
  else if (a.startsWith("-")) {
    usage();
    process.exit(1);
  } else files.push(a);
}

let text;
let label;
if (stdin) {
  if (process.stdin.isTTY) {
    console.error("No piped input on stdin (TTY). Pipe text or pass a file path.");
    process.exit(1);
  }
  text = fs.readFileSync(0, "utf8");
  label = "stdin";
} else {
  const arg = files[0];
  if (!arg) {
    usage();
    process.exit(1);
  }
  if (!fs.existsSync(arg)) {
    console.error(`File not found: ${arg}`);
    process.exit(1);
  }
  text = fs.readFileSync(arg, "utf8");
  label = arg;
  if (!matnOnly && !wholeFile) {
    const { text: uz, skipped } = extractUzbekForLint(text, {
      filePath: path.resolve(arg),
    });
    if (skipped === "en-locale-path") {
      console.log(`Skip EN locale path: ${arg}`);
      process.exit(0);
    }
    text = uz;
  }
}

if (matnOnly) text = extractMatn(text);

const findings = lint(text, { allowSen });
if (!findings.length) {
  console.log(`Clean: ${label}`);
  process.exit(0);
}

console.error(`Stiff/AI-tell findings (${findings.length}):`);
for (const f of findings) {
  console.error(`- [${f.id}] "${f.match}" → ${f.tip}`);
}
process.exit(2);
