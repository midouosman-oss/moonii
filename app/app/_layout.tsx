import React from "react";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import {
  CormorantGaramond_300Light_Italic,
} from "@expo-google-fonts/cormorant-garamond";
import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_600SemiBold,
} from "@expo-google-fonts/dm-sans";
import { CycleProvider } from "@/context/CycleContext";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    CormorantGaramond_300Light_Italic,
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_600SemiBold,
  });

  // Render nothing until fonts are ready — the home screen's styles
  // reference these font families directly by name.
  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <CycleProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </CycleProvider>
    </SafeAreaProvider>
  );
}
