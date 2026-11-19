import { crearStore } from '@/utils/crear-store';
import { Decision, REPORTES_EJEMPLO, Reporte } from '../services/reportes';

// Estado en memoria con datos de ejemplo. Luego se conecta al API de reportes (listar y registrar decisión).
const store = crearStore<Reporte[]>(REPORTES_EJEMPLO);

export const useReportes = store.use;
export const useReporte = (id: string) => store.use().find((r) => r.id === id);
export const useReportesAbiertos = () => store.use().filter((r) => r.estado === 'Abierto').length;

/** Registra la decisión del moderador. Pedir aclaración deja el reporte en revisión; las demás lo resuelven. */
export function decidirReporte(id: string, decision: Decision) {
  store.set((lista) =>
    lista.map((r) =>
      r.id === id
        ? { ...r, estado: decision === 'aclaracion' ? 'En revisión' : 'Resuelto', resolucion: decision === 'aclaracion' ? undefined : decision }
        : r,
    ),
  );
}
