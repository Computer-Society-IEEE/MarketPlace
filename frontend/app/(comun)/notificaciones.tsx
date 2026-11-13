import { ComponentProps, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useBottomNavInset } from '@/components/ui/BottomNav';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { FilterChip } from '@/components/ui/FilterChip';
import { FontFamily, Palette, Radius, Spacing, Type } from '@/constants/theme';

type Icono = ComponentProps<typeof Ionicons>['name'];
type Grupo = 'Pedidos' | 'Mensajes' | 'Avisos';

type Notificacion = {
  id: string;
  grupo: Grupo;
  dia: 'Hoy' | 'Ayer';
  icon: Icono;
  titulo: string;
  detalle: string;
  hora: string;
  sinLeer?: boolean;
};

// Datos de ejemplo del diseño. Cuando exista la API, esto pasa a ser una llamada.
const NOTIFICACIONES: Notificacion[] = [
  { id: '1', grupo: 'Pedidos', dia: 'Hoy', icon: 'bag-check-outline', titulo: 'Tu pedido está listo para recoger', detalle: 'Empanadas de Andrés · Entrada de la calle 40 hasta las 2:00 p. m.', hora: '12:20 p. m.', sinLeer: true },
  { id: '2', grupo: 'Mensajes', dia: 'Hoy', icon: 'chatbubble-outline', titulo: 'Nuevo mensaje de Andrés', detalle: 'Empanadas de Andrés: Ya está listo, te espero en la entrada de la calle 40.', hora: '12:20 p. m.', sinLeer: true },
  { id: '3', grupo: 'Pedidos', dia: 'Hoy', icon: 'time-outline', titulo: 'TecnoUD está preparando tu pedido', detalle: 'Calculadora científica · Hoy, 12:30 p. m.', hora: '11:58 a. m.', sinLeer: true },
  { id: '4', grupo: 'Pedidos', dia: 'Ayer', icon: 'star-outline', titulo: 'Califica tu compra', detalle: 'Empanadas de pollo x3 · Empanadas de Andrés', hora: '6:10 p. m.' },
  { id: '5', grupo: 'Avisos', dia: 'Ayer', icon: 'megaphone-outline', titulo: 'Cambio de horario', detalle: 'Papelería La 40 cierra a las 4:00 p. m. el viernes.', hora: '9:30 a. m.' },
];

const FILTROS: (Grupo | 'Todas')[] = ['Todas', 'Pedidos', 'Mensajes', 'Avisos'];

export default function Notificaciones() {
  const navInset = useBottomNavInset();
  const [filtro, setFiltro] = useState<Grupo | 'Todas'>('Todas');

  const visibles = useMemo(
    () => NOTIFICACIONES.filter((n) => filtro === 'Todas' || n.grupo === filtro),
    [filtro]
  );

  return (
    <ScrollView
      style={s.pantalla}
      contentContainerStyle={{ paddingBottom: navInset }}
      showsVerticalScrollIndicator={false}
    >
      <ScreenHeader title="Notificaciones" />

      <View style={s.chips}>
        {FILTROS.map((f) => (
          <FilterChip key={f} label={f} selected={filtro === f} onPress={() => setFiltro(f)} />
        ))}
      </View>

      {(['Hoy', 'Ayer'] as const).map((dia) => {
        const items = visibles.filter((n) => n.dia === dia);
        if (items.length === 0) return null;
        return (
          <View key={dia} style={s.seccion}>
            <Text accessibilityRole="header" style={s.dia}>{dia}</Text>
            <View style={s.lista}>
              {items.map((n) => (
                <View
                  key={n.id}
                  accessible
                  accessibilityLabel={`${n.sinLeer ? 'Sin leer. ' : ''}${n.titulo}. ${n.detalle}. ${n.hora}`}
                  style={s.fila}
                >
                  <View style={s.icono}>
                    <Ionicons name={n.icon} size={20} color={Palette.ink} />
                  </View>
                  <View style={s.textos}>
                    <Text style={[s.titulo, n.sinLeer && s.tituloSinLeer]}>{n.titulo}</Text>
                    <Text style={s.detalle}>{n.detalle}</Text>
                  </View>
                  <View style={s.derecha}>
                    <Text style={s.hora}>{n.hora}</Text>
                    {n.sinLeer && <View style={s.punto} />}
                  </View>
                </View>
              ))}
            </View>
          </View>
        );
      })}

      {visibles.length === 0 && <Text style={s.vacio}>No tienes notificaciones en esta lista.</Text>}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: Palette.ground },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing[2], paddingHorizontal: Spacing[5], marginTop: Spacing[4] },
  seccion: { marginTop: Spacing[5], paddingHorizontal: Spacing[5] },
  dia: { ...Type.title3, color: Palette.ink, marginBottom: Spacing[3] },
  lista: { backgroundColor: Palette.card, borderRadius: Radius.lg, paddingHorizontal: Spacing[3] },
  fila: {
    flexDirection: 'row',
    gap: Spacing[3],
    paddingVertical: Spacing[3],
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Palette.line,
  },
  icono: { width: 40, height: 40, borderRadius: 20, backgroundColor: Palette.lima100, alignItems: 'center', justifyContent: 'center' },
  textos: { flex: 1, minWidth: 0, gap: 2 },
  titulo: { ...Type.bodySm, color: Palette.ink },
  tituloSinLeer: { fontFamily: FontFamily.bodyBold },
  detalle: { ...Type.caption, color: Palette.textMuted },
  derecha: { alignItems: 'flex-end', gap: 6 },
  hora: { ...Type.caption, color: Palette.textMuted },
  punto: { width: 10, height: 10, borderRadius: 5, backgroundColor: Palette.ink },
  vacio: { ...Type.body, color: Palette.textMuted, textAlign: 'center', marginTop: Spacing[8] },
});
