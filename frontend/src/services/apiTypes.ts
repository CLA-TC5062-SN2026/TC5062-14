/**
 * Tipos de la API de UnCalificado tal como los implementa el backend Flask de la rama
 * `feature/s05-s06-a2-auth` (no el contrato completo de openapi_equipo.yaml).
 *
 * Fuentes:
 *  - backend/app/validation.py            → ROLES
 *  - backend/app/errors.py                → formato de error {codigo, mensaje, errores?}
 *  - backend/app/services/usuarios_service.py (a_cuenta) → Cuenta
 *  - backend/app/auth/routes.py (login)   → SesionRespuesta
 */

/** Roles de `backend/app/validation.py`. */
export type Rol = 'cliente' | 'trabajador' | 'organizacion' | 'administrador'

/** Error de un campo concreto (respuestas 422). */
export interface ErrorCampo {
  campo: string
  mensaje: string
}

/** Cuerpo de error que devuelve el backend en cualquier respuesta 4xx/5xx. */
export interface ErrorRespuesta {
  codigo: string
  mensaje: string
  errores?: ErrorCampo[]
}

/** Esquema `Cuenta` devuelto por POST /api/auth/register, GET /api/auth/me y dentro del login. */
export interface Cuenta {
  id: string
  nombre: string
  correo: string
  rol: Rol
  consentimientoVigente: {
    versionAviso: number
    /** Fecha y hora ISO 8601. */
    aceptadoEn: string
  } | null
  requiereAceptarAviso: boolean
  /** Fecha y hora ISO 8601. */
  creadaEn: string
}

/** Valores de `estado` de una solicitud (ESTADOS en backend/app/routes/solicitudes.py). */
export type EstadoSolicitud = 'borrador' | 'confirmada' | 'programado' | 'en_proceso' | 'terminado' | 'concluido'

/** Oficios del catálogo (OFICIOS en backend/app/validation.py). */
export type Oficio =
  | 'albanileria'
  | 'plomeria'
  | 'electricidad'
  | 'carpinteria'
  | 'herreria'
  | 'pintura'
  | 'pisos_azulejos'
  | 'vidrieria_canceleria'
  | 'tablaroca'
  | 'impermeabilizacion'

/** Municipios del piloto (MUNICIPIOS en backend/app/validation.py). */
export type Municipio =
  | 'guadalajara'
  | 'zapopan'
  | 'san_pedro_tlaquepaque'
  | 'tonala'
  | 'tlajomulco_de_zuniga'
  | 'el_salto'

/** Esquema `SolicitudResumen` de GET /api/solicitudes (a_resumen en solicitudes_service.py). */
export interface SolicitudResumen {
  id: string
  oficio: Oficio
  resultadoEsperado: string
  estado: EstadoSolicitud
  zona: { municipio: Municipio; colonia: string }
  /** Fecha y hora ISO 8601. */
  actualizadaEn: string
}

/** Cuerpo de POST /api/auth/login. */
export interface CredencialesLogin {
  correo: string
  contrasena: string
}

/**
 * Respuesta 200 de POST /api/auth/login.
 * La implementación actual no devuelve `tokenRenovacion` ni `tokenSegundoFactor`,
 * aunque el contrato del equipo los contempla.
 */
export interface SesionRespuesta {
  tokenAcceso: string
  tipoToken: 'Bearer'
  /** Vigencia del token en segundos. */
  expiraEn: number
  segundoFactorRequerido: boolean
  requiereAceptarAviso: boolean
  cuenta: Cuenta
}
