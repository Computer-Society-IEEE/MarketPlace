import { ReactNode, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontFamily, Palette, Radius, Spacing, TouchMin, Type } from '@/constants/theme';
import { ActionButton } from '@/components/ActionButton';

type CampoProps = {
  label: string;
  icono: keyof typeof Ionicons.glyphMap;
  derecha?: ReactNode;
} & TextInputProps;

function Campo({ label, icono, derecha, ...props }: CampoProps) {
  return (
    <View style={s.campo}>
      <Text style={s.label}>{label}</Text>
      <View style={s.caja}>
        <Ionicons name={icono} size={20} color={Palette.textMuted} />
        <TextInput
          style={s.input}
          placeholderTextColor={Palette.textMuted}
          accessibilityLabel={label}
          {...props}
        />
        {derecha}
      </View>
    </View>
  );
}

export default function Login() {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');
  const [verClave, setVerClave] = useState(false);

  // Bloque lima: 2/6 del alto (con un mínimo para que quepan los textos en pantallas bajas)
  const altoBloque = Math.max((height * 2) / 6, insets.top + 210);

  const ingresar = () => {
    // TODO: validar y autenticar con correo y clave
  };

  return (
    <KeyboardAvoidingView
      style={s.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={s.pantalla}
        contentContainerStyle={[s.contenido, { paddingBottom: insets.bottom + Spacing[4] }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Fondo: franja lima clara (derecha, por detrás) y bloque lima (9/10 del ancho) */}
        <View pointerEvents="none" style={[s.bloqueClaro, { height: altoBloque }]} />
        <View pointerEvents="none" style={[s.bloque, { height: altoBloque }]} />

        {/* Encabezado dentro del bloque lima */}
        <View
          style={[
            s.encabezado,
            { height: altoBloque - Spacing[10], paddingTop: insets.top + Spacing[8] },
          ]}
        >
          <Text style={s.marca}>Marketplace UD</Text>
          <Text style={s.titulo}>Hola de nuevo</Text>
          <Text style={s.subtitulo}>Ingresa con tu correo institucional.</Text>
        </View>

        {/* Tarjeta: se monta sobre el borde inferior del bloque lima */}
        <View style={s.tarjeta}>
          <Campo
            label="Correo institucional"
            icono="mail-outline"
            placeholder="tucorreo@udistrital.edu.co"
            value={correo}
            onChangeText={setCorreo}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect={false}
          />

          <View style={s.grupoClave}>
            <Campo
              label="Contraseña"
              icono="lock-closed-outline"
              placeholder="Tu contraseña"
              value={clave}
              onChangeText={setClave}
              secureTextEntry={!verClave}
              autoCapitalize="none"
              autoComplete="password"
              derecha={
                <Pressable
                  onPress={() => setVerClave((v) => !v)}
                  hitSlop={10}
                  accessibilityRole="button"
                  accessibilityLabel={verClave ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  <Ionicons
                    name={verClave ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={Palette.textMuted}
                  />
                </Pressable>
              }
            />
            <Pressable
              accessibilityRole="link"
              onPress={() => {
                // TODO: ir a recuperar contraseña
              }}
              style={s.enlaceDerecha}
            >
              <Text style={s.enlaceChico}>¿Olvidaste tu contraseña?</Text>
            </Pressable>
          </View>

          <ActionButton
            label="Ingresar"
            icon="arrow-forward"
            variant="primary"
            onPress={ingresar}
            style={s.boton}
          />
        </View>

        {/* Debajo de la tarjeta */}
        <View style={s.filaCuenta}>
          <Text style={s.textoPie}>¿Aún no tienes cuenta?</Text>
          <Pressable
            accessibilityRole="link"
            onPress={() => router.push('/registro' as any)}
            style={s.areaToque}
          >
            <Text style={s.enlace}>Crear cuenta</Text>
          </Pressable>
        </View>

        <Pressable
          accessibilityRole="link"
          onPress={() => router.replace('/Comprador/hubcomprador' as any)}
          style={[s.areaToque, s.centrado]}
        >
          <Text style={s.enlace}>Explorar sin iniciar sesión</Text>
        </Pressable>

        {/* Pie de página */}
        <View style={s.espacio} />
        <View style={s.pie}>
          <Ionicons name="lock-closed-outline" size={14} color={Palette.textMuted} />
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

  // Fondo (el alto se calcula en el componente)
  bloqueClaro: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '14%', // asoma el 1/10 restante y un poco más por detrás de la curva del bloque
    backgroundColor: Palette.lima,
    opacity: 0.5,
  },
  bloque: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '90%',
    backgroundColor: Palette.lima,
    borderBottomRightRadius: Radius.xl,
  },

  // Encabezado
  encabezado: {
    paddingHorizontal: Spacing[6],
    gap: Spacing[2],
  },
  marca: { ...Type.bodySm, fontFamily: FontFamily.bodyBold, color: Palette.ink },
  titulo: { ...Type.display, color: Palette.ink },
  subtitulo: { ...Type.bodySm, color: Palette.ink },

  // Tarjeta
  tarjeta: {
    backgroundColor: Palette.card,
    borderRadius: Radius.xl,
    marginHorizontal: Spacing[5],
    padding: Spacing[5],
    gap: Spacing[4],
    shadowColor: Palette.ink,
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },

  // Campos
  campo: { gap: Spacing[2] },
  label: { ...Type.label, color: Palette.ink },
  caja: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    minHeight: TouchMin,
    paddingHorizontal: Spacing[4],
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Palette.border,
    backgroundColor: Palette.card,
  },
  input: { ...Type.body, flex: 1, color: Palette.ink, paddingVertical: 0 },

  grupoClave: { gap: Spacing[1] },
  enlaceDerecha: { alignSelf: 'flex-end', minHeight: 32, justifyContent: 'center' },
  enlaceChico: {
    ...Type.caption,
    fontFamily: FontFamily.bodyBold,
    color: Palette.ink,
    textDecorationLine: 'underline',
  },

  // Flecha a la derecha del texto
  boton: {
    alignSelf: 'stretch',
    justifyContent: 'center',
    flexDirection: 'row-reverse',
  },

  // Debajo de la tarjeta
  filaCuenta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing[2],
    marginTop: Spacing[4],
  },
  textoPie: { ...Type.bodySm, color: Palette.textMuted },
  areaToque: { minHeight: 36, justifyContent: 'center' },
  centrado: { alignSelf: 'center' },
  enlace: {
    ...Type.bodySm,
    fontFamily: FontFamily.bodyBold,
    color: Palette.ink,
    textDecorationLine: 'underline',
  },

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