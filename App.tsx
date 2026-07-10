import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { getDecks } from './src/data/decks';
import { detectDeviceRegion } from './src/data/regions';
import { loadHistory, loadPreferences, savePreferences, saveRound } from './src/lib/storage';
import { GameScreen } from './src/screens/GameScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { ResultsScreen } from './src/screens/ResultsScreen';
import { RoundSetupScreen } from './src/screens/RoundSetupScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { TutorialScreen } from './src/screens/TutorialScreen';
import { colors } from './src/theme';
import type { Preferences, ResolvedDeck, RoundConfig, RoundResult } from './src/types';

type Screen =
  | { name: 'home' }
  | { name: 'settings' }
  | { name: 'setup'; deck: ResolvedDeck }
  | { name: 'tutorial'; config: RoundConfig }
  | { name: 'game'; config: RoundConfig }
  | { name: 'results'; result: RoundResult };

export default function App() {
  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const detectedRegion = useMemo(detectDeviceRegion, []);
  const [hydrated, setHydrated] = useState(false);
  const [preferences, setPreferences] = useState<Preferences>({
    hasCompletedOnboarding: false,
    region: detectedRegion,
    soundEnabled: true,
    hapticsEnabled: true,
  });
  const [history, setHistory] = useState<RoundResult[]>([]);
  const [screen, setScreen] = useState<Screen>({ name: 'home' });

  useEffect(() => {
    void Promise.all([loadPreferences(), loadHistory()])
      .then(([storedPreferences, storedHistory]) => {
        if (storedPreferences) setPreferences(storedPreferences);
        setHistory(storedHistory);
      })
      .finally(() => setHydrated(true));
  }, []);

  const decks = useMemo(() => getDecks(preferences.region), [preferences.region]);

  const changePreferences = (changes: Partial<Preferences>) => {
    setPreferences((current) => {
      const next = { ...current, ...changes };
      void savePreferences(next);
      return next;
    });
  };

  const finishGame = (result: RoundResult) => {
    setScreen({ name: 'results', result });
    void saveRound(result).then(setHistory);
  };

  if (!hydrated) {
    return (
      <View style={styles.loading}>
        <StatusBar style="dark" />
        <View style={styles.loadingMark}><Text style={styles.loadingEmoji}>🎭</Text></View>
        <Text style={styles.loadingTitle}>Las Charadas</Text>
      </View>
    );
  }

  if (!preferences.hasCompletedOnboarding) {
    return (
      <>
        <StatusBar style="dark" />
        <OnboardingScreen
          detectedRegion={preferences.region}
          onComplete={(region) => changePreferences({ region, hasCompletedOnboarding: true })}
        />
      </>
    );
  }

  if (screen.name === 'settings') {
    return <><StatusBar style="dark" /><SettingsScreen preferences={preferences} onBack={() => setScreen({ name: 'home' })} onChange={changePreferences} /></>;
  }
  if (screen.name === 'setup') {
    return <><StatusBar style="dark" /><RoundSetupScreen deck={screen.deck} onBack={() => setScreen({ name: 'home' })} onContinue={(config) => setScreen({ name: 'tutorial', config })} /></>;
  }
  if (screen.name === 'tutorial') {
    return <><StatusBar style="dark" /><TutorialScreen config={screen.config} onBack={() => setScreen({ name: 'setup', deck: screen.config.deck })} onStart={() => setScreen({ name: 'game', config: screen.config })} /></>;
  }
  if (screen.name === 'game') {
    return <GameScreen config={screen.config} preferences={preferences} onFinish={finishGame} />;
  }
  if (screen.name === 'results') {
    return (
      <>
        <StatusBar style="dark" />
        <ResultsScreen
          result={screen.result}
          onHome={() => setScreen({ name: 'home' })}
          onPlayAgain={() => setScreen({ name: 'setup', deck: screen.result.deck })}
        />
      </>
    );
  }

  return (
    <>
      <StatusBar style="dark" />
      <HomeScreen
        decks={decks}
        lastRound={history[0]}
        onOpenSettings={() => setScreen({ name: 'settings' })}
        onSelectDeck={(deck) => setScreen({ name: 'setup', deck })}
        regionCode={preferences.region}
      />
    </>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.paper },
  loadingMark: { width: 72, height: 72, borderRadius: 23, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.ink },
  loadingEmoji: { fontSize: 37 },
  loadingTitle: { fontSize: 22, fontWeight: '900', color: colors.ink, marginTop: 14, letterSpacing: -0.4 },
});
