import type { PropsWithChildren, ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CircleButton } from './Buttons';
import { colors, spacing, typography } from '../theme';

export function Page({
  children,
  scroll = true,
  bottom,
}: PropsWithChildren<{ scroll?: boolean; bottom?: ReactNode }>) {
  const insets = useSafeAreaInsets();
  const content = (
    <View style={[styles.content, { paddingTop: insets.top + spacing.md, paddingBottom: bottom ? spacing.lg : insets.bottom + spacing.xl }]}>
      {children}
    </View>
  );

  return (
    <View style={styles.page}>
      <View pointerEvents="none" style={styles.sun} />
      {scroll ? <ScrollView contentContainerStyle={styles.grow} showsVerticalScrollIndicator={false}>{content}</ScrollView> : content}
      {bottom ? <View style={[styles.bottom, { paddingBottom: insets.bottom + spacing.md }]}>{bottom}</View> : null}
    </View>
  );
}

export function ScreenHeader({
  title,
  onBack,
  right,
}: {
  title?: string;
  onBack?: () => void;
  right?: ReactNode;
}) {
  return (
    <View style={styles.header}>
      <View style={styles.headerSide}>
        {onBack ? <CircleButton label="Volver" icon={<Text style={styles.headerIcon}>‹</Text>} onPress={onBack} /> : null}
      </View>
      <Text numberOfLines={1} style={styles.headerTitle}>{title}</Text>
      <View style={[styles.headerSide, styles.headerRight]}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.paper },
  grow: { flexGrow: 1 },
  content: { flexGrow: 1, paddingHorizontal: spacing.xl },
  sun: {
    position: 'absolute',
    top: -150,
    left: -120,
    width: 330,
    height: 330,
    borderRadius: 180,
    backgroundColor: '#F7D694',
    opacity: 0.42,
  },
  bottom: {
    backgroundColor: colors.paper,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.line,
  },
  header: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  headerSide: { width: 64, alignItems: 'flex-start' },
  headerRight: { alignItems: 'flex-end' },
  headerTitle: { ...typography.callout, color: colors.ink, textAlign: 'center', flex: 1 },
  headerIcon: { color: colors.ink, fontSize: 36, lineHeight: 38, marginTop: -3 },
});
