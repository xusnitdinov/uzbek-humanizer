---
name: uzbek-humanizer
description: >-
  Use when writing, rewriting, reviewing, or localizing Uzbek Latin copy
  (UI, product, quiz, marketing, chat). Fixes AI-sounding Uzbek, English
  calques, morphology, oʻ/gʻ orthography, and Siz/sen register. Trigger for
  o'zbekcha, o‘zbek, Uzbek copy, humanize Uzbek, matnni tabiiylashtirish,
  uzbek-humanizer, even if the user does not say the skill name.
license: MIT
metadata:
  author: xusnitdinov
  version: "1.0.0"
---

# uzbek-humanizer

Make AI-written Uzbek sound like a real person wrote it - clear spoken Latin product/student Uzbek by default.

Honest claim: much more natural. Heavy slang, invented idioms, legal/medical = draft + native review.

## When to use

- Write or rewrite Uzbek Latin UI / product / quiz / marketing / assistant replies
- Fix stiff MT or LLM Uzbek (calques, wrong suffixes, missing oʻ/gʻ)
- Localize EN (or other) into natural Uzbek
- Review existing Uzbek copy for AI tells

## When not to use

- User wants Russian target copy (out of scope)
- User wants Cyrillic-only output unless they ask
- Pure grammar-theory essay with no rewrite task
- User style guide explicitly overrides this skill - follow the user

## Scenario → Start From

| Scenario | Trigger examples | Start |
|---|---|---|
| Product UI | buttons, errors, empty states | `references/ui-glossary.md` + `microcopy.md` |
| Quiz / test | DTM stems, "belgilang" | `references/quiz-glossary.md` |
| Rewrite bad AI UZ | stiff calques, EN order, broken suffixes | `banned-calques.md` + `before-after.md` |
| Marketing / landing | warm human tone | `register.md` + `voice.md` |
| Youth chat | slang, Telegram vibe | `youth-slang.md` (draft label) |
| Bank / OTP / SMS | security copy | `bank-sms.md` + `politeness.md` |
| Orthography mess | apostrophes, oʻ/gʻ | `orthography.md` + run normalize script |

## Workflow

1. **Detect task** - write / rewrite / review / localize. Default register: spoken clear product/student Latin Uzbek.
2. **Respect user style** - if they give voice/glossary, it wins.
3. **Load refs** - use the routing table below. One hop only.
4. **Rewrite** - natural UZ, not literal EN. Prefer real verbs and light auxiliaries over calques.
5. **Validate** - run scripts when available:
   - `node scripts/normalize-apostrophe.mjs <file>`
   - `node scripts/lint-banned.mjs <file>`
6. **Checklist** - complete the post-rewrite checklist.
7. **Output** - use the template. Do not overwrite project files unless the user asks.

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

## Post-rewrite checklist

- [ ] Orthography: oʻ/gʻ/ʼ correct; no ASCII apostrophe spam
- [ ] Morphology: no broken cases/plurals/possessives
- [ ] Syntax: natural SOV; no EN word-order mush
- [ ] Lexicon: no banned EN calques; idioms remapped or plain
- [ ] Pragmatics: one address lane (Siz or sen); register matches task
- [ ] Formatting: soʻm / dates / +998 if relevant
- [ ] Honesty: slang-heavy labeled draft if needed

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

## Reference routing

| If task involves... | Load |
|---|---|
| Bad AI / EN slang / calques | `references/banned-calques.md`, `references/ai-patterns.md` |
| Literal idioms / MT mush | `references/mt-failures.md`, `references/phraseology-rules.md` |
| Buttons / errors / empty | `references/ui-glossary.md`, `references/microcopy.md` |
| Quiz / DTM stems | `references/quiz-glossary.md` |
| Apostrophes / Latin chaos | `references/orthography.md` |
| Stiff verbs / aspect | `references/aspect-modality.md`, `references/auxiliaries.md` |
| Spoken glue / particles | `references/particles.md`, `references/voice.md` |
| Siz/sen / soft replies | `references/politeness.md` |
| Money / dates / phones | `references/formatting.md` |
| RU discourse / hybrids | `references/rusizmlar.md`, `references/false-friends.md` |
| Youth Telegram tone | `references/youth-slang.md` |
| Bank / OTP / SMS | `references/bank-sms.md` |
| Morphology weirdness | `references/morphology-checks.md` |
| Worked demos | `examples/` |
| Self-test | `eval/cases.jsonl` |
| Sources | `references/sources.md` |

## Defaults

- Script: Latin
- Register: spoken clear product/student
- Address: `Siz` for UI / strangers / elders; `sen` only for peer/friend when context is clear
- Prefer clean standard Uzbek over code-switch
- Allowed sparingly: Wi‑Fi, foto, laptop, gadjet, parol, kod, brand names

## Seed rewrite (always remember)

Bad: `Men haqiqatan ham bu ilovani yoqtiraman. To'g'ri javobni select qiling.`

Good: `Bu ilova menga juda yoqadi. Toʻgʻri javobni belgilang.`
