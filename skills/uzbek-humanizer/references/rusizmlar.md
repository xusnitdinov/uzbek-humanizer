# Rusizmlar and hybrids

Three layers - do not treat all RU/EN the same.

## 1. Assimilated nouns (usually OK)

`stol`, `bilet`, `protsent`, `tema`, `obʼekt` - take Uzbek morphology: `biletim`, `protsentlar`.

## 1b. Colloquial RU nouns

User voice may keep them. Product copy rewrites them. Attested in reviews [GP-TEZKOR][GP-PAYME][GP-NASIYA][GP-OLX]: zakaz/zakas, skidka, plastik, mashennik, nomer, pilesos, registratsiya.

| User-voice OK | Product rewrite |
|---|---|
| zakaz / zakas | buyurtma |
| skidka | chegirma |
| plastik | karta |
| mashennik | firibgar |
| nomer | raqam |
| udalit qilmoq | oʻchirmoq ("endi paymeni udalit qilamz" [GP-PAYME]) |

A store listing can mention both for search ("zakaz qilish va … buyurtma qilish" [GP-TEZKOR]). Buttons and `uz.json` values use the product column. RU verb + `qilmoq` (`udalit qilmoq`) is not a kept loan.

## 2. Discourse RU (ban in default clean UZ)

| Item | Prefer |
|---|---|
| karoche | qisqasi / xoʻsh / endi |
| normalni / norm | yaxshi / mayli / qoniqarli |
| kruto / chotki | zoʻr / ajoyib |
| tipa | goʻyo / masalan / shunga oʻxshash |
| vapshe | umuman / mutlaqo |

## 3. EN hybrids

`message yozmoq`, `update qilmoq`, `support qilmoq` - prefer real UZ verbs unless the EN stem is a fixed product/tech term.

## Code-switch policy

- Default: clean standard Latin Uzbek
- Youth mix only if asked → `draft/native_review_required`
- Never add RU particles just to "sound Tashkent"
