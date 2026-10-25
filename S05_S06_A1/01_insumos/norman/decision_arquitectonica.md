# ADR-001: Selección del estilo arquitectónico

**Fecha:** 2026-10-10
**Estado:** Aceptado

## Contexto

UnCalificado es una plataforma que conecta a clientes que necesitan un trabajo de oficio en su domicilio con trabajadores independientes y organizaciones de contratistas. La fuente funcional es `S03_A1/SRS_equipo.md`. Según ese documento, el MVP incluye:

- **Cuentas y roles:** cliente, trabajador independiente, organización de contratistas y administrador. Cada cuenta registra el consentimiento del aviso de privacidad (RF-01, RF-02).
- **Perfiles y verificación** de proveedores: identidad, experiencia y organización (RF-03 a RF-12).
- **Solicitudes de trabajo** guiadas por una **conversación con un agente de IA** que clasifica el oficio y genera un resumen confirmable. Si la IA no está disponible, se permite la captura manual (RF-13 a RF-23).
- **Búsqueda de proveedores compatibles** y **recomendación** de 3 a 4 opciones; el cliente es quien elige (RF-26 a RF-32).
- **Citas** con doble confirmación y bloqueo de franjas (RF-33 a RF-37).
- **Propuestas** con versiones y **control de cambios** de costo, material, alcance o fecha (RF-38 a RF-44, RF-55).
- **Seguimiento** por estados, **mensajería interna** y cierre (RF-45 a RF-48).
- **Evaluaciones** en ambos sentidos (RF-49 a RF-51).
- **Privacidad:** revelación controlada del domicilio y atención de solicitudes **ARCO** (RF-52 a RF-54).

El sistema sigue un modelo **cliente-servidor**: una aplicación web responsive y una app móvil nativa, para los cuatro actores, consumen el mismo servidor (RE-01). El servidor depende de un **servicio externo de IA** cuyo proveedor no está definido (§2.6, RE-04), y debe guardar **archivos multimedia** con control de acceso: fotos, videos, documentos de verificación y representaciones visuales (RNF-05, RNF-06).

### Requisitos no funcionales que condicionan la arquitectura

| RNF / RE | Qué exige el SRS | Implicación arquitectónica |
|---|---|---|
| RE-01, RNF-02 | Web responsive y app nativa con las mismas funciones por rol. | Un solo backend que expone una API común a los dos clientes. |
| RNF-03, RNF-04, RNF-11 | Autenticación obligatoria; control de acceso por rol y propiedad; contraseña de al menos 10 caracteres, segundo factor para el administrador y cierre tras 30 min de inactividad. | El control de acceso debe estar centralizado en el servidor, no repetido en cada cliente. |
| RNF-05, RNF-06, RE-09 | HTTPS en todas las interfaces; datos sensibles y archivos con acceso restringido por rol y por solicitud. | Los archivos se sirven a través del backend o con permisos que él controla; todas las conexiones van cifradas. |
| RNF-08 | Percentil 95 ≤ 3 s con hasta 100 usuarios concurrentes; las respuestas de IA quedan fuera del umbral. | La carga es moderada; la latencia de la IA debe quedar aislada del resto de las operaciones. |
| RNF-09 | Disponibilidad mensual ≥ 99 %, sin contar mantenimientos anunciados con 24 h. | El despliegue debe poder reiniciarse y actualizarse dentro de ventanas anunciadas. |
| RNF-12 | Bitácora inalterable de aceptaciones, rechazos y contrapropuestas. | Las decisiones de negocio y su registro deben confirmarse juntos, de forma consistente. |
| RNF-13 | No perder conversaciones, citas ni acuerdos ante caídas o desconexión. | El estado se guarda en el servidor, no en la sesión del cliente. |
| RE-04 | El agente depende de un servicio de IA externo que no aprueba ni modifica datos por sí mismo; si falla, aplica la captura manual (RF-21). | El servicio de IA debe aislarse detrás de un punto de integración, para que su caída no afecte al resto del sistema. |

RNF-01 (usabilidad), RNF-07 (uso consentido de fotos y conversaciones), RNF-10 (recomendaciones sin influencia de pagos) y RNF-14 (localización) también son obligatorios, pero no favorecen a ningún estilo arquitectónico en particular.

A esto se suma una restricción del contexto: el sistema lo desarrolla **una sola persona**, en un marco académico y con alcance de MVP. El SRS deja abierta la capacidad del equipo para construir el alcance definido (PV-11). Esta decisión no resuelve ese pendiente, pero lo toma en cuenta como riesgo: cualquier complejidad arquitectónica adicional consume capacidad que el MVP necesita.

## Alternativas consideradas

### Alternativa 1 — Cliente-servidor con monolito modular y capas

El frontend (web y app nativa) está separado del backend. El backend es **una única unidad desplegable**, organizada internamente en módulos del dominio (identidad, proveedores, solicitudes, conversación con IA, citas, propuestas y cambios, evaluaciones, privacidad y ARCO, entre otros) y en capas: API, aplicación y dominio, e infraestructura.

- **Escalabilidad:** se escala replicando la unidad completa, no un módulo en particular. Para la carga que fija el SRS (100 usuarios concurrentes, RNF-08) es suficiente. La IA, que es la operación más lenta, depende de un servicio externo, no de la capacidad del backend.
- **Mantenibilidad:** los módulos agrupan reglas que en el SRS están muy relacionadas. Por ejemplo, una cita de ejecución exige una propuesta aceptada (RF-34-AC-6), y confirmar una cita de visita revela el domicilio (RF-52). Tener esas reglas en el mismo código facilita entenderlas y cambiarlas. El riesgo es que los límites entre módulos se diluyan si no se respetan.
- **Complejidad de implementación:** baja. Hay un solo repositorio de backend, un proceso, una base de datos y transacciones locales. La bitácora (RNF-12) se escribe en la misma transacción que la decisión que registra.
- **Adecuación a un solo desarrollador:** alta. Solo hay que operar, depurar y desplegar un servicio.

### Alternativa 2 — Microservicios

Servicios independientes por dominio (por ejemplo, cuentas, solicitudes, citas, propuestas y evaluaciones), cada uno con su propio despliegue y, normalmente, su propia base de datos.

- **Escalabilidad:** cada servicio escala por separado. Es una ventaja real cuando unos dominios tienen mucha más carga que otros, pero el SRS no describe esa situación.
- **Mantenibilidad:** los límites entre servicios quedan forzados por la red. Sin embargo, muchas reglas del SRS cruzan dominios. Confirmar una cita, por ejemplo, involucra citas, propuestas, seguimiento y privacidad, y cada cambio así obligaría a coordinar contratos entre varios servicios.
- **Complejidad de implementación:** alta. Requiere comunicación entre servicios, manejo de fallas parciales y consistencia entre bases de datos. La bitácora inalterable y las decisiones que cambian el estado de varios dominios a la vez exigirían transacciones distribuidas o patrones de compensación.
- **Adecuación a un solo desarrollador:** baja. El costo de operar y depurar varios servicios superaría el beneficio dentro del alcance académico, y competiría con la capacidad de construir el MVP (PV-11).

### Alternativa 3 — Arquitectura orientada a eventos como estilo principal

Los módulos se comunican publicando y consumiendo eventos a través de un intermediario de mensajes.

Vale la pena considerarla porque el SRS tiene muchos comportamientos que reaccionan a un evento o a un plazo. Por ejemplo: la expiración de una selección a las 4 h (RF-32), de una cita a las 24 h (RF-34) o de una propuesta a las 72 h (RF-39), los recordatorios (RF-36), el aviso de cierre sin respuesta (RF-48) y la publicación de evaluaciones a los 7 días (RF-51).

- **Escalabilidad:** buena para procesar eventos en paralelo, aunque innecesaria para el volumen del MVP.
- **Mantenibilidad:** desacopla a quien produce un evento de quien lo consume, pero hace más difícil seguir el flujo completo de una regla de negocio.
- **Complejidad de implementación:** alta. Agrega un intermediario de mensajes, consistencia eventual y reintentos, y la mayoría de las operaciones del SRS son peticiones del usuario que esperan una respuesta inmediata.
- **Adecuación a un solo desarrollador:** baja como estilo principal.

**Conclusión:** sus beneficios se obtienen dentro de la Alternativa 1. Basta con un módulo de notificaciones y plazos programados que se ejecute en el mismo proceso, sin adoptar los eventos como estilo principal.

### Comparación

| Criterio | Monolito modular | Microservicios | Orientada a eventos |
|---|---|---|---|
| Escalabilidad | Suficiente para el MVP; se escala la unidad completa | Alta, por servicio | Alta para trabajo asíncrono |
| Mantenibilidad | Alta, si se respetan los límites de los módulos | Alta, pero con alto costo de coordinación | Media: el flujo es difícil de seguir |
| Complejidad | Baja | Alta | Alta |
| Un solo desarrollador | Alta | Baja | Baja |

## Decisión

Adopto una arquitectura **cliente-servidor con backend monolítico modular, organizado por capas y módulos**. Cada término describe un aspecto distinto:

- **Cliente-servidor** describe la relación entre frontend y backend. La aplicación web y la app nativa son clientes que consumen una API sobre HTTPS; toda la lógica de negocio, el control de acceso y el estado viven en el servidor.
- **Monolito modular** describe la estructura y el despliegue del backend: una sola unidad desplegable, dividida en módulos del dominio con responsabilidades y límites propios.
- **Capas** separan las responsabilidades dentro del backend:
  - la **capa de API** (rutas, autenticación y validación de entradas);
  - la **capa de aplicación y dominio** (los módulos y sus reglas);
  - la **capa de infraestructura** (adaptadores hacia la base de datos, el almacenamiento de archivos y el servicio externo de IA).

No presento MVC como estilo principal. Con un frontend separado que consume una API, el patrón aporta poco a la descripción del backend; lo que importa es la separación por módulos y capas.

En cuanto a tecnología, uso React + Vite para el frontend web y Node.js + Express con TypeScript para el backend. Son **decisiones de implementación** que tomé en `S01_A2/stack_decision.md`, no requisitos del SRS. La base de datos, el almacenamiento de archivos, el proveedor de IA y la plataforma cloud se mantienen abstractos, porque el SRS no los define.

## Razones

- **Un solo desarrollador:** el estilo con menos piezas que operar deja más capacidad para construir el alcance funcional, que es amplio.
- **Alcance académico y de MVP:** la carga que fija el SRS (RNF-08) no justifica escalar por separado cada dominio.
- **Menor complejidad operativa:** un proceso, una base de datos y un despliegue, sin comunicación por red entre módulos.
- **Despliegue sencillo:** una sola unidad que se actualiza dentro de las ventanas de mantenimiento anunciadas (RNF-09).
- **Reglas de negocio muy relacionadas:** en el SRS, muchas operaciones cambian varios conceptos a la vez. Confirmar una cita bloquea una franja, cambia el estado del proyecto y puede revelar el domicilio; aceptar un cambio actualiza el presupuesto y escribe en la bitácora. Con transacciones locales, eso se confirma de forma consistente (RNF-12, RNF-13).
- **Evolución posible:** si un módulo llegara a necesitar escalar o desplegarse por separado, sus límites internos facilitan extraerlo. No se necesita hacerlo hoy.
- **Separación lógica sin el costo de distribuir:** la modularidad aporta claridad y facilita las pruebas sin pagar latencia de red, fallas parciales ni consistencia eventual.

## Consecuencias positivas

- **Despliegue simple:** una unidad, un pipeline y una configuración.
- **Trazabilidad clara:** cada requisito del SRS se asigna a un módulo concreto, y el recorrido de una petición se puede seguir dentro de un solo proceso.
- **Poca sobrecarga:** no hay llamadas entre servicios, serialización interna ni infraestructura de mensajería.
- **Módulos independientes en lo conceptual:** cada uno es dueño de sus reglas y sus datos.
- **Buena compatibilidad con REST y OpenAPI:** la capa de API expone una interfaz REST versionada (`/api/v1`) que se puede especificar como contrato antes de escribir código (Spec Driven Design). Los dos clientes consumen ese mismo contrato.
- **Pruebas más sencillas:** las pruebas de integración se ejecutan sobre un solo proceso. La capa de infraestructura permite simular el servicio de IA y el almacenamiento.
- **Aislamiento de la IA:** el servicio externo está detrás de un adaptador, así que su caída no impide usar el resto del sistema, y la captura manual queda disponible (RF-21, RE-04).

## Consecuencias negativas

- **No hay escalado independiente por módulo:** si un módulo concentra la carga, hay que replicar toda la unidad.
- **Una sola unidad desplegable:** cualquier cambio, aunque toque un solo módulo, exige volver a desplegar el backend completo.
- **Los límites modulares exigen disciplina:** nada impide técnicamente que un módulo acceda directamente a los datos de otro. Habrá que mantener las dependencias a través de interfaces claras y revisarlas.
- **Una falla grave afecta varias capacidades:** un error que derribe el proceso afecta a todos los módulos al mismo tiempo, lo que es un riesgo directo para el 99 % de disponibilidad (RNF-09).
- **Base de datos compartida:** con el tiempo puede acoplar módulos que deberían ser independientes si no se respeta qué módulo es dueño de cada dato.

## Relación con el diseño de la API

Esta arquitectura permite exponer toda la funcionalidad del SRS mediante una **API REST versionada** que vive en la capa de API del backend. Cada módulo del dominio es dueño de un conjunto de recursos: solicitudes, citas, propuestas, cambios, evaluaciones y solicitudes ARCO, entre otros. Eso facilita describir el contrato completo en OpenAPI antes de implementar, según el enfoque **Spec Driven Design**, y usar ese contrato como referencia común para el frontend, el backend y las pruebas.

Los diagramas que acompañan esta decisión son:

- `diagrama_componentes.puml`: vista C4 de contenedores, con los módulos del backend.
- `diagrama_despliegue.puml`: una posible infraestructura, tecnológicamente neutral.
- `diagrama_clases.puml`: el modelo de dominio.

Las imágenes están en `imagenes/`.

## Decisiones de diseño del modelo de dominio

La primera propuesta del diagrama de clases la generó un agente de IA a partir del SRS. Al revisarla contra `SRS_equipo.md` encontré varios puntos donde el modelo afirmaba más de lo que el SRS permite, o confundía conceptos distintos. Las decisiones siguientes son los ajustes que hice como resultado de esa revisión, y quedaron reflejados en `diagrama_clases.puml`.

1. **Separar `oficio` de `tipoTrabajo`.** La propuesta inicial los trataba como si fueran la misma categoría. En el SRS son conceptos distintos: `oficio` es la categoría del catálogo cerrado de 10 oficios que asigna el agente (RF-15, RD-18), y `tipoTrabajo` es el tipo declarado que RF-16 exige para pasar a la búsqueda. Además, `oficio` se modeló como `[0..1]`: RF-15-AC-3 permite que quede vacío cuando el agente no logra clasificar tras 2 preguntas de aclaración. Las precondiciones de RF-16 quedaron documentadas en una nota (borrador: resultado esperado, oficio y zona).

2. **Conversaciones con varias solicitudes activas.** La propuesta inicial relacionaba una conversación con una solicitud en una relación 0..1 a 0..1, que el SRS no respalda. RF-18-AC-4 muestra que un cliente puede tener varios proyectos activos y que el agente debe preguntar a cuál corresponde un archivo. Lo modelé así: una conversación pertenece al cliente, y **cada `MensajeConversacion` se asocia explícitamente a una `SolicitudTrabajo`** (y puede adjuntar archivos de esa solicitud). El SRS no fija cuántas solicitudes trata una conversación, y el modelo no lo inventa.

3. **Evaluaciones como colección de la solicitud.** La propuesta inicial usaba dos clases y una multiplicidad inferida `0..2` para las solicitudes de calificación. La reemplacé por `SolicitudTrabajo 1 → 0..* Evaluacion`, con relaciones de autor y evaluado hacia `Usuario`. Las reglas de RF-49 (el cliente evalúa al proveedor en 4 dimensiones), RF-50 (el prestador califica al cliente) y RF-51 (publicación cuando ambos califican o a los 7 días) se expresan como **restricciones**, no como una cardinalidad que el SRS nunca fija.

4. **Contrapropuestas `0..*` en la estructura.** RF-41 describe una sola contrapropuesta del cliente por cambio, que el proveedor acepta o rechaza. La propuesta inicial la había fijado como `0..1`. La dejé como `0..*` en la estructura y documenté la ronda única como **comportamiento del MVP**: es una regla del flujo actual, no una propiedad permanente del dominio, y fijarla en la estructura impediría ampliarla sin rediseñar el modelo.

5. **Revelación del domicilio ligada al trabajador independiente.** La propuesta inicial asociaba `RevelacionDomicilio` con `Proveedor` en general. RF-52 habla específicamente del "trabajador" del proyecto, así que la asocié con `TrabajadorIndependiente` y dejé anotado que el SRS no define qué ocurre cuando el proveedor es una organización de contratistas, en lugar de suponerlo.

La misma revisión llevó a otros ajustes menores, todos documentados en notas del diagrama:

- `TipoCita` usa los valores `VISITA` y `EJECUCION` en lugar de `SERVICIO` (RF-34-AC-6).
- Se eliminó el estado de verificación "en revisión", porque el SRS no lo define.
- `disponibilidadGeneral` dejó de ser un enum cerrado: los valores de RF-06-AC-3 son solo ejemplos.
- `OPOSICION` se conserva como derecho ARCO conceptual (§1.3), pero se aclara que RF-54 no le asigna ninguna operación.
