import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useBottomNavInset } from '@/components/ui/BottomNav';
import { FontFamily, Palette, Radius, Spacing, Type } from '@/constants/theme';
import { EncabezadoAdmin } from '@/features/admin/components/EncabezadoAdmin';
import { usePorRevisar } from '@/features/admin/store/revision';
import { useUsuariosPorVerificar } from '@/features/admin/store/usuarios';
import { TarjetaReporte } from '@/features/moderacion/components/TarjetaReporte';
import { useReportes, useReportesAbiertos } from '@/features/moderacion/store/reportes';

const abrirReporte = (id: string) => router.push({ pathname: '/moderacion/[id]' as any, params: { id } });

/** Moderación: pendientes por tipo y reportes recientes. Cada contador abre su lista. */
export default function Moderacion() {
  const navInset = useBottomNavInset();
  const reportes = useReportes();
  const abiertos = useReportesAbiertos();
  const porRevisar = usePorRevisar();
  const porVerificar = useUsuariosPorVerificar();

  const contadores = [
    { valor: abiertos, etiqueta: 'Reportes abiertos', ir: undefined },
    { valor: porRevisar, etiqueta: 'Publicaciones por revisar', ir: () => router.navigate('/publicaciones' as any) },
    { valor: porVerificar, etiqueta: 'Usuarios por verificar', ir: () => router.navigate('/usuarios' as any) },
  ];

  return (
    <ScrollView style={s.pantalla} contentContainerStyle={{ paddingBottom: navInset }} showsVerticalScrollIndicator={false}>
      <EncabezadoAdmin title="Moderación" />
      <View style={s.contenido}>
        <View style={s.contadores}>
          {contadores.map((c) => (
            <Pressable
              key={c.etiqueta}
              disabled={!c.ir}
              onPress={c.ir}
              accessibilityRole={c.ir ? 'button' : 'text'}
              accessibilityLabel={`${c.etiqueta}: ${c.valor}`}
              style={s.contador}
            >
              <Text style={s.valor}>{c.valor}</Text>
              <Text style={s.etiqueta}>{c.etiqueta}</Text>
            </Pressable>
          ))}
        </View>

        <Text accessibilityRole="header" style={s.subtitulo}>Reportes recientes</Text>
        {reportes.map((r) => (
          <TarjetaReporte key={r.id} reporte={r} onRevisar={() => abrirReporte(r.id)} />
        ))}

        <Text style={s.nota}>Cada decisión queda registrada con la persona que la tomó y la hora.</Text>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: Palette.ground },
  contenido: { padding: Spacing[5], gap: Spacing[3] },
  contadores: { flexDirection: 'row', gap: Spacing[2] },
  contador: { flex: 1, minHeight: 88, backgroundColor: Palette.card, borderRadius: Radius.lg, padding: Spacing[3], gap: Spacing[1], justifyContent: 'center' },
  valor: { ...Type.title1, color: Palette.ink },
  etiqueta: { ...Type.caption, color: Palette.textMuted },
  subtitulo: { ...Type.title3, color: Palette.ink, marginTop: Spacing[2] },
  nota: { ...Type.caption, color: Palette.textMuted, fontFamily: FontFamily.body },
});
