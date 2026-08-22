import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type Phase = "menstrual" | "follicular" | "ovulatory" | "luteal";

export interface CycleSettings {
  name: string;
  cycleLength: number;
  periodLength: number;
  lastPeriodStart: string | null; // ISO date, e.g. "2026-07-15"
}

export interface DailyLog {
  moods?: string[];
  energy?: number;
  sleep?: string;
  movement?: string[];
  nourishment?: string[];
  symptoms?: string[];
  notes?: string;
}

interface CycleContextValue {
  ready: boolean;
  hasOnboarded: boolean;
  settings: CycleSettings;
  currentPhase: Phase;
  cycleDay: number;
  updateSettings: (partial: Partial<CycleSettings>) => Promise<void>;
  completeOnboarding: (partial: Partial<CycleSettings>) => Promise<void>;
  saveLog: (dateKey: string, data: DailyLog) => Promise<void>;
  getLog: (dateKey: string) => DailyLog | undefined;
}

const SETTINGS_KEY = "moonii:settings";
const LOGS_KEY = "moonii:logs";

const DEFAULT_SETTINGS: CycleSettings = {
  name: "",
  cycleLength: 28,
  periodLength: 5,
  lastPeriodStart: null,
};

// Same formula the home screen's getPhaseInfo() already assumes:
// ovulation window starts halfway through the cycle and lasts 3 days.
function computePhase(cycleDay: number, cycleLength: number, periodLength: number): Phase {
  const ovStart = Math.floor(cycleLength / 2);
  const ovLen = 3;
  if (cycleDay <= periodLength) return "menstrual";
  if (cycleDay < ovStart) return "follicular";
  if (cycleDay < ovStart + ovLen) return "ovulatory";
  return "luteal";
}

function computeCycleDay(lastPeriodStart: string | null, cycleLength: number): number {
  if (!lastPeriodStart) return 1;
  const start = new Date(lastPeriodStart + "T00:00:00");
  const now = new Date();
  const startUTC = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
  const nowUTC = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const diffDays = Math.floor((nowUTC - startUTC) / 86400000);
  if (diffDays < 0) return 1;
  return (diffDays % cycleLength) + 1;
}

const CycleContext = createContext<CycleContextValue | null>(null);

export function CycleProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [hasOnboarded, setHasOnboarded] = useState(false);
  const [settings, setSettings] = useState<CycleSettings>(DEFAULT_SETTINGS);
  const [logs, setLogs] = useState<Record<string, DailyLog>>({});

  useEffect(() => {
    (async () => {
      try {
        const [rawSettings, rawLogs] = await Promise.all([
          AsyncStorage.getItem(SETTINGS_KEY),
          AsyncStorage.getItem(LOGS_KEY),
        ]);
        if (rawSettings) {
          const parsed = JSON.parse(rawSettings) as CycleSettings;
          setSettings(parsed);
          setHasOnboarded(!!parsed.lastPeriodStart);
        }
        if (rawLogs) {
          setLogs(JSON.parse(rawLogs));
        }
      } catch (e) {
        console.warn("Failed to load moonii data from storage", e);
      } finally {
        setReady(true);
      }
    })();
  }, []);

  const updateSettings = useCallback(async (partial: Partial<CycleSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...partial };
      AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(next)).catch((e) =>
        console.warn("Failed to persist settings", e)
      );
      return next;
    });
  }, []);

  const completeOnboarding = useCallback(async (partial: Partial<CycleSettings>) => {
    const next = { ...DEFAULT_SETTINGS, ...settings, ...partial };
    setSettings(next);
    setHasOnboarded(true);
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings]);

  const saveLog = useCallback(async (dateKey: string, data: DailyLog) => {
    setLogs((prev) => {
      const next = { ...prev, [dateKey]: { ...prev[dateKey], ...data } };
      AsyncStorage.setItem(LOGS_KEY, JSON.stringify(next)).catch((e) =>
        console.warn("Failed to persist log", e)
      );
      return next;
    });
  }, []);

  const getLog = useCallback((dateKey: string) => logs[dateKey], [logs]);

  const cycleDay = useMemo(
    () => computeCycleDay(settings.lastPeriodStart, settings.cycleLength),
    [settings.lastPeriodStart, settings.cycleLength]
  );
  const currentPhase = useMemo(
    () => computePhase(cycleDay, settings.cycleLength, settings.periodLength),
    [cycleDay, settings.cycleLength, settings.periodLength]
  );

  const value: CycleContextValue = {
    ready,
    hasOnboarded,
    settings,
    currentPhase,
    cycleDay,
    updateSettings,
    completeOnboarding,
    saveLog,
    getLog,
  };

  return <CycleContext.Provider value={value}>{children}</CycleContext.Provider>;
}

export function useCycle(): CycleContextValue {
  const ctx = useContext(CycleContext);
  if (!ctx) throw new Error("useCycle must be used within a CycleProvider");
  return ctx;
}
