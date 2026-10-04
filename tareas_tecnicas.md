# Tareas técnicas — Sprint 1 — UnCalificado

| Campo | Valor |
|---|---|
| Sprint | 1 (5 al 16 de octubre de 2026) |
| Sprint Goal | Ver `sprint1_planning.md`, sección 2 |
| Historias | HU-01 (3 SP) y HU-05 (8 SP) |
| Fuente funcional | `SRS_equipo.md` |
| DoD aplicable | `definition_of_done.md` v1.0 (sin CI/CD completo) |
| Versión | Final (consolidación de las dos propuestas del equipo) |

---

## 1. Reglas de descomposición

Cada tarea:

- se completa en **4 h o menos** (ninguna supera 3 h);
- tiene un **rol técnico responsable** (sección 9);
- tiene un **criterio de Done observable**, que remite al criterio del SRS (`RF-XX-AC-N`) cuando aplica;
- mantiene **trazabilidad** con la historia y su criterio de aceptación (`HU-XX-AC-N`);
- no fija tecnología como requisito: `SRS_equipo.md` no define una pila tecnológica, así que los nombres de endpoints, tablas y archivos son propuestas de diseño.

Las horas sirven para organizar el trabajo y comprobar la factibilidad (`sprint1_planning.md`, sección 3.2). **No convierten Story Points a horas.**

---

## 2. Habilitadores técnicos (8 h, sin SP)

Son actividades de soporte necesarias para construir y verificar las historias. No son historias adicionales ni agregan SP. Se hacen primero.

| ID | Tarea | Rol | Horas | Depende de | Criterio de Done |
|---|---|---|---:|---|---|
| T-00.1 | Crear el repositorio, la estrategia de ramas (`main` protegida y ramas por tarea) y la plantilla de PR con el checklist de la DoD y el campo “Criterios cubiertos” | DevOps | 1 | — | `main` rechaza pushes directos; la estrategia está documentada en el README; al abrir un PR aparece la plantilla con el checklist de `definition_of_done.md` |
| T-00.2 | Crear el comando único de pruebas y el comando de lint, para ejecución local (el CI se pospone) | DevOps / QA | 1 | T-00.1 | Un comando ejecuta todas las pruebas e imprime un resumen reproducible de pasa/falla; otro ejecuta el lint; ambos están documentados en el README (DoD-06) |
| T-00.3 | Estructura base del backend: capas, persistencia, migraciones y endpoint `/health` | Backend Dev | 1.5 | T-00.1 | El backend inicia localmente; `/health` responde 200; la primera migración se aplica sin errores |
| T-00.4 | Estructura base de la aplicación web responsive para 360 × 640 px, en español de México | Frontend Dev | 1.5 | T-00.1 | La vista base carga a 360 × 640 px sin desplazamiento horizontal |
| T-00.5 | Ambiente de pruebas con HTTPS, procedimiento de despliegue manual y prueba de humo | DevOps | 1.5 | T-00.2, T-00.3, T-00.4 | La URL de pruebas responde por HTTPS (RE-09); el README describe el despliegue paso a paso; la prueba de humo pasa: la página carga y `/health` responde (DoD-07) |
| T-00.6 | Spike del servicio de IA externo: validar acceso, errores y latencia de referencia con 20 llamadas | IA Dev | 1.5 | — | Nota breve en el repositorio con el proveedor, la latencia p95 observada, los límites de uso y el manejo de errores; las credenciales se guardan como secreto, fuera del código (DoD-11) |

---

## 3. HU-01 — Registro con cuenta y consentimiento (3 SP · 10.5 h)

**Alcance acordado:** aplicación web. La app nativa reutilizará la misma API (`sprint1_planning.md`, sección 4.1).

| ID | Tarea | Rol | Horas | Trazabilidad | Depende de | Criterio de Done |
|---|---|---|---:|---|---|---|
| T-01.1 | Modelo de datos: usuario, rol (cliente, trabajador, organización, administrador), versión del aviso de privacidad y consentimiento (versión, fecha y hora, mayoría de edad) | Backend Dev | 1.5 | HU-01-AC-1, AC-3 | T-00.3 | La migración se aplica en el ambiente de pruebas; existe la versión “v1” del aviso; las pruebas unitarias del modelo pasan |
| T-01.2 | Registro (`POST /cuentas`): valida campos, contraseña de al menos 10 caracteres, aceptación del aviso y mayoría de edad; rechaza el rol de administrador | Backend Dev | 2 | HU-01-AC-1 a AC-3 | T-01.1 | Con datos válidos crea la cuenta y guarda el consentimiento con fecha, hora y versión (RF-02-AC-1); sin aceptación no la crea e informa el motivo (RF-02-AC-2); con rol de administrador no crea nada (RF-01-AC-3); con contraseña de 9 caracteres indica el campo (RNF-11-AC-1) |
| T-01.3 | Inicio de sesión y sesión con cierre a los 30 min de inactividad | Backend Dev | 1.5 | HU-01-AC-1, AC-3 | T-01.2 | Credenciales válidas permiten el acceso (RF-01-AC-1); incorrectas se rechazan sin indicar cuál dato falló (RF-01-AC-2); una sesión inactiva 30 min se invalida (RNF-11-AC-3); una petición sin sesión a un recurso protegido recibe acceso denegado sin datos (RNF-03-AC-1) |
| T-01.4 | Control de nueva versión del aviso: se bloquea el uso hasta aceptar la versión vigente | Backend Dev | 1 | HU-01-AC-4 | T-01.3 | Un usuario con la v1 aceptada, al publicarse la v2, recibe “requiere aceptar aviso v2” en cualquier endpoint protegido; al aceptarla se registra el consentimiento y puede continuar (RF-02-AC-3) |
| T-01.5 | Pantalla de registro: tipo de usuario, enlace al aviso, casillas de aceptación y mayoría de edad, y validación junto a cada campo | Frontend Dev | 2 | HU-01-AC-1, AC-2 | T-00.4, T-01.2 | Funciona a 360 × 640 px sin desplazamiento horizontal; cada error aparece junto a su campo (RNF-01-AC-2); no envía si falta la aceptación; la fecha del consentimiento se muestra en DD/MM/AAAA (RNF-14-AC-1) |
| T-01.6 | Pantallas de inicio de sesión y de nueva aceptación del aviso | Frontend Dev | 1 | HU-01-AC-3, AC-4 | T-01.3, T-01.4, T-01.5 | Un inicio de sesión correcto lleva a la página principal; con credenciales incorrectas se muestra un mensaje genérico; un usuario con aviso desactualizado ve la pantalla de aceptación antes de continuar |
| T-01.7 | Pruebas automatizadas `test_HU_01_AC_1` a `test_HU_01_AC_4`, más contraseña corta y sesión expirada | QA | 1.5 | HU-01-AC-1 a AC-4 | T-01.2 a T-01.6 | 6 pruebas en verde con el comando único de pruebas (salida adjunta en el PR), nombradas con el ID del criterio y con los IDs del SRS en el docstring; los cuatro criterios se demuestran en el ambiente de pruebas |
| | **Subtotal HU-01** | | **10.5** | | | |

---

## 4. HU-05 — Describir mi necesidad conversando con el agente (8 SP · 27.5 h)

### 4.1 Backend e IA

| ID | Tarea | Rol | Horas | Trazabilidad | Depende de | Criterio de Done |
|---|---|---|---:|---|---|---|
| T-05.1 | Cliente del servicio de IA con tiempo de espera, reintento único y error controlado, más un doble de prueba con respuestas fijas | IA Dev | 2.5 | HU-05-AC-1 | T-00.6 | Puede enviar y recibir mensajes; ante una falla o un tiempo de espera excedido devuelve un error controlado sin romper la conversación (DoD-09); el doble de prueba se activa por configuración y lo usa el comando de pruebas (RE-04) |
| T-05.2 | Modelo de conversación, mensajes (emisor, contenido, fecha y hora), proyecto “borrador” con campos de la solicitud y contador de intentos fallidos | Backend Dev | 2 | HU-05-AC-1, AC-2 | T-01.1 | La migración se aplica; los mensajes se guardan antes de responder; un campo puede guardar “desconocido” |
| T-05.3 | Envío de mensajes y recuperación de la conversación | Backend Dev | 1 | HU-05-AC-1 | T-05.2, T-01.3 | Solo el dueño lee su conversación (RNF-04); al cerrar y reabrir la sesión se recuperan todos los mensajes en orden (RNF-13-AC-1) |
| T-05.4 | Instrucciones del agente: se identifica como asistente automático, hace una pregunta por turno, pide los datos aplicables al oficio y registra “desconocido” si el cliente no sabe un dato | IA Dev | 3 | HU-05-AC-1, AC-2 | T-05.1 | En 10 conversaciones de prueba, el primer mensaje incluye “asistente automático” (RF-13-AC-1); cada respuesta tiene una sola pregunta (RF-14-AC-1, AC-2); “no sé la medida” queda como “desconocido” (RF-14-AC-5); instrucciones versionadas en el repositorio (DoD-03) |
| T-05.5 | Validar la salida del agente y guardar los datos obtenidos | Backend Dev | 1.5 | HU-05-AC-1, AC-2 | T-05.3, T-05.4 | Si el doble de prueba devuelve dos preguntas, el cliente recibe solo una; los datos extraídos quedan en el proyecto “borrador” |
| T-05.6 | Manejo de ambigüedad: repreguntar o pedir foto, sin inventar datos; contar los intentos consecutivos fallidos | IA Dev | 2.5 | HU-05-AC-2, AC-4 | T-05.4, T-05.5 | Ante una respuesta ambigua de prueba, el agente repregunta o pide foto y no asume el dato (RF-19-AC-1); “desconocido” no bloquea la solicitud; el contador llega a 2 tras dos correcciones consecutivas y vuelve a 0 cuando el cliente confirma |
| T-05.7 | Clasificación del oficio: salida restringida a las 10 categorías de RD-18 o vacía, con máximo 2 aclaraciones | IA Dev | 3 | HU-05-AC-3, AC-4 | T-05.4 | Nunca se guarda un oficio fuera del catálogo (RF-15-AC-2); con 0 o 1 aclaraciones vuelve a preguntar (RF-15-AC-4); tras 2 sin categoría, el oficio queda vacío y se activa la oferta de soporte (RF-15-AC-3) |
| T-05.8 | Oferta y registro de soporte: tras 2 intentos fallidos, 2 aclaraciones sin oficio o a petición del cliente; el caso guarda la solicitud y un resumen de la conversación | Backend Dev | 2.5 | HU-05-AC-4 | T-05.6, T-05.7 | Con el contador en 2 se ofrece soporte (RF-22-AC-1); al pulsar “Solicitar soporte” se crea un caso con el ID del proyecto y el resumen (RF-22-AC-2); el caso aparece en `GET /soporte/casos` en estado “pendiente” (RF-22-AC-3) |

### 4.2 Frontend

| ID | Tarea | Rol | Horas | Trazabilidad | Depende de | Criterio de Done |
|---|---|---|---:|---|---|---|
| T-05.9 | Chat responsive: burbujas, etiqueta fija “Asistente automático”, adjuntar foto, botón “Solicitar soporte” y recuperación de la conversación al reabrir | Frontend Dev | 3 | HU-05-AC-1, AC-4 | T-00.4, T-05.3 | Sin desplazamiento horizontal a 360 × 640 px (RNF-02-AC-1); la etiqueta de asistente se ve en cualquier punto de la conversación (RF-13-AC-2); al recargar reaparece la conversación completa |
| T-05.10 | Indicador “procesando” | Frontend Dev | 0.5 | HU-05-AC-5 | T-05.9 | Con el doble de prueba configurado con 3 s de retraso, el indicador aparece entre 2.0 y 2.2 s y desaparece al llegar la respuesta; con 1 s de retraso no aparece (RF-25-AC-1) |

### 4.3 Evaluación y QA

| ID | Tarea | Rol | Horas | Trazabilidad | Depende de | Criterio de Done |
|---|---|---|---:|---|---|---|
| T-05.11 | Preparar el conjunto de 50 descripciones etiquetadas (5 por cada oficio del catálogo, en lenguaje cotidiano y con datos ficticios) | Product Owner (con apoyo de QA) | 1.5 | HU-05-AC-3 | — | Archivo `dataset_clasificacion.csv` en el repositorio con 50 filas (descripción, oficio esperado), 5 por categoría, entregado a más tardar el día 3 |
| T-05.12 | Script y ejecución de la evaluación de exactitud | QA | 1.5 | HU-05-AC-3 | T-05.7, T-05.11 | Reporta aciertos sobre 50, la lista de fallos y los oficios fuera del catálogo (debe ser 0); **aprueba solo con ≥ 45/50** (RF-15-AC-1, AC-2); corrida intermedia el día 6 y final el día 9; el reporte queda como evidencia en el PR |
| T-05.13 | Pruebas automatizadas `test_HU_05_AC_1`, `test_HU_05_AC_2`, `test_HU_05_AC_4` y `test_HU_05_AC_5`, con el doble de prueba del servicio de IA | QA | 2 | HU-05-AC-1, AC-2, AC-4, AC-5 | T-05.5 a T-05.10 | 4 pruebas deterministas en verde con el comando único (salida adjunta en el PR), con los IDs del SRS en el docstring |
| T-05.14 | Prueba exploratoria de punta a punta en un celular o a 360 × 640 px: registro, consentimiento, conversación, clasificación o soporte, y reconexión | QA | 1 | Sprint Goal (M-4, M-5) | T-01.7, T-05.13 | Checklist con fecha y responsable, con M-4 y M-5 en “pasa”; los defectos encontrados quedan como issues con su severidad (DoD-17) |
| | **Subtotal HU-05** | | **27.5** | | | |

---

## 5. Resumen de horas

| Bloque | Horas |
|---|---:|
| Habilitadores técnicos | 8 |
| HU-01 | 10.5 |
| HU-05 | 27.5 |
| **Total técnico estimado** | **46** |

| Rol | Tareas | Horas |
|---|---|---:|
| Backend Dev | T-00.3, T-01.1 a T-01.4, T-05.2, T-05.3, T-05.5, T-05.8 | 14.5 |
| IA Dev | T-00.6, T-05.1, T-05.4, T-05.6, T-05.7 | 12.5 |
| Frontend Dev | T-00.4, T-01.5, T-01.6, T-05.9, T-05.10 | 8 |
| QA | T-01.7, T-05.12, T-05.13, T-05.14 | 6 |
| DevOps (T-00.2 con QA) | T-00.1, T-00.2, T-00.5 | 3.5 |
| Product Owner (con QA) | T-05.11 | 1.5 |
| **Total** | **27 tareas** | **46** |

Todas las tareas cumplen el límite de 4 h o menos. Las 46 h coinciden con las horas disponibles para trabajo técnico (`sprint1_planning.md`, sección 3.2) y no modifican el compromiso de 11 SP.

---

## 6. Cobertura de criterios

| Criterio | Implementación | Verificación |
|---|---|---|
| HU-01-AC-1 (RF-01-AC-1, RF-02-AC-1) | T-01.1, T-01.2, T-01.3, T-01.5 | T-01.7 |
| HU-01-AC-2 (RF-02-AC-2) | T-01.2, T-01.5 | T-01.7 |
| HU-01-AC-3 (RF-01-AC-2, RF-01-AC-3) | T-01.1, T-01.2, T-01.3, T-01.6 | T-01.7 |
| HU-01-AC-4 (RF-02-AC-3) | T-01.4, T-01.6 | T-01.7 |
| HU-05-AC-1 (RF-13-AC-1, RF-14-AC-1, RF-14-AC-2) | T-05.1 a T-05.5, T-05.9 | T-05.13 |
| HU-05-AC-2 (RF-19-AC-1, RF-14-AC-5) | T-05.2, T-05.4, T-05.5, T-05.6 | T-05.13 |
| HU-05-AC-3 (RF-15-AC-1) | T-05.7, T-05.11 | T-05.12 |
| HU-05-AC-4 (RF-22-AC-1, RF-22-AC-2, RF-15-AC-3) | T-05.6, T-05.7, T-05.8, T-05.9 | T-05.13 |
| HU-05-AC-5 (RF-25-AC-1) | T-05.10 | T-05.13 |
| M-4 y M-5 del Sprint Goal (RNF-02-AC-1, RNF-13-AC-1) | T-05.3, T-05.9 | T-05.14 |

Los **9 criterios de aceptación** tienen al menos una tarea de implementación y una de verificación.

---

## 7. Orden sugerido

1. **Días 1–2:** habilitadores (T-00.1 → T-00.2 → T-00.3 / T-00.4 → T-00.5); el spike T-00.6 en paralelo.
2. **Días 2–5:** HU-01 completa (T-01.1 a T-01.7). El PO prepara el conjunto de evaluación (T-05.11).
3. **Días 4–8:** HU-05: T-05.1 → T-05.2 → T-05.3 → T-05.4 → T-05.5 → T-05.6 / T-05.7 → T-05.8; en paralelo, T-05.9 y T-05.10.
4. **Día 6:** medición intermedia de la clasificación (T-05.12).
5. **Días 8–9:** evaluación final, pruebas (T-05.13) y prueba de punta a punta (T-05.14).
6. **Día 10:** correcciones, verificación de la DoD y preparación de la Sprint Review.

---

## 8. Registro en GitHub Projects

- Cada tarea se registra en el GitHub Project como **sub-issue** de HU-01 o HU-05. Si esa función no está disponible, se registra como issue vinculado claramente a la historia.
- Cada elemento muestra el ID de la tarea, la historia asociada, el rol, la estimación en horas y el criterio de Done.
- Los estados (Backlog → In progress → Done) se mantienen actualizados durante el sprint. Una tarea pasa a Done solo con DoD-T1 y DoD-T2 (`definition_of_done.md`).
- Los PR mencionan el ID de la tarea y los criterios cubiertos (plantilla de T-00.1).

---

## 9. Roles y asignación

- **Roles técnicos:** Backend Dev, Frontend Dev, IA Dev, QA y DevOps son responsabilidades técnicas de los **Developers**, no roles adicionales de Scrum.
- **Product Owner:** aporta claridad sobre el valor y el Product Backlog, y colabora en la preparación y validación de datos de negocio (T-05.11).
- **Scrum Master:** facilita el proceso y ayuda a remover impedimentos.
- **Asignación nominal:** cada integrante se asigna las tareas en el GitHub Project según el rol técnico que asuma en el sprint. En la entrega individual de esta actividad, un mismo integrante asume todos los roles técnicos y así lo indica en el campo de responsable.
