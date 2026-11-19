export type MotivoReporte = {
  id: string;
  titulo: string;
  detalle: string;
};

/** Máximo de caracteres de la descripción del reporte. */
export const MAX_DESCRIPCION_REPORTE = 500;
/** Máximo de fotos de evidencia. */
export const MAX_FOTOS_REPORTE = 3;
/** Texto de cuánto tarda la respuesta del equipo de moderación. Provisional: confirmar con moderación. */
export const RESPUESTA_REPORTE = 'máximo 48 horas';

// Datos de ejemplo del diseño. Cuando exista la API, vendrán del servidor.
export const MOTIVOS_REPORTE: MotivoReporte[] = [
  { id: 'no-coincide', titulo: 'No coincide con la publicación', detalle: 'Estado, cantidad o modelo distinto' },
  { id: 'no-entrego', titulo: 'No entregó el pedido', detalle: 'No llegó al punto ni respondió' },
  { id: 'engano', titulo: 'Precio o descripción engañosa', detalle: 'Cobró distinto o cambió condiciones' },
  { id: 'trato', titulo: 'Trato inadecuado', detalle: 'Mensajes o conducta fuera de las reglas' },
];

export type ReporteEnviado = {
  pedidoId?: string;
  motivoId: string;
  descripcion: string;
  fotos: number;
};
