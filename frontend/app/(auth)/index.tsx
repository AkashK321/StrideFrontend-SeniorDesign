/**
 * Landing screen - the first screen users see when opening the app.
 *
 * This is the root route ("/") for unauthenticated users. It displays a welcome message
 * and provides a "Sign in" button that navigates to the main tabbed app experience.
 *
 * Located in the (auth) route group, this screen serves as the entry point before users
 * authenticate. Future authentication flows (login, forgot password, etc.) will be added
 * alongside this screen in the (auth) directory.
 */
import * as React from "react";
import { View, Text, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Button from "../../components/Button";
import TextField from "../../components/TextField";
import Label from "../../components/Label";
import { spacing } from "../../theme/spacing";
import { typography } from "../../theme/typography";
import { colors } from "../../theme/colors";
import { login } from "../../services/api";

export default function Landing() {
  const router = useRouter();
  const [username, setUsername] = React.useState("");
  const [usernameError, setUsernameError] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [passwordError, setPasswordError] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSignIn = async () => {
    // Clear previous errors
    setUsernameError("");
    setPasswordError("");

    // Validate inputs
    if (!username.trim()) {
      setUsernameError("Username is required");
      return;
    }

    if (!password.trim()) {
      setPasswordError("Password is required");
      return;
    }

    setIsLoading(true);

    try {
      // Call login API
      const response = await login({
        username: username.trim(),
        password: password.trim(),
      });

      // Store tokens (you may want to use AsyncStorage or a state management solution)
      // For now, we'll just navigate on success
      console.log("Login successful:", response);

      // Navigate to home on success
      router.replace("/home");
    } catch (error) {
      // Handle error
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      
      // Show error alert
      Alert.alert("Sign In Failed", errorMessage);
      
      // Set field errors if applicable
      if (errorMessage.toLowerCase().includes("user") || errorMessage.toLowerCase().includes("not found")) {
        setUsernameError("Invalid username or password");
      } else if (errorMessage.toLowerCase().includes("password")) {
        setPasswordError("Invalid password");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return React.createElement(
    SafeAreaView,
    {
      style: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        gap: spacing.sm,
        paddingTop: spacing.xl,
        padding: spacing.xl,
      },
      edges: ["top", "bottom"],
    },
    React.createElement(
      Text,
      {
        style: {
          ...typography.h1,
          fontSize: 40,
          marginBottom: spacing.sm,
        },
      },
      "Welcome back to ",
      React.createElement(
        Text,
        {
          style: {
            color: colors.primary,
          },
        },
        "Stride."
      )
    ),
    React.createElement(
      Label,
      {
        variant: "formHeader",
        style: {
          paddingTop: spacing.lg,
          marginBottom: spacing.md,
          alignSelf: "flex-start",
          color: colors.textSecondary,
        },
      },
      "Sign in to your account"
    ),
    React.createElement(TextField, {
      value: username,
      onChangeText: setUsername,
      error: usernameError,
      autoCapitalize: "none",
      placeholder: "Username",
      style: {
        width: "100%",
        marginBottom: spacing.md,
      },
    }),
    React.createElement(TextField, {
      value: password,
      onChangeText: setPassword,
      error: passwordError,
      secureTextEntry: true,
      autoCapitalize: "none",
      placeholder: "Password",
      style: {
        width: "100%",
        marginBottom: spacing.md,
      },
    }),
    React.createElement(Button, {
      onPress: handleSignIn,
      title: "Sign in",
      loading: isLoading,
      disabled: isLoading,
      style: {
        marginTop: spacing.xl,
      },
      accessibilityLabel: "Sign in to your account",
      accessibilityRole: "button",
      accessibilityHint: "Sign in to your account to continue",
    })
  );
}

