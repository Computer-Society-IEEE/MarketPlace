import { Text, TouchableOpacity, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Palette, Radius, Spacing, Type, TouchMin } from '@/constants/theme';

const SIZES = {
  sm: { icon: 20, font: 13, padding: Spacing[4] },
  md: { icon: 28, font: 16, padding: Spacing[5] },
  lg: { icon: 36, font: 18, padding: Spacing[6] },
};

const VARIANTS = {
  primary: { bg: Palette.lima, fg: Palette.ink },  // lima con texto tinta (11,2:1)
  dark: { bg: Palette.ink, fg: Palette.card },    // tinta con texto beige claro (14,7:1)
};

type Props = {
  label: string;
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap | null;
  variant?: keyof typeof VARIANTS;    // rojo claro o rojo principal
  layout?: 'row' | 'column';     // ícono al lado o encima del texto
  size?: keyof typeof SIZES;     // tamaño interno (ícono, letra, relleno)
  style?: StyleProp<ViewStyle>;  // aquí el contenedor decide ancho/alto
};

export function ActionButton({
  label,
  onPress,
  icon,
  variant = 'primary',
  layout = 'row',
  size = 'md',
  style,
}: Props) {
  const t = SIZES[size];
  const v = VARIANTS[variant];

  return (
    <TouchableOpacity
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={[
        s.base,
        {
          backgroundColor: v.bg,
          flexDirection: layout,
          padding: t.padding,
          justifyContent: layout === 'row' ? 'flex-start' : 'center',
          borderRadius: layout === 'row' ? Radius.full : Radius.lg,
        },
        style,
      ]}
    >
      {icon && <Ionicons name={icon} size={t.icon} color={v.fg} />}
      <Text style={[s.texto, { fontSize: t.font, color: v.fg }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  base: {
    alignItems: 'center',
    gap: Spacing[3],
    minHeight: TouchMin,
  },
  texto: {
    fontFamily: Type.label.fontFamily,
    textAlign: 'center',
  },
});