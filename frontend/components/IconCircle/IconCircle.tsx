import React from 'react';
import { TouchableOpacity, Image, View, StyleSheet } from 'react-native';
import { Colors, HomeHeaderLayout } from '@/constants/theme';

interface IconCircleProps {
  iconSource: any;
  showDot?: boolean;
  onPress?: () => void;
}

export function IconCircle({ iconSource, showDot = false, onPress }: IconCircleProps) {
  return (
    <TouchableOpacity style={styles.circle} onPress={onPress} activeOpacity={0.7}>
      <Image
        source={iconSource}
        style={{ width: HomeHeaderLayout.iconInnerSize, height: HomeHeaderLayout.iconInnerSize }}
        resizeMode="contain"
      />
      {showDot && <View style={styles.dot} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  circle: {
    width: HomeHeaderLayout.iconCircleSize,
    height: HomeHeaderLayout.iconCircleSize,
    borderRadius: HomeHeaderLayout.iconCircleSize / 2,
    borderWidth: 0.8,
    borderColor: Colors.iconCircleBorder,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  dot: {
    position: 'absolute',
    top: 8,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.error,
  },
});