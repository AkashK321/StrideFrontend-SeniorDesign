/**
 * UI Components screen - used to display all UI components and their usage.
 *
 * This tab screen, accessible at "/ui_components", allows devs to look at UI components 
 * and their usage in the app.
 */
import * as React from "react";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../../components/Button";
import { typography } from "../../theme/typography";
import { spacing } from "../../theme/spacing";

export default function UIComponents() {
  return React.createElement(
    SafeAreaView,
    {
      style: {
        flex: 1,
      },
      edges: ["top", "bottom"],
    },
    React.createElement(
      ScrollView,
      {
        style: {
          flex: 1,
        },
        contentContainerStyle: {
          padding: spacing.lg,
          gap: spacing.xl,
        },
      },
    // Header
    React.createElement(
      Text,
      {
        style: typography.h1,
      },
      "Button Components",
    ),
    
    // Variants Section
    React.createElement(
      View,
      {
        style: {
          gap: spacing.md,
        },
      },
      React.createElement(
        Text,
        {
          style: {
            ...typography.h1,
            fontSize: 20,
            marginBottom: spacing.sm,
          },
        },
        "Variants",
      ),
      // Primary variant
      React.createElement(
        View,
        {
          style: {
            flexDirection: "row",
            alignItems: "center",
            gap: spacing.md,
          },
        },
        React.createElement(
          Text,
          {
            style: {
              ...typography.body,
              width: 100,
            },
          },
          "Primary:",
        ),
        React.createElement(
          View,
          {
            style: {
              flex: 1,
            },
          },
          React.createElement(Button, {
            onPress: () => {},
            title: "Primary Button",
            variant: "primary",
          }),
        ),
      ),
      // Secondary variant
      React.createElement(
        View,
        {
          style: {
            flexDirection: "row",
            alignItems: "center",
            gap: spacing.md,
          },
        },
        React.createElement(
          Text,
          {
            style: {
              ...typography.body,
              width: 100,
            },
          },
          "Secondary:",
        ),
        React.createElement(
          View,
          {
            style: {
              flex: 1,
            },
          },
          React.createElement(Button, {
            onPress: () => {},
            title: "Secondary Button",
            variant: "secondary",
          }),
        ),
      ),
      // Danger variant
      React.createElement(
        View,
        {
          style: {
            flexDirection: "row",
            alignItems: "center",
            gap: spacing.md,
          },
        },
        React.createElement(
          Text,
          {
            style: {
              ...typography.body,
              width: 100,
            },
          },
          "Danger:",
        ),
        React.createElement(
          View,
          {
            style: {
              flex: 1,
            },
          },
          React.createElement(Button, {
            onPress: () => {},
            title: "Danger Button",
            variant: "danger",
          }),
        ),
      ),
    ),

    // Sizes Section
    React.createElement(
      View,
      {
        style: {
          gap: spacing.md,
        },
      },
      React.createElement(
        Text,
        {
          style: {
            ...typography.h1,
            fontSize: 20,
            marginBottom: spacing.sm,
          },
        },
        "Sizes",
      ),
      // Small size
      React.createElement(
        View,
        {
          style: {
            flexDirection: "row",
            alignItems: "center",
            gap: spacing.md,
          },
        },
        React.createElement(
          Text,
          {
            style: {
              ...typography.body,
              width: 100,
            },
          },
          "Small:",
        ),
        React.createElement(
          View,
          {
            style: {
              flex: 1,
            },
          },
          React.createElement(Button, {
            onPress: () => {},
            title: "Small Button",
            size: "small",
          }),
        ),
      ),
      // Medium size
      React.createElement(
        View,
        {
          style: {
            flexDirection: "row",
            alignItems: "center",
            gap: spacing.md,
          },
        },
        React.createElement(
          Text,
          {
            style: {
              ...typography.body,
              width: 100,
            },
          },
          "Medium:",
        ),
        React.createElement(
          View,
          {
            style: {
              flex: 1,
            },
          },
          React.createElement(Button, {
            onPress: () => {},
            title: "Medium Button",
            size: "medium",
          }),
        ),
      ),
      // Large size
      React.createElement(
        View,
        {
          style: {
            flexDirection: "row",
            alignItems: "center",
            gap: spacing.md,
          },
        },
        React.createElement(
          Text,
          {
            style: {
              ...typography.body,
              width: 100,
            },
          },
          "Large:",
        ),
        React.createElement(
          View,
          {
            style: {
              flex: 1,
            },
          },
          React.createElement(Button, {
            onPress: () => {},
            title: "Large Button",
            size: "large",
          }),
        ),
      ),
    ),

    // States Section
    React.createElement(
      View,
      {
        style: {
          gap: spacing.md,
        },
      },
      React.createElement(
        Text,
        {
          style: {
            ...typography.h1,
            fontSize: 20,
            marginBottom: spacing.sm,
          },
        },
        "States",
      ),
      // Disabled state
      React.createElement(
        View,
        {
          style: {
            flexDirection: "row",
            alignItems: "center",
            gap: spacing.md,
          },
        },
        React.createElement(
          Text,
          {
            style: {
              ...typography.body,
              width: 100,
            },
          },
          "Disabled:",
        ),
        React.createElement(
          View,
          {
            style: {
              flex: 1,
            },
          },
          React.createElement(Button, {
            onPress: () => {},
            title: "Disabled Button",
            disabled: true,
          }),
        ),
      ),
      // Loading state
      React.createElement(
        View,
        {
          style: {
            flexDirection: "row",
            alignItems: "center",
            gap: spacing.md,
          },
        },
        React.createElement(
          Text,
          {
            style: {
              ...typography.body,
              width: 100,
            },
          },
          "Loading:",
        ),
        React.createElement(
          View,
          {
            style: {
              flex: 1,
            },
          },
          React.createElement(Button, {
            onPress: () => {},
            title: "Loading Button",
            loading: true,
          }),
        ),
      ),
    ),

    // Combinations Section
    React.createElement(
      View,
      {
        style: {
          gap: spacing.md,
        },
      },
      React.createElement(
        Text,
        {
          style: {
            ...typography.h1,
            fontSize: 20,
            marginBottom: spacing.sm,
          },
        },
        "Combinations",
      ),
      // Small secondary
      React.createElement(
        View,
        {
          style: {
            flexDirection: "row",
            alignItems: "center",
            gap: spacing.md,
          },
        },
        React.createElement(
          Text,
          {
            style: {
              ...typography.body,
              width: 100,
            },
          },
          "Small Secondary:",
        ),
        React.createElement(
          View,
          {
            style: {
              flex: 1,
            },
          },
          React.createElement(Button, {
            onPress: () => {},
            title: "Small Secondary",
            variant: "secondary",
            size: "small",
          }),
        ),
      ),
      // Large danger
      React.createElement(
        View,
        {
          style: {
            flexDirection: "row",
            alignItems: "center",
            gap: spacing.md,
          },
        },
        React.createElement(
          Text,
          {
            style: {
              ...typography.body,
              width: 100,
            },
          },
          "Large Danger:",
        ),
        React.createElement(
          View,
          {
            style: {
              flex: 1,
            },
          },
          React.createElement(Button, {
            onPress: () => {},
            title: "Large Danger",
            variant: "danger",
            size: "large",
          }),
        ),
      ),
    ),
    ),
  );
}

