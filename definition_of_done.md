# Definition of Done (DoD) — UnCalificado

| Campo | Valor |
|---|---|
| Versión vigente | **1.0**, aplicable desde el Sprint 1 (5 de octubre de 2026) |
| Fuente funcional | `SRS_equipo.md` |
| Relacionados | `sprint1_planning.md`, `tareas_tecnicas.md`, `backlog_completo.md` |
| Revisión | Al final de cada Retrospectiva; próximo ajuste previsto cuando exista el CI (sección 8) |
| Estado | Final (consolidación de las dos propuestas del equipo) |

---

## 1. Propósito

La Definition of Done es el acuerdo de calidad que debe cumplir **todo** incremento para considerarse terminado. Se distingue de los criterios de aceptación:

| Concepto | Qué define | Alcance |
|---|---|---|
| Criterios de aceptación (`HU-XX-AC-N`, `RF-XX-AC-N`) | **Qué** debe hacer una historia específica | Una historia |
| Definition of Done | **Con qué calidad** se entrega | Todas las historias |

Reglas de aplicación:

- Una historia que no cumple **todos** los puntos de la DoD **no está Done**: sus SP no cuentan como velocidad y regresa al Product Backlog. No hay crédito parcial.
- Un punto solo puede marcarse **“no aplica”** si la historia no toca esa área (por ejemplo, DoD-15 en una historia sin endpoints nuevos). La justificación se escribe en el issue.
- Una condición **no se elimina para poder cerrar una historia**. Si el equipo concluye que un punto no es realista, lo cambia en la Retrospectiva y lo registra en el historial (sección 10).

---

## 2. Cómo se llegó a la versión 1.0

1. **Propuesta inicial (v0.1, 16 puntos):** un estándar ideal con pipeline de CI, cobertura de 80 %, pruebas E2E automatizadas, prueba de carga, despliegue automático a producción, WCAG 2.1 AA y escaneo automático de dependencias.
2. **Revisión del Product Owner (simulado):** se revisó contra el contexto real del equipo: 4 integrantes con 8 a 9 h por semana, sin CI/CD completo y con un primer Sprint Goal centrado en el agente de IA. El criterio del PO fue preferir pocos puntos verificables y cumplidos en cada historia a una lista ideal que se incumple.
3. **Versión 1.0:** conserva criterios verificables de código, pruebas, trazabilidad, seguridad, privacidad y documentación, y **permite evidencia local o manual mientras no exista CI/CD completo**.

| Punto de la v0.1 | Decisión | Resultado en v1.0 |
|---|---|---|
| Revisión de código por otro integrante | Se mantiene | DoD-05 |
| Lint sin errores | Se ajusta: ejecución local con evidencia | DoD-06 |
| Pipeline de CI en verde | Se pospone; se sustituye por un comando único de pruebas local con evidencia | DoD-06; sección 8 |
| Prueba automatizada por criterio, con su ID | Se mantiene; es la clave de trazabilidad del curso (S04-A2, S09-A1) | DoD-01, DoD-02 |
| Cobertura ≥ 80 % | Se elimina como umbral: incentiva pruebas vacías; puede reportarse como dato informativo | — |
| Pruebas de integración de API | Se fusionan con las pruebas por criterio | DoD-02 |
| Pruebas E2E automatizadas | Se ajustan: prueba manual guiada con checklist | DoD-07 |
| Prueba de carga RNF-08 | Se pospone al nivel de release | Sección 8 |
| Móvil, validación junto al campo, localización | Se mantienen | DoD-08 |
| Seguridad y escaneo de dependencias | Se ajustan: pruebas de acceso por historia; escaneo manual una vez por sprint | DoD-10, DoD-11, DoD-S5 |
| WCAG 2.1 AA | Se ajusta: accesibilidad básica de 4 puntos | DoD-13 |
| Despliegue automático (CD) | Se ajusta: despliegue manual documentado con prueba de humo | DoD-07 |
| `openapi.yaml` con `x-acceptance-criteria` | Se mantiene; se acepta un borrador | DoD-15 |
| Issue en Done con PR enlazado y README | Se mantiene | DoD-14, DoD-16 |
| Sin defectos críticos ni altos | Se mantiene, con severidades definidas | DoD-17, sección 5 |
| Aceptación del PO | Se reformula (sección 9): la DoD exige que la historia sea demostrable en la Review | DoD-18 |
| *Nuevo:* datos de prueba ficticios y consentimiento | Agregado por el PO | DoD-12 |
| *Nuevo:* IA verificable | Agregado por el PO | DoD-03 |
| *Nuevo:* errores controlados | Agregado en la consolidación | DoD-09 |
| *Nuevo:* cambios de alcance escritos en el issue | Agregado por el PO | DoD-14 |

---

## 3. DoD a nivel tarea

Para mover una tarea técnica a Done en el GitHub Project:

- [ ] **DoD-T1.** Se cumple el criterio de Done definido para la tarea en `tareas_tecnicas.md`.
- [ ] **DoD-T2.** El cambio o la evidencia identifica el ID de la tarea y la historia relacionada (PR, commit o comentario en el sub-issue).

---

## 4. Definition of Done a nivel historia

### Funcionalidad y pruebas

- [ ] **DoD-01. Criterios satisfechos.** Todos los criterios `HU-XX-AC-N` de la historia están implementados y verificados.
- [ ] **DoD-02. Evidencia por criterio.**
  - Cada criterio tiene una prueba automatizada llamada `test_HU_XX_AC_N`, con los IDs `RF-XX-AC-N` del SRS en su docstring, y todas pasan.
  - Excepciones: los criterios cuantitativos de evaluación con datos (por ejemplo, HU-05-AC-3) se verifican con su script y deben alcanzar su umbral; los criterios de inspección se verifican con un checklist firmado en el PR.
- [ ] **DoD-03. IA verificable.** Si la historia involucra IA:
  - las instrucciones y la configuración del agente están versionadas en el repositorio;
  - las pruebas de flujo usan el doble de prueba del servicio de IA;
  - los resultados cuantitativos de evaluación se conservan como evidencia en el PR.

### Código

- [ ] **DoD-04. Código integrado y ejecutable.** El código está en `main`, integrado mediante PR, y se ejecuta en el entorno del equipo sin errores bloqueantes.
- [ ] **DoD-05. Revisión.** El PR fue revisado y aprobado por al menos otro integrante, distinto del autor.
- [ ] **DoD-06. Calidad local.** Mientras no exista CI, antes del merge se ejecutan localmente el lint y el **comando único de pruebas** (la suite completa, no solo la de la historia). La salida de ambos se pega en el PR.

### Interfaz e integración

- [ ] **DoD-07. Desplegado y demostrable.** La historia está desplegada en el ambiente de pruebas con el procedimiento documentado en el README y pasó la prueba de humo: la página carga por HTTPS (RE-09), `/health` responde y se puede iniciar sesión. El flujo de la historia se probó de punta a punta con una prueba manual guiada, cuyo checklist (fecha y responsable) queda en el PR.
- [ ] **DoD-08. Móvil y localización.** Las pantallas del alcance funcionan en un celular o a **360 × 640 px** sin desplazamiento horizontal (RNF-02-AC-1); los errores de validación aparecen junto a su campo (RNF-01-AC-2); las fechas, horas y montos siguen RNF-14-AC-1.
- [ ] **DoD-09. Errores controlados.** Las validaciones y las integraciones (incluido el servicio de IA) muestran un mensaje comprensible. Un error controlado no provoca la pérdida del flujo ni de la información capturada.

### Seguridad y privacidad

- [ ] **DoD-10. Acceso.** Los endpoints nuevos rechazan peticiones sin autenticar y a usuarios que no son dueños del recurso ni tienen el rol autorizado, sin revelar datos (RNF-03-AC-1, RNF-04). Hay al menos una prueba que lo demuestra.
- [ ] **DoD-11. Sin secretos.** No hay contraseñas, tokens ni credenciales en el repositorio.
- [ ] **DoD-12. Datos de prueba y consentimiento.** Las pruebas, los conjuntos de datos y las demos usan solo datos ficticios. Si la historia trata datos personales, depende de un consentimiento registrado (RD-16).

### Accesibilidad básica

- [ ] **DoD-13.**
  - Todos los campos tienen etiqueta visible y comprensible.
  - Los errores se comunican con texto, no solo con color.
  - Los formularios del flujo se pueden completar con teclado.
  - El texto es legible sin zoom a 360 px de ancho.

### Documentación y trazabilidad

- [ ] **DoD-14. Issue completo.** El issue de la historia identifica sus criterios de aceptación; sus tareas técnicas están vinculadas como sub-issues en el GitHub Project; cualquier cambio de alcance acordado con el PO está escrito en el issue.
- [ ] **DoD-15. API documentada.** Todo endpoint nuevo aparece en `openapi.yaml` (se acepta un borrador) con `x-acceptance-criteria: [RF-XX-AC-N, …]`.
- [ ] **DoD-16. Rastreabilidad y documentación.** Los PR y commits están enlazados al issue, y el README está actualizado con lo necesario para ejecutar, probar y desplegar el incremento.

### Calidad final

- [ ] **DoD-17. Sin defectos bloqueantes.** No hay defectos abiertos de severidad crítica o alta asociados a la historia (sección 5). Los de severidad media o baja quedan registrados como issues.
- [ ] **DoD-18. Demostrable en la Sprint Review.** La historia puede demostrarse en la Review con sus criterios de aceptación a la vista.

---

## 5. Severidad de defectos

| Severidad | Definición | Bloquea la DoD |
|---|---|---|
| Crítica | Exposición o pérdida de datos personales, acceso a recursos de otro usuario, o caída del flujo principal | Sí |
| Alta | Un criterio de aceptación no se cumple, o el flujo de la historia no puede completarse | Sí |
| Media | El flujo se completa, pero con un error visible o un paso alterno | No; se registra |
| Baja | Detalle visual o de texto | No; se registra |

---

## 6. DoD a nivel incremento (al cierre del sprint)

- [ ] **DoD-S1.** Las historias Done funcionan conjuntamente en la versión integrada (`main`).
- [ ] **DoD-S2.** La suite completa de pruebas pasa sobre la versión integrada.
- [ ] **DoD-S3.** El incremento está desplegado en el ambiente de pruebas y pasó la prueba de humo el día de la Review.
- [ ] **DoD-S4.** Las medidas del Sprint Goal están evaluadas y documentadas.
- [ ] **DoD-S5.** Se ejecutó una vez el escaneo manual de dependencias. No hay vulnerabilidades críticas, o las que existan están registradas con un plan.
- [ ] **DoD-S6.** Están registradas la velocidad real (SP de historias Done) y la deuda técnica conocida.

---

## 7. Aplicación al Sprint 1

- **HU-01** solo es Done cuando se demuestran sus cuatro criterios en la aplicación web, según el acuerdo de alcance de `sprint1_planning.md`, sección 4.1:
  1. registro válido con consentimiento y versión del aviso;
  2. rechazo sin consentimiento;
  3. rechazo de credenciales incorrectas y del rol de administrador en el registro público;
  4. nueva aceptación cuando cambia la versión del aviso.
- **HU-05** solo es Done cuando se demuestran sus cinco criterios:
  1. identificación del agente y una pregunta a la vez;
  2. manejo de ambigüedad y datos desconocidos;
  3. **≥ 45/50** clasificaciones correctas;
  4. oferta de soporte con resumen tras los intentos definidos;
  5. indicador “procesando” después de 2 segundos sin respuesta.
- Al cierre del sprint se revisan **DoD-S1 a DoD-S6** junto con las medidas M-1 a M-6 del Sprint Goal.

---

## 8. Elementos pospuestos y cuándo se reincorporan

Por el contexto actual no son obligatorios todavía. Posponerlos **no** elimina la obligación de producir un incremento ejecutable, probado, trazable y documentado.

| Elemento pospuesto | Condición para reincorporarlo | Cambio previsto en la DoD |
|---|---|---|
| Pipeline de CI (lint y pruebas en cada PR) | Cuando el pipeline esté configurado; objetivo: Sprint 3 | DoD-06 pasa a “CI en verde en el PR” y deja de exigirse la evidencia manual |
| Despliegue automático | Cuando haya CI y un ambiente estable | DoD-07 pasa a “desplegado automáticamente tras el merge” |
| Despliegue a producción | Antes del piloto | Se crea una DoD de release |
| Pruebas E2E automatizadas | Cuando el flujo cliente → solicitud → búsqueda esté estable (después de HU-08) | Se agrega una prueba E2E del flujo principal |
| Prueba de carga de RNF-08 | Antes del piloto | Criterio de release: RNF-08-AC-1 y AC-2 con 100 usuarios concurrentes |
| Escaneo automático de dependencias | Con el CI | DoD-S5 se ejecuta en cada PR |
| Umbral de cobertura de código | Solo si la Retrospectiva lo decide | — |
| Auditoría WCAG 2.1 AA | Antes del piloto, si el PO lo prioriza | Criterio de release |
| Verificación en la app nativa (RE-01, RNF-02-AC-2) | Cuando exista el esqueleto de la app | DoD-07 y DoD-08 incluyen la app nativa |

---

## 9. Responsabilidades Scrum

- **Developers:** crean el incremento y son responsables de que cumpla la DoD: implementación, pruebas, integración y documentación.
- **Product Owner:** aporta claridad sobre el valor y el Product Backlog. En la Sprint Review evalúa si el incremento aporta el valor esperado y adapta el Product Backlog. **La opinión del PO sobre el valor no reemplaza la DoD**, y la DoD no reemplaza la conversación sobre valor.
- **Scrum Master:** facilita que la DoD se entienda y se aplique con consistencia, y ayuda a gestionar impedimentos.

La DoD es un acuerdo compartido de calidad y transparencia; no depende de que una sola persona declare que el trabajo está terminado.

---

## 10. Historial de versiones

| Versión | Fecha | Cambio | Quién |
|---|---|---|---|
| 0.1 | 4 oct 2026 | Propuesta inicial (16 puntos, estándar ideal) | Equipo |
| 1.0 | 4 oct 2026 | Ajustada tras la revisión del PO y consolidada entre las dos propuestas del equipo: 2 puntos de tarea, 18 de historia y 6 de incremento; sin CI/CD completo | PO simulado y equipo; confirmar en la Sprint Planning |

---

## Anexo — Checklist para la descripción del PR

```markdown
### Definition of Done (v1.0)
- [ ] DoD-01 Criterios HU-XX-AC-N implementados y verificados
- [ ] DoD-02 Pruebas `test_HU_XX_AC_N` en verde / script con umbral / checklist de inspección
- [ ] DoD-03 IA: instrucciones versionadas, doble de prueba, métricas adjuntas (si aplica)
- [ ] DoD-04 Integrado en main y ejecutable
- [ ] DoD-05 Aprobado por otro integrante
- [ ] DoD-06 Lint + comando único de pruebas locales en verde (salidas abajo)
- [ ] DoD-07 Desplegado en pruebas + prueba de humo + prueba manual guiada
- [ ] DoD-08 360 × 640, validación junto al campo, localización
- [ ] DoD-09 Errores controlados
- [ ] DoD-10 Acceso por autenticación y propiedad probado
- [ ] DoD-11 Sin secretos
- [ ] DoD-12 Datos ficticios; consentimiento si hay datos personales
- [ ] DoD-13 Accesibilidad básica (4 puntos)
- [ ] DoD-14 Issue con criterios, sub-issues y cambios de alcance
- [ ] DoD-15 Endpoints en openapi.yaml con x-acceptance-criteria
- [ ] DoD-16 PR/commits enlazados; README actualizado
- [ ] DoD-17 Sin defectos críticos ni altos
- [ ] DoD-18 Lista para demostrarse en la Review

**Tarea(s):** T-XX.N · **Historia:** HU-XX
**Criterios cubiertos:** HU-XX-AC-N → RF-XX-AC-N
**Salida de lint:** …
**Salida de pruebas:** …
```
