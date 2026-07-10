import { Platform, TextStyle, ViewStyle } from 'react-native';

export const colors = {
  ink: '#20201E',
  muted: '#6A665F',
  paper: '#F7F1E5',
  card: '#FFFDF7',
  line: '#DDD4C5',
  coral: '#EF5B3F',
  coralDark: '#B93824',
  coralSoft: '#FDE4DD',
  green: '#2F7D5B',
  greenSoft: '#DDF1E7',
  yellow: '#F1BD3D',
  yellowSoft: '#FFF0BE',
  red: '#C84832',
  redSoft: '#F8DDD7',
  white: '#FFFFFF',
  black: '#11110F',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const radii = {
  sm: 10,
  md: 16,
  lg: 24,
  pill: 999,
};

export const shadow: ViewStyle = Platform.select({
  ios: {
    shadowColor: colors.ink,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
  },
  default: {},
});

export const typography = {
  display: {
    fontSize: 42,
    lineHeight: 44,
    fontWeight: '900',
    letterSpacing: -1.6,
  } satisfies TextStyle,
  title: {
    fontSize: 30,
    lineHeight: 34,
    fontWeight: '800',
    letterSpacing: -0.8,
  } satisfies TextStyle,
  heading: {
    fontSize: 21,
    lineHeight: 26,
    fontWeight: '800',
    letterSpacing: -0.25,
  } satisfies TextStyle,
  body: {
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '500',
  } satisfies TextStyle,
  callout: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '600',
  } satisfies TextStyle,
  caption: {
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '700',
  } satisfies TextStyle,
};
