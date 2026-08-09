# Bank / OTP / SMS register

Security copy: plain, urgent, full `Siz`, zero slang.

## Attested HUMO / finlit patterns

- SMS-xabarnoma informs about `kartadagi mablagʻlar harakati`
- OTP: one-time six-digit code; HUMO short number `13131`
- Phone format: `+998 XX YYYYYYY`
- PIN-kod ≠ OTP-kod

## Safety phrases

- `OTP-kod maxfiy maʼlumot hisoblanadi`
- `Uni hech qachon uchinchi shaxslarga bermang, hatto agar ular oʻzini bank yoki toʻlov tizimi xodimi deb tanishtirsa ham`
- `Agar kimdir sizdan OTP-kodni soʻrasa - bu firibgarlik holati boʻlishi mumkin`
- `Bank xodimi telefon orqali OTP soʻramaydi`
- `SMS dagi havolaga oʻtmang`
- `Qoʻngʻiroqni tugating va bankning rasmiy raqamiga qayta qoʻngʻiroq qiling`
- `Karta raqamining toʻliqini yoki CVV ni hech kimga yubormang`

## Neutral OTP SMS skeleton (structure only)

Use this shape when drafting; do not invent bank-specific wording as final:

```
[Bank / xizmat]: kod [XXXXXX]. [Qisqa maqsad: kirish / toʻlov / tasdiqlash]. Kodni hech kimga bermang.
```

Pieces: **code** + **purpose** + **don't share**. Keep numbers clear. No jokes. No marketing fluff.

**Any invented full bank SMS body = `draft/native_review_required`.** Prefer attested safety lexicon over fake templates that look official.

## Terminal / card errors (plain)

- `PIN-kod notoʻgʻri`
- `Mablagʻlar yetarli emas`
- `Kartaga pul kelib tushmadi`
- `Karta amal qilish muddati tugadi`

## Rules

1. Do not invent exact multi-bank SMS body templates you have not seen
2. Prefer attested safety lexicon + clear structure
3. Never jokey tone for money / OTP
4. Keep numbers and codes visually clear
5. Staff never asks OTP by phone; hang up and use the official number
6. Never instruct users to send full card number or CVV
7. Mark invented SMS as draft until product/security review

See also `politeness.md` (full `Siz`) and `ui-glossary.md` for short labels.
