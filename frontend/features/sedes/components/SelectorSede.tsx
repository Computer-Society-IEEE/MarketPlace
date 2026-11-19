import { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ActionButton } from '@/components/ui/ActionButton';
import { FontFamily, Palette, Radius, Spacing, TouchMin, Type } from '@/constants/theme';
import { SEDES } from '../services/sedes';

type Props = {
  visible: boolean;
  /** Id de la sede elegida ahora. */
  valor: string;
  onClose: () => void;
  onElegir: (id: string) => void;
};

/** Hoja «¿Dónde recoges?»: los productos y las tiendas se ordenan según la sede que se elija. */
export function SelectorSede({ visible, valor, onClose, onElegir }: Props) {
  const { bottom } = useSafeAreaInsets();
  const [elegida, setElegida] = useState(valor);

  useEffect(() => {
    if (visible) setElegida(valor);
  }, [visible, valor]);

  return (
    <Modal visible={visible} transparent animationType="slide" statusBarTranslucent onRequestClose={onClose}>
      <Pressable style={s.fondo} onPress={onClose} accessibilityRole="button" accessibilityLabel="Cerrar" />
      <View style={[s.hoja, { paddingBottom: bottom + Spacing[4] }]}>
        <View style={s.asa} />
        <Text accessibilityRole="header" style={s.titulo}>¿Dónde recoges?</Text>
        <Text style={s.subtitulo}>Los productos y las tiendas se ordenan según la sede que elijas.</Text>

        <View accessibilityRole="radiogroup" style={s.lista}>
          {SEDES.map((x) => {
            const activa = x.id === elegida;
            return (
              <Pressable
                key={x.id}
                onPress={() => setElegida(x.id)}
                accessibilityRole="radio"
                accessibilityState={{ checked: activa }}
                accessibilityLabel={`Sede ${x.nombre}. ${x.zona} · ${x.tiendas} tiendas`}
                style={[s.opcion, activa && s.opcionActiva]}
              >
                <Ionicons name={activa ? 'radio-button-on' : 'radio-button-off'} size={24} color={Palette.ink} />
                <View style={s.textos}>
                  <Text style={s.nombre}>{`Sede ${x.nombre}`}</Text>
                  <Text style={s.detalle}>{`${x.zona} · ${x.tiendas} tiendas`}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        <ActionButton
          label="Usar esta sede"
          size="cta"
          align="center"
          onPress={() => {
            onElegir(elegida);
            onClose();
          }}
        />
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  fondo: { flex: 1, backgroundColor: 'rgba(30, 42, 20, 0.45)' },
  hoja: { backgroundColor: Palette.card, borderTopLeftRadius: Radius.xl, borderTopRightRadius: Radius.xl, paddingHorizontal: Spacing[5], paddingTop: Spacing[2], gap: Spacing[3] },
  asa: { alignSelf: 'center', width: 40, height: 4, borderRadius: 2, backgroundColor: Palette.border },
  titulo: { ...Type.title2, color: Palette.ink },
  subtitulo: { ...Type.bodySm, color: Palette.textMuted },
  lista: { gap: Spacing[2] },
  opcion: { flexDirection: 'row', alignItems: 'center', gap: Spacing[3], minHeight: TouchMin + 12, padding: Spacing[3], borderRadius: Radius.md, borderWidth: 1.5, borderColor: Palette.border },
  opcionActiva: { borderColor: Palette.ink, backgroundColor: Palette.lima100 },
  textos: { flex: 1, gap: 2 },
  nombre: { ...Type.body, fontFamily: FontFamily.bodyBold, color: Palette.ink },
  detalle: { ...Type.caption, color: Palette.textMuted },
});
