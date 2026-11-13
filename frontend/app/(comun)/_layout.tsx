import { Stack } from 'expo-router';

/** Pantallas compartidas entre roles: se abren por encima de las pestañas, sin barra inferior. */
export default function ComunLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
