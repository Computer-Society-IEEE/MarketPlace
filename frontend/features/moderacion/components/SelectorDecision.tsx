import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FontFamily, Palette, Radius, Spacing, Type } from '@/constants/theme';
import { DECISIONES, Decision } from '../services/reportes';

type Props = { valor: Decision; onChange: (d: Decision) => void; deshabilitado?: boolean };

/** Lista de opciones excluyentes (radio) con la decisión que puede tomar el moderador. */
export function SelectorDecision({ valor, onChange, deshabilitado = false }: Props) {
  return (
    <View accessibilityRole="radiogroup" style={s.lista}>
      {DECISIONES.map((d) => {
        const activa = d.id === valor;
        return (
          <Pressable
            key={d.id}
            disabled={deshabilitado}
            onPress={() => onChange(d.id)}
            accessibilityRole="radio"
            accessibilityState={{ checked: activa, disabled: deshabilitado }}
            accessibilityLabel={`${d.titulo}. ${d.detalle}`}
            style={[s.opcion, activa && s.opcionActiva]}
          >
            <Ionicons name={activa ? 'radio-button-on' : 'radio-button-off'} size={24} color={Palette.ink} />
            <View style={s.textos}>
              <Text style={s.titulo}>{d.titulo}</Text>
              <Text style={s.detalle}>{d.detalle}</Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  lista: { gap: Spacing[2] },
  opcion: { flexDirection: 'row', alignItems: 'center', gap: Spacing[3], minHeight: 64, padding: Spacing[3], borderRadius: Radius.md, borderWidth: 1.5, borderColor: Palette.line },
  opcionActiva: { borderColor: Palette.ink, backgroundColor: Palette.lima100 },
  textos: { flex: 1, gap: 2 },
  titulo: { ...Type.bodySm, fontFamily: FontFamily.bodyBold, color: Palette.ink },
  detalle: { ...Type.caption, color: Palette.textMuted },
});
