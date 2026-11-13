import { ComponentProps, memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Palette, Radius, Type } from '@/constants/theme';

// Cada par de colores cumple AA: tinta sobre lima 100 (13:1) y lima sobre tinta (11:1)
const TONOS = {
  claro: { bg: Palette.lima100, fg: Palette.ink },
  oscuro: { bg: Palette.ink, fg: Palette.lima },
};

type Props = {
  label: string;
  tone?: keyof typeof TONOS;
  icon?: ComponentProps<typeof Ionicons>['name'];
};

/** Etiqueta informativa (no presionable) de 28 px: "12 tiendas", "Tu sede". */
function ChipBase({ label, tone = 'claro', icon }: Props) {
  const t = TONOS[tone];

  return (
    <View style={[s.chip, { backgroundColor: t.bg }]}>
      {icon && <Ionicons name={icon} size={14} color={t.fg} />}
      <Text style={[s.texto, { color: t.fg }]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

export const Chip = memo(ChipBase);

const s = StyleSheet.create({
  chip: {
    height: 28,
    paddingHorizontal: 10,
    borderRadius: Radius.full,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
  },
  texto: { ...Type.label },
});
