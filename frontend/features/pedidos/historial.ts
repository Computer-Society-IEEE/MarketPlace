export type CompraHistorial = {
  id: string;
  vendedor: string;
  descripcion: string;
};

// Datos de ejemplo. Cuando exista la API, esto pasa a ser una llamada y la pantalla no cambia.
export const HISTORIAL: CompraHistorial[] = [
  { id: '1', vendedor: 'User', descripcion: 'Descripcion del producto' },
  { id: '2', vendedor: 'User', descripcion: 'Descripcion del producto' },
  { id: '3', vendedor: 'User', descripcion: 'Descripcion del producto' },
];
