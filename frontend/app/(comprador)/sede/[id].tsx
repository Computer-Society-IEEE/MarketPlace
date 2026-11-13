import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useBottomNavInset } from '@/components/ui/BottomNav';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { FilterChip } from '@/components/ui/FilterChip';
import { Chip } from '@/components/ui/Chip';
import { Card } from '@/components/ui/Card';
import { ActionButton } from '@/components/ui/ActionButton';
import { FontFamily, Palette, Radius, Spacing, Type } from '@/constants/theme';
import { SEDES, SEDE_DEL_USUARIO } from '@/features/sedes/services/sedes';
import { EstadoTienda, TIENDAS } from '@/features/tiendas/services/tiendas';
import type { Categoria } from '@/utils/catalogo';

const ESTADO: Record<EstadoTienda, { bg: string; fg: string; icon: keyof typeof Ionicons.glyphMap }> = {
  Abierta: { bg: Palette.successBg, fg: Palette.success, icon: 'checkmark-circle' },
  'Cierra pronto': { bg: Palette.warningBg, fg: Palette.warning, icon: 'time-outline' },
  'Con pedido': { bg: Palette.infoBg, fg: Palette.info, icon: 'receipt-outline' },
  'Con cita': { bg: Palette.infoBg, fg: Palette.info, icon: 'calendar-outline' },
};

const ABIERTAS: EstadoTienda[] = ['Abierta', 'Cierra pronto'];

/** Tiendas físicas de una sede: filtro por categoría, estado de cada puesto y su horario. */
export default function TiendasDeSede() {
  const navInset = useBottomNavInset();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const sede = SEDES.find((x) => x.id === id);
  const [categoria, setCategoria] = useState<Categoria | undefined>();
  const [soloAbiertas, setSoloAbiertas] = useState(false);

  const tiendas = useMemo(() => TIENDAS.filter((t) => t.sedeId === id), [id]);
  const categorias = useMemo(() => Array.from(new Set(tiendas.map((t) => t.categoria))), [tiendas]);
  // "Abiertas ahora" incluye las que cierran pronto: siguen atendiendo. "Con pedido" y "Con cita" no.
  const abiertas = tiendas.filter((t) => ABIERTAS.includes(t.estado)).length;
  const visibles = tiendas.filter(
    (t) => (!categoria || t.categoria === categoria) && (!soloAbiertas || ABIERTAS.includes(t.estado))
  );

  if (!sede) {
    return (
      <View style={s.pantalla}>
        <ScreenHeader title="Tiendas físicas" />
        <Text style={s.vacio}>No encontramos esta sede.</Text>
      </View>
    );
  }

  const total = `${sede.tiendas} ${sede.tiendas === 1 ? 'tienda' : 'tiendas'}`;

  return (
    <ScrollView
      style={s.pantalla}
      contentContainerStyle={{ paddingBottom: navInset }}
      showsVerticalScrollIndicator={false}
    >
      <ScreenHeader title={`Sede ${sede.nombre}`} />

      <View style={s.cabecera}>
        <Text style={s.zona}>{sede.zona}</Text>
        <View style={s.fila}>
          <Chip label={total} icon="storefront-outline" />
          {sede.id === SEDE_DEL_USUARIO && <Chip label="Tu sede" tone="oscuro" />}
        </View>
      </View>

      <View style={s.chips}>
        <FilterChip label="Todas" selected={!categoria} onPress={() => setCategoria(undefined)} />
        {categorias.map((c) => (
          <FilterChip key={c} label={c} selected={categoria === c} onPress={() => setCategoria(c)} />
        ))}
        <FilterChip
          label={`Abiertas ahora · ${abiertas}`}
          icon="time-outline"
          selected={soloAbiertas}
          onPress={() => setSoloAbiertas((v) => !v)}
        />
      </View>

      <View style={s.lista}>
        {visibles.length === 0 && (
          <View style={s.sinResultados}>
            <Text style={s.vacio}>
              {soloAbiertas ? 'Ninguna tienda con estos filtros está abierta ahora.' : 'No hay tiendas en esta categoría.'}
            </Text>
            <ActionButton
              label="Quitar filtros"
              size="sm"
              variant="dark"
              align="center"
              onPress={() => {
                setCategoria(undefined);
                setSoloAbiertas(false);
              }}
              style={s.boton}
            />
          </View>
        )}
        {visibles.map((t) => {
          const e = ESTADO[t.estado];
          return (
            <Card key={t.id} style={s.tarjeta}>
              <View style={s.fila}>
                <View style={s.textos}>
                  <Text style={s.nombre}>{t.nombre}</Text>
                  <Text style={s.lugar}>{`${t.categoria} · ${t.lugar}`}</Text>
                </View>
                <View style={[s.estado, { backgroundColor: e.bg }]}>
                  <Ionicons name={e.icon} size={14} color={e.fg} />
                  <Text style={[s.estadoTexto, { color: e.fg }]}>{t.estadoTexto ?? t.estado}</Text>
                </View>
              </View>
              <Text style={s.horario}>{t.horario}</Text>
              {t.soloPresencial ? (
                <View style={s.fila}>
                  <Chip label="Solo presencial" icon="walk-outline" />
                </View>
              ) : (
                <ActionButton
                  label="Ver productos"
                  size="sm"
                  align="center"
                  onPress={() => router.push({ pathname: '/buscar', params: { categoria: t.categoria } })}
                  style={s.boton}
                />
              )}
            </Card>
          );
        })}
      </View>

      <Text style={s.nota}>{`Se muestran ${visibles.length} de ${sede.tiendas} tiendas de esta sede${soloAbiertas ? ', abiertas ahora' : ''}.`}</Text>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: Palette.ground },
  vacio: { ...Type.body, color: Palette.textMuted, textAlign: 'center', marginTop: Spacing[8] },
  sinResultados: { alignItems: 'center', gap: Spacing[3], marginBottom: Spacing[4] },
  cabecera: { paddingHorizontal: Spacing[5], marginTop: Spacing[4], gap: Spacing[2] },
  zona: { ...Type.body, color: Palette.textMuted },
  fila: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: Spacing[2] },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing[2], paddingHorizontal: Spacing[5], marginTop: Spacing[4] },
  lista: { paddingHorizontal: Spacing[5], marginTop: Spacing[4], gap: Spacing[3] },
  tarjeta: { gap: Spacing[3] },
  textos: { flex: 1, minWidth: 0, gap: 2 },
  nombre: { ...Type.title3, color: Palette.ink },
  lugar: { ...Type.caption, color: Palette.textMuted },
  estado: { height: 28, paddingHorizontal: 10, borderRadius: Radius.full, flexDirection: 'row', alignItems: 'center', gap: 6 },
  estadoTexto: { ...Type.label },
  horario: { ...Type.bodySm, color: Palette.ink },
  boton: { alignSelf: 'flex-start', borderRadius: Radius.full, paddingHorizontal: Spacing[6] },
  nota: { ...Type.caption, fontFamily: FontFamily.body, color: Palette.textMuted, marginHorizontal: Spacing[5], marginTop: Spacing[4] },
});
