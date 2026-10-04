# Sprint 1 Planning — UnCalificado

| Campo | Valor |
|---|---|
| Sprint | 1 |
| Periodo | **lunes 5 al viernes 16 de octubre de 2026** (2 semanas) |
| Dedicación de referencia | 8 a 9 h por semana por integrante |
| Fuente funcional | `SRS_equipo.md` |
| Product Backlog | `backlog_completo.md`, con `ajustes_backlog.md` y `priorizacion_comparada.md` |
| Historias seleccionadas | **HU-01 (3 SP) y HU-05 (8 SP)** |
| Capacidad comprometida | **11 SP** |
| Documentos relacionados | `tareas_tecnicas.md`, `definition_of_done.md` |
| Versión | Final (consolidación de las dos propuestas del equipo) |

---

## 1. Propuesta inicial asistida por IA y evaluación del equipo

A partir del Product Backlog, el agente de IA propuso iniciar con **HU-01 — Registro con cuenta y consentimiento (3 SP)** y **HU-05 — Describir mi necesidad conversando con el agente (8 SP)**. Son las historias 1 y 2 del ranking del Product Owner simulado y ambas tienen prioridad Alta (`priorizacion_comparada.md`).

La propuesta **no se aceptó automáticamente**. El equipo la evaluó por prioridad, dependencias, valor, riesgo técnico y capacidad, y la mantuvo con estos ajustes:

1. No se establece una equivalencia rígida entre horas y Story Points. Las horas solo se usan para revisar la factibilidad (sección 3).
2. No se agregan historias solo para “llenar” capacidad.
3. La selección se valida contra dependencias y valor, no solo contra los SP.
4. La capacidad se recalibrará con la velocidad real observada al cierre del sprint.
5. Cada tarea técnica debe poder completarse en **4 h o menos** (`tareas_tecnicas.md`).
6. Se hizo explícito el alcance de HU-01 respecto a la app nativa (sección 4.1).

---

## 2. Sprint Goal acordado

> **Al finalizar el Sprint 1, un cliente podrá registrarse con una cuenta y consentimiento de privacidad en la aplicación web y describir su necesidad en una conversación guiada con el agente de IA. El agente se identifica como asistente automático, hace una pregunta a la vez, repregunta ante ambigüedad, clasifica el oficio dentro del catálogo de 10 oficios con al menos 45 aciertos de 50 y ofrece soporte humano cuando no logra comprender la solicitud tras 2 intentos.**

### 2.1 Medidas de éxito

El Sprint Goal se considera alcanzado en la Sprint Review del 16 de octubre si se cumplen las seis medidas:

| # | Medida | Umbral | Evidencia |
|---|---|---|---|
| M-1 | Criterios de aceptación de HU-01 | 4 de 4 (HU-01-AC-1 a AC-4) | Pruebas automatizadas en verde y demo |
| M-2 | Criterios de aceptación de HU-05 | 5 de 5 (HU-05-AC-1 a AC-5); incluye la repregunta ante ambigüedad y la oferta de soporte con resumen | Pruebas automatizadas en verde y demo |
| M-3 | Exactitud de la clasificación (HU-05-AC-3, RF-15-AC-1) | ≥ 45 de 50 descripciones etiquetadas | Reporte del script de evaluación |
| M-4 | Flujo de punta a punta en móvil | Registro → consentimiento → conversación → oficio asignado o solicitud de soporte, a 360 × 640 px sin desplazamiento horizontal (RNF-02-AC-1, parte web) | Demo en vivo |
| M-5 | Continuidad de la conversación | La conversación se recupera completa tras cerrar y reabrir la sesión (RNF-13-AC-1) | Prueba guiada en la demo |
| M-6 | Calidad | Ambas historias cumplen `definition_of_done.md` | Checklist de la DoD en cada PR |

### 2.2 Por qué este objetivo

- **Sigue el orden de valor y dependencias:** HU-01 no tiene dependencias y habilita todo el backlog; HU-05 solo depende de HU-01.
- **Ataca primero el riesgo mayor:** el agente de IA es el diferenciador del producto y su componente más incierto, porque depende de un servicio externo (RE-04) y debe alcanzar 90 % de exactitud (RF-15). Conviene saberlo antes de invertir en HU-06, HU-08 y el resto del flujo.
- **Deja un incremento usable:** un cliente puede entrar, dar su consentimiento antes de que se traten sus datos (RD-16) y conversar con el agente.

---

## 3. Capacidad del sprint

### 3.1 Compromiso en Story Points

Los Story Points son una medida relativa de esfuerzo, complejidad e incertidumbre y **no equivalen directamente a horas**. Como es el primer sprint, no hay velocidad histórica. El equipo adopta de forma conservadora una capacidad inicial de **11 SP**:

| Historia | Prioridad | SP |
|---|---|---:|
| HU-01 | Alta | 3 |
| HU-05 | Alta | 8 |
| **Total** | | **11 SP** |

Las alternativas se descartaron por dependencias o por tamaño: agregar HU-06 llevaría el compromiso a 19 SP, y HU-09 (3 SP) depende de HU-08 (sección 5).

### 3.2 Verificación de factibilidad en horas

Las horas no definen la capacidad en SP; solo comprueban que el compromiso cabe en el tiempo disponible.

| Concepto | Horas | Base |
|---|---:|---|
| Horas brutas del equipo | **68** | 4 integrantes × 8.5 h × 2 semanas. El número de integrantes se infiere de los cuatro SRS individuales; **confirmar en el Planning**. |
| (−) Eventos Scrum | 16 | 4 h por integrante: Planning, Dailies, Review y Retrospectiva |
| (−) Reserva para imprevistos | 6 | ≈ 9 % de las horas brutas |
| **Horas disponibles para el trabajo técnico** | **46** | |
| Horas estimadas en `tareas_tecnicas.md` | **46** | 8 h de habilitadores + 10.5 h de HU-01 + 27.5 h de HU-05 |

**Conclusión:** el compromiso de 11 SP es factible sin holgura adicional, por lo que **no se agregan más historias**. Al cierre del sprint se registrarán los SP realmente terminados (según la DoD) como primera referencia de velocidad.

**Sensibilidad:** si las 8 a 9 h semanales fueran para todo el equipo y no por integrante, habría unas 17 h. Solo cabrían los habilitadores y HU-01, y el Sprint Goal tendría que reducirse a “registro con consentimiento”.

---

## 4. Historias seleccionadas

### 4.1 HU-01 — Registro con cuenta y consentimiento

| Campo | Valor |
|---|---|
| Épica | EP-01 — Cuentas, confianza y privacidad |
| Prioridad / SP | Alta / 3 SP |
| Dependencias | Ninguna |
| RF | RF-01, RF-02 |

> **Como** cliente, trabajador u organización de contratistas, **quiero** registrarme con una cuenta aceptando el aviso de privacidad, **para** usar la plataforma en web y en la app con mis datos tratados según lo que acepté.

**Por qué se selecciona:**
- Es la base sin dependencias: RNF-03 exige autenticación para cualquier solicitud, y habilita HU-05.
- RD-16 exige el consentimiento **antes** de tratar datos personales, por lo que debe existir antes de que el agente reciba la primera descripción.

**Criterios comprometidos:**

| Criterio de la historia | Criterios del SRS |
|---|---|
| HU-01-AC-1 — Registro con consentimiento, versión del aviso e inicio de sesión | RF-01-AC-1, RF-02-AC-1 |
| HU-01-AC-2 — Sin consentimiento no se crea la cuenta | RF-02-AC-2 |
| HU-01-AC-3 — Credenciales incorrectas o rol de administrador en el registro público | RF-01-AC-2, RF-01-AC-3 |
| HU-01-AC-4 — Nueva aceptación ante una nueva versión del aviso | RF-02-AC-3 |

**RNF que aplican:** RNF-01-AC-2, RNF-03-AC-1, RNF-11-AC-1, RNF-11-AC-3 y RNF-14-AC-1.

**Acuerdo de alcance (requiere confirmación del PO en el Planning):** la historia y RF-01-AC-1 mencionan la web **y la app nativa** (RE-01, RNF-02-AC-2). En este sprint, HU-01 se entrega y se acepta **en la aplicación web**, sobre un servicio de autenticación que la app nativa reutilizará. La verificación en la app nativa queda como trabajo pendiente explícito, registrado en el issue de HU-01. Si el PO no acepta esta división, HU-01 no puede cumplir la DoD en este sprint (riesgo R-3).

### 4.2 HU-05 — Describir mi necesidad conversando con el agente

| Campo | Valor |
|---|---|
| Épica | EP-02 — Solicitud guiada por el agente |
| Prioridad / SP | Alta / 8 SP |
| Dependencias | HU-01 |
| RF | RF-13, RF-14, RF-15, RF-19, RF-22, RF-25 |

> **Como** cliente, **quiero** describir mi trabajo en una conversación sencilla, una pregunta a la vez, y poder pedir ayuda a una persona si no me entienden, **para** expresar mi necesidad sin llenar formularios complicados.

**Por qué se selecciona:**
- Valida pronto una capacidad diferenciadora y de alta incertidumbre técnica.
- Solo depende de HU-01 y habilita HU-06.
- Se prefirió sobre HU-02 (también Alta y dependiente solo de HU-01) para reducir antes la incertidumbre de la IA.

**Criterios comprometidos:**

| Criterio de la historia | Criterios del SRS |
|---|---|
| HU-05-AC-1 — El agente se identifica como asistente y hace una pregunta a la vez | RF-13-AC-1, RF-14-AC-1, RF-14-AC-2 |
| HU-05-AC-2 — Repregunta o pide foto ante ambigüedad; dato “desconocido” sin bloquear | RF-19-AC-1, RF-14-AC-5 |
| HU-05-AC-3 — Al menos 45 de 50 clasificaciones correctas | RF-15-AC-1 |
| HU-05-AC-4 — Oferta de soporte tras 2 intentos o 2 aclaraciones; el caso se registra con resumen | RF-22-AC-1, RF-22-AC-2, RF-15-AC-3 |
| HU-05-AC-5 — Indicador “procesando” a los 2 segundos | RF-25-AC-1 |

**RNF y reglas que aplican:**
- RNF-02-AC-1 (parte de la conversación en móvil).
- RNF-07-AC-1 (uso consentido de las conversaciones).
- RNF-08-AC-3 (las respuestas de IA quedan fuera del umbral de 3 s).
- RNF-13-AC-1 (continuidad ante desconexión).
- RD-07 (la IA no decide por el cliente), RD-18 (catálogo de 10 oficios) y RE-04 (servicio de IA externo).

**Precisión de alcance:** HU-05-AC-4 exige que el caso de soporte quede “disponible para el administrador”. En este sprint, el caso se **registra y se puede consultar** (por API o en un listado simple). La pantalla de administración con segundo factor (RNF-11-AC-2) llega con HU-03, que es la primera historia en la que el administrador opera.

---

## 5. Coherencia con el Product Backlog

Secuencia prevista: **HU-01 Registro y consentimiento → HU-05 Conversación guiada → HU-06 Solicitud confirmada → búsqueda y contratación.**

| HU | SP | Ranking PO | Motivo para dejarla fuera del Sprint 1 |
|---|---:|---:|---|
| HU-06 — Completar y confirmar mi solicitud | 8 | 3 | Depende de HU-05 y elevaría el compromiso a 19 SP. Primera candidata del Sprint 2. |
| HU-02 — Perfil de proveedor | 8 | 4 | Alternativa válida (Alta, depende de HU-01), pero no reduce el riesgo de la IA. Segunda candidata del Sprint 2. |
| HU-08 — Encontrar y comparar proveedores | 8 | 5 | Depende de HU-02 y HU-06. |
| HU-09 — Elegir proveedor | 3 | 6 | Cabría por tamaño, pero depende de HU-08. |
| HU-03, HU-04, HU-07, HU-10 a HU-15 | — | 7 a 15 | Dependen del flujo de contratación o tienen menor prioridad. |

---

## 6. Definition of Ready y Definition of Done

### 6.1 Ready (antes de iniciar cada historia)

| Condición | HU-01 | HU-05 |
|---|---|---|
| Historia en formato Como / quiero / para, con criterios trazados al SRS | Sí | Sí |
| Dependencias resueltas | Sí (ninguna) | Sí (HU-01 se hace primero) |
| Texto del aviso de privacidad v1 (puede ser provisional; PV-08 abierto) | **Día 1** | — |
| Catálogo de 10 oficios (RD-18) | — | Sí |
| Conjunto de 50 descripciones etiquetadas (RF-15-AC-1) | — | **Día 3** |
| Acceso al servicio de IA (spike T-00.6) | — | **Día 2** |

### 6.2 Done

Aplica `definition_of_done.md` v1.0 (sin CI/CD completo), en sus tres niveles: tarea, historia e incremento. Una historia que no cumple la DoD no cuenta para la velocidad y regresa al Product Backlog.

---

## 7. Riesgos principales

| ID | Riesgo | Impacto | Tratamiento |
|---|---|---|---|
| R-1 | La clasificación no alcanza 45/50 | HU-05 no cumple AC-3 | Medir desde el día 4 y en la revisión de mitad de sprint (día 6). Ajustar instrucciones y ejemplos; **el umbral no se reduce** sin decisión del PO. |
| R-2 | El conjunto de 50 descripciones llega tarde | Bloquea la medición de M-3 | Se solicita el día 1, con fecha límite el día 3. |
| R-3 | El PO no acepta entregar HU-01 solo en web | HU-01 no cumple la DoD | Acordarlo en el Planning (sección 4.1); si no se acepta, se re-estima HU-01 y se reduce el compromiso. |
| R-4 | Retraso de HU-01 | Bloquea HU-05 | HU-01 se hace primero; meta: “Done” el día 5. |
| R-5 | Falla o latencia del servicio de IA | Afecta la conversación y la demo | Manejo de error y tiempo de espera (T-05.1); indicador “procesando” (RF-25); RNF-08-AC-3 excluye la IA del umbral de 3 s. |
| R-6 | Sobrestimación de capacidad (primer sprint) | Historias incompletas | Compromiso conservador y reserva de 6 h. Si el día 6 hay más de 30 % de desvío, se negocia con el PO recortar alcance sin abandonar el Sprint Goal. |
| R-7 | El aviso de privacidad definitivo depende de una revisión legal (PV-08) | Cambios posteriores al texto | Se publica el texto provisional como v1; RF-02-AC-3 permite publicar después la v2. |
| R-8 | Un criterio de aceptación no se cumple | La HU no está terminada | Se aplica la DoD; no se contabilizan SP parciales. |

---

## 8. Calendario

| Día | Fecha | Hito |
|---|---|---|
| 1 | Lun 5 oct | Sprint Planning; se acuerdan el Sprint Goal y el alcance web de HU-01; se piden el conjunto de datos y el aviso v1 |
| 2 | Mar 6 oct | Habilitadores listos; resultado del spike de IA |
| 3 | Mié 7 oct | Conjunto de 50 descripciones recibido |
| 5 | Vie 9 oct | HU-01 “Done” |
| 6 | Lun 12 oct | Revisión de mitad de sprint: avance y primera medición de exactitud |
| 9 | Jue 15 oct | HU-05 completa; verificación de la DoD |
| 10 | Vie 16 oct | Sprint Review (M-1 a M-6) y Retrospectiva; se registra la velocidad real |

---

## 9. Roles Scrum

- **Product Owner:** maximiza el valor, ordena el Product Backlog y aclara historias y criterios. Participa en la definición del Sprint Goal, confirma los acuerdos de alcance (sección 4.1) y prepara el conjunto de datos de negocio con apoyo de QA.
- **Scrum Master:** facilita el Sprint Planning, promueve la correcta aplicación de Scrum y ayuda a remover impedimentos. El agente de IA es un apoyo analítico y **no sustituye al Scrum Master**.
- **Developers:** deciden cuánto trabajo pueden asumir y cómo convertir las historias en un incremento que cumpla la DoD. Backend Dev, Frontend Dev, IA Dev, QA y DevOps son responsabilidades técnicas dentro de los Developers, no roles adicionales de Scrum.

---

## 10. Trazabilidad resumida

| HU | RF | Criterios del SRS |
|---|---|---|
| HU-01 | RF-01, RF-02 | RF-01-AC-1 a AC-3, RF-02-AC-1 a AC-3 |
| HU-05 | RF-13, RF-14, RF-15, RF-19, RF-22, RF-25 | RF-13-AC-1, RF-14-AC-1, RF-14-AC-2, RF-14-AC-5, RF-15-AC-1, RF-15-AC-3, RF-19-AC-1, RF-22-AC-1, RF-22-AC-2, RF-25-AC-1 |
| Ambas | — | RNF-01-AC-2, RNF-02-AC-1 (parcial), RNF-03-AC-1, RNF-07-AC-1, RNF-08-AC-3, RNF-11-AC-1, RNF-11-AC-3, RNF-13-AC-1, RNF-14-AC-1 |

**Avance del producto al cerrar el sprint:** 2 de 15 historias, 11 de 95 SP y 8 de 55 RF.

---

## 11. Acuerdo final

- **Periodo:** 5 al 16 de octubre de 2026.
- **Sprint Goal:** registro con consentimiento y descripción guiada por el agente de IA, con clasificación ≥ 45/50 y oferta de soporte (sección 2).
- **Compromiso:** HU-01 (3 SP) + HU-05 (8 SP) = **11 SP**.
- **Éxito:** medidas M-1 a M-6, que incluyen los 9 criterios de aceptación y la DoD.
- **Alcance:** HU-01 se acepta en la web (pendiente de confirmación del PO).
- **Revisión de capacidad:** al cierre del sprint, con la velocidad real.

La descomposición técnica está en `tareas_tecnicas.md` y la DoD en `definition_of_done.md`.
