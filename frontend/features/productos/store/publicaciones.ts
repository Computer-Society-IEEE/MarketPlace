import type { Categoria, TipoOferta } from '@/utils/catalogo';
import { crearStore } from '@/utils/crear-store';

export type EstadoPublicacion = 'Publicada' | 'En revisión' | 'Rechazada' | 'Pausada';

export type Publicacion = {
  id: string;
  nombre: string;
  tipo: TipoOferta;
  categoria?: Categoria;
  precio: number;
  unidades: number;
  estadoProducto?: string;
  descripcion: string;
  entrega: string;
  estado: EstadoPublicacion;
  /** Cuándo se envió a revisión. */
  enviada?: string;
  /** Motivo del moderador cuando está rechazada. */
  motivo?: string;
  vistas?: number;
  interesados?: number;
};

export const PUBLICACIONES = crearStore<Publicacion[]>([
  {
    id: '7', nombre: 'Libros usados, lote x7', tipo: 'Segunda mano', categoria: 'Papelería', precio: 50000, unidades: 1,
    estadoProducto: 'Buen estado', descripcion: 'Lote de siete libros de ingeniería en buen estado.',
    entrega: 'Plazoleta central · Lunes a viernes, 12:00 m. a 2:00 p. m.', estado: 'Publicada', vistas: 124, interesados: 5,
  },
  {
    id: 'p2', nombre: 'Calculadora Casio fx-82', tipo: 'Segunda mano', categoria: 'Tecnología', precio: 35000, unidades: 1,
    estadoProducto: 'Como nueva', descripcion: 'Calculadora científica con tapa. La usé un semestre.',
    entrega: 'Plazoleta central · Lunes a viernes, 12:00 m. a 2:00 p. m.', estado: 'En revisión', enviada: 'Hoy, 9:40 a. m.',
  },
  {
    id: 'p3', nombre: 'Tutoría de física, 1 hora', tipo: 'Servicio', categoria: 'Servicios', precio: 18000, unidades: 1,
    descripcion: 'Repaso de mecánica. Escríbeme al 300 000 0000 para acordar.',
    entrega: 'Biblioteca, sala de estudio · Con cita previa', estado: 'Rechazada', enviada: 'Ayer, 4:15 p. m.',
    motivo: 'La descripción incluye un número de teléfono. Los acuerdos y los pagos se manejan dentro de la app.',
  },
  {
    id: 'p4', nombre: 'Cuaderno de apuntes de cálculo', tipo: 'Segunda mano', categoria: 'Papelería', precio: 12000, unidades: 1,
    estadoProducto: 'Con detalles', descripcion: 'Apuntes completos de cálculo diferencial.',
    entrega: 'Plazoleta central · Lunes a viernes, 12:00 m. a 2:00 p. m.', estado: 'Pausada', vistas: 40, interesados: 1,
  },
]);
export const usePublicaciones = PUBLICACIONES.use;


export const ESTADOS_PUBLICACION: EstadoPublicacion[] = ['Publicada', 'En revisión', 'Rechazada', 'Pausada'];
