import { crearStore } from '@/utils/crear-store';
import { USUARIO } from '../services/usuario';

export type PerfilVendedor = {
  nombreTienda: string;
  descripcion: string;
  /** Id de la sede donde entrega. */
  sedeId: string;
  /** Foto de la tienda (uri). Sin foto se muestra el avatar. */
  foto?: string;
};

export const MAX_NOMBRE_TIENDA = 40;
export const MAX_DESCRIPCION_TIENDA = 160;

// Dato de ejemplo del diseño. Cuando exista la API, se carga y se guarda con ella.
export const PERFIL_VENDEDOR = crearStore<PerfilVendedor>({
  nombreTienda: USUARIO.tienda.nombre,
  descripcion: 'Libros, morrales y accesorios de segunda mano, en buen estado.',
  sedeId: 'ingenieria', // sede inicial de ejemplo; luego sale del perfil
});
export const usePerfilVendedor = PERFIL_VENDEDOR.use;

export const guardarPerfilVendedor = (cambios: Partial<PerfilVendedor>) =>
  PERFIL_VENDEDOR.set((p) => ({ ...p, ...cambios }));
