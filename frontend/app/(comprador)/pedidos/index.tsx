import { useCallback } from 'react';
import { FlatList, ListRenderItem, StyleSheet, View } from 'react-native';
import { useBottomNavInset } from '@/components/ui/BottomNav';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Palette, Spacing } from '@/constants/theme';
import { CompraHistorial, HISTORIAL } from '@/features/pedidos/historial';
import { HistorialCard } from '@/features/pedidos/HistorialCard';

const keyExtractor = (c: CompraHistorial) => c.id;
const Separador = () => <View style={s.separador} />;

export default function Historial() {
  const navInset = useBottomNavInset();

  const quitar = useCallback((id: string) => {
    // TODO: quitar la compra del historial (id)
  }, []);

  const renderItem: ListRenderItem<CompraHistorial> = useCallback(
    ({ item }) => <HistorialCard compra={item} onQuitar={quitar} />,
    [quitar]
  );

  return (
    <FlatList
      style={s.pantalla}
      contentContainerStyle={{ paddingBottom: navInset }}
      data={HISTORIAL}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      ItemSeparatorComponent={Separador}
      ListHeaderComponent={encabezado}
    />
  );
}

const s = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: Palette.ground },
  encabezado: { paddingBottom: Spacing[2] },
  separador: { height: Spacing[4] },
});

// Va después de los estilos porque los usa al crearse
const encabezado = (
  <View style={s.encabezado}>
    <ScreenHeader title="Historial" />
  </View>
);
