# S07-S08-A1 · Parte 0 — Decisión del stack frontend

> **Estado del documento: aprobado por el equipo.**
> El equipo de UnCalificado revisó la propuesta técnica de la actividad S07-S08-A1 y aprobó el stack frontend: **React + Vite + TypeScript**, **CSS Modules**, **Context API** y **Fetch API**. Se conservan las alternativas consideradas y la justificación técnica que sustentaron la decisión.

## 1. Contexto

UnCalificado ya tiene definidos el SRS (`S03_A1/SRS_equipo.md`), la arquitectura consolidada (`S05_S06_A1/04_arquitectura/arquitectura_equipo.md`) y el contrato de la API (`S05_S06_A1/02_openapi/openapi_equipo.yaml`). También cuenta con un backend en Flask que implementa la autenticación con JWT en la rama `feature/s05-s06-a2-auth`. Falta definir con qué tecnología se construirá el frontend web.

La arquitectura del equipo establece que el frontend es una **SPA servida como contenido estático** por el proxy inverso Nginx (decisión **AR-05**). No fija la tecnología con la que se construye. El único antecedente en el repositorio es la propuesta individual de Norman (`S05_S06_A1/01_insumos/norman/decision_arquitectonica.md`, sección «Decisión»), que plantea React + Vite + TypeScript como decisión de implementación. Esa propuesta cita un documento `S01_A2/stack_decision.md` que no forma parte de este repositorio. Por eso esta decisión se documenta aquí de forma completa, sin depender de ese archivo.

## 2. Stack aprobado

| Aspecto | Elección | Resumen del motivo |
|---|---|---|
| Framework de UI | **React** | Modelo de componentes reutilizables y continuidad con la propuesta arquitectónica previa |
| Herramienta de construcción | **Vite** | Genera una SPA estática compatible con AR-05; servidor de desarrollo rápido con proxy hacia Flask |
| Lenguaje | **TypeScript** | Tipos para los contratos de la API (`Cuenta`, `SesionRespuesta`, `Error`, roles) y para las *props* de los componentes |
| Estilos | **CSS Modules** | Estilos con alcance local por componente, en CSS estándar, sin dependencias adicionales (Vite los soporta de forma nativa) |
| Manejo de estado | **`useState` + Context API** | El estado global se limita a la sesión: token y cuenta. El resto es estado local de cada componente |
| Comunicación HTTP | **Fetch API con `async`/`await`** | API nativa del navegador; un módulo cliente centraliza las rutas, el encabezado `Authorization` y el formato de error del backend |

Las versiones exactas de cada paquete se fijarán en `frontend/package.json` al generar el *scaffolding* (Parte 1). Se usarán las versiones estables vigentes en ese momento.

## 3. Justificación para UnCalificado

### 3.1 Coherencia con la arquitectura

- **AR-01 (cliente-servidor con API REST sin estado).** El frontend es un cliente independiente que solo se comunica con el backend por HTTP + JSON. React + Vite produce exactamente ese tipo de cliente: no incorpora lógica de servidor ni accede a la base de datos.
- **AR-05 (SPA servida por Nginx).** `vite build` genera archivos estáticos (`index.html`, JS y CSS con *hash*) que Nginx puede servir sin un proceso adicional. Esto respeta la decisión de no añadir otro servidor de aplicación.
- **AR-08 (backend en Python + Flask).** El único proceso de servidor es el backend Flask. Un frontend que no necesita Node.js en producción mantiene la arquitectura con una sola tecnología de servidor.

### 3.2 Requisitos no funcionales

| Requisito | Cómo lo apoya el stack |
|---|---|
| **RNF-01** Usabilidad; validación junto al campo (RNF-01-AC-2) | El componente `InputField` recibe el mensaje de error como *prop*. El cliente HTTP convierte la lista `errores: [{campo, mensaje}]` que devuelve el backend (HTTP 422) en errores por campo. |
| **RNF-02** Web responsive a 360 × 640 px sin desplazamiento horizontal | CSS Modules permite definir el diseño *mobile-first* de cada componente con *media queries* estándar. La tarea T-00.4 (`tareas_tecnicas.md`) fija este criterio para la vista base. |
| **RNF-02** App nativa | React no resuelve la app nativa por sí mismo, pero deja abierta la opción de React Native. Con ella se podrían reutilizar los tipos de TypeScript, la lógica del cliente HTTP y el conocimiento del equipo. Los componentes visuales no se comparten directamente. |
| **RNF-03 / RNF-04** Autenticación obligatoria; acceso por rol y propiedad | El token se envía en `Authorization: Bearer <token>`. El rol de la cuenta (`cliente`, `trabajador`, `organizacion`, `administrador`) determina qué opciones muestra la interfaz. **La autorización real la sigue haciendo el backend.** Ocultar opciones en la interfaz es solo una ayuda de usabilidad y no un control de seguridad. |
| **RNF-08** Rendimiento | Vite genera un *bundle* optimizado y con división de código. El frontend no agrega latencia de servidor. |
| **RNF-11** Reglas de autenticación | La validación de contraseña de al menos 10 caracteres puede adelantarse en el cliente, aunque la regla definitiva está en el backend. El cierre por 30 minutos de inactividad (RNF-11-AC-3) se analiza en la sección 5. |
| **RNF-14** Localización es-MX | Las fechas se formatean con `Intl.DateTimeFormat('es-MX')` en formato DD/MM/AAAA, sin bibliotecas adicionales. |
| **DoD-13** Accesibilidad básica (`definition_of_done.md`) | React permite usar HTML semántico (`<label>`, `<nav>`, `<button>`) y atributos ARIA (`aria-invalid`, `aria-describedby`) directamente en los componentes. React **no garantiza** la accesibilidad: depende de cómo se escriban los componentes. Esto se evaluará contra WCAG 2.1 en la Parte 3. |

### 3.3 Requisitos funcionales y componentes de la actividad

Los cuatro componentes de la actividad se apoyan en funcionalidades que ya existen en el SRS y en el backend:

- **Button** e **InputField:** pantalla de inicio de sesión (RF-01, tarea T-01.6), que corresponde a `POST /api/auth/login`, ya implementado.
- **Card:** resumen de una solicitud (esquema `SolicitudResumen` que devuelve `GET /api/solicitudes`, ya implementado).
- **Navbar:** navegación según el rol de la cuenta autenticada (campo `rol` de `Cuenta`).

### 3.4 Integración con Flask + JWT

El cliente HTTP se preparará con los endpoints **realmente implementados** en la rama `feature/s05-s06-a2-auth` (`backend/app/auth/routes.py`). Esta actividad no hace *merge* de esa rama.

| Endpoint implementado | Cuerpo de la petición | Respuesta relevante para el frontend |
|---|---|---|
| `POST /api/auth/login` | `correo`, `contrasena` | `tokenAcceso`, `tipoToken` (`"Bearer"`), `expiraEn` (segundos), `segundoFactorRequerido`, `requiereAceptarAviso`, `cuenta` |
| `GET /api/auth/me` | — (encabezado `Authorization: Bearer <token>`) | `Cuenta`: `id`, `nombre`, `correo`, `rol`, `consentimientoVigente`, `requiereAceptarAviso`, `creadaEn` |
| `POST /api/auth/register` | `nombre`, `correo`, `contrasena`, `rol`, `aceptaAvisoPrivacidad`, `versionAviso`, `declaraMayorDeEdad` | `Cuenta` (HTTP 201) |
| `GET /api/solicitudes` | — (token de rol `cliente`, `trabajador` u `organizacion`) | `{ elementos: SolicitudResumen[], paginacion }` |

Los errores tienen el formato `{codigo, mensaje, errores?}` (`backend/app/errors.py`). Con ese formato, el diseño previsto es:

- un **422** se traduce en mensajes junto a cada campo;
- un **401** con código `TOKEN_EXPIRADO` o `TOKEN_INVALIDO` cierra la sesión local y regresa a la pantalla de inicio de sesión;
- un **403** se muestra como acceso denegado, sin datos del recurso.

**Estado de implementación (S07-S08-A1):**

- **Implementado:** el cliente HTTP (`frontend/src/services/httpClient.ts`) convierte cualquier respuesta de error en un `ApiError` con `status`, `codigo`, `mensaje` y `errores`, y ofrece `erroresPorCampo()` para el caso 422.
- **Previsto, no implementado:** el **cierre automático de sesión ante un 401** `TOKEN_EXPIRADO` o `TOKEN_INVALIDO`. Ni el cliente HTTP ni el `AuthContext` reaccionan todavía a ese código, y ninguna pantalla consume la API en esta actividad: la demostración usa datos ficticios. La redirección ante un 403 también queda para cuando existan pantallas conectadas al backend.

Para que el frontend sea fácil de adaptar, **todas las rutas se concentrarán en un solo módulo del cliente HTTP**. El contrato del equipo (`openapi_equipo.yaml`, línea 42) prevé mover la API a `/api/v1` y renombrar `GET /api/auth/me` como `GET /api/v1/usuarios/yo`. Cuando eso ocurra, solo habrá que modificar ese módulo.

En desarrollo, el **proxy del servidor de Vite** redirigirá `/api` hacia el backend Flask (`http://localhost:5000`). Esto es necesario porque el backend de la rama no configura CORS. En producción, Nginx sirve la SPA y la API bajo el mismo dominio (AR-05), así que el problema tampoco se presenta. Esta solución no requiere modificar el backend.

Para demostrar los componentes sin depender de que el backend esté en ejecución, se usarán **datos ficticios claramente identificados** como tales, de acuerdo con DoD-12.

## 4. Alternativas consideradas

### 4.1 Vue 3 + Vite

| Ventajas | Desventajas para este proyecto |
|---|---|
| Curva de aprendizaje suave; plantillas cercanas a HTML | No coincide con la propuesta arquitectónica previa (React + Vite) |
| Componentes de un solo archivo (`.vue`) con estilos con alcance local incluidos | Su camino hacia una app nativa (RNF-02) es menos directo que el de React con React Native |
| Usa Vite de forma nativa y tiene buen soporte de TypeScript | El ecosistema de bibliotecas y la documentación de terceros son más reducidos que los de React |

**Motivo para no seleccionarla:** técnicamente es una opción válida y cumple AR-05. Se prefiere React por continuidad con la propuesta previa y por la posibilidad de reutilizar tipos y lógica con React Native.

### 4.2 Next.js

| Ventajas | Desventajas para este proyecto |
|---|---|
| Renderizado en servidor (SSR) y generación estática; buen SEO | Su valor principal (SSR, *API routes*, *server components*) requiere un servidor Node.js en producción, lo que añadiría una segunda tecnología de servidor junto a Flask (AR-08) |
| Enrutamiento por archivos y optimizaciones integradas | AR-05 define una SPA estática; con `output: 'export'` Next.js pierde buena parte de sus ventajas y agrega complejidad |
| Basado en React | Casi todas las pantallas de UnCalificado requieren sesión (RNF-03), así que el SEO aporta poco |

**Motivo para no seleccionarla:** su modelo de despliegue no coincide con AR-05 ni con AR-08, y las ventajas de SSR no corresponden a una aplicación cuyo contenido es privado y depende del usuario autenticado.

### 4.3 Bootstrap o Tailwind CSS (en lugar de CSS Modules)

| Opción | Ventajas | Desventajas para este proyecto |
|---|---|---|
| **Bootstrap** | Componentes listos (botones, formularios, *navbar*, tarjetas) y una rejilla responsive probada | La actividad pide **implementar** cuatro componentes reutilizables propios; usar los de Bootstrap reduciría el trabajo a configurarlos. Además, agrega CSS global que hay que sobrescribir para lograr una identidad propia |
| **Tailwind CSS** | Desarrollo rápido con clases utilitarias y un sistema de diseño consistente | Las cadenas largas de clases en el JSX dificultan la lectura y la revisión crítica del código generado por IA (Parte 3). Además, requiere configuración y una dependencia adicionales |

**Motivo para no seleccionarlas:** CSS Modules mantiene los estilos junto a cada componente, evita colisiones de nombres, usa CSS estándar y no añade dependencias. También deja visible en el código cada decisión de estilo que afecta la accesibilidad, como el contraste y el indicador de foco, lo que facilita evaluarla en la Parte 3.

### 4.4 Redux Toolkit o Zustand (en lugar de Context API)

| Opción | Ventajas | Desventajas para este proyecto |
|---|---|---|
| **Redux Toolkit** | Estado predecible, herramientas de depuración y patrones establecidos para aplicaciones grandes | Exige más estructura (*slices*, *store*, *dispatch*) de la que justifica el estado actual |
| **Zustand** | Ligero, con poca configuración y sin *provider* | Añade una dependencia para un problema que React ya resuelve con sus propias herramientas |

**Motivo para no seleccionarlas:** en esta etapa el único estado global es la sesión (token y cuenta). Se modifica pocas veces (al iniciar y al cerrar sesión), así que los re-renderizados de Context no representan un problema. El resto del estado (valores de formularios, menú abierto o cerrado, estado de carga) es local a cada componente. Si en el futuro crece el estado compartido o se requiere caché de datos del servidor, se puede reconsiderar una biblioteca de estado o de *data fetching*.

### 4.5 Nota sobre Fetch API frente a Axios

Axios ofrece interceptores y conversión automática de JSON. Fetch es nativa del navegador y no añade dependencias. Las funciones que se necesitarían de Axios (agregar el encabezado `Authorization`, interpretar el formato de error y reaccionar a un 401) se implementan en un solo módulo envolvente sobre `fetch`. Hay que tener en cuenta que `fetch` no rechaza la promesa ante respuestas 4xx o 5xx, así que ese módulo debe revisar `response.ok` de forma explícita.

## 5. Riesgos y puntos pendientes

1. **Almacenamiento del token.** Se propone guardar el token en memoria (Context) y, como máximo, en `sessionStorage`, nunca en `localStorage`. Ambas opciones son accesibles desde JavaScript y, por tanto, vulnerables ante un XSS. La alternativa más segura, una *cookie* `HttpOnly`, requiere cambiar el backend, lo que queda fuera del alcance de esta actividad. Se documentará como deuda técnica.
2. **Vigencia de la sesión.** El backend emite tokens con 15 minutos de vigencia (`JWT_EXPIRATION`, `backend/app/config.py` en la rama de autenticación) y no implementa `POST /auth/renovacion` ni `DELETE /auth/sesion`. El frontend no puede cumplir por sí solo RNF-11-AC-3 (cierre tras 30 minutos de inactividad), y el cierre de sesión solo puede descartar el token en el cliente.
3. **Segundo factor del administrador (RNF-11-AC-2).** El backend responde `segundoFactorRequerido: false` y no implementa `/auth/segundo-factor`. El frontend no implementará ese flujo en esta actividad.
4. **Registro.** `POST /api/auth/register` exige `versionAviso`, pero `GET /avisos-privacidad/vigente` no está implementado. Una pantalla de registro funcional queda pendiente de ese endpoint.
5. **Diferencias entre la implementación y el contrato** (`/api` frente a `/api/v1`; `/auth/me` frente a `/usuarios/yo`). Se mitigan centralizando las rutas en el cliente HTTP (sección 3.4).
6. **Validación por el equipo.** ~~Pendiente~~ **Atendido:** el equipo aprobó el stack de la sección 2 (React + Vite + TypeScript, CSS Modules, Context API y Fetch API), lo que confirma la elección de React frente a Vue. Los riesgos 1 a 5 de esta sección siguen vigentes como deuda técnica o dependencias del backend.

## 6. Referencias en el repositorio

| Documento | Uso en esta decisión |
|---|---|
| `S03_A1/SRS_equipo.md` | RNF-01, RNF-02, RNF-03, RNF-04, RNF-08, RNF-11, RNF-14; RE-01 (web responsive y app nativa); RE-09 (HTTPS) |
| `S05_S06_A1/04_arquitectura/arquitectura_equipo.md` | AR-01, AR-05, AR-08 |
| `S05_S06_A1/04_arquitectura/arquitectura_equipo_componentes.puml` | Contenedor «Aplicación web responsive — SPA servida como contenido estático» |
| `S05_S06_A1/01_insumos/norman/decision_arquitectonica.md` | Propuesta individual previa de React + Vite + TypeScript |
| `S05_S06_A1/01_insumos/norman/diagrama_componentes.puml`, `diagrama_despliegue.puml` | SPA React + Vite como decisión de implementación |
| `S05_S06_A1/02_openapi/openapi_equipo.yaml` | Esquemas `Cuenta`, `SesionRespuesta`, `Error`; prefijo `/api/v1` previsto |
| `definition_of_done.md` | DoD-12 (datos ficticios) y DoD-13 (accesibilidad básica) |
| `tareas_tecnicas.md` | T-00.4 (vista base a 360 × 640 px), T-01.6 (inicio de sesión), T-05.9 (botón «Solicitar soporte») |
| Rama `feature/s05-s06-a2-auth`: `backend/app/auth/routes.py`, `backend/app/errors.py`, `backend/app/validation.py`, `backend/app/services/solicitudes_service.py`, `backend/app/config.py` | Endpoints, campos, roles, formato de error y vigencia del JWT realmente implementados |
