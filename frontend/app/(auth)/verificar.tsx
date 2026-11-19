import { useCallback, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { iniciarSesion } from '@/features/auth/store/sesion';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontFamily, Palette, Radius, Spacing, TouchMin, Type } from '@/constants/theme';
import { ActionButton } from '@/components/ui/ActionButton';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { DOMINIO_INSTITUCIONAL } from '@/features/auth/services/validacion';
import { useCuentaRegresiva } from '@/features/auth/hooks/useCuentaRegresiva';

const LARGO_CODIGO = 6;
const ESPERA_REENVIO = 42;
const CASILLAS = Array.from({ length: LARGO_CODIGO }, (_, i) => i);

const cambiarCorreo = () => router.replace('/registro');

/** Verificación del correo institucional con un código de 6 dígitos. */
export default function Verificar() {
  const insets = useSafeAreaInsets();
  const { correo: correoParam } = useLocalSearchParams<{ correo?: string }>();
  const correo = correoParam || `tucorreo${DOMINIO_INSTITUCIONAL}`;
  const entrada = useRef<TextInput>(null);
  const [codigo, setCodigo] = useState('');
  const [error, setError] = useState('');
  const espera = useCuentaRegresiva(ESPERA_REENVIO);

  const alEscribir = useCallback((t: string) => {
    setCodigo(t.replace(/\D/g, '').slice(0, LARGO_CODIGO));
    setError('');
  }, []);

  const verificar = useCallback(() => {
    if (codigo.length < LARGO_CODIGO) {
      setError('Escribe los 6 dígitos del código.');
      return;
    }
    // TODO: validar el código con la API
    iniciarSesion();
    router.replace('/inicio' as any);
  }, [codigo]);

  const reenviar = useCallback(() => {
    // TODO: pedir un código nuevo a la API
    setCodigo('');
    setError('');
    espera.reiniciar();
  }, [espera]);

  const enfocar = useCallback(() => entrada.current?.focus(), []);

  return (
    <KeyboardAvoidingView style={s.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        style={s.pantalla}
        contentContainerStyle={[s.contenido, { paddingBottom: insets.bottom + Spacing[6] }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader title="Verificación" onBack={cambiarCorreo} />

        <View style={s.cuerpo}>
          <View style={s.icono}>
            <Ionicons name="mail-open-outline" size={32} color={Palette.ink} />
          </View>
          <Text accessibilityRole="header" style={s.titulo}>Revisa tu correo</Text>
          <Text style={s.texto}>
            {'Enviamos un código de 6 dígitos a '}
            <Text style={s.correo}>{correo}</Text>
            {'. Vence en 10 minutos.'}
          </Text>

          <Pressable onPress={enfocar} accessibilityLabel="Código de verificación" style={s.casillas}>
            {CASILLAS.map((i) => {
              const activa = i === Math.min(codigo.length, LARGO_CODIGO - 1);
              return (
                <View key={i} style={[s.casilla, activa && s.casillaActiva, !!error && s.casillaError]}>
                  <Text style={s.digito}>{codigo[i] ?? ''}</Text>
                </View>
              );
            })}
            <TextInput
              ref={entrada}
              value={codigo}
              onChangeText={alEscribir}
              keyboardType="number-pad"
              autoComplete="one-time-code"
              textContentType="oneTimeCode"
              maxLength={LARGO_CODIGO}
              autoFocus
              caretHidden
              style={s.oculto}
            />
          </Pressable>

          {error ? (
            <View style={s.filaError} accessibilityLiveRegion="polite">
              <Ionicons name="alert-circle-outline" size={16} color={Palette.danger} />
              <Text style={s.error}>{error}</Text>
            </View>
          ) : null}

          <ActionButton label="Verificar" size="cta" align="center" onPress={verificar} style={s.boton} />

          {espera.restante > 0 ? (
            <Text style={s.espera}>{`Reenviar código en ${espera.texto}`}</Text>
          ) : (
            <Pressable accessibilityRole="button" onPress={reenviar} style={s.areaToque}>
              <Text style={s.enlace}>Reenviar código</Text>
            </Pressable>
          )}
          <Pressable accessibilityRole="link" onPress={cambiarCorreo} style={s.areaToque}>
            <Text style={[s.enlace, s.enlaceSecundario]}>Cambiar correo</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  flex: { flex: 1 },
  pantalla: { flex: 1, backgroundColor: Palette.ground },
  contenido: { flexGrow: 1 },
  cuerpo: { paddingHorizontal: Spacing[6], paddingTop: Spacing[8], alignItems: 'center', gap: Spacing[3] },
  icono: {
    width: 72,
    height: 72,
    borderRadius: Radius.full,
    backgroundColor: Palette.lima,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titulo: { ...Type.title1, color: Palette.ink, textAlign: 'center' },
  texto: { ...Type.bodyLg, color: Palette.textMuted, textAlign: 'center' },
  correo: { fontFamily: FontFamily.bodyBold, color: Palette.ink },
  casillas: { flexDirection: 'row', gap: Spacing[2], marginTop: Spacing[4] },
  casilla: {
    width: 46,
    height: 56,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Palette.border,
    backgroundColor: Palette.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  casillaActiva: { borderWidth: 2, borderColor: Palette.ink },
  casillaError: { borderColor: Palette.danger },
  digito: { ...Type.title2, color: Palette.ink },
  oculto: { position: 'absolute', width: 1, height: 1, opacity: 0 },
  filaError: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  error: { ...Type.caption, fontFamily: FontFamily.bodyBold, color: Palette.danger },
  boton: { alignSelf: 'stretch', marginTop: Spacing[3] },
  espera: { ...Type.bodySm, color: Palette.textMuted, minHeight: TouchMin, textAlignVertical: 'center', paddingTop: Spacing[3] },
  areaToque: { minHeight: TouchMin, paddingHorizontal: Spacing[1], justifyContent: 'center' },
  enlace: { ...Type.body, fontFamily: FontFamily.bodyBold, color: Palette.ink, textDecorationLine: 'underline' },
  enlaceSecundario: { color: Palette.textMuted },
});
