# Install uzbek-humanizer

## Option A - skills CLI (portable)

Installs **both** skills when you ask for all packs:

```bash
npx skills add xusnitdinov/uzbek-humanizer --skill '*'
```

Or pick them explicitly:

```bash
npx skills add xusnitdinov/uzbek-humanizer --skill uzbek-humanizer --skill uzbek-humanize
```

## Option B - branded installer (npmjs) - preferred

```bash
npm i -g uzbek-humanizer-cli@1.5.0
uzhumanizer init --ai cursor
uzhumanizer init --ai all --global
```

Then in Agent chat:

```text
/uzbek-humanize add Uzbek to this site - translate UI + landing into natural o'zbekcha
```

Package: https://www.npmjs.com/package/uzbek-humanizer-cli

Uninstall:

```bash
uzhumanizer uninstall --ai cursor
uzhumanizer uninstall --ai all --global
npm uninstall -g uzbek-humanizer-cli
```

## Option C - GitHub Packages (optional mirror)

Scoped package `@xusnitdinov/uzbek-humanizer-cli`. Needs a GitHub token with `read:packages`. CI publishes this too so the repo Packages sidebar stays filled.

```bash
npm i -g @xusnitdinov/uzbek-humanizer-cli@1.5.0 --registry=https://npm.pkg.github.com
uzhumanizer init --ai all --global
```

Package: https://github.com/xusnitdinov/uzbek-humanizer/pkgs/npm/uzbek-humanizer-cli

Prefer **npmjs** for normal installs.

From this repo:

```bash
cd cli
npm install -g .
uzhumanizer init --ai cursor
```

Or without global link:

```bash
node cli/bin/uzhumanizer.js init --ai cursor
```

### `--ai` values

`cursor` | `claude` | `codex` | `copilot` | `windsurf` | `cline` | `roo` | `amp` | `goose` | `trae` | `kilo` | `opencode` | `continue` | `gemini-cli` | `antigravity` | `agents` | `all`

Unknown agents: use `agents` (project `.agents/skills`, global XDG `agents/skills`) or copy manually.

### Project vs global

- default: project folders (`.cursor/skills/…`, `.agents/skills/…`, …)
- `--global`: agent-native home dirs (`~/.cursor/skills`, `~/.codex/skills`, `~/.copilot/skills`, `~/.codeium/windsurf/skills`, XDG `~/.config/…` on Unix / `%APPDATA%\…` on Windows)

## Manual

Copy **both** folders into your agent's skills directory (names must stay exact):

- `skills/uzbek-humanizer/`
- `skills/uzbek-humanize/`

Prefer also installing under `.agents/skills/` for cross-client discovery.

## Verify

Ask the agent:

> Humanize this Uzbek: Men haqiqatan ham bu ilovani yoqtiraman. To'g'ri javobni select qiling.

You should get something like `Bu ilova menga juda yoqadi. Toʻgʻri javobni belgilang.` plus a short change list.

From the repo:

```bash
npm run test:eval
node skills/uzbek-humanizer/scripts/lint-stiff.mjs path/to/draft.txt
node skills/uzbek-humanizer/scripts/normalize-apostrophe.mjs --check path/to/draft.txt
```

Native bakeoff: `skills/uzbek-humanizer/eval/bakeoff-rubric.md`

Changelog: [CHANGELOG.md](./CHANGELOG.md)
