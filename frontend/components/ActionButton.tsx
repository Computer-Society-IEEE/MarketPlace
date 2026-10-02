import { Text, TouchableOpacity, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BRAND, SPACING, RADIUS, TEXT } from '../constants/plantilla';

const SIZES = {
  sm: { icon: 20, font: 13, padding: SPACING.sm },
  md: { icon: 28, font: 16, padding: SPACING.md },
  lg: { icon: 36, font: 18, padding: SPACING.lg },
};

type Props = {
  label: string;
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap | null;
  variant?: 'light' | 'main';    // rojo claro o rojo principal
  layout?: 'row' | 'column';     // ícono al lado o encima del texto
  size?: 'sm' | 'md' | 'lg';     // tamaño interno (ícono, letra, relleno)
  style?: StyleProp<ViewStyle>;  // aquí el contenedor decide ancho/alto
};

export function ActionButton({
  label,
  onPress,
  icon,
  variant = 'light',
  layout = 'row',
  size = 'md',
  style,
}: Props) {
  const t = SIZES[size];

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        s.base,
        {
          backgroundColor: variant === 'light' ? BRAND.light : BRAND.main,
          flexDirection: layout,
          padding: t.padding,
          justifyContent: layout === 'row' ? 'flex-start' : 'center',
        },
        style,
      ]}
    >
      {icon && <Ionicons name={icon} size={t.icon} color={TEXT.onBrand} />}
      <Text style={[s.texto, { fontSize: t.font }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  base: {
    alignItems: 'center',
    gap: SPACING.md,
    borderRadius: RADIUS.md,
  },
  texto: {
    color: TEXT.onBrand,
    fontWeight: '600',
    textAlign: 'center',
  },
});