# Priorización comparada del Product Backlog

**Fuentes:** `SRS_equipo.md`, `backlog_completo.md` y `ajustes_backlog.md`.

## 1. Contexto

El Product Backlog de UnCalificado tiene **15 historias de usuario** (HU-01 a HU-15), repartidas en 5 épicas y con un total de 95 Story Points.

El equipo asignó a cada historia una prioridad Alta, Media o Baja; la prioridad de HU-03 se ajustó después de la revisión crítica (`ajustes_backlog.md`, AJ-01). Más tarde se pidió a una IA que asumiera el rol de **Product Owner simulado** y ordenara las historias del 1 al 15 según su valor de negocio para el MVP. Para ello consideró:

- el valor para el usuario y el flujo principal;
- las dependencias entre historias;
- la reducción de riesgo, la confianza y la privacidad;
- el aprendizaje temprano;
- la complejidad relativa.

**La priorización de la IA es una recomendación y no sustituye la decisión del equipo.**

---

## 2. Priorización del equipo

| HU | Épica | Prioridad equipo | SP |
|---|---|---|---:|
| HU-01 | EP-01 | Alta | 3 |
| HU-02 | EP-01 | Alta | 8 |
| HU-03 | EP-01 | Alta | 5 |
| HU-04 | EP-01 | Alta | 8 |
| HU-05 | EP-02 | Alta | 8 |
| HU-06 | EP-02 | Alta | 8 |
| HU-07 | EP-02 | Baja | 5 |
| HU-08 | EP-03 | Alta | 8 |
| HU-09 | EP-03 | Alta | 3 |
| HU-10 | EP-03 | Alta | 8 |
| HU-11 | EP-04 | Alta | 5 |
| HU-12 | EP-04 | Alta | 8 |
| HU-13 | EP-04 | Media | 5 |
| HU-14 | EP-05 | Alta | 8 |
| HU-15 | EP-05 | Media | 5 |

---

## 3. Priorización propuesta por el Product Owner simulado

| Ranking PO | HU | Épica | Historia resumida | Prioridad actual del equipo | SP | Justificación PO |
|---:|---|---|---|---|---:|---|
| 1 | HU-01 | EP-01 | Registrarme con cuenta y aceptar el aviso de privacidad | Alta | 3 | Ninguna otra historia funciona sin una cuenta. El consentimiento debe obtenerse antes de tratar los datos personales y además HU-01 habilita el acceso al resto del flujo; su costo relativo es bajo. |
| 2 | HU-05 | EP-02 | Describir mi necesidad conversando con el agente | Alta | 8 | Es el diferenciador del producto. Construirla pronto permite aprender del comportamiento del agente (clasificación, repreguntas, escalamiento), que es el mayor riesgo del producto. |
| 3 | HU-06 | EP-02 | Completar y confirmar mi solicitud | Alta | 8 | Cierra el lado de la demanda: deja una solicitud "confirmada" con los datos mínimos para buscar. Incluye la captura manual, que reduce el riesgo si la IA falla. |
| 4 | HU-02 | EP-01 | Publicar mi perfil de proveedor para que los clientes me encuentren | Alta | 8 | Sin proveedores con perfil y cobertura, la búsqueda no devuelve nada. Habilita el lado de la oferta. |
| 5 | HU-08 | EP-03 | Encontrar y comparar proveedores | Alta | 8 | Es el primer momento en que el cliente percibe valor: recibe de 3 a 4 proveedores compatibles y explicados. |
| 6 | HU-09 | EP-03 | Elegir un proveedor y obtener su aceptación | Alta | 3 | Convierte la recomendación en un compromiso con un proveedor con poco esfuerzo. Habilita propuestas y citas. |
| 7 | HU-11 | EP-04 | Recibir y negociar una propuesta escrita | Alta | 5 | Ataca el problema central (acuerdos informales sobre el costo). Además, es requisito para las citas de ejecución y para el control de cambios. |
| 8 | HU-10 | EP-03 | Agendar citas confirmadas por ambas partes | Alta | 8 | Lleva el acuerdo a una fecha concreta con doble confirmación. Las visitas pueden ir antes de la propuesta, pero las citas de ejecución dependen de HU-11. |
| 9 | HU-12 | EP-04 | Decidir sobre los cambios de costo, material, alcance o fecha | Alta | 8 | Tiene un valor muy alto (el cliente controla su dinero), pero necesita una propuesta aceptada y es la historia más compleja; conviene construirla con el flujo base ya estable. |
| 10 | HU-04 | EP-01 | Controlar cuándo se comparten mi domicilio y mis datos; ejercer ARCO | Alta | 8 | Es indispensable antes de operar con usuarios reales, pero sus disparadores dependen de HU-10 y HU-11. Debe quedar lista antes del piloto. |
| 11 | HU-14 | EP-05 | Seguir y cerrar el trabajo | Alta | 8 | Completa el ciclo hasta "concluido" y habilita las evaluaciones. Solo aporta valor cuando ya existen trabajos acordados y agendados. |
| 12 | HU-03 | EP-01 | Verificar identidad, experiencia y organizaciones | Alta | 5 | Refuerza la confianza, pero como los perfiles no verificados también aparecen en las búsquedas (RF-26, RF-08), el flujo puede probarse sin ella. Debe estar antes del lanzamiento. |
| 13 | HU-15 | EP-05 | Evaluar a la contraparte al concluir | Media | 5 | La reputación se construye con trabajos concluidos, que tardan en acumularse; aporta poco en las primeras iteraciones. |
| 14 | HU-13 | EP-04 | Consultar costos y analizar justificaciones | Media | 5 | Es informativa: el control real de los cambios ya está en HU-12. La consulta y el análisis con IA complementan esa decisión. |
| 15 | HU-07 | EP-02 | Visualizar el alcance con imágenes de referencia | Baja | 5 | Mejora la comunicación, pero ningún paso del flujo principal la necesita; la solicitud funciona con texto, fotos y videos. |

---

## 4. Top 5 del Product Owner

### 1. HU-01 — Registro con cuenta y consentimiento
- **Valor temprano:** permite que los cuatro actores entren a la plataforma y deja registrado el consentimiento con la versión del aviso.
- **Dependencias que habilita:** todas las demás historias requieren un usuario autenticado (RNF-03). HU-02, HU-05 y HU-04 dependen directamente de ella.
- **Riesgo que reduce:** HU-01 es prerrequisito para acceder al producto y para obtener el consentimiento de privacidad antes de tratar datos personales. Además, habilita prácticamente todo el resto del backlog y tiene un costo relativo bajo de 3 Story Points.
- **Por qué antes:** cuesta 3 SP y desbloquea todo el backlog; sin ella no hay forma de probar ninguna otra historia con usuarios.

### 2. HU-05 — Describir mi necesidad conversando con el agente
- **Valor temprano:** es la propuesta diferenciadora de UnCalificado: el cliente describe su necesidad sin formularios complejos.
- **Dependencias que habilita:** alimenta a HU-06 (la solicitud confirmada) y, por medio de ella, a toda la búsqueda.
- **Riesgo que reduce:** el riesgo técnico y de producto más alto. Permite validar pronto si la clasificación alcanza 45 de 50 aciertos (RF-15) y si la regla de los 2 intentos para escalar a soporte (RF-22) funciona con usuarios reales.
- **Por qué antes:** si el agente no funciona como se espera, hay que saberlo antes de invertir en las historias que dependen de la solicitud.

### 3. HU-06 — Completar y confirmar mi solicitud
- **Valor temprano:** el cliente obtiene una solicitud confirmada, con sus fotos y videos, que es la entrada para la búsqueda.
- **Dependencias que habilita:** HU-08 necesita la versión confirmada (RF-20-AC-3), y HU-07 parte de esta solicitud.
- **Riesgo que reduce:** la captura manual (RF-21) evita que el MVP quede bloqueado si la IA no está disponible. Los límites de archivos (RF-18) evitan problemas de almacenamiento desde el inicio.
- **Por qué antes:** sin una solicitud confirmada, la búsqueda y la recomendación no tienen sobre qué operar.

### 4. HU-02 — Perfil de proveedor visible
- **Valor temprano:** los trabajadores y organizaciones pueden darse de alta con su oficio, cobertura y disponibilidad, lo que crea la oferta.
- **Dependencias que habilita:** HU-08 (buscar), HU-03 (verificar perfiles) e, indirectamente, las citas (la disponibilidad de RF-06).
- **Riesgo que reduce:** el de lanzar sin oferta. Si los proveedores no logran completar su perfil, la búsqueda devolverá siempre "sin resultados" (RF-27).
- **Por qué antes:** la búsqueda no puede demostrarse sin perfiles reales en el catálogo de oficios y zonas del piloto (RD-18).

### 5. HU-08 — Encontrar y comparar proveedores
- **Valor temprano:** es el primer resultado tangible para el cliente: de 3 a 4 opciones explicadas que puede filtrar y ordenar.
- **Dependencias que habilita:** HU-09 (elegir proveedor) y, después, propuestas, citas y cambios.
- **Riesgo que reduce:** el de que la recomendación no sea útil. Permite validar la definición de cercanía por cobertura (RD-04) y el filtro por precio, cuya viabilidad sigue abierta (PV-05), sin resolver ese pendiente.
- **Por qué antes:** une la demanda (HU-05 y HU-06) con la oferta (HU-02). A partir de aquí ya existe un flujo demostrable de punta a punta hasta la selección.

---

## 5. Historias de menor prioridad relativa

**Menor ranking no significa que la historia sea innecesaria.** Todas forman parte del MVP; el ranking solo indica menor urgencia relativa dentro de él.

### 13. HU-15 — Evaluar a la contraparte al concluir
La evaluación requiere proyectos concluidos (RF-49, RF-50), y en las primeras iteraciones habrá pocos. Su valor crece con el volumen. Puede construirse después de HU-14, sin bloquear el flujo de contratación.

### 14. HU-13 — Consultar costos y analizar justificaciones
La protección del dinero del cliente ya ocurre en HU-12, porque ningún cambio se aplica sin su decisión. HU-13 agrega visibilidad (presupuesto vigente, versiones) y un análisis informativo que no decide (RD-09). Mejora la decisión, pero el flujo funciona sin ella.

### 15. HU-07 — Visualizar el alcance con imágenes de referencia
Es una ayuda de comunicación que no sustituye planos (RD-08). Ningún otro paso depende de ella y la solicitud puede describirse con texto, fotos y videos (RF-17). Es la mejora con menor impacto en el flujo principal.

---

## 6. Comparación crítica

### Coincidencias

| HU | Prioridad equipo | Ranking PO | Por qué coinciden |
|---|---|---:|---|
| HU-01 | Alta | 1 | Ambos la consideran un prerrequisito del flujo y una capacidad necesaria para gestionar el consentimiento de privacidad antes de tratar datos personales. |
| HU-05 | Alta | 2 | Es el diferenciador del producto y el mayor riesgo que conviene validar pronto. |
| HU-06 | Alta | 3 | Sin una solicitud confirmada no hay búsqueda. |
| HU-02 | Alta | 4 | Sin oferta de proveedores no hay resultados. |
| HU-08 | Alta | 5 | Es el primer valor tangible para el cliente. |
| HU-09 | Alta | 6 | Es corta y habilita propuestas y citas. |
| HU-11 | Alta | 7 | Ataca el problema central de los acuerdos de costo. |
| HU-15, HU-13 | Media | 13, 14 | Ambos las ven como complementos: reputación con volumen y consulta informativa. |
| HU-07 | Baja | 15 | Ambos la consideran una mejora sin impacto en el flujo principal. |

El acuerdo es alto: las 7 primeras posiciones del PO son historias Alta del equipo, y las 3 últimas son exactamente las historias Media y Baja.

### Diferencias

**HU-03 — Verificación de proveedores**
- **Decisión del equipo:** Alta (AJ-01). La verificación es el mecanismo principal de confianza y alimenta la selección y el filtrado.
- **Propuesta del PO:** posición 12, la más baja entre las historias Alta.
- **Explicación de la diferencia:** el PO prioriza demostrar el flujo de punta a punta. Como DEC-06 permite que los perfiles no verificados aparezcan en las búsquedas, el flujo puede probarse sin verificación. El equipo prioriza la confianza como parte esencial del MVP. **Las dos posturas coinciden en que la verificación debe estar lista antes del lanzamiento**; la diferencia está en el orden de construcción, no en su importancia.

**HU-04 — Control del domicilio y de los datos (ARCO)**
- **Decisión del equipo:** Alta.
- **Propuesta del PO:** posición 10.
- **Explicación de la diferencia:** el PO la ubica después de HU-10 y HU-11 porque sus disparadores (confirmar la cita de visita y aceptar la propuesta) dependen de esas historias. Es la misma dependencia que el backlog ya registra. La diferencia es de secuencia por dependencias, no de valor: la privacidad sigue siendo obligatoria antes de operar con usuarios reales.

**HU-14 — Seguir y cerrar el trabajo**
- **Decisión del equipo:** Alta.
- **Propuesta del PO:** posición 11.
- **Explicación de la diferencia:** el PO la ve como el final del ciclo, que solo aporta valor cuando ya hay trabajos acordados y agendados. El equipo la considera necesaria para completar el flujo principal, y el PO no lo contradice: la ubica al final del flujo porque así lo exigen las dependencias.

**HU-12 — Decisión sobre cambios**
- **Decisión del equipo:** Alta.
- **Propuesta del PO:** posición 9.
- **Explicación de la diferencia:** es una diferencia menor. Tiene un valor muy alto, pero depende de HU-11 y es la historia más compleja (8 SP, muchos estados). El PO prefiere construirla con el flujo base estable. El equipo y el PO coinciden en su importancia.

**Historias Media o Baja ubicadas más arriba de lo esperado:** no hubo casos. El único detalle es que HU-15 (13) quedó por encima de HU-13 (14), y ambas tienen prioridad Media; es un orden interno que no contradice al equipo.

**Conclusión de la comparación:** las diferencias se explican sobre todo porque el PO simulado ordena por secuencia de dependencias y aprendizaje temprano, mientras que el equipo clasifica por importancia para el MVP. Ninguna diferencia indica que una historia Alta del equipo deba bajar de prioridad. No se asume que la IA tenga la razón.

---

## 7. Decisión final del equipo

La priorización oficial del backlog **no cambia automáticamente**:

- El ranking del Product Owner simulado sirve como **segunda perspectiva** para planear el orden de construcción.
- El equipo revisa sus argumentos, sobre todo los de HU-03, HU-04 y HU-14, que tienen prioridad Alta y quedaron más abajo en el ranking.
- **Las prioridades Alta, Media y Baja de `backlog_completo.md` siguen siendo las oficiales**, salvo que el equipo tome una decisión humana explícita para cambiarlas.

`backlog_completo.md`, los Issues y el GitHub Project no se modificaron.
