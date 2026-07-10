import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';

import { RegionPicker } from '../components/RegionPicker';
import { Page, ScreenHeader } from '../components/Screen';
import { getRegion } from '../data/regions';
import { colors, radii, spacing, typography } from '../theme';
import type { Preferences, RegionCode } from '../types';

export function SettingsScreen({
  preferences,
  onBack,
  onChange,
}: {
  preferences: Preferences;
  onBack: () => void;
  onChange: (changes: Partial<Preferences>) => void;
}) {
  const [pickerVisible, setPickerVisible] = useState(false);
  const region = getRegion(preferences.region);

  const selectRegion = (code: RegionCode) => {
    onChange({ region: code });
    setPickerVisible(false);
  };

  return (
    <Page>
      <ScreenHeader title="Ajustes" onBack={onBack} />
      <Text style={styles.sectionLabel}>TU ESPAÑOL</Text>
      <View style={styles.group}>
        <Pressable
          accessibilityRole="button"
          onPress={() => setPickerVisible(true)}
          style={({ pressed }) => [styles.row, pressed && styles.pressed]}
        >
          <View style={styles.flagBox}><Text style={styles.flag}>{region.flag}</Text></View>
          <View style={styles.copy}>
            <Text style={styles.rowTitle}>Región</Text>
            <Text style={styles.rowValue}>{region.name}</Text>
          </View>
          <Ionicons color={colors.muted} name="chevron-forward" size={19} />
        </Pressable>
      </View>
      <Text style={styles.footnote}>Cambia las palabras de las tarjetas, no el idioma de la interfaz.</Text>

      <Text style={styles.sectionLabel}>DURANTE LA RONDA</Text>
      <View style={styles.group}>
        <View style={styles.row}>
          <View style={[styles.settingIcon, { backgroundColor: colors.yellowSoft }]}><Ionicons color="#8A5B00" name="volume-high" size={21} /></View>
          <Text style={styles.toggleLabel}>Sonidos</Text>
          <Switch
            accessibilityLabel="Sonidos"
            onValueChange={(value) => onChange({ soundEnabled: value })}
            trackColor={{ false: '#C7C1B7', true: colors.green }}
            value={preferences.soundEnabled}
          />
        </View>
        <View style={styles.divider} />
        <View style={styles.row}>
          <View style={[styles.settingIcon, { backgroundColor: colors.coralSoft }]}><Ionicons color={colors.coralDark} name="phone-portrait-outline" size={21} /></View>
          <Text style={styles.toggleLabel}>Vibración</Text>
          <Switch
            accessibilityLabel="Vibración"
            onValueChange={(value) => onChange({ hapticsEnabled: value })}
            trackColor={{ false: '#C7C1B7', true: colors.green }}
            value={preferences.hapticsEnabled}
          />
        </View>
      </View>

      <View style={styles.about}>
        <View style={styles.aboutMark}><Text style={styles.aboutEmoji}>🎭</Text></View>
        <Text style={styles.aboutTitle}>Las Charadas</Text>
        <Text style={styles.aboutText}>Hecho para jugar cara a cara, con palabras que sí usarías.</Text>
        <Text style={styles.version}>Versión 1.0 · Todo queda en este iPhone</Text>
      </View>

      <RegionPicker visible={pickerVisible} selected={preferences.region} onSelect={selectRegion} onClose={() => setPickerVisible(false)} />
    </Page>
  );
}

const styles = StyleSheet.create({
  sectionLabel: { fontSize: 11, lineHeight: 14, fontWeight: '900', letterSpacing: 1.2, color: colors.muted, marginLeft: spacing.sm, marginBottom: spacing.sm, marginTop: spacing.lg },
  group: { overflow: 'hidden', backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line, borderRadius: radii.lg },
  row: { minHeight: 70, flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.lg },
  pressed: { opacity: 0.6 },
  flagBox: { width: 42, height: 42, borderRadius: 13, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.paper, marginRight: spacing.md },
  flag: { fontSize: 25 },
  copy: { flex: 1 },
  rowTitle: { ...typography.callout, color: colors.ink },
  rowValue: { ...typography.caption, color: colors.muted, marginTop: 1 },
  footnote: { ...typography.caption, color: colors.muted, marginHorizontal: spacing.sm, marginTop: spacing.sm, marginBottom: spacing.xxl },
  settingIcon: { width: 38, height: 38, borderRadius: 11, alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
  toggleLabel: { ...typography.body, color: colors.ink, fontWeight: '700', flex: 1 },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: colors.line, marginLeft: 70 },
  about: { alignItems: 'center', marginTop: spacing.xxxl, paddingHorizontal: spacing.xxl },
  aboutMark: { width: 58, height: 58, borderRadius: 18, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md },
  aboutEmoji: { fontSize: 30 },
  aboutTitle: { ...typography.heading, color: colors.ink },
  aboutText: { ...typography.callout, color: colors.muted, textAlign: 'center', marginTop: spacing.sm },
  version: { ...typography.caption, color: '#999287', textAlign: 'center', marginTop: spacing.lg },
});
