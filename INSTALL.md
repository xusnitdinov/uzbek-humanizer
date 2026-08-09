# Install uzbek-humanizer

## Option A - skills CLI (portable)

```bash
npx skills add xusnitdinov/uzbek-humanizer
```

## Option B - branded installer (npmjs)

```bash
npm i -g uzbek-humanizer-cli
uzhumanizer init --ai cursor
uzhumanizer init --ai all --global
```

Package: https://www.npmjs.com/package/uzbek-humanizer-cli

## Option C - GitHub Packages

Scoped mirror of the same CLI. Configure npm for `npm.pkg.github.com` (GitHub token with `read:packages`), then:

```bash
npm i -g @xusnitdinov/uzbek-humanizer-cli --registry=https://npm.pkg.github.com
uzhumanizer init --ai all --global
```

Package: https://github.com/xusnitdinov/uzbek-humanizer/pkgs/npm/uzbek-humanizer-cli

Prefer **npmjs** for normal installs. GitHub Packages is mainly so the repo Packages sidebar stays honest.

From this repo:

```bash
cd cli
npm install -g .
uzhumanizer init --ai cursor
uzhumanizer init --ai all --global
```

Or without global link:

```bash
node cli/bin/uzhumanizer.js init --ai cursor
```

### `--ai` values

`cursor` | `claude` | `codex` | `copilot` | `windsurf` | `cline` | `roo` | `amp` | `goose` | `trae` | `kilo` | `opencode` | `continue` | `agents` | `all`

Unknown agents: use `agents` (writes `.agents/skills/uzbek-humanizer`) or copy manually.

### Project vs global

- default: project folders (`.cursor/skills/uzbek-humanizer`, `.windsurf/skills/…`, …)
- `--global`: home directories (`~/.cursor/skills/…`, `~/.codeium/windsurf/skills/…`, `~/.agents/skills/…`, …)

## Manual

Copy `skills/uzbek-humanizer/` into your agent's skills directory. Folder name must stay `uzbek-humanizer` to match `SKILL.md` name. Prefer also installing under `.agents/skills/` for cross-client discovery.

## Verify

Ask the agent:

> Humanize this Uzbek: Men haqiqatan ham bu ilovani yoqtiraman. To'g'ri javobni select qiling.

You should get something like `Bu ilova menga juda yoqadi. Toʻgʻri javobni belgilang.` plus a short change list.

From the repo:

```bash
npm run test:eval
node skills/uzbek-humanizer/scripts/lint-stiff.mjs path/to/draft.txt
```

Native bakeoff protocol: `skills/uzbek-humanizer/eval/bakeoff-rubric.md`
