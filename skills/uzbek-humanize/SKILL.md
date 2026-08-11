---
name: uzbek-humanize
description: >-
  Slash command to localize websites and apps into natural Latin Uzbek.
  Use when the user runs /uzbek-humanize or asks to add Uzbek language,
  translate the site/UI to o'zbekcha, or wire i18n for Uzbek. Prefer natural
  product Uzbek over stiff machine translation. Not auto-invoked by the model;
  user must type /uzbek-humanize.
license: MIT
metadata:
  author: xusnitdinov
  version: "1.4.0"
disable-model-invocation: true
---

# /uzbek-humanize

Slash workflow for **wiring websites/apps into Latin Uzbek** (i18n files, locale config, switcher) with natural copy.

## Sister skill boundary

| Skill | Owns |
|---|---|
| **`uzbek-humanize` (this slash)** | Project i18n: locale JSON, keep keys, next-intl / routing / switcher, edit files when asked |
| **`uzbek-humanizer` (sister)** | Uzbek **text quality**: Siz, soft synonyms, calques, orthography. Load its refs while translating values |

User must type `/uzbek-humanize`. Do not confuse with auto `uzbek-humanizer`.

## Hard product rules (from sister)

1. Locale **values** for UI/quiz = **Siz** only (`qilasiz`, not `qilasan`)
2. Situation-natural verbs (`Guruh ishi oʻxshamadi` not `chiqmadi` for "didn't work out")
3. Orthography ʻ/ʼ - run sister normalize on **Uzbek** values only; never corrupt `Who's` / EN locale
4. After file edits, still print Matn samples + Oʻzgarishlar + Holat in chat
5. Calque-safe draft - high-stakes quiz/marketing → `draft/native_review_required` until native pass

## How the user invokes it

```text
/uzbek-humanize add Uzbek to this Next.js site - translate UI + landing
/uzbek-humanize localize src/locales/en.json into uz.json with natural Uzbek
/uzbek-humanize translate these React strings to o'zbekcha and keep keys stable
/uzbek-humanize add i18n for Uzbek on this Vite app
```

Whatever comes **after** `/uzbek-humanize` is the task. If empty, ask what to localize (routes, locale files, components).

## Goal

Ship **spoken clear product/student Latin Uzbek** that a real user in Toshkent would accept - not textbook MT, not EN calques, not ASCII `'` spam.

## Workflow

1. **Inspect the project** - find how languages are handled:
   - locale JSON/YAML (`en.json`, `messages/en.json`, …)
   - i18n libs (next-intl, react-i18next, vue-i18n, …)
   - hardcoded EN strings in components
   - CMS / markdown content
2. **Match existing patterns** - same file layout, same key names, same plural / ICU shape the project already uses. Prefer adding `uz` / `uz-UZ` the way `en` already works.
3. **Load sister skill** - if `uzbek-humanizer` is installed next to this skill, follow its Router, gotchas, Holat gate, and glossaries (`references/ui-glossary.md`, `microcopy.md`, `legal-copy.md`, …). Prefer editing locale files over scattering hardcodes - unless the project has no i18n yet and the user asked you to introduce it.
4. **Translate / humanize** - natural UZ (keep keys; translate values):
   - Buttons short (`Saqlash`, `Bekor qilish`, `Roʻyxatdan oʻtish`)
   - Errors soft and clear
   - Orthography: oʻ/gʻ with `ʻ`, tutuq with `ʼ` - no ASCII `'`
   - One address lane (`Siz` for product UI)
   - Ban EN cool calques (`select qil`, `ship`, `vibe`, stiff `haqiqatan ham`)
   - Latin default - do not ship Cyrillic in the Uzbek site locale unless the user asked
5. **Wire the language** if asked - locale config, language switcher label (`Oʻzbekcha`), routing (`/uz/...`), `hreflang` only when the stack already supports it or the user asked for wiring.
6. **Do not invent** whole legal ToS / medical advice - mark `draft/native_review_required`.
7. **Output** - make the code/file changes the user asked for. Also summarize:

```markdown
## Matn / Oʻzgarishlar
- which files / keys changed
- sample before → after strings (Siz, soft synonyms)

## Holat
final | draft/native_review_required
```

## Stack recipes (match what exists)

| Stack | Typical wiring |
|---|---|
| **next-intl** | `messages/uz.json` (or `uz-UZ`), add locale to `i18n.ts` / `routing.ts`, middleware matcher, optional `/uz` segment |
| **next-i18next / react-i18next** | `public/locales/uz/*.json` or `locales/uz/`, add `uz` to `i18n.locales`, keep namespaces |
| **Vue I18n** | `locales/uz.json`, register in `createI18n({ locale, messages })` |
| **Vite + custom JSON** | Mirror `en.json` → `uz.json`, swap via context / URL / cookie the way EN already switches |
| **Hardcoded EN only** | Introduce the project's smallest i18n pattern first, then fill `uz` - do not invent a second framework |

## ICU / plurals

- Keep placeholder shapes: `{name}`, `{{count}}`, `%s`, `{count, plural, ...}` - translate **words**, not braces.
- If EN uses ICU plural categories, keep the same categories the library expects; fill Uzbek forms that fit (`one` / `other` is often enough for product UZ).
- Example shape (adapt to the project's ICU dialect):

```text
{count, plural, one {# ta natija} other {# ta natija}}
```

- Do not drop `{count}` when localizing.

## Language switcher / SEO

| Surface | UZ |
|---|---|
| Switcher label | `Oʻzbekcha` |
| English option (if shown in UZ UI) | `Inglizcha` / keep `English` if the project uses endonyms |
| Cookie / locale tip (soft) | `Tilni oʻzgartirish` |

If asked for SEO: add `hreflang="uz"` (and `x-default` if the project already uses it). LTR stays default for Latin Uzbek - do not flip `dir` unless the user has a real RTL locale in the same tree.

## Cyrillic / script QA

- Default site locale: **Latin**.
- Cyrillic only when the user explicitly asks (кирилл / Cyrillic).
- Never mix scripts inside one locale file value.
- Place names in UZ text: `Toshkent`, not Tashkent.

## Sister-skill file-edit contract

- This slash skill **may edit** locale files, i18n config, and UI strings the user pointed at.
- Sister `uzbek-humanizer` defaults to Matn / Holat output and does **not** overwrite project files unless asked.
- When both are installed: slash owns wiring + file edits; sister owns natural-copy rules and glossaries.

## Defaults

| Setting | Value |
|---|---|
| Script | Latin (Cyrillic only if user asks) |
| Locale code | `uz` or `uz-UZ` (match project convention) |
| Register | product / student spoken UZ |
| Address | `Siz` for UI |
| Scope | Only what the user pointed at - do not rewrite the whole repo unprompted |

## Examples of good UX copy

| EN | UZ |
|---|---|
| Save | Saqlash |
| Cancel | Bekor qilish |
| Sign up | Roʻyxatdan oʻtish |
| No results found | Soʻrovingiz boʻyicha hech narsa topilmadi |
| Invalid password | Notoʻgʻri parol |
| Please try again | Iltimos, qaytadan urinib koʻring |
| Language | Til |
| Home | Bosh sahifa |
| Page not found | Sahifa topilmadi |
| We use cookies | Sayt ishlashi uchun kerakli cookie fayllardan foydalanamiz |

## Gotchas

- Keep i18n **keys** stable; translate **values**.
- Do not leave half-EN UI in the Uzbek locale.
- Place names in UZ text: `Toshkent`, not Tashkent.
- If the site mixes marketing + legal, legal stays draft.
- Prefer editing locale files over scattering hardcodes - unless the project has no i18n yet and the user asked you to introduce it.
- `disable-model-invocation: true` means the model should not auto-load this skill - the user types `/uzbek-humanize`.
