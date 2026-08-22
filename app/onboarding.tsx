import React from "react";
import { router } from "expo-router";
import Onboarding from "@/components/Onboarding";
import { useCycle } from "@/context/CycleContext";

export default function OnboardingScreen() {
  const { completeOnboarding } = useCycle();

  return (
    <Onboarding
      onComplete={async (data) => {
        await completeOnboarding({
          lastPeriodStart: data.lastPeriodStart,
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
