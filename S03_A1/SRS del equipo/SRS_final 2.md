# Especificación de Requerimientos de Software (SRS): UnCalificado

**Versión:** 1.3
**Basado en:** IEEE Std 830-1998  
**Fuente de elicitación:** `transcript_entrevista.md`
**Estado:** revisado técnicamente; las decisiones de producto incorporadas en
esta versión se documentan en `revision_SRS.md`.

---

## 1. Introducción

### 1.1 Propósito

Este documento especifica los requerimientos de UnCalificado, una aplicación
web que conecta clientes con trabajadores de oficio u organizaciones de
contratistas y emplea un agente de IA para entender proyectos, recomendar
proveedores y dar seguimiento a avances y costos. Está dirigido al equipo de
desarrollo y servirá como base para diseño, implementación y pruebas.

### 1.2 Alcance

UnCalificado permite crear solicitudes de trabajos de oficio, recopilar sus
detalles mediante un agente de IA, buscar proveedores cercanos y disponibles,
agendar citas, gestionar cotizaciones y materiales, y registrar avances con
evidencias. El MVP no procesa pagos: únicamente registra acuerdos,
cotizaciones y comprobantes.

### 1.3 Definiciones y acrónimos

- **Cliente:** persona que solicita un trabajo de oficio.
- **Proveedor de servicio:** trabajador independiente u organización de
  contratistas que ofrece un servicio.
- **Solicitud de trabajo:** descripción del proyecto que el cliente desea
  realizar.
- **Cotización:** estimación desglosada de mano de obra, materiales y costos
  adicionales.
- **Etapa:** parte verificable de un proyecto que puede ser marcada como
  terminada.
- **Disponibilidad:** franja de fecha y hora, en la zona horaria de la
  solicitud, que el proveedor publicó como reservable y que no tiene una cita
  confirmada.
- **Proveedor verificado:** proveedor u organización cuyo estado de
  verificación es `verificado`; este estado no acredita ni garantiza la calidad
  futura del trabajo.
- **Gasto acumulado:** suma de los importes de comprobantes de compra y de
  conceptos de mano de obra registrados en avances y aceptados por el cliente;
  no incluye cambios pendientes, rechazados ni pagos, pues el MVP no los
  procesa.
- **Proyecto concluido:** proyecto cuyas etapas definidas fueron validadas por
  el cliente o cerrado por acuerdo documentado entre cliente y proveedor.

### 1.4 Referencias

- `proyecto_base.md`: definición del problema, usuarios y valor de UnCalificado.
- `guion_entrevista.md`: preguntas de elicitación utilizadas.
- `transcript_entrevista.md`: necesidades, restricciones y reglas obtenidas de
  la entrevista.
- `casos_de_uso.puml`: casos de uso y actores trazables a los requisitos
  funcionales.
- IEEE Std 830-1998: guía de organización de esta especificación.

### 1.5 Organización del documento

La sección 2 describe el producto, sus usuarios, restricciones y dependencias.
La sección 3 define las interfaces externas, los requisitos funcionales,
atributos de calidad, datos lógicos y reglas de dominio. Los IDs `RF-XX-AC-Y`
son los identificadores de trazabilidad para contratos OpenAPI y pruebas
automatizadas posteriores.

---

## 2. Descripción general

### 2.1 Perspectiva del producto

UnCalificado será una aplicación web responsive, accesible desde navegadores
de escritorio y celulares. Integrará una interfaz de conversación con IA, una
base de datos de proveedores y proyectos, almacenamiento de evidencias y un
módulo de notificaciones.

### 2.2 Funciones del producto

- Creación y aclaración de solicitudes de trabajo mediante IA.
- Búsqueda, comparación y filtrado de proveedores.
- Gestión de perfiles, disponibilidad y citas.
- Cotizaciones con materiales y autorización de cambios.
- Seguimiento de avances, costos, evidencias y alertas.
- Evaluación de proveedores y reporte de fraude.

### 2.3 Características de los usuarios

- **Cliente:** crea solicitudes, compara proveedores, agenda citas, aprueba
  cambios, consulta avances y evalúa al proveedor.
- **Trabajador independiente:** configura su perfil, disponibilidad,
  cotizaciones y avances de sus proyectos.
- **Organización de contratistas:** realiza las mismas funciones del proveedor
  para los trabajadores que representa.
- **Administrador de verificación:** revisa la evidencia de identidad,
  organización y portafolio, y atiende los reportes. No participa en las
  decisiones comerciales de los proyectos.

### 2.4 Restricciones

- El sistema no procesa pagos durante el MVP.
- La IA no puede aceptar decisiones contractuales o financieras en nombre de
  los usuarios.
- La dirección exacta y otros datos sensibles se comparten solamente después
  de la aceptación de la cita por ambas partes y con consentimiento expreso
  del cliente.
- La moneda, zona horaria y cobertura iniciales son MXN, zona horaria
  `America/Mexico_City` y territorio mexicano; configurarlos de otro modo queda
  fuera del MVP.

### 2.5 Suposiciones y dependencias

- Los clientes y proveedores tienen acceso a un navegador moderno y conexión a
  Internet para utilizar la aplicación.
- Cada proveedor mantiene actualizadas su zona de cobertura y disponibilidad;
  una recomendación no sustituye la confirmación de la cita.
- El agente depende de un servicio de IA para generar preguntas y resúmenes.
  Si no está disponible, el cliente podrá capturar la solicitud manualmente,
  pero no recibirá preguntas ni resumen automatizado.
- Las fotografías, videos y comprobantes dependen de almacenamiento de
  archivos disponible; si una carga falla, el sistema debe conservar el avance
  textual y comunicar que el adjunto no fue guardado.
- La verificación de identidad, organizaciones y portafolios depende de la
  evidencia que entregue el proveedor y de la revisión del administrador; no
  garantiza resultados, precios ni cumplimiento futuro.

---

## 3. Requerimientos específicos

### 3.1 Interfaces externas

#### 3.1.1 Interfaz de usuario

La aplicación debe proveer interfaces web para cliente, proveedor y
administrador de verificación. El cliente usa una conversación con IA y
formularios para describir la solicitud, comparar opciones, gestionar citas y
aprobar cambios. El proveedor usa formularios para administrar perfil,
disponibilidad, cotizaciones y avances. El administrador revisa evidencias y
reportes; no puede aceptar ni modificar acuerdos comerciales.

#### 3.1.2 Interfaces de hardware

El sistema se utiliza desde navegadores de escritorio o móviles. Una cámara o
galería del dispositivo es opcional para adjuntar fotografías o videos; la
ausencia de cámara no impide crear solicitudes, cotizaciones o avances sin
evidencias visuales.

#### 3.1.3 Interfaces de software

El sistema se integra con un servicio de IA para recopilar información y
resumir conversaciones, un servicio de almacenamiento de archivos para
evidencias y un servicio de notificaciones para alertas de citas y cambios.
Estos servicios no pueden aprobar decisiones ni modificar datos de un proyecto
sin una acción explícita de un usuario autorizado.

#### 3.1.4 Interfaces de comunicaciones

Todas las interfaces web y de servicios deben usar HTTPS. Las notificaciones
pueden enviarse dentro de la aplicación y por correo electrónico registrado;
no se requiere integración con mensajería instantánea, pasarelas de pago ni
sistemas de facturación en el MVP.

### 3.2 Requerimientos funcionales

**RF-01: Crear solicitud de trabajo**  
El sistema debe permitir al cliente crear una solicitud indicando resultado esperado,
tipo de oficio, ubicación aproximada, fecha deseada, presupuesto opcional y
fotografías o videos opcionales.

- **RF-01-AC-1:** **Dado que** el cliente captura resultado esperado, tipo de oficio y zona aproximada, **cuando** guarda la solicitud, **entonces** el sistema crea una solicitud con estado `borrador` y muestra su identificador.
- **RF-01-AC-2:** **Dado que** falta el resultado esperado, tipo de oficio o zona aproximada, **cuando** el cliente intenta guardar la solicitud, **entonces** el sistema no la crea e identifica cada campo obligatorio faltante.

**RF-02: Recopilar detalles con agente de IA**  
El agente de IA debe identificar los datos faltantes entre tipo de espacio,
medidas, condiciones del espacio, materiales deseados y responsable de compra.
Debe solicitar únicamente los que sean aplicables al oficio seleccionado. Si el
cliente indica que no conoce un dato, debe registrarlo como `desconocido` y
proponer visita de evaluación; no puede inventarlo ni bloquear la solicitud.

- **RF-02-AC-1:** **Dado que** la solicitud no incluye medidas o condiciones del espacio, **cuando** el cliente inicia la conversación con el agente, **entonces** el agente solicita esos datos antes de generar el resumen.
- **RF-02-AC-2:** **Dado que** el cliente indica que requiere materiales, **cuando** responde al agente, **entonces** el agente pregunta si los comprará el cliente, el proveedor o una organización de contratistas.
- **RF-02-AC-3:** **Dado que** el cliente declara desconocer una medida o
  condición aplicable, **cuando** confirma el resumen, **entonces** el sistema
  conserva el valor `desconocido` y ofrece una visita de evaluación.

**RF-03: Confirmar solicitud y proponer visita**  
El sistema debe mostrar al cliente un resumen editable antes de buscar proveedores.
Una solicitud solo es apta para solicitar cotización sin visita si su versión
confirmada contiene oficio, descripción del resultado esperado, zona aproximada,
fecha deseada, materiales deseados y al menos medidas o una fotografía/video del
espacio. Si falta cualquiera de esos datos, debe proponer una visita de
evaluación.

- **RF-03-AC-1:** **Dado que** el agente termina de recopilar datos, **cuando** genera el resumen, **entonces** el sistema muestra los datos capturados y permite al cliente editarlos antes de iniciar la búsqueda.
- **RF-03-AC-2:** **Dado que** la versión confirmada de la solicitud no contiene oficio, descripción del resultado esperado, zona aproximada, fecha deseada, materiales deseados o al menos medidas o una fotografía/video, **cuando** el cliente solicita una cotización, **entonces** el sistema muestra la opción de solicitar una visita de evaluación y no presenta un precio definitivo.
- **RF-03-AC-3:** **Dado que** el cliente edita el resumen, **cuando** lo
  confirma, **entonces** el sistema guarda la versión confirmada y usa
  exclusivamente esa versión para las recomendaciones.
- **RF-03-AC-4:** **Dado que** la versión confirmada contiene oficio,
  descripción del resultado esperado, zona aproximada, fecha deseada,
  materiales deseados y al menos medidas o una fotografía/video, **cuando** el
  cliente solicita una cotización, **entonces** el sistema marca la solicitud
  como `apta para cotización sin visita`.

**RF-04: Buscar proveedores**  
El sistema debe buscar trabajadores independientes y organizaciones de
contratistas por oficio, zona de cobertura y disponibilidad. Cada resultado
debe indicar los criterios coincidentes y los que no se evaluaron; solo podrán
recomendarse proveedores con perfil `verificado`.

- **RF-04-AC-1:** **Dado que** el cliente confirma una solicitud con oficio, zona y fecha, **cuando** solicita recomendaciones, **entonces** el sistema muestra únicamente proveedores cuyo oficio, zona de cobertura y disponibilidad coinciden con la solicitud.
- **RF-04-AC-2:** **Dado que** no existe un proveedor que coincida con oficio, zona y fecha, **cuando** el cliente solicita recomendaciones, **entonces** el sistema muestra el mensaje `No hay proveedores disponibles para los criterios seleccionados`.
- **RF-04-AC-3:** **Dado que** se muestra una recomendación, **cuando** el
  cliente consulta su explicación, **entonces** el sistema muestra oficio,
  cobertura, disponibilidad y estado de verificación que sustentan la
  recomendación, sin afirmar que la IA garantiza el resultado.

**RF-05: Consultar perfil del proveedor**  
El sistema debe mostrar tipo de afiliación, especialidad, experiencia,
calificación promedio, número de evaluaciones, comentarios recientes,
portafolio, cobertura, disponibilidad, rango de precio y garantía cuando aplique.

- **RF-05-AC-1:** **Dado que** el cliente selecciona una recomendación, **cuando** consulta el perfil, **entonces** el sistema muestra modalidad, especialidad, experiencia, calificación promedio, número de evaluaciones, cobertura y disponibilidad.
- **RF-05-AC-2:** **Dado que** el proveedor cuenta con portafolio, comentarios, rango de precio o garantía, **cuando** el cliente consulta el perfil, **entonces** el sistema muestra esa información asociada al proveedor.
- **RF-05-AC-3:** **Dado que** el perfil se muestra en resultados o en detalle,
  **cuando** el cliente lo consulta, **entonces** el sistema muestra su estado
  de verificación y la fecha de su última actualización.

**RF-06: Filtrar y ordenar recomendaciones**  
El sistema debe permitir al cliente filtrar y ordenar resultados por calificación,
disponibilidad, precio, cercanía y garantía, indicando los criterios usados. La
calificación se ordena de mayor a menor, el precio y la distancia de menor a
mayor, y la disponibilidad por la franja más próxima; los empates se ordenan
por calificación de mayor a menor.

- **RF-06-AC-1:** **Dado que** existen recomendaciones, **cuando** el cliente selecciona calificación, disponibilidad, precio, cercanía o garantía como criterio de orden, **entonces** el sistema reordena la lista y muestra el criterio aplicado.
- **RF-06-AC-2:** **Dado que** existen recomendaciones, **cuando** el cliente aplica un filtro de calificación, disponibilidad, precio, cercanía o garantía, **entonces** el sistema muestra únicamente los proveedores que cumplen el filtro seleccionado.
- **RF-06-AC-3:** **Dado que** el cliente aplica un filtro numérico, **cuando**
  indica un mínimo o máximo, **entonces** el sistema muestra el valor aplicado
  y excluye resultados sin un valor comparable, salvo que seleccione
  explícitamente incluirlos.

**RF-07: Gestionar citas**  
El sistema debe permitir solicitar una cita, seleccionar un horario disponible y
confirmarla solamente cuando el cliente y el proveedor acepten el horario.
Antes de solicitarla debe mostrar el costo de visita, o `sin costo`, y su
moneda. Ambas partes pueden cancelar una cita pendiente o confirmada; el
sistema debe conservar el motivo y notificar a la contraparte.

- **RF-07-AC-1:** **Dado que** el cliente selecciona un horario disponible, **cuando** solicita la cita, **entonces** el sistema la registra con estado `pendiente de aceptación` y notifica al proveedor.
- **RF-07-AC-2:** **Dado que** el cliente y el proveedor aceptan el mismo horario, **cuando** el sistema registra la segunda aceptación, **entonces** cambia el estado de la cita a `confirmada`.
- **RF-07-AC-3:** **Dado que** la cita está confirmada y el cliente autorizó
  compartir la dirección exacta, **cuando** ambas partes aceptaron el horario,
  **entonces** el sistema comparte dirección, teléfono y fotografías del
  domicilio únicamente con el proveedor asociado a la cita.
- **RF-07-AC-4:** **Dado que** una parte cancela una cita, **cuando** indica un
  motivo y confirma la acción, **entonces** el sistema cambia su estado a
  `cancelada`, registra el motivo y notifica a la otra parte.

**RF-08: Gestionar cotización y cambios**  
El sistema debe registrar cotizaciones desglosadas en mano de obra, materiales y
costos adicionales, y permitir al cliente aprobar o rechazar cambios de
presupuesto, materiales, alcance o fecha. Cada cotización debe tener versión,
fecha de emisión, vigencia y total en MXN. El sistema debe conservar
inmutablemente el presupuesto inicial aprobado y una versión cronológica por
cada cambio aprobado para comparar el total inicial con el actual. Cada material debe indicar
descripción, cantidad, unidad, precio unitario y subtotal; cuando se proponga,
también marca o calidad.

- **RF-08-AC-1:** **Dado que** el proveedor crea una cotización, **cuando** la envía al cliente, **entonces** el sistema muestra por separado los conceptos y subtotales de mano de obra, materiales y costos adicionales.
- **RF-08-AC-2:** **Dado que** el proveedor propone un cambio que incluye tipo
  de cambio, motivo, monto adicional o ahorro en MXN, presupuesto actualizado,
  materiales o alcance afectados y cambio propuesto a la fecha de entrega,
  **cuando** el cliente lo aprueba, **entonces** el sistema actualiza el
  proyecto y registra la decisión en la bitácora.
- **RF-08-AC-3:** **Dado que** el proveedor propone un costo adicional, **cuando** el cliente lo rechaza o no ha respondido, **entonces** el sistema no incorpora dicho costo al presupuesto aprobado.
- **RF-08-AC-4:** **Dado que** la cotización contiene materiales, **cuando** el
  proveedor la envía, **entonces** el sistema rechaza el envío si algún
  material no tiene descripción, cantidad, unidad, precio unitario o subtotal,
  o si los subtotales no suman el total declarado.
- **RF-08-AC-5:** **Dado que** una cotización o cambio caducó según su vigencia,
  **cuando** el cliente intenta aprobarlo, **entonces** el sistema bloquea la
  aprobación e informa que el proveedor debe emitir una versión vigente.
- **RF-08-AC-6:** **Dado que** un cambio no contiene alguno de los campos
  obligatorios de impacto, **cuando** el proveedor intenta enviarlo, **entonces**
  el sistema rechaza el envío e identifica cada campo faltante.
- **RF-08-AC-7:** **Dado que** existe un presupuesto inicial aprobado,
  **cuando** el cliente aprueba un cambio, **entonces** el sistema conserva una
  nueva versión con fecha, total anterior, total actualizado y diferencia en
  MXN respecto al presupuesto inicial, y permite consultar el historial
  cronológico de versiones.

**RF-09: Registrar avance del proyecto**  
El sistema debe permitir al proveedor registrar avances por etapa con fotografías,
tareas terminadas, pendientes, porcentaje de avance, imprevistos y comprobantes.
Antes del primer avance, proveedor y cliente deben acordar y registrar las
etapas del proyecto. El proveedor debe registrar una actualización por cada
etapa terminada y, para proyectos con duración mayor a siete días, al menos una
actualización cada siete días calendario mientras haya una etapa en curso.

- **RF-09-AC-1:** **Dado que** una etapa está en curso, **cuando** el proveedor registra tareas terminadas, tareas pendientes y un porcentaje de avance entre 0 y 100, **entonces** el sistema asocia el avance a la etapa y lo muestra al cliente.
- **RF-09-AC-2:** **Dado que** el proveedor adjunta fotografías, comprobantes o la descripción de un imprevisto, **cuando** guarda el avance, **entonces** el sistema conserva los adjuntos y el imprevisto asociados a la etapa.
- **RF-09-AC-3:** **Dado que** el proyecto no tiene etapas acordadas, **cuando**
  el proveedor intenta registrar el primer avance, **entonces** el sistema
  bloquea el registro e indica que debe definir al menos una etapa.
- **RF-09-AC-4:** **Dado que** un proyecto lleva más de siete días y tiene una
  etapa en curso sin actualización en los siete días calendario previos,
  **cuando** inicia el día siguiente, **entonces** el sistema notifica al
  proveedor y al cliente sobre la actualización pendiente.

**RF-10: Consultar avance, gasto y alertas**  
El sistema debe mostrar al cliente el avance y gasto acumulado contra el
presupuesto aprobado, y alertar sobre solicitudes que afecten costo, material,
alcance o fecha. El porcentaje acumulado es el promedio simple del porcentaje
más reciente de todas las etapas acordadas; una etapa sin avances registrados
aporta 0 % al promedio.

- **RF-10-AC-1:** **Dado que** el proyecto tiene etapas acordadas y una
  cotización aprobada, **cuando** el cliente consulta el proyecto, **entonces**
  el sistema muestra tareas, gasto acumulado, presupuesto aprobado y el
  promedio simple del porcentaje más reciente de cada etapa, usando 0 % para
  cada etapa sin avances.
- **RF-10-AC-2:** **Dado que** el proveedor solicita un cambio de costo,
  material, alcance o fecha, **cuando** registra la solicitud con todos los
  campos de impacto de RF-08, **entonces** el sistema crea una alerta visible
  para el cliente con el tipo, motivo, monto adicional o ahorro, presupuesto
  actualizado, elementos afectados y fecha propuesta.
- **RF-10-AC-3:** **Dado que** el cliente tiene alertas sin atender, **cuando**
  accede al proyecto, **entonces** el sistema muestra el número de alertas y
  permite abrir cada solicitud de cambio sin aplicar el cambio automáticamente.

**RF-11: Validar etapas y evaluar proveedor**  
El sistema debe permitir al cliente validar una etapa terminada y evaluar al
proveedor al concluir el proyecto. La evaluación consta de una calificación
entera de 1 a 5 y comentario opcional; solo se permite una evaluación por
cliente, proveedor y proyecto.

- **RF-11-AC-1:** **Dado que** el proveedor marca una etapa como terminada, **cuando** el cliente la valida, **entonces** el sistema cambia el estado de la etapa a `validada` y guarda la fecha de validación.
- **RF-11-AC-2:** **Dado que** el proyecto tiene estado `concluido`, **cuando** el cliente envía una evaluación del proveedor, **entonces** el sistema la asocia al proyecto y actualiza la información de reputación mostrada en el perfil.
- **RF-11-AC-3:** **Dado que** el cliente intenta evaluar con una calificación
  fuera del rango 1 a 5 o publicar una segunda evaluación del mismo proyecto,
  **cuando** envía el formulario, **entonces** el sistema no publica la
  evaluación e indica la causa.
- **RF-11-AC-4:** **Dado que** todas las etapas acordadas están `validadas`,
  **cuando** el cliente confirma el cierre, **entonces** el sistema cambia el
  proyecto a `concluido` y habilita la evaluación.

**RF-12: Reportar irregularidades**  
El sistema debe permitir reportar perfiles, organizaciones o publicaciones por
fraude, comportamiento inseguro o información falsa. Un administrador de
verificación debe poder consultar los reportes y cambiar su estado a
`en revisión`, `resuelto` o `descartado`, con una justificación interna.

- **RF-12-AC-1:** **Dado que** un usuario autenticado consulta un perfil, organización o publicación, **cuando** selecciona una causa de reporte y envía el formulario, **entonces** el sistema registra el reporte con fecha, usuario reportante, elemento reportado y causa.
- **RF-12-AC-2:** **Dado que** el usuario no selecciona una causa de reporte, **cuando** intenta enviar el formulario, **entonces** el sistema no crea el reporte e indica que debe seleccionar una causa.
- **RF-12-AC-3:** **Dado que** un administrador autorizado resuelve o descarta
  un reporte, **cuando** registra la decisión y justificación, **entonces** el
  sistema actualiza el estado, conserva la decisión en la bitácora y no revela
  la identidad del reportante al elemento reportado.

**RF-13: Verificar proveedores, organizaciones y portafolios**
El sistema debe permitir al administrador registrar el resultado de la
verificación de identidad del proveedor, registro de la organización y
evidencia del portafolio. El estado puede ser `pendiente`, `verificado`,
`rechazado` o `suspendido`; los tres últimos deben conservar fecha y motivo.

- **RF-13-AC-1:** **Dado que** un proveedor envía la evidencia requerida,
  **cuando** el administrador la aprueba, **entonces** el sistema cambia el
  estado a `verificado`, registra fecha y administrador responsable, y permite
  que el perfil aparezca en recomendaciones.
- **RF-13-AC-2:** **Dado que** un perfil está `pendiente`, `rechazado` o
  `suspendido`, **cuando** un cliente solicita recomendaciones, **entonces** el
  sistema no lo incluye.

**RF-14: Solicitar ayuda y comunicación directa**
El sistema debe permitir al cliente solicitar soporte o abrir un canal de
comunicación con el proveedor asociado cuando la IA no resuelva su solicitud.
El canal debe conservar los mensajes asociados al proyecto y no revelar datos
de contacto antes de que se confirme la cita.

- **RF-14-AC-1:** **Dado que** el cliente indica que la respuesta de la IA no
  resolvió su necesidad, **cuando** selecciona `Solicitar soporte`, **entonces**
  el sistema registra el caso con la solicitud y el resumen de la conversación.
- **RF-14-AC-2:** **Dado que** existe una cita confirmada, **cuando** cliente o
  proveedor envía un mensaje en el proyecto, **entonces** el sistema entrega el
  mensaje a la contraparte y conserva fecha, emisor y contenido.

**RF-15: Gestionar consentimiento y eliminación de datos**
El sistema debe permitir al cliente decidir si comparte su dirección exacta al
confirmar una cita y solicitar la eliminación de sus datos e historial de
proyectos concluidos. Una solicitud de eliminación debe eliminar o anonimizar
datos personales y archivos del usuario en máximo 30 días calendario, sin
alterar la bitácora de decisiones, que debe conservarse anonimizada.

- **RF-15-AC-1:** **Dado que** el cliente no autoriza compartir la dirección
  exacta, **cuando** confirma una cita, **entonces** el sistema no la revela al
  proveedor y muestra al cliente que deberá proporcionarla por otro medio.
- **RF-15-AC-2:** **Dado que** el cliente solicita eliminar un proyecto
  concluido, **cuando** confirma la solicitud, **entonces** el sistema registra
  la fecha límite y, al completarla, elimina o anonimiza sus datos personales,
  archivos y conversación, conservando solo la bitácora anonimizada.

**RF-16: Elaborar representación visual del proyecto con IA**  
El sistema debe permitir al cliente adjuntar imágenes de referencia y solicitar
al agente de IA una representación visual del alcance del trabajo. La
representación es una ayuda de comunicación y no un plano técnico ni una
garantía de ejecución.

- **RF-16-AC-1:** **Dado que** el cliente adjunta al menos una imagen de
  referencia y describe el resultado esperado, **cuando** solicita una
  representación visual, **entonces** el sistema genera una propuesta asociada
  a la solicitud y permite al cliente editar su descripción.
- **RF-16-AC-2:** **Dado que** el cliente aprueba una representación visual,
  **cuando** confirma la solicitud, **entonces** el sistema guarda la
  representación como versión de referencia para cotización y la identifica
  como `no es plano técnico`.

**RF-17: Validar calidad y solicitar corrección**  
El sistema debe permitir al cliente registrar una inconformidad sobre una etapa
o proyecto terminado, adjuntar evidencia y solicitar una corrección al
proveedor. El proveedor debe poder responder con una propuesta de corrección,
que el cliente valida al concluirse.

- **RF-17-AC-1:** **Dado que** una etapa está `validada` o un proyecto está
  `concluido`, **cuando** el cliente registra una inconformidad con descripción
  y evidencia opcional, **entonces** el sistema crea una solicitud de
  corrección con estado `pendiente de respuesta` y notifica al proveedor.
- **RF-17-AC-2:** **Dado que** existe una solicitud de corrección, **cuando**
  el proveedor registra su propuesta de corrección y el cliente la valida,
  **entonces** el sistema conserva ambas decisiones y cambia la solicitud a
  `corrección validada`.

**RF-18: Analizar justificaciones de incremento con IA**  
El sistema debe permitir que la IA analice la justificación y evidencias de un
cambio de costo frente a la solicitud, cotización y avances registrados. El
análisis es informativo; el cliente conserva la decisión de aprobar o rechazar
el cambio.

- **RF-18-AC-1:** **Dado que** el proveedor registra un cambio con motivo,
  importe, elementos afectados y evidencia opcional, **cuando** el cliente
  solicita el análisis, **entonces** la IA muestra un resumen de consistencias,
  datos faltantes y riesgos identificados frente al proyecto registrado.
- **RF-18-AC-2:** **Dado que** la IA emite un análisis de una justificación,
  **cuando** el cliente consulta el cambio, **entonces** el sistema muestra
  que el análisis no aprueba ni rechaza el cambio y mantiene disponibles ambas
  acciones únicamente para el cliente.

### 3.3 Requerimientos de rendimiento y atributos del sistema

| ID | Descripción | Categoría |
|---|---|---|
| RNF-01 | Las consultas de búsqueda, filtrado y perfiles deben responder en un máximo de 3 segundos en el percentil 95 con hasta 100 usuarios concurrentes. | Rendimiento |
| RNF-02 | La interfaz debe adaptarse a pantallas de al menos 360 px de ancho y permitir crear solicitudes, revisar recomendaciones y aprobar cambios desde un navegador móvil. | Usabilidad |
| RNF-03 | El sistema debe requerir autenticación para consultar, crear o modificar solicitudes, citas, cotizaciones, avances y evaluaciones. | Seguridad |
| RNF-04 | Los datos de contacto, dirección exacta, fotografías del domicilio y comprobantes deben transmitirse mediante HTTPS y almacenarse con control de acceso por rol. | Seguridad |
| RNF-05 | El sistema debe conservar una bitácora con fecha, usuario y decisión para aprobaciones y rechazos de cambios de presupuesto, materiales, alcance y fechas. | Trazabilidad |
| RNF-06 | El sistema debe disponer de al menos 99 % de disponibilidad mensual durante el piloto, excluyendo mantenimientos programados anunciados con 24 horas de anticipación. | Disponibilidad |
| RNF-07 | Las acciones de crear solicitud, confirmar cita, enviar cotización, registrar avance y aprobar o rechazar un cambio deben confirmar su resultado al usuario en máximo 3 segundos en el percentil 95, con hasta 100 usuarios concurrentes, excluyendo la carga de archivos. | Rendimiento |
| RNF-08 | En un viewport de 360 × 640 px, sin desplazamiento horizontal, la interfaz debe permitir completar los flujos indicados en RNF-02 y mostrar mensajes de validación asociados al campo correspondiente. | Usabilidad |
| RNF-09 | El control de acceso debe verificar en cada operación que el usuario autenticado sea propietario del recurso o tenga el rol autorizado; los intentos denegados no deben revelar datos del recurso. | Seguridad |
| RNF-10 | La disponibilidad mensual se calculará como `(minutos del mes − minutos de indisponibilidad no planificada) / minutos del mes × 100`; la medición se publicará al cierre de cada mes del piloto. | Disponibilidad |
| RNF-11 | Las imágenes de referencia y representaciones visuales deben almacenarse con control de acceso por solicitud; solo el cliente, los proveedores autorizados para cotizar y los administradores autorizados pueden consultarlas. | Seguridad |

**Criterios de aceptación de RNF**

- **RNF-01-AC-1:** En una prueba de carga de 100 usuarios concurrentes con el
  conjunto de datos del piloto, el percentil 95 de búsqueda, filtrado y perfil
  es menor o igual a 3 segundos.
- **RNF-02-AC-1:** En un navegador móvil con viewport de 360 × 640 px, un
  usuario completa creación de solicitud, revisión de recomendaciones y
  aprobación de cambio sin desplazamiento horizontal.
- **RNF-03/RNF-09-AC-1:** Una petición no autenticada o de un usuario sin
  propiedad o rol autorizado recibe una respuesta de acceso denegado y no
  contiene dirección, teléfono, archivos ni datos del proyecto.
- **RNF-04-AC-1:** Una inspección de la transferencia de datos sensibles usa
  HTTPS; una prueba con un usuario de rol distinto no permite descargar ni ver
  los recursos protegidos.
- **RNF-06/RNF-10-AC-1:** El reporte mensual del piloto contiene el cálculo de
  disponibilidad, los intervalos de indisponibilidad y la evidencia de aviso
  con 24 horas de los mantenimientos excluidos.
- **RNF-11-AC-1:** Una prueba de acceso con un usuario no vinculado a la
  solicitud no permite visualizar ni descargar sus imágenes de referencia o
  representaciones visuales.

### 3.4 Requerimientos lógicos de datos

- LD-01: Un usuario autenticado debe tener un rol de cliente, proveedor,
  administrador de verificación o una combinación autorizada de esos roles.
- LD-02: Una solicitud debe conservar su cliente, oficio, zona aproximada,
  versión confirmada, estado, fecha deseada y presupuesto opcional.
- LD-03: Una cita debe relacionar una solicitud con un proveedor, horario,
  estado y las aceptaciones independientes de cliente y proveedor.
- LD-04: Una cotización debe relacionarse con un proyecto y contener conceptos
  de mano de obra, materiales y costos adicionales, cada uno con importe y
  estado de aprobación. El proyecto debe conservar el presupuesto inicial
  aprobado y una secuencia inmutable de versiones con total anterior, total
  actualizado, diferencia en MXN respecto al inicial, fecha y decisión.
- LD-05: Un avance debe relacionarse con una etapa, proveedor y proyecto, e
  incluir porcentaje, tareas, imprevistos y referencias a evidencias. El
  porcentaje acumulado del proyecto se obtiene del promedio simple del último
  porcentaje de cada etapa acordada, usando 0 % cuando una etapa no tiene
  avances.
- LD-06: Una evaluación debe relacionar un proyecto concluido, cliente y
  proveedor, y un reporte debe conservar el elemento reportado, causa, fecha y
  usuario reportante.
- LD-07: Una imagen de referencia o representación visual debe relacionarse
  con una solicitud y una versión, e incluir su creador, fecha, estado de
  aprobación y lista de usuarios autorizados a consultarla.
- LD-08: Una solicitud de corrección debe relacionarse con una etapa o
  proyecto, cliente y proveedor, e incluir inconformidad, evidencias, propuesta
  de corrección, estados y decisiones de ambas partes.

### 3.5 Requerimientos de dominio

| ID | Descripción |
|---|---|
| RD-01 | Un proveedor puede ser trabajador independiente o pertenecer a una organización de contratistas registrada; el perfil debe identificar su modalidad. |
| RD-02 | Antes de la aceptación de una cita, el proveedor solo puede ver la zona aproximada; la dirección exacta, teléfono y fotografías del domicilio se comparten después de la aceptación de ambas partes. |
| RD-03 | Todo costo adicional, cambio de material, cambio de alcance o ajuste de fecha requiere aprobación explícita del cliente antes de incorporarse al proyecto. |
| RD-04 | La IA puede recopilar información, recomendar, resumir y alertar riesgos, pero no puede aceptar citas, cotizaciones, pagos ni cambios de presupuesto en nombre de los usuarios. |
| RD-05 | Solo un cliente asociado a un proyecto concluido puede publicar una evaluación del proveedor. |
| RD-06 | En la primera versión, la aplicación puede registrar acuerdos y comprobantes, pero no procesa pagos. |
| RD-07 | La dirección exacta, teléfono y fotografías del domicilio solo se revelan al proveedor asociado después de que ambos aceptan una cita y el cliente autoriza expresamente compartirlos. |
| RD-08 | Las recomendaciones solo incluyen perfiles con estado `verificado`; dicho estado acredita la revisión de evidencia y no es una garantía de ejecución, precio ni resultado. |
| RD-09 | El cliente puede solicitar la eliminación de datos de proyectos concluidos; las trazas de decisiones se conservan anonimizadas para cumplir RNF-05. |
| RD-10 | Una representación visual generada por IA es una referencia de alcance y comunicación; no sustituye planos, permisos, cálculos estructurales ni la responsabilidad profesional del proveedor. |
| RD-11 | La IA puede señalar inconsistencias, faltantes o riesgos en una justificación de costo, pero no puede clasificarla como válida de forma definitiva ni aprobar o rechazar el cambio. |
