---
name: uzbek-humanizer
description: >-
  Use when writing, rewriting, reviewing, or localizing Uzbek Latin copy
  (UI, product, quiz, marketing, chat, bank/OTP, consent/ToS, symptom/health).
  Fixes AI-sounding Uzbek, English calques, morphology, oʻ/gʻ orthography,
  and Siz/sen register. Trigger for o'zbekcha, o‘zbek, Uzbek copy, humanize
  Uzbek, matnni tabiiylashtirish, uzbek-humanizer, bank OTP SMS, rozilik /
  shartlar / ToS, alomat / sogʻliq / symptom, kirill / Cyrillic, DTM / quiz,
  Telegram / yoshlarcha, even if the user does not say the skill name.
license: MIT
metadata:
  author: xusnitdinov
  version: "1.3.2"
---

# uzbek-humanizer

Make AI-written Uzbek sound like a real person wrote it - clear spoken Latin product/student Uzbek by default.

Honest claim: much more natural. Heavy slang, invented idioms, legal/medical = draft + native review.

## When to use

- Write or rewrite Uzbek Latin UI / product / quiz / marketing / assistant replies
- Fix stiff MT or LLM Uzbek (calques, wrong suffixes, missing oʻ/gʻ)
- Localize EN (or other) into natural Uzbek
- Review existing Uzbek copy for AI tells
- Bank / OTP / SMS security copy
- Legal soft UI (consent, ToS, disclaimers) - draft + native review
- Medical soft UI (appointment, symptom prompts) - draft; never diagnose
- Cyrillic output when the user explicitly asks for кирилл / Cyrillic

## When not to use

- User wants Russian target copy (out of scope)
- User wants Cyrillic-only output unless they ask
- Pure grammar-theory essay with no rewrite task
- User style guide explicitly overrides this skill - follow the user

## Router

| Scenario | Trigger examples | Load |
|---|---|---|
| **Site / app i18n (slash)** | `/uzbek-humanize`, add Uzbek to Next/Vite, `en.json` → `uz.json`, language switcher | Prefer sister skill `uzbek-humanize` when installed; else this Router + `ui-glossary` / `microcopy` / `legal-copy` |
| Bad AI rewrite | stiff calques, EN order, broken suffixes | `references/banned-calques.md` + `references/before-after.md` + `references/ai-patterns.md` |
| Marketing / landing | warm human tone, long paragraphs | `references/register.md` + `references/voice.md` + `references/marketing-long.md` + `examples/marketing.md` |
| Product UI | buttons, errors, empty states | `references/ui-glossary.md` + `references/microcopy.md` + `examples/product-ui.md` |
| Quiz / test | DTM stems, "belgilang" | `references/quiz-glossary.md` + `examples/quiz.md` |
| Youth chat | slang, Telegram vibe, yoshlarcha | `references/youth-slang.md` (draft label; only when asked) |
| Bank / OTP / SMS | security copy, OTP, SMS | `references/bank-sms.md` + `references/politeness.md` |
| Legal soft UI | ToS, consent, disclaimers | `references/legal-copy.md` (draft label) |
| Medical soft UI | appointment, symptom prompts | `references/medical-copy.md` (draft label; never diagnose) |
| Cyrillic ask | кирилл, Cyrillic output | `references/cyrillic.md` (Latin default otherwise) |
| Orthography mess | apostrophes, oʻ/gʻ | `references/orthography.md` + run normalize script |
| Literal idioms / MT mush | idiom calques, EN mush | `references/mt-failures.md` + `references/phraseology-rules.md` |
| Stiff verbs / aspect | aspect, modality | `references/aspect-modality.md` + `references/auxiliaries.md` |
| Spoken glue / particles | particles, voice | `references/particles.md` + `references/voice.md` |
| Siz/sen / soft replies | address, politeness | `references/politeness.md` |
| Money / dates / phones | soʻm, dates, +998 | `references/formatting.md` |
| RU discourse / hybrids | rusizmlar, false friends | `references/rusizmlar.md` + `references/false-friends.md` |
| Morphology weirdness | cases, plurals, harmony | `references/morphology-checks.md` |
| Worked demos | examples beyond the row above | `examples/` |
| Sources | citations / provenance | `references/sources.md` |

## Workflow

1. **Detect task** - write / rewrite / review / localize. Default register: spoken clear product/student Latin Uzbek. If the user ran `/uzbek-humanize` or asked to wire site i18n, hand off to sister `uzbek-humanize` when present.
2. **Respect user style** - if they give voice/glossary, it wins.
3. **Load refs** - use the Router table. One hop only.
4. **Rewrite** - natural UZ, not literal EN. Prefer real verbs and light auxiliaries over calques.
5. **Validate** - run scripts when available:
   - `node scripts/normalize-apostrophe.mjs <file>`
   - `node scripts/lint-banned.mjs <file>`
   - `node scripts/lint-stiff.mjs <file>` (AI-tell / stiff-copy patterns)
6. **Fix lint findings then re-lint before final** - do not ship until lints are clean or residual issues are labeled in Holat.
7. **Holat gate** - before output, if legal / medical / youth: set `Holat` to `draft/native_review_required`.
8. **Checklist** - complete the post-rewrite checklist.
9. **Output** - use the template. Do not overwrite project files unless the user asks (site i18n file edits belong to `/uzbek-humanize`).

## Gotchas

1. Do not mix apostrophe characters - oʻ/gʻ use `ʻ` (U+02BB); tutuq uses `ʼ` (U+02BC). Ban ASCII `'` and `` ` `` in skill output.
2. Do not paste EN cool slang into Uzbek (`ship`, `vibe`, `portladi`, `teammate`, `Systems brain`).
3. Do not literalize idioms (`kick the bucket` ≠ `chelakni tepdi`).
4. Do not mix `Siz` with `-san` / bare `Kel` on the same surface.
5. Do not invent idioms or maqollar.
6. Prefer auxiliaries (`yopib qoʻying`) and light particles over stiff textbook calques.
7. Do not over-use `bir` as a fake English article.
8. Place names in UZ text: `Toshkent`, `Samarqand`, `Buxoro`, `Fargʻona` - not Tashkent/Samarkand.
9. Review ≠ overwrite files unless asked.
10. Heavy slang / legal / medical = `draft/native_review_required`.
11. Do not inject `karoche` / `normalni` / `kruto` to "sound local" unless youth mode was requested.
12. Check morphology before shipping - suffix order and vowel harmony (`kitoblarimiz` not `kitoblerimiz`).
13. Never diagnose or prescribe - medical soft UI is prompts and navigation only.
14. Never invent binding legal fine print or statutes - legal soft UI stays draft.
15. Cyrillic only when asked - Latin is the default.
16. Invented bank / OTP / SMS copy = draft (`draft/native_review_required`).

## Post-rewrite checklist

- [ ] Orthography: oʻ/gʻ/ʼ correct; no ASCII apostrophe spam
- [ ] Morphology: no broken cases/plurals/possessives
- [ ] Syntax: natural SOV; no EN word-order mush
- [ ] Lexicon: no banned EN calques; idioms remapped or plain; no invented maqol
- [ ] Pragmatics: one address lane (Siz or sen); register matches task
- [ ] Formatting: soʻm / dates / +998 if relevant
- [ ] Cyrillic digraph check when Cyrillic is used
- [ ] Honesty: legal / medical / slang-heavy / invented bank SMS → `draft/native_review_required`

## Output template

```
## Matn
[final Uzbek]

## Oʻzgarishlar
- ...
- ...

## Holat
final | draft/native_review_required
```

## Defaults

- Script: Latin; Cyrillic only when asked
- Register: spoken clear product/student
- Address: `Siz` for UI / strangers / elders; `sen` only for peer/friend when context is clear
- Prefer clean standard Uzbek over code-switch
- Particles: OK in chat; almost never in product UI
- Allowed sparingly: Wi-Fi (ASCII hyphen), foto, laptop, gadjet, parol, kod, brand names

## Seed rewrite (always remember)

Bad: `Men haqiqatan ham bu ilovani yoqtiraman. To'g'ri javobni select qiling.`

Good: `Bu ilova menga juda yoqadi. Toʻgʻri javobni belgilang.`

## Maintainer / self-test

For skill maintainers only (not part of per-draft validate):

- `eval/cases.jsonl`
- `eval/bakeoff-rubric.md`
- `eval/trigger-queries.json`
