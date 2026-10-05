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

## User → company / team

Users address a company in the plural, not singular Siz. Both `-ing` and `-inglar` are polite. Do not "fix" `-inglar` down to `-ing`.

Attested [GP-PAYME]: "iltimos qulaylashtiringlar", "tushintirib beringlar", "Humans ga ham toʻlov qilishni qoʻshinglar", "nega pul yechib olasizlar". Colloquial: "eskisini qaytarila" [GP-PAYME], "reklama qoymela" (= qoʻymanglar) [GP-OLX].

`register-presets.md` preset `user-voice` is for persona text, sample reviews, and testimonials. Product buttons stay short Siz (`Yozing`), not `-inglar`, unless the surface is the user's own voice.

## Generic sen is not rudeness

Inside a quote or a testimonial, keep sen: "nasiyadan limit olasan 800 ming uni uch oyda 1mln200 ming qilib qaytarasan" [GP-NASIYA]. Reported speech stays as spoken: "Fuqaro bilan ogʻzingdan bol tomib gaplashishing kerak" [DARYO].

In product/FAQ copy, use Siz or an impersonal form ("limit olasiz / limit olinadi"). Do not copy the review's `-asan` into the FAQ.

## Sen to a brand

"Sen dahosan click" plus "sizlardan" in one review is fandom (love or anger), not a model for product output [GP-CLICK]. Do not generate it.

## Soft disagreement (peers)

Attested Wikipedia-talk register [W-TAKLIF], not a scolding:

- "Siz ochgan muhokama xulosa qilib boʻlingan edi, shuning uchun yangi muhokama ochdim."
- "Menimcha, qoʻgʻirchoq bilan adashtiryapsiz."
- "Buni ham sozlab qoʻysangiz, yaxshi boʻlardi."
- "Hormang, @Jamshid aka."
- "Ideal yechim emas, ammo nachora."

Paper formulas, not live-verified here [AJPS]: "Kechirasiz, lekin...", "Boshqacha fikr ham boʻlishi mumkin". Do not write "Siz xato qilyapsiz" / "qatʼiyan qoʻshilmayman".

## Siz casing

One casing per surface. Corporate replies mix "Sizga yordam berishga" and a pronounless line, and the typo "SIz" [GP-HAMBI]. Flag `SIz`. Do not invent a mid-sentence capital Siz if the rest of the surface is lowercase, and do not strip a brand's chosen capital if that surface is consistent.

Sentence-final `-sangiz.` is a normal support request: "batafsil yozib yuborsangiz." [GP-CLICK]. Prefer that over "aniqlashtirishingizni soʻraymiz".

## Not yet

Ironic or passive-aggressive Siz is only a paper claim [AJPS]. No live example. Do not golden it.
