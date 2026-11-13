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
};

// Datos de ejemplo con la forma del modelo de backend/DB/productos.json.
const MUESTRA: Oferta[] = Array.from({ length: 6 }, (_, i) => ({
  id: String(i + 1),
  uuidVendedor: `vendedor-${i + 1}`,
  vendedor: `Vendedor ${i + 1}`,
  tipoOferta: 'producto',
  nombre: `Producto ${i + 1}`,
  descripcion: 'Descripción del producto',
  precio: 10000 * (i + 1),
  activo: true,
  fechaPublicacion: '2026-10-01T00:00:00.000Z',
}));

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
export async function listarOfertas(texto = ''): Promise<Oferta[]> {
  await simularRed();
  const t = normalizar(texto);
  const activas = MUESTRA.filter((o) => o.activo);
  return t ? activas.filter((o) => normalizar(o.nombre).includes(t)) : activas;
}

export async function obtenerOferta(id: string): Promise<Oferta | null> {
  await simularRed();
  return MUESTRA.find((o) => o.id === id && o.activo) ?? null;
}
