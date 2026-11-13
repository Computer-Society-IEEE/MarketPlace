import type { Categoria } from '@/utils/catalogo';

export type EstadoTienda = 'Abierta' | 'Cierra pronto' | 'Con pedido' | 'Con cita';

export type Tienda = {
  id: string;
  sedeId: string;
  nombre: string;
  categoria: Categoria;
  lugar: string;
  estado: EstadoTienda;
  /** Texto del estado cuando difiere: "Cierra en 20 min". */
  estadoTexto?: string;
  horario: string;
  /** true: se compra en el puesto, sin publicaciones en la app. */
  soloPresencial?: boolean;
};

/** Tiendas que muestra el diseño por sede. `total` de cada sede vive en `sedes.ts`. */
export const TIENDAS: Tienda[] = [
  { id: 'papeleria-la-40', sedeId: 'ingenieria', nombre: 'Papelería La 40', categoria: 'Papelería', lugar: 'Plazoleta central', estado: 'Abierta', horario: 'Lunes a viernes, 8:00 a. m. a 6:00 p. m.' },
  { id: 'empanadas-andres', sedeId: 'ingenieria', nombre: 'Empanadas de Andrés', categoria: 'Comida', lugar: 'Entrada de la calle 40', estado: 'Cierra pronto', estadoTexto: 'Cierra en 20 min', horario: 'Lunes a viernes, 10:00 a. m. a 2:00 p. m.' },
  { id: 'tecnoud', sedeId: 'ingenieria', nombre: 'TecnoUD', categoria: 'Tecnología', lugar: 'Plazoleta central', estado: 'Con pedido', horario: 'Solo con pedido, 12:00 m. a 2:00 p. m.' },
  { id: 'cafeteria-bloque-2', sedeId: 'ingenieria', nombre: 'Cafetería del bloque 2', categoria: 'Comida', lugar: 'Bloque 2, primer piso', estado: 'Abierta', horario: 'Lunes a sábado, 7:00 a. m. a 7:00 p. m.', soloPresencial: true },

  { id: 'papeleria-edificio-a', sedeId: 'macarena', nombre: 'Papelería del edificio A', categoria: 'Papelería', lugar: 'Edificio A, primer piso', estado: 'Abierta', horario: 'Lunes a viernes, 8:00 a. m. a 5:00 p. m.', soloPresencial: true },
  { id: 'arepas-terraza', sedeId: 'macarena', nombre: 'Arepas de la terraza', categoria: 'Comida', lugar: 'Terraza del edificio B', estado: 'Abierta', horario: 'Lunes a viernes, 9:00 a. m. a 3:00 p. m.', soloPresencial: true },
  { id: 'impresiones', sedeId: 'macarena', nombre: 'Impresiones y empastes', categoria: 'Servicios', lugar: 'Sala de cómputo', estado: 'Con cita', horario: 'Lunes a viernes, 2:00 p. m. a 6:00 p. m.', soloPresencial: true },

  { id: 'cafe-biblioteca', sedeId: 'aduanilla', nombre: 'Café de la biblioteca', categoria: 'Comida', lugar: 'Entrada de la biblioteca', estado: 'Abierta', horario: 'Lunes a viernes, 7:00 a. m. a 4:00 p. m.', soloPresencial: true },
  { id: 'papeleria-patio', sedeId: 'aduanilla', nombre: 'Papelería del patio', categoria: 'Papelería', lugar: 'Patio central', estado: 'Cierra pronto', estadoTexto: 'Cierra en 30 min', horario: 'Lunes a viernes, 8:00 a. m. a 4:00 p. m.', soloPresencial: true },

  { id: 'materiales-arte', sedeId: 'asab', nombre: 'Materiales de arte', categoria: 'Papelería', lugar: 'Patio, costado norte', estado: 'Abierta', horario: 'Lunes a viernes, 8:00 a. m. a 5:00 p. m.', soloPresencial: true },
  { id: 'cafeteria-patio', sedeId: 'asab', nombre: 'Cafetería del patio', categoria: 'Comida', lugar: 'Cafetería del patio', estado: 'Abierta', horario: 'Lunes a sábado, 8:00 a. m. a 6:00 p. m.', soloPresencial: true },
  { id: 'guitarra', sedeId: 'asab', nombre: 'Clases de guitarra', categoria: 'Servicios', lugar: 'Salón 204', estado: 'Con cita', horario: 'Martes y jueves, 3:00 p. m. a 6:00 p. m.', soloPresencial: true },
];
