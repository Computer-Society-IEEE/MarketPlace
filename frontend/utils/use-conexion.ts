import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

// Sin '@react-native-community/netinfo': en web se escucha online/offline; en nativo se asume conectado.
const hayConexion = () =>
  Platform.OS !== 'web' || typeof navigator === 'undefined' || navigator.onLine !== false;

/** true si hay conexión. Cuando se instale netinfo, solo cambia el cuerpo de este hook. */
export function useConexion(): boolean {
  const [conectado, setConectado] = useState(hayConexion);

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;
    const conectar = () => setConectado(true);
    const desconectar = () => setConectado(false);
    window.addEventListener('online', conectar);
    window.addEventListener('offline', desconectar);
    setConectado(hayConexion());
    return () => {
      window.removeEventListener('online', conectar);
      window.removeEventListener('offline', desconectar);
    };
  }, []);

  return conectado;
}
