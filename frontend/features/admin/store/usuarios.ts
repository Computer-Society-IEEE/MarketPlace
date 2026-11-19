import { crearStore } from '@/utils/crear-store';

export type RolUsuario = 'Comprador' | 'Compradora' | 'Vendedor' | 'Administrador';
export type Usuario = { id: string; nombre: string; correo: string; rol: RolUsuario; detalle: string; verificado: boolean };

export const TOTAL_USUARIOS = 1240;

// Datos de ejemplo. Luego se conecta al API de usuarios (listar y verificar).
const INICIAL: Usuario[] = [
  { id: 'u1', nombre: 'Valentina Ruiz', correo: 'vruiz@udistrital.edu.co', rol: 'Compradora', detalle: 'Ingeniería Civil', verificado: true },
  { id: 'u2', nombre: 'Felipe Ortiz', correo: 'fortiz@udistrital.edu.co', rol: 'Vendedor', detalle: 'TecnoUD · Ingeniería Electrónica', verificado: true },
  { id: 'u3', nombre: 'Laura Gómez', correo: 'lgomez@udistrital.edu.co', rol: 'Compradora', detalle: 'Licenciatura en Biología', verificado: false },
  { id: 'u4', nombre: 'Juan Cárdenas', correo: 'jcardenas@udistrital.edu.co', rol: 'Comprador', detalle: 'Física', verificado: false },
  { id: 'u5', nombre: 'Santiago Mejía', correo: 'smejia@udistrital.edu.co', rol: 'Comprador', detalle: 'Ingeniería Eléctrica', verificado: true },
  { id: 'u6', nombre: 'Carlos Rivera', correo: 'crivera@udistrital.edu.co', rol: 'Administrador', detalle: 'Comité IEEE', verificado: true },
];

const store = crearStore<Usuario[]>(INICIAL);

export const useUsuarios = store.use;
export const useUsuariosPorVerificar = () => store.use().filter((u) => !u.verificado).length;

/** Confirma que el correo institucional respondió. */
export function verificarUsuario(id: string) {
  store.set((lista) => lista.map((u) => (u.id === id ? { ...u, verificado: true } : u)));
}
