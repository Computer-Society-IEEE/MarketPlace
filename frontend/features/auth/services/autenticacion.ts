import { esCorreoInstitucional, evaluarClave } from './validacion';

export const INTENTOS_MAXIMOS = 5;

/**
 * Datos de ejemplo: acepta un correo institucional con una contraseña que cumpla las reglas
 * (8 caracteres, un número y una mayúscula, p. ej. "Prueba123"); cualquier otra falla, p. ej. "12345678".
 * Cuando exista la API, solo cambia el cuerpo de esta función.
 */
export async function autenticar(correo: string, clave: string): Promise<{ ok: boolean }> {
  await new Promise<void>((r) => setTimeout(r, 400));
  return { ok: esCorreoInstitucional(correo) && evaluarClave(clave).valida };
}
