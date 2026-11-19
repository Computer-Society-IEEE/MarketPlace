import { StyleSheet, Text, View } from 'react-native';
import { Avatar } from '@/components/ui/UserRow';
import { ActionButton } from '@/components/ui/ActionButton';
import { Chip } from '@/components/ui/Chip';
import { Card } from '@/components/ui/Card';
import { Palette, Spacing, Type, FontFamily } from '@/constants/theme';
import { Usuario } from '../store/usuarios';

type Props = { usuario: Usuario; onVerificar: () => void };

/** Fila de usuario: datos de contacto, rol y, si falta, el botón para verificarlo. */
export function FilaUsuario({ usuario, onVerificar }: Props) {
  const femenino = usuario.rol === 'Compradora';
  return (
    <Card style={s.tarjeta}>
      <Avatar size={48} />
      <View style={s.textos}>
        <Text style={s.nombre} numberOfLines={1}>{usuario.nombre}</Text>
        <Text style={s.detalle} numberOfLines={1}>{usuario.correo}</Text>
        <Text style={s.detalle}>{`${usuario.rol} · ${usuario.detalle}`}</Text>
      </View>
      {usuario.verificado ? (
        <Chip label={femenino ? 'Verificada' : 'Verificado'} icon="checkmark-circle-outline" />
      ) : (
        <ActionButton label="Verificar" icon="checkmark" size="sm" align="center" onPress={onVerificar} style={s.boton} />
      )}
    </Card>
  );
}

const s = StyleSheet.create({
  tarjeta: { flexDirection: 'row', alignItems: 'center', gap: Spacing[3], padding: Spacing[3] },
  textos: { flex: 1, minWidth: 0, gap: 2 },
  nombre: { ...Type.bodySm, fontFamily: FontFamily.bodyBold, color: Palette.ink },
  detalle: { ...Type.caption, color: Palette.textMuted },
  boton: { paddingHorizontal: Spacing[3] },
});
