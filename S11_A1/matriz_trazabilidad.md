# Matriz de trazabilidad — UnCalificado

Documento de trazabilidad (IEEE 29148 / prácticas de V&V): conecta cada **requerimiento funcional del SRS** con su **historia de usuario del backlog**, los **endpoints** relevantes y la **evidencia de prueba**.

**Ancla reproducible:** rama `doc_entrega`, commit `e616974`.

**Regla de oro:** `x-acceptance-criteria` en OpenAPI **no** cuenta como Completo sin handler que satisfaga el RF **y** evidencia de prueba que lo ejercite.

## Fuentes

| Artefacto | Ubicación |
|---|---|
| SRS (RF-01…RF-55) | `TC5062-A01840340/Compendio_SRS/SRS_equipo.md` |
| Backlog (HU-01…HU-15) | `TC5062-14/S03_A1/backlog_completo.md` |
| Contrato API | [`contracts/openapi.yaml`](contracts/openapi.yaml) |
| Implementación | [`app/`](app/) |
| Pruebas automatizadas | [`tests/`](tests/) |
| S09-A1 | `TC5062-14/S09_A1_jesus/` (lint/code review/refactor; **no** UAT funcional) |
| Revisión SRS de esta matriz | [`docs/revision_matriz_trazabilidad_srs.md`](docs/revision_matriz_trazabilidad_srs.md) |

## Leyenda de estado

| Estado | Significado |
|---|---|
| **Completo** | Comportamiento esencial del RF en la API, con al menos una prueba que lo ejercita (o evidencia explícita equivalente). |
| **Parcial** | Hay capacidad relacionada, pero faltan AC materiales del SRS. |
| **No implementado** | No hay comportamiento usable que cumpla el RF. |

## Resumen (55 RF)

| Estado | Cantidad |
|---|---|
| Completo | 35 |
| Parcial | 15 |
| No implementado | 5 |

> Lectura honesta: el contrato etiqueta muchos AC de agente/IA/notificaciones sobre `/requests` y citas; el camino real de solicitud es **captura manual**. Contrato ≠ implementación.

## Matriz RF → HU → Endpoint → Prueba → Estado

| RF | Título | Historia(s) | Endpoint(s) / nota | Prueba | Estado | Justificación |
|---|---|---|---|---|---|---|
| RF-01 | Registro e inicio de sesión | HU-01 — Registro con cuenta y consentimiento | `POST /auth/register`<br>`POST /auth/login`<br>`GET /auth/oauth/providers`<br>`GET /auth/oauth/{provider}`<br>`GET /auth/oauth/{provider}/callback`<br>`POST /auth/oauth/exchange`<br>`POST /explore/providers/{providerId}` | `tests/test_auth.py`, `tests/test_oauth.py`, `tests/test_platform.py` | Completo | Registro, login, OAuth; registro público no crea administrador. |
| RF-02 | Consentimiento del aviso de privacidad | HU-01 — Registro con cuenta y consentimiento | `POST /auth/register`<br>`POST /auth/login`<br>`POST /auth/consents`<br>`GET /auth/oauth/{provider}`<br>`GET /auth/oauth/{provider}/callback` | `tests/test_platform.py`, `tests/test_auth.py` | Completo | Consentimiento versionado en registro y `/auth/consents`. |
| RF-03 | Perfil del trabajador | HU-02 — Perfil de proveedor visible para los clientes | `POST /providers`<br>`PUT /providers/{providerId}` | `tests/test_providers.py` | Completo | Alta/actualización de perfil trabajador con oficios y cobertura. |
| RF-04 | Portafolio opcional | HU-02 — Perfil de proveedor visible para los clientes | `GET /explore/works`<br>`GET /providers/{providerId}/portfolio`<br>`POST /providers/{providerId}/portfolio` | `tests/test_providers.py`, `tests/test_explore.py` | Completo | Portafolio con URL firmada; visible en explore/works. |
| RF-05 | Registro y perfil de la organización | HU-02 — Perfil de proveedor visible para los clientes | `POST /providers`<br>`PUT /providers/{providerId}` | `tests/test_providers.py` | Completo | Organización como modalidad del mismo recurso proveedor. |
| RF-06 | Disponibilidad del proveedor | HU-02 — Perfil de proveedor visible para los clientes | `POST /providers`<br>`PUT /providers/{providerId}` | `tests/test_providers.py` (perfil); búsqueda usa `unavailableDates` en código sin test dedicado | Parcial | `unavailableDates` sí filtra búsqueda; no hay API de franjas/`AvailabilitySlot` (solo seed). |
| RF-07 | Consulta del perfil del proveedor | HU-02 — Perfil de proveedor visible para los clientes | `GET /explore/providers`<br>`GET /explore/providers/{providerId}`<br>`GET /explore/works`<br>`GET /providers`<br>`GET /providers/{providerId}` | `tests/test_providers.py`, `tests/test_explore.py` | Completo | Consulta de perfil con métricas y sin domicilio exacto público. |
| RF-08 | Distinción entre información declarada y verificada | HU-03 — Verificación de proveedores | `GET /providers/{providerId}` | `tests/test_providers.py` | Completo | Serialización distingue declarado vs verificado. |
| RF-09 | Verificación de identidad del trabajador | HU-03 — Verificación de proveedores | `POST /providers/{providerId}/verifications`<br>`PATCH /providers/{providerId}/verifications/{verificationId}` | `tests/test_providers.py` | Completo | Envío y revisión admin de identidad. |
| RF-10 | Verificación de experiencia | HU-03 — Verificación de proveedores | `POST /providers/{providerId}/verifications`<br>`PATCH /providers/{providerId}/verifications/{verificationId}` | `tests/test_providers.py` | Completo | Verificación de experiencia por el mismo flujo tipado. |
| RF-11 | Verificación de la organización | HU-03 — Verificación de proveedores | `POST /providers/{providerId}/verifications`<br>`PATCH /providers/{providerId}/verifications/{verificationId}` | `tests/test_providers.py` | Completo | Verificación de organización por el mismo flujo tipado. |
| RF-12 | Retiro de la verificación | HU-03 — Verificación de proveedores | `POST /providers/{providerId}/verifications`<br>`PATCH /providers/{providerId}/verifications/{verificationId}` | `tests/test_providers.py` (revisión admin; no vencimiento) | Parcial | Admin puede retirar (`RETIRADA`); no hay job de vencimiento automático ni aviso al proveedor (RF-12-AC-1). |
| RF-13 | Identificación del agente como asistente automático | HU-05 — Describir mi necesidad conversando con el agente | Solo etiquetado en contrato (`POST /requests`); sin comportamiento de agente | Sin evidencia automatizada | No implementado | No hay mensaje/turno de agente que se identifique como asistente; solo flags `aiConversationId`/`manualCapture`. |
| RF-14 | Conversación guiada con el agente | HU-05 — Describir mi necesidad conversando con el agente | Solo etiquetado en contrato | Sin evidencia automatizada | No implementado | Sin turnos de conversación guiada ni endpoint de diálogo. |
| RF-15 | Clasificación del oficio | HU-05 — Describir mi necesidad conversando con el agente | Solo etiquetado en contrato + campo oficio en solicitud | Sin evidencia automatizada | Parcial | Oficio se captura manualmente del catálogo; sin clasificador IA ni umbral 90 %. |
| RF-16 | Datos mínimos del borrador y de la búsqueda | HU-06 — Completar y confirmar mi solicitud | `GET /requests`<br>`POST /requests`<br>`GET /requests/{requestId}`<br>`PATCH /requests/{requestId}` | `tests/test_projects.py` | Completo | Borrador con mínimos y validación antes de búsqueda. |
| RF-17 | Fotos y videos en la solicitud | HU-06 — Completar y confirmar mi solicitud | `PATCH /requests/{requestId}`<br>`POST /requests/{requestId}/attachments` | Sin evidencia automatizada | Parcial | Existe `POST .../attachments` con tope de tamaño; no hay test que ejercite adjuntos ni todos los AC de formato/voz. |
| RF-18 | Límites de imágenes y proyectos múltiples | HU-06 — Completar y confirmar mi solicitud | `POST /providers/{providerId}/portfolio`<br>`POST /requests/{requestId}/attachments` | Sin evidencia automatizada | Parcial | Tope 5 MB en adjuntos; no se aplica el máximo de 10 imágenes por proyecto ni multi-proyecto activo completo. |
| RF-19 | Repregunta ante ambigüedad | HU-05 — Describir mi necesidad conversando con el agente | Solo etiquetado en contrato | Sin evidencia automatizada | No implementado | Sin repregunta ante ambigüedad. |
| RF-20 | Resumen confirmable de la solicitud | HU-06 — Completar y confirmar mi solicitud | `POST /requests`<br>`GET /requests/{requestId}`<br>`PATCH /requests/{requestId}` | `tests/test_projects.py` (confirmación/edición manual) | Parcial | Confirmación via `summaryConfirmed` en camino manual (RF-21); no “el agente presenta resumen” (RF-20-AC-1). |
| RF-21 | Captura manual si la IA no está disponible | HU-06 — Completar y confirmar mi solicitud | `GET /requests`<br>`POST /requests`<br>`PATCH /requests/{requestId}`<br>`POST /requests/{requestId}/attachments` | `tests/test_projects.py`, `tests/test_explore.py` | Completo | La captura manual es el camino primario real de alta de solicitud. |
| RF-22 | Solicitud de soporte humano | HU-05 — Describir mi necesidad conversando con el agente | `POST /requests/{requestId}/support-requests` (alta); AC de agente solo en contrato | Sin evidencia automatizada | Parcial | `POST .../support-requests` registra caso+motivo; sin resumen de conversación, oferta automática tras 2 fallos ni cola admin. |
| RF-23 | Representación visual con IA | HU-07 — Visualizar el alcance con imágenes de referencia | `POST /requests/{requestId}/visual-representations` (persistencia); sin generación IA | Sin evidencia automatizada | Parcial | `visual-representations` persiste descripción y archivo de referencia; no genera imagen con IA. |
| RF-24 | Autorización explícita de acciones sensibles | HU-04 — Control de mis datos y de mi domicilio | `PUT .../selection`, decisiones de propuesta/cambio; no marco de agente | `tests/test_projects.py` (selección) | Parcial | Selección/decisión HTTP explícita; no hay marco de “acciones sensibles del agente”. |
| RF-25 | Indicador de procesamiento | HU-05 — Describir mi necesidad conversando con el agente | Ninguno que cumpla el RF (AC solo en contrato) | Sin evidencia automatizada | No implementado | Indicador de latencia no implementado en API ni en el cliente web actual. |
| RF-26 | Búsqueda de proveedores compatibles | HU-08 — Encontrar y comparar proveedores | `GET /explore/providers`<br>`GET /providers`<br>`POST /requests/{requestId}/search` | `tests/test_projects.py`, `tests/test_explore.py` | Completo | Búsqueda por oficio/zona y listado explore. |
| RF-27 | Búsqueda sin resultados | HU-08 — Encontrar y comparar proveedores | `GET /providers`<br>`POST /requests`<br>`POST /requests/{requestId}/search` | `tests/test_projects.py` | Completo | Mensaje explícito sin resultados. |
| RF-28 | Filtros por verificación y experiencia similar | HU-08 — Encontrar y comparar proveedores | `GET /providers`<br>`POST /requests/{requestId}/search` | `tests/test_projects.py` (búsqueda general) | Parcial | `verifiedOnly`/`similarExperience` existen; “experiencia similar” ≈ tener evaluaciones, no trabajos similares. |
| RF-29 | Filtrar y ordenar resultados | HU-08 — Encontrar y comparar proveedores | `GET /providers`<br>`POST /requests/{requestId}/search` | `tests/test_projects.py` | Parcial | Sort rating/precio/disponibilidad/garantía/proximidad; no “colonias vecinas” (RF-29-AC-4). |
| RF-30 | Recomendación de 3 a 4 proveedores | HU-08 — Encontrar y comparar proveedores | `GET /providers`<br>`POST /requests`<br>`POST /requests/{requestId}/search` | `tests/test_projects.py` | Parcial | Hasta 4 recomendaciones con explicación fija de reglas; no ranking/explicación de IA. |
| RF-31 | Selección del proveedor | HU-09 — Elegir un proveedor y obtener su aceptación | `GET /requests/{requestId}`<br>`POST /requests/{requestId}/search`<br>`PUT /requests/{requestId}/selection` | `tests/test_projects.py` | Completo | Selección asocia proveedor y audita. |
| RF-32 | Aceptación de la solicitud por el prestador | HU-09 — Elegir un proveedor y obtener su aceptación | `POST /requests/{requestId}/provider-decision`<br>`POST /appointments`<br>UI `RequestPage` (aceptar/rechazar) | `tests/test_projects.py`<br>`web/e2e/test_flujo_cliente.py` | Completo | Aceptar/rechazar del prestador con expiración; UI + E2E Selenium. |
| RF-33 | Costo de la visita | HU-10 — Agendar citas confirmadas por ambas partes | `POST /appointments`<br>`GET /appointments`<br>`GET /appointments/{appointmentId}`<br>UI cita/agenda | `tests/test_contracting.py`<br>`web/e2e/test_flujo_*.py` | Completo | Costo de visita en cita; listado de agenda y UI. |
| RF-34 | Agendamiento con doble confirmación | HU-10 — Agendar citas confirmadas por ambas partes | `POST /appointments`<br>`GET /appointments`<br>`GET /appointments/{appointmentId}`<br>`PATCH /appointments/{appointmentId}`<br>UI cliente/proveedor | `tests/test_contracting.py`<br>`web/e2e/test_flujo_cliente.py` | Completo | Doble confirmación y estados; UI confirma cita. |
| RF-35 | Bloqueo de franjas | HU-10 — Agendar citas confirmadas por ambas partes | `POST /appointments`<br>`DELETE /appointments/{appointmentId}` | `tests/test_contracting.py` | Completo | Bloqueo/liberación de franja al crear/cancelar. |
| RF-36 | Notificación y recordatorio de cita | HU-10 — Agendar citas confirmadas por ambas partes | Ninguno que notifique (AC solo en contrato sobre citas) | Sin evidencia automatizada | No implementado | Sin canal email/push/SMS ni job de recordatorio 24 h. |
| RF-37 | Cancelación, cambios y reprogramación de citas | HU-10 — Agendar citas confirmadas por ambas partes | `POST /appointments`<br>`PATCH /appointments/{appointmentId}`<br>`DELETE /appointments/{appointmentId}` | `tests/test_contracting.py` (mutación de cita) | Parcial | Cancelar/reprogramar sí; notificación a la contraparte no (mismo gap que RF-36). |
| RF-38 | Propuesta escrita con desglose | HU-11 — Recibir y negociar una propuesta escrita | `POST /proposals`<br>`GET /proposals?requestId=`<br>UI presupuesto en `RequestPage` | `tests/test_contracting.py`<br>`web/e2e/test_flujo_cliente.py` | Completo | Propuesta con desglose; listado por proyecto y UI. |
| RF-39 | Aceptación, negociación y expiración de la propuesta | HU-11 — Recibir y negociar una propuesta escrita | `POST /proposals`<br>`POST /proposals/{proposalId}/decision`<br>`PATCH /requests/{requestId}/status`<br>UI aceptar presupuesto | `tests/test_contracting.py`<br>`web/e2e/test_flujo_cliente.py` | Completo | Decisión/negociación/expiración; cliente acepta en UI. |
| RF-40 | Registro de solicitud de cambio | HU-12 — Decidir sobre los cambios de costo, material, alcance o fecha | `POST /changes` | `tests/test_contracting.py` | Completo | Registro de cambio antes de aplicar. |
| RF-41 | Decisión del cliente sobre un cambio | HU-12 — Decidir sobre los cambios de costo, material, alcance o fecha | `POST /changes`<br>`PATCH /changes/{changeId}/decision` | `tests/test_contracting.py` | Completo | Decisión sobre cambios. |
| RF-42 | Análisis con IA de la justificación | HU-13 — Consultar costos y analizar justificaciones | `POST /changes`<br>`POST /changes/{changeId}/analysis` | Sin evidencia automatizada | Parcial | `POST /changes/{id}/analysis` genera plantilla informativa; no modelo de IA. El test de contracting no llama este endpoint. |
| RF-43 | Historial de versiones del presupuesto | HU-13 — Consultar costos y analizar justificaciones | `POST /proposals/{proposalId}/decision`<br>`PATCH /changes/{changeId}/decision` | `tests/test_contracting.py` | Completo | Versiones de presupuesto al aprobar. |
| RF-44 | Consulta de costos | HU-13 — Consultar costos y analizar justificaciones | `GET /requests/{requestId}`<br>`PATCH /changes/{changeId}/decision` | `tests/test_contracting.py`, `tests/test_projects.py` | Completo | Consulta de costos en la solicitud. |
| RF-45 | Seguimiento por estados del proyecto | HU-14 — Seguir y cerrar el trabajo | `GET /requests`<br>`GET /requests/{requestId}`<br>`PATCH /requests/{requestId}/status`<br>UI avance en `RequestPage` | `tests/test_projects.py`, `tests/test_contracting.py`<br>`web/e2e/test_flujo_cliente.py` | Completo | Transiciones de estado; UI + E2E hasta cierre. |
| RF-46 | Canal interno de mensajes del proyecto | HU-14 — Seguir y cerrar el trabajo | `GET /requests/{requestId}/messages`<br>`POST /requests/{requestId}/messages`<br>UI hilo en `RequestPage` | `tests/test_projects.py`<br>`web/e2e/test_flujo_cliente.py` | Completo | Mensajes internos; rechazo de teléfonos; UI + E2E. |
| RF-47 | Cierre del trabajo | HU-14 — Seguir y cerrar el trabajo | `PATCH /requests/{requestId}/status`<br>UI confirmar cierre | `tests/test_contracting.py`<br>`web/e2e/test_flujo_cliente.py` | Completo | Cierre comercial por estados; UI cliente. |
| RF-48 | Aviso por cierre sin respuesta | HU-14 — Seguir y cerrar el trabajo | `PATCH /requests/{requestId}/status` | Sin evidencia automatizada | Parcial | RF-48-AC-2 (admin no cambia cierre) sí en `update_status`; RF-48-AC-1 (aviso a 72 h) no. |
| RF-49 | Evaluación del proveedor por el cliente | HU-15 — Evaluar a la contraparte al concluir | `POST /requests/{requestId}/evaluations`<br>UI evaluación | `tests/test_contracting.py`<br>`web/e2e/test_flujo_cliente.py` | Completo | Evaluación del proveedor; UI + E2E. |
| RF-50 | Evaluación del cliente por el proveedor | HU-15 — Evaluar a la contraparte al concluir | `POST /requests/{requestId}/evaluations`<br>UI evaluación | `tests/test_contracting.py` (API)<br>UI en `RequestPage` | Completo | Evaluación del cliente; UI lista (E2E Selenium cubre sobre todo RF-49 para no saturar rate-limit de login). |
| RF-51 | Publicación de las evaluaciones | HU-15 — Evaluar a la contraparte al concluir | `POST /requests/{requestId}/evaluations` | `tests/test_contracting.py`, `tests/test_providers.py` | Completo | Promedios sobre evaluaciones publicadas. |
| RF-52 | Revelación del domicilio del cliente | HU-04 — Control de mis datos y de mi domicilio | `GET /explore/works`<br>`GET /explore/zones`<br>`GET /requests/{requestId}`<br>`POST /appointments`<br>`GET /appointments/{appointmentId}`<br>`PATCH /appointments/{appointmentId}`<br>`POST /proposals`<br>`POST /proposals/{proposalId}/decision`<br>`GET /requests/{requestId}/privacy` | `tests/test_projects.py`, `tests/test_explore.py`, `tests/test_geo.py` | Completo | Domicilio exacto no público; revelación condicionada. |
| RF-53 | Visibilidad del domicilio del trabajador | HU-04 — Control de mis datos y de mi domicilio | `GET /explore/providers/{providerId}`<br>`GET /providers/{providerId}`<br>`GET /appointments/{appointmentId}` | `tests/test_explore.py`, `tests/test_providers.py` | Completo | Zona aproximada del trabajador. |
| RF-54 | Atención de solicitudes ARCO | HU-04 — Control de mis datos y de mi domicilio | `PATCH /users/me`<br>`POST /privacy/requests`<br>`POST /privacy/requests/{folio}/fulfillment` | `tests/test_privacy.py`, `tests/test_platform.py` | Completo | ARCO + cumplimiento admin + patch usuario. |
| RF-55 | Solicitud de cambio iniciada por el cliente | HU-12 — Decidir sobre los cambios de costo, material, alcance o fecha | `POST /changes`<br>`PATCH /changes/{changeId}/decision` | `tests/test_contracting.py` | Completo | Cliente inicia cambios vía `/changes`. |

## Cobertura por épica (backlog)

| Épica | RF | Lectura |
|---|---|---|
| EP-01 Cuentas, confianza y privacidad | RF-01…12, RF-24, RF-52…54 | Cuentas/verificación/privacidad mayormente **completos**; RF-12 y RF-24 **parciales**. |
| EP-02 Solicitud guiada por el agente | RF-13…23, RF-25 | Deuda fuerte: conversación/IA **ausente**; útil el camino **manual** (RF-16/17/20/21). |
| EP-03 Búsqueda, selección y agendamiento | RF-26…37 | Búsqueda/selección/citas mutables **sólidas**; RF-36 **no**; RF-30/29/37 **parciales**. |
| EP-04 Propuesta y control de costos | RF-38…44, RF-55 | Propuestas/cambios **completos**; RF-42 análisis **plantilla**. |
| EP-05 Seguimiento, cierre y evaluación | RF-45…51 | Mensajes/estados/evaluaciones **completos**; RF-48 **parcial** (AC-2 sí, AC-1 no). |

## Notas

1. Un RF puede mapear a varias HU y endpoints; si la celda dice “solo etiquetado en contrato”, esos paths **no** demuestran el RF.
2. S09-A1 no sustituye UAT: ver `code_review-jesus.md`, `output_linter-jesus.txt`, etc.
3. El cliente web cubre índice/login/cuenta/ficha; no cubre toda la contratación.
4. Feedback del revisor SRS experto: [`docs/revision_matriz_trazabilidad_srs.md`](docs/revision_matriz_trazabilidad_srs.md).

