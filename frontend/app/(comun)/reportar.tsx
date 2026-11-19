import { useCallback, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Palette, Radius, Spacing, Type } from '@/constants/theme';
import { ActionButton } from '@/components/ui/ActionButton';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { formatoPrecio } from '@/utils/formato';
import { FormularioReporte, ResumenPedido } from '@/features/moderacion/components/FormularioReporte';
import { RESPUESTA_REPORTE, ReporteEnviado } from '@/features/moderacion/services/motivos';
import { PEDIDOS } from '@/features/pedidos/services/historial';

const salir = () => {
  if (router.canGoBack()) router.back();
  else router.replace('/inicio' as any);
};

/** Reportar un problema con un pedido (?pedidoId). Al enviar muestra la confirmación. */
export default function Reportar() {
  const insets = useSafeAreaInsets();
  const { pedidoId } = useLocalSearchParams<{ pedidoId?: string }>();
  const [enviado, setEnviado] = useState(false);

  const resumen = useMemo<ResumenPedido | undefined>(() => {
    const p = PEDIDOS.find((x) => x.id === pedidoId);
    return p ? { numero: p.numero, vendedor: p.vendedor, titulo: p.titulo, precio: formatoPrecio(p.precio) } : undefined;
  }, [pedidoId]);

  const enviar = useCallback((_reporte: Omit<ReporteEnviado, 'pedidoId'>) => {
    // TODO: enviar el reporte a la API junto con pedidoId
    setEnviado(true);
  }, []);

  return (
    <View style={s.pantalla}>
      <ScreenHeader title="Reportar un problema" />
      <ScrollView
        contentContainerStyle={[s.contenido, { paddingBottom: insets.bottom + Spacing[6] }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {enviado ? (
          <View style={s.confirmacion}>
            <View style={s.icono}>
              <Ionicons name="checkmark-circle-outline" size={36} color={Palette.success} />
            </View>
            <Text accessibilityRole="header" style={s.titulo}>Reporte enviado</Text>
            <Text style={s.texto}>{`El equipo de moderación lo revisa y te responde en ${RESPUESTA_REPORTE}.`}</Text>
            <ActionButton label="Listo" size="cta" align="center" onPress={salir} style={s.boton} />
          </View>
        ) : (
          <FormularioReporte pedido={resumen} onEnviar={enviar} onCancelar={salir} />
        )}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: Palette.ground },
  contenido: { padding: Spacing[5], paddingTop: Spacing[4] },
  confirmacion: { alignItems: 'center', gap: Spacing[3], paddingTop: Spacing[8] },
  icono: {
    width: 72,
    height: 72,
    borderRadius: Radius.full,
    backgroundColor: Palette.successBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titulo: { ...Type.title1, color: Palette.ink },
  texto: { ...Type.bodyLg, color: Palette.textMuted, textAlign: 'center' },
  boton: { alignSelf: 'stretch', marginTop: Spacing[3] },
});
