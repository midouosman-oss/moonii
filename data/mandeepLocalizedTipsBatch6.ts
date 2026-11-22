import type { Tip } from "@/data/tipLibrary";
type Copy = Pick<Tip, "topic" | "nudge" | "explanation" | "tags">;

// Sixth multilingual batch: folate foods and fibre-rich meals, without cycle-specific medical claims.
export const MANDEEP_LOCALIZED_TIPS_BATCH6: Record<string, Record<string, Copy>> = {
ar:{
"NO-F-007":{topic:"أطعمة غنية بالفولات",nudge:"أضيفي السبانخ أو البروكلي أو الإدامامي أو العدس إلى وجبتك اليوم.",explanation:"الفولات (فيتامين B9) عنصر غذائي يحتاجه الجسم لتكوين الخلايا ووظائفها الطبيعية. يمكنك الحصول عليه من الخضروات الورقية والبقوليات وغيرها من الأطعمة. أضيفيها إلى الدال أو طبق مقلي سريع أو سلطة حسب ما تحبين.",tags:["الفولات","فيتامين B9"]},
"NO-F-008":{topic:"أطعمة غنية بالألياف",nudge:"اختاري اليوم الفاصوليا أو العدس أو البطاطا الحلوة أو اللوز لإضافة الألياف إلى وجبتك.",explanation:"تساعد الأطعمة الغنية بالألياف على إبطاء امتصاص الكربوهيدرات ودعم صحة الجهاز الهضمي. قد تكون مفيدة ضمن نمط غذائي متوازن لمن يتعاملن مع متلازمة تكيس المبايض، لكنها ليست علاجًا بحد ذاتها. جرّبي الفاصوليا أو الحمص بدلًا من جزء من الأرز الأبيض، أو تناولي بعض اللوز كوجبة خفيفة.",tags:["الألياف","متلازمة تكيس المبايض"]}
},
hi:{
"NO-F-007":{topic:"फोलेट से भरपूर खाद्य पदार्थ",nudge:"आज पालक, ब्रोकोली, एडामामे या दाल को अपने भोजन में शामिल करें।",explanation:"फोलेट (विटामिन B9) कोशिकाओं के निर्माण और सामान्य कार्य के लिए ज़रूरी पोषक तत्व है। हरी पत्तेदार सब्ज़ियाँ, फलियाँ और दालें इसके स्रोत हैं। इन्हें दाल, स्टिर-फ्राई या सलाद में आसानी से शामिल किया जा सकता है।",tags:["फोलेट","विटामिन B9"]},
"NO-F-008":{topic:"फाइबर युक्त खाद्य पदार्थ",nudge:"आज फाइबर बढ़ाने के लिए बीन्स, दाल, शकरकंद या बादाम चुनें।",explanation:"फाइबर युक्त भोजन कार्बोहाइड्रेट के अवशोषण को धीमा करने और पाचन स्वास्थ्य को सहारा देने में मदद कर सकता है। PCOS के साथ रहने वालों के लिए यह संतुलित आहार का उपयोगी हिस्सा हो सकता है, लेकिन अपने आप में इलाज नहीं है। सफेद चावल के कुछ हिस्से की जगह राजमा या छोले लें, या नाश्ते में बादाम खाएँ।",tags:["फाइबर","PCOS"]}
},
bn:{
"NO-F-007":{topic:"ফোলেটসমৃদ্ধ খাবার",nudge:"আজ পালং শাক, ব্রকলি, এডামামে বা ডাল খাবারে যোগ করুন।",explanation:"ফোলেট (ভিটামিন B9) কোষ গঠন ও স্বাভাবিক কাজের জন্য প্রয়োজনীয় পুষ্টি। শাকসবজি, ডাল ও অন্যান্য শিমজাতীয় খাবার এর উৎস। ডাল, স্টির-ফ্রাই বা সালাদে এগুলো সহজেই যোগ করা যায়।",tags:["ফোলেট","ভিটামিন B9"]},
"NO-F-008":{topic:"আঁশসমৃদ্ধ খাবার",nudge:"আজ আঁশ বাড়াতে বিনস, ডাল, মিষ্টি আলু বা বাদাম বেছে নিন।",explanation:"আঁশযুক্ত খাবার কার্বোহাইড্রেট শোষণ ধীর করতে এবং হজমের স্বাস্থ্য ভালো রাখতে সাহায্য করতে পারে। PCOS থাকলে সুষম খাদ্যের অংশ হিসেবে এগুলো উপকারী হতে পারে, তবে এগুলো নিজে কোনো চিকিৎসা নয়। সাদা ভাতের কিছু অংশের বদলে রাজমা বা ছোলা খান, অথবা নাশতায় কিছু বাদাম নিন।",tags:["আঁশ","PCOS"]}
},
ms:{
"NO-F-007":{topic:"Makanan kaya folat",nudge:"Tambahkan bayam, brokoli, edamame atau lentil ke dalam hidangan hari ini.",explanation:"Folat (vitamin B9) ialah nutrien yang diperlukan untuk pembentukan dan fungsi sel yang normal. Sayuran berdaun hijau dan kekacang ialah antara sumbernya. Masukkannya ke dalam dal, tumisan atau salad mengikut kesukaan anda.",tags:["Folat","Vitamin B9"]},
"NO-F-008":{topic:"Makanan tinggi serat",nudge:"Pilih kacang, lentil, ubi keledek atau badam hari ini untuk menambah serat.",explanation:"Makanan tinggi serat boleh memperlahankan penyerapan karbohidrat dan menyokong kesihatan pencernaan. Ia boleh menjadi sebahagian daripada pemakanan seimbang bagi mereka yang mengurus PCOS, tetapi bukan rawatan dengan sendirinya. Cuba gantikan sebahagian nasi putih dengan rajma atau kacang kuda, atau nikmati badam sebagai snek.",tags:["Serat","PCOS"]}
},
vi:{
"NO-F-007":{topic:"Thực phẩm giàu folate",nudge:"Hôm nay hãy thêm rau bina, bông cải xanh, edamame hoặc đậu lăng vào bữa ăn.",explanation:"Folate (vitamin B9) là dưỡng chất cần thiết cho quá trình hình thành và hoạt động bình thường của tế bào. Rau lá xanh và các loại đậu là nguồn cung cấp folate. Bạn có thể thêm chúng vào món dal, món xào hoặc salad tùy sở thích.",tags:["Folate","Vitamin B9"]},
"NO-F-008":{topic:"Thực phẩm giàu chất xơ",nudge:"Hôm nay hãy chọn đậu, đậu lăng, khoai lang hoặc hạnh nhân để bổ sung chất xơ.",explanation:"Thực phẩm giàu chất xơ có thể làm chậm hấp thu carbohydrate và hỗ trợ sức khỏe tiêu hóa. Đây có thể là một phần của chế độ ăn cân bằng đối với người đang kiểm soát PCOS, nhưng bản thân chúng không phải là phương pháp điều trị. Hãy thử thay một phần cơm trắng bằng đậu rajma hoặc đậu gà, hay dùng hạnh nhân làm món ăn nhẹ.",tags:["Chất xơ","PCOS"]}
},
th:{
"NO-F-007":{topic:"อาหารที่มีโฟเลต",nudge:"วันนี้ลองเพิ่มผักโขม บรอกโคลี ถั่วแระญี่ปุ่น หรือถั่วเลนทิลในมื้ออาหาร",explanation:"โฟเลต (วิตามิน B9) เป็นสารอาหารที่จำเป็นต่อการสร้างเซลล์และการทำงานตามปกติของเซลล์ ผักใบเขียวและถั่วต่าง ๆ เป็นแหล่งของโฟเลต ลองใส่ในดาล ผัดผัก หรือสลัดตามที่ชอบ",tags:["โฟเลต","วิตามิน B9"]},
"NO-F-008":{topic:"อาหารที่มีใยอาหารสูง",nudge:"วันนี้เลือกถั่ว ถั่วเลนทิล มันเทศ หรืออัลมอนด์เพื่อเพิ่มใยอาหาร",explanation:"อาหารที่มีใยอาหารสูงอาจช่วยชะลอการดูดซึมคาร์โบไฮเดรตและส่งเสริมสุขภาพทางเดินอาหาร เป็นส่วนหนึ่งของอาหารที่สมดุลสำหรับผู้ที่ดูแลภาวะ PCOS ได้ แต่ไม่ใช่การรักษาด้วยตัวเอง ลองแทนข้าวขาวบางส่วนด้วยถั่วราชมาหรือถั่วลูกไก่ หรือกินอัลมอนด์เป็นของว่าง",tags:["ใยอาหาร","PCOS"]}
},
id:{
"NO-F-007":{topic:"Makanan kaya folat",nudge:"Tambahkan bayam, brokoli, edamame, atau lentil ke dalam makanan hari ini.",explanation:"Folat (vitamin B9) adalah nutrisi yang dibutuhkan untuk pembentukan dan fungsi sel yang normal. Sayuran berdaun hijau dan kacang-kacangan merupakan sumbernya. Tambahkan ke dal, tumisan, atau salad sesuai selera.",tags:["Folat","Vitamin B9"]},
"NO-F-008":{topic:"Makanan tinggi serat",nudge:"Pilih kacang-kacangan, lentil, ubi jalar, atau almond hari ini untuk menambah serat.",explanation:"Makanan tinggi serat dapat memperlambat penyerapan karbohidrat dan mendukung kesehatan pencernaan. Ini bisa menjadi bagian dari pola makan seimbang bagi orang yang mengelola PCOS, tetapi bukan pengobatan tersendiri. Cobalah mengganti sebagian nasi putih dengan rajma atau chana, atau nikmati almond sebagai camilan.",tags:["Serat","PCOS"]}
},
zh:{
"NO-F-007":{topic:"富含叶酸的食物",nudge:"今天可以在餐食中加入菠菜、西兰花、毛豆或扁豆。",explanation:"叶酸（维生素B9）是细胞形成和正常运作所需的营养素。绿叶蔬菜和豆类都是来源。可以根据喜好把它们加入印度扁豆汤、炒菜或沙拉中。",tags:["叶酸","维生素B9"]},
"NO-F-008":{topic:"高纤维食物",nudge:"今天选择豆类、扁豆、红薯或杏仁，为饮食增加膳食纤维。",explanation:"高纤维食物有助于减缓碳水化合物的吸收，并支持消化健康。对于正在管理多囊卵巢综合征（PCOS）的人，它们可以成为均衡饮食的一部分，但本身并非治疗方法。可以用印度红腰豆或鹰嘴豆替代部分白米饭，或把杏仁作为加餐。",tags:["膳食纤维","PCOS"]}
},
ru:{
"NO-F-007":{topic:"Продукты с фолатами",nudge:"Добавьте сегодня в рацион шпинат, брокколи, эдамаме или чечевицу.",explanation:"Фолат (витамин B9) необходим для образования клеток и их нормальной работы. Его источники — листовая зелень и бобовые. Добавьте их в дал, овощное жаркое или салат — как вам удобнее.",tags:["Фолат","Витамин B9"]},
"NO-F-008":{topic:"Продукты с клетчаткой",nudge:"Выберите сегодня фасоль, чечевицу, батат или миндаль, чтобы добавить в рацион клетчатку.",explanation:"Продукты с клетчаткой могут замедлять усвоение углеводов и поддерживать здоровье пищеварительной системы. Они могут быть частью сбалансированного питания при СПКЯ, но сами по себе не являются лечением. Попробуйте заменить часть белого риса фасолью или нутом либо съесть немного миндаля в качестве перекуса.",tags:["Клетчатка","СПКЯ"]}
},
uk:{
"NO-F-007":{topic:"Продукти з фолатами",nudge:"Додайте сьогодні до раціону шпинат, броколі, едамаме або сочевицю.",explanation:"Фолат (вітамін B9) потрібен для утворення клітин та їхньої нормальної роботи. Його джерела — листова зелень і бобові. Додайте їх до далу, овочевої страви або салату — як вам зручно.",tags:["Фолат","Вітамін B9"]},
"NO-F-008":{topic:"Продукти з клітковиною",nudge:"Оберіть сьогодні квасолю, сочевицю, батат або мигдаль, щоб додати клітковину до раціону.",explanation:"Продукти з клітковиною можуть сповільнювати засвоєння вуглеводів і підтримувати травлення. Вони можуть бути частиною збалансованого харчування при СПКЯ, але самі по собі не є лікуванням. Спробуйте замінити частину білого рису квасолею або нутом чи з’їсти трохи мигдалю як перекус.",tags:["Клітковина","СПКЯ"]}
},
es:{
"NO-F-007":{topic:"Alimentos con folato",nudge:"Añade hoy espinacas, brócoli, edamame o lentejas a tu comida.",explanation:"El folato (vitamina B9) es un nutriente necesario para la formación y el funcionamiento normal de las células. Las verduras de hoja verde y las legumbres son algunas de sus fuentes. Puedes incorporarlas a un dal, un salteado o una ensalada.",tags:["Folato","Vitamina B9"]},
"NO-F-008":{topic:"Alimentos ricos en fibra",nudge:"Elige hoy alubias, lentejas, boniato o almendras para aumentar la fibra.",explanation:"Los alimentos ricos en fibra pueden ralentizar la absorción de carbohidratos y favorecer la salud digestiva. Pueden formar parte de una alimentación equilibrada para quienes conviven con el SOP, pero no son un tratamiento por sí solos. Prueba a sustituir parte del arroz blanco por alubias o garbanzos, o toma almendras como tentempié.",tags:["Fibra","SOP"]}
},
fr:{
"NO-F-007":{topic:"Aliments riches en folates",nudge:"Ajoutez aujourd’hui des épinards, du brocoli, des edamames ou des lentilles à votre repas.",explanation:"Les folates (vitamine B9) sont nécessaires à la formation et au fonctionnement normal des cellules. Les légumes à feuilles vertes et les légumineuses en sont des sources. Incorporez-les à un dal, à un plat sauté ou à une salade, selon vos envies.",tags:["Folates","Vitamine B9"]},
"NO-F-008":{topic:"Aliments riches en fibres",nudge:"Choisissez aujourd’hui des haricots, des lentilles, de la patate douce ou des amandes pour augmenter votre apport en fibres.",explanation:"Les aliments riches en fibres peuvent ralentir l’absorption des glucides et soutenir la santé digestive. Ils peuvent faire partie d’une alimentation équilibrée en cas de SOPK, mais ne constituent pas un traitement à eux seuls. Essayez de remplacer une partie du riz blanc par des haricots ou des pois chiches, ou prenez quelques amandes en collation.",tags:["Fibres","SOPK"]}
},
de:{
"NO-F-007":{topic:"Folatreiche Lebensmittel",nudge:"Ergänze deine Mahlzeit heute um Spinat, Brokkoli, Edamame oder Linsen.",explanation:"Folat (Vitamin B9) wird für die Bildung und normale Funktion von Zellen benötigt. Grünes Blattgemüse und Hülsenfrüchte sind gute Quellen. Du kannst sie in Dal, ein Pfannengericht oder einen Salat geben.",tags:["Folat","Vitamin B9"]},
"NO-F-008":{topic:"Ballaststoffreiche Lebensmittel",nudge:"Wähle heute Bohnen, Linsen, Süßkartoffeln oder Mandeln, um mehr Ballaststoffe aufzunehmen.",explanation:"Ballaststoffreiche Lebensmittel können die Aufnahme von Kohlenhydraten verlangsamen und die Verdauung unterstützen. Bei PCOS können sie Teil einer ausgewogenen Ernährung sein, sind aber keine eigenständige Behandlung. Ersetze zum Beispiel einen Teil des weißen Reises durch Bohnen oder Kichererbsen oder iss Mandeln als Snack.",tags:["Ballaststoffe","PCOS"]}
},
pt:{
"NO-F-007":{topic:"Alimentos com folato",nudge:"Acrescente hoje espinafre, brócolis, edamame ou lentilhas à sua refeição.",explanation:"O folato (vitamina B9) é um nutriente necessário para a formação e o funcionamento normal das células. Verduras de folhas verdes e leguminosas são algumas das suas fontes. Inclua-as num dal, num refogado ou numa salada, como preferir.",tags:["Folato","Vitamina B9"]},
"NO-F-008":{topic:"Alimentos ricos em fibras",nudge:"Escolha hoje feijão, lentilhas, batata-doce ou amêndoas para aumentar a ingestão de fibras.",explanation:"Alimentos ricos em fibras podem retardar a absorção de carboidratos e apoiar a saúde digestiva. Podem fazer parte de uma alimentação equilibrada para quem convive com SOP, mas não são um tratamento por si só. Experimente substituir parte do arroz branco por feijão ou grão-de-bico, ou comer amêndoas como lanche.",tags:["Fibras","SOP"]}
},
ja:{
"NO-F-007":{topic:"葉酸を含む食品",nudge:"今日はほうれん草、ブロッコリー、枝豆、レンズ豆などを食事に加えてみましょう。",explanation:"葉酸（ビタミンB9）は、細胞の形成と正常な働きに必要な栄養素です。緑の葉野菜や豆類から摂ることができます。ダール、炒め物、サラダなど、好みに合わせて取り入れてみてください。",tags:["葉酸","ビタミンB9"]},
"NO-F-008":{topic:"食物繊維が豊富な食品",nudge:"今日は豆類、レンズ豆、さつまいも、アーモンドなどで食物繊維を補いましょう。",explanation:"食物繊維が豊富な食品は、炭水化物の吸収を緩やかにし、消化器の健康を支えることがあります。PCOSのある人にとっても、バランスのよい食事の一部になりますが、それ自体が治療になるわけではありません。白米の一部を豆やひよこ豆に替えたり、間食にアーモンドを食べたりしてみましょう。",tags:["食物繊維","PCOS"]}
},
ko:{
"NO-F-007":{topic:"엽산이 풍부한 식품",nudge:"오늘 시금치, 브로콜리, 에다마메 또는 렌틸콩을 식사에 더해 보세요.",explanation:"엽산(비타민 B9)은 세포의 생성과 정상적인 기능에 필요한 영양소입니다. 녹색 잎채소와 콩류가 좋은 공급원입니다. 달, 볶음 요리 또는 샐러드에 취향에 맞게 넣어 보세요.",tags:["엽산","비타민 B9"]},
"NO-F-008":{topic:"식이섬유가 풍부한 식품",nudge:"오늘은 식이섬유를 더하기 위해 콩류, 렌틸콩, 고구마 또는 아몬드를 선택해 보세요.",explanation:"식이섬유가 풍부한 식품은 탄수화물 흡수를 늦추고 소화 건강을 돕는 데 도움이 될 수 있습니다. PCOS를 관리하는 사람에게 균형 잡힌 식사의 일부가 될 수 있지만 그 자체가 치료법은 아닙니다. 흰쌀밥 일부를 콩이나 병아리콩으로 바꾸거나 간식으로 아몬드를 드셔 보세요.",tags:["식이섬유","PCOS"]}
}
};
