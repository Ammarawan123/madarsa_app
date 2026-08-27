import { Colors } from "@/constants/theme";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" backgroundColor={Colors.background} />
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        {/* App khulte hi ye screen sabse pehle dikhegi */}
        <Stack.Screen name="login" />

        {/* Login ke baad ye poora tab-based section load hota hai */}
        <Stack.Screen name="(tabs)" />

        {/* Modal screens (agar future mein chahiye ho) */}
        <Stack.Screen
          name="modal"
          options={{
            presentation: "modal",
            headerShown: true,
            title: "",
          }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}
