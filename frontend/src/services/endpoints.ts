/**
 * Rutas de la API, relativas a VITE_API_URL (por defecto "/api").
 *
 * Solo se listan rutas que existen en el backend de la rama `feature/s05-s06-a2-auth`.
 * Están centralizadas aquí para que la migración prevista por el contrato del equipo
 * (prefijo /api/v1 y GET /usuarios/yo en lugar de /auth/me) se haga en un solo lugar.
 */
export const ENDPOINTS = {
  health: '/health',
  auth: {
    register: '/auth/register',
    login: '/auth/login',
    me: '/auth/me',
  },
  solicitudes: '/solicitudes',
  casosSoporte: '/casos-soporte',
} as const
