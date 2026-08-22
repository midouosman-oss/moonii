import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Animated,
  Platform,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import { Feather } from "@expo/vector-icons";

// ─────────────────────────────────────────────────────────────────────────
// Brand tokens — pull these from the shared design-tokens file once one
// exists (see "technical debt" note in the improvements list: HTML and RN
// currently duplicate colours/copy in two places).
// ─────────────────────────────────────────────────────────────────────────
const ACCENT = "#C97B96";
const BG = "#fdf6f4";
const CARD = "#ffffff";
const DARK = "#1a0e14";
const MUTED = "#a8788c";
const PILL = "#fce9f0";
const BORDER = "#eddde5";

const STORAGE_KEY = "moonii:onboarding";

// ─────────────────────────────────────────────────────────────────────────
// Step data, transcribed from the client's handwritten questionnaire
// ─────────────────────────────────────────────────────────────────────────
const HELP_OPTIONS = [
  "Managing symptoms e.g. cramps",
  "Understanding my cycle better",
  "Emotional / mood support",
  "Building better habits",
  "Tracking",
];

const DIETARY_OPTIONS = [
  "No restrictions",
  "Vegetarian",
  "Vegan",
  "Gluten free",
  "Pescatarian",
  "Halal",
  "Kosher",
  "Dairy free",
];

const AGE_RANGES = ["13–18", "18–25", "25–34", "35–42", "42–50", "50+"];

type Condition = "endometriosis" | "pcos" | "none";
type Severity = "low" | "medium" | "severe";

interface OnboardingData {
  lastPeriodStart: string | null; // ISO date
  helpNeeds: string[];
  conditions: Condition[];
  severity: Partial<Record<Condition, Severity>>;
  dietary: string[];
  ageRange: string | null;
  timezone: string | null;
  notificationsEnabled: boolean;
  signUpMethod: "google" | "apple" | "email" | null;
  email?: string;
}

const initialData: OnboardingData = {
  lastPeriodStart: null,
  helpNeeds: [],
  conditions: [],
  severity: {},
  dietary: [],
  ageRange: null,
  timezone: null,
  notificationsEnabled: false,
  signUpMethod: null,
};

function toggleInArray<T>(arr: T[], value: T): T[] {
  return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
}

// ─────────────────────────────────────────────────────────────────────────
// Reusable pieces
// ─────────────────────────────────────────────────────────────────────────
function ProgressBar({ step, total }: { step: number; total: number }) {
  return (
    <View style={styles.progressTrack}>
      <View style={[styles.progressFill, { width: `${((step + 1) / total) * 100}%` }]} />
    </View>
  );
}

function Chip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      style={[styles.chip, selected && styles.chipSelected]}
    >
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
    </TouchableOpacity>
  );
}

function StepShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.stepTitle}>{title}</Text>
      {subtitle ? <Text style={styles.stepSubtitle}>{subtitle}</Text> : null}
      <View style={{ marginTop: 24 }}>{children}</View>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Main flow
// ─────────────────────────────────────────────────────────────────────────
export default function Onboarding({ onComplete }: { onComplete?: (data: OnboardingData) => void }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingData>(initialData);
  const [dateInput, setDateInput] = useState(""); // YYYY-MM-DD, simple text entry
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const fade = useRef(new Animated.Value(1)).current;

  const steps = [
    "period",
    "help",
    "conditions",
    "dietary",
    "age",
    "location",
    "notifications",
    "signup",
  ] as const;
  const total = steps.length;
  const current = steps[step];

  function animateTo(nextStep: number) {
    Animated.sequence([
      Animated.timing(fade, { toValue: 0, duration: 120, useNativeDriver: true }),
      Animated.timing(fade, { toValue: 1, duration: 180, useNativeDriver: true }),
    ]).start();
    setStep(nextStep);
  }

  function next() {
    if (step < total - 1) animateTo(step + 1);
  }
  function back() {
    if (step > 0) animateTo(step - 1);
  }

  function update<K extends keyof OnboardingData>(key: K, value: OnboardingData[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  // ── Improvement #1 (persistent storage): save locally as soon as the
  // flow finishes, then hand off to submitToBackend() for Supabase.
  async function finish(finalData: OnboardingData) {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(finalData));
    } catch (e) {
      console.warn("Failed to persist onboarding data locally", e);
    }
    await submitToBackend(finalData);
    onComplete?.(finalData);
  }

  // ── Backend integration point. Wire this up to Supabase once the
  // project's client/schema exists — see notes: table stores questionnaire
  // answers + a symptom/energy "flag" column that the tip-recommendation
  // engine reads from to serve tagged tips.
  async function submitToBackend(finalData: OnboardingData) {
    // Example shape, once Supabase is wired in:
    //
    // const { error } = await supabase.from("onboarding_responses").insert({
    //   user_id: currentUser.id,
    //   last_period_start: finalData.lastPeriodStart,
    //   help_needs: finalData.helpNeeds,
    //   conditions: finalData.conditions,
    //   condition_severity: finalData.severity,
    //   dietary: finalData.dietary,
    //   age_range: finalData.ageRange,
    //   timezone: finalData.timezone,
    //   notifications_enabled: finalData.notificationsEnabled,
    // });
    // if (error) throw error;
    console.log("submitToBackend (stub) →", finalData);
  }

  function handleSignUp(method: "google" | "apple" | "email") {
    update("signUpMethod", method);
    if (method === "email") {
      if (!emailInput || passwordInput.length < 8) {
        Alert.alert("Almost there", "Enter an email and a password of at least 8 characters.");
        return;
      }
      finish({ ...data, signUpMethod: method, email: emailInput });
      return;
    }
    // Google / Apple: hand off to their native sign-in SDKs, then finish().
    // e.g. const result = await GoogleSignin.signIn(); ...
    finish({ ...data, signUpMethod: method });
  }

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        {step > 0 ? (
          <TouchableOpacity onPress={back} hitSlop={12}>
            <Feather name="arrow-left" size={20} color={DARK} />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 20 }} />
        )}
        <ProgressBar step={step} total={total} />
        <Text style={styles.stepCount}>
          {step + 1}/{total}
        </Text>
      </View>

      <Animated.View style={{ flex: 1, opacity: fade, paddingHorizontal: 24 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
          {current === "period" && (
            <StepShell
              title="When did your last period start?"
              subtitle="This is how moonii works out where you are in your cycle."
            >
              <TextInput
                value={dateInput}
                onChangeText={(t) => {
                  setDateInput(t);
                  update("lastPeriodStart", t);
                }}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={MUTED}
                style={styles.input}
                keyboardType={Platform.select({ ios: "numbers-and-punctuation", default: "default" })}
              />
              <Text style={styles.hint}>
                Swap this for a native date picker (e.g. @react-native-community/datetimepicker)
                before shipping — free text is a placeholder for the wireframe.
              </Text>
            </StepShell>
          )}

          {current === "help" && (
            <StepShell title="What do you need most help with?" subtitle="Select all that apply.">
              <View style={styles.chipWrap}>
                {HELP_OPTIONS.map((opt) => (
                  <Chip
                    key={opt}
                    label={opt}
                    selected={data.helpNeeds.includes(opt)}
                    onPress={() => update("helpNeeds", toggleInArray(data.helpNeeds, opt))}
                  />
                ))}
              </View>
            </StepShell>
          )}

          {current === "conditions" && (
            <StepShell title="Do you have any of the following conditions?">
              {(["endometriosis", "pcos", "none"] as Condition[]).map((cond) => {
                const isSelected = data.conditions.includes(cond);
                const label =
                  cond === "endometriosis" ? "Endometriosis" : cond === "pcos" ? "PCOS" : "None of these";
                return (
                  <View key={cond} style={{ marginBottom: 14 }}>
                    <TouchableOpacity
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        if (cond === "none") {
                          update("conditions", isSelected ? [] : ["none"]);
                        } else {
                          const withoutNone = data.conditions.filter((c) => c !== "none");
                          update("conditions", toggleInArray(withoutNone, cond));
                        }
                      }}
                      style={[styles.rowOption, isSelected && styles.rowOptionSelected]}
                    >
                      <Text style={[styles.rowOptionText, isSelected && styles.chipTextSelected]}>
                        {label}
                      </Text>
                      <Feather
                        name={isSelected ? "check-circle" : "circle"}
                        size={18}
                        color={isSelected ? ACCENT : MUTED}
                      />
                    </TouchableOpacity>

                    {isSelected && cond !== "none" && (
                      <View style={styles.chipWrap}>
                        {(["low", "medium", "severe"] as Severity[]).map((sev) => (
                          <Chip
                            key={sev}
                            label={sev[0].toUpperCase() + sev.slice(1)}
                            selected={data.severity[cond] === sev}
                            onPress={() =>
                              update("severity", { ...data.severity, [cond]: sev })
                            }
                          />
                        ))}
                      </View>
                    )}
                  </View>
                );
              })}
            </StepShell>
          )}

          {current === "dietary" && (
            <StepShell title="Dietary preferences" subtitle="Select all that apply.">
              <View style={styles.chipWrap}>
                {DIETARY_OPTIONS.map((opt) => (
                  <Chip
                    key={opt}
                    label={opt}
                    selected={data.dietary.includes(opt)}
                    onPress={() => update("dietary", toggleInArray(data.dietary, opt))}
                  />
                ))}
              </View>
            </StepShell>
          )}

          {current === "age" && (
            <StepShell title="Age range">
              <View style={styles.chipWrap}>
                {AGE_RANGES.map((range) => (
                  <Chip
                    key={range}
                    label={range}
                    selected={data.ageRange === range}
                    onPress={() => update("ageRange", range)}
                  />
                ))}
              </View>
            </StepShell>
          )}

          {current === "location" && (
            <StepShell title="Location / timezone" subtitle="We'll use this to time your daily check-ins.">
              {/* Swap for a real dropdown (e.g. a bottom-sheet picker) —
                  a plain text field is a placeholder for the wireframe. */}
              <TextInput
                value={data.timezone ?? ""}
                onChangeText={(t) => update("timezone", t)}
                placeholder="e.g. Europe/Kyiv"
                placeholderTextColor={MUTED}
                style={styles.input}
              />
            </StepShell>
          )}

          {current === "notifications" && (
            <StepShell
              title="Stay in the loop"
              subtitle="moonii sends a gentle daily check-in — never more than one a day. You can turn this off anytime in Settings."
            >
              <TouchableOpacity
                onPress={() => update("notificationsEnabled", true)}
                style={[
                  styles.rowOption,
                  data.notificationsEnabled && styles.rowOptionSelected,
                  { marginBottom: 12 },
                ]}
              >
                <Text style={[styles.rowOptionText, data.notificationsEnabled && styles.chipTextSelected]}>
                  Yes, remind me — "How are you feeling today?"
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => update("notificationsEnabled", false)}
                style={[styles.rowOption, !data.notificationsEnabled && styles.rowOptionSelected]}
              >
                <Text style={[styles.rowOptionText, !data.notificationsEnabled && styles.chipTextSelected]}>
                  Not right now
                </Text>
              </TouchableOpacity>
              <Text style={styles.hint}>
                Tapping the notification should deep-link straight to the log page, not just open
                the app — wire this through your push payload's route/screen field.
              </Text>
            </StepShell>
          )}

          {current === "signup" && (
            <StepShell title="Create your account" subtitle="Last step.">
              <TouchableOpacity style={styles.authButton} onPress={() => handleSignUp("google")}>
                <Feather name="mail" size={16} color={DARK} />
                <Text style={styles.authButtonText}>Continue with Google</Text>
              </TouchableOpacity>
              {Platform.OS === "ios" && (
                <TouchableOpacity style={styles.authButton} onPress={() => handleSignUp("apple")}>
                  <Feather name="smartphone" size={16} color={DARK} />
                  <Text style={styles.authButtonText}>Continue with Apple</Text>
                </TouchableOpacity>
              )}

              <Text style={styles.orDivider}>or</Text>

              <TextInput
                value={emailInput}
                onChangeText={setEmailInput}
                placeholder="Email"
                placeholderTextColor={MUTED}
                autoCapitalize="none"
                keyboardType="email-address"
                style={styles.input}
              />
              <TextInput
                value={passwordInput}
                onChangeText={setPasswordInput}
                placeholder="Create a password"
                placeholderTextColor={MUTED}
                secureTextEntry
                style={[styles.input, { marginTop: 10 }]}
              />
              <TouchableOpacity
                style={[styles.primaryButton, { marginTop: 16 }]}
                onPress={() => handleSignUp("email")}
              >
                <Text style={styles.primaryButtonText}>Create account</Text>
              </TouchableOpacity>
            </StepShell>
          )}
        </ScrollView>
      </Animated.View>

      {current !== "signup" && (
        <View style={styles.footer}>
          <TouchableOpacity style={styles.primaryButton} onPress={next}>
            <Text style={styles.primaryButtonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: BG, paddingTop: 60 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 20,
    gap: 12,
  },
  progressTrack: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: BORDER,
    overflow: "hidden",
  },
  progressFill: { height: 4, backgroundColor: ACCENT, borderRadius: 2 },
  stepCount: { fontSize: 11, color: MUTED, minWidth: 28, textAlign: "right" },

  stepTitle: { fontSize: 22, fontWeight: "600", color: DARK, marginTop: 8 },
  stepSubtitle: { fontSize: 13, color: MUTED, marginTop: 6, lineHeight: 19 },
  hint: { fontSize: 11, color: MUTED, marginTop: 10, fontStyle: "italic" },

  chipWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    paddingVertical: 9,
    paddingHorizontal: 15,
    borderRadius: 50,
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: BORDER,
  },
  chipSelected: { backgroundColor: ACCENT + "18", borderColor: ACCENT },
  chipText: { fontSize: 13, color: MUTED },
  chipTextSelected: { color: DARK, fontWeight: "500" },

  rowOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  rowOptionSelected: { borderColor: ACCENT, backgroundColor: ACCENT + "10" },
  rowOptionText: { fontSize: 14, color: DARK },

  input: {
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 14,
    color: DARK,
  },

  authButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 50,
    paddingVertical: 14,
    marginBottom: 10,
  },
  authButtonText: { fontSize: 14, fontWeight: "500", color: DARK },
  orDivider: { textAlign: "center", color: MUTED, fontSize: 12, marginVertical: 12 },

  primaryButton: {
    backgroundColor: ACCENT,
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: "center",
  },
  primaryButtonText: { color: "#fff", fontSize: 15, fontWeight: "600" },

  footer: { paddingHorizontal: 24, paddingBottom: 28, paddingTop: 8 },
});
