import { memo } from 'react';
import { Text, TouchableOpacity, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Palette, Radius, Spacing, Type, TouchMin } from '@/constants/theme';

const SIZES = {
  sm: { icon: 20, font: 13, padding: Spacing[4] },
  md: { icon: 28, font: 16, padding: Spacing[5] },
  lg: { icon: 36, font: 18, padding: Spacing[6] },
  cta: { icon: 20, font: 16, padding: Spacing[4] }, // botón principal de formulario: 56 px de alto
};

const VARIANTS = {
  primary: { bg: Palette.lima, fg: Palette.ink },  // lima con texto tinta (11,2:1)
  dark: { bg: Palette.ink, fg: Palette.card },     // tinta con texto blanco (15:1)
};

// El diseño pinta el botón deshabilitado en gris, no solo con menos opacidad
const DISABLED = { bg: Palette.line, fg: Palette.textMuted };

type Props = {
  label: string;
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap | null;
  iconPosition?: 'left' | 'right'; // lado del ícono (solo con layout="row")
  variant?: keyof typeof VARIANTS;
  layout?: 'row' | 'column';       // ícono al lado o encima del texto
  size?: keyof typeof SIZES;       // tamaño interno (ícono, letra, relleno)
  align?: 'start' | 'center';      // contenido pegado a la izquierda o centrado
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;    // aquí el contenedor decide ancho/alto
};

function ActionButtonBase({
  label,
  onPress,
  icon,
  iconPosition = 'left',
  variant = 'primary',
  layout = 'row',
  size = 'md',
  align = 'start',
  disabled = false,
  style,
}: Props) {
  const t = SIZES[size];
  const v = disabled ? DISABLED : VARIANTS[variant];
  const centrado = align === 'center' || layout === 'column';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      style={[
        s.base,
        {
          backgroundColor: v.bg,
          flexDirection: layout === 'row' && iconPosition === 'right' ? 'row-reverse' : layout,
          padding: t.padding,
          justifyContent: centrado ? 'center' : 'flex-start',
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

// memo: los botones reciben props estables y no deben repintarse al escribir en un campo
export const ActionButton = memo(ActionButtonBase);

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
