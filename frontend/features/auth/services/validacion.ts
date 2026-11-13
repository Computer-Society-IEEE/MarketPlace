export const DOMINIO_INSTITUCIONAL = '@udistrital.edu.co';

/** Correo con un usuario antes del dominio institucional y nada más. */
export function esCorreoInstitucional(correo: string): boolean {
  const c = correo.trim().toLowerCase();
  if (!c.endsWith(DOMINIO_INSTITUCIONAL)) return false;
  const usuario = c.slice(0, -DOMINIO_INSTITUCIONAL.length);
  return usuario.length > 0 && !/[\s@]/.test(usuario);
}

export type ReglasClave = {
  largo: boolean;
  numero: boolean;
  mayuscula: boolean;
  valida: boolean;
};

/** Requisitos de contraseña del diseño: 8 caracteres, un número y una mayúscula. */
export function evaluarClave(clave: string): ReglasClave {
  const largo = clave.length >= 8;
  const numero = /\d/.test(clave);
  const mayuscula = /[A-Z]/.test(clave);
  return { largo, numero, mayuscula, valida: largo && numero && mayuscula };
}
