import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Figma frame ki confirmed width/height
export const FIGMA_BASE_WIDTH = 414;
export const FIGMA_BASE_HEIGHT = 896;

// Horizontal cheezein (width, padding, font-size waghera)
export function scale(size: number): number {
  return (SCREEN_WIDTH / FIGMA_BASE_WIDTH) * size;
}

// Vertical cheezein (height, top/bottom margin)
export function verticalScale(size: number): number {
  return (SCREEN_HEIGHT / FIGMA_BASE_HEIGHT) * size;
}

// Font sizes ke liye — bohot chhoti/badi screens par font ko itna zyada scale nahi karta (zyada natural lagta hai)
export function moderateScale(size: number, factor: number = 0.5): number {
  return size + (scale(size) - size) * factor;
}