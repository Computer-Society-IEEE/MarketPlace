import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useBottomNavInset } from '@/components/ui/BottomNav';
import { Card } from '@/components/ui/Card';
import { FilterChip } from '@/components/ui/FilterChip';
import { Palette, Spacing, Type } from '@/constants/theme';
import { EncabezadoAdmin } from '@/features/admin/components/EncabezadoAdmin';
import { GraficaSemanal } from '@/features/admin/components/GraficaSemanal';
import { TarjetaMetrica } from '@/features/admin/components/TarjetaMetrica';
import { INDICADORES, PEDIDOS_SEMANA, PERIODOS, Periodo } from '@/features/admin/services/metricas';

/** Tablero de métricas del administrador: indicadores del periodo y pedidos por semana. */
export default function PanelAdmin() {
  const navInset = useBottomNavInset();
  const [periodo, setPeriodo] = useState<Periodo>('Septiembre');
  const total = PEDIDOS_SEMANA.reduce((suma, x) => suma + x.pedidos, 0);

  return (
    <ScrollView style={s.pantalla} contentContainerStyle={{ paddingBottom: navInset }} showsVerticalScrollIndicator={false}>
      <EncabezadoAdmin title="Métricas" />
      <View style={s.contenido}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.filtros}>
          {PERIODOS.map((p) => (
            <FilterChip key={p} label={p} selected={p === periodo} onPress={() => setPeriodo(p)} />
          ))}
        </ScrollView>

        <View style={s.rejilla}>
          {INDICADORES.map((i) => (
            <TarjetaMetrica key={i.etiqueta} valor={i.valor} etiqueta={i.etiqueta} />
          ))}
        </View>

        <Card style={s.grafica}>
          <Text accessibilityRole="header" style={s.subtitulo}>Pedidos por semana</Text>
          <Text style={s.total}>{`Total del mes: ${total} pedidos.`}</Text>
          <GraficaSemanal semanas={PEDIDOS_SEMANA} />
        </Card>

        <Text style={s.nota}>
          Cifras de ejemplo para el prototipo. Los indicadores reales salen de los eventos por etapa definidos en la estrategia.
        </Text>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: Palette.ground },
  contenido: { padding: Spacing[5], gap: Spacing[4] },
  filtros: { gap: Spacing[2] },
  rejilla: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing[3] },
  grafica: { gap: Spacing[3] },
  subtitulo: { ...Type.title3, color: Palette.ink },
  total: { ...Type.caption, color: Palette.textMuted },
  nota: { ...Type.caption, color: Palette.textMuted },
});
