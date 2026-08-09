#!/usr/bin/env node
/**
 * Stiff-copy / AI-tell linter for Uzbek Latin drafts.
 * Flags orthography spam, EN calques, register mix hints, and textbook mush.
 *
 * Usage:
 *   node lint-stiff.mjs <file>
 *   node lint-stiff.mjs --stdin < text.txt
 * Exit 0 clean, 2 findings, 1 usage/io error.
 */
import fs from "node:fs";

const RULES = [
  {
    id: "ascii-apostrophe",
    re: /[OoGg]'|[OoGg]'|[Tt]o'[gG]|[Gg]'[aA]/,
    tip: "Use oʻ/gʻ with ʻ (U+02BB), not ASCII '",
  },
  {
    id: "ascii-apostrophe-any",
    re: /[A-Za-z]'[A-Za-z]/,
    tip: "Likely ASCII apostrophe in a word - check oʻ/gʻ/ʼ",
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
  },
  {
    id: "en-vibe",
    re: /\bvibe\b/i,
    tip: "Fake EN cool - ban",
  },
  {
    id: "en-portladi",
    re: /\bportladi\b/i,
    tip: "Fake EN cool - ban",
  },
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
  {
    id: "update-qil",
    re: /\bupdate\s+qil/i,
    tip: "Prefer yangilang",
  },
  {
    id: "haqiqatan-ham",
    re: /\bhaqiqatan\s+ham\b/i,
    tip: "Stiff AI filler - soften or cut",
  },
  {
    id: "men-yoqtiraman",
    re: /\bmen\b.{0,40}\byoqtiraman\b/i,
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
    tip: "Broken morphology - berdim / berdim (+ dative on noun)",
  },
  {
    id: "morph-ler",
    re: /\b\w+ler(imiz|ingiz|i)?\b/i,
    tip: "Possible vowel-harmony fail (-lar not -ler for back vowels)",
  },
  {
    id: "place-tashkent",
    re: /\bTashkent\b/,
    tip: "In UZ text use Toshkent",
  },
  {
    id: "place-samarkand",
    re: /\bSamarkand\b/,
    tip: "In UZ text use Samarqand",
  },
  {
    id: "register-mix-hint",
    re: /\b(Siz|Hurmatli)\b[\s\S]{0,80}\b(yaxshisan|kelasan|qilasan)\b/i,
    tip: "Possible Siz + -san mix",
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

function lint(text) {
  const findings = [];
  for (const rule of RULES) {
    const m = text.match(rule.re);
    if (m) findings.push({ id: rule.id, match: m[0], tip: rule.tip });
  }
  return findings;
}

function usage() {
  console.error("Usage: node lint-stiff.mjs <file> | node lint-stiff.mjs --stdin");
}

const arg = process.argv[2];
if (!arg) {
  usage();
  process.exit(1);
}

let text;
if (arg === "--stdin") {
  text = fs.readFileSync(0, "utf8");
} else {
  if (!fs.existsSync(arg)) {
    console.error(`File not found: ${arg}`);
    process.exit(1);
  }
  text = fs.readFileSync(arg, "utf8");
}

const findings = lint(text);
if (!findings.length) {
  console.log(arg === "--stdin" ? "Clean: stdin" : `Clean: ${arg}`);
  process.exit(0);
}

console.error(`Stiff/AI-tell findings (${findings.length}):`);
for (const f of findings) {
  console.error(`- [${f.id}] "${f.match}" → ${f.tip}`);
}
process.exit(2);

export { lint, RULES };
