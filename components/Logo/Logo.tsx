import { Strings } from "@/constants/strings";
import { Colors, Spacing, Typography } from "@/constants/theme";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

export function Logo() {
  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/images/icon.png")}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.title}>{Strings.appName}</Text>
      <Text style={styles.subtitle}>{Strings.appCity}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  image: {
    width: 110,
    height: 110,
    marginBottom: Spacing.sm,
  },
  title: {
    ...Typography.title,
    color: Colors.primary,
  },
  subtitle: {
    ...Typography.subtitle,
    color: Colors.textSecondary,
  },
});
