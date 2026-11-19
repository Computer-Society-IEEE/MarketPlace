import { useCallback, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontFamily, Palette, Radius, Spacing, TouchMin, Type } from '@/constants/theme';
import { ActionButton } from '@/components/ui/ActionButton';
import { FormField } from '@/components/ui/FormField';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { DOMINIO_INSTITUCIONAL, esCorreoInstitucional } from '@/features/auth/services/validacion';
import { useCuentaRegresiva } from '@/features/auth/hooks/useCuentaRegresiva';

const ESPERA_REENVIO = 58;
const volverAIngresar = () => router.replace('/login');

/** Recuperar contraseña: formulario de correo y, al enviar, el estado "Enlace enviado". */
export default function Recuperar() {
  const insets = useSafeAreaInsets();
  const [correo, setCorreo] = useState('');
  const [error, setError] = useState('');
  const [enviado, setEnviado] = useState(false);
  const espera = useCuentaRegresiva(ESPERA_REENVIO);

  const alEscribir = useCallback((t: string) => {
    setCorreo(t);
    setError('');
  }, []);

  const enviar = useCallback(() => {
    if (!esCorreoInstitucional(correo)) {
      setError(`Escribe tu correo institucional, termina en ${DOMINIO_INSTITUCIONAL}.`);
      return;
    }
    // TODO: pedir el enlace a la API (la respuesta no revela si el correo existe)
    setEnviado(true);
    espera.reiniciar();
  }, [correo, espera]);

  const reenviar = useCallback(() => {
    // TODO: reenviar el enlace con la API
    espera.reiniciar();
  }, [espera]);

  const usarOtro = useCallback(() => {
    setEnviado(false);
    setCorreo('');
  }, []);

  return (
    <KeyboardAvoidingView style={s.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        style={s.pantalla}
        contentContainerStyle={[s.contenido, { paddingBottom: insets.bottom + Spacing[6] }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader title="Recuperar contraseña" onBack={volverAIngresar} />

        {enviado ? (
          <View style={[s.cuerpo, s.centro]}>
            <View style={s.icono}>
              <Ionicons name="checkmark-circle-outline" size={36} color={Palette.success} />
            </View>
            <Text accessibilityRole="header" style={s.titulo}>Enlace enviado</Text>
            <Text style={[s.texto, s.textoCentro]}>
              {'Si '}
              <Text style={s.negrita}>{correo.trim()}</Text>
              {' está registrado, recibirás un enlace válido por 30 minutos. Revisa también la carpeta de no deseados.'}
            </Text>

            <ActionButton label="Volver a ingresar" size="cta" align="center" onPress={volverAIngresar} style={s.boton} />

            {espera.restante > 0 ? (
              <Text style={s.espera}>{`Reenviar en ${espera.texto}`}</Text>
            ) : (
              <Pressable accessibilityRole="button" onPress={reenviar} style={s.areaToque}>
                <Text style={s.enlace}>Reenviar enlace</Text>
              </Pressable>
            )}
            <Pressable accessibilityRole="link" onPress={usarOtro} style={s.areaToque}>
              <Text style={[s.enlace, s.enlaceSecundario]}>Usar otro correo</Text>
            </Pressable>
          </View>
        ) : (
          <View style={s.cuerpo}>
            <Text accessibilityRole="header" style={s.titulo}>Recupera tu contraseña</Text>
            <Text style={s.texto}>Escribe tu correo institucional y te enviamos un enlace para crear una nueva.</Text>

            <FormField
              label="Correo institucional"
              icon="mail-outline"
              placeholder={`tucorreo${DOMINIO_INSTITUCIONAL}`}
              value={correo}
              onChangeText={alEscribir}
              error={error}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect={false}
            />

            <ActionButton label="Enviar enlace" icon="send-outline" size="cta" align="center" onPress={enviar} style={s.boton} />
            <Pressable accessibilityRole="link" onPress={volverAIngresar} style={[s.areaToque, s.centrado]}>
              <Text style={s.enlace}>Volver a ingresar</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  flex: { flex: 1 },
  pantalla: { flex: 1, backgroundColor: Palette.ground },
  contenido: { flexGrow: 1 },
  cuerpo: { paddingHorizontal: Spacing[6], paddingTop: Spacing[8], gap: Spacing[4] },
  centro: { alignItems: 'center', gap: Spacing[3] },
  icono: {
    width: 72,
    height: 72,
    borderRadius: Radius.full,
    backgroundColor: Palette.successBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titulo: { ...Type.title1, color: Palette.ink },
  texto: { ...Type.bodyLg, color: Palette.textMuted },
  textoCentro: { textAlign: 'center' },
  negrita: { fontFamily: FontFamily.bodyBold, color: Palette.ink },
  boton: { alignSelf: 'stretch' },
  espera: { ...Type.bodySm, color: Palette.textMuted, paddingVertical: Spacing[3] },
  areaToque: { minHeight: TouchMin, paddingHorizontal: Spacing[1], justifyContent: 'center' },
  centrado: { alignSelf: 'center' },
  enlace: { ...Type.body, fontFamily: FontFamily.bodyBold, color: Palette.ink, textDecorationLine: 'underline' },
  enlaceSecundario: { color: Palette.textMuted },
});
