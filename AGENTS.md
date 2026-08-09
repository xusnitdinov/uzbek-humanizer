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
3. **Orthography in goldens/Matn** - oʻ/gʻ → `ʻ` (U+02BB); tutuq → `ʼ` (U+02BC); do not accept ASCII `'` twins as valid expects
4. **Router** - keep `SKILL.md` short; put domain detail in `references/`; one hop
5. **Honesty** - legal / medical / heavy youth = `draft/native_review_required`; no fake statutes, no diagnoses
6. **Place names** in Uzbek text: `Toshkent`, not Tashkent
7. **Sister contract** - slash may edit locale files when asked; main skill defaults to Matn/Holat unless user asked for file edits
8. **Versions** - bump `cli/package.json` + both `skills/*/SKILL.md` `metadata.version` + `CHANGELOG.md` together when cutting a release (maintainers)

## Good changes vs noise

**Do:** better UZ glossaries, eval cases, clearer install docs, CLI path fixes, slash i18n recipes  
**Don't:** invent maqollar, ship ASCII apostrophe goldens, edit bundled `cli/skills` copies, add marketplace submit pressure, rewrite the whole skill for style only

## PR bar

- `npm run test:eval` green
- Small focused diffs
- If user-facing: note for `CHANGELOG.md`

More human detail: [CONTRIBUTING.md](./CONTRIBUTING.md)
