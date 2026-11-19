import { crearStore } from '@/utils/crear-store';

export type PedidoVenta = {
  id: string;
  numero: number;
  titulo: string;
  comprador: string;
  /** Id de la conversación con el comprador. */
  chatId: string;
  detalle: string;
  precio: number;
  entregado?: boolean;
};

export const PEDIDOS_VENTA = crearStore<PedidoVenta[]>([
  {
    id: 'v2031', numero: 2031, titulo: 'Libros usados, lote x7', comprador: 'Valentina R.', chatId: 'valentina',
    detalle: 'Entregas hoy, 12:30 p. m. · Plazoleta central · Nequi al recibir', precio: 50000,
  },
  {
    id: 'v2024', numero: 2024, titulo: 'Libros usados, lote x7', comprador: 'Santiago M.', chatId: 'santiago',
    detalle: 'Entregado el 28 oct 2026', precio: 50000, entregado: true,
  },
]);
export const usePedidosVenta = PEDIDOS_VENTA.use;
export const ANIO_ACTUAL = 2026;
export const MES_ACTUAL = 'Octubre';

/** Ventas de los dos meses anteriores, para la gráfica del trimestre. */
export const VENTAS_MESES_ANTERIORES: { mes: string; total: number }[] = [
  { mes: 'Agosto', total: 120000 },
  { mes: 'Septiembre', total: 185000 },
];

/** Pedidos cancelados del mes. No suman a las ventas. */
export const VENTAS_CANCELADAS: PedidoVenta[] = [
  {
    id: 'v2019', numero: 2019, titulo: 'Calculadora científica', comprador: 'Camila S.', chatId: 'camila',
    detalle: 'Cancelado el 15 oct 2026', precio: 65000,
  },
];

/** Total de los pedidos ya entregados. */
export const sumaEntregados = (pedidos: PedidoVenta[]) =>
  pedidos.reduce((n, p) => (p.entregado ? n + p.precio : n), 0);

/** Marca el pedido como entregado. */
export const confirmarEntrega = (id: string) =>
  PEDIDOS_VENTA.set((l) =>
    l.map((p) =>
      p.id === id
        ? { ...p, entregado: true, detalle: `Entregado el ${new Date().toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' })}` }
        : p
    )
  );