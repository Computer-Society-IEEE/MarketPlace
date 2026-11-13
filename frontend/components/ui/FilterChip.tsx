import { ComponentProps, memo } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Palette, Radius, Type } from '@/constants/theme';

type Props = {
  label: string;
  selected?: boolean;
  onPress: () => void;
  icon?: ComponentProps<typeof Ionicons>['name'];
};

/**
 * Chip de filtro presionable. Seleccionado: tinta con texto lima (11:1). Sin seleccionar: borde de
 * chip del sistema (3,4:1 sobre el fondo). Mide 40 px y suma 4 px de zona táctil por lado (48 px).
 */
function FilterChipBase({ label, selected = false, onPress, icon }: Props) {
  const color = selected ? Palette.lima : Palette.ink;
  return (
    <Pressable
      onPress={onPress}
      hitSlop={4}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={label}
      style={[s.chip, selected ? s.on : s.off]}
    >
      {icon ? <Ionicons name={icon} size={16} color={color} /> : null}
      <Text style={[s.texto, { color }]} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

export const FilterChip = memo(FilterChipBase);

const s = StyleSheet.create({
  chip: {
    height: 40,
    paddingHorizontal: 16,
    borderRadius: Radius.full,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1.5,
  },
  on: { backgroundColor: Palette.ink, borderColor: Palette.ink },
  off: { backgroundColor: 'transparent', borderColor: Palette.border },
  texto: { ...Type.bodySm, fontFamily: 'DMSans_700Bold' },
});
