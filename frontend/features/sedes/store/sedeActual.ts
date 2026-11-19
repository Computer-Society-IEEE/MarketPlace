import { crearStore } from '@/utils/crear-store';
import { SEDE_DEL_USUARIO } from '../services/sedes';

/** Sede de entrega elegida. Más adelante se guarda en el perfil de la persona. */
export const sedeActual = crearStore<string>(SEDE_DEL_USUARIO);

export const elegirSede = (id: string) => sedeActual.set(() => id);
