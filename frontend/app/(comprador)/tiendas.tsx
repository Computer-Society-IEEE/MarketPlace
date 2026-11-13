import { useCallback, useMemo, useState } from 'react';
import { FlatList, ListRenderItem, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Palette, Radius, Spacing, TouchMin, Type } from '@/constants/theme';
import { useBottomNavInset } from '@/components/ui/BottomNav';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { SedeCard } from '@/features/sedes/components/SedeCard';
import { SEDES, SEDE_DEL_USUARIO, Sede } from '@/features/sedes/services/sedes';

const normalizar = (v: string) =>
  v.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

const keyExtractor = (sede: Sede) => sede.id;
const Separador = () => <View style={s.separador} />;

export default function SelectorSede() {
  const navInset = useBottomNavInset();
  const [buscando, setBuscando] = useState(false);
  const [texto, setTexto] = useState('');

  const sedes = useMemo(() => {
    const q = normalizar(texto);
    return q ? SEDES.filter((x) => normalizar(`${x.nombre} ${x.zona}`).includes(q)) : SEDES;
  }, [texto]);

  const elegirSede = useCallback((id: string) => {
    router.push({ pathname: '/sede/[id]' as any, params: { id } }); // la ruta tipada se regenera con expo start
  }, []);

  const buscarSede = useCallback(() => {
    setBuscando((v) => !v);
    setTexto('');
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
          right={{
            icon: buscando ? 'close' : 'search',
            label: buscando ? 'Cerrar búsqueda' : 'Buscar una sede',
            onPress: buscarSede,
          }}
        />
        {buscando ? (
          <View style={s.busqueda}>
            <Ionicons name="search" size={20} color={Palette.textMuted} />
            <TextInput
              style={s.campo}
              value={texto}
              onChangeText={setTexto}
              placeholder="Buscar una sede"
              placeholderTextColor={Palette.textMuted}
              accessibilityLabel="Buscar una sede"
              returnKeyType="search"
              autoFocus
              autoCorrect={false}
            />
            {texto.length > 0 && (
              <Pressable onPress={() => setTexto('')} accessibilityRole="button" accessibilityLabel="Borrar búsqueda" hitSlop={12}>
                <Ionicons name="close-circle" size={20} color={Palette.textMuted} />
              </Pressable>
            )}
          </View>
        ) : (
          <Text style={s.subtitulo}>Elige una sede para ver sus tiendas.</Text>
        )}
      </View>
    ),
    [buscarSede, buscando, texto]
  );

  return (
    <FlatList
      style={s.pantalla}
      contentContainerStyle={{ paddingBottom: navInset }}
      data={sedes}
      keyboardShouldPersistTaps="handled"
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      ItemSeparatorComponent={Separador}
      ListHeaderComponent={encabezado}
      ListEmptyComponent={<Text style={s.vacio}>{`Sin resultados para «${texto.trim()}».`}</Text>}
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
  vacio: { ...Type.body, color: Palette.textMuted, textAlign: 'center', marginTop: Spacing[6], marginHorizontal: Spacing[5] },
  busqueda: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Palette.card,
    borderWidth: 1,
    borderColor: Palette.border,
    borderRadius: Radius.full,
    minHeight: TouchMin,
    marginHorizontal: Spacing[5],
    paddingHorizontal: Spacing[4],
  },
  campo: { ...Type.body, flex: 1, paddingVertical: Spacing[2], color: Palette.ink },
  separador: { height: Spacing[3] },
});
