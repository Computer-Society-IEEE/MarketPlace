import { useCallback, useMemo, useState } from 'react';
import { FlatList, ListRenderItem, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useBottomNavInset } from '@/components/ui/BottomNav';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { FilterChip } from '@/components/ui/FilterChip';
import { Avatar } from '@/components/ui/UserRow';
import { FontFamily, Palette, Spacing, TouchMin, Type } from '@/constants/theme';
import { Conversacion, Rol, totalSinLeer, useConversaciones } from '../store/conversaciones';

type Props = { rol: Extract<Rol, 'compra' | 'venta'> };

const keyExtractor = (c: Conversacion) => c.id;

/** Bandeja de mensajes. Una sola pantalla para el comprador (compras) y el vendedor (ventas). */
export function Bandeja({ rol }: Props) {
  const navInset = useBottomNavInset();
  const todas = useConversaciones();
  const [soloSinLeer, setSoloSinLeer] = useState(false);

  const propias = useMemo(() => todas.filter((c) => c.rol === rol), [todas, rol]);
  const sinLeer = totalSinLeer(todas, rol);
  const visibles = soloSinLeer ? propias.filter((c) => c.sinLeer > 0) : propias;

  const abrir = useCallback((id: string) => {
    router.push({ pathname: '/mensajes/[id]' as any, params: { id } });
  }, []);

  const renderItem: ListRenderItem<Conversacion> = useCallback(
    ({ item }) => {
      const ultimo = item.mensajes[item.mensajes.length - 1];
      return (
        <Pressable
          onPress={() => abrir(item.id)}
          accessibilityRole="button"
          accessibilityLabel={`${item.sinLeer > 0 ? `${item.sinLeer} sin leer. ` : ''}${item.nombre}. ${ultimo?.texto ?? ''}`}
          style={({ pressed }) => [s.fila, pressed && s.presionada]}
        >
          <Avatar size={48} />
          <View style={s.textos}>
            <View style={s.filaTitulo}>
              <Text style={[s.nombre, item.sinLeer > 0 && s.nombreSinLeer]} numberOfLines={1}>
                {item.nombre}
              </Text>
              <Text style={s.hora}>{ultimo?.hora}</Text>
            </View>
            {item.contexto ? (
              <Text style={s.contexto} numberOfLines={1}>
                {item.contexto}
              </Text>
            ) : null}
            <View style={s.filaTitulo}>
              <Text style={[s.ultimo, item.sinLeer > 0 && s.ultimoSinLeer]} numberOfLines={1}>
                {ultimo ? `${ultimo.de === 'yo' ? 'Tú: ' : ''}${ultimo.texto}` : 'Escribe el primer mensaje'}
              </Text>
              {item.sinLeer > 0 && (
                <View style={s.contador}>
                  <Text style={s.contadorTexto}>{item.sinLeer}</Text>
                </View>
              )}
            </View>
          </View>
        </Pressable>
      );
    },
    [abrir]
  );

  const encabezado = (
    <View>
      <ScreenHeader title={rol === 'venta' ? 'Mensajes de compradores' : 'Mensajes'} />
      <View style={s.chips}>
        <FilterChip label="Todos" selected={!soloSinLeer} onPress={() => setSoloSinLeer(false)} />
        <FilterChip label={`Sin leer · ${sinLeer}`} selected={soloSinLeer} onPress={() => setSoloSinLeer(true)} />
      </View>
    </View>
  );

  return (
    <FlatList
      style={s.pantalla}
      contentContainerStyle={{ paddingBottom: navInset }}
      data={visibles}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      ListHeaderComponent={encabezado}
      ListEmptyComponent={
        <Text style={s.vacio}>
          {soloSinLeer
            ? 'No tienes mensajes sin leer.'
            : rol === 'venta'
              ? 'Cuando alguien se interese en una publicación tuya, la conversación aparece aquí.'
              : 'Cuando escribas a un vendedor, la conversación aparece aquí.'}
        </Text>
      }
      showsVerticalScrollIndicator={false}
    />
  );
}

const s = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: Palette.ground },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing[2], paddingHorizontal: Spacing[5], marginTop: Spacing[4], marginBottom: Spacing[2] },
  fila: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    paddingHorizontal: Spacing[5],
    paddingVertical: Spacing[3],
  },
  presionada: { backgroundColor: Palette.lima100 },
  textos: { flex: 1, minWidth: 0, gap: 2 },
  filaTitulo: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: Spacing[2] },
  nombre: { ...Type.bodySm, color: Palette.ink, flex: 1 },
  nombreSinLeer: { fontFamily: FontFamily.bodyBold },
  hora: { ...Type.caption, color: Palette.textMuted },
  contexto: { ...Type.caption, color: Palette.green700, fontFamily: FontFamily.bodyBold },
  ultimo: { ...Type.caption, color: Palette.textMuted, flex: 1 },
  ultimoSinLeer: { color: Palette.ink, fontFamily: FontFamily.bodyBold },
  contador: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    paddingHorizontal: 6,
    backgroundColor: Palette.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contadorTexto: { ...Type.label, color: Palette.lima },
  vacio: { ...Type.body, color: Palette.textMuted, textAlign: 'center', marginTop: Spacing[8], marginHorizontal: Spacing[6], minHeight: TouchMin },
});
