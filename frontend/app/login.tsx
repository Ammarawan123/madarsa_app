import React from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Logo } from '@/components/Logo/Logo';
import { Input } from '@/components/Input/Input';
import { PasswordInput } from '@/components/PasswordInput/PasswordInput';
import { Button } from '@/components/Button/Button';
import { HintBox } from '@/components/HintBox/HintBox';
import { useLogin } from '@/hooks/useLogin';
import { Colors, Spacing, LoginLayout } from '@/constants/theme';
import { Strings } from '@/constants/strings';

export default function LoginScreen() {
  const {
    email,
    password,
    emailError,
    passwordError,
    isLoading,
    setEmail,
    setPassword,
    handleLogin,
  } = useLogin();

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ marginTop: LoginLayout.logoTop }}>
            <Logo />
          </View>

          <View style={styles.card}>
            <Input
              label={Strings.usernameLabel}
              placeholder={Strings.usernamePlaceholder}
              value={email}
              onChangeText={setEmail}
              errorMessage={emailError}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <PasswordInput
              label={Strings.passwordLabel}
              placeholder={Strings.passwordPlaceholder}
              value={password}
              onChangeText={setPassword}
              errorMessage={passwordError}
            />

            <Button
              title={Strings.loginButton}
              onPress={handleLogin}
              isLoading={isLoading}
            />

            <HintBox
              text="پاس ورڈ بھول گئے؟ برائے کرم مدرسہ انتظامیہ سے رابطہ کریں۔"
              boldPart="مدرسہ انتظامیہ"
            />
          </View>
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
    alignItems: 'center',
    paddingBottom: Spacing.xxl,
  },
  card: {
    width: LoginLayout.cardWidth,
    marginTop: Spacing.xl,
    backgroundColor: Colors.surface,
    borderRadius: LoginLayout.cardRadius,
    borderWidth: LoginLayout.cardBorderWidth,
    borderColor: Colors.border,
    padding: LoginLayout.cardPadding,
    gap: LoginLayout.cardGap,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
});