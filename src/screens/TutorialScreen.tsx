import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '../components/Buttons';
import { Page, ScreenHeader } from '../components/Screen';
import { colors, radii, spacing, typography } from '../theme';
import type { RoundConfig } from '../types';

export function TutorialScreen({
  config,
  onBack,
  onStart,
}: {
  config: RoundConfig;
  onBack: () => void;
  onStart: () => void;
}) {
  return (
    <Page bottom={<Button onPress={onStart}>Girar y calibrar</Button>}>
      <ScreenHeader title="Cómo se juega" onBack={onBack} />
      <Text accessibilityRole="header" style={styles.title}>Tu cabeza es el control.</Text>
      <Text style={styles.subtitle}>Pon el iPhone en tu frente con la pantalla mirando al grupo.</Text>

      <View style={styles.phoneStage}>
        <View style={styles.arrowUp}>
          <Ionicons color={colors.green} name="arrow-up" size={24} />
          <Text style={styles.correctLabel}>CORRECTO</Text>
        </View>
        <View style={styles.phone}>
          <View style={styles.notch} />
          <Text style={styles.phoneWord}>canchita</Text>
        </View>
        <View style={styles.arrowDown}>
          <Text style={styles.passLabel}>PASAR</Text>
          <Ionicons color={colors.red} name="arrow-down" size={24} />
        </View>
      </View>

      <View style={styles.steps}>
        <View style={styles.step}>
          <View style={[styles.stepIcon, styles.greenIcon]}><Ionicons color={colors.green} name="checkmark" size={25} /></View>
          <View style={styles.stepCopy}>
            <Text style={styles.stepTitle}>Inclina hacia arriba</Text>
            <Text style={styles.stepText}>Cuando adivinen la tarjeta.</Text>
          </View>
        </View>
        <View style={styles.divider} />
        <View style={styles.step}>
          <View style={[styles.stepIcon, styles.redIcon]}><Ionicons color={colors.red} name="play-skip-forward" size={20} /></View>
          <View style={styles.stepCopy}>
            <Text style={styles.stepTitle}>Inclina hacia abajo</Text>
            <Text style={styles.stepText}>Si prefieren pasar a la siguiente.</Text>
          </View>
        </View>
      </View>

      <View style={styles.accessibilityNote}>
        <Ionicons color={colors.muted} name="hand-left-outline" size={21} />
        <Text style={styles.accessibilityText}>También habrá botones grandes para jugar sin movimiento.</Text>
      </View>

      <View style={styles.roundSummary}>
        <Text style={styles.summaryLabel}>SIGUIENTE RONDA</Text>
        <Text style={styles.summaryValue}>{config.playerName || 'Sin nombre'} · {config.duration} segundos</Text>
      </View>
    </Page>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.title, color: colors.ink },
  subtitle: { ...typography.body, color: colors.muted, marginTop: spacing.sm, maxWidth: 340 },
  phoneStage: { height: 205, alignItems: 'center', justifyContent: 'center', marginVertical: spacing.xl },
  phone: { width: 230, height: 112, borderRadius: 25, borderWidth: 7, borderColor: colors.ink, backgroundColor: colors.coral, alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '-3deg' }] },
  notch: { position: 'absolute', left: 8, top: 35, width: 6, height: 30, borderRadius: 3, backgroundColor: colors.ink },
  phoneWord: { fontSize: 29, fontWeight: '900', color: colors.white, letterSpacing: -0.8 },
  arrowUp: { position: 'absolute', top: 0, right: 16, alignItems: 'center' },
  arrowDown: { position: 'absolute', bottom: 0, left: 7, alignItems: 'center' },
  passLabel: { ...typography.caption, color: colors.red, fontSize: 10, marginTop: 1 },
  correctLabel: { ...typography.caption, color: colors.green, fontSize: 10, marginBottom: 1 },
  steps: { borderRadius: radii.lg, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line, paddingHorizontal: spacing.lg },
  step: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.lg },
  stepIcon: { width: 48, height: 48, borderRadius: 15, alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
  greenIcon: { backgroundColor: colors.greenSoft },
  redIcon: { backgroundColor: colors.redSoft },
  stepCopy: { flex: 1 },
  stepTitle: { ...typography.callout, color: colors.ink, fontWeight: '800' },
  stepText: { ...typography.caption, color: colors.muted, marginTop: 2 },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: colors.line, marginLeft: 61 },
  accessibilityNote: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingHorizontal: spacing.md, marginTop: spacing.lg },
  accessibilityText: { ...typography.caption, color: colors.muted, flex: 1 },
  roundSummary: { marginTop: spacing.xxl, alignItems: 'center' },
  summaryLabel: { fontSize: 10, fontWeight: '900', letterSpacing: 1.2, color: colors.muted },
  summaryValue: { ...typography.callout, color: colors.ink, marginTop: spacing.xs },
});
