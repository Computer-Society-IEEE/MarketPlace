import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBottomNavInset } from '@/components/ui/BottomNav';
import { ActionButton } from '@/components/ui/ActionButton';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { formatoPrecio } from '@/utils/formato';
import { FontFamily, Palette, Radius, Spacing, Type } from '@/constants/theme';
import { USUARIO } from '@/features/cuenta/services/usuario';
import { totalSinLeer, useConversaciones } from '@/features/chat/store/conversaciones';
import { PEDIDOS_VENTA, PedidoVenta, usePedidosVenta } from '@/features/pedidos/store/pedidosVenta';
import { usePublicaciones } from '@/features/productos/store/publicaciones';

const irAComprar = () => router.replace('/inicio' as any);
const irAPublicar = () => router.push('/productos/nuevo' as any);
const irAModeracion = () => router.push('/productos/moderacion' as any);
const irAMensajes = () => router.navigate('/bandeja' as any);
const irAPublicaciones = () => router.navigate('/productos' as any);

const escribir = (chatId: string) => router.push({ pathname: '/mensajes/[id]' as any, params: { id: chatId } });

const marcarEntregado = (p: PedidoVenta) =>
  Alert.alert('¿Entregaste el pedido?', `${p.titulo} a ${p.comprador}. El comprador recibe un aviso para calificarte.`, [
    { text: 'Todavía no', style: 'cancel' },
    {
      text: 'Sí, entregado',
      onPress: () =>
        PEDIDOS_VENTA.set((l) => l.map((x) => (x.id === p.id ? { ...x, entregado: true, detalle: 'Entregado hoy' } : x))),
    },
  ]);

function Dato({ valor, etiqueta, onPress }: { valor: number; etiqueta: string; onPress?: () => void }) {
  const contenido = (
    <>
      <Text style={s.datoValor}>{valor}</Text>
      <Text style={s.datoEtiqueta}>{etiqueta}</Text>
    </>
  );
  return onPress ? (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={`${valor} ${etiqueta}`} style={s.dato}>
      {contenido}
    </Pressable>
  ) : (
    <View style={s.dato} accessible accessibilityLabel={`${valor} ${etiqueta}`}>
      {contenido}
    </View>
  );
}

/** Panel del vendedor: qué entregar hoy, mensajes por responder y estado de la moderación. */
export default function Panel() {
  const insets = useSafeAreaInsets();
  const navInset = useBottomNavInset();
  const pedidos = usePedidosVenta();
  const publicaciones = usePublicaciones();
  const conversaciones = useConversaciones();

  const porEntregar = pedidos.filter((p) => !p.entregado);
  const entregados = pedidos.filter((p) => p.entregado);
  const sinLeer = totalSinLeer(conversaciones, 'venta');
  const enRevision = publicaciones.filter((p) => p.estado === 'En revisión').length;
  const rechazadas = publicaciones.filter((p) => p.estado === 'Rechazada').length;

  return (
    <ScrollView style={s.pantalla} contentContainerStyle={{ paddingBottom: navInset }} showsVerticalScrollIndicator={false}>
      <View style={[s.cabecera, { paddingTop: insets.top + Spacing[4] }]}>
        <Chip label="Modo vendedor" icon="storefront-outline" tone="oscuro" />
        <Text accessibilityRole="header" style={s.titulo}>{USUARIO.tienda.nombre}</Text>
      </View>

      <View style={s.publicar}>
        <View style={s.publicarTextos}>
          <Text style={s.publicarTitulo}>¿Tienes algo para vender?</Text>
          <Text style={s.publicarDetalle}>Publica en minutos; un moderador la revisa antes de mostrarla.</Text>
        </View>
        <ActionButton label="Publicar" icon="add" variant="dark" size="sm" align="center" onPress={irAPublicar} style={s.publicarBoton} />
      </View>

      <View style={s.datos}>
        <Dato valor={porEntregar.length} etiqueta="Por entregar" />
        <Dato valor={sinLeer} etiqueta="Sin leer" onPress={irAMensajes} />
        <Dato valor={enRevision} etiqueta="En revisión" onPress={irAModeracion} />
      </View>

      {rechazadas > 0 && (
        <Pressable onPress={irAModeracion} accessibilityRole="button" style={s.alerta}>
          <Ionicons name="alert-circle-outline" size={22} color={Palette.warning} />
          <View style={s.alertaTextos}>
            <Text style={s.alertaTitulo}>
              {rechazadas === 1 ? 'Una publicación necesita cambios' : `${rechazadas} publicaciones necesitan cambios`}
            </Text>
            <Text style={s.alertaDetalle}>Corrígela y vuelve a enviarla a revisión.</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Palette.warning} />
        </Pressable>
      )}

      <View style={s.bloque}>
        <SectionHeader title="Pedidos por entregar" />
        {porEntregar.length === 0 ? (
          <Text style={s.vacio}>No tienes entregas pendientes.</Text>
        ) : (
          porEntregar.map((p) => (
            <Card key={p.id} style={s.pedido}>
              <View style={s.pedidoCabecera}>
                <Chip label="Por entregar" icon="time-outline" />
                <Text style={s.numero}>{`Pedido n.º ${p.numero}`}</Text>
              </View>
              <View style={s.pedidoCuerpo}>
                <View style={s.textos}>
                  <Text style={s.pedidoTitulo}>{p.titulo}</Text>
                  <Text style={s.pedidoComprador}>{p.comprador}</Text>
                  <Text style={s.pedidoDetalle}>{p.detalle}</Text>
                </View>
                <Text style={s.precio}>{formatoPrecio(p.precio)}</Text>
              </View>
              <View style={s.acciones}>
                <ActionButton label="Marcar entregado" icon="checkmark" size="sm" align="center" onPress={() => marcarEntregado(p)} style={s.accion} />
                <ActionButton label="Escribir" icon="chatbubble-outline" size="sm" variant="dark" align="center" onPress={() => escribir(p.chatId)} style={s.accion} />
              </View>
            </Card>
          ))
        )}
      </View>

      {entregados.length > 0 && (
        <View style={s.bloque}>
          <SectionHeader title="Entregados" />
          <View style={s.lista}>
            {entregados.map((p) => (
              <View key={p.id} style={s.entregado}>
                <Ionicons name="bag-check-outline" size={20} color={Palette.green700} />
                <View style={s.textos}>
                  <Text style={s.pedidoTitulo}>{p.titulo}</Text>
                  <Text style={s.pedidoDetalle}>{`${p.comprador} · ${p.detalle}`}</Text>
                </View>
                <Text style={s.precio}>{formatoPrecio(p.precio)}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <View style={s.bloque}>
        <SectionHeader title="Mis publicaciones" actionLabel="Ver todas" onAction={irAPublicaciones} />
        <Text style={s.vacio}>{`${publicaciones.filter((p) => p.estado === 'Publicada').length} publicadas · ${enRevision} en revisión`}</Text>
      </View>

      <ActionButton
        label="Volver a comprar"
        icon="bag-handle-outline"
        variant="dark"
        size="cta"
        align="center"
        onPress={irAComprar}
        style={s.volver}
      />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: Palette.ground },
  cabecera: { paddingHorizontal: Spacing[5], paddingBottom: Spacing[4], gap: Spacing[2], alignItems: 'flex-start' },
  titulo: { ...Type.title1, color: Palette.ink },
  publicar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    backgroundColor: Palette.lima,
    borderRadius: Radius.lg,
    marginHorizontal: Spacing[5],
    padding: Spacing[4],
  },
  publicarTextos: { flex: 1, gap: 2 },
  publicarTitulo: { ...Type.title3, color: Palette.ink },
  publicarDetalle: { ...Type.caption, color: Palette.ink },
  publicarBoton: { borderRadius: Radius.full, justifyContent: 'center' },
  datos: { flexDirection: 'row', gap: Spacing[3], marginHorizontal: Spacing[5], marginTop: Spacing[4] },
  dato: { flex: 1, backgroundColor: Palette.card, borderRadius: Radius.lg, padding: Spacing[3], gap: 2, minHeight: 72, justifyContent: 'center' },
  datoValor: { ...Type.title2, color: Palette.ink },
  datoEtiqueta: { ...Type.caption, color: Palette.textMuted },
  alerta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    backgroundColor: Palette.warningBg,
    borderRadius: Radius.lg,
    marginHorizontal: Spacing[5],
    marginTop: Spacing[4],
    padding: Spacing[4],
  },
  alertaTextos: { flex: 1, gap: 2 },
  alertaTitulo: { ...Type.bodySm, fontFamily: FontFamily.bodyBold, color: Palette.warning },
  alertaDetalle: { ...Type.caption, color: Palette.warning },
  bloque: { marginHorizontal: Spacing[5], marginTop: Spacing[5], gap: Spacing[2] },
  vacio: { ...Type.bodySm, color: Palette.textMuted },
  pedido: { gap: Spacing[3] },
  pedidoCabecera: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: Spacing[2] },
  numero: { ...Type.caption, color: Palette.textMuted },
  pedidoCuerpo: { flexDirection: 'row', gap: Spacing[3], alignItems: 'flex-start' },
  textos: { flex: 1, minWidth: 0, gap: 2 },
  pedidoTitulo: { ...Type.bodySm, fontFamily: FontFamily.bodyBold, color: Palette.ink },
  pedidoComprador: { ...Type.caption, color: Palette.textMuted },
  pedidoDetalle: { ...Type.caption, color: Palette.ink, marginTop: 2 },
  precio: { ...Type.priceSm, color: Palette.ink },
  acciones: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing[2] },
  accion: { flexGrow: 1, justifyContent: 'center', borderRadius: Radius.full },
  lista: { backgroundColor: Palette.card, borderRadius: Radius.lg, paddingHorizontal: Spacing[3] },
  entregado: { flexDirection: 'row', alignItems: 'center', gap: Spacing[3], paddingVertical: Spacing[3] },
  volver: { alignSelf: 'stretch', marginHorizontal: Spacing[5], marginTop: Spacing[6] },
});
