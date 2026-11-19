import { memo, useCallback, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { FontFamily, Palette, Radius, Spacing, Type } from '@/constants/theme';
import { ActionButton } from '@/components/ui/ActionButton';
import { Avatar } from '@/components/ui/UserRow';
import { FilterChip } from '@/components/ui/FilterChip';
import { TextField } from '@/components/ui/TextField';
import { MAX_DESCRIPCION_TIENDA, MAX_NOMBRE_TIENDA, PerfilVendedor } from '../store/perfilVendedor';

export type OpcionSede = { id: string; nombre: string };

type Props = {
  inicial: PerfilVendedor;
  /** Sedes disponibles; las entrega la pantalla (un feature no importa de otro). */
  sedes: OpcionSede[];
  onGuardar: (perfil: PerfilVendedor) => void;
  /** Elegir foto de la galería. Devuelve la uri o nada si se cancela. */
  onElegirFoto?: () => Promise<string | undefined>;
};

/** Edición del perfil del vendedor: nombre de la tienda, descripción, foto y sede de entrega. */
function FormularioPerfilBase({ inicial, sedes, onGuardar, onElegirFoto }: Props) {
  const [nombre, setNombre] = useState(inicial.nombreTienda);
  const [descripcion, setDescripcion] = useState(inicial.descripcion);
  const [sedeId, setSedeId] = useState(inicial.sedeId);
  const [foto, setFoto] = useState(inicial.foto);
  const [error, setError] = useState('');

  const cambiarNombre = useCallback((t: string) => {
    setNombre(t);
    setError('');
  }, []);

  const cambiarFoto = useCallback(async () => {
    const uri = await onElegirFoto?.();
    if (uri) setFoto(uri);
  }, [onElegirFoto]);

  const guardar = useCallback(() => {
    if (!nombre.trim()) {
      setError('Escribe el nombre de tu tienda.');
      return;
    }
    onGuardar({ nombreTienda: nombre.trim(), descripcion: descripcion.trim(), sedeId, foto });
  }, [nombre, descripcion, sedeId, foto, onGuardar]);

  return (
    <View style={s.formulario}>
      <View style={s.foto}>
        {foto ? <Image source={{ uri: foto }} style={s.imagen} accessibilityLabel="Foto de la tienda" /> : <Avatar size={72} />}
        <ActionButton label="Cambiar foto" icon="camera-outline" size="sm" variant="dark" align="center" onPress={cambiarFoto} style={s.botonFoto} />
      </View>

      <TextField label="Nombre de la tienda" value={nombre} onChangeText={cambiarNombre} error={error} maxLength={MAX_NOMBRE_TIENDA} />
      <TextField
        label="Descripción"
        ayuda="Qué vendes y en qué estado."
        value={descripcion}
        onChangeText={setDescripcion}
        multiline
        maxLength={MAX_DESCRIPCION_TIENDA}
      />

      <View style={s.sede}>
        <Text style={s.etiqueta}>Sede de entrega</Text>
        <View style={s.chips}>
          {sedes.map((x) => (
            <FilterChip key={x.id} label={x.nombre} icon="location-outline" selected={x.id === sedeId} onPress={() => setSedeId(x.id)} />
          ))}
        </View>
      </View>

      <ActionButton label="Guardar cambios" icon="checkmark" size="cta" align="center" onPress={guardar} />
    </View>
  );
}

export const FormularioPerfil = memo(FormularioPerfilBase);

const s = StyleSheet.create({
  formulario: { gap: Spacing[5] },
  foto: { flexDirection: 'row', alignItems: 'center', gap: Spacing[4] },
  imagen: { width: 72, height: 72, borderRadius: Radius.full, backgroundColor: Palette.line },
  botonFoto: { borderRadius: Radius.full },
  sede: { gap: Spacing[2] },
  etiqueta: { ...Type.bodySm, fontFamily: FontFamily.bodyBold, color: Palette.ink },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing[2] },
});
