import type { Categoria, TipoOferta as Tipo } from '@/utils/catalogo';

export type ProductoTarjeta = {
  id: string;
  tipo: Tipo;
  nombre: string;
  vendedor?: string;
  precio: number;
  calificacion: number;
  resenas: number;
  /** false muestra "Agotado" en lugar de "Recoges hoy" y desactiva el botón de agregar. */
  disponible?: boolean;
  /** Publicación de la persona que usa la app: muestra "Tu publicación". */
  propia?: boolean;
};


export type Resena = { id: string; autor: string; cuando: string; texto: string };

export type Oferta = {
  id: string;
  uuidVendedor: string;
  vendedor: string;
  tipoOferta: 'producto' | 'servicio';
  nombre: string;
  descripcion?: string;
  precio: number;
  activo: boolean;
  fechaPublicacion: string;
  // Campos del rediseño. Opcionales: el backend los irá completando.
  tipo?: Tipo;
  categoria?: Categoria;
  calificacion?: number;
  resenas?: number;
  /** 0 = agotado. */
  unidades?: number;
  estado?: string;
  incluye?: string;
  marca?: string;
  /** Dónde y cuándo se recoge: "Plazoleta central · Lunes a viernes, 12:00 m. a 2:00 p. m." */
  entrega?: string;
  /** Publicación de la persona que usa la app: no se puede comprar a sí misma. */
  propia?: boolean;
  listaResenas?: Resena[];
};

const RESENAS: Resena[] = [
  {
    id: 'r1',
    autor: 'Valentina R.',
    cuando: 'Hace 2 días',
    texto: 'Llegó tal como en las fotos. Me lo entregó en la plazoleta antes del parcial de cálculo.',
  },
  {
    id: 'r2',
    autor: 'Santiago M.',
    cuando: 'Hace 1 semana',
    texto: 'Muy cumplido con la hora y el lugar.',
  },
];

type Base = Pick<Oferta, 'id' | 'vendedor' | 'nombre' | 'precio' | 'tipo' | 'categoria' | 'calificacion' | 'resenas'> &
  Partial<Oferta>;

const crear = (o: Base): Oferta => ({
  uuidVendedor: `vendedor-${o.vendedor.toLowerCase().replace(/\s+/g, '-')}`,
  tipoOferta: o.tipo === 'Servicio' ? 'servicio' : 'producto',
  activo: true,
  fechaPublicacion: '2026-10-01T00:00:00.000Z',
  unidades: 1,
  listaResenas: RESENAS,
  ...o,
});

// Datos de ejemplo tomados del rediseño. Los ids 1 a 4 coinciden con los de Inicio.
const MUESTRA: Oferta[] = [
  crear({
    id: '1', vendedor: 'TecnoUD', nombre: 'Calculadora científica', precio: 65000,
    tipo: 'Segunda mano', categoria: 'Tecnología', calificacion: 4.9, resenas: 32,
    descripcion: 'La usé dos semestres en cálculo y física. Funciona perfecto y viene con tapa y pila nueva.',
    estado: 'Usada, buen estado', incluye: 'Tapa y pila nueva', marca: 'Casio',
    entrega: 'Plazoleta central · Lunes a viernes, 12:00 m. a 2:00 p. m.',
  }),
  crear({
    id: '2', vendedor: 'Empanadas de Andrés', nombre: 'Empanadas de pollo x3', precio: 6000,
    tipo: 'Emprendimiento', categoria: 'Comida', calificacion: 4.9, resenas: 120, unidades: 20,
    descripcion: 'Empanadas de pollo recién hechas. Se entregan calientes a la hora acordada.',
    entrega: 'Entrada de la calle 40 · Lunes a viernes, 10:00 a. m. a 2:00 p. m.',
  }),
  crear({
    id: '3', vendedor: 'Daniela Pardo', nombre: 'Tutoría de cálculo, 1 hora', precio: 20000,
    tipo: 'Servicio', categoria: 'Servicios', calificacion: 4.9, resenas: 18,
    descripcion: 'Repaso de límites, derivadas e integrales con ejercicios de parciales anteriores.',
    entrega: 'Biblioteca, sala de estudio · Con cita previa',
  }),
  crear({
    id: '4', vendedor: 'Papelería La 40', nombre: 'Libreta argollada cuadriculada', precio: 8500,
    tipo: 'Emprendimiento', categoria: 'Papelería', calificacion: 4.8, resenas: 45, unidades: 30,
    descripcion: 'Libreta argollada de 100 hojas, cuadrícula de 5 mm.',
    entrega: 'Plazoleta central · Lunes a viernes, 8:00 a. m. a 6:00 p. m.',
  }),
  crear({
    id: '5', vendedor: 'TecnoUD', nombre: 'Audífonos de diadema', precio: 45000,
    tipo: 'Segunda mano', categoria: 'Tecnología', calificacion: 4.6, resenas: 12, unidades: 0,
    descripcion: 'Audífonos de diadema con cable, en buen estado.',
    estado: 'Usado, buen estado',
    entrega: 'Plazoleta central · Lunes a viernes, 12:00 m. a 2:00 p. m.',
  }),
  crear({
    id: '6', vendedor: 'TecnoUD', nombre: 'Cargador USB de pared', precio: 18000,
    tipo: 'Segunda mano', categoria: 'Tecnología', calificacion: 4.8, resenas: 9,
    descripcion: 'Cargador USB de pared, funciona con cualquier cable.',
    estado: 'Usado, buen estado',
    entrega: 'Plazoleta central · Lunes a viernes, 12:00 m. a 2:00 p. m.',
  }),
  crear({
    id: '7', vendedor: 'Segunda mano de Mariana', nombre: 'Libros usados, lote x7', precio: 50000,
    tipo: 'Segunda mano', categoria: 'Papelería', calificacion: 4.5, resenas: 6, propia: true,
    descripcion: 'Lote de siete libros de ingeniería en buen estado.',
    estado: 'Usados, buen estado',
    entrega: 'Plazoleta central · Lunes a viernes, 12:00 m. a 2:00 p. m.',
  }),
  crear({
    id: '8', vendedor: 'Papelería La 40', nombre: 'Cuaderno rayado tapa roja', precio: 9500,
    tipo: 'Emprendimiento', categoria: 'Papelería', calificacion: 4.8, resenas: 45, unidades: 30,
    descripcion: 'Cuaderno rayado de 100 hojas con tapa roja.',
    entrega: 'Plazoleta central · Lunes a viernes, 8:00 a. m. a 6:00 p. m.',
  }),
  crear({
    id: '9', vendedor: 'Cafetería del bloque 2', nombre: 'Café con leche 9 oz', precio: 2500,
    tipo: 'Emprendimiento', categoria: 'Comida', calificacion: 4.7, resenas: 86, unidades: 50,
    descripcion: 'Café con leche recién preparado en vaso de 9 onzas.',
    entrega: 'Bloque 2, primer piso · Lunes a sábado, 7:00 a. m. a 7:00 p. m.',
  }),
];

export type FiltrosOferta = {
  texto?: string;
  tipo?: Tipo;
  categoria?: Categoria;
  soloDisponibles?: boolean;
};

const simularRed = (ms = 250) => new Promise<void>((r) => setTimeout(r, ms));

const normalizar = (t: string) =>
  t
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, ''); // "cálculo" encuentra "calculo"

/**
 * Cuando exista la API, solo cambia el cuerpo de estas dos funciones por un fetch.
 * Las pantallas y los hooks no se tocan.
 */
export async function listarOfertas(filtros: FiltrosOferta | string = {}): Promise<Oferta[]> {
  await simularRed();
  const { texto = '', tipo, categoria, soloDisponibles } = typeof filtros === 'string' ? { texto: filtros } : filtros;
  const t = normalizar(texto);
  return MUESTRA.filter(
    (o) =>
      o.activo &&
      (!t || normalizar(o.nombre).includes(t) || normalizar(o.vendedor).includes(t)) &&
      (!tipo || o.tipo === tipo) &&
      (!categoria || o.categoria === categoria) &&
      (!soloDisponibles || (o.unidades ?? 1) > 0)
  );
}

export async function obtenerOferta(id: string): Promise<Oferta | null> {
  await simularRed();
  return MUESTRA.find((o) => o.id === id && o.activo) ?? null;
}

/** Datos mínimos que necesita la tarjeta de producto. */
export function aTarjeta(o: Oferta): ProductoTarjeta {
  return {
    id: o.id,
    tipo: o.tipo ?? (o.tipoOferta === 'servicio' ? 'Servicio' : 'Emprendimiento'),
    nombre: o.nombre,
    vendedor: o.vendedor,
    precio: o.precio,
    calificacion: o.calificacion ?? 0,
    resenas: o.resenas ?? 0,
    disponible: (o.unidades ?? 1) > 0,
    propia: o.propia,
  };
}
