import { Tabs } from 'expo-router';
import React from 'react';

import { TabIcon } from '@/components/TabIcon/TabIcon';
import { TabLabel } from '@/components/TabLabel/TabLabel';
import { TAB_CONFIG } from '@/constants/tabs.config';
import { Colors } from '@/constants/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.border,
          paddingTop: 8,
        },
      }}
    >
      {/* 🚫 Hide Index Tab completely from Bottom Bar */}
      <Tabs.Screen
        name="index"
        options={{
          href: null,
          tabBarItemStyle: { display: 'none' },
        }}
      />

      {TAB_CONFIG.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon
                activeSource={tab.activeIcon}
                inactiveSource={tab.inactiveIcon}
                focused={focused}
              />
            ),
            tabBarLabel: ({ focused }) => <TabLabel label={tab.label} focused={focused} />,
          }}
        />
      ))}
    </Tabs>
  );
}

