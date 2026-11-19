export type EstadoReporte = 'Abierto' | 'En revisión' | 'Resuelto';
export type Decision = 'aclaracion' | 'ocultar' | 'descartar' | 'suspender';

export type Reporte = {
  id: string;
  estado: EstadoReporte;
  /** "Hace 2 horas", "Ayer". */
  recibido: string;
  /** Pedido asociado; sin él el reporte no viene de una compra hecha en la app. */
  pedido?: { numero: string; estado: string };
  motivo: string;
  descripcion: string;
  /** Cantidad de fotos de evidencia que adjuntó quien reporta. */
  evidencias: number;
  reportante: { nombre: string; corto: string };
  publicacion: { nombre: string; tienda: string; vendedor: string; precio: number; tipo: string };
  /** Sin `texto`, el vendedor aún no respondió. */
  respuesta: { avisado: string; texto?: string };
  vendedor: { ventas: number; calificacion: string; otrosReportes: number };
  /** Decisión que el formulario propone al abrir el reporte. */
  sugerida: Decision;
  resolucion?: Decision;
};

export const DECISIONES: { id: Decision; titulo: string; detalle: string }[] = [
  { id: 'aclaracion', titulo: 'Pedir aclaración al vendedor', detalle: 'Tiene 24 horas para responder. El reporte sigue abierto' },
  { id: 'ocultar', titulo: 'Ocultar la publicación', detalle: 'Deja de aparecer hasta que el vendedor la corrija' },
  { id: 'descartar', titulo: 'Descartar el reporte', detalle: 'Se avisa a quien reportó con el motivo' },
  { id: 'suspender', titulo: 'Suspender al vendedor', detalle: 'Solo con reportes repetidos. Pide confirmación' },
];

export const TITULO_DECISION: Record<Decision, string> = {
  aclaracion: 'Aclaración pedida al vendedor',
  ocultar: 'Publicación oculta',
  descartar: 'Reporte descartado',
  suspender: 'Vendedor suspendido',
};

// Datos de ejemplo con la forma que tendrá la API. Luego se reemplazan por la consulta de reportes.
export const REPORTES_EJEMPLO: Reporte[] = [
  {
    id: '218', estado: 'Abierto', recibido: 'Hace 2 horas',
    pedido: { numero: '1039', estado: 'Entregado' },
    motivo: 'No coincide con la publicación',
    descripcion: 'Los audífonos llegaron con el cable pelado cerca del conector. En la publicación decía que estaban en buen estado.',
    evidencias: 1,
    reportante: { nombre: 'Laura Gómez', corto: 'Laura G.' },
    publicacion: { nombre: 'Audífonos de diadema', tienda: 'TecnoUD', vendedor: 'Felipe Ortiz', precio: 45000, tipo: 'Segunda mano' },
    respuesta: { avisado: 'se le avisó hace 2 horas' },
    vendedor: { ventas: 128, calificacion: '4,9', otrosReportes: 0 },
    sugerida: 'aclaracion',
  },
  {
    id: '217', estado: 'Abierto', recibido: 'Hace 5 horas',
    pedido: { numero: '1038', estado: 'Cancelado' },
    motivo: 'Precio o descripción engañosa',
    descripcion: 'La publicación dice lote de siete libros, pero en el chat me confirmaron que el de cálculo integral no va.',
    evidencias: 1,
    reportante: { nombre: 'Juan Cárdenas', corto: 'Juan C.' },
    publicacion: { nombre: 'Libros usados, lote x7', tienda: 'Segunda mano de Mariana', vendedor: 'Mariana Torres', precio: 50000, tipo: 'Segunda mano' },
    respuesta: { avisado: 'se le avisó hace 5 horas', texto: 'El lote son los siete libros de la foto. El de cálculo integral nunca estuvo incluido.' },
    vendedor: { ventas: 6, calificacion: '4,7', otrosReportes: 0 },
    sugerida: 'descartar',
  },
  {
    id: '214', estado: 'En revisión', recibido: 'Ayer',
    motivo: 'No entregó el pedido',
    descripcion: 'Pagué por Nequi al recibir, pero el pedido nunca apareció como entregado en la app.',
    evidencias: 0,
    reportante: { nombre: 'Santiago Mejía', corto: 'Santiago M.' },
    publicacion: { nombre: 'Café con leche 9 oz', tienda: 'Empanadas de Andrés', vendedor: 'Andrés Castillo', precio: 2500, tipo: 'Emprendimiento' },
    respuesta: { avisado: 'se le avisó ayer', texto: 'Sí se entregó. Olvidé marcarlo en la app y ya lo corregí.' },
    vendedor: { ventas: 540, calificacion: '4,9', otrosReportes: 0 },
    sugerida: 'descartar',
  },
];
