# ADR-001: Arquitectura de UnCalificado

**Fecha:** 2026-10-11  
**Estado:** Aceptado para el diseño del MVP  
**Proyecto:** UnCalificado  
**Base:** `SRS_equipo.md`, versión 1.0 del 3 de octubre de 2026.

## Contexto

UnCalificado conecta clientes con trabajadores independientes y organizaciones para trabajos de oficio. El MVP contempla aplicación web responsive y aplicación móvil nativa, ambas sobre una API común (RE-01, RNF-02). Incluye registro, consentimiento, perfiles, verificaciones, solicitudes guiadas por IA, recomendaciones, citas, propuestas, cambios autorizados, seguimiento, evaluaciones y privacidad. El agente de IA es un componente interno: recomienda y asiste, pero no asigna proveedores ni aprueba acciones sensibles (RF-24, RF-30, RD-07 y RD-10).

La arquitectura debe facilitar el trabajo de **un desarrollador**, proteger datos y soportar recuperación de operaciones ante fallas (RNF-03 a RNF-07, RNF-12 y RNF-13), con rendimiento y disponibilidad razonables (RNF-08 y RNF-09). Se requiere además trazabilidad de acuerdos y cambios, sin exponer directamente la base de datos al cliente.

## Alternativas evaluadas

| Criterio | A. Monolito modular en capas | B. Microservicios orientados a eventos | C. Backend serverless por funciones |
|---|---|---|---|
| Escalabilidad | Escala horizontalmente la API completa; suficiente para el MVP | Escala módulos por separado, con mayor elasticidad | Escalado automático por función; dependiente del proveedor |
| Mantenibilidad | Alta si hay módulos y contratos definidos | Alta autonomía por servicio, pero exige gestionar contratos distribuidos | Funciones pequeñas, pero fragmentación de lógica transversal |
| Complejidad inicial | Baja a media: un despliegue de backend y una BD | Alta: mensajería, observabilidad, consistencia distribuida y redes | Media: configuración, permisos, latencia y pruebas de integración |
| Adecuación a 1 desarrollador | **Alta**: menor carga operativa y depuración local | Baja: demasiados componentes para el alcance académico | Media: menos infraestructura, mayor dependencia del proveedor |
| Operaciones sensibles | Transacciones y autorizaciones en una sola aplicación | Necesita coordinación entre servicios para decisiones de negocio | Posibles carreras entre funciones si no se controla el estado |

## Decisión

Se adopta un **monolito modular, con separación en presentación/API, aplicación, dominio e infraestructura**. Se expone una API REST versionada (`/api/v1`) compartida por web responsive y app nativa. Los módulos funcionales se organizan alrededor del dominio: identidad y consentimiento; perfiles y verificación; proyectos y conversación; búsqueda y recomendaciones; citas; propuestas y cambios; seguimiento y mensajería; evaluaciones; privacidad y auditoría.

Se utiliza una **base de datos relacional** para las entidades transaccionales, un **almacenamiento privado de objetos** para fotos y videos, y un **adaptador de proveedor de IA externo** con alternativa de captura manual (RF-21). La autenticación usa JWT Bearer; la autorización se verifica en el backend según rol, propiedad y consentimiento, no solo en la interfaz (RNF-03, RNF-04). La bitácora registra eventos sensibles de forma append-only a nivel de aplicación y con permisos de escritura controlados (RNF-12). Las notificaciones y recordatorios se procesan por un trabajador asíncrono interno con cola persistente o tabla de trabajos, sin introducir un microservicio independiente.

### Vista de componentes y contratos

- **Frontend web / app móvil → Backend REST:** HTTPS + JSON, autenticación JWT. No acceden a la BD ni al proveedor de IA directamente.
- **API → aplicación:** validación de datos, autorización, control de estados e idempotencia de operaciones de negocio.
- **Aplicación → dominio:** entidades y reglas; la aceptación del cliente no puede ser sustituida por una recomendación del agente.
- **Infraestructura → PostgreSQL:** repositorios y transacciones para citas, acuerdos, cambios y autorizaciones.
- **Infraestructura → objetos privados:** carga/consulta de evidencia mediante permisos temporales.
- **Infraestructura → IA externa:** HTTPS desde el backend; ante falla, ruta de captura manual.
- **Worker interno → BD / notificaciones:** procesamiento de avisos con reintentos y registro de entrega.

## Patrones de diseño adoptados

1. **Arquitectura en capas y módulos por capacidad:** cada módulo agrupa controlador, casos de uso, entidades y repositorios; evita un único controlador con toda la lógica.
2. **Repository:** el dominio no depende de SQL ni del motor de persistencia.
3. **Adapter / Ports and Adapters:** la IA y el almacenamiento de medios se encapsulan para sustituir proveedores sin cambiar reglas de negocio.
4. **Service Layer:** orquesta transacciones y valida estados y autorizaciones.
5. **Outbox / procesamiento diferido:** registra el aviso junto con la transacción; el worker lo entrega después, evitando perder notificaciones ante una caída.

## Consecuencias

**Ventajas:** una sola API y un solo backend desplegable; menor costo operativo; pruebas de extremo a extremo más simples; transacciones consistentes para doble confirmación de citas y aceptación de propuestas (RF-34 y RF-39); menor riesgo de duplicar lógica de privacidad entre web y móvil.

**Costos y límites:** los módulos comparten despliegue y capacidad de cómputo; una falla grave del backend puede afectar a todas las funciones; la generación de IA no debe bloquear procesos críticos. Se mitiga con tiempos de espera, manejo de errores, captura manual, monitoreo, reintentos controlados y separación del worker.

**Evolución:** si crece significativamente el tráfico de recomendaciones o notificaciones, esos adaptadores podrían extraerse posteriormente sin cambiar el contrato REST principal. Esta posibilidad no implica que el MVP ya tenga microservicios.

## Revisión crítica del diseño generado con IA

**Decisión propia 1 — No separar la IA como microservicio desde el inicio.** La primera alternativa de descomposición sugería un servicio de IA independiente. Se reemplazó por un adaptador interno hacia un proveedor externo: para un desarrollador evita despliegues, autenticación entre servicios y trazas distribuidas. La captura manual permanece como alternativa funcional (RF-21). La IA no se modela como actor humano ni autoridad de decisión.

**Decisión propia 2 — Unificar al trabajador independiente y la organización bajo el concepto de proveedor.** En lugar de duplicar las relaciones de solicitudes, citas y propuestas para dos clases de proveedor, se usa `Proveedor` como abstracción con especializaciones `Trabajador` y `Organizacion`. Conservan atributos propios y comparten las asociaciones comerciales; esto simplifica reglas de búsqueda y disponibilidad (RF-03, RF-05, RF-06, RF-26).

**Decisión propia 3 — Separar propuesta aceptada de solicitudes de cambio.** La propuesta mantiene versiones; los cambios son entidades propias con estado y decisión explícita del cliente. No se modifica silenciosamente el importe acordado. Se mantiene historial auditable y se respeta que el administrador no autoriza decisiones comerciales (RF-38 a RF-44, RD-10 y RD-11).

**Decisión propia 4 — Diferenciar usuario y perfil comercial.** `Cuenta` concentra identidad y rol; `Cliente` y `Proveedor` representan capacidades de negocio. Evita mezclar credenciales y datos personales con las relaciones comerciales y permite aplicar privacidad por propiedad (RNF-04, RF-52 a RF-54).

## Alcance de las vistas

- **`diagrama_componentes.mmd`:** vista C4 de contenedores (personas/canales, backend, persistencia y servicios externos) con módulos principales dentro del backend para contextualizar interfaces.
- **`diagrama_despliegue.mmd`:** vista de despliegue propuesta con navegador, app nativa, servidor cloud, API, worker, BD y almacenamiento.
- **`diagrama_clases.mmd`:** modelo conceptual del dominio con atributos, cardinalidades, herencia y composición; no representa tablas físicas ni clases de framework.

Estas vistas constituyen un diseño de referencia para el MVP, no una afirmación de infraestructura ya desplegada. Los valores de capacidad, seguridad y disponibilidad se verifican contra los RNF del SRS durante la implementación y pruebas.
