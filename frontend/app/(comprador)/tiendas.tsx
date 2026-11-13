import { useCallback, useMemo } from 'react';
import { FlatList, ListRenderItem, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Palette, Spacing, Type } from '@/constants/theme';
import { useBottomNavInset } from '@/components/ui/BottomNav';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { SedeCard } from '@/features/sedes/SedeCard';
import { SEDES, SEDE_DEL_USUARIO, Sede } from '@/features/sedes/sedes';

const keyExtractor = (sede: Sede) => sede.id;
const Separador = () => <View style={s.separador} />;

export default function SelectorSede() {
  const navInset = useBottomNavInset();

  const elegirSede = useCallback((id: string) => {
    // TODO: guardar la sede elegida (id) antes de navegar
    router.navigate('/inicio' as any);
  }, []);

  const buscarSede = useCallback(() => {
    // TODO: abrir la búsqueda de sedes
  }, []);

  const renderItem: ListRenderItem<Sede> = useCallback(
    ({ item }) => (
      <SedeCard
        sede={item}
        esTuSede={item.id === SEDE_DEL_USUARIO}
        onPress={elegirSede}
        style={s.item}
      />
    ),
    [elegirSede]
  );

  const encabezado = useMemo(
    () => (
      <View style={s.encabezado}>
        <ScreenHeader
          title="Tiendas físicas"
          right={{ icon: 'search', label: 'Buscar una sede', onPress: buscarSede }}
        />
        <Text style={s.subtitulo}>Elige una sede para ver sus tiendas.</Text>
      </View>
    ),
    [buscarSede]
  );

  return (
    <FlatList
      style={s.pantalla}
      contentContainerStyle={{ paddingBottom: navInset }}
      data={SEDES}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      ItemSeparatorComponent={Separador}
      ListHeaderComponent={encabezado}
      showsVerticalScrollIndicator={false}
    />
  );
}

const s = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: Palette.ground },
  encabezado: { gap: Spacing[2], marginBottom: Spacing[4] },
  subtitulo: {
    ...Type.body,
    color: Palette.textMuted,
    textAlign: 'center',
    marginHorizontal: Spacing[5],
  },
  item: { marginHorizontal: Spacing[5] },
  separador: { height: Spacing[3] },
});
