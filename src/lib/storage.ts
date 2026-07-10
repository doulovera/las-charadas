import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Preferences, RoundResult } from '../types';

const PREFERENCES_KEY = '@las-charadas/preferences/v1';
const HISTORY_KEY = '@las-charadas/history/v1';

export async function loadPreferences(): Promise<Preferences | null> {
  const raw = await AsyncStorage.getItem(PREFERENCES_KEY);
  return raw ? (JSON.parse(raw) as Preferences) : null;
}

export async function savePreferences(preferences: Preferences) {
  await AsyncStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
}

export async function loadHistory(): Promise<RoundResult[]> {
  const raw = await AsyncStorage.getItem(HISTORY_KEY);
  return raw ? (JSON.parse(raw) as RoundResult[]) : [];
}

export async function saveRound(result: RoundResult): Promise<RoundResult[]> {
  const history = await loadHistory();
  const nextHistory = [result, ...history].slice(0, 20);
  await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(nextHistory));
  return nextHistory;
}
