import { memo, useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FontFamily, Palette, Radius, Spacing, Type } from '@/constants/theme';
import { Card } from '@/components/ui/Card';
import { ActionButton } from '@/components/ui/ActionButton';
import { formatoPrecio } from '@/utils/formato';
import { PedidoVenta } from '../store/pedidosVenta';

export type EstadoVenta = 'Por entregar' | 'Entregado' | 'Cancelado';

// El estado lleva ícono y texto: el significado nunca depende solo del color
const ESTADO: Record<EstadoVenta, { bg: string; fg: string; icon: keyof typeof Ionicons.glyphMap }> = {
  'Por entregar': { bg: Palette.warningBg, fg: Palette.warning, icon: 'time-outline' },
  Entregado: { bg: Palette.successBg, fg: Palette.success, icon: 'checkmark-circle' },
  Cancelado: { bg: Palette.neutral100, fg: Palette.textMuted, icon: 'close-circle-outline' },
};

type Props = {
  venta: PedidoVenta;
  estado: EstadoVenta;
  /** Recibe el id; el padre pasa una sola función estable para toda la lista. */
  onConfirmar: (id: string) => void;
  onEscribir: (chatId: string) => void;
};

function VentaCardBase({ venta, estado, onConfirmar, onEscribir }: Props) {
  const e = ESTADO[estado];
  const { id, chatId, titulo, comprador, detalle, precio, numero } = venta;
  const confirmar = useCallback(() => onConfirmar(id), [onConfirmar, id]);
  const escribir = useCallback(() => onEscribir(chatId), [onEscribir, chatId]);

  return (
    <Card style={s.tarjeta}>
      <View style={s.cabecera}>
        <View style={[s.estado, { backgroundColor: e.bg }]}>
          <Ionicons name={e.icon} size={14} color={e.fg} />
          <Text style={[s.estadoTexto, { color: e.fg }]}>{estado}</Text>
        </View>
        <Text style={s.numero}>{`Pedido n.º ${numero}`}</Text>
      </View>

      <View style={s.cuerpo}>
        <View style={s.textos}>
          <Text style={s.titulo} numberOfLines={2}>{titulo}</Text>
          <Text style={s.detalle}>{`${comprador} · ${detalle}`}</Text>
        </View>
        <Text style={[s.precio, estado === 'Cancelado' && s.precioTachado]}>{formatoPrecio(precio)}</Text>
      </View>

      {estado === 'Por entregar' ? (
        <View style={s.acciones}>
          <ActionButton label="Marcar entregado" icon="checkmark" size="sm" align="center" onPress={confirmar} style={s.accion} />
          <ActionButton label="Escribir" icon="chatbubble-outline" size="sm" variant="dark" align="center" onPress={escribir} style={s.accion} />
        </View>
      ) : null}
    </Card>
  );
}

export const VentaCard = memo(VentaCardBase);

const s = StyleSheet.create({
  tarjeta: { gap: Spacing[3] },
  cabecera: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: Spacing[2] },
  estado: { height: 28, paddingHorizontal: 10, borderRadius: Radius.full, flexDirection: 'row', alignItems: 'center', gap: 6 },
  estadoTexto: { ...Type.label },
  numero: { ...Type.caption, color: Palette.textMuted },
  cuerpo: { flexDirection: 'row', gap: Spacing[3], alignItems: 'flex-start' },
  textos: { flex: 1, minWidth: 0, gap: 2 },
  titulo: { ...Type.bodySm, fontFamily: FontFamily.bodyBold, color: Palette.ink },
  detalle: { ...Type.caption, color: Palette.textMuted },
  precio: { ...Type.priceSm, color: Palette.ink },
  precioTachado: { color: Palette.textMuted, textDecorationLine: 'line-through' },
  acciones: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing[2] },
  accion: { flexGrow: 1, justifyContent: 'center', borderRadius: Radius.full },
});
