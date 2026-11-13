import { useEffect, useRef, useState } from 'react';
import { Alert, FlatList, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { FilterChip } from '@/components/ui/FilterChip';
import { FontFamily, Palette, Radius, Spacing, TouchMin, Type } from '@/constants/theme';
import { Mensaje,
  SOPORTE,
  asegurarConversacion,
  enviarMensaje,
  marcarLeida,
  useConversaciones, } from '@/features/chat/store/conversaciones';

const RESPUESTAS_COMPRA = ['¿Sigue disponible?', '¿Dónde nos vemos?', '¿Puedo recoger hoy?', 'Gracias'];
const RESPUESTAS_VENTA = ['Sí, sigue disponible', 'Nos vemos en la plazoleta', 'Ya está listo', 'Con gusto'];

const MOTIVOS = ['Spam o publicidad', 'Comportamiento inapropiado', 'Intenta cobrar fuera de la app'];
const keyExtractor = (m: Mensaje) => m.id;

/**
 * Chat con un vendedor o comprador. El id puede ser de una conversación existente o llegar con
 * `con` y `producto` (primer contacto desde un producto, perfil o pedido): entonces se crea vacía.
 */
export default function Chat() {
  const insets = useSafeAreaInsets();
  const { id, con, producto, productoId } = useLocalSearchParams<{
    id: string;
    con?: string;
    producto?: string;
    productoId?: string;
  }>();
  const lista = useConversaciones();
  const conversacion = lista.find((c) => c.id === id);
  const [texto, setTexto] = useState('');
  const refLista = useRef<FlatList<Mensaje>>(null);

  // Primer contacto: la conversación aún no existe
  useEffect(() => {
    if (!id || conversacion) return;
    if (id === SOPORTE.id) asegurarConversacion(SOPORTE);
    else if (con) asegurarConversacion({ id, nombre: con, contexto: producto, productoId });
  }, [id, conversacion, con, producto, productoId]);

  useEffect(() => {
    if (conversacion && conversacion.sinLeer > 0) marcarLeida(conversacion.id);
  }, [conversacion]);

  if (!conversacion) {
    return (
      <View style={s.pantalla}>
        <ScreenHeader title="Mensajes" />
        <Text style={s.vacio}>No encontramos esta conversación.</Text>
      </View>
    );
  }

  const esVenta = conversacion.rol === 'venta';
  const respuestas = esVenta ? RESPUESTAS_VENTA : RESPUESTAS_COMPRA;

  const enviar = (valor: string) => {
    const limpio = valor.trim();
    if (!limpio) return;
    enviarMensaje(conversacion.id, limpio);
    setTexto('');
    setTimeout(() => refLista.current?.scrollToEnd({ animated: true }), 50);
  };

  const reportar = () =>
    Alert.alert('Reportar conversación', '¿Qué pasó?', [
      ...MOTIVOS.map((m) => ({
        text: m,
        onPress: () =>
          Alert.alert('Reporte enviado', 'Un moderador revisa la conversación en máximo 48 horas. Gracias por avisar.'),
      })),
      { text: 'Cancelar', style: 'cancel' as const },
    ]);

  const contexto = conversacion.contexto ? (
    <Pressable
      disabled={!conversacion.productoId}
      onPress={() => router.push({ pathname: '/producto/[id]', params: { id: conversacion.productoId! } })}
      accessibilityRole={conversacion.productoId ? 'link' : 'text'}
      accessibilityLabel={`Sobre: ${conversacion.contexto}`}
      style={s.contexto}
    >
      <Ionicons name="pricetag-outline" size={18} color={Palette.green700} />
      <Text style={s.contextoTexto} numberOfLines={1}>
        {conversacion.contexto}
      </Text>
      {conversacion.productoId ? <Text style={s.contextoEnlace}>Ver</Text> : null}
    </Pressable>
  ) : null;

  return (
    <KeyboardAvoidingView style={s.pantalla} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScreenHeader
        title={conversacion.nombre}
        right={
          conversacion.rol === 'soporte'
            ? undefined
            : { icon: 'flag-outline', label: 'Reportar conversación', onPress: reportar }
        }
      />
      {contexto}

      <FlatList
        ref={refLista}
        style={s.lista}
        contentContainerStyle={s.listaContenido}
        data={conversacion.mensajes}
        keyExtractor={keyExtractor}
        onContentSizeChange={() => refLista.current?.scrollToEnd({ animated: false })}
        ListEmptyComponent={
          <Text style={s.vacio}>
            {esVenta ? 'Aún no hay mensajes.' : 'Escribe para coordinar la entrega con el vendedor.'}
          </Text>
        }
        renderItem={({ item }) => (
          <View style={[s.fila, item.de === 'yo' ? s.filaYo : s.filaOtro]}>
            <View style={[s.burbuja, item.de === 'yo' ? s.burbujaYo : s.burbujaOtro]}>
              <Text style={[s.mensaje, item.de === 'yo' && s.mensajeYo]}>{item.texto}</Text>
            </View>
            <Text style={s.hora}>{item.hora}</Text>
          </View>
        )}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      />

      {conversacion.rol !== 'soporte' && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.respuestas} contentContainerStyle={s.respuestasContenido} keyboardShouldPersistTaps="handled">
          {respuestas.map((r) => (
            <FilterChip key={r} label={r} onPress={() => enviar(r)} />
          ))}
        </ScrollView>
      )}

      <View style={[s.barra, { paddingBottom: insets.bottom + Spacing[3] }]}>
        <TextInput
          style={s.campo}
          value={texto}
          onChangeText={setTexto}
          placeholder="Escribe un mensaje"
          placeholderTextColor={Palette.textMuted}
          accessibilityLabel="Escribe un mensaje"
          multiline
          maxLength={500}
        />
        <Pressable
          onPress={() => enviar(texto)}
          disabled={!texto.trim()}
          accessibilityRole="button"
          accessibilityLabel="Enviar mensaje"
          accessibilityState={{ disabled: !texto.trim() }}
          style={[s.enviar, !texto.trim() && s.enviarOff]}
        >
          <Ionicons name="send" size={20} color={texto.trim() ? Palette.ink : Palette.textMuted} />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: Palette.ground },
  vacio: { ...Type.body, color: Palette.textMuted, textAlign: 'center', marginTop: Spacing[8], marginHorizontal: Spacing[6] },
  contexto: {
    minHeight: TouchMin,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
    marginHorizontal: Spacing[5],
    marginTop: Spacing[3],
    paddingHorizontal: Spacing[4],
    backgroundColor: Palette.lima100,
    borderRadius: Radius.full,
  },
  contextoTexto: { ...Type.bodySm, fontFamily: FontFamily.bodyBold, color: Palette.ink, flex: 1 },
  contextoEnlace: { ...Type.bodySm, fontFamily: FontFamily.bodyBold, color: Palette.ink, textDecorationLine: 'underline' },
  lista: { flex: 1 },
  listaContenido: { paddingHorizontal: Spacing[5], paddingVertical: Spacing[4], gap: Spacing[3], flexGrow: 1 },
  fila: { gap: 2, maxWidth: '82%' },
  filaYo: { alignSelf: 'flex-end', alignItems: 'flex-end' },
  filaOtro: { alignSelf: 'flex-start', alignItems: 'flex-start' },
  burbuja: { paddingHorizontal: Spacing[4], paddingVertical: Spacing[3], borderRadius: Radius.lg },
  burbujaYo: { backgroundColor: Palette.ink, borderBottomRightRadius: 6 },
  burbujaOtro: { backgroundColor: Palette.card, borderBottomLeftRadius: 6 },
  mensaje: { ...Type.body, color: Palette.ink },
  mensajeYo: { color: Palette.lima },
  hora: { ...Type.caption, color: Palette.textMuted },
  respuestas: { flexGrow: 0 },
  respuestasContenido: { gap: Spacing[2], paddingHorizontal: Spacing[5], paddingVertical: Spacing[2] },
  barra: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing[2],
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[2],
    backgroundColor: Palette.ground,
    borderTopWidth: 1,
    borderTopColor: Palette.line,
  },
  campo: {
    ...Type.body,
    flex: 1,
    maxHeight: 120,
    minHeight: TouchMin,
    color: Palette.ink,
    backgroundColor: Palette.card,
    borderWidth: 1.5,
    borderColor: Palette.border,
    borderRadius: Radius.xl,
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
  },
  enviar: {
    width: TouchMin,
    height: TouchMin,
    borderRadius: TouchMin / 2,
    backgroundColor: Palette.lima,
    alignItems: 'center',
    justifyContent: 'center',
  },
  enviarOff: { backgroundColor: Palette.line },
});
