import { ComponentProps, memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FontFamily, Palette, Radius, Spacing, Type } from '@/constants/theme';

const TONOS = {
  error: { bg: Palette.dangerBg, fg: Palette.danger, icon: 'close-circle' },
  alerta: { bg: Palette.warningBg, fg: Palette.warning, icon: 'warning-outline' },
} as const;

type Props = {
  tono: keyof typeof TONOS;
  titulo: string;
  mensaje?: string;
  icon?: ComponentProps<typeof Ionicons>['name'];
};

/** Aviso dentro de una pantalla: borde y fondo del tono, ícono, título en tinta y mensaje corto. */
function AvisoBase({ tono, titulo, mensaje, icon }: Props) {
  const t = TONOS[tono];
  return (
    <View
      accessibilityRole={tono === 'error' ? 'alert' : undefined}
      accessibilityLiveRegion="polite"
      style={[s.aviso, { backgroundColor: t.bg, borderColor: t.fg }]}
    >
      <Ionicons name={icon ?? t.icon} size={22} color={t.fg} />
      <View style={s.textos}>
        <Text style={s.titulo}>{titulo}</Text>
        {mensaje ? <Text style={s.mensaje}>{mensaje}</Text> : null}
      </View>
    </View>
  );
}

export const Aviso = memo(AvisoBase);

const s = StyleSheet.create({
  aviso: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing[3],
    borderWidth: 1,
    borderRadius: Radius.md + 2,
    padding: 14,
  },
  textos: { flex: 1, minWidth: 0 },
  titulo: { ...Type.body, fontFamily: FontFamily.bodyBold, color: Palette.ink },
  mensaje: { ...Type.bodySm, color: Palette.ink, marginTop: 2 },
});
