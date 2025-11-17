// app/_layout.tsx - Expo Router layout with AuthProvider
import React, { useEffect, useState } from "react";
import { Slot } from "expo-router";
import { AuthProvider } from "../components/AuthContext";
import { LanguageProvider } from "../components/LanguageContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { LogBox } from "react-native";

// Disable console warnings and errors in production
if (!__DEV__) {
  console.log = () => {};
  console.warn = () => {};
  console.error = () => {};
}

// Ignore specific warnings that don't affect functionality
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
  'Require cycle:',
  'ViewPropTypes will be removed',
  'Constants.platform.ios.model',
]);

// Ignore all logs in production for smoother UX
if (!__DEV__) {
  LogBox.ignoreAllLogs();
}

export default function Layout() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <SafeAreaView style={{ flex: 1 }}>
          <Slot />
        </SafeAreaView>
      </AuthProvider>
    </LanguageProvider>
  );
}
