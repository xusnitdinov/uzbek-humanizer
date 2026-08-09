# Changelog

## 1.3.1

- Refocus `/uzbek-humanize` on website/app i18n: add Uzbek locale, translate UI/landing naturally, wire existing i18n patterns

## 1.3.0

- Add slash companion skill `/uzbek-humanize <prompt>` (`disable-model-invocation: true`)
- CLI installs both `uzbek-humanizer` and `uzbek-humanize` into agent skills dirs
- Pack layout: `cli/skills/*` (+ legacy `cli/skill` flat copy)

## 1.2.1

- CLI: `update`, `versions`, friendly `--ai` aliases (`gemini`, `roocode`, `kilocode`, `universal`)
- README: full agent install list, global/other commands, troubleshooting, marketplace status, Made by line
- Add CONTRIBUTING.md

## 1.2.0

- CLI: symlink-safe copy, project cwd containment, wipe-on-install, `uninstall`
- Prefer monorepo skill over stale `cli/skill` when developing locally
- `sync-skill` hard-fails if source missing (no silent stale publish)
- Agent globals fixed (Codex/Copilot/Amp/Goose/OpenCode/XDG) + gemini-cli / antigravity
- SKILL v1.2.0: single Router, legal/medical gotchas, Holat gate
- Content: Register gloss, bank OTP guardrails, quiz `gap`, places, morphology stack
- Eval: goldens score 53/53 in CI; triggers + bakeoff schema checks
- Scripts: safer normalize (`--check`), morph-ler back-vowel only, more AI tells
- Dual publish workflow (npmjs + GitHub Packages) with skip-if-exists

## 1.1.0

- Bundle full skill in npm package
- Multi-agent install targets, domain packs, bakeoff rubric, stiff linter
