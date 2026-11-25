# Retrospectiva del proyecto — UnCalificado

**Rama / ancla:** `doc_entrega`  
**Problema de origen (Semana 2):** `TC5062-A01840340/S02_A1/proyecto_base.md`  
**Evidencia de cobertura:** [`matriz_trazabilidad.md`](matriz_trazabilidad.md) · capturas en [`docs/screenshots/`](docs/screenshots/)

---

## Sección A — Retrospectiva SCRUM

### ¿Qué salió bien?

1. **Spec-first con contrato vivo.** El OpenAPI (`contracts/openapi.yaml`) y los `x-acceptance-criteria` forzaron a implementar por capacidad (auth, proveedores, solicitudes, contratación, privacidad) en lugar de inventar endpoints sueltos. Eso se nota en la API usable y en `tests/` por módulo.
2. **El núcleo de confianza del dominio sí se materializó.** Cuentas con consentimiento, perfiles verificables, exploración por zona sin publicar domicilio exacto, fichas con “Verificado”, mensajería sin teléfonos y ARCO. Es coherente con la entrevista de Semana 2 (privacidad del domicilio, historial confiable, cercanía).
3. **Cliente web con identidad de producto.** El índice, entrar, cuenta (alcaldía + radio) y ficha de calificado se ven y se demuestran; no quedó solo en Postman. Capturas: [`docs/screenshots/01-indice.png`](docs/screenshots/01-indice.png) … [`05-ficha-calificado.png`](docs/screenshots/05-ficha-calificado.png).
4. **Docker Compose unificado.** Base + API + web con montajes y recarga bajó la fricción de “¿quién tiene la API arriba?” en el día a día.
5. **Trazabilidad honesta al final.** La matriz RF→HU→endpoint→prueba, corregida tras revisión SRS, evita vender como “completo” lo que solo está etiquetado en el contrato (35 Completo / 15 Parcial / 5 No implementado).

### ¿Qué no salió bien?

1. **El valor estrella de Semana 2 — el agente de IA — no llegó.** En `proyecto_base.md` el valor principal es conversar, clasificar, visualizar alcance y explicar cambios. En código el camino real es captura manual; RF-14/19/25 y notificaciones (RF-36) quedaron sin implementar; el “análisis IA” de cambios es plantilla (`POST /changes/{id}/analysis`).
2. **Confundir cobertura de contrato con producto terminado.** Durante semanas el OpenAPI marcaba AC de agente sobre `POST /requests` mientras el handler solo creaba borradores. Eso infló la sensación de avance hasta la matriz.
3. **UI incompleta frente a la API.** Contratación (citas, propuestas, cambios, evaluaciones) vive en backend + tests, pero el cliente web no ofrece un flujo end-to-end de obra para el stakeholder. Demostrar eso hoy exige curl/Postman o scripts.
4. **Pruebas desiguales.** Hay buena base en auth/explore/providers/contracting; faltan tests que ejerciten adjuntos, `visual-representations`, `support-requests` y `/analysis` (señalado en la revisión SRS).
5. **Producción aún no existe.** Dominio `uncalificado.com` registrado; sin despliegue. Secretos, pool para Lambda y carga RNF-08 siguen en `PLAN.md`.

### ¿Qué harías diferente la próxima vez?

1. **Separar desde el sprint 0 “AC de contrato” vs “Definition of Done de producto”.** Un RF Completo exige handler + prueba que lo ejercite + (si aplica) pantalla. Sin eso, el burndown miente.
2. **Priorizar un vertical slice del agente o declararlo fuera de MVP con DEC explícita.** O se construye un diálogo mínimo (identificar asistente + 3–4 turnos + resumen) o se baja del pitch de Semana 2 para no sobreprometer.
3. **UI y API en el mismo incremento de valor.** Cada capacidad de contratación debería salir con al menos una pantalla o un flujo Selenium, no solo pytest de API.
4. **UAT documentado aparte de S09.** S09-A1 fue auditoría/lint; no sustituye casos manuales. La próxima vez, una checklist UAT por HU desde el backlog.
5. **Congelar el README y la trazabilidad más temprano.** Documentar al final obliga a reabrir decisiones y a corregir estados (como pasó con la revisión SRS).

### Análisis del uso de herramientas agentes

| Fase | ¿Más útiles? | ¿Trabajo adicional? |
|---|---|---|
| Elicitación / SRS / backlog (Semanas 1–3) | Redacción, comparación de SRS individuales, borradores de HU | Riesgo de unificar requisitos sin validar AC con el equipo; hay que releer |
| Arquitectura y OpenAPI (S04) | Borradores de contrato, matrices AC↔endpoint | Etiquetar AC de IA en endpoints manuales generó deuda de trazabilidad |
| Implementación API | Handlers, tests, migraciones, RBAC, seed | Refactors grandes de una vez; a veces “completo” sin prueba del AC |
| Frontend | Sistema visual, páginas de índice/cuenta/ficha | Estética genérica si no se ancla en `AGENTS.md` / design tokens |
| Documentación de entrega | README IEEE, Archify, capturas, matriz | Enlaces a `main` rotos, SVG poco fiable en GitHub → PNG; revisión SRS obligó a reclasificar |

**¿Cambió la forma de programar?** Sí, hacia **contrato primero y evidencia después**: ya no basta con “el endpoint responde 200”. La matriz y el revisor SRS empujaron a preguntar *qué AC del SRS toca este test*. También cambió el ritmo: más tiempo en compose, seed y capturas demostrables; menos en features de IA no desplegables. El riesgo nuevo es **acelerar implementación etiquetada** y postergar la validación humana del dominio (agente, notificaciones, UAT).

---

## Sección B — Consistencia problema-solución

### ¿La aplicación resuelve el problema de la Semana 2?

**En parte sí, en el tramo de confianza, cercanía y coordinación básica; no en el tramo de agente de IA.**

El problema en `proyecto_base.md` (Semana 2) era:

> referidos informales / anuncios sin historial; no hay canal claro para describir el proyecto, encontrar personas cercanas calificadas y disponibles, coordinar citas y dar seguimiento a avance y costos.

| Parte del problema | ¿Resuelto? | Evidencia concreta |
|---|---|---|
| Encontrar oficio cerca con historial | **Sí (MVP)** | Índice público con zona/radio ([`01-indice.png`](docs/screenshots/01-indice.png), [`04-cuenta.png`](docs/screenshots/04-cuenta.png)); listado de calificados ([`02-indice-obra.png`](docs/screenshots/02-indice-obra.png)); ficha con verificación y obra ([`05-ficha-calificado.png`](docs/screenshots/05-ficha-calificado.png)); API explore + búsqueda (`tests/test_explore.py`, `tests/test_projects.py`) |
| Confiar (verificado vs declarado) | **Sí** | Marcas de verificación en ficha/API; flujo admin de verificaciones (`tests/test_providers.py`); RF-08…11 Completos en matriz |
| Privacidad de domicilio | **Sí** | Copy y comportamiento: domicilio exacto no se publica; zonas aproximadas (`tests/test_geo.py`, `tests/test_explore.py`); RF-52/53 Completos |
| Describir el proyecto con agente de IA | **No** | Sin conversación guiada (RF-14/19 No implementado); captura manual es el camino (RF-21 Completo) |
| Representación visual del alcance con IA | **No** | `visual-representations` guarda referencia; no genera imagen (RF-23 Parcial) |
| Coordinar citas y costos | **Parcial (API sí, producto visible no)** | Citas con doble confirmación, propuestas, cambios y evaluaciones en API + `tests/test_contracting.py`; sin pantallas de obra equivalentes a las del índice |
| Seguimiento / mensajes | **Parcial** | Mensajes sin teléfonos en API (`tests/test_projects.py`); UI de mensajería limitada |
| Explicar cambios de costo con IA | **No (stub)** | Análisis plantilla; RF-42 Parcial |
| Sin pagos en app | **Sí (por diseño)** | Principio de producto y copy del footer en capturas |

Conclusión: **sí resolvemos “encontrar calificados cerca con señales de confianza y sin filtrar el domicilio”**; **no resolvemos el pitch de “el agente te guía y te explica”** que era el valor principal escrito en Semana 2.

### ¿Qué partes del problema no se resolvieron?

| Gap | ¿Fuera de alcance o obstáculo? |
|---|---|
| Agente conversacional (RF-13…15, 19, 25) | **Alcance / priorización:** se priorizó plataforma, auth, explore y contratación API; la IA quedó etiquetada en contrato sin motor |
| Notificaciones y recordatorios (RF-36; parte de RF-37/48) | **Obstáculo técnico + alcance:** sin canal email/push ni jobs; se implementó el estado, no el aviso |
| Generación visual con IA (RF-23) | **Alcance:** persistencia de referencia sin modelo generativo |
| Análisis de justificación de cambios con IA (RF-42) | **Stub consciente:** respuesta informativa fija para no fingir decisión de IA |
| App móvil / uso en obra del proveedor | **Fuera de alcance del MVP web** |
| Despliegue en `uncalificado.com` | **Obstáculo operativo pendiente** (secretos, hosting, quitar demos) |
| Calendario fino de disponibilidad del proveedor (RF-06) | **Parcial técnico:** fechas no disponibles en perfil/búsqueda; sin API de franjas ricas |
| UI completa de contratación para el cliente | **Deuda de producto:** API adelante del front |

### ¿Qué demostrarías primero al stakeholder de la Semana 2?

**Primero el índice → ficha → cuenta (zona/radio) → entrar y contactar**, en ese orden.

1. **Índice y obra** ([`01-indice.png`](docs/screenshots/01-indice.png), [`02-indice-obra.png`](docs/screenshots/02-indice-obra.png)) — Responde en 30 segundos a “¿hay gente de oficio cerca en la que pueda confiar?” sin pedir cuenta.
2. **Ficha verificada** ([`05-ficha-calificado.png`](docs/screenshots/05-ficha-calificado.png)) — Muestra la distinción declarado/verificado y zona aproximada (preocupación explícita de la entrevista sobre privacidad y criterios de elección).
3. **Cuenta: alcaldía + distancia** ([`04-cuenta.png`](docs/screenshots/04-cuenta.png)) — Demuestra control del alcance geográfico sin pedir calle y número.
4. **Entrar / contacto autenticado** ([`03-entrar.png`](docs/screenshots/03-entrar.png)) — Cierra el circuito: explorar es público; contactar exige sesión (confianza + anti-spam).

**Por qué no empezar por el agente:** sería demostrar una promesa de Semana 2 que hoy no existe; quemaría credibilidad. Si el stakeholder pregunta por IA, se muestra con honestidad el camino manual + el stub de análisis, y se enseña la matriz ([`matriz_trazabilidad.md`](matriz_trazabilidad.md)) como mapa de lo hecho vs lo pendiente.

**Segundo bloque (si hay tiempo):** un recorrido API de cita → propuesta → cambio → evaluación con Postman o tests, dejando claro que es capacidad de backend lista para UI.
