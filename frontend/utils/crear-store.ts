import { useSyncExternalStore } from 'react';

/**
 * Estado compartido en memoria para los datos de ejemplo del diseño (mensajes, publicaciones, pedidos
 * del vendedor). Cuando exista la API, cada store se reemplaza por su consulta y las pantallas no cambian.
 */
export function crearStore<T>(inicial: T) {
  let valor = inicial;
  const oyentes = new Set<() => void>();
  const suscribir = (cb: () => void) => {
    oyentes.add(cb);
    return () => {
      oyentes.delete(cb);
    };
  };
  return {
    get: () => valor,
    set: (fn: (v: T) => T) => {
      valor = fn(valor);
      oyentes.forEach((o) => o());
    },
    use: () => useSyncExternalStore(suscribir, () => valor, () => valor),
  };
}
