import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ActionButton } from '@/components/ui/ActionButton';
import { Card } from '@/components/ui/Card';
import { FontFamily, Palette, Radius, Spacing, Type } from '@/constants/theme';
import { Reporte } from '../services/reportes';
import { MiniaturaProducto } from './MiniaturaProducto';

const ESTADO = {
  Abierto: { bg: Palette.warningBg, fg: Palette.warning, icon: 'alert-circle-outline' },
  'En revisión': { bg: Palette.infoBg, fg: Palette.info, icon: 'hourglass-outline' },
  Resuelto: { bg: Palette.successBg, fg: Palette.success, icon: 'checkmark-circle-outline' },
} as const;

/** Etiqueta de estado del reporte. Siempre lleva ícono y texto, nunca solo color. */
export function EstadoReporte({ estado }: { estado: Reporte['estado'] }) {
  const t = ESTADO[estado];
  return (
    <View style={[s.estado, { backgroundColor: t.bg }]}>
      <Ionicons name={t.icon} size={14} color={t.fg} />
      <Text style={[s.estadoTexto, { color: t.fg }]}>{estado}</Text>
    </View>
  );
}

/** Reporte en la lista de moderación. */
export function TarjetaReporte({ reporte: r, onRevisar }: { reporte: Reporte; onRevisar: () => void }) {
  return (
    <Card style={s.tarjeta}>
      <View style={s.encabezado}>
        <EstadoReporte estado={r.estado} />
        <Text style={s.numero}>{`Reporte n.º ${r.id}`}</Text>
      </View>
      <View style={s.fila}>
        <MiniaturaProducto />
        <View style={s.textos}>
          <Text style={s.nombre}>{r.publicacion.nombre}</Text>
          <Text style={s.detalle}>{`Vende: ${r.publicacion.tienda}`}</Text>
          <Text style={s.detalle}>{`Reporta: ${r.reportante.corto} · ${r.recibido}`}</Text>
        </View>
      </View>
      <View style={s.motivo}>
        <Ionicons name="flag-outline" size={16} color={Palette.ink} />
        <Text style={s.motivoTexto}>{r.motivo}</Text>
      </View>
      <ActionButton label={`Revisar${r.estado === 'Resuelto' ? ' decisión' : ''}`} size="sm" align="center" onPress={onRevisar} />
    </Card>
  );
}

const s = StyleSheet.create({
  tarjeta: { gap: Spacing[3] },
  encabezado: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: Spacing[2] },
  estado: { height: 28, paddingHorizontal: 10, borderRadius: Radius.full, flexDirection: 'row', alignItems: 'center', gap: 6 },
  estadoTexto: { ...Type.label },
  numero: { ...Type.caption, color: Palette.textMuted },
  fila: { flexDirection: 'row', alignItems: 'center', gap: Spacing[3] },
  textos: { flex: 1, minWidth: 0, gap: 2 },
  nombre: { ...Type.body, fontFamily: FontFamily.bodyBold, color: Palette.ink },
  detalle: { ...Type.caption, color: Palette.textMuted },
  motivo: { flexDirection: 'row', alignItems: 'center', gap: Spacing[2], backgroundColor: Palette.lima100, borderRadius: Radius.md, padding: Spacing[3] },
  motivoTexto: { ...Type.bodySm, fontFamily: FontFamily.bodyBold, color: Palette.ink, flex: 1 },
});
