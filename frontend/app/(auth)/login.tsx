import { useCallback, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontFamily, Palette, Radius, Spacing, TouchMin, Type } from '@/constants/theme';
import { ActionButton } from '@/components/ui/ActionButton';
import { AuthBackdrop } from '@/components/ui/AuthBackdrop';
import { FormField } from '@/components/ui/FormField';
import { PasswordField } from '@/components/ui/PasswordField';
import { DOMINIO_INSTITUCIONAL } from '@/features/auth/validacion';

const ALTO_ENCABEZADO = 258;

const irARegistro = () => router.push('/registro');
const explorar = () => router.replace('/inicio' as any);

export default function Login() {
  const insets = useSafeAreaInsets();
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');

  const ingresar = useCallback(() => {
    // TODO: validar y autenticar con correo y clave
  }, []);

  const recuperarClave = useCallback(() => {
    // TODO: ir a recuperar contraseña
  }, []);

  return (
    <KeyboardAvoidingView style={s.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        style={s.pantalla}
        contentContainerStyle={[s.contenido, { paddingBottom: insets.bottom + Spacing[4] }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <AuthBackdrop />

        {/* Encabezado dentro del bloque lima */}
        <View style={[s.encabezado, { paddingTop: insets.top + Spacing[8] }]}>
          <Text style={s.marca}>Marketplace UD</Text>
          <Text accessibilityRole="header" style={s.titulo}>Hola de nuevo</Text>
          <Text style={s.subtitulo}>Ingresa con tu correo institucional.</Text>
        </View>

        {/* Tarjeta: se monta sobre el borde inferior del bloque lima */}
        <View style={s.tarjeta}>
          <FormField
            label="Correo institucional"
            icon="mail-outline"
            placeholder={`tucorreo${DOMINIO_INSTITUCIONAL}`}
            value={correo}
            onChangeText={setCorreo}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect={false}
          />

          <PasswordField
            label="Contraseña"
            placeholder="Tu contraseña"
            value={clave}
            onChangeText={setClave}
            autoComplete="current-password"
          />

          <Pressable
            accessibilityRole="link"
            onPress={recuperarClave}
            style={[s.areaToque, s.enlaceDerecha]}
          >
            <Text style={s.enlaceChico}>¿Olvidaste tu contraseña?</Text>
          </Pressable>

          <ActionButton
            label="Ingresar"
            icon="arrow-forward"
            iconPosition="right"
            size="cta"
            align="center"
            onPress={ingresar}
            style={s.boton}
          />
        </View>

        {/* Debajo de la tarjeta */}
        <View style={s.debajo}>
          <View style={s.filaCuenta}>
            <Text style={s.textoPie}>¿Aún no tienes cuenta?</Text>
            <Pressable accessibilityRole="link" onPress={irARegistro} style={s.areaToque}>
              <Text style={s.enlace}>Crear cuenta</Text>
            </Pressable>
          </View>

          <Pressable accessibilityRole="link" onPress={explorar} style={s.areaToque}>
            <Text style={[s.enlace, s.enlaceSecundario]}>Explorar sin iniciar sesión</Text>
          </Pressable>
        </View>

        {/* Pie de página */}
        <View style={s.espacio} />
        <View style={s.pie}>
          <Ionicons name="lock-closed-outline" size={16} color={Palette.textMuted} />
          <Text style={s.textoPieChico}>Solo para la comunidad de la Universidad Distrital</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  flex: { flex: 1 },
  pantalla: { flex: 1, backgroundColor: Palette.ground },
  contenido: { flexGrow: 1 },

  // Encabezado
  encabezado: { minHeight: ALTO_ENCABEZADO, paddingHorizontal: Spacing[6] },
  marca: { ...Type.bodyLg, fontFamily: FontFamily.displaySemi, color: Palette.ink },
  titulo: { ...Type.display, color: Palette.ink, marginTop: 28 },
  subtitulo: { ...Type.bodyLg, fontFamily: FontFamily.bodyMedium, color: Palette.ink, marginTop: Spacing[2] },

  // Tarjeta
  tarjeta: {
    backgroundColor: Palette.card,
    borderRadius: Radius.xl,
    marginHorizontal: Spacing[5],
    padding: Spacing[6],
    gap: 14,
    shadowColor: Palette.ink,
    shadowOpacity: 0.1,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 18 },
    elevation: 4,
  },
  enlaceDerecha: { alignSelf: 'flex-end' },
  enlaceChico: {
    ...Type.bodySm,
    fontFamily: FontFamily.bodyBold,
    color: Palette.ink,
    textDecorationLine: 'underline',
  },
  boton: { alignSelf: 'stretch', paddingHorizontal: Spacing[6] },

  // Debajo de la tarjeta
  debajo: { alignItems: 'center', marginTop: Spacing[2] },
  filaCuenta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  textoPie: { ...Type.body, color: Palette.ink },
  areaToque: { minHeight: TouchMin, paddingHorizontal: Spacing[1], justifyContent: 'center' },
  enlace: {
    ...Type.body,
    fontFamily: FontFamily.bodyBold,
    color: Palette.ink,
    textDecorationLine: 'underline',
  },
  enlaceSecundario: { color: Palette.textMuted },

  // Pie
  espacio: { flex: 1, minHeight: Spacing[6] },
  pie: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing[2],
    paddingHorizontal: Spacing[5],
  },
  textoPieChico: { ...Type.caption, color: Palette.textMuted },
});
