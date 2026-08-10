# AGENTS.md

Instructions for AI coding agents working **in this repository** (not end-user install of the skill).

## What this repo is

- **Product:** Agent Skills that make Latin Uzbek copy sound natural + `/uzbek-humanize` for site/app i18n
- **Installer:** `cli/` → npm package `uzbek-humanizer-cli` (bin: `uzhumanizer`)
- **Source of truth:** `skills/` - never treat gitignored `cli/skills/` or `cli/skill/` as editable sources

## Layout

| Path | Edit? | Notes |
|---|---|---|
| `skills/uzbek-humanizer/` | yes | Main skill - SKILL.md lean; bulk in `references/` |
| `skills/uzbek-humanize/` | yes | Slash companion (`disable-model-invocation: true`) |
| `skills/uzbek-humanizer/eval/` | yes | `cases.jsonl` + matching `goldens.json` ids |
| `cli/lib/init.js` | yes | Install targets, dual-pack rules |
| `cli/skills/`, `cli/skill/` | **no** | Rebuilt by `cli/scripts/sync-skill.mjs` on pack/publish |
| `README.md`, `INSTALL.md`, `CONTRIBUTING.md` | yes | Keep install commands accurate |

## Commands

```bash
# from repo root - CI gate
npm run test:eval
npm run test:normalize

# try installer against a project cwd
node cli/bin/uzhumanizer.js init --ai cursor
node cli/bin/uzhumanizer.js uninstall --ai cursor
node cli/bin/uzhumanizer.js versions

# draft helpers
node skills/uzbek-humanizer/scripts/normalize-apostrophe.mjs path/to/draft.txt
node skills/uzbek-humanizer/scripts/lint-banned.mjs path/to/draft.txt
node skills/uzbek-humanizer/scripts/lint-stiff.mjs path/to/draft.txt
```

Node 18+. No app build step.

## Hard rules

1. **Both packs** - install/uninstall/publish must keep `uzbek-humanizer` **and** `uzbek-humanize`
2. **Eval sync** - new/changed case `id` in `cases.jsonl` needs the same key in `goldens.json`; run `npm run test:eval`
3. **Orthography in goldens/Matn** - oʻ/gʻ → `ʻ` (U+02BB); tutuq → `ʼ` (U+02BC); do not accept ASCII `'` twins as valid expects; never rewrite digraphs into tutuq
4. **Product/quiz = Siz** - no `qilasan` / bare `Kel` unless user asked for sen/youth
5. **Soft synonyms** - situation-natural verbs (`oʻxshamadi` not `chiqmadi` for "didn't work out"); see `references/soft-synonyms.md`
6. **Router** - keep `SKILL.md` short; Top 10 hard rules first; put domain detail in `references/`; one hop
7. **Honesty** - calque-safe draft; legal / medical / heavy youth / high-stakes synonym doubt = `draft/native_review_required`
8. **Place names** in Uzbek text: `Toshkent`, not Tashkent
9. **Sister contract** - `uzbek-humanizer` = text quality; `uzbek-humanize` = i18n file wiring
10. **Versions** - bump `cli/package.json` + both `skills/*/SKILL.md` `metadata.version` + `CHANGELOG.md` together when cutting a release (maintainers)
11. **Normalize bilingual safely** - `npm run test:normalize`; EN `Who's` / tx() EN args must not change

## Good changes vs noise

**Do:** better UZ glossaries, eval cases, clearer install docs, CLI path fixes, slash i18n recipes  
**Don't:** invent maqollar, ship ASCII apostrophe goldens, edit bundled `cli/skills` copies, add marketplace submit pressure, rewrite the whole skill for style only

## PR bar

- `npm run test:eval` green
- Small focused diffs
- If user-facing: note for `CHANGELOG.md`

More human detail: [CONTRIBUTING.md](./CONTRIBUTING.md)
