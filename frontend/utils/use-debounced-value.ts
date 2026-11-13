import { useEffect, useState } from 'react';

/** Devuelve `valor` solo después de que deje de cambiar durante `ms`. Evita una consulta por tecla. */
export function useDebouncedValue<T>(valor: T, ms = 300): T {
  const [retrasado, setRetrasado] = useState(valor);

  useEffect(() => {
    const t = setTimeout(() => setRetrasado(valor), ms);
    return () => clearTimeout(t);
  }, [valor, ms]);

  return retrasado;
}
