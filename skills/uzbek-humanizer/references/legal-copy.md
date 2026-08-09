# Legal soft copy

Disclaimers, ToS-ish microcopy, consent checkboxes, soft legal UI. Not full lawyer text.

**Always mark:** `draft/native_review_required`

## When to load

- Privacy / terms links, consent lines, age gates
- "We are not liable" / limitation soft lines in UI
- Soft warnings before irreversible actions
- Not: full contracts, statutes, notarized wording

## Rules

1. Plain spoken product `Siz` - never slang, never jokey
2. Do not invent statutes, article numbers, or fake firm promises
3. Prefer short soft lines + link to full document
4. Honesty over polish - if unsure, keep draft label
5. Do not translate English legalese word-for-word into stiff UZ
6. Age gate: use the **product policy age** the user/product gives - do not invent a statute or legal age on your own

## Soft UI patterns

| Situation | Natural UZ (draft) |
|---|---|
| Agree to terms | `Foydalanish shartlariga roziman` |
| Privacy notice short | `Maʼlumotlaringiz maxfiylik siyosatiga muvofiq ishlatiladi` |
| Link to full ToS | `Batafsil shartlar` / `Foydalanish shartlari` |
| Link to privacy | `Maxfiylik siyosati` |
| Age confirm | `Men [N] yoshdan katta ekanligimni tasdiqlayman` - fill `N` from product policy, do not invent |
| Marketing consent | `Yangiliklar va takliflar olishga roziman` |
| Optional consent | `Ixtiyoriy` - do not bury as required |
| Irreversible delete | `Bu amalni bekor qilib boʻlmaydi` |
| Soft liability | `Xizmat mavjud holatda taqdim etiladi. Zarar uchun kafolat bermaymiz` (draft) |
| Not legal advice | `Bu matn huquqiy maslahat emas` |
| Cookie-ish notice | `Sayt ishlashi uchun kerakli cookie fayllardan foydalanamiz` |
| Cookie accept | `Qabul qilish` |
| Cookie reject / essential only | `Faqat zarurilari` |
| Cookie settings | `Cookie sozlamalari` |
| Cookie CMP short | `Cookie fayllarni boshqarish` |

Avoid awkward `"boricha"` as-is for liability soft lines - prefer the `mavjud holatda` pattern above (still draft).

## Hedge / review language (match honesty eval)

When copy borders on real legal advice or binding ToS:

- `Bu matn yuridik maslahat emas`
- `Zarur boʻlsa, huquqshunos bilan maslahatlashing`
- `Yuborishdan oldin yuridik jamoa koʻrib chiqing`
- Keep `draft/native_review_required` in the output holat

## Before / after

| Stiff / calque | Prefer (draft) |
|---|---|
| `Hurmatli foydalanuvchi, siz ushbu shartnomani qabul qilishga majbursiz` | `Davom etish uchun foydalanish shartlariga rozilik bildiring` |
| `We reserve the right to…` pasted | `Shartlarni yangilab turishimiz mumkin. Oʻzgarishlar haqida xabar beramiz` |
| `You hereby waive…` | Avoid. Soft: `Davom etish orqali shartlarga rozilik bildirasiz` |
| `Liability shall be limited…` essay | `Javobgarlik cheklangan. Batafsil - shartlarda` |
| `Xizmat "boricha" taqdim etiladi…` | `Xizmat mavjud holatda taqdim etiladi…` |

## Hard bans

- Invented fine print that sounds binding but was never reviewed
- Mixing peer slang into consent / liability lines
- Fake "100% kafolat" legal promises
- Full multi-page ToS generated as if final
- Invented ages / article numbers without product policy

## Output holat

`draft/native_review_required` - native / counsel review before ship.

See also `politeness.md` (full `Siz`) and `microcopy.md` (short UI body lines).
