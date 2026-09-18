import React from 'react';
import { Redirect } from 'expo-router';

export default function ParentTabsIndex() {
  return <Redirect href="/(parent-tabs)/home" />;
}
