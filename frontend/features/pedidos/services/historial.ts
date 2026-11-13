export type EstadoPedido = 'Listo para recoger' | 'En preparación' | 'Entregado';

export type Pedido = {
  id: string;
  /** Id de la oferta, para "Repetir compra". */
  productoId: string;
  numero: number;
  titulo: string;
  vendedor: string;
  estado: EstadoPedido;
  /** "Recoges hoy, 12:30 p. m. · Pagas por Nequi" o "Entregado el 24 sep 2026". */
  detalle: string;
  precio: number;
  calificado?: boolean;
  /** Producto agotado: en vez de repetir la compra se ofrece el aviso. */
  agotado?: boolean;
};

// Datos de ejemplo del diseño. Cuando exista la API, esto pasa a ser una llamada y la pantalla no cambia.
export const PEDIDOS: Pedido[] = [
  {
    id: '1042', productoId: '2', numero: 1042, titulo: 'Empanadas de pollo x3 y 1 más', vendedor: 'Empanadas de Andrés',
    estado: 'Listo para recoger', detalle: 'Recoges hoy, 12:30 p. m. · Pagas por Nequi', precio: 14500,
  },
  {
    id: '1043', productoId: '1', numero: 1043, titulo: 'Calculadora científica', vendedor: 'TecnoUD',
    estado: 'En preparación', detalle: 'Recoges hoy, 12:30 p. m. · Pagas por Nequi', precio: 65000,
  },
  {
    id: '1030', productoId: '2', numero: 1030, titulo: 'Empanadas de pollo x3', vendedor: 'Empanadas de Andrés',
    estado: 'Entregado', detalle: 'Entregado el 24 sep 2026', precio: 6000, calificado: false,
  },
  {
    id: '1024', productoId: '4', numero: 1024, titulo: 'Libreta argollada cuadriculada', vendedor: 'Papelería La 40',
    estado: 'Entregado', detalle: 'Entregado el 18 sep 2026', precio: 8500, calificado: true,
  },
  {
    id: '1011', productoId: '5', numero: 1011, titulo: 'Audífonos de diadema', vendedor: 'TecnoUD',
    estado: 'Entregado', detalle: 'Entregado el 2 sep 2026', precio: 45000, calificado: true, agotado: true,
  },
];

export const enCurso = (p: Pedido) => p.estado !== 'Entregado';
export const porCalificar = (p: Pedido) => p.estado === 'Entregado' && !p.calificado;
