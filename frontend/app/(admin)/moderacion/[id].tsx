import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ActionButton } from '@/components/ui/ActionButton';
import { Card } from '@/components/ui/Card';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { formatoPrecio } from '@/utils/formato';
import { FontFamily, Palette, Radius, Spacing, Type } from '@/constants/theme';
import { MiniaturaProducto } from '@/features/moderacion/components/MiniaturaProducto';
import { SelectorDecision } from '@/features/moderacion/components/SelectorDecision';
import { EstadoReporte } from '@/features/moderacion/components/TarjetaReporte';
import { Decision, TITULO_DECISION } from '@/features/moderacion/services/reportes';
import { decidirReporte, useReporte } from '@/features/moderacion/store/reportes';

/**
 * Revisión de un reporte. Una sola ruta para sus variantes: con o sin pedido, con o sin fotos,
 * con o sin respuesta del vendedor y ya resuelto. Todo sale de los datos del reporte.
 */
export default function ReporteDetalle() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const reporte = useReporte(String(id));
  const [decision, setDecision] = useState<Decision>('aclaracion');

  useEffect(() => {
    if (reporte) setDecision(reporte.resolucion ?? reporte.sugerida);
  }, [reporte?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!reporte) {
    return (
      <View style={s.pantalla}>
        <ScreenHeader title="Reporte" />
        <Text style={s.vacio}>No encontramos este reporte.</Text>
      </View>
    );
  }

  const r = reporte;
  const resuelto = r.estado === 'Resuelto';

  const aplicar = () => {
    const registrar = () => {
      decidirReporte(r.id, decision);
      router.back();
    };
    if (decision === 'suspender') {
      Alert.alert('¿Suspender al vendedor?', `${r.publicacion.vendedor} no podrá publicar ni vender hasta que se revise su caso.`, [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Suspender', style: 'destructive', onPress: registrar },
      ]);
    } else {
      registrar();
    }
  };

  return (
    <View style={s.pantalla}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <ScreenHeader title={`Reporte n.º ${r.id}`} />
        <View style={s.contenido}>
          <View style={s.fila}>
            <EstadoReporte estado={r.estado} />
            <Text style={s.nota}>{r.pedido ? `Pedido n.º ${r.pedido.numero} · ${r.pedido.estado}` : 'Sin pedido en la app'}</Text>
          </View>

          <Card style={s.bloque}>
            <View style={s.fila}>
              <MiniaturaProducto />
              <View style={s.textos}>
                <Text style={s.titulo}>{r.publicacion.nombre}</Text>
                <Text style={s.detalle}>{`Vende: ${r.publicacion.tienda} · ${r.publicacion.vendedor}`}</Text>
                <Text style={s.detalle}>{`${formatoPrecio(r.publicacion.precio)} · ${r.publicacion.tipo}`}</Text>
              </View>
            </View>
          </Card>

          <Card style={s.bloque}>
            <Text style={s.etiqueta}>{`Motivo: ${r.motivo.toLowerCase()}`}</Text>
            <Text style={s.detalle}>{`${r.reportante.corto} · ${r.recibido}`}</Text>
            <Text style={s.cuerpo}>{r.descripcion}</Text>
            <View style={s.fila}>
              <Ionicons name="image-outline" size={16} color={Palette.textMuted} />
              <Text style={s.detalle}>{r.evidencias > 0 ? `${r.evidencias} ${r.evidencias === 1 ? 'foto adjunta' : 'fotos adjuntas'}` : 'Sin fotos adjuntas.'}</Text>
            </View>
          </Card>

          <Card style={s.bloque}>
            <View style={s.fila}>
              <Text style={[s.titulo, s.textos]}>Respuesta del vendedor</Text>
              <Text style={s.detalle}>{r.respuesta.texto ? 'Respondió' : 'Sin respuesta'}</Text>
            </View>
            <Text style={r.respuesta.texto ? s.cuerpo : s.detalle}>
              {r.respuesta.texto ?? `Aún no responde: ${r.respuesta.avisado}.`}
            </Text>
            <ActionButton label="Escribir al vendedor" icon="chatbubble-outline" variant="dark" size="sm" align="center" onPress={() => router.push({ pathname: '/mensajes/[id]' as any, params: { id: 'soporte' } })} />
          </Card>

          <View style={s.metricas}>
            {[
              { v: String(r.vendedor.ventas), e: 'Ventas' },
              { v: r.vendedor.calificacion, e: 'Calificación' },
              { v: String(r.vendedor.otrosReportes), e: 'Otros reportes' },
            ].map((m) => (
              <View key={m.e} accessible accessibilityLabel={`${m.e}: ${m.v}`} style={s.metrica}>
                <Text style={s.valor}>{m.v}</Text>
                <Text style={s.detalle}>{m.e}</Text>
              </View>
            ))}
          </View>

          <Text accessibilityRole="header" style={s.subtitulo}>Decisión</Text>
          {resuelto && (
            <View style={s.resuelto}>
              <Ionicons name="checkmark-circle-outline" size={20} color={Palette.success} />
              <Text style={s.resueltoTexto}>{`Resuelto: ${TITULO_DECISION[r.resolucion ?? 'descartar'].toLowerCase()}`}</Text>
            </View>
          )}
          <SelectorDecision valor={decision} onChange={setDecision} deshabilitado={resuelto} />
          <ActionButton label="Escribir a quien reportó" icon="chatbubble-outline" variant="dark" size="sm" align="center" onPress={() => router.push({ pathname: '/mensajes/[id]' as any, params: { id: 'soporte' } })} />
        </View>
      </ScrollView>

      {!resuelto && (
        <View style={s.barra}>
          <ActionButton label="Aplicar" icon="checkmark" size="cta" align="center" onPress={aplicar} />
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: Palette.ground },
  scroll: { paddingBottom: 120 },
  contenido: { padding: Spacing[5], gap: Spacing[3] },
  fila: { flexDirection: 'row', alignItems: 'center', gap: Spacing[3] },
  textos: { flex: 1, minWidth: 0, gap: 2 },
  bloque: { gap: Spacing[2] },
  titulo: { ...Type.body, fontFamily: FontFamily.bodyBold, color: Palette.ink },
  etiqueta: { ...Type.bodySm, fontFamily: FontFamily.bodyBold, color: Palette.ink },
  cuerpo: { ...Type.bodySm, color: Palette.ink },
  detalle: { ...Type.caption, color: Palette.textMuted },
  nota: { ...Type.caption, color: Palette.textMuted },
  subtitulo: { ...Type.title3, color: Palette.ink, marginTop: Spacing[2] },
  metricas: { flexDirection: 'row', gap: Spacing[2] },
  metrica: { flex: 1, backgroundColor: Palette.card, borderRadius: Radius.lg, padding: Spacing[3], alignItems: 'center', gap: 2 },
  valor: { ...Type.title2, color: Palette.ink },
  resuelto: { flexDirection: 'row', alignItems: 'center', gap: Spacing[2], backgroundColor: Palette.successBg, borderRadius: Radius.md, padding: Spacing[3] },
  resueltoTexto: { ...Type.bodySm, fontFamily: FontFamily.bodyBold, color: Palette.success, flex: 1 },
  barra: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: Palette.card, padding: Spacing[5], borderTopLeftRadius: Radius.xl, borderTopRightRadius: Radius.xl },
  vacio: { ...Type.body, color: Palette.textMuted, padding: Spacing[5] },
});
