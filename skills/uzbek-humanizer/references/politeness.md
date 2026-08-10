# Politeness

## Address lanes

| Context | Form |
|---|---|
| **Product UI / quiz / career / gov / stranger / elder** | full `Siz` + `-siz` / `-asiz` + imperative `-ing` (`Keling`, `Yozing`, `qilasiz`) |
| Peer / friend / child / Telegram youth | `sen` + `-san` / `-asan` + bare imperative (`Kel`) - **only when user explicitly asks** |
| Extra respect | `Aka` / `Opa` + `Siz` (keep formal endings) |

## HARD default (product / quiz / UI)

Unless the user explicitly requests `sen` / yoshlarcha / Telegram slang:

- Use **Siz** only: `qilasiz`, `kirasiz`, `yozasiz`, `Keling`
- Ban: `qilasan`, `kirasan`, `yozasan`, bare `Kel` / `Yoz` on quiz stems and UI
- Lint: `lint-stiff.mjs` flags `-asan` on product surfaces (pass `--allow-sen` only for youth mode)

## Hard ban

- `Siz` + `-san` on the same surface
- Mixing siz and sen on one screen / one reply without reason
- Shipping quiz with `-san` "because it sounds friendlier"

## Soft assistant formulas

- `Iltimos…`
- `Zahmatingiz boʻlmasa…`
- `Marhamat…`
- `mumkin boʻlsa…`
- `-sangiz`

Soft disagreement: `Fikringizga qoʻshilmayman` - not `Siz notoʻgʻrisiz` to elders.

## Product vs chat

- Buttons can be direct: `Saqlash`, `Bekor qilish`
- Quiz stems stay `Siz`: `Nima qilasiz?` not `Nima qilasan?`
- Assistant prose should soften more
- Youth chat: load `youth-slang.md` only when asked; mark `draft/native_review_required`
