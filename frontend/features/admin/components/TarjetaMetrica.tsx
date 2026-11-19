import { StyleSheet, Text, View } from 'react-native';
import { Palette, Radius, Spacing, Type } from '@/constants/theme';

type Props = { valor: string; etiqueta: string };

/** Indicador del tablero: cifra grande y su descripción. */
export function TarjetaMetrica({ valor, etiqueta }: Props) {
  return (
    <View accessible accessibilityLabel={`${etiqueta}: ${valor}`} style={s.tarjeta}>
      <Text style={s.valor} numberOfLines={1} adjustsFontSizeToFit>{valor}</Text>
      <Text style={s.etiqueta}>{etiqueta}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  tarjeta: { flexBasis: '48%', flexGrow: 1, backgroundColor: Palette.card, borderRadius: Radius.lg, padding: Spacing[4], gap: Spacing[1] },
  valor: { ...Type.priceLg, color: Palette.ink },
  etiqueta: { ...Type.caption, color: Palette.textMuted },
});
