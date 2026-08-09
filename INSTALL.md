# Install uzbek-humanizer

## Option A - skills CLI (portable)

```bash
npx skills add xusnitdinov/uzbek-humanizer
```

## Option B - branded installer (npm)

```bash
npm i -g uzbek-humanizer-cli
uzhumanizer init --ai cursor
uzhumanizer init --ai all --global
```

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

`cursor` | `claude` | `codex` | `copilot` | `all`

### Project vs global

- default: project folders (`.cursor/skills/uzbek-humanizer`, …)
- `--global`: home directories (`~/.cursor/skills/uzbek-humanizer`, …)

## Manual

Copy `skills/uzbek-humanizer/` into your agent's skills directory. Folder name must stay `uzbek-humanizer` to match `SKILL.md` name.

## Verify

Ask the agent:

> Humanize this Uzbek: Men haqiqatan ham bu ilovani yoqtiraman. To'g'ri javobni select qiling.

You should get something like `Bu ilova menga juda yoqadi. Toʻgʻri javobni belgilang.` plus a short change list.
