# Context-aware synonyms

Same English source can map to different Uzbek depending on context.

## Failed outcome verbs matrix

| Context | Prefer | Avoid default | Notes |
|---|---|---|---|
| Team dynamics / group project | `oʻxshamadi` | `chiqmadi`, `portladi` | “didn’t work out” socially |
| Plan execution | `amalga oshmadi` | `chiqmadi` | concrete process failure |
| App bug / feature output | `chiqmadi`, `ishlamadi` | `oʻxshamadi` | technical behavior |
| Device / startup | `ochilmadi`, `yoqilmadi` | `chiqmadi` generic | specific action verbs |
| Relationship / cooperation | `yurishmadi`, `kelisha olmadik` | `chiqmadi` | interpersonal |
| Exam performance | `yaxshi oʻtmadi` | `chiqmadi` | outcome tone |
| Payment flow | `amalga oshmadi` | `chiqmadi` | fintech norm |
| Delivery flow | `kechikdi`, `yetib kelmadi` | `chiqmadi` | logistics specificity |

## Emotion verbs matrix

| English hint | Product/quiz prefer | Assistant-friendly prefer | Avoid |
|---|---|---|---|
| stressed | `stressdagi` | `tashvishdagi` | `nervniy` |
| worried | `xavotirdagi` | `xavotirlanayotgan` | RU fillers |
| upset | `xafa bo‘lgan` | `ko‘ngli qolgan` | literal calques |
| angry | `jahli chiqqan` | `ranjigan` (soft) | over-legal phrasing |
| excited | `hayajonlangan` | `juda qiziqqan` | EN hype |
| confused | `tushunmay qolgan` | `aniqlik kerak` | “confused holat” |
| tired | `charchagan` | `toliqqan` | poetic overreach |
| overwhelmed | `bosim ostida` | `hammasi ustma-ust` | literal EN shadows |

## Polite request matrix

| Strength | Prefer | Use where | Avoid |
|---|---|---|---|
| Direct UI | `Saqlang` / `Yozing` | buttons/stems | `iltimos` everywhere |
| Soft request | `Iltimos, ...` | helper/body text | bureaucratic long forms |
| Very polite | `Zahmatingiz boʻlsa, ...` | support / elders | product button labels |
| Collaborative | `Keling, ...` | assistant guidance | bare `Kel` in product |
| Optional ask | `Xohlasangiz, ...` | low-pressure flows | pushy imperative |

## Certainty / uncertainty matrix

| Situation | Prefer | Why |
|---|---|---|
| Verified deterministic UI event | `... bo‘ldi`, `... yaratildi` | confidence is correct |
| Heuristic suggestion | `ko‘pincha`, `odatda` | avoids false certainty |
| Legal/medical boundary | `Bu maslahat emas` + draft | honesty gate |
| User-reported issue | `ko‘rinishidan`, `ehtimol` | avoids blame tone |
| Debug speculation | `sinab ko‘ring`, `tekshirib ko‘raylik` | collaborative |

## Mapping rule

1. Determine **surface** (bug, social, quiz, legal, medical).
2. Choose verb from the matrix, not from single global default.
3. Re-check register (`Siz` for product/quiz).
4. If two mappings are plausible, output draft + note in Holat.
