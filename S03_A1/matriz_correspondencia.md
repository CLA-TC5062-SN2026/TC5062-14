# Matriz de correspondencia — paso previo a `SRS_equipo.md`

**Fuentes:** los cuatro SRS individuales (I1 = `SRS_final.md`, I2 = `SRS_final 1.md`, I3 = `SRS_final 2.md`, I4 = `SRS_final 3.md`), `comparacion_requerimientos.md` y `decisiones_equipo.md` (DEC-01 a DEC-41, todas aprobadas).

**Criterios aplicados:**
- Un requisito definitivo solo entra si está en **consenso** o si una decisión aprobada lo **adopta** explícitamente ("Se adopta…").
- Los gaps que ninguna decisión resolvió se marcan como **Pendiente** y se envían a la sección 8, aunque parezcan obvios.
- Los IDs definitivos (`RF-XX`, `RNF-XX`, `RD-XX`) forman un **espacio de nombres nuevo**. Un mismo número puede coincidir con un ID de origen que significa otra cosa; por eso los orígenes **siempre** llevan prefijo (`I1:RF-13`) y nunca se citan sin él.
- `RE-XX` = restricciones y decisiones de alcance; `FP-XX` = funcionalidades posteriores al MVP; `PV-XX` = pendientes del equipo. Los PV de I1 se citan como `I1:PV-XX`, para no confundirlos con los nuevos.

---

## 1. Matriz de correspondencia

### 1.1 Requerimientos funcionales (MVP)

| ID definitivo propuesto | Requisito consolidado | Origen | Decisión asociada | Acción |
|---|---|---|---|---|
| RF-01 | Registro e inicio de sesión con cuenta para cliente, trabajador y organización, válido en web y app; el administrador se aprovisiona internamente | I1:RF-30; I3:RNF-03, I3:LD-01; I4:RNF-04 | DEC-01, DEC-02 | Modificado por decisión del equipo |
| RF-02 | Consentimiento del aviso de privacidad y declaración de mayoría de edad al registrarse, con registro de la versión aceptada y nueva aceptación si el aviso cambia | I2:RF-20 (sin el mecanismo WhatsApp); I2:RD-01 | DEC-37, DEC-02 | Incorporado desde GAP aprobado |
| RF-03 | Perfil del trabajador con nombre, foto, oficio(s) del catálogo, experiencia y zona de cobertura; visible en búsquedas al completar los datos mínimos | I1:RF-07; I2:RF-07 (campos); I4:RF-10; I4:RD-05 | DEC-06, DEC-13, DEC-38 | Consolidado |
| RF-04 | Portafolio de trabajos anteriores, opcional | I1:RF-34; I3:RF-05-AC-2 | DEC-08 | Modificado por decisión del equipo |
| RF-05 | Registro y perfil básico de la organización (nombre, representante, oficios, zona de cobertura); visible al completar el perfil; sin gestión de plantilla | I1:RF-15; I2:RF-17 (parcial); I3 §2.3; I4:RF-10 | DEC-09, DEC-10 | Modificado por decisión del equipo |
| RF-06 | Disponibilidad del proveedor: calendario individual del trabajador; disponibilidad general de la organización | I1:RF-08 (incl. AC-3); I2:RF-22 (parcial); I3 §1.3; I4:RF-10 | Consenso; DEC-10 | Consolidado |
| RF-07 | Consulta del perfil del proveedor: especialidad, experiencia, calificación promedio, número de evaluaciones, comentarios, portafolio, cobertura, disponibilidad, rango de precio, estado de verificación y fecha de actualización | I3:RF-05; I4:RF-03; I1:RF-48; I2:RF-04-AC-6 (parcial) | Consenso; DEC-14, DEC-31 | Consolidado |
| RF-08 | El perfil distingue visualmente lo declarado por el proveedor de lo verificado por la plataforma | I1:RF-10; I3:RF-05-AC-3 | DEC-06 | Modificado por decisión del equipo |
| RF-09 | Verificación de identidad del trabajador mediante identificación oficial revisada por el administrador (marca "identidad verificada") | I1:RF-09; I2:RF-07 (INE); I3:RF-13 (parcial) | DEC-07 | Modificado por decisión del equipo |
| RF-10 | Verificación de experiencia, independiente de la identidad (marca "experiencia verificada") | I1:RF-35; I3:RF-13 (evidencia de portafolio) | DEC-07, DEC-08 | Modificado por decisión del equipo |
| RF-11 | Verificación de la organización como marca separada ("organización verificada") | I1:RF-62; I2:RF-17 (aprobación); I3:RF-13 | DEC-09 | Modificado por decisión del equipo |
| RF-12 | Retiro de la verificación: automático si un documento vence; por el administrador si confirma información falsa (conocida por solicitud de soporte o en su revisión) | I1:RF-29 (AC-2 ajustado) | DEC-07 (resolución posterior), DEC-33, DEC-35 | Modificado por decisión del equipo |
| RF-13 | Conversación guiada con el agente de IA, una pregunta a la vez, pidiendo solo los datos aplicables; un dato desconocido se registra como "desconocido" sin inventarlo | I1:RF-01; I3:RF-02; I2:RF-02 | DEC-03 | Incorporado desde GAP aprobado |
| RF-14 | Datos mínimos para buscar: tipo de trabajo, colonia o zona aproximada, fecha deseada y descripción; opcionales: fotos, videos, medidas, materiales y presupuesto | I1:RF-04; I3:RF-01; I4:RF-01; I3:LD-02 | DEC-12, DEC-11 | Consolidado |
| RF-15 | Adjuntar fotos y videos opcionales a la solicitud | I1:RF-02; I3:RF-01; I4:RF-01-AC-2; I2:RF-01 (imágenes) | DEC-11, DEC-04 | Modificado por decisión del equipo |
| RF-16 | Ante ambigüedad, el agente repregunta o pide una foto en vez de asumir | I1:RF-05 | DEC-03 | Incorporado desde GAP aprobado |
| RF-17 | Resumen editable de la solicitud que el cliente confirma antes de buscar; solo la versión confirmada se usa para recomendar | I1:RF-03; I3:RF-03 (AC-1, AC-3); I2:RF-02 (resumen) | DEC-03 | Incorporado desde GAP aprobado |
| ~~RF-18~~ | *Sale del MVP:* sugerencia de visita de valoración; pasa a **FP-23** | I3:RF-02-AC-3; I3:RF-03 (AC-4) | DEC-71 | Movido fuera del MVP |
| RF-19 | Solicitud de soporte humano: se ofrece tras 2 intentos fallidos del agente o a petición del usuario; el caso se registra con el resumen de la conversación y lo atiende el administrador | I1:RF-06; I3:RF-14-AC-1; I2:RF-13 (sin efecto) | DEC-03, DEC-35 | Modificado por decisión del equipo |
| RF-20 | Representación visual del alcance generada por IA a partir de imágenes de referencia; marcada como "no es plano técnico" | I3:RF-16; I3:LD-07 | DEC-05 | Incorporado desde GAP aprobado |
| RF-21 | Las acciones que comprometen tiempo, dinero o datos del cliente requieren su autorización explícita | I1:RF-20 | DEC-72 (y DEC-65) | Incorporado desde GAP aprobado |
| RF-22 | Indicador "procesando" si no hay respuesta en 2 s, en conversación y búsqueda | I1:RF-53 | DEC-39 (resolución posterior) | Incorporado desde GAP aprobado |
| RF-23 | Búsqueda de proveedores por oficio, cobertura, disponibilidad y evaluación, incluyendo perfiles no verificados | I1:RF-11; I2:RF-04 (a, b, d); I3:RF-04; I4:RF-04; I4:RD-01 | Consenso; DEC-06, DEC-13, DEC-24 | Consolidado |
| RF-24 | Filtros opcionales por identidad verificada y por experiencia similar | I1:RF-12 | DEC-06 | Modificado por decisión del equipo |
| RF-25 | Filtrar y ordenar por precio; los resultados sin precio comparable se excluyen salvo que el cliente pida incluirlos | I3:RF-06 (parte precio, AC-3) | DEC-14 | Modificado por decisión del equipo |
| RF-26 | El agente recomienda de 3 a 4 proveedores, cada uno con una explicación breve; con menos de 3, muestra los que haya con aviso; el cliente elige | I1:RF-13; I3:RF-04-AC-3; I2:RF-04 (límite sin efecto); I4:RF-05 | DEC-15 | Modificado por decisión del equipo |
| RF-27 | El cliente selecciona un proveedor, que queda asociado a la solicitud; el cliente ve el proveedor asociado y el estado | I4:RF-06; I1:RF-13; I2:RF-18 (selección) | Consenso | Conservado por consenso |
| RF-28 | Agendamiento de visita o servicio: el prestador propone y confirma; luego confirma el cliente; la cita solo queda confirmada con ambas confirmaciones | I2:RF-06 (AC-1, AC-2); I2:RF-18-AC-5; I1:RF-38 (doble confirmación); I3:RF-07-AC-2; I3:LD-03; I4:RF-07-AC-1 | DEC-16, DEC-10, DEC-17 | Modificado por decisión del equipo |
| RF-29 | Cancelación o cambio de fecha de una cita por cualquiera de las partes, con motivo, notificación a la otra parte y registro de quién y cuándo | I1:RF-17, I1:RF-41; I3:RF-07-AC-4; I4:RF-07-AC-2; I2:RF-06-AC-5 | Consenso; DEC-29 | Consolidado |
| RF-30 | Propuesta escrita del prestador con trabajo, materiales, costo y fechas, sin visita obligatoria | I1:RF-18 (sin precondición de visita); I2:RF-08 (AC-8); I3:RF-08 (AC-1) | DEC-17, DEC-19 | Modificado por decisión del equipo |
| RF-31 | Aceptación de la propuesta: el cliente acepta, pide cambios (versión revisada aceptada por ambas partes) o rechaza (cierra el acuerdo con ese prestador); 72 h sin respuesta la cierran; el trabajo no inicia sin aceptación | I1:RF-42 (AC-1 a AC-3); I1 E.2; I2:RF-08 (AC-5, AC-6 parcial) | DEC-18, DEC-19 | Modificado por decisión del equipo |
| RF-32 | El prestador registra una solicitud de cambio de costo, material, alcance o fecha antes de ejecutarlo; el cliente recibe una alerta sin que el cambio se aplique | I1:RF-19; I1:RF-24; I3:RF-08 (AC-2, AC-6); I3:RF-10 (AC-2, AC-3); I2:RF-09 (parcial) | DEC-21 | Modificado por decisión del equipo |
| RF-33 | El cliente acepta, rechaza o contrapropone en 24 h; mientras tanto, la parte afectada queda en pausa; sin respuesta no se aplica; sin acuerdo queda pendiente entre las partes (sin escalamiento) | I1:RF-19 (AC-1 a AC-3); I1 E.3; I2:RF-09 (AC-4 a AC-6); I3:RF-08-AC-3 | DEC-20 (+ resolución), DEC-22, DEC-34 | Modificado por decisión del equipo |
| RF-34 | Análisis con IA de la justificación de un cambio (consistencias, faltantes, riesgos), solo informativo; la decisión es del cliente | I3:RF-18 | DEC-05, DEC-21 | Incorporado desde GAP aprobado |
| RF-35 | Presupuesto inicial inmutable y una versión por cada cambio aprobado, con total anterior, total actualizado y diferencia; historial consultable | I3:RF-08-AC-7; I3:LD-04; I2:RF-09-AC-4 | DEC-73 | Incorporado desde GAP aprobado |
| RF-36 | Consulta de costos: presupuesto acordado vigente, cambios aprobados y cambios pendientes de aprobar, en una sola vista (sin "lo gastado") | I1:RF-23; I3:RF-10 (parte presupuesto) | DEC-70, DEC-58 | Incorporado desde GAP aprobado |
| RF-37 | Seguimiento por estados del servicio (programado, en proceso, terminado), visibles para el cliente | I4:RF-08 (AC-1); I1 E.4; I2 Apéndice D | DEC-25, DEC-28 | Modificado por decisión del equipo |
| RF-38 | Canal interno de mensajes cliente–proveedor del proyecto, habilitado con la cita confirmada; conserva fecha, emisor y contenido; no expone teléfonos | I3:RF-14 (AC-2) | DEC-36 | Incorporado desde GAP aprobado |
| RF-39 | Cierre: el proveedor marca el trabajo como terminado; el cliente confirma (concluido, habilita evaluación) o rechaza (sigue en curso); los pendientes ni se resuelven ni bloquean automáticamente | I1:RF-59, I1:RF-60; I2:RF-16 (AC-1 a AC-3); I3:RF-11-AC-4 (ajustado); I4:RF-08-AC-2 | Consenso; DEC-28 | Consolidado |
| RF-40 | El cliente evalúa al proveedor tras el cierre en 4 dimensiones (puntualidad, calidad, limpieza, apego al presupuesto) con enteros de 1 a 5 promediados, comentario opcional y una evaluación por proyecto | I2:RF-11 (a), AC-2 a AC-4; I1:RF-25; I3:RF-11 (AC-2, AC-3); I4:RF-09 | Consenso; DEC-31, DEC-32 | Modificado por decisión del equipo |
| RF-41 | El prestador evalúa al cliente tras el cierre con un entero de 1 a 5 y comentario opcional | I2:RF-11 (b) | DEC-30, DEC-32 | Modificado por decisión del equipo |
| RF-42 | El cliente proporciona su domicilio exacto, que se revela automáticamente al trabajador, junto con las fotos o videos del domicilio, al confirmar la cita de visita (si la hay) o al aceptar la propuesta; el trabajador puede verlo hasta 7 días después de que el proyecto quede "concluido" | I2:RNF-04 (revelación automática y ventana de 7 días); I3:RF-07-AC-3; I1:RF-54 (restricción a un trabajador) | DEC-65, DEC-78, DEC-79 (modifican DEC-41 y DEC-50), DEC-12 | Modificado por decisión del equipo |
| RF-43 | El domicilio de un trabajador con identidad verificada se muestra solo a los clientes que tienen una cita confirmada con él | I1:RF-58 | DEC-41 (identidad verificada), DEC-65 parte 1 (clientes con cita confirmada) | Modificado por decisión del equipo |
| RF-44 | Atención de solicitudes ARCO por el administrador: exportar, rectificar con valor anterior, anonimizar sin proyectos activos, folio y plazo configurable con alerta | I2:RF-21; I1:RF-55; I3:RF-15-AC-2 | DEC-37 | Modificado por decisión del equipo |
| RF-45 | El agente se identifica como asistente automático desde el primer mensaje y no se hace pasar por una persona | I1:RF-56 | DEC-44 | Incorporado desde GAP aprobado |
| RF-46 | El agente asigna exactamente una categoría del catálogo; si tras 2 aclaraciones no puede, no asigna oficio y ofrece la solicitud de soporte (RF-19) | I2:RF-03 | DEC-45, DEC-38, DEC-35 | Incorporado desde GAP aprobado |
| RF-47 | Si el servicio de IA no está disponible, el cliente captura la solicitud manualmente, sin preguntas ni resumen automatizado | I3 §2.5; I4:RF-01 | DEC-46 | Incorporado desde GAP aprobado |
| RF-48 | Imágenes JPG o PNG de hasta 5 MB y máximo 10 por proyecto; con varios proyectos activos, el agente pregunta a cuál corresponde el archivo | I2:RF-01 (AC-3, AC-5, AC-6) | DEC-47 | Incorporado desde GAP aprobado |
| RF-49 | Búsqueda sin resultados: mensaje "No hay proveedores disponibles para los criterios seleccionados" | I3:RF-04-AC-2 | DEC-53 | Incorporado desde GAP aprobado |
| RF-50 | Notificación a ambas partes al confirmarse la cita (fecha, hora y lugar) y recordatorio 24 h antes | I1:RF-39; I2:RF-06-AC-6 | DEC-54 (a, b) | Incorporado desde GAP aprobado |
| RF-51 | Bloqueo de la franja del prestador al confirmar y liberación al cancelar; ante franjas traslapadas prevalece la confirmación registrada primero | I2:RF-06 (AC-2, AC-5, AC-7) | DEC-54 (d, e) | Incorporado desde GAP aprobado |
| RF-52 | El prestador acepta o rechaza la solicitud en un máximo de 4 h dentro de su horario; si rechaza o no responde, el cliente recibe aviso y las opciones restantes | I2:RF-18 (AC-2 a AC-5) | DEC-54 (h), DEC-16 | Incorporado desde GAP aprobado |
| RF-53 | Antes de solicitar una cita se muestra su costo o "sin costo", y la moneda | I3:RF-07 | DEC-54 (i) | Incorporado desde GAP aprobado |
| RF-54 | Si el cliente no responde a una solicitud de cierre en 72 h, el sistema avisa al administrador (informativo; el proyecto sigue en "terminado") | I2:RF-16-AC-4 (adaptado) | DEC-62, DEC-34, DEC-35 | Incorporado desde GAP aprobado |
| RF-55 | Publicación de evaluaciones: solicitud en menos de 5 min tras el cierre; vencen a los 7 días; se publican cuando ambas partes califican o al vencer; solo las publicadas cuentan para el promedio | I2:RF-11 (AC-1, AC-5 a AC-7) | DEC-63, DEC-30 | Incorporado desde GAP aprobado |

### 1.2 Requerimientos no funcionales

| ID definitivo propuesto | Requisito consolidado | Origen | Decisión asociada | Acción |
|---|---|---|---|---|
| RNF-01 | Interfaz sencilla, en español cotidiano, con pocos pasos y comprensible sin conocimientos técnicos; validaciones asociadas al campo | I1:RNF-01; I4:RNF-01; I3:RNF-08 (parcial) | Consenso | Conservado por consenso |
| RNF-02 | Uso móvil: web responsive usable en navegador móvil (360 × 640 px sin desplazamiento horizontal) y app móvil nativa | I1:RNF-02 (ajustado); I3:RNF-02, I3:RNF-08; I4:RNF-06 | Consenso; DEC-01 | Modificado por decisión del equipo |
| RNF-03 | Autenticación obligatoria para consultar, crear o modificar solicitudes, citas, propuestas, cambios y evaluaciones | I3:RNF-03; I4:RNF-04; I1:RF-30 | Consenso; DEC-02 | Conservado por consenso |
| RNF-04 | Control de acceso por rol y propiedad en cada operación; las denegaciones no revelan datos | I1:RNF-12, I1:RNF-08; I3:RNF-09; I4:RNF-03 | Consenso | Consolidado |
| RNF-05 | Datos sensibles (dirección, fotos y videos del domicilio, comprobantes) transmitidos por HTTPS y almacenados con control de acceso por rol | I3:RNF-04; I1:RNF-08; I2:RNF-05 (parcial) | Consenso | Consolidado |
| RNF-06 | Imágenes y videos de referencia y representaciones visuales accesibles solo para el cliente, los proveedores autorizados y el administrador | I3:RNF-11 | DEC-05, DEC-11 | Incorporado desde GAP aprobado |
| RNF-07 | Las fotos y conversaciones no se usan para fines no consentidos | I1:RNF-07; I4 §2.4 | DEC-74 | Incorporado desde GAP aprobado |
| RNF-08 | Búsquedas, consultas y acciones en ≤ 3 s (p95) con 100 usuarios concurrentes, sin contar la carga de archivos; las respuestas de IA quedan fuera del umbral | I3:RNF-01, I3:RNF-07; I4:RNF-02 | DEC-39 (+ resolución) | Modificado por decisión del equipo |
| RNF-09 | Disponibilidad del 99 % mensual con fórmula publicada y mantenimientos avisados con 24 h | I1:RNF-05; I3:RNF-06, I3:RNF-10 | DEC-40 | Modificado por decisión del equipo |
| RNF-10 | El orden de las recomendaciones no depende de pagos ni de criterios no comunicados al cliente | I1:RNF-10 | DEC-24 | Incorporado desde GAP aprobado |
| RNF-11 | Contraseña de al menos 10 caracteres, segundo factor para el administrador y cierre de sesión tras 30 min de inactividad | I2:RNF-15 | DEC-43 | Incorporado desde GAP aprobado |
| RNF-12 | Bitácora de aceptaciones, rechazos y contrapropuestas de propuestas y cambios, con fecha, usuario y decisión; no alterable sin dejar rastro | I3:RNF-05; I1:RNF-11 | DEC-66 | Incorporado desde GAP aprobado |
| RNF-13 | Ante una caída o pérdida de conexión no se pierden conversaciones, citas ni acuerdos; el usuario recupera su estado al reconectarse | I1:RNF-03 | DEC-67 | Incorporado desde GAP aprobado |
| RNF-14 | Español de México, fechas DD/MM/AAAA, hora del centro de México y montos en MXN con separador de miles | I2:RNF-13 | DEC-68 | Incorporado desde GAP aprobado |

### 1.3 Reglas de negocio y dominio

| ID definitivo propuesto | Requisito consolidado | Origen | Decisión asociada | Acción |
|---|---|---|---|---|
| RD-01 | Un proveedor puede ser trabajador independiente u organización de contratistas | I3:RD-01; I1 §3; I2 §1.3; I4 §1.3 | Consenso | Conservado por consenso |
| RD-02 | Un perfil solo es "verificado" tras la revisión de la plataforma | I1:RD-02 | DEC-07 | Incorporado desde GAP aprobado |
| RD-03 | No se exigen certificados a todos los oficios; la verificación combina identificación oficial y evidencia de experiencia | I1:RD-03 | DEC-07 | Incorporado desde GAP aprobado |
| RD-04 | "Cercano" significa que la zona del cliente está dentro de la cobertura declarada por el proveedor (su colonia o colonias vecinas) | I1:RD-04; I3:RF-04 | DEC-13 | Modificado por decisión del equipo |
| RD-05 | "Disponible" significa tener espacio en la agenda en las fechas solicitadas; quien no lo tiene no se muestra como disponible | I1:RD-05; I4:RD-02; I3 §1.3 | Consenso | Consolidado |
| RD-06 | Un proveedor solo se presenta si al menos una de sus especialidades corresponde al servicio solicitado | I4:RD-01; I2:RF-04(b); I3:RF-04 | Consenso | Consolidado |
| RD-07 | La IA no decide medidas delicadas ni acepta citas, propuestas, pagos o cambios en nombre de los usuarios; la última palabra la tiene una persona | I1:RD-06; I3:RD-04 | DEC-75 | Incorporado desde GAP aprobado |
| RD-08 | La representación visual es una referencia de comunicación; no sustituye planos, permisos ni la responsabilidad profesional del proveedor | I3:RD-10 | DEC-05 | Incorporado desde GAP aprobado |
| RD-09 | La IA puede señalar inconsistencias en una justificación de costo, pero no validarla ni aprobar o rechazar el cambio | I3:RD-11 | DEC-05 | Incorporado desde GAP aprobado |
| RD-10 | Ningún cambio de costo, material, alcance o fecha es válido sin autorización explícita del cliente | I1:RD-07; I3:RD-03 | DEC-21 | Modificado por decisión del equipo |
| RD-11 | El administrador no interviene en decisiones comerciales (costos, acuerdos); se limita a verificación, soporte y solicitudes de datos | I3 §2.3, §3.1.1 | DEC-34, DEC-20 (resolución), DEC-35, DEC-37 | Modificado por decisión del equipo |
| RD-12 | El precio lo define el proveedor; cualquier rango mostrado es solo de referencia | I2:RD-04 | DEC-76 | Incorporado desde GAP aprobado |
| RD-13 | Solo el cliente de un proyecto concluido evalúa al proveedor, y solo el prestador de ese proyecto evalúa al cliente; cada evaluación queda asociada a su servicio | I1:RD-01; I3:RD-05; I4:RD-03, I4:RD-06; I2:RF-11 | Consenso; DEC-30 | Modificado por decisión del equipo |
| RD-14 | La plataforma no procesa ni registra pagos; el pago se hace directamente entre cliente y proveedor; solo se registran acuerdos y comprobantes | I1 §10; I2:RD-02; I3:RD-06; I4 §2.4 | Consenso; DEC-23 | Consolidado |
| RD-15 | Antes de una cita confirmada el proveedor solo ve la zona aproximada; la dirección nunca es pública; los teléfonos no se revelan entre las partes | I3:RD-02; I4:RD-04; I2:RNF-04 (1.ª parte) | Consenso; DEC-36, DEC-41 | Consolidado |
| RD-16 | El tratamiento de datos personales requiere aviso y consentimiento previos y atención de derechos ARCO conforme a la LFPDPPP | I2:RD-01; I1:RD-11 | DEC-37 | Incorporado desde GAP aprobado |
| RD-17 | Tras una eliminación de datos, las trazas de decisiones se conservan anonimizadas | I3:RD-09; I1:RF-55-AC-2 | DEC-77 | Incorporado desde GAP aprobado |
| RD-18 | La operación del piloto se limita a domicilios en Guadalajara, Zapopan, San Pedro Tlaquepaque, Tonalá, Tlajomulco de Zúñiga y El Salto, y a los 10 oficios del catálogo inicial | I2:RD-06; I2 Apéndice C | DEC-38 | Modificado por decisión del equipo |

### 1.4 Restricciones y decisiones de alcance

| ID definitivo propuesto | Requisito consolidado | Origen | Decisión asociada | Acción |
|---|---|---|---|---|
| RE-01 | Decisión de producto: canal web y app móvil nativa; WhatsApp fuera del MVP | I1:RE-01; I3 §2.1; I4:RNF-06 | DEC-01 | Modificado por decisión del equipo |
| RE-02 | Decisión de producto: identidad mediante cuenta registrada para todos los roles | I1:RF-30 | DEC-02 | Modificado por decisión del equipo |
| RE-03 | Decisión de producto: el MVP incluye el agente de IA conversacional y dos funciones de IA (representación visual y análisis de justificaciones) | I1 §2.4; I3:RF-16, I3:RF-18 | DEC-03, DEC-05 | Modificado por decisión del equipo |
| RE-04 | Restricción técnica: el agente depende de un servicio de IA externo; sus servicios externos no aprueban ni modifican datos sin acción de un usuario autorizado | I3 §2.5, §3.1.3; I1 §4.2 | DEC-03, DEC-39 | Consolidado |
| RE-05 | Decisión de producto: multimedia con texto, fotos y videos; sin notas de voz | I3:RF-01; I1:RF-33 | DEC-04, DEC-11 | Modificado por decisión del equipo |
| RE-06 | Fuera del MVP: procesamiento y registro de pagos, y suscripciones | I1 §10; I2:RD-02; I3:RD-06; I4 §4.2 | DEC-23, DEC-24 | Consolidado |
| RE-07 | Decisión de producto: privacidad de contacto mediante canal interno, sin intercambio de teléfonos | I3:RF-14 | DEC-36 | Modificado por decisión del equipo |
| RE-08 | Restricción de negocio: zona y catálogo del piloto (ver RD-18); moneda MXN y zona horaria `America/Mexico_City` | I2:RD-06; I3 §2.4; I2 §3 | DEC-38 | Modificado por decisión del equipo |
| RE-09 | Restricción técnica: todas las interfaces usan HTTPS | I3 §3.1.4; I3:RNF-04 | Consenso | Conservado por consenso |

### 1.5 Funcionalidades posteriores al MVP

| ID definitivo propuesto | Funcionalidad | Origen | Decisión asociada | Acción |
|---|---|---|---|---|
| FP-01 | Notas de voz y transcripción (incluida la cotización dictada) | I1:RF-33; I2:RF-01 (voz), I2:RF-08-AC-7, I2:RNF-01 (voz) | DEC-04 | Movido fuera del MVP |
| FP-02 | Integración con WhatsApp | I1 §10; I2:C-01, I2:RNF-10, I2:C-07, I2:RNF-16, I2:RNF-07 | DEC-01 | Movido fuera del MVP |
| FP-03 | Gestión de plantilla, jerarquías, asignación de trabajadores y agenda por empleado de la organización | I1:RF-37; I2:RF-12, I2:RF-17 (plantilla), I2:RD-05, I2:RF-22-AC-5 | DEC-10 | Movido fuera del MVP |
| FP-04 | Detección automática de desviaciones por umbral | I1:RF-46 | DEC-05 | Movido fuera del MVP |
| FP-05 | Procesamiento de pagos y anticipos (escrow) | I1 §10; I2 §1.2; I3 §2.4; I4 §4.2 | DEC-23 | Movido fuera del MVP |
| FP-06 | Registro de pagos declarados y disputas de pago | I2:RF-14 | DEC-23 | Movido fuera del MVP |
| FP-07 | Suscripción de prestadores como requisito de visibilidad | I2:RF-15, I2:RD-07, I2:RF-04(e) | DEC-24 | Movido fuera del MVP |
| FP-08 | Cotización automática generada por IA | I1 §10 | — (fuera en el SRS de origen) | Movido fuera del MVP |
| FP-09 | Estadísticas y reportes detallados | I1 §10 | — | Movido fuera del MVP |
| FP-10 | Atención de urgencias | I1 §10 | — | Movido fuera del MVP |
| FP-11 | Ampliar oficios y zonas más allá de los iniciales | I1 §10; I2 §1.2 | DEC-38 | Movido fuera del MVP |
| FP-12 | Seguros, garantías financieras, penalizaciones económicas, reclamaciones financieras y gestión fiscal | I4 §4.2 | — | Movido fuera del MVP |
| FP-13 | Entrenamiento de un modelo de IA propio | I2 §1.2, I2:C-02 | — | Movido fuera del MVP |
| FP-14 | Reportes de irregularidades, moderación y sanciones (advertencias, suspensión, revisión de evaluaciones) | I1:RF-26 a RF-28, RF-32, RF-49 a RF-52, RF-61, RD-08, RD-09; I3:RF-12, I3:RF-13 (suspendido) | DEC-33 | Movido fuera del MVP |
| FP-15 | Reportes periódicos de avance, resumen de avance por IA, recordatorios y escalamiento por falta de reporte | I1:RF-22, RF-43, RF-44, RF-45, RF-57; I2:RF-10; I3:RF-09 (reportes), I3:RF-10 (% avance) | DEC-25, DEC-26, DEC-27 | Movido fuera del MVP |
| FP-16 | Etapas acordadas del proyecto con validación por etapa | I3:RF-09, I3:RF-10, I3:RF-11-AC-1, I3:LD-05 | DEC-28 | Movido fuera del MVP |
| FP-17 | Rol de agente de soporte con bandeja, horario, tickets y transferencia en vivo | I2:RF-13, I2:RF-23, I2:C-06 | DEC-35 | Movido fuera del MVP |
| FP-18 | Catálogo de trabajadores, o ver todos los compatibles además de las recomendaciones | I4:RF-02 | DEC-52 | Movido fuera del MVP |
| FP-19 | Cancelación tardía (dentro de las 24 h previas) y distinción entre emergencia y ausencia sin aviso | I1:RF-17-AC-2, I1:RD-10 | DEC-54 (g) | Movido fuera del MVP |
| FP-20 | Aviso de proyectos sin movimiento | I3:RF-09-AC-4 (referencia) | DEC-60 | Movido fuera del MVP |
| FP-21 | Cancelación o abandono del proyecto completo | I2:RF-19 | DEC-61, DEC-29 | Movido fuera del MVP |
| FP-22 | Registro de comprobantes de compra y cálculo de gasto acumulado (fuera del alcance de la app: la revisión es presencial) | I3:RF-09-AC-2, I3:RD-06 (comprobantes), I3 §1.3; I1:RF-23 (lo gastado) | DEC-58 | Movido fuera del MVP |
| FP-23 | Sugerencia de visita de valoración según los datos faltantes, y marca "apta para cotización sin visita" | I3:RF-02-AC-3; I3:RF-03 (AC-2, AC-4) | DEC-71 | Movido fuera del MVP |

### 1.6 Elementos que quedan como pendientes (no entran como requisito)

| ID definitivo propuesto | Tema | Origen | Decisión asociada | Acción |
|---|---|---|---|---|
| PV-01 | Qué actores usan la app nativa y en qué plataformas | DEC-01 | DEC-01 | Pendiente |
| PV-02 | Reglas de contraseña, segundo factor y cierre de sesión | I2:RNF-15 | DEC-02 | Pendiente |
| PV-03 | El agente se identifica como asistente automático | I1:RF-56 | DEC-03 | Pendiente |
| PV-04 | Clasificación automática del oficio dentro del catálogo | I2:RF-03 | DEC-03, DEC-38 | Pendiente |
| PV-05 | Captura manual de la solicitud si la IA no está disponible | I3 §2.5 | DEC-03 | Pendiente |
| PV-06 | Límites de archivos: imágenes (5 MB, 10 por proyecto en I2) y video (sin fuente); proyectos múltiples activos | I2:RF-01 (AC-3, AC-5, AC-6) | DEC-04, DEC-11 | Pendiente |
| PV-07 | Visibilidad de perfiles rechazados o con la verificación retirada | DEC-06, DEC-07 | DEC-06, DEC-07 | Pendiente |
| PV-08 | Evidencia de experiencia aceptable sin certificados | I1:PV-02 | DEC-07, DEC-08 | Pendiente |
| PV-09 | Campos mínimos del registro de organización y significado de "organización registrada" | I1:PV-03; I2:RF-17 (RFC) | DEC-09 | Pendiente |
| PV-10 | Momento en que se captura el domicilio exacto | DEC-12, DEC-41 | DEC-12, DEC-41 | Pendiente |
| PV-11 | Cómo declara el proveedor su cobertura y qué es "zona vecina" | I1:PV-05 | DEC-13 | Pendiente |
| PV-12 | Cómo se captura un precio o rango comparable; riesgo de viabilidad del filtro | I1:RF-36 | DEC-14 | Pendiente |
| PV-13 | Otros criterios de I3:RF-06 (orden por calificación, disponibilidad, cercanía y garantía) y la garantía en el perfil | I3:RF-05, I3:RF-06 | DEC-14 | Pendiente |
| PV-14 | Si el cliente puede ver más compatibles además de las 3–4 recomendaciones (catálogo) | I4:RF-02 | DEC-14, DEC-15 | Pendiente |
| PV-15 | Comportamiento ante una búsqueda sin resultados | I1:RF-14; I2:RF-05; I3:RF-04-AC-2 | DEC-13 | Pendiente |
| PV-16 | Detalles de citas: bloqueo de franjas, regla de "gana el primero", recordatorio, expiración, cancelación tardía y emergencias, aceptación en 4 h, notificación de confirmación, reprogramación, costo de visita | I2:RF-06, I2:RF-18; I1:RF-38-AC-3, I1:RF-17-AC-2, I1:RD-10, I1:RF-39, I1:RF-40; I3:RF-07 | DEC-16 | Pendiente |
| PV-17 | Contenido detallado de la propuesta (IVA, desglose, detalle de materiales) y si las 72 h se reinician por versión | I2:RF-08; I3:RF-08 (AC-1, AC-4) | DEC-19 | Pendiente |
| PV-18 | Campos obligatorios de una solicitud de cambio | I3:RF-08-AC-2; I2:RF-09 | DEC-21 | Pendiente |
| PV-19 | Qué ocurre al vencer las 24 h; reinicio con contrapropuesta; respuesta del proveedor a la contrapropuesta | I1 E.3 | DEC-20, DEC-22 | Pendiente |
| PV-20 | Desacuerdo persistente sobre un cambio sin salida formal | I1 §11 (vacío) | DEC-20 (resolución), DEC-34 | Pendiente |
| PV-21 | Comprobantes de compra: dónde se adjuntan y cálculo de "gasto acumulado" | I3:RF-09-AC-2, I3:RD-06, I3 §1.3; I1:RF-23 | DEC-23, DEC-27, DEC-28 | Pendiente |
| PV-22 | Integración de los estados del servicio con propuesta, cita y cierre | I1 E.1–E.4; I2 Apéndice D | DEC-25 | Pendiente |
| PV-23 | Aviso de proyectos sin movimiento | DEC-26 | DEC-26 | Pendiente |
| PV-24 | Terminación de un proyecto que no se concluye (cancelación del proyecto o abandono) | I2:RF-19 | DEC-29 | Pendiente |
| PV-25 | Cliente que no responde a una solicitud de cierre | I2:RF-16-AC-4 | DEC-35 | Pendiente |
| PV-26 | Reglas de publicación de la evaluación bidireccional y visibilidad de la calificación del cliente | I2:RF-11 | DEC-30 | Pendiente |
| PV-27 | Mostrar en el perfil las 4 dimensiones o solo el promedio | I2:RF-11 | DEC-31 | Pendiente |
| PV-28 | Evaluaciones injustas sin revisión ni respuesta pública | I1:RF-26, I1:RF-49 | DEC-32, DEC-33 | Pendiente |
| PV-29 | Tiempo de atención del administrador a solicitudes de soporte | I1:PV-09 | DEC-35 | Pendiente |
| PV-30 | Domicilio del trabajador: a qué clientes se muestra; fin de la visibilidad del domicilio del cliente; aviso al trabajador | I2:RNF-04 (7 días) | DEC-41 | Pendiente |
| PV-31 | Texto del aviso de privacidad, plazo legal ARCO definitivo y plazo de conservación | I1:PV-15; I2 Apéndice A | DEC-37 | Pendiente |
| PV-32 | Bitácora o registro inmutable de auditoría e historial consultable de acciones del agente | I1:RNF-11, I1:RF-21; I2:RNF-06; I3:RNF-05; I4:RNF-05 | DEC-37 (menciona que no se ha decidido) | Pendiente |
| PV-33 | Respaldos, recuperación y conservación del estado ante caídas | I1:RNF-03; I2:RNF-14 | DEC-40 | Pendiente |
| PV-34 | Meta de tiempo verificable para las respuestas de IA | I1:RNF-04 | DEC-39 (resolución) | Pendiente |
| PV-35 | Modelo de ingreso de la plataforma | I1:PV-14, I1:PV-17; I2:RD-07 | DEC-24 | Pendiente |
| PV-36 | Localización y formatos (fechas, separadores) | I2:RNF-13 | — | Pendiente |
| PV-37 | Campos mínimos para guardar un borrador de solicitud (I3 exige el resultado esperado; I4 solo tipo y ubicación) | I3:RF-01-AC-2; I4:RF-01-AC-1 | DEC-12 | Pendiente |
| PV-38 | Valor legal de la propuesta aceptada | I1:PV-11 | — | Pendiente |
| PV-39 | Capacidad del equipo y calendario para el alcance definido | I1:PV-17, I1:PV-18 | DEC-01, DEC-05 | Pendiente |
| PV-40 | Consulta de costos: presupuesto acordado vigente, cambios aprobados y cambios pendientes (antes RF-36) | I1:RF-23; I3:RF-10 (parte presupuesto) | — | Pendiente |

### 1.7 Revisión de pendientes (Tipo A / Tipo B)

**Tipo A:** pendiente legítimo del producto; ya estaba abierto en un SRS original y requiere información de negocio, legal, operativa o técnica que el equipo no tiene. **Tipo B:** gap de consolidación que el equipo aún no decide. **Cerrado:** ya lo resolvió una DEC; deja de ser pendiente.

| PV | Tema | Tipo | Origen | ¿Requiere decisión del equipo para cerrar esta actividad? | Recomendación |
|---|---|---|---|---|---|
| PV-01 | Actores y plataformas de la app nativa | B | DEC-01 (surge de la decisión del equipo) | Sí | Decidir qué actores usan la app |
| PV-02 | Contraseña, 2FA, cierre de sesión | B | I2:RNF-15 | Sí | Mover a posterior; la autenticación ya está cubierta por RNF-03 y RNF-04 |
| PV-03 | El agente se identifica como asistente | B | I1:RF-56 | Sí | Adoptar en el MVP |
| PV-04 | Clasificación del oficio en el catálogo | B | I2:RF-03 | Sí | Adoptar (el catálogo es cerrado, DEC-38), ajustando la parte de "transferencia a soporte" a RF-19 |
| PV-05 | Captura manual si la IA falla | B | I3 §2.5 | Sí | Adoptar en el MVP |
| PV-06 | Límites de archivos y proyectos múltiples | B | I2:RF-01 (AC-3, AC-5, AC-6) | Sí | Adoptar los límites de imagen de I2; el límite de video sigue abierto porque ningún SRS da un valor |
| PV-07 | Visibilidad de perfiles rechazados o con la verificación retirada | B | DEC-06, DEC-07; I2:RF-07-AC-3, I3:RF-13-AC-2 | Sí | Decidir; sugerencia: no mostrar los perfiles rechazados |
| PV-08 | Evidencia de experiencia sin certificados | A | I1:PV-02 | No | Mantener abierto |
| PV-09 | Campos del registro de organización / "organización registrada" | A (el RFC es B) | I1:PV-03; I2:RF-17 | No para "registrada"; sí para el RFC | Mantener abierto "registrada"; decidir sobre el RFC |
| PV-10 | Momento de captura del domicilio exacto | B | DEC-12, DEC-41 | Sí | Decidir; sugerencia: al dar el consentimiento de DEC-41 |
| PV-11 | Declaración de cobertura / "zona vecina" | A | I1:PV-05 | No | Mantener abierto |
| PV-12 | Precio comparable / viabilidad del filtro | A | I1:RF-36 (viabilidad no confirmada) | No | Mantener abierto |
| PV-13 | Otros criterios de I3:RF-06 y garantía en el perfil | B | I3:RF-05, I3:RF-06 | Sí | No adoptar; mover a posterior |
| PV-14 | Catálogo o ver más compatibles | B | I4:RF-02 | Sí | No adoptar; mover a posterior |
| PV-15 | Búsqueda sin resultados | B | I1:RF-14; I2:RF-05; I3:RF-04-AC-2 | Sí | Adoptar I1:RF-14 ajustado a DEC-13 (ampliar a colonias vecinas o cambiar fechas) |
| PV-16 | Detalles de citas | B (con una parte A: I1:PV-13) | I2:RF-06, I2:RF-18; I1:RF-38-AC-3, I1:RF-17-AC-2, I1:RD-10, I1:RF-39, I1:RF-40; I3:RF-07 | Sí | Adoptar la notificación de confirmación (I1:RF-39); decidir uno por uno el resto |
| PV-17 | Contenido detallado de la propuesta; reinicio de las 72 h | B | I2:RF-08; I3:RF-08 | Sí | Mantener el contenido mínimo de I1:RF-18 y mover el desglose a posterior; decidir el reinicio |
| PV-18 | Campos de la solicitud de cambio | B | I3:RF-08-AC-2; I2:RF-09 | Sí | Adoptar el conjunto de I3:RF-08-AC-2 (coherente con DEC-21 = I3) |
| PV-19 | Vencimiento de las 24 h y contrapropuesta | B | I1 E.3 | Sí | Decidir qué estado toma el cambio al vencer |
| PV-20 | Desacuerdo persistente sin salida | A | I1 §11 (vacío documentado) | No | Mantener abierto |
| PV-21 | Comprobantes de compra y gasto acumulado | B | I3:RF-09-AC-2, I3:RD-06; I1:RF-23 | Sí | Decidir; sugerencia: asociarlos al proyecto y mover el gasto acumulado a posterior |
| PV-22 | Modelo de estados integrado | B | I1 E.1–E.4; I2 Apéndice D; I4:RF-08 | Sí | Decidir la lista de estados; es necesaria para redactar los criterios |
| PV-23 | Aviso de proyectos sin movimiento | B | DEC-26 | Sí | No adoptar; mover a posterior |
| PV-24 | Terminación de un proyecto no concluido | B | I2:RF-19 | Sí | Registrar como no adoptado (DEC-29) y mover a posterior |
| PV-25 | Cliente que no responde al cierre | B | I2:RF-16-AC-4 | Sí | No adoptar; mover a posterior (dependía de soporte, DEC-35) |
| PV-26 | Publicación de la evaluación bidireccional | B | I2:RF-11 | Sí | Adoptar las reglas de I2 (7 días y publicación simultánea), coherente con DEC-30 |
| PV-27 | Mostrar dimensiones o solo el promedio | B | I2:RF-11 | Sí | Decidir; sugerencia: promedio, con dimensiones posteriores |
| ~~PV-28~~ | Evaluaciones injustas sin revisión | **Cerrado** | I1:RF-26, I1:RF-49 | No | **Ya decidido:** DEC-33 los dejó sin efecto explícitamente; quedan cubiertos por FP-14 |
| PV-29 | Tiempo de atención del administrador | A | I1:PV-09 | No | Mantener abierto |
| PV-30 | Domicilio del trabajador: a qué clientes y fin de visibilidad del domicilio del cliente | B | DEC-41; I2:RNF-04 | Sí | Decidir ambos puntos |
| PV-31 | Aviso, plazo legal y conservación | A | I1:PV-15; I2 Apéndice A | No | Mantener abierto |
| PV-32 | Bitácora de auditoría / historial | B | I1:RNF-11, I1:RF-21; I2:RNF-06; I3:RNF-05; I4:RNF-05 | Sí | Adoptar; 3 de 4 SRS la incluyen y RF-44 y RD-17 dependen de ella |
| PV-33 | Respaldos y continuidad | B (los valores de I2 son A) | I1:RNF-03; I2:RNF-14 | Sí | Adoptar I1:RNF-03 (no perder datos); mantener abiertos los valores RPO/RTO, que requieren definición técnica |
| ~~PV-34~~ | Meta de tiempo para la IA | **Cerrado** | I1:RNF-04 | No | **Ya decidido:** la resolución de DEC-39 excluyó la IA del umbral (Opción C) |
| PV-35 | Modelo de ingreso | A | I1:PV-14, I1:PV-17 | No | Mantener abierto |
| PV-36 | Localización y formatos | B | I2:RNF-13 | Sí | Adoptar; es coherente con RE-08 (MXN y zona horaria) |
| PV-37 | Campos para guardar un borrador | B | I3:RF-01-AC-2; I4:RF-01-AC-1 | Sí | Decidir entre los mínimos de I3 y de I4 |
| PV-38 | Valor legal de la propuesta | A | I1:PV-11 | No | Mantener abierto |
| PV-39 | Capacidad del equipo y calendario | A | I1:PV-17, I1:PV-18 | No | Mantener abierto |
| PV-40 | Consulta de costos (antes RF-36) | B | I1:RF-23; I3:RF-10 | Sí | Adoptar la versión limitada (sin "gasto acumulado") |

### 1.8 Resoluciones de la segunda ronda (DEC-42 en adelante)

| DEC | PV / elemento | Decisión | Resultado en matriz |
|---|---|---|---|
| DEC-42 | PV-01 | A: web y app para todos los actores | Se precisan RNF-02 y RE-01; PV-01 cerrado |
| DEC-43 | PV-02 | A: adoptar | Nuevo RNF-11; PV-02 cerrado |
| DEC-44 | PV-03 | A: adoptar | Nuevo RF-45; PV-03 cerrado |
| DEC-45 | PV-04 | A: adoptar | Nuevo RF-46; PV-04 cerrado |
| DEC-46 | PV-05 | A: adoptar | Nuevo RF-47; PV-05 cerrado |
| DEC-47 | PV-06 | A: límites de imagen y pregunta por proyecto; video abierto | Nuevo RF-48; PV-06 queda solo para los límites de video |
| DEC-48 | PV-07 | B: el perfil sigue visible sin la marca | Se precisan RF-08 a RF-12 y RF-23; PV-07 cerrado |
| DEC-49 | PV-09 (RFC) | C: abierto | PV-09 sigue abierto completo (Tipo A, depende de I1:PV-03) |
| DEC-50 | PV-10 | A: el domicilio se captura al dar el consentimiento con la cita confirmada | Se precisa RF-42; PV-10 cerrado |
| DEC-51 | PV-13 | A: adoptar el resto de I3:RF-06 y la garantía | Se amplían RF-25 y RF-07; nuevo PV-41 (orden por cercanía); PV-13 cerrado |
| DEC-52 | PV-14 | B: posterior | Nuevo FP-18; PV-14 cerrado |
| DEC-53 | PV-15 | C: solo mensaje (I3:RF-04-AC-2) | Nuevo RF-49; PV-15 cerrado |
| DEC-54 | PV-16 | Se adoptan a–f, h, i; (g) pasa a posterior | Nuevos RF-50 a RF-53; RF-28 incorpora (f); RF-29 incorpora (c); nuevo FP-19; PV-16 cerrado |
| DEC-55 | PV-17 | Desglose de I3; las 72 h cuentan desde la primera propuesta | Se precisan RF-30 y RF-31; PV-17 cerrado |
| DEC-56 | PV-18 | A: campos de I3 | Se precisa RF-32; PV-18 cerrado |
| DEC-57 | PV-19 | Vence como "no aceptado"; la contrapropuesta reinicia las 24 h; el proveedor acepta o rechaza | Se precisa RF-33; PV-19 cerrado |
| — | PV-41 (nuevo) | ~~Abierto~~ Cerrado por DEC-80 | Criterio para ordenar por cercanía: DEC-13 eliminó la distancia en km y ningún SRS define cómo ordenar por cobertura de colonias |
| DEC-58 | PV-21 | Otra: no aplica a la app (revisión presencial) | Nuevo FP-22; se ajustan RD-14 y RNF-05; PV-21 cerrado |
| DEC-59 | PV-22 | C: borrador → confirmada → programado → en proceso → terminado → concluido | Se precisan RF-37 y RF-39; nuevo PV-42; PV-22 cerrado |
| DEC-60 | PV-23 | B: posterior | Nuevo FP-20; PV-23 cerrado |
| DEC-61 | PV-24 | B: posterior | Nuevo FP-21; PV-24 cerrado |
| DEC-62 | PV-25 | A: aviso al administrador a las 72 h | Nuevo RF-54; PV-25 cerrado |
| DEC-63 | PV-26 | A: reglas de publicación de I2 | Nuevo RF-55; PV-26 cerrado |
| DEC-64 | PV-27 | B: promedio y las 4 dimensiones | Se precisa RF-07; PV-27 cerrado |
| DEC-65 | PV-30 | Domicilio del trabajador solo a clientes con cita confirmada; el domicilio del cliente se revela automáticamente al aceptar la propuesta, hasta 7 días después de "concluido" | Se precisan RF-42, RF-43 y RD-15; **reabre DEC-41 (cliente) y DEC-50**; 3 consecuencias por confirmar; PV-30 cerrado |
| DEC-66 | PV-32 | A: bitácora (I3:RNF-05 + I1:RNF-11) | Nuevo RNF-12; PV-32 cerrado |
| DEC-67 | PV-33 | A: I1:RNF-03 | Nuevo RNF-13; PV-33 cerrado |
| DEC-68 | PV-36 | A: adoptar I2:RNF-13 | Nuevo RNF-14; PV-36 cerrado |
| DEC-69 | PV-37 | A: resultado esperado, oficio y zona para el borrador | Se precisa RF-14; PV-37 cerrado |
| DEC-70 | PV-40 | A: versión limitada | Se reincorpora RF-36; PV-40 cerrado |
| DEC-71 | RF-18 | B: posterior | RF-18 sale del MVP; nuevo FP-23 |
| DEC-72 | RF-21 | A: adoptar; aceptar la propuesta cuenta como autorización para revelar el domicilio | RF-21 confirmado; se resuelve la consecuencia 3 de DEC-65 |
| DEC-73 | RF-35 | A: adoptar | RF-35 confirmado |
| DEC-74 | RNF-07 | A: adoptar | RNF-07 confirmado |
| DEC-75 | RD-07 | A: adoptar | RD-07 confirmado |
| DEC-76 | RD-12 | A: adoptar | RD-12 confirmado |
| DEC-77 | RD-17 | A: adoptar | RD-17 confirmado |
| DEC-78 | Consecuencia 1 de DEC-65 | A: si hay visita, el domicilio se revela al confirmar la cita de visita | Se precisan RF-42 y RF-21 |
| DEC-79 | Consecuencia 2 de DEC-65 | A: el domicilio se captura al primer momento de revelación | Sustituye DEC-50; se precisan RF-14 y RF-42 |
| DEC-80 | PV-41 | A: misma colonia antes que colonias vecinas | Se precisa RF-25; PV-41 cerrado |
| DEC-81 | PV-42 | A: "programado" al confirmarse la primera cita | Se precisan RF-37 y RF-28; PV-42 cerrado |
| — | PV-42 (nuevo) | ~~Abierto~~ Cerrado por DEC-81 | Transición exacta de "confirmada" a "programado" (selección del proveedor, aceptación de la propuesta o cita confirmada); los SRS elegidos en DEC-59 no la definen |

**Elementos de la matriz que solo sostenía una nota "se mantiene" del analista.** Tienen la misma debilidad que RF-36 y se tratan como Tipo B hasta que el equipo decida:

| Elemento actual | Origen | Nota en la que se apoyaba | Recomendación |
|---|---|---|---|
| RF-18 Sugerencia de visita | I3:RF-02-AC-3, I3:RF-03 | DEC-17 "Se mantiene, compatible" | Adoptar |
| RF-21 Autorización de acciones sensibles | I1:RF-20 | Justificación de DEC-21 ("en línea con I1:RF-20") y lista de DEC-41 | Adoptar |
| RF-35 Versiones del presupuesto | I3:RF-08-AC-7, I3:LD-04 | Lista de adopción de DEC-21 (va más allá del tema de la opción C) | Adoptar |
| RNF-07 Uso consentido de datos | I1:RNF-07; I4 §2.4 | DEC-37 "Se mantienen, compatibles" | Adoptar |
| RD-07 La IA no decide | I1:RD-06; I3:RD-04 | DEC-33 "Se mantiene" | Adoptar |
| RD-12 El precio lo define el proveedor | I2:RD-04 | DEC-14 "Se mantiene, compatible" | Adoptar |
| RD-17 Trazas anonimizadas tras la eliminación | I3:RD-09; I1:RF-55-AC-2 | DEC-37 "Se mantienen, compatibles" | Adoptar |

---

## 2. Nueva numeración propuesta (provisional; sustituida por la sección 4)

| Tipo | Rango | Cantidad | Agrupación |
|---|---|---|---|
| RF | RF-01 a RF-44 | 44 | 3.1 Cuentas y consentimiento (RF-01–02) · 3.2 Perfiles y disponibilidad (RF-03–08) · 3.3 Verificación (RF-09–12) · 3.4 Solicitud y agente de IA (RF-13–22) · 3.5 Búsqueda y recomendación (RF-23–27) · 3.6 Citas (RF-28–29) · 3.7 Propuestas (RF-30–31) · 3.8 Cambios de costo (RF-32–36) · 3.9 Seguimiento, comunicación y cierre (RF-37–39) · 3.10 Evaluaciones (RF-40–41) · 3.11 Privacidad y datos (RF-42–44) |
| RNF | RNF-01 a RNF-10 | 10 | Usabilidad (01–02) · Seguridad y privacidad (03–07) · Rendimiento (08) · Disponibilidad (09) · Transparencia (10) |
| RD | RD-01 a RD-18 | 18 | Proveedores y verificación (01–03) · Búsqueda (04–06) · IA (07–09) · Costos y acuerdos (10–12, 14) · Evaluaciones (13) · Privacidad (15–17) · Territorio (18) |
| RE | RE-01 a RE-09 | 9 | Decisiones de producto, restricciones técnicas y restricciones de negocio |
| FP | FP-01 a FP-17 | 17 | Funcionalidades posteriores al MVP |
| PV | PV-01 a PV-39 | 39 | Pendientes por resolver |

Los criterios de aceptación se numerarán `RF-XX-AC-Y` a partir de los criterios de origen. Su consolidación, y la trazabilidad de cada criterio fusionado o ajustado, se hará en el Paso 2.

---

## 3. Índice de `SRS_equipo.md` (actualizado con la numeración definitiva de la sección 4)

```
# SRS_equipo.md

## 1. Introducción
### 1.1 Propósito
### 1.2 Alcance
### 1.3 Definiciones y términos
### 1.4 Referencias y fuentes

## 2. Descripción general
### 2.1 Perspectiva del producto
### 2.2 Objetivos del producto
### 2.3 Tipos de usuario / actores
       (Cliente, Trabajador independiente, Organización de contratistas,
        Administrador; Agente de IA como componente interno)
### 2.4 Alcance del MVP
### 2.5 Funcionalidades fuera del MVP (resumen; detalle en §7)
### 2.6 Restricciones generales (resumen; detalle en §6)
### 2.7 Suposiciones y dependencias

## 3. Requerimientos funcionales
### 3.1 Cuentas y consentimiento
#### RF-01 — Registro e inicio de sesión
#### RF-02 — Consentimiento del aviso de privacidad
### 3.2 Perfiles y disponibilidad
#### RF-03 — Perfil del trabajador
#### RF-04 — Portafolio opcional
#### RF-05 — Registro y perfil de la organización
#### RF-06 — Disponibilidad del proveedor
#### RF-07 — Consulta del perfil del proveedor
#### RF-08 — Distinción entre información declarada y verificada
### 3.3 Verificación
#### RF-09 — Verificación de identidad del trabajador
#### RF-10 — Verificación de experiencia
#### RF-11 — Verificación de la organización
#### RF-12 — Retiro de la verificación
### 3.4 Solicitud y agente de IA
#### RF-13 — Identificación del agente como asistente automático
#### RF-14 — Conversación guiada con el agente
#### RF-15 — Clasificación del oficio
#### RF-16 — Datos mínimos del borrador y de la búsqueda
#### RF-17 — Fotos y videos en la solicitud
#### RF-18 — Límites de imágenes y proyectos múltiples
#### RF-19 — Repregunta ante ambigüedad
#### RF-20 — Resumen confirmable de la solicitud
#### RF-21 — Captura manual si la IA no está disponible
#### RF-22 — Solicitud de soporte humano
#### RF-23 — Representación visual con IA
#### RF-24 — Autorización explícita de acciones sensibles
#### RF-25 — Indicador de procesamiento
### 3.5 Búsqueda y recomendación
#### RF-26 — Búsqueda de proveedores compatibles
#### RF-27 — Búsqueda sin resultados
#### RF-28 — Filtros por verificación y experiencia similar
#### RF-29 — Filtrar y ordenar resultados
#### RF-30 — Recomendación de 3 a 4 proveedores
#### RF-31 — Selección del proveedor
### 3.6 Citas
#### RF-32 — Aceptación de la solicitud por el prestador
#### RF-33 — Costo de la visita
#### RF-34 — Agendamiento con doble confirmación
#### RF-35 — Bloqueo de franjas
#### RF-36 — Notificación y recordatorio de cita
#### RF-37 — Cancelación, cambios y reprogramación de citas
### 3.7 Propuestas
#### RF-38 — Propuesta escrita con desglose
#### RF-39 — Aceptación, negociación y expiración de la propuesta
### 3.8 Cambios de costo
#### RF-40 — Registro de solicitud de cambio
#### RF-41 — Decisión del cliente sobre un cambio
#### RF-42 — Análisis con IA de la justificación
#### RF-43 — Historial de versiones del presupuesto
#### RF-44 — Consulta de costos
#### RF-55 — Solicitud de cambio iniciada por el cliente
### 3.9 Seguimiento, comunicación y cierre
#### RF-45 — Seguimiento por estados del proyecto
#### RF-46 — Canal interno de mensajes del proyecto
#### RF-47 — Cierre del trabajo
#### RF-48 — Aviso por cierre sin respuesta
### 3.10 Evaluaciones
#### RF-49 — Evaluación del proveedor por el cliente
#### RF-50 — Evaluación del cliente por el proveedor
#### RF-51 — Publicación de las evaluaciones
### 3.11 Privacidad y datos
#### RF-52 — Revelación del domicilio del cliente
#### RF-53 — Visibilidad del domicilio del trabajador
#### RF-54 — Atención de solicitudes ARCO

## 4. Requerimientos no funcionales (RNF-01 a RNF-14)

## 5. Reglas de negocio y dominio (RD-01 a RD-18)

## 6. Restricciones y decisiones de alcance (RE-01 a RE-09)
### 6.1 Decisiones de producto
### 6.2 Restricciones técnicas
### 6.3 Restricciones de negocio y elementos fuera del MVP

## 7. Funcionalidades posteriores al MVP (FP-01 a FP-23)

## 8. Pendientes por resolver (PV-01 a PV-13)

## 9. Matriz de trazabilidad

## 10. Resumen cuantitativo
```

---

## 4. Numeración definitiva (compactada)

**Esta sección sustituye a la numeración provisional** de las secciones 1.1, 2 y 3. Los IDs provisionales (columna "ID provisional") son los que citan `decisiones_equipo.md` y las secciones 1.1 a 1.8 de esta matriz; la equivalencia de abajo permite rastrearlos. `SRS_equipo.md` usará únicamente los **IDs definitivos**.

### 4.1 Requerimientos funcionales (55)

| ID definitivo | ID provisional | Requisito | Decisión(es) principal(es) |
|---|---|---|---|
| **3.1 Cuentas y consentimiento** | | | |
| RF-01 | RF-01 | Registro e inicio de sesión | DEC-01, DEC-02, DEC-42 |
| RF-02 | RF-02 | Consentimiento del aviso de privacidad y mayoría de edad | DEC-37 |
| **3.2 Perfiles y disponibilidad** | | | |
| RF-03 | RF-03 | Perfil del trabajador | DEC-06, DEC-13, DEC-38 |
| RF-04 | RF-04 | Portafolio opcional | DEC-08 |
| RF-05 | RF-05 | Registro y perfil de la organización | DEC-09, DEC-10 |
| RF-06 | RF-06 | Disponibilidad del proveedor | Consenso; DEC-10 |
| RF-07 | RF-07 | Consulta del perfil del proveedor (incluye calificación promedio, número de evaluaciones, las 4 dimensiones, rango de precio y garantía) | Consenso; DEC-14, DEC-31, DEC-51, DEC-64 |
| RF-08 | RF-08 | Distinción entre información declarada y verificada | DEC-06, DEC-48 |
| **3.3 Verificación** | | | |
| RF-09 | RF-09 | Verificación de identidad del trabajador | DEC-07, DEC-48 |
| RF-10 | RF-10 | Verificación de experiencia | DEC-07, DEC-08, DEC-48 |
| RF-11 | RF-11 | Verificación de la organización | DEC-09, DEC-48 |
| RF-12 | RF-12 | Retiro de la verificación | DEC-07 (resolución), DEC-48 |
| **3.4 Solicitud y agente de IA** | | | |
| RF-13 | RF-45 | El agente se identifica como asistente automático | DEC-44 |
| RF-14 | RF-13 | Conversación guiada con el agente | DEC-03 |
| RF-15 | RF-46 | Clasificación del oficio dentro del catálogo | DEC-45 |
| RF-16 | RF-14 | Datos mínimos del borrador y de la búsqueda | DEC-12, DEC-69, DEC-79 |
| RF-17 | RF-15 | Fotos y videos en la solicitud | DEC-11 |
| RF-18 | RF-48 | Límites de imágenes y proyectos múltiples | DEC-47 |
| RF-19 | RF-16 | Repregunta ante ambigüedad | DEC-03 |
| RF-20 | RF-17 | Resumen confirmable de la solicitud | DEC-03 |
| RF-21 | RF-47 | Captura manual si la IA no está disponible | DEC-46 |
| RF-22 | RF-19 | Solicitud de soporte humano | DEC-03, DEC-35 |
| RF-23 | RF-20 | Representación visual con IA | DEC-05 |
| RF-24 | RF-21 | Autorización explícita de acciones sensibles | DEC-72, DEC-78 |
| RF-25 | RF-22 | Indicador de procesamiento | DEC-39 (resolución) |
| **3.5 Búsqueda y recomendación** | | | |
| RF-26 | RF-23 | Búsqueda de proveedores compatibles | Consenso; DEC-06, DEC-13, DEC-24, DEC-48 |
| RF-27 | RF-49 | Búsqueda sin resultados | DEC-53 |
| RF-28 | RF-24 | Filtros por verificación y experiencia similar | DEC-06 |
| RF-29 | RF-25 | Filtrar y ordenar (precio, calificación, disponibilidad, cercanía, garantía) | DEC-14, DEC-51, DEC-80 |
| RF-30 | RF-26 | Recomendación de 3 a 4 proveedores | DEC-15 |
| RF-31 | RF-27 | Selección del proveedor | Consenso |
| **3.6 Citas** | | | |
| RF-32 | RF-52 | Aceptación de la solicitud por el prestador (4 h) | DEC-54 (h) |
| RF-33 | RF-53 | Costo de la visita | DEC-54 (i) |
| RF-34 | RF-28 | Agendamiento con doble confirmación y expiración a las 24 h | DEC-16, DEC-54 (f), DEC-81 |
| RF-35 | RF-51 | Bloqueo de franjas y prevalencia de la primera confirmación | DEC-54 (d, e) |
| RF-36 | RF-50 | Notificación de confirmación y recordatorio de cita | DEC-54 (a, b) |
| RF-37 | RF-29 | Cancelación, cambios y reprogramación de citas | Consenso; DEC-29, DEC-54 (c) |
| **3.7 Propuestas** | | | |
| RF-38 | RF-30 | Propuesta escrita con desglose | DEC-17, DEC-55 |
| RF-39 | RF-31 | Aceptación, negociación y expiración de la propuesta | DEC-18, DEC-19, DEC-55 |
| **3.8 Cambios de costo** | | | |
| RF-40 | RF-32 | Registro de solicitud de cambio | DEC-21, DEC-56 |
| RF-41 | RF-33 | Decisión del cliente sobre un cambio | DEC-20, DEC-22, DEC-34, DEC-57 |
| RF-42 | RF-34 | Análisis con IA de la justificación | DEC-05 |
| RF-43 | RF-35 | Historial de versiones del presupuesto | DEC-73 |
| RF-44 | RF-36 | Consulta de costos | DEC-70 |
| **3.9 Seguimiento, comunicación y cierre** | | | |
| RF-45 | RF-37 | Seguimiento por estados del proyecto | DEC-25, DEC-59, DEC-81 |
| RF-46 | RF-38 | Canal interno de mensajes del proyecto | DEC-36 |
| RF-47 | RF-39 | Cierre del trabajo | Consenso; DEC-28, DEC-59 |
| RF-48 | RF-54 | Aviso al administrador por cierre sin respuesta (72 h) | DEC-62 |
| **3.10 Evaluaciones** | | | |
| RF-49 | RF-40 | Evaluación del proveedor por el cliente | DEC-31, DEC-32 |
| RF-50 | RF-41 | Evaluación del cliente por el proveedor | DEC-30, DEC-32 |
| RF-51 | RF-55 | Publicación de las evaluaciones | DEC-63 |
| **3.11 Privacidad y datos** | | | |
| RF-52 | RF-42 | Revelación del domicilio del cliente | DEC-65, DEC-78, DEC-79 |
| RF-53 | RF-43 | Visibilidad del domicilio del trabajador | DEC-41, DEC-65 |
| RF-54 | RF-44 | Atención de solicitudes ARCO | DEC-37 |
| **3.8 Cambios de costo (agregado en la tercera ronda)** | | | |
| RF-55 | — (nuevo, definitivo) | Solicitud de cambio iniciada por el cliente | DEC-85 |

El RF-18 provisional (sugerencia de visita) no tiene ID definitivo porque pasó a FP-23 (DEC-71).

### 4.2 RNF, RD, RE y FP

No requieren compactación porque no tienen huecos:
- **RNF-01 a RNF-14:** se conservan los IDs.
- **RD-01 a RD-18:** se conservan los IDs.
- **RE-01 a RE-09:** se conservan los IDs.
- **FP-01 a FP-23:** se conservan los IDs.

Las referencias internas a RF dentro de estos elementos se actualizarán a los IDs definitivos al redactar el SRS. Ejemplos: RD-07 cita RF-24 (antes RF-21), RF-30 (antes RF-26) y RF-42 (antes RF-34); RD-14 y RNF-05 se ajustan según DEC-58; RD-15 se ajusta según DEC-65 y DEC-78.

### 4.3 Pendientes que siguen abiertos (13)

| ID definitivo | ID provisional | Tema | Tipo | Razón por la que sigue abierto |
|---|---|---|---|---|
| PV-01 | PV-06 | Límites de duración, tamaño y cantidad para videos | B | Ningún SRS ni la elicitación aportan un valor y el equipo no tiene información técnica para fijarlo (DEC-47) |
| PV-02 | PV-08 | Evidencia de experiencia aceptable sin certificados | A | Abierto en I1:PV-02 |
| PV-03 | PV-09 | Campos mínimos del registro de organización, significado de "organización registrada" y RFC | A | Abierto en I1:PV-03; el RFC depende de esa definición legal (DEC-49) |
| PV-04 | PV-11 | Cómo declara el proveedor su cobertura y qué es "zona vecina" | A | Abierto en I1:PV-05 |
| PV-05 | PV-12 | Cómo se captura un precio comparable; viabilidad del filtro por precio | A | I1 lo dejó fuera por viabilidad no confirmada (I1:RF-36) |
| PV-06 | PV-20 | Desacuerdo persistente sobre un cambio sin salida formal | A | Vacío documentado en I1 §11 |
| PV-07 | PV-29 | Tiempo de atención del administrador a solicitudes de soporte | A | Abierto en I1:PV-09 (capacidad del equipo) |
| PV-08 | PV-31 | Texto del aviso de privacidad, plazo legal ARCO y plazo de conservación | A | Abierto en I1:PV-15 y en el Apéndice A de I2 (asesoría legal) |
| PV-09 | PV-35 | Modelo de ingreso de la plataforma | A | Abierto en I1:PV-14 y PV-17 |
| PV-10 | PV-38 | Valor legal de la propuesta aceptada | A | Abierto en I1:PV-11 |
| PV-11 | PV-39 | Capacidad del equipo y calendario para el alcance definido | A | Abierto en I1:PV-17 y PV-18 |
| PV-12 | — (nuevo) | Si la anonimización incluye los mensajes del canal interno, los videos y la calificación del cliente | B | DEC-86: el equipo decidió esperar la revisión legal (PV-08); I3:RF-15-AC-2 menciona archivos y conversación, pero I2:RF-21 no; la calificación del cliente no tiene fuente |
| PV-13 | — (nuevo) | Métrica cuantitativa de usabilidad para RNF-01 | B | DEC-87: la única métrica disponible (I2:RNF-07) era para WhatsApp; el equipo la definirá al conocer las tareas y usuarios del piloto |

### 4.4 Totales definitivos

| Elemento | Total |
|---|---|
| RF del MVP | 55 |
| RNF | 14 |
| RD | 18 |
| RE | 9 |
| FP | 23 |
| PV abiertos | 13 |
| Decisiones registradas | 88 (DEC-01 a DEC-88) |

### 4.5 Tercera ronda (DEC-82 a DEC-88)

| DEC | Tema | Decisión | Resultado en matriz (IDs definitivos) |
|---|---|---|---|
| DEC-82 | Garantía en búsqueda y orden | B: filtro y orden, con garantía primero | Se precisa RF-29 |
| DEC-83 | Paso a "en proceso" | A: el proveedor marca el inicio | RF-45 respaldado; sin cambio de comportamiento |
| DEC-84 | Propuesta aceptada y cita de ejecución | A: la cita de ejecución exige propuesta aceptada por ambas partes | Nuevo criterio en RF-34 |
| DEC-85 | Contrapropuesta sin respuesta del proveedor | C2 (a): rechazo automático; el cliente puede iniciar una solicitud de cambio (espejo de RF-40/RF-41) | Nuevo criterio en RF-41; **nuevo RF-55**; reabre parcialmente DEC-21 |
| DEC-86 | Alcance de la anonimización | A: se conservan los datos de RF-54 | **Nuevo PV-12** |
| DEC-87 | Métrica de usabilidad | C: pendiente | **Nuevo PV-13**; se precisa RNF-01 |
| DEC-88 | "Programado" con visita previa | A: se mantiene DEC-81; la consecuencia queda aceptada | Se precisa la descripción de RF-45 |
