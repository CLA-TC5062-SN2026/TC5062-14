# Comparación a nivel de requerimiento — SRS del equipo (UnCalificado)

## Convenciones

| Etiqueta | Archivo |
|---|---|
| **I1** | `SRS del equipo/SRS_final.md` |
| **I2** | `SRS del equipo/SRS_final 1.md` |
| **I3** | `SRS del equipo/SRS_final 2.md` |
| **I4** | `SRS del equipo/SRS_final 3.md` |

- Los IDs se conservan tal como aparecen en su SRS, con prefijo de integrante (`I2:RF-08`), porque **el mismo ID significa cosas distintas en cada documento**. No se renumeró nada.
- **Tipo:** RF = requerimiento funcional · RNF = requerimiento no funcional · Regla de negocio (RD / reglas de dominio) · Decisión técnica (tecnología o valor de ingeniería fijado por el autor) · Fuera del MVP · Dato lógico · Restricción.
- **Estado comparativo:**
  - **CONSENSO:** el requerimiento está esencialmente en los 4 SRS.
  - **GAP:** solo está en uno o algunos.
  - **CONFLICTO:** dos o más SRS lo definen de forma incompatible.
  - **Criterio estricto para CONFLICTO:** solo se marca cuando **ninguna implementación única puede cumplir ambos SRS a la vez**. Si las definiciones difieren pero son compatibles (por ejemplo, un rango que se traslapa con otro, o un umbral más estricto que satisface al más laxo), se marca GAP o CONSENSO y la diferencia se anota.
- Cuando un requerimiento mezcla partes en consenso y partes en conflicto, se separa por criterio de aceptación (`-AC-n`).
- Todas las decisiones quedan **Pendientes de decisión del equipo**.

---

## 1. Canal de interacción (web / WhatsApp)

| Tema | SRS de origen | ID original | Descripción | Tipo | Estado comparativo | Requerimientos relacionados |
|---|---|---|---|---|---|---|
| Canal | I1 | RE-01, §2.5 | Aplicación web responsive; sin integración con WhatsApp en el MVP ("decisión de alcance del analista") | Decisión técnica | **CONFLICTO** | I2:C-01, I2:RNF-10; I3 §2.1, §3.1.4; I4:RNF-06 |
| Canal | I1 | §10 (sin RF) | Integración con WhatsApp | Fuera del MVP | **CONFLICTO** | I2:C-01, I2:RNF-10 |
| Canal | I2 | §1.2, §2.3, C-01 | El agente opera por WhatsApp para cliente y trabajador; panel web para organización, administración y soporte | Decisión técnica | **CONFLICTO** | I1:RE-01; I3 §3.1.4; I4:RNF-06 |
| Canal | I2 | RNF-10 | Comunicación por WhatsApp exclusivamente mediante la API oficial de WhatsApp Business Platform | Decisión técnica | **CONFLICTO** | I1:RE-01 |
| Canal | I2 | RNF-07 | 4 de 5 trabajadores completan tareas por WhatsApp sin ayuda; ninguna tarea requiere navegador ni instalar apps | RNF | **CONFLICTO** | I1:RNF-02; I3:RNF-02 (flujos desde navegador móvil) |
| Canal | I2 | C-07 | Mensajes fuera de la ventana de 24 h solo con plantillas aprobadas por Meta | Decisión técnica | GAP | Depende de I2:C-01 |
| Canal | I2 | RNF-16 | Aceptar solo webhooks con firma `X-Hub-Signature-256` válida | Decisión técnica | GAP | Depende de I2:C-01 |
| Canal | I2 | RNF-12 | Panel web en las 2 versiones más recientes de Chrome, Edge, Firefox y Safari; mínimo 1280 × 720 | RNF | GAP | I4:RNF-06 |
| Canal | I2 | §1.2 | Aplicación móvil nativa | Fuera del MVP | CONSENSO | I1 §2.5, I3 §2.1, I4:RNF-06 (ninguno plantea app nativa) |
| Canal | I3 | §2.1, §3.1.4 | Web responsive; notificaciones in-app y por correo; "no se requiere integración con mensajería instantánea" | Decisión técnica | **CONFLICTO** | I2:C-01 |
| Canal | I4 | RNF-06 | Interfaz web utilizable en navegadores de escritorio y móviles de uso común | RNF | **CONFLICTO** | I2:C-01 |

## 2. Notas de voz y formatos multimedia

| Tema | SRS de origen | ID original | Descripción | Tipo | Estado comparativo | Requerimientos relacionados |
|---|---|---|---|---|---|---|
| Notas de voz | I1 | RF-33 (§10) | Envío de audio en la conversación | Fuera del MVP | **CONFLICTO** | I2:RF-01 |
| Notas de voz / multimedia | I2 | RF-01 | Recibir texto, JPG/PNG de hasta 5 MB y voz de hasta 3 min con transcripción; máximo 10 imágenes por proyecto; preguntar a qué proyecto corresponde si hay varios | RF | **CONFLICTO** (voz, video) | I1:RF-02, I1:RF-33; I3:RF-01; I4:RF-01 |
| Notas de voz | I2 | RF-08-AC-7 | El prestador dicta la cotización por voz; el agente la estructura y el prestador la confirma | RF | **CONFLICTO** | I1:RF-33 |
| Notas de voz | I2 | RNF-01 | Respuesta a notas de voz en 10 s o menos (p95) | RNF | **CONFLICTO** | I1:RF-33 |
| Video | I2 | RF-01-AC-4 | Un video o PDF **no se procesa** | RF | **CONFLICTO** | I3:RF-01, I3:RF-03 |
| Video | I3 | RF-01, RF-03 | La solicitud acepta "fotografías o videos opcionales"; un video del espacio cuenta para la aptitud de cotización | RF | **CONFLICTO** | I2:RF-01-AC-4 |
| Límites de archivo | I2 | RF-01-AC-3, AC-5 | Límite de 5 MB y de 10 imágenes | RF | GAP | — |
| Fotos en la solicitud | I1 | RF-02 | Adjuntar fotos durante la conversación | RF | CONSENSO | I2:RF-01, I3:RF-01, I4:RF-01 |

## 3. Interacción con IA y decisiones realizadas por IA

| Tema | SRS de origen | ID original | Descripción | Tipo | Estado comparativo | Requerimientos relacionados |
|---|---|---|---|---|---|---|
| Conversación guiada | I1 | RF-01 | Describir el proyecto conversando con el agente, una pregunta a la vez | RF | GAP (falta I4) | I2:RF-02; I3:RF-02 |
| Repreguntar | I1 | RF-05 | Si no entiende, repreguntar o pedir foto en vez de asumir | RF | GAP | I2:RF-03; I3:RF-02 ("desconocido") |
| Resumen confirmable | I1 | RF-03 | Resumen del proyecto que el cliente confirma o corrige antes de continuar | RF | GAP (falta I4) | I2:RF-02; I3:RF-03 |
| Escalamiento a una persona | I1 | RF-06 | Tras 2 intentos fallidos, ofrecer contacto con soporte ("2" = decisión técnica del analista) | RF | GAP (falta I4) | I2:RF-03, I2:RF-13; I3:RF-14 |
| Identificación del agente | I1 | RF-56 | El agente se identifica como asistente automático | RF | GAP | — |
| Resumen de avance | I1 | RF-43 | El agente genera un resumen a partir del reporte del trabajador | RF | GAP | — |
| Autorización de acciones sensibles | I1 | RF-20 | Acciones que comprometen tiempo, dinero o datos requieren autorización explícita del cliente | RF | GAP (falta I4) | I3:RD-04; I2:RD-04 |
| La IA no decide | I1 | RD-06 (= RE-07) | La IA no decide medidas delicadas; la última palabra es de una persona | Regla de negocio | GAP (falta I4) | I3:RD-04, I3:RD-11; I2:RNF-08 |
| La IA no determina hechos | I1 | RF-61-AC-2, RF-29-AC-2 | La IA o el sistema no determinan falsedad ni sanciones | RF | GAP | I3:RD-11 |
| Ficha conversacional | I2 | RF-02 | Generar la ficha pidiendo los campos faltantes; estado "ficha completa" al confirmar | RF | GAP (falta I4) | I1:RF-01, I1:RF-03; I3:RF-02, I3:RF-03 |
| Clasificación de oficio | I2 | RF-03 | Asignar exactamente 1 oficio del catálogo; tras 2 aclaraciones, ofrecer soporte; 90 % de acierto sobre 50 casos | RF | GAP | I1:RF-06 |
| Transferencia humana | I2 | RF-13 | Transferir con historial por botón, frase o RF-03; ticket con folio fuera de horario; el agente calla mientras está abierta | RF | GAP | I1:RF-06; I3:RF-14 |
| Montos de la IA | I2 | RNF-08 | Toda respuesta con montos incluye "El precio final lo define el prestador" (100 % sobre ≥100 conversaciones) | RNF | GAP | I2:RD-04; I3:RD-04 |
| Proveedor de LLM | I2 | RNF-11, C-02 | LLM externo vía API detrás de una capa de abstracción; no se entrena modelo propio | Decisión técnica | GAP | I1 §4.2 (supone un proveedor sin especificarlo) |
| Modelo propio | I2 | §1.2 | Entrenamiento de un modelo de IA propio | Fuera del MVP | GAP | — |
| Fuga de datos por IA | I2 | RNF-17 | El agente no revela datos personales de otros usuarios (100 % sobre ≥50 mensajes adversariales) | RNF | GAP | I1:RNF-07; I3:RNF-11 |
| Recopilación con IA | I3 | RF-02 | Pedir solo los datos aplicables al oficio; registrar "desconocido" y proponer visita; no inventar | RF | GAP | I1:RF-04, I1:RF-05 |
| Resumen editable | I3 | RF-03 (AC-1, AC-3) | Resumen editable; solo la versión confirmada se usa para recomendar | RF | GAP (falta I4) | I1:RF-03; I2:RF-02 |
| La IA no decide | I3 | RD-04 | La IA recopila, recomienda, resume y alerta; no acepta citas, cotizaciones, pagos ni cambios | Regla de negocio | GAP (falta I4) | I1:RF-20, I1:RD-06 |
| Servicios externos | I3 | §3.1.3 | Los servicios de IA, almacenamiento y notificaciones no aprueban ni modifican sin acción de un usuario | Restricción | GAP | I1:RD-06 |
| Contingencia de IA | I3 | §2.5 | Si la IA no está disponible, el cliente captura la solicitud manualmente | Supuesto / dependencia | GAP | I2:RNF-01 (mensaje de espera a los 8 s) |
| Representación visual | I3 | RF-16 | La IA genera una representación visual del alcance a partir de imágenes de referencia | RF | GAP | — |
| Representación visual | I3 | RD-10 | La representación no sustituye planos, permisos ni responsabilidad profesional | Regla de negocio | GAP | — |
| Análisis de incrementos | I3 | RF-18 | La IA analiza la justificación de un cambio de costo; es informativo y el cliente decide | RF | GAP | I1:RF-46 (fuera del MVP; ver nota 4) |
| Análisis de incrementos | I3 | RD-11 | La IA señala inconsistencias pero no valida ni aprueba el cambio | Regla de negocio | GAP | I1:RD-06 |
| — | I4 | — | **I4 no especifica un agente de IA conversacional** | — | GAP | — |

> **Decisiones realizadas por IA: no se confirmó ningún conflicto.** I1, I2 e I3 coinciden en que la IA no decide por el usuario. La diferencia es de cobertura (I4 no lo trata).

## 4. Registro, autenticación y control de acceso

| Tema | SRS de origen | ID original | Descripción | Tipo | Estado comparativo | Requerimientos relacionados |
|---|---|---|---|---|---|---|
| Registro / login | I1 | RF-30 | Registro y autenticación de cliente, trabajador y organización; administrador aprovisionado internamente | RF | **CONFLICTO** (mecanismo) | I2:RF-20, I2:RNF-15 |
| Alta y consentimiento | I2 | RF-20 | Alta por el primer mensaje de WhatsApp; aceptación del aviso de privacidad y de la mayoría de edad; registrar la versión del aviso | RF | **CONFLICTO** (mecanismo) / GAP (consentimiento) | I1:RF-30; I1:RNF-07 |
| Identificador | I2 | §2.4, supuestos | El número de WhatsApp es el identificador del cliente y del trabajador | Decisión técnica | **CONFLICTO** | I1:RF-30-AC-1 (cuenta con inicio de sesión) |
| Autenticación del panel | I2 | RNF-15 | Correo y contraseña de 10 caracteres o más; 2FA para administrador y soporte; cierre de sesión a los 30 min | RNF / Decisión técnica | GAP | I1:RF-30 |
| Autenticación | I3 | RNF-03 | Requerir autenticación para solicitudes, citas, cotizaciones, avances y evaluaciones | RNF | CONSENSO | I1:RF-30; I2:RNF-15; I4:RNF-04 |
| Autenticación | I4 | RNF-04 | Requerir autenticación para registrar solicitudes, seleccionar, modificar y evaluar | RNF | CONSENSO | I1:RF-30; I3:RNF-03 |
| Roles | I1 | RNF-12 | Restringir funciones y datos según el rol | RNF | CONSENSO | I2:RNF-05; I3:RNF-09, I3:LD-01; I4:RNF-03 |
| Accesos indebidos | I1 | RNF-08 | Proteger los datos contra accesos indebidos | RNF | CONSENSO | I3:RNF-04; I4:RNF-03 |
| Propiedad del recurso | I3 | RNF-09 | Verificar en cada operación la propiedad o el rol; las denegaciones no revelan datos | RNF | CONSENSO | I1:RNF-12 |
| Roles | I3 | LD-01 | Roles cliente, proveedor y administrador de verificación, o combinaciones autorizadas | Dato lógico | CONSENSO | I1:RNF-12 |

## 5. Perfiles de trabajador

| Tema | SRS de origen | ID original | Descripción | Tipo | Estado comparativo | Requerimientos relacionados |
|---|---|---|---|---|---|---|
| Perfil | I1 | RF-07 | Nombre, foto, oficio, años de experiencia y zona; visible al completar los datos mínimos | RF | CONSENSO (datos) | I2:RF-07; I3:RF-05; I4:RF-03, I4:RF-10 |
| Portafolio | I1 | RF-34 | El trabajador **puede** cargar fotos de trabajos anteriores (opcional) | RF | **CONFLICTO** | I2:RF-07 (al menos 3, obligatorio) |
| Declarado vs. verificado | I1 | RF-10 | Distinguir visualmente lo declarado de lo verificado | RF | GAP | I3:RF-05-AC-3 |
| Registro y aprobación | I2 | RF-07 | Nombre, foto, INE, oficios, **al menos 3 fotos de trabajos (obligatorio)**, ubicación base, horario, certificaciones opcionales; estado "pendiente" hasta aprobación | RF | **CONFLICTO** | I1:RF-07, I1:RF-34; I3:RF-13 |
| Consulta de perfil | I3 | RF-05 | Afiliación, especialidad, experiencia, calificación, número de evaluaciones, comentarios, portafolio, cobertura, disponibilidad, rango de precio y garantía | RF | CONSENSO (consultar perfil) | I1:RF-10, I1:RF-48; I2:RF-04-AC-6; I4:RF-03 |
| Modalidad | I3 | RD-01 | El perfil identifica si es trabajador independiente o pertenece a una organización | Regla de negocio | GAP | I2:RD-05 |
| Consulta de perfil | I4 | RF-03 | Nombre, foto, oficio y experiencia; evaluaciones sin datos privados de otros clientes | RF | CONSENSO | I1:RF-07; I3:RF-05 |
| Información profesional | I4 | RF-10 | Registrar y actualizar especialidades, experiencia y disponibilidad (trabajador u organización) | RF | CONSENSO | I1:RF-07, I1:RF-15; I2:RF-07, I2:RF-17 |
| Identificación | I4 | RD-05 | Identificar al trabajador con información básica y foto antes del servicio | Regla de negocio | CONSENSO | I1:RF-07; I2:RF-07 |
| Catálogo | I4 | RF-02 | Consultar un catálogo de trabajadores y filtrar por oficio | RF | GAP | — |

## 6. Verificación de identidad y experiencia

| Tema | SRS de origen | ID original | Descripción | Tipo | Estado comparativo | Requerimientos relacionados |
|---|---|---|---|---|---|---|
| Identidad | I1 | RF-09 | Verificar identificación oficial antes de marcar "identidad verificada" (revisión del administrador) | RF | GAP (falta I4) | I2:RF-07; I3:RF-13 |
| Experiencia | I1 | RF-35 | Verificar experiencia o credenciales por separado ("experiencia verificada") | RF | GAP | I3:RF-13 (evidencia de portafolio); I2 no la separa |
| Verificación | I1 | RD-02 | Solo es "verificado" tras revisión de la plataforma | Regla de negocio | GAP | I3:RD-08 |
| Certificados | I1 | RD-03 | No se exigen certificados a todos los oficios | Regla de negocio | GAP | I2:RF-07 (certificaciones opcionales; compatible) |
| No verificados en búsqueda | I1 | RF-07 (resultado), RF-12 | El perfil es visible al completarse; "identidad verificada" es un **filtro opcional** del cliente | RF | **CONFLICTO** | I2:RD-03, I2:RF-07-AC-3; I3:RD-08, I3:RF-13-AC-2 |
| Retiro de verificación | I1 | RF-29 | Retirar la verificación ante un documento vencido o información falsa confirmada por el administrador | RF | GAP | I3:RF-13 ("suspendido") |
| Sin verificación no hay solicitudes | I2 | RD-03 | Ningún trabajador recibe solicitudes sin INE verificada y perfil aprobado | Regla de negocio | **CONFLICTO** | I1:RF-12 |
| INE | I2 | RNF-05 | Solo el administrador ve la INE; cada consulta queda registrada | RNF | GAP | — |
| Estados de verificación | I3 | RF-13 | Pendiente, verificado, rechazado o suspendido, con fecha y motivo; solo los verificados aparecen | RF | **CONFLICTO** (visibilidad) | I1:RF-12; I2:RF-07 |
| Solo verificados | I3 | RD-08 | Las recomendaciones solo incluyen perfiles verificados; la verificación no es una garantía | Regla de negocio | **CONFLICTO** | I1:RF-12 |

## 7. Organizaciones de contratistas

| Tema | SRS de origen | ID original | Descripción | Tipo | Estado comparativo | Requerimientos relacionados |
|---|---|---|---|---|---|---|
| Registro de organización | I1 | RF-15 | Nombre legal o comercial, representante, oficios y zona; **visible en búsquedas al completar el perfil** (RF-15-AC-1) | RF | **CONFLICTO** (visibilidad sin aprobación) | I2:RF-17-AC-2; I3:RD-08 |
| Verificación de organización | I1 | RF-62 | Marca "organización verificada" tras revisar documentos, separada del registro | RF | GAP (falta I4) | I2:RF-17; I3:RF-13 |
| Disponibilidad de la organización | I1 | RF-08-AC-3 | Disponibilidad **general**, sin gestionar la agenda de empleados individuales | RF | **CONFLICTO** | I2:RF-22-AC-5 |
| Plantilla y jerarquías | I1 | RF-37 (§10) | Administrar múltiples trabajadores y jerarquías dentro de la organización | Fuera del MVP | **CONFLICTO** | I2:RF-12, I2:RF-17, I2:RD-05 |
| Panel de organización | I2 | RF-12 | Panel web con solicitudes, **asignación de un trabajador de su plantilla** y detalle del proyecto (prioridad O) | RF | **CONFLICTO** | I1:RF-37 |
| Registro de organización | I2 | RF-17 | Razón social, **RFC**, responsable, oficios y ubicación; "pendiente" hasta aprobación; vincula trabajadores aprobados (prioridad O) | RF | **CONFLICTO** | I1:RF-15, I1:RF-37 |
| Asignación | I2 | RD-05 | La organización asigna al trabajador que ejecuta | Regla de negocio | **CONFLICTO** | I1:RF-37 |
| Horario por trabajador | I2 | RF-22-AC-5 | El coordinador modifica el horario de un trabajador de su plantilla | RF | **CONFLICTO** | I1:RF-08-AC-3 |
| Funciones de la organización | I3 | §2.3 | La organización realiza las funciones del proveedor "para los trabajadores que representa" (sin RF propio) | Descripción de usuario | GAP | Redacción ambigua frente a I1:RF-37 y I2:RF-12 |
| Información de la organización | I4 | RF-10 | La organización registra especialidades y servicios | RF | CONSENSO (registro de la organización) | I1:RF-15; I2:RF-17 |

## 8. Disponibilidad

| Tema | SRS de origen | ID original | Descripción | Tipo | Estado comparativo | Requerimientos relacionados |
|---|---|---|---|---|---|---|
| Disponibilidad | I1 | RF-08 | Calendario individual del trabajador | RF | CONSENSO | I2:RF-22; I3 §1.3; I4:RF-10 |
| "Disponible" | I1 | RD-05 | Tener espacio en la agenda en las fechas solicitadas | Regla de negocio | CONSENSO | I4:RD-02; I3 §1.3 |
| Disponibilidad | I2 | RF-22 | Horario semanal, bloqueo de fechas (rechazado si choca con una cita) y agenda de 7 días | RF | CONSENSO (ver AC-5 en §7) | I1:RF-08 |
| "Disponibilidad" | I3 | §1.3 | Franja publicada como reservable y sin cita confirmada | Definición | CONSENSO | I1:RD-05 |
| Disponibilidad | I4 | RD-02 | No mostrar como disponible a quien no lo está | Regla de negocio | CONSENSO | I1:RD-05 |

## 9. Definición de la necesidad (solicitud)

| Tema | SRS de origen | ID original | Descripción | Tipo | Estado comparativo | Requerimientos relacionados |
|---|---|---|---|---|---|---|
| Datos mínimos | I1 | RF-04 | Mínimo: tipo de trabajo, colonia o zona, fechas y descripción; opcionales: fotos, medidas y presupuesto | RF | GAP (mínimos distintos, compatibles) | I2:RF-02; I3:RF-01; I4:RF-01 |
| Datos mínimos | I2 | RF-02 | Obligatorios: oficio, descripción, **domicilio completo** (calle, número, colonia, municipio) y fecha; opcionales: medidas, fotos y material | RF | GAP | I1:RF-04 |
| Datos mínimos | I3 | RF-01 | Obligatorios para guardar: resultado esperado, oficio y zona aproximada; opcionales: fecha, presupuesto, fotos y videos | RF | GAP | I1:RF-04 |
| Datos mínimos | I4 | RF-01 | Mínimo: tipo de trabajo y ubicación general; complementos: descripción, fotos, medidas y materiales | RF | GAP | I1:RF-04 |
| Datos de la solicitud | I3 | LD-02 | La solicitud conserva cliente, oficio, zona, versión confirmada, estado, fecha y presupuesto | Dato lógico | GAP | — |

> **No se confirmó conflicto en los datos mínimos.** Cada SRS fija un mínimo y ninguno prohíbe pedir más; I2 simplemente es un superconjunto. La fecha es necesaria para buscar en los 4 (I1:RF-04, I2:RF-02, I3:RF-04-AC-1; I4 considera la disponibilidad en I4:RF-04).

## 10. Búsqueda y recomendación (incluye precio, cantidad y cercanía)

| Tema | SRS de origen | ID original | Descripción | Tipo | Estado comparativo | Requerimientos relacionados |
|---|---|---|---|---|---|---|
| Búsqueda | I1 | RF-11 | Combinar oficio, zona, disponibilidad y evaluación | RF | CONSENSO | I2:RF-04; I3:RF-04; I4:RF-04 |
| Filtros extra | I1 | RF-12 | Filtrar por identidad verificada y experiencia similar | RF | Ver §6 (CONFLICTO de visibilidad) | — |
| Cantidad | I1 | RF-13 | **3 a 4** recomendaciones explicadas; con menos de 3 candidatos se muestran los que existan con aviso; el cliente elige | RF | GAP | I2:RF-04 (1 a 3) |
| Sin resultados | I1 | RF-14 | Informar y ofrecer ampliar la zona o cambiar las fechas | RF | GAP | I2:RF-05; I3:RF-04-AC-2 |
| Cercanía | I1 | RD-04 | "Cercano" = el trabajador **atiende la colonia del cliente o zonas vecinas** (PV-05 abierto) | Regla de negocio | **CONFLICTO** | I2:RF-04(c), I2:RF-05 (radio de 10/20 km) |
| Orden | I1 | RNF-10 | El orden no depende de pagos ni de criterios no comunicados | RNF | GAP | I2:RF-15 (ver nota 2) |
| Precio | I1 | RF-36 (§10) | **Filtro por rango de precio** | Fuera del MVP | **CONFLICTO** | I3:RF-06 |
| Búsqueda | I2 | RF-04 (a)–(e) | Perfil aprobado, oficio, radio, franja libre de 1 h y suscripción activa | RF | CONSENSO (búsqueda por criterios) | I1:RF-11 |
| Cantidad y orden | I2 | RF-04 | **1 a 3** prestadores; orden por calificación → trabajos → distancia; máximo 1 lugar para "Nuevo verificado" | RF | GAP | I1:RF-13 |
| Cercanía | I2 | §1.3 "Radio", RF-05 | Radio en línea recta de 10 km, ampliable a 20 km | Regla de negocio / Decisión técnica | **CONFLICTO** | I1:RD-04; I3 (zona de cobertura) |
| Sin resultados | I2 | RF-05 | Ampliar a 20 km o "Avisarme" durante 7 días; después, el proyecto se cancela | RF | GAP | I1:RF-14 |
| Selección y aceptación | I2 | RF-18 | El cliente elige; el prestador acepta o rechaza en 4 h; ve solo colonia y municipio | RF | GAP (aceptación) | I1:RF-13; I4:RF-06 |
| Suscripción | I2 | RF-15 | Suscripción mensual registrada por el administrador; si vence, el prestador sale de las búsquedas | RF | GAP | I1:RNF-10 (ver nota 2) |
| Ingreso | I2 | RD-07 | Ingreso por suscripción de prestadores, sin comisión | Regla de negocio | GAP | — |
| Precio | I2 | RD-04 | El precio lo define el prestador; los rangos son solo de referencia | Regla de negocio | GAP | I3:RF-05 (rango de precio) |
| Búsqueda | I3 | RF-04 | Oficio, cobertura y disponibilidad; mostrar criterios coincidentes y no evaluados; solo verificados | RF | CONSENSO (búsqueda) | I1:RF-11 |
| Explicación | I3 | RF-04-AC-3 | Mostrar los criterios que sustentan la recomendación, sin garantizar el resultado | RF | GAP | I1:RF-13 |
| Precio y orden | I3 | RF-06 | **Filtrar y ordenar por calificación, disponibilidad, precio, cercanía y garantía** | RF | **CONFLICTO** (precio) | I1:RF-36 |
| Compatibilidad | I4 | RD-01 | Solo se muestra si una especialidad corresponde al servicio | Regla de negocio | CONSENSO | I2:RF-04(b); I3:RF-04 |
| Búsqueda | I4 | RF-04 | Tipo de trabajo, ubicación y disponibilidad | RF | CONSENSO | I1:RF-11 |
| Recomendación | I4 | RF-05 | Presentar opciones con experiencia, evaluación, disponibilidad y precio o rango cuando exista | RF | GAP | I3:RF-05; I1:RF-36 (ver nota 3) |
| Selección | I4 | RF-06 | El cliente selecciona un trabajador | RF | CONSENSO | I1:RF-13; I2:RF-18; I3:RF-07-AC-1 |

## 11. Ubicación o territorio inicial y oficios

| Tema | SRS de origen | ID original | Descripción | Tipo | Estado comparativo | Requerimientos relacionados |
|---|---|---|---|---|---|---|
| Territorio y oficios | I1 | RE-04 / PV-04 | Oficios y zona inicial **sin definir** (pendiente) | Restricción / pendiente | GAP | — |
| Ampliación | I1 | §10 | Ampliar oficios y zonas más allá de los iniciales | Fuera del MVP | GAP | I2:RNF-09 |
| Territorio | I2 | RD-06 | Piloto limitado a 6 municipios de la ZMG (Jalisco) | Regla de negocio | **CONFLICTO** | I3 §2.4 |
| Territorio | I2 | RF-02-AC-6 | Un domicilio fuera de la ZMG (Chapala) no puede completar la ficha | RF | **CONFLICTO** | I3 §2.4 |
| Territorio | I2 | §1.2 | Operación fuera de los municipios de RD-06 | Fuera del MVP | **CONFLICTO** | I3 §2.4 |
| Oficios | I2 | Apéndice C, §1.2 | Catálogo de **10 oficios**; los de fuera del catálogo no entran en el MVP | Regla de negocio | GAP | I1:RE-04 (sin definir); I4 §1.2 (solo ejemplos) |
| Escalabilidad | I2 | RNF-09 | 300 prestadores, 35 solicitudes al día, nuevo municipio por configuración | RNF | GAP | — |
| Territorio | I3 | §2.4 | MXN, `America/Mexico_City` y **cobertura inicial: territorio mexicano** | Restricción | **CONFLICTO** | I2:RD-06 |
| Oficios | I4 | §1.2 | Albañiles, carpinteros, electricistas, plomeros "y otros" (ejemplos, sin catálogo) | Descripción de alcance | GAP | I2 Apéndice C |

## 12. Confirmación de citas

| Tema | SRS de origen | ID original | Descripción | Tipo | Estado comparativo | Requerimientos relacionados |
|---|---|---|---|---|---|---|
| Propuesta de horario | I1 | RF-16 | **El agente** propone horarios según ambas agendas | RF | **CONFLICTO** | I2:RF-18-AC-5, I2:RF-06-AC-1 |
| Doble aceptación | I1 | RF-38 | Confirmada solo con ambas aceptaciones, **en orden cliente → trabajador** | RF | **CONFLICTO** (orden) | I2:RF-06; I3:RF-07 (compatible con I1) |
| Expiración | I1 | RF-38-AC-3 | Sin respuesta en 24 h la propuesta expira y no se compromete otro horario | RF | GAP | — |
| Notificación | I1 | RF-39 | Notificar a ambas partes la confirmación | RF | GAP | I3:RF-07-AC-1 |
| Avisos | I1 | RF-17 | Avisar cancelación, cambio o retraso a la otra parte | RF | CONSENSO | I2:RF-06-AC-5; I3:RF-07-AC-4; I4:RF-07-AC-2 |
| Cancelación tardía | I1 | RF-17-AC-2 | Cancelar dentro de las 24 h previas se registra como "tardía" | RF | GAP | — |
| Reprogramación | I1 | RF-40 | Tras una cancelación, el agente propone nuevas fechas | RF | GAP | I2:RF-06-AC-8 |
| Registro de cambios | I1 | RF-41 | Registrar quién solicitó el cambio y cuándo | RF | CONSENSO | I2:RNF-06; I3:RF-07-AC-4; I4:RF-07-AC-2 |
| Emergencias | I1 | RD-10 | Una cancelación por emergencia ≠ una ausencia sin aviso | Regla de negocio | GAP | — |
| Agendamiento | I2 | RF-06 | Visita (1 h) y ejecución; **el prestador propone y confirma, el cliente confirma**; bloqueo de franjas; gana el primero; recordatorio 24 h antes | RF | **CONFLICTO** (quién propone y orden) | I1:RF-16, I1:RF-38 |
| Agendamiento | I3 | RF-07 | El cliente elige el horario → "pendiente de aceptación" → acepta el proveedor; mostrar el costo de la visita; cancelar con motivo | RF | **CONFLICTO** (del lado de I1 frente a I2) | I1:RF-38; I2:RF-06 |
| Datos de la cita | I3 | LD-03 | La cita guarda aceptaciones independientes de cliente y proveedor | Dato lógico | GAP | — |
| Agendamiento | I4 | RF-07 | Registrar la fecha y horario acordados y sus cambios (**sin doble confirmación**) | RF | GAP | I1:RF-38 |

## 13. Propuestas o cotizaciones

| Tema | SRS de origen | ID original | Descripción | Tipo | Estado comparativo | Requerimientos relacionados |
|---|---|---|---|---|---|---|
| Propuesta | I1 | RF-18 | Propuesta escrita (trabajo, materiales, costo, fechas) **solo después de la visita realizada** (RF-18-AC-2) | RF | **CONFLICTO** (visita obligatoria) | I2:RF-08, I2:RF-08-AC-8; I3:RF-03 |
| Aceptación | I1 | RF-42 | Ambas partes aceptan la misma versión; se permite negociar; **72 h sin respuesta → se cierra sin efecto** | RF | **CONFLICTO** (expiración) | I2:RF-08 (vigencia de 1 a 30 días) |
| Cotización por IA | I1 | §10 | Cotización automática generada por IA | Fuera del MVP | GAP | Ningún otro SRS la incluye |
| Cotización | I2 | RF-08 | Partidas, total, IVA, materiales, días y **vigencia de 1 a 30 días**; **visita opcional**; el cliente acepta o rechaza; nueva cotización tras un rechazo | RF | **CONFLICTO** | I1:RF-18, I1:RF-42 |
| Aptitud sin visita | I3 | RF-03 (AC-2, AC-4) | Se cotiza sin visita si hay oficio, resultado, zona, fecha, materiales y medidas o foto; si no, se propone visita | RF | **CONFLICTO** (visita condicional) | I1:RF-18-AC-2 |
| Cotización | I3 | RF-08 | Desglose de mano de obra, materiales y adicionales; versión, vigencia y MXN; detalle por material; la cotización vencida no se aprueba | RF | GAP (falta I4) | I1:RF-18; I2:RF-08 |
| Cotización | I3 | LD-04 | Conceptos con importe y estado; presupuesto inicial inmutable con versiones | Dato lógico | GAP | — |
| — | I4 | — | **Sin cotización ni propuesta formal** | — | GAP | — |

## 14. Autorización de cambios de costo, costos y pagos

| Tema | SRS de origen | ID original | Descripción | Tipo | Estado comparativo | Requerimientos relacionados |
|---|---|---|---|---|---|---|
| Autorización | I1 | RF-19 | Ningún cambio de precio o alcance se aplica sin que el cliente lo acepte, rechace o contraproponga | RF | GAP (falta I4) | I2:RF-09; I3:RF-08, I3:RD-03 |
| Autorización | I1 | RD-07 | Sin autorización previa del cliente no hay costo adicional válido; el administrador no autoriza por él | Regla de negocio | GAP (falta I4) | I3:RD-03 |
| Plazo | I1 | E.3 (estados) | **24 h** para responder; la parte afectada del trabajo queda en pausa; posible escalamiento al administrador | RF (flujo de estados) | **CONFLICTO** | I2:RF-09-AC-7 (48 h) |
| Rechazo de cambio | I1 | RF-19-AC-3 | Si el cambio bloquea parte del trabajo, esa parte no se reanuda; nuevo acuerdo o escalamiento | RF | GAP | — |
| Vista de costos | I1 | RF-23 | Costo acordado, avanzado y pendiente de aprobar en una sola vista | RF | GAP | I3:RF-10 |
| Aviso inmediato | I1 | RF-24 | Avisar de inmediato los retrasos y cambios de costo | RF | GAP | I3:RF-10-AC-2 |
| Detección automática | I1 | RF-46 (§10) | Detectar desviaciones por umbral o análisis predictivo | Fuera del MVP | GAP | I3:RF-18 (ver nota 4) |
| Control de cambios | I2 | RF-09 | Cambio solo de **costo**; aprobación con "Apruebo" o botón; **48 h sin respuesta → "expirada"** | RF | **CONFLICTO** (plazo) | I1 E.3 |
| Control de cambios | I3 | RF-08 (AC-2, AC-3, AC-6, AC-7) | Cambios de presupuesto, materiales, alcance y fecha; sin respuesta no se incorporan (**sin plazo**); versiones | RF | GAP | I1:RF-19 |
| Autorización | I3 | RD-03 | Costo, material, alcance o fecha requieren aprobación explícita | Regla de negocio | GAP (falta I4) | I1:RD-07 |
| Gasto | I3 | RF-10 | Avance y gasto acumulado contra el presupuesto; alertas sin aplicar cambios automáticamente | RF | GAP | I1:RF-23, I1:RF-24 |
| Pagos | I1 | §10 / PV-14 | Pagos y anticipos dentro de la plataforma | Fuera del MVP | CONSENSO | I2 §1.2, I2:RD-02; I3:RD-06; I4 §4.2 |
| Pagos | I2 | §1.2, RD-02 | No recibe, retiene ni transfiere fondos (sin escrow); cobro de suscripciones fuera de línea | Fuera del MVP / Regla de negocio | CONSENSO | I1 §10 |
| Registro de pagos | I2 | RF-14 | El cliente registra el pago declarado; el prestador confirma o rechaza; "en disputa"; sin datos bancarios | RF | GAP | I3:RD-06 (registra comprobantes) |
| Pagos | I3 | §1.2, §2.4, RD-06 | No procesa pagos; registra acuerdos, cotizaciones y comprobantes | Fuera del MVP / Regla de negocio | CONSENSO | I1 §10 |
| Pagos y finanzas | I4 | §2.4, §4.2 | Fuera: pagos, gestión fiscal, seguros, garantías financieras, penalizaciones y reclamaciones financieras | Fuera del MVP | CONSENSO (pagos) / GAP (los demás) | I1:RD-10, PV-13 |

> **Pagos dentro o fuera del MVP: no hay conflicto.** Los 4 excluyen el procesamiento. Solo I2 agrega el *registro* de pagos declarados (I2:RF-14), y ningún SRS lo prohíbe.

## 15. Seguimiento del trabajo y evidencias

| Tema | SRS de origen | ID original | Descripción | Tipo | Estado comparativo | Requerimientos relacionados |
|---|---|---|---|---|---|---|
| Reporte de avance | I1 | RF-22 | Foto + mensaje corto; **sin foto o sin mensaje no se acepta** (RF-22-AC-2) | RF | **CONFLICTO** (foto obligatoria) | I2:RF-10 (fotos opcionales); I3:RF-09 |
| Confirmación del cliente | I1 | RF-44 | El cliente confirma el avance o señala diferencias | RF | GAP | I3:RF-11-AC-1 (valida etapa) |
| Frecuencia | I1 | RF-45 | Reporte **diario**; hasta 2 recordatorios | RF | **CONFLICTO** | I2:RF-10; I3:RF-09 |
| Escalamiento | I1 | RF-57 | Tras 2 recordatorios sin respuesta, avisar al cliente | RF | **CONFLICTO** | I2:RF-10-AC-4; I3:RF-09-AC-4 |
| Seguimiento diario | I2 | RF-10 | Solicitud a las 19:00 (configurable de 17 a 22 h); texto, voz o fotos opcionales; **sin respuesta en 2 h → aviso al cliente + alerta a soporte** | RF | **CONFLICTO** | I1:RF-45, I1:RF-57 |
| Avance por etapas | I3 | RF-09 | Etapas acordadas antes del primer avance; %, tareas, imprevistos y comprobantes; **por etapa terminada y cada 7 días** | RF | **CONFLICTO** (frecuencia) | I1:RF-45; I2:RF-10 |
| Porcentaje acumulado | I3 | RF-10, LD-05 | Promedio simple del último porcentaje de cada etapa | RF / Dato lógico | GAP | — |
| Estados del servicio | I4 | RF-08 | Estados mínimos: programado, en proceso y terminado | RF | CONSENSO (seguimiento visible) | I1 E.4; I2 Apéndice D; I3:RF-09 |
| Estados | I2 | Apéndice D | 10 estados del proyecto | Regla de negocio | GAP | I1 E.1–E.4 |
| Comprobantes | I3 | RF-09-AC-2, §2.5 | Comprobantes adjuntos; si falla la carga, se conserva el texto | RF / Supuesto | GAP | — |
| Acceso a imágenes | I3 | RNF-11, LD-07 | Imágenes de referencia accesibles solo para el cliente, los proveedores autorizados y el administrador | RNF | GAP | I1:RF-54 |
| Integridad | I4 | RNF-05 | No asociar una evaluación o un estado a un servicio distinto | RNF | GAP | I4:RD-06; I3:LD-06 |

## 16. Cierre del proyecto

| Tema | SRS de origen | ID original | Descripción | Tipo | Estado comparativo | Requerimientos relacionados |
|---|---|---|---|---|---|---|
| Solicitud de cierre | I1 | RF-59 | El trabajador solicita el cierre | RF | CONSENSO | I2:RF-16; I3:RF-11-AC-1; I4:RF-08-AC-2 |
| Confirmación | I1 | RF-60 | Concluido solo si el cliente confirma; puede rechazarlo; los pendientes ni se resuelven ni bloquean automáticamente | RF | CONSENSO (confirma el cliente) | I2:RF-16; I3:RF-11-AC-4; I4:RF-08-AC-2 |
| Cierre | I2 | RF-16 | El prestador marca "terminado"; el cliente confirma o reporta pendientes; **72 h sin respuesta → soporte** | RF | CONSENSO (flujo) / GAP (72 h) | I1:RF-60 |
| Cancelación del proyecto | I2 | RF-19 | Reglas por estado con motivo obligatorio; en ejecución solo la decide soporte; "concluido" no se cancela | RF | GAP | I1:RF-17 (solo citas) |
| Cierre por etapas | I3 | RF-11-AC-4 | Con todas las etapas validadas, el cliente confirma y el proyecto queda "concluido" | RF | CONSENSO (confirma el cliente) / GAP (etapas) | I1:RF-60 (ver nota 5) |
| Corrección | I3 | RF-17, LD-08 | Inconformidad después del cierre o de la etapa y propuesta de corrección validada por el cliente | RF | GAP | — |
| Cierre | I4 | RF-08-AC-2 | El trabajador marca terminado, el cliente confirma y se habilita la evaluación | RF | CONSENSO | I1:RF-59, I1:RF-60 |

## 17. Evaluaciones (incluye bidireccional)

| Tema | SRS de origen | ID original | Descripción | Tipo | Estado comparativo | Requerimientos relacionados |
|---|---|---|---|---|---|---|
| Quién y cuándo | I1 | RF-25, RD-01 | Solo el cliente que contrató, después de concluido | RF / Regla de negocio | CONSENSO | I2:RF-11; I3:RF-11, I3:RD-05; I4:RF-09, I4:RD-03 |
| Contenido | I1 | RF-47 | Calificación + **comentario obligatorio** (RF-47-AC-2); la escala de 1 a 5 no está confirmada | RF | **CONFLICTO** (comentario) | I2:RF-11; I3:RF-11 |
| Número de evaluaciones | I1 | RF-48 | El perfil muestra el número de evaluaciones | RF | CONSENSO | I3:RF-05; I4:RF-03-AC-2 |
| Respuesta | I1 | RF-26 | Respuesta pública del trabajador a una evaluación negativa | RF | GAP | — |
| Revisión | I1 | RF-49, RD-08 | Solicitar revisión de una evaluación injusta; no se elimina sin evidencia | RF / Regla de negocio | GAP | — |
| Bidireccional | I1 | §10 | Evaluación del cliente por parte del trabajador | Fuera del MVP | **CONFLICTO** | I2:RF-11(b) |
| Calificación | I2 | RF-11 | **Bidireccional**; el cliente califica 4 dimensiones de 1 a 5; comentario opcional; publicación simultánea o a los 7 días | RF | **CONFLICTO** | I1 §10, I1:RF-47; I3:RF-11 |
| Evaluación | I3 | RF-11 | **Calificación única** de 1 a 5, **comentario opcional**, una por cliente, proveedor y proyecto | RF | **CONFLICTO** (comentario frente a I1; escala frente a I2) | I1:RF-47; I2:RF-11 |
| Evaluación | I3 | RD-05, LD-06 | Solo un cliente asociado a un proyecto concluido evalúa | Regla de negocio | CONSENSO | I1:RD-01 |
| Evaluación | I4 | RF-09 | Evaluar solo cuando el servicio está finalizado | RF | CONSENSO | I1:RF-25 |
| Evaluación | I4 | RD-03, RD-06 | Evaluación posterior al servicio y asociada a su servicio y trabajador | Regla de negocio | CONSENSO | I1:RD-01; I3:LD-06 |

## 18. Reportes y sanciones

| Tema | SRS de origen | ID original | Descripción | Tipo | Estado comparativo | Requerimientos relacionados |
|---|---|---|---|---|---|---|
| Reportar | I1 | RF-27 | Cliente y trabajador reportan información falsa, perfiles sospechosos o problemas | RF | GAP | I3:RF-12 |
| Reporte grave | I1 | RF-61, RD-09 | Un reporte "grave" solo prioriza la atención; los hechos los determina el administrador (PV-21) | RF / Regla de negocio | GAP | — |
| Revisión | I1 | RF-28 | El administrador pide evidencias a ambas partes | RF | GAP | I3:RF-12-AC-3 |
| Decisión | I1 | RF-32, RF-50 | Registrar la decisión y su motivo, y explicarla a ambas partes | RF | GAP | I3:RF-12-AC-3 (justificación interna) |
| Segunda revisión | I1 | RF-51 | La parte afectada pide una segunda revisión | RF | GAP | — |
| Sanciones | I1 | RF-52 | Advertencia ante quejas validadas; suspensión solo por decisión del administrador; sin reducción automática de visibilidad | RF | GAP | I3:RF-13 ("suspendido") |
| Reportar | I3 | RF-12 | Reportar perfiles, organizaciones y publicaciones; estados en revisión, resuelto o descartado; no revelar al reportante | RF | GAP | I1:RF-27, I1:RF-28 |
| Suspensión | I3 | RF-13 | Estado "suspendido" con fecha y motivo | RF | GAP | I1:RF-52 |

> **Reportes y sanciones: no hay conflicto.** Solo I1 e I3 los tratan, y de forma compatible. I2 e I4 no los incluyen.

## 19. Administración y soporte

| Tema | SRS de origen | ID original | Descripción | Tipo | Estado comparativo | Requerimientos relacionados |
|---|---|---|---|---|---|---|
| Rol de administrador | I1 | §3, RF-28-AC-2 | Media disputas de costo sin autorizar el gasto; atribuciones pendientes (PV-01) | RF | GAP | I3 §2.3 (ver nota 6) |
| Atención humana | I1 | RF-06 | "Persona de soporte" sin un rol definido | RF | GAP | I2:RF-13, I2:RF-23 |
| Soporte | I2 | §2.3, RF-23 | Rol de agente de soporte (2 personas, en horario); bandeja de conversaciones, tickets y alertas | RF | GAP | I3:RF-14 |
| Horario | I2 | C-06, §1.3 | Soporte de lunes a viernes de 9 a 18 h; el agente opera 24/7 | Restricción | GAP | — |
| Administrador | I3 | §2.3, §3.1.1 | Administrador de verificación: revisa evidencias y reportes; **no participa en decisiones comerciales** | Descripción de rol | GAP | I1:RF-28-AC-2 (ver nota 6) |
| Comunicación directa | I3 | RF-14 | Solicitar soporte o abrir un canal cliente–proveedor conservando los mensajes | RF | GAP | I1:RF-06; I2:RF-13 |
| — | I4 | — | **Sin rol de administrador ni de soporte** | — | GAP | — |

## 20. Visibilidad de dirección y datos sensibles, y privacidad

| Tema | SRS de origen | ID original | Descripción | Tipo | Estado comparativo | Requerimientos relacionados |
|---|---|---|---|---|---|---|
| Dirección del cliente | I1 | RF-54 | Dirección, fotos del hogar, horarios y teléfono solo para el trabajador **que el cliente autorizó** | RF | **CONFLICTO** | I2:RNF-04; I3:RD-07 (compatible con I1) |
| Datos del trabajador | I1 | RF-58 | Domicilio y teléfono del trabajador solo con **autorización del propio trabajador** | RF | **CONFLICTO** | I2:RNF-04 |
| Eliminación | I1 | RF-55 | Eliminar datos y fotos; el historial y los acuerdos se conservan; sin plazo (PV-15) | RF | GAP (falta I4) | I2:RF-21; I3:RF-15-AC-2 |
| Uso de datos | I1 | RNF-07 | No usar fotos ni conversaciones para fines no consentidos | RNF | GAP | I4 §2.4; I2:RD-01 |
| Integridad | I1 | RNF-11 | Acuerdos e historial no se alteran sin dejar rastro | RNF | GAP | I2:RNF-06; I3:RNF-05 |
| Historial | I1 | RF-21 | Historial consultable de acciones del agente y autorizaciones | RF | GAP | I2:RNF-06; I3:RNF-05 |
| Normativa | I1 | RD-11 | Cumplir la normativa de datos y revisar oficios de riesgo (normas sin identificar) | Regla de negocio | GAP | I2:RD-01, I2:C-03 |
| Revelación automática | I2 | RNF-04 | Antes de la 1.ª cita confirmada: solo colonia y municipio. **Desde la confirmación, el domicilio y los teléfonos de ambas partes son visibles** hasta 7 días después del cierre | RNF | **CONFLICTO** | I1:RF-54, I1:RF-58; I3:RD-07 |
| Cifrado | I2 | RNF-05 | TLS 1.2 o superior; AES-256 para INE, fotos y domicilios | Decisión técnica | GAP | I3:RNF-04 (HTTPS) |
| Bitácora | I2 | RNF-06 | Registros de solo adición; exportación en PDF y CSV; la anonimización es la única excepción | RNF | GAP | I1:RNF-11; I3:RNF-05 |
| LFPDPPP | I2 | RD-01 | Aviso y consentimiento previos; ARCO en plazo legal | Regla de negocio | GAP | I1:RD-11 |
| ARCO | I2 | RF-21 | Exportar, rectificar y anonimizar desde el panel; alerta a 5 días hábiles del plazo (20 días hábiles configurables) | RF | GAP | I1:RF-55; I3:RF-15 |
| Respaldos | I2 | RNF-14 | Respaldo cada 24 h; RPO ≤ 24 h, RTO ≤ 8 h | RNF | GAP | I1:RNF-03 |
| Dirección del cliente | I3 | RD-02, RD-07 | Antes de la cita, solo la zona; después, **cita aceptada por ambos y consentimiento expreso del cliente** | Regla de negocio | **CONFLICTO** | I2:RNF-04 |
| Consentimiento | I3 | RF-15-AC-1 | Si el cliente no autoriza, la dirección no se revela aunque la cita esté confirmada | RF | **CONFLICTO** | I2:RNF-04 |
| Eliminación | I3 | RF-15-AC-2, RD-09 | Eliminar o anonimizar en máximo 30 días; la bitácora se conserva anonimizada | RF / Regla de negocio | GAP | I1:RF-55; I2:RF-21 |
| Contacto | I3 | RF-14 | No revelar datos de contacto antes de confirmar la cita | RF | GAP | I1:RF-58 |
| HTTPS y roles | I3 | RNF-04 | Datos sensibles por HTTPS y con acceso por rol | RNF | CONSENSO | I1:RNF-08; I2:RNF-05; I4:RNF-03 |
| Bitácora | I3 | RNF-05 | Bitácora de aprobaciones y rechazos de cambios | RNF | GAP | I1:RNF-11; I2:RNF-06 |
| Privacidad | I4 | RNF-03 | Dirección y fotos solo para usuarios autorizados en el contexto del servicio | RNF | CONSENSO | I1:RF-54; I3:RNF-04 |
| Dirección no pública | I4 | RD-04 | La dirección y las fotos privadas no son públicas | Regla de negocio | CONSENSO | I1:RF-54; I2:RNF-04; I3:RD-02 |
| Uso de fotos | I4 | §2.4 | Las fotos se usan solo en el contexto necesario | Restricción | GAP | I1:RNF-07 |

## 21. Otros atributos de calidad (RNF)

| Tema | SRS de origen | ID original | Descripción | Tipo | Estado comparativo | Requerimientos relacionados |
|---|---|---|---|---|---|---|
| Rendimiento | I1 | RNF-04 | Búsqueda ≤ 2 s; conversación ≤ 3 s; recomendación ≤ 5 s | RNF | CONSENSO (valores distintos, ver nota 7) | I2:RNF-01, RNF-02; I3:RNF-01, RNF-07; I4:RNF-02 |
| Indicador de espera | I1 | RF-53 | Indicador "procesando" a los 2 s | RF | GAP | I2:RNF-01 (mensaje de espera a los 8 s) |
| Rendimiento | I2 | RNF-01, RNF-02 | Texto ≤ 5 s y voz ≤ 10 s (p95, 50 concurrentes); propuesta ≤ 120 s | RNF | CONSENSO (valores distintos) | I1:RNF-04 |
| Rendimiento | I3 | RNF-01, RNF-07 | ≤ 3 s p95 con 100 usuarios | RNF | CONSENSO (valores distintos) | I1:RNF-04 |
| Rendimiento | I4 | RNF-02 | ≤ 3 s sin contar servicios externos | RNF | CONSENSO (valores distintos) | I1:RNF-04 |
| Disponibilidad | I1 | RNF-05 | 99 % mensual | RNF | GAP (valores distintos) | I2:RNF-03; I3:RNF-06 |
| Disponibilidad | I2 | RNF-03 | 99.5 % mensual; mantenimiento de 2 a 5 h con 48 h de aviso | RNF | GAP | I1:RNF-05 |
| Disponibilidad | I3 | RNF-06, RNF-10 | 99 % mensual; aviso de 24 h; fórmula publicada | RNF | GAP | I1:RNF-05 |
| Resiliencia | I1 | RNF-03 | No perder conversaciones, citas ni acuerdos ante caídas | RNF | GAP | I2:RNF-14 |
| Usabilidad | I1 | RNF-01 | Sencilla, en español cotidiano, pocos pasos | RNF | CONSENSO | I2:RNF-07, RNF-13; I3:RNF-08; I4:RNF-01 |
| Móvil | I1 | RNF-02 | Celular común, sin instalación, conexión inestable | RNF | CONSENSO (uso móvil) | I3:RNF-02; I4:RNF-06; I2 (WhatsApp) |
| Móvil | I3 | RNF-02, RNF-08 | Pantallas de 360 px sin desplazamiento horizontal | RNF | CONSENSO | I1:RNF-02 |
| Usabilidad | I4 | RNF-01 | Interfaz comprensible para usuarios sin conocimientos técnicos | RNF | CONSENSO | I1:RNF-01 |
| Localización | I2 | RNF-13 | Español de México, DD/MM/AAAA, MXN | RNF | GAP | I3 §2.4 |
| Objetivos | I2 | OB-01 a OB-03 | Métricas del piloto (el SRS aclara que no son requerimientos) | Objetivo de negocio | GAP | — |

---

## Notas sobre los casos que no se confirmaron como conflicto

1. **Cantidad de proveedores recomendados (I1:RF-13 frente a I2:RF-04): GAP, no conflicto.** I1 pide 3 a 4 (I1:RF-13-AC-1) e I2, de 1 a 3. Recomendar **3** cumple ambos, y los dos coinciden en mostrar menos cuando no hay suficientes. La diferencia (¿se permite un 4.º?) sí requiere decisión del equipo.
2. **Suscripción (I2:RF-15) frente a I1:RNF-10: GAP con tensión.** I1:RNF-10 habla del *orden* de las recomendaciones, mientras que I2 usa la suscripción como *requisito para aparecer*. No es literalmente incompatible, pero el espíritu de RNF-10 ("no depender de pagos") choca con excluir a quien no paga.
3. **Precio en I4:RF-05:** I4 *muestra* el precio para comparar; I1:RF-36 excluye *filtrar* por precio. No chocan. El conflicto confirmado es I1:RF-36 frente a I3:RF-06.
4. **I1:RF-46 (detección automática, fuera del MVP) frente a I3:RF-18 (análisis con IA bajo demanda):** son funciones distintas. GAP.
5. **Cierre (I1:RF-60 frente a I3:RF-11-AC-4): no se confirma conflicto.** I3 define "concluido" como "etapas validadas **o** cerrado por acuerdo documentado" (I3 §1.3), así que no prohíbe cerrar sin validar todo. I1 no tiene concepto de etapas.
6. **Papel del administrador en disputas (I1:RF-28-AC-2 frente a I3 §2.3): GAP con tensión.** I1 dice que el administrador "resuelve" la disputa pero no autoriza ni modifica el acuerdo; I3 dice que "no participa en decisiones comerciales" ni modifica acuerdos. Ninguno permite al administrador alterar el acuerdo, pero sí difieren en si puede emitir una resolución.
7. **Umbrales de rendimiento y disponibilidad:** los valores difieren, pero el más estricto cumple a todos (≤ 2 s cumple ≤ 3 s; 99.5 % cumple 99 %; ≤ 5 s cumple ≤ 120 s). No son incompatibles; requieren unificación.

**Ajustes respecto a la comparación global anterior.** Tras revisar los criterios de aceptación con el criterio estricto, bajan de CONFLICTO a GAP o CONSENSO:

- Datos obligatorios de la solicitud
- Número de recomendaciones
- Orden de resultados
- Suscripción frente a RNF-10
- Condición de cierre
- Papel del administrador en disputas
- Rendimiento
- Disponibilidad

Se agregan como CONFLICTO, porque están respaldados por los criterios de aceptación:

- **Foto obligatoria en el reporte de avance:** I1:RF-22-AC-2 frente a I2:RF-10 e I3:RF-09.
- **Visibilidad de organizaciones sin aprobación:** I1:RF-15-AC-1 frente a I2:RF-17-AC-2 e I3:RD-08.

## Conflictos confirmados (todos: Pendiente de decisión del equipo)

| # | Conflicto | Requerimientos en choque |
|---|---|---|
| C-01 | Canal web / WhatsApp | I1:RE-01, §10 · I2:C-01, RNF-07, RNF-10 · I3 §3.1.4 · I4:RNF-06 |
| C-02 | Mecanismo de registro e identidad (derivado de C-01) | I1:RF-30 · I2:RF-20, §2.4 |
| C-03 | Notas de voz en el MVP | I1:RF-33 · I2:RF-01, RF-08-AC-7, RNF-01 |
| C-04 | Video en la solicitud | I2:RF-01-AC-4 · I3:RF-01, RF-03 |
| C-05 | Portafolio obligatorio | I1:RF-34 · I2:RF-07 |
| C-06 | Trabajadores no verificados en búsquedas | I1:RF-07, RF-12 · I2:RD-03, RF-07-AC-3 · I3:RF-13-AC-2, RD-08 |
| C-07 | Organizaciones visibles sin aprobación | I1:RF-15-AC-1 · I2:RF-17-AC-2 · I3:RD-08 |
| C-08 | Plantilla y asignación de trabajadores por la organización | I1:RF-37, RF-08-AC-3 · I2:RF-12, RF-17, RD-05, RF-22-AC-5 |
| C-09 | Definición de cercanía | I1:RD-04 · I2:RF-04(c), RF-05 |
| C-10 | Precio como criterio de búsqueda | I1:RF-36 · I3:RF-06 |
| C-11 | Territorio inicial | I2:RD-06, RF-02-AC-6 · I3 §2.4 |
| C-12 | Quién propone la cita y orden de confirmación | I1:RF-16, RF-38 (+ I3:RF-07) · I2:RF-06, RF-18-AC-5 |
| C-13 | Visita previa obligatoria para cotizar | I1:RF-18-AC-2 · I2:RF-08-AC-8 · I3:RF-03 |
| C-14 | Expiración de la propuesta | I1:RF-42-AC-3 (72 h) · I2:RF-08 (1 a 30 días) |
| C-15 | Plazo para responder a un cambio de costo | I1 E.3 (24 h) · I2:RF-09-AC-7 (48 h) |
| C-16 | Foto obligatoria en el avance | I1:RF-22-AC-2 · I2:RF-10 · I3:RF-09 |
| C-17 | Frecuencia del reporte de avance | I1:RF-45 · I2:RF-10 · I3:RF-09 |
| C-18 | Escalamiento cuando no hay reporte | I1:RF-57 · I2:RF-10-AC-4 · I3:RF-09-AC-4 |
| C-19 | Comentario obligatorio en la evaluación | I1:RF-47-AC-2 · I2:RF-11 · I3:RF-11 |
| C-20 | Escala de evaluación única frente a 4 dimensiones | I2:RF-11 · I3:RF-11 |
| C-21 | Evaluación bidireccional | I1 §10 · I2:RF-11 |
| C-22 | Revelación de la dirección del cliente | I1:RF-54 · I3:RD-07, RF-15-AC-1 · I2:RNF-04 |
| C-23 | Revelación de los datos del trabajador | I1:RF-58 · I2:RNF-04 |
