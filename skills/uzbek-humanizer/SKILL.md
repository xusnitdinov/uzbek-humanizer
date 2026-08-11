---
name: uzbek-humanizer
description: >-
  Use when writing, rewriting, reviewing, or localizing Uzbek Latin *copy*
  (UI strings, quiz stems, marketing, chat, bank/OTP, consent, health soft UI).
  Owns natural-Uzbek rewrite quality: calques, soft synonyms, Siz register,
  oʻ/gʻ orthography. Trigger for o'zbekcha, humanize Uzbek, matnni
  tabiiylashtirish, uzbek-humanizer, DTM/quiz, bank OTP, ToS draft, Cyrillic
  ask. For wiring site i18n files / next-intl / en.json→uz.json use sister
  slash skill uzbek-humanize (/uzbek-humanize) instead.
license: MIT
metadata:
  author: xusnitdinov
  version: "1.5.1"
---

# uzbek-humanizer

Make AI-written Uzbek sound like a real person wrote it - clear spoken Latin product/student Uzbek by default.

**Honest claim (1.5.0):** S++ is **aspirational** until a live native pass is recorded per `eval/native-review-protocol.md`. Automated gates (live bakeoff + pairwise + audited bank) are green; self-scored goldens alone do **not** prove native taste. Legal/medical/high-stakes marketing still `draft/native_review_required`.

## Sister skill boundary (do not confuse)

| Skill | Owns |
|---|---|
| **`uzbek-humanizer` (this)** | Rewrite / review **Uzbek text quality** - Matn, glossaries, orthography, Siz, soft synonyms |
| **`uzbek-humanize` (slash)** | **Wire project i18n** - locale files, keys stable, next-intl / switcher / `/uz` routing. User types `/uzbek-humanize` |

If the user asks to add Uzbek to a Next/Vite app or edit `en.json`→`uz.json`, prefer **`uzbek-humanize`**. If they paste stiff Uzbek / ask to humanize lines, stay **here**. When slash is missing, this skill may still rewrite values but should not invent a second i18n framework unprompted.

## Top hard rules (always, before Router)

1. **Prefer spoken fit over formal correctness** - if grammar is fine but a Toshkent/Fargʻona urban speaker would rewrite it, rewrite it.
2. **No fake particles** - do not stuff `xoʻp` / `mayli` / `endi` to “sound human.” Particles only when they help.
3. **Product / UI / quiz = `Siz` only** - `qilasiz`, `Keling`. Never `qilasan` / bare `Kel` unless user explicitly asked for sen/youth.
4. **No EN cool slang in UZ** - `ship`, `vibe`, `teammate`, `portladi`, `Systems brain` (see `loanword-policy.md` for KEEP vs REWRITE).
5. **Situation-natural verbs / collocations** - `Guruh ishi oʻxshamadi` not `chiqmadi`; load `context-synonyms.md` + `collocations.md`.
6. **Orthography** - oʻ/gʻ = `ʻ` (U+02BB); tutuq = `ʼ` (U+02BC). Never rewrite digraphs into tutuq.
7. **No invented maqollar** / no poetic UI buttons / no lengthening short labels “to sound natural.”
8. **One address lane** - never `Siz` + `-san` on the same surface; no literary+chatty mix on one screen.
9. **Do not over-Uzbekify** accepted tech loans (`Wi‑Fi`, `OTP`, `email`, brands) into fake-literary purity.
10. **Legal / medical / youth-heavy / unverified high-stakes** → `Holat: draft/native_review_required`.
11. **Always emit** Matn (or change summary) + Oʻzgarishlar + Holat in chat - even when editing project files.

## Preset selector (required before rewrite)

- `product-default` → UI/buttons/errors (Siz, short)
- `quiz-formal` → quiz stems and tests (Siz + stem rhythm)
- `assistant-friendly` → conversational support/help
- `youth-chat` → only on explicit request
- `marketing-warm` → landing/promo without brochure tone
- `legal-soft-draft` / `medical-soft-draft` → always draft gate

Source: `references/register-presets.md`.

## When to use

- Write or rewrite Uzbek Latin UI / product / quiz / marketing / assistant replies
- Fix stiff MT or LLM Uzbek (calques, wrong soft synonyms, wrong suffixes, missing oʻ/gʻ)
- Localize EN strings into natural Uzbek (values) when not doing full site wiring
- Review existing Uzbek copy for AI tells
- Bank / OTP / SMS, legal soft UI, medical soft UI, Cyrillic when asked

## When not to use

- User wants Russian target copy
- Site i18n wiring / locale file project work → sister `/uzbek-humanize`
- Pure grammar-theory essay with no rewrite task
- User style guide overrides this skill

## Router

| Scenario | Trigger examples | Load |
|---|---|---|
| **Site / app i18n (slash)** | `/uzbek-humanize`, Next/Vite locale wiring | Hand off to `uzbek-humanize`; else `ui-glossary` + `microcopy` + `soft-synonyms` |
| Synonym / native taste | "chiqmadi vs oʻxshamadi", career quiz tone | `references/context-synonyms.md` + `references/native-preference-bank.md` + `references/oria-career-quiz.md` + `references/oria-goldens.md` |
| Collocations / aspect | stiff verbs, wrong pairs | `references/collocations.md` + `references/aspect-modality.md` + `references/auxiliaries.md` |
| Loanwords | Wi‑Fi vs ship/vibe | `references/loanword-policy.md` |
| Bad AI rewrite | stiff calques, EN order, broken suffixes | `references/banned-calques.md` + `references/before-after.md` + `references/ai-patterns.md` |
| Marketing / landing | warm human tone | `references/register.md` + `references/voice.md` + `references/marketing-long.md` + `examples/marketing.md` |
| Product UI | buttons, errors, empty states | `references/ui-glossary.md` + `references/microcopy.md` + `examples/product-ui.md` + `soft-synonyms.md` |
| Quiz / test | DTM stems, belgilang | `references/quiz-glossary.md` + `examples/quiz.md` + `politeness.md` + `soft-synonyms.md` |
| Youth chat | slang, yoshlarcha | `references/youth-slang.md` (draft; only when asked) |
| Bank / OTP / SMS | security copy | `references/bank-sms.md` + `references/politeness.md` |
| Legal soft UI | ToS, consent | `references/legal-copy.md` (draft) |
| Medical soft UI | appointment, symptoms | `references/medical-copy.md` (draft; never diagnose) |
| Cyrillic ask | кирилл | `references/cyrillic.md` |
| Orthography | apostrophes | `references/orthography.md` + normalize script |
| Idioms / MT | literal idioms | `references/mt-failures.md` + `references/phraseology-rules.md` |
| Aspect / auxiliaries | stiff verbs | `references/aspect-modality.md` + `references/auxiliaries.md` |
| Particles / voice | spoken glue | `references/particles.md` + `references/voice.md` |
| Siz/sen | address | `references/politeness.md` (**Siz hard for product**) |
| Money / dates | soʻm, +998 | `references/formatting.md` |
| RU hybrids | rusizmlar | `references/rusizmlar.md` + `references/false-friends.md` |
| Morphology | cases, plurals | `references/morphology-checks.md` |
| Demos | worked examples | `examples/` |
| Sources | provenance | `references/sources.md` |

## Workflow

1. **Detect task** - write / rewrite / review / localize. Default: spoken clear product/student Latin Uzbek + **Siz**.
2. **Sister check** - i18n wiring → `uzbek-humanize` when present.
3. **Respect user style** - their glossary wins; sen/youth only if they asked.
4. **Load refs** - Top 10 first, then one Router hop. Prefer `soft-synonyms` + `before-after` for quiz/product.
5. **Rewrite** - natural UZ; situation verbs; Siz on product/quiz.
6. **Validate** (when files available):
   - `node scripts/normalize-apostrophe.mjs <file>` (safe on bilingual tx/JSON)
   - `node scripts/lint-banned.mjs <file>` (Uzbek-only extract by default)
   - `node scripts/lint-stiff.mjs <file>` (flags `-asan` on product; `--allow-sen` for youth)
   - `node scripts/lint-cadence.mjs <file>` (rhythm monotony / template repetition)
   - `node scripts/lint-literalness.mjs <file>` (translation-smell syntax)
   - `node scripts/lint-screen-consistency.mjs <file>` (one-surface mix: Siz/sen, jumla/gap, literary+chatty)
7. **Fix lint then re-lint** - or label residuals in Holat.
8. **Holat gate** - legal / medical / youth / high-stakes marketing synonym doubt → `draft/native_review_required`.
9. **Output** - template below. If you edited project files, still print short Oʻzgarishlar + Holat in chat.

## Gotchas

1. oʻ/gʻ = `ʻ`; tutuq = `ʼ`. Digraphs must never become tutuq (`Toʼgʻri` is a bug).
2. No EN cool slang in UZ output.
3. Soft synonyms matter - `chiqmadi` ≠ always wrong, but "group project failed" → `oʻxshamadi`.
4. Product/quiz: never `-san` unless asked.
5. No invented maqollar.
6. Prefer auxiliaries (`yopib qoʻying`) over stiff calques.
7. Do not over-use `bir` as a fake English article.
8. Place names: `Toshkent`, not Tashkent.
9. Review ≠ overwrite files unless asked (slash owns bulk locale edits).
10. Heavy slang / legal / medical = draft.
11. No `karoche` / `normalni` / `kruto` unless youth mode.
12. Morphology: `kitoblarimiz` not `kitoblerimiz`.
13. Never diagnose or prescribe.
14. Never invent binding legal statutes.
15. Cyrillic only when asked.
16. Invented bank SMS = draft.
17. Do not normalize EN strings inside bilingual files (`Who's`, `I'm`).
18. Anti-overcorrection: no archaic textbook words unless requested.
19. Anti-overcorrection: no RU slang fillers unless youth mode explicitly requested.

## Post-rewrite checklist

- [ ] Top 10 hard rules satisfied
- [ ] Orthography: digraphs TURNED; tutuq correct; EN untouched in bilingual files
- [ ] Soft synonyms: situation-natural verbs
- [ ] Product/quiz: zero `-san` / bare `Kel`
- [ ] No banned EN calques; no invented maqol
- [ ] Holat honest (draft if synonym-doubt on product quiz/marketing)

## Output template

```
## Matn
[final Uzbek — or "see file edits" plus 2–5 sample lines]

## Oʻzgarishlar
- ...
- ...

## Holat
final | draft/native_review_required
```

## Defaults

- Script: Latin
- Register: spoken clear product/student
- Address: **`Siz` hard** for UI / quiz / product; `sen` only when explicitly requested
- Particles: OK in chat; almost never in product UI

## Seed rewrite

Bad: `Men haqiqatan ham bu ilovani yoqtiraman. To'g'ri javobni select qiling. Guruh ishi chiqmadi - nima qilasan?`

Good: `Bu ilova menga juda yoqadi. Toʻgʻri javobni belgilang. Guruh ishi oʻxshamadi - nima qilasiz?`

## Install note (agents)

- Project: `uzhumanizer init --ai cursor` → `.cursor/skills/`
- Global (all repos): `uzhumanizer init --ai cursor --global` → `~/.cursor/skills/`
- Source of truth: https://github.com/xusnitdinov/uzbek-humanizer - sync local patches back to the repo

## Maintainer / self-test

```bash
npm run test:splusplus
# or: npm run test:eval && npm run test:normalize && npm run test:live-bakeoff && npm run test:pairwise
```
