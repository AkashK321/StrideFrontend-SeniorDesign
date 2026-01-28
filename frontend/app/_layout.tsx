/**
 * Root app layout for expo-router.
 *
 * This is the top-level layout that wraps the entire application in a Stack navigator.
 * All routes (including route groups like (auth) and (tabs)) are rendered within this Stack,
 * providing a single navigation tree for the entire app.
 *
 * This layout is required by expo-router and serves as the entry point for all navigation.
 */
import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack />;
}
