# Deuda técnica y seguimiento de calidad — UnCalificado

**Actividad:** S09_A1 — Auditoría de calidad de código (individual)  
**Componente auditado:** Backend Flask, MySQL y autenticación JWT  
**Rama de trabajo:** `feature/s09-a1-auditoria-raul`

## 1. Reflexión sobre la deuda técnica

La deuda técnica aparece cuando una solución funciona, pero conserva decisiones o pendientes que dificultan mantenerla, probarla o ampliarla. No todo hallazgo de una herramienta significa que la aplicación esté fallando. En esta auditoría, las 74 pruebas automatizadas pasaron antes y después de las refactorizaciones, mientras que Mypy detectó inicialmente 14 inconsistencias de tipado y Flake8 reportó 185 observaciones de estilo. Son evidencias distintas: las pruebas verifican determinados comportamientos y el análisis estático revisa características del código.

Las tres refactorizaciones individuales permitieron reducir los errores de Mypy de **14 a 0**, conservando **74 pruebas aprobadas**. Sin embargo, la calidad no queda resuelta definitivamente: todavía existen aspectos de legibilidad, cobertura y diseño que requieren seguimiento.

## 2. Deuda identificada y prioridades

| ID | Pendiente | Evidencia | Prioridad propuesta | Acción recomendada |
|---|---|---|---|---|
| DT-01 | Revisar y corregir líneas extensas y separación entre definiciones | Flake8 inicial: 184 incidencias `E501` y una `E305` | Baja | Acordar reglas de formato, ajustar el código y volver a ejecutar Flake8 |
| DT-02 | Ampliar las pruebas de actualizaciones parciales de `zona` | Revisión de `app/routes/solicitudes.py`, función `_validar_campos()` | Media | Probar solicitudes `PATCH` con municipio, colonia o ambos campos y confirmar el contrato esperado |
| DT-03 | Disminuir el acoplamiento de los servicios con la persistencia | Servicios de usuarios, solicitudes y soporte usan la capa `db` directamente | Media, condicionada al crecimiento | Evaluar una interfaz de repositorio o inyección de dependencias si aumentan las pruebas aisladas y los casos de uso |
| DT-04 | Separar validaciones extensas de los controladores de autenticación | `app/auth/routes.py` combina validación, orquestación y respuesta HTTP | Media | Evaluar extracción de validadores reutilizables sin modificar las reglas de negocio |
| DT-05 | Agregar pruebas para situaciones excepcionales después de una escritura | La nueva función `db.require_row()` verifica retornos `None`; las pruebas actuales no confirman todos esos escenarios | Media | Incorporar pruebas unitarias que simulen un registro no recuperable y verifiquen el manejo del error |
| DT-06 | Revisar la dependencia del proveedor JSON específico de Flask | `create_app()` verifica `DefaultJSONProvider` mediante `assert` | Baja | Documentar el supuesto y revisar la integración si se configura otro proveedor |

**Criterio de priorización.** Se propone atender primero los riesgos que podrían afectar contratos de API o escenarios poco probados (DT-02 y DT-05). Después se valoran mejoras de modularidad que reduzcan el costo de cambio (DT-03 y DT-04). Las convenciones de formato y la dependencia del proveedor JSON (DT-01 y DT-06) pueden planificarse según capacidad y necesidades del producto. Esta clasificación es una propuesta de la auditoría individual, no una prioridad formal aprobada por el equipo.

## 3. Incorporación a Scrum

Los pendientes deben convertirse en elementos visibles y verificables del **Product Backlog**, no permanecer únicamente en una lista informal. Para cada elemento conviene registrar: descripción del problema, archivo o componente involucrado, impacto esperado, criterios de aceptación, estimación y responsable cuando el equipo lo determine.

En el **refinamiento del Product Backlog**, el equipo puede revisar con el Product Owner qué deuda afecta al producto y cuál representa mantenimiento interno. Si una mejora es necesaria para completar una historia funcional, debe formar parte de sus criterios de aceptación o de la **Definition of Done**. Los cambios transversales o independientes pueden mantenerse como elementos técnicos priorizados.

En la **Sprint Planning**, se seleccionarían los pendientes compatibles con el Sprint Goal y la capacidad disponible. Durante el sprint se realizarían la implementación, revisión por pares y pruebas de regresión. En la **Sprint Review** se presentaría el resultado verificable cuando corresponda al incremento, y en la **Retrospective** se examinaría si están apareciendo patrones recurrentes de deuda, como validaciones duplicadas o falta de pruebas de casos límite.

No se propone reservar automáticamente un porcentaje fijo de cada sprint: la capacidad destinada a deuda técnica tendría que acordarse según el riesgo, el valor y las prioridades de cada iteración.

## 4. Ejemplos de elementos del Product Backlog

### DT-02 — Probar actualizaciones parciales de zona

**Descripción:** Como equipo de desarrollo, queremos verificar el comportamiento de `PATCH /api/solicitudes/{id}` cuando se envía una actualización parcial de `zona`, para evitar inconsistencias con el contrato de la API.

**Criterios de aceptación propuestos:**

1. Existen pruebas para una petición con ambos valores de zona.
2. Se verifica el resultado de enviar únicamente municipio o únicamente colonia.
3. Se documenta si esas combinaciones deben aceptarse o rechazarse.
4. Las pruebas existentes continúan aprobándose.

### DT-05 — Verificar el manejo de registros no recuperables

**Descripción:** Como equipo de desarrollo, queremos probar el comportamiento de `require_row()` cuando la consulta posterior a una escritura no recupera el registro, para contar con una respuesta controlada y verificable.

**Criterios de aceptación propuestos:**

1. Una prueba comprueba que `require_row()` devuelve el diccionario cuando existe.
2. Otra prueba comprueba que lanza la excepción definida cuando recibe `None`.
3. Se revisa si el manejo de la excepción en las rutas ofrece una respuesta HTTP adecuada sin exponer detalles internos.
4. No se introducen regresiones en las pruebas del backend.

## 5. Seguimiento y medición

El seguimiento puede apoyarse en indicadores sencillos: número de hallazgos de análisis estático, pruebas automatizadas aprobadas, pendientes técnicos abiertos y cerrados, y regresiones detectadas después de cada cambio. Para comparar resultados, se debe conservar la versión de las herramientas y la configuración de ejecución; de lo contrario, un cambio en el número de advertencias podría deberse a reglas diferentes.

En esta actividad la línea base fue de **185 incidencias Flake8** y **14 errores Mypy**. Después de las refactorizaciones se comprobó **Mypy sin errores en 19 archivos analizados** y **74 pruebas aprobadas**. No se ejecutó un recuento final de Flake8, por lo que no se afirma que sus 185 observaciones hayan desaparecido.

## 6. Conclusión reflexiva

Esta auditoría mostró que un sistema puede superar sus pruebas y, al mismo tiempo, tener oportunidades importantes para mejorar su estructura. El valor de las refactorizaciones estuvo en hacer explícito qué datos pueden faltar, qué resultado debe devolver una operación y cuáles son los supuestos de configuración. La disminución de errores de Mypy es un resultado medible, pero no sustituye la revisión del comportamiento ni el análisis de riesgos.

La deuda técnica debe tratarse como trabajo planificable dentro de Scrum, con criterios claros y prioridades justificadas, en lugar de corregirse únicamente cuando surge un fallo. Para UnCalificado, el siguiente avance razonable sería ampliar las pruebas de escenarios límite y revisar gradualmente la modularidad, sin perder de vista las necesidades funcionales del producto.
