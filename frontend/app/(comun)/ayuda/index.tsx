import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { ActionButton } from '@/components/ui/ActionButton';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { FontFamily, Palette, Radius, Spacing, TouchMin, Type } from '@/constants/theme';

const PREGUNTAS = [
  { p: '¿Cómo pago?', r: 'Pagas por Nequi o en efectivo cuando recibes tu pedido. No hay cobros anticipados.' },
  { p: '¿Cuánto cuesta la entrega?', r: 'Nada: recoges en el campus, en el punto y el horario que indica el vendedor.' },
  { p: '¿Qué hago si lo que recibo no coincide con la publicación?', r: 'Repórtalo desde el pedido. Un moderador revisa el caso en máximo 48 horas.' },
  { p: '¿Cómo empiezo a vender?', r: 'En Mi cuenta elige «Cambiar a perfil vendedor» y toca Publicar. Un moderador revisa cada publicación antes de mostrarla.' },
  { p: '¿Por qué rechazaron mi publicación?', r: 'En Moderación ves el motivo de cada rechazo. Corrige lo que se indica y vuelve a enviarla.' },
];

/** Centro de ayuda: preguntas frecuentes y contacto con soporte dentro de la app. */
export default function Ayuda() {
  const insets = useSafeAreaInsets();
  const [abierta, setAbierta] = useState<number | null>(0);

  return (
    <ScrollView style={s.pantalla} contentContainerStyle={{ paddingBottom: insets.bottom + Spacing[8] }} showsVerticalScrollIndicator={false}>
      <ScreenHeader title="Ayuda" />
      <View style={s.contenido}>
        <SectionHeader title="Preguntas frecuentes" />
        <View style={s.lista}>
          {PREGUNTAS.map((q, i) => {
            const activa = abierta === i;
            return (
              <View key={q.p} style={s.item}>
                <Pressable
                  onPress={() => setAbierta(activa ? null : i)}
                  accessibilityRole="button"
                  accessibilityState={{ expanded: activa }}
                  style={s.pregunta}
                >
                  <Text style={s.preguntaTexto}>{q.p}</Text>
                  <Ionicons name={activa ? 'chevron-up' : 'chevron-down'} size={20} color={Palette.ink} />
                </Pressable>
                {activa && <Text style={s.respuesta}>{q.r}</Text>}
              </View>
            );
          })}
        </View>

        <View style={s.contacto}>
          <Text style={s.contactoTitulo}>¿Sigues con dudas?</Text>
          <Text style={s.contactoTexto}>Escríbenos y te respondemos por el chat de la app.</Text>
          <ActionButton
            label="Escribir a soporte"
            icon="chatbubble-ellipses-outline"
            variant="dark"
            size="sm"
            align="center"
            onPress={() => router.push({ pathname: '/mensajes/[id]' as any, params: { id: 'soporte' } })}
            style={s.contactoBoton}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: Palette.ground },
  contenido: { paddingHorizontal: Spacing[5], paddingTop: Spacing[4], gap: Spacing[3] },
  lista: { backgroundColor: Palette.card, borderRadius: Radius.lg, paddingHorizontal: Spacing[4] },
  item: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Palette.line, paddingBottom: Spacing[1] },
  pregunta: { minHeight: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: Spacing[3] },
  preguntaTexto: { ...Type.bodySm, fontFamily: FontFamily.bodyBold, color: Palette.ink, flex: 1 },
  respuesta: { ...Type.bodySm, color: Palette.ink, paddingBottom: Spacing[3] },
  contacto: { backgroundColor: Palette.lima, borderRadius: Radius.lg, padding: Spacing[4], gap: Spacing[2], marginTop: Spacing[3] },
  contactoTitulo: { ...Type.title3, color: Palette.ink },
  contactoTexto: { ...Type.caption, color: Palette.ink },
  contactoBoton: { alignSelf: 'stretch', marginTop: Spacing[1], height: TouchMin, borderRadius: TouchMin / 2, justifyContent: 'center' },
});
