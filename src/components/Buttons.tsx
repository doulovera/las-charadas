import type { PropsWithChildren, ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radii, spacing, typography } from '../theme';

type ButtonProps = PropsWithChildren<{
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'dark' | 'ghost';
  disabled?: boolean;
  icon?: ReactNode;
  accessibilityHint?: string;
}>;

export function Button({
  children,
  onPress,
  variant = 'primary',
  disabled = false,
  icon,
  accessibilityHint,
}: ButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityHint={accessibilityHint}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        styles[variant],
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      {icon ? <View style={styles.icon}>{icon}</View> : null}
      <Text style={[styles.label, variant === 'secondary' || variant === 'ghost' ? styles.darkLabel : null]}>
        {children}
      </Text>
    </Pressable>
  );
}

export function CircleButton({
  label,
  icon,
  onPress,
}: {
  label: string;
  icon: ReactNode;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={10}
      onPress={onPress}
      style={({ pressed }) => [styles.circle, pressed && styles.pressed]}
    >
      {icon}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 56,
    paddingHorizontal: spacing.xl,
    borderRadius: radii.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  primary: { backgroundColor: colors.coral },
  secondary: { backgroundColor: colors.card, borderColor: colors.line },
  dark: { backgroundColor: colors.ink },
  ghost: { backgroundColor: 'transparent' },
  label: { ...typography.body, color: colors.white, fontWeight: '800' },
  darkLabel: { color: colors.ink },
  icon: { marginRight: spacing.sm },
  pressed: { opacity: 0.76, transform: [{ scale: 0.985 }] },
  disabled: { opacity: 0.45 },
  circle: {
    width: 48,
    height: 48,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
  },
});
