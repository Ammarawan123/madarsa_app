import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useOtp } from '@/hooks/UseOtp';
import { Logo } from '@/components/Logo/Logo';
import { Button } from '@/components/Button/Button';
import { Colors, Spacing, LoginLayout } from '@/constants/theme';

export default function OtpScreen() {
  const {
    email,
    otp,
    timer,
    error,
    isLoading,
    inputRefs,
    handleChangeText,
    handleKeyPress,
    handleVerify,
    handleResend,
  } = useOtp();

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={{ marginTop: LoginLayout.logoTop }}>
            <Logo />
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>OTP تصدیق</Text>
            <Text style={styles.subtitle}>
              ہم نے آپ کے ای میل ({email || 'example@domain.com'}) پر 6 ہندسوں کا کوڈ بھیجا ہے۔
            </Text>

            {/* 6 Digit Box Container */}
            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
  <TextInput
    key={index}
    ref={(ref) => {
      inputRefs.current[index] = ref;
    }}
    style={[
      styles.otpBox,
      digit ? styles.activeBox : null,
      error ? styles.errorBox : null,
    ]}
    keyboardType="number-pad"
    maxLength={1}
    value={digit}
    onChangeText={(text) => handleChangeText(text, index)}
    onKeyPress={(e) => handleKeyPress(e, index)}
    autoFocus={index === 0}
  />
))}
            </View>

            {error && <Text style={styles.errorText}>{error}</Text>}

            <Button
              title="تصدیق کریں"
              onPress={handleVerify}
              isLoading={isLoading}
            />

            <View style={styles.resendContainer}>
              {timer > 0 ? (
                <Text style={styles.timerText}>
                  دوبارہ کوڈ بھیجیں: {timer < 10 ? `0${timer}` : timer} سیکنڈ
                </Text>
              ) : (
                <TouchableOpacity onPress={handleResend}>
                  <Text style={styles.resendText}>دوبارہ OTP حاصل کریں</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  flex: { flex: 1 },
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
    elevation: 3,
  },
  title: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', color: Colors.textPrimary },
  subtitle: { fontSize: 13, color: Colors.textSecondary, textAlign: 'center', lineHeight: 18 },
  otpContainer: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 },
  otpBox: {
    width: 40,
    height: 48,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    backgroundColor: Colors.surface,
    color: Colors.textPrimary,
  },
  activeBox: { borderColor: Colors.primary },
  errorBox: { borderColor: Colors.error },
  errorText: { color: Colors.error, textAlign: 'center', fontSize: 12 },
  resendContainer: { alignItems: 'center', marginTop: 10 },
  timerText: { color: Colors.textSecondary, fontSize: 13 },
  resendText: { color: Colors.primary, fontWeight: 'bold', fontSize: 13 },
});