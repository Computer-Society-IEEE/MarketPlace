import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Palette, Radius, Spacing, Type } from '@/constants/theme';

const NAV_ALTO = 72;
const INACTIVO = '#EEF3E2'; // ícono de pestaña inactiva sobre la barra oscura (13:1)

/**
 * Espacio que una pantalla debe dejar abajo para que la barra flotante no tape el final del contenido.
 * Úsalo en `contentContainerStyle={{ paddingBottom: useBottomNavInset() }}`.
 */
export function useBottomNavInset() {
  const { bottom } = useSafeAreaInsets();
  return NAV_ALTO + bottom + Spacing[3] + Spacing[4];
}

/**
 * Barra de navegación inferior del diseño: píldora oscura flotante. Solo la pestaña activa muestra
 * su texto, sobre una píldora lima. Es genérica: toma título, ícono e insignia de las opciones de
 * cada `Tabs.Screen`, así que agregar una pestaña no obliga a tocar este archivo.
 */
export function BottomNav({
  state,
  descriptors,
  navigation,
  ocultas = [],
}: BottomTabBarProps & { ocultas?: string[] }) {
  const { bottom } = useSafeAreaInsets();
  // Las pantallas listadas en `ocultas` (búsqueda, detalle...) no son pestañas y esconden la barra
  const esPestana = (nombre: string) => !ocultas.includes(nombre);
  if (!esPestana(state.routes[state.index].name)) return null;

  return (
    <View pointerEvents="box-none" style={[s.contenedor, { bottom: bottom + Spacing[3] }]}>
      <View accessibilityRole="tablist" style={s.barra}>
        {state.routes.map((route, index) => {
          if (!esPestana(route.name)) return null;
          const { options } = descriptors[route.key];
          const activa = state.index === index;
          const label = options.title ?? route.name;
          const color = activa ? Palette.ink : INACTIVO;

          const alPresionar = () => {
            const evento = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!activa && !evento.defaultPrevented) navigation.navigate(route.name, route.params);
          };

          return (
            <Pressable
              key={route.key}
              onPress={alPresionar}
              accessibilityRole="tab"
              aria-selected={activa}
              accessibilityLabel={options.tabBarAccessibilityLabel ?? label}
              style={activa ? s.itemActivo : s.item}
            >
              <View>
                {options.tabBarIcon?.({ focused: activa, color, size: 22 })}
                {options.tabBarBadge != null && (
                  <View style={s.insignia}>
                    <Text style={s.insigniaTexto}>{options.tabBarBadge}</Text>
                  </View>
                )}
              </View>
              {activa && <Text style={s.label}>{label}</Text>}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  contenedor: { position: 'absolute', left: Spacing[5], right: Spacing[5] },
  barra: {
    height: NAV_ALTO,
    padding: Spacing[2],
    borderRadius: 36,
    backgroundColor: Palette.ink,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[1],
    shadowColor: Palette.ink,
    shadowOpacity: 0.28,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 14 },
    elevation: 10,
  },
  item: { flex: 1, minWidth: 48, height: 56, alignItems: 'center', justifyContent: 'center' },
  itemActivo: {
    height: 56,
    paddingLeft: Spacing[4],
    paddingRight: 18,
    borderRadius: 28,
    backgroundColor: Palette.lima,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
  },
  label: { ...Type.bodySm, fontFamily: Type.label.fontFamily, color: Palette.ink },
  insignia: {
    position: 'absolute',
    top: -6,
    right: -10,
    minWidth: 20,
    height: 20,
    paddingHorizontal: 5,
    borderRadius: Radius.full,
    backgroundColor: Palette.lima,
    alignItems: 'center',
    justifyContent: 'center',
  },
  insigniaTexto: { ...Type.label, color: Palette.ink },
});
