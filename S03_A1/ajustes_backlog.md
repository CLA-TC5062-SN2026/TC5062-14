# Ajustes al backlog — revisión crítica del equipo

**Fuentes:** `SRS_equipo.md` (fuente de verdad funcional) y `backlog_completo.md` (backlog final; contiene la propuesta inicial generada por IA con los ajustes de este documento ya aplicados).

Este documento registra qué propuso la IA, qué revisó el equipo y qué decidió ajustar. No se agregaron historias ni se modificó la cobertura de RF.

---

## 1. Revisión general

La propuesta inicial de la IA tenía:

| Elemento | Valor |
|---|---|
| Épicas | 5 (EP-01 a EP-05) |
| Historias de usuario | 15 (HU-01 a HU-15) |
| RF cubiertos | 55/55 |
| Story Points totales | 95 |
| Historia más grande | 8 SP (ninguna supera ese valor) |

El equipo revisó cada historia en estos aspectos:

- **Redacción:** formato Como / quiero / para, con un actor humano y un valor claro.
- **Agrupación de requisitos:** cohesión de los RF dentro de cada historia y dentro de su épica.
- **Prioridad:** si la historia es necesaria para el flujo principal o para el mecanismo de confianza del MVP.
- **Story Points:** complejidad relativa y que las justificaciones no supongan decisiones técnicas que el SRS no toma.
- **Dependencias:** que reflejen con precisión las reglas aprobadas.
- **Coherencia con `SRS_equipo.md`:** que los criterios de aceptación se deriven de los criterios de los RF cubiertos.
- **Alcance:** que no haya funcionalidades posteriores (FP), pendientes resueltos (PV) ni funcionalidad nueva.

---

## 2. Ajustes aprobados

### AJ-01 — Prioridad de HU-03

**Historia:** HU-03 — Verificar identidad, experiencia y organizaciones.

**Propuesta de IA:** prioridad Media.

**Decisión del equipo:** cambiar la prioridad a **Alta**.

**Justificación:** La verificación forma parte del mecanismo principal de confianza de la plataforma y alimenta la selección y el filtrado de proveedores. No crea por sí sola una solicitud ni una contratación, pero es esencial para que el cliente decida con información dentro del MVP.

**Story Points:** se mantienen en 5.

---

### AJ-02 — Justificación de Story Points de HU-07

**Historia:** HU-07 — Visualizar el alcance con imágenes de referencia.

**Propuesta de IA:** 5 SP. La justificación se apoyaba en parte en que la historia depende de un servicio externo de generación de imágenes.

**Problema detectado:** `SRS_equipo.md` exige una representación visual generada por IA, pero no establece que deba implementarse con un servicio externo. La justificación introducía una suposición de arquitectura.

**Decisión del equipo:** mantener 5 SP y eliminar la suposición de arquitectura.

**Nueva justificación:** La estimación refleja la complejidad relativa de generar contenido visual mediante IA, gestionar el resultado y presentarlo de forma comprensible al usuario. No se presupone una arquitectura ni un proveedor tecnológico específico.

---

### AJ-03 — Dependencia de HU-10 respecto de HU-11

**Historia:** HU-10 — Agendar citas confirmadas por ambas partes.

**Propuesta de IA:** HU-10 depende de HU-11.

**Revisión del equipo:** La dependencia no aplica a todas las citas. Una cita de visita puede confirmarse antes de que exista una propuesta aceptada; solo la cita de ejecución la requiere (RF-34-AC-6; DEC-84 y DEC-88).

**Decisión del equipo:** cambiar la dependencia a:

> Dependencia parcial de HU-11: únicamente para confirmar una cita de ejecución. Las citas de visita pueden ocurrir antes de la propuesta.

Así se conserva el comportamiento aprobado en las decisiones del equipo.

---

### AJ-04 — Tamaño de HU-12

**Historia:** HU-12 — Decidir sobre los cambios de costo, material, alcance o fecha.

**Propuesta de IA:** 8 SP.

**Revisión del equipo:** La historia concentra varios estados, plazos de respuesta, contrapropuestas y solicitudes de cambio iniciadas tanto por el cliente como por el proveedor.

**Decisión del equipo:** mantener 8 SP.

**Justificación:** Es la historia funcionalmente más compleja del backlog, pero sigue dentro de la escala permitida y representa un objetivo de negocio cohesionado: controlar los cambios al acuerdo vigente. No se divide en esta etapa.

---

## 3. Elementos revisados sin modificación

El equipo también revisó y conservó sin cambios:

| Elemento | Motivo para conservarlo |
|---|---|
| Las cinco épicas | Agrupan capacidades de negocio coherentes y ya habían sido aprobadas. |
| Las demás prioridades | Reflejan correctamente qué historias son necesarias para el flujo principal (Alta), cuáles aportan valor sin bloquearlo (Media) y cuál es una mejora (Baja). |
| Los demás Story Points | Son consistentes entre sí en complejidad relativa, y sus justificaciones no suponen decisiones técnicas ajenas al SRS. |
| Cobertura RF → historia | Cubre los 55 RF, cada uno con una sola historia principal y dentro de su épica aprobada. |
| Criterios de aceptación | Cada criterio se deriva de criterios existentes en `SRS_equipo.md` de los RF cubiertos por la historia. |
| Dependencias restantes | Reflejan el orden real del flujo; no se encontraron dependencias incorrectas además de la de HU-10. |

No se encontraron razones suficientes para modificar estos elementos.

---

## 4. Tabla antes/después

| Elemento | Propuesta IA | Decisión del equipo | Cambio |
|---|---|---|---|
| HU-03 prioridad | Media | Alta | Sí |
| HU-03 SP | 5 | 5 | No |
| HU-07 SP | 5 | 5 | No |
| HU-07 justificación | Presupone un servicio externo | Neutral respecto de la arquitectura | Sí |
| HU-10 dependencia | Depende de HU-11 | Dependencia parcial (solo para la cita de ejecución) | Sí |
| HU-12 SP | 8 | 8 | No |

---

## 5. Actualización de `backlog_completo.md`

En `backlog_completo.md` se aplicaron únicamente estos cambios:

1. Prioridad de HU-03: Media → Alta, en la historia y en la tabla resumen.
2. Justificación de estimación de HU-07.
3. Dependencia de HU-10.

No se modificaron IDs, épicas, redacción de historias, asignación de RF, criterios de aceptación ni Story Points. HU-12 permanece sin cambios.

---

## 6. Validación posterior

| Verificación | Resultado |
|---|---|
| Historias | 15 |
| IDs | HU-01 a HU-15, sin huecos |
| RF cubiertos | 55/55 |
| RF sin historia principal | 0 |
| RF con más de una historia principal | 0 |
| Story Points totales | 95 |
| Story Points en escala Fibonacci | 100 % |
| FP utilizados como alcance | 0 |
| PV resueltos accidentalmente | 0 |
| Funcionalidad nueva | 0 |
| Prioridades | Alta 12, Media 2, Baja 1 |

**Resultado: OK, 0 errores.**
