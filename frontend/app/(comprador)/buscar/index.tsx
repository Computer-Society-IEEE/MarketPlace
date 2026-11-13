import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { ActionButton } from '@/components/ui/ActionButton';
import { Palette, Radius, Spacing, TouchMin, Type } from '@/constants/theme';
import { useDebouncedValue } from '@/utils/use-debounced-value';
import { Oferta } from '@/features/productos/ofertas';
import { OfertaRow } from '@/features/productos/OfertaRow';
import { useOfertas } from '@/features/productos/useOfertas';

const keyExtractor = (o: Oferta) => o.id;

export default function Buscar() {
  const insets = useSafeAreaInsets();
  const [texto, setTexto] = useState('');
  // Se consulta cuando la persona deja de escribir, no en cada tecla
  const consulta = useDebouncedValue(texto, 300);
  const { data = [], isLoading, isError, refetch } = useOfertas(consulta);

  const abrir = useCallback((id: string) => {
    router.push({ pathname: '/producto/[id]', params: { id } });
  }, []);

  const renderItem: ListRenderItem<Oferta> = useCallback(
    ({ item }) => <OfertaRow oferta={item} onPress={abrir} />,
    [abrir]
  );

  // Se pasa como elemento (no como componente): así el campo no pierde el foco al escribir
  const encabezado = (
    <View>
      <ScreenHeader title="Buscar" />
      <Text style={s.titulo}>lista de productos</Text>

      <View style={s.busqueda}>
        <TextInput
          style={s.campo}
          value={texto}
          onChangeText={setTexto}
          placeholder='buscar "hojas examen"'
          placeholderTextColor={Palette.textMuted}
          accessibilityLabel="Buscar productos"
          returnKeyType="search"
          autoCorrect={false}
        />
        <Ionicons name="search" size={20} color={Palette.textMuted} style={s.icono} />
      </View>

      <SectionTitle>productos destacados</SectionTitle>
    </View>
  );

  const vacio = isLoading ? (
    <ActivityIndicator style={s.estado} color={Palette.ink} accessibilityLabel="Cargando productos" />
  ) : isError ? (
    <View style={s.estado}>
      <Text style={s.mensaje}>No pudimos cargar los productos.</Text>
      <ActionButton label="Reintentar" icon="refresh" size="sm" onPress={refetch} />
    </View>
  ) : (
    <Text style={[s.mensaje, s.estado]}>
      {consulta.trim() ? `Sin resultados para «${consulta.trim()}».` : 'Aún no hay productos.'}
    </Text>
  );

  return (
    <FlatList
      style={s.pantalla}
      contentContainerStyle={{ paddingBottom: insets.bottom + Spacing[6] }}
      data={data}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      ListHeaderComponent={encabezado}
      ListEmptyComponent={vacio}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
    />
  );
}

const s = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: Palette.ground },
  titulo: {
    ...Type.caption,
    color: Palette.textMuted,
    marginLeft: Spacing[4],
    marginTop: Spacing[4],
    marginBottom: Spacing[2],
  },
  busqueda: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.card,
    borderWidth: 1,
    borderColor: Palette.border,
    borderRadius: Radius.full,
    minHeight: TouchMin,
    marginHorizontal: Spacing[6],
    marginVertical: Spacing[4],
    paddingHorizontal: Spacing[6],
  },
  campo: { ...Type.bodySm, flex: 1, paddingVertical: Spacing[2], color: Palette.ink },
  icono: { marginLeft: Spacing[2] },
  estado: { marginTop: Spacing[6], alignItems: 'center', gap: Spacing[3] },
  mensaje: { ...Type.body, color: Palette.textMuted, textAlign: 'center' },
});
