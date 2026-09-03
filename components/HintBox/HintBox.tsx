import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, LoginLayout, Typography } from '@/constants/theme';

interface HintBoxProps {
  text: string;
  boldPart: string;
}

export function HintBox({ text, boldPart }: HintBoxProps) {
  const [before, after] = text.split(boldPart);

  return (
    <View style={styles.container}>
      <Ionicons name="information-circle-outline" size={18} color={Colors.primaryDark} />
      <Text style={styles.text}>
        {before}
        <Text style={styles.bold}>{boldPart}</Text>
        {after}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: Colors.accentLight,
    borderRadius: LoginLayout.hintBoxRadius,
    paddingVertical: LoginLayout.hintBoxPaddingV,
    paddingHorizontal: LoginLayout.hintBoxPaddingH,
  },
  text: {
    ...Typography.loginHint,
    color: Colors.primaryDark,
    textAlign: 'right',
    marginRight: 8,
    flex: 1,
  },
  bold: {
    ...Typography.loginHintBold,
    color: Colors.primaryDark,
  },
});