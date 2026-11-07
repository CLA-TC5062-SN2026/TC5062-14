# Capa de servicios de API: decisiones de diseño

> **Actividad:** S09-S10-A1, Parte 1.
> **Insumos:** [`../S07_S08_A1/decision_stack_frontend.md`](../S07_S08_A1/decision_stack_frontend.md) (stack: React + Vite + TypeScript, Fetch API, Context API) y `S05_S06_A1/02_openapi/openapi_equipo.yaml`.
> **Backend usado:** Flask + JWT de la rama `feature/s05-s06-a2-auth` (sin modificaciones).
> **Código:** `frontend/src/services/`.

## Resumen

| Pregunta | Respuesta |
|---|---|
| ¿Qué cliente HTTP? | **Fetch API** nativa, envuelta en un solo módulo: `services/httpClient.ts`. |
| ¿Cómo se agrega el JWT? | Con un **interceptor de petición** registrado en `httpClient.ts`, que lee el token guardado y pone `Authorization: Bearer <jwt>` en toda petición autenticada. |
| ¿Dónde se manejan los errores? | En **un solo lugar**: `request()` convierte fallas de red, tiempo agotado y respuestas 4xx/5xx en un `ApiError` con un mensaje listo para mostrar. Un **interceptor de error** cierra la sesión ante un 401 de token inválido o expirado. |
| ¿Dónde se guarda el token? | En **`sessionStorage`** (`services/tokenStorage.ts`), junto con su fecha de expiración. Nunca en `localStorage`. |
| ¿De dónde sale la URL base? | De **`VITE_API_URL`**, la variable configurada en S07-S08-A1 (por defecto `/api`). |

## 1. Estructura

```
frontend/src/services/
├── httpClient.ts           Único módulo que llama a fetch: URL base, interceptores, errores
├── tokenStorage.ts         Guarda, lee y borra el JWT (sessionStorage)
├── endpoints.ts            Rutas de la API en un solo lugar
├── apiTypes.ts             Tipos de las respuestas del backend
├── authService.ts          login, obtenerCuentaActual, cerrarSesion
├── solicitudesService.ts   listar, obtener, crear, actualizar, eliminar
├── casosSoporteService.ts  crear, listar, obtener, actualizar, eliminar
└── healthService.ts        verificar (GET /api/health)
```

**Regla de dependencias:** los componentes y páginas solo importan servicios (`authService`, `solicitudesService`…). Los servicios solo importan `httpClient`. Ningún componente llama a `fetch` ni lee el token directamente.

```
Página / componente ──► [recurso]Service ──► httpClient.request() ──► fetch
                                                 │
                         interceptores de petición (JWT) / de error (401)
```

## 2. Cliente HTTP: Fetch API

Se mantiene la decisión de S07-S08-A1 (sección 4.5): **Fetch** no agrega dependencias, y lo que se habría tomado de Axios (interceptores, JSON automático, manejo de errores) cabe en un módulo de unas 250 líneas.

Lo que `request<T>(ruta, opciones)` resuelve y Fetch no hace por sí sola:

| Necesidad | Implementación |
|---|---|
| URL base | `API_URL = import.meta.env.VITE_API_URL ?? '/api'` + la ruta de `endpoints.ts` |
| JSON | Serializa `body` y pone `Content-Type: application/json`; interpreta la respuesta con tolerancia a cuerpos vacíos (204) o no JSON |
| Errores 4xx/5xx | `fetch` **no** rechaza la promesa ante un 404 o un 500; aquí se revisa `response.ok` y se lanza `ApiError` |
| Tiempo límite | `AbortController` con 15 s (`TIEMPO_LIMITE_MS`) |
| Cancelación | Acepta un `signal` del llamador; la vista de solicitudes cancela la petición anterior al cambiar de página o salir |
| Parámetros de consulta | `query: { pagina, tamanoPagina, estado }`, omitiendo los `undefined` |

## 3. Interceptores

Fetch no tiene interceptores, así que se implementaron como dos listas de funciones dentro de `httpClient.ts`, con la misma idea que los de Axios:

```ts
export type InterceptorPeticion = (peticion: PeticionPreparada) => PeticionPreparada
export type InterceptorError = (error: ApiError, peticion: PeticionPreparada) => void

export function agregarInterceptorPeticion(fn: InterceptorPeticion): () => void  // devuelve "quitar"
export function agregarInterceptorError(fn: InterceptorError): () => void
```

### 3.1 Interceptor de petición: JWT

Se registra al cargar el módulo, así que aplica a **todas** las peticiones sin que cada servicio tenga que recordarlo:

```ts
export const interceptorJwt: InterceptorPeticion = (peticion) => {
  if (!peticion.autenticada || peticion.headers.has('Authorization')) return peticion
  const token = obtenerToken()            // null si no hay token o ya venció
  if (token) peticion.headers.set('Authorization', `Bearer ${token}`)
  return peticion
}
agregarInterceptorPeticion(interceptorJwt)
```

- Las peticiones públicas lo desactivan con `autenticada: false` (login y health).
- Un token vencido no se envía: `obtenerToken()` lo detecta por su fecha de expiración y lo borra.

### 3.2 Interceptor de error: sesión inválida

Lo registra `AuthProvider` (`context/AuthProvider.tsx`) al montarse. Ante un **401** con código `NO_AUTENTICADO`, `TOKEN_EXPIRADO` o `TOKEN_INVALIDO` en una petición autenticada, borra el token y deja la sesión como anónima. `RutaProtegida` reacciona a ese cambio y lleva al login con el aviso «Tu sesión expiró».

```ts
agregarInterceptorError((error, peticion) => {
  const sesionInvalida = error.status === 401 && CODIGOS_SESION_INVALIDA.includes(error.codigo)
  if (sesionInvalida && peticion.autenticada) terminarSesion('expirada')
})
```

Así ninguna pantalla tiene que revisar el 401 por su cuenta. La condición `peticion.autenticada` evita que un login con contraseña incorrecta, que también es un 401 (`CREDENCIALES_INVALIDAS`), se confunda con una sesión expirada.

## 4. Manejo de errores centralizado

Todo error sale de `request()` como `ApiError { status, codigo, mensaje, errores[] }`. La interpretación de los status vive en dos funciones de `httpClient.ts`: `errorDesdeRespuesta()` y `mensajeParaUsuario()`.

| Situación | `status` | `codigo` | Mensaje que ve el usuario |
|---|---|---|---|
| Backend con error de negocio (401 credenciales, 404, 409, 422) | el del backend | el del backend | El **mensaje del backend**, que ya está en español y es específico (p. ej. «Correo o contraseña incorrectos.») |
| 422 con `errores[]` | 422 | `VALIDACION` | Además, `erroresPorCampo()` permite mostrar cada error junto a su campo (RNF-01-AC-2) |
| 403 | 403 | `ACCESO_DENEGADO` | «No tienes permiso para ver esta información.» |
| 5xx del backend | 500 | `ERROR_INTERNO` | «Ocurrió un error en el servidor. Intenta de nuevo en unos minutos.» |
| Proxy sin backend (Vite o Nginx responden 502/503/504 sin JSON) | 502–504 | `CLIENTE_SERVIDOR_NO_DISPONIBLE` | «El servidor de UnCalificado no está disponible en este momento…» |
| Sin red o servidor inalcanzable (`fetch` rechaza) | 0 | `CLIENTE_SIN_CONEXION` | «No fue posible conectar con el servidor…» o, si el navegador reporta que no hay red, «No tienes conexión a internet…» |
| Más de 15 s sin respuesta | 0 | `CLIENTE_TIEMPO_AGOTADO` | «El servidor tardó demasiado en responder…» |
| Respuesta sin el formato esperado | el real | `CLIENTE_RESPUESTA_NO_VALIDA` | «Ocurrió un error inesperado…» |

Los códigos que genera el cliente llevan el prefijo `CLIENTE_` para no confundirse con los del backend.

**En la interfaz**, los mensajes se muestran en la pantalla, no solo en la consola:
- **Login:** alerta (`role="alert"`) arriba del formulario, que recibe el foco.
- **Mis solicitudes:** alerta con el título «No se pudieron cargar las solicitudes.», el mensaje y un botón **Reintentar**.

## 5. Almacenamiento del token

**Decisión: `sessionStorage`**, en `tokenStorage.ts`, con la clave `uncalificado.sesion`:

```json
{ "token": "<jwt>", "expiraEnMs": 1794070800000 }
```

| Opción | ¿Sobrevive a recargar? | Exposición | Decisión |
|---|---|---|---|
| Solo memoria (estado de React) | No: cada recarga obliga a iniciar sesión de nuevo | Menor | Descartada por usabilidad: el video y el uso normal requieren recargar o abrir enlaces directos |
| **`sessionStorage`** | **Sí, dentro de la misma pestaña** | Legible desde JavaScript (XSS) | **Elegida.** Se borra al cerrar la pestaña y no se comparte entre pestañas |
| `localStorage` | Sí, indefinidamente y en todas las pestañas | Legible desde JavaScript (XSS), y por más tiempo | Descartada. S07-S08-A1 ya lo había excluido (sección 5.1) |
| Cookie `HttpOnly` + `Secure` + `SameSite` | Sí | JavaScript no la puede leer | **La más segura, pero requiere cambiar el backend** (emitir la cookie y protegerse contra CSRF). Queda como deuda técnica |

**Medidas complementarias:**
- **Solo se guarda el token y su expiración.** Los datos de la cuenta no se persisten: al recargar se piden a `GET /api/auth/me`, lo que además confirma con el backend que el token sigue siendo válido.
- **Expiración en el cliente:** con `expiraEn` (900 s en el backend) se calcula el vencimiento. Un token vencido no se envía y se borra al leerlo, y `AuthProvider` programa el fin de la sesión cuando vence.
- **Respaldo en memoria** si el navegador bloquea `sessionStorage`, por ejemplo en algunos modos privados.
- **Cierre de sesión solo en el cliente:** `authService.cerrarSesion()` borra el token. El backend no tiene un endpoint para revocarlo, así que un token robado seguiría siendo válido hasta que expire, como máximo 15 minutos.

## 6. URL base y entorno

| Entorno | `VITE_API_URL` | Cómo llega al backend |
|---|---|---|
| Desarrollo | `/api` (valor por defecto, en `.env.example`) | El proxy de Vite reenvía `/api/*` a `BACKEND_PROXY_TARGET` (`http://localhost:5000`). El navegador ve un solo origen, así que no hace falta CORS en Flask |
| Producción (AR-05) | `/api` | Nginx sirve la SPA y la API bajo el mismo dominio |
| API en otro dominio | `https://api.ejemplo.mx/api` | Funcionaría, pero el backend tendría que habilitar CORS |

`VITE_API_URL` queda incluida en el código que descarga el navegador, por eso nunca debe contener secretos.

## 7. Servicios por recurso

Cubren **los endpoints que el backend implementa**. Los que solo existen en `openapi_equipo.yaml` (por ejemplo `/api/v1/...`, `/auth/renovacion` o `/usuarios/yo`) no se incluyeron porque hoy responderían 404. Cuando el backend los implemente, solo habrá que cambiar `endpoints.ts`.

| Servicio | Función | Endpoint | Rol requerido por el backend |
|---|---|---|---|
| `authService` | `login(credenciales)` | `POST /api/auth/login` | Público. Guarda el token |
| | `obtenerCuentaActual()` | `GET /api/auth/me` | Cualquiera con sesión |
| | `cerrarSesion()`, `haySesionGuardada()` | — | Solo cliente |
| `solicitudesService` | `listar({ pagina, tamanoPagina, estado })` | `GET /api/solicitudes` | cliente, trabajador, organización |
| | `obtener(id)` | `GET /api/solicitudes/{id}` | Los anteriores + administrador |
| | `crear(datos)`, `actualizar(id, cambios)`, `eliminar(id)` | `POST`, `PATCH`, `DELETE` | cliente dueño (borrador) |
| `casosSoporteService` | `crear`, `listar`, `obtener`, `actualizar`, `eliminar` | `/api/casos-soporte[...]` | cliente / administrador |
| `healthService` | `verificar()` | `GET /api/health` | Público |

`POST /api/auth/register` no tiene función: el registro quedó fuera del alcance de esta actividad.

## 8. Verificación

**Pruebas automatizadas** (`npm run test`: 11 archivos, **77 pruebas**, 27 de ellas nuevas en esta actividad):

| Archivo | Qué comprueba |
|---|---|
| `services/httpClient.test.ts` | URL base y consulta; el interceptor agrega `Bearer`; no lo agrega en peticiones públicas ni con un token vencido; falla de red, 502 sin cuerpo y 422 con errores por campo; el interceptor de error recibe el 401; mensajes de 403 y 5xx |
| `services/tokenStorage.test.ts` | `sessionStorage` y no `localStorage`; un token vencido se borra; datos corruptos se ignoran |
| `services/authService.test.ts` | `login` envía las credenciales y guarda el token; un login fallido no lo guarda; `cerrarSesion` lo borra |
| `routes/flujoAutenticacion.test.tsx` | Flujo de autenticación completo (ver `LEEME.md`) |
| `pages/Solicitudes/SolicitudesPage.test.tsx` | Carga, lista, error con reintento, lista vacía, paginación, axe |

**Contra el backend real** (Flask + MariaDB, Chrome controlado con Playwright): 19 comprobaciones aprobadas. Entre ellas, que `Authorization: Bearer` se envía en cada `GET /api/solicitudes`, que el token está en `sessionStorage` y que `localStorage` queda vacío, que un token alterado lleva al login con el aviso de sesión expirada, y que con el backend apagado se ven mensajes en pantalla tanto en el login como en «Mis solicitudes».

## 9. Limitaciones

1. **Token legible desde JavaScript.** Se mitiga con `sessionStorage` y la vigencia de 15 minutos; la solución completa (cookie `HttpOnly`) requiere cambios en el backend.
2. **Sin renovación de token.** El backend no implementa `POST /auth/renovacion`, así que a los 15 minutos hay que volver a iniciar sesión.
3. **Restaurar la sesión con el backend apagado.** Si al recargar la página `GET /api/auth/me` falla por un problema de conexión, la sesión se descarta y se pide iniciar sesión de nuevo, con el mensaje de servidor no disponible. Es lo más seguro, pero obliga a reingresar las credenciales.
4. **Sin reintentos automáticos.** Ante un error de conexión, el usuario decide cuándo reintentar con el botón «Reintentar».
