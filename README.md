# uzbek-humanizer

**Agent Skill that makes AI sound like it actually speaks Latin Uzbek.**

[![npm](https://img.shields.io/npm/v/uzbek-humanizer-cli?style=flat-square&color=cb3837)](https://www.npmjs.com/package/uzbek-humanizer-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)
[![Agent Skills](https://img.shields.io/badge/Agent%20Skills-compatible-111111?style=flat-square)](https://agentskills.io)
[![eval](https://img.shields.io/badge/eval-53%2F53%20goldens-2ea44f?style=flat-square)](./skills/uzbek-humanizer/eval/)

> AI is fluent. Latin Uzbek from models is still weirdly stiff - wrong apostrophes, English word order, broken suffixes, `Siz` mixed with `-san`, and calques nobody in Toshkent says.

**uzbek-humanizer** is a real [Agent Skill](https://agentskills.io) (not a README cosplay). Install once. Cursor, Claude, Codex, Windsurf, Copilot and friends load it when you ask for Uzbek copy - then rewrite like a human.

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

### Option B - branded CLI (npmjs, preferred)

Bundles the full skill. Works without cloning the repo.

```bash
npm i -g uzbek-humanizer-cli
uzhumanizer init --ai cursor          # this project
uzhumanizer init --ai all --global    # every supported agent
```

Uninstall:

```bash
uzhumanizer uninstall --ai cursor
npm uninstall -g uzbek-humanizer-cli
```

Package: [npmjs.com/package/uzbek-humanizer-cli](https://www.npmjs.com/package/uzbek-humanizer-cli)

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

More detail: [INSTALL.md](./INSTALL.md) · changelog: [CHANGELOG.md](./CHANGELOG.md)

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

After install, just ask. You do not need to say the skill name.

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
| `SKILL.md` | Lean agent brain - triggers, router, gotchas, Holat gate |
| `references/` | On-demand packs: orthography, morphology, UI, quiz, bank, legal, medical, marketing, slang… |
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

Grounded in published LLM Uzbek error research (morphology is a huge failure bucket) plus product microcopy habits.

---

## CLI cheatsheet

```bash
uzhumanizer init --ai <agent> [--global]
uzhumanizer uninstall --ai <agent> [--global]
uzhumanizer --help
```

`--ai` values: `cursor` · `claude` · `codex` · `copilot` · `windsurf` · `cline` · `roo` · `amp` · `goose` · `trae` · `kilo` · `opencode` · `continue` · `gemini-cli` · `antigravity` · `agents` · `all`

---

## Quality / eval

From the repo root:

```bash
npm run test:eval
```

Scores `eval/goldens.json` against 53 cases, validates trigger queries + bakeoff schema, and lints example Matn.

Native bakeoff protocol (human scoring): [`skills/uzbek-humanizer/eval/bakeoff-rubric.md`](./skills/uzbek-humanizer/eval/bakeoff-rubric.md)

Draft helpers:

```bash
node skills/uzbek-humanizer/scripts/lint-stiff.mjs path/to/draft.txt
node skills/uzbek-humanizer/scripts/normalize-apostrophe.mjs --check path/to/draft.txt
```

---

## Repo map

```text
uzbek-humanizer/
├── skills/uzbek-humanizer/   ← the skill
│   ├── SKILL.md
│   ├── references/
│   ├── examples/
│   ├── eval/
│   └── scripts/
├── cli/                      ← uzhumanizer (npm package)
├── INSTALL.md
├── CHANGELOG.md
└── README.md
```

---

## Honesty

- Default voice: spoken clear **product / student** Latin Uzbek
- Not a presidential speech generator
- Not a full slang dictionary
- Not “native-perfect forever”
- Invented idioms / maqollar are banned on purpose
- Legal / medical / slang-heavy / invented bank SMS → `draft/native_review_required`
- Cyrillic only when you ask

If you want youth Telegram mix, say so - the skill will label draft.

---

## License

[MIT](./LICENSE) © 2026 [xusnitdinov](https://github.com/xusnitdinov)

---

<p align="center">
  <b>Oʻzbekcha yoz. Odamiy yoz.</b><br/>
  <sub>Install the skill. Let the agents catch up.</sub>
</p>
