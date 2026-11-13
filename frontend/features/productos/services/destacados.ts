import type { ProductoTarjeta } from './ofertas';

// Datos de muestra tomados del rediseño (pantalla Inicio). Los ids coinciden con los de `ofertas.ts`
// para que el detalle (`/producto/[id]`) abra algo. Cuando exista la API solo cambia este archivo.

export const CATEGORIAS = [
  { id: 'segunda-mano', label: 'Segunda mano', icon: 'pricetag-outline', params: { tipo: 'Segunda mano' } },
  { id: 'servicios', label: 'Servicios', icon: 'school-outline', params: { tipo: 'Servicio' } },
  { id: 'comida', label: 'Comida', icon: 'fast-food-outline', params: { categoria: 'Comida' } },
  { id: 'papeleria', label: 'Papelería', icon: 'create-outline', params: { categoria: 'Papelería' } },
  { id: 'tecnologia', label: 'Tecnología', icon: 'laptop-outline', params: { categoria: 'Tecnología' } },
] as const;

export const BENEFICIOS = [
  { icon: 'location-outline', label: 'Entrega gratis en tu sede' },
  { icon: 'phone-portrait-outline', label: 'Pagas por Nequi al recibir' },
  { icon: 'shield-checkmark-outline', label: 'Vendedores verificados' },
] as const;

export const RECOMPRAS = [
  { id: '2', nombre: 'Empanadas de pollo x3', detalle: 'Empanadas de Andrés · 24 sep', precio: 6000 },
  { id: '4', nombre: 'Libreta argollada cuadriculada', detalle: 'Papelería La 40 · 18 sep', precio: 8500 },
];

export const DESTACADOS: ProductoTarjeta[] = [
  { id: '1', tipo: 'Segunda mano', nombre: 'Calculadora científica', precio: 65000, calificacion: 4.9, resenas: 32 },
  { id: '2', tipo: 'Emprendimiento', nombre: 'Empanadas de pollo x3', precio: 6000, calificacion: 4.9, resenas: 120 },
  { id: '3', tipo: 'Servicio', nombre: 'Tutoría de cálculo, 1 hora', precio: 20000, calificacion: 4.9, resenas: 18 },
  { id: '4', tipo: 'Emprendimiento', nombre: 'Libreta argollada cuadriculada', precio: 8500, calificacion: 4.8, resenas: 45 },
];

export const EMPRENDIMIENTOS = [
  { id: 'tecnoud', nombre: 'TecnoUD', calificacion: 4.9 },
  { id: 'papeleria-40', nombre: 'Papelería La 40', calificacion: 4.8 },
  { id: 'empanadas-andres', nombre: 'Empanadas de Andrés', calificacion: 4.9 },
];
