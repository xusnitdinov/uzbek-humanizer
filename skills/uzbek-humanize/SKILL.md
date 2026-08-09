---
name: uzbek-humanize
description: >-
  Slash command to localize websites and apps into natural Latin Uzbek.
  Use when the user runs /uzbek-humanize or asks to add Uzbek language,
  translate the site/UI to o'zbekcha, or wire i18n for Uzbek. Prefer natural
  product Uzbek over stiff machine translation.
license: MIT
metadata:
  author: xusnitdinov
  version: "1.3.1"
disable-model-invocation: true
---

# /uzbek-humanize

Slash workflow for **adding natural Latin Uzbek** to a project that is already in English (or another language) - websites, apps, UI strings, landing copy, emails, SMS.

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
2. **Match existing patterns** - same file layout, same key names, same plural rules shape the project already uses. Prefer adding `uz` / `uz-UZ` the way `en` already works.
3. **Load sister skill** - if `uzbek-humanizer` is installed next to this skill, follow its Router, gotchas, Holat gate, and glossaries (`references/ui-glossary.md`, `microcopy.md`, etc.).
4. **Translate / humanize** - natural UZ:
   - Buttons short (`Saqlash`, `Bekor qilish`, `Roʻyxatdan oʻtish`)
   - Errors soft and clear
   - Orthography: oʻ/gʻ with `ʻ`, tutuq with `ʼ` - no ASCII `'`
   - One address lane (`Siz` for product UI)
   - Ban EN cool calques (`select qil`, `ship`, `vibe`, stiff `haqiqatan ham`)
5. **Wire the language** if asked - locale config, language switcher label (`Oʻzbekcha`), routing (`/uz/...`) only when the stack already supports it or the user asked for wiring.
6. **Do not invent** whole legal ToS / medical advice - mark `draft/native_review_required`.
7. **Output** - make the code/file changes the user asked for. Also summarize:

```markdown
## Matn / o‘zgarishlar
- which files / keys changed
- sample before → after strings

## Holat
final | draft/native_review_required
```

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

## Gotchas

- Keep i18n **keys** stable; translate **values**.
- Do not leave half-EN UI in the Uzbek locale.
- Place names in UZ text: `Toshkent`, not Tashkent.
- If the site mixes marketing + legal, legal stays draft.
- Prefer editing locale files over scattering hardcodes - unless the project has no i18n yet and the user asked you to introduce it.
