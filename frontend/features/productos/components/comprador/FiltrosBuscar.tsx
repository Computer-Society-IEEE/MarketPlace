import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ActionButton } from '@/components/ui/ActionButton';
import { FilterChip } from '@/components/ui/FilterChip';
import type { TipoOferta } from '@/utils/catalogo';
import { FontFamily, Palette, Radius, Spacing, TouchMin, Type } from '@/constants/theme';

export type FiltrosAplicados = {
  tipo?: TipoOferta;
  sede?: string;
  precioMin?: number;
  precioMax?: number;
  soloCuatroEstrellas: boolean;
  soloHoy: boolean;
};

export const SIN_FILTROS: FiltrosAplicados = { soloCuatroEstrellas: false, soloHoy: false };

/** Cantidad de filtros activos: el número que va en el botón «Filtros». */
export const contarFiltros = (f: FiltrosAplicados) =>
  [f.tipo, f.sede, f.precioMin, f.precioMax].filter((x) => x !== undefined).length +
  (f.soloCuatroEstrellas ? 1 : 0) +
  (f.soloHoy ? 1 : 0);

const TIPOS: TipoOferta[] = ['Emprendimiento', 'Segunda mano', 'Servicio'];

type Props = {
  visible: boolean;
  valor: FiltrosAplicados;
  /** Sedes para elegir. La pantalla las trae: un feature no importa de otro. */
  sedes: { id: string; nombre: string }[];
  /** Resultados con los filtros que se están editando. Si falta, el botón dice solo «Ver resultados». */
  resultados?: (f: FiltrosAplicados) => number;
  onClose: () => void;
  onAplicar: (f: FiltrosAplicados) => void;
};

const aNumero = (t: string) => {
  const n = parseInt(t.replace(/\D/g, ''), 10);
  return Number.isNaN(n) ? undefined : n;
};

/** Hoja inferior de filtros de la búsqueda: tipo, sede, precio, calificación y disponibilidad. */
export function FiltrosBuscar({ visible, valor, sedes, resultados, onClose, onAplicar }: Props) {
  const { bottom } = useSafeAreaInsets();
  const [borrador, setBorrador] = useState<FiltrosAplicados>(valor);
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');

  // Al abrir, el borrador parte de lo que ya está aplicado
  useEffect(() => {
    if (!visible) return;
    setBorrador(valor);
    setDesde(valor.precioMin !== undefined ? String(valor.precioMin) : '');
    setHasta(valor.precioMax !== undefined ? String(valor.precioMax) : '');
  }, [visible, valor]);

  const actual: FiltrosAplicados = { ...borrador, precioMin: aNumero(desde), precioMax: aNumero(hasta) };
  const rangoInvalido = actual.precioMin !== undefined && actual.precioMax !== undefined && actual.precioMin > actual.precioMax;
  const total = resultados?.(actual);

  const limpiar = () => {
    setBorrador(SIN_FILTROS);
    setDesde('');
    setHasta('');
  };

  return (
    <Modal visible={visible} transparent animationType="slide" statusBarTranslucent onRequestClose={onClose}>
      <Pressable style={s.fondo} onPress={onClose} accessibilityLabel="Cerrar filtros" accessibilityRole="button" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={[s.hoja, { paddingBottom: bottom + Spacing[4] }]}>
          <View style={s.asa} />
          <View style={s.cabecera}>
            <Text accessibilityRole="header" style={s.titulo}>Filtros</Text>
            <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel="Cerrar" style={s.cerrar}>
              <Ionicons name="close" size={22} color={Palette.ink} />
            </Pressable>
          </View>

          <ScrollView style={s.cuerpo} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            <Text style={s.seccion}>Tipo de oferta</Text>
            <View style={s.chips}>
              {TIPOS.map((t) => (
                <FilterChip
                  key={t}
                  label={t}
                  selected={borrador.tipo === t}
                  onPress={() => setBorrador((b) => ({ ...b, tipo: b.tipo === t ? undefined : t }))}
                />
              ))}
            </View>

            <Text style={s.seccion}>Sede de entrega</Text>
            <View style={s.chips}>
              {sedes.map((x) => (
                <FilterChip
                  key={x.id}
                  label={x.nombre}
                  selected={borrador.sede === x.id}
                  onPress={() => setBorrador((b) => ({ ...b, sede: b.sede === x.id ? undefined : x.id }))}
                />
              ))}
            </View>

            <Text style={s.seccion}>Precio en pesos</Text>
            <View style={s.precios}>
              <View style={s.campoPrecio}>
                <Text style={s.etiqueta}>Desde</Text>
                <TextInput
                  value={desde}
                  onChangeText={setDesde}
                  keyboardType="number-pad"
                  placeholder="$0"
                  placeholderTextColor={Palette.textMuted}
                  accessibilityLabel="Precio desde"
                  style={s.entrada}
                />
              </View>
              <View style={s.campoPrecio}>
                <Text style={s.etiqueta}>Hasta</Text>
                <TextInput
                  value={hasta}
                  onChangeText={setHasta}
                  keyboardType="number-pad"
                  placeholder="$70000"
                  placeholderTextColor={Palette.textMuted}
                  accessibilityLabel="Precio hasta"
                  style={s.entrada}
                />
              </View>
            </View>
            {rangoInvalido && <Text style={s.error}>El precio inicial no puede ser mayor que el final.</Text>}

            <View style={s.interruptor}>
              <Text style={s.interruptorTexto}>Solo 4 estrellas o más</Text>
              <Switch
                value={borrador.soloCuatroEstrellas}
                onValueChange={(v) => setBorrador((b) => ({ ...b, soloCuatroEstrellas: v }))}
                accessibilityLabel="Solo 4 estrellas o más"
                trackColor={{ false: Palette.border, true: Palette.green600 }}
                thumbColor="#FFFFFF"
              />
            </View>
            <View style={s.interruptor}>
              <Text style={s.interruptorTexto}>Solo disponibles hoy</Text>
              <Switch
                value={borrador.soloHoy}
                onValueChange={(v) => setBorrador((b) => ({ ...b, soloHoy: v }))}
                accessibilityLabel="Solo disponibles hoy"
                trackColor={{ false: Palette.border, true: Palette.green600 }}
                thumbColor="#FFFFFF"
              />
            </View>
          </ScrollView>

          <View style={s.acciones}>
            <Pressable onPress={limpiar} accessibilityRole="button" style={s.limpiar}>
              <Text style={s.limpiarTexto}>Limpiar todo</Text>
            </Pressable>
            <ActionButton
              label={total === undefined ? 'Ver resultados' : `Ver ${total} ${total === 1 ? 'resultado' : 'resultados'}`}
              size="cta"
              align="center"
              disabled={rangoInvalido}
              onPress={() => {
                onAplicar(actual);
                onClose();
              }}
              style={s.aplicar}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const s = StyleSheet.create({
  fondo: { flex: 1, backgroundColor: 'rgba(30, 42, 20, 0.45)' },
  hoja: { backgroundColor: Palette.card, borderTopLeftRadius: Radius.xl, borderTopRightRadius: Radius.xl, paddingHorizontal: Spacing[5], paddingTop: Spacing[2], maxHeight: 640 },
  asa: { alignSelf: 'center', width: 40, height: 4, borderRadius: 2, backgroundColor: Palette.border, marginBottom: Spacing[2] },
  cabecera: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  titulo: { ...Type.title2, color: Palette.ink },
  cerrar: { width: TouchMin, height: TouchMin, alignItems: 'center', justifyContent: 'center' },
  cuerpo: { flexGrow: 0 },
  seccion: { ...Type.bodySm, fontFamily: FontFamily.bodyBold, color: Palette.ink, marginTop: Spacing[4], marginBottom: Spacing[2] },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing[2] },
  precios: { flexDirection: 'row', gap: Spacing[3] },
  campoPrecio: { flex: 1, gap: Spacing[1] },
  etiqueta: { ...Type.caption, color: Palette.textMuted },
  entrada: { height: 52, borderRadius: Radius.md, borderWidth: 1.5, borderColor: Palette.border, paddingHorizontal: Spacing[3], ...Type.body, color: Palette.ink },
  error: { ...Type.caption, color: Palette.danger, marginTop: Spacing[1] },
  interruptor: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: TouchMin, marginTop: Spacing[2] },
  interruptorTexto: { ...Type.body, color: Palette.ink },
  acciones: { flexDirection: 'row', alignItems: 'center', gap: Spacing[3], paddingTop: Spacing[4] },
  limpiar: { minHeight: TouchMin, justifyContent: 'center' },
  limpiarTexto: { ...Type.body, fontFamily: FontFamily.bodyBold, color: Palette.ink, textDecorationLine: 'underline' },
  aplicar: { flex: 1 },
});
