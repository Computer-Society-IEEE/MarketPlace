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
