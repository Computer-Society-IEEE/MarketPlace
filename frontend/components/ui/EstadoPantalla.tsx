import { ComponentProps, memo } from 'react';
import { Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ActionButton } from '@/components/ui/ActionButton';
import { FontFamily, Palette, Spacing, TouchMin, Type } from '@/constants/theme';

export type VarianteEstado = 'vacio' | 'error' | 'sinConexion' | 'loginRequerido';

export type AccionEstado = {
  label: string;
  onPress: () => void;
  icon?: ComponentProps<typeof Ionicons>['name'];
};

const VARIANTES: Record<
  VarianteEstado,
  { icon: ComponentProps<typeof Ionicons>['name']; bg: string; fg: string; titulo: string; mensaje: string }
> = {
  vacio: {
    icon: 'bag-handle-outline',
    bg: Palette.lima100,
    fg: Palette.ink,
    titulo: 'Aún no hay nada por aquí',
    mensaje: 'Cuando haya algo, lo verás en esta pantalla.',
  },
  error: {
    icon: 'alert-circle-outline',
    bg: Palette.dangerBg,
    fg: Palette.danger,
    titulo: 'No pudimos cargar los datos',
    mensaje: 'El problema es nuestro, no tuyo. Intenta de nuevo en unos segundos.',
  },
  sinConexion: {
    icon: 'cloud-offline-outline',
    bg: Palette.warningBg,
    fg: Palette.warning,
    titulo: 'Estás sin conexión',
    mensaje: 'Revisa tu wifi o tus datos. Tu carrito y tus pedidos quedan guardados en este teléfono.',
  },
  loginRequerido: {
    icon: 'lock-closed-outline',
    bg: Palette.lima100,
    fg: Palette.ink,
    titulo: 'Inicia sesión para ver el detalle',
    mensaje:
      'Explorar es libre. Para ver fotos, vendedor, reseñas y comprar necesitas tu correo institucional. Así todos en el marketplace son de la universidad.',
  },
};

type Props = {
  variante: VarianteEstado;
  /** Reemplaza el título de la variante. */
  titulo?: string;
  /** Reemplaza el mensaje de la variante. */
  mensaje?: string;
  /** La primera es el botón principal; las demás, enlaces subrayados. */
  acciones?: AccionEstado[];
  /** Código para soporte (solo error): "MUD-503". */
  referencia?: string;
  style?: StyleProp<ViewStyle>;
};

/**
 * Pantalla o bloque de estado: sin datos, error de carga, sin conexión o sesión requerida.
 * Ícono en círculo, título, mensaje y acciones. Se centra en el espacio que le deja la pantalla.
 */
function EstadoPantallaBase({ variante, titulo, mensaje, acciones = [], referencia, style }: Props) {
  const v = VARIANTES[variante];
  const [principal, ...enlaces] = acciones;

  return (
    <View
      accessibilityRole={variante === 'error' ? 'alert' : undefined}
      style={[s.contenedor, style]}
    >
      <View style={[s.circulo, { backgroundColor: v.bg }]} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        <Ionicons name={v.icon} size={44} color={v.fg} />
      </View>
      <Text accessibilityRole="header" style={s.titulo}>{titulo ?? v.titulo}</Text>
      <Text style={s.mensaje}>{mensaje ?? v.mensaje}</Text>
      {referencia ? <Text style={s.referencia}>{`Referencia para soporte: ${referencia}`}</Text> : null}

      {principal && (
        <ActionButton
          label={principal.label}
          icon={principal.icon}
          onPress={principal.onPress}
          size="cta"
          align="center"
          style={s.boton}
        />
      )}
      {enlaces.map((a) => (
        <Pressable key={a.label} accessibilityRole="link" onPress={a.onPress} style={s.areaToque}>
          <Text style={s.enlace}>{a.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

export const EstadoPantalla = memo(EstadoPantallaBase);

const s = StyleSheet.create({
  contenedor: { alignItems: 'center', paddingHorizontal: Spacing[6], paddingVertical: Spacing[8], gap: Spacing[3] },
  circulo: { width: 96, height: 96, borderRadius: 48, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing[2] },
  titulo: { ...Type.title2, color: Palette.ink, textAlign: 'center' },
  mensaje: { ...Type.body, color: Palette.textMuted, textAlign: 'center' },
  referencia: { ...Type.caption, color: Palette.textMuted, textAlign: 'center' },
  boton: { alignSelf: 'stretch', marginTop: Spacing[3] },
  areaToque: { minHeight: TouchMin, paddingHorizontal: Spacing[1], justifyContent: 'center' },
  enlace: {
    ...Type.body,
    fontFamily: FontFamily.bodyBold,
    color: Palette.ink,
    textDecorationLine: 'underline',
  },
});
