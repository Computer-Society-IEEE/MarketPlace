import { crearStore } from '@/utils/crear-store';

export type EstadoRevision = 'porRevisar' | 'revisada' | 'retirada';
export type PublicacionRevision = {
  id: string;
  nombre: string;
  vendedor: string;
  tipo: 'Segunda mano' | 'Servicio' | 'Emprendimiento';
  precio: number;
  publicada: string;
  estado: EstadoRevision;
};

// Datos de ejemplo propios del módulo admin (un feature no importa de otro).
// TODO: conectar al API de moderación; aprobar y retirar deben llamar al backend y recargar la lista.
const INICIAL: PublicacionRevision[] = [
  { id: 'r1', nombre: 'Cargador USB de pared', vendedor: 'TecnoUD', tipo: 'Segunda mano', precio: 18000, publicada: 'hace 10 min', estado: 'porRevisar' },
  { id: 'r2', nombre: 'Parlante bluetooth', vendedor: 'TecnoUD', tipo: 'Segunda mano', precio: 70000, publicada: 'hace 40 min', estado: 'porRevisar' },
  { id: 'r3', nombre: 'Tutoría de cálculo, 1 hora', vendedor: 'Daniela Pardo', tipo: 'Servicio', precio: 20000, publicada: 'hace 2 horas', estado: 'porRevisar' },
  { id: 'r4', nombre: 'Cuaderno rayado tapa roja', vendedor: 'Papelería La 40', tipo: 'Emprendimiento', precio: 9500, publicada: 'ayer', estado: 'porRevisar' },
];

const store = crearStore<PublicacionRevision[]>(INICIAL);

export const useRevision = store.use;
export const usePorRevisar = () => store.use().filter((p) => p.estado === 'porRevisar').length;

export const aprobarPublicacion = (id: string) =>
  store.set((l) => l.map((p) => (p.id === id ? { ...p, estado: 'revisada' } : p)));

/** Retirar oculta la publicación del marketplace. */
export const retirarPublicacion = (id: string) =>
  store.set((l) => l.map((p) => (p.id === id ? { ...p, estado: 'retirada' } : p)));
