# Contributing

Thanks for poking at **uzbek-humanizer**.

## Repo layout

- Skill source of truth: `skills/uzbek-humanizer/` + slash companion `skills/uzbek-humanize/`
- Claude plugin manifest: `.claude-plugin/plugin.json`
- CLI installer: `cli/` (bundles both skills on `npm pack` via `scripts/sync-skill.mjs`)

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
- Bump `.claude-plugin/plugin.json` `version` in lockstep when releasing for Claude marketplace

## Release runbook

1. Bump versions (`cli/package.json`, both `SKILL.md` metadata, `.claude-plugin/plugin.json`) + `CHANGELOG.md`
2. `npm run test:eval` green
3. Commit + tag `vX.Y.Z` matching `cli/package.json` (do **not** also fire `workflow_dispatch` for the same version)
4. GitHub Release publish → `publish-cli.yml` (npmjs + GitHub Packages). 409 races are treated as already published.
5. Claude marketplace (first time): `claude plugin validate .` then submit at https://platform.claude.com/plugins/submit - later bumps follow git automatically when you bump plugin `version`

## License

MIT - see [LICENSE](./LICENSE)
