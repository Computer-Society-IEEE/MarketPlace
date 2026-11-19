import { StyleSheet, Text, View } from 'react-native';
import { FontFamily, Palette, Radius, Spacing, Type } from '@/constants/theme';
import { Semana } from '../services/metricas';

const ALTO_BARRA = 120;

/** Barras verticales hechas con View: la más alta se resalta y el resto usa el tono de barras del sistema. */
export function GraficaSemanal({ semanas }: { semanas: Semana[] }) {
  const maximo = Math.max(...semanas.map((x) => x.pedidos), 1);
  const resumen = semanas.map((x) => `semana del ${x.rango}: ${x.pedidos} pedidos`).join(', ');
  return (
    <View accessible accessibilityLabel={`Pedidos por semana, ${resumen}`} style={s.fila}>
      {semanas.map((x) => {
        const mayor = x.pedidos === maximo;
        return (
          <View key={x.rango} style={s.columna}>
            <Text style={s.valor}>{x.pedidos}</Text>
            <View style={s.pista}>
              <View style={[s.barra, { height: Math.round((x.pedidos / maximo) * ALTO_BARRA), backgroundColor: mayor ? Palette.green700 : Palette.green600 }]} />
            </View>
            <Text style={s.rango}>{x.rango}</Text>
          </View>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  fila: { flexDirection: 'row', gap: Spacing[3], alignItems: 'flex-end' },
  columna: { flex: 1, alignItems: 'center', gap: Spacing[1] },
  pista: { height: ALTO_BARRA, width: '100%', justifyContent: 'flex-end' },
  barra: { width: '100%', borderTopLeftRadius: Radius.sm, borderTopRightRadius: Radius.sm },
  valor: { ...Type.bodySm, fontFamily: FontFamily.bodyBold, color: Palette.ink },
  rango: { ...Type.label, fontFamily: FontFamily.body, color: Palette.textMuted },
});
