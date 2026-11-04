import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { Archivo_700Bold, Archivo_800ExtraBold, useFonts as useArchivo } from '@expo-google-fonts/archivo';
import { DMSans_400Regular, DMSans_500Medium, DMSans_700Bold, useFonts as useDMSans } from '@expo-google-fonts/dm-sans';

import { Palette } from '@/constants/theme';

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: 'index',
};

const AppTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: Palette.ink,
    background: Palette.ground,
    card: Palette.card,
    text: Palette.ink,
    border: Palette.line,
    notification: Palette.danger,
  },
};


export default function RootLayout() {
  const [archivoLoaded] = useArchivo({ Archivo_700Bold, Archivo_800ExtraBold });
  const [dmSansLoaded] = useDMSans({ DMSans_400Regular, DMSans_500Medium, DMSans_700Bold });
  const fontsReady = archivoLoaded && dmSansLoaded;
    useEffect(() => {
    if (fontsReady) SplashScreen.hideAsync();
  }, [fontsReady]);

  if (!fontsReady) return null;
  return (
    <ThemeProvider value={AppTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="intro" />
        <Stack.Screen name="login" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="modal"
          options={{ presentation: 'modal', headerShown: true, title: 'Modal' }}
        />
      </Stack>
      <StatusBar style="dark" />
    </ThemeProvider>
  );
}
