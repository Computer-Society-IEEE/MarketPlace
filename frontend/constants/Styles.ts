import { StyleSheet } from 'react-native';
import { Palette, Radius, Type, TouchMin } from './theme';

export const COLOR = Palette.ink;
export const COLOR_LIGHT = Palette.lima;

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Palette.ground },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: Palette.ink,
    borderBottomLeftRadius: Radius.xl, borderBottomRightRadius: Radius.xl,
    paddingTop: 52, paddingBottom: 20, paddingHorizontal: 20,
  },
  headerText: { ...Type.title3, color: Palette.card },
  iconBtn: {
    width: TouchMin, height: TouchMin, borderRadius: Radius.full,
    backgroundColor: 'rgba(253, 252, 249, 0.14)',
    alignItems: 'center', justifyContent: 'center',
  },
  menuBtn: { /* igual que iconBtn */ },
  barra: { flex: 1 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', padding: 20, gap: 12 },
  boton: {
    backgroundColor: Palette.card, borderWidth: 1, borderColor: Palette.line,
    width: '47%', aspectRatio: 1, borderRadius: Radius.lg,
    justifyContent: 'center', alignItems: 'center', gap: 12,
  },
  botonIcono: {
    width: 64, height: 64, borderRadius: Radius.full,
    backgroundColor: Palette.lima, alignItems: 'center', justifyContent: 'center',
  },
  botonTexto: { ...Type.bodySm, fontFamily: Type.label.fontFamily, color: Palette.ink, textAlign: 'center' },
  seccionTitulo: { ...Type.title3, color: Palette.ink, marginLeft: 20, marginTop: 8, marginBottom: 12 },
  vendedorRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 10, gap: 12 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: Palette.line },
  vendedorNombre: { ...Type.body, color: Palette.ink },
});