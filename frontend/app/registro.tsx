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

const DOMINIO = '@udistrital.edu.co';

type CampoProps = {
  label: string;
  icono: keyof typeof Ionicons.glyphMap;
  ayuda?: string;
  derecha?: ReactNode;
} & TextInputProps;

function Campo({ label, icono, ayuda, derecha, ...props }: CampoProps) {
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
      {ayuda ? <Text style={s.ayuda}>{ayuda}</Text> : null}
    </View>
  );
}

function Requisito({ cumplido, texto }: { cumplido: boolean; texto: string }) {
  return (
    <View style={s.requisito}>
      <Ionicons
        name={cumplido ? 'checkmark-circle' : 'ellipse-outline'}
        size={16}
        color={cumplido ? Palette.green700 : Palette.textMuted}
      />
      <Text style={[s.requisitoTexto, cumplido && { color: Palette.green700 }]}>{texto}</Text>
    </View>
  );
}

export default function Registro() {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');
  const [verClave, setVerClave] = useState(false);
  const [acepto, setAcepto] = useState(false);

  const altoBloque = Math.max((height * 2) / 6, insets.top + 210);

  const correoValido = correo.trim().toLowerCase().endsWith(DOMINIO) && correo.trim().length > DOMINIO.length;
  const tiene8 = clave.length >= 8;
  const tieneNumero = /\d/.test(clave);
  const tieneMayuscula = /[A-Z]/.test(clave);
  const listo =
    nombre.trim().length > 1 && correoValido && tiene8 && tieneNumero && tieneMayuscula && acepto;

  const crearCuenta = () => {
    if (!listo) return;
    // TODO: registrar y enviar código de verificación al correo
  };

  return (
    <KeyboardAvoidingView style={s.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        style={s.pantalla}
        contentContainerStyle={[s.contenido, { paddingBottom: insets.bottom + Spacing[4] }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Fondo lima */}
        <View pointerEvents="none" style={[s.bloqueClaro, { height: altoBloque }]} />
        <View pointerEvents="none" style={[s.bloque, { height: altoBloque }]} />

        {/* Encabezado */}
        <View
          style={[
            s.encabezado,
            { height: altoBloque - Spacing[10], paddingTop: insets.top + Spacing[4] },
          ]}
        >
          <Pressable
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Volver"
            style={s.atras}
          >
            <Ionicons name="arrow-back" size={22} color={Palette.ink} />
          </Pressable>

          <View style={s.textos}>
            <Text style={s.titulo}>Crea tu cuenta</Text>
            <Text style={s.subtitulo}>Únete a la comunidad de la Universidad Distrital.</Text>
          </View>
        </View>

        {/* Tarjeta con el formulario */}
        <View style={s.tarjeta}>
          <Campo
            label="Nombre completo"
            icono="person-outline"
            placeholder="Nombre y apellido"
            value={nombre}
            onChangeText={setNombre}
            autoCapitalize="words"
            autoComplete="name"
          />

          <Campo
            label="Correo institucional"
            icono="mail-outline"
            placeholder={`tucorreo${DOMINIO}`}
            ayuda={`Debe terminar en ${DOMINIO}. Te enviamos un código para verificarlo.`}
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
              placeholder="Crea una contraseña"
              value={clave}
              onChangeText={setClave}
              secureTextEntry={!verClave}
              autoCapitalize="none"
              autoComplete="new-password"
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
            <View style={s.requisitos}>
              <Requisito cumplido={tiene8} texto="Al menos 8 caracteres" />
              <Requisito cumplido={tieneNumero} texto="Un número" />
              <Requisito cumplido={tieneMayuscula} texto="Una letra mayúscula" />
            </View>
          </View>

          {/* Aceptar reglas */}
          <Pressable
            onPress={() => setAcepto((v) => !v)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: acepto }}
            style={s.filaAcepto}
          >
            <View style={[s.check, acepto && s.checkActivo]}>
              {acepto && <Ionicons name="checkmark" size={16} color={Palette.ink} />}
            </View>
            <Text style={s.textoAcepto}>
              Acepto las reglas de la comunidad y el tratamiento de mis datos
            </Text>
          </Pressable>

          <ActionButton
            label="Crear cuenta"
            icon="arrow-forward"
            variant="primary"
            onPress={crearCuenta}
            style={[s.boton, !listo && s.botonInactivo]}
          />
        </View>

        {/* Pie */}
        <View style={s.filaCuenta}>
          <Text style={s.textoPie}>¿Ya tienes cuenta?</Text>
          <Pressable
            accessibilityRole="link"
            onPress={() => router.replace('/login')}
            style={s.areaToque}
          >
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
  contenido: { flexGrow: 1 },

  // Fondo
  bloqueClaro: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '14%',
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
    justifyContent: 'space-between',
  },
  atras: {
    width: TouchMin,
    height: TouchMin,
    borderRadius: Radius.full,
    backgroundColor: Palette.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textos: { gap: Spacing[2] },
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
  ayuda: { ...Type.caption, color: Palette.textMuted },

  // Contraseña
  grupoClave: { gap: Spacing[2] },
  requisitos: { gap: Spacing[1] },
  requisito: { flexDirection: 'row', alignItems: 'center', gap: Spacing[2] },
  requisitoTexto: { ...Type.caption, color: Palette.textMuted },

  // Aceptar reglas
  filaAcepto: { flexDirection: 'row', alignItems: 'center', gap: Spacing[3], minHeight: TouchMin },
  check: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: Palette.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Palette.card,
  },
  checkActivo: { backgroundColor: Palette.lima, borderColor: Palette.ink },
  textoAcepto: { ...Type.bodySm, color: Palette.ink, flex: 1 },

  // Botón (flecha a la derecha del texto)
  boton: {
    alignSelf: 'stretch',
    justifyContent: 'center',
    flexDirection: 'row-reverse',
  },
  botonInactivo: { opacity: 0.45 },

  // Pie
  filaCuenta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing[2],
    marginTop: Spacing[4],
  },
  textoPie: { ...Type.bodySm, color: Palette.textMuted },
  areaToque: { minHeight: 36, justifyContent: 'center' },
  enlace: {
    ...Type.bodySm,
    fontFamily: FontFamily.bodyBold,
    color: Palette.ink,
    textDecorationLine: 'underline',
  },
});