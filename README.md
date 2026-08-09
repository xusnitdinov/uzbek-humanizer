# uzbek-humanizer

**Agent Skill that makes AI sound like it actually speaks Latin Uzbek.**

[![npm](https://img.shields.io/npm/v/uzbek-humanizer-cli?style=flat-square&color=cb3837)](https://www.npmjs.com/package/uzbek-humanizer-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)
[![Agent Skills](https://img.shields.io/badge/Agent%20Skills-compatible-111111?style=flat-square)](https://agentskills.io)
[![eval](https://img.shields.io/badge/eval-53%2F53%20goldens-2ea44f?style=flat-square)](./skills/uzbek-humanizer/eval/)

> AI is fluent. Latin Uzbek from models is still weirdly stiff - wrong apostrophes, English word order, broken suffixes, `Siz` mixed with `-san`, and calques nobody in Toshkent says.

**uzbek-humanizer** is a real [Agent Skills](https://agentskills.io) skill (not a README cosplay). Install once. Cursor, Claude, Codex, Windsurf, Copilot and friends load it when you ask for Uzbek copy - then rewrite like a human.

```text
Before                         After
─────────────────────────────  ─────────────────────────────
Men haqiqatan ham bu           Bu ilova menga juda yoqadi.
ilovani yoqtiraman.            Toʻgʻri javobni belgilang.
To'g'ri javobni select
qiling.
```

Honest bar: **much more natural**. Heavy slang / legal / medical still needs a native pass.

---

## Install

### Option A - skills CLI (portable)

```bash
npx skills add xusnitdinov/uzbek-humanizer
```

### Option B - branded CLI (npmjs, recommended)

Package name: **`uzbek-humanizer-cli`** (bin: `uzhumanizer`).

```bash
# Install CLI globally
npm install -g uzbek-humanizer-cli

# Go to your project
cd /path/to/your/project

# Install for your AI assistant
uzhumanizer init --ai claude        # Claude Code
uzhumanizer init --ai cursor        # Cursor
uzhumanizer init --ai windsurf      # Windsurf
uzhumanizer init --ai antigravity   # Antigravity
uzhumanizer init --ai copilot       # GitHub Copilot
uzhumanizer init --ai kilo          # Kilo Code (alias: kilocode)
uzhumanizer init --ai codex         # Codex CLI
uzhumanizer init --ai roo           # Roo Code (alias: roocode)
uzhumanizer init --ai gemini-cli    # Gemini CLI (alias: gemini)
uzhumanizer init --ai trae          # Trae
uzhumanizer init --ai opencode      # OpenCode
uzhumanizer init --ai continue      # Continue
uzhumanizer init --ai cline         # Cline
uzhumanizer init --ai amp           # Amp
uzhumanizer init --ai goose         # Goose
uzhumanizer init --ai agents        # universal .agents/skills (alias: universal)
uzhumanizer init --ai all           # every supported target
```

#### Global install (available for all projects)

```bash
uzhumanizer init --ai claude --global     # ~/.claude/skills/
uzhumanizer init --ai cursor --global     # ~/.cursor/skills/
uzhumanizer init --ai agents --global     # XDG agents/skills (universal)
uzhumanizer init --ai all --global        # all supported agents
```

#### Other CLI commands

```bash
uzhumanizer versions                      # CLI + skill versions
uzhumanizer update --ai cursor            # refresh skill files from packaged CLI
uzhumanizer update --ai cursor --global   # refresh global install
uzhumanizer uninstall --ai cursor         # remove project install
uzhumanizer uninstall --ai cursor --global
uzhumanizer uninstall --ai all --global
```

Package: [npmjs.com/package/uzbek-humanizer-cli](https://www.npmjs.com/package/uzbek-humanizer-cli)

After install, open a **new** Agent chat and try:

```text
/uzbek-humanize add Uzbek language to this web app - natural Latin Uzbek UI
```

<details>
<summary>GitHub Packages mirror (optional)</summary>

Scoped `@xusnitdinov/uzbek-humanizer-cli` - needs a GitHub token with `read:packages`. Prefer npmjs for normal installs.

```bash
npm i -g @xusnitdinov/uzbek-humanizer-cli --registry=https://npm.pkg.github.com
uzhumanizer init --ai all --global
```

</details>

<details>
<summary>From source</summary>

```bash
git clone https://github.com/xusnitdinov/uzbek-humanizer.git
cd uzbek-humanizer/cli
npm install -g .
uzhumanizer init --ai all --global
```

</details>

More detail: [INSTALL.md](./INSTALL.md) · [CONTRIBUTING.md](./CONTRIBUTING.md) · [CHANGELOG.md](./CHANGELOG.md)

---

## How to invoke

### Slash (website / app → natural Uzbek)

In Agent chat, type `/uzbek-humanize` then your task - e.g. add Uzbek to an English site:

```text
/uzbek-humanize add Uzbek to this site - translate UI strings and landing to natural o'zbekcha
/uzbek-humanize create uz.json from en.json (keep keys, natural Latin Uzbek values)
/uzbek-humanize wire next-intl for uz-UZ and translate the navbar + home hero
```

The skill inspects your i18n setup (locale files, next-intl, react-i18next, hardcoded EN, …), then adds / translates **natural Latin Uzbek** - not stiff machine translation.

Also available: `/uzbek-humanizer` for broader Uzbek copy work (auto + slash).

### Natural language (no slash)

Just ask - the main skill still auto-triggers:

```text
Humanize this Uzbek: ...
matnni tabiiylashtirish
Localize these buttons to o'zbekcha
```

---

## When the agent should use it

| You say something like… | Skill leans on |
|---|---|
| “Humanize this Uzbek” / `matnni tabiiylashtirish` | calques + before/after |
| “Localize these buttons to oʻzbekcha” | UI glossary + microcopy |
| “DTM uslubida quiz stem” | quiz glossary |
| Bank / OTP / SMS warning | bank-sms + politeness |
| Soft ToS / consent UI | legal-copy (**draft**) |
| Appointment / symptom UI | medical-copy (**draft**, never diagnose) |
| “Faqat kirillcha yoz” | cyrillic (Latin is default otherwise) |
| Youth / Telegram tone | youth-slang (**only when asked**) |

---

## Quick demo

**Ask**

> Localize to natural Uzbek Latin: Save / Cancel / No results found / Invalid password

**Expect**

```text
Saqlash
Bekor qilish
Soʻrovingiz boʻyicha hech narsa topilmadi
Notoʻgʻri parol
```

**Ask**

> Humanize: Siz eshikni yopishga qarshi emasmisiz? Keyinroq urinib ko'ring.

**Expect**

```text
Iltimos, eshikni yopib qoʻying. Keyinroq qayta urinib koʻring.
```

**Output contract**

```markdown
## Matn
[final Uzbek]

## Oʻzgarishlar
- ...

## Holat
final | draft/native_review_required
```

---

## What you get

| Piece | Job |
|---|---|
| `SKILL.md` (`uzbek-humanizer`) | Auto + slash brain - triggers, router, gotchas |
| `SKILL.md` (`uzbek-humanize`) | Slash `/uzbek-humanize` - localize sites/apps into natural Uzbek |
| `references/` | On-demand packs under the main skill |
| `scripts/` | Apostrophe normalize, banned + stiff linters, eval runner |
| `examples/` | Product UI, quiz, marketing rewrites |
| `eval/` | 53 golden cases, trigger queries, native bakeoff rubric |
| `cli/` | `uzhumanizer` multi-agent installer (skill bundled) |

Progressive disclosure ([Agent Skills](https://agentskills.io) style):

1. Agent sees **name + description** (~100 tokens)
2. Activates → loads **SKILL.md**
3. Loads **references / scripts** only when the router says *when*

---

## What it fixes

| Problem | Direction |
|---|---|
| ASCII `'` spam | ʻ / ʼ orthography |
| `berdimga`, `kitoblerimiz` | morphology stack order |
| EN word-order mush | natural SOV |
| `chelakni tepdi` | real meaning, not literal idioms |
| `Siz` + `-san` | one address lane |
| Stiff UI / quiz / bank SMS | product corpora (Payme / my.gov / DTM-ish) |
| Fake EN cool (`ship`, `vibe`, `portladi`) | banned |
| Youth slang by default | **off** unless you ask |

---

## Quality / eval

```bash
npm run test:eval
```

Scores goldens, validates triggers + bakeoff schema, lints example Matn.

Bakeoff (human): [`skills/uzbek-humanizer/eval/bakeoff-rubric.md`](./skills/uzbek-humanizer/eval/bakeoff-rubric.md)

```bash
node skills/uzbek-humanizer/scripts/lint-stiff.mjs path/to/draft.txt
node skills/uzbek-humanizer/scripts/normalize-apostrophe.mjs --check path/to/draft.txt
```

---

## Troubleshooting

### `uzhumanizer: unknown command 'update'` / `'versions'`

Your global CLI is old. Upgrade, then retry:

```bash
npm install -g uzbek-humanizer-cli@latest
uzhumanizer versions
```

### `uzhumanizer uninstall` says missing / nothing removed

Installs are scoped to **project cwd** unless you used `--global`.

```bash
# Option A - run from the project where you installed
cd /path/to/your/project
uzhumanizer uninstall --ai cursor

# Option B - remove global install
uzhumanizer uninstall --ai cursor --global

# Option C - manual
#   .cursor/skills/uzbek-humanizer
#   .claude/skills/uzbek-humanizer
#   .agents/skills/uzbek-humanizer
```

### Skill installed but agent ignores Uzbek requests

1. Open a **new** agent chat (skills are often loaded at session start)
2. Confirm the folder exists: `.cursor/skills/uzbek-humanizer/SKILL.md` (or your agent’s path)
3. Ask with a clear trigger: `Humanize this Uzbek: …` / `matnni tabiiylashtirish`
4. Refresh files after upgrading the npm package: `uzhumanizer update --ai cursor`

### `npm publish` / install from GitHub Packages fails auth

Use **npmjs** for normal installs. GitHub Packages needs a token with `read:packages` and an `.npmrc` scope mapping for `@xusnitdinov`.

---

## Marketplaces (honest status)

| Channel | Status |
|---|---|
| **npmjs** `uzbek-humanizer-cli` | Live - preferred install |
| **GitHub Packages** `@xusnitdinov/uzbek-humanizer-cli` | Live mirror |
| **`npx skills add`** | Live - Agent Skills discovery |
| **Claude Code plugin marketplace** | Not submitted yet - needs a `.claude-plugin` packaging pass + [submit form](https://platform.claude.com/plugins/submit). Doable next. |
| **Cursor “marketplace”** | No public Cursor Skills store like Claude’s plugin directory. Distribution is GitHub + `npx skills` + this CLI. |

---

## Repo map

```text
uzbek-humanizer/
├── skills/
│   ├── uzbek-humanizer/      ← main skill (auto + /uzbek-humanizer)
│   └── uzbek-humanize/       ← slash companion (/uzbek-humanize …)
├── cli/                      ← uzhumanizer (npm)
├── .github/workflows/
├── INSTALL.md
├── CONTRIBUTING.md
├── CHANGELOG.md
├── LICENSE
└── README.md
```

We intentionally **don’t** ship UI/UX Pro Max extras (`gallery/`, `screenshots/`, `stack/`, `CODE_OF_CONDUCT.md`, etc.). Those fit a huge multi-platform design product - not a focused Uzbek copy skill.

---

## Honesty

- Default voice: spoken clear **product / student** Latin Uzbek
- Not a presidential speech generator
- Not a full slang dictionary
- Not "native-perfect forever"
- Invented idioms / maqollar are banned on purpose
- Legal / medical / slang-heavy / invented bank SMS → `draft/native_review_required`
- Cyrillic only when you ask

---

## License

[MIT](./LICENSE) © 2026 [xusnitdinov](https://github.com/xusnitdinov)

Made by **Xusnitdinov Azizbek**

---

<p align="center">
  <b>Oʻzbekcha yoz. Odamiy yoz.</b><br/>
  <sub>Install the skill. Let the agents catch up.</sub>
</p>
