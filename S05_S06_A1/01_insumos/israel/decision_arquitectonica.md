# ADR-001: Selección del estilo arquitectónico

**Fecha:** 2026-10-25
**Estado:** Aceptado
**Autor:** Isra (con apoyo del agente de IA como analista)
**Fuentes:** `S03_A1/SRS_equipo.md` (RNF-01 a RNF-14, RE-01 a RE-09, PV-11), `01_OpenAPI/openapi.yaml` v0.2.0, `S03_A2/definition_of_done.md`

---

## Contexto

UnCalificado es una plataforma que conecta a clientes que necesitan un trabajo de oficio con trabajadores independientes y organizaciones de contratistas. Un agente de IA guía la solicitud. El MVP abarca 55 RF en 11 capacidades: cuentas, perfiles, verificación, solicitud guiada, búsqueda, citas, propuestas, cambios de costo, seguimiento, evaluaciones y privacidad.

### Requerimientos no funcionales y restricciones que condicionan la arquitectura

| ID | Requerimiento | Implicación para el estilo |
|---|---|---|
| RE-01, RNF-02 | Aplicación web responsive **y** app nativa para los cuatro actores, con las mismas funciones por rol | Separar la interfaz de la lógica: un backend con una **API única** consumida por dos clientes |
| RNF-08 | 3 s en p95 con **100 usuarios concurrentes**; la IA queda fuera del umbral | Carga moderada (piloto en 6 municipios); no exige escalar componentes por separado |
| RNF-09 | 99 % de disponibilidad mensual | Tolera mantenimientos programados; basta con una sola instancia bien monitoreada |
| RNF-13 | No perder conversaciones, citas ni acuerdos ante caídas | Persistir antes de responder; transacciones |
| RNF-12 | Bitácora inalterable de propuestas y cambios | Consistencia fuerte y transacciones: favorece una sola base relacional |
| RNF-03, RNF-04, RNF-11 | Autenticación obligatoria, control por rol y propiedad, JWT y segundo factor del administrador | Seguridad transversal centralizada en un solo punto de entrada |
| RE-04 | El agente depende de un servicio de IA externo; si no está disponible, aplica la captura manual (RF-21) | Aislar la IA detrás de una interfaz propia |
| RE-09 | Todas las interfaces usan HTTPS | Un punto de terminación TLS |
| RNF-01, RNF-14 | Usabilidad y localización | No condicionan el estilo de backend |
| PV-11, DoD v1.0 | Capacidad del equipo sin confirmar; **sin CI/CD completo**. Para esta actividad, el equipo es **un desarrollador** con 8–9 h por semana | La complejidad operativa debe ser mínima |

**Problema:** elegir un estilo que cumpla estos requerimientos y que **un solo desarrollador** pueda construir, probar y desplegar a tiempo, sin cerrar la puerta a crecer después del piloto.

---

## Alternativas consideradas

### A. Cliente–servidor con API REST y backend monolítico modular en capas

Clientes web y nativo separados del servidor. El backend es un solo proceso desplegable, dividido en módulos por capacidad (un blueprint y un servicio por recurso del contrato) y en capas: rutas → seguridad → servicios → datos. Una base relacional.

### B. Microservicios

Un servicio independiente por capacidad (cuentas, solicitudes, agente, citas, propuestas y cambios, evaluaciones), cada uno con su base, más un API Gateway y comunicación HTTP o por mensajes.

### C. MVC monolítico con vistas renderizadas en el servidor

Una sola aplicación que genera las páginas HTML en el servidor (plantillas) con el patrón Modelo–Vista–Controlador, sin API pública.

### D. Arquitectura orientada a eventos (o serverless)

Funciones o servicios que reaccionan a eventos (`cita_confirmada`, `cambio_registrado`, `invitacion_expirada`) mediante un broker de mensajes, con procesamiento asíncrono.

### Comparación de trade-offs

Escala: ●●● = favorable · ●● = aceptable · ● = desfavorable para este proyecto.

| Criterio | A. Monolito modular en capas | B. Microservicios | C. MVC con render en servidor | D. Orientada a eventos |
|---|---|---|---|---|
| **Escalabilidad** | ●● Escala horizontalmente con varias instancias detrás de un proxy, porque la API no guarda estado. No escala cada módulo por separado, pero 100 usuarios (RNF-08) no lo requieren. | ●●● Cada servicio escala por separado. Sobrado para el piloto. | ●● Similar a A, pero la sesión en el servidor complica tener varias instancias. | ●●● Absorbe picos con colas. Sobrado para el piloto. |
| **Mantenibilidad** | ●●● Un repositorio y un despliegue; módulos con límites claros (un blueprint y un servicio por recurso); las 74 pruebas corren en un solo comando. Riesgo: que los módulos se acoplen si no se respetan las capas. | ●● Servicios pequeños y aislados, pero contratos entre servicios, versionado y datos distribuidos (la bitácora de RNF-12 cruzaría servicios). | ● La interfaz y la lógica quedan mezcladas; **no sirve a la app nativa** (RE-01) sin duplicar la lógica en otra API. | ● Flujos difíciles de seguir y depurar (expiraciones de 4 h, 24 h y 72 h repartidas en consumidores). |
| **Complejidad de implementación** | ●●● Baja: Flask, MySQL y JWT, ya funcionando. | ● Alta: gateway, descubrimiento de servicios, autenticación propagada, observabilidad distribuida y CI/CD casi obligatorio. | ●●● Baja para la web, pero obliga a construir una API aparte para la app. | ● Alta: broker, idempotencia, reintentos y consistencia eventual frente a la bitácora inalterable. |
| **Adecuación al equipo (1 desarrollador, 8–9 h/sem, sin CI/CD)** | ●●● Se despliega a mano con un procedimiento y una prueba de humo (DoD-07). | ● Inviable: el costo operativo consumiría la capacidad del sprint. | ●● Adecuada en tamaño, pero falla en RE-01. | ● Inviable con la capacidad actual. |
| **Cumplimiento de RNF clave** | RE-01 ✔ · RNF-08 ✔ · RNF-12 ✔ (una transacción) · RNF-03/04 ✔ (seguridad centralizada) · RE-04 ✔ (con adaptador) | RE-01 ✔ · RNF-12 con dificultad | **RE-01 ✘** | RNF-12 con dificultad · RNF-13 ✔ |

---

## Decisión

Se adopta la **alternativa A: arquitectura cliente–servidor con una API REST sin estado y un backend monolítico modular organizado en capas**, con una base relacional MySQL 8.

Se aplica con estas reglas:

1. **Capas estrictas:** Rutas (blueprints) → Seguridad (middleware) → Servicios → Acceso a datos. Una capa solo llama a la inmediata inferior; los servicios no conocen HTTP.
2. **Un módulo por capacidad del contrato:** blueprint y servicio por grupo de recursos (`tags` de `openapi.yaml`). Agregar un módulo no modifica los existentes.
3. **API única para web y app nativa**, guiada por contrato (`openapi.yaml` con `x-acceptance-criteria`).
4. **Dependencias externas detrás de interfaces propias:** el proveedor de IA va detrás de un adaptador (RE-04) y el almacenamiento de archivos detrás de otro.
5. **Procesos programados** (expiraciones y recordatorios) en un proceso planificador aparte que usa los mismos servicios. Es la única pieza asíncrona.

Los patrones de diseño que concretan esta decisión están en `patrones_diseno.md`.

---

## Consecuencias

### Ventajas

- Cumple RE-01: la web y la app nativa consumen el mismo contrato y la lógica de negocio no se duplica.
- Cumple RNF-12 y RNF-13 con transacciones locales en una sola base: la bitácora y el presupuesto se actualizan de forma atómica.
- La seguridad (RNF-03, RNF-04, RNF-11) se aplica en un solo punto, con decoradores y verificación en la BD en cada petición.
- Complejidad operativa mínima: un proceso de API, una base y un proxy (ver `arquitectura_05_despliegue`). Compatible con la DoD sin CI/CD.
- Ya está validada: el backend actual (8 rutas, 74 pruebas) sigue este estilo.

### Desventajas y riesgos

| Riesgo | Mitigación |
|---|---|
| Los módulos se acoplan con el tiempo (“monolito enredado”) | Reglas de capas en la revisión de código (DoD-05); un servicio no importa blueprints; las dependencias se documentan en el diagrama de componentes |
| No se puede escalar un módulo por separado (por ejemplo, el agente de IA) | El adaptador de IA se puede extraer como servicio sin cambiar el contrato; la API escala horizontalmente porque no guarda estado |
| Un fallo grave tumba toda la API | `/api/health` para monitoreo; errores controlados (DoD-09); reinicio automático del contenedor |
| Las expiraciones dependen del planificador | Si el planificador se detiene, al reanudar procesa los vencimientos pendientes; se registra cada ejecución |

### Condiciones para revisar esta decisión

Se abrirá un nuevo ADR si ocurre cualquiera de estas condiciones:

- La carga supera claramente lo previsto en RNF-08 (por ejemplo, más de 1,000 usuarios concurrentes sostenidos).
- El agente de IA necesita escalar de forma muy distinta al resto.
- El equipo crece lo suficiente para que varios desarrolladores trabajen en módulos independientes con despliegues separados.
