
import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Platform,
  TextInput,
  Modal,
  Pressable,
  Easing,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as ExpoHaptics from "expo-haptics";
import { Feather } from "@expo/vector-icons";
import { Redirect } from "expo-router";
import { useCycle, Phase, DailyLog } from "@/context/CycleContext";
import TipLibrary from "@/components/TipLibrary";
import { COUNTRIES, LANGUAGES, translate, translateOption, isRTL } from "@/lib/i18n";
import { translateCountry } from "@/data/localizedCountries";

// ─── Haptics: safe for web and native ────────────────────────────────────────

const Haptics = {
  ImpactFeedbackStyle: ExpoHaptics.ImpactFeedbackStyle,
  NotificationFeedbackType: ExpoHaptics.NotificationFeedbackType,

  impactAsync: (style: ExpoHaptics.ImpactFeedbackStyle) =>
    Platform.OS === "web"
      ? Promise.resolve()
      : ExpoHaptics.impactAsync(style).catch(() => {}),

  notificationAsync: (type: ExpoHaptics.NotificationFeedbackType) =>
    Platform.OS === "web"
      ? Promise.resolve()
      : ExpoHaptics.notificationAsync(type).catch(() => {}),

  selectionAsync: () =>
    Platform.OS === "web"
      ? Promise.resolve()
      : ExpoHaptics.selectionAsync().catch(() => {}),
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const PHASE_COLORS: Record<Phase, string> = {
  menstrual: "#C97B96",
  follicular: "#7ab090",
  ovulatory: "#9a9a50",
  luteal: "#c4836a",
};

const PHASE_LABELS: Record<Phase, string> = {
  menstrual: "Menstrual",
  follicular: "Follicular",
  ovulatory: "Ovulatory",
  luteal: "Luteal",
};

const PHASE_NUM: Record<Phase, number> = {
  menstrual: 1,
  follicular: 2,
  ovulatory: 3,
  luteal: 4,
};

const PHASE_DESCRIPTION: Record<Phase, string> = {
  menstrual: "Your Rest Phase",
  follicular: "Your Rising Phase",
  ovulatory: "Your Peak Phase",
  luteal: "Your Integration Phase",
};

const PHASE_ENERGY: Record<Phase, string> = {
  menstrual: "Low energy 🌿",
  follicular: "Rising energy 🌱",
  ovulatory: "High energy ⚡",
  luteal: "Waning energy 🍂",
};

const TODAYS_INSIGHT: Record<Phase, string> = {
  menstrual:
    "Your body is doing a lot right now. Keep things light today — gentle movement, warming food and early rest will go a long way.",
  follicular:
    "Your energy is beginning to rise. A good week to start something new and try things that felt like too much last week.",
  ovulatory:
    "You may feel more expressive and connected today. That warmth toward others is peak oestrogen — real, and worth leaning into.",
  luteal:
    "The inner critic gets louder in this phase. When you notice harsh self-talk, try treating it as information rather than truth.",
};

const TODAYS_PLAN: Record<
  Phase,
  { move: string; mind: string; nourish: string }
> = {
  menstrual: {
    move: "Yin yoga or a slow walk",
    mind: "Rest. No big decisions today.",
    nourish: "Iron-rich, warming foods",
  },
  follicular: {
    move: "Strength training — try something new",
    mind: "Plan, create, begin",
    nourish: "Light proteins, fermented foods",
  },
  ovulatory: {
    move: "HIIT, dance, peak effort",
    mind: "Connect, communicate, express",
    nourish: "Raw veg, zinc, anti-inflammatory",
  },
  luteal: {
    move: "Pilates, walking, gentle yoga",
    mind: "Complete tasks, reflect",
    nourish: "Complex carbs, magnesium, warmth",
  },
};

const MOODS = [
  { id: "energised", label: "Energised", icon: "activity" as const },
  { id: "happy", label: "Happy", icon: "sun" as const },
  { id: "calm", label: "Calm", icon: "wind" as const },
  { id: "tired", label: "Tired", icon: "moon" as const },
  { id: "anxious", label: "Anxious", icon: "alert-circle" as const },
  { id: "irritable", label: "Irritable", icon: "zap" as const },
  { id: "confident", label: "Confident", icon: "star" as const },
  { id: "withdrawn", label: "Withdrawn", icon: "cloud" as const },
];

const ENERGY_LEVELS = ["Very low", "Low", "Medium", "High", "Very high"];
const SLEEP_OPTIONS = ["Poor", "Broken", "OK", "Good", "Great"];

const MOVEMENT_OPTIONS = [
  "Yoga",
  "Walk",
  "Run",
  "Gym",
  "Swim",
  "Dance",
  "Pilates",
  "Rest day",
];

const NOURISHMENT_OPTIONS = [
  "Wholesome",
  "Plant-based",
  "Light",
  "Comforting",
  "Skipped meals",
  "Cravings",
];

const SYMPTOM_OPTIONS = [
  "Cramps",
  "Bloating",
  "Headache",
  "Tender",
  "Brain fog",
  "Breakouts",
  "None",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getPhaseInfo(
  cycleDay: number,
  phase: Phase,
  cycleLength: number,
  periodLength: number,
) {
  const ovStart = Math.floor(cycleLength / 2);
  const ovLen = 3;

  switch (phase) {
    case "menstrual":
      return { phaseDay: cycleDay, phaseTotal: periodLength };
    case "follicular":
      return {
        phaseDay: cycleDay - periodLength,
        phaseTotal: ovStart - periodLength - 1,
      };
    case "ovulatory":
      return { phaseDay: cycleDay - ovStart + 1, phaseTotal: ovLen };
    case "luteal":
      return {
        phaseDay: cycleDay - ovStart - ovLen + 1,
        phaseTotal: cycleLength - ovStart - ovLen + 1,
      };
  }
}

// ─── Animated card ────────────────────────────────────────────────────────────

function AnimatedCard({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 500,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 460,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      {children}
    </Animated.View>
  );
}

// ─── Mood chip ────────────────────────────────────────────────────────────────

function MoodChip({
  mood,
  selected,
  phaseColor,
  language,
  onPress,
}: {
  mood: (typeof MOODS)[0];
  language: string;
  selected: boolean;
  phaseColor: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={() => {
        onPress();
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }}
      style={[
        styles.moodChip,
        selected && {
          backgroundColor: phaseColor + "18",
          borderColor: phaseColor,
          borderWidth: 1.5,
        },
      ]}
      activeOpacity={0.75}
    >
      <Feather
        name={mood.icon}
        size={16}
        color={selected ? phaseColor : "#b09aa5"}
      />
      <Text
        style={[
          styles.moodChipText,
          { color: selected ? "#1a1015" : "#b09aa5" },
        ]}
      >
        {translateOption(language, mood.label)}
      </Text>
    </TouchableOpacity>
  );
}

// ─── Generic chip row ─────────────────────────────────────────────────────────

function ChipRow({
  options,
  selected,
  phaseColor,
  language,
  onPress,
}: {
  options: string[];
  language: string;
  selected: string[];
  phaseColor: string;
  onPress: (v: string) => void;
  single?: boolean;
}) {
  return (
    <View style={styles.chipsWrap}>
      {options.map((opt) => {
        const isSelected = selected.includes(opt);

        return (
          <TouchableOpacity
            key={opt}
            style={[
              styles.chip,
              isSelected && {
                backgroundColor: phaseColor + "18",
                borderColor: phaseColor,
                borderWidth: 1.5,
              },
            ]}
            onPress={() => {
              onPress(opt);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
            activeOpacity={0.75}
          >
            <Text
              style={[
                styles.chipText,
                isSelected && {
                  color: "#1a1015",
                  fontFamily: "DMSans_500Medium" as const,
                },
              ]}
            >
              {translateOption(language, opt)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// ─── Log Modal ────────────────────────────────────────────────────────────────

function LogModal({
  visible,
  phaseColor,
  phase,
  language,
  onClose,
  onSave,
  initialLog,
}: {
  visible: boolean;
  phaseColor: string;
  phase: Phase;
  language: string;
  onClose: () => void;
  onSave: (data: DailyLog) => void;
  initialLog?: DailyLog;
}) {
  const insets = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(0)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;

  const [moods, setMoods] = useState<string[]>([]);
  const [energy, setEnergy] = useState("");
  const [sleep, setSleep] = useState("");
  const [movement, setMovement] = useState<string[]>([]);
  const [nourishment, setNourishment] = useState<string[]>([]);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [note, setNote] = useState("");

  useEffect(() => {
    if (visible) {
      setMoods(initialLog?.moods ?? []);
      setEnergy(initialLog?.energy ? ENERGY_LEVELS[initialLog.energy - 1] ?? "" : "");
      setSleep(initialLog?.sleep ?? "");
      setMovement(initialLog?.movement ?? []);
      setNourishment(initialLog?.nourishment ?? []);
      setSymptoms(initialLog?.symptoms ?? []);
      setNote(initialLog?.notes ?? "");

      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 1,
          useNativeDriver: true,
          damping: 22,
          mass: 0.85,
          stiffness: 260,
        }),
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 280,
          useNativeDriver: true,
          easing: Easing.out(Easing.ease),
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, initialLog]);

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [700, 0],
  });

  const toggle = (arr: string[], val: string) =>
    arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];

  const handleSave = () => {
    onSave({
      moods,
      ...(energy ? { energy: ENERGY_LEVELS.indexOf(energy) + 1 } : {}),
      sleep,
      movement,
      nourishment,
      symptoms,
      notes: note.trim(),
    });

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onClose();
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View style={[styles.backdrop, { opacity: backdropAnim }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>

      <Animated.View
        style={[
          styles.sheet,
          { transform: [{ translateY }], paddingBottom: insets.bottom + 24 },
          isRTL(language) ? { direction: "rtl" } : null,
        ]}
      >
        <View style={styles.handle} />

        <View style={styles.sheetHeader}>
          <Text style={[styles.sheetTitle, isRTL(language) ? { textAlign: "right", writingDirection: "rtl" } : null]}>{translate(language, "today_log")}</Text>
          <TouchableOpacity
            onPress={onClose}
            style={styles.closeBtn}
            activeOpacity={0.7}
          >
            <Feather name="x" size={18} color="#a8788c" />
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={[styles.sheetSection, isRTL(language) ? { textAlign: "right", writingDirection: "rtl" } : null]}>{translate(language, "feeling")}</Text>

          <View style={styles.moodGrid}>
            {MOODS.map((m) => (
              <MoodChip
                key={m.id}
                mood={m}
                language={language}
                selected={moods.includes(m.id)}
                phaseColor={phaseColor}
                onPress={() => setMoods((prev) => toggle(prev, m.id))}
              />
            ))}
          </View>

          <Text style={[styles.sheetSection, isRTL(language) ? { textAlign: "right", writingDirection: "rtl" } : null]}>{translate(language, "energy")}</Text>

          <View style={styles.chipsWrap}>
            {ENERGY_LEVELS.map((e) => (
              <TouchableOpacity
                key={translateOption(language, e)}
                style={[
                  styles.chip,
                  energy === e && {
                    backgroundColor: phaseColor,
                    borderColor: phaseColor,
                    borderWidth: 1.5,
                  },
                ]}
                onPress={() => {
                  setEnergy((prev) => (prev === e ? "" : e));
                  Haptics.selectionAsync();
                }}
                activeOpacity={0.75}
              >
                <Text
                  style={[
                    styles.chipText,
                    energy === e && {
                      color: "#fff",
                      fontFamily: "DMSans_500Medium" as const,
                    },
                  ]}
                >
                  {translateOption(language, e)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[styles.sheetSection, isRTL(language) ? { textAlign: "right", writingDirection: "rtl" } : null]}>{translate(language, "sleep")}</Text>

          <ChipRow
            options={SLEEP_OPTIONS}
            language={language}
            selected={sleep ? [sleep] : []}
            phaseColor={phaseColor}
            onPress={(v) => setSleep((prev) => (prev === v ? "" : v))}
            single
          />

          <Text style={[styles.sheetSection, isRTL(language) ? { textAlign: "right", writingDirection: "rtl" } : null]}>{translate(language, "movement")}</Text>

          <ChipRow
            options={MOVEMENT_OPTIONS}
            language={language}
            selected={movement}
            phaseColor={phaseColor}
            onPress={(v) => setMovement((prev) => toggle(prev, v))}
          />

          <Text style={[styles.sheetSection, isRTL(language) ? { textAlign: "right", writingDirection: "rtl" } : null]}>{translate(language, "nourishment")}</Text>

          <ChipRow
            options={NOURISHMENT_OPTIONS}
            language={language}
            selected={nourishment}
            phaseColor={phaseColor}
            onPress={(v) => setNourishment((prev) => toggle(prev, v))}
          />

          <Text style={[styles.sheetSection, isRTL(language) ? { textAlign: "right", writingDirection: "rtl" } : null]}>{translate(language, "symptoms")}</Text>

          <ChipRow
            options={SYMPTOM_OPTIONS}
            language={language}
            selected={symptoms}
            phaseColor={phaseColor}
            onPress={(v) =>
              setSymptoms((prev) =>
                v === "None"
                  ? prev.includes("None")
                    ? []
                    : ["None"]
                  : toggle(
                      prev.filter((x) => x !== "None"),
                      v,
                    ),
              )
            }
          />

          <Text style={[styles.sheetSection, isRTL(language) ? { textAlign: "right", writingDirection: "rtl" } : null]}>{translate(language, "anything")}</Text>

          <View style={styles.noteWrap}>
            <TextInput
              style={[styles.noteInput, isRTL(language) ? { textAlign: "right", writingDirection: "rtl" } : null]}
              value={note}
              onChangeText={setNote}
              placeholder={translate(language, "note_placeholder")}
              placeholderTextColor="#c0a0b0"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          <TouchableOpacity
            style={[styles.saveBtn, { backgroundColor: phaseColor }]}
            onPress={handleSave}
            activeOpacity={0.85}
          >
            <Text style={[styles.saveBtnText, isRTL(language) ? { textAlign: "center", writingDirection: "rtl" } : null]}>{translate(language, "save_log")}</Text>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>
    </Modal>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  const {
    ready,
    hasOnboarded,
    currentPhase,
    cycleDay,
    settings,
    saveLog,
    getLog,
    updateSettings,
  } = useCycle();

  const [modalVisible, setModalVisible] = useState(false);
  const [localeVisible, setLocaleVisible] = useState(false);

  // Все Hooks вызываются до условных return
  const nowLocal = new Date();
  const today = `${nowLocal.getFullYear()}-${String(nowLocal.getMonth() + 1).padStart(2, "0")}-${String(nowLocal.getDate()).padStart(2, "0")}`;

  const handleSave = useCallback(
    (data: any) => {
      saveLog(today, data);
    },
    [saveLog, today],
  );

  if (!ready) return null;
  if (!hasOnboarded) return <Redirect href="/onboarding" />;

  const existingLog = getLog(today);
  const isLogged = !!(
    existingLog?.moods?.length ||
    existingLog?.energy ||
    existingLog?.sleep ||
    existingLog?.movement?.length ||
    existingLog?.nourishment?.length ||
    existingLog?.symptoms?.length ||
    existingLog?.notes?.trim()
  );

  const phaseColor = PHASE_COLORS[currentPhase];

  const greeting = (() => {
    const h = new Date().getHours();
    return h < 12 ? translate(settings.language, "greeting_morning") : h < 17 ? translate(settings.language, "greeting_afternoon") : translate(settings.language, "greeting_evening");
  })();

  const { phaseDay, phaseTotal } = getPhaseInfo(
    cycleDay,
    currentPhase,
    settings.cycleLength,
    settings.periodLength,
  );

  const topPad = insets.top + (Platform.OS === "web" ? 67 : 8);

  return (
    <View style={[styles.container, isRTL(settings.language) ? { direction: "rtl" } : null]}>
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        <View
          style={[
            styles.blob,
            {
              backgroundColor: phaseColor + "14",
              top: -80,
              right: -60,
              width: 300,
              height: 300,
            },
          ]}
        />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: topPad,
          paddingBottom: 120,
        }}
        showsVerticalScrollIndicator={false}
      >
        <AnimatedCard delay={0}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Text style={styles.wordmark}>moonii</Text>
            <TouchableOpacity onPress={() => setLocaleVisible(true)} style={styles.localeButton}>
              <Feather name="globe" size={13} color="#a8788c" />
              <Text style={styles.localeButtonText}>{(settings.language || "en").toUpperCase()} · {settings.country ? translateCountry(settings.language, settings.country) : translate(settings.language, "choose_country")}</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.greeting}>
            {greeting}
            {settings.name ? `, ${settings.name.split(" ")[0]}` : ""}
          </Text>
        </AnimatedCard>

        <AnimatedCard delay={80}>
          <Text style={styles.sectionLabel}>{translate(settings.language, "your_cycle")}</Text>

          <View style={[styles.cycleCard, { borderTopColor: phaseColor }]}>
            <View style={styles.cycleCardInner}>
              <View style={styles.dayBlock}>
                <Text style={[styles.dayNumber, { color: phaseColor }]}>
                  {cycleDay}
                </Text>
                <Text style={styles.dayLabel}>{translate(settings.language, "day_of_cycle")}</Text>
              </View>

              <View
                style={[styles.divider, { backgroundColor: phaseColor + "25" }]}
              />

              <View style={styles.phaseBlock}>
                <Text style={[styles.phaseName, { color: phaseColor }]}>
                  {translate(settings.language, currentPhase)}
                </Text>
                <Text style={styles.cycleLength}>
                  {settings.cycleLength} {translate(settings.language, "cycle")}
                </Text>

                <View
                  style={[
                    styles.phaseBadge,
                    { backgroundColor: phaseColor + "14" },
                  ]}
                >
                  <Text style={[styles.phaseBadgeText, { color: phaseColor }]}>
                    {translate(settings.language, "phase")} {PHASE_NUM[currentPhase]} · {translate(settings.language, "day")} {Math.max(1, phaseDay)} {translate(settings.language, "of")} {Math.max(1, phaseTotal)}
                  </Text>
                </View>

                <Text style={styles.phaseDescription}>
                  {translate(settings.language, `phase_desc_${currentPhase}`) === `phase_desc_${currentPhase}` ? PHASE_DESCRIPTION[currentPhase] : translate(settings.language, `phase_desc_${currentPhase}`)}
                </Text>
                <Text style={styles.phaseEnergy}>
                  {translate(settings.language, `phase_energy_${currentPhase}`) === `phase_energy_${currentPhase}` ? PHASE_ENERGY[currentPhase] : translate(settings.language, `phase_energy_${currentPhase}`)}
                </Text>
              </View>
            </View>
          </View>
        </AnimatedCard>

        <AnimatedCard delay={160}>
          <Text style={styles.sectionLabel}>{translate(settings.language, "today_insight")}</Text>

          <View style={styles.insightCard}>
            <View
              style={[styles.insightAccent, { backgroundColor: phaseColor }]}
            />
            <Text style={styles.insightText}>
              {translate(settings.language, `insight_${currentPhase}`) === `insight_${currentPhase}` ? TODAYS_INSIGHT[currentPhase] : translate(settings.language, `insight_${currentPhase}`)}
            </Text>
          </View>
        </AnimatedCard>

        <AnimatedCard delay={240}>
          <TipLibrary phase={currentPhase} region={settings.region} language={settings.language} />
        </AnimatedCard>

        <AnimatedCard delay={320}>
          <Text style={styles.sectionLabel}>{translate(settings.language, "daily_log")}</Text>

          <View style={styles.logCard}>
            {isLogged ? (
              <>
                <View style={styles.logStatusRow}>
                  <View
                    style={[
                      styles.logStatusDot,
                      { backgroundColor: "#7ab090" },
                    ]}
                  />
                  <Text style={[styles.logStatus, { color: "#7ab090" }]}>
                    {translate(settings.language, "checked_in")}
                  </Text>
                </View>

                <Text style={styles.logSummaryLine}>
                  {existingLog?.moods?.length
                    ? existingLog.moods.slice(0, 3).map((moodId: string) => {
                        const mood = MOODS.find((item) => item.id === moodId);
                        return mood ? translateOption(settings.language, mood.label) : moodId;
                      }).join(", ")
                    : translate(settings.language, "log_saved")}
                </Text>

                <TouchableOpacity
                  style={[
                    styles.logUpdateBtn,
                    { borderColor: phaseColor + "50" },
                  ]}
                  onPress={() => {
                    setModalVisible(true);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                  activeOpacity={0.7}
                >
                  <Feather
                    name="edit-2"
                    size={12}
                    color={phaseColor}
                    style={{ marginRight: 6 }}
                  />
                  <Text style={[styles.logUpdateText, { color: phaseColor }]}>
                    {translate(settings.language, "update_log")}
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <View style={styles.logStatusRow}>
                  <View
                    style={[
                      styles.logStatusDot,
                      { backgroundColor: "#c0a0b0" },
                    ]}
                  />
                  <Text style={styles.logStatusEmpty}>{translate(settings.language, "not_logged")}</Text>

                  <View
                    style={[
                      styles.checkInBadge,
                      { backgroundColor: phaseColor + "14" },
                    ]}
                  >
                    <Text style={[styles.checkInText, { color: phaseColor }]}>
                      {translate(settings.language, "check_in")}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={[styles.logBtn, { backgroundColor: phaseColor }]}
                  onPress={() => {
                    setModalVisible(true);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  }}
                  activeOpacity={0.88}
                >
                  <Feather
                    name="plus"
                    size={16}
                    color="#fff"
                    style={{ marginRight: 8 }}
                  />
                  <Text style={styles.logBtnText}>{translate(settings.language, "log_today")}</Text>
                </TouchableOpacity>

                <Text style={styles.logHint}>
                  {translate(settings.language, "log_hint")}
                </Text>
              </>
            )}
          </View>
        </AnimatedCard>
      </ScrollView>

      {!isLogged && (
        <View
          style={[
            styles.fabWrap,
            { bottom: Platform.OS === "web" ? 88 : 68 + insets.bottom },
          ]}
        >
          <TouchableOpacity
            style={[styles.fab, { backgroundColor: phaseColor }]}
            onPress={() => {
              setModalVisible(true);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }}
            activeOpacity={0.88}
          >
            <Feather name="plus" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      )}

      <Modal visible={localeVisible} transparent animationType="fade" onRequestClose={() => setLocaleVisible(false)}>
        <View style={styles.localeBackdrop}>
          <View style={[styles.localeSheet, isRTL(settings.language) ? { direction: "rtl" } : null]}>
            <View style={styles.localeHeader}>
              <Text style={styles.localeTitle}>{translate(settings.language, "language_country")}</Text>
              <TouchableOpacity onPress={() => setLocaleVisible(false)}><Feather name="x" size={20} color="#a8788c" /></TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.localeSection}>{translate(settings.language, "choose_language")}</Text>
              {LANGUAGES.map((item) => (
                <TouchableOpacity key={item.code} style={styles.localeOption} onPress={() => updateSettings({ language: item.code })}>
                  <Text style={styles.localeOptionText}>{item.label}</Text>
                  {settings.language === item.code ? <Feather name="check" size={17} color="#C97B96" /> : null}
                </TouchableOpacity>
              ))}
              <Text style={styles.localeSection}>{translate(settings.language, "choose_country")}</Text>
              {COUNTRIES.map((country) => (
                <TouchableOpacity key={country} style={styles.localeOption} onPress={() => updateSettings({ country, region: country })}>
                  <Text style={[styles.localeOptionText, isRTL(settings.language) ? { textAlign: "right", writingDirection: "rtl" } : null]}>{translateCountry(settings.language, country)}</Text>
                  {settings.country === country ? <Feather name="check" size={17} color="#C97B96" /> : null}
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.localeDone} onPress={() => setLocaleVisible(false)}><Text style={styles.localeDoneText}>{translate(settings.language, "done")}</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>

      <LogModal
        visible={modalVisible}
        phaseColor={phaseColor}
        phase={currentPhase}
        language={settings.language}
        onClose={() => setModalVisible(false)}
        onSave={handleSave}
        initialLog={existingLog}
      />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  localeButton: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 9, paddingVertical: 7, borderRadius: 20, backgroundColor: "#fff", marginBottom: 7 },
  localeButtonText: { fontFamily: "DMSans_500Medium", fontSize: 9, color: "#a8788c", maxWidth: 125 },
  localeBackdrop: { flex: 1, backgroundColor: "rgba(26,16,21,0.35)", justifyContent: "center", padding: 18 },
  localeSheet: { maxHeight: "85%", backgroundColor: "#fdf6f4", borderRadius: 22, padding: 18 },
  localeHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  localeTitle: { fontFamily: "DMSans_700Bold", fontSize: 17, color: "#1a1015" },
  localeSection: { fontFamily: "DMSans_700Bold", fontSize: 10, letterSpacing: 1.4, color: "#a8788c", marginTop: 14, marginBottom: 5 },
  localeOption: { minHeight: 39, flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: "#eddde5", paddingVertical: 7 },
  localeOptionText: { fontFamily: "DMSans_400Regular", fontSize: 13, color: "#5b4550" },
  localeDone: { backgroundColor: "#C97B96", borderRadius: 14, padding: 12, alignItems: "center", marginTop: 12 },
  localeDoneText: { fontFamily: "DMSans_700Bold", color: "#fff", fontSize: 13 },
  container: { flex: 1, backgroundColor: "#fdf6f4" },
  blob: { position: "absolute", borderRadius: 999 },
  scroll: { flex: 1 },

  wordmark: {
    fontFamily: "CormorantGaramond_300Light_Italic",
    fontSize: 34,
    color: "#1a1015",
    letterSpacing: 2,
    lineHeight: 38,
    marginBottom: 4,
  },
  greeting: {
    fontFamily: "DMSans_400Regular",
    fontSize: 14,
    color: "#a8788c",
    marginBottom: 24,
  },

  sectionLabel: {
    fontFamily: "DMSans_700Bold",
    fontSize: 9,
    letterSpacing: 2.5,
    color: "#c0a0b0",
    textTransform: "uppercase",
    marginBottom: 10,
    marginLeft: 2,
  },

  cycleCard: {
    backgroundColor: "#fff",
    borderRadius: 22,
    marginBottom: 20,
    borderTopWidth: 3,
    shadowColor: "#C97B96",
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
  },
  cycleCardInner: {
    flexDirection: "row",
    alignItems: "center",
    padding: 22,
    gap: 0,
  },
  dayBlock: { alignItems: "center", minWidth: 80 },
  dayNumber: {
    fontFamily: "CormorantGaramond_300Light_Italic",
    fontSize: 72,
    lineHeight: 78,
  },
  dayLabel: {
    fontFamily: "DMSans_700Bold",
    fontSize: 8,
    letterSpacing: 2,
    color: "#c0a0b0",
    textTransform: "uppercase",
    marginTop: -4,
  },
  divider: { width: 1, height: 90, marginHorizontal: 20 },
  phaseBlock: { flex: 1, gap: 4 },
  phaseName: { fontFamily: "DMSans_700Bold", fontSize: 18 },
  cycleLength: {
    fontFamily: "DMSans_400Regular",
    fontSize: 11,
    color: "#a8788c",
  },
  phaseBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 50,
    marginTop: 4,
  },
  phaseBadgeText: {
    fontFamily: "DMSans_700Bold",
    fontSize: 9,
    letterSpacing: 1,
  },
  phaseDescription: {
    fontFamily: "CormorantGaramond_300Light_Italic",
    fontSize: 15,
    color: "#3a2030",
    marginTop: 2,
  },
  phaseEnergy: {
    fontFamily: "DMSans_400Regular",
    fontSize: 12,
    color: "#a8788c",
  },

  insightCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 20,
    marginBottom: 20,
    gap: 14,
    shadowColor: "#C97B96",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  insightAccent: { width: 3, borderRadius: 2, flexShrink: 0 },
  insightText: {
    fontFamily: "DMSans_400Regular",
    fontSize: 14,
    color: "#3a2030",
    lineHeight: 24,
    fontStyle: "italic",
    flex: 1,
  },

  planCard: {
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 6,
    marginBottom: 20,
    shadowColor: "#C97B96",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  planRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  planIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  planLabel: {
    fontFamily: "DMSans_700Bold",
    fontSize: 8,
    letterSpacing: 2,
    marginBottom: 3,
  },
  planValue: {
    fontFamily: "DMSans_400Regular",
    fontSize: 13,
    color: "#3a2030",
  },
  planDivider: {
    height: 1,
    backgroundColor: "#f5e8ed",
    marginHorizontal: 16,
  },

  logCard: {
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 22,
    marginBottom: 20,
    shadowColor: "#C97B96",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  logStatusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  logStatusDot: { width: 7, height: 7, borderRadius: 4 },
  logStatus: {
    fontFamily: "DMSans_700Bold",
    fontSize: 10,
    letterSpacing: 1.5,
  },
  logStatusEmpty: {
    fontFamily: "DMSans_700Bold",
    fontSize: 10,
    letterSpacing: 1.5,
    color: "#b09aa5",
    flex: 1,
  },
  checkInBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 50,
  },
  checkInText: {
    fontFamily: "DMSans_700Bold",
    fontSize: 9,
    letterSpacing: 1.5,
  },
  logBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 50,
    marginBottom: 10,
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  logBtnText: {
    fontFamily: "DMSans_700Bold",
    fontSize: 15,
    color: "#fff",
  },
  logHint: {
    fontFamily: "DMSans_400Regular",
    fontSize: 11,
    color: "#c0a0b0",
    textAlign: "center",
  },
  logSummaryLine: {
    fontFamily: "DMSans_400Regular",
    fontSize: 14,
    color: "#3a2030",
    marginBottom: 14,
    textTransform: "capitalize",
  },
  logUpdateBtn: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 50,
    borderWidth: 1.5,
  },
  logUpdateText: {
    fontFamily: "DMSans_500Medium",
    fontSize: 12,
  },

  fabWrap: { position: "absolute", right: 20 },
  fab: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    shadowOpacity: 0.22,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },

  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(26,16,21,0.5)",
  },
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    maxHeight: "92%",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: -8 },
    elevation: 20,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: "#eddde5",
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 14,
    marginBottom: 0,
  },
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  sheetTitle: {
    fontFamily: "DMSans_700Bold",
    fontSize: 18,
    color: "#1a1015",
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#fce9f0",
    alignItems: "center",
    justifyContent: "center",
  },

  sheetSection: {
    fontFamily: "DMSans_700Bold",
    fontSize: 9,
    letterSpacing: 2.5,
    color: "#c0a0b0",
    marginLeft: 24,
    marginBottom: 10,
    marginTop: 18,
  },
  moodGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingHorizontal: 24,
    marginBottom: 4,
  },
  moodChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 50,
    backgroundColor: "#fdf6f4",
    borderWidth: 1,
    borderColor: "#eddde5",
  },
  moodChipText: {
    fontFamily: "DMSans_400Regular",
    fontSize: 12,
  },
  chipsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingHorizontal: 24,
    marginBottom: 4,
  },
  chip: {
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 50,
    backgroundColor: "#fdf6f4",
    borderWidth: 1,
    borderColor: "#eddde5",
  },
  chipText: {
    fontFamily: "DMSans_400Regular",
    fontSize: 12,
    color: "#a8788c",
  },
  noteWrap: {
    marginHorizontal: 24,
    backgroundColor: "#fdf6f4",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#eddde5",
    marginBottom: 4,
  },
  noteInput: {
    fontFamily: "DMSans_400Regular",
    fontSize: 14,
    color: "#1a1015",
    minHeight: 80,
    lineHeight: 22,
    paddingTop: 0,
  },
  saveBtn: {
    marginHorizontal: 24,
    marginTop: 22,
    marginBottom: 8,
    paddingVertical: 17,
    borderRadius: 50,
    alignItems: "center",
    shadowOpacity: 0.15,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 5 },
    elevation: 4,
  },
  saveBtnText: {
    fontFamily: "DMSans_700Bold",
    fontSize: 15,
    color: "#fff",
  },
});
