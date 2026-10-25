# Diferencias de diseño y su resolución — UnCalificado

**Actividad:** S05_S06_A1 · **Fecha:** 25 de octubre de 2026
**Equipo:** David, Israel, Jesús y Norman

Este documento resume qué aportó cada integrante a los tres artefactos compartidos, qué conflictos aparecieron y cómo se resolvieron. Los tres artefactos son:

| Artefacto | Archivo consolidado | Análisis detallado |
|---|---|---|
| Contrato de la API | `02_openapi/openapi_equipo.yaml` | `02_openapi/analisis_openapi.md` (decisiones OA-xx) |
| Diagrama de clases del dominio | `03_diagrama_clases/diagrama_clases_equipo.puml` | `03_diagrama_clases/analisis_diagrama_clases.md` (decisiones DC-xx) |
| Arquitectura (componentes y despliegue) | `04_arquitectura/arquitectura_equipo_componentes.puml` y `arquitectura_equipo_despliegue.puml` | `04_arquitectura/arquitectura_equipo.md` (decisiones AR-xx) |

## 1. Cifras de la consolidación

| Artefacto | Insumos | Consenso | Conflictos resueltos | Gaps adoptados | Descartado | Resultado |
|---|---|---|---|---|---|---|
| OpenAPI | 3 (Norman no entregó) | 18 operaciones | 36 operaciones y 6 conflictos globales | 34 operaciones | 18 operaciones | 88 operaciones; 183 de 183 criterios RF trazados |
| Diagrama de clases | 4 | 7 clases | 25 clases | 9 clases | 7 clases o atributos | 41 clases (37 entidades y 4 objetos de valor) |
| Arquitectura | 4 | 5 elementos | 6 conflictos | 4 grupos de elementos | Estilo serverless y Node.js | 1 diagrama C4 de componentes y 1 de despliegue; 9 decisiones |

## 2. Aportes por integrante

### David

| Artefacto | Qué aportó y quedó en la versión del equipo | Qué no se adoptó y por qué |
|---|---|---|
| OpenAPI | Patrón uniforme `POST …/respuestas` para las decisiones bilaterales (OA-07). Versiones de propuesta como subrecurso, `POST /propuestas/{id}/versiones` (OA-20). Agenda propia, `GET /citas`. Prefijo versionado `/api/v1` (OA-G2). Actualización de la cuenta propia, junto con Jesús (OA-03). | 16 operaciones de funcionalidades posteriores al MVP: moderación y sanciones (FP-14), reportes de avance (FP-15) y búsqueda libre (FP-18). Cuerpo genérico `MutationRequest` y los mismos códigos en todas las operaciones (OA-G4). Recurso `jobs` aparte de `projects` (OA-G3). |
| Diagrama de clases | `claveAlmacenamiento` de los archivos (DC-07). La abstracción `Proveedor` con dos especializaciones (DC-02), que fue de consenso. Bitácora compuesta por el proyecto (DC-12). Cambios como entidades separadas de la propuesta. | Par `Cuenta`/`Cliente`, porque `Cliente` no tiene datos propios (DC-01). Entidad `Autorizacion`, que no hace falta porque aceptar ya es autorizar (OA-25). `Cambio` colgado de la propuesta (DC-10). |
| Arquitectura | ADR del monolito modular (AR-01). Worker de notificaciones con reintentos (AR-06). Almacenamiento privado de objetos (AR-07). | PostgreSQL (AR-02): se mantiene MySQL 8, que ya está implementado; queda para validar. |

### Israel

| Artefacto | Qué aportó y quedó en la versión del equipo | Qué no se adoptó y por qué |
|---|---|---|
| OpenAPI | Base de esquemas tipados (92). Códigos específicos con 409 y 503. Esquema de error único (OA-G5). 32 gaps adoptados, sobre todo administración (verificaciones, ARCO y soporte), segundo factor y renovación de sesión (OA-26). Alineación con el backend implementado. | Prefijo `/api` sin versión (OA-G2). `PATCH /invitaciones/{id}` (OA-07). Versiones de propuesta dentro de la misma colección (OA-20). `/auth/me` (OA-03). No tenía RF-25. |
| Diagrama de clases | 6 gaps: `AvisoPrivacidad`, `Notificacion`, `FotoPortafolio`, `ResumenSolicitud`, `ModificacionCita` y `AnalisisIA`. Objetos de valor `Zona`, `Domicilio` y `DimensionesEvaluacion`. Hash encadenado de la bitácora. Marcas de tiempo de la doble confirmación de citas. Rol con 4 valores (DC-01). Estado `pendiente` de las verificaciones (DC-04). | Autoasociación «revisa» de la propuesta (DC-08). Multiplicidad 0..4 de las recomendaciones (DC-11). «Proveedor asociado» apuntando a `Usuario` (DC-05). Estado `vencida` de las verificaciones (DC-04). |
| Arquitectura | Interfaces explícitas entre capas: `IAgenteIA`, `IAlmacenamiento`, `IConexion` (AR-04). Seguridad, validación y errores como componentes. Flask, MySQL 8 y el planificador en contenedor (AR-02, AR-06, AR-08). | Almacenamiento «por definir»: se concreta como objetos privados compatibles con S3 (AR-07). |

### Jesús

| Artefacto | Qué aportó y quedó en la versión del equipo | Qué no se adoptó y por qué |
|---|---|---|
| OpenAPI | Código 413 para archivos (OA-12). Reporte mensual de disponibilidad, que hace verificable RNF-09 (OA-27). El trazado más completo de RNF (22 de 22). Prefijo `/api/v1`. | Búsqueda con POST (OA-08). Cancelación con `DELETE` con cuerpo (OA-19). Carga de archivos en JSON (OA-12). ARCO iniciado por el usuario, cuando RF-54 lo asigna al administrador (OA-24). Selección con PUT (OA-10). |
| Diagrama de clases | `Disponibilidad` como clase compuesta con `Franja` (DC-03). `objectKey` como clave de almacenamiento (DC-07). Encadenamiento de la bitácora con el evento anterior (DC-12). `Cambio` dentro de la solicitud (DC-10). | `VersionPresupuesto` colgada de la propuesta y relación muchos a muchos con el cambio (DC-09). Dimensiones de evaluación como atributos y «evaluado» solo como `Proveedor` (DC-13). `esVisita : bool` (DC-14). |
| Arquitectura | Políticas de borde: TLS, CORS y límite de peticiones (AR-05). URLs firmadas temporales (AR-07). Secretos y observabilidad con `requestId` (AR-09). Tareas idempotentes (AR-06). SPA como contenido estático. | Descomposición serverless en funciones Lambda (AR-01): las reglas transaccionales del SRS y el tamaño del equipo favorecen un monolito modular. Sus funciones por capacidad se conservan como módulos internos. |

### Norman

| Artefacto | Qué aportó y quedó en la versión del equipo | Qué no se adoptó y por qué |
|---|---|---|
| OpenAPI | No entregó especificación. | — |
| Diagrama de clases | Estructura `Propuesta` ◆ `VersionPropuesta` ◆ `ConceptoPropuesta` (DC-08). 3 gaps: `Contrapropuesta`, `SolicitudCierre` y `RevelacionDomicilio` (DC-15). Recomendaciones 1..4 según RF-30 (DC-11). La evaluación como solicitud de calificación con estado (DC-13). `modoCaptura` y `tipoTrabajo` (DC-05). Asociación del usuario con sus conversaciones (DC-06). | Jerarquía `Usuario` ← `Cliente`/`Proveedor`/`Administrador` (DC-01). `PerfilProveedor` 1-1 separado del proveedor (DC-02). `disponibilidadGeneral` como texto libre (DC-03). |
| Arquitectura | Base de los 12 módulos del equipo (AR-03). Capa de infraestructura como frontera (AR-04). Módulo transversal de Auditoría. Módulo «Notificaciones y plazos» (AR-06). ADR del monolito modular. | Node.js + Express (AR-08): el Sprint 1 ya está implementado y probado en Flask. |

## 3. Conflictos principales y cómo se resolvieron

### 3.1 Conflictos transversales a los tres artefactos

| Conflicto | Artefactos | Resolución |
|---|---|---|
| **Idioma de los nombres.** David y Jesús usaban inglés; Israel y Norman, español. | OpenAPI, clases | Español en rutas, esquemas, clases y tablas (OA-G1). Es el idioma del SRS y del código existente, y usar el mismo vocabulario en las cuatro capas evita traducir en los mapeos. |
| **Agregado central.** `Proyecto`/`jobs` (David), `Solicitud` (Israel y Jesús), `SolicitudTrabajo` (Norman). | OpenAPI, clases | Un solo agregado, `Solicitud`, con la máquina de estados de RF-45 (OA-G3, DC-05). |
| **Cómo se representa la autorización del cliente.** David la modelaba como entidad y como endpoint aparte. | OpenAPI, clases | Va dentro de cada acción sensible y se registra en la bitácora (OA-25, §4.4 del análisis de clases), porque RF-24-AC-3 establece que aceptar o confirmar ya es la autorización. |
| **Mensajes del agente y mensajes entre las partes.** David los mezclaba. | OpenAPI, clases, arquitectura | Recursos, clases y módulos separados: Conversación con el agente, y Mensajería (OA-13, DC-06, AR-03). |
| **Versiones de la propuesta.** Una fila por versión (David, Israel, Jesús) o propuesta con versiones (Norman). | OpenAPI, clases | Propuesta ◆ versiones (DC-08), y en la API `POST /propuestas/{id}/versiones` (OA-20). |
| **Motor y tecnología.** PostgreSQL (David, Jesús) o MySQL (Israel); Flask (Israel) o Node.js (Norman). | Arquitectura, clases | MySQL 8 y Flask, que ya están implementados (AR-02, AR-08). El modelo y las reglas de transformación son portables. |

### 3.2 Conflictos por artefacto (los de mayor impacto)

- **OpenAPI.** Tipos de conflicto en 36 operaciones: 29 de nombre, 14 de método, 4 de cuerpo y 2 de códigos (una operación puede tener varios). Los más relevantes:
  - búsqueda con GET en lugar de POST (OA-08);
  - recomendación generada con POST y no calculada al consultar (OA-09);
  - cierre como transición de estado y no como recurso aparte (OA-16);
  - ARCO atendido por el administrador (OA-24);
  - anidamiento superficial para crear citas, propuestas y cambios (OA-18).
- **Clases.** 25 clases con atributos o relaciones distintos según la versión. Los más relevantes:
  - rol como atributo y no como subclase (DC-01);
  - dueño de `VersionPresupuesto` y de `Cambio` (DC-09, DC-10);
  - estados de la verificación (DC-04);
  - multiplicidad de las recomendaciones (DC-11);
  - modelo de la evaluación (DC-13).
- **Arquitectura.** Los conflictos fueron:
  - el estilo: monolito modular o serverless (AR-01);
  - el motor de base de datos (AR-02);
  - la granularidad de los módulos (AR-03);
  - dónde se aplican las políticas de borde (AR-05);
  - cómo se ejecutan las tareas programadas (AR-06).

### 3.3 Criterios aplicados

Para que la resolución no dependiera de quién propuso cada cosa, los tres análisis usaron el mismo orden de criterios:

1. El SRS manda, incluido quién es el actor.
2. Semántica y consistencia: la semántica HTTP en la API, que el modelo se pueda llevar a tablas, y la coherencia con el contrato.
3. Consistencia interna: un mismo patrón en todo el artefacto.
4. Mayoría.
5. Costo de cambio sobre lo ya implementado.

Las decisiones que contradicen a la mayoría se justifican con los criterios 1 a 3 y están marcadas para validarse en equipo (§4).

## 4. Decisiones que el equipo debe validar

| Decisión | Contradice a | Por qué se tomó |
|---|---|---|
| OA-G1: nombres en español | David, Jesús | Mismo lenguaje en el SRS, la API, las clases y la base de datos; ya está implementado. |
| OA-18: anidamiento superficial | David, Jesús | Autorizar por pertenencia al proyecto desde la ruta (RNF-04). |
| DC-01: rol como atributo | Norman, David | Las subclases `Cliente` y `Administrador` no tienen datos propios. |
| DC-08: propuesta con versiones | David, Israel, Jesús | RF-39-AC-2 y el plazo de 72 h por negociación. |
| AR-02: MySQL 8 | David, Jesús | Ya está implementado; ningún requerimiento exige PostgreSQL. |
| AR-08: Flask | Norman | El Sprint 1 ya está implementado y probado. |

## 5. Lecciones del proceso

- **Las diferencias de idioma escondían acuerdos.** Una vez normalizados los nombres, muchos «conflictos» eran consenso, por ejemplo `requests` y `solicitudes`. Fijar un glosario al inicio evita esta fricción.
- **El SRS resolvió los casos difíciles.** El actor de ARCO (RF-54), la multiplicidad de las recomendaciones (RF-30) y la autorización implícita (RF-24-AC-3) se decidieron leyendo el criterio de aceptación, no por votación.
- **Los insumos menos completos aportaron piezas clave.** Jesús aportó el borde y la observabilidad; Norman, la contrapropuesta y la revelación del domicilio; David, la uniformidad de las respuestas. Ninguna versión individual cubría por sí sola todo el SRS.
- **Hay que consolidar en un orden concreto.** Primero el contrato, luego el modelo, luego la arquitectura. Cada decisión de un artefacto restringió las del siguiente (OA-20 → DC-08 → AR-03), y así los tres artefactos quedaron coherentes entre sí.
