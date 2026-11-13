import { ImageSourcePropType } from 'react-native';

export type Sede = {
  id: string;
  nombre: string;
  zona: string;
  tiendas: number;
  /** Foto de la sede. Sin foto se muestra un recuadro con ícono. */
  imagen?: ImageSourcePropType;
};

/**
 * Datos de ejemplo del diseño. Cuando exista la API, este archivo pasa a ser
 * una llamada (listarSedes) y las pantallas no cambian.
 */
export const SEDES: Sede[] = [
  { id: 'ingenieria', nombre: 'Ingeniería', zona: 'Chapinero · Calle 40', tiendas: 12 },
  { id: 'macarena', nombre: 'Macarena', zona: 'Santa Fe · La Macarena', tiendas: 9 },
  { id: 'aduanilla', nombre: 'Aduanilla de Paiba', zona: 'Puente Aranda · Calle 13', tiendas: 5 },
  { id: 'asab', nombre: 'Artes ASAB', zona: 'Centro · Carrera 13', tiendas: 7 },
];

/** Sede del usuario. Más adelante saldrá del perfil o del store de sede. */
export const SEDE_DEL_USUARIO = 'ingenieria';

/** "Recoges en Sede Ingeniería · Calle 40": la línea de entrega bajo el buscador de Inicio. */
export function textoEntrega(sede: Sede | undefined): string {
  if (!sede) return 'Elige dónde recoger';
  const lugar = sede.zona.split(' · ').pop();
  return `Recoges en Sede ${sede.nombre} · ${lugar}`;
}
