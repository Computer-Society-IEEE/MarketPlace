import { useMemo } from 'react';
import { ActivityIndicator, FlatList, ListRenderItem, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { ActionButton } from '@/components/ui/ActionButton';
import { Avatar } from '@/components/ui/UserRow';
import { Chip } from '@/components/ui/Chip';
import { ProductCard } from '@/features/productos/components/comprador/ProductCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { FontFamily, Palette, Spacing, Type } from '@/constants/theme';
import { Oferta, aTarjeta } from '@/features/productos/services/ofertas';
import { useOfertas } from '@/features/productos/hooks/useOfertas';

const keyExtractor = (o: Oferta) => o.id;
const abrir = (id: string) => router.push({ pathname: '/producto/[id]', params: { id } });

/** Perfil público de un vendedor: quién es, su calificación y lo que tiene publicado. */
export default function PerfilVendedor() {
  const insets = useSafeAreaInsets();
  const { id, nombre } = useLocalSearchParams<{ id: string; nombre?: string }>();
  const { data = [], isLoading } = useOfertas({});

  const suyas = useMemo(() => data.filter((o) => o.uuidVendedor === id || (!!nombre && o.vendedor === nombre)), [data, id, nombre]);
  const vendedor = nombre ?? suyas[0]?.vendedor ?? 'Vendedor';
  const esPropio = suyas.some((o) => o.propia);
  const resenas = suyas.reduce((n, o) => n + (o.resenas ?? 0), 0);
  const nota = resenas > 0 ? suyas.reduce((n, o) => n + (o.calificacion ?? 0) * (o.resenas ?? 0), 0) / resenas : 0;

  const contactar = () =>
    router.push({
      pathname: '/mensajes/[id]' as any,
      params: { id: `v-${id}`, con: vendedor },
    });

  const renderItem: ListRenderItem<Oferta> = ({ item }) => (
    <View style={s.celda}>
      <ProductCard producto={aTarjeta(item)} onPress={abrir} />
    </View>
  );

  const encabezado = (
    <View>
      <ScreenHeader title="Vendedor" />
      <View style={s.perfil}>
        <Avatar size={72} />
        <Text accessibilityRole="header" style={s.nombre}>{vendedor}</Text>
        <Chip label="Estudiante verificado" icon="shield-checkmark" />
        {resenas > 0 && (
          <View style={s.nota}>
            <Ionicons name="star" size={16} color={Palette.gold} />
            <Text style={s.notaValor}>{nota.toLocaleString('es-CO', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</Text>
            <Text style={s.notaDetalle}>{`${resenas} reseñas`}</Text>
          </View>
        )}
        {!esPropio && (
          <ActionButton label="Escribir mensaje" icon="chatbubble-outline" variant="dark" size="cta" align="center" onPress={contactar} style={s.boton} />
        )}
      </View>
      <View style={s.seccion}>
        <SectionHeader title={`Publicaciones · ${suyas.length}`} />
      </View>
    </View>
  );

  return (
    <FlatList
      style={s.pantalla}
      contentContainerStyle={{ paddingBottom: insets.bottom + Spacing[6] }}
      data={suyas}
      numColumns={2}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      ListHeaderComponent={encabezado}
      ListEmptyComponent={
        isLoading ? (
          <ActivityIndicator style={s.estado} color={Palette.ink} accessibilityLabel="Cargando perfil" />
        ) : (
          <Text style={[s.vacio, s.estado]}>Este vendedor no tiene publicaciones activas.</Text>
        )
      }
      showsVerticalScrollIndicator={false}
    />
  );
}

const s = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: Palette.ground },
  perfil: { alignItems: 'center', gap: Spacing[2], paddingHorizontal: Spacing[5], marginTop: Spacing[4] },
  nombre: { ...Type.title2, color: Palette.ink, textAlign: 'center' },
  nota: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  notaValor: { ...Type.bodySm, fontFamily: FontFamily.bodyBold, color: Palette.ink },
  notaDetalle: { ...Type.bodySm, color: Palette.textMuted },
  boton: { alignSelf: 'stretch', marginTop: Spacing[2] },
  seccion: { paddingHorizontal: Spacing[5], marginTop: Spacing[4] },
  celda: { width: '50%', paddingHorizontal: 6, paddingBottom: 12, flexDirection: 'row' },
  estado: { marginTop: Spacing[6] },
  vacio: { ...Type.body, color: Palette.textMuted, textAlign: 'center' },
});
