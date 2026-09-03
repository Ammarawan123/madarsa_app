import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Logo } from '@/components/Logo/Logo';
import { DateTimeBox } from '@/components/DateTimeBox/DateTimeBox';
import { Button } from '@/components/Button/Button';
import { useCheckIn } from '@/hooks/useCheckIn';
import { UrduDateFormatter } from '@/utils/formatters/UrduDateFormatter';
import { Colors, Spacing, LoginLayout, CheckInLayout, Typography } from '@/constants/theme';

export default function CheckInScreen() {
  const { isLoading, errorMessage, handleCheckIn } = useCheckIn();
  const now = new Date();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <View style={{ marginTop: LoginLayout.logoTop }}>
          <Logo />
        </View>

        <View style={styles.card}>
          <Text style={styles.heading}>آج کی حاضری درج کریں</Text>

          <DateTimeBox
            dateLabel={UrduDateFormatter.formatDate(now)}
            timeLabel={UrduDateFormatter.formatTime(now)}
          />

          {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

          <Button title="حاضر ہوں" onPress={handleCheckIn} isLoading={isLoading} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
  },
  card: {
    width: CheckInLayout.cardWidth,
    marginTop: Spacing.xl,
    backgroundColor: Colors.surface,
    borderRadius: CheckInLayout.cardRadius,
    borderWidth: CheckInLayout.cardBorderWidth,
    borderColor: Colors.border,
    padding: CheckInLayout.cardPadding,
    gap: CheckInLayout.cardGap,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  heading: {
    ...Typography.checkInHeading,
    color: '#000000',
    textAlign: 'center',
  },
  errorText: {
    ...Typography.loginHint,
    color: Colors.error,
    textAlign: 'center',
  },
});