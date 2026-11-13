import { useLocalSearchParams } from 'expo-router';
import { PublicarProducto } from '@/features/productos/components/vendedor/PublicarProducto';
import { TIEMPO_REVISION } from '@/features/moderacion/services/reglas';
import { SEDES, SEDE_DEL_USUARIO } from '@/features/sedes/services/sedes';

const sede = SEDES.find((x) => x.id === SEDE_DEL_USUARIO);

export default function EditarProducto() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <PublicarProducto id={id} sedeNombre={sede?.nombre} tiempoRevision={TIEMPO_REVISION} />;
}
