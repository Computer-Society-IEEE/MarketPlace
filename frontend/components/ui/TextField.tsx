import { memo } from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FontFamily, Palette, Radius, Spacing, TouchMin, Type } from '@/constants/theme';

type Props = Omit<TextInputProps, 'style'> & {
  label: string;
  /** Mensaje de error: pinta el borde y se lee junto al campo (nunca solo por color). */
  error?: string;
  ayuda?: string;
  /** Texto fijo a la izquierda, p. ej. "$". */
  prefijo?: string;
};

/**
 * Campo de texto del sistema: etiqueta arriba, caja blanca de 48 px con borde de chip, error con ícono.
 * Con `multiline` crece a 4 líneas y muestra el contador si hay `maxLength`.
 */
function TextFieldBase({ label, error, ayuda, prefijo, multiline, maxLength, value, ...rest }: Props) {
  return (
    <View style={s.contenedor}>
      <Text style={s.etiqueta}>{label}</Text>
      <View style={[s.caja, multiline && s.cajaMulti, !!error && s.cajaError]}>
        {prefijo ? <Text style={s.prefijo}>{prefijo}</Text> : null}
        <TextInput
          {...rest}
          value={value}
          multiline={multiline}
          maxLength={maxLength}
          accessibilityLabel={label}
          placeholderTextColor={Palette.textMuted}
          textAlignVertical={multiline ? 'top' : 'center'}
          style={[s.campo, multiline && s.campoMulti]}
        />
      </View>
      {error ? (
        <View style={s.fila} accessibilityLiveRegion="polite">
          <Ionicons name="alert-circle" size={16} color={Palette.danger} />
          <Text style={s.error}>{error}</Text>
        </View>
      ) : ayuda || (multiline && maxLength) ? (
        <View style={s.fila}>
          <Text style={[s.ayuda, s.ayudaTexto]}>{ayuda ?? ''}</Text>
          {multiline && maxLength ? <Text style={s.ayuda}>{`${value?.length ?? 0}/${maxLength}`}</Text> : null}
        </View>
      ) : null}
    </View>
  );
}

export const TextField = memo(TextFieldBase);

const s = StyleSheet.create({
  contenedor: { gap: 6 },
  etiqueta: { ...Type.bodySm, fontFamily: FontFamily.bodyBold, color: Palette.ink },
  caja: {
    minHeight: TouchMin,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
    backgroundColor: Palette.card,
    borderWidth: 1.5,
    borderColor: Palette.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing[4],
  },
  cajaMulti: { alignItems: 'flex-start', paddingVertical: Spacing[2] },
  cajaError: { borderColor: Palette.danger },
  prefijo: { ...Type.body, fontFamily: FontFamily.bodyBold, color: Palette.ink },
  campo: { ...Type.body, flex: 1, color: Palette.ink, paddingVertical: Spacing[2] },
  campoMulti: { minHeight: 96 },
  fila: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  error: { ...Type.caption, fontFamily: FontFamily.bodyBold, color: Palette.danger, flex: 1 },
  ayuda: { ...Type.caption, color: Palette.textMuted },
  ayudaTexto: { flex: 1 },
});
