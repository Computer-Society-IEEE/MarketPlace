import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { FiltrosOferta, listarOfertas, obtenerOferta } from '../services/ofertas';

/** Lista de ofertas filtrada. Conserva el resultado anterior mientras llega el nuevo. */
export const useOfertas = (filtros: FiltrosOferta | string = {}) => {
  const f = typeof filtros === 'string' ? { texto: filtros } : filtros;
  const texto = (f.texto ?? '').trim().toLowerCase();
  return useQuery({
    queryKey: ['ofertas', texto, f.tipo ?? null, f.categoria ?? null, !!f.soloDisponibles],
    queryFn: () => listarOfertas({ ...f, texto }),
    placeholderData: keepPreviousData,
  });
};

/** Una oferta por id. No consulta hasta tener el id. */
export const useOferta = (id: string | undefined) =>
  useQuery({
    queryKey: ['oferta', id],
    queryFn: () => obtenerOferta(id as string),
    enabled: !!id,
  });
