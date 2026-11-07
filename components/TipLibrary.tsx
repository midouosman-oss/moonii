import React from "react";
import { View, Text, StyleSheet } from "react-native";
import type { Phase } from "@/context/CycleContext";
import { getTipsForPhase, type Tip } from "@/data/tipLibrary";

const PHASE_LABELS: Record<Phase, string> = {
  menstrual: "Menstrual",
  follicular: "Follicular",
  ovulatory: "Ovulatory",
  luteal: "Luteal",
};

const PILLAR_COLORS = {
  Nourishment: "#c4836a",
  Movement: "#7ab090",
  Mind: "#9a9a50",
};

function TipCard({ tip }: { tip: Tip }) {
  const color = PILLAR_COLORS[tip.pillar];
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Text style={[styles.pillar, { color }]}>{tip.pillar.toUpperCase()}</Text>
        <Text style={styles.energy}>{tip.energy.toUpperCase()} ENERGY</Text>
      </View>
      <Text style={styles.nudge}>{tip.nudge}</Text>
      <Text style={styles.topic}>{tip.topic}</Text>
      <Text style={styles.explanation}>{tip.explanation}</Text>
      <View style={styles.tags}>
        {tip.tags.map((tag) => (
          <View key={tag} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export default function TipLibrary({ phase }: { phase: Phase }) {
  const tips = getTipsForPhase(phase);
  return (
    <View style={styles.section}>
      <Text style={styles.eyebrow}>YOUR DAILY CARE</Text>
      <Text style={styles.heading}>A little care for your {PHASE_LABELS[phase].toLowerCase()} phase</Text>
      <Text style={styles.subheading}>Three gentle ideas. Keep what feels right; skip what doesn't.</Text>
      {tips.map((tip) => <TipCard key={tip.id} tip={tip} />)}
      <Text style={styles.disclaimer}>
        Cycle patterns and energy vary. These ideas are general wellbeing support, not a diagnosis or a substitute for personalised medical advice.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: 22 },
  eyebrow: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 9,
    letterSpacing: 2.5,
    color: "#c0a0b0",
    marginBottom: 8,
    marginLeft: 2,
  },
  heading: {
    fontFamily: "CormorantGaramond_300Light_Italic",
    fontSize: 25,
    lineHeight: 30,
    color: "#1a1015",
    marginBottom: 5,
  },
  subheading: {
    fontFamily: "DMSans_400Regular",
    fontSize: 12,
    lineHeight: 19,
    color: "#a8788c",
    marginBottom: 14,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 18,
    marginBottom: 12,
    shadowColor: "#C97B96",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  topRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 9 },
  pillar: { fontFamily: "DMSans_600SemiBold", fontSize: 9, letterSpacing: 1.8 },
  energy: { fontFamily: "DMSans_600SemiBold", fontSize: 8, letterSpacing: 1.2, color: "#b09aa5" },
  nudge: {
    fontFamily: "CormorantGaramond_300Light_Italic",
    fontSize: 22,
    lineHeight: 27,
    color: "#1a1015",
    marginBottom: 5,
  },
  topic: { fontFamily: "DMSans_500Medium", fontSize: 10, color: "#a8788c", marginBottom: 9 },
  explanation: { fontFamily: "DMSans_400Regular", fontSize: 12, lineHeight: 20, color: "#5b4550" },
  tags: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 12 },
  tag: { backgroundColor: "#fdf6f4", borderRadius: 30, paddingHorizontal: 9, paddingVertical: 5 },
  tagText: { fontFamily: "DMSans_400Regular", fontSize: 9, color: "#a8788c" },
  disclaimer: { fontFamily: "DMSans_400Regular", fontSize: 10, lineHeight: 16, color: "#a8788c", marginTop: 2 },
});
