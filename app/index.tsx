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
import * as Haptics from "expo-haptics";
import { Feather } from "@expo/vector-icons";
import { Redirect } from "expo-router";
import { useColors } from "@/hooks/useColors";
import { useCycle, Phase } from "@/context/CycleContext";

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

// Log modal data (exact from original HTML)
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
  onPress,
}: {
  mood: (typeof MOODS)[0];
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
        {mood.label}
      </Text>
    </TouchableOpacity>
  );
}

// ─── Generic chip row ─────────────────────────────────────────────────────────

function ChipRow({
  options,
  selected,
  phaseColor,
  onPress,
  single = false,
}: {
  options: string[];
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
              {opt}
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
  onClose,
  onSave,
}: {
  visible: boolean;
  phaseColor: string;
  phase: Phase;
  onClose: () => void;
  onSave: (data: any) => void;
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
      setMoods([]);
      setEnergy("");
      setSleep("");
      setMovement([]);
      setNourishment([]);
      setSymptoms([]);
      setNote("");
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
  }, [visible]);

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [700, 0],
  });

  const toggle = (arr: string[], val: string) =>
    arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];

  const handleSave = () => {
    onSave({
      moods,
      energy: ENERGY_LEVELS.indexOf(energy) + 1,
      sleep,
      movement,
      nourishment,
      symptoms,
      note,
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
        ]}
      >
        <View style={styles.handle} />

        {/* Header */}
        <View style={styles.sheetHeader}>
          <Text style={styles.sheetTitle}>Today's Log</Text>
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
          {/* HOW ARE YOU FEELING */}
          <Text style={styles.sheetSection}>HOW ARE YOU FEELING?</Text>
          <View style={styles.moodGrid}>
            {MOODS.map((m) => (
              <MoodChip
                key={m.id}
                mood={m}
                selected={moods.includes(m.id)}
                phaseColor={phaseColor}
                onPress={() => setMoods((prev) => toggle(prev, m.id))}
              />
            ))}
          </View>

          {/* ENERGY */}
          <Text style={styles.sheetSection}>ENERGY</Text>
          <View style={styles.chipsWrap}>
            {ENERGY_LEVELS.map((e) => (
              <TouchableOpacity
                key={e}
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
                  {e}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* SLEEP */}
          <Text style={styles.sheetSection}>SLEEP LAST NIGHT</Text>
          <ChipRow
            options={SLEEP_OPTIONS}
            selected={sleep ? [sleep] : []}
            phaseColor={phaseColor}
            onPress={(v) => setSleep((prev) => (prev === v ? "" : v))}
            single
          />

          {/* MOVEMENT */}
          <Text style={styles.sheetSection}>MOVEMENT</Text>
          <ChipRow
            options={MOVEMENT_OPTIONS}
            selected={movement}
            phaseColor={phaseColor}
            onPress={(v) => setMovement((prev) => toggle(prev, v))}
          />

          {/* NOURISHMENT */}
          <Text style={styles.sheetSection}>NOURISHMENT</Text>
          <ChipRow
            options={NOURISHMENT_OPTIONS}
            selected={nourishment}
            phaseColor={phaseColor}
            onPress={(v) => setNourishment((prev) => toggle(prev, v))}
          />

          {/* SYMPTOMS */}
          <Text style={styles.sheetSection}>SYMPTOMS</Text>
          <ChipRow
            options={SYMPTOM_OPTIONS}
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

          {/* NOTE */}
          <Text style={styles.sheetSection}>ANYTHING TO ADD?</Text>
          <View style={styles.noteWrap}>
            <TextInput
              style={styles.noteInput}
              value={note}
              onChangeText={setNote}
              placeholder="Write freely. This is just for you."
              placeholderTextColor="#c0a0b0"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          {/* Save */}
          <TouchableOpacity
            style={[styles.saveBtn, { backgroundColor: phaseColor }]}
            onPress={handleSave}
            activeOpacity={0.85}
          >
            <Text style={styles.saveBtnText}>Save today's log</Text>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>
    </Modal>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { ready, hasOnboarded, currentPhase, cycleDay, settings, saveLog, getLog } = useCycle();

  // Wait for AsyncStorage to load before deciding anything (avoids a
  // flash of the "no data yet" state), then send first-time users
  // through the onboarding flow.
  if (!ready) return null;
  if (!hasOnboarded) return <Redirect href="/onboarding" />;

  const today = new Date().toISOString().split("T")[0];
  const existingLog = getLog(today);
  const isLogged = !!(existingLog?.moods?.length || existingLog?.energy);

  const [modalVisible, setModalVisible] = useState(false);
  const phaseColor = PHASE_COLORS[currentPhase];

  const greeting = (() => {
    const h = new Date().getHours();
    return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
  })();

  const { phaseDay, phaseTotal } = getPhaseInfo(
    cycleDay,
    currentPhase,
    settings.cycleLength,
    settings.periodLength,
  );
  const plan = TODAYS_PLAN[currentPhase];

  const handleSave = useCallback(
    (data: any) => {
      saveLog(today, data);
    },
    [saveLog, today],
  );

  const topPad = insets.top + (Platform.OS === "web" ? 67 : 8);

  return (
    <View style={styles.container}>
      {/* Ambient blob */}
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
          paddingBottom: Platform.OS === "web" ? 120 : 120,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── GREETING ── */}
        <AnimatedCard delay={0}>
          <Text style={styles.wordmark}>moonii</Text>
          <Text style={styles.greeting}>
            {greeting}
            {settings.name ? `, ${settings.name.split(" ")[0]}` : ""}
          </Text>
        </AnimatedCard>

        {/* ── YOUR CYCLE card ── */}
        <AnimatedCard delay={80}>
          <Text style={styles.sectionLabel}>Your Cycle</Text>

          <View style={[styles.cycleCard, { borderTopColor: phaseColor }]}>
            <View style={styles.cycleCardInner}>
              {/* Left: big day number */}
              <View style={styles.dayBlock}>
                <Text style={[styles.dayNumber, { color: phaseColor }]}>
                  {cycleDay}
                </Text>
                <Text style={styles.dayLabel}>DAY OF CYCLE</Text>
              </View>

              {/* Divider */}
              <View
                style={[styles.divider, { backgroundColor: phaseColor + "25" }]}
              />

              {/* Right: phase info */}
              <View style={styles.phaseBlock}>
                <Text style={[styles.phaseName, { color: phaseColor }]}>
                  {PHASE_LABELS[currentPhase]}
                </Text>
                <Text style={styles.cycleLength}>
                  {settings.cycleLength}-day cycle
                </Text>
                <View
                  style={[
                    styles.phaseBadge,
                    { backgroundColor: phaseColor + "14" },
                  ]}
                >
                  <Text style={[styles.phaseBadgeText, { color: phaseColor }]}>
                    PHASE {PHASE_NUM[currentPhase]} · DAY{" "}
                    {Math.max(1, phaseDay)} OF {Math.max(1, phaseTotal)}
                  </Text>
                </View>
                <Text style={styles.phaseDescription}>
                  {PHASE_DESCRIPTION[currentPhase]}
                </Text>
                <Text style={styles.phaseEnergy}>
                  {PHASE_ENERGY[currentPhase]}
                </Text>
              </View>
            </View>
          </View>
        </AnimatedCard>

        {/* ── TODAY'S INSIGHT ── */}
        <AnimatedCard delay={160}>
          <Text style={styles.sectionLabel}>Today's Insight</Text>
          <View style={styles.insightCard}>
            <View
              style={[styles.insightAccent, { backgroundColor: phaseColor }]}
            />
            <Text style={styles.insightText}>
              {TODAYS_INSIGHT[currentPhase]}
            </Text>
          </View>
        </AnimatedCard>

        {/* ── TODAY'S PLAN ── */}
        <AnimatedCard delay={240}>
          <Text style={styles.sectionLabel}>Today's Plan</Text>
          <View style={styles.planCard}>
            {(
              [
                { label: "Move", value: plan.move, icon: "activity" as const },
                { label: "Mind", value: plan.mind, icon: "wind" as const },
                {
                  label: "Nourish",
                  value: plan.nourish,
                  icon: "coffee" as const,
                },
              ] as const
            ).map(({ label, value, icon }, i, arr) => (
              <View key={label}>
                <View style={styles.planRow}>
                  <View
                    style={[
                      styles.planIcon,
                      { backgroundColor: phaseColor + "14" },
                    ]}
                  >
                    <Feather name={icon} size={14} color={phaseColor} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.planLabel, { color: phaseColor }]}>
                      {label.toUpperCase()}
                    </Text>
                    <Text style={styles.planValue}>{value}</Text>
                  </View>
                </View>
                {i < arr.length - 1 && <View style={styles.planDivider} />}
              </View>
            ))}
          </View>
        </AnimatedCard>

        {/* ── DAILY LOG ── */}
        <AnimatedCard delay={320}>
          <Text style={styles.sectionLabel}>Daily Log</Text>
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
                    CHECKED IN
                  </Text>
                </View>
                <Text style={styles.logSummaryLine}>
                  {existingLog?.moods?.length
                    ? existingLog.moods.slice(0, 3).join(", ")
                    : "Log saved for today"}
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
                    Update log
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
                  <Text style={styles.logStatusEmpty}>NOT LOGGED YET</Text>
                  <View
                    style={[
                      styles.checkInBadge,
                      { backgroundColor: phaseColor + "14" },
                    ]}
                  >
                    <Text style={[styles.checkInText, { color: phaseColor }]}>
                      CHECK IN
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
                  <Text style={styles.logBtnText}>Log today</Text>
                </TouchableOpacity>
                <Text style={styles.logHint}>
                  Mood · Energy · Sleep · Symptoms
                </Text>
              </>
            )}
          </View>
        </AnimatedCard>
      </ScrollView>

      {/* ── FAB ── */}
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

      <LogModal
        visible={modalVisible}
        phaseColor={phaseColor}
        phase={currentPhase}
        onClose={() => setModalVisible(false)}
        onSave={handleSave}
      />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fdf6f4" },
  blob: { position: "absolute", borderRadius: 999 },
  scroll: { flex: 1 },

  // Header
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

  // Section label (above each card)
  sectionLabel: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 9,
    letterSpacing: 2.5,
    color: "#c0a0b0",
    textTransform: "uppercase",
    marginBottom: 10,
    marginLeft: 2,
  },

  // Cycle card
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
    fontFamily: "DMSans_600SemiBold",
    fontSize: 8,
    letterSpacing: 2,
    color: "#c0a0b0",
    textTransform: "uppercase",
    marginTop: -4,
  },
  divider: { width: 1, height: 90, marginHorizontal: 20 },
  phaseBlock: { flex: 1, gap: 4 },
  phaseName: { fontFamily: "DMSans_600SemiBold", fontSize: 18 },
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
    fontFamily: "DMSans_600SemiBold",
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

  // Insight card
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

  // Plan card
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
    fontFamily: "DMSans_600SemiBold",
    fontSize: 8,
    letterSpacing: 2,
    marginBottom: 3,
  },
  planValue: {
    fontFamily: "DMSans_400Regular",
    fontSize: 13,
    color: "#3a2030",
  },
  planDivider: { height: 1, backgroundColor: "#f5e8ed", marginHorizontal: 16 },

  // Log card
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
    fontFamily: "DMSans_600SemiBold",
    fontSize: 10,
    letterSpacing: 1.5,
  },
  logStatusEmpty: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 10,
    letterSpacing: 1.5,
    color: "#b09aa5",
    flex: 1,
  },
  checkInBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 50 },
  checkInText: {
    fontFamily: "DMSans_600SemiBold",
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
  logBtnText: { fontFamily: "DMSans_600SemiBold", fontSize: 15, color: "#fff" },
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
  logUpdateText: { fontFamily: "DMSans_500Medium", fontSize: 12 },

  // FAB
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

  // Modal
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
    fontFamily: "DMSans_600SemiBold",
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

  // Modal sections
  sheetSection: {
    fontFamily: "DMSans_600SemiBold",
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
  moodChipText: { fontFamily: "DMSans_400Regular", fontSize: 12 },
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
  chipText: { fontFamily: "DMSans_400Regular", fontSize: 12, color: "#a8788c" },
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
    fontFamily: "DMSans_600SemiBold",
    fontSize: 15,
    color: "#fff",
  },
});
