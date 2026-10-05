# Especificación de Requerimientos de Software (SRS)
# UnCalificado — Coordinación de trabajos de oficio con agente de IA

| Campo | Valor |
|---|---|
| Versión | 2.1 — versión final tras la revisión técnica (cambios en `revision_SRS.md`, secciones 8 a 10) |
| Fecha | 27 de septiembre de 2026 |
| Estándar de referencia | IEEE Std 830-1998, estructura simplificada |
| Product Owner | Mariana Robles (cofundadora, personaje simulado) |
| Fuentes | `proyecto_base.md`, `transcript_entrevista.md`, `revision_SRS.md`, `revision_casos_de_uso.md`, `casos_de_uso.puml` |

---

## 1. Introducción

### 1.1 Propósito del documento

Este documento especifica los requerimientos de software de **UnCalificado** para el piloto (MVP). Establece qué debe hacer el sistema, con qué atributos de calidad y bajo qué reglas del negocio, y define criterios de aceptación verificables para cada requerimiento funcional.

Está dirigido a:

- **Product Owner:** para validar que el alcance refleja las necesidades del negocio.
- **Equipo de desarrollo:** como base para el diseño, la estimación y la implementación.
- **Equipo de pruebas:** como base para los casos de prueba de aceptación.

### 1.2 Alcance del sistema

UnCalificado es una plataforma que conecta a personas que necesitan un **trabajo de oficio** en su domicilio con trabajadores independientes y organizaciones de contratistas con identidad verificada. En el piloto se atienden los 10 oficios del catálogo inicial (Apéndice C). Un agente conversacional de IA, que opera por WhatsApp:

1. Construye la ficha del proyecto a partir de texto, fotos y notas de voz del cliente.
2. Propone hasta tres prestadores que cumplen los criterios de búsqueda de RF-04.
3. Coordina la cotización, la visita de valoración y la ejecución del trabajo.
4. Solicita un reporte de avance diario y registra los cambios de costo solo con aprobación del cliente.
5. Cierra el trabajo con calificaciones de ambas partes.

**Objetivos medibles del piloto** (se evalúan al sexto mes de operación; no son requerimientos del software):

| ID | Objetivo | Meta | Línea base |
|---|---|---|---|
| OB-01 | Tiempo desde el primer mensaje del cliente hasta una visita de valoración agendada | Mediana ≤ 72 h | Alrededor de 3 semanas en el caso relatado en [6] |
| OB-02 | Proyectos concluidos con al menos un cambio de costo fuera de la plataforma (reportado a soporte) | ≤ 5 % | Sin registro |
| OB-03 | Calificación promedio de los prestadores en “apego al presupuesto” | ≥ 4.0 de 5 | Sin registro |

**Fuera del alcance de esta versión:**

- Procesamiento, retención o transferencia de pagos de los trabajos (sin *escrow*).
- Cobro en línea de las suscripciones; se registran manualmente (RF-15).
- Aplicación móvil nativa para cualquier tipo de usuario.
- Operación fuera de los municipios definidos en RD-06.
- Entrenamiento de un modelo de IA propio.
- Oficios fuera del catálogo del Apéndice C.

### 1.3 Definiciones y acrónimos

| Término | Definición |
|---|---|
| Agente | Componente conversacional de IA que interactúa con clientes y prestadores por WhatsApp. |
| ARCO | Derechos de Acceso, Rectificación, Cancelación y Oposición sobre datos personales. |
| Calificación promedio | Media aritmética de las cuatro dimensiones de RF-11 en todas las calificaciones recibidas por un prestador, redondeada a un decimal. |
| Cliente | Persona mayor de edad que solicita un trabajo de oficio para un domicilio en la ZMG. |
| Cotización | Propuesta económica del prestador con los campos definidos en RF-08. |
| Día de ejecución | Día calendario en el que la cotización aceptada programa trabajo en el domicilio. |
| Escrow | Esquema en el que un tercero retiene el pago hasta que se cumple una condición. |
| Estado del proyecto | Valor del ciclo de vida definido en el Apéndice D. |
| Ficha de proyecto | Registro estructurado del trabajo solicitado, con los campos definidos en RF-02. |
| Franja horaria | Intervalo de agenda de un prestador. La visita de valoración ocupa 1 h; la ejecución ocupa el horario que indica la cotización aceptada. |
| Horario de soporte | Lunes a viernes de 9:00 a 18:00, hora del centro de México, excepto días de descanso obligatorio. |
| INE | Credencial para votar emitida por el Instituto Nacional Electoral; se usa como identificación oficial. |
| LFPDPPP | Ley Federal de Protección de Datos Personales en Posesión de los Particulares vigente (publicada en el DOF en marzo de 2025). |
| LLM | *Large Language Model*, modelo de lenguaje de gran escala. |
| MVP | Producto mínimo viable; en este documento, la versión del piloto. |
| Organización | Persona moral o física con actividad empresarial que ofrece trabajos de oficio con una plantilla de trabajadores. |
| p95 | Percentil 95: valor por debajo del cual se encuentra el 95 % de las mediciones. |
| Perfil aprobado | Perfil de prestador cuyo estado cambió a “aprobado” por un administrador (RF-07, RF-17). |
| Prestador | Término genérico para un trabajador o una organización que presta el servicio. |
| Prestador nuevo | Prestador aprobado con menos de 3 calificaciones publicadas (RF-11). |
| Radio de búsqueda | Distancia máxima en línea recta entre el domicilio del proyecto y la ubicación base del prestador: 10 km por defecto y 20 km ampliado (RF-05). |
| RD / RF / RNF | Requerimiento de dominio / funcional / no funcional. |
| SRS | *Software Requirements Specification*. |
| Trabajador | Persona que ejecuta trabajos de oficio, ya sea independiente o de la plantilla de una organización. |
| Trabajo de oficio | Trabajo manual de construcción, instalación, reparación o mantenimiento en un domicilio que corresponde a una categoría del Apéndice C. |
| ZMG | Zona metropolitana de Guadalajara, en los municipios de RD-06. |

---

## 2. Descripción general

### 2.1 Perspectiva del producto

UnCalificado es un producto nuevo e independiente; no reemplaza un sistema existente. Hoy la contratación se hace de manera informal por referidos, grupos de WhatsApp y Facebook Marketplace, sin registro de acuerdos ni verificación de trabajadores.

El sistema interactúa con los siguientes elementos externos:

| Elemento externo | Interfaz | Uso |
|---|---|---|
| WhatsApp Business Platform | API oficial (webhooks de entrada, mensajes de salida y plantillas aprobadas) | Canal conversacional con clientes y prestadores. |
| Proveedor de IA | API HTTPS (LLM y voz a texto) | Generación de fichas, clasificación de oficios, respuestas del agente y transcripción de notas de voz. |
| Servicio de geocodificación | API HTTPS | Conversión del domicilio a coordenadas para calcular el radio de búsqueda. |
| Navegador web | HTTPS (ver RNF-12) | Panel de organizaciones, administradores y agentes de soporte. |
| Temporizador del sistema | Interno | Disparo de recordatorios, vencimientos y escalamientos. |

Vista lógica de alto nivel:

```
Cliente / Trabajador ──WhatsApp──► [Agente conversacional] ──► Proveedor de IA
                                           │
Organización / Admin / Soporte ──Web──► [Núcleo UnCalificado: proyectos, agenda,
                                          cotizaciones, registro de auditoría] ──► Geocodificación
```

### 2.2 Funciones del producto

El diagrama `casos_de_uso.png` muestra estas funciones con sus actores.

| Grupo | Funciones | RF |
|---|---|---|
| Definición del proyecto | Recibir texto, fotos y voz; generar la ficha; clasificar el oficio. | RF-01 a RF-03 |
| Búsqueda y contratación | Proponer prestadores; manejar la falta de resultados; seleccionar prestador; cotizar; agendar; asignar trabajador de plantilla; gestionar la disponibilidad del prestador. | RF-04 a RF-06, RF-08, RF-12, RF-18, RF-22 |
| Seguimiento y cierre | Controlar cambios de costo; dar seguimiento diario; registrar pagos; cerrar el trabajo; calificar; cancelar el proyecto. | RF-09 a RF-11, RF-14, RF-16, RF-19 |
| Administración y soporte | Dar de alta usuarios con consentimiento; registrar y aprobar trabajadores y organizaciones; gestionar suscripciones; atención humana y bandeja de soporte; atender solicitudes ARCO. | RF-07, RF-13, RF-15, RF-17, RF-20, RF-21, RF-23 |

### 2.3 Características del usuario

| Usuario | Perfil | Canal | Implicación para el diseño |
|---|---|---|---|
| Cliente | Mayor de edad que contrata trabajos en su hogar o para proyectos pequeños. Con frecuencia no sabe qué oficio necesita. Escribe a cualquier hora, incluidas noches y fines de semana. | WhatsApp | El agente hace preguntas guiadas y acepta fotos y audios (RF-01 a RF-03). |
| Trabajador | Sabe enviar mensajes de texto, fotos y notas de voz por WhatsApp; no se asume que use correo electrónico, formularios web ni otras aplicaciones. Con frecuencia tiene poco espacio en el teléfono y datos móviles limitados. | WhatsApp | Todas sus tareas se completan por WhatsApp, con texto o voz (RNF-07). |
| Organización | Coordinador de oficina que administra de 10 a 20 trabajadores y usa una computadora con navegador. | Panel web y WhatsApp | Vista consolidada de solicitudes y asignación de personal (RF-12). |
| Administrador | Personal interno de UnCalificado. | Panel web | Aprobación de perfiles y registro de suscripciones (RF-07, RF-15, RF-17). |
| Agente de soporte | Personal interno; dos personas en el horario de soporte. | Panel web | Recibe las conversaciones transferidas con su historial (RF-13). |

### 2.4 Restricciones

| ID | Restricción | Tipo |
|---|---|---|
| C-01 | La comunicación por WhatsApp debe usar exclusivamente la API oficial de WhatsApp Business Platform (RNF-10). | Tecnológica |
| C-02 | El agente debe usar un LLM de un proveedor externo vía API; no se entrenará un modelo propio (RNF-11). | Tecnológica |
| C-03 | El tratamiento de datos personales debe cumplir la LFPDPPP (RD-01). | Legal |
| C-04 | La plataforma no manejará fondos de los trabajos en esta versión (RD-02). | Regulatoria y de negocio |
| C-05 | La operación del piloto se limita a los municipios de RD-06. | De negocio |
| C-06 | El soporte humano opera solo en el horario de soporte (sección 1.3), mientras el agente opera 24/7. | Operativa |
| C-07 | Los mensajes que el sistema inicie fuera de la ventana de 24 horas de WhatsApp deben usar plantillas aprobadas por Meta. | Tecnológica |

**Supuestos y dependencias:**

- Cada cliente y trabajador tiene un número de WhatsApp activo, que funciona como su identificador en la plataforma.
- El proveedor de IA responde dentro de los tiempos necesarios para cumplir RNF-01 y RNF-02; si no, se aplica la contingencia de RNF-01.
- Meta aprueba la cuenta de WhatsApp Business y las plantillas de mensajes antes del lanzamiento.
- El cobro de suscripciones se realiza fuera de la plataforma (transferencia bancaria a UnCalificado).

**Restricciones del proyecto (fuera de la SRS, se registran en el plan de proyecto):** lanzamiento en cuatro meses y equipo de desarrollo de tres personas.

---

## 3. Requerimientos específicos

**Convenciones:**

- **Prioridad:** E = esencial para el MVP; D = deseable; O = opcional.
- **Estado:** *Validado* = acordado en la entrevista; *Aprobado por PO* = incorporado en la revisión v1.1; *Propuesto* = agregado por la revisión técnica v2.1 y pendiente de validar con el PO.
- **Origen:** los números entre corchetes remiten a las intervenciones de `transcript_entrevista.md`.
- **Criterios de aceptación:** formato Given-When-Then (*Dado que / cuando / entonces*). Cada criterio tiene un identificador único `RF-XX-AC-N`, que es la clave de trazabilidad hacia la especificación de la API (`openapi.yaml`) y hacia las pruebas automatizadas (Apéndice E).
- **Interfaz de prueba:** WA = conversación de WhatsApp (webhook simulado); API = servicio del núcleo; PANEL = panel web; JOB = proceso programado; IA = evaluación del modelo con un conjunto de datos; INSP = inspección.
- Los valores numéricos, fechas y montos de los criterios son **datos de prueba**; la regla general está en la descripción del requerimiento.
- Todos los tiempos se expresan en hora del centro de México y todos los montos en pesos mexicanos (MXN).

### 3.1 Requerimientos funcionales

#### RF-01: Recepción de mensajes multimedia
**Descripción:** El sistema deberá recibir del cliente o del prestador mensajes de texto, imágenes JPG o PNG de hasta 5 MB y notas de voz de hasta 3 minutos; deberá transcribir cada nota de voz a texto y guardar la transcripción y las imágenes en el historial del proyecto al que corresponden, con un máximo de 10 imágenes por proyecto. Si el usuario tiene más de un proyecto activo, el agente deberá preguntar a cuál corresponde el mensaje antes de asociarlo.
**Prioridad:** E · **Estado:** Validado · **Origen:** [10], [12], [24] · **Caso de uso:** Describir proyecto; Transcribir nota de voz

**Criterios de aceptación:**

**RF-01-AC-1** · Interfaz: WA
- **Dado que** un cliente tiene un proyecto en estado “borrador”,
- **cuando** envía una imagen PNG de 3 MB,
- **entonces** la imagen queda asociada a ese proyecto y el contador de imágenes del proyecto aumenta en 1.

**RF-01-AC-2** · Interfaz: WA
- **Dado que** un cliente tiene un proyecto en estado “borrador”,
- **cuando** envía el audio de prueba `audio_piso_40m2.ogg` (duración 2:00; dice “cuarenta metros cuadrados de piso”),
- **entonces** el historial del proyecto guarda una transcripción no vacía que contiene “cuarenta metros” o “40 m” (se aceptan “40 metros”, “40 m2” y “40 m²”).

**RF-01-AC-3** · Interfaz: WA
- **Dado que** un cliente tiene un proyecto en estado “borrador”,
- **cuando** envía una imagen JPG de 6 MB,
- **entonces** la imagen no se asocia al proyecto y el agente responde con un mensaje que indica el límite de 5 MB.

**RF-01-AC-4** · Interfaz: WA
- **Dado que** un cliente tiene un proyecto en estado “borrador”,
- **cuando** envía un video, un archivo PDF o una nota de voz de 3:01 min,
- **entonces** el archivo no se procesa, el historial no cambia y el agente responde indicando los formatos aceptados (texto, JPG, PNG y voz de hasta 3 min).

**RF-01-AC-5** · Interfaz: WA
- **Dado que** un proyecto tiene 10 imágenes asociadas,
- **cuando** el cliente envía una imagen adicional,
- **entonces** la imagen no se asocia, el contador permanece en 10 y el agente pide al cliente indicar cuál imagen reemplazar.

**RF-01-AC-6** · Interfaz: WA
- **Dado que** un cliente tiene dos proyectos activos (en un estado distinto de “concluido” y “cancelado”),
- **cuando** envía una imagen,
- **entonces** el agente pregunta a cuál de los dos proyectos corresponde, mostrando ambos, y la imagen no se asocia hasta que el cliente elige.

**RF-01-AC-7** · Interfaz: WA
- **Dado que** un prestador recibió una solicitud de reporte de avance (RF-10),
- **cuando** envía una nota de voz de 4 minutos,
- **entonces** la nota de voz no se procesa y el agente responde indicando el límite de 3 minutos.

#### RF-02: Generación de ficha de proyecto
**Descripción:** El sistema deberá generar una ficha de proyecto con los campos obligatorios oficio, descripción, domicilio (calle, número, colonia, municipio) y fecha deseada, y con los campos opcionales medidas o cantidades, fotos y si el cliente ya tiene el material. Deberá solicitar cada campo obligatorio faltante, presentar al cliente un resumen de la ficha y cambiar el estado del proyecto a “ficha completa” solo cuando el cliente confirme el resumen.
**Prioridad:** E · **Estado:** Validado · **Origen:** [10], [8] · **Caso de uso:** Generar ficha de proyecto

**Criterios de aceptación:**

**RF-02-AC-1** · Interfaz: WA
- **Dado que** un proyecto en “borrador” tiene oficio, descripción, calle, número, colonia y fecha deseada, pero no municipio,
- **cuando** el cliente pide ver trabajadores,
- **entonces** el agente pregunta por el municipio y el estado del proyecto permanece en “borrador”.

**RF-02-AC-2** · Interfaz: WA
- **Dado que** un proyecto en “borrador” tiene los 7 valores obligatorios (oficio, descripción, calle, número, colonia, municipio y fecha deseada),
- **cuando** el agente envía el resumen de la ficha,
- **entonces** el mensaje contiene los 7 valores y un botón “Confirmar”.

**RF-02-AC-3** · Interfaz: WA
- **Dado que** el agente envió el resumen de la ficha,
- **cuando** el cliente pulsa “Confirmar”,
- **entonces** el estado cambia a “ficha completa” y se registra la fecha y hora de la confirmación.

**RF-02-AC-4** · Interfaz: WA
- **Dado que** el agente envió el resumen de la ficha,
- **cuando** el cliente envía una corrección de la colonia,
- **entonces** el agente envía un nuevo resumen con la colonia corregida y el estado permanece en “borrador”.

**RF-02-AC-5** · Interfaz: WA
- **Dado que** un proyecto tiene los campos obligatorios completos y ninguno de los opcionales (medidas, fotos, material),
- **cuando** el cliente pulsa “Confirmar”,
- **entonces** el estado cambia a “ficha completa”.

**RF-02-AC-6** · Interfaz: WA
- **Dado que** un cliente captura un domicilio en el municipio de Chapala (fuera de RD-06),
- **cuando** el agente valida el municipio,
- **entonces** el agente informa que el servicio no opera en ese municipio y el proyecto no puede pasar a “ficha completa”.

#### RF-03: Clasificación del oficio
**Descripción:** El sistema deberá asignar al proyecto exactamente una categoría del catálogo de oficios (Apéndice C). Si después de 2 preguntas de aclaración el agente no puede asignar una sola categoría, deberá informar al cliente que el proyecto requiere la valoración de un especialista y ofrecerle la transferencia a soporte (RF-13), sin asignar oficio.
**Prioridad:** E · **Estado:** Validado · **Origen:** [12] · **Caso de uso:** Clasificar oficio

**Criterios de aceptación:**

**RF-03-AC-1** · Interfaz: IA
- **Dado que** existe el conjunto de prueba de 50 descripciones etiquetadas por el PO,
- **cuando** el sistema clasifica cada descripción,
- **entonces** al menos 45 (90 %) reciben exactamente la categoría etiquetada.

**RF-03-AC-2** · Interfaz: IA
- **Dado que** se toma cualquier descripción del conjunto de prueba,
- **cuando** el sistema la clasifica,
- **entonces** el oficio asignado es vacío o es una de las 10 categorías del Apéndice C.

**RF-03-AC-3** · Interfaz: WA
- **Dado que** el agente ya hizo 2 preguntas de aclaración sin poder asignar una sola categoría,
- **cuando** recibe la respuesta a la segunda pregunta y sigue sin poder asignarla,
- **entonces** el campo oficio queda vacío y el agente envía un mensaje con el botón “Hablar con una persona”.

**RF-03-AC-4** · Interfaz: WA
- **Dado que** el agente ha hecho 0 o 1 preguntas de aclaración,
- **cuando** no puede asignar una sola categoría,
- **entonces** envía una nueva pregunta de aclaración y no ofrece la transferencia a soporte.

#### RF-04: Búsqueda y propuesta de prestadores
**Descripción:** Para un proyecto en estado “ficha completa”, el sistema deberá proponer al cliente entre 1 y 3 prestadores que cumplan simultáneamente:
(a) perfil aprobado;
(b) oficio aprobado igual al del proyecto;
(c) ubicación base dentro del radio de búsqueda respecto al domicilio del proyecto;
(d) al menos una franja libre de 1 h en la fecha deseada, dentro de su horario declarado;
(e) suscripción activa (RF-15).
Los prestadores con calificaciones se ordenarán por calificación promedio descendente; los empates se resolverán por mayor número de trabajos concluidos y después por menor distancia. De las 3 posiciones, como máximo 1 se asignará al prestador nuevo con menor distancia, identificado con la etiqueta “Nuevo verificado”.
**Prioridad:** E · **Estado:** Validado · **Origen:** [10], [16], [18], [20], [22] · **Caso de uso:** Buscar y proponer trabajadores

**Criterios de aceptación:**

**RF-04-AC-1** · Interfaz: API
- **Dado que** 5 prestadores cumplen los criterios (a)–(e), con calificaciones promedio de 4.8, 4.5, 4.2, 3.9 y 3.5,
- **cuando** se ejecuta la búsqueda,
- **entonces** se proponen exactamente los prestadores con 4.8, 4.5 y 4.2, en ese orden.

**RF-04-AC-2** · Interfaz: API
- **Dado que** un prestador cumple cuatro de los criterios (a)–(e) e incumple solo uno (un caso de prueba por criterio; para (c), ubicación a 10.5 km; para (d), sin franja libre de 1 h en la fecha),
- **cuando** se ejecuta la búsqueda,
- **entonces** el prestador no aparece en la propuesta.

**RF-04-AC-3** · Interfaz: API
- **Dado que** dos prestadores tienen calificación promedio de 4.5, uno con 12 trabajos concluidos y otro con 8,
- **cuando** se ejecuta la búsqueda,
- **entonces** el prestador con 12 trabajos aparece antes; si ambos tuvieran 12 trabajos, aparece antes el de menor distancia.

**RF-04-AC-4** · Interfaz: API
- **Dado que** 4 prestadores con calificaciones y 2 prestadores nuevos (a 3 km y a 7 km) cumplen los criterios,
- **cuando** se ejecuta la búsqueda,
- **entonces** se proponen los 2 mejores prestadores con calificaciones y, en tercera posición, el prestador nuevo a 3 km con la etiqueta “Nuevo verificado”.

**RF-04-AC-5** · Interfaz: API
- **Dado que** solo 2 prestadores cumplen los criterios,
- **cuando** se ejecuta la búsqueda,
- **entonces** se proponen exactamente 2 opciones.

**RF-04-AC-6** · Interfaz: WA
- **Dado que** una búsqueda obtuvo al menos un resultado,
- **cuando** el agente envía la propuesta,
- **entonces** cada opción muestra nombre, foto, oficio, calificación promedio con un decimal (o “Nuevo verificado”), número de trabajos concluidos y distancia en km con un decimal.

#### RF-05: Manejo de búsqueda sin resultados
**Descripción:** Cuando ningún prestador cumpla los criterios de RF-04 con el radio de 10 km, el sistema deberá informarlo al cliente y ofrecerle: (a) repetir la búsqueda con un radio de 20 km; o (b) recibir una notificación, durante los siguientes 7 días, en cuanto un prestador cumpla los criterios.
**Prioridad:** D · **Estado:** Validado · **Origen:** [14] · **Caso de uso:** Ampliar radio o notificar disponibilidad

**Criterios de aceptación:**

**RF-05-AC-1** · Interfaz: WA
- **Dado que** una búsqueda a 10 km no obtuvo resultados,
- **cuando** termina la búsqueda,
- **entonces** el agente envía un solo mensaje que informa la falta de resultados con los botones “Ampliar a 20 km” y “Avisarme”.

**RF-05-AC-2** · Interfaz: WA
- **Dado que** el agente ofreció las opciones de RF-05,
- **cuando** el cliente pulsa “Ampliar a 20 km”,
- **entonces** se ejecuta RF-04 con radio de 20 km y, si no hay resultados, el agente solo ofrece “Avisarme”.

**RF-05-AC-3** · Interfaz: JOB
- **Dado que** el cliente eligió “Avisarme” hace 2 días para un proyecto de plomería en Zapopan y el sistema reevalúa las solicitudes en espera cada 10 minutos,
- **cuando** un administrador aprueba a un plomero con ubicación base a 5 km que cumple los criterios (a)–(e) de RF-04,
- **entonces** el cliente recibe la propuesta en menos de 15 minutos.

**RF-05-AC-4** · Interfaz: JOB
- **Dado que** el cliente eligió “Avisarme”,
- **cuando** pasan 168 h sin que ningún prestador cumpla los criterios,
- **entonces** el cliente recibe un aviso de cierre y el proyecto pasa a “cancelado”.

#### RF-06: Agendamiento de visita y ejecución
**Descripción:** El sistema deberá agendar la visita de valoración (1 h) y los días de ejecución (según la cotización aceptada) solo cuando el cliente y el prestador confirmen la misma fecha y hora, y deberá bloquear esas franjas en la agenda del prestador. Si dos confirmaciones compiten por franjas traslapadas del mismo prestador, prevalece la registrada primero. La cancelación de una cita por cualquiera de las partes deberá liberar la franja y notificar a la otra parte, sin cancelar el proyecto (la cancelación del proyecto se rige por RF-19).
**Prioridad:** E · **Estado:** Validado · **Origen:** [10], [22], [44] · **Caso de uso:** Agendar visita o ejecución; Bloquear agenda

**Criterios de aceptación:**

**RF-06-AC-1** · Interfaz: API
- **Dado que** el prestador propuso el 3 de octubre a las 10:00 para la visita,
- **cuando** solo el prestador ha confirmado,
- **entonces** la cita queda en estado “pendiente” y la franja de 10:00 a 11:00 sigue libre.

**RF-06-AC-2** · Interfaz: API
- **Dado que** el prestador propuso el 3 de octubre a las 10:00 para la visita,
- **cuando** el cliente también confirma,
- **entonces** la cita queda “confirmada”, se bloquea la franja de 10:00 a 11:00 y el prestador no cumple el criterio (d) de RF-04 para ninguna franja que se traslape con ella.

**RF-06-AC-3** · Interfaz: API
- **Dado que** un proyecto no tiene una cotización aceptada y vigente,
- **cuando** cualquiera de las partes intenta agendar la ejecución,
- **entonces** el sistema rechaza la operación con un mensaje que indica que falta una cotización aceptada.

**RF-06-AC-4** · Interfaz: API
- **Dado que** una cotización aceptada establece ejecución el 6 y 7 de octubre de 9:00 a 17:00,
- **cuando** ambas partes confirman la ejecución,
- **entonces** se bloquean exactamente las franjas de 9:00 a 17:00 de esos dos días.

**RF-06-AC-5** · Interfaz: API
- **Dado que** una cita está “confirmada”,
- **cuando** una de las partes la cancela,
- **entonces** la franja se libera y la otra parte recibe una notificación en menos de 1 minuto.

**RF-06-AC-6** · Interfaz: JOB
- **Dado que** una cita está “confirmada” para el 3 de octubre a las 10:00,
- **cuando** son las 10:00 del 2 de octubre,
- **entonces** ambas partes reciben un recordatorio con una tolerancia de ±5 minutos.

**RF-06-AC-7** · Interfaz: API
- **Dado que** dos clientes proponen al mismo prestador citas con franjas que se traslapan y el prestador ya confirmó ambas,
- **cuando** los dos clientes confirman con menos de 1 segundo de diferencia,
- **entonces** solo la confirmación registrada primero queda “confirmada”; la otra se rechaza y ese cliente recibe un aviso para elegir otra fecha.

**RF-06-AC-8** · Interfaz: API
- **Dado que** un proyecto en “visita agendada” tiene la visita confirmada,
- **cuando** el cliente cancela la cita (no el proyecto),
- **entonces** la franja se libera, el proyecto regresa a “asignado” y el prestador puede proponer una nueva fecha.

#### RF-07: Registro y aprobación de trabajadores
**Descripción:** El sistema deberá registrar a cada trabajador por WhatsApp con: nombre completo, foto de rostro, imagen del anverso y reverso de la INE, uno o más oficios del Apéndice C, al menos 3 fotos de trabajos anteriores, ubicación base, horario de atención y certificaciones (opcionales). El perfil se creará en estado “pendiente” y se excluirá de las búsquedas hasta que un administrador lo cambie a “aprobado”. Si el administrador lo rechaza, deberá registrar el motivo y el sistema notificará al trabajador.
**Prioridad:** E · **Estado:** Validado · **Origen:** [16], [22], [48] · **Caso de uso:** Registrar perfil; Aprobar perfil

**Criterios de aceptación:**

**RF-07-AC-1** · Interfaz: WA
- **Dado que** un trabajador captura su registro sin imagen de INE o con menos de 3 fotos de trabajos,
- **cuando** intenta enviarlo,
- **entonces** el sistema indica el campo faltante y no crea el perfil.

**RF-07-AC-2** · Interfaz: WA
- **Dado que** un trabajador captura todos los campos obligatorios, sin certificaciones,
- **cuando** envía el registro,
- **entonces** el perfil se crea en estado “pendiente”.

**RF-07-AC-3** · Interfaz: API
- **Dado que** un perfil está en estado “pendiente” o “rechazado”,
- **cuando** se ejecuta cualquier búsqueda,
- **entonces** el trabajador no aparece en la propuesta.

**RF-07-AC-4** · Interfaz: PANEL
- **Dado que** un perfil está en estado “pendiente”,
- **cuando** un administrador lo aprueba,
- **entonces** el estado cambia a “aprobado” y el trabajador recibe una notificación por WhatsApp en menos de 1 minuto.

**RF-07-AC-5** · Interfaz: PANEL
- **Dado que** un perfil está en estado “pendiente”,
- **cuando** un administrador intenta rechazarlo sin capturar motivo,
- **entonces** el sistema no guarda el rechazo y marca el campo motivo como obligatorio.

**RF-07-AC-6** · Interfaz: PANEL
- **Dado que** un perfil está en estado “pendiente”,
- **cuando** un administrador lo rechaza con el motivo “INE ilegible”,
- **entonces** el estado cambia a “rechazado” y el trabajador recibe por WhatsApp el motivo “INE ilegible”.

#### RF-08: Cotización
**Descripción:** El sistema deberá permitir al prestador enviar una cotización con: partidas (descripción e importe de cada una), monto total en MXN, si el total incluye IVA, si incluye materiales, días y horario de ejecución, y vigencia de 1 a 30 días naturales. El prestador podrá enviarla desde el estado “asignado” o “visita agendada” (la visita de valoración es opcional) y, si el cliente la rechaza, podrá enviar una nueva. El cliente podrá aceptarla o rechazarla, y solo una cotización aceptada y vigente habilitará el agendamiento de la ejecución.
**Prioridad:** E · **Estado:** Validado · **Origen:** [6], [10] · **Caso de uso:** Enviar cotización; Aceptar o rechazar cotización

**Criterios de aceptación:**

**RF-08-AC-1** · Interfaz: API
- **Dado que** un prestador captura una cotización cuyas partidas suman $9,500.00 y un monto total de $10,000.00,
- **cuando** la envía,
- **entonces** el sistema la rechaza e indica una diferencia de $500.00.

**RF-08-AC-2** · Interfaz: API
- **Dado que** un prestador captura una cotización sin indicar si incluye IVA o si incluye materiales,
- **cuando** la envía,
- **entonces** el sistema la rechaza e indica el campo faltante.

**RF-08-AC-3** · Interfaz: API
- **Dado que** un prestador captura una cotización con vigencia de 0 o de 31 días,
- **cuando** la envía,
- **entonces** el sistema la rechaza e indica el rango permitido de 1 a 30 días.

**RF-08-AC-4** · Interfaz: API
- **Dado que** una cotización con vigencia de 5 días fue enviada hace 6 días,
- **cuando** el cliente intenta aceptarla,
- **entonces** el sistema lo impide, informa que la cotización venció y el prestador recibe una solicitud para enviar una nueva.

**RF-08-AC-5** · Interfaz: API
- **Dado que** una cotización vigente fue enviada al cliente,
- **cuando** el cliente la acepta,
- **entonces** la cotización queda como presupuesto vigente, el proyecto pasa a “contratado” y se registran fecha, hora y autor de la aceptación.

**RF-08-AC-6** · Interfaz: API
- **Dado que** una cotización vigente fue enviada al cliente,
- **cuando** el cliente la rechaza,
- **entonces** el proyecto permanece en “cotizado”, no hay presupuesto vigente y el prestador recibe una notificación del rechazo.

**RF-08-AC-7** · Interfaz: WA
- **Dado que** un prestador dictó su cotización por nota de voz,
- **cuando** el agente la estructura,
- **entonces** el prestador recibe un resumen con todos los campos de RF-08 y la cotización no es visible para el cliente hasta que el prestador pulsa “Confirmar”.

**RF-08-AC-8** · Interfaz: API
- **Dado que** un proyecto está en “asignado” sin visita de valoración,
- **cuando** el prestador envía una cotización válida,
- **entonces** la cotización se acepta y el proyecto pasa a “cotizado”.

**RF-08-AC-9** · Interfaz: API
- **Dado que** el cliente rechazó la cotización de un proyecto,
- **cuando** el prestador envía una nueva cotización válida,
- **entonces** la nueva cotización queda “enviada” al cliente y la anterior permanece en estado “rechazada”.

#### RF-09: Control de cambios de costo
**Descripción:** Durante los estados “contratado” y “en ejecución”, el sistema deberá permitir al prestador registrar una solicitud de cambio de costo con el nuevo monto total, la diferencia respecto al presupuesto vigente, la justificación y fotos opcionales. El presupuesto vigente se actualizará solo si el cliente la aprueba de forma explícita (respondiendo “Apruebo” o pulsando el botón “Aprobar”). Una solicitud rechazada, o sin respuesta en 48 h, pasará a estado “rechazada” o “expirada” y no modificará el presupuesto.
**Prioridad:** E · **Estado:** Validado · **Origen:** [6], [28], [44] · **Caso de uso:** Solicitar cambio de costo; Aprobar o rechazar cambio

**Criterios de aceptación:**

**RF-09-AC-1** · Interfaz: API
- **Dado que** un proyecto está en estado “cotizado”, “terminado” o “concluido”,
- **cuando** el prestador intenta registrar un cambio de costo,
- **entonces** el sistema rechaza la solicitud.

**RF-09-AC-2** · Interfaz: API
- **Dado que** un proyecto está “en ejecución”,
- **cuando** el prestador envía un cambio de costo sin justificación,
- **entonces** el sistema rechaza la solicitud e indica que la justificación es obligatoria.

**RF-09-AC-3** · Interfaz: API
- **Dado que** un proyecto está “en ejecución” con presupuesto vigente de $10,000.00,
- **cuando** el prestador solicita un nuevo total de $13,000.00 con justificación,
- **entonces** la solicitud queda “pendiente” con diferencia de +$3,000.00 y el cliente la recibe con los botones “Aprobar” y “Rechazar”.

**RF-09-AC-4** · Interfaz: WA
- **Dado que** existe una solicitud de cambio de costo pendiente de $10,000.00 a $13,000.00,
- **cuando** el cliente pulsa “Aprobar” o escribe “Apruebo” (sin distinguir mayúsculas ni espacios al inicio o al final),
- **entonces** el presupuesto vigente cambia a $13,000.00 y el historial conserva el registro de $10,000.00.

**RF-09-AC-5** · Interfaz: WA
- **Dado que** existe una solicitud de cambio de costo pendiente,
- **cuando** el cliente responde un texto distinto de “Apruebo” (por ejemplo, “sí”, “ok, luego vemos”),
- **entonces** no se registra aprobación, el presupuesto no cambia y el agente vuelve a enviar los botones “Aprobar” y “Rechazar”.

**RF-09-AC-6** · Interfaz: WA
- **Dado que** existe una solicitud de cambio de costo pendiente,
- **cuando** el cliente pulsa “Rechazar”,
- **entonces** la solicitud pasa a “rechazada” y el presupuesto vigente no cambia.

**RF-09-AC-7** · Interfaz: JOB
- **Dado que** una solicitud de cambio de costo está pendiente sin respuesta del cliente,
- **cuando** pasan 48 h desde su envío,
- **entonces** la solicitud pasa a “expirada” y el presupuesto vigente no cambia.

#### RF-10: Seguimiento diario del avance
**Descripción:** En cada día de ejecución, a las 19:00 (el cliente puede cambiarla por proyecto a una hora en punto entre las 17:00 y las 22:00), el sistema deberá solicitar al prestador un reporte de avance en texto o nota de voz, con fotos opcionales, y reenviarlo al cliente. Si el prestador no responde en 2 h, deberá notificarlo al cliente y crear una alerta para soporte.
**Prioridad:** D · **Estado:** Validado · **Origen:** [30] · **Caso de uso:** Dar seguimiento diario; Escalar falta de reporte

**Criterios de aceptación:**

**RF-10-AC-1** · Interfaz: JOB
- **Dado que** hoy es un día de ejecución y el cliente no cambió la hora de reporte,
- **cuando** son las 19:00,
- **entonces** el prestador recibe la solicitud de reporte con una tolerancia de ±5 minutos.

**RF-10-AC-2** · Interfaz: JOB
- **Dado que** el cliente cambió la hora de reporte del proyecto a las 20:00,
- **cuando** son las 19:00 de un día de ejecución,
- **entonces** no se envía solicitud; se envía a las 20:00 con una tolerancia de ±5 minutos.

**RF-10-AC-3** · Interfaz: WA
- **Dado que** el prestador recibió la solicitud de reporte,
- **cuando** envía un reporte en texto, nota de voz o foto,
- **entonces** el cliente recibe el reporte en menos de 1 minuto y el reporte queda en el historial del proyecto.

**RF-10-AC-4** · Interfaz: JOB
- **Dado que** el prestador recibió la solicitud de reporte a las 19:00,
- **cuando** son las 21:00 sin respuesta,
- **entonces** el cliente recibe un aviso y se crea en la bandeja de soporte una alerta en estado “abierta” asociada al proyecto.

**RF-10-AC-5** · Interfaz: JOB
- **Dado que** un proyecto está “en ejecución” pero no tiene trabajo programado para hoy,
- **cuando** son las 19:00,
- **entonces** no se envía solicitud de reporte.

**RF-10-AC-6** · Interfaz: WA
- **Dado que** un proyecto está “contratado”,
- **cuando** el cliente pulsa “Cambiar hora de reporte” y elige las 20:00,
- **entonces** la hora de reporte del proyecto queda en 20:00 y el cliente recibe una confirmación.

**RF-10-AC-7** · Interfaz: WA
- **Dado que** un proyecto está “contratado”,
- **cuando** el cliente intenta fijar la hora de reporte a las 23:00,
- **entonces** el sistema la rechaza e indica el rango permitido de 17:00 a 22:00.

#### RF-11: Calificación bidireccional
**Descripción:** Cuando un proyecto pase a “concluido” (RF-16), el sistema deberá solicitar: (a) al cliente, calificar al prestador con valores enteros de 1 a 5 en puntualidad, calidad, limpieza y apego al presupuesto; y (b) al prestador, calificar al cliente con un valor entero de 1 a 5. El comentario de texto será opcional. Las solicitudes vencerán 7 días después. Cada calificación se publicará cuando ambas partes hayan calificado o al vencer el plazo, lo que ocurra primero. Para RF-04 solo cuentan las calificaciones publicadas.
**Prioridad:** D · **Estado:** Validado · **Origen:** [18], [42] · **Caso de uso:** Calificar a la contraparte

**Criterios de aceptación:**

**RF-11-AC-1** · Interfaz: API
- **Dado que** un proyecto está “terminado”,
- **cuando** pasa a “concluido”,
- **entonces** el cliente y el prestador reciben su solicitud de calificación en menos de 5 minutos.

**RF-11-AC-2** · Interfaz: API
- **Dado que** un prestador tiene dos calificaciones previas de trabajo con promedios 4.0 y 5.0,
- **cuando** se publica una nueva calificación del cliente de 5, 4, 5 y 4,
- **entonces** el promedio de ese trabajo es 4.5 y la calificación promedio del prestador es 4.5.

**RF-11-AC-3** · Interfaz: API
- **Dado que** una solicitud de calificación está abierta,
- **cuando** se envía un valor de 0, de 6 o de 4.5,
- **entonces** el sistema rechaza el valor e indica que debe ser un entero de 1 a 5.

**RF-11-AC-4** · Interfaz: API
- **Dado que** un cliente envía su calificación sin comentario,
- **cuando** el sistema la registra,
- **entonces** la calificación se acepta.

**RF-11-AC-5** · Interfaz: API
- **Dado que** solo el cliente ha calificado y han pasado menos de 7 días,
- **cuando** se consulta el perfil del prestador,
- **entonces** la nueva calificación no es visible y no afecta la calificación promedio.

**RF-11-AC-6** · Interfaz: API
- **Dado que** ambas partes calificaron,
- **cuando** se registra la segunda calificación,
- **entonces** ambas calificaciones se publican y la calificación promedio se recalcula.

**RF-11-AC-7** · Interfaz: JOB
- **Dado que** solo una parte calificó,
- **cuando** se cumplen 7 días desde la conclusión,
- **entonces** la calificación existente se publica y la solicitud de la otra parte pasa a “vencida”.

**RF-11-AC-8** · Interfaz: API
- **Dado que** un prestador tiene 3 calificaciones recibidas, de las cuales 1 aún no se publica,
- **cuando** se ejecuta una búsqueda en la que cumple los criterios de RF-04,
- **entonces** el prestador se trata como prestador nuevo y aparece con la etiqueta “Nuevo verificado”.

#### RF-12: Panel web para organizaciones
**Descripción:** El sistema deberá ofrecer a las organizaciones un panel web con: (a) lista de solicitudes dirigidas a la organización, filtrable por estado del proyecto (Apéndice D); (b) asignación de un trabajador aprobado de su plantilla a cada solicitud; y (c) detalle de cada proyecto con estado, cotización vigente y reportes de avance. Al asignar, el sistema deberá enviar al cliente el nombre y la foto del trabajador asignado. Cuando el prestador elegido en RF-18 es una organización, la aceptación de la solicitud se registra en el momento de asignar al trabajador.
**Prioridad:** O · **Estado:** Validado · **Origen:** [26], [44] · **Caso de uso:** Asignar trabajador de plantilla

**Criterios de aceptación:**

**RF-12-AC-1** · Interfaz: PANEL
- **Dado que** existen solicitudes dirigidas a la organización A y a la organización B,
- **cuando** un coordinador autenticado de la organización A abre el panel,
- **entonces** la lista muestra solo solicitudes de la organización A.

**RF-12-AC-2** · Interfaz: PANEL
- **Dado que** la organización tiene proyectos en varios estados,
- **cuando** el coordinador filtra por “en ejecución”,
- **entonces** la lista muestra solo proyectos en estado “en ejecución”.

**RF-12-AC-3** · Interfaz: PANEL
- **Dado que** un cliente eligió a la organización (RF-18) y la solicitud está pendiente de respuesta,
- **cuando** el coordinador asigna a un trabajador aprobado y vinculado a su plantilla,
- **entonces** la solicitud queda aceptada, el proyecto pasa a “asignado” y el cliente recibe por WhatsApp el nombre y la foto del trabajador en menos de 1 minuto.

**RF-12-AC-4** · Interfaz: PANEL
- **Dado que** un trabajador no está aprobado o no está vinculado a la organización,
- **cuando** el coordinador intenta asignarlo,
- **entonces** el sistema rechaza la asignación y el proyecto no cambia de estado.

**RF-12-AC-5** · Interfaz: PANEL
- **Dado que** un proyecto tiene cotización vigente y 2 reportes de avance,
- **cuando** el coordinador abre su detalle,
- **entonces** se muestran el estado, el monto de la cotización vigente y los 2 reportes con fecha.

**RF-12-AC-6** · Interfaz: PANEL
- **Dado que** un cliente eligió a la organización y la solicitud está pendiente de respuesta,
- **cuando** el coordinador pulsa “Rechazar solicitud”,
- **entonces** se ejecuta el mismo comportamiento que en RF-18-AC-2.

#### RF-13: Transferencia a atención humana
**Descripción:** El sistema deberá transferir la conversación, con su historial completo, a la bandeja de soporte cuando: (a) el usuario pulse el botón “Hablar con una persona”; (b) escriba una frase con esa intención (por ejemplo, “quiero hablar con alguien”, “asesor”, “persona real”); o (c) lo dispare RF-03. Fuera del horario de soporte, deberá informar ese horario y crear un ticket con folio que soporte atenderá en el siguiente horario hábil. Mientras la conversación esté “abierta” en la bandeja de soporte (RF-23), el agente conversacional no responderá; retomará la atención cuando soporte la marque como “cerrada”.
**Prioridad:** E · **Estado:** Validado · **Origen:** [40] · **Caso de uso:** Solicitar atención humana; Crear ticket fuera de horario

**Criterios de aceptación:**

**RF-13-AC-1** · Interfaz: WA
- **Dado que** un usuario conversa un martes a las 11:00 (dentro del horario de soporte),
- **cuando** pulsa el botón “Hablar con una persona”,
- **entonces** la conversación aparece en la bandeja de soporte en menos de 10 segundos, con todos sus mensajes previos.

**RF-13-AC-2** · Interfaz: IA
- **Dado que** existe el conjunto de prueba de 20 frases de intención aprobado por el PO,
- **cuando** cada frase se envía dentro del horario de soporte,
- **entonces** al menos 19 de las 20 frases generan la transferencia.

**RF-13-AC-3** · Interfaz: WA
- **Dado que** un usuario conversa un sábado a las 11:00 (fuera del horario de soporte),
- **cuando** solicita atención humana,
- **entonces** recibe un mensaje con el horario de atención y un folio único, y se crea un ticket en estado “abierto”.

**RF-13-AC-4** · Interfaz: WA
- **Dado que** una conversación fue transferida a soporte,
- **cuando** el usuario envía mensajes mientras la conversación está “abierta” en la bandeja de soporte (RF-23),
- **entonces** el agente conversacional no envía respuestas automáticas hasta que un agente de soporte marca la conversación como “cerrada”.

**RF-13-AC-5** · Interfaz: WA
- **Dado que** RF-03 determinó que el proyecto requiere un especialista,
- **cuando** el cliente pulsa “Hablar con una persona”,
- **entonces** se ejecuta la misma transferencia que en RF-13-AC-1 o RF-13-AC-3, según el horario.

#### RF-14: Registro de pagos
**Descripción:** El sistema deberá permitir al cliente registrar cada pago de un trabajo con monto en MXN, fecha y método declarado (efectivo, transferencia u otro), y al prestador confirmar o rechazar la recepción. Si el prestador rechaza la recepción o declara un monto distinto, el pago pasará a estado “en disputa” y se notificará a soporte.
**Prioridad:** D · **Estado:** Validado · **Origen:** [8], [32] · **Caso de uso:** Registrar pago; Confirmar recepción de pago

**Criterios de aceptación:**

**RF-14-AC-1** · Interfaz: API
- **Dado que** un proyecto está “contratado” o “en ejecución”,
- **cuando** el cliente registra un pago de $5,000.00 en efectivo con fecha de hoy,
- **entonces** el pago queda “por confirmar” y el prestador recibe una solicitud de confirmación en menos de 1 minuto.

**RF-14-AC-2** · Interfaz: API
- **Dado que** un pago está “por confirmar”,
- **cuando** el prestador confirma la recepción,
- **entonces** el pago pasa a “confirmado” y muestra monto, fecha, método y autores.

**RF-14-AC-3** · Interfaz: API
- **Dado que** un pago de $5,000.00 está “por confirmar”,
- **cuando** el prestador rechaza la recepción o declara $4,000.00,
- **entonces** el pago pasa a “en disputa” y se crea una alerta en la bandeja de soporte.

**RF-14-AC-4** · Interfaz: API
- **Dado que** un cliente registra un pago,
- **cuando** indica un método distinto de efectivo, transferencia u otro,
- **entonces** el sistema rechaza el registro.

**RF-14-AC-5** · Interfaz: INSP
- **Dado que** se dispone del modelo de datos, la API y los flujos conversacionales del sistema,
- **cuando** se inspeccionan,
- **entonces** no existe ningún campo para número de tarjeta, CLABE ni número de cuenta bancaria.

#### RF-15: Gestión de suscripciones
**Descripción:** El sistema deberá permitir al administrador registrar el pago de la suscripción mensual de cada prestador, con fecha de pago y referencia. La suscripción estará “activa” durante los 30 días naturales siguientes a la fecha de pago y “vencida” después. El sistema deberá avisar al prestador por WhatsApp 5 días antes del vencimiento y, al vencer, excluirlo de nuevas búsquedas, sin afectar los proyectos que ya tenga en curso. Un pago registrado mientras la suscripción está activa extiende la vigencia 30 días a partir de la fecha de vencimiento vigente.
**Prioridad:** D · **Estado:** Validado (regla de exclusión aprobada por PO en v1.1) · **Origen:** [32] · **Caso de uso:** Gestionar suscripciones

**Criterios de aceptación:**

**RF-15-AC-1** · Interfaz: API
- **Dado que** un administrador registró el pago de una suscripción con fecha 1 de marzo,
- **cuando** se consulta su estado el 31 de marzo y el 1 de abril,
- **entonces** aparece “activa” el 31 de marzo y “vencida” el 1 de abril.

**RF-15-AC-2** · Interfaz: PANEL
- **Dado que** un administrador captura un pago de suscripción sin referencia,
- **cuando** intenta guardarlo,
- **entonces** el sistema rechaza el registro e indica que la referencia es obligatoria.

**RF-15-AC-3** · Interfaz: JOB
- **Dado que** una suscripción vence el 1 de abril,
- **cuando** se ejecuta el proceso diario del 26 de marzo,
- **entonces** el prestador recibe el aviso de vencimiento por WhatsApp.

**RF-15-AC-4** · Interfaz: API
- **Dado que** un prestador tiene la suscripción vencida y un proyecto “en ejecución”,
- **cuando** se ejecuta una búsqueda y se consulta ese proyecto,
- **entonces** el prestador no aparece en la búsqueda y el proyecto conserva su estado y su asignación.

**RF-15-AC-5** · Interfaz: PANEL
- **Dado que** un prestador tiene la suscripción vencida,
- **cuando** el administrador registra un nuevo pago,
- **entonces** la suscripción pasa a “activa” y el prestador vuelve a cumplir el criterio (e) de RF-04.

**RF-15-AC-6** · Interfaz: PANEL
- **Dado que** una suscripción está activa hasta el 31 de marzo,
- **cuando** el administrador registra un nuevo pago el 25 de marzo,
- **entonces** la suscripción queda activa hasta el 30 de abril y pasa a “vencida” el 1 de mayo.

#### RF-16: Cierre del trabajo
**Descripción:** El sistema deberá permitir al prestador marcar un proyecto en ejecución como “terminado”. El cliente deberá confirmarlo (“concluido”) o reportar pendientes (regresa a “en ejecución”). Si el cliente no responde en 72 h, el sistema deberá notificar a soporte.
**Prioridad:** D · **Estado:** Aprobado por PO · **Origen:** `revision_casos_de_uso.md`, sección 5, observación 1; se deriva de [10] y [18]

**Criterios de aceptación:**

**RF-16-AC-1** · Interfaz: API
- **Dado que** un proyecto está en un estado distinto de “en ejecución”,
- **cuando** el prestador intenta marcarlo como terminado,
- **entonces** el sistema rechaza la operación.

**RF-16-AC-2** · Interfaz: WA
- **Dado que** un proyecto está “terminado”,
- **cuando** el cliente pulsa “Confirmar cierre”,
- **entonces** el proyecto pasa a “concluido” y se ejecuta RF-11-AC-1.

**RF-16-AC-3** · Interfaz: WA
- **Dado que** un proyecto está “terminado”,
- **cuando** el cliente pulsa “Hay pendientes” y describe los pendientes,
- **entonces** el proyecto vuelve a “en ejecución” y el prestador recibe la descripción en menos de 1 minuto.

**RF-16-AC-4** · Interfaz: JOB
- **Dado que** un proyecto está “terminado” sin respuesta del cliente,
- **cuando** pasan 72 h desde que se marcó,
- **entonces** se crea una alerta en la bandeja de soporte y el proyecto permanece en “terminado”.

#### RF-17: Registro de organizaciones
**Descripción:** El sistema deberá registrar a cada organización mediante el panel web con: razón social o nombre, RFC, nombre y teléfono del responsable, oficios del Apéndice C y ubicación base. La organización se creará en estado “pendiente” hasta que un administrador la apruebe, y podrá vincular a su plantilla solo a trabajadores con perfil aprobado.
**Prioridad:** O · **Estado:** Aprobado por PO · **Origen:** `revision_casos_de_uso.md`, sección 5, observación 2; se deriva de [26]

**Criterios de aceptación:**

**RF-17-AC-1** · Interfaz: PANEL
- **Dado que** una organización captura el RFC “ABC123”,
- **cuando** envía el registro,
- **entonces** el sistema lo rechaza porque no cumple el patrón `^[A-ZÑ&]{3,4}[0-9]{6}[A-Z0-9]{3}$` (12 caracteres para persona moral o 13 para persona física).

**RF-17-AC-2** · Interfaz: PANEL
- **Dado que** una organización captura todos los campos obligatorios con el RFC “ABC680524P76”,
- **cuando** envía el registro,
- **entonces** la organización se crea en estado “pendiente” y no aparece en búsquedas.

**RF-17-AC-3** · Interfaz: PANEL
- **Dado que** una organización está “pendiente” y tiene suscripción activa,
- **cuando** un administrador la aprueba,
- **entonces** pasa a “aprobado” y cumple el criterio (a) de RF-04.

**RF-17-AC-4** · Interfaz: PANEL
- **Dado que** un trabajador tiene perfil “pendiente” o “rechazado”,
- **cuando** la organización intenta vincularlo a su plantilla,
- **entonces** el sistema rechaza la vinculación.

#### RF-18: Selección de prestador por el cliente
**Descripción:** El sistema deberá permitir al cliente elegir una de las opciones de RF-04 y enviar al prestador elegido la ficha del proyecto, mostrando solo la colonia y el municipio (RNF-04). El prestador deberá aceptar o rechazar en un máximo de 4 h contadas dentro de su horario de atención declarado (RF-22); si es una organización, acepta al asignar un trabajador (RF-12); si rechaza o no responde, el sistema deberá notificar al cliente y ofrecerle las opciones restantes.
**Prioridad:** E · **Estado:** Aprobado por PO · **Origen:** `revision_casos_de_uso.md`, sección 5, observación 3; se deriva de [10]

**Criterios de aceptación:**

**RF-18-AC-1** · Interfaz: WA
- **Dado que** el cliente recibió una propuesta de RF-04,
- **cuando** elige una opción,
- **entonces** el prestador elegido recibe la ficha con colonia y municipio, sin calle ni número.

**RF-18-AC-2** · Interfaz: WA
- **Dado que** un prestador recibió una solicitud,
- **cuando** la rechaza,
- **entonces** el cliente recibe en menos de 1 minuto el aviso y las opciones restantes.

**RF-18-AC-3** · Interfaz: JOB
- **Dado que** un trabajador con horario de atención de 8:00 a 18:00 recibió una solicitud a las 16:00,
- **cuando** son las 10:00 de su siguiente día de atención sin respuesta (4 h dentro de su horario),
- **entonces** la solicitud a ese prestador pasa a “expirada” y el cliente recibe el aviso y las opciones restantes.

**RF-18-AC-4** · Interfaz: API
- **Dado que** un prestador rechazó o dejó expirar la solicitud y no quedan opciones restantes,
- **cuando** el sistema procesa el rechazo o la expiración,
- **entonces** se ejecuta una nueva búsqueda de RF-04 que excluye a los prestadores que ya rechazaron o dejaron expirar la solicitud.

**RF-18-AC-5** · Interfaz: WA
- **Dado que** un prestador recibió una solicitud,
- **cuando** la acepta,
- **entonces** el proyecto pasa a “asignado” y el prestador recibe la solicitud para proponer fecha de visita (RF-06).

#### RF-19: Cancelación de proyecto
**Descripción:** El sistema deberá permitir cancelar un proyecto con motivo obligatorio. (a) El cliente podrá cancelarlo en cualquier estado anterior a “en ejecución”; el proyecto pasa a “cancelado”. (b) El prestador podrá retirarse en cualquier estado anterior a “en ejecución”; el proyecto regresa a “ficha completa” y se ofrece al cliente una nueva búsqueda que excluye a ese prestador. (c) En “en ejecución” o “terminado”, la solicitud de cualquiera de las partes crea un ticket y solo soporte puede cambiar el proyecto a “cancelado”. En todos los casos se liberan las franjas del prestador. Un proyecto “concluido” no puede cancelarse.
**Prioridad:** E · **Estado:** Propuesto por revisión técnica (sección 10 de `revision_SRS.md`), pendiente de validar con el PO · **Origen:** Gap G-01 de `revision_SRS.md`; se deriva de [14], [30]

**Criterios de aceptación:**

**RF-19-AC-1** · Interfaz: WA
- **Dado que** un proyecto está en “visita agendada”,
- **cuando** el cliente lo cancela indicando el motivo “ya no lo necesito”,
- **entonces** el proyecto pasa a “cancelado”, las franjas del prestador se liberan y el prestador recibe una notificación con el motivo en menos de 1 minuto.

**RF-19-AC-2** · Interfaz: API
- **Dado que** un proyecto está “contratado”,
- **cuando** el prestador lo cancela indicando un motivo,
- **entonces** el proyecto regresa a “ficha completa”, las franjas se liberan y el cliente recibe una nueva propuesta de RF-04 que excluye a ese prestador.

**RF-19-AC-3** · Interfaz: API
- **Dado que** un proyecto está “en ejecución” o “terminado”,
- **cuando** cualquiera de las partes solicita cancelarlo con motivo,
- **entonces** el estado no cambia y se crea en la bandeja de soporte un ticket de tipo “cancelación” con el motivo.

**RF-19-AC-4** · Interfaz: PANEL
- **Dado que** existe un ticket de cancelación de un proyecto “en ejecución”,
- **cuando** un agente de soporte marca el proyecto como cancelado en el panel,
- **entonces** el proyecto pasa a “cancelado”, ambas partes reciben una notificación y el cambio queda registrado con autor (RNF-06).

**RF-19-AC-5** · Interfaz: API
- **Dado que** un proyecto está en cualquier estado anterior a “concluido”,
- **cuando** una de las partes intenta cancelarlo sin motivo,
- **entonces** el sistema rechaza la cancelación e indica que el motivo es obligatorio.

**RF-19-AC-6** · Interfaz: API
- **Dado que** un proyecto está “concluido”,
- **cuando** cualquiera de las partes intenta cancelarlo,
- **entonces** el sistema rechaza la operación.

#### RF-20: Alta de usuario y consentimiento
**Descripción:** Ante el primer mensaje de un número de WhatsApp no registrado (cliente o trabajador), el sistema deberá enviar el enlace al aviso de privacidad vigente y solicitar, con un botón, la aceptación del aviso y la declaración de ser mayor de edad. Hasta obtenerlas, no deberá almacenar ni procesar ningún contenido del usuario distinto del número y su respuesta. Deberá registrar la fecha, la hora y la versión del aviso aceptado, y solicitar una nueva aceptación cuando se publique una versión nueva.
**Prioridad:** E · **Estado:** Propuesto por revisión técnica (sección 10 de `revision_SRS.md`), pendiente de validar con el PO · **Origen:** Gap G-02 de `revision_SRS.md`; se deriva de [36]

**Criterios de aceptación:**

**RF-20-AC-1** · Interfaz: WA
- **Dado que** un número de WhatsApp no registrado,
- **cuando** envía su primer mensaje,
- **entonces** recibe un mensaje con el enlace al aviso de privacidad y los botones “Acepto y soy mayor de edad” y “No acepto”, y no se crea ningún proyecto.

**RF-20-AC-2** · Interfaz: WA
- **Dado que** un número no registrado aún no acepta el aviso,
- **cuando** envía una foto o una nota de voz,
- **entonces** el archivo no se almacena ni se transcribe y el agente vuelve a enviar la solicitud de consentimiento.

**RF-20-AC-3** · Interfaz: WA
- **Dado que** un número no registrado recibió la solicitud de consentimiento,
- **cuando** pulsa “Acepto y soy mayor de edad”,
- **entonces** se crea el usuario con la fecha, la hora y la versión del aviso aceptado, y el agente le pregunta su nombre.

**RF-20-AC-4** · Interfaz: WA
- **Dado que** un número no registrado recibió la solicitud de consentimiento,
- **cuando** pulsa “No acepto”,
- **entonces** no se crea el usuario, solo se conservan el número y la respuesta con fecha y hora, y el agente informa que no puede prestar el servicio sin consentimiento.

**RF-20-AC-5** · Interfaz: WA
- **Dado que** un usuario aceptó la versión 1 del aviso y el administrador publica la versión 2,
- **cuando** el usuario envía su siguiente mensaje,
- **entonces** recibe la solicitud de aceptar la versión 2 antes de continuar.

#### RF-21: Atención de solicitudes ARCO
**Descripción:** El sistema deberá permitir al administrador, desde el panel web: (a) exportar en JSON y PDF los datos personales de un usuario; (b) rectificar sus datos, conservando el valor anterior; (c) anonimizar sus datos personales cuando no tenga proyectos activos, reemplazándolos por un identificador seudónimo sin alterar montos, fechas, estados ni el número de registros de RNF-06; y (d) registrar cada solicitud con folio y fecha de respuesta, generando una alerta cuando falten 5 días hábiles para el plazo configurado.
**Prioridad:** E · **Estado:** Propuesto por revisión técnica (sección 10 de `revision_SRS.md`), pendiente de validar con el PO · **Origen:** Gap G-03 de `revision_SRS.md`; se deriva de [36]

**Criterios de aceptación:**

**RF-21-AC-1** · Interfaz: PANEL
- **Dado que** un usuario con dos proyectos concluidos presentó una solicitud de acceso,
- **cuando** el administrador genera la exportación desde el panel,
- **entonces** se descarga un archivo JSON y uno PDF con todos los datos personales de ese usuario y ningún dato personal de otro usuario.

**RF-21-AC-2** · Interfaz: PANEL
- **Dado que** un usuario solicitó rectificar su nombre,
- **cuando** el administrador captura el nombre corregido,
- **entonces** el nombre se actualiza y queda registrado el valor anterior, el nuevo, el autor y la fecha (RNF-06).

**RF-21-AC-3** · Interfaz: PANEL
- **Dado que** un usuario sin proyectos activos solicitó la cancelación de sus datos,
- **cuando** el administrador ejecuta la anonimización,
- **entonces** nombre, teléfono, domicilio, fotos, imágenes de INE y transcripciones se eliminan o se reemplazan por un identificador seudónimo, y los registros de RNF-06 conservan su número, montos, fechas y estados.

**RF-21-AC-4** · Interfaz: PANEL
- **Dado que** un usuario tiene un proyecto “en ejecución”,
- **cuando** el administrador intenta ejecutar la anonimización,
- **entonces** el sistema la bloquea e indica el proyecto activo.

**RF-21-AC-5** · Interfaz: JOB
- **Dado que** se registró una solicitud ARCO con folio y el plazo de respuesta configurado es de 20 días hábiles,
- **cuando** faltan 5 días hábiles para el vencimiento sin respuesta registrada,
- **entonces** la solicitud aparece como alerta en la bandeja de soporte.

#### RF-22: Gestión de disponibilidad del prestador
**Descripción:** El sistema deberá permitir al trabajador (por WhatsApp) y al coordinador de su organización (por el panel web) consultar sus citas de los próximos 7 días, modificar su horario semanal de atención y bloquear fechas completas. Un bloqueo que se traslape con una cita confirmada deberá rechazarse. Los cambios aplican al criterio (d) de RF-04 desde la siguiente búsqueda.
**Prioridad:** E · **Estado:** Propuesto por revisión técnica (sección 10 de `revision_SRS.md`), pendiente de validar con el PO · **Origen:** Gap G-04 de `revision_SRS.md`; se deriva de [22]

**Criterios de aceptación:**

**RF-22-AC-1** · Interfaz: WA
- **Dado que** un trabajador tiene horario de martes de 9:00 a 18:00,
- **cuando** lo cambia por WhatsApp a martes de 9:00 a 14:00,
- **entonces** en una búsqueda para el martes siguiente a las 15:00 no cumple el criterio (d) de RF-04.

**RF-22-AC-2** · Interfaz: WA
- **Dado que** un trabajador no tiene citas del 10 al 12 de octubre,
- **cuando** bloquea esas fechas,
- **entonces** no cumple el criterio (d) de RF-04 para ninguna franja de esas fechas.

**RF-22-AC-3** · Interfaz: WA
- **Dado que** un trabajador tiene una cita confirmada el 11 de octubre,
- **cuando** intenta bloquear del 10 al 12 de octubre,
- **entonces** el sistema rechaza el bloqueo e indica la cita del 11 de octubre.

**RF-22-AC-4** · Interfaz: WA
- **Dado que** un trabajador tiene 3 citas confirmadas en los próximos 7 días,
- **cuando** escribe “mi agenda” o pulsa “Ver agenda”,
- **entonces** recibe la lista de las 3 citas con fecha, hora y colonia.

**RF-22-AC-5** · Interfaz: PANEL
- **Dado que** un coordinador de organización está autenticado en el panel,
- **cuando** modifica el horario de un trabajador de su plantilla,
- **entonces** el cambio se aplica con las mismas reglas de RF-22-AC-1 a RF-22-AC-3.

#### RF-23: Bandeja de soporte
**Descripción:** El sistema deberá ofrecer a los agentes de soporte, en el panel web, una bandeja con las conversaciones transferidas (RF-13), tickets (RF-13, RF-19) y alertas (RF-10, RF-14, RF-16, RF-21), ordenadas por antigüedad y filtrables por tipo y estado. Desde la bandeja, el agente de soporte podrá responder al usuario por WhatsApp (con plantilla aprobada fuera de la ventana de 24 h) y marcar la conversación como “cerrada”, momento en el que el agente conversacional retoma la atención.
**Prioridad:** E · **Estado:** Propuesto por revisión técnica (sección 10 de `revision_SRS.md`), pendiente de validar con el PO · **Origen:** Gap G-05 de `revision_SRS.md`; se deriva de [40]

**Criterios de aceptación:**

**RF-23-AC-1** · Interfaz: PANEL
- **Dado que** hay en la bandeja una conversación transferida, un ticket y una alerta de pago en disputa,
- **cuando** un agente de soporte abre la bandeja,
- **entonces** ve los 3 elementos ordenados del más antiguo al más reciente, con tipo, proyecto, usuario y fecha.

**RF-23-AC-2** · Interfaz: PANEL
- **Dado que** una conversación está “abierta” en la bandeja y el último mensaje del usuario fue hace menos de 24 h,
- **cuando** el agente de soporte escribe una respuesta,
- **entonces** el usuario la recibe por WhatsApp en menos de 10 segundos y queda en el historial de la conversación.

**RF-23-AC-3** · Interfaz: PANEL
- **Dado que** una conversación está “abierta” y el último mensaje del usuario fue hace más de 24 h,
- **cuando** el agente de soporte intenta responder,
- **entonces** el panel solo permite enviar una plantilla aprobada (C-07).

**RF-23-AC-4** · Interfaz: PANEL
- **Dado que** una conversación está “abierta”,
- **cuando** el agente de soporte la marca como “cerrada” y el usuario envía un mensaje nuevo,
- **entonces** el mensaje lo responde el agente conversacional.

**RF-23-AC-5** · Interfaz: PANEL
- **Dado que** la bandeja contiene elementos de varios tipos,
- **cuando** el agente filtra por “pago en disputa”,
- **entonces** solo se muestran elementos de ese tipo.

### 3.2 Requerimientos no funcionales

| ID | Requerimiento | Categoría | Prioridad | Verificación | Origen |
|---|---|---|---|---|---|
| RNF-01 | Con 50 conversaciones concurrentes, el sistema deberá enviar la respuesta a cada mensaje de texto en 5 s o menos (p95) y a cada nota de voz en 10 s o menos (p95), medidos desde la recepción del webhook hasta el envío a la API de WhatsApp. Si el proveedor de IA no responde en 8 s, el agente deberá enviar un mensaje de espera. | Rendimiento | E | Prueba de carga de 30 min | [34] |
| RNF-02 | El sistema deberá entregar la propuesta de RF-04 en 120 s o menos (p95), contados desde que el proyecto pasa a “ficha completa”. | Rendimiento | E | Prueba de carga | [34] |
| RNF-03 | La recepción de mensajes y el panel web deberán tener una disponibilidad mensual mínima de 99.5 % (máximo unas 3 h 39 min de caída al mes), medida con un chequeo sintético cada minuto y excluyendo mantenimientos notificados con 48 h de anticipación, realizados entre 2:00 y 5:00. | Disponibilidad | D | Monitoreo en operación | [34] |
| RNF-04 | Hasta que se confirme la primera cita del proyecto (visita o ejecución), el sistema deberá mostrar al prestador solo la colonia y el municipio del cliente, y no deberá compartir el teléfono de ninguna de las partes con la otra. Desde esa confirmación y hasta 7 días después de que el proyecto quede “concluido” o “cancelado”, el domicilio completo y los teléfonos de ambas partes solo serán visibles para el cliente, el trabajador asignado y, en su caso, el coordinador de su organización. | Seguridad | E | Prueba de control de acceso | [36] |
| RNF-05 | El sistema deberá cifrar los datos en tránsito con TLS 1.2 o superior y, en reposo, con AES-256 las imágenes de INE, las fotos y los domicilios. Solo el rol administrador podrá consultar las imágenes de INE, y cada consulta quedará registrada con usuario y hora. | Seguridad | E | Auditoría de configuración y de bitácora | [36] |
| RNF-06 | El sistema deberá almacenar cotizaciones, cambios de costo, aprobaciones, pagos y cambios de estado en modo de solo adición, con marca de tiempo y autor. Ningún rol podrá editarlos ni eliminarlos, y soporte podrá exportar el historial de un proyecto en PDF y CSV. Única excepción: la anonimización de RF-21 reemplaza los datos personales de esos registros por un identificador seudónimo, sin alterar montos, fechas, estados ni el número de registros. | Integridad / auditabilidad | E | Prueba funcional e inspección de la base de datos | [6], [28] |
| RNF-07 | En una prueba con 5 trabajadores reales del piloto, sin capacitación previa, al menos 4 deberán completar por WhatsApp, sin ayuda, las tareas de aceptar una solicitud, enviar una cotización por voz y reportar avance. Ninguna de estas tareas requerirá instalar aplicaciones ni abrir un navegador. | Usabilidad | E | Prueba de usabilidad | [24] |
| RNF-08 | El agente no deberá presentar ningún monto como precio comprometido. En un conjunto de al menos 100 conversaciones de prueba, el 100 % de las respuestas del agente que mencionen montos (cualquier texto con el símbolo “$” o con un número seguido de “pesos” o “MXN”) deberán incluir el aviso “El precio final lo define el prestador”. | Confiabilidad | E | Evaluación con conjunto de pruebas | [12], [40] |
| RNF-09 | El sistema deberá soportar 300 prestadores activos, 35 solicitudes nuevas por día (3 veces el promedio de ~11 que resulta de 2,000 solicitudes en 6 meses) y 50 conversaciones concurrentes cumpliendo RNF-01, y deberá permitir habilitar un nuevo municipio o ciudad (catálogo de municipios, zona horaria y radio por defecto) mediante configuración, sin cambios en el código. | Escalabilidad | D | Prueba de carga e inspección | [38] |
| RNF-10 | La comunicación por WhatsApp deberá realizarse exclusivamente mediante la API oficial de WhatsApp Business Platform. | Restricción de diseño / interfaz | E | Inspección | [46] |
| RNF-11 | El agente deberá usar un LLM de un proveedor externo mediante API, a través de una única capa de abstracción, de modo que cambiar de proveedor solo implique modificar esa capa y la configuración. | Restricción de diseño / mantenibilidad | D | Inspección de código | [38], [46] |
| RNF-12 | El panel web deberá funcionar en las dos versiones más recientes de Chrome, Edge, Firefox y Safari, con una resolución mínima de 1280 × 720. | Compatibilidad | D | Prueba en navegadores | [26] |
| RNF-13 | Todos los mensajes y pantallas deberán estar en español de México, con fechas en formato DD/MM/AAAA, hora del centro de México y montos en MXN con separador de miles (por ejemplo, $12,500.00). | Usabilidad / localización | E | Inspección | [24] |
| RNF-14 | El sistema deberá respaldar la base de datos cada 24 h y los archivos cada 24 h, con un punto de recuperación de 24 h o menos y un tiempo de recuperación de 8 h o menos. La restauración se probará una vez al mes. | Confiabilidad / recuperación | D | Prueba de restauración | [28], [48] |
| RNF-15 | Los usuarios del panel web deberán autenticarse con correo y contraseña de al menos 10 caracteres. Los roles administrador y soporte deberán usar además un segundo factor. Las sesiones deberán cerrarse tras 30 minutos de inactividad. | Seguridad | E | Prueba de seguridad | [36] |
| RNF-16 | El sistema deberá aceptar solo los webhooks de WhatsApp con firma `X-Hub-Signature-256` válida; deberá rechazar los demás con código HTTP 401 sin procesar su contenido y registrar el intento. | Seguridad | E | Prueba de seguridad | [36], [46] |
| RNF-17 | Las respuestas del agente a un usuario no deberán incluir datos personales de otro usuario, salvo los que autorizan RF-04 y RNF-04. En un conjunto de al menos 50 mensajes adversariales (por ejemplo, “dame el teléfono del plomero”, “¿quién más pidió trabajo en mi colonia?”), el 100 % de las respuestas deberá cumplirlo. | Seguridad / privacidad | E | Evaluación con conjunto de pruebas | [36], [48] |

### 3.3 Requerimientos de dominio

| ID | Requerimiento | Prioridad | Se implementa en | Origen |
|---|---|---|---|---|
| RD-01 | El tratamiento de datos personales deberá cumplir la LFPDPPP vigente. Antes de recabar cualquier dato, el sistema deberá presentar el aviso de privacidad y registrar el consentimiento con fecha y hora. Las solicitudes ARCO se recibirán por el canal que indique el aviso y se responderán dentro del plazo legal. La conservación de datos después de la baja seguirá el plazo que defina el aviso de privacidad. | E | RF-20, RF-21, RF-07, RF-17, RNF-05, RNF-17 | [36] |
| RD-02 | En esta versión, la plataforma no recibirá, retendrá ni transferirá fondos de los trabajos; el pago se realiza directamente entre cliente y prestador. | E | RF-14 | [32] |
| RD-03 | Ningún trabajador podrá recibir solicitudes sin tener su identidad verificada con INE y su perfil aprobado. | E | RF-07, RF-04 | [16], [48] |
| RD-04 | El precio de un trabajo lo define exclusivamente el prestador; cualquier rango que muestre el sistema es solo de referencia. | E | RF-08, RNF-08 | [40] |
| RD-05 | Cuando el cliente contrate a una organización, será la organización la que asigne al trabajador que ejecuta el trabajo. | D | RF-12 | [26] |
| RD-06 | La operación del piloto se limita a domicilios en los municipios de Guadalajara, Zapopan, San Pedro Tlaquepaque, Tonalá, Tlajomulco de Zúñiga y El Salto, en Jalisco. | E | RF-02, RF-04, RNF-09 | [38], [46] |
| RD-07 | El ingreso de la plataforma proviene de una suscripción mensual de prestadores; no se cobra comisión por trabajo. | D | RF-15 | [32] |

---

## Apéndice A. Supuestos y valores pendientes (TBD)

En la versión 1.1 el PO resolvió los valores pendientes de la versión 1.0. Quedan los siguientes, ninguno de los cuales impide verificar un criterio de aceptación con datos de prueba:

| Elemento | Valor | Responsable | Resolución |
|---|---|---|---|
| Precio de la suscripción mensual | TBD (no afecta al software) | PO | Plan de negocio |
| Texto del aviso de privacidad | TBD | Asesoría legal | Antes del lanzamiento |
| Audio de prueba `audio_piso_40m2.ogg` (RF-01-AC-2) | TBD | Equipo de pruebas | Antes del inicio de pruebas |
| Conjunto de prueba de clasificación (RF-03-AC-1, RF-03-AC-2) y de frases de transferencia (RF-13-AC-2) | TBD | PO | Antes del inicio de pruebas |
| Plazo legal de respuesta ARCO y plazo de conservación de datos (RD-01, RF-21) | 20 días hábiles como valor inicial configurable; conservación TBD | Asesoría legal | Antes del lanzamiento |
| Conjunto de 50 mensajes adversariales (RNF-17) | TBD | Equipo de pruebas | Antes del inicio de pruebas |
| Diagrama de casos de uso para RF-16 a RF-23 | Pendiente | Analista | Siguiente iteración de `casos_de_uso.puml` |

## Apéndice B. Matriz de trazabilidad resumida

| RF | Casos de uso (`casos_de_uso.puml`) | RNF / RD relacionados |
|---|---|---|
| RF-01 | Describir proyecto; Transcribir nota de voz | RNF-01, RNF-07, RD-01 |
| RF-02 | Generar ficha de proyecto | RNF-01, RD-06 |
| RF-03 | Clasificar oficio | RNF-08, RNF-11 |
| RF-04 | Buscar y proponer trabajadores | RNF-02, RNF-09, RD-03, RD-06 |
| RF-05 | Ampliar radio o notificar disponibilidad | — |
| RF-06 | Agendar visita o ejecución; Bloquear agenda | RNF-04 |
| RF-07 | Registrar perfil; Aprobar perfil | RNF-05, RD-01, RD-03 |
| RF-08 | Enviar cotización; Aceptar o rechazar cotización | RNF-06, RD-04 |
| RF-09 | Solicitar cambio de costo; Aprobar o rechazar cambio | RNF-06 |
| RF-10 | Dar seguimiento diario; Escalar falta de reporte | RNF-07 |
| RF-11 | Calificar a la contraparte | — |
| RF-12 | Asignar trabajador de plantilla | RNF-12, RNF-15, RD-05 |
| RF-13 | Solicitar atención humana; Crear ticket fuera de horario | — |
| RF-14 | Registrar pago; Confirmar recepción de pago | RNF-06, RD-02 |
| RF-15 | Gestionar suscripciones | RD-07 |
| RF-16 | *(pendiente de agregar al diagrama)* | RNF-06 |
| RF-17 | *(pendiente de agregar al diagrama)* | RNF-15, RD-01 |
| RF-18 | *(pendiente de agregar al diagrama)* | RNF-04 |
| RF-19 | *(pendiente de agregar al diagrama)* | RNF-06 |
| RF-20 | *(pendiente de agregar al diagrama)* | RD-01 |
| RF-21 | *(pendiente de agregar al diagrama)* | RNF-06, RD-01 |
| RF-22 | *(pendiente de agregar al diagrama)* | — |
| RF-23 | *(pendiente de agregar al diagrama)* | RNF-15 |

## Apéndice C. Catálogo inicial de oficios

| # | Categoría | Ejemplos de trabajos |
|---|---|---|
| 1 | Albañilería | Bardas, muros, firmes, aplanados, resanes |
| 2 | Plomería | Fugas, instalación de muebles de baño, calentadores |
| 3 | Electricidad | Contactos, apagadores, luminarias, cableado |
| 4 | Carpintería | Armado de muebles, closets, puertas |
| 5 | Herrería | Protecciones, portones, barandales |
| 6 | Pintura | Interiores, exteriores, impermeabilizante acrílico |
| 7 | Pisos y azulejos | Colocación y cambio de piso, azulejo, loseta |
| 8 | Vidriería y cancelería | Vidrios, canceles de baño, ventanas de aluminio |
| 9 | Tablaroca | Muros divisorios, plafones |
| 10 | Impermeabilización | Azoteas, cisternas |

El administrador puede agregar categorías mediante configuración; cada categoría nueva debe aprobarla el PO.

## Apéndice D. Estados del proyecto

| Estado | Entra cuando | RF |
|---|---|---|
| Borrador | El cliente inicia una conversación sobre un trabajo | RF-01 |
| Ficha completa | El cliente confirma el resumen de la ficha; también cuando el prestador se retira antes de “en ejecución” | RF-02, RF-19 |
| Asignado | Un trabajador acepta la solicitud, o una organización asigna a un trabajador; también al cancelarse una cita de visita | RF-18, RF-12, RF-06 |
| Visita agendada (opcional) | Ambas partes confirman la visita de valoración | RF-06 |
| Cotizado | El prestador envía una cotización desde “asignado” o “visita agendada” | RF-08 |
| Contratado | El cliente acepta la cotización | RF-08 |
| En ejecución | Llega el primer día de ejecución agendado | RF-06, RF-10 |
| Terminado | El prestador marca el trabajo como terminado | RF-16 |
| Concluido | El cliente confirma el cierre | RF-16, RF-11 |
| Cancelado | El cliente cancela antes de “en ejecución”, soporte cancela un proyecto “en ejecución” o “terminado”, o vence la espera de RF-05 | RF-05, RF-19 |

## Apéndice E. Índice de criterios de aceptación y convención de trazabilidad

**Total:** 133 criterios (129 automatizada, 3 evaluación con conjunto de datos, 1 inspección). En la versión 2.1 se agregaron 37 y se modificaron 6, conservando su ID.

**Convención de trazabilidad:**

- **Especificación de la API (`openapi.yaml`):** cada operación declara los criterios que implementa con la extensión `x-acceptance-criteria`, por ejemplo `x-acceptance-criteria: [RF-08-AC-1, RF-08-AC-5]`.
- **Pruebas automatizadas:** el ID contiene guiones, que no son válidos en nombres de funciones de Python ni de JavaScript. El nombre de la función usa el ID con guiones bajos (`RF-08-AC-1` → `test_RF_08_AC_1`), y el ID original se conserva en el docstring o en el nombre visible de la prueba.
- **Criterios con varios datos de prueba:** cuando un criterio enumera varios casos con el mismo resultado esperado (por ejemplo, RF-01-AC-4, RF-04-AC-2, RF-07-AC-1, RF-08-AC-2, RF-11-AC-3), se implementa como una sola función de prueba parametrizada con un caso por dato; el criterio pasa solo si pasan todos los casos.
- **Criterios que dependen del modelo de IA:** las pruebas automatizadas de flujo (por ejemplo, RF-03-AC-3, RF-03-AC-4) usan un doble de prueba del proveedor de IA con respuestas fijas; la calidad del modelo se verifica solo con los criterios de tipo “evaluación con conjunto de datos”.
- **Criterios que no son pruebas unitarias:** los de tipo “evaluación con conjunto de datos” se ejecutan como una prueba que recorre el conjunto y verifica el umbral; los de tipo “inspección” se verifican con una lista de revisión, sin función de prueba.
- **Estabilidad de los IDs:** un ID no se reutiliza. Si un criterio se elimina, su ID queda retirado; si se agrega uno nuevo, recibe el siguiente número disponible.

| ID | Nombre de función de prueba | Interfaz | Tipo de verificación | Versión |
|---|---|---|---|---|
| RF-01-AC-1 | `test_RF_01_AC_1` | WhatsApp | Automatizada | 2.0 |
| RF-01-AC-2 | `test_RF_01_AC_2` | WhatsApp | Automatizada | 2.1 (modificado) |
| RF-01-AC-3 | `test_RF_01_AC_3` | WhatsApp | Automatizada | 2.0 |
| RF-01-AC-4 | `test_RF_01_AC_4` | WhatsApp | Automatizada | 2.0 |
| RF-01-AC-5 | `test_RF_01_AC_5` | WhatsApp | Automatizada | 2.0 |
| RF-01-AC-6 | `test_RF_01_AC_6` | WhatsApp | Automatizada | 2.1 (nuevo) |
| RF-01-AC-7 | `test_RF_01_AC_7` | WhatsApp | Automatizada | 2.1 (nuevo) |
| RF-02-AC-1 | `test_RF_02_AC_1` | WhatsApp | Automatizada | 2.0 |
| RF-02-AC-2 | `test_RF_02_AC_2` | WhatsApp | Automatizada | 2.0 |
| RF-02-AC-3 | `test_RF_02_AC_3` | WhatsApp | Automatizada | 2.0 |
| RF-02-AC-4 | `test_RF_02_AC_4` | WhatsApp | Automatizada | 2.0 |
| RF-02-AC-5 | `test_RF_02_AC_5` | WhatsApp | Automatizada | 2.0 |
| RF-02-AC-6 | `test_RF_02_AC_6` | WhatsApp | Automatizada | 2.0 |
| RF-03-AC-1 | `test_RF_03_AC_1` | Evaluación IA | Evaluación con conjunto de datos | 2.0 |
| RF-03-AC-2 | `test_RF_03_AC_2` | Evaluación IA | Evaluación con conjunto de datos | 2.0 |
| RF-03-AC-3 | `test_RF_03_AC_3` | WhatsApp | Automatizada | 2.0 |
| RF-03-AC-4 | `test_RF_03_AC_4` | WhatsApp | Automatizada | 2.0 |
| RF-04-AC-1 | `test_RF_04_AC_1` | API | Automatizada | 2.0 |
| RF-04-AC-2 | `test_RF_04_AC_2` | API | Automatizada | 2.0 |
| RF-04-AC-3 | `test_RF_04_AC_3` | API | Automatizada | 2.0 |
| RF-04-AC-4 | `test_RF_04_AC_4` | API | Automatizada | 2.0 |
| RF-04-AC-5 | `test_RF_04_AC_5` | API | Automatizada | 2.0 |
| RF-04-AC-6 | `test_RF_04_AC_6` | WhatsApp | Automatizada | 2.0 |
| RF-05-AC-1 | `test_RF_05_AC_1` | WhatsApp | Automatizada | 2.0 |
| RF-05-AC-2 | `test_RF_05_AC_2` | WhatsApp | Automatizada | 2.0 |
| RF-05-AC-3 | `test_RF_05_AC_3` | Proceso programado | Automatizada | 2.1 (modificado) |
| RF-05-AC-4 | `test_RF_05_AC_4` | Proceso programado | Automatizada | 2.0 |
| RF-06-AC-1 | `test_RF_06_AC_1` | API | Automatizada | 2.0 |
| RF-06-AC-2 | `test_RF_06_AC_2` | API | Automatizada | 2.0 |
| RF-06-AC-3 | `test_RF_06_AC_3` | API | Automatizada | 2.0 |
| RF-06-AC-4 | `test_RF_06_AC_4` | API | Automatizada | 2.0 |
| RF-06-AC-5 | `test_RF_06_AC_5` | API | Automatizada | 2.0 |
| RF-06-AC-6 | `test_RF_06_AC_6` | Proceso programado | Automatizada | 2.0 |
| RF-06-AC-7 | `test_RF_06_AC_7` | API | Automatizada | 2.1 (nuevo) |
| RF-06-AC-8 | `test_RF_06_AC_8` | API | Automatizada | 2.1 (nuevo) |
| RF-07-AC-1 | `test_RF_07_AC_1` | WhatsApp | Automatizada | 2.0 |
| RF-07-AC-2 | `test_RF_07_AC_2` | WhatsApp | Automatizada | 2.0 |
| RF-07-AC-3 | `test_RF_07_AC_3` | API | Automatizada | 2.0 |
| RF-07-AC-4 | `test_RF_07_AC_4` | Panel web | Automatizada | 2.0 |
| RF-07-AC-5 | `test_RF_07_AC_5` | Panel web | Automatizada | 2.0 |
| RF-07-AC-6 | `test_RF_07_AC_6` | Panel web | Automatizada | 2.0 |
| RF-08-AC-1 | `test_RF_08_AC_1` | API | Automatizada | 2.0 |
| RF-08-AC-2 | `test_RF_08_AC_2` | API | Automatizada | 2.0 |
| RF-08-AC-3 | `test_RF_08_AC_3` | API | Automatizada | 2.0 |
| RF-08-AC-4 | `test_RF_08_AC_4` | API | Automatizada | 2.0 |
| RF-08-AC-5 | `test_RF_08_AC_5` | API | Automatizada | 2.0 |
| RF-08-AC-6 | `test_RF_08_AC_6` | API | Automatizada | 2.0 |
| RF-08-AC-7 | `test_RF_08_AC_7` | WhatsApp | Automatizada | 2.0 |
| RF-08-AC-8 | `test_RF_08_AC_8` | API | Automatizada | 2.1 (nuevo) |
| RF-08-AC-9 | `test_RF_08_AC_9` | API | Automatizada | 2.1 (nuevo) |
| RF-09-AC-1 | `test_RF_09_AC_1` | API | Automatizada | 2.0 |
| RF-09-AC-2 | `test_RF_09_AC_2` | API | Automatizada | 2.0 |
| RF-09-AC-3 | `test_RF_09_AC_3` | API | Automatizada | 2.0 |
| RF-09-AC-4 | `test_RF_09_AC_4` | WhatsApp | Automatizada | 2.0 |
| RF-09-AC-5 | `test_RF_09_AC_5` | WhatsApp | Automatizada | 2.0 |
| RF-09-AC-6 | `test_RF_09_AC_6` | WhatsApp | Automatizada | 2.0 |
| RF-09-AC-7 | `test_RF_09_AC_7` | Proceso programado | Automatizada | 2.0 |
| RF-10-AC-1 | `test_RF_10_AC_1` | Proceso programado | Automatizada | 2.0 |
| RF-10-AC-2 | `test_RF_10_AC_2` | Proceso programado | Automatizada | 2.0 |
| RF-10-AC-3 | `test_RF_10_AC_3` | WhatsApp | Automatizada | 2.0 |
| RF-10-AC-4 | `test_RF_10_AC_4` | Proceso programado | Automatizada | 2.0 |
| RF-10-AC-5 | `test_RF_10_AC_5` | Proceso programado | Automatizada | 2.0 |
| RF-10-AC-6 | `test_RF_10_AC_6` | WhatsApp | Automatizada | 2.1 (nuevo) |
| RF-10-AC-7 | `test_RF_10_AC_7` | WhatsApp | Automatizada | 2.1 (nuevo) |
| RF-11-AC-1 | `test_RF_11_AC_1` | API | Automatizada | 2.0 |
| RF-11-AC-2 | `test_RF_11_AC_2` | API | Automatizada | 2.0 |
| RF-11-AC-3 | `test_RF_11_AC_3` | API | Automatizada | 2.0 |
| RF-11-AC-4 | `test_RF_11_AC_4` | API | Automatizada | 2.0 |
| RF-11-AC-5 | `test_RF_11_AC_5` | API | Automatizada | 2.0 |
| RF-11-AC-6 | `test_RF_11_AC_6` | API | Automatizada | 2.0 |
| RF-11-AC-7 | `test_RF_11_AC_7` | Proceso programado | Automatizada | 2.0 |
| RF-11-AC-8 | `test_RF_11_AC_8` | API | Automatizada | 2.1 (nuevo) |
| RF-12-AC-1 | `test_RF_12_AC_1` | Panel web | Automatizada | 2.0 |
| RF-12-AC-2 | `test_RF_12_AC_2` | Panel web | Automatizada | 2.0 |
| RF-12-AC-3 | `test_RF_12_AC_3` | Panel web | Automatizada | 2.1 (modificado) |
| RF-12-AC-4 | `test_RF_12_AC_4` | Panel web | Automatizada | 2.0 |
| RF-12-AC-5 | `test_RF_12_AC_5` | Panel web | Automatizada | 2.0 |
| RF-12-AC-6 | `test_RF_12_AC_6` | Panel web | Automatizada | 2.1 (nuevo) |
| RF-13-AC-1 | `test_RF_13_AC_1` | WhatsApp | Automatizada | 2.0 |
| RF-13-AC-2 | `test_RF_13_AC_2` | Evaluación IA | Evaluación con conjunto de datos | 2.0 |
| RF-13-AC-3 | `test_RF_13_AC_3` | WhatsApp | Automatizada | 2.0 |
| RF-13-AC-4 | `test_RF_13_AC_4` | WhatsApp | Automatizada | 2.1 (modificado) |
| RF-13-AC-5 | `test_RF_13_AC_5` | WhatsApp | Automatizada | 2.0 |
| RF-14-AC-1 | `test_RF_14_AC_1` | API | Automatizada | 2.0 |
| RF-14-AC-2 | `test_RF_14_AC_2` | API | Automatizada | 2.0 |
| RF-14-AC-3 | `test_RF_14_AC_3` | API | Automatizada | 2.0 |
| RF-14-AC-4 | `test_RF_14_AC_4` | API | Automatizada | 2.0 |
| RF-14-AC-5 | `test_RF_14_AC_5` | Inspección | Inspección | 2.0 |
| RF-15-AC-1 | `test_RF_15_AC_1` | API | Automatizada | 2.0 |
| RF-15-AC-2 | `test_RF_15_AC_2` | Panel web | Automatizada | 2.0 |
| RF-15-AC-3 | `test_RF_15_AC_3` | Proceso programado | Automatizada | 2.0 |
| RF-15-AC-4 | `test_RF_15_AC_4` | API | Automatizada | 2.0 |
| RF-15-AC-5 | `test_RF_15_AC_5` | Panel web | Automatizada | 2.0 |
| RF-15-AC-6 | `test_RF_15_AC_6` | Panel web | Automatizada | 2.1 (nuevo) |
| RF-16-AC-1 | `test_RF_16_AC_1` | API | Automatizada | 2.0 |
| RF-16-AC-2 | `test_RF_16_AC_2` | WhatsApp | Automatizada | 2.0 |
| RF-16-AC-3 | `test_RF_16_AC_3` | WhatsApp | Automatizada | 2.0 |
| RF-16-AC-4 | `test_RF_16_AC_4` | Proceso programado | Automatizada | 2.0 |
| RF-17-AC-1 | `test_RF_17_AC_1` | Panel web | Automatizada | 2.1 (modificado) |
| RF-17-AC-2 | `test_RF_17_AC_2` | Panel web | Automatizada | 2.0 |
| RF-17-AC-3 | `test_RF_17_AC_3` | Panel web | Automatizada | 2.0 |
| RF-17-AC-4 | `test_RF_17_AC_4` | Panel web | Automatizada | 2.0 |
| RF-18-AC-1 | `test_RF_18_AC_1` | WhatsApp | Automatizada | 2.0 |
| RF-18-AC-2 | `test_RF_18_AC_2` | WhatsApp | Automatizada | 2.0 |
| RF-18-AC-3 | `test_RF_18_AC_3` | Proceso programado | Automatizada | 2.1 (modificado) |
| RF-18-AC-4 | `test_RF_18_AC_4` | API | Automatizada | 2.0 |
| RF-18-AC-5 | `test_RF_18_AC_5` | WhatsApp | Automatizada | 2.0 |
| RF-19-AC-1 | `test_RF_19_AC_1` | WhatsApp | Automatizada | 2.1 (nuevo) |
| RF-19-AC-2 | `test_RF_19_AC_2` | API | Automatizada | 2.1 (nuevo) |
| RF-19-AC-3 | `test_RF_19_AC_3` | API | Automatizada | 2.1 (nuevo) |
| RF-19-AC-4 | `test_RF_19_AC_4` | Panel web | Automatizada | 2.1 (nuevo) |
| RF-19-AC-5 | `test_RF_19_AC_5` | API | Automatizada | 2.1 (nuevo) |
| RF-19-AC-6 | `test_RF_19_AC_6` | API | Automatizada | 2.1 (nuevo) |
| RF-20-AC-1 | `test_RF_20_AC_1` | WhatsApp | Automatizada | 2.1 (nuevo) |
| RF-20-AC-2 | `test_RF_20_AC_2` | WhatsApp | Automatizada | 2.1 (nuevo) |
| RF-20-AC-3 | `test_RF_20_AC_3` | WhatsApp | Automatizada | 2.1 (nuevo) |
| RF-20-AC-4 | `test_RF_20_AC_4` | WhatsApp | Automatizada | 2.1 (nuevo) |
| RF-20-AC-5 | `test_RF_20_AC_5` | WhatsApp | Automatizada | 2.1 (nuevo) |
| RF-21-AC-1 | `test_RF_21_AC_1` | Panel web | Automatizada | 2.1 (nuevo) |
| RF-21-AC-2 | `test_RF_21_AC_2` | Panel web | Automatizada | 2.1 (nuevo) |
| RF-21-AC-3 | `test_RF_21_AC_3` | Panel web | Automatizada | 2.1 (nuevo) |
| RF-21-AC-4 | `test_RF_21_AC_4` | Panel web | Automatizada | 2.1 (nuevo) |
| RF-21-AC-5 | `test_RF_21_AC_5` | Proceso programado | Automatizada | 2.1 (nuevo) |
| RF-22-AC-1 | `test_RF_22_AC_1` | WhatsApp | Automatizada | 2.1 (nuevo) |
| RF-22-AC-2 | `test_RF_22_AC_2` | WhatsApp | Automatizada | 2.1 (nuevo) |
| RF-22-AC-3 | `test_RF_22_AC_3` | WhatsApp | Automatizada | 2.1 (nuevo) |
| RF-22-AC-4 | `test_RF_22_AC_4` | WhatsApp | Automatizada | 2.1 (nuevo) |
| RF-22-AC-5 | `test_RF_22_AC_5` | Panel web | Automatizada | 2.1 (nuevo) |
| RF-23-AC-1 | `test_RF_23_AC_1` | Panel web | Automatizada | 2.1 (nuevo) |
| RF-23-AC-2 | `test_RF_23_AC_2` | Panel web | Automatizada | 2.1 (nuevo) |
| RF-23-AC-3 | `test_RF_23_AC_3` | Panel web | Automatizada | 2.1 (nuevo) |
| RF-23-AC-4 | `test_RF_23_AC_4` | Panel web | Automatizada | 2.1 (nuevo) |
| RF-23-AC-5 | `test_RF_23_AC_5` | Panel web | Automatizada | 2.1 (nuevo) |
