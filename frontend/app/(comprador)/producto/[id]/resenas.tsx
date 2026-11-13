import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Card } from '@/components/ui/Card';
import { FontFamily, Palette, Radius, Spacing, Type } from '@/constants/theme';
import { useOferta } from '@/features/productos/hooks/useOfertas';

/** Todas las reseñas de un producto, con su calificación promedio. */
export default function Resenas() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { data: oferta, isLoading } = useOferta(id);
  const lista = oferta?.listaResenas ?? [];

  return (
    <ScrollView style={s.pantalla} contentContainerStyle={{ paddingBottom: insets.bottom + Spacing[8] }} showsVerticalScrollIndicator={false}>
      <ScreenHeader title="Reseñas" />
      {isLoading ? (
        <ActivityIndicator style={s.estado} color={Palette.ink} accessibilityLabel="Cargando reseñas" />
      ) : !oferta ? (
        <Text style={[s.vacio, s.estado]}>Este producto ya no está disponible.</Text>
      ) : (
        <View style={s.contenido}>
          <Text style={s.producto}>{oferta.nombre}</Text>
          <View style={s.resumen} accessible accessibilityLabel={`Calificación ${oferta.calificacion ?? 0} de 5, ${oferta.resenas ?? 0} reseñas`}>
            <Text style={s.nota}>{(oferta.calificacion ?? 0).toLocaleString('es-CO', { minimumFractionDigits: 1 })}</Text>
            <View style={s.estrellas}>
              <View style={s.fila}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <Ionicons key={n} name={n <= Math.round(oferta.calificacion ?? 0) ? 'star' : 'star-outline'} size={18} color={Palette.gold} />
                ))}
              </View>
              <Text style={s.cuantas}>{`${oferta.resenas ?? 0} reseñas de compras verificadas`}</Text>
            </View>
          </View>
          {lista.length === 0 ? (
            <Text style={s.vacio}>Aún no hay reseñas.</Text>
          ) : (
            lista.map((r) => (
              <Card key={r.id} style={s.resena}>
                <View style={s.cabecera}>
                  <Text style={s.autor}>{r.autor}</Text>
                  <Text style={s.cuando}>{r.cuando}</Text>
                </View>
                <Text style={s.texto}>{r.texto}</Text>
                <View style={s.fila}>
                  <Ionicons name="checkmark-circle" size={14} color={Palette.success} />
                  <Text style={s.verificada}>Compra verificada</Text>
                </View>
              </Card>
            ))
          )}
        </View>
      )}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: Palette.ground },
  estado: { marginTop: Spacing[6] },
  vacio: { ...Type.body, color: Palette.textMuted, textAlign: 'center' },
  contenido: { paddingHorizontal: Spacing[5], paddingTop: Spacing[4], gap: Spacing[3] },
  producto: { ...Type.title3, color: Palette.ink },
  resumen: { flexDirection: 'row', alignItems: 'center', gap: Spacing[4], backgroundColor: Palette.lima, borderRadius: Radius.xl, padding: Spacing[4] },
  nota: { ...Type.display, color: Palette.ink },
  estrellas: { flex: 1, gap: 4 },
  fila: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  cuantas: { ...Type.caption, color: Palette.ink },
  resena: { gap: Spacing[2], padding: Spacing[4] },
  cabecera: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  autor: { ...Type.bodySm, fontFamily: FontFamily.bodyBold, color: Palette.ink },
  cuando: { ...Type.caption, color: Palette.textMuted },
  texto: { ...Type.bodySm, color: Palette.ink },
  verificada: { ...Type.caption, fontFamily: FontFamily.bodyBold, color: Palette.success },
});
