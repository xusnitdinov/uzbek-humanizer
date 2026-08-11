# Changelog

## 1.5.1

- Expand eval goldens to **200/200** across real product domains: ecommerce, fintech/Payme/Click, delivery, mobility, telecom, SaaS, LMS, travel, auth, gov, support, permissions, privacy soft, plus anti-calque rewrites
- Earlier pass also added the first 33 product cases (100/100)

## 1.5.0

- S++ program (honest): audited preference bank (`native_verified` / `draft` / `reject`), live bakeoff + pairwise gates, collocations + loanword policy + Oria career-quiz pack
- Added `lint-screen-consistency.mjs`; expanded bilingual normalize regression tests
- Added `eval/native-review-protocol.md` - S++ marketing claim requires a real native pass (or stay labeled draft/unverified)
- **Verified in CI:** existing goldens, live-bakeoff thresholds, pairwise spoken win-rate, normalize bilingual fixtures
- **Still draft / not auto-proven:** live human native taste for every new line; self-scored human-likeness is schema+fixture quality, not a substitute for native review

## 1.4.0

- A- → S+ program: added `native-preference-bank.md` (200+ context pairs), `context-synonyms.md`, `register-presets.md`, and `oria-goldens.md` (50 anchors)
- Added cadence and literalness linters: `lint-cadence.mjs`, `lint-literalness.mjs`; wired into eval lint pass
- Hardened apostrophe safety: protects placeholders, URLs, code blocks, and mixed bilingual segments; added `tests/normalize-apostrophe.test.mjs`
- Expanded eval: `human-likeness.jsonl` with gate (avg >= 4.6 and native yes-rate >= 95%) + adversarial trap sets
- Added native reviewer fallback checklist and updated main skill with preset selector + anti-overcorrection boundaries
- Version sync to `1.4.0` (`cli`, both skills, plugin manifest)

## 1.3.3

- Oria production fixes: soft synonyms (`oʻxshamadi` vs `chiqmadi`), hard Siz for product/quiz
- Fix `normalize-apostrophe.mjs` digraph→tutuq bug; protect EN / tx() bilingual segments; `--self-test`
- Linters extract Uzbek-only text by default (no EN `ship`/`vibe` false positives); product `-asan` lint
- Top 10 hard rules + clearer sister-skill boundary; honesty: calque-safe draft, native synonym review still needed
- Eval/bakeoff cases from real Oria failures; install note for project vs global Cursor skills

## 1.3.2

- Enforce both skill packs on install; uninstall also cleans legacy agent paths
- Slash skill: stack recipes, ICU/plurals, switcher/SEO, Cyrillic/LTR QA, sister-skill edit contract
- Main skill Router handoff to `/uzbek-humanize` for site i18n; version align
- Glossary: nav, language switcher, 404, form validation; cookie CMP lines; empty-state `hech narsa`
- Eval: `web-i18n` cases/goldens/triggers/bakeoff; drop ASCII apostrophe accepts from expects
- Lint: teaching-meta skip for `ship`/`vibe`, `--matn-only`, safer normalize lintReport
- `.claude-plugin/plugin.json` for Claude marketplace submit; publish CI concurrency + 409-as-skip + tag assert
- Docs: INSTALL pins `1.3.2`, `npx skills add --skill '*'`, Claude submit steps

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
