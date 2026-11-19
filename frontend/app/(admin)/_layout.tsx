import { ComponentProps } from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BottomNav } from '@/components/ui/BottomNav';

type Icono = ComponentProps<typeof Ionicons>['name'];

const icono = (name: Icono) =>
  function IconoPestana({ color, size }: { color: string; size: number }) {
    return <Ionicons name={name} size={size} color={color} />;
  };

// El detalle de un reporte se abre por encima de las pestañas
const OCULTAS = ['moderacion/[id]'];
const oculta = { href: null } as const;

/** Navegación del modo administrador: Métricas, Usuarios, Moderación y Publicaciones. */
export default function AdminLayout() {
  return (
    <Tabs
      backBehavior="history"
      tabBar={(props) => <BottomNav {...props} ocultas={OCULTAS} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="panel-admin" options={{ title: 'Métricas', tabBarIcon: icono('stats-chart-outline') }} />
      <Tabs.Screen name="usuarios/index" options={{ title: 'Usuarios', tabBarIcon: icono('people-outline') }} />
      <Tabs.Screen name="moderacion/index" options={{ title: 'Moderación', tabBarIcon: icono('shield-checkmark-outline') }} />
      <Tabs.Screen name="publicaciones/index" options={{ title: 'Publicaciones', tabBarIcon: icono('pricetags-outline') }} />
      <Tabs.Screen name="moderacion/[id]" options={oculta} />
    </Tabs>
  );
}
