# Contributing

Thanks for poking at **uzbek-humanizer**.

## Repo layout

- Skill source of truth: `skills/uzbek-humanizer/`
- CLI installer: `cli/` (bundles the skill on `npm pack` via `scripts/sync-skill.mjs`)

## Dev loop

```bash
# from repo root
npm run test:eval

# try installer against this checkout
node cli/bin/uzhumanizer.js init --ai cursor
node cli/bin/uzhumanizer.js uninstall --ai cursor
```

Edit refs under `skills/uzbek-humanizer/references/`, keep `SKILL.md` lean, route on demand.

## PR tips

- No em dashes in docs/comments - use `-`
- Legal / medical / youth-heavy copy stays `draft/native_review_required`
- If you touch eval expects, update `eval/goldens.json` so `npm run test:eval` stays green
- Bump `cli/package.json` version when shipping CLI changes; bump `SKILL.md` metadata.version when the skill brain changes

## License

MIT - see [LICENSE](./LICENSE)
