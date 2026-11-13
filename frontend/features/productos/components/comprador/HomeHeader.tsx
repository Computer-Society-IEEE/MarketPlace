import { memo, useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontFamily, Palette, Radius, Spacing, TouchMin, Type } from '@/constants/theme';
import { CircleButton } from '@/components/ui/CircleButton';

type Props = {
  /** Notificaciones sin leer. Con más de 0 aparece el punto en la campana. */
  sinLeer?: number;
  /** Texto de la sede de entrega actual. Lo arma la pantalla: un feature no importa de otro. */
  entrega: string;
  /** Abre el menú lateral. La pantalla lo renderiza (vive en el módulo de cuenta). */
  onAbrirMenu: () => void;
};

const irABuscar = () => router.push('/buscar');
const irASedes = () => router.navigate('/tiendas' as any);

/**
 * Encabezado verde de Inicio: menú, buscador, notificaciones y la sede de entrega.
 * El menú lateral lo monta la pantalla de Inicio: las pantallas internas usan ScreenHeader.
 */
function HomeHeaderBase({ sinLeer = 0, entrega, onAbrirMenu }: Props) {
  const insets = useSafeAreaInsets();
  const verNotificaciones = useCallback(() => {
    router.push('/notificaciones' as any);
  }, []);

  return (
    <View style={[s.header, { paddingTop: insets.top + Spacing[3] }]}>
      <View style={s.fila}>
        <CircleButton tone="translucido" icon="menu" label="Abrir menú" onPress={onAbrirMenu} />

        <Pressable
          onPress={irABuscar}
          accessibilityRole="button"
          accessibilityLabel="Abrir búsqueda"
          style={s.busqueda}
        >
          <Ionicons name="search" size={20} color={Palette.ink} />
          <Text style={s.busquedaTexto} numberOfLines={1}>
            {'Buscar "hojas de examen"'}
          </Text>
        </Pressable>

        <CircleButton
          tone="translucido"
          icon="notifications-outline"
          label={sinLeer > 0 ? `Notificaciones, ${sinLeer} sin leer` : 'Notificaciones'}
          punto={sinLeer > 0}
          onPress={verNotificaciones}
        />
      </View>

      <Pressable
        onPress={irASedes}
        accessibilityRole="button"
        accessibilityLabel={`Cambiar sede de entrega. Actual: ${entrega}`}
        style={s.sede}
      >
        <Ionicons name="location-outline" size={18} color={Palette.ink} />
        <Text style={s.sedeTexto} numberOfLines={1}>{entrega}</Text>
        <Ionicons name="chevron-down" size={18} color={Palette.ink} />
      </Pressable>
    </View>
  );
}

export const HomeHeader = memo(HomeHeaderBase);

const s = StyleSheet.create({
  header: {
    backgroundColor: Palette.lima,
    borderBottomLeftRadius: Radius.xl,
    borderBottomRightRadius: Radius.xl,
    paddingHorizontal: Spacing[5],
    paddingBottom: Spacing[1],
    gap: 2,
  },
  fila: { flexDirection: 'row', alignItems: 'center', gap: Spacing[2] },
  busqueda: {
    flex: 1,
    minWidth: 0,
    height: TouchMin,
    borderRadius: 24,
    backgroundColor: Palette.card,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: Spacing[4],
  },
  busquedaTexto: { ...Type.body, color: Palette.textMuted, flexShrink: 1 },
  sede: {
    alignSelf: 'flex-start',
    height: TouchMin,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
    maxWidth: '100%',
  },
  sedeTexto: { ...Type.bodySm, fontFamily: FontFamily.bodyBold, color: Palette.ink, flexShrink: 1 },
});
