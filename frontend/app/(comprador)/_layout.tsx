import { ComponentProps } from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BottomNav } from '@/components/ui/BottomNav';

type Icono = ComponentProps<typeof Ionicons>['name'];

// Una función por pestaña, creada una sola vez (no en cada render)
const icono = (name: Icono) =>
  function IconoPestana({ color, size }: { color: string; size: number }) {
    return <Ionicons name={name} size={size} color={color} />;
  };

// Pantallas que se abren por encima de las pestañas: no aparecen en la barra y la ocultan
const OCULTAS = [
  'buscar/index',
  'producto/[id]/index',
  'producto/[id]/resenas',
  'sede/[id]',
  'favoritos',
  'mensajes',
  'pedidos/[id]/index',
  'pedidos/[id]/calificar',
];
const oculta = { href: null } as const;

/**
 * Navegación del comprador. Para sumar una pestaña: crear su archivo aquí
 * y declarar su `Tabs.Screen` con título e ícono. Una pantalla interna se declara con `oculta` y se añade a OCULTAS.
 */
export default function CompradorLayout() {
  return (
    <Tabs
      backBehavior="history"
      tabBar={(props) => <BottomNav {...props} ocultas={OCULTAS} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="inicio" options={{ title: 'Inicio', tabBarIcon: icono('home-outline') }} />
      <Tabs.Screen name="tiendas" options={{ title: 'Tiendas', tabBarIcon: icono('storefront-outline') }} />
      <Tabs.Screen name="pedidos/index" options={{ title: 'Pedidos', tabBarIcon: icono('bag-handle-outline') }} />
      <Tabs.Screen name="cuenta" options={{ title: 'Cuenta', tabBarIcon: icono('person-outline') }} />
      <Tabs.Screen name="buscar/index" options={oculta} />
      <Tabs.Screen name="producto/[id]/index" options={oculta} />
      <Tabs.Screen name="producto/[id]/resenas" options={oculta} />
      <Tabs.Screen name="sede/[id]" options={oculta} />
      <Tabs.Screen name="favoritos" options={oculta} />
      <Tabs.Screen name="mensajes" options={oculta} />
      <Tabs.Screen name="pedidos/[id]/index" options={oculta} />
      <Tabs.Screen name="pedidos/[id]/calificar" options={oculta} />
    </Tabs>
  );
}
