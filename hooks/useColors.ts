// Shared palette accessor. The home screen currently keeps its own
// PHASE_COLORS/PHASE_LABELS constants inline (duplicated from here and from
// the HTML prototype) — see the "technical debt" item in the improvements
// list. Centralising on this hook everywhere is the recommended next step.
export function useColors() {
  return {
    bg: "#fdf6f4",
    card: "#ffffff",
    dark: "#1a0e14",
    muted: "#a8788c",
    pill: "#fce9f0",
    border: "#eddde5",
    phases: {
      menstrual: "#C97B96",
      follicular: "#7ab090",
      ovulatory: "#9a9a50",
      luteal: "#c4836a",
    },
  };
}
