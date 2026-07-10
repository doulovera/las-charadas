import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '../components/Buttons';
import { Page } from '../components/Screen';
import { colors, radii, spacing, typography } from '../theme';
import type { RoundResult } from '../types';

export function ResultsScreen({
  result,
  onPlayAgain,
  onHome,
}: {
  result: RoundResult;
  onPlayAgain: () => void;
  onHome: () => void;
}) {
  const correct = result.answers.filter((answer) => answer.status === 'correct').length;
  const passed = result.answers.length - correct;

  return (
    <Page
      bottom={
        <View style={styles.actions}>
          <Button onPress={onPlayAgain}>Jugar otra ronda</Button>
          <Button variant="ghost" onPress={onHome}>Volver a los mazos</Button>
        </View>
      }
    >
      <View style={styles.topSpace} />
      <View style={styles.trophy}><Text style={styles.trophyEmoji}>{correct > 0 ? '🏆' : '🎭'}</Text></View>
      <Text style={styles.eyebrow}>RONDA TERMINADA</Text>
      <Text accessibilityRole="header" style={styles.title}>
        {correct >= 8 ? '¡Estuvieron imparables!' : correct >= 4 ? '¡Muy buena ronda!' : '¡Eso recién empieza!'}
      </Text>
      <Text style={styles.subtitle}>{result.playerName || 'El grupo'} jugó “{result.deck.title}”.</Text>

      <View style={styles.scoreCard}>
        <View style={styles.scorePrimary}>
          <Text style={styles.score}>{correct}</Text>
          <Text style={styles.scoreLabel}>puntos</Text>
        </View>
        <View style={styles.scoreDivider} />
        <View style={styles.scoreSecondary}>
          <View style={styles.statRow}><View style={[styles.dot, { backgroundColor: colors.green }]} /><Text style={styles.statLabel}>Correctas</Text><Text style={styles.statValue}>{correct}</Text></View>
          <View style={styles.statRow}><View style={[styles.dot, { backgroundColor: colors.red }]} /><Text style={styles.statLabel}>Pasadas</Text><Text style={styles.statValue}>{passed}</Text></View>
        </View>
      </View>

      <View style={styles.reviewHeader}>
        <Text style={styles.reviewTitle}>Tarjetas de la ronda</Text>
        <Text style={styles.reviewCount}>{result.answers.length}</Text>
      </View>
      {result.answers.length ? (
        <View style={styles.reviewList}>
          {result.answers.map((answer, index) => {
            const isCorrect = answer.status === 'correct';
            return (
              <View key={`${answer.id}-${index}`} style={styles.answerRow}>
                <View style={[styles.answerIcon, { backgroundColor: isCorrect ? colors.greenSoft : colors.redSoft }]}>
                  <Ionicons color={isCorrect ? colors.green : colors.red} name={isCorrect ? 'checkmark' : 'play-skip-forward'} size={19} />
                </View>
                <Text style={styles.answerTerm}>{answer.term}</Text>
                <Text style={[styles.answerStatus, { color: isCorrect ? colors.green : colors.red }]}>{isCorrect ? 'Correcta' : 'Pasada'}</Text>
              </View>
            );
          })}
        </View>
      ) : (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No hubo tarjetas registradas. La próxima ronda queda lista en un toque.</Text>
        </View>
      )}
    </Page>
  );
}

const styles = StyleSheet.create({
  topSpace: { height: spacing.md },
  trophy: { width: 70, height: 70, borderRadius: 22, alignSelf: 'center', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.yellowSoft, transform: [{ rotate: '-4deg' }] },
  trophyEmoji: { fontSize: 38 },
  eyebrow: { fontSize: 11, fontWeight: '900', letterSpacing: 1.4, color: colors.coralDark, textAlign: 'center', marginTop: spacing.lg },
  title: { ...typography.title, color: colors.ink, textAlign: 'center', marginTop: spacing.sm },
  subtitle: { ...typography.body, color: colors.muted, textAlign: 'center', marginTop: spacing.sm },
  scoreCard: { flexDirection: 'row', alignItems: 'stretch', marginTop: spacing.xxl, padding: spacing.xl, borderRadius: radii.lg, backgroundColor: colors.ink },
  scorePrimary: { flex: 0.75, alignItems: 'center', justifyContent: 'center' },
  score: { fontSize: 58, lineHeight: 62, fontWeight: '900', color: colors.yellow, letterSpacing: -2 },
  scoreLabel: { ...typography.caption, color: 'rgba(255,255,255,0.68)' },
  scoreDivider: { width: StyleSheet.hairlineWidth, backgroundColor: 'rgba(255,255,255,0.2)', marginHorizontal: spacing.xl },
  scoreSecondary: { flex: 1.15, justifyContent: 'center', gap: spacing.md },
  statRow: { flexDirection: 'row', alignItems: 'center' },
  dot: { width: 9, height: 9, borderRadius: 5, marginRight: spacing.sm },
  statLabel: { ...typography.callout, color: 'rgba(255,255,255,0.76)', flex: 1 },
  statValue: { ...typography.heading, color: colors.white },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.xxl, marginBottom: spacing.md },
  reviewTitle: { ...typography.heading, color: colors.ink },
  reviewCount: { ...typography.caption, color: colors.muted, backgroundColor: '#E9E1D4', paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: radii.pill },
  reviewList: { overflow: 'hidden', borderRadius: radii.lg, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.card },
  answerRow: { minHeight: 60, flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.md, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line },
  answerIcon: { width: 36, height: 36, borderRadius: 11, alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
  answerTerm: { ...typography.body, color: colors.ink, fontWeight: '700', flex: 1 },
  answerStatus: { ...typography.caption },
  empty: { padding: spacing.xl, borderRadius: radii.lg, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line },
  emptyText: { ...typography.callout, color: colors.muted, textAlign: 'center' },
  actions: { gap: spacing.xs },
});
