# Consolidación de la especificación OpenAPI — UnCalificado

**Actividad:** S05_S06_A1, paso 2 · **Fecha:** 25 de octubre de 2026 · **Resultado:** `openapi_equipo.yaml` v1.0.0 (en esta carpeta)

Este documento compara las especificaciones OpenAPI individuales del equipo. Clasifica cada endpoint como consenso, gap o conflicto, resuelve los conflictos y explica cómo se armó el contrato consolidado. La trazabilidad con el SRS se conserva en la extensión `x-acceptance-criteria`, que usa los IDs de `SRS_equipo.md`.

## 1. Insumos

| Integrante | Archivo | Versión | Servidor base | Rutas | Operaciones | Esquemas | Operaciones con AC | Criterios RF cubiertos | Criterios RNF trazados |
|---|---|---|---|---|---|---|---|---|---|
| David | `01_insumos/david/openapi.yaml` | 1.0.0 | `https://api.uncalificado.example/api/v1` | 63 | 69 | 15 | 46 de 69 | 183 de 183 | 0 de 22 |
| Israel | `01_insumos/israel/openapi.yaml` | 0.2.0 | `https://api.uncalificado.mx/api` | 65 | 84 | 92 | 82 de 84 | 181 de 183 | 12 de 22 |
| Jesús | `01_insumos/jesus/openapi.yaml` | 1.0.0 | `https://api.uncalificado.example.com/api/v1` | 33 | 42 | 53 | 42 de 42 | 183 de 183 | 22 de 22 |
| Norman | — | — | — | — | — | — | — | — | — |

Norman no entregó especificación OpenAPI; sus diagramas sí entran en la consolidación del diagrama de clases. Ninguna de las tres especificaciones usa IDs de criterio inexistentes en el SRS. La única brecha individual de cobertura es la de Israel, a la que le faltan RF-25-AC-1, RF-25-AC-2.

## 2. Método

1. **Extracción automática.** Se leyó cada `openapi.yaml` con PyYAML y se listaron, por operación: método, ruta, resumen, esquema del cuerpo, códigos de respuesta y `x-acceptance-criteria`.
2. **Normalización.** Se quitó el prefijo de servidor (`/api/v1` o `/api`) y se emparejaron los nombres equivalentes entre idiomas: `projects`, `requests` y `jobs` con `solicitudes`; `workers` y `providers` con `proveedores`; `appointments` con `citas`, y así sucesivamente.
3. **Emparejamiento por propósito.** Dos operaciones son equivalentes si sirven al mismo requerimiento. Para decidirlo se compararon sus criterios de aceptación y su descripción, no su ruta.
4. **Clasificación:**
   - **Consenso:** al menos dos integrantes proponen la operación con el mismo método y una estructura equivalente, una vez aplicadas las decisiones globales (§5).
   - **Gap:** solo un integrante la propone. Se **adopta** si cubre un criterio del SRS que de otro modo quedaría sin endpoint o si ya está implementada. Se **descarta** si corresponde a una funcionalidad posterior al MVP (SRS §7) o si duplica otra operación.
   - **Conflicto:** el mismo propósito con distinto **nombre** (ruta o estructura), **método HTTP**, **esquema del cuerpo** o **códigos de respuesta**.
5. **Verificación de cobertura.** Un script comprueba que cada operación de los tres insumos esté en el mapa de correspondencia (consolidada o descartada) y que el contrato final cubra todos los criterios RF del SRS.

## 3. Resumen de resultados

| Resultado | Operaciones del contrato del equipo |
|---|---|
| Consenso | 18 |
| Conflicto resuelto | 36 |
| Gap adoptado | 34 (de Israel: 32; de David: 1; de Jesús: 1) |
| **Total en `openapi_equipo.yaml`** | **88** operaciones en 69 rutas |
| Operaciones descartadas | 18 (de David: 16; de Jesús: 2) |

El contrato del equipo cubre **183 de 183** criterios RF y traza 13 de 22 criterios RNF. Los RNF restantes se verifican con pruebas de UI, de carga o por inspección (ver `x-acceptance-coverage.fueraDelContrato`).

Además de las diferencias por endpoint, se encontraron **seis conflictos globales** que afectan a casi todas las operaciones: idioma, prefijo de versión, agregado central, cuerpos y códigos de respuesta, esquema de error y código de los POST de eventos. Se resolvieron una sola vez (OA-G1 a OA-G6, §5) antes de comparar endpoint por endpoint.

## 4. Diferencias por endpoint

Las rutas de David y Jesús se muestran sin `/api/v1`, y las de Israel sin `/api`. La columna «Equipo» es la ruta final dentro de `/api/v1`.

### 4.1 Consenso

| # | Equipo | David | Jesús | Israel | Decisión | Nota |
|---|---|---|---|---|---|---|
| 1 | `GET /health` | `GET /health` | — | `GET /health` | — | Se reetiqueta en «Operación». |
| 2 | `PATCH /usuarios/yo` | `PATCH /users/me` | `PATCH /users/me` | — | OA-03 | Propuesto por David y Jesús; se limita al teléfono. |
| 3 | `GET /proveedores/{proveedorId}/evaluaciones` | `GET /workers/{workerId}/reviews` | — | `GET /proveedores/{proveedorId}/evaluaciones` | — |  |
| 4 | `POST /solicitudes` | `POST /projects` | `POST /requests` | `POST /solicitudes` | OA-G1 | Captura manual; nombres resueltos por OA-G1. |
| 5 | `GET /solicitudes` | `GET /projects` | `GET /requests` | `GET /solicitudes` | OA-G1 |  |
| 6 | `GET /solicitudes/{solicitudId}` | `GET /projects/{projectId}` | `GET /requests/{requestId}` | `GET /solicitudes/{solicitudId}` | OA-G1 |  |
| 7 | `PATCH /solicitudes/{solicitudId}` | `PATCH /projects/{projectId}` | `PATCH /requests/{requestId}` | `PATCH /solicitudes/{solicitudId}` | OA-14 | Cuerpo genérico en David (MutationRequest). |
| 8 | `POST /solicitudes/{solicitudId}/representaciones-visuales` | `POST /projects/{projectId}/visualizations` | `POST /requests/{requestId}/visual-representations` | `POST /solicitudes/{solicitudId}/representaciones-visuales` | OA-21 | Se agrega 503 (IA no disponible). |
| 9 | `GET /solicitudes/{solicitudId}/recomendaciones` | `GET /projects/{projectId}/recommendations` | — | `GET /solicitudes/{solicitudId}/recomendaciones` | OA-09 |  |
| 10 | `GET /citas/{citaId}` | `GET /appointments/{appointmentId}` | `GET /appointments/{appointmentId}` | `GET /citas/{citaId}` | — |  |
| 11 | `GET /propuestas/{propuestaId}` | `GET /proposals/{proposalId}` | — | `GET /propuestas/{propuestaId}` | — |  |
| 12 | `POST /propuestas/{propuestaId}/respuestas` | `POST /proposals/{proposalId}/responses` | `POST /proposals/{proposalId}/decision` | `POST /propuestas/{propuestaId}/respuestas` | OA-07 | Mismo método; nombre del subrecurso unificado. |
| 13 | `GET /solicitudes/{solicitudId}/costos` | `GET /jobs/{jobId}/costs` | (dentro de GET /requests/{requestId}) | `GET /solicitudes/{solicitudId}/costos` | — |  |
| 14 | `GET /solicitudes/{solicitudId}/registros-bitacora` | `GET /projects/{projectId}/audit-events` | `GET /requests/{requestId}/audit-log` | `GET /solicitudes/{solicitudId}/registros-bitacora` | OA-22 | Mismo propósito y método. |
| 15 | `GET /solicitudes/{solicitudId}/mensajes` | `GET /projects/{projectId}/messages` | `GET /requests/{requestId}/messages` | `GET /solicitudes/{solicitudId}/mensajes` | OA-13 |  |
| 16 | `POST /solicitudes/{solicitudId}/mensajes` | — | `POST /requests/{requestId}/messages` | `POST /solicitudes/{solicitudId}/mensajes` | OA-13 |  |
| 17 | `POST /solicitudes/{solicitudId}/evaluaciones` | `POST /jobs/{jobId}/reviews` | `POST /requests/{requestId}/evaluations` | `POST /solicitudes/{solicitudId}/evaluaciones` | OA-G3 |  |
| 18 | `GET /notificaciones` | `GET /notifications` | — | `GET /notificaciones` | — |  |

### 4.2 Conflictos

| # | Equipo | David | Jesús | Israel | Tipo de conflicto | Decisión |
|---|---|---|---|---|---|---|
| 1 | `POST /auth/register` | `POST /auth/registrations` | `POST /auth/register` | `POST /auth/register` | nombre | OA-01 |
| 2 | `POST /auth/login` | `POST /auth/sessions` | `POST /auth/login` | `POST /auth/login` | nombre | OA-01 |
| 3 | `DELETE /auth/sesion` | `DELETE /auth/sessions/current` | `POST /auth/logout` | `DELETE /auth/sesion` | método, nombre | OA-02 |
| 4 | `GET /usuarios/yo` | `GET /users/me` | `GET /users/me` | `GET /auth/me` | nombre | OA-03 |
| 5 | `POST /usuarios/yo/consentimientos` | `POST /users/me/privacy-consents` | `POST /auth/consents` | `POST /auth/me/consentimientos` | nombre | OA-03 |
| 6 | `PUT /proveedores/yo/perfil-trabajador` | `PUT /workers/me/profile` | `POST /providers` · `PUT /providers/{providerId}` | `PUT /proveedores/yo/perfil-trabajador` | método, nombre | OA-05 |
| 7 | `PUT /proveedores/yo/perfil-organizacion` | `PUT /organizations/me/profile` | `POST /providers` · `PUT /providers/{providerId}` | `PUT /proveedores/yo/perfil-organizacion` | método, nombre | OA-05 |
| 8 | `POST /proveedores/yo/fotos-portafolio` | `POST /workers/me/portfolio-photos` | `POST /providers/{providerId}/portfolio` | `POST /proveedores/yo/fotos-portafolio` | cuerpo | OA-12 |
| 9 | `PATCH /proveedores/yo/disponibilidad` | `PATCH /workers/me/availability` · `PATCH /organizations/me/availability` | (dentro de PUT /providers/{providerId}) | `PATCH /proveedores/yo/disponibilidad` | nombre (estructura) | OA-06 |
| 10 | `GET /proveedores/{proveedorId}` | `GET /workers/{workerId}` · `GET /organizations/{organizationId}` | `GET /providers/{providerId}` | `GET /proveedores/{proveedorId}` | nombre (estructura) | OA-04 |
| 11 | `POST /proveedores/yo/verificaciones` | `POST /workers/me/verification-documents` · `POST /organizations/me/verification-documents` | `POST /providers/{providerId}/verifications` | `POST /proveedores/yo/verificaciones` | nombre, cuerpo | OA-11 |
| 12 | `PATCH /verificaciones/{verificacionId}` | `PATCH /workers/{workerId}/verification-status` · `PATCH /organizations/{organizationId}/verification-status` | `PATCH /providers/{providerId}/verifications/{verificationId}` | `PATCH /verificaciones/{verificacionId}` | nombre | OA-11 |
| 13 | `POST /conversaciones` | `POST /projects (+ mensajes)` | `POST /requests` | `POST /conversaciones` | nombre (modelo de recurso) | OA-13 |
| 14 | `GET /conversaciones/{conversacionId}` | `GET /projects/{projectId}/messages` | — | `GET /conversaciones/{conversacionId}` | nombre (modelo de recurso) | OA-13 |
| 15 | `POST /conversaciones/{conversacionId}/mensajes` | `POST /projects/{projectId}/messages` | `POST /requests` | `POST /conversaciones/{conversacionId}/mensajes` | nombre, cuerpo | OA-13 |
| 16 | `PUT /solicitudes/{solicitudId}/resumen-confirmado` | `POST /projects/{projectId}/summary-confirmations` | `PATCH /requests/{requestId}` | `PUT /solicitudes/{solicitudId}/resumen-confirmado` | método, nombre | OA-15 |
| 17 | `PATCH /solicitudes/{solicitudId}/estado` | `POST /jobs/{jobId}/closure-requests` · `POST /jobs/{jobId}/closure-requests/{closureId}/responses` | `PATCH /requests/{requestId}/status` | `PATCH /solicitudes/{solicitudId}/estado` | método, nombre | OA-16 |
| 18 | `GET /solicitudes/{solicitudId}/domicilio` | `POST /workers/me/data-sharing-authorizations` | `GET /requests/{requestId}/privacy` | `GET /solicitudes/{solicitudId}/domicilio` | método, nombre | OA-17 |
| 19 | `POST /solicitudes/{solicitudId}/adjuntos` | `POST /projects/{projectId}/photos` | `POST /requests/{requestId}/attachments` | `POST /solicitudes/{solicitudId}/adjuntos` | cuerpo, códigos | OA-12 |
| 20 | `GET /solicitudes/{solicitudId}/proveedores-compatibles` | `GET /workers (filtros)` | `POST /requests/{requestId}/search` · `GET /providers` | `GET /solicitudes/{solicitudId}/proveedores-compatibles` | método, nombre | OA-08 |
| 21 | `POST /solicitudes/{solicitudId}/recomendaciones` | `POST /projects/{projectId}/recommendations/refreshes` | (dentro de POST /requests/{requestId}/search) | `POST /solicitudes/{solicitudId}/recomendaciones` | método | OA-09 |
| 22 | `POST /solicitudes/{solicitudId}/invitaciones` | `POST /projects/{projectId}/provider-selections` | `PUT /requests/{requestId}/selection` | `POST /solicitudes/{solicitudId}/invitaciones` | método, nombre | OA-10 |
| 23 | `POST /invitaciones/{invitacionId}/respuestas` | `POST /appointments/{appointmentId}/responses` | `POST /requests/{requestId}/provider-decision` | `PATCH /invitaciones/{invitacionId}` | método, nombre | OA-07 |
| 24 | `POST /solicitudes/{solicitudId}/citas` | `POST /appointments` | `POST /appointments` | `POST /solicitudes/{solicitudId}/citas` | nombre | OA-18 |
| 25 | `POST /citas/{citaId}/respuestas` | `POST /appointments/{appointmentId}/responses` | `PATCH /appointments/{appointmentId}` | `POST /citas/{citaId}/respuestas` | método | OA-07 |
| 26 | `POST /citas/{citaId}/modificaciones` | `POST /appointments/{appointmentId}/change-requests` | `PATCH /appointments/{appointmentId}` · `DELETE /appointments/{appointmentId}` | `POST /citas/{citaId}/modificaciones` | método | OA-19 |
| 27 | `POST /solicitudes/{solicitudId}/propuestas` | `POST /proposals` | `POST /proposals` | `POST /solicitudes/{solicitudId}/propuestas` | nombre | OA-18 |
| 28 | `POST /propuestas/{propuestaId}/versiones` | `POST /proposals/{proposalId}/revisions` | — | `POST /solicitudes/{solicitudId}/propuestas` | nombre | OA-20 |
| 29 | `POST /solicitudes/{solicitudId}/cambios` | `POST /jobs/{jobId}/change-requests` | `POST /changes` | `POST /solicitudes/{solicitudId}/cambios` | nombre | OA-18 |
| 30 | `POST /cambios/{cambioId}/respuestas` | `POST /jobs/{jobId}/change-requests/{changeId}/responses` | `PATCH /changes/{changeId}/decision` | `POST /cambios/{cambioId}/decisiones` | método, nombre | OA-07 |
| 31 | `POST /cambios/{cambioId}/analisis` | `POST /jobs/{jobId}/change-requests/{changeId}/analysis` | `POST /changes/{changeId}/analysis` | `POST /cambios/{cambioId}/analisis` | códigos | OA-21 |
| 32 | `POST /casos-soporte` | `POST /projects/{projectId}/support-requests` | `POST /requests/{requestId}/support-requests` | `POST /casos-soporte` | nombre | OA-23 |
| 33 | `POST /solicitudes-arco` | `POST /users/me/privacy-requests` | `POST /privacy/requests` | `POST /solicitudes-arco` | nombre (actor) | OA-24 |
| 34 | `GET /solicitudes-arco/{folio}` | `GET /users/me/privacy-requests/{requestId}` | — | `GET /solicitudes-arco/{folio}` | nombre (actor) | OA-24 |
| 35 | `PATCH /solicitudes-arco/{folio}` | — | `POST /privacy/requests/{folio}/fulfillment` | `PATCH /solicitudes-arco/{folio}` | método | OA-24 |
| 36 | `POST /usuarios/{usuarioId}/anonimizacion` | `POST /users/me/deletion-requests` | — | `POST /usuarios/{usuarioId}/anonimizacion` | nombre (actor) | OA-24 |

### 4.3 Gaps adoptados

| # | Equipo | David | Jesús | Israel | Decisión | Nota |
|---|---|---|---|---|---|---|
| 1 | `POST /auth/segundo-factor` | — | — | `POST /auth/segundo-factor` | OA-26 | RNF-11-AC-2 exige segundo factor del administrador. |
| 2 | `POST /auth/renovacion` | — | — | `POST /auth/renovacion` | OA-26 | RNF-11-AC-3 (cierre por inactividad) con JWT de 15 min. |
| 3 | `PATCH /usuarios/yo/contrasena` | — | — | `PATCH /auth/me/contrasena` | OA-03 | RNF-11-AC-1 al cambiar la contraseña. |
| 4 | `GET /avisos-privacidad/vigente` | — | — | `GET /avisos-privacidad/vigente` | — | RF-02-AC-1: mostrar el aviso antes de registrarse. |
| 5 | `POST /avisos-privacidad` | — | — | `POST /avisos-privacidad` | — | RF-02-AC-3: nueva versión del aviso. |
| 6 | `GET /proveedores/yo` | — | — | `GET /proveedores/yo` | — | Perfil propio con estado de verificaciones. |
| 7 | `DELETE /proveedores/yo/fotos-portafolio/{fotoId}` | — | — | `DELETE /proveedores/yo/fotos-portafolio/{fotoId}` | — | RF-04-AC-2: quitar una foto. |
| 8 | `GET /verificaciones` | — | — | `GET /verificaciones` | OA-11 | Bandeja del administrador (RF-09 a RF-11). |
| 9 | `GET /verificaciones/{verificacionId}` | — | — | `GET /verificaciones/{verificacionId}` | OA-11 |  |
| 10 | `GET /verificaciones/{verificacionId}/documentos/{documentoId}` | — | — | `GET /verificaciones/{verificacionId}/documentos/{documentoId}` | OA-11 | RNF-05: descarga controlada de identificaciones. |
| 11 | `POST /clasificaciones-oficio` | — | — | `POST /clasificaciones-oficio` | — | Medición de RF-15-AC-1 y AC-2 por el administrador. |
| 12 | `DELETE /solicitudes/{solicitudId}` | — | — | `DELETE /solicitudes/{solicitudId}` | — | Ya implementado; solo en borrador. |
| 13 | `GET /solicitudes/{solicitudId}/adjuntos/{adjuntoId}` | — | — | `GET /solicitudes/{solicitudId}/adjuntos/{adjuntoId}` | — | RNF-06: acceso controlado a imágenes. |
| 14 | `DELETE /solicitudes/{solicitudId}/adjuntos/{adjuntoId}` | — | — | `DELETE /solicitudes/{solicitudId}/adjuntos/{adjuntoId}` | — | RF-18-AC-3: reemplazar una imagen. |
| 15 | `GET /solicitudes/{solicitudId}/representaciones-visuales/{representacionId}` | — | — | `GET /solicitudes/{solicitudId}/representaciones-visuales/{representacionId}` | — | RF-23-AC-2. |
| 16 | `PATCH /solicitudes/{solicitudId}/representaciones-visuales/{representacionId}` | — | — | `PATCH /solicitudes/{solicitudId}/representaciones-visuales/{representacionId}` | — | RF-23-AC-1: editar o aprobar. |
| 17 | `GET /proveedores/yo/invitaciones` | — | — | `GET /proveedores/yo/invitaciones` | — | RF-31-AC-3: el proveedor ve las solicitudes recibidas. |
| 18 | `GET /invitaciones/{invitacionId}` | — | — | `GET /invitaciones/{invitacionId}` | — |  |
| 19 | `GET /solicitudes/{solicitudId}/citas` | — | — | `GET /solicitudes/{solicitudId}/citas` | OA-18 |  |
| 20 | `GET /citas` | `GET /appointments` | — | — | OA-18 | Agenda propia entre proyectos (propuesto por David). |
| 21 | `GET /solicitudes/{solicitudId}/propuestas` | — | — | `GET /solicitudes/{solicitudId}/propuestas` | — | RF-39-AC-4: historial de versiones. |
| 22 | `GET /solicitudes/{solicitudId}/cambios` | — | — | `GET /solicitudes/{solicitudId}/cambios` | — |  |
| 23 | `GET /cambios/{cambioId}` | — | — | `GET /cambios/{cambioId}` | — |  |
| 24 | `GET /solicitudes/{solicitudId}/versiones-presupuesto` | — | — | `GET /solicitudes/{solicitudId}/versiones-presupuesto` | — | RF-43. |
| 25 | `GET /solicitudes/{solicitudId}/evaluaciones` | — | — | `GET /solicitudes/{solicitudId}/evaluaciones` | — | RF-51: solicitudes de calificación. |
| 26 | `GET /casos-soporte` | — | — | `GET /casos-soporte` | OA-23 | Ya implementado. |
| 27 | `GET /casos-soporte/{casoId}` | — | — | `GET /casos-soporte/{casoId}` | OA-23 | Ya implementado. |
| 28 | `PATCH /casos-soporte/{casoId}` | — | — | `PATCH /casos-soporte/{casoId}` | OA-23 | Ya implementado. |
| 29 | `DELETE /casos-soporte/{casoId}` | — | — | `DELETE /casos-soporte/{casoId}` | OA-23 | Ya implementado; solo casos duplicados o creados por error. |
| 30 | `GET /solicitudes-arco` | — | — | `GET /solicitudes-arco` | OA-24 |  |
| 31 | `GET /usuarios/{usuarioId}/datos-personales` | — | — | `GET /usuarios/{usuarioId}/datos-personales` | OA-24 | RF-54-AC-1. |
| 32 | `PATCH /usuarios/{usuarioId}/datos-personales` | — | — | `PATCH /usuarios/{usuarioId}/datos-personales` | OA-24 | RF-54-AC-2. |
| 33 | `PATCH /notificaciones/{notificacionId}` | — | — | `PATCH /notificaciones/{notificacionId}` | — |  |
| 34 | `GET /reportes-disponibilidad` | — | `GET /admin/availability-reports` | — | OA-27 | RNF-09-AC-1 (propuesto por Jesús). |

**Conflictos por tipo** (una operación puede tener varios): nombre 29, método 14, cuerpo 4, códigos 2.

### 4.4 Gaps descartados

| # | Integrante | Operación | Motivo | Referencia |
|---|---|---|---|---|
| 1 | David | `POST /projects/{projectId}/authorizations` | RF-24 se cumple dentro de cada acción sensible; RF-24-AC-3 establece que aceptar la propuesta o confirmar la cita ya es la autorización. | OA-25 |
| 2 | David | `POST /workers/me/data-sharing-authorizations` | RF-52 trata del domicilio del cliente, y la revelación es automática al aceptar la propuesta o confirmar la visita. | OA-17 |
| 3 | David | `PATCH /appointments/{appointmentId}/visit-status` | Ningún RF pide registrar la visita; el inicio del trabajo se registra con el estado de la solicitud (RF-45-AC-2). | OA-16 |
| 4 | David | `POST /jobs/{jobId}/progress-reports` | Reportes periódicos de avance: posterior al MVP. | FP-15 |
| 5 | David | `GET /jobs/{jobId}/progress-reports` | Reportes periódicos de avance: posterior al MVP. | FP-15 |
| 6 | David | `POST /jobs/{jobId}/progress-reports/{reportId}/responses` | Reportes periódicos de avance: posterior al MVP. | FP-15 |
| 7 | David | `POST /reviews/{reviewId}/responses` | Respuesta a evaluaciones: posterior al MVP. | FP-14 |
| 8 | David | `POST /reviews/{reviewId}/appeals` | Revisión de evaluaciones: posterior al MVP. | FP-14 |
| 9 | David | `POST /reports` | Reportes de irregularidades: posterior al MVP. | FP-14 |
| 10 | David | `GET /reports/{reportId}` | Ídem. | FP-14 |
| 11 | David | `POST /reports/{reportId}/evidence-requests` | Moderación: posterior al MVP. | FP-14 |
| 12 | David | `POST /reports/{reportId}/decisions` | Moderación: posterior al MVP. | FP-14 |
| 13 | David | `POST /reports/{reportId}/appeals` | Moderación: posterior al MVP. | FP-14 |
| 14 | David | `POST /reports/{reportId}/appeals/{appealId}/decisions` | Moderación: posterior al MVP. | FP-14 |
| 15 | David | `POST /workers/{workerId}/sanctions` | Sanciones: posterior al MVP. | FP-14 |
| 16 | David | `GET /workers (búsqueda libre)` | Catálogo o lista libre de trabajadores: posterior al MVP; la búsqueda parte de una solicitud confirmada (RF-26). | FP-18 |
| 17 | Jesús | `GET /providers (búsqueda libre)` | Ídem. | FP-18 |
| 18 | Jesús | `GET /providers/{providerId}/portfolio` | El portafolio ya viaja en el perfil público (RF-07); una ruta aparte duplica la lectura. | OA-04 |

Las referencias `FP-xx` remiten al SRS §7, «Funcionalidades posteriores al MVP». Los descartes no eliminan la idea: quedan registrados para cuando esas funcionalidades entren al backlog.

## 5. Resolución de conflictos

Para resolver cada conflicto se aplicaron cinco criterios, en este orden:

1. **El SRS manda.** Gana la versión que cumple el requerimiento tal como está escrito, incluido quién es el actor.
2. **Semántica HTTP.** Se usa GET para leer, PUT para reemplazar de forma idempotente, PATCH para cambiar parte de un recurso, POST para crear o registrar un evento y DELETE para borrar.
3. **Consistencia interna.** Un mismo patrón se aplica en todo el contrato.
4. **Mayoría.** Cuando los criterios anteriores empatan, gana la forma que usan dos de los tres integrantes.
5. **Costo de cambio.** Ante un empate restante, se conserva lo ya implementado en el backend del Sprint 1.

### Decisiones globales

| ID | Conflicto | Opciones | Decisión y justificación |
|---|---|---|---|
| OA-G1 | Idioma y nombre del recurso central | David y Jesús: inglés (`projects`, `requests`, `workers`, `providers`). Israel: español (`solicitudes`, `proveedores`). | **Español.** Es el lenguaje del SRS, del diagrama de clases consolidado (que alimenta la base de datos) y del backend implementado. Usar el mismo vocabulario en las cuatro capas evita traducir en los mapeos. Criterios 3 y 5, aunque contradice la mayoría (criterio 4, de menor prioridad). |
| OA-G2 | Prefijo y versión | David y Jesús: `/api/v1`. Israel: `/api`. | **`/api/v1`.** La versión explícita permite publicar una v2 sin romper la app nativa (RNF-02). Criterio 4. El backend solo cambia el `url_prefix` de 3 blueprints. |
| OA-G3 | Agregado del ciclo de vida | David: `projects` (antes de contratar) y `jobs` (después). Jesús e Israel: un solo recurso. | **Un solo agregado, `solicitudes`.** RF-45 define una única máquina de estados (borrador → confirmada → programado → en proceso → terminado → concluido). Dos recursos obligarían a sincronizar estados y a duplicar la autorización. Criterios 1 y 4. |
| OA-G4 | Esquema del cuerpo y códigos de respuesta | David: un `MutationRequest` genérico en 40 operaciones y los mismos 7 códigos (200/201, 400, 401, 403, 404, 422, 500) en todas, sin 409. Jesús e Israel: cuerpos tipados y códigos por operación. | **Cuerpos tipados y códigos específicos.** Un cuerpo genérico no se puede validar ni probar contra los criterios Dado/cuando/entonces. Varias reglas del SRS son de estado (plazos de 24 h y 72 h, transiciones), y sin 409 no se distinguen de un error de validación. Criterios 2 y 4. |
| OA-G5 | Esquema de error | David: `ApiError`. Jesús: `Error` y `ValidationError`. Israel: `Error` con `errores[]`. | **Un solo `Error {codigo, mensaje, errores[], detalle}`.** Para 422, `errores[]` identifica cada campo, que es lo que pide RNF-01-AC-2. Es el esquema que ya devuelve el backend. Criterios 1 y 5. |
| OA-G6 | Código de respuesta de los POST de eventos | David: 201 en todas las «responses». Jesús e Israel: 200 con el recurso padre actualizado. | **200.** La respuesta no crea un recurso consultable por separado; cambia el estado del padre (cita, propuesta o cambio) y se registra en la bitácora. Criterio 4. |

### Decisiones por endpoint

| ID | Conflicto | Decisión y justificación |
|---|---|---|
| OA-01 | Registro e inicio de sesión: David usa `/auth/registrations` y `/auth/sessions`. | **`/auth/register` y `/auth/login`.** Dos de tres integrantes y el código implementado (criterios 4 y 5). `revision_rest.md` documenta `/auth` como excepción de flujo. |
| OA-02 | Cierre de sesión: David usa `DELETE /auth/sessions/current`, Jesús `POST /auth/logout` e Israel `DELETE /auth/sesion`. | **`DELETE /auth/sesion`, 204.** Cerrar sesión elimina la sesión vigente: DELETE expresa esa semántica; `POST /logout` es estilo RPC (criterio 2). |
| OA-03 | Cuenta propia: David y Jesús usan `/users/me`; Israel `/auth/me`. El consentimiento tiene tres rutas distintas. | **Recurso `/usuarios/yo`** con `GET`, `PATCH` (solo teléfono), `/contrasena` y `/consentimientos`. La cuenta es un recurso y no parte del flujo de autenticación, como propone la mayoría (criterio 4); el alias `yo` sigue la convención de `/proveedores/yo` (criterio 3). El `PATCH` no permite cambiar el nombre, porque RF-54-AC-2 exige que la rectificación pase por el administrador con registro de valores. |
| OA-04 | Perfil público: David separa `/workers/{id}` de `/organizations/{id}`. | **`GET /proveedores/{proveedorId}` único.** La búsqueda (RF-26) y la recomendación (RF-30) mezclan ambos tipos en un mismo resultado, y el cliente abre el perfil sin saber de antemano el tipo. El campo `tipo` distingue la variante. El portafolio viaja dentro del perfil (RF-07), por eso se descarta `GET /providers/{id}/portfolio` de Jesús. |
| OA-05 | Alta y edición del perfil: Jesús usa `POST /providers` y `PUT /providers/{id}`. | **`PUT /proveedores/yo/perfil-trabajador` y `PUT /proveedores/yo/perfil-organizacion`.** Cada cuenta tiene exactamente un perfil, así que «crear o reemplazar» es idempotente (criterio 2). Usar `yo` evita exponer y validar el ID del proveedor (RNF-04). Las dos rutas tienen esquemas distintos (RF-03 frente a RF-05). David coincide en el método. |
| OA-06 | Disponibilidad: David usa dos rutas; Jesús la incluye dentro del perfil. | **`PATCH /proveedores/yo/disponibilidad`, con un cuerpo `oneOf` según el tipo.** La disponibilidad cambia con más frecuencia que el perfil (RF-06) y no debe obligar a reenviar el perfil completo (criterio 2). |
| OA-07 | Decisiones bilaterales: invitación (David usa `POST /appointments/{id}/responses`, Jesús `POST /requests/{id}/provider-decision`, Israel `PATCH /invitaciones/{id}`), cita (Jesús usa `PATCH`), propuesta (Jesús usa `/decision`) y cambio (David usa `/responses`, Jesús `PATCH /decision`, Israel `/decisiones`). | **Un solo patrón: `POST /{recurso}/{id}/respuestas`.** Cada respuesta es un evento inmutable que se agrega a la bitácora (RNF-12) y que puede ser rechazado por plazo (409). Viene del patrón de David, aplicado ahora a los cuatro recursos (criterio 3). David asociaba RF-32 a la respuesta de una *cita*; RF-32 trata de la *invitación*. |
| OA-08 | Búsqueda: Jesús usa `POST /requests/{id}/search` y `GET /providers`; David `GET /workers` con filtros. | **`GET /solicitudes/{id}/proveedores-compatibles`.** Buscar no cambia estado: GET es seguro, idempotente y almacenable en caché (criterio 2). Va anidada porque RF-26 busca «para la versión confirmada de una solicitud». La búsqueda libre de David y Jesús es el catálogo FP-18, posterior al MVP, y se descarta. |
| OA-09 | Recomendación: David la calcula al hacer GET y la recalcula con `POST …/refreshes`; Jesús la devuelve dentro de la búsqueda. | **`POST /solicitudes/{id}/recomendaciones` genera y `GET` consulta la vigente.** Generar invoca al agente de IA: tiene costo, puede fallar (503) y su resultado debe quedar fijo para auditar el orden sin pagos (RNF-10). Un GET con efectos violaría la semántica. El «refresh» de David se cubre volviendo a hacer POST después de editar la zona o la fecha. |
| OA-10 | Selección del proveedor: David usa `POST …/provider-selections` y Jesús `PUT …/selection`. | **`POST /solicitudes/{id}/invitaciones`.** Seleccionar crea una invitación con ciclo propio (pendiente → aceptada, rechazada o expirada en 4 h; RF-32). Es un recurso nuevo, no el reemplazo de un campo (criterio 2). Dos de tres usan POST. |
| OA-11 | Verificaciones: David usa dos rutas por tipo de proveedor y resuelve con `PATCH …/verification-status`; Jesús las anida en el proveedor con cuerpo JSON. | **`POST /proveedores/yo/verificaciones` (multipart) y `/verificaciones/{id}` para el administrador.** Hay consenso en el método PATCH. El administrador revisa una bandeja de verificaciones de todos los proveedores (`GET /verificaciones`), así que la verificación necesita una URL propia. |
| OA-12 | Carga de archivos: Jesús envía un `FileUploadRequest` en JSON; David e Israel usan multipart. | **`multipart/form-data`**, con el código **413** que propuso Jesús. El multipart evita inflar el archivo un 33 % con base64 y permite validar el tipo y el tamaño antes de leerlo completo (RNF-06). Criterio 4. |
| OA-13 | Conversación con el agente: David usa `/projects/{id}/messages` tanto para el agente como para el canal humano; Jesús crea la solicitud con el primer mensaje (`POST /requests`). | **Dos recursos: `/conversaciones` (agente) y `/solicitudes/{id}/mensajes` (canal entre las partes, RF-46).** Tienen participantes, reglas y retención distintos (RNF-07). En el modelo de David, un mismo GET mezclaba mensajes del agente con mensajes del proveedor. La conversación genera el borrador de la solicitud (`Conversacion.solicitudId`); si no hay IA, el borrador se crea por captura manual (RF-21). |
| OA-14 | Edición del borrador: David manda `MutationRequest`. | **`PATCH /solicitudes/{id}` con `ActualizarSolicitudRequest`** (OA-G4). Solo se permite en `borrador`; en cualquier otro estado responde 409. |
| OA-15 | Confirmación del resumen: David usa `POST …/summary-confirmations`, Jesús `PATCH /requests/{id}` e Israel `PUT …/resumen-confirmado`. | **`PUT /solicitudes/{id}/resumen-confirmado`.** El cliente envía el resumen completo, editado (RF-20), y confirmar dos veces el mismo resumen deja el mismo estado. Es un reemplazo idempotente (criterio 2). Un PATCH genérico ocultaría la transición borrador → confirmada. |
| OA-16 | Avance y cierre: David usa `closure-requests` con sus respuestas y `visit-status`; Jesús e Israel usan `PATCH …/estado`. | **`PATCH /solicitudes/{id}/estado`, con validación de transiciones (409).** RF-45 y RF-47 describen transiciones de una sola máquina de estados, y la transición queda en la bitácora. Dos de tres (criterio 4). Se descarta `visit-status`, porque ningún RF lo pide. |
| OA-17 | Domicilio: David usa una autorización del trabajador (`data-sharing-authorizations`) y Jesús `GET /requests/{id}/privacy`. | **`GET /solicitudes/{id}/domicilio`.** RF-52 trata del domicilio del **cliente**, y la revelación es automática al aceptar la propuesta o confirmar la visita (RF-24-AC-3), sin un paso adicional de autorización. El recurso es específico; `privacy` era ambiguo. |
| OA-18 | Creación de citas, propuestas y cambios: David y Jesús crean en la raíz (`POST /appointments`, `/proposals`, `/changes`) con el ID de la solicitud en el cuerpo. | **Anidamiento superficial:** se crea bajo la solicitud (`POST /solicitudes/{id}/citas`) y se opera por el ID propio (`/citas/{id}`). El padre es obligatorio, y tenerlo en la ruta permite autorizar por pertenencia al proyecto antes de leer el cuerpo (RNF-04). Se agrega `GET /citas`, propuesta de David, como agenda propia entre proyectos. Prevalecen los criterios 1 y 3 sobre la mayoría. |
| OA-19 | Cancelación o reprogramación de una cita: Jesús usa `PATCH` y `DELETE` con cuerpo. | **`POST /citas/{id}/modificaciones`.** La cancelación no borra la cita: se conserva con su motivo para la bitácora y para RF-37. Un DELETE con cuerpo además no está definido de forma interoperable (RFC 9110 §9.3.5). Coincide con el enfoque de David. |
| OA-20 | Versión revisada de una propuesta: Israel reutiliza `POST /solicitudes/{id}/propuestas`; David usa `POST /proposals/{id}/revisions`. | **`POST /propuestas/{id}/versiones`**, tomado de David. La versión depende de una propuesta existente con un ajuste pendiente (RF-39-AC-2), y la ruta hace explícita esa dependencia y su 409. |
| OA-21 | Análisis de IA y representación visual: Jesús responde 200 al análisis; David e Israel responden 201. | **201 con `Location`**, porque se crea un `AnalisisIA` consultable desde el cambio, y **503** si el proveedor de IA no responde (RE-04). |
| OA-22 | Bitácora: David usa `audit-events`, Jesús `audit-log` e Israel `registros-bitacora`. | **`GET /solicitudes/{id}/registros-bitacora`.** Hay consenso en el método; el nombre coincide con la clase `RegistroBitacora` del diagrama consolidado (OA-G1). |
| OA-23 | Soporte humano: David y Jesús lo anidan en la solicitud. | **`/casos-soporte` en la raíz**, con `solicitudId` y `conversacionId` opcionales. RF-22-AC-1 dispara el soporte durante la conversación, *antes* de que exista una solicitud, y el administrador atiende una bandeja global. Ya está implementado (criterio 5). |
| OA-24 | Derechos ARCO: David y Jesús hacen que el **usuario** cree la solicitud ARCO y la eliminación de datos; Israel lo asigna al **administrador**. | **El administrador registra la solicitud con folio y la atiende** (exportar, rectificar, anonimizar). RF-54 dice: «El administrador debe poder, desde la plataforma…»; la solicitud llega por el canal del aviso de privacidad. Se conserva el `PATCH` de respuesta de Israel en lugar del `POST …/fulfillment` de Jesús (criterio 2). |
| OA-25 | Autorización de acciones sensibles: David usa un recurso aparte, `POST /projects/{id}/authorizations`. | **La autorización va dentro de cada acción.** RF-24-AC-3 establece que aceptar la propuesta o confirmar la cita *es* la autorización. Si falta la confirmación explícita, la acción responde 422 `AUTORIZACION_REQUERIDA` (RF-24-AC-2). |
| OA-26 | Segundo factor y renovación: solo Israel. | **Se adoptan.** Sin ellos no hay operación que cumpla RNF-11-AC-2 (segundo factor del administrador) ni RNF-11-AC-3 (cierre por inactividad con un JWT de 15 min). |
| OA-27 | Reporte de disponibilidad: solo Jesús, con `GET /admin/availability-reports`. | **Se adopta como `GET /reportes-disponibilidad`** (administrador). Es la única forma verificable de RNF-09-AC-1, que antes quedaba fuera del contrato. Se quita el segmento `admin` porque el rol ya se controla con `x-roles`. |


## 6. Trazabilidad con `SRS_equipo.md`

- **Se conserva `x-acceptance-criteria`** en las 88 operaciones. La base fue la lista de cada operación en la especificación que la resolvió, y se ajustó cuando la decisión movió un criterio:
  - RF-39-AC-2 pasa a `POST /propuestas/{propuestaId}/versiones`.
  - RF-25-AC-1 y RF-25-AC-2, que David y Jesús trazaban y faltaban en Israel, se agregan a los mensajes con el agente y a la búsqueda.
  - RNF-09-AC-1 se agrega a `GET /reportes-disponibilidad`.
- **Se agrega `x-consolidacion`** a cada operación: `estado` (consenso, conflicto o gap adoptado), `propuestoPor` y `decision`. Con esto se puede rastrear el origen de cada endpoint sin abrir este documento.
- **Errores de mapeo detectados en los insumos**, corregidos en el contrato:
  - David asociaba RF-46 (canal entre las partes) al envío de mensajes al *agente*, y RF-32 (invitación) a la respuesta a una *cita*.
  - Jesús concentraba 42 criterios en `POST /requests`, entre ellos los de recomendación (RF-30), representación visual (RF-23) y soporte (RF-22), que tienen operaciones propias.
  - David dejaba 23 operaciones sin criterio, y varias tenían el resumen genérico «Gestionar recurso».
- **Validación.** `openapi_equipo.yaml` pasa `openapi-spec-validator` (OpenAPI 3.0.3), no tiene `$ref` rotos ni `operationId` repetidos, y todos los criterios que usa existen en el SRS.

## 7. Observaciones de calidad por insumo

| Integrante | Fortalezas aportadas al contrato | Debilidades corregidas |
|---|---|---|
| David | Patrón uniforme de subrecursos `responses` (OA-07), versiones de propuesta como subrecurso (OA-20), agenda propia `GET /citas`, prefijo `/api/v1` (OA-G2) | Cuerpo genérico en 40 operaciones; mismos 7 códigos en todas, sin 409; 23 operaciones sin criterio; operaciones de funcionalidades posteriores al MVP (FP-14, FP-15, FP-18); dos agregados (`projects` y `jobs`) |
| Israel | Esquemas tipados por operación (92), códigos específicos con 409 y 503, cobertura de criterios transversales, endpoints de administración (verificaciones, ARCO y soporte), alineación con el backend implementado | Faltaba RF-25; prefijo sin versión; usaba PATCH en las invitaciones y la colección de propuestas para las versiones |
| Jesús | Código 413 para archivos (OA-12), reporte de disponibilidad (RNF-09, OA-27), trazado más completo de RNF (22 de 22), prefijo `/api/v1` | Resúmenes vacíos en la mayoría de las operaciones; búsqueda con POST; DELETE con cuerpo; carga de archivos en JSON; ARCO iniciado por el usuario, cuando RF-54 lo asigna al administrador |

## 8. Impacto y siguientes pasos

1. **Backend (Sprint 1):** cambiar `url_prefix` de `/api/...` a `/api/v1/...` en los blueprints `auth`, `solicitudes` y `casos_soporte`; mover `GET /auth/me` a `GET /usuarios/yo`; actualizar `README_backend.md` y las pruebas.
2. **Diagrama de clases consolidado:** los esquemas del contrato y las clases del dominio comparten nombres en español (OA-G1). Las diferencias pendientes se listan en `03_diagrama_clases/analisis_diagrama_clases.md`.
3. **Revisión del equipo:** validar en la siguiente reunión las decisiones OA-G1 (español) y OA-18 (anidamiento superficial), que contradicen la mayoría por criterios de mayor prioridad.
