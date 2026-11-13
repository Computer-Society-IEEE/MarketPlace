import { ReactNode, memo, useState } from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FontFamily, Palette, Spacing, Type } from '@/constants/theme';

type Props = Omit<TextInputProps, 'style'> & {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  /** Texto de ayuda persistente bajo el campo. */
  helper?: string;
  /** Mensaje de error: causa y salida. Reemplaza a la ayuda mientras exista. */
  error?: string;
  /** Elemento al final de la caja (por ejemplo, el ojo de la contraseña). */
  right?: ReactNode;
};

/**
 * Campo de formulario del diseño: etiqueta siempre visible, caja de 56 px,
 * ícono a la izquierda, borde de 2 px con foco y error con ícono y texto.
 * El foco es estado local: escribir aquí no repinta el resto del formulario.
 */
function FormFieldBase({ label, icon, helper, error, right, onFocus, onBlur, ...input }: Props) {
  const [foco, setFoco] = useState(false);

  // Los tipos del evento salen de TextInput: cambian entre versiones de React Native
  const alEnfocar: NonNullable<TextInputProps['onFocus']> = (e) => {
    setFoco(true);
    onFocus?.(e);
  };
  const alDesenfocar: NonNullable<TextInputProps['onBlur']> = (e) => {
    setFoco(false);
    onBlur?.(e);
  };

  return (
    <View style={s.campo}>
      <Text style={s.label}>{label}</Text>

      <View
        style={[s.caja, right ? s.cajaConDerecha : null, foco && s.cajaFoco, !!error && s.cajaError]}
      >
        <Ionicons name={icon} size={20} color={Palette.textMuted} />
        <TextInput
          style={s.input}
          placeholderTextColor={Palette.textMuted}
          accessibilityLabel={label}
          onFocus={alEnfocar}
          onBlur={alDesenfocar}
          {...input}
        />
        {right}
      </View>

      {error ? (
        <View style={s.filaMensaje} aria-live="polite">
          <Ionicons name="alert-circle-outline" size={16} color={Palette.danger} />
          <Text style={[s.mensaje, s.mensajeError]}>{error}</Text>
        </View>
      ) : helper ? (
        <Text style={s.mensaje}>{helper}</Text>
      ) : null}
    </View>
  );
}

export const FormField = memo(FormFieldBase);

const s = StyleSheet.create({
  campo: { gap: Spacing[2] },
  label: { ...Type.bodySm, fontFamily: FontFamily.bodyBold, color: Palette.ink },
  caja: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 56,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: Palette.border,
    backgroundColor: Palette.card,
  },
  cajaConDerecha: { paddingRight: Spacing[1] },
  cajaFoco: { borderWidth: 2, borderColor: Palette.ink },
  cajaError: { borderColor: Palette.danger },
  input: { ...Type.bodyLg, flex: 1, height: 48, color: Palette.ink, paddingVertical: 0 },
  filaMensaje: { flexDirection: 'row', alignItems: 'center', gap: Spacing[2] },
  mensaje: { ...Type.caption, color: Palette.textMuted, flexShrink: 1 },
  mensajeError: { color: Palette.danger },
});
