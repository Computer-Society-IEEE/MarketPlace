import { crearStore } from '@/utils/crear-store';

export type Rol = 'compra' | 'venta' | 'soporte';

export type Mensaje = { id: string; de: 'yo' | 'otro'; texto: string; hora: string };

export type Conversacion = {
  id: string;
  /** compra: yo soy el comprador · venta: yo soy el vendedor · soporte: equipo de la app. */
  rol: Rol;
  nombre: string;
  /** Producto o pedido del que se habla: "Empanadas de pollo x3 · Pedido n.º 1042". */
  contexto?: string;
  productoId?: string;
  sinLeer: number;
  mensajes: Mensaje[];
};

// Datos de ejemplo del diseño. Los 3 sin leer de compra y los 3 de venta coinciden con Mi cuenta.
const INICIAL: Conversacion[] = [
  {
    id: 'andres', rol: 'compra', nombre: 'Empanadas de Andrés', contexto: 'Pedido n.º 1042 · Empanadas de pollo', productoId: '2', sinLeer: 1,
    mensajes: [
      { id: 'a1', de: 'yo', texto: 'Hola, ¿a qué hora puedo recoger mi pedido?', hora: '12:05 p. m.' },
      { id: 'a2', de: 'otro', texto: 'Ya está listo, te espero en la entrada de la calle 40.', hora: '12:20 p. m.' },
    ],
  },
  {
    id: 'tecnoud', rol: 'compra', nombre: 'TecnoUD', contexto: 'Pedido n.º 1043 · Calculadora científica', productoId: '1', sinLeer: 2,
    mensajes: [
      { id: 't1', de: 'otro', texto: 'Estamos probando la calculadora antes de entregarla.', hora: '11:58 a. m.' },
      { id: 't2', de: 'otro', texto: 'Te la tenemos lista a las 12:30 en la plazoleta central.', hora: '11:59 a. m.' },
    ],
  },
  {
    id: 'daniela', rol: 'compra', nombre: 'Daniela Pardo', contexto: 'Tutoría de cálculo, 1 hora', productoId: '3', sinLeer: 0,
    mensajes: [
      { id: 'd1', de: 'yo', texto: '¿Tienes cupo el jueves en la tarde?', hora: 'Ayer' },
      { id: 'd2', de: 'otro', texto: 'Sí, a las 3:00 p. m. en la sala de estudio de la biblioteca.', hora: 'Ayer' },
    ],
  },
  {
    id: 'valentina', rol: 'venta', nombre: 'Valentina R.', contexto: 'Libros usados, lote x7', productoId: '7', sinLeer: 2,
    mensajes: [
      { id: 'v1', de: 'otro', texto: 'Hola, ¿el lote sigue disponible?', hora: '10:12 a. m.' },
      { id: 'v2', de: 'otro', texto: 'Lo puedo recoger hoy en la plazoleta.', hora: '10:13 a. m.' },
    ],
  },
  {
    id: 'camila', rol: 'venta', nombre: 'Camila S.', contexto: 'Libros usados, lote x7', productoId: '7', sinLeer: 1,
    mensajes: [{ id: 'c1', de: 'otro', texto: '¿Incluye el libro de álgebra lineal?', hora: '9:40 a. m.' }],
  },
  {
    id: 'santiago', rol: 'venta', nombre: 'Santiago M.', contexto: 'Libros usados, lote x7', productoId: '7', sinLeer: 0,
    mensajes: [
      { id: 's1', de: 'otro', texto: 'Gracias por la entrega, todo bien.', hora: 'Ayer' },
      { id: 's2', de: 'yo', texto: 'Con gusto, que te sirvan.', hora: 'Ayer' },
    ],
  },
];

export const conversaciones = crearStore<Conversacion[]>(INICIAL);
export const useConversaciones = conversaciones.use;

export const totalSinLeer = (lista: Conversacion[], rol: Rol) =>
  lista.filter((c) => c.rol === rol).reduce((n, c) => n + c.sinLeer, 0);

const horaActual = () =>
  new Date().toLocaleTimeString('es-CO', { hour: 'numeric', minute: '2-digit', hour12: true }).replace(/ /g, ' ');

export const marcarLeida = (id: string) =>
  conversaciones.set((l) => l.map((c) => (c.id === id && c.sinLeer > 0 ? { ...c, sinLeer: 0 } : c)));

export const enviarMensaje = (id: string, texto: string) =>
  conversaciones.set((l) =>
    l.map((c) =>
      c.id === id
        ? { ...c, mensajes: [...c.mensajes, { id: `m${Date.now()}`, de: 'yo', texto, hora: horaActual() }] }
        : c
    )
  );

/** Abre la conversación si ya existe; si no, crea una vacía (primer contacto desde un producto, perfil o pedido). */
export const asegurarConversacion = (base: Pick<Conversacion, 'id' | 'nombre'> & Partial<Conversacion>) => {
  if (conversaciones.get().some((c) => c.id === base.id)) return;
  conversaciones.set((l) => [{ rol: 'compra', sinLeer: 0, mensajes: [], ...base }, ...l]);
};

export const SOPORTE: Conversacion = {
  id: 'soporte', rol: 'soporte', nombre: 'Soporte', contexto: 'Equipo de la app', sinLeer: 0,
  mensajes: [{ id: 'so1', de: 'otro', texto: 'Hola, ¿en qué te ayudamos?', hora: 'Ahora' }],
};
