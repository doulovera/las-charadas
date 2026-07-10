import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '../components/Buttons';
import { RegionPicker } from '../components/RegionPicker';
import { Page } from '../components/Screen';
import { getRegion } from '../data/regions';
import { colors, radii, shadow, spacing, typography } from '../theme';
import type { RegionCode } from '../types';

export function OnboardingScreen({
  detectedRegion,
  onComplete,
}: {
  detectedRegion: RegionCode;
  onComplete: (region: RegionCode) => void;
}) {
  const [selected, setSelected] = useState(detectedRegion);
  const [pickerVisible, setPickerVisible] = useState(false);
  const region = getRegion(selected);

  return (
    <Page
      bottom={
        <View style={styles.actions}>
          <Button onPress={() => onComplete(selected)}>Sí, {region.confirmation}</Button>
          <Button variant="ghost" onPress={() => setPickerVisible(true)}>Elegir otro país</Button>
        </View>
      }
    >
      <View style={styles.brandRow}>
        <View style={styles.brandMark}><Text style={styles.brandEmoji}>🎭</Text></View>
        <Text style={styles.brand}>LAS CHARADAS</Text>
      </View>

      <View style={styles.hero}>
        <Text style={styles.eyebrow}>UN JUEGO QUE HABLA COMO TÚ</Text>
        <Text accessibilityRole="header" style={styles.title}>Tu español entra en juego.</Text>
        <Text style={styles.intro}>
          Usaremos palabras conocidas en tu región para que las pistas suenen naturales desde la primera ronda.
        </Text>
      </View>

      <View style={styles.regionCard}>
        <Text style={styles.flag}>{region.flag}</Text>
        <View style={styles.regionCopy}>
          <Text style={styles.question}>{selected === 'GENERAL' ? 'No encontramos una región' : `Parece que estás en ${region.name}`}</Text>
          <Text style={styles.explanation}>
            {selected === 'GENERAL'
              ? 'Empezaremos con palabras de español general.'
              : 'Solo leemos la región del iPhone. No usamos tu ubicación.'}
          </Text>
        </View>
      </View>

      <View style={styles.privacyRow}>
        <Text style={styles.privacyIcon}>⌁</Text>
        <Text style={styles.privacy}>Sin cuenta · Sin internet · Tu preferencia queda en este iPhone</Text>
      </View>

      <RegionPicker
        visible={pickerVisible}
        selected={selected}
        onClose={() => setPickerVisible(false)}
        onSelect={(code) => {
          setSelected(code);
          setPickerVisible(false);
        }}
      />
    </Page>
  );
}

const styles = StyleSheet.create({
  brandRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.xxxl },
  brandMark: { width: 38, height: 38, borderRadius: 12, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
  brandEmoji: { fontSize: 20 },
  brand: { ...typography.caption, color: colors.ink, letterSpacing: 1.5, fontWeight: '900' },
  hero: { marginBottom: spacing.xxl },
  eyebrow: { ...typography.caption, color: colors.coralDark, letterSpacing: 1.15, marginBottom: spacing.md },
  title: { ...typography.display, color: colors.ink, maxWidth: 330 },
  intro: { ...typography.body, color: colors.muted, marginTop: spacing.lg, maxWidth: 345 },
  regionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.xl,
    borderRadius: radii.lg,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    ...shadow,
  },
  flag: { fontSize: 48, marginRight: spacing.lg },
  regionCopy: { flex: 1 },
  question: { ...typography.heading, color: colors.ink },
  explanation: { ...typography.callout, color: colors.muted, marginTop: spacing.sm },
  privacyRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.xl, paddingHorizontal: spacing.sm },
  privacyIcon: { fontSize: 22, color: colors.green, marginRight: spacing.sm },
  privacy: { ...typography.caption, color: colors.muted, flex: 1 },
  actions: { gap: spacing.xs },
});
