import { ComponentProps } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBottomNavInset } from '@/components/ui/BottomNav';
import { Avatar } from '@/components/ui/UserRow';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { ActionButton } from '@/components/ui/ActionButton';
import { FontFamily, Palette, Radius, Spacing, TouchMin, Type } from '@/constants/theme';
import { SEDES, SEDE_DEL_USUARIO } from '@/features/sedes/services/sedes';
import { NOTIFICACIONES_SIN_LEER } from '@/features/notificaciones/services/notificaciones';
import { USUARIO } from '@/features/cuenta/services/usuario';
import { totalSinLeer, useConversaciones } from '@/features/chat/store/conversaciones';

type Icono = ComponentProps<typeof Ionicons>['name'];

type Fila = { icon: Icono; titulo: string; detalle?: string; onPress: () => void };

const sede = SEDES.find((x) => x.id === SEDE_DEL_USUARIO);

const FILAS: Fila[] = [
  { icon: 'bag-handle-outline', titulo: 'Mis pedidos', detalle: '2 en curso · 1 listo para recoger', onPress: () => router.navigate('/pedidos' as any) },
  { icon: 'heart-outline', titulo: 'Favoritos', detalle: '6 guardados', onPress: () => router.push('/favoritos' as any) },
  { icon: 'chatbubble-outline', titulo: 'Mensajes', onPress: () => router.push('/mensajes' as any) },
  { icon: 'location-outline', titulo: 'Sede y punto de entrega', detalle: `Sede ${sede?.nombre ?? ''} · Plazoleta central`, onPress: () => router.navigate('/tiendas' as any) },
];

const FILAS_INFERIORES: Fila[] = [
  { icon: 'notifications-outline', titulo: 'Notificaciones', detalle: `${NOTIFICACIONES_SIN_LEER} sin leer`, onPress: () => router.push('/notificaciones' as any) },
  { icon: 'settings-outline', titulo: 'Ajustes', onPress: () => router.push('/cuenta/ajustes' as any) },
  { icon: 'help-circle-outline', titulo: 'Ayuda', onPress: () => router.push('/ayuda' as any) },
];

function FilaCuenta({ icon, titulo, detalle, onPress }: Fila) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={detalle ? `${titulo}, ${detalle}` : titulo}
      style={({ pressed }) => [s.fila, pressed && s.presionada]}
    >
      <View style={s.icono}>
        <Ionicons name={icon} size={20} color={Palette.ink} />
      </View>
      <View style={s.filaTextos}>
        <Text style={s.filaTitulo}>{titulo}</Text>
        {detalle ? <Text style={s.filaDetalle} numberOfLines={1}>{detalle}</Text> : null}
      </View>
      <Ionicons name="chevron-forward" size={20} color={Palette.textMuted} />
    </Pressable>
  );
}

/** Mi cuenta: perfil, accesos del comprador, cambio a perfil vendedor y cierre de sesión. */
export default function Cuenta() {
  const insets = useSafeAreaInsets();
  const navInset = useBottomNavInset();
  const sinLeer = totalSinLeer(useConversaciones(), 'compra');
  const filas = FILAS.map((f) =>
    f.titulo === 'Mensajes' ? { ...f, detalle: sinLeer > 0 ? `${sinLeer} sin leer` : 'Al día' } : f
  );

  return (
    <ScrollView
      style={s.pantalla}
      contentContainerStyle={{ paddingBottom: navInset }}
      showsVerticalScrollIndicator={false}
    >
      <Text accessibilityRole="header" style={[s.titulo, { paddingTop: insets.top + Spacing[4] }]}>Mi cuenta</Text>

      <Card style={s.perfil}>
        <Avatar size={64} />
        <View style={s.filaTextos}>
          <Text style={s.nombre} numberOfLines={1}>{USUARIO.nombre}</Text>
          <Text style={s.correo} numberOfLines={1}>{USUARIO.correo}</Text>
          {USUARIO.verificado && <Chip label="Correo verificado" icon="shield-checkmark" />}
        </View>
      </Card>

      <View style={s.grupo}>
        {filas.map((f) => (
          <FilaCuenta key={f.titulo} {...f} />
        ))}
      </View>

      {/* Modo vendedor */}
      <View style={s.vendedor}>
        <Text style={s.vendedorTitulo}>{USUARIO.tienda.nombre}</Text>
        <Text style={s.vendedorDetalle}>{USUARIO.tienda.detalle}</Text>
        <ActionButton
          label="Cambiar a perfil vendedor"
          variant="dark"
          size="sm"
          align="center"
          onPress={() => router.push('/panel' as any)}
          style={s.vendedorBoton}
        />
      </View>

      <View style={s.grupo}>
        {FILAS_INFERIORES.map((f) => (
          <FilaCuenta key={f.titulo} {...f} />
        ))}
      </View>

      <ActionButton
        label="Cerrar sesión"
        icon="log-out-outline"
        variant="dark"
        size="cta"
        align="center"
        onPress={() => router.replace('/login')}
        style={s.cerrar}
      />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: Palette.ground },
  titulo: { ...Type.title1, color: Palette.ink, paddingHorizontal: Spacing[5], paddingBottom: Spacing[4] },
  perfil: { flexDirection: 'row', alignItems: 'center', gap: Spacing[4], marginHorizontal: Spacing[5] },
  nombre: { ...Type.title3, color: Palette.ink },
  correo: { ...Type.caption, color: Palette.textMuted },
  grupo: {
    backgroundColor: Palette.card,
    borderRadius: Radius.lg,
    marginHorizontal: Spacing[5],
    marginTop: Spacing[4],
    paddingHorizontal: Spacing[3],
  },
  fila: { minHeight: 64, flexDirection: 'row', alignItems: 'center', gap: Spacing[3], paddingVertical: Spacing[2] },
  presionada: { opacity: 0.7 },
  icono: { width: 40, height: 40, borderRadius: 20, backgroundColor: Palette.lima100, alignItems: 'center', justifyContent: 'center' },
  filaTextos: { flex: 1, minWidth: 0, gap: 2 },
  filaTitulo: { ...Type.bodySm, fontFamily: FontFamily.bodyBold, color: Palette.ink },
  filaDetalle: { ...Type.caption, color: Palette.textMuted },
  vendedor: {
    backgroundColor: Palette.lima,
    borderRadius: Radius.lg,
    marginHorizontal: Spacing[5],
    marginTop: Spacing[4],
    padding: Spacing[4],
    gap: Spacing[2],
  },
  vendedorTitulo: { ...Type.title3, color: Palette.ink },
  vendedorDetalle: { ...Type.caption, color: Palette.ink },
  vendedorBoton: { alignSelf: 'stretch', marginTop: Spacing[1], height: TouchMin, borderRadius: TouchMin / 2, justifyContent: 'center' },
  cerrar: { alignSelf: 'stretch', marginHorizontal: Spacing[5], marginTop: Spacing[5] },
});
