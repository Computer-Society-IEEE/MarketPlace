import { memo, useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FontFamily, Palette, Radius, Spacing, Type } from '@/constants/theme';
import { Card } from '@/components/ui/Card';
import { ActionButton } from '@/components/ui/ActionButton';
import { formatoPrecio } from '@/utils/formato';
import { EstadoPedido, Pedido } from '../services/historial';

// Cada estado lleva ícono y texto: el significado nunca depende solo del color
const ESTADO: Record<EstadoPedido, { bg: string; fg: string; icon: keyof typeof Ionicons.glyphMap }> = {
  'Listo para recoger': { bg: Palette.successBg, fg: Palette.success, icon: 'checkmark-circle' },
  'En preparación': { bg: Palette.warningBg, fg: Palette.warning, icon: 'time-outline' },
  Entregado: { bg: Palette.lima100, fg: Palette.green700, icon: 'bag-check-outline' },
};

type Props = {
  pedido: Pedido;
  /** Recibe el id del pedido; el padre pasa una sola función estable para toda la lista. */
  onSeguimiento: (id: string) => void;
  onRepetir: (productoId: string) => void;
  onCalificar: (id: string) => void;
  onAvisar: (productoId: string) => void;
};

function PedidoCardBase({ pedido, onSeguimiento, onRepetir, onCalificar, onAvisar }: Props) {
  const { id, productoId, numero, titulo, vendedor, estado, detalle, precio, calificado, agotado } = pedido;
  const e = ESTADO[estado];
  const entregado = estado === 'Entregado';

  const seguimiento = useCallback(() => onSeguimiento(id), [onSeguimiento, id]);
  const repetir = useCallback(() => onRepetir(productoId), [onRepetir, productoId]);
  const calificar = useCallback(() => onCalificar(id), [onCalificar, id]);
  const avisar = useCallback(() => onAvisar(productoId), [onAvisar, productoId]);

  return (
    <Card style={s.tarjeta}>
      <View style={s.cabecera}>
        <View style={[s.estado, { backgroundColor: e.bg }]}>
          <Ionicons name={e.icon} size={14} color={e.fg} />
          <Text style={[s.estadoTexto, { color: e.fg }]}>{entregado ? (calificado ? 'Calificado' : 'Por calificar') : estado}</Text>
        </View>
        {!entregado && <Text style={s.numero}>{`Pedido n.º ${numero}`}</Text>}
      </View>

      <View style={s.cuerpo}>
        <View style={s.textos}>
          <Text style={s.titulo} numberOfLines={2}>{titulo}</Text>
          <Text style={s.vendedor} numberOfLines={1}>{vendedor}</Text>
          <Text style={s.detalle}>{detalle}</Text>
        </View>
        <Text style={s.precio}>{formatoPrecio(precio)}</Text>
      </View>

      <View style={s.acciones}>
        {!entregado ? (
          <ActionButton label="Ver seguimiento" size="sm" align="center" onPress={seguimiento} style={s.accion} />
        ) : (
          <>
            {agotado ? (
              <ActionButton label="Avisarme si vuelve" icon="notifications-outline" size="sm" variant="dark" align="center" onPress={avisar} style={s.accion} />
            ) : (
              <ActionButton label="Repetir compra" icon="refresh" size="sm" variant="dark" align="center" onPress={repetir} style={s.accion} />
            )}
            {!calificado && (
              <ActionButton label="Calificar" icon="star-outline" size="sm" align="center" onPress={calificar} style={s.accion} />
            )}
          </>
        )}
      </View>
    </Card>
  );
}

export const PedidoCard = memo(PedidoCardBase);

const s = StyleSheet.create({
  tarjeta: { gap: Spacing[3] },
  cabecera: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: Spacing[2] },
  estado: {
    height: 28,
    paddingHorizontal: 10,
    borderRadius: Radius.full,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  estadoTexto: { ...Type.label },
  numero: { ...Type.caption, color: Palette.textMuted },
  cuerpo: { flexDirection: 'row', gap: Spacing[3], alignItems: 'flex-start' },
  textos: { flex: 1, minWidth: 0, gap: 2 },
  titulo: { ...Type.bodySm, fontFamily: FontFamily.bodyBold, color: Palette.ink },
  vendedor: { ...Type.caption, color: Palette.textMuted },
  detalle: { ...Type.caption, color: Palette.ink, marginTop: 2 },
  precio: { ...Type.priceSm, color: Palette.ink },
  acciones: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing[2] },
  accion: { flexGrow: 1, justifyContent: 'center', borderRadius: Radius.full },
});
