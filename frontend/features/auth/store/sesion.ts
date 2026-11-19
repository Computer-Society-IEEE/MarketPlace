import { crearStore } from '@/utils/crear-store';

/** Estado de sesión de ejemplo. Cuando exista la API, `activa` sale del token guardado. */
export const sesion = crearStore<{ activa: boolean }>({ activa: false });

export const iniciarSesion = () => sesion.set(() => ({ activa: true }));
export const cerrarSesion = () => sesion.set(() => ({ activa: false }));
