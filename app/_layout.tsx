import React from "react";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import { CormorantGaramond_300Light_Italic } from "@expo-google-fonts/cormorant-garamond";
import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_600SemiBold,
} from "@expo-google-fonts/dm-sans";
import { CycleProvider } from "@/context/CycleContext";

export default function RootLayout() {
  // Load custom fonts without blocking the app shell if the font request fails.
  useFonts({
    CormorantGaramond_300Light_Italic,
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_600SemiBold,
  });

  return (
    <SafeAreaProvider>
      <CycleProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </CycleProvider>
    </SafeAreaProvider>
  );
}
