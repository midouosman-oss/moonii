
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
  region: string;
  language: string;
  country: string;
  cycleLength: number;
  periodLength: number;
  lastPeriodStart: string | null;
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
  region: "",
  language: "en",
  country: "",
  cycleLength: 28,
  periodLength: 5,
  lastPeriodStart: null,
};

function normalizeSettings(
  data: Partial<CycleSettings> | null | undefined
): CycleSettings {
  const cycleLength = Number(data?.cycleLength);
  const periodLength = Number(data?.periodLength);

  const dateMatch =
    typeof data?.lastPeriodStart === "string"
      ? data.lastPeriodStart.match(/^(\d{4})-(\d{2})-(\d{2})$/)
      : null;
  const validDate = (() => {
    if (!dateMatch) return false;
    const year = Number(dateMatch[1]);
    const month = Number(dateMatch[2]);
    const day = Number(dateMatch[3]);
    const date = new Date(year, month - 1, day);
    return (
      year >= 1900 &&
      year <= 2100 &&
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    );
  })();

  return {
    ...DEFAULT_SETTINGS,
    ...data,
    name: typeof data?.name === "string" ? data.name : "",
    region: typeof data?.region === "string" ? data.region : "",
    language: typeof data?.language === "string" ? data.language : "en",
    country: typeof data?.country === "string" ? data.country : "",
    cycleLength:
      Number.isFinite(cycleLength) && cycleLength >= 15 && cycleLength <= 60
        ? Math.round(cycleLength)
        : DEFAULT_SETTINGS.cycleLength,
    periodLength:
      Number.isFinite(periodLength) && periodLength >= 1 && periodLength <= 10
        ? Math.round(periodLength)
        : DEFAULT_SETTINGS.periodLength,
    lastPeriodStart: validDate ? data!.lastPeriodStart! : null,
  };
}

function computePhase(
  cycleDay: number,
  cycleLength: number,
  periodLength: number
): Phase {
  const safeCycleLength =
    Number.isFinite(cycleLength) && cycleLength >= 15 ? cycleLength : 28;
  const safePeriodLength =
    Number.isFinite(periodLength) && periodLength >= 1 ? periodLength : 5;
  const safeDay =
    Number.isFinite(cycleDay) && cycleDay >= 1 ? cycleDay : 1;

  const ovStart = Math.floor(safeCycleLength / 2);
  const ovLen = 3;

  if (safeDay <= safePeriodLength) return "menstrual";
  if (safeDay < ovStart) return "follicular";
  if (safeDay < ovStart + ovLen) return "ovulatory";
  return "luteal";
}

function computeCycleDay(
  lastPeriodStart: string | null,
  cycleLength: number
): number {
  const safeCycleLength =
    Number.isFinite(cycleLength) && cycleLength >= 15 && cycleLength <= 60
      ? Math.round(cycleLength)
      : 28;

  if (
    !lastPeriodStart ||
    !/^\d{4}-\d{2}-\d{2}$/.test(lastPeriodStart)
  ) {
    return 1;
  }

  const start = new Date(lastPeriodStart + "T00:00:00");

  if (Number.isNaN(start.getTime())) {
    return 1;
  }

  const now = new Date();

  const startUTC = Date.UTC(
    start.getFullYear(),
    start.getMonth(),
    start.getDate()
  );

  const nowUTC = Date.UTC(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const diffDays = Math.floor((nowUTC - startUTC) / 86400000);

  if (diffDays < 0) return 1;

  return (diffDays % safeCycleLength) + 1;
}

const CycleContext = createContext<CycleContextValue | null>(null);

export function CycleProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [ready, setReady] = useState(false);
  const [hasOnboarded, setHasOnboarded] = useState(false);
  const [settings, setSettings] =
    useState<CycleSettings>(DEFAULT_SETTINGS);
  const [logs, setLogs] = useState<Record<string, DailyLog>>({});

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      try {
        const [rawSettings, rawLogs] = await Promise.all([
          AsyncStorage.getItem(SETTINGS_KEY),
          AsyncStorage.getItem(LOGS_KEY),
        ]);

        if (!mounted) return;

        if (rawSettings) {
          const parsed = JSON.parse(rawSettings);
          const normalized = normalizeSettings(parsed);

          setSettings(normalized);
          setHasOnboarded(!!normalized.lastPeriodStart);

          if (JSON.stringify(parsed) !== JSON.stringify(normalized)) {
            await AsyncStorage.setItem(
              SETTINGS_KEY,
              JSON.stringify(normalized)
            );
          }
        }

        if (rawLogs) {
          const parsedLogs = JSON.parse(rawLogs);
          if (
            parsedLogs &&
            typeof parsedLogs === "object" &&
            !Array.isArray(parsedLogs)
          ) {
            setLogs(parsedLogs);
          }
        }
      } catch (error) {
        console.warn("Failed to load moonii data from storage", error);
      } finally {
        if (mounted) setReady(true);
      }
    }

    loadData();

    return () => {
      mounted = false;
    };
  }, []);

  const updateSettings = useCallback(
    async (partial: Partial<CycleSettings>) => {
      const next = normalizeSettings({
        ...settings,
        ...partial,
      });

      setSettings(next);
      setHasOnboarded(!!next.lastPeriodStart);

      await AsyncStorage.setItem(
        SETTINGS_KEY,
        JSON.stringify(next)
      );
    },
    [settings]
  );

  const completeOnboarding = useCallback(
    async (partial: Partial<CycleSettings>) => {
      const next = normalizeSettings({
        ...settings,
        ...partial,
      });

      setSettings(next);
      setHasOnboarded(!!next.lastPeriodStart);

      await AsyncStorage.setItem(
        SETTINGS_KEY,
        JSON.stringify(next)
      );
    },
    [settings]
  );

  const saveLog = useCallback(
    async (dateKey: string, data: DailyLog) => {
      const next = {
        ...logs,
        [dateKey]: {
          ...logs[dateKey],
          ...data,
        },
      };

      setLogs(next);

      await AsyncStorage.setItem(
        LOGS_KEY,
        JSON.stringify(next)
      );
    },
    [logs]
  );

  const getLog = useCallback(
    (dateKey: string) => logs[dateKey],
    [logs]
  );

  const cycleDay = useMemo(
    () =>
      computeCycleDay(
        settings.lastPeriodStart,
        settings.cycleLength
      ),
    [settings.lastPeriodStart, settings.cycleLength]
  );

  const currentPhase = useMemo(
    () =>
      computePhase(
        cycleDay,
        settings.cycleLength,
        settings.periodLength
      ),
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

  return (
    <CycleContext.Provider value={value}>
      {children}
    </CycleContext.Provider>
  );
}

export function useCycle(): CycleContextValue {
  const ctx = useContext(CycleContext);

  if (!ctx) {
    throw new Error("useCycle must be used within a CycleProvider");
  }

  return ctx;
}
