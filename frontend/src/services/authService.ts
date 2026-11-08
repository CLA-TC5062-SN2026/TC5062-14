import type { CredencialesLogin, Cuenta, SesionRespuesta } from './apiTypes'
import { ENDPOINTS } from './endpoints'
import { request } from './httpClient'

/**
 * Servicios de autenticación sobre los endpoints implementados en backend/app/auth/routes.py.
 * El registro (POST /api/auth/register) se incorporará cuando exista una forma de obtener
 * la versión vigente del aviso de privacidad (GET /avisos-privacidad/vigente no está implementado).
 */

/** POST /api/auth/login → 200 con JWT; 401 CREDENCIALES_INVALIDAS; 422 si faltan datos. */
export function iniciarSesion(credenciales: CredencialesLogin, signal?: AbortSignal): Promise<SesionRespuesta> {
  return request<SesionRespuesta>(ENDPOINTS.auth.login, { method: 'POST', body: credenciales, signal })
}

/** GET /api/auth/me → 200 con la Cuenta; 401 NO_AUTENTICADO, TOKEN_EXPIRADO o TOKEN_INVALIDO. */
export function obtenerCuentaActual(token: string, signal?: AbortSignal): Promise<Cuenta> {
  return request<Cuenta>(ENDPOINTS.auth.me, { token, signal })
}
