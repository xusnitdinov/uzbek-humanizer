# Medical soft copy

Health app / appointment / symptom UI soft copy. Supportive, clear, never clinical diagnosis.

**Always mark:** `draft/native_review_required`

## When to load

- Appointment booking, reminders, clinic chat soft replies
- Symptom check-in prompts (self-report only)
- Medication reminders (schedule UI, not dosing advice)
- Not: diagnosis, prescriptions, triage that replaces a doctor

## Honesty rules

1. **Never diagnose.** No "sizda X bor", no disease labels from symptoms
2. **Never prescribe.** No dose / drug choice advice unless user supplies approved content
3. Prefer: listen, schedule, remind, urge professional care when serious
4. Full `Siz` - calm, no slang, no panic spam
5. If copy edges into clinical advice, stop and keep draft label

## Soft UI patterns

| Situation | Natural UZ (draft) |
|---|---|
| Book visit | `Qabulga yozilish` |
| Confirm visit | `Qabulingiz tasdiqlandi` |
| Reminder | `Ertaga soat 10:00 da qabulingiz bor` |
| Cancel visit | `Qabulni bekor qilish` |
| Reschedule | `Boshqa vaqtni tanlang` |
| Symptom prompt | `Bugun oʻzingizni qanday his qilyapsiz?` |
| Pain scale soft | `Ogʻriq darajasini belgilang (1-10)` |
| Med reminder | `Dori ichish vaqti keldi` (schedule only) |
| See a doctor | `Shifokorga murojaat qiling` |
| Emergency nudge | `Agar holat ogʻirlashsa - tez yordam chaqiring` |
| Not a diagnosis | `Bu tashxis emas. Faqat eslatma / yordamchi matn` |
| Data care | `Sogʻliq maʼlumotlaringiz maxfiy saqlanadi` |

## Before / after

| Risky / stiff | Prefer (draft) |
|---|---|
| `Sizda gripp aniqlandi` | `Belgilarga qarab shifokor bilan maslahatlashing` |
| `Ushbu dori sizni davolaydi` | Avoid dosing claims. `Shifokor buyurgan tartibni kuzating` |
| `Select your disease below` | `Asosiy shikoyatingizni belgilang` (self-report, not disease pick) |
| `Hurmatli bemor, simptomlaringiz tahlil qilindi` | `Javoblaringiz qabul qilindi. Kerak boʻlsa, mutaxassisga yoziling` |
| Panic: `DARHOL oʻlasiz!!!` | Calm urgency: `Holat jiddiy koʻrinsa - tez yordam chaqiring` |

## Hard bans

- Diagnosis from chat / quiz answers
- Drug names + doses invented by the model
- Guaranteed cure / "100% sogʻayasz"
- Youth slang in health surfaces
- Replacing emergency services with chatbot calm-down only

## Output holat

`draft/native_review_required` - clinician or product owner review before ship.
