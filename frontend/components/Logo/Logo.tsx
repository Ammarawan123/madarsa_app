import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { LoginLayout } from '@/constants/theme';

export function Logo() {
  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/logo.png')}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  image: {
    width: LoginLayout.logoSize,
    height: LoginLayout.logoSize,
  },
});