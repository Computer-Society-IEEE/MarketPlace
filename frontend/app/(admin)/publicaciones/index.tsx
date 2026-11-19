import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useBottomNavInset } from '@/components/ui/BottomNav';
import { FilterChip } from '@/components/ui/FilterChip';
import { Palette, Spacing, Type } from '@/constants/theme';
import { EncabezadoAdmin } from '@/features/admin/components/EncabezadoAdmin';
import { TarjetaRevision } from '@/features/admin/components/TarjetaRevision';
import { EstadoRevision, aprobarPublicacion, retirarPublicacion, useRevision } from '@/features/admin/store/revision';

const FILTROS: { id: EstadoRevision; label: string }[] = [
  { id: 'porRevisar', label: 'Por revisar' },
  { id: 'revisada', label: 'Revisadas' },
  { id: 'retirada', label: 'Retiradas' },
];

/** Publicaciones por revisar: salen de inmediato y se revisan después, en orden de llegada. */
export default function PublicacionesAdmin() {
  const navInset = useBottomNavInset();
  const lista = useRevision();
  const [filtro, setFiltro] = useState<EstadoRevision>('porRevisar');
  const visibles = lista.filter((p) => p.estado === filtro);
  const pendientes = lista.filter((p) => p.estado === 'porRevisar').length;

  return (
    <ScrollView style={s.pantalla} contentContainerStyle={{ paddingBottom: navInset }} showsVerticalScrollIndicator={false}>
      <EncabezadoAdmin title="Publicaciones" />
      <View style={s.contenido}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.filtros}>
          {FILTROS.map((f) => (
            <FilterChip
              key={f.id}
              label={f.id === 'porRevisar' ? `${f.label} · ${pendientes}` : f.label}
              selected={filtro === f.id}
              onPress={() => setFiltro(f.id)}
            />
          ))}
        </ScrollView>

        {visibles.map((p) => (
          <TarjetaRevision
            key={p.id}
            publicacion={p}
            onAprobar={() => aprobarPublicacion(p.id)}
            onRetirar={() => retirarPublicacion(p.id)}
          />
        ))}
        {visibles.length === 0 && <Text style={s.nota}>No hay publicaciones en este filtro.</Text>}

        <Text style={s.nota}>
          Las publicaciones salen de inmediato y se revisan después, en orden de llegada. Retirar las oculta.
        </Text>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: Palette.ground },
  contenido: { padding: Spacing[5], gap: Spacing[3] },
  filtros: { gap: Spacing[2], paddingBottom: Spacing[1] },
  nota: { ...Type.caption, color: Palette.textMuted },
});
