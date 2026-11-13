import { ComponentProps, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Avatar } from '@/components/ui/UserRow';
import { FontFamily, Palette, Radius, Spacing, Type } from '@/constants/theme';
import { USUARIO } from '@/features/cuenta/services/usuario';
import { SEDES, SEDE_DEL_USUARIO } from '@/features/sedes/services/sedes';

type Icono = ComponentProps<typeof Ionicons>['name'];

const AVISOS: { clave: string; icon: Icono; titulo: string; detalle: string }[] = [
  { clave: 'pedidos', icon: 'bag-handle-outline', titulo: 'Pedidos', detalle: 'Cuando tu pedido cambia de estado' },
  { clave: 'mensajes', icon: 'chatbubble-outline', titulo: 'Mensajes', detalle: 'Cuando un vendedor o comprador te escribe' },
  { clave: 'avisos', icon: 'megaphone-outline', titulo: 'Avisos de tiendas', detalle: 'Cambios de horario y productos que vuelven' },
];

/** Ajustes: avisos que se reciben, sede de entrega y datos de la cuenta. */
export default function Ajustes() {
  const insets = useSafeAreaInsets();
  const [activos, setActivos] = useState<Record<string, boolean>>({ pedidos: true, mensajes: true, avisos: true });
  const sede = SEDES.find((x) => x.id === SEDE_DEL_USUARIO);

  return (
    <ScrollView style={s.pantalla} contentContainerStyle={{ paddingBottom: insets.bottom + Spacing[8] }} showsVerticalScrollIndicator={false}>
      <ScreenHeader title="Ajustes" />
      <View style={s.contenido}>
        <View style={s.perfil}>
          <Avatar size={56} />
          <View style={s.textos}>
            <Text style={s.nombre} numberOfLines={1}>{USUARIO.nombre}</Text>
            <Text style={s.detalle} numberOfLines={1}>{USUARIO.correo}</Text>
          </View>
        </View>

        <SectionHeader title="Avisos" />
        <View style={s.grupo}>
          {AVISOS.map((a) => (
            <View key={a.clave} style={s.fila}>
              <View style={s.icono}>
                <Ionicons name={a.icon} size={20} color={Palette.ink} />
              </View>
              <View style={s.textos}>
                <Text style={s.titulo}>{a.titulo}</Text>
                <Text style={s.detalle}>{a.detalle}</Text>
              </View>
              <Switch
                value={activos[a.clave]}
                onValueChange={(v) => setActivos((x) => ({ ...x, [a.clave]: v }))}
                accessibilityLabel={`Avisos de ${a.titulo}`}
                trackColor={{ false: Palette.border, true: Palette.green600 }}
                thumbColor="#FFFFFF"
              />
            </View>
          ))}
        </View>

        <SectionHeader title="Entrega" />
        <Pressable
          onPress={() => router.navigate('/tiendas' as any)}
          accessibilityRole="button"
          accessibilityLabel={`Sede de entrega, Sede ${sede?.nombre ?? ''}`}
          style={[s.grupo, s.fila]}
        >
          <View style={s.icono}>
            <Ionicons name="location-outline" size={20} color={Palette.ink} />
          </View>
          <View style={s.textos}>
            <Text style={s.titulo}>Sede de entrega</Text>
            <Text style={s.detalle}>{`Sede ${sede?.nombre ?? ''}`}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Palette.textMuted} />
        </Pressable>

        <Pressable onPress={() => router.push('/ayuda' as any)} accessibilityRole="button" style={[s.grupo, s.fila]}>
          <View style={s.icono}>
            <Ionicons name="help-circle-outline" size={20} color={Palette.ink} />
          </View>
          <View style={s.textos}>
            <Text style={s.titulo}>Ayuda</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Palette.textMuted} />
        </Pressable>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: Palette.ground },
  contenido: { paddingHorizontal: Spacing[5], paddingTop: Spacing[4], gap: Spacing[3] },
  perfil: { flexDirection: 'row', alignItems: 'center', gap: Spacing[3], backgroundColor: Palette.card, borderRadius: Radius.lg, padding: Spacing[4] },
  grupo: { backgroundColor: Palette.card, borderRadius: Radius.lg, paddingHorizontal: Spacing[3] },
  fila: { minHeight: 64, flexDirection: 'row', alignItems: 'center', gap: Spacing[3], paddingVertical: Spacing[2] },
  icono: { width: 40, height: 40, borderRadius: 20, backgroundColor: Palette.lima100, alignItems: 'center', justifyContent: 'center' },
  textos: { flex: 1, minWidth: 0, gap: 2 },
  nombre: { ...Type.title3, color: Palette.ink },
  titulo: { ...Type.bodySm, fontFamily: FontFamily.bodyBold, color: Palette.ink },
  detalle: { ...Type.caption, color: Palette.textMuted },
});
