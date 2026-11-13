import { memo, useCallback } from 'react';
import { Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Palette, Spacing, Type } from '@/constants/theme';
import { Chip } from '@/components/ui/Chip';
import { Sede } from './sedes';

const FOTO = 104;

type Props = {
  sede: Sede;
  /** Marca la tarjeta con borde y el chip "Tu sede". */
  esTuSede?: boolean;
  /** Recibe el id: así el padre pasa una sola función estable para toda la lista. */
  onPress: (id: string) => void;
  style?: StyleProp<ViewStyle>;
};

function SedeCardBase({ sede, esTuSede = false, onPress, style }: Props) {
  const alPresionar = useCallback(() => onPress(sede.id), [onPress, sede.id]);
  const total = `${sede.tiendas} ${sede.tiendas === 1 ? 'tienda' : 'tiendas'}`;

  return (
    <Pressable
      onPress={alPresionar}
      accessibilityRole="button"
      accessibilityLabel={`${sede.nombre}. ${sede.zona}. ${total}${esTuSede ? '. Tu sede' : ''}`}
      style={({ pressed }) => [s.tarjeta, esTuSede && s.tuSede, pressed && s.presionada, style]}
    >
      {sede.imagen ? (
        <Image
          source={sede.imagen}
          style={s.foto}
          contentFit="cover"
          transition={150}
          accessibilityLabel={`Foto de la sede ${sede.nombre}`}
        />
      ) : (
        <View style={[s.foto, s.fotoVacia]}>
          <Ionicons name="image-outline" size={28} color={Palette.textMuted} />
        </View>
      )}

      <View style={s.textos}>
        <Text style={s.nombre} numberOfLines={1}>{sede.nombre}</Text>
        <Text style={s.zona} numberOfLines={1}>{sede.zona}</Text>

        <View style={s.chips}>
          <Chip label={total} icon="storefront-outline" />
          {esTuSede && <Chip label="Tu sede" tone="oscuro" />}
        </View>
      </View>

      <Ionicons name="chevron-forward" size={20} color={Palette.textMuted} />
    </Pressable>
  );
}

// memo: la lista pasa la misma función y el mismo objeto sede, así que no se repinta al hacer scroll
export const SedeCard = memo(SedeCardBase);

const s = StyleSheet.create({
  tarjeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 10,
    paddingRight: 14,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: 'transparent', // reserva el borde para que "Tu sede" no mueva el contenido
    backgroundColor: Palette.card,
  },
  tuSede: { borderColor: Palette.ink },
  presionada: { opacity: 0.7 },
  foto: { width: FOTO, height: FOTO, borderRadius: 16 },
  fotoVacia: { backgroundColor: Palette.lima100, alignItems: 'center', justifyContent: 'center' },
  textos: { flex: 1, gap: Spacing[1] },
  nombre: { ...Type.title3, fontSize: 16, color: Palette.ink },
  zona: { ...Type.bodySm, color: Palette.textMuted },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: Spacing[1] },
});
