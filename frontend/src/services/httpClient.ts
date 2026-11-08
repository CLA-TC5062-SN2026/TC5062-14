import type { ErrorCampo, ErrorRespuesta } from './apiTypes'

/** Prefijo base de la API. Con "/api" las peticiones pasan por el proxy de Vite. */
export const API_URL: string = (import.meta.env.VITE_API_URL ?? '/api').replace(/\/+$/, '')

/**
 * Códigos que genera el propio cliente cuando no hay una respuesta válida del backend.
 * Llevan el prefijo CLIENTE_ para no confundirse con los códigos del backend
 * (CREDENCIALES_INVALIDAS, TOKEN_EXPIRADO, VALIDACION, etc.).
 */
export const CODIGOS_CLIENTE = {
  sinConexion: 'CLIENTE_SIN_CONEXION',
  respuestaNoValida: 'CLIENTE_RESPUESTA_NO_VALIDA',
} as const

/** Error de una petición HTTP, con el formato {codigo, mensaje, errores?} del backend. */
export class ApiError extends Error {
  readonly status: number
  readonly codigo: string
  readonly errores: ErrorCampo[]

  constructor(status: number, codigo: string, mensaje: string, errores: ErrorCampo[] = []) {
    super(mensaje)
    this.name = 'ApiError'
    this.status = status
    this.codigo = codigo
    this.errores = errores
  }

  /** Convierte `errores` en un mapa campo → mensaje, útil para mostrar cada error junto a su campo (RNF-01-AC-2). */
  erroresPorCampo(): Record<string, string> {
    const mapa: Record<string, string> = {}
    for (const { campo, mensaje } of this.errores) {
      mapa[campo] ??= mensaje
    }
    return mapa
  }
}

export type MetodoHttp = 'GET' | 'POST' | 'PATCH' | 'DELETE'

export interface OpcionesPeticion {
  method?: MetodoHttp
  /** Se envía como JSON. */
  body?: unknown
  /** JWT de acceso; si existe, se envía como `Authorization: Bearer <token>`. */
  token?: string | null
  /** Parámetros de consulta (?pagina=1&tamanoPagina=20). */
  query?: Record<string, string | number | undefined>
  signal?: AbortSignal
}

function esErrorRespuesta(valor: unknown): valor is ErrorRespuesta {
  return (
    typeof valor === 'object' &&
    valor !== null &&
    typeof (valor as ErrorRespuesta).codigo === 'string' &&
    typeof (valor as ErrorRespuesta).mensaje === 'string'
  )
}

function construirUrl(ruta: string, query?: OpcionesPeticion['query']): string {
  const url = `${API_URL}${ruta.startsWith('/') ? ruta : `/${ruta}`}`
  if (!query) return url
  const params = new URLSearchParams()
  for (const [clave, valor] of Object.entries(query)) {
    if (valor !== undefined) params.set(clave, String(valor))
  }
  const cadena = params.toString()
  return cadena ? `${url}?${cadena}` : url
}

async function leerJson(respuesta: Response): Promise<unknown> {
  const texto = await respuesta.text()
  if (texto === '') return undefined
  try {
    return JSON.parse(texto)
  } catch {
    return undefined
  }
}

/**
 * Hace una petición a la API y devuelve el cuerpo JSON tipado.
 *
 * - Respuestas 2xx: devuelve el JSON (o `undefined` en un 204 sin cuerpo).
 * - Respuestas 4xx/5xx: lanza `ApiError` con `codigo`, `mensaje` y `errores` del backend.
 * - Falla de red (backend apagado, proxy sin destino): lanza `ApiError` con status 0.
 *
 * Nota: cuando el backend no está en ejecución, el proxy de Vite responde un error 5xx
 * (502 en las pruebas de la Parte 1) sin cuerpo JSON; ese caso se reporta como
 * CLIENTE_RESPUESTA_NO_VALIDA, conservando el status real en `ApiError.status`.
 */
export async function request<T>(ruta: string, opciones: OpcionesPeticion = {}): Promise<T> {
  const { method = 'GET', body, token, query, signal } = opciones

  const headers = new Headers({ Accept: 'application/json' })
  if (body !== undefined) headers.set('Content-Type', 'application/json')
  if (token) headers.set('Authorization', `Bearer ${token}`)

  let respuesta: Response
  try {
    respuesta = await fetch(construirUrl(ruta, query), {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal,
    })
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error
    throw new ApiError(0, CODIGOS_CLIENTE.sinConexion, 'No fue posible conectar con el servidor. Revisa tu conexión e intenta de nuevo.')
  }

  const datos = await leerJson(respuesta)

  if (!respuesta.ok) {
    if (esErrorRespuesta(datos)) {
      throw new ApiError(respuesta.status, datos.codigo, datos.mensaje, datos.errores ?? [])
    }
    throw new ApiError(respuesta.status, CODIGOS_CLIENTE.respuestaNoValida, 'Ocurrió un error inesperado. Intenta de nuevo.')
  }

  return datos as T
}
