import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator,
  FlatList,
  ListRenderItem,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View, } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ActionButton } from '@/components/ui/ActionButton';
import { FilterChip } from '@/components/ui/FilterChip';
import { ProductCard } from '@/features/productos/components/comprador/ProductCard';
import { TipoOferta } from '@/utils/catalogo';
import { FontFamily, Palette, Radius, Spacing, TouchMin, Type } from '@/constants/theme';
import { useDebouncedValue } from '@/utils/use-debounced-value';
import { Categoria } from '@/utils/catalogo';
import { Oferta, aTarjeta } from '@/features/productos/services/ofertas';
import { useOfertas } from '@/features/productos/hooks/useOfertas';

const keyExtractor = (o: Oferta) => o.id;

const TIPOS: { label: string; valor?: TipoOferta }[] = [
  { label: 'Todo' },
  { label: 'Emprendimientos', valor: 'Emprendimiento' },
  { label: 'Segunda mano', valor: 'Segunda mano' },
  { label: 'Servicios', valor: 'Servicio' },
];
const RECIENTES = ['hojas de examen', 'calculadora', 'empanadas'];

const comoTipo = (v?: string): TipoOferta | undefined =>
  v === 'Emprendimiento' || v === 'Segunda mano' || v === 'Servicio' ? v : undefined;
const comoCategoria = (v?: string): Categoria | undefined =>
  v === 'Comida' || v === 'Papelería' || v === 'Tecnología' || v === 'Servicios' ? v : undefined;

/**
 * Buscar y resultados. Sin texto ni filtros muestra búsquedas recientes y destacados; con ellos,
 * el listado filtrado con su conteo. Inicio la abre ya filtrada por tipo o categoría.
 */
export default function Buscar() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ tipo?: string; categoria?: string }>();

  const [texto, setTexto] = useState('');
  const [tipo, setTipo] = useState<TipoOferta | undefined>(comoTipo(params.tipo));
  const [categoria, setCategoria] = useState<Categoria | undefined>(comoCategoria(params.categoria));
  const [soloHoy, setSoloHoy] = useState(false);

  // La pantalla sigue montada entre visitas: si Inicio la abre con otro filtro, se actualiza
  useEffect(() => {
    setTipo(comoTipo(params.tipo));
    setCategoria(comoCategoria(params.categoria));
  }, [params.tipo, params.categoria]);

  // Se consulta cuando la persona deja de escribir, no en cada tecla
  const consulta = useDebouncedValue(texto, 300);
  const { data = [], isLoading, isError, refetch } = useOfertas({
    texto: consulta,
    tipo,
    categoria,
    soloDisponibles: soloHoy,
  });

  const enBusqueda = !!(texto.trim() || tipo || categoria);
  const disponibles = useMemo(() => data.filter((o) => (o.unidades ?? 1) > 0).length, [data]);

  const abrir = useCallback((id: string) => {
    router.push({ pathname: '/producto/[id]', params: { id } });
  }, []);

  const elegirTipo = useCallback((v?: TipoOferta) => {
    setTipo(v);
    setCategoria(undefined);
  }, []);

  const limpiar = useCallback(() => {
    setTexto('');
    setTipo(undefined);
    setCategoria(undefined);
    setSoloHoy(false);
  }, []);

  const renderItem: ListRenderItem<Oferta> = useCallback(
    ({ item }) => (
      <View style={s.celda}>
        <ProductCard producto={aTarjeta(item)} onPress={abrir} />
      </View>
    ),
    [abrir]
  );

  // Se pasa como elemento (no como componente): así el campo no pierde el foco al escribir
  const encabezado = (
    <View>
      <ScreenHeader title="Buscar" />

      <View style={s.busqueda}>
        <Ionicons name="search" size={20} color={Palette.textMuted} />
        <TextInput
          style={s.campo}
          value={texto}
          onChangeText={setTexto}
          placeholder='Buscar "hojas de examen"'
          placeholderTextColor={Palette.textMuted}
          accessibilityLabel="Buscar productos"
          returnKeyType="search"
          autoCorrect={false}
        />
        {texto.length > 0 && (
          <Pressable
            onPress={() => setTexto('')}
            accessibilityRole="button"
            accessibilityLabel="Borrar búsqueda"
            hitSlop={12}
          >
            <Ionicons name="close-circle" size={20} color={Palette.textMuted} />
          </Pressable>
        )}
      </View>

      <View style={s.chips}>
        {TIPOS.map((t) => (
          <FilterChip
            key={t.label}
            label={t.label}
            selected={t.valor === tipo && !categoria}
            onPress={() => elegirTipo(t.valor)}
          />
        ))}
        {categoria && <FilterChip label={categoria} selected onPress={() => setCategoria(undefined)} icon="close" />}
      </View>

      {enBusqueda ? (
        <View style={s.resumen}>
          <Text style={s.conteo} accessibilityLiveRegion="polite">
            {`${data.length} ${data.length === 1 ? 'resultado' : 'resultados'}, ${disponibles} ${
              disponibles === 1 ? 'disponible' : 'disponibles'
            } hoy`}
          </Text>
          <View style={s.filaSwitch}>
            <Text style={s.switchTexto}>Solo disponibles hoy</Text>
            <Switch
              value={soloHoy}
              onValueChange={setSoloHoy}
              accessibilityLabel="Solo disponibles hoy"
              trackColor={{ false: Palette.border, true: Palette.green600 }}
              thumbColor="#FFFFFF"
            />
          </View>
          <Pressable onPress={limpiar} accessibilityRole="button" style={s.limpiar}>
            <Text style={s.limpiarTexto}>Limpiar filtros</Text>
          </Pressable>
        </View>
      ) : (
        <View style={s.bloque}>
          <SectionHeader title="Búsquedas recientes" />
          <View style={s.recientes}>
            {RECIENTES.map((r) => (
              <FilterChip key={r} label={r} icon="time-outline" onPress={() => setTexto(r)} />
            ))}
          </View>
          <SectionHeader title="Productos destacados" />
        </View>
      )}
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
      {texto.trim() ? `Sin resultados para «${texto.trim()}».` : 'No hay productos con estos filtros.'}
    </Text>
  );

  return (
    <FlatList
      style={s.pantalla}
      contentContainerStyle={{ paddingBottom: insets.bottom + Spacing[6] }}
      data={enBusqueda ? data : data.slice(0, 4)}
      numColumns={2}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      ListHeaderComponent={encabezado}
      ListEmptyComponent={vacio}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      showsVerticalScrollIndicator={false}
    />
  );
}

const s = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: Palette.ground },
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
    marginTop: Spacing[4],
    paddingHorizontal: Spacing[4],
  },
  campo: { ...Type.body, flex: 1, paddingVertical: Spacing[2], color: Palette.ink },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing[2],
    marginHorizontal: Spacing[5],
    marginTop: Spacing[3],
  },
  bloque: { marginHorizontal: Spacing[5], marginTop: Spacing[2] },
  recientes: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing[2], marginBottom: Spacing[2] },
  resumen: { marginHorizontal: Spacing[5], marginTop: Spacing[3], marginBottom: Spacing[2] },
  conteo: { ...Type.bodySm, fontFamily: FontFamily.bodyBold, color: Palette.ink },
  filaSwitch: { minHeight: TouchMin, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  switchTexto: { ...Type.body, color: Palette.ink },
  limpiar: { alignSelf: 'flex-start', minHeight: TouchMin, justifyContent: 'center' },
  limpiarTexto: { ...Type.bodySm, fontFamily: FontFamily.bodyBold, color: Palette.ink, textDecorationLine: 'underline' },
  // Dos columnas: cada celda mide la mitad y deja 12 px entre tarjetas
  celda: { width: '50%', paddingHorizontal: 6, paddingBottom: 12, flexDirection: 'row' },
  estado: { marginTop: Spacing[6], alignItems: 'center', gap: Spacing[3] },
  mensaje: { ...Type.body, color: Palette.textMuted, textAlign: 'center' },
});
