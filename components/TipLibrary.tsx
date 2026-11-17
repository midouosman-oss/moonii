import React from "react";
import { View, Text, StyleSheet } from "react-native";
import type { Phase } from "@/context/CycleContext";
import { getTipsForPhase, type Tip } from "@/data/tipLibrary";
import { translate } from "@/lib/i18n";
import { getLocalizedTip } from "@/data/localizedTips";

const RU_TIPS: Record<string, Pick<Tip, "topic" | "nudge" | "explanation" | "tags">> = {
  "NO-M-001": {
    topic: "Приготовленная еда · Железо",
    nudge: "Добавь к продуктам с железом немного витамина C.",
    explanation: "Если менструации обильные или запасы железа снижены, чечевица, фасоль, тофу и листовая зелень могут стать источниками негемового железа. Добавь лимон, гуаву или другой продукт с витамином C: он помогает усвоению железа. Одной еды может быть недостаточно при железодефицитной анемии. При постоянной усталости или обильных кровотечениях обсуди с врачом анализ крови.",
    tags: ["Железо", "Усталость", "Обильное кровотечение"],
  },
  "MV-M-001": {
    topic: "Мягкая активность · Йога",
    nudge: "Попробуй десять спокойных минут, только если тебе комфортно.",
    explanation: "Неспешная прогулка, лёгкая растяжка или йога с опорой могут уменьшить напряжение и улучшить самочувствие. Не нужно терпеть боль или следовать жёсткому плану тренировок по фазам цикла. Отдых — полноценный выбор. Сильная или необычная боль требует медицинского внимания.",
    tags: ["Спазмы", "Низкая энергия", "Напряжение"],
  },
  "MI-M-001": {
    topic: "Дыхательные практики · Отдых",
    nudge: "Оставь вечер для спокойствия и восстановления.",
    explanation: "Несколько минут комфортного медленного дыхания и спокойный ритуал перед сном могут помочь расслабиться и поддержать сон. Не заставляй себя дышать глубоко или надолго задерживать дыхание, особенно если появляется головокружение или дискомфорт.",
    tags: ["Стресс", "Сон", "Пониженное настроение"],
  },
  "NO-F-001": {
    topic: "Приготовленная еда · Белок",
    nudge: "Собери сытную тарелку с белком и клетчаткой.",
    explanation: "Сбалансированный приём пищи помогает поддерживать ровную энергию — для этого не нужен особый ингредиент, который якобы «балансирует гормоны». Попробуй дал с овощами и рисом или тофу с зеленью и цельными злаками. Выбирай продукты и порции с учётом аппетита и своих потребностей.",
    tags: ["Энергия", "Сахар в крови", "СПКЯ"],
  },
  "MV-F-001": {
    topic: "Силовые тренировки · Постепенная нагрузка",
    nudge: "Если чувствуешь готовность, добавь сегодня немного силовой работы.",
    explanation: "Некоторые замечают рост энергии после менструации, но так бывает не у всех. Исследования не подтверждают единую схему тренировок для каждой фазы цикла. Ориентируйся на сон и самочувствие, выбирай посильную тренировку и увеличивай нагрузку постепенно, а не ради календарного плана.",
    tags: ["Сила", "Энергия", "Восстановление"],
  },
  "MI-F-001": {
    topic: "Планирование · Осознанное намерение",
    nudge: "Выбери одну вещь, которую тебе хотелось бы начать.",
    explanation: "Небольшое реалистичное намерение помогает двигаться вперёд и не превращает заботу о себе в ещё один список дел. Раздели его на первый шаг, который можно выполнить сегодня, и оставь место для отдыха и изменения планов.",
    tags: ["Мотивация", "Концентрация", "Стресс"],
  },
  "NO-O-001": {
    topic: "Вода · Семена",
    nudge: "Держи воду под рукой и добавь к еде что-нибудь хрустящее и питательное.",
    explanation: "Достаточное количество жидкости поддерживает нормальное кровообращение и терморегуляцию, особенно в жаркую или влажную погоду. Тыквенные и кунжутные семена добавляют клетчатку, минералы и полезные жиры. Однако нет доказательств, что конкретные семена или продукты контролируют овуляцию или надёжно меняют гормональный фон.",
    tags: ["Вода", "Пищеварение", "Жаркая погода"],
  },
  "MV-O-001": {
    topic: "Движение · Выбор",
    nudge: "Выбери интенсивность, которая подходит тебе сегодня.",
    explanation: "Если чувствуешь прилив сил, попробуй быструю прогулку, танцы или привычную тренировку. Если нет — выбери более спокойный вариант. Одна только фаза цикла не определяет риск травмы или физические возможности: учитывай симптомы, тренировочный опыт и восстановление.",
    tags: ["Энергия", "Настроение", "Восстановление"],
  },
  "MI-O-001": {
    topic: "Общение · Эмоциональное благополучие",
    nudge: "Найди время для одного приятного контакта.",
    explanation: "Короткий разговор, совместная еда или время на свежем воздухе могут поддержать чувство связи с другими людьми и эмоциональное благополучие. Во время овуляции необязательно быть более общительной — выбирай тот формат общения, который тебе приятен.",
    tags: ["Настроение", "Общение", "Стресс"],
  },
  "NO-L-001": {
    topic: "Перекусы · Сложные углеводы",
    nudge: "Сочетай любимые углеводы с белком или клетчаткой.",
    explanation: "Если перед менструацией усиливаются аппетит или тяга к определённой еде, сытный перекус — это поддержка, а не недостаток силы воли. Попробуй фрукт с орехами, йогурт с овсянкой или запечённый нут. Регулярное сбалансированное питание может помочь чувствовать себя стабильнее, хотя симптомы ПМС у всех разные.",
    tags: ["Тяга к еде", "Настроение", "Энергия"],
  },
  "MV-L-001": {
    topic: "Ходьба · Пилатес · Мобильность",
    nudge: "Пусть темп восстановления задаёт нагрузку.",
    explanation: "Если предменструальные симптомы влияют на энергию, попробуй прогулку, упражнения на подвижность или облегчённую версию привычной тренировки. Если самочувствие хорошее, можно тренироваться интенсивнее. Корректировать нагрузку — значит учитывать состояние тела, а не следовать жёсткому правилу.",
    tags: ["Вздутие", "Усталость", "Восстановление"],
  },
  "MI-L-001": {
    topic: "Сон · Вечерний ритуал",
    nudge: "Заверши день спокойно и без спешки.",
    explanation: "Спокойный ритуал перед сном, приглушённый свет и регулярное время отхода ко сну могут облегчить отдых, если настроение или сон нестабильны. Пусть ритуал будет простым: тихая музыка, тёплый душ или несколько комфортных вдохов. Если изменения настроения выражены или мешают повседневной жизни, обратись за поддержкой.",
    tags: ["Сон", "Тревожность", "Пониженное настроение"],
  },
};

const PILLAR_KEYS: Record<Tip["pillar"], string> = {
  Nourishment: "nourishment",
  Movement: "movement",
  Mind: "mind",
};

function TipCard({ tip, language }: { tip: Tip; language: string }) {
  const localized = language === "ru" ? RU_TIPS[tip.id] : getLocalizedTip(language, tip.id);
  const pillar = translate(language, PILLAR_KEYS[tip.pillar]);
  const energy = translate(language, `energy_${tip.energy.toLowerCase()}`);
  const color = tip.pillar === "Nourishment" ? "#c4836a" : tip.pillar === "Movement" ? "#7ab090" : "#9a9a50";

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Text style={[styles.pillar, { color }]}>{pillar.toUpperCase()}</Text>
        <Text style={styles.energy}>{energy.toUpperCase()}</Text>
      </View>
      <Text style={styles.nudge}>{localized?.nudge ?? tip.nudge}</Text>
      <Text style={styles.topic}>{localized?.topic ?? tip.topic}</Text>
      <Text style={styles.explanation}>{localized?.explanation ?? tip.explanation}</Text>
      <View style={styles.tags}>
        {(localized?.tags ?? tip.tags).map((tag) => (
          <View key={tag} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export default function TipLibrary({ phase, region, language = "en" }: { phase: Phase; region?: string; language?: string }) {
  const tips = getTipsForPhase(phase, region);
  return (
    <View style={styles.section}>
      <Text style={styles.eyebrow}>{translate(language, "daily_care")}</Text>
      <Text style={styles.heading}>{translate(language, "care_heading", { phase: translate(language, phase) })}</Text>
      <Text style={styles.subheading}>{translate(language, "care_subheading")}</Text>
      {tips.map((tip) => <TipCard key={tip.id} tip={tip} language={language} />)}
      <Text style={styles.disclaimer}>{translate(language, "disclaimer")}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: 22 },
  eyebrow: { fontFamily: "DMSans_700Bold", fontSize: 9, letterSpacing: 2.5, color: "#c0a0b0", marginBottom: 8, marginLeft: 2 },
  heading: { fontFamily: "CormorantGaramond_300Light_Italic", fontSize: 25, lineHeight: 30, color: "#1a1015", marginBottom: 5 },
  subheading: { fontFamily: "DMSans_400Regular", fontSize: 12, lineHeight: 19, color: "#a8788c", marginBottom: 14 },
  card: { backgroundColor: "#fff", borderRadius: 20, padding: 18, marginBottom: 12, shadowColor: "#C97B96", shadowOpacity: 0.06, shadowRadius: 12, shadowOffset: { width: 0, height: 3 }, elevation: 2 },
  topRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 9 },
  pillar: { fontFamily: "DMSans_700Bold", fontSize: 9, letterSpacing: 1.8 },
  energy: { fontFamily: "DMSans_700Bold", fontSize: 8, letterSpacing: 1.2, color: "#b09aa5" },
  nudge: { fontFamily: "CormorantGaramond_300Light_Italic", fontSize: 22, lineHeight: 27, color: "#1a1015", marginBottom: 5 },
  topic: { fontFamily: "DMSans_500Medium", fontSize: 10, color: "#a8788c", marginBottom: 9 },
  explanation: { fontFamily: "DMSans_400Regular", fontSize: 12, lineHeight: 20, color: "#5b4550" },
  tags: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 12 },
  tag: { backgroundColor: "#fdf6f4", borderRadius: 30, paddingHorizontal: 9, paddingVertical: 5 },
  tagText: { fontFamily: "DMSans_400Regular", fontSize: 9, color: "#a8788c" },
  disclaimer: { fontFamily: "DMSans_400Regular", fontSize: 10, lineHeight: 16, color: "#a8788c", marginTop: 2 },
});
