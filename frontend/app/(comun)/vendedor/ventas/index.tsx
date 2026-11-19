import { useMemo } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontFamily, Palette, Radius, Spacing, Type } from '@/constants/theme';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { formatoPrecio } from '@/utils/formato';
import { VentaCard } from '@/features/pedidos/components/VentaCard';
import {
  ANIO_ACTUAL,
  MES_ACTUAL,
  PEDIDOS_VENTA,
  VENTAS_CANCELADAS,
  VENTAS_MESES_ANTERIORES,
  confirmarEntrega,
  sumaEntregados,
  usePedidosVenta,
} from '@/features/pedidos/store/pedidosVenta';

const ALTO_BARRA = 96;

const escribir = (chatId: string) => router.push({ pathname: '/mensajes/[id]' as any, params: { id: chatId } });

const confirmar = (id: string) => {
  const p = PEDIDOS_VENTA.get().find((x) => x.id === id);
  if (!p) return;
  Alert.alert('¿Entregaste el pedido?', `${p.titulo} a ${p.comprador}. El comprador recibe un aviso para calificarte.`, [
    { text: 'Todavía no', style: 'cancel' },
    { text: 'Sí, entregado', onPress: () => confirmarEntrega(id) },
  ]);
};

/** Ventas del vendedor: total del trimestre, ventas por mes y pedidos del mes con su estado. */
export default function Ventas() {
  const insets = useSafeAreaInsets();
  const pedidos = usePedidosVenta();

  const resumen = useMemo(() => {
    const mesActual = sumaEntregados(pedidos);
    const meses = [...VENTAS_MESES_ANTERIORES, { mes: MES_ACTUAL, total: mesActual }];
    const trimestre = meses.reduce((a, m) => a + m.total, 0);
    const mayor = meses.reduce((a, m) => (m.total > a.total ? m : a), meses[0]);
    const entregados = pedidos.filter((p) => p.entregado).length;
    return { mesActual, meses, trimestre, mayor, entregados, maximo: Math.max(...meses.map((m) => m.total), 1) };
  }, [pedidos]);

  const pendientes = pedidos.filter((p) => !p.entregado);
  const entregados = pedidos.filter((p) => p.entregado);

  return (
    <View style={s.pantalla}>
      <ScreenHeader title="Ventas" />
      <ScrollView contentContainerStyle={[s.contenido, { paddingBottom: insets.bottom + Spacing[6] }]} showsVerticalScrollIndicator={false}>
        <View style={s.chipFila}>
          <Chip label="Modo vendedor" icon="storefront-outline" tone="oscuro" />
        </View>

        <View style={s.totales}>
          <View style={[s.total, s.totalLima]}>
            <Text style={s.totalEtiqueta}>Últimos 3 meses</Text>
            <Text style={s.totalValor}>{formatoPrecio(resumen.trimestre)}</Text>
            <Text style={s.totalDetalle}>{`${resumen.entregados} pedidos entregados este mes`}</Text>
          </View>
          <View style={[s.total, s.totalCard]}>
            <Text style={s.totalEtiqueta}>{`Ventas de ${MES_ACTUAL.toLowerCase()}`}</Text>
            <Text style={s.totalValor}>{formatoPrecio(resumen.mesActual)}</Text>
            <Text style={s.totalDetalle}>{`${resumen.entregados} entregado${resumen.entregados === 1 ? '' : 's'} · ${VENTAS_CANCELADAS.length} cancelado${VENTAS_CANCELADAS.length === 1 ? '' : 's'}`}</Text>
          </View>
        </View>

        <Card style={s.grafica}>
          <Text style={s.bloqueTitulo}>Ventas por mes</Text>
          <Text style={s.bloqueDetalle}>{`Total del trimestre: ${formatoPrecio(resumen.trimestre)}. El mejor mes fue ${resumen.mayor.mes.toLowerCase()}.`}</Text>
          <View style={s.barras}>
            {resumen.meses.map((m) => (
              <View key={m.mes} style={s.barraColumna} accessible accessibilityLabel={`${m.mes}: ${formatoPrecio(m.total)}`}>
                <Text style={s.barraValor}>{formatoPrecio(m.total)}</Text>
                <View style={[s.barra, { height: Math.max(6, (m.total / resumen.maximo) * ALTO_BARRA) }, m.mes === resumen.mayor.mes && s.barraMayor]} />
                <Text style={s.barraMes}>{m.mes}</Text>
              </View>
            ))}
          </View>
        </Card>

        <View style={s.lista}>
          <SectionHeader title={`Pedidos de ${MES_ACTUAL.toLowerCase()} ${ANIO_ACTUAL}`} />
          {pendientes.map((p) => (
            <VentaCard key={p.id} venta={p} estado="Por entregar" onConfirmar={confirmar} onEscribir={escribir} />
          ))}
          {entregados.map((p) => (
            <VentaCard key={p.id} venta={p} estado="Entregado" onConfirmar={confirmar} onEscribir={escribir} />
          ))}
          {VENTAS_CANCELADAS.map((p) => (
            <VentaCard key={p.id} venta={p} estado="Cancelado" onConfirmar={confirmar} onEscribir={escribir} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: Palette.ground },
  contenido: { paddingHorizontal: Spacing[5], paddingTop: Spacing[4], gap: Spacing[4] },
  chipFila: { alignItems: 'flex-start' },
  totales: { flexDirection: 'row', gap: Spacing[3] },
  total: { flex: 1, borderRadius: Radius.lg, padding: Spacing[4], gap: 2, justifyContent: 'center' },
  totalLima: { backgroundColor: Palette.lima },
  totalCard: { backgroundColor: Palette.card },
  totalEtiqueta: { ...Type.caption, color: Palette.ink },
  totalValor: { ...Type.title2, color: Palette.ink },
  totalDetalle: { ...Type.caption, color: Palette.ink },
  grafica: { gap: Spacing[2] },
  bloqueTitulo: { ...Type.title3, color: Palette.ink },
  bloqueDetalle: { ...Type.caption, color: Palette.textMuted },
  barras: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-around', gap: Spacing[3], marginTop: Spacing[2] },
  barraColumna: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', gap: 6 },
  barra: { width: '60%', borderRadius: Radius.sm, backgroundColor: Palette.green600 },
  barraMayor: { backgroundColor: Palette.ink },
  barraValor: { ...Type.label, color: Palette.ink },
  barraMes: { ...Type.caption, fontFamily: FontFamily.bodyMedium, color: Palette.textMuted },
  lista: { gap: Spacing[3] },
});
