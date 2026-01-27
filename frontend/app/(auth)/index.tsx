import * as React from "react";
import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";

export default function Landing() {
  const router = useRouter();

  return React.createElement(
    View,
    {
      style: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 16,
      },
    },
    React.createElement(Text, null, "Welcome to Stride."),
    React.createElement(
      Pressable,
      {
        onPress: () => router.replace("/home"),
        style: {
          paddingHorizontal: 24,
          paddingVertical: 12,
          borderRadius: 999,
          backgroundColor: "#2563EB",
        },
      },
      React.createElement(
        Text,
        {
          style: {
            color: "white",
            fontWeight: "600",
          },
        },
        "Sign in",
      ),
    ),
  );
}

