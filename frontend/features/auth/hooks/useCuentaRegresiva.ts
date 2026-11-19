import { useCallback, useEffect, useState } from 'react';

/** Cuenta regresiva en segundos para reenviar un código o enlace. `reiniciar` la vuelve a armar. */
export function useCuentaRegresiva(segundos: number) {
  const [restante, setRestante] = useState(segundos);

  useEffect(() => {
    if (restante <= 0) return;
    const t = setTimeout(() => setRestante((r) => r - 1), 1000);
    return () => clearTimeout(t);
  }, [restante]);

  const reiniciar = useCallback(() => setRestante(segundos), [segundos]);
  const texto = `${Math.floor(restante / 60)}:${String(restante % 60).padStart(2, '0')}`;
  return { restante, texto, reiniciar };
}
