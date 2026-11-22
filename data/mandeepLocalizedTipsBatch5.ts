import type { Tip } from "@/data/tipLibrary";
type Copy = Pick<Tip, "topic" | "nudge" | "explanation" | "tags">;

// Fifth multilingual batch: balanced nutrition and traditional tulsi tea, with cautious wording.
export const MANDEEP_LOCALIZED_TIPS_BATCH5: Record<string, Record<string, Copy>> = {
ar: {
"NO-F-005": { topic:"وجبات غنية بالبروتين", nudge:"حاولي إضافة مصدر للبروتين إلى كل وجبة، مثل البيض أو السمك أو البقول أو التوفو.", explanation:"يساعد البروتين في بناء العضلات وصيانة الأنسجة، كما يوفّر عناصر يحتاجها الجسم. وزّعي مصادره على الوجبات إذا كان ذلك يناسبك؛ لا توجد كمية واحدة أو خطة مرتبطة بمرحلة الدورة تناسب الجميع.", tags:["البروتين","التغذية"] },
"NO-F-006": { topic:"شاي التولسي", nudge:"إذا أحببتِ، جرّبي كوبًا من شاي التولسي اليوم، طازجًا أو من كيس الشاي.", explanation:"يُستخدم التولسي تقليديًا في الأيورفيدا. توجد أبحاث أولية حول تأثيراته المحتملة، لكن الأدلة على فوائده الصحية ما زالت محدودة. استمتعي به كمشروب إذا كان مناسبًا لكِ، ولا تعتبريه علاجًا للتوتر أو بديلًا للرعاية الطبية.", tags:["التولسي","مشروب عشبي"] }
},
hi: {
"NO-F-005": { topic:"प्रोटीन युक्त भोजन", nudge:"हर भोजन में अंडे, मछली, दालें, टोफू या पनीर जैसे प्रोटीन का स्रोत शामिल करें।", explanation:"प्रोटीन मांसपेशियों के निर्माण और ऊतकों की मरम्मत में मदद करता है और शरीर को ज़रूरी पोषक तत्व देता है। यदि सुविधाजनक हो, तो इसे दिन के अलग-अलग भोजन में बाँटें। हर व्यक्ति के लिए एक ही मात्रा या चक्र के चरण पर आधारित योजना सही नहीं होती।", tags:["प्रोटीन","पोषण"] },
"NO-F-006": { topic:"तुलसी की चाय", nudge:"पसंद हो तो आज ताज़ी तुलसी या टी-बैग से बनी एक कप चाय लें।", explanation:"आयुर्वेद में तुलसी का पारंपरिक उपयोग होता रहा है। इसके संभावित प्रभावों पर शुरुआती शोध है, लेकिन स्वास्थ्य लाभों के प्रमाण अभी सीमित हैं। इसे चाहें तो पेय की तरह लें; इसे तनाव का इलाज या चिकित्सकीय देखभाल का विकल्प न मानें।", tags:["तुलसी","हर्बल पेय"] }
},
bn: {
"NO-F-005": { topic:"প্রোটিনসমৃদ্ধ খাবার", nudge:"প্রতিটি খাবারে ডিম, মাছ, ডাল, টোফু বা পনিরের মতো প্রোটিনের উৎস রাখুন।", explanation:"প্রোটিন পেশি গঠন ও টিস্যু মেরামতে সাহায্য করে এবং শরীরের প্রয়োজনীয় পুষ্টি জোগায়। সুবিধা হলে দিনের বিভিন্ন খাবারে প্রোটিন ভাগ করে নিতে পারেন। সবার জন্য একই পরিমাণ বা মাসিক চক্রের ধাপভিত্তিক পরিকল্পনা উপযুক্ত নয়।", tags:["প্রোটিন","পুষ্টি"] },
"NO-F-006": { topic:"তুলসী চা", nudge:"ভালো লাগলে আজ তাজা তুলসী বা টি-ব্যাগ দিয়ে এক কাপ চা তৈরি করুন।", explanation:"আয়ুর্বেদে তুলসীর ঐতিহ্যগত ব্যবহার রয়েছে। এর সম্ভাব্য প্রভাব নিয়ে প্রাথমিক গবেষণা আছে, তবে স্বাস্থ্যগত উপকারের প্রমাণ এখনও সীমিত। পছন্দ হলে পানীয় হিসেবে উপভোগ করুন; এটিকে মানসিক চাপের চিকিৎসা বা চিকিৎসাসেবার বিকল্প ভাববেন না।", tags:["তুলসী","ভেষজ পানীয়"] }
},
ms: {
"NO-F-005": { topic:"Hidangan kaya protein", nudge:"Sertakan sumber protein dalam setiap hidangan, seperti telur, ikan, kekacang, tauhu atau paneer.", explanation:"Protein membantu membina otot dan membaiki tisu serta membekalkan nutrien yang diperlukan tubuh. Jika sesuai, agihkan sumber protein sepanjang hari. Tiada satu jumlah atau pelan mengikut fasa kitaran yang sesuai untuk semua orang.", tags:["Protein","Pemakanan"] },
"NO-F-006": { topic:"Teh tulsi", nudge:"Jika suka, cuba secawan teh tulsi hari ini, menggunakan daun segar atau uncang teh.", explanation:"Tulsi digunakan secara tradisional dalam Ayurveda. Terdapat penyelidikan awal tentang kemungkinan kesannya, tetapi bukti manfaat kesihatan masih terhad. Nikmatinya sebagai minuman jika sesuai; jangan anggapnya sebagai rawatan tekanan atau pengganti penjagaan perubatan.", tags:["Tulsi","Minuman herba"] }
},
vi: {
"NO-F-005": { topic:"Bữa ăn giàu protein", nudge:"Hãy thêm nguồn protein vào mỗi bữa, chẳng hạn trứng, cá, các loại đậu, đậu phụ hoặc paneer.", explanation:"Protein hỗ trợ xây dựng cơ và sửa chữa mô, đồng thời cung cấp dưỡng chất cơ thể cần. Nếu phù hợp, bạn có thể phân bổ protein trong các bữa ăn cả ngày. Không có một lượng hay kế hoạch theo giai đoạn chu kỳ phù hợp với tất cả mọi người.", tags:["Protein","Dinh dưỡng"] },
"NO-F-006": { topic:"Trà tulsi", nudge:"Nếu thích, hôm nay hãy thử một tách trà tulsi từ lá tươi hoặc túi trà.", explanation:"Tulsi được sử dụng theo truyền thống trong Ayurveda. Một số nghiên cứu ban đầu đang tìm hiểu tác động tiềm năng của loại cây này, nhưng bằng chứng về lợi ích sức khỏe vẫn còn hạn chế. Bạn có thể thưởng thức như một loại đồ uống nếu phù hợp; đừng xem đây là cách điều trị căng thẳng hay thay thế chăm sóc y tế.", tags:["Tulsi","Trà thảo mộc"] }
},
th: {
"NO-F-005": { topic:"มื้ออาหารที่มีโปรตีน", nudge:"ลองเพิ่มแหล่งโปรตีนในทุกมื้อ เช่น ไข่ ปลา ถั่ว เต้าหู้ หรือพาเนียร์", explanation:"โปรตีนช่วยสร้างกล้ามเนื้อและซ่อมแซมเนื้อเยื่อ พร้อมให้สารอาหารที่ร่างกายต้องการ หากสะดวกอาจแบ่งรับประทานในมื้อต่าง ๆ ตลอดวัน ไม่มีปริมาณหรือแผนตามระยะรอบเดือนแบบเดียวที่เหมาะกับทุกคน", tags:["โปรตีน","โภชนาการ"] },
"NO-F-006": { topic:"ชาทุลซี", nudge:"หากชอบ วันนี้ลองดื่มชาทุลซีสักถ้วยจากใบสดหรือถุงชา", explanation:"ทุลซีมีการใช้ตามประเพณีในศาสตร์อายุรเวท และมีงานวิจัยเบื้องต้นศึกษาผลที่อาจเกิดขึ้น แต่หลักฐานด้านประโยชน์ต่อสุขภาพยังมีจำกัด ดื่มเป็นเครื่องดื่มได้หากเหมาะกับคุณ แต่อย่าถือว่าเป็นการรักษาความเครียดหรือใช้แทนการดูแลทางการแพทย์", tags:["ทุลซี","เครื่องดื่มสมุนไพร"] }
},
id: {
"NO-F-005": { topic:"Makanan kaya protein", nudge:"Sertakan sumber protein dalam setiap waktu makan, seperti telur, ikan, kacang-kacangan, tahu, atau paneer.", explanation:"Protein membantu membangun otot dan memperbaiki jaringan serta menyediakan nutrisi yang dibutuhkan tubuh. Jika cocok, bagikan asupan protein ke beberapa waktu makan sepanjang hari. Tidak ada satu jumlah atau rencana berdasarkan fase siklus yang sesuai untuk semua orang.", tags:["Protein","Nutrisi"] },
"NO-F-006": { topic:"Teh tulsi", nudge:"Jika suka, cobalah secangkir teh tulsi hari ini, dari daun segar atau kantong teh.", explanation:"Tulsi digunakan secara tradisional dalam Ayurveda. Ada penelitian awal tentang kemungkinan efeknya, tetapi bukti manfaat kesehatannya masih terbatas. Nikmati sebagai minuman jika cocok untuk Anda; jangan menganggapnya sebagai pengobatan stres atau pengganti perawatan medis.", tags:["Tulsi","Minuman herbal"] }
},
zh: {
"NO-F-005": { topic:"富含蛋白质的餐食", nudge:"每餐加入一种蛋白质来源，例如鸡蛋、鱼、豆类、豆腐或印度奶酪。", explanation:"蛋白质有助于肌肉构建和组织修复，也为身体提供所需营养。如果适合你的饮食习惯，可以把蛋白质分配到一天的几餐中。并不存在适合所有人的固定摄入量或按月经周期阶段安排的统一方案。", tags:["蛋白质","营养"] },
"NO-F-006": { topic:"圣罗勒茶", nudge:"如果你喜欢，今天可以用新鲜圣罗勒叶或茶包泡一杯茶。", explanation:"圣罗勒在阿育吠陀传统中有使用历史。关于其潜在作用已有初步研究，但健康益处方面的证据仍有限。如果适合你，可以把它当作饮品；不要将其视为治疗压力的方法或医疗护理的替代品。", tags:["圣罗勒","草本饮品"] }
},
ru: {
"NO-F-005": { topic:"Белковые продукты", nudge:"Добавляйте источник белка в каждый приём пищи: яйца, рыбу, бобовые, тофу или панир.", explanation:"Белок нужен для поддержания мышц и восстановления тканей, а также обеспечивает организм необходимыми питательными веществами. Если удобно, распределяйте белковые продукты между приёмами пищи в течение дня. Единой нормы или схемы питания по фазам цикла, подходящей всем, не существует.", tags:["Белок","Питание"] },
"NO-F-006": { topic:"Чай тулси", nudge:"Если вам нравится, попробуйте сегодня чашку чая из свежего тулси или чайного пакетика.", explanation:"Тулси традиционно используют в аюрведе. Есть предварительные исследования его возможных эффектов, но доказательства пользы для здоровья пока ограничены. Можно пить его как обычный напиток, если он вам подходит, но не считать лечением стресса или заменой медицинской помощи.", tags:["Тулси","Травяной напиток"] }
},
uk: {
"NO-F-005": { topic:"Білкові продукти", nudge:"Додавайте джерело білка до кожного прийому їжі: яйця, рибу, бобові, тофу або панір.", explanation:"Білок потрібен для підтримки м’язів і відновлення тканин, а також забезпечує організм необхідними поживними речовинами. Якщо зручно, розподіляйте білкові продукти між прийомами їжі протягом дня. Єдиної норми чи схеми харчування за фазами циклу, яка підходить усім, не існує.", tags:["Білок","Харчування"] },
"NO-F-006": { topic:"Чай тулсі", nudge:"Якщо вам до смаку, спробуйте сьогодні чашку чаю зі свіжого тулсі або чайного пакетика.", explanation:"Тулсі традиційно використовують в аюрведі. Є попередні дослідження його можливих ефектів, але докази користі для здоров’я поки обмежені. Можна пити його як напій, якщо він вам підходить, але не вважайте лікуванням стресу чи заміною медичної допомоги.", tags:["Тулсі","Трав’яний напій"] }
},
es: {
"NO-F-005": { topic:"Comidas ricas en proteínas", nudge:"Incluye una fuente de proteína en cada comida, como huevos, pescado, legumbres, tofu o paneer.", explanation:"La proteína ayuda a mantener los músculos y reparar los tejidos, y aporta nutrientes que el cuerpo necesita. Si te resulta práctico, repártela entre las comidas del día. No existe una cantidad ni un plan basado en las fases del ciclo que sea adecuado para todo el mundo.", tags:["Proteína","Nutrición"] },
"NO-F-006": { topic:"Té de tulsi", nudge:"Si te apetece, prueba hoy una taza de té de tulsi, con hojas frescas o en bolsita.", explanation:"El tulsi se utiliza tradicionalmente en el Ayurveda. Hay investigaciones preliminares sobre sus posibles efectos, pero las pruebas de beneficios para la salud siguen siendo limitadas. Puedes disfrutarlo como bebida si te sienta bien; no lo consideres un tratamiento para el estrés ni un sustituto de la atención médica.", tags:["Tulsi","Infusión de hierbas"] }
},
fr: {
"NO-F-005": { topic:"Repas riches en protéines", nudge:"Ajoutez une source de protéines à chaque repas : œufs, poisson, légumineuses, tofu ou paneer.", explanation:"Les protéines contribuent au maintien des muscles et à la réparation des tissus, tout en apportant des nutriments essentiels. Si cela vous convient, répartissez-en les sources sur les repas de la journée. Il n’existe pas de quantité ni de programme lié aux phases du cycle qui convienne à tout le monde.", tags:["Protéines","Alimentation"] },
"NO-F-006": { topic:"Infusion de tulsi", nudge:"Si vous en avez envie, essayez aujourd’hui une tasse de tulsi, avec des feuilles fraîches ou en sachet.", explanation:"Le tulsi est traditionnellement utilisé dans l’Ayurveda. Des recherches préliminaires examinent ses effets possibles, mais les preuves de bénéfices pour la santé restent limitées. Vous pouvez en boire si cela vous convient, sans le considérer comme un traitement du stress ni comme un substitut aux soins médicaux.", tags:["Tulsi","Infusion"] }
},
de: {
"NO-F-005": { topic:"Proteinreiche Mahlzeiten", nudge:"Ergänze jede Mahlzeit um eine Proteinquelle, zum Beispiel Eier, Fisch, Hülsenfrüchte, Tofu oder Paneer.", explanation:"Protein unterstützt den Erhalt der Muskeln und die Reparatur von Gewebe und liefert dem Körper wichtige Nährstoffe. Wenn es für dich passt, verteile proteinreiche Lebensmittel auf mehrere Mahlzeiten am Tag. Eine feste Menge oder ein an Zyklusphasen gebundener Ernährungsplan ist nicht für alle geeignet.", tags:["Protein","Ernährung"] },
"NO-F-006": { topic:"Tulsi-Tee", nudge:"Wenn du magst, probiere heute eine Tasse Tulsi-Tee aus frischen Blättern oder einem Teebeutel.", explanation:"Tulsi wird traditionell im Ayurveda verwendet. Erste Studien untersuchen mögliche Wirkungen, doch die Belege für gesundheitliche Vorteile sind bislang begrenzt. Genieße den Tee, wenn er dir bekommt, aber betrachte ihn nicht als Behandlung von Stress oder Ersatz für medizinische Versorgung.", tags:["Tulsi","Kräutertee"] }
},
pt: {
"NO-F-005": { topic:"Refeições ricas em proteínas", nudge:"Inclua uma fonte de proteína em cada refeição, como ovos, peixe, leguminosas, tofu ou paneer.", explanation:"A proteína ajuda a manter os músculos e reparar os tecidos, além de fornecer nutrientes de que o corpo precisa. Se for conveniente, distribua as fontes de proteína pelas refeições ao longo do dia. Não existe uma quantidade ou um plano baseado nas fases do ciclo que sirva para todas as pessoas.", tags:["Proteína","Nutrição"] },
"NO-F-006": { topic:"Chá de tulsi", nudge:"Se gostar, experimente hoje uma chávena de chá de tulsi, com folhas frescas ou em saqueta.", explanation:"O tulsi é tradicionalmente utilizado no Ayurveda. Existem estudos iniciais sobre possíveis efeitos, mas as provas de benefícios para a saúde continuam limitadas. Pode apreciá-lo como bebida se lhe fizer bem; não o considere um tratamento para o stress nem um substituto dos cuidados médicos.", tags:["Tulsi","Infusão de ervas"] }
},
ja: {
"NO-F-005": { topic:"たんぱく質を含む食事", nudge:"卵、魚、豆類、豆腐、パニールなどを毎食のたんぱく質源として取り入れてみましょう。", explanation:"たんぱく質は筋肉の維持や組織の修復を支え、体に必要な栄養素を補います。無理のない範囲で、1日の食事に分けて取り入れてもよいでしょう。誰にでも当てはまる一律の量や、月経周期の段階に合わせた食事計画があるわけではありません。", tags:["たんぱく質","栄養"] },
"NO-F-006": { topic:"トゥルシー茶", nudge:"好みに合えば、フレッシュな葉やティーバッグでトゥルシー茶を一杯楽しんでみましょう。", explanation:"トゥルシーはアーユルヴェーダで伝統的に用いられてきました。可能性のある作用を調べる初期研究はありますが、健康上の効果を裏付ける証拠はまだ限られています。飲み物として楽しむことはできますが、ストレスの治療や医療の代わりとは考えないでください。", tags:["トゥルシー","ハーブティー"] }
},
ko: {
"NO-F-005": { topic:"단백질이 풍부한 식사", nudge:"달걀, 생선, 콩류, 두부 또는 파니르처럼 매 끼니에 단백질 식품을 더해 보세요.", explanation:"단백질은 근육을 유지하고 조직을 회복하는 데 도움을 주며 몸에 필요한 영양소를 공급합니다. 편하다면 하루 여러 끼니에 나누어 섭취하세요. 모든 사람에게 맞는 하나의 정해진 양이나 주기 단계별 식단은 없습니다.", tags:["단백질","영양"] },
"NO-F-006": { topic:"툴시 차", nudge:"원한다면 오늘 생잎이나 티백으로 툴시 차 한 잔을 즐겨 보세요.", explanation:"툴시는 아유르베다에서 전통적으로 사용되어 왔습니다. 잠재적 효과를 살펴보는 초기 연구가 있지만 건강상 이점에 대한 근거는 아직 제한적입니다. 잘 맞는다면 음료로 즐기되 스트레스 치료나 의료 서비스를 대신하는 것으로 여기지 마세요.", tags:["툴시","허브차"] }
}
};
