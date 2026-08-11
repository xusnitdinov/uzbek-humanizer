# Native Preference Bank (v1)

Purpose: pick **what a native actually says** in context, not just grammatically safe Uzbek.

Format per row: **Context | Avoid | Prefer | Why | Confidence**

## Quiz stems (001-030)

001. quiz stem action | Toʻgʻri javobni select qiling | Toʻgʻri javobni belgilang | DTM-native stem | high  
002. quiz stem action | Toʻgʻri javobni tanlab oling | Toʻgʻri javobni belgilang | shorter and standard | high  
003. incorrect sentence | Notoʻgʻri jumlani toping | Notoʻgʻri gapni toping | `gap` is native test lane | high  
004. options below | Quyida berilgan variantni tanlang | Toʻgʻri variantni belgilang | concise stem style | high  
005. choose all | Select all that apply (paste) | Mos keladigan barcha javoblarni belgilang | no EN shadow | high  
006. row selection | Toʻgʻri javob berilgan qatordan tanlang | Toʻgʻri qatorni belgilang | less stiff | high  
007. wrong row | Xato bo‘lgan qatorni aniqlang | Xato qatorni toping | natural brevity | high  
008. fill blank | Nuqtalar o‘rnini to‘ldiring | Nuqtalar o‘rniga mos soʻzni yozing | clearer action | high  
009. explain answer | Nima sababdan degan savolga javob bering | Nega shundayligini qisqa yozing | conversational | medium  
010. polite quiz | Nima qilasan? | Nima qilasiz? | product/quiz default Siz | high  
011. polite quiz | Qayerga kirasan? | Qayerga kirasiz? | register fidelity | high  
012. before first step | Avval nima qilasan? | Avval nima qilasiz? | register fidelity | high  
013. compare options | Variantlarni taqqoslab chiqinglar | Variantlarni solishtiring | neutral and concise | high  
014. pick best | Eng optimal javobni belgilang | Eng mos javobni belgilang | avoid translated `optimal` | medium  
015. grammar item | Jumladagi xatoni toping | Gapdagi xatoni toping | local test rhythm | high  
016. phrase meaning | Berilgan iboraning ma’nosini izohlang | Berilgan ibora ma’nosini yozing | shorter | medium  
017. synonym item | Sinonim bo‘lgan variantni aniqlang | Sinonim variantni toping | concise | high  
018. antonym item | Antonim bo‘lgan so‘zni belgilang | Antonim soʻzni belgilang | remove filler | high  
019. sequence | Tartib bo‘yicha joylashtiringlar | Tartib bilan joylashtiring | clearer | medium  
020. punctuation | Tinish belgilarini to‘g‘ri qo‘llang | Tinish belgilarini toʻgʻri qoʻying | spoken natural | medium  
021. mixed script | Kirilcha javob yozing | Faqat kirillda yozing | task clarity | medium  
022. instruction tone | Quyidagi topshiriqni bajaring | Topshiriqni bajaring | avoid bureaucracy | high  
023. conditional prompt | Agar shunday bo‘lsa nima qilasan? | Agar shunday bo‘lsa, nima qilasiz? | consistent Siz | high  
024. matching | Mos keluvchi javobni tanlang | Mos javobni belgilang | less calque | high  
025. error scan | Noto‘g‘ri bo‘lgan joyni aniqlab toping | Xato joyni toping | concise | high  
026. choose sentence | Toʻgʻri gapni tanlang | Toʻgʻri gapni belgilang | standardized verb | high  
027. audio quiz | Eshitilgan matn bo‘yicha javob qaytaring | Eshitgan matnga ko‘ra javob bering | native rhythm | medium  
028. confidence line | Men aniq ishonaman, javob shu | Menimcha, toʻgʻri javob shu | uncertainty natural | medium  
029. reaction stem | Qanday yo‘l tutasan? | Qanday yoʻl tutasiz? | register | high  
030. short CTA | Bosib davom eting | Davom eting | UI shortness | high  

## Onboarding UX (031-060)

031. greet | Salom, siz platformamizga xush kelibsiz | Xush kelibsiz | concise welcome | high  
032. first step | Boshlash uchun shu yerga bosing | Boshlash uchun bosing | UI brevity | high  
033. profile prompt | Ismingizni kiritib qoʻying | Ismingizni kiriting | cleaner | high  
034. setup prompt | Sozlamalarni toʻliq qilib chiqing | Sozlamalarni yakunlang | native product verb | medium  
035. security intro | Xavfsizlik nuqtayi nazaridan tekshiramiz | Xavfsizlik uchun tekshiramiz | less bureaucratic | high  
036. terms line | Shartlar bilan tanishib chiqing | Shartlar bilan tanishing | concise imperative | high  
037. privacy line | Maxfiylik siyosati bilan tanishib chiqishingiz lozim | Maxfiylik siyosatini ko‘ring | shorter | medium  
038. consent | Men yuqoridagi hamma narsani tasdiqlayman | Shartlarga roziman | standard | high  
039. language pick | Oʻzbek tilini tanlashni amalga oshiring | Oʻzbek tilini tanlang | no heavy noun stack | high  
040. skip setup | Bu bosqichni oʻtkazib yuborishni xohlaysizmi | Bu bosqichni oʻtkazib yuborasizmi? | natural question | medium  
041. notification ask | Bildirishnomalarni yoqib qoʻymoqchimisiz | Bildirishnomalarni yoqasizmi? | direct | medium  
042. email verify | Emailingizni tasdiqlab bering | Emailingizni tasdiqlang | concise | high  
043. code sent | Kod yuborildi, tekshirib ko‘ring | Kod yuborildi | avoid redundant helper | medium  
044. resend | Kodni qayta jo‘natib yuborish | Kodni qayta yuborish | simpler | high  
045. password help | Parol kamida sakkizta belgidan tashkil topgan bo‘lishi kerak | Parol kamida 8 ta belgidan iborat bo‘lsin | native UX tone | high  
046. mismatch | Parollar bir-biriga mos emas holatda | Parollar mos kelmadi | concise | high  
047. progress | Davom etish uchun profilingizni to‘ldiring | Davom etish uchun profilingizni toʻldiring | acceptable baseline | high  
048. welcome back | Qayta kelganingizdan juda mamnunmiz | Yana kelganingizdan xursandmiz | natural warmth | medium  
049. account created | Hisob muvaffaqiyatli yaratildi | Hisob yaratildi | shorter UI | medium  
050. invite teammates | Jamoa aʼzolarini taklif qilinglar | Jamoa aʼzolarini taklif qiling | Siz lane | high  
051. quiz start | Testni boshlashga tayyormisan | Testni boshlashga tayyormisiz | Siz | high  
052. permission | Joylashuvga ruxsat berish kerak bo‘ladi | Joylashuvga ruxsat bering | direct | medium  
053. camera ask | Kamera ishlatishga ruxsat berasizmi | Kamera ruxsatini berasizmi | native phrase | medium  
054. recover account | Hisobingizni tiklash bo‘yicha keting | Hisobni tiklashni boshlang | clear action | medium  
055. google login | Google orqali autentifikatsiya qiling | Google orqali kiring | user wording | high  
056. before continue | Davom etishdan avval tanlov qiling | Davom etishdan oldin tanlang | concise | high  
057. intro paragraph | Ushbu platforma yordamida siz oʻz maqsadlaringizga erishishingiz mumkin bo‘ladi | Bu platforma maqsadingizga tezroq yetishga yordam beradi | human | high  
058. account safety | Hech kimga parolingizni aytmang iltimos | Parolingizni hech kimga bermang | stronger natural | high  
059. load state | Maʼlumotlar yuklanib bo‘linguniga qadar kutib turing | Yuklanmoqda, kuting | short UI | high  
060. done state | Barcha jarayon yakuniga yetkazildi | Tayyor | concise UI | high  

## CTA / buttons (061-090)

061. checkout | Xaridni amalga oshirish | Xarid qilish | shorter | high  
062. join now | Hoziroq qoʻshilish | Hozir qoʻshiling | direct | high  
063. start free | Bepul sinovni boshlash | Bepul sinovni boshlang | imperative | high  
064. learn more | Batafsil maʼlumotga ega bo‘lish | Batafsil | compact | high  
065. try again | Qayta urinib ko‘rish | Qaytadan urinib ko‘ring | product norm | high  
066. submit | Formani submit qilish | Yuborish | no EN verb | high  
067. save change | Oʻzgarishlarni saqlab qo‘yish | Saqlash | concise | high  
068. close modal | Ushbu oynani yopish | Yopish | concise | high  
069. delete action | Oʻchirishni amalga oshiring | Oʻchirish | concise | high  
070. continue | Keyingisiga davom etish | Davom etish | concise | high  
071. go home | Bosh sahifaga qaytish tugmasi | Bosh sahifaga qaytish | remove noun stack | high  
072. upload | Faylni yuklash amali | Yuklash | concise | high  
073. download | Yuklab olish jarayoni | Yuklab olish | concise | high  
074. share | Boshqalar bilan ulashish | Ulashish | concise | high  
075. cancel | Bekor qilishni tanlang | Bekor qilish | concise | high  
076. confirm | Tasdiqlashni bajaring | Tasdiqlash | concise | high  
077. accept | Qabul qilishni amalga oshirish | Qabul qilish | concise | high  
078. reject | Rad etishni amalga oshirish | Rad etish | concise | high  
079. add card | Kartani qoʻshib qoʻying | Kartani qoʻshing | clean | medium  
080. start quiz | Testni boshlang tugmasi | Testni boshlang | natural | high  
081. next question | Keyingi savolga oʻtishni bajaring | Keyingi savol | short | high  
082. previous | Oldingi savolga qaytib o‘tish | Oldingi savol | short | high  
083. retake | Testni qayta topshirishni boshlash | Qayta topshirish | concise | high  
084. show result | Natijani koʻrsatib berish | Natijani ko‘rish | user-like | medium  
085. get feedback | Fikr-mulohazani olish | Fikr olish | concise | medium  
086. contact us | Biz bilan bog‘lanishni boshlash | Bogʻlanish | concise | high  
087. subscribe | Obuna bo‘lishni tasdiqlang | Obuna bo‘lish | natural | high  
088. unsubscribe | Obunadan chiqishni amalga oshirish | Obunani bekor qilish | clearer | high  
089. save draft | Qoralama ko‘rinishida saqlash | Qoralamani saqlash | native | medium  
090. publish | Nashr qilishni amalga oshirish | Nashr qilish | concise | high  

## Error messages (091-120)

091. generic error | Xatolik yuzaga kelib qoldi | Xatolik yuz berdi | concise | high  
092. network | Tarmoq bilan bog‘liq muammo yuzaga keldi | Internet aloqasini tekshiring | actionable | high  
093. timeout | So‘rov muddati tugab qolgan holat | Vaqt tugadi, qayta urinib ko‘ring | natural | high  
094. password error | Kiritilgan parol noto‘g‘ri hisoblanadi | Notoʻgʻri parol | concise | high  
095. login error | Login maʼlumotlari mos kelmadi holati | Login yoki parol notoʻgʻri | user wording | high  
096. code expired | Kodning amal qilish muddati tugagan | Kod muddati tugadi | concise | high  
097. too many tries | Juda ko‘p urinish amalga oshirildi | Juda ko‘p urinish bo‘ldi | natural | medium  
098. permission denied | Ruxsat berilmagan holat kuzatildi | Ruxsat yo‘q | concise | high  
099. not found | Maʼlumot aniqlanmadi | Topilmadi | concise | high  
100. required field | Ushbu maydon toʻldirilishi talab etiladi | Bu maydon toʻldirilishi shart | natural | high  
101. invalid email | Email format jihatidan noto‘g‘ri | Email manzili notoʻgʻri | natural | high  
102. weak password | Parolning mustahkamligi past | Parol juda sodda | human | medium  
103. mismatch | Qiymatlar o‘zaro mos emas | Mos kelmadi | concise | high  
104. upload fail | Yuklash jarayoni muvaffaqiyatsiz yakunlandi | Yuklanmadi | concise | high  
105. save fail | Saqlash amali bajarilmadi | Saqlanmadi | concise | high  
106. delete fail | O‘chirish amali bajarilmadi | Oʻchirilmadi | concise | high  
107. payment fail | To‘lov jarayoni yakunlanmadi | Toʻlov amalga oshmadi | native fintech | high  
108. session expired | Sessiya muddati nihoyasiga yetdi | Sessiya tugadi, qayta kiring | actionable | high  
109. unauthorized | Avtorizatsiya muvaffaqiyatsiz | Kirish huquqi yoʻq | clearer | medium  
110. blocked account | Hisob bloklangan holatga tushdi | Hisob vaqtincha bloklandi | natural | high  
111. server error | Server tomonlama xatolik yuz berdi | Serverda xatolik bor | simple | medium  
112. conflict | Maʼlumotlar o‘rtasida ziddiyat kuzatildi | Maʼlumotlar mos kelmadi | clearer | medium  
113. unknown | Kutilmagan xato ro‘y berdi | Kutilmagan xatolik | concise | high  
114. retry helper | Qayta urinish tavsiya etiladi | Qaytadan urinib ko‘ring | native helper | high  
115. no access | Ushbu bo‘limga kirishga ruxsat etilmagan | Bu bo‘limga kira olmaysiz | human | medium  
116. 404 body | Bunday sahifa mavjud emas holatda | Kechirasiz, bunday sahifa yoʻq | natural | high  
117. 500 body | Ichki xatolik yuzaga kelgan | Ichki xatolik | concise | high  
118. otp warning | OTPni ulashmang, hatto bank xodimi so‘rasa ham | OTP-kodni hech kimga bermang | stronger | high  
119. ai caveat | AI javobi to‘liq aniq bo‘lishi kafolatlanmaydi | AI tavsiyasi xato bo‘lishi mumkin | natural honesty | high  
120. legal caveat | Mazkur axborot yuridik maslahat hisoblanmaydi | Bu yuridik maslahat emas | plain | high  

## Microcopy (121-150)

121. empty search | So‘rov bo‘yicha natija aniqlanmadi | Soʻrovingiz boʻyicha hech narsa topilmadi | natural | high  
122. empty list | Hozircha elementlar mavjud emas | Hali maʼlumot yoʻq | concise | high  
123. copied | Nusxa olish yakunlandi | Nusxa olindi | concise | high  
124. saved | Saqlash amali muvaffaqiyatli | Saqlandi | concise | high  
125. updated | Yangilash muvaffaqiyatli bajarildi | Yangilandi | concise | high  
126. removed | Olib tashlash amalga oshirildi | Oʻchirildi | concise | high  
127. loading | Jarayon yuklanmoqda holatida | Yuklanmoqda... | concise | high  
128. syncing | Sinxronizatsiya jarayoni ketmoqda | Sinxronlanmoqda | concise | medium  
129. checking | Tekshirish ishlari davom etmoqda | Tekshirilmoqda | concise | high  
130. verifying | Verifikatsiya jarayoni davom etmoqda | Tasdiqlanmoqda | concise | medium  
131. no internet | Internet aloqasi mavjud emas holatida | Internet yoʻq | concise | high  
132. reconnect | Qayta ulanishingiz kerak bo‘ladi | Qayta ulanib ko‘ring | action-oriented | high  
133. countdown | Qolgan vaqtni ko‘rsatish | Qolgan vaqt | concise | high  
134. draft saved | Qoralama saqlangan holatda | Qoralama saqlandi | concise | high  
135. feedback ask | Kontent sizga maʼqul bo‘ldimi | Sahifadagi kontent sizga maʼqul keldimi? | friendlier | high  
136. disabled state | Hozircha faol emas holat | Hozircha faol emas | concise | medium  
137. success toast | Operatsiya muvaffaqiyatli yakunlandi | Bajarildi | concise | high  
138. warning toast | Ehtiyot bo‘lish tavsiya etiladi | Diqqat qiling | natural | medium  
139. info toast | Maʼlumot uchun xabar | Eslatma | natural | medium  
140. soft pending | Kutilayotgan holat mavjud | Kutilmoqda | concise | high  
141. profile incomplete | Profil to‘liq emas holatda | Profil toʻliq emas | concise | high  
142. add phone | Telefon raqamini kiritishingiz lozim | Telefon raqamini kiriting | direct | high  
143. add name | Ismni kiritishingiz lozim | Ismingizni kiriting | direct | high  
144. choose language | Tilni tanlashni unutmang | Tilni tanlang | concise | high  
145. choose plan | Tarifni tanlashingiz kerak bo‘ladi | Tarifni tanlang | concise | high  
146. storage full | Saqlash hajmi to‘lgan holat | Joy tugadi | concise | high  
147. upload tip | Fayl hajmi katta bo‘lmasligi kerak | Fayl hajmini kamaytiring | actionable | high  
148. refresh tip | Sahifani yangilab ko‘ring | Sahifani qayta yuklang | standard | high  
149. clear filters | Filtrlarni tozalash amali | Filtrlarni tozalash | concise | high  
150. reset fields | Maydonlarni tiklash amali | Maydonlarni tozalash | natural | medium  

## Chat-assistant lines (151-180)

151. empathy | Men sizni to‘liq tushunaman | Sizni tushundim | less theatrical | high  
152. uncertainty | Men 100% aminman | Aniq aytish qiyin, lekin... | honest uncertainty | high  
153. ask detail | Batafsil maʼlumot bera olasizmi | Biroz batafsilroq yozasizmi | softer | high  
154. suggest retry | Qayta urinishni tavsiya qilaman | Qaytadan urinib ko‘ring | natural | high  
155. handoff | Men buni qo‘llab-quvvatlashga eskalatsiya qilaman | Buni support jamoasiga yuboraman | practical | medium  
156. apology | Noqulaylik uchun uzr so‘raymiz | Noqulaylik uchun uzr | concise | high  
157. clarification | Menimcha siz buni nazarda tutdingiz | Toʻgʻri tushungan boʻlsam... | natural hedge | high  
158. disagreement | Siz xato qilyapsiz | Fikringizga qoʻshilmayman | polite | high  
159. ask permission | Buni tekshirib ko‘rsam bo‘ladimi | Tekshirib ko‘rsam bo‘ladimi? | lighter | medium  
160. next step | Endilikda quyidagi amallarni bajaring | Endi shuni qiling | concise | high  
161. safety | Bu xavfsiz deb kafolat beraman | Bu odatda xavfsiz, lekin tekshirib ko‘ring | honest | high  
162. legal | Bu mutlaq huquqiy yechim | Bu yuridik maslahat emas | honesty | high  
163. medical | Men davo yozib bera olaman | Men tashxis qo‘ymayman, shifokorga murojaat qiling | safety | high  
164. encouragement | Siz albatta uddalaysiz | Siz buni uddalaysiz | simpler | medium  
165. close line | Yana savol bo‘lsa yozing | Yana savol bo‘lsa, yozing | punctuation rhythm | high  
166. bridge | Keling birga ko‘rib chiqamiz | Keling, birga ko‘rib chiqamiz | cadence | high  
167. too formal | Mazkur murojaatingiz bo‘yicha... | Soʻrovingiz bo‘yicha... | de-bureaucratize | high  
168. too EN | Men follow up qilaman | Keyinroq yana yozaman | no EN hybrid | high  
169. too RU | normalni bo‘ladi | Hammasi joyida bo‘ladi | remove RU filler | high  
170. verbose | Sizga quyidagilarni taqdim etishimiz mumkin | Sizga buni bera olamiz | concise | high  
171. soft ask | Faylni jo‘nating | Iltimos, faylni yuboring | polite | high  
172. caveat | Bu har doim ishlaydi | Ko‘pincha ishlaydi, lekin hamma holatda emas | honest | high  
173. confidence | Men haqiqatan ham shuni tavsiya qilaman | Men shuni tavsiya qilaman | drop filler | high  
174. failed context | Bu chiqmadi | Bu oʻxshamadi | context-natural | high  
175. stress context | Asabiylashgan do‘stingizni tekshiring | Stressdagi doʻstingiz holidan xabar oling | native phrase | high  
176. project fail | Loyiha portladi | Loyiha oʻxshamadi | no slang | high  
177. next try | Yana urinamiz | Yana urinib ko‘ramiz | smoother | medium  
178. close task | Taskni close qildim | Vazifani yakunladim | no EN | high  
179. summarize | Men qisqacha qilib beraman | Qisqacha aytsam... | native cadence | medium  
180. consent ask | Rozimisiz? | Rozimisiz? | already natural baseline | high  

## Marketing short/long (181-210)

181. hero line | Innovatsion yechimlar olami | Kerakli yechim - ortiqcha soʻzsiz | anti-brochure | high  
182. promise | Productivityni maksimal darajada oshiring | Ishni tezroq va osonroq qiling | plain value | high  
183. hype | Kelajagingizni unlock qiling | Oʻzingizga mos yoʻlni boshlang | no EN shadow | high  
184. cta warm | Hoziroq registratsiya qiling | Hozir roʻyxatdan oʻting | native CTA | high  
185. urgency | Bu taklifni qo‘ldan boy bermang | Chegirma tugamasidan ulgurib oling | local cadence | high  
186. social proof | Minglab foydalanuvchilar tanladi | Minglab foydalanuvchi foydalanmoqda | less ad cliché | medium  
187. feature pitch | AI-powered synergy platform | AI yordamida aniq tavsiyalar | concrete | high  
188. teaser | Siz kutgan imkoniyatlar olami | Sizga kerakli asosiy imkoniyatlar | less fluff | high  
189. onboarding ad | Bir necha soniyada revolyutsion natija | Bir necha daqiqada boshlaysiz | realistic | high  
190. enterprise line | Korporativ darajadagi transformatsiya | Jamoa uchun qulay boshqaruv | grounded | medium  
191. tone | Hurmatli foydalanuvchi... | Xush kelibsiz | de-formalize | high  
192. claim | 100% kafolat bilan... | Natija foydalanuvchiga bogʻliq | legal-safe | high  
193. compare | Bozordagi eng zo‘ri | Ko‘p ishlatiladigan qulay variantlardan biri | reduce overclaim | high  
194. invitation | Sizni chin dildan taklif etamiz | Sinab ko‘ring | concise | high  
195. callout | Dream mode yoqildi | Yangi rejim yoqildi | no cosplay | high  
196. slogan | Kelajak bugundan boshlanadi! | Bugun boshlang | shorter | medium  
197. value line | Vaqtingizni maksimal optimallashtiring | Vaqtingizni tejang | plain | high  
198. safety line | Maʼlumotlar mutlaq himoyalangan | Maʼlumotlar himoyalangan, lekin ehtiyot choralarini ham ko‘ring | honest | medium  
199. customer care | Har bir mijoz biz uchun qadrlidir | Sizning fikringiz biz uchun muhim | natural | high  
200. retention | Biz bilan qoling va o‘sishda davom eting | Xohlasangiz, davom eting | less pushy | medium  
201. long copy opener | Ushbu platforma sizning barcha muammolaringizni hal etadi | Bu platforma kundalik ishni soddalashtiradi | realistic | high  
202. long copy body | Takrorlanmas innovatsion yechimlar | Aniq va foydali funksiyalar | concrete | high  
203. long copy close | Muvoffaqiyat sari ishonch bilan odimlang | Boshlashga tayyormisiz? | conversational | high  
204. short promo | Eksklyuziv super oferta | Maxsus taklif | localized | high  
205. reminder | Kech qolmang | Bugun sinab ko‘ring | warmer | medium  
206. referral | Do‘stlaringizni invite qiling | Doʻstlaringizni taklif qiling | no EN | high  
207. paid plan | Premium rejaga upgrade qiling | Premium rejaga o‘ting | natural | high  
208. trial | 7 kunlik trial faollashtiring | 7 kunlik sinovni yoqing | localized | high  
209. trust | Bizga ishoning, hammasi zo‘r bo‘ladi | Savollaringiz bo‘lsa, ochiq yozing | less manipulative | high  
210. final CTA | Endi navbat sizda | Endi siz boshlang | direct and human | high  

---

Use this bank with `context-synonyms.md` and `register-presets.md`. If unsure, prefer `draft/native_review_required`.
