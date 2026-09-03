import { Radius, Spacing, Typography } from "@/constants/theme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface StatusTagProps {
  status: "present" | "absent" | "leave";
}

export function StatusTag({ status }: StatusTagProps) {
  const getStatusStyles = () => {
    switch (status) {
      case "present":
        return {
          backgroundColor: "#D4EDDA",
          textColor: "#155724",
          label: "حاضر",
        };
      case "absent":
        return {
          backgroundColor: "#F8D7DA",
          textColor: "#721C24",
          label: "غیر حاضر",
        };
      case "leave":
        return {
          backgroundColor: "#D1ECF1",
          textColor: "#0C5460",
          label: "رخصت",
        };
    }
  };

  const statusStyle = getStatusStyles();

  return (
    <View
      style={[
        styles.tag,
        {
          backgroundColor: statusStyle.backgroundColor,
        },
      ]}
    >
      <Text
        style={[
          styles.tagText,
          {
            color: statusStyle.textColor,
          },
        ]}
      >
        {statusStyle.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.sm,
    alignSelf: "flex-end",
  },
  tagText: {
    ...Typography.label,
    fontSize: 12,
  },
});
