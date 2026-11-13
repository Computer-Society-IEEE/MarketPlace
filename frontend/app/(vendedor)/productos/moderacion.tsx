import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useBottomNavInset } from '@/components/ui/BottomNav';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { ActionButton } from '@/components/ui/ActionButton';
import { Card } from '@/components/ui/Card';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { formatoPrecio } from '@/utils/formato';
import { FontFamily, Palette, Radius, Spacing, Type } from '@/constants/theme';
import { REGLAS_PUBLICACION, TIEMPO_REVISION } from '@/features/moderacion/services/reglas';
import { usePublicaciones } from '@/features/productos/store/publicaciones';

const PASOS = [
  { icon: 'cloud-upload-outline', titulo: 'Envías tu publicación', detalle: 'Con fotos reales, precio final y punto de entrega.' },
  { icon: 'shield-checkmark-outline', titulo: 'Un moderador la revisa', detalle: `Suele tardar ${TIEMPO_REVISION}. Te avisamos por notificación.` },
  { icon: 'storefront-outline', titulo: 'Se publica o te pedimos cambios', detalle: 'Si la rechazamos, ves el motivo aquí y la corriges.' },
] as const;

const editar = (id: string) => router.push({ pathname: '/productos/[id]/editar' as any, params: { id } });
const hablarConSoporte = () => router.push({ pathname: '/mensajes/[id]' as any, params: { id: 'soporte' } });

/** Moderación: cómo se revisa una publicación, qué está pendiente, qué se rechazó y por qué. */
export default function Moderacion() {
  const navInset = useBottomNavInset();
  const publicaciones = usePublicaciones();
  const rechazadas = publicaciones.filter((p) => p.estado === 'Rechazada');
  const enRevision = publicaciones.filter((p) => p.estado === 'En revisión');
  const aprobadas = publicaciones.filter((p) => p.estado === 'Publicada' || p.estado === 'Pausada');

  return (
    <ScrollView style={s.pantalla} contentContainerStyle={{ paddingBottom: navInset }} showsVerticalScrollIndicator={false}>
      <ScreenHeader title="Moderación" />

      <View style={s.contenido}>
        <View style={s.info}>
          <Text style={s.infoTitulo}>Así revisamos tus publicaciones</Text>
          {PASOS.map((p, i) => (
            <View key={p.titulo} style={s.paso}>
              <View style={s.numero}>
                <Text style={s.numeroTexto}>{i + 1}</Text>
              </View>
              <View style={s.textos}>
                <Text style={s.pasoTitulo}>{p.titulo}</Text>
                <Text style={s.pasoDetalle}>{p.detalle}</Text>
              </View>
            </View>
          ))}
        </View>

        {rechazadas.length > 0 && (
          <View style={s.grupo}>
            <SectionHeader title="Necesitan cambios" />
            {rechazadas.map((p) => (
              <Card key={p.id} style={s.tarjeta}>
                <View style={s.fila}>
                  <Ionicons name="alert-circle-outline" size={22} color={Palette.warning} />
                  <View style={s.textos}>
                    <Text style={s.nombre}>{p.nombre}</Text>
                    <Text style={s.detalle}>{`Rechazada · enviada ${p.enviada ?? ''}`}</Text>
                  </View>
                </View>
                <Text style={s.motivo}>{p.motivo}</Text>
                <ActionButton label="Corregir y reenviar" icon="create-outline" size="sm" align="center" onPress={() => editar(p.id)} style={s.boton} />
              </Card>
            ))}
          </View>
        )}

        <View style={s.grupo}>
          <SectionHeader title="En revisión" />
          {enRevision.length === 0 ? (
            <Text style={s.vacio}>No tienes publicaciones esperando revisión.</Text>
          ) : (
            enRevision.map((p) => (
              <Card key={p.id} style={s.tarjeta}>
                <View style={s.fila}>
                  <Ionicons name="hourglass-outline" size={22} color={Palette.info} />
                  <View style={s.textos}>
                    <Text style={s.nombre}>{p.nombre}</Text>
                    <Text style={s.detalle}>{`${p.tipo} · ${formatoPrecio(p.precio)} · enviada ${p.enviada ?? ''}`}</Text>
                  </View>
                </View>
                <Text style={s.detalle}>{`Mientras la revisamos no se muestra a los compradores. Respuesta en ${TIEMPO_REVISION}.`}</Text>
              </Card>
            ))
          )}
        </View>

        <View style={s.grupo}>
          <SectionHeader title="Aprobadas" />
          {aprobadas.length === 0 ? (
            <Text style={s.vacio}>Aún no tienes publicaciones aprobadas.</Text>
          ) : (
            <View style={s.lista}>
              {aprobadas.map((p) => (
                <View key={p.id} style={s.filaLista}>
                  <Ionicons name="checkmark-circle" size={20} color={Palette.success} />
                  <Text style={[s.nombre, s.textos]} numberOfLines={1}>{p.nombre}</Text>
                  <Text style={s.detalle}>{p.estado === 'Pausada' ? 'Pausada' : 'Publicada'}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={s.grupo}>
          <SectionHeader title="Reglas de publicación" />
          <View style={s.lista}>
            {REGLAS_PUBLICACION.map((r) => (
              <View key={r} style={s.filaLista}>
                <Ionicons name="shield-checkmark-outline" size={20} color={Palette.green700} />
                <Text style={[s.regla, s.textos]}>{r}</Text>
              </View>
            ))}
          </View>
        </View>

        <Pressable onPress={hablarConSoporte} accessibilityRole="button" style={s.apelar}>
          <Ionicons name="chatbubble-ellipses-outline" size={22} color={Palette.ink} />
          <View style={s.textos}>
            <Text style={s.nombre}>¿No estás de acuerdo con una decisión?</Text>
            <Text style={s.detalle}>Escríbenos y un moderador revisa tu caso.</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Palette.textMuted} />
        </Pressable>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: Palette.ground },
  contenido: { paddingHorizontal: Spacing[5], paddingTop: Spacing[4], gap: Spacing[4] },
  info: { backgroundColor: Palette.lima, borderRadius: Radius.lg, padding: Spacing[4], gap: Spacing[3] },
  infoTitulo: { ...Type.title3, color: Palette.ink },
  paso: { flexDirection: 'row', gap: Spacing[3], alignItems: 'flex-start' },
  numero: { width: 28, height: 28, borderRadius: 14, backgroundColor: Palette.ink, alignItems: 'center', justifyContent: 'center' },
  numeroTexto: { ...Type.label, color: Palette.lima },
  textos: { flex: 1, minWidth: 0, gap: 2 },
  pasoTitulo: { ...Type.bodySm, fontFamily: FontFamily.bodyBold, color: Palette.ink },
  pasoDetalle: { ...Type.caption, color: Palette.ink },
  grupo: { gap: Spacing[2] },
  tarjeta: { gap: Spacing[3] },
  fila: { flexDirection: 'row', alignItems: 'center', gap: Spacing[3] },
  nombre: { ...Type.bodySm, fontFamily: FontFamily.bodyBold, color: Palette.ink },
  detalle: { ...Type.caption, color: Palette.textMuted },
  motivo: { ...Type.bodySm, color: Palette.warning, backgroundColor: Palette.warningBg, borderRadius: Radius.md, padding: Spacing[3] },
  boton: { alignSelf: 'flex-start', borderRadius: Radius.full, paddingHorizontal: Spacing[6] },
  vacio: { ...Type.bodySm, color: Palette.textMuted },
  lista: { backgroundColor: Palette.card, borderRadius: Radius.lg, paddingHorizontal: Spacing[3] },
  filaLista: { flexDirection: 'row', alignItems: 'center', gap: Spacing[3], paddingVertical: Spacing[3] },
  regla: { ...Type.bodySm, color: Palette.ink },
  apelar: { minHeight: 64, flexDirection: 'row', alignItems: 'center', gap: Spacing[3], backgroundColor: Palette.card, borderRadius: Radius.lg, padding: Spacing[4] },
});
