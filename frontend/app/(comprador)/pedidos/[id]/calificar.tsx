import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { ActionButton } from '@/components/ui/ActionButton';
import { FilterChip } from '@/components/ui/FilterChip';
import { TextField } from '@/components/ui/TextField';
import { FontFamily, Palette, Spacing, TouchMin, Type } from '@/constants/theme';
import { PEDIDOS } from '@/features/pedidos/services/historial';

const ETIQUETAS = ['Puntual', 'Como en la foto', 'Buen trato', 'Buen precio'];
const TEXTO_NOTA = ['', 'Muy mala', 'Mala', 'Regular', 'Buena', 'Excelente'];

/** Calificar un pedido entregado: estrellas, etiquetas rápidas y comentario opcional. */
export default function Calificar() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const pedido = PEDIDOS.find((p) => p.id === id);
  const [nota, setNota] = useState(0);
  const [etiquetas, setEtiquetas] = useState<string[]>([]);
  const [comentario, setComentario] = useState('');
  const [listo, setListo] = useState(false);

  if (!pedido) {
    return (
      <View style={s.pantalla}>
        <ScreenHeader title="Calificar" />
        <Text style={s.vacio}>No encontramos este pedido.</Text>
      </View>
    );
  }

  const alternar = (e: string) => setEtiquetas((l) => (l.includes(e) ? l.filter((x) => x !== e) : [...l, e]));

  const enviar = () => {
    pedido.calificado = true; // Datos de ejemplo: con la API, aquí va el POST de la reseña
    setListo(true);
  };

  if (listo) {
    return (
      <View style={s.pantalla}>
        <View style={[s.exito, { paddingTop: insets.top + Spacing[8] }]}>
          <View style={s.exitoIcono}>
            <Ionicons name="star" size={36} color={Palette.ink} />
          </View>
          <Text accessibilityRole="header" style={s.exitoTitulo}>¡Gracias por calificar!</Text>
          <Text style={s.exitoTexto}>{`Tu reseña ayuda a que otros estudiantes compren con confianza en ${pedido.vendedor}.`}</Text>
          <ActionButton label="Volver a mis pedidos" size="cta" align="center" onPress={() => router.replace('/pedidos' as any)} style={s.boton} />
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={s.pantalla} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 120 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <ScreenHeader title="Calificar" />
        <View style={s.contenido}>
          <View style={s.producto}>
            <Text style={s.titulo}>{pedido.titulo}</Text>
            <Text style={s.detalle}>{`${pedido.vendedor} · ${pedido.detalle}`}</Text>
          </View>

          <View style={s.estrellas} accessibilityRole="radiogroup">
            <View style={s.filaEstrellas}>
              {[1, 2, 3, 4, 5].map((n) => (
                <Pressable
                  key={n}
                  onPress={() => setNota(n)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: nota === n }}
                  accessibilityLabel={`${n} ${n === 1 ? 'estrella' : 'estrellas'}`}
                  style={s.estrella}
                >
                  <Ionicons name={n <= nota ? 'star' : 'star-outline'} size={40} color={Palette.gold} />
                </Pressable>
              ))}
            </View>
            <Text style={s.notaTexto} accessibilityLiveRegion="polite">{nota > 0 ? TEXTO_NOTA[nota] : 'Toca una estrella'}</Text>
          </View>

          <View style={s.grupo}>
            <Text style={s.etiqueta}>¿Qué te gustó?</Text>
            <View style={s.chips}>
              {ETIQUETAS.map((e) => (
                <FilterChip key={e} label={e} selected={etiquetas.includes(e)} onPress={() => alternar(e)} />
              ))}
            </View>
          </View>

          <TextField label="Comentario (opcional)" value={comentario} onChangeText={setComentario} placeholder="Cuéntales a otros cómo te fue" multiline maxLength={200} />
        </View>
      </ScrollView>

      <View style={[s.barra, { paddingBottom: insets.bottom + Spacing[3] }]}>
        <ActionButton label="Enviar calificación" size="cta" align="center" disabled={nota === 0} onPress={enviar} style={s.boton} />
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: Palette.ground },
  vacio: { ...Type.body, color: Palette.textMuted, textAlign: 'center', marginTop: Spacing[8] },
  contenido: { paddingHorizontal: Spacing[5], paddingTop: Spacing[4], gap: Spacing[5] },
  producto: { gap: 2 },
  titulo: { ...Type.title3, color: Palette.ink },
  detalle: { ...Type.caption, color: Palette.textMuted },
  estrellas: { alignItems: 'center', gap: Spacing[1] },
  filaEstrellas: { flexDirection: 'row', gap: Spacing[1] },
  estrella: { width: TouchMin, height: TouchMin, alignItems: 'center', justifyContent: 'center' },
  notaTexto: { ...Type.bodySm, fontFamily: FontFamily.bodyBold, color: Palette.ink },
  grupo: { gap: Spacing[2] },
  etiqueta: { ...Type.bodySm, fontFamily: FontFamily.bodyBold, color: Palette.ink },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing[2] },
  barra: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: Spacing[5], paddingTop: Spacing[3], backgroundColor: Palette.ground, borderTopWidth: 1, borderTopColor: Palette.line },
  boton: { alignSelf: 'stretch' },
  exito: { alignItems: 'center', gap: Spacing[3], paddingHorizontal: Spacing[6] },
  exitoIcono: { width: 80, height: 80, borderRadius: 40, backgroundColor: Palette.lima, alignItems: 'center', justifyContent: 'center' },
  exitoTitulo: { ...Type.title1, color: Palette.ink, textAlign: 'center' },
  exitoTexto: { ...Type.body, color: Palette.textMuted, textAlign: 'center', marginBottom: Spacing[3] },
});
