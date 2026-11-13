import { ComponentProps } from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BottomNav } from '@/components/ui/BottomNav';

type Icono = ComponentProps<typeof Ionicons>['name'];

const icono = (name: Icono) =>
  function IconoPestana({ color, size }: { color: string; size: number }) {
    return <Ionicons name={name} size={size} color={color} />;
  };

// Pantallas que se abren por encima de las pestañas del vendedor
const OCULTAS = ['productos/nuevo', 'productos/[id]/editar', 'productos/moderacion'];
const oculta = { href: null } as const;

/**
 * Navegación del modo vendedor: Panel, Publicaciones y Mensajes. Publicar, Editar y Moderación se abren
 * encima. Se entra desde Mi cuenta o el menú lateral y se sale con "Volver a comprar" en el Panel.
 */
export default function VendedorLayout() {
  return (
    <Tabs
      backBehavior="history"
      tabBar={(props) => <BottomNav {...props} ocultas={OCULTAS} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="panel" options={{ title: 'Panel', tabBarIcon: icono('grid-outline') }} />
      <Tabs.Screen name="productos/index" options={{ title: 'Publicaciones', tabBarIcon: icono('pricetags-outline') }} />
      <Tabs.Screen name="bandeja" options={{ title: 'Mensajes', tabBarIcon: icono('chatbubble-outline') }} />
      <Tabs.Screen name="productos/nuevo" options={oculta} />
      <Tabs.Screen name="productos/[id]/editar" options={oculta} />
      <Tabs.Screen name="productos/moderacion" options={oculta} />
    </Tabs>
  );
}
