import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { REGIONS } from '../data/regions';
import { colors, radii, spacing, typography } from '../theme';
import type { RegionCode } from '../types';

export function RegionPicker({
  visible,
  selected,
  onSelect,
  onClose,
}: {
  visible: boolean;
  selected: RegionCode;
  onSelect: (region: RegionCode) => void;
  onClose: () => void;
}) {
  const insets = useSafeAreaInsets();
  return (
    <Modal animationType="slide" presentationStyle="pageSheet" visible={visible} onRequestClose={onClose}>
      <View style={[styles.page, { paddingBottom: insets.bottom + spacing.lg }]}>
        <View style={styles.handle} />
        <View style={styles.titleRow}>
          <View>
            <Text style={styles.title}>Elige tu español</Text>
            <Text style={styles.subtitle}>Puedes cambiarlo cuando quieras.</Text>
          </View>
          <Pressable accessibilityRole="button" accessibilityLabel="Cerrar" hitSlop={10} onPress={onClose} style={styles.close}>
            <Text style={styles.closeText}>×</Text>
          </Pressable>
        </View>
        <View style={styles.list}>
          {REGIONS.map((region) => {
            const isSelected = selected === region.code;
            return (
              <Pressable
                key={region.code}
                accessibilityRole="radio"
                accessibilityState={{ checked: isSelected }}
                onPress={() => onSelect(region.code)}
                style={({ pressed }) => [styles.row, pressed && styles.pressed]}
              >
                <Text style={styles.flag}>{region.flag}</Text>
                <Text style={styles.name}>{region.name}</Text>
                <View style={[styles.radio, isSelected && styles.radioSelected]}>
                  {isSelected ? <View style={styles.radioDot} /> : null}
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.paper, paddingHorizontal: spacing.xl },
  handle: { width: 40, height: 5, borderRadius: 3, backgroundColor: colors.line, alignSelf: 'center', marginTop: spacing.sm, marginBottom: spacing.xl },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.xl },
  title: { ...typography.title, color: colors.ink },
  subtitle: { ...typography.body, color: colors.muted, marginTop: spacing.xs },
  close: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: radii.pill, backgroundColor: colors.card },
  closeText: { fontSize: 30, lineHeight: 32, color: colors.ink, marginTop: -3 },
  list: { overflow: 'hidden', borderRadius: radii.lg, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line },
  row: { minHeight: 64, paddingHorizontal: spacing.lg, flexDirection: 'row', alignItems: 'center', borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line },
  pressed: { opacity: 0.68 },
  flag: { fontSize: 28, marginRight: spacing.md },
  name: { ...typography.body, color: colors.ink, fontWeight: '700', flex: 1 },
  radio: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },
  radioSelected: { borderColor: colors.coral },
  radioDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.coral },
});
