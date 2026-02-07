/**
 * Root app layout for expo-router.
 *
 * This is the top-level layout that wraps the entire application in a Stack navigator.
 * All routes (including route groups like (auth) and (tabs)) are rendered within this Stack,
 * providing a single navigation tree for the entire app.
 *
 * This layout is required by expo-router and serves as the entry point for all navigation.
 */
import * as React from "react";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useFonts, Roboto_400Regular, Roboto_700Bold, Roboto_300Light } from "@expo-google-fonts/roboto";
import { AuthProvider } from "../contexts/AuthContext";
import { setupAutoRefresh } from "../services/tokenStorage";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Roboto_300Light,
    Roboto_400Regular,
    Roboto_700Bold,
  });

  // Setup automatic token refresh
  React.useEffect(() => {
    const cleanup = setupAutoRefresh(5); // Check every 5 minutes
    return cleanup;
  }, []);

  if (!fontsLoaded) {
    return null;
  }
  
  return React.createElement(
    SafeAreaProvider,
    null,
    React.createElement(
      AuthProvider,
      null,
      React.createElement(Stack, {
        screenOptions: {
          headerShown: false,
        },
      }),
    ),
  );
}
