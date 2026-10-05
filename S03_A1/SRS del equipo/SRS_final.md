# SRS (FINAL — entrega académica) — UnCalificado

**Estado del documento: VERSIÓN FINAL (actividad S02_A1), pendiente de validación formal para implementación productiva.** Este documento cierra el ejercicio de especificación de requerimientos de la actividad. No sustituye la validación del cliente formal del proyecto ni del equipo de desarrollo real: antes de construir el producto, deben resolverse los pendientes de negocio explícitos de la sección 11.

**Fuentes utilizadas:** `proyecto_base.md` (definición acordada por el equipo), `transcript_entrevista.md` (elicitación: PO ficticio `T#` y stakeholder real `R-T#`), `requerimientos_clasificados.md` (clasificación y decisiones de alcance), `revision_SRS.md` (bitácora completa de revisiones y decisiones técnicas), `SRS_borrador.md` (versión revisada y corregida de la que deriva este cierre) y los tres diagramas de casos de uso (`casos_de_uso.puml`, `casos_de_uso_contratacion.puml`, `casos_de_uso_seguimiento.puml`).

**Advertencia sobre el origen de la evidencia (se mantiene de los documentos anteriores).** El PO ficticio es un personaje simulado por un modelo de IA; el stakeholder real, Luis Dominguez, es una sola persona interesada (cliente potencial, vecino), no la autoridad formal de validación del proyecto ni el equipo. "Confirmado" significa que ambas fuentes de elicitación coinciden; no significa "aprobado por el cliente o por el equipo". Los valores técnicos marcados como "decisión del analista" no provienen de ninguna entrevista: son decisiones de ingeniería tomadas para que los requerimientos sean verificables, sujetas a validación del equipo real. **Nada en este documento debe leerse como que el PO ficticio o el stakeholder real aprobaron una decisión técnica o de alcance: esas decisiones son del analista, y se etiquetan como tales en cada caso.**

**Convención de referencias:** `T#` = intercambio del PO ficticio; `R-T#` = intercambio del stakeholder real; `RF-##` / `RNF-##` / `RD-##` = requerimiento; `UC##` = caso de uso (ver los tres diagramas); `PV-##` = pendiente de negocio sin resolver (`requerimientos_clasificados.md`, secciones 10 y 14); `<ID>-AC-n` = criterio de aceptación n del requerimiento ID, por ejemplo `RF-06-AC-1` (sección 8; antes `GWT-<ID>-n`, renombrado en esta corrección puntual).

---

## 0. Verificación de cierre (previa a esta versión final)
Esta sección documenta las comprobaciones realizadas inmediatamente antes de generar este documento, incluida la recuperación de una sesión interrumpida por un error de conexión mientras se generaba una versión anterior de este mismo archivo.

**Nota sobre vigencia de las cifras de esta sección.** Las subsecciones 0.1 a 0.9 documentan verificaciones realizadas **antes** de la Parte 6 (validación del SRS, hallazgos H-01 a H-12) y de la limpieza documental final posterior; sus totales (52 RF, 121 escenarios, 44 UC, etc.) son **cifras históricas** que describen el estado del documento en esa etapa, no el alcance vigente. La subsección 0.10 resume los cambios de la Parte 6 y la **0.11 contiene los totales vigentes actuales** (57 RF del MVP, 61 RF activos en total, 10 RNF, 11 RD, 132 criterios de aceptación, 49 casos de uso), que son los que deben citarse fuera de esta sección de bitácora.

### 0.1 Recuperación tras la interrupción
- **`S02_A1/SRS_final.md` no existía** en el repositorio al reanudar: la interrupción ocurrió antes de escribirlo, no a la mitad de su escritura. No había ningún archivo truncado que reparar.
- **`SRS_borrador.md`** (783 líneas) y **`revision_SRS.md`** (283 líneas) se verificaron íntegros: ambos terminan en su contenido de cierre esperado (la recomendación final y la nota de validez, respectivamente), sin cortes a mitad de sección o de tabla.
- **`git status`** mostró únicamente archivos sin seguimiento (`??`), ninguno modificado a medias; no hubo evidencia de escritura parcial por la interrupción.
- Se recuperaron y reconfirmaron, sin repetir el trabajo, los resultados de verificación ya obtenidos en la sesión anterior a la interrupción (conteo de criterios, cobertura de RF, verificación de que el administrador no autoriza gastos).

### 0.2 Procesos de shell
Se comprobó que no quedara ningún proceso de shell pendiente. Un proceso en segundo plano de una etapa muy anterior de la sesión (una búsqueda de un renderizador local de PlantUML, sin relación con el contenido del SRS) seguía activo; se terminó antes de continuar. Tras eso, no quedó ningún proceso pendiente.

### 0.3 Conteo definitivo de criterios Given-When-Then (cifra histórica, previa a Parte 6)
Verificado por conteo automatizado sobre `SRS_borrador.md` (base de este cierre): **82 escenarios Given-When-Then, cada uno con identificador único, sin duplicados.** Esta cifra corresponde a esa etapa del documento; el total vigente, tras las ampliaciones posteriores, es de **132** (ver 0.8, 0.10 y 0.11).

| | Cantidad | Detalle |
|---|---|---|
| **Escenarios nuevos** (no existían en la primera versión del borrador; se agregaron en la revisión previa a este cierre) | 5 | RF-19-AC-3, RF-29-AC-2, RF-55-AC-2, RNF-04-AC-4, RNF-11-AC-2 |
| **Escenarios modificados** (mismo identificador, contenido corregido) | 8 | RF-19-AC-2, RF-28-AC-2, RF-29-AC-1, RF-38-AC-3, RF-55-AC-1, RNF-04-AC-1, RNF-04-AC-2, RNF-04-AC-3 |
| **Escenarios sin cambios** desde la primera versión del borrador | 69 | El resto |
| **Total antes de esa revisión** | 77 | — |
| **Total definitivo (este cierre)** | **82** | 77 + 5 nuevos |


### 0.4 Cobertura de los 52 RF del MVP (cifra histórica, previa a Parte 6)
Verificado por conteo automatizado sobre la sección 5 (catálogo) de `SRS_borrador.md`: **los 52 RF del MVP están catalogados, sin faltantes**, y los 52 tienen al menos un criterio Given-When-Then en la sección 8. También se confirmaron **10/10 RNF** y **11/11 RD** (directamente o mediante el RF que las opera). Estos 52 corresponden al alcance del MVP **antes** de los 5 RF agregados en Parte 6 (RF-58 a RF-62); el total vigente es **57** (ver 0.10 y 0.11).

### 0.5 Consistencia RF ↔ RNF ↔ RD ↔ caso de uso ↔ criterio
- Los identificadores de caso de uso (`UC##`) citados en la sección 5 existen todos en `casos_de_uso.puml` (comparación automatizada; 0 discrepancias).
- El único caso de uso del diagrama no citado explícitamente por número en la sección 5 es **UC25** ("Reconfirmar propuesta ajustada"), que no tiene RF propio: proviene del flujo decidido en la sección 13.2 de `requerimientos_clasificados.md`. Su comportamiento está cubierto por **RF-42-AC-2**. No es una omisión de un requerimiento.
- Se encontró y corrigió, en esta versión final, una **inconsistencia cosmética** en la matriz de trazabilidad (sección 9): la fila de RNF-04 usaba la abreviatura "RNF-04-AC-1, -2, -3, -4" en vez de escribir cada identificador completo, a diferencia del resto de la tabla. Se corrigió a la forma explícita para que una auditoría de trazabilidad no la pase por alto.

### 0.6 El administrador no autoriza gastos en nombre del cliente
Verificado explícitamente:
- **RF-28-AC-2** (sección 8.10) establece que la resolución administrativa de una disputa de costo "no aplica ni cobra el costo adicional por sí misma: la autorización del gasto sigue siendo del cliente conforme a RF-19/RD-07".
- **RD-07** (sección 7) no tiene ninguna excepción para la mediación administrativa.
- No se encontró, en ningún otro criterio ni en el catálogo, una frase que contradiga esta separación entre resolución administrativa y autorización del gasto.

### 0.7 Distinción entre decisiones técnicas del analista y necesidades de las entrevistas
Se mantiene en toda la sección 5 (columna "Estado") y en la sección 8 (etiqueta de cada escenario): ningún valor marcado "decisión técnica del analista" se presenta como algo dicho por el PO ficticio o el stakeholder real. Las citas `T#`/`R-T#` se conservan intactas en las columnas "Fuente" de las secciones 5 a 9, sin alterar ninguna entrevista.

### 0.8 Corrección puntual posterior al cierre (identificadores, cobertura mínima y estructura IEEE 830)
Tras el cierre documentado en 0.1 a 0.7, el analista pidió tres correcciones puntuales adicionales sobre este mismo archivo, sin reconstruir el SRS ni tocar contenido ya correcto:
1. **Identificadores de criterios:** se renombraron todos los `GWT-<ID>-n` al formato `<ID>-AC-n` (por ejemplo, `GWT-RF-06-1` → `RF-06-AC-1`; `GWT-RNF-04-1` → `RNF-04-AC-1`). Cambio mecánico y verificado por script (230 referencias convertidas, 0 remanentes en el formato anterior).
2. **Cobertura mínima de 2 criterios por RF:** se agregaron 39 escenarios nuevos (uno para cada RF que tenía exactamente 1), sin modificar ninguno de los 82 escenarios existentes salvo la corrección de identificador ya descrita. Total en esa etapa (antes de Parte 6): **121 escenarios**. El detalle completo (qué RF recibió cada escenario nuevo y su justificación) está en `revision_SRS.md`. El total vigente, tras los 11 criterios agregados en Parte 6, es **132** (ver 0.10 y 0.11).
3. **Estructura IEEE 830:** se agregaron los encabezados de nivel superior "Parte I. Introducción", "Parte II. Descripción general" y "Parte III. Requerimientos específicos" agrupando las secciones 1; 2-4; y 5-9 respectivamente, sin renumerar ninguna sección ni subsección existente. Las secciones 10 y 11 quedan agrupadas bajo "Apéndices", por no corresponder a ninguna de las tres partes de IEEE 830.

Ningún contenido específico de UnCalificado se modificó, eliminó ni se sustituyó por contenido de otro proyecto; la verificación automatizada de esta corrección está en la sección 0.9.

### 0.9 Verificación automatizada de esta corrección puntual (resultado histórico, en esa etapa — antes de Parte 6)
| Verificación | Resultado (en esa etapa) |
|---|---|
| 52/52 RF del MVP con ≥ 2 criterios | ✅ Verificado por script antes y después de la inserción |
| IDs de criterio únicos, sin duplicados | ✅ 121 identificadores únicos |
| Referencias cruzadas válidas (matriz de la sección 9 sin huérfanos, sin faltantes) | ✅ Verificado por comparación automatizada |
| Sin pérdida de contenido | ✅ Los 82 escenarios previos se conservan íntegros (solo cambió su identificador); ninguna fila del catálogo (secciones 5 a 7) se modificó en esta corrección |
| Consistencia con los diagramas UML existentes | ✅ Los UC citados siguen siendo los mismos 44 de la versión anterior, verificados contra `casos_de_uso.puml`; los diagramas no se tocaron |

Estos cinco resultados describen el estado del documento **antes** de la Parte 6; no son los totales vigentes. Ver 0.11 para la verificación equivalente con las cifras actuales (57 RF, 132 criterios, 49 UC).

### 0.10 Parte 6: validación del SRS — hallazgos H-01 a H-12 (27 de septiembre de 2026)
Un revisor técnico independiente evaluó este documento y entregó 12 hallazgos (ambigüedades, contradicciones, criterios no verificables y gaps). El analista revisó y aprobó la resolución de los 12, con ajustes obligatorios sobre algunas de las acciones correctivas propuestas. El detalle completo de cada hallazgo, la decisión del analista y la acción aplicada están en `revision_SRS.md`. En resumen, esta corrección agregó **5 RF nuevos** (RF-58 a RF-62), **10 criterios AC nuevos** más **RF-08-AC-3**, **4 casos de uso nuevos** (UC47–UC50), una sección de **Estados y transiciones** (antes solo referenciada en `requerimientos_clasificados.md`), y un nuevo pendiente de negocio (**PV-21**). Ningún archivo de entrevistas se modificó.

### 0.11 Totales vigentes (verificados tras la limpieza documental final, 27 de septiembre de 2026)
Estos son los totales **actuales y definitivos** de este documento; sustituyen, para cualquier cita fuera de esta sección 0, a las cifras históricas de 0.1 a 0.9.

| Elemento | Total vigente | Verificación |
|---|---|---|
| RF del MVP | **57** | 57/57 con ≥ 2 criterios Given-When-Then (script, sección 8) |
| RF activos en total (MVP + Posterior: RF-33, RF-36, RF-37, RF-46) | **61** | Conteo sobre secciones 5 y 10 |
| RNF | **10** | 10/10 con ≥ 1 criterio |
| RD | **11** | 11/11 referenciadas por al menos un RF (directa o mediante el RF que las opera) |
| Criterios de aceptación (`<ID>-AC-n`) | **132** | Identificadores únicos, 0 duplicados; 0 huérfanos y 0 faltantes en la matriz de la sección 9 |
| Casos de uso | **49** | Mismo conjunto en los tres diagramas (`casos_de_uso.puml` = `casos_de_uso_contratacion.puml` ∪ `casos_de_uso_seguimiento.puml`, sin solapamiento ni discrepancia de nombre) |

Esta limpieza documental final, además de fijar estos totales, corrigió menciones residuales de "52 RF" que aún describían el alcance vigente (secciones 4.2, 5 y 11), completó el hallazgo H-10 para las filas de la sección 5 que quedaban pendientes, y revisó el vínculo entre RF-62 y RD-03. El detalle de cada corrección está en `revision_SRS.md`, sección 17.

---

## Parte I. Introducción

## 1. Introducción, propósito y alcance

### 1.1 Propósito
Especificar, para el MVP de UnCalificado, los requerimientos funcionales, no funcionales y de dominio ya clasificados y revisados, con sus actores, precondiciones, resultados esperados y criterios de aceptación verificables (Given-When-Then), y su trazabilidad hacia los casos de uso. **Esta es la versión final de entrega académica** de la actividad S02_A1; no es la validación formal que un equipo real necesitaría antes de construir el producto, la cual sigue pendiente sobre los puntos de la sección 11.

### 1.2 Alcance de este documento
Cubre **exclusivamente** los requerimientos con alcance "MVP": 57 RF, 10 RNF y las 11 RD que los sustentan (`requerimientos_clasificados.md`, sección 12). No desarrolla los requerimientos "Posterior" (RF-33, RF-36, RF-37, RF-46, y las funciones sin RF propio: pagos, cotización automática, integración con WhatsApp, estadísticas, evaluación del cliente por el trabajador, atención de urgencias, más oficios y zonas); estos se listan en la sección 10 únicamente para que quede constancia de que se consideraron y se excluyeron deliberadamente.

### 1.3 Fuera de alcance de este documento
Este documento no es un diseño técnico ni una arquitectura: no propone base de datos, ni pila tecnológica, ni estimaciones de esfuerzo. Tampoco resuelve los pendientes de negocio (sección 11); los deja explícitos para que el equipo real decida antes de cualquier implementación productiva.

---

## Parte II. Descripción general

## 2. Descripción general del producto

### 2.1 Concepto (de `proyecto_base.md`, sin modificar)
UnCalificado es una plataforma de coordinación de trabajos de oficio (cambiar un piso, armar un ropero, levantar una barda, instalar un vidrio, u otros trabajos cercanos) mediante un agente de IA. El problema que resuelve: hoy se depende de referidos informales, grupos de mensajería o anuncios sin historial confiable, sin un canal para describir el proyecto, encontrar trabajadores calificados y disponibles, coordinar citas, o dar seguimiento a avance y costos.

### 2.2 Valor principal
Un agente de IA conversa con el cliente para entender su proyecto, busca en la base de datos trabajadores cercanos, calificados, evaluados y disponibles, y coordina la planeación y las citas. El mismo agente da seguimiento al avance y a los costos, sin decidir por el usuario en los puntos que comprometen su tiempo, dinero o datos (RF-20).

### 2.3 Resumen funcional del MVP
El MVP cubre ocho capacidades (correspondientes a los ocho paquetes de los diagramas de casos de uso):
1. **Registro y autenticación** de cliente, trabajador y organización de contratistas.
2. **Gestión y verificación de perfiles**, distinguiendo identidad de experiencia, y con eliminación de datos a solicitud.
3. **Elicitación del proyecto y recomendaciones**, mediante conversación con el agente de IA.
4. **Coordinación de citas**, con doble confirmación (cliente y trabajador).
5. **Propuestas y aceptación**, con un acuerdo escrito dentro de la plataforma.
6. **Seguimiento de avances y costos**, con autorización previa de cualquier cambio.
7. **Evaluaciones y reportes** de clientes reales, con derecho de respuesta.
8. **Administración**: revisión de reportes, moderación y sanciones graduales.

### 2.4 El agente de IA
El agente de IA **es un componente interno del sistema, no un actor humano externo** (instrucción explícita del analista, aplicada también en los tres diagramas de casos de uso). Sus funciones (conversar, resumir, recomendar, proponer horarios, generar resúmenes de avance, recordar, notificar) se ejecutan como parte de los casos de uso de los actores humanos, nunca de forma autónoma respecto a las decisiones que la plataforma marca como sensibles (RF-20, RD-06).

### 2.5 Canal
Aplicación web responsive (decisión de alcance del analista). La integración con WhatsApp queda fuera del MVP (RNF-02).

---

## 3. Actores y perfiles de usuario

| Actor | Rol | Motivación principal | Familiaridad tecnológica esperada | Fuente |
|---|---|---|---|---|
| **Cliente** | Persona u hogar que necesita un trabajo de oficio | Encontrar a alguien confiable, cercano y disponible, con precio y fechas claras, sin tener que perseguir al trabajador | Variable; cómoda con el celular a diario, poca paciencia para formularios largos | `proyecto_base.md`; T9, R-T9 |
| **Trabajador independiente** | Persona de oficio que trabaja por su cuenta | Conseguir proyectos bien descritos de forma constante y que se reconozca su buen trabajo | Uso cotidiano de celular, WhatsApp y fotos; poca costumbre de aplicaciones de gestión | `proyecto_base.md`; T9, R-T9 |
| **Organización de contratistas** | Empresa o grupo registrado que ofrece varios trabajadores | Recibir proyectos bien definidos y mostrar que es una empresa seria | Se supone algo mayor que el trabajador independiente, sin confirmar | `proyecto_base.md`; T7, R-T7 |
| **Administrador** | Rol interno de la plataforma (no mencionado en `proyecto_base.md`; identificado en la elicitación) | Revisar reportes, validar documentos y decidir sobre disputas o sanciones, con la última palabra humana sobre decisiones delicadas | No aplica (rol interno del equipo) | T10, R-T10 (PV-01: atribuciones exactas pendientes) |

**Nota.** El rol de Administrador no aparece en `proyecto_base.md`; se incorporó porque ambas fuentes de elicitación lo pidieron explícitamente (T10, R-T10) y porque varios RF dependen de él (RF-28, RF-29, RF-52). Sus atribuciones exactas siguen pendientes (PV-01). **El administrador media y resuelve disputas, pero no autoriza gastos en nombre del cliente** (ver sección 0.6 y RF-28-AC-2). El administrador también determina los hechos y decide sanciones ante reportes graves; la clasificación inicial de gravedad solo prioriza la atención, no reemplaza esa determinación (RF-61, Parte 6).

---

## 4. Restricciones, supuestos y dependencias

### 4.1 Restricciones
| ID | Restricción | Fuente / decisión |
|---|---|---|
| RE-01 | Canal: aplicación web responsive; sin integración con WhatsApp en el MVP | Decisión de alcance del analista |
| RE-02 | Debe funcionar en un celular común, sin instalación, y tolerar conexión lenta o inestable | RNF-02; T9, T34, T35, R-T9, R-T35, R-T36 |
| RE-03 | Sin monto de presupuesto ni calendario definidos | PV-17, abierto |
| RE-04 | Sin oficios ni zona geográfica inicial definidos | PV-04, abierto (C-5) |
| RE-05 | Sin identificación de las normas legales aplicables (protección de datos, oficios de riesgo) | PV-15, abierto; RD-11 |
| RE-06 | Interfaz en español cotidiano, con pocos pasos | RNF-01 |
| RE-07 | El agente de IA no decide medidas delicadas; la última palabra la tiene una persona | RD-06 |

### 4.2 Supuestos
- Se asume que existirá un proveedor de IA conversacional capaz de sostener los tiempos de respuesta de RNF-04; no se ha validado con ninguna arquitectura concreta.
- Se asume que habrá trabajadores dispuestos a registrarse en la zona que se elija (PV-04); sin esto, la búsqueda (RF-11 a RF-14) no tiene resultados que mostrar.
- Se asume un equipo de desarrollo pequeño, sin que se haya confirmado su capacidad real para sostener el conjunto de 57 RF del MVP (PV-18) ni la atención humana de RF-06 (PV-09).
- El stakeholder real (una sola persona) y el PO ficticio (una simulación) representan la evidencia de elicitación disponible; no equivalen a la validación del cliente formal del proyecto.

### 4.3 Dependencias
- El MVP depende de que el equipo defina los oficios y la zona inicial (PV-04) antes de poder poblar la base de datos de trabajadores.
- El MVP depende de una revisión legal (PV-15) antes de operar con datos personales y con oficios de riesgo (electricidad, gas).
- El flujo de propuestas y cambios de costo (secciones 13.2 y 13.3 de `requerimientos_clasificados.md`) depende de que exista un acuerdo previamente aceptado (RF-42) contra el cual comparar cualquier cambio (RF-19).
- El rol de Administrador (RF-28, RF-29, RF-52) depende de que el equipo defina sus atribuciones exactas (PV-01) antes de implementarlo con seguridad operativa.

---

## Parte III. Requerimientos específicos

## 5. Requerimientos funcionales del MVP
Catálogo completo de los 57 RF del MVP, agrupados en las ocho capacidades de los diagramas de casos de uso. Para cada uno: descripción aprobada (idéntica a `requerimientos_clasificados.md`), actor(es), caso de uso, precondición, resultado esperado, fuente y estado. Los criterios Given-When-Then están en la **sección 8**, referenciados por ID.

### 5.1 Conversación con el agente de IA
| ID | Descripción aprobada | Actor(es) | UC | Precondición | Resultado esperado | Fuente | Estado |
|---|---|---|---|---|---|---|---|
| RF-01 | El sistema debe permitir describir el proyecto en una conversación con el agente de IA, que hace preguntas sencillas de una en una | Cliente | UC10 | El cliente inició sesión (RF-30) | El cliente completa una conversación guiada, una pregunta a la vez | T18, R-T18 | Confirmado |
| RF-02 | El usuario debe poder adjuntar fotos durante la conversación | Cliente | UC11 (extiende UC10) | Conversación en curso (RF-01) | La foto queda asociada al proyecto descrito | T18, R-T18 | Confirmado |
| RF-03 | El agente debe presentar un resumen del proyecto entendido, que el usuario confirme o corrija antes de continuar | Agente (interno, inicia presentando el resumen) → Cliente (destinatario, confirma o corrige) | UC12 (incluida por UC10) | El agente recibió datos suficientes (RF-04) | El cliente confirma o corrige el resumen antes de pasar a la búsqueda | T18, R-T18 | Confirmado |
| RF-04 | El agente debe solicitar como mínimo: tipo de trabajo, colonia o zona, fechas y una descripción básica; fotos, medidas y presupuesto quedan como datos opcionales | Cliente | UC10 | Conversación iniciada | El agente no avanza a la búsqueda sin los 4 datos mínimos | T19, R-T19 | Confirmado |
| RF-05 | Si el agente no entiende el proyecto, debe repreguntar o pedir una foto, en vez de asumir | Agente (interno, automático ante ambigüedad detectada) → Cliente (destinatario) | UC13 (extiende UC10) | El agente detecta ambigüedad en la respuesta del cliente | El agente repregunta o pide una foto, sin asumir datos no confirmados | T18, T21, R-T18, R-T22 | Confirmado |
| RF-06 | Si tras 2 intentos consecutivos en que el usuario corrige o rechaza la interpretación del agente este sigue sin entender, debe ofrecer contacto con una persona de soporte | Cliente | UC14 (extiende UC13) | Ocurrieron 2 repreguntas consecutivas sin éxito (RF-05) | Se ofrece al cliente contactar a una persona de soporte | T21, R-T22, R-T38 | Confirmado el comportamiento; "2 intentos" es **decisión técnica del analista** |
| RF-56 | El agente debe identificarse como asistente automático, sin hacerse pasar por una persona | Agente (interno, automático al iniciar la conversación) → Cliente (destinatario) | UC15 (incluida por UC10) | Inicio de cualquier conversación con el agente | El cliente ve, desde el primer mensaje, que conversa con un asistente automático | T18 | **Propuesta ficticia**; alcance MVP es decisión del analista |

### 5.2 Registro y verificación de trabajadores
| ID | Descripción aprobada | Actor(es) | UC | Precondición | Resultado esperado | Fuente | Estado |
|---|---|---|---|---|---|---|---|
| RF-07 | El trabajador debe registrar un perfil con nombre, foto, oficio, años de experiencia y zona de trabajo | Trabajador independiente | UC03 | Cuenta creada (RF-30) | El perfil queda visible para búsquedas una vez completos los datos mínimos | T11, R-T11 | Confirmado |
| RF-34 | El trabajador debe poder cargar fotos de trabajos anteriores (portafolio) | Trabajador independiente | UC04 (extiende UC03) | Perfil creado (RF-07) | Las fotos de portafolio quedan visibles en el perfil | T11, R-T11 | Confirmado |
| RF-08 | El trabajador o una organización de contratistas debe poder mantener actualizada su disponibilidad (calendario individual para el trabajador; disponibilidad general para la organización) | Trabajador independiente, Organización de contratistas | UC05 | Perfil creado | La disponibilidad mostrada en búsquedas refleja el calendario o el estado general vigente | T16, R-T16 | Confirmado para el trabajador; extensión a organizaciones es **decisión técnica del analista** (Parte 6, H-05). PV-05 abierto |
| RF-09 | La plataforma debe verificar la identidad del trabajador mediante identificación oficial antes de marcarlo como verificado | Trabajador independiente, Administrador | UC07 | El trabajador subió una identificación oficial | El perfil muestra la marca "identidad verificada" solo tras la revisión del administrador | T12, R-T12 | Confirmado (PV-02: quién y con qué frecuencia, abierto) |
| RF-35 | La plataforma debe verificar evidencia de experiencia o credenciales (referencias de clientes, certificados cuando existan) antes de marcar esa parte del perfil como verificada | Trabajador independiente, Administrador | UC08 | El trabajador presentó evidencia de experiencia | El perfil muestra "experiencia verificada" solo tras la revisión del administrador | T12, R-T12 | Confirmado (PV-02: evidencia aceptable sin certificados, abierto) |
| RF-10 | El perfil debe distinguir visualmente la información declarada por el trabajador de la verificada por la plataforma | Cliente (consulta el perfil) | Atributo mostrado en UC16 (sin caso de uso propio) | El perfil tiene al menos un dato declarado o verificado | El cliente puede distinguir, sin ambigüedad, qué está verificado y qué no | T11, R-T11 | Confirmado |
| RF-55 | El usuario debe poder solicitar la eliminación de sus datos y fotos | Cliente, Trabajador independiente | UC09 | Cuenta existente con datos o fotos cargadas | Los datos personales identificables del usuario (por ejemplo, fotos y datos de contacto) dejan de estar accesibles tras su solicitud. **No incluye** las entradas de historial o acuerdos ya registrados de servicios concluidos (RF-21, RF-18/RF-42), que se rigen por RNF-11 (integridad) y por el periodo de conservación que exija la normativa aplicable, aún sin identificar (PV-15) | T33, R-T34 | Confirmado el derecho a solicitarlo; el alcance exacto de qué se elimina frente a qué se conserva es interpretación del analista, pendiente de validar con PV-15 |

### 5.3 Búsqueda y recomendación
| ID | Descripción aprobada | Actor(es) | UC | Precondición | Resultado esperado | Fuente | Estado |
|---|---|---|---|---|---|---|---|
| RF-11 | El cliente debe poder buscar trabajadores combinando oficio, zona, disponibilidad y evaluación | Cliente | UC16 | Resumen del proyecto confirmado (RF-03) | La búsqueda combina los 4 criterios sin necesidad de elegir uno solo | T17, R-T17 | Confirmado |
| RF-12 | La búsqueda debe permitir filtrar además por identidad verificada y por experiencia en trabajos similares | Cliente | UC16 | Búsqueda en curso (RF-11) | El cliente puede acotar por verificación y por experiencia similar | T17, R-T17 | Confirmado |
| RF-13 | El agente debe recomendar de 3 a 4 trabajadores cuando existan, cada uno con una explicación breve de por qué se sugiere; el cliente elige, la IA no asigna directamente. Si hay menos de 3 candidatos disponibles, se muestran los que existan (mínimo 1) y se indica explícitamente | Cliente | UC16 | Búsqueda ejecutada (RF-11, RF-12) | El cliente ve entre 3 y 4 opciones explicadas, o las que existan con un aviso, y elige una | T22, R-T17, R-T23 | Confirmado el comportamiento; "3 a 4" es **decisión técnica del analista** |
| RF-14 | Si no hay trabajadores disponibles, el agente debe informarlo con claridad y ofrecer ampliar la zona o cambiar las fechas | Cliente | UC17 (extiende UC16) | La búsqueda no arrojó ningún candidato | El cliente recibe un aviso claro y dos alternativas concretas | T21, R-T16, R-T22 | Confirmado |

### 5.4 Organizaciones de contratistas
| ID | Descripción aprobada | Actor(es) | UC | Precondición | Resultado esperado | Fuente | Estado |
|---|---|---|---|---|---|---|---|
| RF-15 | El sistema debe permitir el registro y perfil básico de una organización de contratistas, con al menos: nombre legal o comercial, un representante de contacto, los oficios que ofrece y su zona de cobertura | Organización de contratistas | UC06 | Cuenta creada (RF-30) | El perfil de la organización, con esos campos mínimos completos, queda visible para búsquedas | T6, T7, R-T6, R-T7 | Confirmado el registro; campos mínimos son **decisión técnica del analista** (Parte 6, H-07), pendiente de PV-03 |
| RF-62 | La plataforma debe verificar la identidad de una organización de contratistas (documentos de constitución o del representante legal) antes de marcarla como "organización verificada", de forma separada del registro básico (RF-15) | Organización de contratistas, Administrador | UC50 | La organización presentó documentos de identidad | El perfil muestra "organización verificada" solo tras la revisión del administrador | — | Derivado (Parte 6, H-06), vinculado a PV-03 |

### 5.5 Citas y coordinación
| ID | Descripción aprobada | Actor(es) | UC | Precondición | Resultado esperado | Fuente | Estado |
|---|---|---|---|---|---|---|---|
| RF-16 | El agente debe proponer horarios de visita según la disponibilidad del cliente y del trabajador | Cliente | UC18 | Trabajador elegido de la lista recomendada (RF-13) | El cliente recibe horarios que ya son compatibles con ambas agendas | T23, R-T24 | Confirmado |
| RF-38 | Una cita solo queda confirmada cuando el cliente y el trabajador la aceptan | Cliente, Trabajador independiente, Organización de contratistas | UC19 | El cliente eligió un horario propuesto (RF-16) | La cita pasa a "Confirmada" solo con ambas aceptaciones, en el orden cliente → trabajador | T27, R-T28 | Confirmado |
| RF-39 | Ambas partes deben recibir notificación cuando la cita quede confirmada | Agente (interno, automático tras la confirmación de RF-38) → Cliente, Trabajador independiente, Organización de contratistas (destinatarios, ambas partes) | UC20 (incluida por UC19) | Cita confirmada (RF-38) | Ambas partes reciben la notificación con fecha, hora y lugar | T23, R-T24, R-T28 | Confirmado |
| RF-17 | El sistema debe permitir avisar desde la plataforma una cancelación, un cambio de fecha o un retraso, notificando a la otra parte | Cliente, Trabajador independiente, Organización de contratistas | UC21 | Existe una cita propuesta o confirmada | La otra parte recibe la notificación del aviso | T25, R-T26 | Confirmado (PV-13: umbral de "tarde", abierto) |
| RF-40 | Ante una cancelación, el agente debe proponer nuevas fechas para reprogramar | Agente (interno, automático tras la cancelación) → Cliente, Trabajador independiente (destinatarios) | UC22 (extiende UC21) | Se avisó una cancelación (RF-17) | El agente ofrece nuevas fechas compatibles | T25, R-T26 | Confirmado |
| RF-41 | Toda cancelación o cambio debe registrarse indicando quién lo solicitó y cuándo | Cliente, Trabajador independiente, Organización de contratistas (sistema, interno) | UC21 | Se avisó una cancelación o cambio (RF-17) | El historial (RF-21) muestra quién solicitó el cambio y cuándo | T25, R-T26 | Confirmado (PV-13: consecuencias por incumplimientos, abierto) |
| RF-18 | El trabajador debe enviar una propuesta escrita con el trabajo a realizar, materiales, costo y fechas | Trabajador independiente, Organización de contratistas | UC23 | Cita "Confirmada" y visita realizada (dependencia decidida en la sección 13.2) | El cliente recibe una propuesta escrita completa | T23, T26, R-T24, R-T27 | Confirmado (PV-11: valor legal del documento, abierto) |
| RF-42 | La propuesta escrita debe ser aceptada por ambas partes dentro de la plataforma antes de iniciar el trabajo | Cliente, Trabajador independiente, Organización de contratistas | UC24 | Propuesta enviada (RF-18) | El trabajo no puede iniciar sin que ambas partes acepten la misma versión | T23, T26, R-T24, R-T27, R-T33 | Confirmado |

### 5.6 Autorización y trazabilidad
| ID | Descripción aprobada | Actor(es) | UC | Precondición | Resultado esperado | Fuente | Estado |
|---|---|---|---|---|---|---|---|
| RF-19 | Ningún cambio de precio o de alcance debe aplicarse hasta que el trabajador lo registre y el cliente lo acepte, rechace o contraproponga, con fecha y hora | Trabajador independiente, Organización de contratistas, Cliente | UC26, UC27 | Existe un acuerdo previamente aceptado (RF-42) | Ningún cambio se ejecuta sin la decisión explícita del cliente | T30, R-T31 | Confirmado. Regla de negocio equivalente: **RD-07** |
| RF-20 | Las acciones que comprometen tiempo, dinero o datos del cliente requieren su autorización explícita | Cliente | UC35 (regla general; instancias específicas: UC19, UC24) | Se va a ejecutar una acción sensible (contactar, confirmar cita, compartir datos, aceptar costo) | La acción no se ejecuta sin la autorización explícita del cliente | T21, R-T20, R-T21 | Confirmado (PV-08: autorización única o por acción, abierto) |
| RF-21 | El sistema debe ofrecer un historial consultable de las acciones del agente y de las autorizaciones del usuario, con fecha y hora, en lenguaje simple | Cliente | UC36 | El cliente tiene al menos una acción o autorización registrada | El cliente puede consultar, en lenguaje simple, qué hizo el agente y qué autorizó | T22, R-T21, R-T23 | Confirmado (PV-15: tiempo de conservación, abierto) |
| RF-53 | El sistema debe mostrar un indicador de texto simple si no hay respuesta dentro de los primeros 2 segundos, igual para la conversación y la búsqueda | Sistema (interno, automático tras 2 s sin respuesta) → Cliente (destinatario) | Comportamiento transversal (UC10, UC16; sin caso de uso propio) | El cliente envió una solicitud al agente o inició una búsqueda | Si pasan 2 segundos sin respuesta, aparece el indicador de "procesando" | T35, R-T36 | Confirmado el comportamiento; el umbral de 2 s es **decisión técnica del analista** |
| RF-54 | El sistema debe restringir la visibilidad de la dirección exacta, las fotos del hogar, los horarios y el teléfono del cliente al trabajador que este autorizó | Cliente (regla aplicada en UC18, UC21) | Regla de acceso (sin caso de uso propio) | Un trabajador no autorizado intenta ver esos datos | El trabajador no autorizado no puede ver esos campos | T33, R-T34 | Confirmado |
| RF-55 | *(ver sección 5.2; RF-55 se repite aquí solo como referencia cruzada y no se duplica su fila)* | | | | | | |
| RF-58 | El sistema debe restringir la visibilidad del domicilio exacto y el teléfono personal del trabajador a los clientes; solo se muestran a un cliente cuando el **propio trabajador** lo autoriza explícitamente | Trabajador independiente (autoriza), Cliente (posible destinatario) | Regla de acceso (sin caso de uso propio) | Existe una relación con un cliente (ej. cita confirmada) sin autorización del trabajador para compartir esos datos | El cliente no ve el domicilio exacto ni el teléfono del trabajador salvo autorización explícita del propio trabajador | T11 | Confirmado el interés (T11); el mecanismo de autorización (la otorga el trabajador, no el cliente) es **decisión técnica del analista**, ajuste obligatorio de Parte 6 |

### 5.7 Seguimiento de avance y costos
| ID | Descripción aprobada | Actor(es) | UC | Precondición | Resultado esperado | Fuente | Estado |
|---|---|---|---|---|---|---|---|
| RF-22 | El trabajador debe poder reportar avance con una foto y un mensaje corto | Trabajador independiente, Organización de contratistas | UC29 | Trabajo iniciado (propuesta aceptada, RF-42) | El reporte de avance queda registrado con foto y mensaje | T29, R-T30 | Confirmado |
| RF-43 | El agente debe generar un resumen de avance a partir del reporte del trabajador | Cliente (agente, interno) | UC30 (incluida por UC29) | El trabajador reportó avance (RF-22) | El cliente recibe un resumen entendible del avance | T29, R-T30 | Confirmado |
| RF-44 | El cliente debe poder confirmar el avance reportado o señalar que no coincide con lo que observa | Cliente | UC31 | Se generó un resumen de avance (RF-43) | Queda registrado si el cliente confirma o señala una diferencia | T29, R-T30 | Confirmado (PV-19: verificación de veracidad, abierto) |
| RF-45 | Si el trabajador no reporta avance al final del día en que se esperaba, el sistema debe enviarle un recordatorio; si sigue sin reportar, debe enviarle un segundo recordatorio | Trabajador independiente, Organización de contratistas (sistema, interno) | UC34 | Terminó el día esperado sin reporte | El trabajador recibe hasta dos recordatorios | T29, R-T30 | Confirmado el comportamiento; disparador y número de recordatorios son **decisión técnica del analista** |
| RF-57 | Si el trabajador no responde después de dos recordatorios consecutivos, el sistema debe notificar al cliente que no ha habido reporte de avance | Sistema (interno, automático tras dos recordatorios sin respuesta del trabajador) → Cliente (destinatario) | UC34 | Dos recordatorios sin respuesta (RF-45) | El cliente es notificado de la falta de reporte | T29 | Propuesta ficticia el comportamiento (T29); "dos recordatorios" es **decisión técnica del analista** |
| RF-23 | El cliente debe poder consultar el costo acordado, lo gastado o avanzado, y los gastos adicionales pendientes de aprobar | Cliente | UC32 | Trabajo en curso | El cliente ve, en una sola vista, el costo acordado, lo avanzado y lo pendiente de aprobar | T28, R-T29 | Confirmado (C-3: frecuencia de actualización, abierta) |
| RF-24 | El sistema debe avisar de inmediato los retrasos y los cambios de costo reportados por el trabajador, sin esperar al resumen que se genera tras el siguiente reporte de avance (RF-43) | Sistema (interno, automático tras el reporte del trabajador; el trabajador origina el dato, no el aviso) → Cliente (destinatario) | UC33 | El trabajador reportó un retraso o un cambio de costo | El cliente recibe el aviso sin esperar al resumen de RF-43 | T31, R-T29, R-T32 | Confirmado. Redacción ajustada en Parte 6 (H-04): resuelve C-3 distinguiendo esta frecuencia de la de RF-23/RF-45 |
| RF-59 | El trabajador debe poder solicitar el cierre del trabajo cuando lo considere terminado | Trabajador independiente, Organización de contratistas | UC47 | Trabajo en curso (RF-42 aceptado) | La solicitud de cierre queda registrada y visible para el cliente | — | Derivado (Parte 6, H-02) |
| RF-60 | El trabajo solo pasa a "concluido" cuando el cliente confirma el cierre solicitado (RF-59); el cliente también puede rechazarlo. Ningún pendiente (ej. un cambio de costo en disputa, RF-19) se da por resuelto automáticamente al cerrar, ni bloquea el cierre automáticamente por sí solo | Cliente | UC48 | Se solicitó el cierre (RF-59) | El trabajo se marca "concluido" solo con la confirmación del cliente; si rechaza, permanece en curso | — | Derivado (Parte 6, H-02). Ajuste obligatorio: no bloquea por cualquier pendiente, no resuelve disputas económicas al cerrar |

### 5.8 Evaluaciones
| ID | Descripción aprobada | Actor(es) | UC | Precondición | Resultado esperado | Fuente | Estado |
|---|---|---|---|---|---|---|---|
| RF-25 | Solo el cliente que contrató por la plataforma puede evaluar al trabajador, y únicamente después de concluido el servicio | Cliente | UC37 | Servicio concluido: cliente confirmó el cierre del trabajo (**RF-60**) | Solo el cliente que contrató puede registrar una evaluación, y solo tras el cierre confirmado | T13, R-T13 | Confirmado. Regla de negocio equivalente: **RD-01**. Precondición precisada en Parte 6 (H-02): antes decía "trabajo terminado" sin definir el evento |
| RF-47 | La evaluación debe incluir una calificación y un comentario | Cliente | UC37 | Servicio concluido (RF-25) | La evaluación registrada tiene calificación y comentario | T13, R-T13 | Confirmada la existencia; escala 1-5 es Propuesta real (R-T13), no confirmada por ambas fuentes |
| RF-48 | El perfil del trabajador debe mostrar el número de evaluaciones recibidas | Cliente (consulta el perfil) | Atributo mostrado en UC37 (sin caso de uso propio) | El trabajador tiene al menos una evaluación | El perfil muestra el número de evaluaciones recibidas | T13, R-T13 | Confirmado (PV-06: cantidad mínima para "evaluado", abierto) |
| RF-26 | El trabajador debe poder responder públicamente a una evaluación negativa | Trabajador independiente, Organización de contratistas | UC38 | Existe una evaluación negativa sobre el trabajador | La respuesta del trabajador queda visible junto a la evaluación | T14, R-T14 | Confirmado |
| RF-49 | El trabajador debe poder solicitar una revisión de una evaluación que considere falsa o injusta | Trabajador independiente, Organización de contratistas | UC39 (extiende UC38) | Existe una evaluación que el trabajador disputa | La solicitud de revisión llega al administrador (RF-28) | T14, T15, R-T14, R-T15 | Confirmado. Regla de negocio relacionada: **RD-08** |

### 5.9 Reportes, moderación y sanciones
| ID | Descripción aprobada | Actor(es) | UC | Precondición | Resultado esperado | Fuente | Estado |
|---|---|---|---|---|---|---|---|
| RF-27 | Cliente y trabajador deben poder reportar información falsa, un perfil sospechoso o un problema durante el trabajo | Cliente, Trabajador independiente, Organización de contratistas | UC40 | Existe algo que reportar | El reporte queda registrado y disponible para el administrador | T15, R-T5, R-T15, R-T38 | Confirmado |
| RF-28 | Un administrador debe poder revisar un reporte solicitando evidencias a ambas partes | Administrador | UC41 | Existe un reporte (RF-27) o una disputa de costo escalada (sección 13.3) | El administrador reúne evidencias de ambas partes antes de decidir; **su decisión media la disputa, pero no autoriza gastos en nombre del cliente** (ver RF-28-AC-2) | T10, T14, T15, R-T10, R-T14, R-T15 | Confirmado (PV-01: atribuciones exactas, abierto) |
| RF-32 | El administrador debe registrar su decisión y el motivo | Administrador (sistema, interno) | UC42 (incluida por UC41) | El administrador tomó una decisión (RF-28) | La decisión y su motivo quedan registrados | T15, R-T15 (implícito) | Derivado |
| RF-50 | El administrador debe explicar su decisión a ambas partes | Administrador | UC43 (incluida por UC41) | Decisión registrada (RF-32) | Ambas partes reciben la explicación de la decisión | T15, R-T15 | Confirmado |
| RF-51 | La parte afectada debe poder solicitar una segunda revisión de la decisión del administrador | Cliente, Trabajador independiente, Organización de contratistas | UC44 (extiende UC41) | Se explicó una decisión (RF-50) y la parte no está de acuerdo | La segunda revisión queda registrada y atendida | T15, R-T15 | Confirmado (PV-01: plazos, abierto) |
| RF-29 | Ante información falsa o vencida, el sistema debe retirar temporalmente la verificación del perfil y avisar al trabajador | Trabajador independiente (sistema, interno; Administrador cuando el disparador es información falsa) | UC45 | Un documento venció (hecho verificable automáticamente), **o** el administrador confirmó que una información es falsa tras revisarla (RF-28; determinar que algo es "falso" es una decisión delicada, no la ejecuta el sistema por sí solo, RD-06) | La marca de verificación se retira y el trabajador es avisado | T12, T15, R-T12, R-T15 | Confirmado |
| RF-52 | Ante quejas acumuladas y validadas por el administrador, el sistema debe emitir una advertencia al trabajador. Si las quejas continúan, el administrador debe revisar el caso (RF-28) y decidir si corresponde una suspensión. El sistema no debe reducir la visibilidad del perfil de forma automática | Trabajador independiente, Administrador | UC46 | Existen quejas acumuladas validadas por el administrador | El trabajador recibe una advertencia; una suspensión solo ocurre tras revisión del administrador | T14, R-T14 | Confirmado el comportamiento general; la resolución exacta (sin reducción automática de visibilidad) es **decisión técnica del analista**, resuelve **C-7**. Umbral numérico: **PV-06**, abierto |
| RF-61 | Un reporte puede clasificarse inicialmente como grave (ej. robo o amenaza) para priorizar su atención: esa clasificación inicial solo prioriza la notificación al administrador, no determina los hechos ni ninguna sanción. La determinación definitiva y cualquier sanción corresponden al administrador (RF-28, RD-06), nunca al agente de IA | Cliente, Trabajador independiente, Organización de contratistas (reportan), Administrador (determina) | UC49 (extiende UC40) | Existe algo que reportar (RF-27) | El administrador es notificado de inmediato y con prioridad si el reporte se clasificó como grave; los hechos y la sanción los determina el administrador | T14, R-T14 | Derivado (Parte 6, H-03). Opera a RD-09. SLA de atención: **PV-21**, abierto, sin cifra inventada |

### 5.10 Cuentas (derivado de análisis)
| ID | Descripción aprobada | Actor(es) | UC | Precondición | Resultado esperado | Fuente | Estado |
|---|---|---|---|---|---|---|---|
| RF-30 | El sistema debe permitir el registro y la autenticación de cliente, trabajador y administrador | Cliente, Trabajador independiente, Organización de contratistas, Administrador | UC01, UC02 | Ninguna (es el punto de entrada) | Cada actor puede registrarse (salvo Administrador, aprovisionado internamente) e iniciar sesión | Deriva de RF-07, RF-21, RF-28 | Derivado |

**Total: 57 RF del MVP catalogados** (todas las filas de 5.1 a 5.10, sin contar la referencia cruzada de RF-55 en 5.6; incluye RF-58 a RF-62, agregados en Parte 6). Verificado por conteo automatizado en la sección 0.4 y en la sección 0.10 (Parte 6).

---

## 6. Requerimientos no funcionales
Los 10 RNF activos, todos con alcance MVP.

| ID | Descripción aprobada | Precondición / aplica a | Resultado esperado | Fuente | Estado |
|---|---|---|---|---|---|
| RNF-01 | La interfaz debe ser sencilla, en español cotidiano y con pocos pasos | Toda la aplicación | Un usuario sin experiencia técnica completa las tareas principales sin ayuda externa | T9, T18, R-T9, R-T35 | Confirmado (criterio de aceptación de usabilidad sin definir) |
| RNF-02 | El sistema debe funcionar desde un celular común, sin instalación complicada, y tolerar conexión lenta o inestable | Toda la aplicación | La aplicación web responsive carga y opera en un celular común con conexión inestable | T9, T34, T35, R-T9, R-T35, R-T36 | Confirmado. Canal decidido: web responsive |
| RNF-03 | Ante una caída del servicio o pérdida de conexión, no deben perderse conversaciones, citas ni acuerdos | Toda la aplicación | Tras una reconexión, el usuario recupera el estado exacto de su conversación, citas y acuerdos | T35, R-T36 | Confirmado |
| RNF-04 | El tiempo de respuesta debe distinguir: (1) búsqueda o consulta sin generación de texto por IA: máx. 2 s; (2) respuesta conversacional simple: máx. 3 s; (3) generación de una respuesta completa con recomendaciones (RF-13): máx. 5 s | Búsquedas, conversación, recomendaciones | Cada tipo de operación responde dentro de su umbral correspondiente. **Medición:** desde que el usuario envía la solicitud (mensaje o acción) hasta que la interfaz muestra el contenido de la respuesta, **en condiciones de red normales**. No aplica como garantía bajo la conexión lenta o inestable que RNF-02 exige tolerar sin perder datos: RNF-02 obliga a seguir funcionando en esas condiciones, no a mantener estos mismos tiempos | T35, R-T36 | Confirmado el comportamiento; los 3 valores, sus límites y el criterio de medición son **decisión técnica del analista** |
| RNF-05 | El servicio debe tener una disponibilidad objetivo del 99% mensual, con mantenimientos programados fuera de horario pico | Todo el servicio | El servicio está disponible el 99% del tiempo en un mes calendario | T35, R-T36 | Confirmado el comportamiento; el valor es **decisión técnica del analista** |
| RNF-07 | El agente no debe usar las fotos ni las conversaciones del usuario para fines no consentidos | Todo dato capturado por el agente | Ningún dato se usa fuera del propósito informado al usuario | T33, R-T34 | Confirmado |
| RNF-08 | Los datos deben protegerse contra accesos indebidos | Todos los datos almacenados | Ningún actor no autorizado accede a datos que no le corresponden | T33, R-T34 | Confirmado (aviso de filtración: solo propuesta ficticia) |
| RNF-10 | El orden de las recomendaciones no debe depender de pagos ni de criterios no comunicados al usuario | UC16 (recomendación) | El orden mostrado corresponde a criterios explicados al cliente (zona, evaluación, experiencia, verificación) | T22 | Propuesta ficticia; alcance MVP es decisión del analista |
| RNF-11 | Los acuerdos, autorizaciones e historial no deben poder alterarse sin dejar rastro | RF-18, RF-19, RF-21, RF-42 | Cualquier modificación posterior a un acuerdo o autorización queda registrada con su propio rastro. Esto es una regla de **integridad** (no se puede reescribir sin dejar evidencia), distinta de **cuánto tiempo** se conservan esos registros o de si una solicitud de eliminación de datos personales (RF-55) los afecta: ninguna de esas dos preguntas la resuelve RNF-11, y ninguna fuente propuso un plazo, por lo que no se asume ninguno (PV-15 permanece abierto) | Derivado | Derivado |
| RNF-12 | El sistema debe restringir el acceso a funciones y datos según el rol del usuario | Todos los roles | Un usuario no puede ejecutar funciones ni ver datos fuera de las de su rol | Derivado | Derivado |

---

## 7. Reglas y requerimientos de dominio
Las 11 RD, con su referencia cruzada al RF que las opera.

| ID | Regla | Aplica a (RF) | Fuente | Estado |
|---|---|---|---|---|
| RD-01 | Solo evalúa quien contrató al trabajador por la plataforma, tras terminar el servicio | RF-25 | T13, R-T13 | Confirmado |
| RD-02 | Un perfil solo es "verificado" tras revisión de la plataforma | RF-09, RF-35, **RF-62** | T11, T12, R-T11, R-T12 | Confirmado |
| RD-03 | No se exigen certificados a todos los oficios; la verificación combina identificación oficial y evidencia de experiencia | RF-09, RF-35 | T12, R-T12 | Confirmado |
| RD-04 | "Cercano" significa que el trabajador atiende la colonia del cliente o zonas vecinas | RF-08, RF-11 | T16, R-T16 | Confirmado (PV-05: definición operativa exacta, abierta) |
| RD-05 | "Disponible" significa tener espacio en la agenda en las fechas solicitadas | RF-08, RF-11 | T16, R-T16 | Confirmado |
| RD-06 | La IA no decide medidas delicadas (por ejemplo, suspender a un trabajador); la última palabra la tiene una persona | RF-20, RF-28, RF-32 | T10, T15, R-T10 | Confirmado |
| RD-07 | Ningún costo adicional ni cambio de alcance es válido sin autorización previa del cliente. **Sin excepción para la mediación administrativa: el administrador puede resolver una disputa, pero no autorizar el gasto en nombre del cliente** (ver RF-28-AC-2) | **RF-19** (par flujo/regla, referencia cruzada explícita) | T30, R-T31, R-T32 | Confirmado |
| RD-08 | Una evaluación negativa real no se elimina solo porque el trabajador lo pida; la revisión requiere evidencias de ambas partes | RF-26, RF-28, RF-49 | T14, R-T14 | Confirmado |
| RD-09 | Las faltas graves (robo, amenaza) se atienden de inmediato y por separado de las calificaciones | RF-27, RF-28, **RF-61** | T14, R-T14 | Confirmado; ruta prioritaria agregada en Parte 6 (H-03). SLA de "inmediato": **PV-21**, sin definir |
| RD-10 | Una cancelación por emergencia no se trata igual que una ausencia sin aviso | RF-17, RF-41 | T25, R-T26 | Confirmado (PV-13: criterios para distinguirlas, abiertos) |
| RD-11 | La plataforma debe cumplir la normativa de protección de datos y revisar los requisitos de oficios de riesgo (electricidad, gas) | **RF-58** (parcial); resto sin RF directo | T12, T34, R-T35 | Confirmado el interés; normas concretas sin identificar (PV-15). Cobertura corregida en Parte 6 (H-09): no se afirma cumplimiento legal, solo que RF-58 opera parcialmente esta regla |

---

## Estados y transiciones de los flujos clave
Agregado en Parte 6 (hallazgo H-08), reproducido de `requerimientos_clasificados.md` §13.1–13.4 para que el SRS sea autosuficiente. Las reglas que resuelven preguntas antes abiertas (plazos, qué pasa ante un rechazo, cuándo escala al administrador) son **decisiones técnicas del analista**, sin respaldo textual en ninguna entrevista salvo donde se indique lo contrario.

### E.1 Confirmación de citas (RF-16, RF-38, RF-39, RF-17, RF-40, RF-41)
**Actores:** Cliente, Trabajador, Agente (IA, interno), Sistema (notificaciones y registro).
**Estados:** Propuesta → Pendiente del trabajador → Confirmada → Cancelada → (vuelve a Propuesta) | Expirada → (vuelve a Propuesta).

| De | A | Disparador | Regla |
|---|---|---|---|
| (inicio) | Propuesta | El agente genera horarios según disponibilidad de ambas partes (RF-16) | — |
| Propuesta | Pendiente del trabajador | El cliente elige uno de los horarios propuestos | — |
| Pendiente del trabajador | Confirmada | El trabajador acepta el horario elegido (RF-38) | — |
| Pendiente del trabajador | Propuesta | El trabajador rechaza el horario elegido | El agente genera nuevas opciones automáticamente, sin reiniciar la búsqueda de trabajador |
| Propuesta / Pendiente del trabajador | Expirada → Propuesta | Nadie responde en 24 horas | Se genera una nueva propuesta y se notifica a ambas partes |
| Confirmada | Cancelada | Cualquier parte avisa una cancelación (RF-17) | Cancelación dentro de las 24 horas previas se registra como "tardía" (RD-10) |
| Cancelada | Propuesta | El agente propone nuevas fechas (RF-40) | — |

**Precondiciones:** trabajador ya elegido (RF-13) con disponibilidad registrada (RF-08); "Confirmada" exige ambas aceptaciones, en el orden cliente → trabajador.

### E.2 Aceptación de propuestas escritas (RF-18, RF-42)
**Actores:** Trabajador (autor), Cliente (revisor).
**Estados:** Enviada → En revisión → {Aceptada | Cambios solicitados | No aceptada}. "Cambios solicitados" vuelve a "Enviada". "Aceptada" habilita el inicio del trabajo y el flujo E.3.

| De | A | Disparador | Regla |
|---|---|---|---|
| (inicio) | Enviada | El trabajador envía trabajo, materiales, costo y fechas tras la visita (RF-18) | Requiere una cita "Confirmada" y ya realizada (E.1) |
| Enviada | En revisión | El cliente la recibe | — |
| En revisión | Aceptada | Ambas partes aceptan la misma versión (RF-42) | La negociación (pedir cambios) sí se admite en el MVP |
| En revisión | Cambios solicitados | El cliente pide un ajuste | — |
| Cambios solicitados | Enviada | El trabajador envía una versión revisada | El trabajador debe reconfirmar; la aceptación final exige a ambas partes sobre la misma versión |
| En revisión | No aceptada | El cliente rechaza sin ajuste, o pasan 72 horas sin respuesta | El acuerdo con ese trabajador se cierra sin efecto; el cliente puede volver a RF-13 |

**Precondiciones:** cita "Confirmada" y visita realizada.

### E.3 Aprobación de cambios de costo y alcance (RF-19, RD-07)
**Actores:** Trabajador (reporta), Cliente (decide), Administrador (solo si hay disputa, RF-28).
**Estados:** Reportado → Pendiente de decisión → {Aceptado | No aceptado | Contrapropuesta | Escalado a revisión administrativa}.

| De | A | Disparador | Regla |
|---|---|---|---|
| (inicio) | Reportado | El trabajador registra el cambio antes de ejecutarlo (RD-07) | Pueden coexistir varios cambios; cada uno se resuelve de forma independiente |
| Reportado | Pendiente de decisión | El agente lo presenta comparado con lo acordado | El cliente tiene 24 horas para responder; mientras tanto, la parte afectada del trabajo permanece en pausa |
| Pendiente de decisión | Aceptado | El cliente aprueba | — |
| Pendiente de decisión | Contrapropuesta | El cliente pide un ajuste | Vuelve a "Pendiente de decisión" con los nuevos términos |
| Pendiente de decisión | No aceptado | El cliente rechaza | La parte afectada del trabajo no se ejecuta |
| No aceptado / Pendiente de decisión | Escalado a revisión administrativa | El trabajador insiste en que es necesario, o el cliente disputa su origen | El administrador decide en línea con RD-06 (RF-28-AC-2: **no autoriza el gasto por sí solo**) |

**Precondiciones:** acuerdo previo aceptado (RF-42); el trabajador no ejecuta el cambio antes de la decisión del cliente.

### E.4 Cierre del trabajo (RF-59, RF-60) — agregado en Parte 6, H-02
**Actores:** Trabajador (solicita), Cliente (confirma o rechaza).
**Estados:** En curso → Cierre solicitado → {Concluido | En curso (si se rechaza)}.

| De | A | Disparador | Regla |
|---|---|---|---|
| (inicio) | En curso | Propuesta aceptada (E.2) | — |
| En curso | Cierre solicitado | El trabajador solicita el cierre (RF-59) | — |
| Cierre solicitado | Concluido | El cliente confirma (RF-60) | **Ajuste obligatorio del analista:** ningún pendiente (ej. un cambio de costo aún en disputa, E.3) se resuelve automáticamente al cerrar, ni bloquea automáticamente el cierre por sí solo |
| Cierre solicitado | En curso | El cliente rechaza el cierre (RF-60) | El trabajo permanece en curso |

**Precondiciones:** propuesta aceptada (E.2). "Concluido" habilita la precondición de RF-25 (evaluación).

---

## 8. Criterios de aceptación Given-When-Then
Organizados por capacidad, en el mismo orden que la sección 5. Cada bloque cita el ID del requerimiento en el formato `<ID>-AC-n` (por ejemplo, `RF-06-AC-1`). Los siete puntos que el analista pidió revisar con especial cuidado (doble aceptación de citas, aceptación de propuestas, autorización previa de costos, aprobación del cliente vs. mediación administrativa, condiciones para evaluar, protección de datos y control de acceso, rendimiento y disponibilidad) tienen más de un escenario, incluyendo casos de rechazo o excepción. **Total: 132 escenarios** (121 de la corrección anterior + 10 agregados para RF-58 a RF-62, y RF-08-AC-3, todos en la Parte 6 de validación del SRS — ver sección 0.10 y `revision_SRS.md`). Los identificadores usan el formato `<ID>-AC-n`.

### 8.1 Conversación con el agente de IA

**RF-01-AC-1**
- Given un cliente con sesión iniciada y sin un proyecto en curso
- When el cliente escribe una descripción inicial de su proyecto
- Then el agente responde con una pregunta sencilla a la vez, sin pedir todos los datos en un solo mensaje

**RF-01-AC-2**
- Given una conversación ya avanzada, con varias preguntas ya respondidas
- When el cliente responde la pregunta más reciente
- Then el agente hace únicamente la siguiente pregunta, no varias a la vez (el comportamiento de "una pregunta a la vez" se mantiene durante toda la conversación, no solo al inicio)

**RF-02-AC-1**
- Given una conversación en curso con el agente
- When el cliente adjunta una foto
- Then la foto queda asociada al proyecto que se está describiendo

**RF-02-AC-2 (opcionalidad, en línea con RF-04)**
- Given una conversación en curso
- When el cliente no adjunta ninguna foto
- Then la conversación continúa con normalidad, porque adjuntar fotos es opcional

**RF-03-AC-1**
- Given que el agente ya reunió los datos mínimos del proyecto (RF-04)
- When el agente termina de recopilar la información
- Then presenta un resumen del proyecto y espera la confirmación o corrección del cliente antes de continuar a la búsqueda

**RF-03-AC-2 (corrección del resumen)**
- Given un resumen del proyecto ya presentado
- When el cliente corrige un dato del resumen en vez de confirmarlo
- Then el agente actualiza el resumen con la corrección y vuelve a esperar la confirmación antes de continuar

**RF-04-AC-1**
- Given una conversación en curso
- When el cliente intenta pasar a la búsqueda de trabajadores
- Then el sistema exige que ya se hayan capturado tipo de trabajo, zona, fechas y descripción básica antes de continuar

**RF-04-AC-2 (datos opcionales no bloquean el avance)**
- Given una conversación con los 4 datos mínimos ya capturados
- When el cliente no proporciona fotos, medidas ni presupuesto
- Then el sistema permite continuar a la búsqueda sin exigir esos datos opcionales

**RF-05-AC-1**
- Given que el cliente dio una respuesta ambigua o incompleta
- When el agente no logra interpretarla con suficiente certeza
- Then el agente repregunta o pide una foto, en vez de asumir un dato no confirmado

**RF-05-AC-2 (pedir una foto en vez de repreguntar por texto)**
- Given que el cliente describe un problema difícil de entender solo con texto (por ejemplo, el estado de un espacio)
- When el agente no logra interpretarlo con suficiente certeza
- Then el agente pide una foto en vez de asumir el dato o de seguir repreguntando por texto

**RF-06-AC-1 (feliz)**
- Given que el agente repreguntó una vez sin éxito (RF-05)
- When el cliente corrige o rechaza la interpretación del agente por segunda vez consecutiva
- Then el sistema ofrece contactar a una persona de soporte

**RF-06-AC-2 (sin persona disponible; decisión técnica del analista)**
- Given que se ofreció el contacto con soporte humano (RF-06-AC-1)
- When no hay una persona disponible en ese momento
- Then el sistema muestra el tiempo estimado de respuesta o deja registrada la solicitud para contacto posterior

**RF-56-AC-1**
- Given que el cliente inicia una conversación nueva con el agente
- When el agente envía su primer mensaje
- Then el mensaje incluye una identificación explícita de que es un asistente automático, no una persona

**RF-56-AC-2 (persistencia del aviso durante la conversación)**
- Given una conversación con el agente ya avanzada
- When el cliente revisa la conversación en cualquier punto posterior al primer mensaje
- Then puede seguir viendo que está interactuando con un asistente automático, no solo en el primer mensaje

### 8.2 Registro y verificación de perfiles

**RF-07-AC-1**
- Given un trabajador con cuenta creada
- When completa nombre, foto, oficio, años de experiencia y zona
- Then el perfil queda disponible para aparecer en búsquedas de clientes

**RF-07-AC-2 (perfil incompleto no aparece en búsquedas)**
- Given un trabajador que no completó todos los datos mínimos del perfil (nombre, foto, oficio, experiencia, zona)
- When intenta que su perfil sea visible
- Then el perfil no aparece en búsquedas de clientes hasta que los datos mínimos estén completos

**RF-34-AC-1**
- Given un perfil de trabajador ya creado
- When el trabajador carga una o más fotos de trabajos anteriores
- Then las fotos quedan visibles en la sección de portafolio del perfil

**RF-34-AC-2 (opcionalidad del portafolio)**
- Given un perfil de trabajador válido (RF-07) sin fotos de portafolio cargadas
- When el trabajador no carga ninguna foto
- Then el perfil se mantiene válido y visible en búsquedas, sin necesidad de portafolio

**RF-08-AC-1**
- Given un perfil de trabajador con calendario configurado
- When el trabajador marca una fecha como no disponible
- Then esa fecha deja de ofrecerse en las propuestas de horario (RF-16)

**RF-08-AC-2 (volver a marcar una fecha como disponible)**
- Given una fecha previamente marcada como no disponible
- When el trabajador la vuelve a marcar como disponible
- Then esa fecha vuelve a ofrecerse en las propuestas de horario (RF-16)

**RF-08-AC-3 (disponibilidad general de una organización; agregado en Parte 6, H-05)**
- Given una organización de contratistas con perfil creado (RF-15)
- When marca su disponibilidad general (por ejemplo, "aceptando proyectos" o "sin capacidad por ahora")
- Then esa disponibilidad general se refleja en las propuestas de horario (RF-16), sin gestionar la agenda de empleados individuales (fuera de alcance; ver RF-37, Posterior)

**RF-09-AC-1**
- Given que un trabajador subió una identificación oficial
- When el administrador revisa y aprueba el documento
- Then el perfil muestra la marca "identidad verificada"

**RF-09-AC-2 (rechazo)**
- Given que un trabajador subió una identificación oficial
- When el administrador la revisa y la rechaza por no ser válida
- Then el perfil no muestra la marca de identidad verificada y el trabajador es notificado del motivo

**RF-35-AC-1**
- Given que un trabajador presentó referencias o certificados
- When el administrador valida esa evidencia
- Then el perfil muestra la marca "experiencia verificada", de forma independiente a la verificación de identidad (RF-09)

**RF-35-AC-2 (rechazo de la evidencia de experiencia)**
- Given que un trabajador presentó referencias o certificados como evidencia de experiencia
- When el administrador la revisa y no la considera suficiente
- Then el perfil no muestra la marca "experiencia verificada" y el trabajador es notificado del motivo

**RF-10-AC-1**
- Given un perfil con datos declarados por el trabajador y datos verificados por la plataforma
- When un cliente consulta ese perfil
- Then puede distinguir visualmente cuáles datos están verificados y cuáles son solo declarados

**RF-10-AC-2 (perfil sin ninguna verificación aprobada todavía)**
- Given un perfil recién creado, sin ninguna verificación de identidad ni de experiencia aprobada
- When un cliente lo consulta
- Then todos los datos se muestran como declarados por el trabajador, sin ninguna marca de verificado

**RF-55-AC-1 (eliminación de datos personales)**
- Given un usuario con datos personales y fotos cargados en la plataforma
- When solicita la eliminación de sus datos
- Then sus datos personales identificables y sus fotos dejan de estar accesibles en el sistema

**RF-55-AC-2 (no elimina el historial ni los acuerdos ya registrados; distinción con RNF-11)**
- Given un usuario que solicitó la eliminación de sus datos (RF-55-AC-1) y tiene acuerdos o historial de proyectos ya concluidos
- When se procesa la solicitud de eliminación
- Then las entradas de historial (RF-21) y los acuerdos ya registrados (RF-18/RF-42) no se eliminan ni se alteran por esta solicitud, porque RNF-11 exige que no puedan modificarse sin dejar rastro. El tiempo que esos registros deben conservarse no está definido por ninguna fuente y no se asume ningún plazo (PV-15 permanece abierto)

### 8.3 Búsqueda y recomendación

**RF-11-AC-1**
- Given un resumen de proyecto confirmado (RF-03)
- When el cliente ejecuta la búsqueda
- Then los resultados combinan oficio, zona, disponibilidad y evaluación en una sola consulta

**RF-11-AC-2 (búsqueda sin filtros adicionales de RF-12)**
- Given resultados de búsqueda mostrados usando solo los 4 criterios base
- When el cliente no aplica ningún filtro adicional de RF-12
- Then los resultados se basan únicamente en oficio, zona, disponibilidad y evaluación

**RF-12-AC-1**
- Given resultados de búsqueda ya mostrados (RF-11)
- When el cliente activa el filtro de identidad verificada o de experiencia similar
- Then los resultados se acotan según el filtro elegido

**RF-12-AC-2 (desactivar un filtro aplicado)**
- Given resultados de búsqueda con un filtro adicional ya aplicado (RF-12)
- When el cliente desactiva ese filtro
- Then los resultados vuelven a ampliarse sin ese filtro

**RF-13-AC-1 (suficientes candidatos)**
- Given una búsqueda con 4 o más candidatos elegibles
- When el agente arma la recomendación
- Then muestra entre 3 y 4 opciones, cada una con una explicación breve de por qué se sugiere, y el cliente elige (el agente no asigna)

**RF-13-AC-2 (menos del mínimo; decisión técnica del analista)**
- Given una búsqueda con menos de 3 candidatos elegibles
- When el agente arma la recomendación
- Then muestra los candidatos que existan (mínimo 1) e indica explícitamente que hay menos opciones de las habituales

**RF-14-AC-1**
- Given una búsqueda sin ningún candidato disponible
- When el agente presenta el resultado
- Then informa la falta de disponibilidad con claridad y ofrece ampliar la zona o cambiar las fechas

**RF-14-AC-2 (el cliente amplía la zona ofrecida)**
- Given que el agente ofreció ampliar la zona de búsqueda (RF-14)
- When el cliente acepta ampliar la zona
- Then el sistema repite la búsqueda considerando la zona ampliada

### 8.4 Organizaciones de contratistas

**RF-15-AC-1**
- Given una organización de contratistas con cuenta creada
- When completa su perfil básico
- Then el perfil de la organización queda disponible para aparecer en búsquedas de clientes

**RF-15-AC-2 (perfil de organización incompleto)**
- Given una organización de contratistas que no completó su perfil básico
- When intenta que su perfil sea visible
- Then el perfil no aparece en búsquedas de clientes hasta que el perfil básico esté completo

**RF-62-AC-1 (verificación de identidad de la organización; agregado en Parte 6, H-06)**
- Given que una organización presentó documentos de identidad (constitución o representante legal)
- When el administrador los revisa y aprueba
- Then el perfil de la organización muestra la marca "organización verificada"

**RF-62-AC-2 (rechazo de la verificación de la organización)**
- Given que una organización presentó esos documentos
- When el administrador los revisa y no los considera suficientes
- Then el perfil no muestra la marca de verificada y la organización es notificada del motivo

### 8.5 Citas y coordinación (revisión especial: doble aceptación de citas)

**RF-16-AC-1**
- Given un trabajador elegido de la lista recomendada (RF-13)
- When el cliente solicita coordinar una visita
- Then el agente propone horarios ya compatibles con la disponibilidad de ambas partes

**RF-16-AC-2 (disponibilidad actualizada tras la primera propuesta)**
- Given que el trabajador actualiza su disponibilidad (RF-08) después de que el agente propuso horarios
- When el cliente aún no ha elegido un horario
- Then el agente vuelve a proponer horarios que reflejen la disponibilidad actualizada

**RF-38-AC-1 (aceptación en orden cliente → trabajador)**
- Given que el agente propuso horarios (RF-16)
- When el cliente elige un horario y, después, el trabajador lo acepta
- Then la cita pasa a estado "Confirmada"

**RF-38-AC-2 (el trabajador rechaza; decisión técnica del analista, sección 13.1)**
- Given que el cliente eligió un horario
- When el trabajador rechaza ese horario
- Then la cita no se confirma; el agente genera nuevas opciones automáticamente, sin reiniciar la búsqueda de trabajador

**RF-38-AC-3 (expiración: informa y ofrece alternativas, sin comprometer un nuevo horario automáticamente)**
- Given una propuesta de horario pendiente de respuesta
- When pasan 24 horas sin que el cliente o el trabajador respondan
- Then la propuesta expira; el sistema informa la expiración a ambas partes y ofrece alternativas de horario compatibles con ambas agendas, pero **no confirma ni compromete un nuevo horario de forma automática** — el cliente debe elegir de nuevo (regresa al estado "Propuesta" de la sección 13.1, no a "Confirmada")

**RF-39-AC-1**
- Given una cita recién confirmada (RF-38)
- When el sistema procesa la confirmación
- Then ambas partes reciben la notificación con fecha, hora y lugar

**RF-39-AC-2 (trabajador perteneciente a una organización de contratistas)**
- Given una cita confirmada donde el trabajador pertenece a una organización de contratistas
- When se genera la notificación
- Then tanto el cliente como la organización de contratistas reciben la notificación con fecha, hora y lugar

**RF-17-AC-1**
- Given una cita propuesta o confirmada
- When cualquiera de las partes avisa una cancelación, un cambio de fecha o un retraso
- Then la otra parte recibe la notificación correspondiente

**RF-17-AC-2 (cancelación tardía; decisión técnica del analista, sección 13.1)**
- Given una cita confirmada
- When se cancela dentro de las 24 horas previas a la fecha programada
- Then la cancelación se registra como "tardía" (conecta con RD-10)

**RF-40-AC-1**
- Given que se avisó una cancelación (RF-17)
- When el sistema procesa el aviso
- Then el agente propone nuevas fechas para reprogramar (relación `<<extend>>`: no toda cancelación llega a este paso si, por ejemplo, es solo un aviso de retraso sin cancelar)

**RF-40-AC-2 (ninguna fecha propuesta es compatible)**
- Given que el agente propuso nuevas fechas tras una cancelación (RF-40)
- When ninguna de las fechas propuestas resulta compatible con ambas partes
- Then el cliente puede iniciar una nueva coordinación de horario (regresa a RF-16)

**RF-41-AC-1**
- Given una cancelación o cambio avisado (RF-17)
- When el sistema lo registra
- Then el historial (RF-21) muestra quién lo solicitó y cuándo

**RF-41-AC-2 (varias cancelaciones sobre la misma cita)**
- Given varias cancelaciones o cambios ocurridos sobre la misma cita
- When se consulta el historial
- Then cada cancelación o cambio queda registrado por separado, con su propio solicitante y fecha

### 8.6 Propuestas y aceptación (revisión especial: aceptación de propuestas escritas)

**RF-18-AC-1**
- Given una cita confirmada y la visita ya realizada
- When el trabajador redacta la propuesta
- Then el cliente recibe el trabajo a realizar, materiales, costo y fechas por escrito dentro de la plataforma

**RF-18-AC-2 (no se puede enviar la propuesta sin la visita realizada)**
- Given una cita "Confirmada" cuya visita aún no se ha realizado
- When el trabajador intenta enviar la propuesta escrita
- Then el sistema no permite enviarla hasta que la visita se haya registrado como realizada

**RF-42-AC-1 (aceptación directa)**
- Given una propuesta enviada (RF-18)
- When el cliente la acepta sin pedir cambios
- Then el acuerdo queda aceptado por ambas partes y el trabajo puede iniciar

**RF-42-AC-2 (negociación; decisión técnica del analista, sección 13.2, adopta la postura del PO ficticio T23)**
- Given una propuesta enviada
- When el cliente pide un ajuste en vez de aceptar directamente
- Then el trabajador debe enviar una versión revisada, y la aceptación final requiere que ambas partes acepten esa misma versión ajustada (no la original)

**RF-42-AC-3 (rechazo o expiración; decisión técnica del analista)**
- Given una propuesta enviada
- When el cliente la rechaza sin pedir cambios, o pasan 72 horas sin respuesta
- Then el acuerdo con ese trabajador para ese proyecto se cierra sin efecto, y el cliente puede volver a la lista de recomendaciones (RF-13)

### 8.7 Autorización y trazabilidad (revisión especial: autorización previa de costos, y protección de datos/control de acceso)

**RF-19-AC-1 / RD-07 (autorización previa; no hay ejecución sin aprobación)**
- Given un acuerdo previamente aceptado (RF-42)
- When el trabajador identifica un cambio de precio o de alcance
- Then debe registrarlo antes de ejecutarlo, y ese cambio no se aplica hasta que el cliente lo acepte, lo rechace o lo contraproponga

**RF-19-AC-2 (rechazo de un cambio que no bloquea el resto del trabajo)**
- Given un cambio de costo o alcance reportado y pendiente de decisión, que no es necesario para continuar el resto del trabajo
- When el cliente lo rechaza
- Then ese cambio no se ejecuta; el resto del trabajo continúa sin él

**RF-19-AC-3 (rechazo de un cambio que sí bloquea el trabajo afectado; decisión técnica del analista, sección 13.3)**
- Given un cambio de costo o alcance reportado y pendiente de decisión, que el trabajador considera necesario para continuar esa parte del trabajo
- When el cliente lo rechaza
- Then el cambio no se ejecuta y la parte del trabajo afectada **no se reanuda automáticamente**: queda pendiente de un nuevo acuerdo entre las partes o, si hay desacuerdo sobre su necesidad u origen, se escala a revisión administrativa (RF-28; ver RF-28-AC-2). El sistema no decide por sí solo cuál de las dos vías aplica

**RF-20-AC-1 (autorización explícita de una acción sensible)**
- Given que el agente necesita ejecutar una acción sensible (contactar a un trabajador, confirmar/cancelar una cita, compartir dirección o presupuesto, aceptar un cambio de costo)
- When el agente presenta la acción al cliente
- Then la acción no se ejecuta hasta que el cliente la autoriza explícitamente

**RF-20-AC-2 (el cliente rechaza la autorización)**
- Given que el agente presentó una acción sensible al cliente para su autorización
- When el cliente la rechaza
- Then la acción no se ejecuta y el agente informa al cliente que no se realizó

**RF-21-AC-1**
- Given que el agente ejecutó al menos una acción o el cliente otorgó al menos una autorización
- When el cliente consulta el historial
- Then ve, en lenguaje simple y con fecha y hora, qué hizo el agente y qué autorizó

**RF-21-AC-2 (historial vacío)**
- Given un cliente que aún no tiene ninguna acción del agente ni autorización registrada
- When consulta el historial
- Then ve un historial vacío, sin errores

**RF-53-AC-1 (rendimiento; decisión técnica del analista)**
- Given que el cliente envió un mensaje al agente o inició una búsqueda
- When pasan 2 segundos sin una respuesta completa
- Then aparece un indicador de texto simple indicando que se está procesando

**RF-53-AC-2 (respuesta dentro del umbral, sin mostrar el indicador)**
- Given que el agente responde dentro de los primeros 2 segundos
- When el cliente envía una solicitud
- Then el indicador de "procesando" no llega a mostrarse

**RF-54-AC-1 (protección de datos y control de acceso)**
- Given un trabajador que el cliente no ha autorizado a ver su dirección exacta, fotos del hogar, horarios o teléfono
- When ese trabajador intenta acceder a esos datos
- Then el sistema le niega la visibilidad de esos campos

**RF-54-AC-2 (autorización otorgada)**
- Given que el cliente autorizó a un trabajador específico (por ejemplo, tras confirmar una cita)
- When ese trabajador consulta esos mismos datos
- Then el sistema le permite verlos, y solo a él

**RF-58-AC-1 (sin autorización del trabajador; agregado en Parte 6, H-01 — el consentimiento es del trabajador, no del cliente)**
- Given un cliente con una cita confirmada con un trabajador que no ha autorizado compartir su domicilio exacto ni su teléfono personal
- When el cliente intenta verlos
- Then el sistema no los muestra

**RF-58-AC-2 (autorización otorgada por el propio trabajador)**
- Given que el trabajador autorizó explícitamente compartir su domicilio o teléfono con un cliente específico
- When ese cliente los consulta
- Then el sistema se los muestra, y solo a ese cliente autorizado

### 8.8 Seguimiento de avances y costos

**RF-22-AC-1**
- Given un trabajo en curso (propuesta aceptada, RF-42)
- When el trabajador reporta avance
- Then el reporte queda registrado con una foto y un mensaje corto

**RF-22-AC-2 (reporte incompleto no se acepta)**
- Given un trabajo en curso
- When el trabajador intenta reportar avance sin adjuntar una foto o sin mensaje
- Then el sistema no acepta el reporte hasta que incluya ambos elementos

**RF-43-AC-1 (el resumen se genera por evento, no en un calendario periódico; resuelve C-3, H-04)**
- Given un reporte de avance recién registrado (RF-22)
- When el agente lo procesa
- Then genera un resumen entendible para el cliente, disparado por ese reporte (no por un calendario fijo separado)

**RF-43-AC-2 (el resumen refleja el reporte más reciente)**
- Given varios reportes de avance consecutivos del trabajador
- When el agente genera el resumen
- Then el resumen refleja el reporte más reciente, no solo el primero

**RF-44-AC-1**
- Given un resumen de avance generado (RF-43)
- When el cliente lo revisa
- Then puede confirmarlo o señalar que no coincide con lo que observa

**RF-44-AC-2 (el cliente no responde)**
- Given un resumen de avance generado
- When el cliente no confirma ni señala una diferencia
- Then el resumen permanece disponible para su revisión posterior, sin bloquear el resto del sistema

**RF-45-AC-1 (frecuencia del reporte del trabajador —diaria—, distinta de la consulta del cliente RF-23 y del resumen RF-43; resuelve C-3, H-04)**
- Given que terminó el día en que se esperaba un reporte y no llegó
- When el sistema detecta la ausencia
- Then envía un recordatorio al trabajador; si sigue sin reportar, envía un segundo recordatorio

**RF-45-AC-2 (el trabajador responde tras el primer recordatorio)**
- Given que se envió el primer recordatorio (RF-45) por falta de reporte
- When el trabajador responde antes de que se cumpla el plazo del segundo recordatorio
- Then el sistema no envía el segundo recordatorio

**RF-57-AC-1 (tiene respaldo textual en T29; el número de recordatorios es decisión del analista)**
- Given que el trabajador no respondió después de dos recordatorios consecutivos (RF-45)
- When se agota el segundo recordatorio sin respuesta
- Then el sistema notifica al cliente que no ha habido reporte de avance

**RF-57-AC-2 (el trabajador responde a tiempo; no se notifica al cliente)**
- Given que el trabajador respondió después del primer recordatorio, sin llegar al segundo (RF-45-AC-2)
- When el sistema detecta esa respuesta
- Then no notifica al cliente sobre falta de reporte

**RF-23-AC-1 (consulta bajo demanda del cliente, sin frecuencia fija; distinta de la cadencia de reporte de RF-45; resuelve C-3, H-04)**
- Given un trabajo en curso
- When el cliente consulta costos y avance, en cualquier momento
- Then ve, en una sola vista, el costo acordado, lo gastado o avanzado, y los gastos adicionales pendientes de aprobar

**RF-23-AC-2 (sin gastos adicionales pendientes)**
- Given un trabajo recién iniciado, sin gastos adicionales reportados
- When el cliente consulta costos y avance
- Then ve el costo acordado sin ningún gasto adicional pendiente de aprobar

**RF-24-AC-1**
- Given que el trabajador reportó un retraso o un cambio de costo
- When el sistema procesa el reporte
- Then el cliente recibe el aviso de inmediato, sin esperar a un resumen periódico

**RF-24-AC-2 (retraso y cambio de costo en el mismo aviso)**
- Given que el trabajador reporta, en un mismo aviso, un retraso y un cambio de costo
- When el sistema lo procesa
- Then el cliente recibe ambos avisos de inmediato, sin esperar a que se resuelvan por separado

**RF-59-AC-1 (solicitud de cierre; agregado en Parte 6, H-02)**
- Given un trabajo en curso con una propuesta aceptada (RF-42)
- When el trabajador solicita el cierre
- Then la solicitud queda registrada y visible para el cliente

**RF-59-AC-2 (solicitud sin reportes de avance previos)**
- Given que el trabajador solicita el cierre sin haber enviado ningún reporte de avance (RF-22)
- When el sistema procesa la solicitud
- Then la solicitud de cierre igual se registra y queda pendiente de la decisión del cliente (RF-60); RF-59 no valida por sí sola si el cierre procede

**RF-60-AC-1 (el cliente confirma el cierre; los pendientes no se resuelven automáticamente — ajuste obligatorio, H-02)**
- Given que el trabajador solicitó el cierre (RF-59)
- When el cliente confirma el cierre
- Then el trabajo se marca como concluido; si existía un cambio de costo aún en disputa (RF-19) u otro pendiente, ese pendiente continúa su propio flujo, sin darse por resuelto automáticamente por el cierre

**RF-60-AC-2 (el cliente rechaza el cierre)**
- Given que el trabajador solicitó el cierre
- When el cliente lo rechaza
- Then el trabajo permanece en curso, sin marcarse concluido

### 8.9 Evaluaciones (revisión especial: condiciones para evaluar trabajadores)

**RF-25-AC-1 / RD-01 (quién y cuándo puede evaluar)**
- Given un servicio concluido, contratado a través de la plataforma
- When el cliente que contrató intenta registrar una evaluación
- Then el sistema la acepta

**RF-25-AC-2 (rechazo: no contrató por la plataforma o el servicio no concluyó)**
- Given un servicio no concluido, o un usuario que no contrató ese trabajo por la plataforma
- When intenta registrar una evaluación
- Then el sistema la rechaza

**RF-47-AC-1**
- Given una evaluación habilitada (RF-25)
- When el cliente la registra
- Then debe incluir una calificación y un comentario para poder guardarse

**RF-47-AC-2 (evaluación incompleta no se acepta)**
- Given una evaluación habilitada (RF-25)
- When el cliente intenta enviarla sin calificación o sin comentario
- Then el sistema no la acepta hasta que incluya ambos elementos

**RF-48-AC-1**
- Given un trabajador con al menos una evaluación registrada
- When un cliente consulta su perfil
- Then ve el número de evaluaciones recibidas

**RF-48-AC-2 (trabajador sin evaluaciones todavía)**
- Given un trabajador sin ninguna evaluación registrada
- When un cliente consulta su perfil
- Then el perfil muestra que no tiene evaluaciones, sin error

**RF-26-AC-1**
- Given una evaluación negativa registrada sobre un trabajador
- When el trabajador responde públicamente
- Then la respuesta queda visible junto a la evaluación

**RF-26-AC-2 (visibilidad persistente de la respuesta)**
- Given una evaluación negativa a la que el trabajador ya respondió
- When otro cliente consulta esa evaluación
- Then ve tanto la evaluación original como la respuesta del trabajador

**RF-49-AC-1**
- Given una evaluación que el trabajador considera falsa o injusta
- When solicita una revisión
- Then la solicitud llega al administrador para su revisión (RF-28)

**RF-49-AC-2 (la revisión requiere evidencias de ambas partes, RD-08)**
- Given que el trabajador solicitó una revisión de una evaluación (RF-49)
- When el administrador la atiende
- Then requiere evidencias de ambas partes antes de decidir (RD-08)

### 8.10 Reportes, moderación y sanciones (revisión especial: distinción entre aprobación del cliente y mediación administrativa)

**RF-27-AC-1**
- Given una situación que amerita reportarse (información falsa, perfil sospechoso, un problema durante el trabajo)
- When el cliente o el trabajador la reporta
- Then el reporte queda registrado y disponible para el administrador

**RF-27-AC-2 (reportes de ambas partes sobre el mismo servicio)**
- Given un reporte ya enviado por el cliente sobre un servicio
- When el trabajador también reporta un problema relacionado con ese mismo servicio
- Then ambos reportes quedan registrados y disponibles para el administrador

**RF-61-AC-1 (clasificación inicial de gravedad; solo prioriza, no determina hechos — agregado en Parte 6, H-03)**
- Given que un cliente o trabajador reporta un problema y lo clasifica inicialmente como grave (por ejemplo, robo o amenaza)
- When el sistema procesa el reporte
- Then notifica de inmediato al administrador con prioridad sobre reportes ordinarios, sin que esa clasificación inicial determine por sí sola los hechos ni imponga ninguna sanción

**RF-61-AC-2 (la determinación y la sanción son del administrador, no de la IA — ajuste obligatorio, H-03)**
- Given un reporte clasificado inicialmente como grave
- When el administrador lo revisa
- Then es el administrador quien determina los hechos y decide si corresponde una sanción (RF-28, RD-06); el sistema no decide esto de forma automática ni la clasificación inicial del reportante es vinculante

**RF-28-AC-1 (revisión de un reporte general)**
- Given un reporte registrado (RF-27)
- When el administrador lo revisa
- Then solicita evidencias a ambas partes antes de decidir

**RF-28-AC-2 (mediación administrativa de una disputa; NO autoriza el gasto por sí sola)**
- Given un cambio de costo o alcance en disputa, ya reportado por el trabajador y pendiente de decisión (el trabajador insiste en que es necesario, o el cliente disputa su origen — sección 13.3), y escalado al administrador
- When el administrador revisa las evidencias de ambas partes y emite su resolución (por ejemplo, si el cambio es un imprevisto legítimo o un error del trabajador)
- Then la resolución del administrador se registra y se explica a ambas partes (RF-32, RF-50), pero **no aplica ni cobra el costo adicional por sí misma**: la autorización del gasto sigue siendo del cliente conforme a RF-19/RD-07. Si el cliente no autoriza el costo pese a la resolución administrativa, el punto queda sin resolver (asunto de negocio pendiente; ninguna fuente define qué ocurre en ese caso, y este criterio no lo decide)

**RF-32-AC-1**
- Given que el administrador tomó una decisión (RF-28)
- When el sistema la procesa
- Then registra la decisión y su motivo

**RF-32-AC-2 (el motivo registrado no se reformula al explicarlo; reemplaza un criterio tautológico, H-11)**
- Given que el administrador registró una decisión con un motivo específico (RF-32)
- When el sistema genera la explicación para ambas partes (RF-50)
- Then el motivo mostrado a las partes es el mismo que quedó registrado, sin reformularse

**RF-50-AC-1**
- Given una decisión registrada (RF-32)
- When el sistema notifica el resultado
- Then ambas partes reciben la explicación de la decisión

**RF-50-AC-2 (más de dos partes involucradas)**
- Given una decisión registrada (RF-32) sobre un caso con más de dos partes involucradas (por ejemplo, cliente, trabajador y organización)
- When el sistema notifica el resultado
- Then todas las partes involucradas reciben la explicación, no solo dos

**RF-51-AC-1**
- Given que se explicó una decisión (RF-50) y una de las partes no está de acuerdo
- When solicita una segunda revisión
- Then la solicitud queda registrada y atendida por el administrador

**RF-51-AC-2 (la segunda revisión no exige evidencia nueva; admite señalar un error de valoración — ajuste obligatorio, H-11)**
- Given que la parte afectada solicita una segunda revisión de la decisión del administrador (RF-51)
- When el administrador la atiende
- Then puede fundamentarse en evidencia adicional **o** en un señalamiento de que la evidencia original se valoró incorrectamente; no se exige evidencia nueva como condición obligatoria para admitir la solicitud

**RF-29-AC-1 (documento vencido; hecho verificable automáticamente, sin juicio administrativo)**
- Given un documento de verificación con fecha de vencimiento superada
- When el sistema detecta el vencimiento
- Then retira temporalmente la marca de verificación correspondiente y avisa al trabajador para que la actualice

**RF-29-AC-2 (información falsa; requiere que el administrador ya lo haya establecido — corrige atribución indebida a la IA/sistema)**
- Given un reporte de información falsa (RF-27) que el administrador ya revisó y confirmó como tal, con evidencias (RF-28)
- When se registra esa decisión (RF-32)
- Then el sistema retira temporalmente la marca de verificación correspondiente y avisa al trabajador; el sistema **no determina por sí solo** que una información es falsa — esa determinación la hace el administrador, en línea con RD-06

**RF-52-AC-1 (advertencia; NO reducción automática de visibilidad — resuelve C-7; umbral numérico pendiente de PV-06, H-12)**
- Given quejas acumuladas sobre un trabajador, ya validadas por el administrador
- When se alcanza el punto de advertencia
- Then el sistema emite una advertencia al trabajador, sin reducir automáticamente la visibilidad de su perfil

**RF-52-AC-2 (escalación a suspensión; decisión del administrador, no automática)**
- Given que las quejas continúan después de la advertencia (RF-52-AC-1)
- When el administrador revisa el caso (RF-28)
- Then decide si corresponde una suspensión; el sistema no suspende por sí solo

### 8.11 Cuentas

**RF-30-AC-1**
- Given una persona que aún no tiene cuenta (cliente, trabajador u organización)
- When se registra con los datos requeridos
- Then puede iniciar sesión con esa cuenta

**RF-30-AC-2 (credenciales incorrectas; conservado tal cual por decisión del analista, ajuste obligatorio H-11: no se introduce una regla de identificadores únicos sin definir)**
- Given una persona que intenta iniciar sesión con datos incorrectos
- When el sistema verifica las credenciales
- Then no permite el acceso

### 8.12 Requerimientos no funcionales (revisión especial: rendimiento y disponibilidad)

**RNF-04-AC-1 (consulta sin IA; decisión técnica del analista; condiciones de red normales)**
- Given una consulta que no requiere generar texto con IA (por ejemplo, listar el historial o resultados ya calculados), en condiciones de red normales
- When el usuario la solicita, y se mide desde el envío de la solicitud hasta que la interfaz muestra el contenido
- Then la respuesta se muestra en 2 segundos o menos

**RNF-04-AC-2 (conversación simple; condiciones de red normales)**
- Given una interacción conversacional simple con el agente (una respuesta corta, sin generar la lista de recomendaciones), en condiciones de red normales
- When el usuario envía un mensaje, y se mide desde el envío hasta que la interfaz muestra la respuesta
- Then la respuesta se muestra en 3 segundos o menos

**RNF-04-AC-3 (generación de recomendaciones; condiciones de red normales)**
- Given una búsqueda que requiere generar la lista de recomendaciones con su explicación (RF-13), en condiciones de red normales
- When el usuario la solicita, y se mide desde el envío de la solicitud hasta que la interfaz muestra la lista completa
- Then la respuesta se muestra en 5 segundos o menos

**RNF-04-AC-4 (conexión lenta o inestable; no contradice RNF-02)**
- Given una conexión lenta o inestable (cubierta por RNF-02)
- When el usuario envía una solicitud
- Then el sistema sigue funcionando sin perder la solicitud ni el estado de la conversación (RNF-02, RNF-03), aunque el tiempo de respuesta pueda superar los umbrales de RNF-04-AC-1 a -3; estos umbrales son metas bajo condiciones normales, no una garantía bajo cualquier condición de red

**RNF-05-AC-1 (disponibilidad; decisión técnica del analista)**
- Given un mes calendario de operación
- When se mide el tiempo total en que el servicio estuvo disponible
- Then el resultado es igual o mayor al 99%, excluyendo mantenimientos programados fuera de horario pico

**RNF-01-AC-1**
- Given un usuario sin experiencia técnica
- When usa la aplicación por primera vez
- Then completa las tareas principales (describir un proyecto, buscar un trabajador) sin ayuda externa (criterio de aceptación exacto de usabilidad pendiente de definir por el equipo)

**RNF-02-AC-1**
- Given un celular común con conexión lenta o inestable
- When el usuario abre la aplicación
- Then la aplicación carga y funciona sin necesidad de instalación

**RNF-03-AC-1**
- Given una conversación, cita o acuerdo en curso
- When el servicio sufre una caída o el usuario pierde la conexión
- Then, al reconectarse, el usuario recupera el estado exacto de su conversación, cita o acuerdo

**RNF-07-AC-1**
- Given una foto o conversación capturada por el agente
- When se evalúa su uso
- Then no se emplea para ningún fin que no haya sido consentido por el usuario

**RNF-08-AC-1**
- Given datos almacenados en la plataforma
- When un actor sin autorización intenta acceder a ellos
- Then el acceso es rechazado

**RNF-10-AC-1**
- Given una lista de recomendaciones generada para un cliente
- When el cliente pregunta por qué aparece cada opción
- Then la explicación no depende de pagos ni de criterios que no se le hayan comunicado

**RNF-11-AC-1**
- Given un acuerdo, autorización o entrada de historial ya registrado
- When alguien intenta modificarlo
- Then la modificación queda registrada con su propio rastro, sin borrar el original

**RNF-11-AC-2 (integridad frente a eliminación de datos personales, no un plazo de conservación)**
- Given una solicitud de eliminación de datos personales (RF-55) de un usuario con acuerdos o historial ya registrados
- When se aplica RNF-11
- Then los acuerdos y el historial ya registrados no se eliminan ni se alteran por esa solicitud; RNF-11 protege que esos registros no se modifiquen sin dejar rastro, pero **no establece** por cuánto tiempo deben conservarse — ese plazo depende de la normativa aplicable, aún sin identificar (PV-15), y este criterio no propone ninguno

**RNF-12-AC-1**
- Given un usuario autenticado con un rol específico
- When intenta acceder a una función o dato fuera de su rol
- Then el sistema le niega el acceso

---

## 9. Trazabilidad RF ↔ caso de uso ↔ criterio
Matriz completa. "UC" usa los IDs de `casos_de_uso.puml` (idénticos en las dos vistas parciales). Los RF sin caso de uso propio (RF-10, RF-48, RF-53, RF-54) se marcan como "atributo/regla" en vez de UC. Todos los identificadores de criterio se escriben en forma completa (corrección de cierre: la fila de RNF-04 usaba antes una abreviatura).

| RF/RNF/RD | UC | Criterio(s) GWT | Fuente |
|---|---|---|---|
| RF-01 | UC10 | RF-01-AC-1, RF-01-AC-2 | T18, R-T18 |
| RF-02 | UC11 | RF-02-AC-1, RF-02-AC-2 | T18, R-T18 |
| RF-03 | UC12 | RF-03-AC-1, RF-03-AC-2 | T18, R-T18 |
| RF-04 | UC10 | RF-04-AC-1, RF-04-AC-2 | T19, R-T19 |
| RF-05 | UC13 | RF-05-AC-1, RF-05-AC-2 | T18, T21, R-T18, R-T22 |
| RF-06 | UC14 | RF-06-AC-1, RF-06-AC-2 | T21, R-T22, R-T38 |
| RF-56 | UC15 | RF-56-AC-1, RF-56-AC-2 | T18 |
| RF-07 | UC03 | RF-07-AC-1, RF-07-AC-2 | T11, R-T11 |
| RF-34 | UC04 | RF-34-AC-1, RF-34-AC-2 | T11, R-T11 |
| RF-08 | UC05 | RF-08-AC-1, RF-08-AC-2, RF-08-AC-3 | T16, R-T16 |
| RF-09 | UC07 | RF-09-AC-1, RF-09-AC-2 | T12, R-T12 |
| RF-35 | UC08 | RF-35-AC-1, RF-35-AC-2 | T12, R-T12 |
| RF-10 | atributo (UC16) | RF-10-AC-1, RF-10-AC-2 | T11, R-T11 |
| RF-55 | UC09 | RF-55-AC-1, RF-55-AC-2 | T33, R-T34 |
| RF-11 | UC16 | RF-11-AC-1, RF-11-AC-2 | T17, R-T17 |
| RF-12 | UC16 | RF-12-AC-1, RF-12-AC-2 | T17, R-T17 |
| RF-13 | UC16 | RF-13-AC-1, RF-13-AC-2 | T22, R-T17, R-T23 |
| RF-14 | UC17 | RF-14-AC-1, RF-14-AC-2 | T21, R-T16, R-T22 |
| RF-15 | UC06 | RF-15-AC-1, RF-15-AC-2 | T6, T7, R-T6, R-T7 |
| RF-62 | UC50 | RF-62-AC-1, RF-62-AC-2 | — |
| RF-16 | UC18 | RF-16-AC-1, RF-16-AC-2 | T23, R-T24 |
| RF-38 | UC19 | RF-38-AC-1, RF-38-AC-2, RF-38-AC-3 | T27, R-T28 |
| RF-39 | UC20 | RF-39-AC-1, RF-39-AC-2 | T23, R-T24, R-T28 |
| RF-17 | UC21 | RF-17-AC-1, RF-17-AC-2 | T25, R-T26 |
| RF-40 | UC22 | RF-40-AC-1, RF-40-AC-2 | T25, R-T26 |
| RF-41 | UC21 | RF-41-AC-1, RF-41-AC-2 | T25, R-T26 |
| RF-18 | UC23 | RF-18-AC-1, RF-18-AC-2 | T23, T26, R-T24, R-T27 |
| RF-42 | UC24 | RF-42-AC-1, RF-42-AC-2, RF-42-AC-3 | T23, T26, R-T24, R-T27, R-T33 |
| RF-19 / RD-07 | UC26, UC27 | RF-19-AC-1, RF-19-AC-2, RF-19-AC-3 | T30, R-T31, R-T32 |
| RF-20 | UC35 | RF-20-AC-1, RF-20-AC-2 | T21, R-T20, R-T21 |
| RF-21 | UC36 | RF-21-AC-1, RF-21-AC-2 | T22, R-T21, R-T23 |
| RF-53 | transversal (UC10, UC16) | RF-53-AC-1, RF-53-AC-2 | T35, R-T36 |
| RF-54 | regla (UC18, UC21) | RF-54-AC-1, RF-54-AC-2 | T33, R-T34 |
| RF-58 | regla (sin caso de uso propio) | RF-58-AC-1, RF-58-AC-2 | T11 |
| RF-22 | UC29 | RF-22-AC-1, RF-22-AC-2 | T29, R-T30 |
| RF-43 | UC30 | RF-43-AC-1, RF-43-AC-2 | T29, R-T30 |
| RF-44 | UC31 | RF-44-AC-1, RF-44-AC-2 | T29, R-T30 |
| RF-45 | UC34 | RF-45-AC-1, RF-45-AC-2 | T29, R-T30 |
| RF-57 | UC34 | RF-57-AC-1, RF-57-AC-2 | T29 |
| RF-23 | UC32 | RF-23-AC-1, RF-23-AC-2 | T28, R-T29 |
| RF-24 | UC33 | RF-24-AC-1, RF-24-AC-2 | T31, R-T29, R-T32 |
| RF-59 | UC47 | RF-59-AC-1, RF-59-AC-2 | — |
| RF-60 | UC48 | RF-60-AC-1, RF-60-AC-2 | — |
| RF-25 / RD-01 | UC37 | RF-25-AC-1, RF-25-AC-2 | T13, R-T13 |
| RF-47 | UC37 | RF-47-AC-1, RF-47-AC-2 | T13, R-T13 |
| RF-48 | atributo (UC37) | RF-48-AC-1, RF-48-AC-2 | T13, R-T13 |
| RF-26 | UC38 | RF-26-AC-1, RF-26-AC-2 | T14, R-T14 |
| RF-49 / RD-08 | UC39 | RF-49-AC-1, RF-49-AC-2 | T14, T15, R-T14, R-T15 |
| RF-27 | UC40 | RF-27-AC-1, RF-27-AC-2 | T15, R-T5, R-T15, R-T38 |
| RF-61 | UC49 | RF-61-AC-1, RF-61-AC-2 | T14, R-T14 |
| RF-28 | UC41 | RF-28-AC-1, RF-28-AC-2 | T10, T14, T15, R-T10, R-T14, R-T15 |
| RF-32 | UC42 | RF-32-AC-1, RF-32-AC-2 | T15, R-T15 |
| RF-50 | UC43 | RF-50-AC-1, RF-50-AC-2 | T15, R-T15 |
| RF-51 | UC44 | RF-51-AC-1, RF-51-AC-2 | T15, R-T15 |
| RF-29 | UC45 | RF-29-AC-1, RF-29-AC-2 | T12, T15, R-T12, R-T15 |
| RF-52 | UC46 | RF-52-AC-1, RF-52-AC-2 | T14, R-T14 |
| RF-30 | UC01, UC02 | RF-30-AC-1, RF-30-AC-2 | RF-07, RF-21, RF-28 (derivado) |
| RNF-01 | toda la app | RNF-01-AC-1 | T9, T18, R-T9, R-T35 |
| RNF-02 | toda la app | RNF-02-AC-1 | T9, T34, T35, R-T9, R-T35, R-T36 |
| RNF-03 | toda la app | RNF-03-AC-1 | T35, R-T36 |
| RNF-04 | UC10, UC16 | RNF-04-AC-1, RNF-04-AC-2, RNF-04-AC-3, RNF-04-AC-4 | T35, R-T36 |
| RNF-05 | todo el servicio | RNF-05-AC-1 | T35, R-T36 |
| RNF-07 | agente (UC10) | RNF-07-AC-1 | T33, R-T34 |
| RNF-08 | todos los datos | RNF-08-AC-1 | T33, R-T34 |
| RNF-10 | UC16 | RNF-10-AC-1 | T22 |
| RNF-11 | RF-18, 19, 21, 42 | RNF-11-AC-1, RNF-11-AC-2 | Derivado |
| RNF-12 | todos los roles | RNF-12-AC-1 | Derivado |

**Cobertura verificada:** 57/57 RF del MVP con al menos **2** criterios Given-When-Then cada uno; 10/10 RNF (con al menos 1); 11/11 RD referenciadas (directamente o mediante el RF que las opera; RD-11 ahora con RF-58 parcial). **132** identificadores de criterio en total, todos presentes en esta matriz (0 huérfanos, verificado por comparación automatizada). Actualizado en Parte 6 (hallazgos H-01 a H-12).

---

## Apéndices
Las secciones 10 y 11 son contenido complementario de UnCalificado que no corresponde a ninguna de las tres partes de IEEE 830 (introducción, descripción general, requerimientos específicos); se agrupan aquí sin alterar su numeración ni su contenido.

## 10. Funcionalidades fuera del MVP
No se desarrollan en este SRS. Se listan para dejar constancia de que fueron consideradas y excluidas deliberadamente (instrucción del analista, cierres de Parte 2 y 3).

| Funcionalidad | RF (si existe) | Motivo de exclusión |
|---|---|---|
| Envío de audio en la conversación | RF-33 | Solo lo propone el PO ficticio (T18); alcance Posterior por decisión del analista |
| Filtro de búsqueda por rango de precio | RF-36 | Interés confirmado por ambas fuentes, pero viabilidad técnica sin confirmar con los datos disponibles al inicio; alcance Posterior (cierre de Parte 3) |
| Administración de múltiples trabajadores y jerarquías dentro de una organización | RF-37 | Idea mencionada sin describirse con detalle suficiente para el MVP. **Sigue excluida tras Parte 6:** RF-08 se extendió para que una organización declare disponibilidad *general*, pero eso no incluye asignar disponibilidad por empleado (ajuste obligatorio del analista, H-05) |
| Detección automática de desviaciones por umbral o análisis predictivo | RF-46 | Ninguna fuente propuso un valor de umbral; se prefiere el aviso básico (RF-24) para el MVP |
| Pagos y anticipos dentro de la plataforma | Sin RF propio | Ninguna fuente lo pide como indispensable para el MVP; implica aspectos legales y de seguridad sin evaluar (PV-14) |
| Cotización automática generada por IA | Sin RF propio | Ambas fuentes prefieren que la propuesta la redacte el trabajador (RF-18), no un cálculo automático |
| Integración con WhatsApp | Sin RF propio | Decisión de alcance: el MVP usa un solo canal (aplicación web responsive) |
| Estadísticas y reportes detallados | Sin RF propio | Mencionado solo por el stakeholder real (R-T38) como función posterior |
| Evaluación del cliente por parte del trabajador | Sin RF propio | Solo lo propone el PO ficticio (T13, T37); no tiene respaldo del stakeholder real |
| Atención de urgencias (por ejemplo, una fuga) | Sin RF propio | Mencionado como duda sin resolver por ambas fuentes (T16, T37) |
| Ampliar oficios y zonas más allá de los iniciales | Sin RF propio | Depende de que primero se decidan los oficios y la zona inicial (PV-04) |

---

## 11. Riesgos y decisiones pendientes
**No se resuelven aquí mediante suposiciones.** Son los mismos 12 puntos de `requerimientos_clasificados.md`, sección 14, presentados como riesgos para el cierre de esta entrega académica. **Siguen abiertos en esta versión final**, tal como pidió el analista: entregar el SRS no equivale a resolverlos.

| PV | Riesgo si no se resuelve antes de la implementación productiva | Afecta |
|---|---|---|
| **PV-01** | El rol de Administrador (RF-28, RF-50, RF-51, la mediación de disputas de costo) queda sin definir en cuanto a qué puede decidir y con qué evidencia; riesgo de implementarlo con poder mal delimitado o insuficiente | RF-28, RF-50, RF-51, RF-28-AC-2 |
| PV-02 | Sin criterio de qué evidencia aceptar para verificar experiencia sin certificados formales, la verificación (RF-09, RF-35) puede aplicarse de forma inconsistente | RF-09, RF-35 |
| PV-03 | Sin definir qué significa "organización registrada" ni ante quién, el registro de organizaciones (RF-15) puede no cumplir ninguna obligación legal real | RF-15 |
| PV-04 | Sin oficios ni zona inicial, no hay catálogo de datos con el cual poblar ni probar el MVP | Toda la búsqueda y recomendación (RF-11 a RF-14) |
| PV-06 | Sin umbral numérico de quejas, la advertencia de RF-52 no es operable tal como está redactada | RF-52 |
| PV-09 | Sin confirmar la capacidad de un equipo pequeño para sostener la atención humana, RF-06 podría prometer un soporte que no se pueda cumplir | RF-06 |
| PV-11 | Sin definir el valor legal del acuerdo escrito, RF-18/RF-42 podrían no proteger a ninguna de las partes en una disputa real | RF-18, RF-42 |
| PV-14 | Sin decidir si habrá pagos dentro de la plataforma (ni siquiera para después del MVP), el alcance funcional completo del producto queda incompleto | Alcance funcional (sección 2 y 10) |
| PV-15 | Sin identificar las normas legales aplicables, RD-11 no puede verificarse y la plataforma podría operar sin cumplimiento. **Incluye el plazo de conservación del historial y los acuerdos tras una solicitud de eliminación de datos (RF-55, RNF-11): ningún plazo se asumió en este documento** | RD-11, RNF-08, RF-55, RNF-11 |
| **PV-17** | Sin presupuesto ni calendario, no se puede confirmar que el equipo pueda construir el MVP en un tiempo razonable | Viabilidad general |
| **PV-18** | Sin confirmar la capacidad real del equipo, las 57 capacidades del MVP podrían ser más de lo que se puede construir | Todo el MVP |
| PV-19 | Sin mecanismo para verificar la veracidad de los reportes de avance, RF-22/RF-44 dependen de la buena fe del trabajador | RF-22, RF-44 |
| **PV-21** | Sin un tiempo o SLA definido para la atención administrativa de reportes clasificados como graves; RF-61 crea la ruta de prioridad, no un plazo de respuesta. Ningún valor numérico se inventa (agregado en Parte 6, hallazgo H-03) | RF-61, RD-09 |

### Vacío de negocio identificado durante la revisión final (no resuelto, solo documentado)
Si el cliente no autoriza un costo adicional pese a que el administrador ya resolvió que el cambio es legítimo (RF-28-AC-2), **ninguna fuente define qué ocurre** con la parte del trabajo afectada. No se asumió ninguna resolución: queda como un vacío explícito, distinto de los 12 PV numerados porque surgió del propio ejercicio de redactar los criterios, no de las entrevistas.

### Limitaciones de validación (se mantienen explícitas en esta versión final)
- **Evidencia limitada:** los requerimientos "Confirmado" se apoyan en una simulación (PO ficticio) y en una entrevista con una sola persona interesada (Luis Dominguez). Ninguna de las dos constituye la validación formal que un equipo real necesita antes de construir el producto.
- **Valores técnicos sin probar:** los parámetros marcados "decisión técnica del analista" (números de intentos, segundos de respuesta, porcentaje de disponibilidad, plazos de expiración, etc.) no se han validado contra ninguna arquitectura real; podrían no ser alcanzables con el presupuesto que se defina (PV-17).
- **Dependencia de un proveedor de IA conversacional:** RNF-04 y varios RF de la capacidad 3 dependen de un componente de IA cuyo proveedor, costo y límites técnicos no se han evaluado.
- **Esta es una entrega académica de la actividad S02_A1**, no el SRS de un proyecto en producción: su aprobación como documento de curso no implica que el equipo real de UnCalificado lo haya validado ni que esté listo para construirse.

**Recomendación:** antes de cualquier implementación productiva, resolver como mínimo PV-01, PV-17 y PV-18, por ser los que determinan si el conjunto de requerimientos aquí descrito es viable de construir y de operar con seguridad para el administrador y los usuarios, y obtener la validación formal del cliente y del equipo real que este documento, por su origen (una simulación y una sola persona entrevistada), no puede sustituir.
