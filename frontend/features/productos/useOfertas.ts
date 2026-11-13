import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { listarOfertas, obtenerOferta } from './ofertas';

/** Lista de ofertas filtrada por texto. Conserva el resultado anterior mientras llega el nuevo. */
export const useOfertas = (texto: string) =>
  useQuery({
    queryKey: ['ofertas', texto.trim().toLowerCase()],
    queryFn: () => listarOfertas(texto),
    placeholderData: keepPreviousData,
  });

/** Una oferta por id. No consulta hasta tener el id. */
export const useOferta = (id: string | undefined) =>
  useQuery({
    queryKey: ['oferta', id],
    queryFn: () => obtenerOferta(id as string),
    enabled: !!id,
  });
