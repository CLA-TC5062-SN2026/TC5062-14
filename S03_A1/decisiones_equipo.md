# Decisiones del equipo previas a `SRS_equipo.md`

**Fuente:** `comparacion_requerimientos.md` (conflictos C-01 a C-23, más los gaps y tensiones que el análisis marcó como pendientes de decisión). No se usó ninguna otra fuente.

**SRS:** I1 = `SRS_final.md` · I2 = `SRS_final 1.md` · I3 = `SRS_final 2.md` · I4 = `SRS_final 3.md`

**Notas de lectura:**
- La "Recomendación del analista" es una propuesta y no cierra ninguna decisión. **Estado actual:** las 41 decisiones (DEC-01 a DEC-41) y sus justificaciones están resueltas y aprobadas por el equipo. Los detalles marcados como "Sigue abierto" en cada decisión quedan como pendientes para redactar `SRS_equipo.md`.
- Cuando un valor del SRS de origen está marcado como "decisión técnica del analista" (I1) o "propuesto por revisión técnica" (I2), se indica, porque no proviene de la elicitación.
- **Orden sugerido para decidir:** primero el bloque 1 (estructural), porque varias decisiones posteriores dependen de él.

| Bloque | Decisiones |
|---|---|
| 1. Alcance y canal | DEC-01 a DEC-05 |
| 2. Perfiles, verificación y organizaciones | DEC-06 a DEC-10 |
| 3. Solicitud, búsqueda y recomendación | DEC-11 a DEC-15 |
| 4. Citas y propuestas | DEC-16 a DEC-19 |
| 5. Cambios de costo y pagos | DEC-20 a DEC-24 |
| 6. Seguimiento y cierre | DEC-25 a DEC-29 |
| 7. Evaluaciones, reportes y administración | DEC-30 a DEC-35 |
| 8. Privacidad | DEC-36 a DEC-38, DEC-41 |
| 9. Atributos de calidad | DEC-39 a DEC-40 |

---

## Bloque 1. Alcance y canal

### DEC-01 — Canal principal de interacción

**SRS involucrados:** I1, I2, I3, I4 (C-01)

**Situación:** I1 (RE-01; WhatsApp en §10 como fuera del MVP), I3 (§2.1, §3.1.4) e I4 (RNF-06) especifican una aplicación web. I2 especifica WhatsApp para cliente y trabajador, más un panel web para organización, administración y soporte (C-01, RNF-07, RNF-10). Esta decisión condiciona DEC-02, DEC-04 y DEC-39.

**Opción A:** Aplicación web responsive para todos los actores; WhatsApp fuera del MVP (I1, I3, I4).

**Opción B:** WhatsApp (API oficial de WhatsApp Business) para cliente y trabajador, más panel web para organización, administración y soporte (I2).

**Recomendación del analista:** Opción A. La sostienen 3 de 4 SRS. I1 excluyó WhatsApp de forma deliberada, e I2 trae dependencias externas que ningún otro SRS contempla: aprobación de Meta, plantillas fuera de la ventana de 24 h (I2:C-07) y firma de webhooks (I2:RNF-16). El argumento de usabilidad de I2 (trabajadores habituados a WhatsApp, I2:RNF-07) es válido; conviene conservarlo como posterior y cubrirlo con los RNF de uso móvil (I1:RNF-02, I3:RNF-08).

**Decisión del equipo:** Otra. "El MVP se entrega como una aplicación web y una aplicación móvil nativa. WhatsApp queda fuera del MVP." ⚠️ Decisión nueva del equipo sin respaldo en los SRS: contradice I2 §1.2 (que excluye la app nativa) y la condición "sin instalación complicada" de I1:RNF-02.

**Justificación del equipo:** El equipo decide ofrecer la plataforma en web y como aplicación móvil nativa para facilitar el acceso desde el celular, y deja WhatsApp fuera del MVP por sus dependencias externas (API, plantillas y aprobación de Meta).

**Requerimientos afectados:**
- Se mantienen: I1:RE-01, I1 §2.5, I1 §10; I3 §2.1, §3.1.4; I4:RNF-06.
- Requieren ajuste: I1:RNF-02, I2 §1.2, I3 §3.1.2.
- Quedan sin efecto: I2:C-01, C-07, RNF-07, RNF-10, RNF-16.
- Se revisan: I2:RNF-12; I3:RNF-02, RNF-08.

**Impacto sobre otras decisiones:** DEC-02 (registro válido en web y app), DEC-04 (se reevaluó porque la app puede grabar audio), DEC-39 (los umbrales de I2 pierden su fundamento). Aumenta el riesgo de capacidad (I1:PV-17, PV-18). **Queda pendiente, sin decidir:** qué actores usan la app nativa.

### DEC-02 — Mecanismo de registro e identidad del usuario

**SRS involucrados:** I1, I2, I3, I4 (C-02, derivado de C-01)

**Situación:** I1:RF-30 define cuentas con inicio de sesión, y la autenticación es obligatoria también en I3:RNF-03 e I4:RNF-04. I2 usa el número de WhatsApp como identificador y da de alta al usuario con su primer mensaje, pidiendo consentimiento del aviso de privacidad y declaración de mayoría de edad (I2:RF-20). Para el panel exige correo y contraseña con 2FA (I2:RNF-15).

**Opción A:** Cuenta con registro e inicio de sesión para todos los roles (I1:RF-30; I3:RNF-03; I4:RNF-04).

**Opción B:** Identidad por número de WhatsApp para cliente y trabajador, y credenciales con 2FA solo para el panel web (I2:RF-20, I2:RNF-15).

**Recomendación del analista:** Seguir lo que se decida en DEC-01; con la Opción A de DEC-01, corresponde la Opción A aquí. Sea cual sea la elección, el consentimiento del aviso de privacidad y la declaración de mayoría de edad de I2:RF-20 son un GAP que ningún otro SRS cubre; se trata en DEC-37.

**Decisión del equipo:** A. Cuenta con registro e inicio de sesión para todos los roles, válida en la web y en la app.

**Justificación del equipo:** Como WhatsApp quedó fuera del MVP (DEC-01), el equipo adopta cuentas con registro e inicio de sesión para todos los roles, en línea con I1, I3 e I4.

**Requerimientos afectados:**
- Se adoptan: I1:RF-30; I3:RNF-03, LD-01; I4:RNF-04.
- Sin efecto: I2:RF-20 como mecanismo de alta por WhatsApp.
- Siguen abiertos: el consentimiento de I2:RF-20 (se decide en DEC-37) y las reglas de contraseña y 2FA de I2:RNF-15 (no adoptadas).

**Impacto sobre otras decisiones:** DEC-37 (integrar el consentimiento al registro por cuenta).

### DEC-03 — Agente de IA conversacional en el MVP

**SRS involucrados:** I1, I2, I3, I4 (GAP)

**Situación:** I1 (RF-01, RF-03, RF-05, RF-06), I2 (RF-02, RF-03, RF-13) e I3 (RF-02, RF-03) especifican un agente que conversa con el cliente, pide los datos faltantes y presenta un resumen confirmable. I4 no especifica ningún agente: la solicitud se registra con datos mínimos (I4:RF-01).

**Opción A:** Incluir el agente conversacional, con resumen confirmable y escalamiento a una persona (I1, I2, I3).

**Opción B:** Sin agente conversacional; solicitud por captura directa (I4).

**Recomendación del analista:** Opción A. El agente de IA es parte del valor del producto descrito en I1 §2.2, I2 §1.2 e I3 §1.1. I3 §2.5 ya prevé la captura manual como contingencia si la IA no está disponible, lo que aprovecha el enfoque de I4 sin eliminar el agente.

**Decisión del equipo:** A. Se incluye el agente conversacional, con resumen confirmable y escalamiento a una persona.

**Justificación del equipo:** El agente de IA es parte central del valor del producto descrito en tres de los cuatro SRS, por lo que se incluye en el MVP.

**Requerimientos afectados:**
- Se adoptan: I1:RF-01, RF-03, RF-05, RF-06; I2:RF-02; I3:RF-02, RF-03.
- Siguen abiertos: I1:RF-56 e I2:RF-03 (gaps por resolver en el SRS consolidado).
- I4:RF-01 deja de ser el flujo principal. Pasaría a respaldo solo si se adopta la contingencia de I3 §2.5, que aún no se ha decidido.

**Impacto sobre otras decisiones:** DEC-05, DEC-16 (el agente puede proponer horarios), DEC-35 (hace falta escalar a una persona), DEC-39 (umbrales de respuesta de la IA).

### DEC-04 — Notas de voz en el MVP

**SRS involucrados:** I1, I2 (C-03)

**Situación:** I1:RF-33 deja el envío de audio fuera del MVP; I1 indica que solo lo propuso el PO ficticio. I2:RF-01 acepta notas de voz de hasta 3 minutos con transcripción, I2:RF-08-AC-7 permite dictar la cotización y I2:RNF-01 fija un tiempo de respuesta para la voz. I3 e I4 no mencionan audio.

**Opción A:** Notas de voz fuera del MVP (I1).

**Opción B:** Notas de voz con transcripción en el MVP (I2).

**Recomendación del analista:** Opción A si DEC-01 elige el canal web. En I2, la voz está ligada al flujo de WhatsApp y a la usabilidad del trabajador en ese canal; sin WhatsApp pierde su justificación principal y suma la dependencia de un servicio de voz a texto.

*Nota tras DEC-01:* con la app nativa, el argumento del canal web se debilita. La recomendación A se mantuvo por el respaldo de un solo SRS, la dependencia de un servicio de voz a texto y el riesgo de capacidad (I1:PV-18).

**Decisión del equipo:** A. Las notas de voz quedan fuera del MVP.

**Justificación del equipo:** Las notas de voz solo tienen respaldo en un SRS y agregan la dependencia de un servicio de voz a texto, en un alcance que ya creció con la app nativa; por eso se dejan para una versión posterior.

**Requerimientos afectados:**
- Se adopta: I1:RF-33 como función fuera del MVP.
- Sin efecto en el MVP: la parte de voz de I2:RF-01 (incluidos RF-01-AC-2, AC-4 en lo relativo a voz y AC-7), I2:RF-08-AC-7 y el umbral de voz de I2:RNF-01.
- Siguen abiertos: el resto de I2:RF-01 (límites de imágenes, proyecto múltiple).

**Impacto sobre otras decisiones:** DEC-11 (el MVP queda con texto y fotos; falta decidir el video), DEC-39 (desaparece el umbral de voz).

### DEC-05 — Funciones de IA adicionales de I3

**SRS involucrados:** I3, más I1 como referencia (GAP)

**Situación:** Solo I3 incluye dos funciones de IA: representación visual del alcance (I3:RF-16, RD-10) y análisis de la justificación de un incremento de costo (I3:RF-18, RD-11). Ninguna decide por el usuario. I1 excluye del MVP una función parecida pero distinta, la detección automática de desviaciones (I1:RF-46).

**Opción A:** Incluir ambas funciones (I3).

**Opción B:** Excluir ambas del MVP (I1, I2 e I4 no las incluyen).

**Opción C:** Incluir solo el análisis de justificaciones (I3:RF-18), porque apoya la decisión del cliente sobre costos.

**Recomendación del analista:** Opción B para el MVP. Las dos funciones son exclusivas de I3 y aumentan la dependencia de la IA en un alcance que I1 ya considera en riesgo por la capacidad del equipo (I1:PV-18). Pueden registrarse como funciones posteriores.

**Decisión del equipo:** A. Se incluyen en el MVP la representación visual del alcance (I3:RF-16) y el análisis de justificaciones de incrementos (I3:RF-18).

**Justificación del equipo:** El equipo incluye ambas funciones porque refuerzan la comprensión del alcance y la decisión informada del cliente sobre los costos, sin que la IA decida por él.

**Requerimientos afectados:**
- Se adoptan: I3:RF-16, RD-10, RNF-11, LD-07; I3:RF-18, RD-11.
- Se mantiene fuera del MVP: I1:RF-46 (detección automática por umbral), que es una función distinta.

**Impacto sobre otras decisiones:** DEC-11 (I3:RF-16 parte de imágenes de referencia, coherente con aceptar fotos), DEC-20 y DEC-21 (el análisis se aplica al flujo de cambios de costo que se decida), DEC-36 (las imágenes de referencia requieren control de acceso, I3:RNF-11), DEC-39 (dos funciones de IA más con tiempo de respuesta por definir). Aumenta el riesgo de capacidad (I1:PV-18).

---

## Bloque 2. Perfiles, verificación y organizaciones

### DEC-06 — Trabajadores no verificados en búsquedas y recomendaciones

**SRS involucrados:** I1, I2, I3 (C-06)

**Situación:** En I1 el perfil es visible en cuanto se completan los datos mínimos (I1:RF-07), y la identidad verificada es solo un filtro opcional (I1:RF-12). I2 (RD-03, RF-07-AC-3) e I3 (RD-08, RF-13-AC-2) excluyen de las búsquedas a quien no está verificado o aprobado. I4 no trata la verificación.

**Opción A:** Mostrar a todos los trabajadores con perfil completo, distinguir lo declarado de lo verificado y ofrecer un filtro por verificación (I1:RF-07, RF-10, RF-12).

**Opción B:** Mostrar solo a trabajadores verificados o aprobados por el administrador (I2, I3).

**Recomendación del analista:** Opción B. La sostienen 2 de los 3 SRS que tratan el tema, y coincide con el problema de confianza que todos los SRS describen. La distinción entre lo declarado y lo verificado de I1:RF-10 puede conservarse para la experiencia (ver DEC-07). Riesgo que conviene registrar: depende de que el administrador pueda revisar a tiempo, capacidad que I1 marca como no confirmada.

**Decisión del equipo:** A. Las búsquedas muestran a todos los trabajadores con perfil completo; el perfil distingue lo declarado de lo verificado y el cliente puede filtrar por verificación.

**Justificación del equipo:** El equipo prefiere no excluir a trabajadores aún no verificados, para que haya resultados desde el inicio. La confianza se protege mostrando con claridad qué está verificado y permitiendo que el cliente filtre por verificación.

**Requerimientos afectados:**
- Se adoptan: I1:RF-07 (visible con datos mínimos), RF-10, RF-12.
- Sin efecto: I2:RD-03, I2:RF-07-AC-3; I3:RD-08, I3:RF-13-AC-2 en la parte que excluye a los no verificados.
- Requiere ajuste: I3:RF-04 ("solo podrán recomendarse proveedores con perfil verificado").
- Sigue abierto: si se muestran los perfiles rechazados o con la verificación retirada. Ningún SRS lo resuelve.

**Impacto sobre otras decisiones:** DEC-07 (la verificación pasa a ser información para el cliente), DEC-09 (consistencia), DEC-15 (las recomendaciones pueden incluir perfiles no verificados).

### DEC-07 — Modelo de verificación: identidad y experiencia

**SRS involucrados:** I1, I2, I3 (GAP)

**Situación:** I1 tiene dos marcas independientes: identidad verificada (RF-09) y experiencia verificada (RF-35). No exige certificados (RD-03) y retira la verificación ante documentos vencidos o información falsa (RF-29). I2 hace una sola aprobación del perfil con INE (RF-07). I3 maneja un estado único (pendiente, verificado, rechazado o suspendido) que cubre identidad, organización y portafolio (RF-13).

**Opción A:** Dos marcas separadas para identidad y experiencia, con retiro de la verificación (I1).

**Opción B:** Una sola aprobación del perfil (I2).

**Opción C:** Un estado único de verificación que incluye "suspendido", con fecha y motivo (I3).

**Recomendación del analista:** Opción A, combinable con el estado "suspendido" de la Opción C. Separar identidad y experiencia permite cumplir I1:RD-03, que no exige certificados a todos los oficios, y le da al cliente información más precisa. Si se elige B en DEC-06, la marca que habilita aparecer en búsquedas debería ser la de identidad.

*Nota tras DEC-06 (A):* la verificación ya no condiciona la visibilidad; separar las marcas da al cliente información más precisa.

**Decisión del equipo:** A. Dos marcas independientes, identidad verificada y experiencia verificada, que se retiran si un documento vence o si el administrador confirma información falsa.

**Justificación del equipo:** Como la verificación sirve para que el cliente decida (DEC-06), el equipo distingue la identidad de la experiencia. Así se respeta que no todos los oficios cuentan con certificados.

**Requerimientos afectados:**
- Se adoptan: I1:RF-09, RF-35, RF-29, RD-02, RD-03.
- Sin efecto: la aprobación única de I2:RF-07; el estado único de I3:RF-13.
- Siguen abiertos: qué evidencia de experiencia se acepta sin certificados (I1:PV-02); la visibilidad de perfiles rechazados o con información falsa confirmada (puede retomarse en DEC-33).

**Impacto sobre otras decisiones:** DEC-08 (el portafolio como evidencia), DEC-09 (mismo modelo para organizaciones), DEC-33 (suspensión y sanciones).

**Resolución posterior (tensión con DEC-33):** Otra, aprobada por el equipo. La verificación se retira en dos casos: (1) automáticamente, cuando un documento vence (I1:RF-29-AC-1); (2) cuando el administrador confirma que una información es falsa, ya sea porque la conoce por una solicitud de soporte (DEC-35) o en su propia revisión. Es una combinación de I1:RF-29 con el mecanismo de DEC-35, sin reportes formales; RF-29-AC-2 se ajusta para no depender de I1:RF-27 ni RF-28.
**Justificación del equipo:** Verificar es la función que DEC-34 dejó al administrador, y la solicitud de soporte de DEC-35 le da una vía para conocer información falsa sin crear un sistema de reportes.

### DEC-08 — Portafolio obligatorio u opcional

**SRS involucrados:** I1, I2, I3 (C-05)

**Situación:** Para I1 el portafolio es opcional: el trabajador "puede" cargarlo (RF-34). I3 lo muestra solo si existe (RF-05-AC-2). I2 exige al menos 3 fotos de trabajos para crear el perfil (RF-07, RF-07-AC-1).

**Opción A:** Portafolio opcional (I1, I3).

**Opción B:** Mínimo 3 fotos de trabajos anteriores, obligatorio (I2).

**Recomendación del analista:** Opción A. La sostienen 2 SRS, y la obligatoriedad podría excluir a trabajadores sin historial fotográfico. Si en DEC-07 se elige verificar la experiencia por separado, el portafolio puede servir como evidencia sin ser un requisito del registro.

**Decisión del equipo:** A. El portafolio es opcional.

**Justificación del equipo:** Exigir fotos de trabajos anteriores sería una barrera de entrada, cuando el equipo decidió mostrar a todos los trabajadores con perfil completo (DEC-06). El portafolio sigue disponible como evidencia para obtener la marca de experiencia verificada (DEC-07).

**Requerimientos afectados:**
- Se adoptan: I1:RF-34; I3:RF-05-AC-2.
- Sin efecto: el mínimo de 3 fotos de I2:RF-07 y el caso "menos de 3 fotos" de I2:RF-07-AC-1. La parte de ese criterio que rechaza el registro sin INE tampoco bloquea, por DEC-06.

**Impacto sobre otras decisiones:** DEC-07 (el portafolio como posible evidencia de experiencia; criterio de aceptación pendiente, I1:PV-02).

### DEC-09 — Organizaciones visibles antes de su aprobación

**SRS involucrados:** I1, I2, I3 (C-07)

**Situación:** En I1, la organización aparece en búsquedas en cuanto completa su perfil básico (RF-15-AC-1); su verificación es una marca aparte (RF-62). En I2 queda "pendiente" y fuera de las búsquedas hasta que la aprueba el administrador (RF-17-AC-2). En I3 solo se recomiendan perfiles verificados (RD-08).

**Opción A:** Visible al completar el perfil, con "organización verificada" como marca aparte (I1).

**Opción B:** No visible hasta su aprobación o verificación (I2, I3).

**Recomendación del analista:** La misma opción que se elija en DEC-06, para que trabajadores y organizaciones sigan una regla consistente. Si DEC-06 es B, aquí corresponde B.

**Decisión del equipo:** A. La organización es visible al completar su perfil básico; "organización verificada" es una marca separada que otorga el administrador.

**Justificación del equipo:** Por consistencia con DEC-06 y DEC-07, las organizaciones siguen la misma regla que los trabajadores: son visibles al completar su perfil y muestran con claridad si están verificadas.

**Requerimientos afectados:**
- Se adoptan: I1:RF-15, RF-62.
- Sin efecto: I2:RF-17-AC-2 (en la parte de "pendiente, no aparece en búsquedas"); I3:RD-08 aplicado a organizaciones.
- Sigue abierto: los campos mínimos del registro (el RFC solo aparece en I2:RF-17) y qué significa "organización registrada" (I1:PV-03).

**Impacto sobre otras decisiones:** DEC-10 (perfil definido; queda por decidir si la organización gestiona trabajadores).

### DEC-10 — Gestión de plantilla y asignación de trabajadores por la organización

**SRS involucrados:** I1, I2, I3 (C-08)

**Situación:** I1 deja fuera del MVP la administración de múltiples trabajadores y jerarquías (RF-37). Limita a la organización a declarar disponibilidad general, sin agenda por empleado (RF-08-AC-3). I2 incluye un panel con asignación de trabajadores de la plantilla (RF-12), vinculación de trabajadores (RF-17), una regla según la cual la organización asigna al ejecutor (RD-05) y edición del horario de cada trabajador (RF-22-AC-5). Sin embargo, marca RF-12 y RF-17 con prioridad O (opcional). I3 lo menciona de forma ambigua: la organización actúa "para los trabajadores que representa" (§2.3).

**Opción A:** Fuera del MVP; la organización tiene un perfil y una disponibilidad general (I1).

**Opción B:** Panel con plantilla, asignación y agenda por trabajador en el MVP (I2).

**Recomendación del analista:** Opción A. El propio I2 clasifica estas funciones como opcionales, I1 las excluye de forma explícita e I3 no las desarrolla en ningún RF. El registro básico de organizaciones sí está en consenso y se mantiene.

**Decisión del equipo:** A. La gestión de plantilla, la asignación de trabajadores y la agenda por empleado quedan fuera del MVP; la organización tiene un perfil y una disponibilidad general.

**Justificación del equipo:** El propio I2 marca estas funciones como opcionales e I1 las excluye explícitamente. Con un alcance que ya creció en el Bloque 1, el equipo mantiene a la organización con su perfil y disponibilidad general.

**Requerimientos afectados:**
- Se adoptan: I1:RF-37 (fuera del MVP), I1:RF-08-AC-3.
- Sin efecto en el MVP: I2:RF-12, la vinculación de la plantilla de I2:RF-17 (incluido RF-17-AC-4), I2:RD-05, I2:RF-22-AC-5.
- Requiere precisión: I3 §2.3 ("para los trabajadores que representa") queda limitado al perfil de la organización.

**Impacto sobre otras decisiones:** DEC-16 (la cita con una organización se confirma con la organización, no con un trabajador asignado), DEC-25 y DEC-27 (el avance lo reporta la organización como proveedor).

---

## Bloque 3. Solicitud, búsqueda y recomendación

### DEC-11 — Formatos multimedia: video en la solicitud

**SRS involucrados:** I1, I2, I3, I4 (C-04)

**Situación:** I2 rechaza de forma explícita los videos (RF-01-AC-4). I3 acepta "fotografías o videos" (RF-01, RF-03). I1 (RF-02) e I4 (RF-01) solo hablan de fotos.

**Opción A:** Solo fotografías; no se aceptan videos (I1, I2, I4).

**Opción B:** Fotografías y videos opcionales (I3).

**Recomendación del analista:** Opción A. Tres SRS se limitan a fotos y uno rechaza el video expresamente. Se simplifican el almacenamiento y el control de acceso a evidencias (I3:RNF-11).

**Decisión del equipo:** B. La solicitud acepta fotografías y videos, ambos opcionales.

**Justificación del equipo:** Un video describe mejor el espacio y el problema que una foto, y le sirve al proveedor para valorar el trabajo. Además, I3 lo cuenta como evidencia suficiente para cotizar sin visita.

**Requerimientos afectados:**
- Se adoptan: I3:RF-01; la parte "fotografía o video" de I3:RF-03.
- Sin efecto: el rechazo de video de I2:RF-01-AC-4 (ya parcialmente sin efecto por DEC-04).
- Requieren ajuste: I1:RF-02, I4:RF-01 (solo mencionan fotos).
- Sigue abierto: ningún SRS fija límites de duración, tamaño ni cantidad para el video (I2 solo los define para imágenes: 5 MB y 10 por proyecto).

**Impacto sobre otras decisiones:** DEC-17 (el video cuenta como evidencia del espacio), DEC-36 (control de acceso a los videos del domicilio, I3:RNF-11), DEC-39 (la carga de archivos queda fuera de los tiempos de respuesta, I3:RNF-07).

### DEC-12 — Datos mínimos de ubicación en la solicitud

**SRS involucrados:** I1, I2, I3, I4 (GAP; definiciones compatibles)

**Situación:** I1:RF-04 pide colonia o zona, I3:RF-01 zona aproximada e I4:RF-01 ubicación general. I2:RF-02 exige el domicilio completo (calle, número, colonia, municipio) para completar la ficha, porque lo necesita para calcular el radio de búsqueda. No hay conflicto, pero la decisión afecta a DEC-13 y DEC-36.

**Opción A:** Para buscar basta con la colonia o zona aproximada; el domicilio exacto se captura después (I1, I3, I4).

**Opción B:** Domicilio completo obligatorio antes de buscar (I2).

**Recomendación del analista:** Opción A. Es coherente con las reglas de privacidad que solo revelan la dirección después de la cita (I1:RF-54, I3:RD-02) y no depende de un servicio de geocodificación. Si en DEC-13 se elige el radio en km, conviene revisarla.

**Decisión del equipo:** A. Para buscar basta la colonia o una zona aproximada; el domicilio exacto se captura después.

**Justificación del equipo:** Pedir solo la zona aproximada protege la dirección del cliente hasta que exista una cita y cumple con la mayoría de los SRS.

**Requerimientos afectados:**
- Se adoptan: I1:RF-04 (colonia o zona); I3:RF-01, LD-02; I4:RF-01.
- Sin efecto: el domicilio completo como requisito de "ficha completa" en I2:RF-02 y el criterio I2:RF-02-AC-1.
- Sigue abierto: en qué momento se captura el domicilio exacto (junto con DEC-36).

**Impacto sobre otras decisiones:** DEC-13 (favorece la cobertura por zona), DEC-36 (cuándo y cómo se comparte la dirección), DEC-38 (la validación del territorio se hace por colonia o municipio).

### DEC-13 — Definición de "cercanía"

**SRS involucrados:** I1, I2, I3 (C-09)

**Situación:** Para I1, cercano significa que el trabajador atiende la colonia del cliente o zonas vecinas (RD-04); su definición operativa sigue pendiente (PV-05). I3 usa la zona de cobertura del proveedor (RF-04). I2 usa un radio en línea recta de 10 km, ampliable a 20 km (RF-04(c), RF-05).

**Opción A:** Zona de cobertura que declara el proveedor (I1, I3).

**Opción B:** Radio geográfico de 10 km, ampliable a 20 km, desde la ubicación base (I2).

**Recomendación del analista:** Opción A. La sostienen 2 SRS, encaja con DEC-12 (no requiere el domicilio exacto ni geocodificación) y deja que el proveedor declare dónde trabaja. Falta definir cómo se declara la cobertura (I1:PV-05).

**Decisión del equipo:** A. "Cercano" significa que la zona del cliente está dentro de la cobertura que declara el proveedor (su colonia o colonias vecinas).

**Justificación del equipo:** Es la única definición compatible con buscar solo con la zona aproximada (DEC-12), y deja que cada proveedor declare dónde trabaja.

**Requerimientos afectados:**
- Se adoptan: I1:RD-04; I3:RF-04 (cobertura).
- Sin efecto: el radio de 10 km de I2 (criterio (c) de RF-04 y el glosario "Radio de búsqueda"), el caso de 10.5 km de I2:RF-04-AC-2 y la distancia en km de I2:RF-04-AC-6.
- Requieren ajuste: I1:RF-14 ("ampliar la zona" = incluir colonias vecinas adicionales) e I2:RF-05 ("Ampliar a 20 km").
- Sigue abierto: cómo se declara la cobertura y qué cuenta como "zona vecina" (I1:PV-05).

**Impacto sobre otras decisiones:** DEC-14 (el orden por cercanía de I3:RF-06 no tiene distancia que medir), DEC-38 (el territorio define las colonias que se pueden declarar).

### DEC-14 — Precio como criterio de búsqueda

**SRS involucrados:** I1, I2, I3, I4 (C-10)

**Situación:** I1 deja fuera del MVP el filtro por rango de precio por dudas de viabilidad con los datos iniciales (RF-36). I3 permite filtrar y ordenar por precio (RF-06). I4 solo muestra el precio o rango cuando existe (RF-05), e I2 declara que los rangos son solo de referencia y que el precio lo fija el prestador (RD-04).

**Opción A:** Sin precio como criterio de búsqueda (I1).

**Opción B:** Filtrar y ordenar por precio (I3).

**Opción C:** Mostrar el precio o rango como dato de referencia, sin usarlo para filtrar ni ordenar (I4:RF-05, I2:RD-04).

**Recomendación del analista:** Opción C. Es compatible con I1, que solo excluye el *filtro*, con I2 e I4. Además evita el problema de viabilidad que señala I1 al no depender de que todos los proveedores registren precios comparables.

**Decisión del equipo:** B. El cliente puede filtrar y ordenar los resultados por precio.

**Justificación del equipo:** El precio es un factor que el cliente toma en cuenta al elegir, así que el equipo permite usarlo para filtrar y ordenar las opciones.

**Requerimientos afectados:**
- Se adoptan: I3:RF-06 en lo relativo al precio (incluido RF-06-AC-3: los resultados sin precio comparable se excluyen del filtro salvo que el cliente pida incluirlos); el rango de precio en el perfil (I3:RF-05).
- Sin efecto: I1:RF-36 deja de estar fuera del MVP.
- Se mantiene, compatible: I2:RD-04 (el precio es una referencia que define el prestador).
- Siguen abiertos: el riesgo de viabilidad que I1 señalaba para este filtro; cómo se captura el precio o rango del proveedor para que sea comparable (ningún SRS lo define).
- Nota: esta decisión solo cubre el precio. El orden por cercanía y por garantía de I3:RF-06 no se decidió aquí, y con DEC-13 no hay distancia en km.

**Impacto sobre otras decisiones:** DEC-15 (el filtro aporta poco con pocas opciones).

### DEC-15 — Número de proveedores recomendados

**SRS involucrados:** I1, I2, más I3 e I4 como referencia (GAP; rangos compatibles)

**Situación:** I1 recomienda de 3 a 4 (RF-13) e I2 de 1 a 3 (RF-04). Con menos candidatos, los dos muestran los que haya. I3 e I4 no fijan un número.

**Opción A:** De 3 a 4 recomendaciones (I1).

**Opción B:** Hasta 3 recomendaciones (I2).

**Opción C:** Sin límite: lista filtrable o catálogo (I3:RF-06, I4:RF-02).

**Recomendación del analista:** Opción B (hasta 3; si hay menos, se avisa). Cumple ambos SRS, porque 3 entra en el rango de I1. Mantiene el comportamiento de recomendación que tanto I1 como I2 distinguen de un catálogo abierto. El aviso cuando hay menos opciones se toma de I1:RF-13-AC-2. El "3 a 4" de I1 es una decisión técnica de su analista.

*Nota tras DEC-14 (B):* filtrar u ordenar por precio entre pocas opciones aporta poco; la Opción C o una combinación encajaban mejor con DEC-14.

**Decisión del equipo:** A. Se recomiendan de 3 a 4 proveedores, cada uno con una explicación breve; si hay menos de 3, se muestran los que existan con un aviso. El cliente elige; la IA no asigna.

**Justificación del equipo:** Recomendar de 3 a 4 opciones explicadas da al cliente margen para comparar sin saturarlo, y mantiene la regla de que el cliente elige y la IA no asigna.

**Requerimientos afectados:**
- Se adoptan: I1:RF-13 (incluidos RF-13-AC-1 y RF-13-AC-2).
- Sin efecto: el límite de 3 de I2:RF-04 y la posición reservada "Nuevo verificado" de I2:RF-04 / RF-04-AC-4.
- Se mantiene, compatible: la explicación de cada recomendación (I3:RF-04-AC-3).
- Siguen abiertos: el filtro y orden por precio de DEC-14 opera sobre 3 o 4 opciones; queda por decidir si el cliente puede ver más compatibles (catálogo de I4:RF-02, que no se adoptó). El "3 a 4" es una decisión técnica del analista de I1, sin respaldo de la elicitación.

**Impacto sobre otras decisiones:** DEC-14 (alcance práctico del filtro por precio), DEC-16 (el cliente agenda con el proveedor que elige de esta lista).

---

## Bloque 4. Citas y propuestas

### DEC-16 — Quién propone la cita y en qué orden se confirma

**SRS involucrados:** I1, I2, I3, I4 (C-12)

**Situación:** En I1, el agente propone horarios compatibles con ambas agendas, el cliente elige y luego acepta el trabajador (RF-16, RF-38). En I3, el cliente elige un horario disponible y el proveedor acepta (RF-07). En I2, el prestador propone y confirma y después confirma el cliente (RF-06-AC-1, RF-18-AC-5). I4 solo registra la fecha acordada, sin doble confirmación (RF-07).

**Opción A:** El sistema o agente propone según la disponibilidad, el cliente elige y el trabajador acepta (I1, I3).

**Opción B:** El prestador propone y confirma, y el cliente confirma después (I2).

**Opción C:** Registrar la fecha y el horario acordados sin doble confirmación (I4).

**Recomendación del analista:** Opción A. La sostienen 2 SRS; la doble confirmación aparece en 3 de 4, y coincide con el papel coordinador del agente (si DEC-03 elige A). Los detalles de I1 (expiración a las 24 h, cancelación tardía) pueden decidirse aparte.

**Decisión del equipo:** B. El prestador propone la fecha y la confirma primero; el cliente confirma después. La cita solo queda confirmada con ambas confirmaciones.

**Justificación del equipo:** El prestador conoce su agenda real y la duración de su trabajo, así que es quien propone la fecha. Se mantiene la doble confirmación para que ninguna cita quede agendada sin el visto bueno del cliente.

**Requerimientos afectados:**
- Se adopta: el flujo de propuesta y confirmación de I2:RF-06 (RF-06-AC-1, RF-06-AC-2) e I2:RF-18-AC-5.
- Sin efecto: I1:RF-16 (el agente propone horarios); el orden cliente → trabajador de I1:RF-38 y RF-38-AC-1; el paso "el cliente elige el horario" de I3:RF-07-AC-1.
- Se mantiene, compatible: la doble confirmación (I1:RF-38, I3:RF-07-AC-2, I3:LD-03).
- Siguen abiertos (esta opción no los decide): el resto de I2:RF-06 (bloqueo de franjas, "gana el primero" AC-7, recordatorio AC-6, agendamiento de la ejecución); la aceptación previa del prestador en 4 h de I2:RF-18; la notificación de I1:RF-39, la expiración de I1:RF-38-AC-3 y la cancelación tardía de I1:RF-17-AC-2.

**Impacto sobre otras decisiones:** DEC-03 (el agente ya no propone horarios), DEC-10 (si el proveedor es una organización, ella propone y confirma), DEC-17 (la visita se agenda con este flujo).

### DEC-17 — ¿Es obligatoria la visita previa para cotizar?

**SRS involucrados:** I1, I2, I3 (C-13)

**Situación:** I1 no permite enviar la propuesta sin una visita realizada (RF-18-AC-2). En I2 la visita es opcional y se puede cotizar desde el estado "asignado" (RF-08-AC-8). I3 la propone solo cuando la solicitud confirmada no tiene datos suficientes (RF-03-AC-2, RF-03-AC-4).

**Opción A:** Visita siempre obligatoria (I1).

**Opción B:** Visita opcional (I2).

**Opción C:** Visita obligatoria solo si faltan datos (oficio, resultado, zona, fecha, materiales y medidas o foto) (I3).

**Recomendación del analista:** Opción C. Resuelve la preocupación de I1, que la propuesta se base en información suficiente, sin obligar a una visita en trabajos ya bien descritos, que es el caso que I2 quiere evitar. Además usa un criterio verificable ya escrito en I3.

**Decisión del equipo:** B. La visita de valoración es opcional; el prestador puede cotizar sin visita.

**Justificación del equipo:** Muchos trabajos pueden cotizarse con la descripción, las fotos y los videos de la solicitud (DEC-11). Por eso la visita queda como opción y no como requisito, para no alargar el proceso.

**Requerimientos afectados:**
- Se adoptan: I2:RF-08 en lo relativo a la visita opcional (RF-08-AC-8); I2 Apéndice D ("Visita agendada" opcional).
- Sin efecto: I1:RF-18-AC-2 y la precondición "visita realizada" de I1:RF-18 y E.2; la parte de bloqueo de I3:RF-03-AC-2 ("no presenta un precio definitivo").
- Se mantiene, compatible: que el sistema sugiera una visita cuando faltan datos o el cliente no los conoce (I3:RF-02-AC-3, I3:RF-03).
- Requiere ajuste: I3:RF-03-AC-4 ("apta para cotización sin visita" pasa a ser informativa).

**Impacto sobre otras decisiones:** DEC-16 (la visita, cuando la hay, se agenda con el flujo del prestador), DEC-18 y DEC-19 (se puede cotizar desde que la solicitud está asignada).

### DEC-18 — Vigencia y expiración de la propuesta o cotización

**SRS involucrados:** I1, I2, I3 (C-14)

**Situación:** En I1, la propuesta sin respuesta en 72 horas se cierra sin efecto (RF-42-AC-3, decisión técnica del analista de I1). En I2, el prestador fija una vigencia de 1 a 30 días naturales (RF-08). I3 maneja una vigencia sin rango definido (RF-08-AC-5).

**Opción A:** Plazo fijo de 72 h para responder (I1).

**Opción B:** Vigencia de 1 a 30 días fijada por el prestador (I2).

**Opción C:** Vigencia definida por el prestador, sin rango establecido (I3).

**Recomendación del analista:** Opción B. Dos SRS asocian la vigencia a cada cotización (I2, I3), e I2 da un rango verificable. El valor de I1 no proviene de la elicitación.

**Decisión del equipo:** A. Una propuesta sin respuesta del cliente en 72 h se cierra sin efecto, y el cliente puede volver a la lista de recomendaciones.

**Justificación del equipo:** Un plazo fijo y corto de respuesta evita que las propuestas queden abiertas indefinidamente y mantiene ágil el proceso de contratación.

**Requerimientos afectados:**
- Se adopta: I1:RF-42-AC-3 en la parte de expiración por falta de respuesta, con su transición en E.2 ("En revisión → No aceptada").
- Sin efecto: la vigencia de 1 a 30 días de I2:RF-08 (RF-08-AC-3, AC-4); la vigencia que define el prestador en I3:RF-08 (RF-08-AC-5, LD-04) en lo que toca a la cotización.
- Nota: el valor de 72 h lo fijó el analista de I1, no la elicitación; queda como decisión del equipo.
- Siguen abiertos: el rechazo de la propuesta (se resuelve en DEC-19) y la vigencia de las solicitudes de cambio de costo (se resuelve en DEC-20).

**Impacto sobre otras decisiones:** DEC-15 (al expirar, se vuelve a las recomendaciones), DEC-19.

### DEC-19 — Negociación de la propuesta

**SRS involucrados:** I1, I2 (GAP)

**Situación:** En I1 el cliente puede pedir cambios; el trabajador envía una versión revisada y la aceptación final exige que ambas partes acepten la misma versión (RF-42-AC-2). En I2 el cliente acepta o rechaza, y tras un rechazo el prestador puede enviar una cotización nueva (RF-08-AC-9).

**Opción A:** Solicitud de cambios con reconfirmación de ambas partes (I1).

**Opción B:** Rechazo y nueva cotización (I2).

**Recomendación del analista:** Opción B. Logra el mismo resultado (llegar a una versión aceptada) con menos estados, y la "nueva versión" de I1 equivale a una cotización nueva. Si se valora que el cliente pueda explicar qué ajustar, puede agregarse el motivo del rechazo.

*Nota tras DEC-18 (A):* la recomendación cambió a A. El flujo E.2 de I1 integra en un solo modelo la expiración de 72 h, la solicitud de cambios y la aceptación de la misma versión; elegir B mezclaría dos modelos.

**Decisión del equipo:** A. El cliente puede solicitar cambios; el prestador envía una versión revisada y la aceptación final exige que ambas partes acepten esa misma versión. Un rechazo sin solicitar cambios cierra el acuerdo con ese prestador.

**Justificación del equipo:** El flujo de I1 integra la expiración de 72 h (DEC-18), la negociación y la aceptación de la misma versión en un solo modelo, lo que evita ambigüedad sobre cuál versión quedó aceptada.

**Requerimientos afectados:**
- Se adoptan: I1:RF-42 (RF-42-AC-1, AC-2, AC-3 completo) y el flujo E.2 de I1.
- Sin efecto: I2:RF-08-AC-9 (nueva cotización tras un rechazo) e I2:RF-08-AC-6 en lo que contradiga el cierre del acuerdo.
- Siguen abiertos: el contenido de la propuesta (trabajo, materiales, costo y fechas en I1:RF-18 frente al desglose de I2:RF-08 e I3:RF-08) es un gap no decidido; tampoco si el plazo de 72 h se reinicia con cada versión revisada (ningún SRS lo dice).

**Impacto sobre otras decisiones:** DEC-20 a DEC-22 (los cambios de costo parten del acuerdo aceptado por ambas partes, I1:RF-42), DEC-25 (el trabajo inicia al aceptarse la propuesta).

---

## Bloque 5. Cambios de costo y pagos

### DEC-20 — Plazo para que el cliente responda a un cambio de costo

**SRS involucrados:** I1, I2, I3 (C-15)

**Situación:** Los tres coinciden en que un cambio sin respuesta no se aplica. En I1 el cliente tiene 24 h, la parte afectada del trabajo queda en pausa y el caso puede escalarse al administrador (E.3; decisión técnica del analista de I1). En I2, a las 48 h la solicitud pasa a "expirada" (RF-09-AC-7). I3 no fija plazo: mientras no haya respuesta, el cambio no se incorpora (RF-08-AC-3).

**Opción A:** 24 h; la parte afectada queda en pausa y puede escalarse (I1).

**Opción B:** 48 h; después, la solicitud expira sin aplicarse (I2).

**Opción C:** Sin plazo; el cambio queda pendiente hasta que el cliente responda (I3).

**Recomendación del analista:** Opción B. Da un cierre verificable al caso sin respuesta y nunca aplica el costo sin autorización. La regla de I1 de no ejecutar la parte afectada mientras el cambio está pendiente es compatible y puede agregarse. El escalamiento al administrador depende de DEC-34.

**Decisión del equipo:** A. El cliente tiene 24 h para responder a un cambio. Mientras no decida, la parte afectada del trabajo queda en pausa, y el caso puede escalarse a revisión del administrador.

**Justificación del equipo:** Un plazo corto y la pausa de la parte afectada evitan que el trabajo avance sobre un costo no autorizado, y el escalamiento ofrece una salida si las partes no se ponen de acuerdo.

**Requerimientos afectados:**
- Se adoptan: el flujo E.3 de I1 (24 h y pausa) e I1:RF-19-AC-3.
- Sin efecto: la expiración de 48 h de I2:RF-09-AC-7 y la ausencia de plazo de I3:RF-08-AC-3. Se conserva de ambos el principio de que, sin respuesta, el cambio no se aplica.
- Siguen abiertos: qué pasa al vencer las 24 h (E.3 no define una transición por tiempo); el escalamiento depende de DEC-34.
- Nota: el valor de 24 h viene del analista de I1, no de la elicitación.

**Impacto sobre otras decisiones:** DEC-05 (el análisis con IA debe caber dentro de las 24 h), DEC-34 (el papel del administrador en las disputas queda condicionado).

**Resolución posterior (inconsistencia con DEC-34):** el escalamiento a revisión del administrador queda **sin efecto**. Si no hay acuerdo, la parte afectada queda pendiente de un nuevo acuerdo entre cliente y trabajador. Se mantienen el plazo de 24 h, la pausa de la parte afectada y la contrapropuesta (DEC-22).
**Justificación del equipo:** Dado que la app por el momento no gestiona el pago de los servicios y solo funge como intermediaria para ayudar al cliente a encontrar un prestador de servicios, el administrador no media en disputas de costo; esto queda a acuerdos entre el cliente y el trabajador.

### DEC-21 — Qué cambios requieren autorización del cliente

**SRS involucrados:** I1, I2, I3 (GAP)

**Situación:** En I1 requieren autorización los cambios de precio y de alcance (RF-19, RD-07). En I2, solo los de costo (RF-09). En I3, los de costo, material, alcance y fecha (RF-08, RD-03). I4 no trata el tema.

**Opción A:** Precio y alcance (I1).

**Opción B:** Solo costo (I2).

**Opción C:** Costo, material, alcance y fecha (I3).

**Recomendación del analista:** Opción C. Es la más protectora para el cliente y coincide con la regla general de I1:RF-20, según la cual las acciones que comprometen tiempo, dinero o datos requieren autorización; la fecha es "tiempo".

**Decisión del equipo:** C. Todo cambio de costo, material, alcance o fecha requiere la autorización explícita del cliente antes de aplicarse.

**Justificación del equipo:** Todos estos cambios comprometen el dinero o el tiempo del cliente, por lo que el equipo exige su autorización para cualquiera de ellos, en línea con I1:RF-20.

**Requerimientos afectados:**
- Se adoptan: I3:RF-08 (AC-2, AC-6, AC-7), I3:RD-03, I3:RF-10-AC-2, AC-3.
- Se amplían: I1:RF-19 e I1:RD-07 (ahora cubren también material y fecha); el flujo E.3 (DEC-20) aplica a los cuatro tipos de cambio.
- Sin efecto: el alcance limitado a costo de I2:RF-09.
- Sigue abierto: los campos obligatorios de una solicitud de cambio (I3:RF-08-AC-2 frente a I2:RF-09).

**Impacto sobre otras decisiones:** DEC-05 (el análisis con IA aplica a los cuatro tipos), DEC-20, DEC-22.

### DEC-22 — Contrapropuesta del cliente ante un cambio de costo

**SRS involucrados:** I1 (GAP)

**Situación:** Solo I1 permite que el cliente contraproponga un cambio, además de aceptarlo o rechazarlo (RF-19, E.3). I2 (RF-09) e I3 (RF-08) solo permiten aprobar o rechazar.

**Opción A:** Aceptar, rechazar o contraproponer (I1).

**Opción B:** Solo aceptar o rechazar (I2, I3).

**Recomendación del analista:** Opción B. La sostienen 2 SRS; la contrapropuesta puede resolverse rechazando y registrando un cambio nuevo, sin un estado adicional.

*Nota tras DEC-19 y DEC-20:* el equipo adoptó el flujo E.3 de I1, que incluye la contrapropuesta, y el modelo de negociación de I1 para propuestas. Con eso, la Opción A también es coherente.

**Decisión del equipo:** A. Ante un cambio, el cliente puede aceptar, rechazar o contraproponer; si contrapropone, el cambio vuelve a "Pendiente de decisión" con los nuevos términos.

**Justificación del equipo:** Así el cliente tiene el mismo margen de negociación en los cambios que en las propuestas (DEC-19), y el flujo de cambios de I1 adoptado en DEC-20 queda completo.

**Requerimientos afectados:**
- Se adoptan: I1:RF-19 (contrapropuesta); la transición "Contrapropuesta" del flujo E.3 de I1.
- Se amplían: las opciones "Aprobar / Rechazar" de I2:RF-09-AC-3 y de I3:RF-08 ahora incluyen contraproponer.
- Siguen abiertos: si el plazo de 24 h se reinicia con cada contrapropuesta; quién responde a la contrapropuesta y cómo (E.3 no lo detalla).

**Impacto sobre otras decisiones:** DEC-34 (escalamiento cuando no hay acuerdo), DEC-05 (análisis con IA aplicado a la contrapropuesta, sin especificar en los SRS).

### DEC-23 — Registro de pagos declarados

**SRS involucrados:** I1, I2, I3, I4 (GAP; hay consenso en no procesar pagos)

**Situación:** Los 4 SRS dejan fuera del MVP el procesamiento de pagos. Solo I2 agrega un registro de pagos declarados por el cliente, con confirmación del prestador y estado "en disputa" (RF-14). I3 registra acuerdos y comprobantes, pero excluye los pagos del gasto acumulado (RD-06, §1.3).

**Opción A:** No registrar pagos en el MVP (I1, I3, I4).

**Opción B:** Registrar pagos declarados con confirmación y disputa (I2).

**Recomendación del analista:** Opción A. Lo sostienen 3 SRS. El registro de I2 genera disputas que requieren un rol de soporte (DEC-35) y acerca el producto a una gestión de pagos que todos excluyen.

**Decisión del equipo:** A. En el MVP no se registran pagos. Se mantiene el consenso de no procesarlos.

**Justificación del equipo:** Registrar pagos generaría disputas que requieren atención de soporte y acercaría el producto a una gestión de pagos que los cuatro SRS excluyen del MVP.

**Requerimientos afectados:**
- Se adoptan (consenso): I1 §10, I2:RD-02, I3:RD-06, I4 §4.2 (sin procesamiento de pagos).
- Sin efecto en el MVP: I2:RF-14 (todos sus criterios) y la alerta de pago en disputa de I2:RF-23.
- Se mantienen: los acuerdos y comprobantes de compra de I3 (RD-06, RF-09-AC-2), que no son pagos.

**Impacto sobre otras decisiones:** DEC-24, DEC-35 (desaparece una fuente de trabajo para soporte).

### DEC-24 — Suscripción de prestadores como requisito para aparecer en búsquedas

**SRS involucrados:** I1, I2 (GAP con tensión)

**Situación:** En I2 el modelo de ingreso es una suscripción mensual que registra el administrador; un prestador con la suscripción vencida sale de las búsquedas (RF-15, RD-07, criterio (e) de RF-04). Ningún otro SRS define un modelo de ingreso. I1:RNF-10 exige que el orden de las recomendaciones no dependa de pagos. No es literalmente incompatible, porque I2 habla de un requisito para aparecer y no del orden, pero choca con su intención.

**Opción A:** Sin suscripción en el sistema durante el MVP (I1, I3, I4).

**Opción B:** Suscripción mensual registrada manualmente; al vencer, el prestador sale de nuevas búsquedas (I2).

**Recomendación del analista:** Opción A. Solo I2 lo incluye, el modelo de negocio no se elicitó en los demás SRS y la Opción B tensiona I1:RNF-10. El modelo de ingreso puede quedar como pendiente de negocio fuera del SRS.

**Decisión del equipo:** A. Durante el MVP no hay suscripción en el sistema; el modelo de ingreso queda como pendiente de negocio.

**Justificación del equipo:** El modelo de ingreso solo aparece en un SRS y condicionar la visibilidad a un pago contradice la intención de que las recomendaciones no dependan de pagos (I1:RNF-10). Además es coherente con no registrar pagos (DEC-23).

**Requerimientos afectados:**
- Se adopta: I1:RNF-10.
- Sin efecto en el MVP: I2:RF-15 (todos sus criterios), I2:RD-07, el criterio (e) de I2:RF-04, I2:RF-17-AC-3 en la parte de "suscripción activa", y la exclusión de cobro de suscripciones de I2 §1.2.
- Sigue abierto: el modelo de ingreso de la plataforma, como pendiente de negocio fuera del SRS (relacionado con I1:PV-14 y PV-17).

**Impacto sobre otras decisiones:** DEC-15 (las recomendaciones no dependen de ningún pago), DEC-35 (soporte no gestiona suscripciones).

---

## Bloque 6. Seguimiento y cierre

### DEC-25 — Frecuencia del reporte de avance

**SRS involucrados:** I1, I2, I3, I4 (C-17)

**Situación:** I1 espera un reporte diario (RF-45-AC-1). I2 lo pide cada día de ejecución a las 19:00, con hora configurable (RF-10). I3 lo pide por etapa terminada y al menos cada 7 días en proyectos largos (RF-09). I4 solo maneja cambios de estado (RF-08).

**Opción A:** Reporte diario en los días con trabajo programado (I1, I2).

**Opción B:** Por etapa terminada y al menos cada 7 días (I3).

**Opción C:** Solo actualización de estados: programado, en proceso, terminado (I4).

**Recomendación del analista:** Opción A, limitada a los días con trabajo programado como en I2:RF-10-AC-5. La sostienen 2 SRS y corresponde al seguimiento cercano del avance que forma parte del valor del producto.

**Decisión del equipo:** C. El seguimiento se limita a actualizar estados del servicio (programado, en proceso, terminado). No hay reportes periódicos de avance.

**Justificación del equipo:** El equipo prefiere un seguimiento simple, basado en estados del servicio, que sea fácil de usar para el trabajador y suficiente para que el cliente sepa en qué etapa está su trabajo.

**Requerimientos afectados:**
- Se adopta: I4:RF-08 (incluido RF-08-AC-1).
- Sin efecto en el MVP: I1:RF-22, RF-43, RF-44, RF-45, RF-57; I2:RF-10; la parte de reportes periódicos de I3:RF-09 y el porcentaje acumulado de I3:RF-10 y LD-05.
- Se mantienen (no dependen de los reportes): la vista de costos (I1:RF-23, I3:RF-10 en la parte de presupuesto), el aviso inmediato de cambios (I1:RF-24) y el flujo de cambios (DEC-20 a DEC-22).
- Sigue abierto: cómo se integran estos 3 estados con la aceptación de la propuesta (DEC-19) y con el cierre (DEC-29).

**Impacto sobre otras decisiones:** DEC-26 y DEC-27 (pierden su objeto), DEC-28, DEC-05 (el análisis con IA de I3:RF-18 cuenta con menos evidencia del avance). Riesgo: el seguimiento del avance era parte del valor del producto en I1, I2 e I3; el cliente verá el estado de su trabajo, pero no evidencia de cómo avanza.

### DEC-26 — Qué hacer cuando no llega el reporte de avance

**SRS involucrados:** I1, I2, I3 (C-18)

**Situación:** En I1, el trabajador recibe hasta 2 recordatorios y después se avisa al cliente (RF-45, RF-57). En I2, si no hay respuesta en 2 h se avisa al cliente y se crea una alerta para soporte (RF-10-AC-4). En I3, después de 7 días sin actualización se notifica a ambos (RF-09-AC-4).

**Opción A:** Dos recordatorios al trabajador y luego aviso al cliente (I1).

**Opción B:** Aviso al cliente y alerta a soporte a las 2 h (I2).

**Opción C:** Notificación a ambos tras 7 días sin actualización (I3).

**Recomendación del analista:** Depende de DEC-25. Si allí se elige la Opción A, conviene la Opción A aquí: no requiere un rol de soporte (DEC-35) y le da al trabajador oportunidad de responder antes de avisar al cliente.

**Decisión del equipo:** Otra: no aplica por DEC-25. Sin reportes periódicos, no se define qué hacer cuando falta uno.

**Justificación del equipo:** Al limitar el seguimiento a cambios de estado (DEC-25), no existe un reporte esperado cuya ausencia deba escalarse.

**Requerimientos afectados:**
- Sin efecto: I1:RF-45, RF-57; I2:RF-10-AC-4 y la alerta de falta de reporte de I2:RF-23; I3:RF-09-AC-4.
- Sigue abierto: nada avisa si un proyecto queda "en proceso" sin movimiento. Ningún SRS lo cubre bajo el modelo de estados.

**Impacto sobre otras decisiones:** DEC-35 (una fuente menos de alertas para soporte).

### DEC-27 — ¿Es obligatoria la foto en el reporte de avance?

**SRS involucrados:** I1, I2, I3 (C-16)

**Situación:** I1 no acepta un reporte sin foto y mensaje (RF-22-AC-2). En I2 se acepta texto, voz o foto, y las fotos son opcionales (RF-10). En I3 las fotografías son adjuntos opcionales y el avance de texto se conserva aunque falle la carga (RF-09, §2.5, §3.1.2).

**Opción A:** Foto y mensaje obligatorios (I1).

**Opción B:** Mensaje obligatorio y foto opcional (I2, I3).

**Recomendación del analista:** Opción B. La sostienen 2 SRS, e I3 prevé de forma explícita que falte la cámara o que falle la carga. La preocupación de I1 por la veracidad del avance (I1:PV-19) queda cubierta en parte por la confirmación del cliente (I1:RF-44).

**Decisión del equipo:** Otra: no aplica por DEC-25.

**Justificación del equipo:** Como el seguimiento se limita a cambios de estado (DEC-25), no existen reportes de avance a los que exigir fotografía.

**Requerimientos afectados:**
- Sin efecto: I1:RF-22, RF-22-AC-2; la foto opcional de I2:RF-10; la foto en el avance de I3:RF-09.
- Se mantienen: los comprobantes de compra (I3:RF-09-AC-2, RD-06) conforme a DEC-23; falta definir dónde se adjuntan, porque dependían del avance por etapa.

**Impacto sobre otras decisiones:** DEC-05 (el análisis con IA cuenta con menos evidencia del avance).

### DEC-28 — Etapas acordadas del proyecto

**SRS involucrados:** I3 (GAP)

**Situación:** Solo I3 exige acordar etapas antes del primer avance, registrar el porcentaje por etapa y validar las etapas (RF-09, RF-10, RF-11-AC-1, RF-11-AC-4). I1, I2 e I4 no manejan etapas.

**Opción A:** Etapas acordadas obligatorias (I3).

**Opción B:** Sin etapas; avance general del proyecto (I1, I2, I4).

**Recomendación del analista:** Opción B. La sostienen 3 SRS, es más simple y es coherente con la Opción A de DEC-25 (reporte diario). Las etapas pueden quedar como mejora posterior.

**Decisión del equipo:** B. Sin etapas; seguimiento general del proyecto.

**Justificación del equipo:** Las etapas solo aparecen en un SRS y no encajan con el seguimiento por estados del servicio decidido en DEC-25.

**Requerimientos afectados:**
- Sin efecto en el MVP: lo que quedaba de I3:RF-09 (etapas acordadas, RF-09-AC-3), la parte por etapa de I3:RF-10, I3:RF-11-AC-1, I3:LD-05 y la parte "o etapa" de I3:RF-17 y LD-08.
- Requieren ajuste: I3:RF-11-AC-4 (la condición "todas las etapas validadas" no aplica); la definición de "proyecto concluido" de I3 §1.3 (solo queda "cerrado por acuerdo"); la asociación de los comprobantes de compra, que antes iban ligados a una etapa.

**Impacto sobre otras decisiones:** DEC-29 (el cierre no depende de etapas); la inconformidad después del cierre (I3:RF-17) queda solo a nivel de proyecto y aún no se decide si entra al MVP.

### DEC-29 — Cancelación del proyecto completo

**SRS involucrados:** I1, I2, I3, I4 (GAP)

**Situación:** Solo I2 define cómo cancelar el proyecto según su estado (RF-19). Antes de la ejecución, el cliente cancela o el prestador se retira; en ejecución, solo cancela soporte; un proyecto concluido no se cancela. I1, I3 e I4 solo tratan la cancelación de citas (I1:RF-17, I3:RF-07-AC-4, I4:RF-07-AC-2).

**Opción A:** Solo cancelación de citas (I1, I3, I4).

**Opción B:** Cancelación del proyecto con reglas por estado y motivo obligatorio (I2).

**Recomendación del analista:** Incluir la Opción B en una versión reducida: cancelación con motivo antes de la ejecución y ninguna cancelación de proyectos concluidos. Sin esta regla, ningún SRS salvo I2 define cómo termina un proyecto que no llega a ejecutarse. La parte de "solo soporte cancela en ejecución" depende de DEC-35.

**Decisión del equipo:** A. Solo se define la cancelación de citas; no se define la cancelación del proyecto completo.

**Justificación del equipo:** Tres de los cuatro SRS solo tratan la cancelación de citas, y las reglas de cancelación de proyecto de I2 dependen de un rol de soporte que todavía no está definido.

**Requerimientos afectados:**
- Se adoptan: I1:RF-17; I3:RF-07-AC-4; I4:RF-07-AC-2 (cancelación de citas).
- Sin efecto en el MVP: I2:RF-19 (todos sus criterios), el estado "cancelado" del Apéndice D de I2 en lo que viene de RF-19, y los tickets de cancelación de I2:RF-23.
- Sigue abierto (vacío de negocio): ningún mecanismo adoptado permite terminar un proyecto que no llega a concluirse, por ejemplo si el cliente ya no necesita el trabajo o si el prestador abandona durante la ejecución. Lo único que existe es el cierre de una propuesta rechazada o vencida (DEC-18, DEC-19), que solo termina el acuerdo con un prestador.

**Impacto sobre otras decisiones:** DEC-35 (soporte no gestiona cancelaciones), DEC-33 (un abandono durante la ejecución solo podría canalizarse como reporte, si se incluyen reportes).

---

## Bloque 7. Evaluaciones, reportes y administración

### DEC-30 — Evaluación bidireccional

**SRS involucrados:** I1, I2, I3, I4 (C-21)

**Situación:** I1 deja fuera del MVP la evaluación del cliente por parte del trabajador; I1 indica que no tuvo respaldo del stakeholder real (§10). I2 la incluye: el prestador califica al cliente de 1 a 5 y la publicación es simultánea (RF-11). En I3 (RF-11, RD-05) e I4 (RF-09) solo evalúa el cliente.

**Opción A:** Solo el cliente evalúa al proveedor (I1, I3, I4).

**Opción B:** Evaluación bidireccional (I2).

**Recomendación del analista:** Opción A. La sostienen 3 SRS, y I1 documenta que la evaluación bidireccional no tuvo respaldo en su elicitación.

**Decisión del equipo:** B. Evaluación bidireccional: además del cliente, el prestador califica al cliente.

**Justificación del equipo:** Calificar también al cliente da a los proveedores información sobre con quién trabajan y equilibra la confianza entre ambas partes de la plataforma.

**Requerimientos afectados:**
- Se adopta: la parte (b) de I2:RF-11 (el prestador califica al cliente con un entero de 1 a 5).
- Sin efecto: la exclusión de I1 §10.
- Requieren ajuste: I1:RD-01, I1:RF-25, I3:RD-05, I4:RD-03 (extender la condición al prestador del proyecto y después del cierre); I3:LD-06 (evaluación en ambos sentidos).
- Siguen abiertos: las reglas de publicación de I2:RF-11 (7 días; publicación simultánea), que esta opción no decide; dónde se muestra la calificación del cliente y quién la ve.
- Nota: I1 documenta que la evaluación bidireccional no tuvo respaldo del stakeholder real.

**Impacto sobre otras decisiones:** DEC-31, DEC-32, DEC-33 (revisión de evaluaciones injustas hacia clientes), DEC-36 (la calificación del cliente es un dato personal).

### DEC-31 — Escala de la evaluación

**SRS involucrados:** I1, I2, I3 (C-20)

**Situación:** I3 usa una calificación entera única de 1 a 5 (RF-11). I2 pide 4 dimensiones de 1 a 5: puntualidad, calidad, limpieza y apego al presupuesto (RF-11). I1 exige calificación y comentario, pero su escala de 1 a 5 no está confirmada (RF-47).

**Opción A:** Calificación única de 1 a 5 (I3; coincide con la propuesta de I1).

**Opción B:** Cuatro dimensiones de 1 a 5, promediadas (I2).

**Recomendación del analista:** Opción A. Es más simple y concuerda con I1 e I3. La dimensión "apego al presupuesto" de I2 está ligada a un objetivo propio de ese SRS (OB-03) y puede considerarse más adelante.

**Decisión del equipo:** B. El cliente califica al proveedor en cuatro dimensiones (puntualidad, calidad, limpieza y apego al presupuesto), con enteros de 1 a 5 promediados.

**Justificación del equipo:** Desglosar la calificación da al siguiente cliente información más útil que un número único, en particular sobre el apego al presupuesto, que es uno de los problemas centrales que el producto busca resolver.

**Requerimientos afectados:**
- Se adoptan: la parte (a) de I2:RF-11, la definición de "calificación promedio" (I2 §1.3), I2:RF-11-AC-2, AC-3.
- Sin efecto: la calificación única de I3:RF-11; la escala sin confirmar de I1:RF-47.
- Requieren ajuste: los perfiles que muestran calificación promedio (I3:RF-05, I4:RF-03-AC-2, I1:RF-48); falta decidir si se muestran también las dimensiones.
- Se mantiene, compatible: el orden por calificación de I3:RF-06, sobre el promedio.

**Impacto sobre otras decisiones:** DEC-32, DEC-14 y DEC-15 (el orden y las recomendaciones usan el promedio).

### DEC-32 — Comentario obligatorio en la evaluación

**SRS involucrados:** I1, I2, I3 (C-19)

**Situación:** I1 no acepta una evaluación sin comentario (RF-47-AC-2). En I2 (RF-11-AC-4) e I3 (RF-11) el comentario es opcional.

**Opción A:** Comentario obligatorio (I1).

**Opción B:** Comentario opcional (I2, I3).

**Recomendación del analista:** Opción B. La sostienen 2 SRS y reduce la fricción para evaluar, en línea con el RNF de interfaz sencilla y pocos pasos (I1:RNF-01).

**Decisión del equipo:** B. El comentario es opcional en ambas direcciones de la evaluación.

**Justificación del equipo:** El comentario opcional reduce la fricción al evaluar, sobre todo con cuatro dimensiones, y completa el modelo de evaluación de I2 adoptado en DEC-30 y DEC-31.

**Requerimientos afectados:**
- Se adoptan: I2:RF-11-AC-4; la regla de comentario opcional de I3:RF-11.
- Sin efecto: el comentario obligatorio de I1:RF-47 y RF-47-AC-2.

**Impacto sobre otras decisiones:** DEC-33 (respuesta pública a una evaluación negativa que podría no tener comentario; no resuelto en los SRS).

### DEC-33 — Reportes, moderación y sanciones en el MVP

**SRS involucrados:** I1, I2, I3, I4 (GAP)

**Situación:** I1 incluye reportes, clasificación de casos graves para priorizarlos, revisión con evidencias de ambas partes, decisión explicada, segunda revisión, advertencia y suspensión decidida por el administrador (RF-27 a RF-29, RF-32, RF-50 a RF-52, RF-61). También incluye respuesta pública y revisión de evaluaciones (RF-26, RF-49). I3 incluye reportes con estados "en revisión", "resuelto" o "descartado", anonimato del reportante y el estado "suspendido" (RF-12, RF-13). I2 e I4 no tratan el tema. Entre I1 e I3 no hay conflicto.

**Opción A:** El modelo completo de I1.

**Opción B:** El modelo básico de I3, con reportes, estados, anonimato y suspensión.

**Opción C:** Sin reportes ni sanciones en el MVP (I2, I4).

**Recomendación del analista:** Opción B como base, con dos reglas de I1 compatibles: las sanciones las decide una persona y no la IA (I1:RD-06, RF-61-AC-2), y no hay reducción automática de visibilidad (I1:RF-52). La confianza es parte central del producto, por lo que no se recomienda C. El modelo completo de I1 supone una carga administrativa que el propio I1 marca como no confirmada (PV-01).

**Decisión del equipo:** C. Sin reportes, moderación ni sanciones en el MVP.

**Justificación del equipo:** Dos de los cuatro SRS no incluyen reportes ni sanciones, y el equipo prefiere no asumir en el MVP la carga administrativa de revisar reportes, que el propio I1 marca como no confirmada (PV-01).

**Requerimientos afectados:**
- Sin efecto en el MVP: I1:RF-26, RF-27, RF-28 (parte de reportes), RF-32, RF-49, RF-50, RF-51, RF-52, RF-61, RD-08, RD-09; I3:RF-12, el estado "suspendido" de I3:RF-13 y la parte de reportes de I3:LD-06.
- ⚠️ Tensión con DEC-07: I1:RF-29 retira la verificación por documento vencido (sigue vigente, se detecta automáticamente) o por información falsa confirmada por el administrador. RF-29-AC-2 hace depender esa confirmación de un reporte (RF-27/RF-28); sin reportes, no queda definido cómo se detecta. Requiere precisión. **Resuelto:** el administrador puede confirmar información falsa a partir de solicitudes de soporte (DEC-35) o de su propia revisión (ver la resolución posterior en DEC-07).
- Se mantiene: I1:RD-06 (la IA no decide medidas delicadas).

**Impacto sobre otras decisiones:** DEC-34, DEC-35. Vacíos que se agravan: abandono durante la ejecución (DEC-29), perfiles falsos sin vía de reporte (DEC-06), evaluaciones injustas sin revisión (DEC-30).

### DEC-34 — Papel del administrador en disputas comerciales

**SRS involucrados:** I1, I2, I3 (GAP con tensión)

**Situación:** En I1 el administrador media disputas de costo y emite una resolución, pero no autoriza el gasto (RF-28-AC-2). El propio I1 deja sin resolver qué pasa si el cliente no autoriza pese a esa resolución (§11). En I3 el administrador "no participa en decisiones comerciales" ni modifica acuerdos (§2.3, §3.1.1). En I2, soporte atiende pagos en disputa y es el único que puede cancelar un proyecto en ejecución (RF-14, RF-19c). I4 no tiene rol administrativo.

**Opción A:** El administrador media disputas de costo sin autorizar el gasto (I1).

**Opción B:** El administrador no interviene en decisiones comerciales; solo verifica y atiende reportes (I3).

**Opción C:** Soporte interviene en disputas de pago y en cancelaciones durante la ejecución (I2).

**Recomendación del analista:** Opción B. Evita el vacío de negocio que I1 deja abierto y es coherente con la regla común de que la decisión sobre el dinero es del cliente (I1:RD-07, I3:RD-03). Las disputas graves pueden canalizarse por reportes (DEC-33).

*Nota tras DEC-20 y DEC-33:* la recomendación cambió a A. DEC-20 incluyó el escalamiento al administrador y DEC-33 eliminó los reportes; la Opción B deja sin destino ese escalamiento.

**Decisión del equipo:** B. El administrador no interviene en decisiones comerciales; su función es verificar.

**Justificación del equipo:** Las decisiones sobre dinero y acuerdos pertenecen a cliente y proveedor; el administrador se limita a verificar perfiles, lo que evita el vacío que I1 deja abierto cuando el cliente no acepta una resolución administrativa.

**Requerimientos afectados:**
- Se adopta: el rol de administrador de verificación de I3 (§2.3, §3.1.1).
- Sin efecto: I1:RF-28-AC-2; la transición "Escalado a revisión administrativa" del flujo E.3 de I1; la vía de escalamiento de I1:RF-19-AC-3.
- Se mantienen: la verificación por el administrador (I1:RF-09, RF-35, RF-62).
- ⚠️ Inconsistencia con DEC-20: la parte "puede escalarse a revisión del administrador" de DEC-20 queda sin destino. Lo que queda de I1:RF-19-AC-3 es que la parte afectada "queda pendiente de un nuevo acuerdo entre las partes". DEC-20 no se modificó; el equipo debe confirmarlo. **Resuelto:** el equipo confirmó que el escalamiento de DEC-20 queda sin efecto (ver la resolución posterior en DEC-20).

**Impacto sobre otras decisiones:** DEC-20 y DEC-22 (los desacuerdos se resuelven solo entre las partes), DEC-35.

### DEC-35 — Atención humana y rol de soporte

**SRS involucrados:** I1, I2, I3 (GAP)

**Situación:** I1 ofrece contacto con "una persona de soporte" sin definir el rol (RF-06), y marca como no confirmada la capacidad del equipo para sostenerlo (PV-09). I2 define un rol de agente de soporte con horario, bandeja, tickets fuera de horario y pausa del agente de IA mientras soporte atiende (RF-13, RF-23, C-06). I3 permite solicitar soporte y que se registre el caso con el resumen de la conversación (RF-14-AC-1).

**Opción A:** Ofrecer contacto con soporte sin un rol ni una bandeja especificados (I1).

**Opción B:** Rol de soporte con bandeja, horario y tickets (I2).

**Opción C:** Registrar una solicitud de soporte con el resumen de la conversación, atendida por el administrador (I3).

**Recomendación del analista:** Opción C. Es verificable (a diferencia de A) y no crea un rol adicional con horario y bandeja (B), lo que responde a la duda sobre la capacidad del equipo (I1:PV-09). Varias decisiones dependen de esta: DEC-26, DEC-29 y DEC-34.

**Decisión del equipo:** C. El usuario puede solicitar soporte; el sistema registra el caso con su solicitud y el resumen de la conversación, y lo atiende el administrador. No se crea un rol de soporte separado.

**Justificación del equipo:** Es una forma verificable de escalar a una persona (DEC-03) sin crear un rol con horario y bandeja que, tras las decisiones anteriores, tendría muy poca carga. Atender solicitudes de ayuda no es una decisión comercial, por lo que es compatible con DEC-34.

**Requerimientos afectados:**
- Se adopta: I3:RF-14-AC-1. I1:RF-06 (el ofrecimiento de soporte tras 2 intentos, adoptado en DEC-03) se canaliza por este mecanismo.
- Sin efecto en el MVP: el rol de agente de soporte de I2 (§2.3, C-06), I2:RF-13 (transferencia en vivo, tickets fuera de horario, pausa del agente) e I2:RF-23 (bandeja).
- Requieren ajuste: I2:RF-03 (ofrece "transferencia a soporte"; ahora sería registrar una solicitud).
- Siguen abiertos: el canal de comunicación directa cliente–proveedor de I3:RF-14 (segunda parte, RF-14-AC-2) no se decidió aquí; los tiempos de atención del administrador no están definidos (relacionado con I1:PV-09).

**Impacto sobre otras decisiones:** DEC-37 (el administrador también podría atender las solicitudes de datos personales).

---

## Bloque 8. Privacidad

### DEC-36 — Cuándo y cómo se revelan la dirección y los datos de contacto

**SRS involucrados:** I1, I2, I3, I4 (C-22 y C-23)

**Situación:**
- **Cliente:** en I1 solo ve sus datos el trabajador que el cliente autorizó (RF-54). En I3 hacen falta la cita aceptada por ambos y el consentimiento expreso del cliente (RD-07, RF-15-AC-1). En I2, al confirmarse la primera cita, el domicilio y los teléfonos de ambas partes quedan visibles de forma automática hasta 7 días después del cierre (RNF-04).
- **Trabajador:** en I1, su domicilio y teléfono solo se muestran con su propia autorización (RF-58). En I3 no se revelan datos de contacto antes de la cita y existe un canal interno de mensajes (RF-14).
- I4 solo establece que la dirección no es pública (RD-04).

**Opción A:** Revelar los datos del cliente solo con la cita confirmada **y** su consentimiento expreso; los del trabajador, solo con su autorización (I1:RF-54, RF-58; I3:RD-07).

**Opción B:** Revelación automática de domicilio y teléfonos al confirmarse la primera cita, por tiempo limitado (I2:RNF-04).

**Opción C:** No revelar teléfonos y comunicar a las partes mediante un canal interno del proyecto (I3:RF-14).

**Recomendación del analista:** Opción A, complementada con el canal interno de la Opción C. Es la opción que sostienen I1 e I3 y la que concuerda con que compartir datos es una acción sensible que requiere autorización (I1:RF-20). El límite temporal de visibilidad de I2 ("hasta 7 días después del cierre") es compatible con A y puede adoptarse.

**Decisión del equipo:** C. Los teléfonos no se revelan a ninguna de las partes; cliente y proveedor se comunican por un canal interno del proyecto, que conserva fecha, emisor y contenido de cada mensaje.

**Justificación del equipo:** Un canal interno permite que cliente y proveedor se coordinen sin exponer sus teléfonos, y deja registro de la comunicación asociada al proyecto.

**Requerimientos afectados:**
- Se adopta: I3:RF-14 en su parte de comunicación directa (RF-14-AC-2); el canal se habilita con la cita confirmada.
- Sin efecto: la revelación automática de teléfonos de I2:RNF-04; el teléfono del cliente en I3:RF-07-AC-3; el teléfono en I1:RF-54 y RF-58.
- Se mantienen, compatibles: la dirección no es pública (I4:RD-04, I4:RNF-03); antes de la cita solo se ve la zona (I3:RD-02; primera parte de I2:RNF-04).
- ⚠️ Sigue abierto: **la dirección exacta**. La Opción C solo resuelve los teléfonos. Ninguna decisión define cuándo y cómo recibe el proveedor el domicilio (ni las fotos o videos del domicilio). Alternativas en los SRS: consentimiento del cliente (I1:RF-54); cita más consentimiento (I3:RD-07, RF-15-AC-1); revelación automática al confirmar la cita (I2:RNF-04). Igual para el domicilio del trabajador (I1:RF-58).

**Impacto sobre otras decisiones:** DEC-35 (queda resuelta la parte abierta de I3:RF-14), DEC-37 (los mensajes del canal son datos personales), DEC-12 (el momento de capturar el domicilio exacto sigue abierto).

### DEC-37 — Consentimiento, eliminación de datos y plazos

**SRS involucrados:** I1, I2, I3 (GAP)

**Situación:**
- **Consentimiento:** solo I2 define un flujo explícito de aviso de privacidad y mayoría de edad (RF-20).
- **Eliminación:** I1 permite solicitarla, conserva el historial y no fija plazo (RF-55, PV-15). I2 la resuelve como solicitud ARCO operada por el administrador, con anonimización y un plazo configurable de 20 días hábiles (RF-21). I3 elimina o anonimiza en un máximo de 30 días y conserva la bitácora anonimizada (RF-15-AC-2, RD-09).
- Los tres coinciden en que lo esencial de la bitácora se conserva.
- Las normas aplicables están sin identificar en I1 (RD-11, PV-15) y pendientes de asesoría legal en I2 (Apéndice A).

**Opción A:** Eliminación sin plazo definido, hasta la revisión legal (I1).

**Opción B:** Flujo de consentimiento al registrarse y atención ARCO por el administrador con plazo configurable (I2).

**Opción C:** Eliminación o anonimización en un máximo de 30 días, conservando la bitácora anonimizada (I3).

**Recomendación del analista:** Opción C para la eliminación, más el consentimiento al registrarse de I2:RF-20, que es el único que cubre ese hueco. Que el plazo sea configurable (I2) reduce el riesgo mientras sigue abierta la revisión legal que I1 e I2 señalan como pendiente.

*Nota tras DEC-02 y DEC-35:* la recomendación cambió a B. Es la única opción que cubre el consentimiento al registrarse y encaja con que el administrador atienda las solicitudes.

**Decisión del equipo:** B. Al registrarse, el usuario acepta el aviso de privacidad, declara su mayoría de edad y queda registrada la versión aceptada. El administrador atiende las solicitudes ARCO (acceso, rectificación y cancelación de datos), con anonimización y un plazo configurable.

**Justificación del equipo:** Es la única opción que cubre el consentimiento al registrarse y encaja con que el administrador atienda las solicitudes de los usuarios (DEC-35). El plazo configurable permite ajustarse a lo que determine la revisión legal pendiente.

**Requerimientos afectados:**
- Se adoptan: I2:RF-20 (se conserva su contenido; el mecanismo pasa del primer mensaje de WhatsApp al registro por cuenta de DEC-02); I2:RF-21 (exportación, rectificación con valor anterior, anonimización sin proyectos activos, folio, plazo configurable de 20 días hábiles); I2:RD-01.
- Requieren ajuste: I2:RF-21-AC-5 (la alerta iba a la bandeja de soporte, eliminada en DEC-35; ahora va al administrador); la referencia de I2:RF-21 a I2:RNF-06 (el RNF de bitácora aún no se decide).
- Sin efecto: la eliminación sin plazo de I1:RF-55; el plazo de 30 días de I3:RF-15-AC-2.
- Se mantienen, compatibles: la conservación anonimizada de la bitácora (I3:RD-09, I1:RF-55-AC-2); I1:RNF-07 e I4 §2.4.
- Siguen abiertos: el texto del aviso, el plazo legal definitivo y el plazo de conservación (I1:PV-15, Apéndice A de I2); la anonimización debe cubrir los mensajes del canal (DEC-36), los videos (DEC-11) y la calificación del cliente (DEC-30).

**Impacto sobre otras decisiones:** DEC-02 (el registro incluye el consentimiento), DEC-35 (más carga para el administrador).

### DEC-38 — Territorio y oficios iniciales del piloto

**SRS involucrados:** I1, I2, I3, I4 (C-11 y GAP de oficios)

**Situación:**
- **Territorio:** I2 limita el piloto a 6 municipios de la ZMG (RD-06, RF-02-AC-6). I3 fija como cobertura inicial el territorio mexicano (§2.4). I1 lo deja pendiente, aunque advierte que sin zona inicial no hay con qué poblar ni probar la búsqueda (RE-04, PV-04).
- **Oficios:** solo I2 define un catálogo inicial de 10 oficios (Apéndice C). I4 da ejemplos y I1 lo deja pendiente.

**Opción A:** Piloto en una zona acotada (I2 propone la ZMG) y catálogo cerrado de oficios (I2 propone 10).

**Opción B:** Cobertura en todo el territorio mexicano, sin catálogo cerrado (I3; I4 solo da ejemplos).

**Opción C:** Dejar ambos como pendiente de negocio (I1).

**Recomendación del analista:** Opción A en cuanto a *tener* una zona y un catálogo acotados, porque I1 indica que sin ellos no hay datos con qué probar el MVP. La zona y los oficios concretos que propone I2 vienen de su propia elicitación y el equipo debe validarlos; no se recomiendan como valores definitivos.

**Decisión del equipo:** A. El piloto opera en una zona acotada y con un catálogo cerrado de oficios. La propuesta de I2 es la ZMG (6 municipios) y 10 oficios.

**Justificación del equipo:** Sin una zona y un catálogo acotados no hay datos con qué poblar ni probar la búsqueda (I1:PV-04), y la cobertura declarada por colonias (DEC-13) necesita una lista de colonias manejable.

**Requerimientos afectados:**
- Se adoptan: el principio de zona y catálogo acotados de I2:RD-06, RF-02-AC-6, Apéndice C y la exclusión de I2 §1.2 (operación fuera de la zona y oficios fuera del catálogo).
- Sin efecto: la cobertura inicial "territorio mexicano" de I3 §2.4 (se mantienen la moneda MXN y la zona horaria `America/Mexico_City`); I1:RE-04 y PV-04 como pendientes.
- Se mantiene, compatible: ampliar oficios y zonas como función posterior (I1 §10); I2:RNF-09 (nuevo municipio por configuración) queda como gap no decidido.
- Valores confirmados por el equipo: se adoptan los de I2. **Zona:** Guadalajara, Zapopan, San Pedro Tlaquepaque, Tonalá, Tlajomulco de Zúñiga y El Salto (Jalisco). **Oficios:** albañilería, plomería, electricidad, carpintería, herrería, pintura, pisos y azulejos, vidriería y cancelería, tablaroca e impermeabilización. Nota: provienen solo de la elicitación de I2; según I2 (Apéndice C), se pueden agregar oficios por configuración.

**Impacto sobre otras decisiones:** DEC-13 (el territorio define las colonias que se pueden declarar), DEC-12 (validación por colonia o municipio), DEC-03 (la IA clasifica dentro del catálogo; I2:RF-03 sigue como gap).

### DEC-41 — Cuándo y cómo se revela la dirección exacta

*Decisión agregada después del análisis original: cubre el hueco que dejó DEC-36, que resolvió los teléfonos pero no la dirección.*

**SRS involucrados:** I1, I2, I3

**Situación:** I1 revela el domicilio, las fotos y los horarios del cliente solo al trabajador que el cliente autorizó (RF-54, RF-20-AC-1). I3 exige cita aceptada por ambos más consentimiento expreso del cliente; sin consentimiento no se revela (RD-07, RF-07-AC-3, RF-15-AC-1). I2 lo revela automáticamente al confirmarse la primera cita, hasta 7 días después del cierre (RNF-04). Sobre el domicilio del trabajador, solo I1 lo trata: requiere la autorización del propio trabajador (RF-58).

**Opción A:** El cliente autoriza explícitamente al trabajador, sin que la autorización esté atada a un momento (I1).

**Opción B:** Se revela al trabajador con la cita confirmada por ambos y el consentimiento expreso del cliente; sin consentimiento no se revela (I3).

**Opción C:** Revelación automática al confirmarse la primera cita, hasta 7 días después del cierre (I2).

**Recomendación del analista:** Opción B. Une la doble confirmación de DEC-16 con la regla de I1:RF-20, según la cual compartir datos requiere autorización. Si el cliente no consiente, puede compartir la dirección por el canal interno de DEC-36.

**Decisión del equipo:**
- **Domicilio del cliente:** B. La dirección exacta y las fotos o videos del domicilio se revelan solo al trabajador de una cita confirmada por ambas partes y con consentimiento expreso del cliente; sin consentimiento no se revelan.
- **Domicilio del trabajador:** Otra. "El domicilio del trabajador se muestra a los clientes solo si el trabajador tiene identidad verificada (DEC-07)." ⚠️ Decisión del equipo sin respaldo directo en los SRS: I1:RF-58, la única fuente, exige la autorización del propio trabajador. Con esta regla, el domicilio de un trabajador verificado se muestra sin esa autorización.

**Justificación del equipo:** El domicilio del cliente se protege atándolo a una cita confirmada y a su consentimiento, coherente con I1 e I3. En el caso del trabajador, el equipo vincula la visibilidad de su domicilio a la verificación de identidad, para que el cliente tenga certeza de con quién trata.

**Requerimientos afectados:**
- Se adoptan: I3:RD-07, I3:RF-15-AC-1, la parte de dirección y fotos de I3:RF-07-AC-3; I3:RD-02 e I1:RF-54 (compatibles con B); I1:RF-20-AC-1.
- Sin efecto: la revelación automática del domicilio de I2:RNF-04 y su ventana de 7 días; la autorización del propio trabajador de I1:RF-58 (y RF-58-AC-1, AC-2).
- Requiere ajuste: I3:RF-15-AC-1 dice que, sin consentimiento, el cliente proporciona la dirección "por otro medio"; ahora puede hacerlo por el canal interno (DEC-36).
- Siguen abiertos: si "a los clientes" significa cualquier cliente o solo los que tienen un proyecto con ese trabajador; cuándo deja de ser visible el domicilio del cliente para el trabajador (I2 proponía 7 días después del cierre; no se adoptó); que el aviso de privacidad (DEC-37) informe al trabajador que su domicilio será visible si está verificado.

**Impacto sobre otras decisiones:** DEC-07 (la marca de identidad ahora también controla la visibilidad del domicilio), DEC-12 (el domicilio exacto se captura antes de la cita confirmada o en ese momento), DEC-36, DEC-37 (el consentimiento debe cubrir ambos casos).

---

## Bloque 9. Atributos de calidad

### DEC-39 — Umbrales de rendimiento

**SRS involucrados:** I1, I2, I3, I4 (CONSENSO en la existencia; valores divergentes)

**Situación:**
- I1 escalona por tipo de operación: búsqueda 2 s, conversación 3 s y recomendación 5 s (RNF-04, decisión técnica del analista de I1).
- I2 fija texto 5 s y voz 10 s en p95, y la propuesta en 120 s (RNF-01, RNF-02).
- I3 fija 3 s en p95 con 100 usuarios (RNF-01, RNF-07).
- I4 fija 3 s (RNF-02).
- No son incompatibles: el valor más estricto cumple a los demás.

**Opción A:** Umbrales escalonados según la operación (I1).

**Opción B:** Umbrales de I2, ligados al canal WhatsApp.

**Opción C:** 3 s en p95 con 100 usuarios concurrentes (I3, I4).

**Recomendación del analista:** Opción C para búsquedas y consultas, porque la comparten 2 SRS y es medible en p95. Para las respuestas con IA, adoptar la distinción de I1, que diferencia operaciones con y sin generación de texto. Los valores de B dependen de DEC-01.

**Decisión del equipo:** C. Búsquedas, consultas y acciones responden en máximo 3 s (p95) con 100 usuarios concurrentes, sin contar la carga de fotos y videos.

**Justificación del equipo:** Un solo umbral de 3 s, compartido por dos SRS y medido con una carga definida, es simple de verificar y suficiente para las operaciones principales del MVP.

**Requerimientos afectados:**
- Se adoptan: I3:RNF-01, RNF-07 (con RNF-01-AC-1); I4:RNF-02 (cubierto por I3).
- Sin efecto: los umbrales escalonados de I1:RNF-04; I2:RNF-01, RNF-02.
- Sigue abierto: ningún umbral adoptado cubre las respuestas generadas por IA (mensajes del agente, recomendación, representación visual, análisis de justificaciones); I3:RNF-01 y RNF-07 no las incluyen.
- Gap relacionado sin decidir: el indicador de "procesando" a los 2 s de I1:RF-53.

**Impacto sobre otras decisiones:** DEC-03 y DEC-05 (sus funciones de IA no tienen tiempo de respuesta definido).

**Resolución posterior (tiempo de respuesta de la IA):**
- **Decisión del equipo:** C. Las respuestas generadas por IA (mensajes del agente, recomendaciones, representación visual y análisis de justificaciones) quedan fuera del umbral de 3 s, por depender de un servicio externo (I4:RNF-02). Además, se adopta el indicador de "procesando": si no hay respuesta en 2 s, se muestra un indicador de texto simple, igual en la conversación y en la búsqueda (I1:RF-53).
- **Justificación del equipo:** El tiempo de las respuestas de IA depende de un proveedor externo que el equipo no controla, por lo que no se fija un umbral para ellas. El indicador de "procesando" mantiene informado al usuario mientras espera.
- **Requerimientos afectados:** se adoptan I4:RNF-02 (exclusión de servicios externos) e I1:RF-53 (RF-53-AC-1, AC-2). Sin efecto: los umbrales de IA de I1:RNF-04 y el mensaje de espera a los 8 s de I2:RNF-01. Sigue abierto: las respuestas de IA no tienen una meta verificable de tiempo; el "2 s" de I1:RF-53 lo fijó el analista de I1.
- **Impacto:** DEC-03 y DEC-05 (sin meta de tiempo para sus funciones de IA).

### DEC-40 — Disponibilidad del servicio

**SRS involucrados:** I1, I2, I3 (GAP; valores divergentes)

**Situación:** I1 (RNF-05) e I3 (RNF-06, RNF-10) piden 99 % mensual; I3 añade la fórmula de cálculo y un aviso de 24 h. I2 pide 99.5 % con mantenimiento entre 2:00 y 5:00 y aviso de 48 h (RNF-03). I4 no lo especifica.

**Opción A:** 99 % mensual con la fórmula y el aviso de 24 h de I3 (I1, I3).

**Opción B:** 99.5 % mensual con ventana de mantenimiento y aviso de 48 h (I2).

**Recomendación del analista:** Opción A. La sostienen 2 SRS, e I3 la hace verificable con una fórmula publicada. El valor de I1 es una decisión técnica de su analista.

**Decisión del equipo:** A. Disponibilidad del 99 % mensual, calculada con la fórmula de I3 y con mantenimientos avisados con 24 h de anticipación.

**Justificación del equipo:** Es la meta que comparten dos SRS, I3 la hace verificable con una fórmula publicada, y es más alcanzable para un equipo que ya asume web, app y funciones de IA.

**Requerimientos afectados:**
- Se adoptan: I1:RNF-05; I3:RNF-06, RNF-10 (con su criterio RNF-06/RNF-10-AC-1).
- Sin efecto: el 99.5 %, la ventana de 2:00 a 5:00 y el aviso de 48 h de I2:RNF-03.
- Se mantiene como gap, no decidido: respaldos y recuperación (I2:RNF-14) y la conservación del estado ante caídas (I1:RNF-03).

**Impacto sobre otras decisiones:** ninguna dependiente.

---

## Dependencias entre decisiones

| Decisión | Depende de |
|---|---|
| DEC-02, DEC-04, DEC-39 | DEC-01 |
| DEC-09 | DEC-06 |
| DEC-12 | DEC-13 |
| DEC-26 | DEC-25, DEC-35 |
| DEC-29 | DEC-35 |
| DEC-34 | DEC-33, DEC-35 |
| DEC-20 (escalamiento) | DEC-34 |

---

# Segunda ronda: GAP Tipo B detectados en `matriz_correspondencia.md`

Estas decisiones resuelven los pendientes Tipo B y los elementos sin adopción formal que se identificaron en la sección 1.7 de `matriz_correspondencia.md`. Cada una indica cómo cambia la matriz.

## Bloque 10. Identidad, IA y acceso

### DEC-42 — Actores que usan la app nativa (PV-01)
**Origen:** DEC-01 (decisión del equipo; no proviene de ningún SRS); referencia: I2 §2.3.
**Decisión del equipo:** A. Web y app nativa para todos los actores: cliente, trabajador, organización y administrador.
**Justificación del equipo:** El equipo ofrece la misma experiencia en web y en app a todos los actores, para no limitar a ninguno a un solo canal.
**Impacto:** RNF-02 y RE-01 se precisan (web y app para los cuatro actores). PV-01 queda cerrado. Aumenta el alcance de la app (riesgo I1:PV-17/18, ver PV-39).

### DEC-43 — Contraseña, segundo factor y cierre de sesión (PV-02)
**Origen:** I2:RNF-15.
**Decisión del equipo:** A. Se adopta en el MVP: contraseña de al menos 10 caracteres, segundo factor para el administrador y cierre de sesión tras 30 minutos de inactividad.
**Justificación del equipo:** El administrador consulta identificaciones oficiales y datos personales, por lo que el equipo exige reglas de autenticación más estrictas desde el MVP.
**Impacto:** nuevo **RNF-11** (Incorporado desde GAP aprobado). La mención a "soporte" en I2:RNF-15 no aplica, porque no existe ese rol (DEC-35). Como DEC-42 extiende la app a todos los actores, el requisito aplica a web y app, no solo al "panel web" de I2. PV-02 queda cerrado.

### DEC-44 — El agente se identifica como asistente automático (PV-03)
**Origen:** I1:RF-56.
**Decisión del equipo:** A. Se adopta en el MVP.
**Justificación del equipo:** Que el cliente sepa desde el primer mensaje que conversa con un asistente automático es transparente y coherente con que la IA no decide por él.
**Impacto:** nuevo **RF-45** (Incorporado desde GAP aprobado). PV-03 queda cerrado.

### DEC-45 — Clasificación del oficio dentro del catálogo (PV-04)
**Origen:** I2:RF-03.
**Decisión del equipo:** A. Se adopta en el MVP. El agente asigna exactamente una categoría del catálogo (DEC-38). Si tras 2 preguntas de aclaración no puede asignarla, no asigna oficio y ofrece la solicitud de soporte de RF-19.
**Justificación del equipo:** Con un catálogo cerrado de oficios, la solicitud necesita una categoría válida para buscar proveedores, y el umbral de 2 intentos es el mismo que ya usa el escalamiento a soporte.
**Impacto:** nuevo **RF-46** (Incorporado desde GAP aprobado), con su métrica de I2 (≥ 45 de 50 descripciones de prueba). La "transferencia a soporte" de I2 se sustituye por la solicitud de soporte de RF-19 (DEC-35). PV-04 queda cerrado.

### DEC-46 — Captura manual si la IA no está disponible (PV-05)
**Origen:** I3 §2.5; flujo compatible con I4:RF-01.
**Decisión del equipo:** A. Se adopta en el MVP. Si el servicio de IA no está disponible, el cliente puede capturar la solicitud manualmente, sin preguntas ni resumen automatizado.
**Justificación del equipo:** Como las respuestas de IA dependen de un proveedor externo sin umbral de tiempo (DEC-39), el cliente necesita una vía alternativa para no quedar bloqueado.
**Impacto:** nuevo **RF-47** (Incorporado desde GAP aprobado). La suposición de I3 §2.5 pasa a ser requisito. PV-05 queda cerrado.

### DEC-47 — Límites de archivos y proyectos múltiples (PV-06)
**Origen:** I2:RF-01 (AC-3, AC-5, AC-6).
**Decisión del equipo:** A. Se adoptan los límites de imagen de I2 (JPG o PNG de hasta 5 MB, máximo 10 imágenes por proyecto) y la regla de preguntar a qué proyecto corresponde un archivo cuando el cliente tiene más de un proyecto activo. **El límite de video queda abierto.**
**Justificación del equipo:** Los límites de imagen son verificables y provienen de un SRS. Para el video no existe ningún valor en los SRS ni en la elicitación, y el equipo no tiene información técnica para fijarlo.
**Impacto:** nuevo **RF-48** (Incorporado desde GAP aprobado). El rechazo de video y de voz de I2:RF-01-AC-4 sigue sin efecto (DEC-04, DEC-11). PV-06 se reduce a **PV-06: límites de video**, que sigue abierto por la razón indicada.

### DEC-48 — Perfil con verificación rechazada o retirada (PV-07)
**Origen:** I1:RF-09-AC-2, I1:RF-29; DEC-06, DEC-07.
**Decisión del equipo:** B. El perfil sigue visible en las búsquedas sin la marca correspondiente y con la distinción entre lo declarado y lo verificado.
**Justificación del equipo:** Es coherente con mostrar perfiles no verificados (DEC-06) y con no incluir sanciones en el MVP (DEC-33): rechazar o retirar la verificación quita la marca, pero no oculta el perfil.
**Impacto:** se precisan RF-09, RF-10, RF-11 y RF-12 (al rechazar o retirar, solo se quita la marca), además de RF-08 y RF-23. Siguen sin efecto I2:RF-07-AC-3 e I3:RF-13-AC-2. PV-07 queda cerrado. Riesgo registrado: un perfil con información falsa confirmada sigue apareciendo en las búsquedas, aunque sin marca.

### DEC-49 — RFC en el registro de organización (PV-09, parte RFC)
**Origen:** I2:RF-17, RF-17-AC-1.
**Decisión del equipo:** C. Se mantiene abierto.
**Justificación del equipo:** Si el RFC es exigible depende de qué significa "organización registrada" y ante quién (I1:PV-03), y esa definición legal la desconoce el equipo.
**Impacto:** PV-09 queda abierto completo (campos mínimos, "organización registrada" y RFC), como pendiente legítimo (Tipo A).

## Bloque 11. Solicitud, búsqueda y citas

### DEC-50 — Momento de captura del domicilio exacto (PV-10)
**Origen:** DEC-12, DEC-41; referencias: I2:RF-02, I1:RF-54, I3:RF-15-AC-1.
**Decisión del equipo:** A. El cliente proporciona el domicilio exacto al dar su consentimiento, una vez que la cita está confirmada (DEC-41).
**Justificación del equipo:** El domicilio se pide solo cuando se va a usar, lo que reduce los datos guardados sin necesidad y refuerza la protección de DEC-41.
**Impacto:** se precisa RF-42 (captura y revelación ocurren en el mismo paso). PV-10 queda cerrado.

### DEC-51 — Otros criterios de orden y filtro, y garantía en el perfil (PV-13)
**Origen:** I3:RF-06, I3:RF-05.
**Decisión del equipo:** A. Se adoptan en el MVP los demás criterios de I3:RF-06 (calificación de mayor a menor, disponibilidad por la franja más próxima, cercanía y garantía; los empates se ordenan por calificación) y la garantía en el perfil, cuando aplique.
**Justificación del equipo:** Dar al cliente varios criterios para ordenar y filtrar le ayuda a comparar las opciones según lo que más le importa.
**Impacto:** RF-25 se amplía (Incorporado desde GAP aprobado) y se precisa RF-07 (garantía). Nuevo **PV-41:** criterio para ordenar por "cercanía". Queda abierto porque DEC-13 eliminó la distancia en km y ningún SRS define cómo ordenar por cobertura de colonias. PV-13 queda cerrado.

### DEC-52 — Catálogo o "ver más compatibles" (PV-14)
**Origen:** I4:RF-02.
**Decisión del equipo:** B. Se mueve a funcionalidad posterior.
**Justificación del equipo:** Solo un SRS lo incluye y el MVP se centra en recomendar de 3 a 4 opciones (DEC-15), no en un catálogo abierto.
**Impacto:** nuevo **FP-18** (Catálogo de trabajadores). PV-14 queda cerrado.

### DEC-53 — Búsqueda sin resultados (PV-15)
**Origen:** I3:RF-04-AC-2 (opción elegida); alternativas descartadas: I1:RF-14, I2:RF-05.
**Decisión del equipo:** C. Si ningún proveedor coincide con oficio, zona y fecha, el sistema muestra el mensaje "No hay proveedores disponibles para los criterios seleccionados".
**Justificación del equipo:** Un mensaje claro es suficiente para el MVP y no requiere procesos adicionales de ampliación ni de aviso posterior.
**Impacto:** nuevo **RF-49** (Incorporado desde GAP aprobado). I1:RF-14 e I2:RF-05 se descartan. PV-15 queda cerrado.

### DEC-54 — Detalles de citas (PV-16)
**Origen:** I1:RF-39, RF-40, RF-38-AC-3, RF-17-AC-2, RD-10; I2:RF-06 (AC-2, AC-5 a AC-8), RF-18; I3:RF-07.
**Decisión del equipo:** se adoptan en el MVP:
- (a) notificación a ambas partes al confirmarse la cita, con fecha, hora y lugar (I1:RF-39);
- (b) recordatorio a ambas partes 24 h antes (I2:RF-06-AC-6);
- (c) tras cancelar una cita, el prestador puede proponer una nueva fecha (I2:RF-06-AC-8; I1:RF-40);
- (d) bloqueo de la franja al confirmar y liberación al cancelar (I2:RF-06-AC-2, AC-5);
- (e) ante franjas traslapadas, prevalece la confirmación registrada primero (I2:RF-06-AC-7);
- (f) una propuesta de cita sin respuesta en 24 h expira, sin comprometer otro horario (I1:RF-38-AC-3);
- (h) el prestador acepta o rechaza la solicitud en un máximo de 4 h dentro de su horario; si no responde o rechaza, el cliente ve las opciones restantes (I2:RF-18);
- (i) antes de solicitar la cita se muestra su costo o "sin costo", y la moneda (I3:RF-07).

Se mueve a funcionalidad posterior: (g) cancelación tardía y distinción entre emergencia y ausencia (I1:RF-17-AC-2, RD-10).
**Justificación del equipo:** Estos detalles mantienen la agenda consistente y a ambas partes informadas. La distinción entre cancelación tardía y emergencia requiere criterios que siguen abiertos en el SRS de origen (I1:PV-13).
**Impacto:** nuevos **RF-50** (notificación y recordatorio: a, b), **RF-51** (bloqueo de franjas y prevalencia: d, e), **RF-52** (aceptación de la solicitud en 4 h: h) y **RF-53** (costo de la visita: i), todos Incorporados desde GAP aprobado. RF-28 incorpora (f) y RF-29 incorpora (c). Nuevo **FP-19** (cancelación tardía y emergencias). PV-16 queda cerrado.

### DEC-55 — Contenido de la propuesta y plazo de 72 h (PV-17)
**Origen:** I3:RF-08 (desglose, AC-1, AC-4); I1:RF-18; I1:RF-42-AC-3.
**Decisión del equipo:**
- Parte 1, B: la propuesta lleva el desglose de I3. Mano de obra, materiales y costos adicionales van por separado; cada material indica descripción, cantidad, unidad, precio unitario y subtotal; el envío se rechaza si falta un dato de material o si los subtotales no suman el total.
- Parte 2, B: las 72 h de DEC-18 cuentan desde la primera propuesta y no se reinician con las versiones revisadas.
**Justificación del equipo:** El desglose de I3 es coherente con el modelo de cambios y versiones que se adoptó (DEC-21) y permite verificar la suma. Contar las 72 h desde la primera propuesta mantiene acotado el tiempo total de negociación.
**Impacto:** se precisan RF-30 (contenido) y RF-31 (plazo). Las partidas con IVA de I2:RF-08 se descartan. PV-17 queda cerrado.

### DEC-56 — Campos de la solicitud de cambio (PV-18)
**Origen:** I3:RF-08-AC-2, AC-6.
**Decisión del equipo:** A. La solicitud de cambio incluye tipo de cambio, motivo, monto adicional o ahorro en MXN, presupuesto actualizado, materiales o alcance afectados y fecha propuesta; si falta alguno, el envío se rechaza.
**Justificación del equipo:** Son los campos que cubren los cuatro tipos de cambio adoptados en DEC-21.
**Impacto:** se precisa RF-32. Los campos de I2:RF-09 se descartan. PV-18 queda cerrado.

### DEC-57 — Vencimiento y contrapropuesta en los cambios (PV-19)
**Origen:** I1 E.3; I2:RF-09-AC-7 (referencia para el vencimiento).
**Decisión del equipo:**
- 1, A: al vencer las 24 h sin respuesta del cliente, el cambio pasa a "no aceptado" y no se aplica.
- 2, A: cada contrapropuesta abre un nuevo plazo de 24 h.
- 3, A: el proveedor acepta la contrapropuesta (el cambio se aplica con esos términos) o la rechaza (no se aplica).
**Justificación del equipo:** Así cada cambio tiene un cierre verificable, quien recibe una contrapropuesta tiene tiempo para responder, y el flujo de negociación de DEC-22 queda completo.
**Impacto:** se precisa RF-33. Los puntos 2 y 3 son decisiones del equipo que ningún SRS define. Se mantiene DEC-20: sin acuerdo, la parte afectada queda pendiente de un nuevo acuerdo entre las partes. PV-19 queda cerrado.

## Bloque 12. Seguimiento, cierre y evaluación

### DEC-58 — Comprobantes de compra y gasto acumulado (PV-21)
**Origen:** I3:RF-09-AC-2, I3:RD-06, I3 §1.3 ("gasto acumulado"); I1:RF-23.
**Decisión del equipo:** Otra (redacción aprobada). No aplica a la app: cliente y trabajador revisan los comprobantes y el gasto en persona, por lo que la plataforma no registra comprobantes ni calcula un gasto acumulado.
**Justificación del equipo:** Dado que esta revisión se hace en físico entre cliente y trabajador, no aplica para la app.
**Impacto:** nuevo **FP-22** (fuera del alcance de la app). Quedan sin efecto I3:RF-09-AC-2, la parte de comprobantes de I3:RD-06 y la definición de "gasto acumulado" de I3 §1.3. Se ajustan **RD-14** ("solo se registran acuerdos") y **RNF-05** (se retira "comprobantes" de los datos sensibles). PV-21 queda cerrado.

### DEC-59 — Modelo de estados integrado (PV-22)
**Origen:** I4:RF-08 (programado, en proceso, terminado); I3:RF-01, I3:RF-03 (borrador y versión confirmada); I1:RF-60 (concluido tras la confirmación del cliente).
**Decisión del equipo:** C. Los estados del proyecto son: borrador → confirmada (solicitud) → programado → en proceso → terminado → concluido. La cita (RF-28), la propuesta (RF-31) y el cambio (RF-33) conservan sus estados propios, separados de los del proyecto.
**Justificación del equipo:** Un modelo de estados corto es coherente con el seguimiento simple elegido en DEC-25 y fácil de entender para cliente y trabajador.
**Impacto:** se precisan RF-37 y RF-39. Se descarta el ciclo de I2 (Apéndice D); las referencias a sus estados en los criterios de origen se adaptan:
- "asignado" en I2:RF-18-AC-5 (RF-52);
- "cotizado/contratado" en I2:RF-08;
- "visita agendada" en I2:RF-06-AC-8.

Sigue abierto: en qué transición exacta pasa el proyecto de "confirmada" a "programado" (selección del proveedor, aceptación de la propuesta o cita confirmada). Ninguno de los SRS elegidos lo define, así que se registra como **PV-42**. PV-22 queda cerrado.

### DEC-60 — Aviso de proyectos sin movimiento (PV-23)
**Origen:** DEC-26; I3:RF-09-AC-4 (referencia).
**Decisión del equipo:** B. Se mueve a funcionalidad posterior.
**Justificación del equipo:** El equipo optó por un seguimiento simple por estados, y este aviso habría requerido adaptar un criterio diseñado para reportes de avance.
**Impacto:** nuevo **FP-20**. PV-23 queda cerrado.

### DEC-61 — Terminación de un proyecto que no se concluye (PV-24)
**Origen:** I2:RF-19; DEC-29.
**Decisión del equipo:** B. Se mueve a funcionalidad posterior.
**Justificación del equipo:** Es coherente con DEC-29, que no definió la cancelación del proyecto en el MVP.
**Impacto:** nuevo **FP-21** (cancelación o abandono del proyecto completo). PV-24 queda cerrado.

### DEC-62 — Cliente que no responde a la solicitud de cierre (PV-25)
**Origen:** I2:RF-16-AC-4 (adaptado).
**Decisión del equipo:** A. Si el cliente no responde a una solicitud de cierre en 72 h, el sistema avisa al administrador. El aviso es informativo y el proyecto permanece en "terminado"; el administrador no decide el cierre (DEC-34).
**Justificación del equipo:** El aviso permite que el administrador sepa que un cierre está detenido y pueda dar seguimiento a la comunicación, sin intervenir en la decisión comercial.
**Impacto:** nuevo **RF-54** (Incorporado desde GAP aprobado). La alerta a "soporte" de I2 se dirige al administrador (DEC-35). PV-25 queda cerrado.

### DEC-63 — Publicación de la evaluación bidireccional (PV-26)
**Origen:** I2:RF-11 (AC-1, AC-5 a AC-8).
**Decisión del equipo:** A.
- Al pasar a "concluido", ambas partes reciben la solicitud de calificación en menos de 5 minutos.
- Las solicitudes vencen a los 7 días.
- Cada calificación se publica cuando ambas partes calificaron o al vencer el plazo, lo que ocurra primero.
- Solo las calificaciones publicadas cuentan para el promedio.
**Justificación del equipo:** Publicar ambas calificaciones al mismo tiempo evita represalias entre las partes, lo cual es necesario con la evaluación bidireccional de DEC-30.
**Impacto:** nuevo **RF-55** (Incorporado desde GAP aprobado). La regla "Prestador nuevo con menos de 3 calificaciones publicadas" de I2:RF-11-AC-8 sigue sin efecto (DEC-15). Se descarta la publicación inmediata de I3:RF-11-AC-2. PV-26 queda cerrado.

### DEC-64 — Qué muestra el perfil de las 4 dimensiones (PV-27)
**Origen:** I2:RF-11; I3:RF-05; I4:RF-03-AC-2; I1:RF-48.
**Decisión del equipo:** B. El perfil del proveedor muestra la calificación promedio, el número de evaluaciones y el promedio de cada una de las 4 dimensiones (puntualidad, calidad, limpieza y apego al presupuesto).
**Justificación del equipo:** Mostrar cada dimensión da al cliente información más útil para decidir, especialmente sobre el apego al presupuesto.
**Impacto:** se precisa RF-07. Mostrar las dimensiones es una decisión del equipo: ningún SRS lo especifica. PV-27 queda cerrado.

## Bloque 13. Privacidad, calidad y datos

### DEC-65 — Domicilios: a qué clientes se muestra el del trabajador y cuándo se revela el del cliente (PV-30)
**Origen:** DEC-41; I1:RF-58 (un cliente específico); I2:RNF-04 (revelación automática; visibilidad hasta 7 días después del cierre).
**Decisión del equipo:**
- **Parte 1, B:** el domicilio de un trabajador con identidad verificada solo se muestra a los clientes que tienen una cita confirmada con él.
- **Parte 2, Otra (aclarada):** el domicilio exacto del cliente, junto con las fotos y videos del domicilio, se revela **automáticamente** al trabajador **cuando el cliente acepta su propuesta** (RF-31), sin un consentimiento adicional. El trabajador lo puede ver **hasta 7 días después de que el proyecto quede "concluido"**.

**Justificación del equipo:** Al aceptar la propuesta, el cliente ya eligió al trabajador y acordó el trabajo, así que el domicilio se comparte en ese momento para ejecutarlo. Los 7 días posteriores al cierre dan margen para atender cualquier pendiente. Limitar el domicilio del trabajador a clientes con cita confirmada reduce su exposición.

**Impacto:**
- **Reabre y modifica DEC-41 (parte del cliente).** El disparador deja de ser "cita confirmada + consentimiento expreso" y pasa a ser "aceptación de la propuesta, de forma automática". Quedan sin efecto, en lo que se refiere al consentimiento, I3:RD-07, I3:RF-15-AC-1 e I1:RF-54. La revelación automática toma la lógica de I2:RNF-04, pero ligada a la propuesta y no a la cita. La ventana de 7 días se adopta de I2:RNF-04.
- **Reabre DEC-50:** el domicilio ya no se pide "al dar el consentimiento con la cita confirmada", porque ese paso deja de existir.
- Se precisan **RF-42** y **RF-43**, y **RD-15** ("antes de aceptar la propuesta, el proveedor solo ve la zona aproximada").
- PV-30 queda cerrado.

**⚠️ Requiere confirmación del equipo (consecuencias de esta decisión):**
1. **Visita de valoración antes de la propuesta.** Con DEC-17 la visita es opcional, pero cuando ocurre sucede *antes* de la propuesta. El trabajador necesitaría el domicilio para acudir, y con esta regla aún no lo tiene. Ningún SRS resuelve este caso.
2. **Momento de captura del domicilio (DEC-50).** Hay que definirlo de nuevo: ¿el cliente lo proporciona al aceptar la propuesta?
3. **Relación con I1:RF-20 (Bloque 14, RF-21).** La autorización explícita para compartir datos se cumpliría si se considera que aceptar la propuesta equivale a autorizar la revelación del domicilio.

### DEC-66 — Bitácora de auditoría (PV-32)
**Origen:** I3:RNF-05, I1:RNF-11; relacionados: I2:RNF-06, I4:RNF-05.
**Decisión del equipo:** A. Cada aceptación, rechazo y contrapropuesta de propuestas y cambios queda registrada en una bitácora con fecha, usuario y decisión. Los registros no pueden alterarse sin dejar rastro.
**Justificación del equipo:** Tres de los cuatro SRS lo incluyen, y las versiones del presupuesto, la anonimización y la conservación de trazas dependen de esta bitácora.
**Impacto:** nuevo **RNF-12** (Incorporado desde GAP aprobado). El historial consultable por el cliente de I1:RF-21 no se adopta (era la opción B). La exportación de I2:RNF-06 tampoco se adopta. PV-32 queda cerrado.

### DEC-67 — Respaldos y continuidad (PV-33)
**Origen:** I1:RNF-03.
**Decisión del equipo:** A. Ante una caída del servicio o una pérdida de conexión no deben perderse conversaciones, citas ni acuerdos; tras reconectarse, el usuario recupera su estado.
**Justificación del equipo:** Garantizar que no se pierdan conversaciones, citas ni acuerdos es el comportamiento esencial para el usuario en el MVP.
**Impacto:** nuevo **RNF-13** (Incorporado desde GAP aprobado). Las métricas de respaldo de I2:RNF-14 (respaldo cada 24 h, RPO, RTO y prueba mensual) no se adoptan. PV-33 queda cerrado.

### DEC-68 — Localización y formatos (PV-36)
**Origen:** I2:RNF-13.
**Decisión del equipo:** A. Mensajes y pantallas en español de México, con fechas en formato DD/MM/AAAA, hora del centro de México y montos en MXN con separador de miles.
**Justificación del equipo:** Es coherente con el territorio, la moneda y la zona horaria del piloto (RE-08), y se puede verificar.
**Impacto:** nuevo **RNF-14** (Incorporado desde GAP aprobado). PV-36 queda cerrado.

### DEC-69 — Datos mínimos para guardar un borrador (PV-37)
**Origen:** I3:RF-01-AC-1, AC-2.
**Decisión del equipo:** A. Para guardar un borrador de solicitud se requieren el resultado esperado, el oficio y la zona aproximada. Si falta alguno, el sistema no lo crea e identifica los campos faltantes.
**Justificación del equipo:** Con esos tres datos el borrador ya describe una necesidad identificable, y el resto se completa en la conversación con el agente.
**Impacto:** se precisa **RF-14** (se distinguen los mínimos para guardar el borrador de los mínimos para buscar). El mínimo de I4:RF-01-AC-1 se descarta. **Nota:** el "oficio" debe ser una categoría del catálogo (DEC-38, RF-46), así que la clasificación ocurre antes de guardar el borrador. PV-37 queda cerrado.

### DEC-70 — Consulta de costos (PV-40)
**Origen:** I1:RF-23; I3:RF-10 (parte presupuesto).
**Decisión del equipo:** A. El cliente consulta en una sola vista el presupuesto acordado vigente, los cambios aprobados y los cambios pendientes de aprobar.
**Justificación del equipo:** Es la vista que permite al cliente aprovechar el control de cambios del MVP. Lo gastado queda fuera, porque su revisión es presencial (DEC-58).
**Impacto:** se reincorpora **RF-36** con este alcance (Incorporado desde GAP aprobado). PV-40 queda cerrado.

## Bloque 14. Elementos detectados sin adopción formal

### DEC-71 — Sugerencia de visita de valoración (RF-18)
**Origen:** I3:RF-02-AC-3, I3:RF-03 (AC-2, AC-4).
**Decisión del equipo:** B. Se mueve a funcionalidad posterior.
**Justificación del equipo:** La visita ya es opcional (DEC-17), y el equipo prefiere no agregar en el MVP una lógica que la sugiera según qué datos falten.
**Impacto:** **RF-18 sale de los RF del MVP** y pasa a **FP-23**. RF-13 conserva la regla de registrar como "desconocido" un dato que el cliente no conoce (I3:RF-02, adoptado en DEC-03), pero sin ofrecer una visita. I3:RF-03-AC-4 ("apta para cotización sin visita") también queda en FP-23.

### DEC-72 — Autorización explícita de acciones sensibles (RF-21)
**Origen:** I1:RF-20 (AC-1, AC-2).
**Decisión del equipo:** A. Las acciones que comprometen el tiempo, el dinero o los datos del cliente requieren su autorización explícita; si la rechaza, la acción no se ejecuta. Aceptar la propuesta cuenta como la autorización para revelar el domicilio al trabajador (DEC-65).
**Justificación del equipo:** Es la regla general que garantiza que ninguna acción sensible ocurra sin el visto bueno del cliente, y la aceptación de la propuesta la satisface en el caso del domicilio.
**Impacto:** **RF-21** se confirma (Incorporado desde GAP aprobado). Se resuelve la consecuencia 3 de DEC-65.

### DEC-73 — Historial de versiones del presupuesto (RF-35)
**Origen:** I3:RF-08-AC-7, I3:LD-04; I2:RF-09-AC-4.
**Decisión del equipo:** A. El presupuesto inicial aprobado no se modifica. Cada cambio aprobado genera una versión con fecha, total anterior, total actualizado y diferencia respecto al inicial, y el historial se puede consultar.
**Justificación del equipo:** Es coherente con el modelo de cambios de I3 (DEC-21), con el desglose de la propuesta (DEC-55), con la consulta de costos (DEC-70) y con la bitácora (DEC-66).
**Impacto:** **RF-35** se confirma (Incorporado desde GAP aprobado).

### DEC-74 — Uso consentido de fotos y conversaciones (RNF-07)
**Origen:** I1:RNF-07; I4 §2.4.
**Decisión del equipo:** A. El agente no usa fotos ni conversaciones para fines no consentidos, y las fotos se usan solo en el contexto de la solicitud.
**Justificación del equipo:** Complementa el consentimiento del aviso de privacidad (DEC-37) y tiene respaldo en dos SRS.
**Impacto:** **RNF-07** se confirma (Incorporado desde GAP aprobado).

### DEC-75 — La IA no decide por los usuarios (RD-07)
**Origen:** I1:RD-06; I3:RD-04.
**Decisión del equipo:** A. La IA puede recopilar información, recomendar, resumir y alertar, pero no decide medidas delicadas ni acepta citas, propuestas, pagos o cambios en nombre de los usuarios; la última palabra la tiene una persona.
**Justificación del equipo:** Formaliza el principio que ya aplican varias decisiones del equipo (DEC-05, DEC-15) y que sostiene RD-08, RD-09, RF-21, RF-26 y RF-34.
**Impacto:** **RD-07** se confirma (Incorporado desde GAP aprobado).

### DEC-76 — El precio lo define el proveedor (RD-12)
**Origen:** I2:RD-04.
**Decisión del equipo:** A. El precio de un trabajo lo define únicamente el proveedor, y cualquier rango que muestre el sistema es solo de referencia.
**Justificación del equipo:** Aclara que el rango de precio del perfil y el filtro por precio (DEC-14) no comprometen al proveedor con un monto.
**Impacto:** **RD-12** se confirma (Incorporado desde GAP aprobado).

### DEC-77 — Trazas anonimizadas tras eliminar datos (RD-17)
**Origen:** I3:RD-09; I1:RF-55-AC-2; relacionado: I2:RF-21.
**Decisión del equipo:** A. Cuando se eliminan o anonimizan los datos de un usuario, la bitácora de decisiones se conserva anonimizada.
**Justificación del equipo:** Hace compatibles la atención de solicitudes ARCO (DEC-37) y la bitácora inalterable (DEC-66).
**Impacto:** **RD-17** se confirma (Incorporado desde GAP aprobado).

## Cierre de pendientes derivados (DEC-78 a DEC-81)

### DEC-78 — Domicilio del cliente cuando hay visita antes de la propuesta (consecuencia 1 de DEC-65)
**Origen:** I2:RNF-04 (revelación al confirmarse la primera cita); DEC-65, DEC-72.
**Decisión del equipo:** A. Si se agenda una visita de valoración, el domicilio exacto del cliente se revela automáticamente al trabajador cuando el cliente confirma la cita de visita. Esa confirmación cuenta como la autorización de RF-21. Si no hay visita, aplica DEC-65: el domicilio se revela al aceptarse la propuesta.
**Justificación del equipo:** El trabajador necesita la dirección para acudir a la visita, y el equipo mantiene la revelación automática ligada a una acción explícita del cliente, con el mismo criterio que en DEC-72.
**Impacto:** se precisan **RF-42** (dos disparadores: cita de visita confirmada o propuesta aceptada) y **RF-21** (confirmar la cita de visita cuenta como autorización). La ventana de visibilidad de DEC-65 (hasta 7 días después de "concluido") no cambia. Queda resuelta la consecuencia 1 de DEC-65.

### DEC-79 — Momento de captura del domicilio exacto (consecuencia 2 de DEC-65; sustituye a DEC-50)
**Origen:** DEC-12, DEC-50, DEC-65, DEC-78.
**Decisión del equipo:** A. El cliente proporciona el domicilio exacto en el primer momento en que debe revelarse: al confirmar la cita de visita, si la hay, o al aceptar la propuesta.
**Justificación del equipo:** El domicilio se pide solo cuando se va a usar, lo que conserva la intención de DEC-50 y es coherente con el uso consentido de datos (RNF-07).
**Impacto:** sustituye la regla de DEC-50. Se precisan **RF-14** (el domicilio no se pide para buscar) y **RF-42**. Queda resuelta la consecuencia 2 de DEC-65.

### DEC-80 — Criterio para ordenar por cercanía (PV-41)
**Origen:** I1:RD-04; I3:RF-06; DEC-13, DEC-51.
**Decisión del equipo:** A. Al ordenar por cercanía aparecen primero los proveedores cuya cobertura incluye la colonia del cliente y después los que solo cubren colonias vecinas.
**Justificación del equipo:** Se apoya en la definición de cercanía ya adoptada (RD-04), sin introducir una medida de distancia que el MVP no tiene.
**Impacto:** se precisa **RF-25**. El criterio es una decisión del equipo derivada de I1:RD-04; ningún SRS define ese orden de forma literal. PV-41 queda cerrado.

### DEC-81 — Transición de "confirmada" a "programado" (PV-42)
**Origen:** I4:RF-07-AC-1, I4:RF-08; DEC-59.
**Decisión del equipo:** A. El proyecto pasa de "confirmada" a "programado" cuando se confirma la primera cita, sea de visita o de servicio.
**Justificación del equipo:** Sigue la lógica de I4, donde el servicio queda programado cuando se registra una fecha y un horario acordados.
**Impacto:** se precisan **RF-37** y **RF-28**. Si hay visita, el proyecto queda "programado" antes de que exista un acuerdo; esta consecuencia de la opción elegida queda documentada. Las transiciones a "en proceso" y "terminado" siguen a I4:RF-08 y RF-39. PV-42 queda cerrado.

---

# Tercera ronda: situaciones detectadas en la validación de `SRS_equipo.md` (DEC-82 a DEC-88)

Los IDs de RF, RNF y PV de esta ronda ya son **definitivos** (sección 4 de `matriz_correspondencia.md`).

### DEC-82 — Uso de la garantía en búsqueda y orden
**Origen:** I3:RF-05, I3:RF-06; DEC-51.
**Decisión del equipo:** B. La garantía se usa como filtro y como criterio de orden: al ordenar por garantía, aparecen primero los proveedores que la ofrecen y después los que no.
**Justificación del equipo:** *(Aprobada por el equipo)* Así se aplica completo el criterio adoptado en DEC-51, con una regla de orden simple de entender para el cliente.
**Nota:** el sentido del orden por garantía es una decisión nueva del equipo; los SRS individuales no lo definen.
**Impacto:** se precisa RF-29 (nuevo criterio de orden por garantía). El sentido del orden es una decisión del equipo: I3:RF-06 no lo define.

### DEC-83 — Paso a "en proceso"
**Origen:** I4:RF-08 (actualización de estados; RF-08-AC-2).
**Decisión del equipo:** A. El proveedor marca manualmente el inicio del trabajo, y con eso el proyecto pasa a "en proceso".
**Justificación del equipo:** *(Aprobada por el equipo)* Es coherente con el modelo de estados de I4 adoptado en DEC-25 y DEC-59, donde el proveedor actualiza el estado del servicio.
**Impacto:** RF-45 queda respaldado explícitamente por esta DEC; su comportamiento no cambia. Se descarta el cambio automático por fecha del Apéndice D de I2.

### DEC-84 — Relación entre propuesta aceptada y cita de ejecución
**Origen:** I2:RF-06-AC-3; I1:RF-42.
**Decisión del equipo:** A. Una cita de ejecución (servicio) solo puede confirmarse después de que ambas partes aceptaron la misma propuesta.
**Justificación del equipo:** *(Aprobada por el equipo)* Evita comprometer fechas de trabajo sin un acuerdo de alcance y costo, en línea con dos SRS individuales.
**Impacto:** RF-34 recibe un nuevo criterio. Las citas de visita no cambian.

### DEC-85 — Falta de respuesta del proveedor a una contrapropuesta
**Origen:** DEC-57. Esta decisión **reabre parcialmente DEC-21 y RF-40**, que solo permitían al proveedor registrar cambios.
**Decisión del equipo:** C2 con reglas (a).
- Si el proveedor no responde a una contrapropuesta en 24 h, la contrapropuesta queda **rechazada automáticamente** y el acuerdo vigente no cambia.
- Después de eso, el **cliente** puede iniciar una solicitud de cambio con los mismos campos que usa el proveedor (DEC-56).
- El proveedor tiene 24 h para aceptarla o rechazarla. Sin respuesta, la solicitud expira sin aplicarse.
**Justificación del equipo:** *(Aprobada por el equipo)* Da un cierre verificable a la contrapropuesta sin respuesta y permite que el cliente retome la negociación sin depender de que el proveedor vuelva a proponer.
**Nota:** el rechazo automático de la contrapropuesta y el flujo de cambio iniciado por el cliente son decisiones nuevas del equipo, tomadas para cerrar un hueco de consolidación.
**Impacto:** RF-41 recibe un nuevo criterio (rechazo automático). Nuevo **RF-55** (solicitud de cambio iniciada por el cliente). El flujo de cambios iniciados por el cliente no tiene respaldo en ningún SRS individual; es una decisión del equipo. RF-40 no cambia: el proveedor sigue registrando sus cambios igual.

### DEC-86 — Alcance de la anonimización
**Origen:** I2:RF-21-AC-3; I1:RF-55-AC-1; I3:RF-15-AC-2.
**Decisión del equipo:** A. RF-54 conserva únicamente los datos que ya lista (nombre, teléfono, domicilio, fotos e imágenes de identificación). Los mensajes del canal interno, los videos y la calificación del cliente se registran como pendiente.
**Justificación del equipo:** *(Aprobada por el equipo)* El equipo prefiere no ampliar el alcance de la anonimización hasta contar con la revisión legal pendiente (PV-08). Aunque I3:RF-15-AC-2 menciona "archivos y conversación", I2:RF-21, adoptado en DEC-37, no los lista, y la calificación del cliente no tiene fuente.
**Nota:** los elementos que la anonimización no cubre siguen abiertos en PV-12.
**Impacto:** nuevo **PV-12**. RF-54 no cambia.

### DEC-87 — Criterio cuantitativo de usabilidad
**Origen:** I1:RNF-01; I2:RNF-07 (referencia, sin efecto por DEC-01).
**Decisión del equipo:** C. La métrica cuantitativa de usabilidad se mantiene como pendiente. RNF-01 conserva su criterio cualitativo.
**Justificación del equipo:** *(Aprobada por el equipo)* La única métrica disponible (I2:RNF-07) estaba diseñada para tareas por WhatsApp, y el equipo prefiere definir la suya cuando se conozcan las tareas y los usuarios del piloto.
**Nota:** la métrica cuantitativa de usabilidad sigue abierta en PV-13.
**Impacto:** nuevo **PV-13**. RNF-01 indica que la métrica está pendiente.

### DEC-88 — Paso a "programado" cuando hay visita antes de la propuesta (consecuencia de DEC-81)
**Origen:** DEC-81; I4:RF-07-AC-1.
**Verificación previa:** después de DEC-83 y DEC-84 el problema seguía existiendo, porque DEC-84 solo condiciona la cita de ejecución.
**Decisión del equipo:** A. Se mantiene DEC-81: la primera cita confirmada, sea de visita o de ejecución, pasa el proyecto a "programado". Si hay visita, el proyecto queda "programado" antes de que exista un acuerdo; esta consecuencia queda aceptada y documentada.
**Justificación del equipo:** *(Aprobada por el equipo)* El estado "programado" indica que hay una cita acordada con el proveedor, aunque todavía no exista una propuesta aceptada. El acuerdo se controla con RF-39 y con DEC-84.
**Nota:** el equipo acepta conscientemente que, cuando hay visita, el proyecto puede quedar `programado` antes de que exista una propuesta aceptada.
**Impacto:** se precisa la descripción de RF-45 (la consecuencia queda explícita). El comportamiento no cambia.
