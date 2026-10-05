# Diferencias entre los SRS individuales y su resolución

**Fuentes:** `comparacion_requerimientos.md` (análisis de consensos, gaps y conflictos) y `decisiones_equipo.md` (resolución mediante DEC-01 a DEC-88). El resultado está consolidado en `SRS_equipo.md`.

**Archivos auxiliares que se conservan:** `comparacion_requerimientos.md`, `decisiones_equipo.md` y `matriz_correspondencia.md`, que contienen el detalle completo.

---

## 1. Propósito y método

Este documento resume las diferencias entre los cuatro SRS individuales del equipo y cómo se resolvió cada una.

| Etiqueta | Archivo |
|---|---|
| I1 | `SRS del equipo/SRS_final.md` |
| I2 | `SRS del equipo/SRS_final 1.md` |
| I3 | `SRS del equipo/SRS_final 2.md` |
| I4 | `SRS del equipo/SRS_final 3.md` |

Cada requisito o capacidad se clasificó de una de tres formas:

| Clasificación | Significado |
|---|---|
| **CONSENSO** | Aparece esencialmente en los cuatro SRS. |
| **GAP** | Aparece solo en uno o en algunos SRS. |
| **CONFLICTO** | Dos o más SRS definen el mismo comportamiento de forma incompatible. Se aplicó un criterio estricto: solo es conflicto si ninguna implementación única puede cumplir ambos SRS. |

La resolución siguió estas reglas:

- Las recomendaciones del analista nunca se tomaron como decisiones.
- Cada conflicto y cada gap relevante se resolvió con una decisión explícita del equipo (DEC-XX).
- Lo que el equipo no pudo resolver quedó como pendiente (PV), sin inventar valores.

Los IDs RF, RNF, RD, FP y PV de este documento son los **definitivos** de `SRS_equipo.md`; los IDs con prefijo I1 a I4 remiten a los SRS individuales.

---

## 2. Panorama de los SRS individuales

| SRS | Alcance | Características distintivas |
|---|---|---|
| I1 | Web responsive; 57 RF del MVP | Pendientes de negocio explícitos (I1:PV-XX), agente de IA interno, reportes y sanciones, avance diario |
| I2 | WhatsApp y panel web; 23 RF | Valores numéricos precisos, piloto en la ZMG, catálogo de 10 oficios, suscripciones, registro de pagos |
| I3 | Web responsive; 18 RF | Avance por etapas, representación visual con IA, análisis de justificaciones de costo, cotización con desglose |
| I4 | Web; 10 RF | Alcance básico; sin agente de IA conversacional |

**Problemas de origen:**
- **Identificadores:** el mismo ID tenía significados distintos en cada SRS. Por ejemplo, RF-08 era "disponibilidad" en I1, "cotización" en I2 e I3 y "seguimiento" en I4. Esto obligó a crear una numeración definitiva nueva (`matriz_correspondencia.md`, sección 4).
- **Ajustes durante el análisis:** con el criterio estricto, 8 temas que la comparación global había marcado como conflicto se reclasificaron como gap o consenso. Fueron: datos obligatorios de la solicitud, número de recomendaciones, orden de resultados, suscripción frente al orden independiente de pagos, condición de cierre, papel del administrador en disputas, rendimiento y disponibilidad. En sentido contrario, la foto obligatoria en el avance y la visibilidad de organizaciones sin aprobación pasaron a ser conflicto.

---

## 3. Consensos y cómo se conservaron

| Consenso identificado | Origen | Resultado en `SRS_equipo.md` |
|---|---|---|
| Autenticación obligatoria y control de acceso por rol | I1:RF-30, I1:RNF-12; I2:RNF-15; I3:RNF-03, I3:RNF-09; I4:RNF-03, I4:RNF-04 | RNF-03, RNF-04 |
| Perfil del trabajador con nombre, foto, oficio y experiencia | I1:RF-07; I2:RF-07; I3:RF-05; I4:RF-03 | RF-03, RF-07 |
| Registro de organizaciones de contratistas | I1:RF-15; I2:RF-17; I3 §2.3; I4:RF-10 | RF-05 |
| El proveedor mantiene su disponibilidad | I1:RF-08; I2:RF-22; I3 §1.3; I4:RF-10 | RF-06, RD-05 |
| La solicitud requiere como mínimo el tipo de trabajo y la ubicación | I1:RF-04; I2:RF-02; I3:RF-01; I4:RF-01 | RF-16 |
| Búsqueda por oficio, zona y disponibilidad | I1:RF-11; I2:RF-04; I3:RF-04; I4:RF-04 | RF-26, RD-06 |
| El cliente elige; la IA no asigna | I1:RF-13; I2:RF-18; I4:RF-06 | RF-30, RF-31 |
| Agendar citas y registrar cambios | I1:RF-17, I1:RF-41; I2:RF-06; I3:RF-07; I4:RF-07 | RF-34, RF-37 |
| Seguimiento visible para el cliente | I1:RF-22; I2:RF-10; I3:RF-09; I4:RF-08 | RF-45 |
| Fotos como evidencia | I1:RF-02; I2:RF-01; I3:RF-01; I4:RF-01 | RF-17 |
| Cierre: el proveedor solicita y el cliente confirma | I1:RF-59, I1:RF-60; I2:RF-16; I3:RF-11-AC-4; I4:RF-08-AC-2 | RF-47 |
| Solo evalúa el cliente asociado, después del cierre | I1:RF-25; I2:RF-11; I3:RF-11; I4:RF-09 | RF-49, RD-13 |
| La dirección exacta no es pública | I1:RF-54; I2:RNF-04; I3:RD-02; I4:RD-04 | RD-15, RF-52 |
| Usabilidad y uso móvil | I1:RNF-01, I1:RNF-02; I3:RNF-02; I4:RNF-01, I4:RNF-06 | RNF-01, RNF-02 |
| Procesamiento de pagos fuera del MVP | I1 §10; I2:RD-02; I3:RD-06; I4 §4.2 | RD-14, FP-05 |

---

## 4. Conflictos y su resolución

Se confirmaron 23 conflictos. Cada uno se resolvió con una o varias decisiones del equipo.

| # | Conflicto | Posiciones de los SRS | Decisión del equipo | Resultado final |
|---|---|---|---|---|
| C-01 | Canal de interacción | Web (I1, I3, I4) frente a WhatsApp + panel web (I2) | DEC-01, DEC-42: web y **app nativa** para los cuatro actores; WhatsApp fuera del MVP (decisión del equipo sin respaldo en los SRS) | RE-01, RNF-02, FP-02 |
| C-02 | Registro e identidad | Cuenta con inicio de sesión (I1, I3, I4) frente a número de WhatsApp (I2) | DEC-02: cuenta registrada para todos los roles | RF-01, RE-02 |
| C-03 | Notas de voz | Fuera del MVP (I1:RF-33) frente a incluidas (I2:RF-01) | DEC-04: fuera del MVP | FP-01, RE-05 |
| C-04 | Video en la solicitud | Rechazado (I2:RF-01-AC-4) frente a permitido (I3:RF-01) | DEC-11: fotos y videos opcionales | RF-17; límites de video en PV-01 |
| C-05 | Portafolio | Opcional (I1:RF-34, I3) frente a mínimo de 3 fotos (I2:RF-07) | DEC-08: opcional | RF-04 |
| C-06 | No verificados en búsqueda | Visibles con filtro (I1) frente a excluidos (I2:RD-03, I3:RD-08) | DEC-06, DEC-48: visibles sin la marca; se distingue lo declarado de lo verificado | RF-08, RF-26, RF-28 |
| C-07 | Organizaciones visibles sin aprobación | Visibles (I1:RF-15) frente a pendientes (I2:RF-17, I3:RD-08) | DEC-09: visibles; "organización verificada" es una marca aparte | RF-05, RF-11 |
| C-08 | Plantilla de la organización | Fuera del MVP (I1:RF-37) frente a panel con asignación (I2:RF-12, I2:RF-17) | DEC-10: fuera del MVP | FP-03 |
| C-09 | Definición de cercanía | Cobertura declarada (I1:RD-04, I3) frente a radio de 10/20 km (I2) | DEC-13, DEC-80: cobertura declarada; al ordenar, primero la misma colonia y después las vecinas | RD-04, RF-29; PV-04 |
| C-10 | Precio como criterio | Filtro fuera del MVP (I1:RF-36) frente a filtrar y ordenar (I3:RF-06) | DEC-14, DEC-51: filtrar y ordenar por precio y por los demás criterios de I3 | RF-29, RD-12; PV-05 |
| C-11 | Territorio inicial | ZMG (I2:RD-06) frente a todo el territorio mexicano (I3 §2.4) | DEC-38: ZMG con 6 municipios y catálogo de 10 oficios | RD-18, RE-08, FP-11 |
| C-12 | Quién propone la cita | Agente → cliente → trabajador (I1, I3) frente a prestador → cliente (I2) | DEC-16: el prestador propone; doble confirmación. Se complementó con DEC-54, DEC-81, DEC-84 y DEC-88 | RF-32 a RF-37 |
| C-13 | Visita previa para cotizar | Obligatoria (I1:RF-18) frente a opcional (I2:RF-08) frente a condicional (I3:RF-03) | DEC-17: opcional | RF-38 |
| C-14 | Expiración de la propuesta | 72 h (I1:RF-42) frente a vigencia de 1 a 30 días (I2:RF-08) | DEC-18, DEC-19, DEC-55: 72 h contadas desde la primera propuesta; negociación con la misma versión aceptada por ambas partes | RF-39 |
| C-15 | Plazo para responder a un cambio | 24 h con pausa (I1 E.3) frente a 48 h (I2:RF-09) | DEC-20 (sin escalamiento al administrador), DEC-22, DEC-57, DEC-85: 24 h, contrapropuesta, vencimiento y rechazo automático | RF-40, RF-41, RF-55; PV-06 |
| C-16 | Foto obligatoria en el avance | Obligatoria (I1:RF-22) frente a opcional (I2:RF-10, I3:RF-09) | DEC-27: no aplica, porque no hay reportes de avance (DEC-25) | FP-15 |
| C-17 | Frecuencia del reporte de avance | Diaria (I1, I2) frente a por etapa o cada 7 días (I3) frente a solo estados (I4) | DEC-25, DEC-59, DEC-83: solo estados del proyecto; el proveedor marca el inicio del trabajo | RF-45, FP-15 |
| C-18 | Escalamiento cuando no hay reporte | Recordatorios (I1) frente a 2 h con aviso a soporte (I2) frente a 7 días (I3) | DEC-26: no aplica | FP-15, FP-20 |
| C-19 | Comentario en la evaluación | Obligatorio (I1:RF-47) frente a opcional (I2, I3) | DEC-32: opcional | RF-49, RF-50 |
| C-20 | Escala de la evaluación | Calificación única (I3) frente a 4 dimensiones (I2) | DEC-31, DEC-64: 4 dimensiones; el perfil muestra el promedio general y el de cada dimensión | RF-49, RF-07 |
| C-21 | Evaluación bidireccional | Fuera del MVP (I1 §10) frente a incluida (I2:RF-11) | DEC-30, DEC-63: bidireccional, con publicación simultánea | RF-50, RF-51, RD-13 |
| C-22 | Revelación de la dirección del cliente | Autorización del cliente (I1) / cita + consentimiento (I3) / automática al confirmar la cita (I2) | DEC-41, modificada por DEC-65, DEC-78 y DEC-79: revelación automática al confirmar la cita de visita o al aceptar la propuesta, visible hasta 7 días después del cierre | RF-52, RF-24, RD-15 |
| C-23 | Datos de contacto del trabajador | Solo con su autorización (I1:RF-58) frente a teléfonos visibles (I2:RNF-04) | DEC-36: sin teléfonos, con canal interno. DEC-41 y DEC-65: domicilio visible si la identidad está verificada y hay cita confirmada | RF-46, RF-53, RD-15 |

---

## 5. Gaps y su resolución

### 5.1 Gaps resueltos en la primera ronda (DEC-01 a DEC-41)

| Gap | Origen | Decisión | Resultado |
|---|---|---|---|
| Agente de IA conversacional (ausente en I4) | I1, I2, I3 | DEC-03: se incluye | RF-14, RF-19, RF-20, RF-22, RE-03 |
| Representación visual y análisis de justificaciones | I3:RF-16, I3:RF-18 | DEC-05: se incluyen | RF-23, RF-42, RD-08, RD-09 |
| Modelo de verificación | I1:RF-09, I1:RF-35; I2:RF-07; I3:RF-13 | DEC-07: marcas independientes, con retiro | RF-09 a RF-12; PV-02 |
| Ubicación mínima para buscar | I1, I2, I3, I4 | DEC-12: colonia o zona aproximada | RF-16 |
| Número de recomendaciones | I1:RF-13; I2:RF-04 | DEC-15: de 3 a 4 | RF-30 |
| Negociación de la propuesta | I1:RF-42; I2:RF-08 | DEC-19: misma versión aceptada por ambas partes | RF-39 |
| Tipos de cambio que requieren autorización | I1, I2, I3 | DEC-21: costo, material, alcance y fecha | RF-40, RD-10 |
| Contrapropuesta | I1:RF-19 | DEC-22: se adopta | RF-41 |
| Registro de pagos | I2:RF-14 | DEC-23: no se registran pagos | FP-06, RD-14 |
| Suscripción de prestadores | I2:RF-15 | DEC-24: sin suscripción | FP-07, RNF-10; PV-09 |
| Etapas del proyecto | I3:RF-09 | DEC-28: sin etapas | FP-16 |
| Cancelación del proyecto | I2:RF-19 | DEC-29 y DEC-61: posterior | FP-21 |
| Reportes y sanciones | I1, I3 | DEC-33: fuera del MVP | FP-14 |
| Papel del administrador | I1, I2, I3 | DEC-34: no interviene en decisiones comerciales | RD-11; PV-06 |
| Soporte humano | I1, I2, I3 | DEC-35: solicitud registrada y atendida por el administrador | RF-22, FP-17; PV-07 |
| Consentimiento y ARCO | I1:RF-55; I2:RF-20, I2:RF-21; I3:RF-15 | DEC-37: consentimiento al registrarse y ARCO atendido por el administrador | RF-02, RF-54, RD-16; PV-08 |
| Rendimiento | I1, I2, I3, I4 | DEC-39: 3 s en p95, sin incluir la IA | RNF-08, RF-25 |
| Disponibilidad del servicio | I1, I2, I3 | DEC-40: 99 % mensual | RNF-09 |

### 5.2 Gaps de consolidación resueltos en la segunda ronda (DEC-42 a DEC-81)

Al revisar la matriz de correspondencia aparecieron gaps que ninguna decisión había cubierto, así como elementos sostenidos solo por notas del analista.

| Decisión | Tema | Resultado |
|---|---|---|
| DEC-42, DEC-43 | Actores de la app y reglas de autenticación | RNF-02, RNF-11 |
| DEC-44 a DEC-47 | Identificación del agente, clasificación del oficio, captura manual y límites de imagen | RF-13, RF-15, RF-21, RF-18 |
| DEC-48, DEC-49 | Perfil con verificación retirada; RFC | RF-08; PV-03 |
| DEC-50 a DEC-57 | Domicilio, criterios de orden, catálogo, búsqueda sin resultados, detalles de citas, contenido de la propuesta y campos y vencimiento de los cambios | RF-27, RF-29, RF-32 a RF-36, RF-38 a RF-41; FP-18, FP-19 |
| DEC-58 a DEC-64 | Comprobantes, modelo de estados, proyectos sin movimiento, terminación del proyecto, cierre sin respuesta, publicación y dimensiones de las evaluaciones | RF-45, RF-48, RF-51, RF-07; FP-20 a FP-22 |
| DEC-65 a DEC-70 | Domicilios, bitácora, continuidad, localización, borrador y consulta de costos | RF-52, RF-53, RF-16, RF-44; RNF-12 a RNF-14 |
| DEC-71 a DEC-77 | Elementos que solo sostenía una nota del analista | FP-23; RF-24, RF-43, RNF-07, RD-07, RD-12, RD-17 confirmados |
| DEC-78 a DEC-81 | Domicilio cuando hay visita, momento de captura, orden por cercanía y paso a "programado" | RF-52, RF-24, RF-29, RF-34, RF-45 |

### 5.3 Situaciones detectadas en la validación final (DEC-82 a DEC-88)

| Decisión | Tema | Resultado |
|---|---|---|
| DEC-82 | Orden por garantía (con garantía primero); decisión nueva del equipo | RF-29 |
| DEC-83 | El proveedor marca el inicio del trabajo | RF-45 |
| DEC-84 | La cita de ejecución exige una propuesta aceptada | RF-34 |
| DEC-85 | Rechazo automático de la contrapropuesta y cambio iniciado por el cliente; decisión nueva del equipo | RF-41, RF-55 |
| DEC-86 | Alcance de la anonimización | PV-12 |
| DEC-87 | Métrica cuantitativa de usabilidad | PV-13 |
| DEC-88 | Se acepta que, si hay visita, el proyecto pase a "programado" antes de que exista un acuerdo | RF-45 |

---

## 6. Decisiones del equipo sin respaldo directo en los SRS individuales

Estas decisiones se registraron explícitamente como nuevas para cerrar huecos de consolidación:

- **DEC-01:** el canal es web y app nativa.
- **DEC-41 y DEC-65:** el domicilio del trabajador depende de que su identidad esté verificada y de que haya cita confirmada.
- **DEC-57:** reinicio del plazo con cada contrapropuesta y respuesta del proveedor.
- **DEC-64:** el perfil muestra las 4 dimensiones de evaluación.
- **DEC-80:** criterio de orden por cercanía.
- **DEC-82:** sentido del orden por garantía.
- **DEC-85:** cambio iniciado por el cliente y rechazo automático de la contrapropuesta.

---

## 7. Pendientes que siguen abiertos

| PV | Tema | Razón por la que sigue abierto |
|---|---|---|
| PV-01 | Límites para videos | Ninguna fuente aporta valores |
| PV-02 | Evidencia de experiencia sin certificados | Abierto en I1:PV-02 |
| PV-03 | "Organización registrada", campos mínimos y RFC | Requiere una definición legal (I1:PV-03) |
| PV-04 | Declaración de cobertura y "zona vecina" | Abierto en I1:PV-05 |
| PV-05 | Precio comparable y viabilidad del filtro | Viabilidad no confirmada |
| PV-06 | Desacuerdo persistente sobre un cambio | Vacío documentado en I1 §11 |
| PV-07 | Tiempo de atención del administrador | Capacidad operativa no confirmada |
| PV-08 | Aviso de privacidad, plazo ARCO y plazo de conservación | Requiere asesoría legal |
| PV-09 | Modelo de ingreso | Decisión de negocio |
| PV-10 | Valor legal de la propuesta aceptada | Requiere asesoría legal |
| PV-11 | Capacidad del equipo y calendario | Se desconocen el presupuesto y la capacidad del equipo |
| PV-12 | Alcance completo de la anonimización | DEC-86; espera la revisión legal |
| PV-13 | Métrica cuantitativa de usabilidad | DEC-87; se definirá con el piloto |

---

## 8. Resultado de la consolidación

| Elemento | Total |
|---|---|
| Consensos conservados | 15 temas |
| Conflictos resueltos | 23 (C-01 a C-23) |
| Decisiones del equipo | 88 (DEC-01 a DEC-88) |
| RF del MVP en `SRS_equipo.md` | 55 |
| RNF | 14 |
| RD | 18 |
| RE | 9 |
| Funcionalidades posteriores (FP) | 23 |
| Pendientes abiertos (PV) | 13 |
| Criterios de aceptación | 205 |
