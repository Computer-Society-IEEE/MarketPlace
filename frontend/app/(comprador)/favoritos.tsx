import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, ListRenderItem, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useBottomNavInset } from '@/components/ui/BottomNav';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { ProductCard } from '@/features/productos/components/comprador/ProductCard';
import { FontFamily, Palette, Spacing, TouchMin, Type } from '@/constants/theme';
import { Oferta, aTarjeta } from '@/features/productos/services/ofertas';
import { useOfertas } from '@/features/productos/hooks/useOfertas';

// Ids guardados de ejemplo. Cuando existan los favoritos, salen de la cuenta.
const GUARDADOS = ['1', '5', '4', '9', '8', '3'];

type Orden = 'guardado' | 'precio';

const keyExtractor = (o: Oferta) => o.id;

export default function Favoritos() {
  const navInset = useBottomNavInset();
  const { data = [], isLoading } = useOfertas({});
  const [orden, setOrden] = useState<Orden>('guardado');

  const favoritos = useMemo(() => {
    const lista = GUARDADOS.map((id) => data.find((o) => o.id === id)).filter((o): o is Oferta => !!o);
    return orden === 'precio' ? [...lista].sort((a, b) => a.precio - b.precio) : lista;
  }, [data, orden]);

  const agotados = favoritos.filter((o) => (o.unidades ?? 1) === 0).length;

  const abrir = useCallback((id: string) => {
    router.push({ pathname: '/producto/[id]', params: { id } });
  }, []);

  const renderItem: ListRenderItem<Oferta> = useCallback(
    ({ item }) => (
      <View style={s.celda}>
        <ProductCard producto={aTarjeta(item)} onPress={abrir} />
      </View>
    ),
    [abrir]
  );

  const encabezado = (
    <View>
      <ScreenHeader title="Favoritos" />
      <View style={s.resumen}>
        <Text style={s.conteo}>
          {`${favoritos.length} guardados${agotados > 0 ? ` · ${agotados} agotado${agotados > 1 ? 's' : ''}` : ''}`}
        </Text>
        <Pressable
          onPress={() => setOrden((o) => (o === 'guardado' ? 'precio' : 'guardado'))}
          accessibilityRole="button"
          accessibilityLabel={`Ordenar, ahora por ${orden === 'guardado' ? 'fecha guardado' : 'precio'}`}
          style={s.ordenar}
        >
          <Ionicons name="swap-vertical" size={18} color={Palette.ink} />
          <Text style={s.ordenarTexto}>{orden === 'precio' ? 'Menor precio' : 'Ordenar'}</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <FlatList
      style={s.pantalla}
      contentContainerStyle={{ paddingBottom: navInset }}
      data={favoritos}
      numColumns={2}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      ListHeaderComponent={encabezado}
      ListEmptyComponent={
        isLoading ? (
          <ActivityIndicator style={s.estado} color={Palette.ink} accessibilityLabel="Cargando favoritos" />
        ) : (
          <Text style={[s.vacio, s.estado]}>Aún no guardas productos.</Text>
        )
      }
      showsVerticalScrollIndicator={false}
    />
  );
}

const s = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: Palette.ground },
  resumen: {
    minHeight: TouchMin,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing[5],
    marginTop: Spacing[3],
    marginBottom: Spacing[2],
  },
  conteo: { ...Type.bodySm, fontFamily: FontFamily.bodyBold, color: Palette.ink },
  ordenar: { minHeight: TouchMin, flexDirection: 'row', alignItems: 'center', gap: 6 },
  ordenarTexto: { ...Type.bodySm, fontFamily: FontFamily.bodyBold, color: Palette.ink, textDecorationLine: 'underline' },
  celda: { width: '50%', paddingHorizontal: 6, paddingBottom: 12, flexDirection: 'row' },
  estado: { marginTop: Spacing[6] },
  vacio: { ...Type.body, color: Palette.textMuted, textAlign: 'center' },
});
