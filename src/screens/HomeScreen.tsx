import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Page } from '../components/Screen';
import { getRegion } from '../data/regions';
import { colors, radii, shadow, spacing, typography } from '../theme';
import type { RegionCode, ResolvedDeck, RoundResult } from '../types';

export function HomeScreen({
  regionCode,
  decks,
  lastRound,
  onSelectDeck,
  onOpenSettings,
}: {
  regionCode: RegionCode;
  decks: ResolvedDeck[];
  lastRound?: RoundResult;
  onSelectDeck: (deck: ResolvedDeck) => void;
  onOpenSettings: () => void;
}) {
  const region = getRegion(regionCode);

  return (
    <Page>
      <View style={styles.topBar}>
        <View style={styles.brandRow}>
          <View style={styles.brandMark}><Text style={styles.brandEmoji}>🎭</Text></View>
          <Text style={styles.brand}>Las Charadas</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Abrir ajustes"
          hitSlop={8}
          onPress={onOpenSettings}
          style={({ pressed }) => [styles.settings, pressed && styles.pressed]}
        >
          <Ionicons color={colors.ink} name="settings-outline" size={23} />
        </Pressable>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Región: ${region.name}. Cambiar en ajustes.`}
        onPress={onOpenSettings}
        style={({ pressed }) => [styles.regionPill, pressed && styles.pressed]}
      >
        <Text style={styles.regionFlag}>{region.flag}</Text>
        <Text style={styles.regionName}>{region.name}</Text>
        <Ionicons color={colors.muted} name="chevron-forward" size={15} />
      </Pressable>

      <Text accessibilityRole="header" style={styles.title}>¿Listos para hacer el ridículo?</Text>
      <Text style={styles.subtitle}>Elige un mazo, pasa el iPhone y que empiece la ronda.</Text>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Mazos</Text>
        <Text style={styles.sectionNote}>{decks.length} para empezar</Text>
      </View>
      <View style={styles.deckList}>
        {decks.map((deck, index) => (
          <Pressable
            key={deck.id}
            accessibilityRole="button"
            accessibilityLabel={`${deck.title}. ${deck.description}. ${deck.cards.length} tarjetas.`}
            onPress={() => onSelectDeck(deck)}
            style={({ pressed }) => [styles.deckCard, { backgroundColor: deck.color }, pressed && styles.cardPressed]}
          >
            <View style={styles.deckTop}>
              <View style={styles.deckEmoji}><Text style={styles.deckEmojiText}>{deck.emoji}</Text></View>
              <View style={styles.deckCount}><Text style={[styles.deckCountText, { color: deck.accent }]}>{deck.cards.length} tarjetas</Text></View>
            </View>
            <Text style={styles.deckTitle}>{deck.title}</Text>
            <Text style={styles.deckDescription}>{deck.description}</Text>
            <View style={styles.playRow}>
              <Text style={styles.playText}>Jugar</Text>
              <Ionicons color={colors.white} name="arrow-forward" size={18} />
            </View>
            <View pointerEvents="none" style={[styles.deckOrb, index % 2 === 0 ? styles.orbRight : styles.orbLeft]} />
          </Pressable>
        ))}
      </View>

      {lastRound ? (
        <View style={styles.lastRound}>
          <View style={styles.lastIcon}><Ionicons color={colors.green} name="trophy-outline" size={22} /></View>
          <View style={styles.lastCopy}>
            <Text style={styles.lastLabel}>ÚLTIMA RONDA</Text>
            <Text style={styles.lastTitle}>{lastRound.deck.title}</Text>
          </View>
          <Text style={styles.lastScore}>{lastRound.answers.filter((answer) => answer.status === 'correct').length}</Text>
          <Text style={styles.lastUnit}> puntos</Text>
        </View>
      ) : null}
    </Page>
  );
}

const styles = StyleSheet.create({
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.xxl },
  brandRow: { flexDirection: 'row', alignItems: 'center' },
  brandMark: { width: 38, height: 38, borderRadius: 12, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
  brandEmoji: { fontSize: 20 },
  brand: { fontSize: 18, fontWeight: '900', color: colors.ink, letterSpacing: -0.3 },
  settings: { width: 46, height: 46, borderRadius: 23, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },
  pressed: { opacity: 0.65 },
  regionPill: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 12, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line, borderRadius: radii.pill, marginBottom: spacing.lg },
  regionFlag: { fontSize: 18, marginRight: 7 },
  regionName: { ...typography.caption, color: colors.ink, marginRight: spacing.xs },
  title: { ...typography.display, color: colors.ink, maxWidth: 350 },
  subtitle: { ...typography.body, color: colors.muted, marginTop: spacing.md, marginBottom: spacing.xxl, maxWidth: 340 },
  sectionHeader: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: spacing.md },
  sectionTitle: { ...typography.heading, color: colors.ink },
  sectionNote: { ...typography.caption, color: colors.muted },
  deckList: { gap: spacing.lg },
  deckCard: { minHeight: 208, borderRadius: radii.lg, padding: spacing.xl, overflow: 'hidden', ...shadow },
  cardPressed: { opacity: 0.88, transform: [{ scale: 0.99 }] },
  deckTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', zIndex: 1 },
  deckEmoji: { width: 48, height: 48, borderRadius: 15, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.92)' },
  deckEmojiText: { fontSize: 25 },
  deckCount: { backgroundColor: 'rgba(255,255,255,0.86)', paddingHorizontal: spacing.md, paddingVertical: 7, borderRadius: radii.pill },
  deckCountText: { ...typography.caption },
  deckTitle: { ...typography.title, color: colors.white, marginTop: spacing.xl, zIndex: 1 },
  deckDescription: { ...typography.callout, color: 'rgba(255,255,255,0.88)', marginTop: spacing.xs, maxWidth: '82%', zIndex: 1 },
  playRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.lg, zIndex: 1 },
  playText: { ...typography.callout, color: colors.white, fontWeight: '800' },
  deckOrb: { position: 'absolute', width: 130, height: 130, borderRadius: 65, backgroundColor: 'rgba(255,255,255,0.09)' },
  orbRight: { right: -35, bottom: -45 },
  orbLeft: { right: 25, top: -85 },
  lastRound: { flexDirection: 'row', alignItems: 'center', padding: spacing.lg, marginTop: spacing.xxl, borderRadius: radii.md, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line },
  lastIcon: { width: 42, height: 42, borderRadius: 13, backgroundColor: colors.greenSoft, alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
  lastCopy: { flex: 1 },
  lastLabel: { fontSize: 10, lineHeight: 13, color: colors.muted, fontWeight: '900', letterSpacing: 1 },
  lastTitle: { ...typography.callout, color: colors.ink, marginTop: 2 },
  lastScore: { ...typography.title, color: colors.green },
  lastUnit: { ...typography.caption, color: colors.muted, alignSelf: 'flex-end', marginBottom: 5 },
});
