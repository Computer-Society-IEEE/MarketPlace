import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Palette, Radius, Spacing, Type } from '@/constants/theme';

type Props = {
  texto: string;
  /** Centrado y en cursiva: para textos de marcador o de relleno. */
  centrado?: boolean;
};

/** Recuadro gris con un texto descriptivo. Lo usan el detalle de producto y el historial. */
function DescripcionBoxBase({ texto, centrado = false }: Props) {
  return (
    <View style={[s.caja, centrado && s.cajaCentrada]}>
      <Text style={[s.texto, centrado && s.textoCentrado]}>{texto}</Text>
    </View>
  );
}

export const DescripcionBox = memo(DescripcionBoxBase);

const s = StyleSheet.create({
  caja: {
    backgroundColor: Palette.neutral100,
    borderRadius: Radius.sm,
    padding: Spacing[4],
    minHeight: 60,
    justifyContent: 'center',
  },
  cajaCentrada: { alignItems: 'center' },
  texto: { ...Type.bodySm, color: Palette.textMuted },
  textoCentrado: { fontStyle: 'italic', textAlign: 'center' },
});
