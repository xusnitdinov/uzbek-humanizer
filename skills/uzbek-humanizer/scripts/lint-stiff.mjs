#!/usr/bin/env node
/**
 * Stiff-copy / AI-tell linter for Uzbek Latin drafts.
 *
 * Usage:
 *   node lint-stiff.mjs <file>
 *   node lint-stiff.mjs --stdin < text.txt
 * Exit 0 clean, 2 findings, 1 usage/io error.
 */
import fs from "node:fs";

/** Back vowels that should take -lar not -ler */
const BACK = "aouoʻAOOUÓ";

const RULES = [
  {
    id: "ascii-o-g",
    re: /[OoGg]['\u2018\u2019]/,
    tip: "Use oʻ/gʻ with ʻ (U+02BB), not ASCII/curly quotes",
  },
  {
    id: "ascii-apostrophe-any",
    re: /[A-Za-z]['\u2018\u2019][A-Za-z]/,
    tip: "Likely bad apostrophe in a word - check oʻ/gʻ/ʼ",
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
    id: "hard-mode",
    re: /\bhard\s+mode\b/i,
    tip: "Fake EN cool - ban",
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
  if (process.stdin.isTTY) {
    console.error("No piped input on stdin (TTY). Pipe text or pass a file path.");
    process.exit(1);
  }
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
