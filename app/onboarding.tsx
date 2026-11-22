import React from "react";
import { router } from "expo-router";
import Onboarding from "@/components/Onboarding";
import { useCycle } from "@/context/CycleContext";

export default function OnboardingScreen() {
  const { completeOnboarding, settings, updateSettings } = useCycle();

  return (
    <Onboarding
      language={settings.language}
      onLanguageChange={(language) => { void updateSettings({ language }); }}
      onComplete={async (data) => {
        await completeOnboarding({
          lastPeriodStart: data.lastPeriodStart,
          region: data.region ?? "",
          language: settings.language,
          // cycleLength / periodLength default to 28 / 5 (see CycleContext)
          // until a "tell us about your usual cycle" step is added to the
          // questionnaire — the client's spec doesn't currently ask for
          // these two numbers directly.
        });
        router.replace("/");
      }}
    />
  );
}
