import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ActionButton } from '@/components/ui/ActionButton';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { formatoPrecio } from '@/utils/formato';
import { FontFamily, Palette, Radius, Spacing, Type } from '@/constants/theme';
import { PublicacionRevision } from '../store/revision';

type Props = { publicacion: PublicacionRevision; onAprobar: () => void; onRetirar: () => void };

/** Publicación por revisar con sus acciones. Las ya revisadas o retiradas solo muestran su estado. */
export function TarjetaRevision({ publicacion: p, onAprobar, onRetirar }: Props) {
  return (
    <Card style={s.tarjeta}>
      <View style={s.fila}>
        <View style={s.foto}>
          <Ionicons name="image-outline" size={24} color={Palette.textMuted} />
        </View>
        <View style={s.textos}>
          <Text style={s.nombre}>{p.nombre}</Text>
          <Text style={s.detalle}>{`${p.vendedor} · ${p.tipo}`}</Text>
          <Text style={s.detalle}>{`${formatoPrecio(p.precio)} · Publicada ${p.publicada}`}</Text>
        </View>
      </View>
      {p.estado === 'porRevisar' ? (
        <View style={s.acciones}>
          <ActionButton label="Retirar" icon="close" variant="dark" size="sm" align="center" onPress={onRetirar} style={s.retirar} />
          <ActionButton label="Aprobar" icon="checkmark" size="sm" align="center" onPress={onAprobar} style={s.aprobar} />
        </View>
      ) : (
        <Chip label={p.estado === 'revisada' ? 'Aprobada' : 'Retirada del marketplace'} icon={p.estado === 'revisada' ? 'checkmark-circle-outline' : 'eye-off-outline'} />
      )}
    </Card>
  );
}

const s = StyleSheet.create({
  tarjeta: { gap: Spacing[3], padding: Spacing[3] },
  fila: { flexDirection: 'row', alignItems: 'center', gap: Spacing[3] },
  foto: { width: 64, height: 64, borderRadius: Radius.md, backgroundColor: Palette.line, alignItems: 'center', justifyContent: 'center' },
  textos: { flex: 1, minWidth: 0, gap: 2 },
  nombre: { ...Type.body, fontFamily: FontFamily.bodyBold, color: Palette.ink },
  detalle: { ...Type.caption, color: Palette.textMuted },
  acciones: { flexDirection: 'row', gap: Spacing[2], paddingTop: Spacing[3], borderTopWidth: 1, borderTopColor: Palette.line },
  retirar: { paddingHorizontal: Spacing[4] },
  aprobar: { flexGrow: 1 },
});
