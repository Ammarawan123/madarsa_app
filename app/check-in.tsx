import { Button } from "@/components/Button/Button";
import { Logo } from "@/components/Logo/Logo";
import { Colors, Spacing, Typography } from "@/constants/theme";
import { useCheckIn } from "@/hooks/useCheckIn";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card } from "../components/Card/Card";
import { UrduDateFormatter } from "../utils/formatters/UrduDateFormatter";

export default function CheckInScreen() {
  const { isLoading, errorMessage, handleCheckIn } = useCheckIn();
  const now = new Date();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <Logo />

        <Text style={styles.heading}>آج کی حاضری درج کریں</Text>

        <Card style={styles.dateCard}>
          <Text style={styles.dateText}>
            {UrduDateFormatter.formatDate(now)}
          </Text>
          <Text style={styles.timeText}>
            {UrduDateFormatter.formatTime(now)}
          </Text>
        </Card>

        {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

        <Button
          title="حاضر ہوں"
          onPress={handleCheckIn}
          isLoading={isLoading}
        />
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
    justifyContent: "center",
    paddingHorizontal: Spacing.lg,
  },
  heading: {
    ...Typography.title,
    color: Colors.textPrimary,
    textAlign: "center",
    marginBottom: Spacing.lg,
  },
  dateCard: {
    alignItems: "center",
    paddingVertical: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  dateText: {
    ...Typography.label,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  timeText: {
    ...Typography.subtitle,
    color: Colors.textSecondary,
  },
  errorText: {
    ...Typography.hint,
    color: Colors.error,
    textAlign: "center",
    marginBottom: Spacing.md,
  },
});
