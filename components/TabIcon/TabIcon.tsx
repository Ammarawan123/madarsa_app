import React from 'react';
import { Image } from 'react-native';
import { TabBarLayout } from '@/constants/theme';

interface TabIconProps {
  activeSource: any;
  inactiveSource: any;
  focused: boolean;
}

export function TabIcon({ activeSource, inactiveSource, focused }: TabIconProps) {
  const size = TabBarLayout.activeIconSize; // dono states same size

  return (
    <Image
      source={focused ? activeSource : inactiveSource}
      style={{ width: size, height: size }}
      resizeMode="contain"
    />
  );
}