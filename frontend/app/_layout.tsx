import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';

export default function RootLayout() {
  return (
    <SafeAreaProvider style={{ backgroundColor: Colors.background }}>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="otp" />
        <Stack.Screen name="check-in" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(parent-tabs)" />
        <Stack.Screen name="student-history/[studentId]" />
        <Stack.Screen name="roznama/[studentId]" />
        <Stack.Screen name="roznama/preview/[studentId]" />
        <Stack.Screen name="roznama/view/[studentId]" />

      </Stack>
    </SafeAreaProvider>
  );
}