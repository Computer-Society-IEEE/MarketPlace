import { useCallback, useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontFamily, Palette, Radius, Spacing, TouchMin, Type } from '@/constants/theme';
import { ActionButton } from '@/components/ui/ActionButton';
import { Checkbox } from '@/components/ui/Checkbox';
import { FormField } from '@/components/ui/FormField';
import { PasswordField } from '@/components/ui/PasswordField';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { RequisitosClave } from '@/features/auth/RequisitosClave';
import {
  DOMINIO_INSTITUCIONAL,
  esCorreoInstitucional,
  evaluarClave,
} from '@/features/auth/validacion';

const irAlLogin = () => router.replace('/login');

export default function Registro() {
  const insets = useSafeAreaInsets();
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');
  const [acepto, setAcepto] = useState(false);

  // Se recalculan solo cuando cambia su propio dato
  const reglas = useMemo(() => evaluarClave(clave), [clave]);
  const correoValido = useMemo(() => esCorreoInstitucional(correo), [correo]);

  const errorCorreo =
    correo.length > 0 && !correoValido
      ? `Ese correo no es institucional. Debe terminar en ${DOMINIO_INSTITUCIONAL}.`
      : undefined;

  const listo = nombre.trim().length > 1 && correoValido && reglas.valida && acepto;

  const crearCuenta = useCallback(() => {
    // TODO: registrar y enviar el código de verificación al correo
  }, []);

  return (
    <KeyboardAvoidingView style={s.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        style={s.pantalla}
        contentContainerStyle={{ paddingBottom: insets.bottom + Spacing[6] }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader title="Registro" />

        <View style={s.intro}>
          <Text accessibilityRole="header" style={s.titulo}>Crea tu cuenta</Text>
          <Text style={s.subtitulo}>
            Solo con correo institucional de la Universidad Distrital. Así todos los vendedores son
            estudiantes verificados.
          </Text>
        </View>

        <View style={s.tarjeta}>
          <FormField
            label="Nombre completo"
            icon="person-outline"
            value={nombre}
            onChangeText={setNombre}
            autoCapitalize="words"
            autoComplete="name"
          />

          <FormField
            label="Correo institucional"
            icon="mail-outline"
            placeholder={`tucorreo${DOMINIO_INSTITUCIONAL}`}
            helper={`Debe terminar en ${DOMINIO_INSTITUCIONAL}. Te enviamos un código para verificarlo.`}
            error={errorCorreo}
            value={correo}
            onChangeText={setCorreo}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect={false}
          />

          <View style={s.grupoClave}>
            <PasswordField
              label="Contraseña"
              value={clave}
              onChangeText={setClave}
              autoComplete="new-password"
            />
            <RequisitosClave reglas={reglas} />
          </View>

          <Checkbox
            checked={acepto}
            onChange={setAcepto}
            label="Acepto las reglas de la comunidad y el tratamiento de mis datos"
          />

          <ActionButton
            label="Crear cuenta"
            icon="arrow-forward"
            iconPosition="right"
            size="cta"
            align="center"
            disabled={!listo}
            onPress={crearCuenta}
            style={s.boton}
          />
        </View>

        <View style={s.pie}>
          <Text style={s.textoPie}>¿Ya tienes cuenta?</Text>
          <Pressable accessibilityRole="link" onPress={irAlLogin} style={s.areaToque}>
            <Text style={s.enlace}>Ingresar</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  flex: { flex: 1 },
  pantalla: { flex: 1, backgroundColor: Palette.ground },

  intro: { paddingHorizontal: Spacing[5], paddingTop: Spacing[4], gap: 6 },
  titulo: { ...Type.title1, color: Palette.ink },
  subtitulo: { ...Type.body, color: Palette.textMuted },

  tarjeta: {
    backgroundColor: Palette.card,
    borderRadius: Radius.xl,
    marginHorizontal: Spacing[5],
    marginTop: Spacing[4],
    padding: Spacing[5],
    gap: Spacing[4],
  },
  grupoClave: { gap: Spacing[2] },
  boton: { alignSelf: 'stretch', paddingHorizontal: Spacing[6] },

  pie: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: Spacing[2],
  },
  textoPie: { ...Type.body, color: Palette.ink },
  areaToque: { minHeight: TouchMin, paddingHorizontal: Spacing[1], justifyContent: 'center' },
  enlace: {
    ...Type.body,
    fontFamily: FontFamily.bodyBold,
    color: Palette.ink,
    textDecorationLine: 'underline',
  },
});
