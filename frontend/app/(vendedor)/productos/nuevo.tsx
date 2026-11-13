import { PublicarProducto } from '@/features/productos/components/vendedor/PublicarProducto';
import { TIEMPO_REVISION } from '@/features/moderacion/services/reglas';
import { SEDES, SEDE_DEL_USUARIO } from '@/features/sedes/services/sedes';

const sede = SEDES.find((x) => x.id === SEDE_DEL_USUARIO);

export default function NuevoProducto() {
  return <PublicarProducto sedeNombre={sede?.nombre} tiempoRevision={TIEMPO_REVISION} />;
}
