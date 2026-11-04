import type { CredencialesLogin } from '../services/apiTypes'

export type CampoLogin = keyof CredencialesLogin
export type ErroresLogin = Partial<Record<CampoLogin, string>>

// Misma idea que EMAIL_RE en backend/app/validation.py: validación de forma, no de existencia.
const FORMATO_CORREO = /^[^@\s]+@[^@\s]+\.[^@\s]+$/

/**
 * Validación del lado del cliente para el inicio de sesión. Solo adelanta errores evidentes;
 * la validación definitiva la hace el backend (422 con `errores[].campo`).
 * El login no exige longitud mínima de contraseña: esa regla (RNF-11-AC-1) aplica al registro.
 */
export function validarCredenciales({ correo, contrasena }: CredencialesLogin): ErroresLogin {
  const errores: ErroresLogin = {}
  const correoLimpio = correo.trim()
  if (correoLimpio === '') {
    errores.correo = 'Escribe tu correo electrónico.'
  } else if (!FORMATO_CORREO.test(correoLimpio)) {
    errores.correo = 'Escribe un correo válido, por ejemplo: nombre@dominio.com.'
  }
  if (contrasena === '') {
    errores.contrasena = 'Escribe tu contraseña.'
  }
  return errores
}
