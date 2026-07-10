import { Ionicons } from '@expo/vector-icons';
import { useAudioPlayer } from 'expo-audio';
import * as Haptics from 'expo-haptics';
import { useKeepAwake } from 'expo-keep-awake';
import * as ScreenOrientation from 'expo-screen-orientation';
import { DeviceMotion } from 'expo-sensors';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { shuffleCards } from '../data/decks';
import { colors, radii, spacing, typography } from '../theme';
import type { AnswerStatus, Preferences, RoundAnswer, RoundConfig, RoundResult } from '../types';

type GameMode = 'calibrating' | 'countdown' | 'playing';

export function GameScreen({
  config,
  preferences,
  onFinish,
}: {
  config: RoundConfig;
  preferences: Preferences;
  onFinish: (result: RoundResult) => void;
}) {
  useKeepAwake();
  const insets = useSafeAreaInsets();
  const cards = useMemo(() => shuffleCards(config.deck.cards), [config.deck.cards]);
  const [mode, setMode] = useState<GameMode>('calibrating');
  const [countdown, setCountdown] = useState(3);
  const [timeLeft, setTimeLeft] = useState(config.duration);
  const [cardIndex, setCardIndex] = useState(0);
  const [feedback, setFeedback] = useState<AnswerStatus | null>(null);
  const [motionAvailable, setMotionAvailable] = useState(true);

  const correctPlayer = useAudioPlayer(require('../../assets/sounds/correct.wav'));
  const passPlayer = useAudioPlayer(require('../../assets/sounds/pass.wav'));
  const tickPlayer = useAudioPlayer(require('../../assets/sounds/tick.wav'));

  const latestGammaRef = useRef(0);
  const neutralGammaRef = useRef(0);
  const motionArmedRef = useRef(true);
  const answersRef = useRef<RoundAnswer[]>([]);
  const finishedRef = useRef(false);
  const feedbackRef = useRef<AnswerStatus | null>(null);
  const modeRef = useRef<GameMode>('calibrating');
  const advanceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const recordAnswerRef = useRef<(status: AnswerStatus) => void>(() => undefined);

  const currentCard = cards[cardIndex % cards.length]!;

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    void ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_LEFT);
    return () => {
      void ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
      if (advanceTimeoutRef.current) clearTimeout(advanceTimeoutRef.current);
    };
  }, []);

  const finishRound = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    onFinish({
      ...config,
      id: `${Date.now()}`,
      playedAt: new Date().toISOString(),
      answers: answersRef.current,
    });
  }, [config, onFinish]);

  useEffect(() => {
    if (mode !== 'playing') return;
    const timer = setInterval(() => setTimeLeft((value) => Math.max(0, value - 1)), 1000);
    return () => clearInterval(timer);
  }, [mode]);

  useEffect(() => {
    if (mode === 'playing' && timeLeft === 0) finishRound();
  }, [finishRound, mode, timeLeft]);

  useEffect(() => {
    if (mode !== 'countdown') return;
    if (preferences.soundEnabled) {
      void tickPlayer.seekTo(0);
      tickPlayer.play();
    }
    if (preferences.hapticsEnabled) void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const timer = setTimeout(() => {
      if (countdown === 1) {
        setTimeLeft(config.duration);
        setMode('playing');
      } else {
        setCountdown((value) => value - 1);
      }
    }, 850);
    return () => clearTimeout(timer);
  }, [config.duration, countdown, mode, preferences.hapticsEnabled, preferences.soundEnabled, tickPlayer]);

  const recordAnswer = useCallback((status: AnswerStatus) => {
    if (modeRef.current !== 'playing' || feedbackRef.current || finishedRef.current) return;
    feedbackRef.current = status;
    setFeedback(status);
    answersRef.current = [...answersRef.current, { ...currentCard, status }];

    if (preferences.soundEnabled) {
      const player = status === 'correct' ? correctPlayer : passPlayer;
      void player.seekTo(0);
      player.play();
    }
    if (preferences.hapticsEnabled) {
      void Haptics.notificationAsync(
        status === 'correct' ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Warning,
      );
    }

    advanceTimeoutRef.current = setTimeout(() => {
      setCardIndex((index) => index + 1);
      feedbackRef.current = null;
      setFeedback(null);
    }, 430);
  }, [correctPlayer, currentCard, passPlayer, preferences.hapticsEnabled, preferences.soundEnabled]);

  useEffect(() => {
    recordAnswerRef.current = recordAnswer;
  }, [recordAnswer]);

  useEffect(() => {
    let subscription: ReturnType<typeof DeviceMotion.addListener> | undefined;
    void DeviceMotion.isAvailableAsync().then((available) => {
      setMotionAvailable(available);
      if (!available) return;
      DeviceMotion.setUpdateInterval(80);
      subscription = DeviceMotion.addListener((measurement) => {
        const gamma = measurement.rotation?.gamma ?? 0;
        latestGammaRef.current = gamma;
        if (modeRef.current !== 'playing') return;
        const delta = gamma - neutralGammaRef.current;
        if (!motionArmedRef.current) {
          if (Math.abs(delta) < 0.2) motionArmedRef.current = true;
          return;
        }
        if (delta > 0.52) {
          motionArmedRef.current = false;
          recordAnswerRef.current('passed');
        } else if (delta < -0.52) {
          motionArmedRef.current = false;
          recordAnswerRef.current('correct');
        }
      });
    });
    return () => subscription?.remove();
  }, []);

  const calibrate = () => {
    neutralGammaRef.current = latestGammaRef.current;
    motionArmedRef.current = true;
    setCountdown(3);
    setMode('countdown');
  };

  const confirmExit = () => {
    Alert.alert('¿Terminar la ronda?', 'Se guardarán las tarjetas que ya jugaron.', [
      { text: 'Seguir jugando', style: 'cancel' },
      { text: 'Terminar', style: 'destructive', onPress: finishRound },
    ]);
  };

  if (mode === 'calibrating') {
    return (
      <View style={[styles.readyScreen, { backgroundColor: config.deck.color, paddingTop: insets.top + spacing.md, paddingBottom: insets.bottom + spacing.md }]}>
        <StatusBar hidden />
        <Pressable accessibilityRole="button" accessibilityLabel="Salir de la ronda" onPress={confirmExit} style={styles.closeButton}>
          <Ionicons color={colors.white} name="close" size={27} />
        </Pressable>
        <View style={styles.readyCopy}>
          <View style={styles.landscapeIcon}><Ionicons color={config.deck.accent} name="phone-landscape-outline" size={39} /></View>
          <Text style={styles.readyEyebrow}>MANTÉN EL IPHONE DERECHO</Text>
          <Text style={styles.readyTitle}>Ponlo en tu frente</Text>
          <Text style={styles.readyText}>
            Toca el botón cuando esté en una posición cómoda. Esa será la posición neutral.
          </Text>
          {!motionAvailable ? <Text style={styles.noMotion}>No detectamos movimiento. Puedes jugar con los botones.</Text> : null}
          <Pressable accessibilityRole="button" onPress={calibrate} style={({ pressed }) => [styles.calibrateButton, pressed && styles.pressed]}>
            <Ionicons color={colors.ink} name="scan-outline" size={22} />
            <Text style={styles.calibrateLabel}>Calibrar aquí</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  if (mode === 'countdown') {
    return (
      <View style={[styles.countdownScreen, { backgroundColor: config.deck.color }]}>
        <StatusBar hidden />
        <Text style={styles.countdownLabel}>PREPÁRATE</Text>
        <Text accessibilityLiveRegion="assertive" style={styles.countdownNumber}>{countdown}</Text>
        <Text style={styles.countdownHint}>Vuelve al centro después de cada gesto</Text>
      </View>
    );
  }

  const isCorrect = feedback === 'correct';
  const feedbackColor = isCorrect ? colors.green : colors.red;

  return (
    <View style={[styles.game, feedback ? { backgroundColor: feedbackColor } : null, { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 10, paddingLeft: insets.left + 14, paddingRight: insets.right + 14 }]}>
      <StatusBar hidden />
      <View style={styles.gameHeader}>
        <View style={[styles.timer, timeLeft <= 10 && styles.timerUrgent]}>
          <Ionicons color={timeLeft <= 10 ? colors.white : colors.ink} name="timer-outline" size={20} />
          <Text accessibilityLiveRegion={timeLeft <= 5 ? 'assertive' : 'none'} style={[styles.timerText, timeLeft <= 10 && styles.timerUrgentText]}>{timeLeft}</Text>
        </View>
        <View style={styles.roundName}>
          <Text style={styles.roundDeck}>{config.deck.title}</Text>
          {config.playerName ? <Text style={styles.roundPlayer}>{config.playerName}</Text> : null}
        </View>
        <Pressable accessibilityRole="button" accessibilityLabel="Terminar ronda" hitSlop={8} onPress={confirmExit} style={styles.gameClose}>
          <Ionicons color={colors.ink} name="close" size={25} />
        </Pressable>
      </View>

      <View style={styles.wordArea}>
        {feedback ? (
          <View accessibilityLiveRegion="assertive" style={styles.feedbackContent}>
            <View style={styles.feedbackIcon}><Ionicons color={feedbackColor} name={isCorrect ? 'checkmark' : 'play-skip-forward'} size={42} /></View>
            <Text style={styles.feedbackTitle}>{isCorrect ? '¡Correcto!' : 'Pasamos'}</Text>
          </View>
        ) : (
          <Text adjustsFontSizeToFit minimumFontScale={0.42} numberOfLines={2} style={styles.word}>{currentCard.term}</Text>
        )}
      </View>

      <View style={styles.controls}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Pasar tarjeta"
          disabled={Boolean(feedback)}
          onPress={() => recordAnswer('passed')}
          style={({ pressed }) => [styles.controlButton, styles.passButton, pressed && styles.pressed]}
        >
          <Ionicons color={colors.red} name="play-skip-forward" size={22} />
          <Text style={[styles.controlLabel, { color: colors.red }]}>Pasar</Text>
        </Pressable>
        <View style={styles.neutralHint}><Ionicons color={colors.muted} name="swap-vertical" size={17} /><Text style={styles.neutralText}>Inclina o toca</Text></View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Marcar como correcta"
          disabled={Boolean(feedback)}
          onPress={() => recordAnswer('correct')}
          style={({ pressed }) => [styles.controlButton, styles.correctButton, pressed && styles.pressed]}
        >
          <Ionicons color={colors.white} name="checkmark" size={24} />
          <Text style={[styles.controlLabel, { color: colors.white }]}>Correcto</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  readyScreen: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 70 },
  closeButton: { position: 'absolute', top: 20, right: 24, width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(0,0,0,0.18)', alignItems: 'center', justifyContent: 'center' },
  readyCopy: { alignItems: 'center', maxWidth: 530 },
  landscapeIcon: { width: 76, height: 76, borderRadius: 24, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg },
  readyEyebrow: { fontSize: 11, fontWeight: '900', letterSpacing: 1.5, color: 'rgba(255,255,255,0.75)' },
  readyTitle: { fontSize: 36, lineHeight: 41, fontWeight: '900', letterSpacing: -1, color: colors.white, marginTop: spacing.xs },
  readyText: { ...typography.body, color: 'rgba(255,255,255,0.84)', textAlign: 'center', marginTop: spacing.sm, maxWidth: 490 },
  noMotion: { ...typography.caption, color: colors.white, marginTop: spacing.md, backgroundColor: 'rgba(0,0,0,0.18)', paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radii.pill },
  calibrateButton: { minWidth: 220, height: 58, borderRadius: radii.md, backgroundColor: colors.white, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, marginTop: spacing.xl },
  calibrateLabel: { ...typography.body, color: colors.ink, fontWeight: '800' },
  pressed: { opacity: 0.7, transform: [{ scale: 0.985 }] },
  countdownScreen: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  countdownLabel: { fontSize: 12, fontWeight: '900', letterSpacing: 2, color: 'rgba(255,255,255,0.72)' },
  countdownNumber: { fontSize: 122, lineHeight: 132, fontWeight: '900', letterSpacing: -5, color: colors.white },
  countdownHint: { ...typography.callout, color: 'rgba(255,255,255,0.75)' },
  game: { flex: 1, backgroundColor: colors.paper },
  gameHeader: { minHeight: 48, flexDirection: 'row', alignItems: 'center' },
  timer: { height: 42, minWidth: 80, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderRadius: radii.pill, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line },
  timerUrgent: { backgroundColor: colors.red, borderColor: colors.red },
  timerText: { fontSize: 19, fontWeight: '800', color: colors.ink, fontVariant: ['tabular-nums'] },
  timerUrgentText: { color: colors.white },
  roundName: { flex: 1, alignItems: 'center' },
  roundDeck: { ...typography.callout, color: colors.ink, fontWeight: '800' },
  roundPlayer: { ...typography.caption, color: colors.muted },
  gameClose: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },
  wordArea: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xxl },
  word: { fontSize: 66, lineHeight: 72, fontWeight: '900', color: colors.ink, textAlign: 'center', letterSpacing: -2.3, textTransform: 'lowercase' },
  feedbackContent: { alignItems: 'center' },
  feedbackIcon: { width: 78, height: 78, borderRadius: 39, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  feedbackTitle: { fontSize: 43, lineHeight: 49, fontWeight: '900', color: colors.white, letterSpacing: -1.3, marginTop: spacing.md },
  controls: { minHeight: 66, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md },
  controlButton: { height: 58, minWidth: 150, paddingHorizontal: spacing.xl, borderRadius: radii.md, flexDirection: 'row', gap: spacing.sm, alignItems: 'center', justifyContent: 'center' },
  passButton: { backgroundColor: colors.redSoft, borderWidth: 1, borderColor: '#E9B6AA' },
  correctButton: { backgroundColor: colors.green },
  controlLabel: { ...typography.body, fontWeight: '800' },
  neutralHint: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  neutralText: { ...typography.caption, color: colors.muted },
});
