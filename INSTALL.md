# Install uzbek-copy

## Option A - skills CLI (portable)

```bash
npx skills add xusnitdinov/uzbek-humanizer
```

## Option B - branded installer

From this repo:

```bash
cd cli
npm install -g .
uzcopy init --ai cursor
uzcopy init --ai all --global
```

Or without global link:

```bash
node cli/bin/uzcopy.js init --ai cursor
```

### `--ai` values

`cursor` | `claude` | `codex` | `copilot` | `all`

### Project vs global

- default: project folders (`.cursor/skills/uzbek-copy`, …)
- `--global`: home directories (`~/.cursor/skills/uzbek-copy`, …)

## Manual

Copy `skills/uzbek-copy/` into your agent's skills directory. Folder name must stay `uzbek-copy` to match `SKILL.md` name.

## Verify

Ask the agent:

> Rewrite this to natural Uzbek: Bu feature portladi

You should get something like `Bu imkoniyat chiqmadi` plus a short change list.
