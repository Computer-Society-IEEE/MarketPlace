export type Periodo = 'Septiembre' | 'Últimos 3 meses' | '2026';
export const PERIODOS: Periodo[] = ['Septiembre', 'Últimos 3 meses', '2026'];

export type Indicador = { valor: string; etiqueta: string };
export type Semana = { rango: string; pedidos: number };

// Cifras de ejemplo del prototipo. Los indicadores reales salen de los eventos por etapa definidos en la estrategia.
export const INDICADORES: Indicador[] = [
  { valor: '$9.800.000', etiqueta: 'Vendido en el mes' },
  { valor: '412', etiqueta: 'Pedidos del mes' },
  { valor: '94 %', etiqueta: 'Entregados a tiempo' },
  { valor: '1,2 %', etiqueta: 'Pedidos con reporte' },
  { valor: '1.240', etiqueta: 'Usuarios registrados' },
  { valor: '86', etiqueta: 'Vendedores activos' },
];

export const PEDIDOS_SEMANA: Semana[] = [
  { rango: '1 al 7', pedidos: 88 },
  { rango: '8 al 14', pedidos: 104 },
  { rango: '15 al 21', pedidos: 97 },
  { rango: '22 al 28', pedidos: 123 },
];
