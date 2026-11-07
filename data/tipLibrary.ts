import type { Phase } from "@/context/CycleContext";

export type Pillar = "Nourishment" | "Movement" | "Mind";
export type Energy = "Low" | "Medium" | "High";

export interface Tip {
  id: string;
  pillar: Pillar;
  phase: Phase;
  topic: string;
  nudge: string;
  explanation: string;
  energy: Energy;
  tags: string[];
  regions: ("India" | "Thailand" | "Global")[];
}

// Phase labels are a gentle organizing aid, not a prediction of how every
// person will feel. Users should follow their symptoms, preferences and advice
// from their own healthcare professional.
export const TIP_LIBRARY: Tip[] = [
  {
    id: "NO-M-001",
    pillar: "Nourishment",
    phase: "menstrual",
    topic: "Cooked foods · Iron",
    nudge: "Give iron a little vitamin C sidekick.",
    explanation: "If your period is heavy or your iron stores are low, meals with lentils, beans, tofu or leafy greens can contribute non-haem iron. Add lemon, amla, guava or another vitamin-C-rich food to help your body absorb more of it; food alone may not correct iron-deficiency anaemia, so ask about a blood test if you have ongoing fatigue or heavy bleeding.",
    energy: "Low",
    tags: ["Iron", "Fatigue", "Heavy bleeding"],
    regions: ["India", "Thailand", "Global"],
  },
  {
    id: "MV-M-001",
    pillar: "Movement",
    phase: "menstrual",
    topic: "Gentle movement · Yoga",
    nudge: "Try ten gentle minutes, only if it feels good.",
    explanation: "Easy walking, relaxed stretching or supported yoga may ease tension and help you feel more comfortable. There is no need to push through pain or follow a fixed cycle-based workout plan—rest is a valid choice, and severe or unusual pain deserves medical attention.",
    energy: "Low",
    tags: ["Cramps", "Low energy", "Tension"],
    regions: ["Global"],
  },
  {
    id: "MI-M-001",
    pillar: "Mind",
    phase: "menstrual",
    topic: "Breathwork · Rest",
    nudge: "Make room for a softer evening.",
    explanation: "A few minutes of slow, comfortable breathing and a calming bedtime routine can help settle the nervous system and support sleep. Keep the breath gentle rather than forcing deep or prolonged holds, especially if you feel dizzy or uncomfortable.",
    energy: "Low",
    tags: ["Stress", "Sleep", "Low mood"],
    regions: ["Global"],
  },
  {
    id: "NO-F-001",
    pillar: "Nourishment",
    phase: "follicular",
    topic: "Cooked foods · Protein",
    nudge: "Build a satisfying plate with protein and fibre.",
    explanation: "As your energy returns, a balanced meal can support steady energy without needing a special 'hormone-balancing' ingredient. Try dal with vegetables and rice, or tofu with greens and whole grains; choose portions and foods that suit your appetite and dietary needs.",
    energy: "Medium",
    tags: ["Energy", "Blood sugar", "PCOS"],
    regions: ["India", "Thailand", "Global"],
  },
  {
    id: "MV-F-001",
    pillar: "Movement",
    phase: "follicular",
    topic: "Strength · Progressive training",
    nudge: "If you feel ready, add a little strength today.",
    explanation: "Some people notice energy rising after menstruation, but this is not universal and research does not support one workout prescription for every cycle. Use how you slept and feel today to choose a manageable strength session, and increase load gradually rather than chasing a phase-based target.",
    energy: "Medium",
    tags: ["Strength", "Energy", "Recovery"],
    regions: ["Global"],
  },
  {
    id: "MI-F-001",
    pillar: "Mind",
    phase: "follicular",
    topic: "Planning · Mindful intention",
    nudge: "Choose one thing you would love to begin.",
    explanation: "A small, realistic intention can create momentum without turning wellbeing into another to-do list. Break it into a first step you can finish today, then leave room for rest and changing priorities.",
    energy: "Medium",
    tags: ["Motivation", "Focus", "Stress"],
    regions: ["Global"],
  },
  {
    id: "NO-O-001",
    pillar: "Nourishment",
    phase: "ovulatory",
    topic: "Hydration · Seeds",
    nudge: "Keep water close and add a nourishing crunch.",
    explanation: "Regular fluids support normal circulation and temperature regulation, especially in hot or humid weather. Pumpkin or sesame seeds can add fibre, minerals and healthy fats to a meal, but no particular seed or food has been shown to control ovulation or reliably change hormones.",
    energy: "Medium",
    tags: ["Hydration", "Digestion", "Hot weather"],
    regions: ["India", "Thailand", "Global"],
  },
  {
    id: "MV-O-001",
    pillar: "Movement",
    phase: "ovulatory",
    topic: "Movement · Choice",
    nudge: "Move at the intensity that feels right today.",
    explanation: "If you feel energetic, enjoy a brisk walk, dance or your usual training; if not, keep it gentle. Cycle phase alone cannot tell you your injury risk or capacity, so let your symptoms, training history and recovery guide intensity.",
    energy: "High",
    tags: ["Energy", "Mood", "Recovery"],
    regions: ["Global"],
  },
  {
    id: "MI-O-001",
    pillar: "Mind",
    phase: "ovulatory",
    topic: "Connection · Emotional wellbeing",
    nudge: "Make space for one good connection.",
    explanation: "A short conversation, shared meal or moment outdoors can support connection and emotional wellbeing. There is no need to feel more social during ovulation—choose the kind of contact that feels nourishing to you.",
    energy: "Medium",
    tags: ["Mood", "Connection", "Stress"],
    regions: ["Global"],
  },
  {
    id: "NO-L-001",
    pillar: "Nourishment",
    phase: "luteal",
    topic: "Snacks · Complex carbohydrates",
    nudge: "Pair a comforting carb with protein or fibre.",
    explanation: "If appetite or cravings rise before your period, a satisfying snack is a supportive choice, not a lack of willpower. Try fruit with nuts, yoghurt with oats, or roasted chickpeas; regular balanced meals may help you feel steadier, though PMS symptoms vary from person to person.",
    energy: "Medium",
    tags: ["Cravings", "Mood", "Energy"],
    regions: ["India", "Thailand", "Global"],
  },
  {
    id: "MV-L-001",
    pillar: "Movement",
    phase: "luteal",
    topic: "Walking · Pilates · Mobility",
    nudge: "Let recovery set the pace.",
    explanation: "If premenstrual symptoms affect your energy, try walking, mobility or a lighter version of your usual workout. You can still train harder when it feels good; adjusting intensity is about responding to your body, not following a rigid rule.",
    energy: "Low",
    tags: ["Bloating", "Fatigue", "Recovery"],
    regions: ["Global"],
  },
  {
    id: "MI-L-001",
    pillar: "Mind",
    phase: "luteal",
    topic: "Sleep · Wind-down ritual",
    nudge: "Give your evening a gentle landing.",
    explanation: "A consistent wind-down, dimmer lights and a regular sleep window can make rest easier when mood or sleep feels unsettled. Keep the ritual simple—quiet music, a warm shower or a few comfortable breaths—and seek support if mood changes are intense or disrupt daily life.",
    energy: "Low",
    tags: ["Sleep", "Anxiety", "Low mood"],
    regions: ["Global"],
  },
];

export function getTipsForPhase(phase: Phase): Tip[] {
  return TIP_LIBRARY.filter((tip) => tip.phase === phase);
}
