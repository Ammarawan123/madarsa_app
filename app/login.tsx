import { Button } from "@/components/Button/Button";
import { Input } from "@/components/Input/Input";
import { Logo } from "@/components/Logo/Logo";
import { Strings } from "@/constants/strings";
import { Colors, Spacing, Typography } from "@/constants/theme";
import { useLogin } from "@/hooks/useLogin";
import React from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const {
    mobileNumber,
    password,
    mobileError,
    passwordError,
    generalError,
    isLoading,
    setMobileNumber,
    setPassword,
    handleLogin,
  } = useLogin();

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Logo />

          <Input
            label={Strings.usernameLabel}
            placeholder={Strings.usernamePlaceholder}
            value={mobileNumber}
            onChangeText={setMobileNumber}
            errorMessage={mobileError}
            keyboardType="phone-pad"
            autoCapitalize="none"
          />

          <Input
            label={Strings.passwordLabel}
            placeholder={Strings.passwordPlaceholder}
            value={password}
            onChangeText={setPassword}
            errorMessage={passwordError}
            secureTextEntry
            autoCapitalize="none"
          />

          {generalError && (
            <Text style={styles.generalError}>{generalError}</Text>
          )}

          <Button
            title={isLoading ? Strings.loggingIn : Strings.loginButton}
            onPress={handleLogin}
            isLoading={isLoading}
          />

          <Text style={styles.hint}>{Strings.forgotPasswordHint}</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xxl,
  },
  generalError: {
    ...Typography.hint,
    color: Colors.error,
    textAlign: "center",
    marginBottom: Spacing.md,
  },
  hint: {
    ...Typography.hint,
    color: Colors.textSecondary,
    textAlign: "center",
    marginTop: Spacing.lg,
  },
});
