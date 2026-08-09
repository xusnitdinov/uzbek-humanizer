# Contributing

Thanks for poking at **uzbek-humanizer**. PRs that make Latin Uzbek copy more natural (or the installer less annoying) are very welcome.

## What this project is

Two Agent Skills + a small CLI:

| Piece | Job |
|---|---|
| `skills/uzbek-humanizer/` | Main skill - rewrite / review / localize Latin Uzbek |
| `skills/uzbek-humanize/` | Slash `/uzbek-humanize` - add Uzbek to sites/apps (i18n) |
| `cli/` | `uzhumanizer` installer (npm: `uzbek-humanizer-cli`) |

Honest bar: **much more natural** spoken product/student Uzbek. Not presidential speeches, not a full slang dictionary, not “native-perfect forever.” Legal / medical / heavy youth slang stays `draft/native_review_required`.

## Quick start

```bash
git clone https://github.com/xusnitdinov/uzbek-humanizer.git
cd uzbek-humanizer

# eval + example Matn lint (CI runs this too)
npm run test:eval

# install both skills into a test project
cd /path/to/some-project
node /path/to/uzbek-humanizer/cli/bin/uzhumanizer.js init --ai cursor
```

Node **18+**. No build step for the skills themselves.

## Repo map

```text
skills/
  uzbek-humanizer/
    SKILL.md              # router, workflow, gotchas (keep lean)
    references/           # domain packs loaded on demand
    examples/             # worked Matn demos
    eval/                 # cases.jsonl, goldens.json, triggers, bakeoff
    scripts/              # normalize / lint / run-eval
  uzbek-humanize/
    SKILL.md              # slash + site i18n workflow
cli/
  bin/uzhumanizer.js
  lib/init.js
  scripts/sync-skill.mjs  # copies skills → cli/skills (+ legacy cli/skill)
```

`cli/skills/` and `cli/skill/` are **gitignored** - rebuilt on `npm pack` / publish via `sync-skill.mjs`. Edit source under `skills/`, not the bundled copies.

## Where to contribute

### Natural Uzbek copy (most valuable)

- Add / fix rows in `references/` (`ui-glossary.md`, `microcopy.md`, `banned-calques.md`, …)
- Add a short before/after in `examples/` if it teaches a pattern
- Prefer real product Uzbek over textbook MT
- Orthography: oʻ/gʻ use `ʻ` (U+02BB); tutuq uses `ʼ` (U+02BC) - avoid ASCII `'` in **output** goldens

### Slash / web i18n

- Improve `skills/uzbek-humanize/SKILL.md` (stack recipes, ICU, switcher, gotchas)
- Keep **keys** stable; translate **values**
- Main skill Router should keep pointing site-i18n work at the slash companion

### Eval

Eval is the safety net. Structure:

| File | Role |
|---|---|
| `eval/cases.jsonl` | one JSON object per line: `id`, `type`, `input`, `bucket`, expects |
| `eval/goldens.json` | map `id →` expected output string (must match every case id) |
| `eval/trigger-queries.json` | should / should-not activate skill |
| `eval/bakeoff-items.jsonl` | blind rating prompts (schema only in CI) |

Expect fields:

- `expect_contains_any` - OR
- `expect_contains_all` - AND
- `expect_contains` - legacy OR (prefer any/all)
- `expect_not` - forbidden substrings

When you add a case:

1. Append a line to `cases.jsonl`
2. Add the same `id` to `goldens.json`
3. Run `npm run test:eval` until green
4. Prefer proper ʻ/ʼ in expects - do **not** accept ASCII twins as “also OK”

Buckets exist so coverage is visible (`lexicon`, `web-i18n`, `calque`, …). New domain → new bucket is fine.

### CLI / install

- Agent targets live in `cli/lib/init.js` (`TARGETS` + `ALIASES`)
- Install must keep shipping **both** packs
- After CLI behavior changes, exercise:

```bash
node cli/bin/uzhumanizer.js init --ai cursor
node cli/bin/uzhumanizer.js uninstall --ai cursor
node cli/bin/uzhumanizer.js versions
```

### Docs

- Root `README.md` is the front door - keep install commands accurate
- `INSTALL.md` for extra paths
- `CHANGELOG.md` for user-facing notes on release

## Scripts you’ll use

```bash
# full eval (cases + goldens + triggers + bakeoff + example Matn lint)
npm run test:eval

# draft linters (pass a file with Uzbek output)
node skills/uzbek-humanizer/scripts/normalize-apostrophe.mjs path/to/draft.txt
node skills/uzbek-humanizer/scripts/normalize-apostrophe.mjs --check path/to/draft.txt
node skills/uzbek-humanizer/scripts/lint-banned.mjs path/to/draft.txt
node skills/uzbek-humanizer/scripts/lint-stiff.mjs path/to/draft.txt

# only ## Matn blocks (useful on teaching docs)
node skills/uzbek-humanizer/scripts/lint-banned.mjs --matn-only path/to/file.md
node skills/uzbek-humanizer/scripts/lint-stiff.mjs --matn-only path/to/file.md
```

## Skill editing rules of thumb

1. Keep `SKILL.md` short - put bulk into `references/` and route from the table
2. One hop in the Router - don’t chain five refs for one task
3. Don’t invent binding legal fine print or medical diagnoses
4. Place names in Uzbek text: `Toshkent`, not Tashkent
5. Sister contract: slash may edit locale files when asked; main skill defaults to Matn / Holat unless the user asked for file edits

## Pull requests

- Small PRs > giant rewrites
- Say **why** in the PR body (what sounded wrong, what you changed)
- If you touch expects → goldens must stay in sync (`npm run test:eval`)
- Legal / medical / youth-heavy examples keep `draft/native_review_required`
- Bump versions only when maintainers are cutting a release (or you agree in the PR):
  - `cli/package.json` for installer changes
  - both `skills/*/SKILL.md` `metadata.version` when skill behavior/content changes
- Native speakers: if something “passes eval” but still feels stiff, open an issue or PR with a better golden - that’s gold

### Suggested PR checklist

- [ ] `npm run test:eval` green
- [ ] New Uzbek strings use ʻ/ʼ (not ASCII `'`) in goldens / Matn
- [ ] Router / glossary updated if you added a new surface
- [ ] Changelog note if the change is user-facing (maintainers can help)

## Issues

Good issue reports:

- Stiff / wrong Uzbek with **before → after** (and register: UI / quiz / bank / youth / …)
- Install fail: OS, agent (`cursor` / `claude` / …), command you ran, error text
- Eval hole: case id or a new prompt that should be covered

## Release (maintainers)

1. Bump `cli/package.json` + both skill `metadata.version` + `CHANGELOG.md`
2. `npm run test:eval` green
3. Commit + tag `vX.Y.Z` matching `cli/package.json`
4. Publish a GitHub Release (triggers `publish-cli.yml` → npmjs + GitHub Packages)
5. Do **not** also fire `workflow_dispatch` for the same version

## License

MIT - see [LICENSE](./LICENSE). By contributing you agree your changes are MIT-licensed too.
