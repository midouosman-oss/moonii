
import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Animated,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import { Feather } from "@expo/vector-icons";
import { supabase } from "@/lib/supabase";
import { LANGUAGES, isRTL } from "@/lib/i18n";
import { onboardingText as ot } from "@/lib/onboardingI18n";

const ACCENT = "#C97B96";
const BG = "#fdf6f4";
const CARD = "#ffffff";
const DARK = "#1a0e14";
const MUTED = "#a8788c";
const BORDER = "#eddde5";

const STORAGE_KEY = "moonii:onboarding";
const PENDING_KEY = "moonii:pending-onboarding";

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
  lastPeriodStart: string | null;
  helpNeeds: string[];
  conditions: Condition[];
  severity: Partial<Record<Condition, Severity>>;
  dietary: string[];
  ageRange: string | null;
  region: string | null;
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
  region: null,
  notificationsEnabled: false,
  signUpMethod: null,
};

function toggleInArray<T>(arr: T[], value: T): T[] {
  return arr.includes(value)
    ? arr.filter((v) => v !== value)
    : [...arr, value];
}

// Format entered digits as DD/MM/YYYY.
function formatDateInput(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 8);

  if (digits.length <= 2) return digits;
  if (digits.length <= 4) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }

  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

// Convert DD/MM/YYYY to YYYY-MM-DD after validating the real calendar date.
function parseDateInput(value: string): string | null {
  const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return null;

  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);

  if (year < 1900 || year > 2100 || month < 1 || month > 12 || day < 1) {
    return null;
  }

  const date = new Date(Date.UTC(year, month - 1, day));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  if (date.getTime() > Date.now()) return null;

  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function triggerHaptic() {
  if (Platform.OS !== "web") {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  }
}

function ProgressBar({ step, total }: { step: number; total: number }) {
  return (
    <View style={styles.progressTrack}>
      <View
        style={[
          styles.progressFill,
          { width: `${((step + 1) / total) * 100}%` },
        ]}
      />
    </View>
  );
}

function Chip({
  label,
  selected,
  onPress,
  rtl = false,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  rtl?: boolean;
}) {
  return (
    <TouchableOpacity
      onPress={() => {
        triggerHaptic();
        onPress();
      }}
      style={[styles.chip, selected && styles.chipSelected]}
    >
      <Text style={[styles.chipText, selected && styles.chipTextSelected, rtl ? { textAlign: "right", writingDirection: "rtl" } : null]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function StepShell({
  title,
  subtitle,
  children,
  rtl = false,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  rtl?: boolean;
}) {
  return (
    <View style={{ flex: 1 }}>
      <Text style={[styles.stepTitle, rtl ? { textAlign: "right", writingDirection: "rtl" } : null]}>{title}</Text>
      {subtitle ? <Text style={[styles.stepSubtitle, rtl ? { textAlign: "right", writingDirection: "rtl" } : null]}>{subtitle}</Text> : null}
      <View style={{ marginTop: 24 }}>{children}</View>
    </View>
  );
}

export default function Onboarding({
  onComplete,
  language = "en",
  onLanguageChange,
}: {
  onComplete?: (data: OnboardingData) => void;
  language?: string;
  onLanguageChange?: (language: string) => void;
}) {
  const [languageModal, setLanguageModal] = useState(false);
  const t = (key: string) => ot(language, key);
  const rtl = isRTL(language);
  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingData>(initialData);
  const [dateInput, setDateInput] = useState("");
  const [dateError, setDateError] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState<
    "error" | "info" | "success"
  >("info");

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
      Animated.timing(fade, {
        toValue: 0,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(fade, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start();

    setStep(nextStep);
    setStatusMessage("");
  }

  function next() {
    if (current === "period") {
      const isoDate = parseDateInput(dateInput);

      if (!isoDate) {
        setDateError(
          dateInput.length === 0
            ? t("dateRequired")
            : t("dateInvalid")
        );
        return;
      }

      setDateError("");
      update("lastPeriodStart", isoDate);
    }

    if (step < total - 1) animateTo(step + 1);
  }

  function back() {
    if (step > 0) animateTo(step - 1);
  }

  function update<K extends keyof OnboardingData>(
    key: K,
    value: OnboardingData[K]
  ) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  async function submitToBackend(
    finalData: OnboardingData,
    userId: string
  ) {
    const { data: authData, error: authError } =
      await supabase.auth.getUser();

    if (authError) throw authError;

    if (!authData.user || authData.user.id !== userId) {
      throw new Error(t("sessionInvalid"));
    }

    const { data: savedData, error } = await supabase
      .from("user_onboarding")
      .upsert(
        {
          user_id: userId,
          responses: finalData,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      )
      .select("user_id")
      .single();

    if (error) throw error;

    if (!savedData?.user_id) {
      throw new Error(t("saveFailed"));
    }

    await AsyncStorage.removeItem(PENDING_KEY);

    console.log("Moonii: onboarding saved", savedData.user_id);
  }

  async function finish(finalData: OnboardingData) {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(finalData));
    await AsyncStorage.setItem(PENDING_KEY, JSON.stringify(finalData));

    const { data: authData, error: authError } =
      await supabase.auth.getUser();

    if (authError) throw authError;

    if (!authData.user) {
      throw new Error(t("signinRequired"));
    }

    await submitToBackend(finalData, authData.user.id);

    onComplete?.(finalData);
  }

  async function handleSignUp(
    method: "google" | "apple" | "email"
  ) {
    if (isSubmitting) return;

    setStatusMessage("");

    if (method !== "email") {
      setStatusType("info");
      setStatusMessage(
        t("methodUnavailable")
      );
      return;
    }

    const email = emailInput.trim().toLowerCase();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatusType("error");
      setStatusMessage(t("emailInvalid"));
      return;
    }

    if (passwordInput.length < 8) {
      setStatusType("error");
      setStatusMessage(t("passwordShort"));
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(t("connecting"));

    const finalData: OnboardingData = {
      ...data,
      signUpMethod: "email",
      email,
    };

    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(finalData));
      await AsyncStorage.setItem(PENDING_KEY, JSON.stringify(finalData));

      console.log("Moonii: starting authentication", email);

      const signup = await supabase.auth.signUp({
        email,
        password: passwordInput,
      });

      let needsLogin = false;

      if (signup.error) {
        const message = signup.error.message.toLowerCase();

        if (
          message.includes("already registered") ||
          message.includes("already exists")
        ) {
          needsLogin = true;
        } else {
          throw signup.error;
        }
      } else if (
        signup.data.user?.identities &&
        signup.data.user.identities.length === 0
      ) {
        needsLogin = true;
      }

      let session = signup.data.session;

      if (needsLogin) {
        const login = await supabase.auth.signInWithPassword({
          email,
          password: passwordInput,
        });

        if (login.error) throw login.error;

        session = login.data.session;
      }

      if (!session) {
        setStatusType("info");
        setStatusMessage(
          t("confirmEmail")
        );
        return;
      }

      await finish(finalData);

      setStatusType("success");
      setStatusMessage(t("profileSaved"));
    } catch (error: any) {
      console.error("Moonii authentication or sync error:", error);

      setStatusType("error");
      setStatusMessage(
        error?.message || t("genericError")
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <View style={[styles.screen, rtl ? { direction: "rtl" } : null]}>
      <View style={styles.header}>
        {step > 0 ? (
          <TouchableOpacity onPress={back} hitSlop={12}>
            <Feather name="arrow-left" size={20} color={DARK} />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 20 }} />
        )}

        <TouchableOpacity onPress={() => setLanguageModal(true)} style={styles.languageButton}>
          <Text style={styles.languageButtonText}>{language.toUpperCase()}</Text>
        </TouchableOpacity>

        <ProgressBar step={step} total={total} />

        <Text style={styles.stepCount}>
          {step + 1}/{total}
        </Text>
      </View>

      <Animated.View
        style={{
          flex: 1,
          opacity: fade,
          paddingHorizontal: 24,
        }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}
        >
          {current === "period" && (
            <StepShell
              rtl={rtl}
              title={t("periodTitle")}
              subtitle={t("periodSubtitle")}
            >
              <TextInput
                value={dateInput}
                onChangeText={(value) => {
                  const formatted = formatDateInput(value);
                  setDateInput(formatted);
                  setDateError("");

                  const isoDate = parseDateInput(formatted);
                  update("lastPeriodStart", isoDate);
                }}
                placeholder="DD/MM/YYYY"
                placeholderTextColor={MUTED}
                style={[
                  styles.input,
                  dateError ? styles.inputError : undefined,
                  rtl ? { writingDirection: "ltr", textAlign: "left" } : null,
                ]}
                keyboardType="number-pad"
                maxLength={10}
              />

              <Text style={[styles.hint, dateError ? styles.dateError : null]}>
                {dateError || t("dateExample")}
              </Text>
            </StepShell>
          )}

          {current === "help" && (
            <StepShell
              rtl={rtl}
              title={t("helpTitle")}
              subtitle={t("selectAll")}
            >
              <View style={styles.chipWrap}>
                {HELP_OPTIONS.map((opt) => (
                  <Chip
                    key={opt}
                    label={t(({
                      "Managing symptoms e.g. cramps": "helpSymptoms",
                      "Understanding my cycle better": "helpCycle",
                      "Emotional / mood support": "helpMood",
                      "Building better habits": "helpHabits",
                      Tracking: "helpTracking",
                    } as Record<string, string>)[opt])}
                    selected={data.helpNeeds.includes(opt)}
                    onPress={() =>
                      update("helpNeeds", toggleInArray(data.helpNeeds, opt))
                    }
                  />
                ))}
              </View>
            </StepShell>
          )}

          {current === "conditions" && (
            <StepShell rtl={rtl} title={t("conditionsTitle")}>
              {(["endometriosis", "pcos", "none"] as Condition[]).map(
                (cond) => {
                  const isSelected = data.conditions.includes(cond);

                  const label =
                    cond === "endometriosis"
                      ? t("endometriosis")
                      : cond === "pcos"
                      ? t("pcos")
                      : t("none");

                  return (
                    <View key={cond} style={{ marginBottom: 14 }}>
                      <TouchableOpacity
                        onPress={() => {
                          triggerHaptic();

                          if (cond === "none") {
                            update(
                              "conditions",
                              isSelected ? [] : ["none"]
                            );
                          } else {
                            const withoutNone = data.conditions.filter(
                              (c) => c !== "none"
                            );

                            update(
                              "conditions",
                              toggleInArray(withoutNone, cond)
                            );
                          }
                        }}
                        style={[
                          styles.rowOption,
                          isSelected && styles.rowOptionSelected,
                        ]}
                      >
                        <Text
                          style={[
                            styles.rowOptionText,
                            isSelected && styles.chipTextSelected,
                          ]}
                        >
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
                          {(["low", "medium", "severe"] as Severity[]).map(
                            (sev) => (
                              <Chip
                                key={sev}
                                rtl={rtl}
                                label={t(sev)}
                                selected={data.severity[cond] === sev}
                                onPress={() =>
                                  update("severity", {
                                    ...data.severity,
                                    [cond]: sev,
                                  })
                                }
                              />
                            )
                          )}
                        </View>
                      )}
                    </View>
                  );
                }
              )}
            </StepShell>
          )}

          {current === "dietary" && (
            <StepShell
              rtl={rtl}
              title={t("dietaryTitle")}
              subtitle={t("selectAll")}
            >
              <View style={styles.chipWrap}>
                {DIETARY_OPTIONS.map((opt) => (
                  <Chip
                    key={opt}
                    label={t(({
                      "No restrictions": "dietNone", Vegetarian: "dietVegetarian", Vegan: "dietVegan",
                      "Gluten free": "dietGluten", Pescatarian: "dietPescatarian", Halal: "dietHalal",
                      Kosher: "dietKosher", "Dairy free": "dietDairy",
                    } as Record<string, string>)[opt])}
                    selected={data.dietary.includes(opt)}
                    onPress={() =>
                      update("dietary", toggleInArray(data.dietary, opt))
                    }
                  />
                ))}
              </View>
            </StepShell>
          )}

          {current === "age" && (
            <StepShell rtl={rtl} title={t("ageTitle")}>
              <View style={styles.chipWrap}>
                {AGE_RANGES.map((range) => (
                  <Chip
                    key={range}
                    rtl={rtl}
                    label={range}
                    selected={data.ageRange === range}
                    onPress={() => update("ageRange", range)}
                  />
                ))}
              </View>
            </StepShell>
          )}

          {current === "location" && (
            <StepShell
              rtl={rtl}
              title={t("locationTitle")}
              subtitle={t("locationSubtitle")}
            >
              <TextInput
                value={data.region ?? ""}
                onChangeText={(t) => update("region", t)}
                placeholder={t("locationPlaceholder")}
                placeholderTextColor={MUTED}
                style={[styles.input, rtl ? { textAlign: "right", writingDirection: "rtl" } : null]}
              />
            </StepShell>
          )}

          {current === "notifications" && (
            <StepShell
              rtl={rtl}
              title={t("notificationsTitle")}
              subtitle={t("notificationsSubtitle")}
            >
              <TouchableOpacity
                onPress={() => update("notificationsEnabled", true)}
                style={[
                  styles.rowOption,
                  data.notificationsEnabled && styles.rowOptionSelected,
                  { marginBottom: 12 },
                ]}
              >
                <Text style={[styles.rowOptionText, data.notificationsEnabled && styles.chipTextSelected, rtl ? { textAlign: "right", writingDirection: "rtl" } : null]}>{t("yesReminder")}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => update("notificationsEnabled", false)}
                style={[
                  styles.rowOption,
                  !data.notificationsEnabled && styles.rowOptionSelected,
                ]}
              >
                <Text style={[styles.rowOptionText, !data.notificationsEnabled && styles.chipTextSelected, rtl ? { textAlign: "right", writingDirection: "rtl" } : null]}>{t("notNow")}</Text>
              </TouchableOpacity>

            </StepShell>
          )}

          {current === "signup" && (
            <StepShell rtl={rtl} title={t("signupTitle")} subtitle={t("lastStep")}>
              <TouchableOpacity
                style={styles.authButton}
                onPress={() => handleSignUp("google")}
                disabled={isSubmitting}
              >
                <Feather name="mail" size={16} color={DARK} />
                <Text style={styles.authButtonText}>{t("google")}</Text>
              </TouchableOpacity>

              {Platform.OS === "ios" && (
                <TouchableOpacity
                  style={styles.authButton}
                  onPress={() => handleSignUp("apple")}
                  disabled={isSubmitting}
                >
                  <Feather name="smartphone" size={16} color={DARK} />
                  <Text style={styles.authButtonText}>{t("apple")}</Text>
                </TouchableOpacity>
              )}

              <Text style={styles.orDivider}>{t("or")}</Text>

              <TextInput
                value={emailInput}
                onChangeText={setEmailInput}
                placeholder={t("email")}
                placeholderTextColor={MUTED}
                autoCapitalize="none"
                keyboardType="email-address"
                autoCorrect={false}
                style={[styles.input, rtl ? { writingDirection: "ltr", textAlign: "left" } : null]}
              />

              <View style={[styles.passwordContainer, { marginTop: 10 }]}>
                <TextInput
                  value={passwordInput}
                  onChangeText={setPasswordInput}
                  placeholder={t("password")}
                  placeholderTextColor={MUTED}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={[styles.passwordInput, rtl ? { writingDirection: "ltr", textAlign: "left" } : null]}
                />

                <TouchableOpacity
                  onPress={() => setShowPassword((visible) => !visible)}
                  style={styles.passwordToggle}
                  accessibilityRole="button"
                  accessibilityLabel={
                    showPassword ? t("hidePassword") : t("showPassword")
                  }
                  hitSlop={10}
                >
                  <Feather
                    name={showPassword ? "eye-off" : "eye"}
                    size={19}
                    color={MUTED}
                  />
                </TouchableOpacity>
              </View>

              {statusMessage ? (
                <Text
                  style={[
                    styles.statusMessage,
                    statusType === "error" && styles.statusError,
                    statusType === "success" && styles.statusSuccess,
                  ]}
                >
                  {statusMessage}
                </Text>
              ) : null}

              <TouchableOpacity
                style={[
                  styles.primaryButton,
                  { marginTop: 16 },
                  isSubmitting && { opacity: 0.6 },
                ]}
                onPress={() => handleSignUp("email")}
                disabled={isSubmitting}
              >
                <Text style={styles.primaryButtonText}>
                  {isSubmitting ? t("creating") : t("createAccount")}
                </Text>
              </TouchableOpacity>
            </StepShell>
          )}
        </ScrollView>
      </Animated.View>

      <Modal visible={languageModal} transparent animationType="fade" onRequestClose={() => setLanguageModal(false)}>
        <View style={styles.modalBackdrop}>
          <View style={[styles.languageModal, rtl ? { direction: "rtl" } : null]}>
            <Text style={styles.stepTitle}>{t("language")}</Text>
            <ScrollView style={{ maxHeight: 420 }}>
              {LANGUAGES.map((item) => (
                <TouchableOpacity key={item.code} style={styles.languageOption} onPress={() => { onLanguageChange?.(item.code); setLanguageModal(false); }}>
                  <Text style={[styles.languageOptionText, rtl ? { textAlign: "right", writingDirection: "rtl" } : null]}>{item.label}</Text>
                  {language === item.code ? <Feather name="check" size={17} color={ACCENT} /> : null}
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity onPress={() => setLanguageModal(false)} style={[styles.primaryButton, { marginTop: 12 }]}><Text style={styles.primaryButtonText}>{t("continue")}</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>

      {current !== "signup" && (
        <View style={styles.footer}>
          <TouchableOpacity style={styles.primaryButton} onPress={next}>
            <Text style={styles.primaryButtonText}>{t("continue")}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: BG,
    paddingTop: 60,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 20,
    gap: 12,
  },
  languageButton: { minWidth: 34, paddingHorizontal: 7, paddingVertical: 5, borderRadius: 12, backgroundColor: CARD, alignItems: "center" },
  languageButtonText: { fontSize: 10, color: MUTED, fontWeight: "700" },
  modalBackdrop: { flex: 1, backgroundColor: "rgba(26,14,20,0.35)", justifyContent: "center", padding: 24 },
  languageModal: { backgroundColor: BG, borderRadius: 22, padding: 20 },
  languageOption: { minHeight: 46, flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderBottomWidth: 1, borderBottomColor: BORDER },
  languageOptionText: { fontSize: 14, color: DARK },
  progressTrack: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: BORDER,
    overflow: "hidden",
  },
  progressFill: {
    height: 4,
    backgroundColor: ACCENT,
    borderRadius: 2,
  },
  stepCount: {
    fontSize: 11,
    color: MUTED,
    minWidth: 28,
    textAlign: "right",
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: DARK,
    marginTop: 8,
  },
  stepSubtitle: {
    fontSize: 13,
    color: MUTED,
    marginTop: 6,
    lineHeight: 19,
  },
  hint: {
    fontSize: 11,
    color: MUTED,
    marginTop: 10,
    fontStyle: "italic",
  },
  dateError: {
    color: "#b42318",
  },
  chipWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    paddingVertical: 9,
    paddingHorizontal: 15,
    borderRadius: 50,
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: BORDER,
  },
  chipSelected: {
    backgroundColor: ACCENT + "18",
    borderColor: ACCENT,
  },
  chipText: {
    fontSize: 13,
    color: MUTED,
  },
  chipTextSelected: {
    color: DARK,
    fontWeight: "500",
  },
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
  rowOptionSelected: {
    borderColor: ACCENT,
    backgroundColor: ACCENT + "10",
  },
  rowOptionText: {
    fontSize: 14,
    color: DARK,
  },
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
  inputError: {
    borderColor: "#b42318",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    paddingLeft: 16,
    paddingRight: 14,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 14,
    color: DARK,
  },
  passwordToggle: {
    padding: 4,
    marginLeft: 8,
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
  authButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: DARK,
  },
  orDivider: {
    textAlign: "center",
    color: MUTED,
    fontSize: 12,
    marginVertical: 12,
  },
  statusMessage: {
    fontSize: 12,
    lineHeight: 18,
    marginTop: 12,
    textAlign: "center",
    color: MUTED,
  },
  statusError: {
    color: "#b42318",
  },
  statusSuccess: {
    color: "#287a45",
  },
  primaryButton: {
    backgroundColor: ACCENT,
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 28,
    paddingTop: 8,
  },
});
