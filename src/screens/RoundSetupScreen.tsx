import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Button } from '../components/Buttons';
import { Page, ScreenHeader } from '../components/Screen';
import { colors, radii, spacing, typography } from '../theme';
import type { ResolvedDeck, RoundConfig } from '../types';

const DURATIONS = [30, 60, 90];

export function RoundSetupScreen({
  deck,
  onBack,
  onContinue,
}: {
  deck: ResolvedDeck;
  onBack: () => void;
  onContinue: (config: RoundConfig) => void;
}) {
  const [duration, setDuration] = useState(60);
  const [playerName, setPlayerName] = useState('');

  return (
    <Page
      bottom={<Button onPress={() => onContinue({ deck, duration, playerName: playerName.trim() })}>Ver cómo se juega</Button>}
    >
      <ScreenHeader title="Preparar ronda" onBack={onBack} />
      <View style={[styles.deckHero, { backgroundColor: deck.color }]}>
        <Text style={styles.deckEmoji}>{deck.emoji}</Text>
        <View style={styles.deckCopy}>
          <Text style={styles.deckTitle}>{deck.title}</Text>
          <Text style={styles.deckMeta}>{deck.cards.length} tarjetas · Sin internet</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>¿Cuánto dura la ronda?</Text>
        <View accessibilityRole="radiogroup" style={styles.segmented}>
          {DURATIONS.map((value) => {
            const active = value === duration;
            return (
              <Pressable
                key={value}
                accessibilityRole="radio"
                accessibilityState={{ checked: active }}
                onPress={() => setDuration(value)}
                style={({ pressed }) => [styles.segment, active && styles.segmentActive, pressed && styles.pressed]}
              >
                <Text style={[styles.segmentNumber, active && styles.segmentNumberActive]}>{value}</Text>
                <Text style={[styles.segmentUnit, active && styles.segmentUnitActive]}>seg</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>¿Quién adivina?</Text>
        <Text style={styles.help}>Opcional. Puede ser una persona o un equipo.</Text>
        <View style={styles.inputWrap}>
          <Ionicons color={colors.muted} name="people-outline" size={21} />
          <TextInput
            accessibilityLabel="Nombre de la persona o equipo"
            autoCorrect={false}
            clearButtonMode="while-editing"
            maxLength={24}
            onChangeText={setPlayerName}
            placeholder="Ej. Equipo Rojo"
            placeholderTextColor="#98938A"
            returnKeyType="done"
            style={styles.input}
            value={playerName}
          />
        </View>
      </View>

      <View style={styles.tip}>
        <View style={styles.tipIcon}><Ionicons color={colors.green} name="phone-landscape-outline" size={24} /></View>
        <View style={styles.tipCopy}>
          <Text style={styles.tipTitle}>Necesitarás espacio para moverte</Text>
          <Text style={styles.tipText}>La siguiente pantalla te enseñará los dos gestos.</Text>
        </View>
      </View>
    </Page>
  );
}

const styles = StyleSheet.create({
  deckHero: { flexDirection: 'row', alignItems: 'center', borderRadius: radii.lg, padding: spacing.xl, marginBottom: spacing.xxl },
  deckEmoji: { fontSize: 43, marginRight: spacing.lg },
  deckCopy: { flex: 1 },
  deckTitle: { ...typography.heading, color: colors.white },
  deckMeta: { ...typography.callout, color: 'rgba(255,255,255,0.82)', marginTop: spacing.xs },
  section: { marginBottom: spacing.xxl },
  label: { ...typography.heading, color: colors.ink, marginBottom: spacing.sm },
  help: { ...typography.callout, color: colors.muted, marginBottom: spacing.md },
  segmented: { flexDirection: 'row', padding: spacing.xs, borderRadius: radii.md, backgroundColor: '#EAE3D7', gap: spacing.xs },
  segment: { flex: 1, minHeight: 70, alignItems: 'center', justifyContent: 'center', borderRadius: 12 },
  segmentActive: { backgroundColor: colors.card },
  segmentNumber: { fontSize: 23, fontWeight: '800', color: colors.muted },
  segmentNumberActive: { color: colors.ink },
  segmentUnit: { ...typography.caption, color: colors.muted },
  segmentUnitActive: { color: colors.coralDark },
  pressed: { opacity: 0.65 },
  inputWrap: { minHeight: 58, flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.lg, borderRadius: radii.md, borderWidth: 1.5, borderColor: colors.line, backgroundColor: colors.card },
  input: { ...typography.body, flex: 1, color: colors.ink, marginLeft: spacing.md, paddingVertical: spacing.md },
  tip: { flexDirection: 'row', alignItems: 'center', padding: spacing.lg, borderRadius: radii.md, backgroundColor: colors.greenSoft },
  tipIcon: { width: 46, height: 46, borderRadius: 15, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.card, marginRight: spacing.md },
  tipCopy: { flex: 1 },
  tipTitle: { ...typography.callout, color: colors.ink, fontWeight: '800' },
  tipText: { ...typography.caption, color: colors.muted, marginTop: 2 },
});
