import { StyleSheet } from 'react-native';
import { BRAND, SPACING, RADIUS, TEXT, SURFACE, AVATAR } from './plantilla';
export const COLOR = BRAND.main;
export const COLOR_LIGHT = BRAND.light; // ← agregamos esta

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SURFACE.screen,
  },
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLOR,
    paddingTop: 50,
    paddingBottom: SPACING.md,
  },
  colorBlock: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 50,
    backgroundColor: COLOR_LIGHT,
  },
  //si no hay menu
  leftSlot: {
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: TEXT.onBrand,
  },
  iconBtn: {
    padding: 12,
  },
  // Grid de botones
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: SPACING.md,
    gap: SPACING.md,
  },
  boton: {
    backgroundColor: COLOR,
    width: '46%',
    aspectRatio: 1,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  botonTexto: {
    color: TEXT.onBrand,
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 13,
  },
  // Vendedores
  seccionTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: TEXT.primary,
    marginLeft: SPACING.lg,
    marginTop: SPACING.sm,
    marginBottom: SPACING.md,
  },
  vendedorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: 10,
    gap: SPACING.md,
  },
  avatar: {
    width: AVATAR.sm,
    height: AVATAR.sm,
    borderRadius: 20,
    backgroundColor: SURFACE.avatar,
  },
  vendedorNombre: {
    fontSize: 15,
    color: TEXT.primary,
  },
});