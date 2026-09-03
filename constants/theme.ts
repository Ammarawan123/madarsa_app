import { moderateScale, scale, verticalScale } from "@/utils/scaling";

const baseColors = {
  primary: "#3F725F", // Figma: Foundation/Primary/blue-500
  primaryDark: "#2D5143", // Figma: Foundation/Primary/blue-700
  accentLight: "#ECF1EF", // Figma: Foundation/Primary/blue-50 (hint box bg)
  background: "#FCFAF5", // Figma: Foundation/Background/brown-100
  surface: "#FFFFFF",
  border: "#3F725F",
  textPrimary: "#1A1A1A",
  textSecondary: "#6B6B6B",
  error: "#D64545",
  placeholder: "#9E9E9E",
  disabled: "#A9C4BC",
  tabInactive: "#676767",
  textDark: "#181815",
  textMuted: "#40554D",
  textDarkValue: "#181815",
  classPillBg: "#E0D9CB",
  iconCircleBorder: "#3F725F",
  iconStroke: "#676767",
  leaveHeadingColor: "#181815",
  seeMoreColor: "#2D6A4F",
  nameDark: "#1A2820",
  nameMuted: "#6B7A6E",
  typeArziBg: "#BDB294",
  statusUnderReviewBg: "#D92626",
  reasonBoxBg: "#FCFAF5",
  reasonTextColor: "#535353",
  durationTextColor: "#4A4A4A",
  timeAgoColor: "#45464D",
  dangerBg: "#FAFAFA",
  dangerBorder: "#D92626",
} as const;

export const Colors = {
  ...baseColors,
  light: {
    text: baseColors.textPrimary,
    background: baseColors.background,
    tint: baseColors.primary,
    icon: baseColors.textSecondary,
    tabIconDefault: baseColors.tabInactive,
    tabIconSelected: baseColors.primary,
  },
  dark: {
    text: "#FFFFFF",
    background: "#121212",
    tint: "#FFFFFF",
    icon: "#FFFFFF",
    tabIconDefault: "#9AA0A6",
    tabIconSelected: "#FFFFFF",
  },
} as const;

export const Spacing = {
  xs: scale(4),
  sm: scale(8),
  md: scale(16),
  lg: scale(24),
  xl: scale(32),
  xxl: scale(48),
} as const;

// Purana token — Card, Button, StatusTag, SegmentedToggle waghera isay use karte hain
export const Radius = {
  sm: scale(8),
  md: scale(12),
  lg: scale(20),
} as const;

// Figma se seedha nikale gaye login-specific numbers
export const LoginLayout = {
  logoSize: scale(233),
  logoTop: verticalScale(72),
  cardWidth: scale(383),
  cardTop: verticalScale(337),
  cardPadding: scale(24),
  cardGap: scale(32),
  cardRadius: scale(16),
  cardBorderWidth: 0.5,
  inputHeight: verticalScale(44),
  inputRadius: scale(12),
  inputPaddingV: scale(13),
  inputPaddingH: scale(12),
  hintBoxRadius: scale(12),
  hintBoxPaddingV: scale(12),
  hintBoxPaddingH: scale(16),
  hintBoxGap: scale(12),
} as const;

export const Typography = {
  // Purane tokens — Home, Dashboard, Attendance screens isay use karte hain
  title: { fontSize: moderateScale(22), fontWeight: "700" as const },
  subtitle: { fontSize: moderateScale(14), fontWeight: "400" as const },
  label: { fontSize: moderateScale(14), fontWeight: "600" as const },
  input: { fontSize: moderateScale(16), fontWeight: "400" as const },
  button: { fontSize: moderateScale(16), fontWeight: "700" as const },
  hint: { fontSize: moderateScale(12), fontWeight: "400" as const },

  // Naye Figma-exact login tokens (alag naam se, taake purane se conflict na ho)
  fieldLabel: {
    fontFamily: "NotoNaskhArabic_600SemiBold",
    fontSize: moderateScale(20),
    lineHeight: moderateScale(20),
  },
  loginHint: {
    fontFamily: "NotoNaskhArabic_500Medium",
    fontSize: moderateScale(16),
    lineHeight: moderateScale(16 * 1.6),
  },
  loginHintBold: {
    fontFamily: "NotoNaskhArabic_700Bold",
    fontSize: moderateScale(16),
    lineHeight: moderateScale(16 * 1.6),
  },
  loginButton: {
    fontFamily: "NotoNaskhArabic_600SemiBold",
    fontSize: moderateScale(18),
  },
  loginInput: {
    fontFamily: "NotoNaskhArabic_400Regular",
    fontSize: moderateScale(16),
  },
  checkInHeading: {
    fontFamily: "NotoNaskhArabic_600SemiBold",
    fontSize: moderateScale(24),
    lineHeight: moderateScale(24),
  },
  dateText: {
    fontFamily: "NotoNaskhArabic_700Bold",
    fontSize: moderateScale(24),
    lineHeight: moderateScale(24),
  },
  timeText: {
    fontFamily: "NotoNaskhArabic_500Medium",
    fontSize: moderateScale(16),
  },
  tabLabelActive: {
    fontFamily: "NotoNaskhArabic_700Bold",
    fontSize: moderateScale(15),
    lineHeight: moderateScale(15),
  },
  tabLabelInactive: {
    fontFamily: "NotoNaskhArabic_600SemiBold",
    fontSize: moderateScale(13),
    lineHeight: moderateScale(13),
  },
  sectionHeading: {
    fontFamily: "NotoNaskhArabic_600SemiBold",
    fontSize: moderateScale(22),
    lineHeight: moderateScale(22),
  },
  quickActionText: {
    fontFamily: "NotoNaskhArabic_500Medium",
    fontSize: moderateScale(20),
    lineHeight: moderateScale(20),
  },
  homeName: {
    fontFamily: "NotoNaskhArabic_600SemiBold",
    fontSize: moderateScale(24),
    lineHeight: moderateScale(24),
  },
  homeRole: {
    fontFamily: "NotoNaskhArabic_500Medium",
    fontSize: moderateScale(18),
    lineHeight: moderateScale(18),
  },
  dateBoxDate: {
    fontFamily: "Alvi Nastaleeq",
    fontSize: moderateScale(26),
    lineHeight: moderateScale(26),
  },
  dateBoxIslamic: {
    fontFamily: "Alvi Nastaleeq",
    fontSize: moderateScale(22),
    lineHeight: moderateScale(22),
  },
  classPillText: {
    fontFamily: "NotoNaskhArabic_600SemiBold",
    fontSize: moderateScale(20),
    lineHeight: moderateScale(20),
  },
  statLabel: {
    fontFamily: "NotoNaskhArabic_500Medium",
    fontSize: moderateScale(18),
    lineHeight: moderateScale(18),
  },
  statValue: {
    fontFamily: "Alvi Nastaleeq",
    fontSize: moderateScale(32),
    lineHeight: moderateScale(32 * 1.2),
  },
  leaveSectionHeading: {
    fontFamily: "NotoNaskhArabic_600SemiBold",
    fontSize: moderateScale(22),
    lineHeight: moderateScale(22),
  },
  seeMoreText: {
    fontFamily: "NotoNaskhArabic_600SemiBold",
    fontSize: moderateScale(20),
    lineHeight: moderateScale(20),
  },
  leaveName: {
    fontFamily: "NotoNaskhArabic_600SemiBold",
    fontSize: moderateScale(19),
    lineHeight: moderateScale(19),
  },
  pillText: {
    fontFamily: "NotoNaskhArabic_600SemiBold",
    fontSize: moderateScale(14),
  },
  reasonLabelBold: {
    fontFamily: "NotoNaskhArabic_700Bold",
    fontSize: moderateScale(18),
    lineHeight: moderateScale(18 * 1.5),
  },
  reasonText: {
    fontFamily: "NotoNaskhArabic_400Regular",
    fontSize: moderateScale(18),
    lineHeight: moderateScale(18 * 1.5),
  },
  durationLabel: {
    fontFamily: "NotoNaskhArabic_500Medium",
    fontSize: moderateScale(18),
  },
  durationValue: {
    fontFamily: "AlviNastaleeq-Regular",
    fontSize: moderateScale(20),
  },
  timeAgoText: {
    fontFamily: "NotoNaskhArabic_500Medium",
    fontSize: moderateScale(16),
  },
  actionButtonText: {
    fontFamily: "NotoNaskhArabic_600SemiBold",
    fontSize: moderateScale(14.41),
    lineHeight: moderateScale(16.01),
  },
} as const;
// Check-in screen — Figma se exact
export const CheckInLayout = {
  cardWidth: scale(383),
  cardRadius: scale(16),
  cardBorderWidth: 0.5,
  cardPadding: scale(24),
  cardGap: scale(30),
  dateBoxPaddingV: scale(12),
  dateBoxGap: scale(8),
} as const;

export const TabBarLayout = {
  activeIconSize: scale(32.07),
  inactiveIconSize: scale(28.32),
  barHeight: verticalScale(89),
  barPaddingV: verticalScale(21),
  barPaddingH: scale(18),
  barGap: scale(10),
} as const;
export const QuickActionLayout = {
  boxWidth: scale(383),
  boxHeight: scale(66),
  boxRadius: scale(16),
  boxPadding: scale(16),
  boxBorderWidth: 1,
  iconSize: scale(26.32),
  chevronSize: scale(24),
} as const;
export const HomeHeaderLayout = {
  iconCircleSize: scale(42),
  iconInnerSize: scale(18),
  dateCardWidth: scale(383),
  dateCardHeight: scale(107),
  dateCardRadius: scale(16),
  dateCardPaddingTop: scale(11),
  dateCardPaddingRight: scale(15),
  dateCardPaddingBottom: scale(11),
  dateCardPaddingLeft: scale(18),
  dateCardGap: scale(7),
  classPillPaddingH: scale(8),
  classPillPaddingV: scale(4),
  classPillRadius: scale(8),
  statCardWidth: scale(185.5),
  statCardHeight: scale(109),
  statCardRadius: scale(16),
  statCardPadding: scale(12),
  statCardBorderWidth: 0.5,
} as const;
export const LeaveCardLayout = {
  width: scale(383),
  minHeight: scale(265),
  radius: scale(16),
  gap: scale(12),
  padding: scale(16),
  borderWidth: 0.5,
} as const;
export const LeaveDetailLayout = {
  pillRadius: 999,
  pillPaddingV: scale(7),
  pillPaddingH: scale(14),
  reasonBoxRadius: scale(12),
  reasonBoxPadding: scale(12),
  reasonBoxBorderWidth: 0.5,
  reasonBoxGap: scale(12),
} as const;
export const ActionButtonLayout = {
  width: scale(169),
  height: scale(38),
  radius: scale(8),
  paddingV: scale(8),
  borderWidth: 0.8,
} as const;
