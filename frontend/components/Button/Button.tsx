/**
 * Button component - reusable primary button for user actions.
 *
 * A standardized button component that provides consistent styling and behavior
 * across the app. Features a blue background, white text, and rounded corners by default,
 * with support for custom styling via props.
 *
 * Uses React.createElement (non-JSX) to match the project's TypeScript configuration.
 *
 * @param onPress - Callback function executed when the button is pressed
 * @param title - Text displayed inside the button
 * @param style - Optional custom styles for the button container (merged with defaults)
 * @param textStyle - Optional custom styles for the button text (merged with defaults)
 */
import * as React from "react";
import { Pressable, Text, ViewStyle, TextStyle } from "react-native";

interface ButtonProps {
  onPress: () => void;
  title: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function Button({ onPress, title, style, textStyle }: ButtonProps) {
  return React.createElement(
    Pressable,
    {
      onPress,
      style: [
        {
          paddingHorizontal: 24,
          paddingVertical: 12,
          borderRadius: 999,
          backgroundColor: "#2563EB",
        },
        style,
      ],
    },
    React.createElement(
      Text,
      {
        style: [
          {
            color: "white",
            fontWeight: "600",
          },
          textStyle,
        ],
      },
      title,
    ),
  );
}

