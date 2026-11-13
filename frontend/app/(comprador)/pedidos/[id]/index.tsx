import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { ActionButton } from '@/components/ui/ActionButton';
import { Card } from '@/components/ui/Card';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { formatoPrecio } from '@/utils/formato';
import { FontFamily, Palette, Spacing, Type } from '@/constants/theme';
import { PEDIDOS } from '@/features/pedidos/services/historial';

const PASOS = ['Pedido recibido', 'En preparación', 'Listo para recoger', 'Entregado'] as const;
const ACTUAL = { 'En preparación': 1, 'Listo para recoger': 2, Entregado: 3 } as const;
const MOTIVOS = ['No coincide con la publicación', 'Llegó en mal estado', 'El vendedor no apareció'];

/** Seguimiento de un pedido: línea de tiempo, datos de entrega y acciones (escribir, reportar, calificar). */
export default function Seguimiento() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const pedido = PEDIDOS.find((p) => p.id === id);

  if (!pedido) {
    return (
      <View style={s.pantalla}>
        <ScreenHeader title="Pedido" />
        <Text style={s.vacio}>No encontramos este pedido.</Text>
      </View>
    );
  }

  const actual = ACTUAL[pedido.estado];
  const entregado = pedido.estado === 'Entregado';

  const reportar = () =>
    Alert.alert('Reportar un problema', '¿Qué pasó con tu pedido?', [
      ...MOTIVOS.map((m) => ({
        text: m,
        onPress: () => Alert.alert('Reporte enviado', 'Un moderador revisa el caso en máximo 48 horas. Te avisamos por notificación.'),
      })),
      { text: 'Cancelar', style: 'cancel' as const },
    ]);

  return (
    <ScrollView style={s.pantalla} contentContainerStyle={{ paddingBottom: insets.bottom + Spacing[8] }} showsVerticalScrollIndicator={false}>
      <ScreenHeader title={`Pedido n.º ${pedido.numero}`} />
      <View style={s.contenido}>
        <Card style={s.resumen}>
          <View style={s.textos}>
            <Text style={s.titulo}>{pedido.titulo}</Text>
            <Text style={s.detalle}>{pedido.vendedor}</Text>
          </View>
          <Text style={s.precio}>{formatoPrecio(pedido.precio)}</Text>
        </Card>

        <SectionHeader title="Estado" />
        <View style={s.linea}>
          {PASOS.map((p, i) => {
            const hecho = i <= actual;
            return (
              <View key={p} style={s.paso} accessible accessibilityLabel={`${p}${i === actual ? ', paso actual' : hecho ? ', completado' : ', pendiente'}`}>
                <View style={s.columna}>
                  <View style={[s.punto, hecho && s.puntoOn]}>
                    {hecho && <Ionicons name="checkmark" size={16} color={Palette.lima} />}
                  </View>
                  {i < PASOS.length - 1 && <View style={[s.conector, i < actual && s.conectorOn]} />}
                </View>
                <Text style={[s.pasoTexto, i === actual && s.pasoActual, !hecho && s.pasoPendiente]}>{p}</Text>
              </View>
            );
          })}
        </View>

        <Card style={s.fila}>
          <View style={s.icono}>
            <Ionicons name="location-outline" size={20} color={Palette.ink} />
          </View>
          <View style={s.textos}>
            <Text style={s.titulo}>{entregado ? 'Entrega' : 'Cómo recoges'}</Text>
            <Text style={s.detalle}>{pedido.detalle}</Text>
          </View>
        </Card>

        <View style={s.acciones}>
          <ActionButton
            label="Escribir al vendedor"
            icon="chatbubble-outline"
            size="cta"
            align="center"
            onPress={() =>
              router.push({
                pathname: '/mensajes/[id]' as any,
                params: { id: `pedido-${pedido.id}`, con: pedido.vendedor, producto: `Pedido n.º ${pedido.numero} · ${pedido.titulo}`, productoId: pedido.productoId },
              })
            }
            style={s.boton}
          />
          {entregado && !pedido.calificado && (
            <ActionButton label="Calificar" icon="star-outline" variant="dark" size="cta" align="center" onPress={() => router.push({ pathname: '/pedidos/[id]/calificar' as any, params: { id: pedido.id } })} style={s.boton} />
          )}
          <ActionButton label="Reportar un problema" icon="flag-outline" variant="dark" size="cta" align="center" onPress={reportar} style={s.boton} />
        </View>
      </View>
    </ScrollView>
  );
}

const PUNTO = 28;
const s = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: Palette.ground },
  vacio: { ...Type.body, color: Palette.textMuted, textAlign: 'center', marginTop: Spacing[8] },
  contenido: { paddingHorizontal: Spacing[5], paddingTop: Spacing[4], gap: Spacing[3] },
  resumen: { flexDirection: 'row', gap: Spacing[3], alignItems: 'flex-start' },
  textos: { flex: 1, minWidth: 0, gap: 2 },
  titulo: { ...Type.bodySm, fontFamily: FontFamily.bodyBold, color: Palette.ink },
  detalle: { ...Type.caption, color: Palette.textMuted },
  precio: { ...Type.priceSm, color: Palette.ink },
  linea: { paddingLeft: Spacing[2] },
  paso: { flexDirection: 'row', gap: Spacing[3], minHeight: 52 },
  columna: { alignItems: 'center', width: PUNTO },
  punto: { width: PUNTO, height: PUNTO, borderRadius: PUNTO / 2, borderWidth: 2, borderColor: Palette.border, alignItems: 'center', justifyContent: 'center' },
  puntoOn: { backgroundColor: Palette.ink, borderColor: Palette.ink },
  conector: { flex: 1, width: 2, backgroundColor: Palette.border, marginVertical: 2 },
  conectorOn: { backgroundColor: Palette.ink },
  pasoTexto: { ...Type.bodySm, color: Palette.ink, paddingTop: 4 },
  pasoActual: { fontFamily: FontFamily.bodyBold },
  pasoPendiente: { color: Palette.textMuted },
  fila: { flexDirection: 'row', alignItems: 'center', gap: Spacing[3], padding: Spacing[3] },
  icono: { width: 40, height: 40, borderRadius: 20, backgroundColor: Palette.lima100, alignItems: 'center', justifyContent: 'center' },
  acciones: { gap: Spacing[2], marginTop: Spacing[3] },
  boton: { alignSelf: 'stretch' },
});
