import { useCallback, useMemo, useState } from 'react';
import { Alert, SectionList, SectionListRenderItem, StyleSheet, Text, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { useBottomNavInset } from '@/components/ui/BottomNav';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { FilterChip } from '@/components/ui/FilterChip';
import { Palette, Spacing, Type } from '@/constants/theme';
import { PEDIDOS, Pedido, enCurso, porCalificar } from '@/features/pedidos/services/historial';
import { PedidoCard } from '@/features/pedidos/components/PedidoCard';

type Filtro = 'todo' | 'calificar' | 'curso';

const keyExtractor = (p: Pedido) => p.id;
const Separador = () => <View style={s.separador} />;

export default function MisPedidos() {
  const navInset = useBottomNavInset();
  const [filtro, setFiltro] = useState<Filtro>('todo');
  // Al volver de calificar, el pedido ya no está "por calificar": se recalcula al enfocar
  const [version, setVersion] = useState(0);
  useFocusEffect(useCallback(() => setVersion((v) => v + 1), []));

  const pendientes = useMemo(() => PEDIDOS.filter(porCalificar).length, [version]);

  const secciones = useMemo(() => {
    const visibles = PEDIDOS.filter((p) =>
      filtro === 'curso' ? enCurso(p) : filtro === 'calificar' ? porCalificar(p) : true
    );
    return [
      { title: 'En curso', data: visibles.filter(enCurso) },
      { title: 'Anteriores', data: visibles.filter((p) => !enCurso(p)) },
    ].filter((sec) => sec.data.length > 0);
  }, [filtro, version]);

  const verSeguimiento = useCallback((id: string) => {
    router.push({ pathname: '/pedidos/[id]' as any, params: { id } });
  }, []);
  const repetir = useCallback((productoId: string) => {
    router.push({ pathname: '/producto/[id]', params: { id: productoId } });
  }, []);
  const calificar = useCallback((id: string) => {
    router.push({ pathname: '/pedidos/[id]/calificar' as any, params: { id } });
  }, []);
  const avisar = useCallback((productoId: string) => {
    // TODO: guardar el aviso de disponibilidad (productoId) en la cuenta
    Alert.alert('Listo', 'Te avisaremos cuando este producto vuelva a estar disponible.');
  }, []);

  const renderItem: SectionListRenderItem<Pedido> = useCallback(
    ({ item }) => (
      <View style={s.celda}>
        <PedidoCard
          pedido={item}
          onSeguimiento={verSeguimiento}
          onRepetir={repetir}
          onCalificar={calificar}
          onAvisar={avisar}
        />
      </View>
    ),
    [verSeguimiento, repetir, calificar, avisar]
  );

  const encabezado = (
    <View>
      <ScreenHeader title="Mis pedidos" />
      <View style={s.chips}>
        <FilterChip label="Todos" selected={filtro === 'todo'} onPress={() => setFiltro('todo')} />
        <FilterChip
          label={`Por calificar · ${pendientes}`}
          selected={filtro === 'calificar'}
          onPress={() => setFiltro('calificar')}
        />
        <FilterChip label="En curso" selected={filtro === 'curso'} onPress={() => setFiltro('curso')} />
      </View>
    </View>
  );

  return (
    <SectionList
      style={s.pantalla}
      contentContainerStyle={{ paddingBottom: navInset }}
      sections={secciones}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      renderSectionHeader={({ section }) => <Text style={s.seccion}>{section.title}</Text>}
      ItemSeparatorComponent={Separador}
      ListHeaderComponent={encabezado}
      ListEmptyComponent={<Text style={s.vacio}>No tienes pedidos en esta lista.</Text>}
      stickySectionHeadersEnabled={false}
      showsVerticalScrollIndicator={false}
    />
  );
}

const s = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: Palette.ground },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing[2], paddingHorizontal: Spacing[5], marginTop: Spacing[4] },
  seccion: { ...Type.title3, color: Palette.ink, paddingHorizontal: Spacing[5], marginTop: Spacing[5], marginBottom: Spacing[3] },
  celda: { paddingHorizontal: Spacing[5] },
  separador: { height: Spacing[3] },
  vacio: { ...Type.body, color: Palette.textMuted, textAlign: 'center', marginTop: Spacing[8] },
});
