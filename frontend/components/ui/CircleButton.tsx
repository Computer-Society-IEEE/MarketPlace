import { ComponentProps, memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Palette, Radius, TouchMin } from '@/constants/theme';

type Props = {
  icon: ComponentProps<typeof Ionicons>['name'];
  label: string; // lectura para lectores de pantalla (obligatoria: el botón no tiene texto)
  onPress: () => void;
  /** `blanco` sobre el fondo de pantalla; `translucido` sobre el encabezado lima. */
  tone?: 'blanco' | 'translucido';
  /** Punto de aviso (notificaciones sin leer). Pensado para el tono translúcido sobre lima. */
  punto?: boolean;
};

/** Círculo de 48 px con un ícono. Volver, buscar, menú, notificaciones. */
function CircleButtonBase({ icon, label, onPress, tone = 'blanco', punto = false }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [s.btn, tone === 'translucido' && s.translucido, pressed && s.presionado]}
    >
      <Ionicons name={icon} size={22} color={Palette.ink} />
      {punto && <View style={s.punto} />}
    </Pressable>
  );
}

export const CircleButton = memo(CircleButtonBase);

const s = StyleSheet.create({
  btn: {
    width: TouchMin,
    height: TouchMin,
    borderRadius: Radius.full,
    backgroundColor: Palette.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  translucido: { backgroundColor: 'rgba(255, 255, 255, 0.4)' },
  presionado: { opacity: 0.7 },
  punto: {
    position: 'absolute',
    top: 10,
    right: 11,
    width: 10,
    height: 10,
    borderRadius: Radius.full,
    backgroundColor: Palette.ink,
    borderWidth: 2,
    borderColor: Palette.lima,
  },
});
