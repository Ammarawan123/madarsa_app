export const Colors = {
  primary: "#1B4A3F", // dark green (logo/button color)
  primaryDark: "#123329",
  background: "#FDFBF6", // cream background
  surface: "#FFFFFF",
  border: "#D9D9D9",
  borderFocused: "#1B4A3F",
  textPrimary: "#1A1A1A",
  textSecondary: "#6B6B6B",
  error: "#D64545",
  placeholder: "#9E9E9E",
  disabled: "#A9C4BC",
  light: {
    text: "#1A1A1A",
    background: "#FDFBF6",
    tint: "#1B4A3F",
    icon: "#6B6B6B",
    tabIconDefault: "#6B6B6B",
    tabIconSelected: "#1B4A3F",
  },
  dark: {
    text: "#F5F5F5",
    background: "#1A1A1A",
    tint: "#B8D8CE",
    icon: "#B8B8B8",
    tabIconDefault: "#B8B8B8",
    tabIconSelected: "#B8D8CE",
  },
} as const;

export const Fonts = {
  sans: "System",
  serif: "serif",
  rounded: "System",
  mono: "monospace",
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const Typography = {
  title: { fontSize: 22, fontWeight: "700" as const },
  subtitle: { fontSize: 14, fontWeight: "400" as const },
  label: { fontSize: 14, fontWeight: "600" as const },
  input: { fontSize: 16, fontWeight: "400" as const },
  button: { fontSize: 16, fontWeight: "700" as const },
  hint: { fontSize: 12, fontWeight: "400" as const },
} as const;

export const Radius = {
  sm: 8,
  md: 12,
  lg: 20,
} as const;
