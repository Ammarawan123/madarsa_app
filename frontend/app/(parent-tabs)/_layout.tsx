import React from 'react';
import { Tabs } from 'expo-router';
import { TabIcon } from '@/components/TabIcon/TabIcon';
import { TabLabel } from '@/components/TabLabel/TabLabel';
import { Colors } from '@/constants/theme';

export const PARENT_TAB_CONFIG = [
  {
    name: 'profile',
    label: 'پروفائل',
    activeIcon: require('@/assets/icons/profile-active.png'),
    inactiveIcon: require('@/assets/icons/profile-inactive.png'),
  },
  {
    name: 'performance',
    label: 'کارکردگی',
    activeIcon: require('@/assets/icons/performance-active.png'),
    inactiveIcon: require('@/assets/icons/performance-inactive.png'),
  },
  {
    name: 'roznama',
    label: 'روزنامہ',
    activeIcon: require('@/assets/icons/diary-active.png'),
    inactiveIcon: require('@/assets/icons/diary-inactive.png'),
  },
  {
    name: 'attendance',
    label: 'حاضری',
    activeIcon: require('@/assets/icons/attendance-active.png'),
    inactiveIcon: require('@/assets/icons/attendance-inactive.png'),
  },
  {
    name: 'home',
    label: 'ہوم',
    activeIcon: require('@/assets/icons/home-active.png'),
    inactiveIcon: require('@/assets/icons/home-inactive.png'),
  },
];

export default function ParentTabLayout() {
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
      {PARENT_TAB_CONFIG.map((tab) => (
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
            tabBarLabel: ({ focused }) => (
              <TabLabel label={tab.label} focused={focused} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
