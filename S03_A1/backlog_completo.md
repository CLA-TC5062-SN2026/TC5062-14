# Backlog completo — UnCalificado (Parte 1)

**Fuente funcional:** `SRS_equipo.md` (RF-01 a RF-55). `matriz_correspondencia.md` se usó solo para la trazabilidad de los IDs.

**Notas sobre la estimación:**
- Los Story Points (SP) son una estimación académica relativa en escala Fibonacci (1, 2, 3, 5, 8, 13). No equivalen a horas.
- Cada criterio de aceptación indica de qué criterio del SRS se deriva (`Deriva de: RF-XX-AC-Y`).
- Ninguna historia incluye funcionalidades posteriores (FP) ni resuelve pendientes (PV).

---

## 1. Épicas aprobadas

| ID | Nombre | Objetivo | Actores principales | RF incluidos |
|---|---|---|---|---|
| EP-01 | Cuentas, confianza y privacidad | Que cada actor tenga una cuenta con consentimiento, que el cliente confíe en a quién contrata y que los datos personales estén protegidos | Cliente, Trabajador independiente, Organización de contratistas, Administrador | RF-01 a RF-12, RF-24, RF-52, RF-53, RF-54 |
| EP-02 | Solicitud guiada por el agente | Que el cliente describa su necesidad de forma sencilla y obtenga una solicitud confirmada | Cliente, Administrador (soporte) | RF-13 a RF-23, RF-25 |
| EP-03 | Búsqueda, selección y agendamiento | Que el cliente encuentre proveedores compatibles, elija uno y acuerde citas confirmadas por ambas partes | Cliente, Trabajador independiente, Organización de contratistas | RF-26 a RF-37 |
| EP-04 | Propuesta y control de costos | Que el trabajo y su costo se acuerden por escrito y que ningún cambio se aplique sin decisión explícita | Cliente, Trabajador independiente, Organización de contratistas | RF-38 a RF-44, RF-55 |
| EP-05 | Seguimiento, cierre y evaluación | Que el cliente siga el estado del trabajo, lo cierre de común acuerdo y que ambas partes se evalúen | Cliente, Trabajador independiente, Organización de contratistas, Administrador | RF-45 a RF-51 |

---

## 2. Historias de usuario

### HU-01 — Registro con cuenta y consentimiento

**Épica:** EP-01  
**Historia:** **Como** cliente, trabajador u organización de contratistas, **quiero** registrarme con una cuenta aceptando el aviso de privacidad, **para** usar la plataforma en web y en la app con mis datos tratados según lo que acepté.

**RF cubiertos:** RF-01, RF-02

**Prioridad:** Alta

**Story Points:** 3

**Justificación de estimación:** Es un flujo estándar de registro e inicio de sesión. Agrega el consentimiento versionado y el bloqueo del rol de administrador en el registro público.

**Dependencias:** Ninguna.

**Criterios de aceptación:**

#### HU-01-AC-1
**Dado** una persona sin cuenta que acepta el aviso de privacidad y declara ser mayor de edad,  
**cuando** completa el registro con los datos requeridos,  
**entonces** se crea su cuenta, se registran la fecha, la hora y la versión del aviso aceptado, y puede iniciar sesión en la web y en la app.  
*Deriva de: RF-01-AC-1, RF-02-AC-1.*

#### HU-01-AC-2
**Dado** una persona que completa el registro,  
**cuando** no acepta el aviso de privacidad,  
**entonces** no se crea la cuenta y se le informa que no puede prestarse el servicio sin consentimiento.  
*Deriva de: RF-02-AC-2.*

#### HU-01-AC-3
**Dado** una persona que intenta iniciar sesión con datos incorrectos, o registrarse con el rol de administrador desde el registro público,  
**cuando** el sistema procesa la solicitud,  
**entonces** no permite el acceso ni el registro.  
*Deriva de: RF-01-AC-2, RF-01-AC-3.*

#### HU-01-AC-4
**Dado** un usuario que aceptó una versión anterior del aviso de privacidad,  
**cuando** se publica una versión nueva e inicia sesión,  
**entonces** debe aceptar la nueva versión antes de continuar.  
*Deriva de: RF-02-AC-3.*

---

### HU-02 — Perfil de proveedor visible para los clientes

**Épica:** EP-01  
**Historia:** **Como** trabajador independiente u organización de contratistas, **quiero** publicar mi perfil con oficios, experiencia, cobertura, portafolio y disponibilidad, **para** que los clientes me encuentren y conozcan mi trabajo antes de elegirme.

**RF cubiertos:** RF-03, RF-04, RF-05, RF-06, RF-07

**Prioridad:** Alta

**Story Points:** 8

**Justificación de estimación:** Abarca dos tipos de proveedor, validaciones de datos mínimos y de catálogo, calendario y disponibilidad general, y la vista del perfil para el cliente con calificaciones por dimensión.

**Dependencias:** HU-01.

**Criterios de aceptación:**

#### HU-02-AC-1
**Dado** un trabajador con cuenta creada,  
**cuando** completa nombre, foto, oficio del catálogo, años de experiencia y zona de cobertura,  
**entonces** su perfil queda disponible en las búsquedas; si falta algún dato mínimo o el oficio no pertenece al catálogo, el perfil no aparece.  
*Deriva de: RF-03-AC-1, RF-03-AC-2, RF-03-AC-4.*

#### HU-02-AC-2
**Dado** una organización de contratistas con cuenta creada,  
**cuando** completa su perfil básico,  
**entonces** su perfil queda disponible en las búsquedas; si está incompleto, no aparece.  
*Deriva de: RF-05-AC-1, RF-05-AC-2.*

#### HU-02-AC-3
**Dado** un perfil de trabajador válido,  
**cuando** el trabajador carga fotos de trabajos anteriores o no carga ninguna,  
**entonces** las fotos se muestran en el portafolio y, sin portafolio, el perfil sigue siendo válido y visible.  
*Deriva de: RF-04-AC-1, RF-04-AC-2.*

#### HU-02-AC-4
**Dado** un trabajador con calendario u organización con disponibilidad general,  
**cuando** marca una fecha como no disponible o cambia su disponibilidad general,  
**entonces** esa disponibilidad se refleja en las búsquedas y en el agendamiento, sin gestionar la agenda de empleados individuales.  
*Deriva de: RF-06-AC-1, RF-06-AC-3.*

#### HU-02-AC-5
**Dado** un proveedor con evaluaciones publicadas,  
**cuando** un cliente consulta su perfil,  
**entonces** ve modalidad, especialidad, experiencia, cobertura, disponibilidad, estado de verificación, fecha de actualización, calificación promedio, número de evaluaciones y el promedio de cada dimensión.  
*Deriva de: RF-07-AC-1, RF-07-AC-3, RF-07-AC-5.*

---

### HU-03 — Verificación de proveedores

**Épica:** EP-01  
**Historia:** **Como** administrador, **quiero** verificar la identidad, la experiencia y las organizaciones, y retirar las verificaciones que dejan de ser válidas, **para** que los clientes distingan con claridad qué información de un proveedor está verificada.

**RF cubiertos:** RF-08, RF-09, RF-10, RF-11, RF-12

**Prioridad:** Alta

**Story Points:** 5

**Justificación de estimación:** Son tres marcas independientes con flujos de aprobación y rechazo similares, más el retiro automático por vencimiento y el retiro manual. No cambia la visibilidad del perfil.

**Dependencias:** HU-02.

**Criterios de aceptación:**

#### HU-03-AC-1
**Dado** que un trabajador subió una identificación oficial o evidencia de experiencia, o que una organización presentó sus documentos,  
**cuando** el administrador los aprueba,  
**entonces** el perfil muestra la marca correspondiente ("identidad verificada", "experiencia verificada" u "organización verificada") de forma independiente, y se registran la fecha y el administrador responsable.  
*Deriva de: RF-09-AC-1, RF-10-AC-1, RF-11-AC-1.*

#### HU-03-AC-2
**Dado** una evidencia de verificación presentada,  
**cuando** el administrador la rechaza,  
**entonces** el perfil no muestra la marca, el proveedor recibe el motivo y el perfil sigue visible.  
*Deriva de: RF-09-AC-2, RF-10-AC-2, RF-11-AC-2.*

#### HU-03-AC-3
**Dado** un documento de verificación vencido, o una información que el administrador confirmó como falsa,  
**cuando** se detecta el vencimiento o se registra la confirmación,  
**entonces** se retira la marca correspondiente, se avisa al proveedor y el perfil sigue visible; el sistema no determina la falsedad por sí solo.  
*Deriva de: RF-12-AC-1, RF-12-AC-2.*

#### HU-03-AC-4
**Dado** un perfil con datos declarados y datos verificados, o sin ninguna verificación,  
**cuando** un cliente lo consulta,  
**entonces** puede distinguir visualmente qué está verificado y qué es solo declarado.  
*Deriva de: RF-08-AC-1, RF-08-AC-2, RF-08-AC-3.*

---

### HU-04 — Control de mis datos y de mi domicilio

**Épica:** EP-01  
**Historia:** **Como** usuario de la plataforma (cliente o proveedor), **quiero** que mi domicilio y mis datos personales solo se compartan en los momentos acordados y con mi autorización, y poder ejercer mis derechos ARCO, **para** proteger mi privacidad.

**RF cubiertos:** RF-24, RF-52, RF-53, RF-54

**Prioridad:** Alta

**Story Points:** 8

**Justificación de estimación:** Aplica reglas de acceso que dependen del estado de citas y propuestas, una ventana de visibilidad de 7 días y las operaciones ARCO (exportar, rectificar y anonimizar). Implica privacidad y seguridad.

**Dependencias:** HU-01. Los disparadores de revelación del domicilio dependen de HU-10 (cita de visita) y de HU-11 (aceptación de la propuesta).

**Criterios de aceptación:**

#### HU-04-AC-1
**Dado** que se va a ejecutar una acción sensible (contactar a un proveedor, confirmar o cancelar una cita, compartir el domicilio o el presupuesto, aceptar un cambio de costo),  
**cuando** se presenta al cliente,  
**entonces** no se ejecuta hasta que el cliente la autoriza, y si la rechaza no se realiza y se le informa.  
*Deriva de: RF-24-AC-1, RF-24-AC-2.*

#### HU-04-AC-2
**Dado** un trabajador asociado a un proyecto,  
**cuando** el cliente todavía no confirma la cita de visita ni acepta la propuesta,  
**entonces** el trabajador solo ve la colonia y el municipio. Cuando el cliente confirma la visita o acepta la propuesta, se le pide su domicilio exacto y este se revela solo a ese trabajador.  
*Deriva de: RF-52-AC-1, RF-52-AC-2, RF-52-AC-3, RF-24-AC-3.*

#### HU-04-AC-3
**Dado** un proyecto "concluido" cuyo domicilio fue revelado,  
**cuando** pasan 7 días desde la conclusión o lo intenta consultar otro trabajador,  
**entonces** el domicilio deja de ser visible.  
*Deriva de: RF-52-AC-4, RF-52-AC-5.*

#### HU-04-AC-4
**Dado** un trabajador,  
**cuando** un cliente consulta su perfil,  
**entonces** el domicilio del trabajador solo se muestra si tiene identidad verificada y el cliente tiene una cita confirmada con él.  
*Deriva de: RF-53-AC-1, RF-53-AC-2, RF-53-AC-3.*

#### HU-04-AC-5
**Dado** una solicitud ARCO de un usuario,  
**cuando** el administrador la atiende,  
**entonces** puede exportar sus datos en JSON y PDF, rectificarlos conservando el valor anterior y anonimizarlos si no tiene proyectos activos. La bitácora conserva su número de registros, montos, fechas y estados.  
*Deriva de: RF-54-AC-1, RF-54-AC-2, RF-54-AC-3, RF-54-AC-4.*

---

### HU-05 — Describir mi necesidad conversando con el agente

**Épica:** EP-02  
**Historia:** **Como** cliente, **quiero** describir mi trabajo en una conversación sencilla, una pregunta a la vez, y poder pedir ayuda a una persona si no me entienden, **para** expresar mi necesidad sin llenar formularios complicados.

**RF cubiertos:** RF-13, RF-14, RF-15, RF-19, RF-22, RF-25

**Prioridad:** Alta

**Story Points:** 8

**Justificación de estimación:** Combina la conversación guiada, la clasificación del oficio con una métrica de precisión y el escalamiento tras 2 intentos. Las reglas de diálogo son variadas y dependen de un servicio externo de IA.

**Dependencias:** HU-01.

**Criterios de aceptación:**

#### HU-05-AC-1
**Dado** un cliente con sesión iniciada que inicia una conversación,  
**cuando** el agente responde,  
**entonces** se identifica como asistente automático y hace una sola pregunta a la vez durante toda la conversación.  
*Deriva de: RF-13-AC-1, RF-14-AC-1, RF-14-AC-2.*

#### HU-05-AC-2
**Dado** que el cliente da una respuesta ambigua o declara desconocer un dato,  
**cuando** el agente la procesa,  
**entonces** repregunta o pide una foto en lugar de asumir, y registra el dato como "desconocido" sin bloquear la solicitud.  
*Deriva de: RF-19-AC-1, RF-14-AC-5.*

#### HU-05-AC-3
**Dado** un conjunto de 50 descripciones de prueba etiquetadas,  
**cuando** el sistema clasifica el oficio de cada una,  
**entonces** al menos 45 reciben exactamente la categoría del catálogo etiquetada.  
*Deriva de: RF-15-AC-1.*

#### HU-05-AC-4
**Dado** que el agente no logra entender al cliente tras 2 intentos o no puede asignar el oficio tras 2 aclaraciones,  
**cuando** ocurre el segundo intento fallido,  
**entonces** se ofrece al cliente solicitar soporte, y el caso se registra con el resumen de la conversación para el administrador.  
*Deriva de: RF-22-AC-1, RF-22-AC-2, RF-15-AC-3.*

#### HU-05-AC-5
**Dado** que el cliente envió un mensaje o inició una búsqueda,  
**cuando** pasan 2 segundos sin respuesta,  
**entonces** aparece un indicador de "procesando".  
*Deriva de: RF-25-AC-1.*

---

### HU-06 — Completar y confirmar mi solicitud

**Épica:** EP-02  
**Historia:** **Como** cliente, **quiero** completar mi solicitud con los datos mínimos, fotos y videos, y confirmar un resumen editable, **para** que la búsqueda de proveedores se base exactamente en lo que necesito.

**RF cubiertos:** RF-16, RF-17, RF-18, RF-20, RF-21

**Prioridad:** Alta

**Story Points:** 8

**Justificación de estimación:** Incluye dos niveles de datos mínimos (borrador y búsqueda), carga de archivos con límites y proyectos múltiples, el resumen confirmable con cambio de estado y la captura manual alternativa.

**Dependencias:** HU-05 (la captura manual de RF-21 funciona sin el agente).

**Criterios de aceptación:**

#### HU-06-AC-1
**Dado** un cliente que proporciona el resultado esperado, el oficio y la zona aproximada,  
**cuando** guarda la solicitud,  
**entonces** se crea en estado "borrador" con un identificador; si falta alguno de esos datos, no se crea y se indican los campos faltantes.  
*Deriva de: RF-16-AC-1, RF-16-AC-2.*

#### HU-06-AC-2
**Dado** una solicitud en curso,  
**cuando** el cliente intenta pasar a la búsqueda,  
**entonces** se exigen el tipo de trabajo, la zona, la fecha deseada y la descripción básica, sin pedir calle ni número ni datos opcionales.  
*Deriva de: RF-16-AC-3, RF-16-AC-4, RF-16-AC-5.*

#### HU-06-AC-3
**Dado** una solicitud en "borrador",  
**cuando** el cliente adjunta fotos o videos,  
**entonces** se asocian a la solicitud; una imagen JPG o PNG de más de 5 MB, una imagen número 11 o una nota de voz no se aceptan, y con dos proyectos activos el agente pregunta a cuál corresponde el archivo.  
*Deriva de: RF-17-AC-1, RF-17-AC-3, RF-18-AC-2, RF-18-AC-3, RF-18-AC-4.*

#### HU-06-AC-4
**Dado** un resumen editable presentado al cliente,  
**cuando** el cliente lo corrige o lo confirma,  
**entonces** con una corrección se presenta un resumen nuevo y la solicitud sigue en "borrador"; al confirmarlo, la solicitud pasa a "confirmada" y solo esa versión se usa para recomendar.  
*Deriva de: RF-20-AC-2, RF-20-AC-3, RF-20-AC-4.*

#### HU-06-AC-5
**Dado** que el servicio de IA no está disponible,  
**cuando** el cliente crea una solicitud,  
**entonces** puede capturarla manualmente con los mismos datos mínimos del borrador.  
*Deriva de: RF-21-AC-1, RF-21-AC-3.*

---

### HU-07 — Visualizar el alcance con imágenes de referencia

**Épica:** EP-02  
**Historia:** **Como** cliente, **quiero** obtener una representación visual del trabajo a partir de imágenes de referencia, **para** comunicar mejor el resultado que espero.

**RF cubiertos:** RF-23

**Prioridad:** Baja

**Story Points:** 5

**Justificación de estimación:** La estimación refleja la complejidad relativa de generar contenido visual mediante IA, gestionar el resultado y presentarlo de forma comprensible al usuario. No se presupone una arquitectura ni un proveedor tecnológico específico.

**Dependencias:** HU-06.

**Criterios de aceptación:**

#### HU-07-AC-1
**Dado** que el cliente adjunta al menos una imagen de referencia y describe el resultado esperado,  
**cuando** solicita una representación visual,  
**entonces** se genera una propuesta asociada a la solicitud y el cliente puede editar su descripción.  
*Deriva de: RF-23-AC-1.*

#### HU-07-AC-2
**Dado** que el cliente aprueba una representación visual,  
**cuando** confirma la solicitud,  
**entonces** la representación se guarda como referencia para la propuesta, identificada como "no es plano técnico".  
*Deriva de: RF-23-AC-2.*

---

### HU-08 — Encontrar y comparar proveedores

**Épica:** EP-03  
**Historia:** **Como** cliente, **quiero** recibir de 3 a 4 proveedores compatibles con mi solicitud, explicados, y poder filtrarlos y ordenarlos, **para** comparar opciones y decidir con información.

**RF cubiertos:** RF-26, RF-27, RF-28, RF-29, RF-30

**Prioridad:** Alta

**Story Points:** 8

**Justificación de estimación:** Combina varios criterios de búsqueda, recomendación explicada, cinco criterios de filtro y orden con reglas de desempate y el manejo de "sin resultados".

**Dependencias:** HU-02, HU-06.

**Criterios de aceptación:**

#### HU-08-AC-1
**Dado** una solicitud confirmada,  
**cuando** el cliente solicita resultados,  
**entonces** solo aparecen proveedores cuyo oficio, cobertura y disponibilidad coinciden, incluidos los no verificados con su estado visible y sin ningún criterio de pago.  
*Deriva de: RF-26-AC-1, RF-26-AC-2, RF-26-AC-3, RF-26-AC-4.*

#### HU-08-AC-2
**Dado** una búsqueda con 4 o más candidatos, o con menos de 3,  
**cuando** el agente arma la recomendación,  
**entonces** muestra entre 3 y 4 opciones explicadas, o las que existan con aviso de que hay menos opciones, y el cliente elige.  
*Deriva de: RF-30-AC-1, RF-30-AC-2, RF-30-AC-3.*

#### HU-08-AC-3
**Dado** resultados mostrados,  
**cuando** el cliente filtra u ordena por verificación, experiencia similar, precio, calificación, disponibilidad, cercanía o garantía,  
**entonces** la lista se ajusta y muestra el criterio aplicado; los empates se ordenan por calificación.  
*Deriva de: RF-28-AC-1, RF-29-AC-1, RF-29-AC-2, RF-29-AC-5.*

#### HU-08-AC-4
**Dado** que ningún proveedor coincide con el oficio, la zona y la fecha,  
**cuando** el cliente solicita resultados,  
**entonces** se muestra el mensaje "No hay proveedores disponibles para los criterios seleccionados".  
*Deriva de: RF-27-AC-1.*

---

### HU-09 — Elegir un proveedor y obtener su aceptación

**Épica:** EP-03  
**Historia:** **Como** cliente, **quiero** seleccionar un proveedor y saber pronto si acepta mi solicitud, **para** avanzar con alguien comprometido o pasar a otra opción.

**RF cubiertos:** RF-31, RF-32

**Prioridad:** Alta

**Story Points:** 3

**Justificación de estimación:** Es un flujo corto con un plazo de 4 h dentro del horario del proveedor y el manejo de rechazo o expiración.

**Dependencias:** HU-08.

**Criterios de aceptación:**

#### HU-09-AC-1
**Dado** que el cliente selecciona un proveedor compatible,  
**cuando** se envía la solicitud,  
**entonces** el proveedor queda asociado a ella y recibe la ficha con colonia y municipio, sin calle ni número.  
*Deriva de: RF-31-AC-1, RF-31-AC-3.*

#### HU-09-AC-2
**Dado** que el proveedor recibió la solicitud,  
**cuando** la rechaza o no responde en 4 h dentro de su horario de atención,  
**entonces** el cliente recibe un aviso y las opciones restantes; si no quedan opciones, se ejecuta una nueva búsqueda que excluye a esos proveedores.  
*Deriva de: RF-32-AC-1, RF-32-AC-2, RF-32-AC-3.*

#### HU-09-AC-3
**Dado** que el proveedor recibió la solicitud,  
**cuando** la acepta,  
**entonces** queda asociado al proyecto y puede proponer la fecha de la cita.  
*Deriva de: RF-32-AC-4.*

---

### HU-10 — Agendar citas confirmadas por ambas partes

**Épica:** EP-03  
**Historia:** **Como** proveedor o cliente, **quiero** acordar la fecha de una cita con doble confirmación, recibir avisos y poder cancelarla o reprogramarla, **para** que ninguna visita o servicio se agende sin el visto bueno de ambos.

**RF cubiertos:** RF-33, RF-34, RF-35, RF-36, RF-37

**Prioridad:** Alta

**Story Points:** 8

**Justificación de estimación:** Maneja estados de cita, expiración a 24 h, bloqueo de franjas con concurrencia, notificaciones y recordatorios, cancelación y reprogramación, y la regla de propuesta aceptada para las citas de ejecución.

**Dependencias:** HU-09. Dependencia parcial de HU-11: únicamente para confirmar una cita de ejecución. Las citas de visita pueden ocurrir antes de la propuesta.

**Criterios de aceptación:**

#### HU-10-AC-1
**Dado** una cita que el prestador propuso y confirmó, con su costo o "sin costo" visible,  
**cuando** el cliente también la confirma,  
**entonces** la cita queda "confirmada", la franja se bloquea y la primera cita confirmada pasa el proyecto a "programado".  
*Deriva de: RF-33-AC-1, RF-34-AC-2, RF-35-AC-1, RF-34-AC-4.*

#### HU-10-AC-2
**Dado** una propuesta de cita pendiente, o una cita de ejecución sin propuesta aceptada,  
**cuando** pasan 24 h sin respuesta, o alguien intenta confirmar la ejecución,  
**entonces** la propuesta expira sin comprometer otro horario, o la confirmación se rechaza por falta de propuesta aceptada.  
*Deriva de: RF-34-AC-3, RF-34-AC-6.*

#### HU-10-AC-3
**Dado** dos confirmaciones que compiten por franjas traslapadas del mismo prestador,  
**cuando** se registran casi al mismo tiempo,  
**entonces** solo queda confirmada la registrada primero y el otro cliente recibe un aviso para elegir otra fecha.  
*Deriva de: RF-35-AC-3.*

#### HU-10-AC-4
**Dado** una cita confirmada,  
**cuando** se confirma y cuando faltan 24 h,  
**entonces** ambas partes reciben la notificación con fecha, hora y lugar, y después el recordatorio.  
*Deriva de: RF-36-AC-1, RF-36-AC-3.*

#### HU-10-AC-5
**Dado** una cita pendiente o confirmada,  
**cuando** una parte la cancela con motivo,  
**entonces** la cita pasa a "cancelada", la franja se libera, la otra parte recibe la notificación, queda registrado quién y cuándo, y el prestador puede proponer una nueva fecha sin que el proyecto se cancele.  
*Deriva de: RF-37-AC-1, RF-37-AC-2, RF-37-AC-3, RF-35-AC-2.*

---

### HU-11 — Recibir y negociar una propuesta escrita

**Épica:** EP-04  
**Historia:** **Como** cliente, **quiero** recibir una propuesta escrita con desglose y poder aceptarla, pedir cambios o rechazarla, **para** acordar con claridad el trabajo y su costo antes de que empiece.

**RF cubiertos:** RF-38, RF-39

**Prioridad:** Alta

**Story Points:** 5

**Justificación de estimación:** Incluye validación del desglose, negociación con versiones, aceptación por ambas partes y expiración a 72 h desde la primera propuesta.

**Dependencias:** HU-09.

**Criterios de aceptación:**

#### HU-11-AC-1
**Dado** un proveedor asociado a una solicitud, con o sin visita previa,  
**cuando** envía la propuesta,  
**entonces** el cliente la recibe por escrito, con el trabajo, las fechas y los conceptos de mano de obra, materiales y costos adicionales por separado; si a un material le falta algún dato o los subtotales no suman el total, el envío se rechaza.  
*Deriva de: RF-38-AC-1, RF-38-AC-2, RF-38-AC-3.*

#### HU-11-AC-2
**Dado** una propuesta enviada,  
**cuando** el cliente la acepta, pide un ajuste o la rechaza,  
**entonces** al aceptarla queda aceptada por ambas partes con fecha, hora y autor; con un ajuste, la aceptación final exige la misma versión revisada para ambas partes; al rechazarla, el acuerdo con ese proveedor se cierra.  
*Deriva de: RF-39-AC-1, RF-39-AC-2, RF-39-AC-3.*

#### HU-11-AC-3
**Dado** una primera propuesta enviada,  
**cuando** pasan 72 h sin una versión aceptada,  
**entonces** el acuerdo se cierra sin efecto y el cliente puede volver a las recomendaciones; mientras no haya propuesta aceptada, el proyecto no puede pasar a "en proceso".  
*Deriva de: RF-39-AC-4, RF-39-AC-5.*

---

### HU-12 — Decidir sobre los cambios de costo, material, alcance o fecha

**Épica:** EP-04  
**Historia:** **Como** cliente, **quiero** que cualquier cambio de costo, material, alcance o fecha requiera mi decisión, y poder proponer cambios yo también, **para** que no se aplique nada que yo no haya autorizado.

**RF cubiertos:** RF-40, RF-41, RF-55

**Prioridad:** Alta

**Story Points:** 8

**Justificación de estimación:** Es la historia con más estados: plazos de 24 h, pausa de la parte afectada, contrapropuesta con nuevo plazo, rechazo automático y solicitudes iniciadas por cualquiera de las dos partes.

**Dependencias:** HU-11.

**Criterios de aceptación:**

#### HU-12-AC-1
**Dado** un acuerdo aceptado,  
**cuando** el proveedor o el cliente registra una solicitud de cambio,  
**entonces** se exigen tipo, motivo, monto o ahorro, presupuesto actualizado, elementos afectados y fecha propuesta; la contraparte recibe una alerta y el cambio no se aplica hasta su decisión.  
*Deriva de: RF-40-AC-1, RF-40-AC-2, RF-40-AC-3, RF-55-AC-1, RF-55-AC-2.*

#### HU-12-AC-2
**Dado** un cambio del proveedor pendiente,  
**cuando** el cliente lo aprueba, lo rechaza o no responde en 24 h,  
**entonces** al aprobarlo se actualiza el presupuesto y queda en la bitácora; al rechazarlo o dejar vencer el plazo, no se aplica. Mientras está pendiente, la parte afectada queda en pausa.  
*Deriva de: RF-41-AC-1, RF-41-AC-2, RF-41-AC-4, RF-41-AC-5.*

#### HU-12-AC-3
**Dado** un cambio pendiente,  
**cuando** el cliente contrapropone,  
**entonces** se abre un nuevo plazo de 24 h; el proveedor acepta (se aplica con esos términos) o rechaza (no se aplica), y si no responde, la contrapropuesta se rechaza automáticamente y el cliente puede iniciar su propia solicitud.  
*Deriva de: RF-41-AC-6, RF-41-AC-7, RF-41-AC-8.*

#### HU-12-AC-4
**Dado** un cambio rechazado que el proveedor considera necesario,  
**cuando** no hay acuerdo,  
**entonces** la parte afectada no se reanuda automáticamente y queda pendiente de un nuevo acuerdo entre las partes, sin intervención del administrador.  
*Deriva de: RF-41-AC-3.*

#### HU-12-AC-5
**Dado** una solicitud de cambio iniciada por el cliente,  
**cuando** el proveedor la acepta, la rechaza o no responde en 24 h,  
**entonces** el presupuesto se actualiza solo si la acepta; en los otros casos no cambia.  
*Deriva de: RF-55-AC-3, RF-55-AC-4, RF-55-AC-5.*

---

### HU-13 — Consultar costos y analizar justificaciones

**Épica:** EP-04  
**Historia:** **Como** cliente, **quiero** consultar el presupuesto vigente, su historial de versiones y un análisis informativo de las justificaciones de cambio, **para** entender cómo evoluciona el costo y decidir con información.

**RF cubiertos:** RF-42, RF-43, RF-44

**Prioridad:** Media

**Story Points:** 5

**Justificación de estimación:** Las vistas de consulta son simples, pero el análisis depende de la IA y debe dejar claro que no decide.

**Dependencias:** HU-11, HU-12.

**Criterios de aceptación:**

#### HU-13-AC-1
**Dado** un trabajo con propuesta aceptada,  
**cuando** el cliente consulta los costos,  
**entonces** ve en una sola vista el presupuesto vigente, los cambios aprobados y los pendientes de aprobar.  
*Deriva de: RF-44-AC-1, RF-44-AC-2.*

#### HU-13-AC-2
**Dado** un presupuesto inicial aprobado,  
**cuando** se aprueba un cambio,  
**entonces** se guarda una versión nueva con fecha, total anterior, total actualizado y diferencia respecto al inicial, y el historial conserva las versiones previas.  
*Deriva de: RF-43-AC-1, RF-43-AC-2.*

#### HU-13-AC-3
**Dado** un cambio registrado,  
**cuando** el cliente solicita el análisis de su justificación,  
**entonces** la IA muestra consistencias, faltantes y riesgos, e indica que no aprueba ni rechaza el cambio; la decisión sigue siendo del cliente.  
*Deriva de: RF-42-AC-1, RF-42-AC-2.*

---

### HU-14 — Seguir y cerrar el trabajo

**Épica:** EP-05  
**Historia:** **Como** cliente, **quiero** ver el estado de mi proyecto, comunicarme con el proveedor sin compartir teléfonos y confirmar el cierre cuando el trabajo termine, **para** tener control del avance hasta la conclusión.

**RF cubiertos:** RF-45, RF-46, RF-47, RF-48

**Prioridad:** Alta

**Story Points:** 8

**Justificación de estimación:** Combina las transiciones de estado con sus restricciones, un canal de mensajes con reglas de habilitación y privacidad, el cierre con confirmación o rechazo y un aviso programado a las 72 h.

**Dependencias:** HU-10, HU-11.

**Criterios de aceptación:**

#### HU-14-AC-1
**Dado** un proyecto "programado" con propuesta aceptada,  
**cuando** el proveedor marca el inicio,  
**entonces** el proyecto pasa a "en proceso" y el cliente ve el estado actualizado.  
*Deriva de: RF-45-AC-1, RF-45-AC-2.*

#### HU-14-AC-2
**Dado** una cita confirmada,  
**cuando** el cliente o el proveedor envía un mensaje por el canal interno,  
**entonces** el mensaje se entrega con fecha, emisor y contenido, sin mostrar teléfonos; sin cita confirmada, el canal no está habilitado.  
*Deriva de: RF-46-AC-1, RF-46-AC-2, RF-46-AC-3.*

#### HU-14-AC-3
**Dado** un proyecto "en proceso",  
**cuando** el proveedor lo marca como terminado y el cliente confirma o rechaza el cierre,  
**entonces** al confirmarlo pasa a "concluido" y se habilita la evaluación; al rechazarlo vuelve a "en proceso". Un proyecto que no está "en proceso" no puede marcarse como terminado.  
*Deriva de: RF-47-AC-1, RF-47-AC-2, RF-47-AC-3, RF-47-AC-4.*

#### HU-14-AC-4
**Dado** un proyecto "terminado" sin respuesta del cliente,  
**cuando** pasan 72 h,  
**entonces** el administrador recibe un aviso informativo y el proyecto permanece "terminado", sin que el administrador pueda cambiar su estado.  
*Deriva de: RF-48-AC-1, RF-48-AC-2.*

---

### HU-15 — Evaluar a la contraparte al concluir

**Épica:** EP-05  
**Historia:** **Como** cliente o proveedor, **quiero** evaluar a la otra parte cuando el trabajo concluye, con publicación simultánea, **para** construir reputación confiable sin temor a represalias.

**RF cubiertos:** RF-49, RF-50, RF-51

**Prioridad:** Media

**Story Points:** 5

**Justificación de estimación:** Hay dos formularios con validaciones (4 dimensiones y calificación única), el cálculo del promedio y las reglas de publicación con plazo de 7 días.

**Dependencias:** HU-14.

**Criterios de aceptación:**

#### HU-15-AC-1
**Dado** un proyecto concluido,  
**cuando** el cliente evalúa al proveedor en las 4 dimensiones con enteros de 1 a 5, con o sin comentario,  
**entonces** la evaluación se acepta; un valor inválido, una segunda evaluación o un proyecto no concluido se rechazan con la causa.  
*Deriva de: RF-49-AC-1, RF-49-AC-2, RF-49-AC-3, RF-49-AC-4.*

#### HU-15-AC-2
**Dado** un proyecto concluido,  
**cuando** el prestador de ese proyecto califica al cliente con un entero de 1 a 5,  
**entonces** la calificación se acepta; si el proyecto no está concluido o el prestador no participó, se rechaza.  
*Deriva de: RF-50-AC-1, RF-50-AC-2, RF-50-AC-3.*

#### HU-15-AC-3
**Dado** que solo una parte calificó,  
**cuando** todavía no pasan 7 días, o la otra parte califica, o vence el plazo,  
**entonces** la calificación no es visible mientras tanto, y se publica cuando ambas calificaron o al vencer el plazo; solo las publicadas cuentan para el promedio.  
*Deriva de: RF-51-AC-2, RF-51-AC-3, RF-51-AC-4.*

---

## 3. Tabla resumen

| HU | Épica | Historia resumida | Prioridad | SP | RF |
|---|---|---|---|---:|---|
| HU-01 | EP-01 | Registrarme con cuenta y aceptar el aviso de privacidad | Alta | 3 | RF-01, RF-02 |
| HU-02 | EP-01 | Publicar mi perfil de proveedor para que los clientes me encuentren | Alta | 8 | RF-03, RF-04, RF-05, RF-06, RF-07 |
| HU-03 | EP-01 | Verificar identidad, experiencia y organizaciones (administrador) | Alta | 5 | RF-08, RF-09, RF-10, RF-11, RF-12 |
| HU-04 | EP-01 | Controlar cuándo se comparten mi domicilio y mis datos; ejercer ARCO | Alta | 8 | RF-24, RF-52, RF-53, RF-54 |
| HU-05 | EP-02 | Describir mi necesidad conversando con el agente | Alta | 8 | RF-13, RF-14, RF-15, RF-19, RF-22, RF-25 |
| HU-06 | EP-02 | Completar y confirmar mi solicitud | Alta | 8 | RF-16, RF-17, RF-18, RF-20, RF-21 |
| HU-07 | EP-02 | Visualizar el alcance con imágenes de referencia | Baja | 5 | RF-23 |
| HU-08 | EP-03 | Encontrar y comparar proveedores | Alta | 8 | RF-26, RF-27, RF-28, RF-29, RF-30 |
| HU-09 | EP-03 | Elegir un proveedor y obtener su aceptación | Alta | 3 | RF-31, RF-32 |
| HU-10 | EP-03 | Agendar citas confirmadas por ambas partes | Alta | 8 | RF-33, RF-34, RF-35, RF-36, RF-37 |
| HU-11 | EP-04 | Recibir y negociar una propuesta escrita | Alta | 5 | RF-38, RF-39 |
| HU-12 | EP-04 | Decidir sobre los cambios de costo, material, alcance o fecha | Alta | 8 | RF-40, RF-41, RF-55 |
| HU-13 | EP-04 | Consultar costos y analizar justificaciones | Media | 5 | RF-42, RF-43, RF-44 |
| HU-14 | EP-05 | Seguir y cerrar el trabajo | Alta | 8 | RF-45, RF-46, RF-47, RF-48 |
| HU-15 | EP-05 | Evaluar a la contraparte al concluir | Media | 5 | RF-49, RF-50, RF-51 |

---

## 4. Matriz RF → historia principal

| RF | Historia principal | Épica |
|---|---|---|
| RF-01 | HU-01 | EP-01 |
| RF-02 | HU-01 | EP-01 |
| RF-03 | HU-02 | EP-01 |
| RF-04 | HU-02 | EP-01 |
| RF-05 | HU-02 | EP-01 |
| RF-06 | HU-02 | EP-01 |
| RF-07 | HU-02 | EP-01 |
| RF-08 | HU-03 | EP-01 |
| RF-09 | HU-03 | EP-01 |
| RF-10 | HU-03 | EP-01 |
| RF-11 | HU-03 | EP-01 |
| RF-12 | HU-03 | EP-01 |
| RF-13 | HU-05 | EP-02 |
| RF-14 | HU-05 | EP-02 |
| RF-15 | HU-05 | EP-02 |
| RF-16 | HU-06 | EP-02 |
| RF-17 | HU-06 | EP-02 |
| RF-18 | HU-06 | EP-02 |
| RF-19 | HU-05 | EP-02 |
| RF-20 | HU-06 | EP-02 |
| RF-21 | HU-06 | EP-02 |
| RF-22 | HU-05 | EP-02 |
| RF-23 | HU-07 | EP-02 |
| RF-24 | HU-04 | EP-01 |
| RF-25 | HU-05 | EP-02 |
| RF-26 | HU-08 | EP-03 |
| RF-27 | HU-08 | EP-03 |
| RF-28 | HU-08 | EP-03 |
| RF-29 | HU-08 | EP-03 |
| RF-30 | HU-08 | EP-03 |
| RF-31 | HU-09 | EP-03 |
| RF-32 | HU-09 | EP-03 |
| RF-33 | HU-10 | EP-03 |
| RF-34 | HU-10 | EP-03 |
| RF-35 | HU-10 | EP-03 |
| RF-36 | HU-10 | EP-03 |
| RF-37 | HU-10 | EP-03 |
| RF-38 | HU-11 | EP-04 |
| RF-39 | HU-11 | EP-04 |
| RF-40 | HU-12 | EP-04 |
| RF-41 | HU-12 | EP-04 |
| RF-42 | HU-13 | EP-04 |
| RF-43 | HU-13 | EP-04 |
| RF-44 | HU-13 | EP-04 |
| RF-45 | HU-14 | EP-05 |
| RF-46 | HU-14 | EP-05 |
| RF-47 | HU-14 | EP-05 |
| RF-48 | HU-14 | EP-05 |
| RF-49 | HU-15 | EP-05 |
| RF-50 | HU-15 | EP-05 |
| RF-51 | HU-15 | EP-05 |
| RF-52 | HU-04 | EP-01 |
| RF-53 | HU-04 | EP-01 |
| RF-54 | HU-04 | EP-01 |
| RF-55 | HU-12 | EP-04 |

---

## 5. Resultado de validación

Validación automática ejecutada sobre este archivo y `SRS_equipo.md`:

- Historias: 15 (esperadas 15)
- IDs HU-01 a HU-15 continuos, sin huecos
- Todas las historias tienen épica, prioridad, Story Points Fibonacci, al menos 2 criterios, al menos un RF, dependencias declaradas y formato Como/quiero/para
- Distribución por épica: EP-01: 4, EP-02: 3, EP-03: 3, EP-04: 3, EP-05: 2
- Total de Story Points: 95
- RF esperados: 55 | con historia principal: 55 | sin historia principal: 0  | con más de una historia principal: 0  | RF inexistentes: 0
- Cada RF está en una historia de su épica aprobada
- Cada criterio "Deriva de" apunta a un criterio existente del SRS de un RF cubierto por la historia
- Alcance: menciones de FP en las historias: 0; de PV: 0 (ninguna FP se trata como funcionalidad del MVP y ningún PV se resuelve)
- Errores: 0

- Prioridades: Alta 12, Media 2, Baja 1 (después de los ajustes de `ajustes_backlog.md`)
- Story Points en escala Fibonacci: 100 %

**Resultado: OK, 0 errores.**
