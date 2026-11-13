import { useCallback, useMemo, useState } from 'react';
import { FlatList, ListRenderItem, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useBottomNavInset } from '@/components/ui/BottomNav';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { FilterChip } from '@/components/ui/FilterChip';
import { ActionButton } from '@/components/ui/ActionButton';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { formatoPrecio } from '@/utils/formato';
import { FontFamily, Palette, Radius, Spacing, Type } from '@/constants/theme';
import { ESTADOS_PUBLICACION, EstadoPublicacion, PUBLICACIONES, Publicacion, usePublicaciones } from '@/features/productos/store/publicaciones';

// Cada estado lleva ícono y texto: el significado nunca depende solo del color
const ESTADO_PUBLICACION: Record<EstadoPublicacion, { bg: string; fg: string; icon: keyof typeof Ionicons.glyphMap }> = {
  Publicada: { bg: Palette.successBg, fg: Palette.success, icon: 'checkmark-circle' },
  'En revisión': { bg: Palette.infoBg, fg: Palette.info, icon: 'hourglass-outline' },
  Rechazada: { bg: Palette.warningBg, fg: Palette.warning, icon: 'alert-circle-outline' },
  Pausada: { bg: Palette.lima100, fg: Palette.green700, icon: 'pause-circle-outline' },
};

const keyExtractor = (p: Publicacion) => p.id;
const Separador = () => <View style={s.separador} />;

const editar = (id: string) => router.push({ pathname: '/productos/[id]/editar' as any, params: { id } });
const verMotivo = () => router.push('/productos/moderacion' as any);
const cambiarPausa = (p: Publicacion) =>
  PUBLICACIONES.set((l) =>
    l.map((x) => (x.id === p.id ? { ...x, estado: p.estado === 'Pausada' ? 'Publicada' : 'Pausada' } : x))
  );

/** Publicaciones del vendedor con su estado de moderación y las acciones de cada una. */
export default function Publicaciones() {
  const navInset = useBottomNavInset();
  const publicaciones = usePublicaciones();
  const [filtro, setFiltro] = useState<EstadoPublicacion | 'Todas'>('Todas');

  const visibles = useMemo(
    () => publicaciones.filter((p) => filtro === 'Todas' || p.estado === filtro),
    [publicaciones, filtro]
  );
  const cuenta = (e: EstadoPublicacion) => publicaciones.filter((p) => p.estado === e).length;

  const renderItem: ListRenderItem<Publicacion> = useCallback(({ item: p }) => {
    const e = ESTADO_PUBLICACION[p.estado];
    return (
      <Card style={s.tarjeta}>
        <View style={s.cabecera}>
          <View style={[s.estado, { backgroundColor: e.bg }]}>
            <Ionicons name={e.icon} size={14} color={e.fg} />
            <Text style={[s.estadoTexto, { color: e.fg }]}>{p.estado}</Text>
          </View>
          <Chip label={p.tipo} />
        </View>

        <View style={s.cuerpo}>
          <View style={s.textos}>
            <Text style={s.nombre} numberOfLines={2}>{p.nombre}</Text>
            {p.vistas !== undefined ? (
              <Text style={s.detalle}>{`${p.vistas} vistas · ${p.interesados ?? 0} interesados`}</Text>
            ) : p.enviada ? (
              <Text style={s.detalle}>{`Enviada ${p.enviada}`}</Text>
            ) : null}
          </View>
          <Text style={s.precio}>{formatoPrecio(p.precio)}</Text>
        </View>

        {p.estado === 'Rechazada' && p.motivo ? <Text style={s.motivo}>{p.motivo}</Text> : null}

        <View style={s.acciones}>
          {p.estado === 'Rechazada' ? (
            <>
              <ActionButton label="Corregir y reenviar" icon="create-outline" size="sm" align="center" onPress={() => editar(p.id)} style={s.accion} />
              <ActionButton label="Ver motivo" size="sm" variant="dark" align="center" onPress={verMotivo} style={s.accion} />
            </>
          ) : (
            <>
              <ActionButton label="Editar" icon="create-outline" size="sm" variant="dark" align="center" onPress={() => editar(p.id)} style={s.accion} />
              {p.estado === 'Publicada' || p.estado === 'Pausada' ? (
                <ActionButton
                  label={p.estado === 'Pausada' ? 'Reactivar' : 'Pausar'}
                  icon={p.estado === 'Pausada' ? 'play-outline' : 'pause-outline'}
                  size="sm"
                  align="center"
                  onPress={() => cambiarPausa(p)}
                  style={s.accion}
                />
              ) : (
                <ActionButton label="Ver revisión" size="sm" align="center" onPress={verMotivo} style={s.accion} />
              )}
            </>
          )}
        </View>
      </Card>
    );
  }, []);

  const encabezado = (
    <View>
      <ScreenHeader
        title="Mis publicaciones"
        right={{ icon: 'add', label: 'Publicar algo nuevo', onPress: () => router.push('/productos/nuevo' as any) }}
      />
      <View style={s.chips}>
        <FilterChip label={`Todas · ${publicaciones.length}`} selected={filtro === 'Todas'} onPress={() => setFiltro('Todas')} />
        {ESTADOS_PUBLICACION.map((e) => (
          <FilterChip key={e} label={`${e} · ${cuenta(e)}`} selected={filtro === e} onPress={() => setFiltro(e)} />
        ))}
      </View>
    </View>
  );

  return (
    <FlatList
      style={s.pantalla}
      contentContainerStyle={{ paddingBottom: navInset }}
      data={visibles}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      ItemSeparatorComponent={Separador}
      ListHeaderComponent={encabezado}
      ListEmptyComponent={
        <View style={s.vacio}>
          <Text style={s.vacioTexto}>No tienes publicaciones en esta lista.</Text>
          <ActionButton label="Publicar" icon="add" size="sm" align="center" onPress={() => router.push('/productos/nuevo' as any)} />
        </View>
      }
      showsVerticalScrollIndicator={false}
    />
  );
}

const s = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: Palette.ground },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing[2], paddingHorizontal: Spacing[5], marginTop: Spacing[4], marginBottom: Spacing[4] },
  separador: { height: Spacing[3] },
  tarjeta: { gap: Spacing[3], marginHorizontal: Spacing[5] },
  cabecera: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: Spacing[2] },
  estado: { height: 28, paddingHorizontal: 10, borderRadius: Radius.full, flexDirection: 'row', alignItems: 'center', gap: 6 },
  estadoTexto: { ...Type.label },
  cuerpo: { flexDirection: 'row', gap: Spacing[3], alignItems: 'flex-start' },
  textos: { flex: 1, minWidth: 0, gap: 2 },
  nombre: { ...Type.bodySm, fontFamily: FontFamily.bodyBold, color: Palette.ink },
  detalle: { ...Type.caption, color: Palette.textMuted },
  precio: { ...Type.priceSm, color: Palette.ink },
  motivo: { ...Type.caption, color: Palette.warning, backgroundColor: Palette.warningBg, borderRadius: Radius.md, padding: Spacing[3] },
  acciones: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing[2] },
  accion: { flexGrow: 1, justifyContent: 'center', borderRadius: Radius.full },
  vacio: { alignItems: 'center', gap: Spacing[3], marginTop: Spacing[8] },
  vacioTexto: { ...Type.body, color: Palette.textMuted, textAlign: 'center' },
});
