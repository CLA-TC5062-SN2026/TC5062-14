# SRS_equipo.md

# Especificación de Requerimientos de Software (SRS) del equipo — UnCalificado

| Campo | Valor |
|---|---|
| Versión | 1.0 (consolidación del equipo) |
| Fecha | 3 de octubre de 2026 |
| Estándar de referencia | IEEE Std 830-1998 (estructura compatible con la actividad S02_A1) |
| Estado | Fuente de verdad del equipo para el resto del curso |
| Fuentes | Cuatro SRS individuales, `comparacion_requerimientos.md`, `decisiones_equipo.md` (DEC-01 a DEC-88) y `matriz_correspondencia.md` |

**Convenciones de lectura**

- Los identificadores `RF-XX`, `RNF-XX`, `RD-XX`, `RE-XX`, `FP-XX` y `PV-XX` son los **definitivos del equipo**, según la sección 4 de `matriz_correspondencia.md`.
- Los identificadores con prefijo `I1:`, `I2:`, `I3:` o `I4:` remiten a los SRS individuales. Aparecen solo en los campos **Origen**, en la matriz de trazabilidad y en la tabla de correspondencia:
  - **I1** = `SRS del equipo/SRS_final.md`
  - **I2** = `SRS del equipo/SRS_final 1.md`
  - **I3** = `SRS del equipo/SRS_final 2.md`
  - **I4** = `SRS del equipo/SRS_final 3.md`
- `DEC-XX` remite a `decisiones_equipo.md`.
- Un criterio marcado **"Derivado de DEC-XX"** se redactó para volver verificable una decisión del equipo. No proviene literalmente de ningún SRS individual.
- Los criterios de aceptación siguen el formato Dado / cuando / entonces. Sus valores numéricos (montos, fechas, tamaños) son datos de prueba; la regla general está en la descripción del requisito.

---

## Parte I. Introducción

### 1. Introducción

#### 1.1 Propósito

Este documento especifica los requerimientos del MVP de **UnCalificado**. Resulta de consolidar los cuatro SRS que elaboró cada integrante del equipo en la actividad S02_A1, por este proceso:

1. **Comparación:** se identificaron consensos, gaps y conflictos (`comparacion_requerimientos.md`).
2. **Decisiones:** el equipo resolvió las diferencias mediante 88 decisiones registradas (`decisiones_equipo.md`, DEC-01 a DEC-88).
3. **Correspondencia:** se fijó la numeración definitiva (`matriz_correspondencia.md`).

El documento incluye únicamente:

- requisitos en consenso;
- gaps que el equipo adoptó explícitamente;
- conflictos resueltos por el equipo.

Los temas que siguen abiertos se listan en la sección 8, sin asumir una solución. Está dirigido al equipo de desarrollo y de pruebas como base para el diseño, la implementación y la verificación.

#### 1.2 Alcance

UnCalificado es una plataforma que conecta a clientes que necesitan un trabajo de oficio en su domicilio con trabajadores independientes y organizaciones de contratistas. Un agente de IA conversa con el cliente para entender su necesidad, recomienda proveedores compatibles y acompaña la contratación. Las decisiones que comprometen tiempo, dinero o datos siempre quedan en manos del cliente.

El MVP comprende:

- **Cuentas, perfiles y verificación:** registro con cuenta; perfiles de trabajadores y organizaciones; verificación de identidad, experiencia y organización.
- **Solicitud y búsqueda:** solicitud guiada por el agente de IA, búsqueda y recomendación de 3 a 4 proveedores.
- **Contratación:** citas con doble confirmación; propuesta escrita con desglose y negociación; control de cambios de costo, material, alcance y fecha con autorización del cliente.
- **Seguimiento y cierre:** seguimiento por estados, canal interno de mensajes, cierre confirmado por el cliente y evaluación en ambos sentidos.
- **Privacidad y datos:** protección del domicilio y atención de solicitudes de derechos ARCO.

El piloto opera en seis municipios de Jalisco y con un catálogo cerrado de 10 oficios (RD-18). El MVP **no procesa ni registra pagos** (RD-14). Las funcionalidades excluidas se listan en la sección 7.

#### 1.3 Definiciones, acrónimos y términos

| Término | Definición |
|---|---|
| Administrador | Rol interno de la plataforma. Verifica perfiles, atiende solicitudes de soporte y solicitudes ARCO, y recibe avisos informativos. No interviene en decisiones comerciales (RD-11). |
| Agente de IA | Componente interno del sistema que conversa con el cliente, clasifica el oficio, resume, recomienda y analiza justificaciones. No es un actor humano ni decide por los usuarios (RD-07). |
| App nativa | Aplicación móvil instalable que se ofrece junto con la aplicación web a todos los actores (RE-01). |
| ARCO | Derechos de Acceso, Rectificación, Cancelación y Oposición sobre datos personales. |
| Bitácora | Registro de aceptaciones, rechazos y contrapropuestas de propuestas y cambios. No puede alterarse sin dejar rastro (RNF-12). |
| Canal interno | Mensajería entre cliente y proveedor dentro de un proyecto. No expone teléfonos (RF-46). |
| Catálogo de oficios | Lista cerrada de 10 categorías del piloto (RD-18). |
| Cambio | Solicitud del proveedor para modificar el costo, el material, el alcance o la fecha de un acuerdo aceptado (RF-40). |
| Cita | Visita de valoración o servicio agendado, que requiere la confirmación del prestador y del cliente (RF-34). |
| Cliente | Persona que solicita un trabajo de oficio para su domicilio. |
| Cobertura | Colonias que el proveedor declara atender. "Cercano" significa que la colonia del cliente está en esa cobertura o es vecina de ella (RD-04). |
| DEC | Decisión del equipo registrada en `decisiones_equipo.md`. |
| Disponible | Que tiene espacio en su agenda en las fechas solicitadas (RD-05). |
| Estados del proyecto | borrador → confirmada → programado → en proceso → terminado → concluido (RF-45). |
| Experiencia verificada / Identidad verificada / Organización verificada | Marcas independientes que otorga el administrador después de revisar evidencia (RF-09, RF-10 y RF-11). |
| FP | Funcionalidad posterior al MVP o fuera de su alcance. |
| LFPDPPP | Ley Federal de Protección de Datos Personales en Posesión de los Particulares. |
| MVP | Producto mínimo viable; versión del piloto especificada en este documento. |
| Organización de contratistas | Empresa o grupo registrado que ofrece servicios como proveedor. |
| p95 | Percentil 95: valor por debajo del cual se encuentra el 95 % de las mediciones. |
| Propuesta | Cotización escrita del proveedor, con desglose, que el cliente acepta, negocia o rechaza (RF-38 y RF-39). |
| Proveedor / Prestador | Término genérico para un trabajador independiente o una organización de contratistas. |
| PV | Pendiente abierto del equipo. |
| RD / RE / RF / RNF | Regla de negocio y dominio / Restricción o decisión de alcance / Requerimiento funcional / Requerimiento no funcional. |
| Solicitud (proyecto) | Registro de la necesidad del cliente. Avanza por los estados del proyecto. |
| Trabajador | Persona que ejecuta trabajos de oficio de manera independiente. |

#### 1.4 Referencias

| Referencia | Contenido |
|---|---|
| `SRS del equipo/SRS_final.md` (I1) | SRS individual del integrante 1 |
| `SRS del equipo/SRS_final 1.md` (I2) | SRS individual del integrante 2 |
| `SRS del equipo/SRS_final 2.md` (I3) | SRS individual del integrante 3 |
| `SRS del equipo/SRS_final 3.md` (I4) | SRS individual del integrante 4 |
| `comparacion_requerimientos.md` | Comparación requerimiento por requerimiento (consensos, gaps y conflictos) |
| `decisiones_equipo.md` | Decisiones del equipo DEC-01 a DEC-88, con justificación |
| `matriz_correspondencia.md` | Matriz de correspondencia y numeración definitiva |
| IEEE Std 830-1998 | Guía de estructura de la especificación |

---

## Parte II. Descripción general

### 2. Descripción general del producto

#### 2.1 Concepto

Hoy la contratación de trabajos de oficio depende de referidos informales, grupos de mensajería y anuncios sin historial confiable. No hay un registro de acuerdos ni verificación de los trabajadores. UnCalificado centraliza esa información: el cliente describe su necesidad, encuentra proveedores compatibles e identificables, acuerda por escrito el trabajo y su costo, y evalúa el servicio al concluir.

#### 2.2 Valor principal

- **Solicitud guiada:** un agente de IA guía al cliente para describir su necesidad y le recomienda de 3 a 4 proveedores compatibles con una explicación. El cliente elige; la IA no asigna (RF-30, RD-07).
- **Confianza:** la verificación de identidad, experiencia y organización se distingue claramente de la información solo declarada (RF-08).
- **Control del dinero:** ningún cambio de costo, material, alcance o fecha se aplica sin la autorización explícita del cliente (RD-10). El historial de versiones permite comparar el presupuesto inicial con el actual (RF-43).
- **Privacidad:** el domicilio del cliente solo se revela al trabajador elegido, en momentos definidos (RF-52), y los teléfonos no se intercambian (RD-15).

#### 2.3 Capacidades del MVP

| Capacidad | RF |
|---|---|
| 3.1 Cuentas y consentimiento | RF-01 a RF-02 |
| 3.2 Perfiles y disponibilidad | RF-03 a RF-08 |
| 3.3 Verificación | RF-09 a RF-12 |
| 3.4 Solicitud y agente de IA | RF-13 a RF-25 |
| 3.5 Búsqueda y recomendación | RF-26 a RF-31 |
| 3.6 Citas | RF-32 a RF-37 |
| 3.7 Propuestas | RF-38 a RF-39 |
| 3.8 Cambios de costo | RF-40 a RF-44, RF-55 |
| 3.9 Seguimiento, comunicación y cierre | RF-45 a RF-48 |
| 3.10 Evaluaciones | RF-49 a RF-51 |
| 3.11 Privacidad y datos | RF-52 a RF-54 |

#### 2.4 Actores

| Actor | Rol | Canal |
|---|---|---|
| Cliente | Describe su necesidad, elige al proveedor, confirma citas, acepta o negocia propuestas, decide sobre cambios, confirma el cierre y evalúa al proveedor | Web y app nativa |
| Trabajador independiente | Mantiene su perfil y disponibilidad, acepta solicitudes, propone citas, envía propuestas y cambios, actualiza estados, solicita el cierre y evalúa al cliente | Web y app nativa |
| Organización de contratistas | Igual que el trabajador independiente, actuando como proveedor con un perfil y una disponibilidad general. No gestiona plantilla en el MVP (FP-03) | Web y app nativa |
| Administrador | Rol interno aprovisionado por la plataforma. Verifica identidad, experiencia y organizaciones; retira verificaciones; atiende solicitudes de soporte y ARCO; recibe avisos informativos. No interviene en decisiones comerciales (RD-11) | Web y app nativa |

El **agente de IA** no es un actor humano. Es un componente interno del sistema que actúa dentro de los casos de uso de los actores humanos (RE-03, RD-07).

#### 2.5 Canal y plataforma

- El MVP se entrega como **aplicación web responsive y aplicación móvil nativa**, disponibles para los cuatro actores (RE-01, RNF-02).
- WhatsApp queda fuera del MVP (FP-02).
- La identidad del usuario se basa en una cuenta registrada (RE-02).
- Todas las interfaces usan HTTPS (RE-09).

#### 2.6 Suposiciones y dependencias

- El agente de IA depende de un proveedor de IA externo. Si ese servicio no está disponible, el cliente puede capturar su solicitud de forma manual (RF-21). Los tiempos de respuesta de la IA no están sujetos al umbral de RNF-08 (RE-04).
- Se requiere que existan proveedores registrados en los municipios y oficios del piloto para que la búsqueda tenga resultados (RD-18).
- Las verificaciones dependen de la evidencia que entregue el proveedor y de la revisión del administrador. La verificación no garantiza resultados, precios ni cumplimiento futuro.
- **No se consideran confirmados**, y permanecen abiertos en la sección 8, los siguientes puntos:
  - la evidencia de experiencia aceptable sin certificados (PV-02);
  - la definición legal de "organización registrada" (PV-03);
  - los plazos legales y el aviso de privacidad (PV-08);
  - el modelo de ingreso (PV-09);
  - el valor legal de la propuesta aceptada (PV-10);
  - la capacidad del equipo para el alcance definido (PV-11);
  - el alcance completo de la anonimización (PV-12);
  - la métrica cuantitativa de usabilidad (PV-13).

---

## Parte III. Requerimientos específicos

### 3. Requerimientos funcionales

### 3.1 Cuentas y consentimiento

### RF-01 — Registro e inicio de sesión

**Descripción:** El sistema debe permitir que el cliente, el trabajador independiente y la organización de contratistas se registren con una cuenta e inicien sesión, tanto en la aplicación web como en la app nativa. Las cuentas de administrador se aprovisionan internamente y no se crean desde el registro público.

**Actor(es):** Cliente, Trabajador independiente, Organización de contratistas, Administrador.

**Origen:** I1:RF-30; I3:RNF-03, I3:LD-01; I4:RNF-04.

**Decisión asociada:** DEC-01, DEC-02, DEC-42.

**Criterios de aceptación:**

#### RF-01-AC-1
**Dado** una persona que aún no tiene cuenta (cliente, trabajador u organización),  
**cuando** se registra con los datos requeridos,  
**entonces** puede iniciar sesión con esa cuenta, tanto en la aplicación web como en la app nativa.  
*Origen del criterio: I1:RF-30-AC-1; web y app según DEC-42.*

#### RF-01-AC-2
**Dado** una persona que intenta iniciar sesión con datos incorrectos,  
**cuando** el sistema verifica las credenciales,  
**entonces** no permite el acceso.  
*Origen del criterio: I1:RF-30-AC-2.*

#### RF-01-AC-3
**Dado** el formulario de registro público,  
**cuando** una persona intenta registrarse con el rol de administrador,  
**entonces** el sistema no lo permite, porque las cuentas de administrador se aprovisionan internamente.  
*Origen del criterio: I1:RF-30 (descripción: "salvo Administrador, aprovisionado internamente").*

### RF-02 — Consentimiento del aviso de privacidad

**Descripción:** Al registrarse, el usuario debe aceptar el aviso de privacidad vigente y declarar que es mayor de edad. El sistema registra la fecha, la hora y la versión del aviso aceptado. Cuando se publique una versión nueva, el sistema solicita una nueva aceptación antes de continuar.

**Actor(es):** Cliente, Trabajador independiente, Organización de contratistas.

**Origen:** I2:RF-20 (sin el mecanismo de alta por WhatsApp); I2:RD-01.

**Decisión asociada:** GAP adoptado mediante DEC-37 (integrado al registro por cuenta de DEC-02).

**Criterios de aceptación:**

#### RF-02-AC-1
**Dado** una persona que completa el registro,  
**cuando** acepta el aviso de privacidad y declara ser mayor de edad,  
**entonces** se crea su cuenta y quedan registradas la fecha, la hora y la versión del aviso aceptado.  
*Origen del criterio: I2:RF-20-AC-1 e I2:RF-20-AC-3, adaptados al registro por cuenta (DEC-02, DEC-37).*

#### RF-02-AC-2
**Dado** una persona que completa el registro,  
**cuando** no acepta el aviso de privacidad,  
**entonces** no se crea la cuenta y el sistema informa que no puede prestar el servicio sin consentimiento.  
*Origen del criterio: I2:RF-20-AC-4.*

#### RF-02-AC-3
**Dado** un usuario que aceptó la versión 1 del aviso de privacidad,  
**cuando** se publica la versión 2 e inicia sesión de nuevo,  
**entonces** debe aceptar la versión 2 antes de continuar usando la plataforma.  
*Origen del criterio: I2:RF-20-AC-5.*

### 3.2 Perfiles y disponibilidad

### RF-03 — Perfil del trabajador

**Descripción:** El trabajador debe registrar un perfil con nombre, foto, uno o más oficios del catálogo (RD-18), años de experiencia y zona de cobertura (colonias que atiende, RD-04). El perfil queda visible en las búsquedas en cuanto los datos mínimos están completos, aunque todavía no tenga ninguna verificación (RF-08). El trabajador puede actualizar su información; la versión vigente es la que se usa en las búsquedas siguientes.

**Actor(es):** Trabajador independiente.

**Origen:** I1:RF-07; I2:RF-07 (campos y oficios del catálogo); I4:RF-10, I4:RD-05.

**Decisión asociada:** DEC-06, DEC-13, DEC-38.

**Criterios de aceptación:**

#### RF-03-AC-1
**Dado** un trabajador con cuenta creada,  
**cuando** completa nombre, foto, oficio, años de experiencia y zona de cobertura,  
**entonces** el perfil queda disponible para aparecer en las búsquedas de clientes.  
*Origen del criterio: I1:RF-07-AC-1; I4:RF-10-AC-1.*

#### RF-03-AC-2
**Dado** un trabajador que no completó todos los datos mínimos del perfil,  
**cuando** intenta que su perfil sea visible,  
**entonces** el perfil no aparece en las búsquedas hasta que los datos mínimos estén completos.  
*Origen del criterio: I1:RF-07-AC-2.*

#### RF-03-AC-3
**Dado** un trabajador con perfil registrado,  
**cuando** modifica su información profesional y guarda los cambios,  
**entonces** el sistema actualiza el perfil y usa la información vigente en las búsquedas siguientes.  
*Origen del criterio: I4:RF-10-AC-2.*

#### RF-03-AC-4
**Dado** un trabajador que registra su perfil,  
**cuando** indica un oficio que no pertenece al catálogo del piloto,  
**entonces** el sistema no acepta ese oficio.  
*Origen del criterio: I2:RF-07 (oficios del catálogo), según DEC-38.*

### RF-04 — Portafolio opcional

**Descripción:** El trabajador puede cargar fotos de trabajos anteriores en un portafolio. El portafolio es opcional: un perfil sin portafolio sigue siendo válido y visible.

**Actor(es):** Trabajador independiente.

**Origen:** I1:RF-34; I3:RF-05-AC-2.

**Decisión asociada:** DEC-08.

**Criterios de aceptación:**

#### RF-04-AC-1
**Dado** un perfil de trabajador ya creado,  
**cuando** el trabajador carga una o más fotos de trabajos anteriores,  
**entonces** las fotos quedan visibles en la sección de portafolio del perfil.  
*Origen del criterio: I1:RF-34-AC-1.*

#### RF-04-AC-2
**Dado** un perfil de trabajador válido sin fotos de portafolio,  
**cuando** el trabajador no carga ninguna foto,  
**entonces** el perfil se mantiene válido y visible en las búsquedas.  
*Origen del criterio: I1:RF-34-AC-2.*

### RF-05 — Registro y perfil de la organización

**Descripción:** El sistema debe permitir el registro y el perfil básico de una organización de contratistas con, al menos, nombre legal o comercial, un representante de contacto, los oficios que ofrece (del catálogo, RD-18) y su zona de cobertura. El perfil queda visible en las búsquedas en cuanto el perfil básico está completo. Su verificación es una marca separada (RF-11). En el MVP la organización actúa como proveedor con un perfil y una disponibilidad general (RF-06); no gestiona plantilla ni asigna trabajadores (FP-03). Los campos adicionales que pudiera exigir la definición de "organización registrada" permanecen abiertos (PV-03).

**Actor(es):** Organización de contratistas.

**Origen:** I1:RF-15; I2:RF-17 (parcial); I3 §2.3; I4:RF-10.

**Decisión asociada:** DEC-09, DEC-10.

**Criterios de aceptación:**

#### RF-05-AC-1
**Dado** una organización de contratistas con cuenta creada,  
**cuando** completa su perfil básico,  
**entonces** el perfil de la organización queda disponible para aparecer en las búsquedas de clientes.  
*Origen del criterio: I1:RF-15-AC-1.*

#### RF-05-AC-2
**Dado** una organización de contratistas que no completó su perfil básico,  
**cuando** intenta que su perfil sea visible,  
**entonces** el perfil no aparece en las búsquedas hasta que el perfil básico esté completo.  
*Origen del criterio: I1:RF-15-AC-2.*

### RF-06 — Disponibilidad del proveedor

**Descripción:** El trabajador debe poder mantener actualizado su calendario de disponibilidad. La organización de contratistas declara una disponibilidad general, sin gestionar la agenda de cada empleado. La disponibilidad vigente se considera en la búsqueda (RF-26) y en el agendamiento de citas (RF-34).

**Actor(es):** Trabajador independiente, Organización de contratistas.

**Origen:** I1:RF-08 (AC-1 a AC-3); I2:RF-22 (parcial); I3 §1.3; I4:RF-10.

**Decisión asociada:** Consenso; DEC-10.

**Criterios de aceptación:**

#### RF-06-AC-1
**Dado** un trabajador con calendario configurado,  
**cuando** marca una fecha como no disponible,  
**entonces** esa fecha deja de considerarse disponible en las búsquedas y en el agendamiento de citas.  
*Origen del criterio: I1:RF-08-AC-1 (las "propuestas de horario del agente" se sustituyen por la búsqueda y el agendamiento, DEC-16).*

#### RF-06-AC-2
**Dado** una fecha previamente marcada como no disponible,  
**cuando** el trabajador la vuelve a marcar como disponible,  
**entonces** esa fecha vuelve a considerarse disponible.  
*Origen del criterio: I1:RF-08-AC-2.*

#### RF-06-AC-3
**Dado** una organización de contratistas con perfil creado,  
**cuando** marca su disponibilidad general (por ejemplo, "aceptando proyectos" o "sin capacidad por ahora"),  
**entonces** esa disponibilidad se refleja en las búsquedas, sin gestionar la agenda de empleados individuales.  
*Origen del criterio: I1:RF-08-AC-3.*

### RF-07 — Consulta del perfil del proveedor

**Descripción:** El cliente debe poder consultar el perfil de un proveedor antes de seleccionarlo. El perfil muestra nombre, foto, modalidad (trabajador independiente u organización), especialidad, experiencia y cobertura; además, disponibilidad, estado de verificación y fecha de la última actualización. También muestra la calificación promedio, el número de evaluaciones y el promedio de cada una de las 4 dimensiones de evaluación. Cuando existen, muestra comentarios recientes, portafolio, rango de precio (solo de referencia, RD-12) y garantía. Solo cuentan las evaluaciones publicadas (RF-51).

**Actor(es):** Cliente.

**Origen:** I3:RF-05 (AC-1 a AC-3); I4:RF-03 (AC-1, AC-2); I1:RF-48 (AC-1, AC-2); I2:RF-11 (calificación promedio).

**Decisión asociada:** Consenso; DEC-14, DEC-31, DEC-51, DEC-63, DEC-64.

**Criterios de aceptación:**

#### RF-07-AC-1
**Dado** que el cliente selecciona un proveedor de los resultados o de las recomendaciones,  
**cuando** consulta su perfil,  
**entonces** el sistema muestra nombre, foto, modalidad, especialidad, experiencia, calificación promedio, número de evaluaciones, cobertura y disponibilidad.  
*Origen del criterio: I3:RF-05-AC-1; I4:RF-03-AC-1; I1:RF-48-AC-1.*

#### RF-07-AC-2
**Dado** un proveedor que cuenta con portafolio, comentarios, rango de precio o garantía,  
**cuando** el cliente consulta su perfil,  
**entonces** el sistema muestra esa información sin revelar datos privados de otros clientes.  
*Origen del criterio: I3:RF-05-AC-2; I4:RF-03-AC-2; garantía según DEC-51.*

#### RF-07-AC-3
**Dado** un perfil mostrado en los resultados o en detalle,  
**cuando** el cliente lo consulta,  
**entonces** el sistema muestra su estado de verificación y la fecha de su última actualización.  
*Origen del criterio: I3:RF-05-AC-3.*

#### RF-07-AC-4
**Dado** un proveedor sin ninguna evaluación publicada,  
**cuando** un cliente consulta su perfil,  
**entonces** el perfil indica que no tiene evaluaciones, sin error.  
*Origen del criterio: I1:RF-48-AC-2.*

#### RF-07-AC-5
**Dado** un proveedor con evaluaciones publicadas,  
**cuando** un cliente consulta su perfil,  
**entonces** el sistema muestra la calificación promedio y el promedio de cada dimensión (puntualidad, calidad, limpieza y apego al presupuesto), calculados solo con evaluaciones publicadas.  
*Origen del criterio: Derivado de DEC-64 y DEC-63; definición de calificación promedio de I2 §1.3.*

### RF-08 — Distinción entre información declarada y verificada

**Descripción:** El perfil debe distinguir visualmente la información declarada por el proveedor de la verificada por la plataforma. Si una verificación se rechaza o se retira, el perfil sigue visible y ese dato se muestra como declarado, sin la marca.

**Actor(es):** Cliente (consulta).

**Origen:** I1:RF-10 (AC-1, AC-2); I3:RF-05-AC-3.

**Decisión asociada:** DEC-06, DEC-48.

**Criterios de aceptación:**

#### RF-08-AC-1
**Dado** un perfil con datos declarados por el proveedor y datos verificados por la plataforma,  
**cuando** un cliente consulta ese perfil,  
**entonces** puede distinguir visualmente cuáles datos están verificados y cuáles son solo declarados.  
*Origen del criterio: I1:RF-10-AC-1.*

#### RF-08-AC-2
**Dado** un perfil recién creado, sin ninguna verificación aprobada,  
**cuando** un cliente lo consulta,  
**entonces** todos los datos se muestran como declarados, sin ninguna marca de verificado.  
*Origen del criterio: I1:RF-10-AC-2.*

#### RF-08-AC-3
**Dado** un perfil cuya verificación fue rechazada o retirada,  
**cuando** un cliente lo consulta o ejecuta una búsqueda en la que el proveedor es compatible,  
**entonces** el perfil sigue visible y el dato afectado se muestra como declarado, sin la marca.  
*Origen del criterio: Derivado de DEC-48.*

### 3.3 Verificación

### RF-09 — Verificación de identidad del trabajador

**Descripción:** La plataforma debe verificar la identidad del trabajador mediante una identificación oficial revisada por el administrador antes de mostrar la marca "identidad verificada". Si la identificación se rechaza, el perfil sigue visible sin la marca.

**Actor(es):** Trabajador independiente, Administrador.

**Origen:** I1:RF-09 (AC-1, AC-2); I2:RF-07 (identificación oficial); I3:RF-13-AC-1 (fecha y responsable).

**Decisión asociada:** DEC-07, DEC-48.

**Criterios de aceptación:**

#### RF-09-AC-1
**Dado** que un trabajador subió una identificación oficial,  
**cuando** el administrador la revisa y la aprueba,  
**entonces** el perfil muestra la marca "identidad verificada" y se registran la fecha y el administrador responsable.  
*Origen del criterio: I1:RF-09-AC-1; I3:RF-13-AC-1.*

#### RF-09-AC-2
**Dado** que un trabajador subió una identificación oficial,  
**cuando** el administrador la rechaza por no ser válida,  
**entonces** el perfil no muestra la marca, el trabajador recibe una notificación con el motivo y el perfil sigue visible.  
*Origen del criterio: I1:RF-09-AC-2; visibilidad según DEC-48.*

### RF-10 — Verificación de experiencia

**Descripción:** La plataforma debe verificar la evidencia de experiencia (referencias de clientes, certificados cuando existan o fotos de portafolio) antes de mostrar la marca "experiencia verificada". Esta marca es independiente de la de identidad. Qué evidencia se acepta cuando no hay certificados sigue abierto (PV-02).

**Actor(es):** Trabajador independiente, Administrador.

**Origen:** I1:RF-35 (AC-1, AC-2); I3:RF-13 (evidencia de portafolio).

**Decisión asociada:** DEC-07, DEC-08, DEC-48.

**Criterios de aceptación:**

#### RF-10-AC-1
**Dado** que un trabajador presentó evidencia de experiencia,  
**cuando** el administrador la valida,  
**entonces** el perfil muestra la marca "experiencia verificada", de forma independiente a la verificación de identidad.  
*Origen del criterio: I1:RF-35-AC-1.*

#### RF-10-AC-2
**Dado** que un trabajador presentó evidencia de experiencia,  
**cuando** el administrador no la considera suficiente,  
**entonces** el perfil no muestra la marca "experiencia verificada" y el trabajador recibe una notificación con el motivo.  
*Origen del criterio: I1:RF-35-AC-2.*

### RF-11 — Verificación de la organización

**Descripción:** La plataforma debe verificar a una organización de contratistas, mediante documentos de constitución o del representante legal, antes de mostrar la marca "organización verificada". Esta verificación es separada del registro básico (RF-05).

**Actor(es):** Organización de contratistas, Administrador.

**Origen:** I1:RF-62 (AC-1, AC-2); I2:RF-17 (aprobación); I3:RF-13.

**Decisión asociada:** DEC-09, DEC-48.

**Criterios de aceptación:**

#### RF-11-AC-1
**Dado** que una organización presentó documentos de identidad (constitución o representante legal),  
**cuando** el administrador los revisa y los aprueba,  
**entonces** el perfil de la organización muestra la marca "organización verificada".  
*Origen del criterio: I1:RF-62-AC-1.*

#### RF-11-AC-2
**Dado** que una organización presentó esos documentos,  
**cuando** el administrador no los considera suficientes,  
**entonces** el perfil no muestra la marca, la organización recibe una notificación con el motivo y su perfil sigue visible.  
*Origen del criterio: I1:RF-62-AC-2; visibilidad según DEC-48.*

### RF-12 — Retiro de la verificación

**Descripción:** El sistema debe retirar una marca de verificación en dos casos:
- **Automáticamente**, cuando vence el documento que la respalda.
- **Por decisión del administrador**, cuando confirma que una información es falsa, ya sea porque la conoció por una solicitud de soporte (RF-22) o en su propia revisión.

El sistema no determina por sí solo que una información es falsa. Al retirarse la marca, el perfil sigue visible sin ella (RF-08).

**Actor(es):** Administrador, Trabajador independiente, Organización de contratistas.

**Origen:** I1:RF-29 (AC-1; AC-2 ajustado).

**Decisión asociada:** DEC-07 (resolución posterior), DEC-35, DEC-48.

**Criterios de aceptación:**

#### RF-12-AC-1
**Dado** un documento de verificación con fecha de vencimiento superada,  
**cuando** el sistema detecta el vencimiento,  
**entonces** retira la marca de verificación correspondiente, avisa al proveedor para que la actualice y el perfil sigue visible.  
*Origen del criterio: I1:RF-29-AC-1; visibilidad según DEC-48.*

#### RF-12-AC-2
**Dado** que el administrador confirmó que una información de un perfil es falsa, a partir de una solicitud de soporte o de su propia revisión,  
**cuando** registra esa confirmación,  
**entonces** el sistema retira la marca de verificación correspondiente y avisa al proveedor; el sistema no determina la falsedad por sí solo.  
*Origen del criterio: I1:RF-29-AC-2, ajustado por la resolución posterior de DEC-07 (sin depender de reportes).*

### 3.4 Solicitud y agente de IA

### RF-13 — Identificación del agente como asistente automático

**Descripción:** El agente de IA debe identificarse como asistente automático desde el primer mensaje y no hacerse pasar por una persona.

**Actor(es):** Cliente (destinatario); Agente de IA (componente interno).

**Origen:** I1:RF-56.

**Decisión asociada:** GAP adoptado mediante DEC-44.

**Criterios de aceptación:**

#### RF-13-AC-1
**Dado** que el cliente inicia una conversación nueva con el agente,  
**cuando** el agente envía su primer mensaje,  
**entonces** el mensaje indica explícitamente que es un asistente automático y no una persona.  
*Origen del criterio: I1:RF-56-AC-1.*

#### RF-13-AC-2
**Dado** una conversación con el agente ya avanzada,  
**cuando** el cliente la revisa en cualquier punto posterior al primer mensaje,  
**entonces** puede seguir viendo que interactúa con un asistente automático.  
*Origen del criterio: I1:RF-56-AC-2.*

### RF-14 — Conversación guiada con el agente

**Descripción:** El cliente debe poder describir su proyecto conversando con el agente de IA, que hace una pregunta sencilla a la vez. El agente solicita solo los datos aplicables al oficio (por ejemplo, medidas, condiciones del espacio, materiales y quién los compra). Si el cliente no conoce un dato, el agente lo registra como "desconocido": no lo inventa ni bloquea la solicitud.

**Actor(es):** Cliente; Agente de IA (componente interno).

**Origen:** I1:RF-01 (AC-1, AC-2); I3:RF-02 (AC-1 a AC-3); I2:RF-02.

**Decisión asociada:** GAP adoptado mediante DEC-03 (sin sugerencia de visita, DEC-71).

**Criterios de aceptación:**

#### RF-14-AC-1
**Dado** un cliente con sesión iniciada y sin un proyecto en curso,  
**cuando** escribe una descripción inicial de su proyecto,  
**entonces** el agente responde con una pregunta sencilla a la vez, sin pedir todos los datos en un solo mensaje.  
*Origen del criterio: I1:RF-01-AC-1.*

#### RF-14-AC-2
**Dado** una conversación avanzada con varias preguntas ya respondidas,  
**cuando** el cliente responde la pregunta más reciente,  
**entonces** el agente hace únicamente la siguiente pregunta, no varias a la vez.  
*Origen del criterio: I1:RF-01-AC-2.*

#### RF-14-AC-3
**Dado** una solicitud que no incluye medidas ni condiciones del espacio aplicables al oficio,  
**cuando** el cliente conversa con el agente,  
**entonces** el agente solicita esos datos antes de generar el resumen.  
*Origen del criterio: I3:RF-02-AC-1.*

#### RF-14-AC-4
**Dado** que el cliente indica que el trabajo requiere materiales,  
**cuando** responde al agente,  
**entonces** el agente pregunta si los comprará el cliente o el proveedor.  
*Origen del criterio: I3:RF-02-AC-2.*

#### RF-14-AC-5
**Dado** que el cliente declara desconocer una medida o condición aplicable,  
**cuando** confirma el resumen,  
**entonces** el sistema conserva el valor "desconocido" sin inventarlo ni bloquear la solicitud.  
*Origen del criterio: I3:RF-02-AC-3, sin el ofrecimiento de visita (movido a FP-23 por DEC-71).*

### RF-15 — Clasificación del oficio

**Descripción:** El agente debe asignar a cada proyecto exactamente una categoría del catálogo de oficios (RD-18). Si después de 2 preguntas de aclaración no logra asignar una sola categoría, no asigna oficio y ofrece la solicitud de soporte (RF-22).

**Actor(es):** Cliente; Agente de IA (componente interno).

**Origen:** I2:RF-03 (AC-1 a AC-4).

**Decisión asociada:** GAP adoptado mediante DEC-45; DEC-35, DEC-38.

**Criterios de aceptación:**

#### RF-15-AC-1
**Dado** un conjunto de prueba de 50 descripciones de proyectos etiquetadas con su oficio,  
**cuando** el sistema clasifica cada descripción,  
**entonces** al menos 45 (90 %) reciben exactamente la categoría etiquetada.  
*Origen del criterio: I2:RF-03-AC-1.*

#### RF-15-AC-2
**Dado** cualquier descripción del conjunto de prueba,  
**cuando** el sistema la clasifica,  
**entonces** el oficio asignado queda vacío o es una de las 10 categorías del catálogo.  
*Origen del criterio: I2:RF-03-AC-2.*

#### RF-15-AC-3
**Dado** que el agente ya hizo 2 preguntas de aclaración sin poder asignar una sola categoría,  
**cuando** recibe la respuesta a la segunda pregunta y sigue sin poder asignarla,  
**entonces** el oficio queda vacío y el agente ofrece al cliente la solicitud de soporte.  
*Origen del criterio: I2:RF-03-AC-3 (la transferencia a soporte se sustituye por la solicitud de soporte, DEC-35).*

#### RF-15-AC-4
**Dado** que el agente ha hecho 0 o 1 preguntas de aclaración,  
**cuando** no puede asignar una sola categoría,  
**entonces** envía una nueva pregunta de aclaración y todavía no ofrece la solicitud de soporte.  
*Origen del criterio: I2:RF-03-AC-4.*

### RF-16 — Datos mínimos del borrador y de la búsqueda

**Descripción:** Para guardar un borrador de solicitud se requieren el resultado esperado, el oficio y la zona aproximada. Para pasar a la búsqueda se requieren el tipo de trabajo, la colonia o zona aproximada, la fecha deseada y una descripción básica. Las fotos, los videos, las medidas, los materiales y el presupuesto son opcionales. El domicilio exacto no se pide para guardar ni para buscar; se pide en el momento definido en RF-52.

**Actor(es):** Cliente.

**Origen:** I3:RF-01 (AC-1, AC-2), I3:LD-02; I1:RF-04 (AC-1, AC-2); I4:RF-01.

**Decisión asociada:** DEC-12, DEC-69, DEC-79.

**Criterios de aceptación:**

#### RF-16-AC-1
**Dado** que el cliente proporciona el resultado esperado, el oficio y la zona aproximada,  
**cuando** se guarda la solicitud,  
**entonces** el sistema crea la solicitud en estado "borrador" y muestra su identificador.  
*Origen del criterio: I3:RF-01-AC-1.*

#### RF-16-AC-2
**Dado** que falta el resultado esperado, el oficio o la zona aproximada,  
**cuando** se intenta guardar la solicitud,  
**entonces** el sistema no la crea e identifica cada campo obligatorio faltante.  
*Origen del criterio: I3:RF-01-AC-2.*

#### RF-16-AC-3
**Dado** una solicitud en curso,  
**cuando** el cliente intenta pasar a la búsqueda de proveedores,  
**entonces** el sistema exige que ya estén capturados el tipo de trabajo, la zona, la fecha deseada y la descripción básica.  
*Origen del criterio: I1:RF-04-AC-1.*

#### RF-16-AC-4
**Dado** una solicitud con los datos mínimos de búsqueda capturados,  
**cuando** el cliente no proporciona fotos, videos, medidas ni presupuesto,  
**entonces** el sistema permite continuar a la búsqueda sin exigir esos datos opcionales.  
*Origen del criterio: I1:RF-04-AC-2.*

#### RF-16-AC-5
**Dado** una solicitud en estado "borrador" o "confirmada",  
**cuando** el cliente guarda la solicitud o ejecuta la búsqueda,  
**entonces** el sistema no le exige calle ni número de su domicilio.  
*Origen del criterio: Derivado de DEC-12 y DEC-79.*

### RF-17 — Fotos y videos en la solicitud

**Descripción:** El cliente puede adjuntar fotos y videos opcionales a su solicitud, también durante la conversación con el agente. Las notas de voz no se procesan en el MVP (FP-01).

**Actor(es):** Cliente.

**Origen:** I1:RF-02 (AC-1, AC-2); I3:RF-01; I4:RF-01-AC-2; I2:RF-01-AC-4 (ajustado).

**Decisión asociada:** DEC-11, DEC-04.

**Criterios de aceptación:**

#### RF-17-AC-1
**Dado** una solicitud en curso,  
**cuando** el cliente adjunta una foto o un video,  
**entonces** el archivo queda asociado a la solicitud que está describiendo.  
*Origen del criterio: I1:RF-02-AC-1; I4:RF-01-AC-2; video según DEC-11.*

#### RF-17-AC-2
**Dado** una solicitud en curso,  
**cuando** el cliente no adjunta fotos ni videos,  
**entonces** la solicitud continúa con normalidad, porque adjuntarlos es opcional.  
*Origen del criterio: I1:RF-02-AC-2.*

#### RF-17-AC-3
**Dado** una solicitud en estado "borrador",  
**cuando** el cliente envía una nota de voz,  
**entonces** el archivo no se procesa y el sistema indica los formatos aceptados (texto, fotos y videos).  
*Origen del criterio: I2:RF-01-AC-4, ajustado por DEC-04 (sin voz) y DEC-11 (con video).*

### RF-18 — Límites de imágenes y proyectos múltiples

**Descripción:** El sistema acepta imágenes JPG o PNG de hasta 5 MB, con un máximo de 10 imágenes por proyecto. Si el cliente tiene más de un proyecto activo (no concluido), el agente pregunta a cuál corresponde un archivo antes de asociarlo. Los límites para videos siguen abiertos (PV-01).

**Actor(es):** Cliente.

**Origen:** I2:RF-01 (AC-1, AC-3, AC-5, AC-6).

**Decisión asociada:** GAP adoptado mediante DEC-47.

**Criterios de aceptación:**

#### RF-18-AC-1
**Dado** un cliente con un proyecto en estado "borrador",  
**cuando** envía una imagen PNG de 3 MB,  
**entonces** la imagen queda asociada a ese proyecto y su contador de imágenes aumenta en 1.  
*Origen del criterio: I2:RF-01-AC-1.*

#### RF-18-AC-2
**Dado** un cliente con un proyecto en estado "borrador",  
**cuando** envía una imagen JPG de 6 MB,  
**entonces** la imagen no se asocia y el sistema indica el límite de 5 MB.  
*Origen del criterio: I2:RF-01-AC-3.*

#### RF-18-AC-3
**Dado** un proyecto con 10 imágenes asociadas,  
**cuando** el cliente envía una imagen adicional,  
**entonces** la imagen no se asocia, el contador permanece en 10 y el sistema pide indicar cuál imagen reemplazar.  
*Origen del criterio: I2:RF-01-AC-5.*

#### RF-18-AC-4
**Dado** un cliente con dos proyectos activos,  
**cuando** envía una imagen,  
**entonces** el agente pregunta a cuál de los dos proyectos corresponde, mostrando ambos, y la imagen no se asocia hasta que el cliente elige.  
*Origen del criterio: I2:RF-01-AC-6.*

### RF-19 — Repregunta ante ambigüedad

**Descripción:** Si el agente no entiende la respuesta del cliente, debe repreguntar o pedir una foto en lugar de asumir datos no confirmados.

**Actor(es):** Cliente; Agente de IA (componente interno).

**Origen:** I1:RF-05 (AC-1, AC-2).

**Decisión asociada:** GAP adoptado mediante DEC-03.

**Criterios de aceptación:**

#### RF-19-AC-1
**Dado** que el cliente dio una respuesta ambigua o incompleta,  
**cuando** el agente no logra interpretarla con suficiente certeza,  
**entonces** el agente repregunta o pide una foto, en lugar de asumir un dato no confirmado.  
*Origen del criterio: I1:RF-05-AC-1.*

#### RF-19-AC-2
**Dado** que el cliente describe un problema difícil de entender solo con texto,  
**cuando** el agente no logra interpretarlo con suficiente certeza,  
**entonces** el agente pide una foto en lugar de asumir el dato o seguir repreguntando por texto.  
*Origen del criterio: I1:RF-05-AC-2.*

### RF-20 — Resumen confirmable de la solicitud

**Descripción:** Antes de buscar proveedores, el agente debe presentar un resumen editable de la solicitud para que el cliente lo confirme o lo corrija. Solo la versión confirmada se usa para las recomendaciones. Al confirmarse, la solicitud pasa al estado "confirmada".

**Actor(es):** Cliente; Agente de IA (componente interno).

**Origen:** I1:RF-03 (AC-1, AC-2); I3:RF-03 (AC-1, AC-3); I2:RF-02 (AC-3, AC-4).

**Decisión asociada:** GAP adoptado mediante DEC-03; DEC-59.

**Criterios de aceptación:**

#### RF-20-AC-1
**Dado** que el agente ya reunió los datos mínimos de la solicitud,  
**cuando** termina de recopilar la información,  
**entonces** presenta un resumen editable y espera la confirmación o corrección del cliente antes de iniciar la búsqueda.  
*Origen del criterio: I1:RF-03-AC-1; I3:RF-03-AC-1.*

#### RF-20-AC-2
**Dado** un resumen ya presentado,  
**cuando** el cliente corrige un dato en lugar de confirmarlo,  
**entonces** el agente presenta un nuevo resumen con la corrección, la solicitud permanece en "borrador" y el agente vuelve a esperar la confirmación.  
*Origen del criterio: I1:RF-03-AC-2; I2:RF-02-AC-4.*

#### RF-20-AC-3
**Dado** que el cliente editó el resumen,  
**cuando** lo confirma,  
**entonces** el sistema guarda la versión confirmada y la usa exclusivamente para las recomendaciones.  
*Origen del criterio: I3:RF-03-AC-3.*

#### RF-20-AC-4
**Dado** un resumen presentado,  
**cuando** el cliente lo confirma,  
**entonces** la solicitud pasa al estado "confirmada" y se registran la fecha y la hora de la confirmación.  
*Origen del criterio: I2:RF-02-AC-3, adaptado al modelo de estados de DEC-59.*

### RF-21 — Captura manual si la IA no está disponible

**Descripción:** Si el servicio de IA no está disponible, el cliente debe poder capturar su solicitud manualmente, sin preguntas ni resumen automatizado. Los datos mínimos de RF-16 se exigen igual.

**Actor(es):** Cliente.

**Origen:** I3 §2.5; I4:RF-01 (AC-1, AC-2).

**Decisión asociada:** GAP adoptado mediante DEC-46.

**Criterios de aceptación:**

#### RF-21-AC-1
**Dado** que el servicio de IA no está disponible,  
**cuando** el cliente intenta crear una solicitud,  
**entonces** el sistema le permite capturarla manualmente, sin preguntas ni resumen automatizado del agente.  
*Origen del criterio: Derivado de DEC-46 (I3 §2.5).*

#### RF-21-AC-2
**Dado** que el cliente captura una solicitud manualmente,  
**cuando** agrega información complementaria (descripción, fotos, videos, medidas o materiales),  
**entonces** el sistema la asocia a la solicitud correspondiente.  
*Origen del criterio: I4:RF-01-AC-2.*

#### RF-21-AC-3
**Dado** que el cliente captura una solicitud manualmente,  
**cuando** intenta guardarla sin el resultado esperado, el oficio o la zona aproximada,  
**entonces** el sistema no la crea e identifica los campos faltantes, igual que en RF-16.  
*Origen del criterio: Derivado de DEC-46 y DEC-69.*

### RF-22 — Solicitud de soporte humano

**Descripción:** El sistema debe ofrecer al cliente una solicitud de soporte cuando el agente no logra entenderlo después de 2 intentos consecutivos (RF-19) o no puede clasificar el oficio (RF-15). El cliente también puede solicitar soporte por su cuenta cuando la IA no resuelve su necesidad. El caso se registra con la solicitud y el resumen de la conversación, y lo atiende el administrador. No existe un rol de soporte separado (FP-17). El tiempo de atención sigue abierto (PV-07).

**Actor(es):** Cliente, Administrador.

**Origen:** I1:RF-06 (AC-1, AC-2); I3:RF-14-AC-1.

**Decisión asociada:** DEC-03, DEC-35.

**Criterios de aceptación:**

#### RF-22-AC-1
**Dado** que el agente repreguntó una vez sin éxito,  
**cuando** el cliente corrige o rechaza la interpretación del agente por segunda vez consecutiva,  
**entonces** el sistema le ofrece solicitar soporte de una persona.  
*Origen del criterio: I1:RF-06-AC-1.*

#### RF-22-AC-2
**Dado** que el cliente indica que la respuesta de la IA no resolvió su necesidad,  
**cuando** selecciona "Solicitar soporte",  
**entonces** el sistema registra el caso con la solicitud y el resumen de la conversación, y queda disponible para el administrador.  
*Origen del criterio: I3:RF-14-AC-1; atención por el administrador según DEC-35.*

#### RF-22-AC-3
**Dado** que se registró una solicitud de soporte,  
**cuando** el administrador no la atiende de inmediato,  
**entonces** la solicitud permanece registrada para un contacto posterior.  
*Origen del criterio: I1:RF-06-AC-2 (se conserva la opción "deja registrada la solicitud"; el tiempo estimado queda en PV-07).*

### RF-23 — Representación visual con IA

**Descripción:** El cliente puede adjuntar imágenes de referencia y pedir al agente una representación visual del alcance del trabajo. La representación es una ayuda de comunicación, no un plano técnico ni una garantía de ejecución (RD-08). El acceso a ella está restringido (RNF-06).

**Actor(es):** Cliente; Agente de IA (componente interno).

**Origen:** I3:RF-16 (AC-1, AC-2); I3:LD-07.

**Decisión asociada:** GAP adoptado mediante DEC-05.

**Criterios de aceptación:**

#### RF-23-AC-1
**Dado** que el cliente adjunta al menos una imagen de referencia y describe el resultado esperado,  
**cuando** solicita una representación visual,  
**entonces** el sistema genera una propuesta asociada a la solicitud y permite al cliente editar su descripción.  
*Origen del criterio: I3:RF-16-AC-1.*

#### RF-23-AC-2
**Dado** que el cliente aprueba una representación visual,  
**cuando** confirma la solicitud,  
**entonces** el sistema guarda la representación como versión de referencia para la propuesta y la identifica como "no es plano técnico".  
*Origen del criterio: I3:RF-16-AC-2.*

### RF-24 — Autorización explícita de acciones sensibles

**Descripción:** Las acciones que comprometen el tiempo, el dinero o los datos del cliente requieren su autorización explícita; si el cliente la rechaza, la acción no se ejecuta. Dos acciones del cliente cuentan como autorización para revelar su domicilio al trabajador (RF-52): aceptar la propuesta y, si hay visita, confirmar la cita de visita.

**Actor(es):** Cliente.

**Origen:** I1:RF-20 (AC-1, AC-2).

**Decisión asociada:** GAP adoptado mediante DEC-72; DEC-78.

**Criterios de aceptación:**

#### RF-24-AC-1
**Dado** que se va a ejecutar una acción sensible (contactar a un proveedor, confirmar o cancelar una cita, compartir el domicilio o el presupuesto, aceptar un cambio de costo),  
**cuando** el sistema presenta la acción al cliente,  
**entonces** la acción no se ejecuta hasta que el cliente la autoriza explícitamente.  
*Origen del criterio: I1:RF-20-AC-1.*

#### RF-24-AC-2
**Dado** que se presentó una acción sensible al cliente para su autorización,  
**cuando** el cliente la rechaza,  
**entonces** la acción no se ejecuta y el sistema le informa que no se realizó.  
*Origen del criterio: I1:RF-20-AC-2.*

#### RF-24-AC-3
**Dado** un cliente que acepta la propuesta de un trabajador o, si hay visita, confirma la cita de visita,  
**cuando** el sistema registra esa acción,  
**entonces** la registra también como autorización para revelar su domicilio a ese trabajador, sin pedir una autorización adicional.  
*Origen del criterio: Derivado de DEC-72 y DEC-78.*

### RF-25 — Indicador de procesamiento

**Descripción:** El sistema debe mostrar un indicador de texto simple si no hay respuesta en los primeros 2 segundos, tanto en la conversación como en la búsqueda.

**Actor(es):** Cliente.

**Origen:** I1:RF-53 (AC-1, AC-2).

**Decisión asociada:** GAP adoptado mediante DEC-39 (resolución posterior).

**Criterios de aceptación:**

#### RF-25-AC-1
**Dado** que el cliente envió un mensaje al agente o inició una búsqueda,  
**cuando** pasan 2 segundos sin una respuesta completa,  
**entonces** aparece un indicador de texto simple que avisa que se está procesando.  
*Origen del criterio: I1:RF-53-AC-1.*

#### RF-25-AC-2
**Dado** que la respuesta llega dentro de los primeros 2 segundos,  
**cuando** el cliente envía una solicitud,  
**entonces** el indicador de procesamiento no llega a mostrarse.  
*Origen del criterio: I1:RF-53-AC-2.*

### 3.5 Búsqueda y recomendación

### RF-26 — Búsqueda de proveedores compatibles

**Descripción:** El sistema debe buscar trabajadores independientes y organizaciones de contratistas para la versión confirmada de una solicitud. La búsqueda combina oficio (RD-06), cobertura (RD-04), disponibilidad en la fecha deseada (RD-05) y evaluación. Incluye a los proveedores con perfil completo aunque no estén verificados o tengan una verificación retirada; en ese caso se muestra su estado de verificación. Ningún criterio de búsqueda depende de pagos ni de suscripciones (RNF-10).

**Actor(es):** Cliente.

**Origen:** I1:RF-11 (AC-1, AC-2); I3:RF-04 (AC-1); I4:RF-04 (AC-1, AC-2), I4:RD-01; I2:RF-04 (criterios a, b y d).

**Decisión asociada:** Consenso; DEC-06, DEC-13, DEC-24, DEC-48.

**Criterios de aceptación:**

#### RF-26-AC-1
**Dado** una solicitud confirmada con oficio, zona y fecha,  
**cuando** el cliente solicita resultados,  
**entonces** el sistema muestra únicamente los proveedores cuyo oficio, cobertura y disponibilidad coinciden con la solicitud, y considera su evaluación.  
*Origen del criterio: I1:RF-11-AC-1; I3:RF-04-AC-1.*

#### RF-26-AC-2
**Dado** una solicitud con un tipo de trabajo definido,  
**cuando** el sistema realiza la búsqueda,  
**entonces** excluye a los proveedores cuyo oficio o especialidad no corresponde al servicio solicitado.  
*Origen del criterio: I4:RF-04-AC-1.*

#### RF-26-AC-3
**Dado** un proveedor compatible con perfil completo y sin ninguna verificación aprobada,  
**cuando** el sistema realiza la búsqueda,  
**entonces** el proveedor aparece en los resultados con su estado de verificación visible.  
*Origen del criterio: Derivado de DEC-06 y DEC-48.*

#### RF-26-AC-4
**Dado** resultados mostrados solo con los criterios base,  
**cuando** el cliente no aplica ningún filtro adicional,  
**entonces** los resultados se basan únicamente en oficio, cobertura, disponibilidad y evaluación, sin ningún criterio de pago.  
*Origen del criterio: I1:RF-11-AC-2; ausencia de criterios de pago según DEC-24.*

### RF-27 — Búsqueda sin resultados

**Descripción:** Si ningún proveedor coincide con el oficio, la zona y la fecha de la solicitud, el sistema muestra el mensaje "No hay proveedores disponibles para los criterios seleccionados".

**Actor(es):** Cliente.

**Origen:** I3:RF-04-AC-2.

**Decisión asociada:** GAP adoptado mediante DEC-53.

**Criterios de aceptación:**

> **Nota:** este requisito tiene un solo criterio. Es puramente informativo: DEC-53 adoptó únicamente el mensaje y descartó las alternativas de ampliar la búsqueda o avisar después. No queda otro comportamiento que verificar.

#### RF-27-AC-1
**Dado** que no existe ningún proveedor que coincida con el oficio, la zona y la fecha,  
**cuando** el cliente solicita resultados,  
**entonces** el sistema muestra el mensaje "No hay proveedores disponibles para los criterios seleccionados".  
*Origen del criterio: I3:RF-04-AC-2.*

### RF-28 — Filtros por verificación y experiencia similar

**Descripción:** El cliente puede acotar los resultados con filtros opcionales: identidad verificada y experiencia en trabajos similares.

**Actor(es):** Cliente.

**Origen:** I1:RF-12 (AC-1, AC-2).

**Decisión asociada:** DEC-06.

**Criterios de aceptación:**

#### RF-28-AC-1
**Dado** resultados de búsqueda ya mostrados,  
**cuando** el cliente activa el filtro de identidad verificada o el de experiencia similar,  
**entonces** los resultados se acotan según el filtro elegido.  
*Origen del criterio: I1:RF-12-AC-1.*

#### RF-28-AC-2
**Dado** resultados con un filtro adicional aplicado,  
**cuando** el cliente lo desactiva,  
**entonces** los resultados se amplían de nuevo, sin ese filtro.  
*Origen del criterio: I1:RF-12-AC-2.*

### RF-29 — Filtrar y ordenar resultados

**Descripción:** El cliente puede filtrar y ordenar los resultados por precio, calificación, disponibilidad, cercanía y garantía. El sistema indica en todo momento el criterio aplicado. Los órdenes son:

| Criterio | Orden |
|---|---|
| Calificación | De mayor a menor |
| Precio | De menor a mayor (referencia que define el proveedor, RD-12) |
| Disponibilidad | Por la franja más próxima |
| Cercanía | Primero los proveedores que cubren la colonia del cliente y después los que solo cubren colonias vecinas |
| Garantía | Primero los proveedores que ofrecen garantía y después los que no |

Los empates se ordenan por calificación de mayor a menor.

**Actor(es):** Cliente.

**Origen:** I3:RF-06 (AC-1 a AC-3, descripción).

**Decisión asociada:** DEC-14, DEC-51, DEC-80, DEC-82.

**Criterios de aceptación:**

#### RF-29-AC-1
**Dado** que existen resultados o recomendaciones,  
**cuando** el cliente elige calificación, disponibilidad, precio, cercanía o garantía como criterio de orden,  
**entonces** el sistema reordena la lista y muestra el criterio aplicado.  
*Origen del criterio: I3:RF-06-AC-1.*

#### RF-29-AC-2
**Dado** que existen resultados o recomendaciones,  
**cuando** el cliente aplica un filtro de calificación, disponibilidad, precio, cercanía o garantía,  
**entonces** el sistema muestra únicamente los proveedores que cumplen el filtro.  
*Origen del criterio: I3:RF-06-AC-2.*

#### RF-29-AC-3
**Dado** que el cliente aplica un filtro numérico (por ejemplo, precio o calificación),  
**cuando** indica un valor mínimo o máximo,  
**entonces** el sistema muestra el valor aplicado y excluye los resultados sin un valor comparable, salvo que el cliente elija incluirlos explícitamente.  
*Origen del criterio: I3:RF-06-AC-3.*

#### RF-29-AC-4
**Dado** resultados con proveedores que cubren la colonia del cliente y otros que solo cubren colonias vecinas,  
**cuando** el cliente ordena por cercanía,  
**entonces** aparecen primero los que cubren la colonia del cliente y después los que cubren colonias vecinas.  
*Origen del criterio: Derivado de DEC-80.*

#### RF-29-AC-5
**Dado** dos proveedores con el mismo valor en el criterio de orden elegido,  
**cuando** el sistema ordena la lista,  
**entonces** aparece primero el de mayor calificación.  
*Origen del criterio: I3:RF-06 (descripción: "los empates se ordenan por calificación de mayor a menor").*

#### RF-29-AC-6
**Dado** resultados con proveedores que ofrecen garantía y otros que no,
**cuando** el cliente ordena por garantía,
**entonces** aparecen primero los proveedores que ofrecen garantía y después los que no.
*Origen del criterio: Derivado de DEC-82.*

### RF-30 — Recomendación de 3 a 4 proveedores

**Descripción:** El agente debe recomendar de 3 a 4 proveedores cuando existan, cada uno con una explicación breve de por qué se sugiere. Si hay menos de 3 candidatos, muestra los que existan (al menos 1) e indica explícitamente que hay menos opciones de las habituales. El cliente elige; la IA no asigna (RD-07).

**Actor(es):** Cliente; Agente de IA (componente interno).

**Origen:** I1:RF-13 (AC-1, AC-2); I3:RF-04-AC-3; I4:RF-05 (AC-1, AC-2); I2:RF-04 (límite de 3 sin efecto).

**Decisión asociada:** DEC-15.

**Criterios de aceptación:**

#### RF-30-AC-1
**Dado** una búsqueda con 4 o más candidatos elegibles,  
**cuando** el agente arma la recomendación,  
**entonces** muestra entre 3 y 4 opciones, cada una con una explicación breve, y el cliente elige (el agente no asigna).  
*Origen del criterio: I1:RF-13-AC-1.*

#### RF-30-AC-2
**Dado** una búsqueda con menos de 3 candidatos elegibles,  
**cuando** el agente arma la recomendación,  
**entonces** muestra los candidatos que existan (al menos 1) e indica explícitamente que hay menos opciones de las habituales.  
*Origen del criterio: I1:RF-13-AC-2.*

#### RF-30-AC-3
**Dado** que se muestra una recomendación,  
**cuando** el cliente consulta su explicación,  
**entonces** el sistema muestra el oficio, la cobertura, la disponibilidad y el estado de verificación que la sustentan, sin afirmar que la IA garantiza el resultado.  
*Origen del criterio: I3:RF-04-AC-3.*

#### RF-30-AC-4
**Dado** que se muestran proveedores recomendados,  
**cuando** el cliente consulta las opciones,  
**entonces** puede ver información para compararlas, como experiencia, evaluación, disponibilidad y precio o rango de costo cuando exista.  
*Origen del criterio: I4:RF-05-AC-2.*

### RF-31 — Selección del proveedor

**Descripción:** El cliente debe poder seleccionar a uno de los proveedores compatibles para continuar con la gestión del servicio. La solicitud queda asociada a ese proveedor, que recibe la ficha del proyecto con la colonia y el municipio, sin calle ni número (RD-15).

**Actor(es):** Cliente.

**Origen:** I4:RF-06 (AC-1, AC-2); I1:RF-13; I2:RF-18-AC-1.

**Decisión asociada:** Consenso.

**Criterios de aceptación:**

#### RF-31-AC-1
**Dado** que el cliente consulta proveedores compatibles,  
**cuando** selecciona a un proveedor disponible,  
**entonces** el sistema lo asocia a la solicitud correspondiente.  
*Origen del criterio: I4:RF-06-AC-1.*

#### RF-31-AC-2
**Dado** un proveedor ya seleccionado para una solicitud,  
**cuando** el cliente consulta esa solicitud,  
**entonces** el sistema muestra el proveedor asociado y el estado actual del proyecto.  
*Origen del criterio: I4:RF-06-AC-2.*

#### RF-31-AC-3
**Dado** que el cliente seleccionó un proveedor,  
**cuando** el sistema le envía la solicitud,  
**entonces** el proveedor recibe la ficha con la colonia y el municipio, sin calle ni número.  
*Origen del criterio: I2:RF-18-AC-1.*

### 3.6 Citas

### RF-32 — Aceptación de la solicitud por el prestador

**Descripción:** El prestador seleccionado debe aceptar o rechazar la solicitud en un máximo de 4 horas, contadas dentro de su horario de atención declarado. Si la rechaza o no responde a tiempo, el cliente recibe un aviso y las opciones restantes. Si no quedan opciones, el sistema ejecuta una nueva búsqueda que excluye a los prestadores que ya rechazaron o dejaron expirar la solicitud. Cuando el prestador acepta, puede proponer la fecha de la cita (RF-34).

**Actor(es):** Trabajador independiente, Organización de contratistas, Cliente.

**Origen:** I2:RF-18 (AC-2 a AC-5).

**Decisión asociada:** GAP adoptado mediante DEC-54 (h); DEC-16, DEC-59.

**Criterios de aceptación:**

#### RF-32-AC-1
**Dado** que un prestador recibió una solicitud,  
**cuando** la rechaza,  
**entonces** el cliente recibe en menos de 1 minuto el aviso y las opciones restantes.  
*Origen del criterio: I2:RF-18-AC-2.*

#### RF-32-AC-2
**Dado** un trabajador con horario de atención de 8:00 a 18:00 que recibió una solicitud a las 16:00,  
**cuando** llegan las 10:00 de su siguiente día de atención sin respuesta (4 h dentro de su horario),  
**entonces** la solicitud a ese prestador pasa a "expirada" y el cliente recibe el aviso y las opciones restantes.  
*Origen del criterio: I2:RF-18-AC-3.*

#### RF-32-AC-3
**Dado** que un prestador rechazó o dejó expirar la solicitud y no quedan opciones restantes,  
**cuando** el sistema procesa el rechazo o la expiración,  
**entonces** ejecuta una nueva búsqueda que excluye a los prestadores que ya rechazaron o dejaron expirar la solicitud.  
*Origen del criterio: I2:RF-18-AC-4.*

#### RF-32-AC-4
**Dado** que un prestador recibió una solicitud,  
**cuando** la acepta,  
**entonces** el prestador queda asociado al proyecto y puede proponer la fecha de la cita (RF-34).  
*Origen del criterio: I2:RF-18-AC-5, adaptado al modelo de estados de DEC-59 (sin el estado "asignado").*

### RF-33 — Costo de la visita

**Descripción:** Antes de que el cliente confirme una cita, el sistema debe mostrarle su costo, o la leyenda "sin costo", y la moneda.

**Actor(es):** Cliente, Trabajador independiente, Organización de contratistas.

**Origen:** I3:RF-07 (descripción).

**Decisión asociada:** GAP adoptado mediante DEC-54 (i).

**Criterios de aceptación:**

> **Nota:** este requisito tiene un solo criterio. Es puramente informativo, y su SRS de origen no define otro comportamiento verificable.

#### RF-33-AC-1
**Dado** una cita propuesta por el prestador,  
**cuando** el cliente la revisa para confirmarla,  
**entonces** el sistema muestra el costo de la cita, o "sin costo", y la moneda (MXN).  
*Origen del criterio: I3:RF-07 (descripción: "Antes de solicitarla debe mostrar el costo de visita, o sin costo, y su moneda").*

### RF-34 — Agendamiento con doble confirmación

**Descripción:** El prestador propone la fecha y la hora de una cita (visita de valoración o servicio) y la confirma. El cliente confirma después. La cita solo queda confirmada cuando confirman ambos. Una propuesta de cita sin respuesta en 24 h expira, sin comprometer otro horario. Cuando el proveedor es una organización, la organización propone y confirma. La primera cita confirmada hace que el proyecto pase a "programado" (RF-45). Una cita de ejecución solo puede confirmarse cuando ambas partes aceptaron la misma propuesta (RF-39).

**Actor(es):** Trabajador independiente, Organización de contratistas, Cliente.

**Origen:** I2:RF-06 (AC-1, AC-2, AC-3), I2:RF-18-AC-5; I1:RF-38 (doble confirmación), I1:RF-38-AC-3, I1:RF-42; I3:RF-07-AC-2, I3:LD-03; I4:RF-07-AC-1.

**Decisión asociada:** DEC-16, DEC-10, DEC-17, DEC-54 (f), DEC-81, DEC-84.

**Criterios de aceptación:**

#### RF-34-AC-1
**Dado** que el prestador propuso el 3 de octubre a las 10:00 para una cita y la confirmó,  
**cuando** el cliente todavía no ha confirmado,  
**entonces** la cita queda en estado "pendiente".  
*Origen del criterio: I2:RF-06-AC-1.*

#### RF-34-AC-2
**Dado** una cita propuesta y confirmada por el prestador,  
**cuando** el cliente también la confirma,  
**entonces** la cita queda "confirmada" y se guarda la programación asociada a la solicitud.  
*Origen del criterio: I2:RF-06-AC-2; I3:RF-07-AC-2; I4:RF-07-AC-1.*

#### RF-34-AC-3
**Dado** una propuesta de cita pendiente de respuesta,  
**cuando** pasan 24 horas sin que responda la parte que debe confirmar,  
**entonces** la propuesta expira, el sistema informa a ambas partes y no confirma ni compromete otro horario automáticamente.  
*Origen del criterio: I1:RF-38-AC-3, ajustado al orden prestador → cliente de DEC-16.*

#### RF-34-AC-4
**Dado** un proyecto en estado "confirmada",  
**cuando** se confirma su primera cita (de visita o de servicio),  
**entonces** el proyecto pasa al estado "programado".  
*Origen del criterio: Derivado de DEC-81.*

#### RF-34-AC-5
**Dado** que el proveedor seleccionado es una organización de contratistas,  
**cuando** se agenda una cita,  
**entonces** es la organización la que propone y confirma la fecha, sin asignar a un trabajador de una plantilla.  
*Origen del criterio: Derivado de DEC-10 y DEC-16.*

#### RF-34-AC-6
**Dado** un proyecto sin una propuesta aceptada por ambas partes,
**cuando** el prestador o el cliente intenta confirmar una cita de ejecución,
**entonces** el sistema rechaza la confirmación e indica que falta una propuesta aceptada.
*Origen del criterio: I2:RF-06-AC-3; I1:RF-42 (descripción), según DEC-84.*

### RF-35 — Bloqueo de franjas

**Descripción:** Al confirmarse una cita, el sistema bloquea la franja correspondiente en la agenda del prestador; al cancelarse, la libera. Si dos confirmaciones compiten por franjas traslapadas del mismo prestador, prevalece la registrada primero.

**Actor(es):** Trabajador independiente, Organización de contratistas, Cliente.

**Origen:** I2:RF-06 (AC-2, AC-5, AC-7).

**Decisión asociada:** GAP adoptado mediante DEC-54 (d, e).

**Criterios de aceptación:**

#### RF-35-AC-1
**Dado** que el prestador propuso el 3 de octubre a las 10:00 para una visita de 1 h,  
**cuando** la cita queda confirmada,  
**entonces** se bloquea la franja de 10:00 a 11:00 y el prestador deja de considerarse disponible en cualquier franja que se traslape con ella.  
*Origen del criterio: I2:RF-06-AC-2.*

#### RF-35-AC-2
**Dado** una cita "confirmada",  
**cuando** una de las partes la cancela,  
**entonces** la franja se libera.  
*Origen del criterio: I2:RF-06-AC-5.*

#### RF-35-AC-3
**Dado** que dos clientes tienen con el mismo prestador citas en franjas traslapadas, ya confirmadas por el prestador,  
**cuando** ambos clientes confirman con menos de 1 segundo de diferencia,  
**entonces** solo queda "confirmada" la registrada primero; la otra se rechaza y ese cliente recibe un aviso para elegir otra fecha.  
*Origen del criterio: I2:RF-06-AC-7.*

### RF-36 — Notificación y recordatorio de cita

**Descripción:** Cuando una cita queda confirmada, ambas partes reciben una notificación con fecha, hora y lugar. Además, reciben un recordatorio 24 horas antes de la cita.

**Actor(es):** Cliente, Trabajador independiente, Organización de contratistas.

**Origen:** I1:RF-39 (AC-1, AC-2); I2:RF-06-AC-6.

**Decisión asociada:** GAP adoptado mediante DEC-54 (a, b).

**Criterios de aceptación:**

#### RF-36-AC-1
**Dado** una cita recién confirmada,  
**cuando** el sistema procesa la confirmación,  
**entonces** ambas partes reciben la notificación con fecha, hora y lugar.  
*Origen del criterio: I1:RF-39-AC-1.*

#### RF-36-AC-2
**Dado** una cita confirmada con una organización de contratistas,  
**cuando** se genera la notificación,  
**entonces** la reciben tanto el cliente como la organización.  
*Origen del criterio: I1:RF-39-AC-2.*

#### RF-36-AC-3
**Dado** una cita "confirmada" para el 3 de octubre a las 10:00,  
**cuando** son las 10:00 del 2 de octubre,  
**entonces** ambas partes reciben un recordatorio, con una tolerancia de ±5 minutos.  
*Origen del criterio: I2:RF-06-AC-6.*

### RF-37 — Cancelación, cambios y reprogramación de citas

**Descripción:** Cualquiera de las partes puede cancelar una cita pendiente o confirmada, o avisar un cambio de fecha o un retraso, indicando un motivo. El sistema notifica a la otra parte y registra quién lo solicitó y cuándo. Cancelar una cita no cancela el proyecto. Tras una cancelación, el prestador puede proponer una nueva fecha con el flujo de RF-34. La cancelación tardía y la distinción de emergencias quedan fuera del MVP (FP-19).

**Actor(es):** Cliente, Trabajador independiente, Organización de contratistas.

**Origen:** I1:RF-17-AC-1, I1:RF-41 (AC-1, AC-2), I1:RF-40; I3:RF-07-AC-4; I4:RF-07-AC-2; I2:RF-06-AC-8.

**Decisión asociada:** Consenso; DEC-29, DEC-54 (c).

**Criterios de aceptación:**

#### RF-37-AC-1
**Dado** una cita pendiente o confirmada,  
**cuando** una de las partes la cancela indicando un motivo y confirmando la acción,  
**entonces** la cita pasa a "cancelada", se registra el motivo y la otra parte recibe la notificación.  
*Origen del criterio: I3:RF-07-AC-4; I1:RF-17-AC-1.*

#### RF-37-AC-2
**Dado** una o varias cancelaciones o cambios sobre la misma cita,  
**cuando** el sistema los registra,  
**entonces** cada uno queda registrado por separado con quién lo solicitó y cuándo, y la programación se actualiza conservando la modificación.  
*Origen del criterio: I1:RF-41-AC-1 e I1:RF-41-AC-2; I4:RF-07-AC-2.*

#### RF-37-AC-3
**Dado** una cita cancelada,  
**cuando** el prestador quiere reprogramarla,  
**entonces** puede proponer una nueva fecha con el flujo de RF-34, y el proyecto no se cancela.  
*Origen del criterio: I2:RF-06-AC-8; I1:RF-40.*

### 3.7 Propuestas

### RF-38 — Propuesta escrita con desglose

**Descripción:** El proveedor envía una propuesta escrita con:
- el trabajo a realizar y las fechas;
- los conceptos y subtotales de mano de obra, materiales y costos adicionales, presentados por separado;
- el total en MXN, la versión y la fecha de emisión.

Cada material indica descripción, cantidad, unidad, precio unitario y subtotal, y la marca o calidad cuando se proponga. La propuesta puede enviarse sin una visita previa. El precio lo define el proveedor (RD-12).

**Actor(es):** Trabajador independiente, Organización de contratistas, Cliente.

**Origen:** I1:RF-18 (AC-1, sin la precondición de visita); I3:RF-08 (AC-1, AC-4), I3:LD-04; I2:RF-08-AC-8.

**Decisión asociada:** DEC-17, DEC-55.

**Criterios de aceptación:**

#### RF-38-AC-1
**Dado** un proveedor asociado a una solicitud,  
**cuando** envía la propuesta,  
**entonces** el cliente recibe por escrito, dentro de la plataforma, el trabajo, las fechas y, por separado, los conceptos y subtotales de mano de obra, materiales y costos adicionales.  
*Origen del criterio: I1:RF-18-AC-1; I3:RF-08-AC-1.*

#### RF-38-AC-2
**Dado** una propuesta que contiene materiales,  
**cuando** el proveedor la envía,  
**entonces** el sistema rechaza el envío si algún material no tiene descripción, cantidad, unidad, precio unitario o subtotal, o si los subtotales no suman el total declarado.  
*Origen del criterio: I3:RF-08-AC-4.*

#### RF-38-AC-3
**Dado** un proyecto sin visita de valoración realizada,  
**cuando** el proveedor envía una propuesta válida,  
**entonces** el sistema la acepta y la entrega al cliente.  
*Origen del criterio: I2:RF-08-AC-8, según DEC-17 (sustituye a I1:RF-18-AC-2).*

### RF-39 — Aceptación, negociación y expiración de la propuesta

**Descripción:** El cliente puede responder a la propuesta de tres formas:
- **Aceptarla.**
- **Pedir cambios.** El proveedor envía una versión revisada y la aceptación final exige que ambas partes acepten esa misma versión.
- **Rechazarla sin pedir cambios.** Esto cierra el acuerdo con ese proveedor.

Si pasan 72 horas desde la primera propuesta sin una versión aceptada, el acuerdo se cierra sin efecto; las versiones revisadas no reinician el plazo. Cuando un acuerdo se cierra, el cliente puede volver a las recomendaciones (RF-30). El trabajo no puede iniciar sin una propuesta aceptada.

**Actor(es):** Cliente, Trabajador independiente, Organización de contratistas.

**Origen:** I1:RF-42 (AC-1 a AC-3) y su flujo de estados E.2; I2:RF-08-AC-5.

**Decisión asociada:** DEC-18, DEC-19, DEC-55.

**Criterios de aceptación:**

#### RF-39-AC-1
**Dado** una propuesta enviada,  
**cuando** el cliente la acepta sin pedir cambios,  
**entonces** el acuerdo queda aceptado por ambas partes, se registran la fecha, la hora y el autor de la aceptación, y la propuesta se convierte en el presupuesto inicial (RF-43).  
*Origen del criterio: I1:RF-42-AC-1; I2:RF-08-AC-5.*

#### RF-39-AC-2
**Dado** una propuesta enviada,  
**cuando** el cliente pide un ajuste en lugar de aceptarla,  
**entonces** el proveedor debe enviar una versión revisada, y la aceptación final requiere que ambas partes acepten esa misma versión.  
*Origen del criterio: I1:RF-42-AC-2.*

#### RF-39-AC-3
**Dado** una propuesta enviada,  
**cuando** el cliente la rechaza sin pedir cambios,  
**entonces** el acuerdo con ese proveedor para ese proyecto se cierra sin efecto, y el cliente puede volver a las recomendaciones.  
*Origen del criterio: I1:RF-42-AC-3.*

#### RF-39-AC-4
**Dado** una primera propuesta enviada, con o sin versiones revisadas posteriores,  
**cuando** pasan 72 horas desde su envío sin una versión aceptada,  
**entonces** el acuerdo se cierra sin efecto y el cliente puede volver a las recomendaciones.  
*Origen del criterio: I1:RF-42-AC-3 (expiración), con el cómputo desde la primera propuesta de DEC-55.*

#### RF-39-AC-5
**Dado** un proyecto sin propuesta aceptada,  
**cuando** el proveedor intenta marcarlo "en proceso",  
**entonces** el sistema no lo permite.  
*Origen del criterio: I1:RF-42 (descripción: "antes de iniciar el trabajo").*

### 3.8 Cambios de costo

### RF-40 — Registro de solicitud de cambio

**Descripción:** Una vez aceptada la propuesta, el proveedor debe registrar cualquier cambio de costo, material, alcance o fecha antes de ejecutarlo. La solicitud incluye:
- tipo de cambio y motivo;
- monto adicional o ahorro en MXN y presupuesto actualizado;
- materiales o alcance afectados y fecha propuesta.

Si falta algún campo, el envío se rechaza. Al registrarse, el cliente recibe de inmediato una alerta, y el cambio no se aplica hasta su decisión (RF-41, RD-10).

**Actor(es):** Trabajador independiente, Organización de contratistas, Cliente.

**Origen:** I1:RF-19-AC-1, I1:RF-24 (AC-1, AC-2); I3:RF-08 (AC-2, AC-6), I3:RF-10 (AC-2, AC-3); I2:RF-09 (parcial).

**Decisión asociada:** DEC-21, DEC-56.

**Criterios de aceptación:**

#### RF-40-AC-1
**Dado** un acuerdo previamente aceptado,  
**cuando** el proveedor identifica un cambio de costo, material, alcance o fecha,  
**entonces** debe registrarlo antes de ejecutarlo, y el cambio no se aplica hasta que el cliente decida.  
*Origen del criterio: I1:RF-19-AC-1, ampliado a los cuatro tipos de cambio por DEC-21.*

#### RF-40-AC-2
**Dado** una solicitud de cambio a la que le falta algún campo obligatorio,  
**cuando** el proveedor intenta enviarla,  
**entonces** el sistema rechaza el envío e identifica cada campo faltante.  
*Origen del criterio: I3:RF-08-AC-6.*

#### RF-40-AC-3
**Dado** que el proveedor registra una solicitud de cambio con todos los campos,  
**cuando** el sistema la procesa,  
**entonces** el cliente recibe de inmediato una alerta con el tipo, el motivo, el monto adicional o ahorro, el presupuesto actualizado, los elementos afectados y la fecha propuesta.  
*Origen del criterio: I3:RF-10-AC-2; I1:RF-24-AC-1 e I1:RF-24-AC-2.*

#### RF-40-AC-4
**Dado** que el cliente tiene alertas de cambio sin atender,  
**cuando** accede al proyecto,  
**entonces** el sistema muestra cuántas son y le permite abrir cada solicitud sin aplicar el cambio automáticamente.  
*Origen del criterio: I3:RF-10-AC-3.*

### RF-41 — Decisión del cliente sobre un cambio

**Descripción:** El cliente tiene 24 horas para aceptar, rechazar o contraproponer un cambio. Mientras no decide, la parte del trabajo afectada queda en pausa.

| Situación | Resultado |
|---|---|
| El cliente acepta | El presupuesto se actualiza |
| El cliente rechaza | El cambio no se aplica |
| Vencen las 24 h sin respuesta | El cambio pasa a "no aceptado" y no se aplica |
| El cliente contrapropone | El cambio vuelve a "pendiente de decisión" con los nuevos términos y se abre un nuevo plazo de 24 h; el proveedor acepta la contrapropuesta (se aplica con esos términos) o la rechaza (no se aplica) |
| El proveedor no responde la contrapropuesta en 24 h | La contrapropuesta queda rechazada automáticamente, el acuerdo vigente no cambia y el cliente puede iniciar una solicitud de cambio (RF-55) |

Si no hay acuerdo, la parte afectada no se reanuda automáticamente y queda pendiente de un nuevo acuerdo entre las partes. El administrador no media (RD-11).

**Actor(es):** Cliente, Trabajador independiente, Organización de contratistas.

**Origen:** I1:RF-19 (AC-1 a AC-3) y su flujo de estados E.3; I2:RF-09 (AC-4, AC-6, AC-7); I3:RF-08 (AC-2, AC-3).

**Decisión asociada:** DEC-20 (con su resolución posterior), DEC-22, DEC-34, DEC-57, DEC-85.

**Criterios de aceptación:**

#### RF-41-AC-1
**Dado** una solicitud de cambio pendiente que lleva el presupuesto de $10,000.00 a $13,000.00,  
**cuando** el cliente la aprueba explícitamente,  
**entonces** el presupuesto vigente cambia a $13,000.00, la decisión queda en la bitácora y se crea una nueva versión del presupuesto (RF-43).  
*Origen del criterio: I2:RF-09-AC-4; I3:RF-08-AC-2.*

#### RF-41-AC-2
**Dado** un cambio pendiente que no es necesario para continuar el resto del trabajo,  
**cuando** el cliente lo rechaza,  
**entonces** el cambio pasa a "rechazado", no se aplica y el resto del trabajo continúa sin él.  
*Origen del criterio: I1:RF-19-AC-2; I2:RF-09-AC-6.*

#### RF-41-AC-3
**Dado** un cambio pendiente que el proveedor considera necesario para continuar esa parte del trabajo,  
**cuando** el cliente lo rechaza,  
**entonces** el cambio no se aplica y la parte afectada no se reanuda automáticamente: queda pendiente de un nuevo acuerdo entre las partes, sin escalar al administrador.  
*Origen del criterio: I1:RF-19-AC-3, ajustado por la resolución posterior de DEC-20 (sin escalamiento).*

#### RF-41-AC-4
**Dado** un cambio registrado y pendiente de decisión,  
**cuando** el cliente todavía no responde,  
**entonces** la parte del trabajo afectada permanece en pausa y el cambio no se incorpora al presupuesto.  
*Origen del criterio: I1 E.3 (pausa de la parte afectada); I3:RF-08-AC-3.*

#### RF-41-AC-5
**Dado** un cambio pendiente sin respuesta del cliente,  
**cuando** pasan 24 horas desde su registro,  
**entonces** el cambio pasa a "no aceptado" y el presupuesto vigente no cambia.  
*Origen del criterio: I2:RF-09-AC-7, con el plazo de 24 h de DEC-20 y DEC-57.*

#### RF-41-AC-6
**Dado** un cambio pendiente,  
**cuando** el cliente envía una contrapropuesta,  
**entonces** el cambio vuelve a "pendiente de decisión" con los nuevos términos y se abre un nuevo plazo de 24 horas.  
*Origen del criterio: I1 E.3 (contrapropuesta), según DEC-22 y DEC-57.*

#### RF-41-AC-7
**Dado** una contrapropuesta del cliente pendiente de respuesta del proveedor,  
**cuando** el proveedor la acepta o la rechaza,  
**entonces** si la acepta, el cambio se aplica con los términos de la contrapropuesta; si la rechaza, el cambio no se aplica.  
*Origen del criterio: Derivado de DEC-57.*

#### RF-41-AC-8
**Dado** una contrapropuesta del cliente pendiente de respuesta del proveedor,
**cuando** pasan 24 horas sin que el proveedor responda,
**entonces** la contrapropuesta queda rechazada automáticamente, el acuerdo vigente no cambia y el cliente puede iniciar una solicitud de cambio (RF-55).
*Origen del criterio: Derivado de DEC-85.*

### RF-42 — Análisis con IA de la justificación

**Descripción:** El cliente puede pedir que la IA analice la justificación y la evidencia de un cambio frente a la solicitud, la propuesta y el proyecto registrado. El análisis es informativo: la IA no aprueba ni rechaza el cambio (RD-09) y la decisión sigue siendo del cliente.

**Actor(es):** Cliente; Agente de IA (componente interno).

**Origen:** I3:RF-18 (AC-1, AC-2).

**Decisión asociada:** GAP adoptado mediante DEC-05; DEC-21.

**Criterios de aceptación:**

#### RF-42-AC-1
**Dado** que el proveedor registró un cambio con motivo, importe, elementos afectados y evidencia opcional,  
**cuando** el cliente solicita el análisis,  
**entonces** la IA muestra un resumen de consistencias, datos faltantes y riesgos frente al proyecto registrado.  
*Origen del criterio: I3:RF-18-AC-1.*

#### RF-42-AC-2
**Dado** que la IA emitió un análisis de una justificación,  
**cuando** el cliente consulta el cambio,  
**entonces** el sistema indica que el análisis no aprueba ni rechaza el cambio y mantiene ambas acciones disponibles únicamente para el cliente.  
*Origen del criterio: I3:RF-18-AC-2.*

### RF-43 — Historial de versiones del presupuesto

**Descripción:** El presupuesto inicial aprobado no se modifica. Cada cambio aprobado genera una nueva versión con fecha, total anterior, total actualizado y diferencia en MXN respecto al presupuesto inicial. El historial cronológico de versiones se puede consultar.

**Actor(es):** Cliente, Trabajador independiente, Organización de contratistas.

**Origen:** I3:RF-08-AC-7, I3:LD-04; I2:RF-09-AC-4.

**Decisión asociada:** GAP adoptado mediante DEC-73.

**Criterios de aceptación:**

#### RF-43-AC-1
**Dado** un presupuesto inicial aprobado,  
**cuando** el cliente aprueba un cambio,  
**entonces** el sistema guarda una nueva versión con fecha, total anterior, total actualizado y diferencia en MXN respecto al inicial, y permite consultar el historial cronológico de versiones.  
*Origen del criterio: I3:RF-08-AC-7.*

#### RF-43-AC-2
**Dado** un presupuesto vigente de $10,000.00 y un cambio aprobado a $13,000.00,  
**cuando** se consulta el historial,  
**entonces** se conserva el registro de $10,000.00 junto al nuevo presupuesto vigente.  
*Origen del criterio: I2:RF-09-AC-4.*

### RF-44 — Consulta de costos

**Descripción:** El cliente debe poder consultar en una sola vista el presupuesto acordado vigente, los cambios aprobados y los cambios pendientes de aprobar. Lo gastado no se registra en la plataforma (FP-22).

**Actor(es):** Cliente.

**Origen:** I1:RF-23 (AC-1 ajustado, AC-2); I3:RF-10 (parte de presupuesto).

**Decisión asociada:** GAP adoptado mediante DEC-70; DEC-58.

**Criterios de aceptación:**

#### RF-44-AC-1
**Dado** un trabajo con propuesta aceptada,  
**cuando** el cliente consulta los costos en cualquier momento,  
**entonces** ve en una sola vista el presupuesto acordado vigente, los cambios aprobados y los cambios pendientes de aprobar.  
*Origen del criterio: I1:RF-23-AC-1, sin "lo gastado o avanzado" (DEC-58, DEC-70).*

#### RF-44-AC-2
**Dado** un trabajo recién iniciado sin cambios registrados,  
**cuando** el cliente consulta los costos,  
**entonces** ve el presupuesto acordado sin ningún cambio pendiente de aprobar.  
*Origen del criterio: I1:RF-23-AC-2.*

### RF-55 — Solicitud de cambio iniciada por el cliente

**Descripción:** El cliente puede iniciar una solicitud de cambio de costo, material, alcance o fecha sobre un acuerdo aceptado, con los mismos campos que usa el proveedor (RF-40): tipo de cambio, motivo, monto adicional o ahorro en MXN, presupuesto actualizado, materiales o alcance afectados y fecha propuesta. El proveedor tiene 24 horas para aceptarla o rechazarla. Si no responde, la solicitud expira sin aplicarse. Un cambio aceptado actualiza el presupuesto y genera una nueva versión (RF-43).

**Actor(es):** Cliente, Trabajador independiente, Organización de contratistas.

**Origen:** Sin origen directo en los SRS individuales. Es el espejo de I3:RF-08-AC-2, I3:RF-08-AC-6 e I2:RF-09-AC-7 (expiración), aplicado al cliente.

**Decisión asociada:** DEC-85 (reabre parcialmente DEC-21); DEC-56, DEC-57.

**Criterios de aceptación:**

#### RF-55-AC-1
**Dado** un acuerdo aceptado,
**cuando** el cliente registra una solicitud de cambio con todos los campos,
**entonces** el proveedor recibe una alerta con la solicitud y el cambio no se aplica hasta su decisión.
*Origen del criterio: Derivado de DEC-85 (espejo de RF-40).*

#### RF-55-AC-2
**Dado** una solicitud de cambio del cliente a la que le falta algún campo obligatorio,
**cuando** el cliente intenta enviarla,
**entonces** el sistema rechaza el envío e identifica cada campo faltante.
*Origen del criterio: Derivado de DEC-85 (espejo de I3:RF-08-AC-6).*

#### RF-55-AC-3
**Dado** una solicitud de cambio del cliente pendiente,
**cuando** el proveedor la acepta,
**entonces** el presupuesto vigente se actualiza, la decisión queda en la bitácora y se crea una nueva versión del presupuesto.
*Origen del criterio: Derivado de DEC-85 (espejo de I3:RF-08-AC-2).*

#### RF-55-AC-4
**Dado** una solicitud de cambio del cliente pendiente,
**cuando** el proveedor la rechaza,
**entonces** el cambio no se aplica y el presupuesto vigente no cambia.
*Origen del criterio: Derivado de DEC-85.*

#### RF-55-AC-5
**Dado** una solicitud de cambio del cliente sin respuesta del proveedor,
**cuando** pasan 24 horas desde su registro,
**entonces** la solicitud expira sin aplicarse y el presupuesto vigente no cambia.
*Origen del criterio: Derivado de DEC-85 (espejo de I2:RF-09-AC-7 y de DEC-57).*

### 3.9 Seguimiento, comunicación y cierre

### RF-45 — Seguimiento por estados del proyecto

**Descripción:** El proyecto avanza por los estados borrador → confirmada → programado → en proceso → terminado → concluido, y el cliente puede verlos en todo momento. Las transiciones son:

| Transición | Disparador |
|---|---|
| borrador → confirmada | El cliente confirma el resumen (RF-20) |
| confirmada → programado | Se confirma la primera cita (RF-34) |
| programado → en proceso | El proveedor actualiza el estado, siempre que la propuesta esté aceptada (RF-39) |
| en proceso → terminado → concluido | Según RF-47 |

La cita, la propuesta y el cambio tienen estados propios. No hay reportes periódicos de avance (FP-15).

Si hay una visita de valoración, su confirmación pasa el proyecto a "programado" antes de que exista una propuesta aceptada. Es una consecuencia aceptada por el equipo; el acuerdo se controla con RF-39 y RF-34.

**Actor(es):** Cliente, Trabajador independiente, Organización de contratistas.

**Origen:** I4:RF-08 (AC-1); I3:RF-01-AC-1, I3:RF-03-AC-3; I1:RF-60.

**Decisión asociada:** DEC-25, DEC-59, DEC-81, DEC-83, DEC-88.

**Criterios de aceptación:**

#### RF-45-AC-1
**Dado** un proyecto asociado a un proveedor,  
**cuando** cambia a un estado válido,  
**entonces** el sistema actualiza el estado del proyecto y lo muestra al cliente.  
*Origen del criterio: I4:RF-08-AC-1.*

#### RF-45-AC-2
**Dado** un proyecto en estado "programado" con propuesta aceptada,  
**cuando** el proveedor actualiza el estado para indicar que inició el trabajo,  
**entonces** el proyecto pasa a "en proceso" y el cliente lo ve reflejado.  
*Origen del criterio: I4:RF-08 (descripción: estados programado, en proceso y terminado), según DEC-59 y DEC-83.*

### RF-46 — Canal interno de mensajes del proyecto

**Descripción:** Cuando existe una cita confirmada, el cliente y el proveedor pueden comunicarse por un canal interno del proyecto. El canal conserva la fecha, el emisor y el contenido de cada mensaje, y no expone los teléfonos de ninguna de las partes (RD-15).

**Actor(es):** Cliente, Trabajador independiente, Organización de contratistas.

**Origen:** I3:RF-14 (AC-2, descripción).

**Decisión asociada:** GAP adoptado mediante DEC-36.

**Criterios de aceptación:**

#### RF-46-AC-1
**Dado** una cita confirmada,  
**cuando** el cliente o el proveedor envía un mensaje en el proyecto,  
**entonces** el sistema entrega el mensaje a la contraparte y conserva la fecha, el emisor y el contenido.  
*Origen del criterio: I3:RF-14-AC-2.*

#### RF-46-AC-2
**Dado** un intercambio de mensajes en el canal interno,  
**cuando** cualquiera de las partes consulta la conversación o el perfil de la contraparte,  
**entonces** el sistema no muestra el teléfono de la contraparte.  
*Origen del criterio: Derivado de DEC-36 (I3:RF-14, descripción: "no revelar datos de contacto").*

#### RF-46-AC-3
**Dado** un proyecto sin cita confirmada,  
**cuando** el cliente o el proveedor intenta enviar un mensaje por el canal interno,  
**entonces** el canal todavía no está habilitado.  
*Origen del criterio: Derivado de DEC-36 (I3:RF-14-AC-2 condiciona el canal a una cita confirmada).*

### RF-47 — Cierre del trabajo

**Descripción:** El proveedor marca como terminado un proyecto que está en proceso. El cliente responde de una de dos formas:
- **Confirma el cierre:** el proyecto pasa a "concluido" y se habilita la evaluación (RF-49, RF-50 y RF-51).
- **Rechaza el cierre o reporta pendientes:** el proyecto vuelve a "en proceso".

Ningún pendiente (por ejemplo, un cambio todavía sin acuerdo) se da por resuelto ni bloquea el cierre automáticamente.

**Actor(es):** Trabajador independiente, Organización de contratistas, Cliente.

**Origen:** I1:RF-59 (AC-1, AC-2), I1:RF-60 (AC-1, AC-2); I2:RF-16 (AC-1 a AC-3); I3:RF-11-AC-4 (ajustado); I4:RF-08-AC-2.

**Decisión asociada:** Consenso; DEC-28, DEC-59.

**Criterios de aceptación:**

#### RF-47-AC-1
**Dado** un proyecto en un estado distinto de "en proceso",  
**cuando** el proveedor intenta marcarlo como terminado,  
**entonces** el sistema rechaza la operación.  
*Origen del criterio: I2:RF-16-AC-1.*

#### RF-47-AC-2
**Dado** un proyecto "en proceso" con propuesta aceptada,  
**cuando** el proveedor lo marca como terminado,  
**entonces** el proyecto pasa a "terminado" y la solicitud de cierre queda registrada y visible para el cliente.  
*Origen del criterio: I1:RF-59-AC-1; I4:RF-08-AC-2.*

#### RF-47-AC-3
**Dado** un proyecto "terminado",  
**cuando** el cliente confirma el cierre,  
**entonces** el proyecto pasa a "concluido", se habilita la evaluación y cualquier pendiente sigue su propio flujo sin darse por resuelto.  
*Origen del criterio: I1:RF-60-AC-1; I2:RF-16-AC-2; I4:RF-08-AC-2; I3:RF-11-AC-4 (sin la condición de etapas, DEC-28).*

#### RF-47-AC-4
**Dado** un proyecto "terminado",  
**cuando** el cliente rechaza el cierre o reporta pendientes con su descripción,  
**entonces** el proyecto vuelve a "en proceso" y el proveedor recibe la descripción en menos de 1 minuto.  
*Origen del criterio: I1:RF-60-AC-2; I2:RF-16-AC-3.*

### RF-48 — Aviso por cierre sin respuesta

**Descripción:** Si el cliente no responde a una solicitud de cierre en 72 horas, el sistema avisa al administrador. El aviso es solo informativo: el proyecto permanece en "terminado" y el administrador no decide el cierre (RD-11).

**Actor(es):** Administrador (destinatario), Cliente.

**Origen:** I2:RF-16-AC-4 (adaptado).

**Decisión asociada:** GAP adoptado mediante DEC-62; DEC-34, DEC-35.

**Criterios de aceptación:**

#### RF-48-AC-1
**Dado** un proyecto "terminado" sin respuesta del cliente,  
**cuando** pasan 72 horas desde que se marcó como terminado,  
**entonces** el administrador recibe un aviso y el proyecto permanece en "terminado".  
*Origen del criterio: I2:RF-16-AC-4 (la alerta a la bandeja de soporte se dirige al administrador, DEC-35, DEC-62).*

#### RF-48-AC-2
**Dado** que el administrador recibió el aviso de cierre sin respuesta,  
**cuando** consulta el proyecto,  
**entonces** no puede cambiar su estado; solo el cliente puede confirmar o rechazar el cierre.  
*Origen del criterio: Derivado de DEC-62 y DEC-34.*

### 3.10 Evaluaciones

### RF-49 — Evaluación del proveedor por el cliente

**Descripción:** Cuando un proyecto queda concluido, el cliente que lo contrató puede evaluar al proveedor en cuatro dimensiones: puntualidad, calidad, limpieza y apego al presupuesto. Cada dimensión se califica con un entero de 1 a 5, y la calificación del trabajo es el promedio de las cuatro. El comentario es opcional y se permite una sola evaluación por cliente, proveedor y proyecto.

**Actor(es):** Cliente.

**Origen:** I2:RF-11 (parte a; AC-2 a AC-4); I1:RF-25 (AC-1, AC-2); I3:RF-11 (AC-2, AC-3); I4:RF-09 (AC-1, AC-2).

**Decisión asociada:** Consenso; DEC-31, DEC-32.

**Criterios de aceptación:**

#### RF-49-AC-1
**Dado** un proyecto concluido contratado por la plataforma,  
**cuando** el cliente que lo contrató registra una evaluación válida en las cuatro dimensiones,  
**entonces** el sistema la acepta y la asocia al proyecto y al proveedor correspondiente.  
*Origen del criterio: I1:RF-25-AC-1; I4:RF-09-AC-1.*

#### RF-49-AC-2
**Dado** un proyecto que todavía no está concluido, o un usuario que no contrató ese trabajo,  
**cuando** intenta registrar una evaluación,  
**entonces** el sistema la rechaza e indica que el servicio debe concluir primero o que el usuario no puede evaluarlo.  
*Origen del criterio: I1:RF-25-AC-2; I4:RF-09-AC-2.*

#### RF-49-AC-3
**Dado** una solicitud de calificación abierta,  
**cuando** el cliente envía un valor de 0, de 6 o de 4.5 en alguna dimensión, o intenta una segunda evaluación del mismo proyecto,  
**entonces** el sistema no registra la evaluación e indica la causa.  
*Origen del criterio: I2:RF-11-AC-3; I3:RF-11-AC-3.*

#### RF-49-AC-4
**Dado** que el cliente envía su calificación sin comentario,  
**cuando** el sistema la registra,  
**entonces** la calificación se acepta.  
*Origen del criterio: I2:RF-11-AC-4.*

#### RF-49-AC-5
**Dado** un proveedor con dos calificaciones previas cuyos promedios son 4.0 y 5.0,  
**cuando** se publica una nueva calificación del cliente de 5, 4, 5 y 4,  
**entonces** el promedio de ese trabajo es 4.5 y la calificación promedio del proveedor es 4.5.  
*Origen del criterio: I2:RF-11-AC-2.*

### RF-50 — Evaluación del cliente por el proveedor

**Descripción:** Cuando un proyecto queda concluido, el prestador de ese proyecto puede evaluar al cliente con un entero de 1 a 5. El comentario es opcional.

**Actor(es):** Trabajador independiente, Organización de contratistas.

**Origen:** I2:RF-11 (parte b; AC-3, AC-4).

**Decisión asociada:** DEC-30, DEC-32.

**Criterios de aceptación:**

#### RF-50-AC-1
**Dado** un proyecto concluido,  
**cuando** el prestador de ese proyecto califica al cliente con un entero de 1 a 5,  
**entonces** el sistema acepta la calificación y la asocia al proyecto y al cliente.  
*Origen del criterio: I2:RF-11 (parte b), según DEC-30.*

#### RF-50-AC-2
**Dado** un proyecto no concluido, o un prestador que no participó en el proyecto,  
**cuando** intenta calificar al cliente,  
**entonces** el sistema rechaza la calificación.  
*Origen del criterio: Derivado de DEC-30 (misma condición que RD-13).*

#### RF-50-AC-3
**Dado** una solicitud de calificación abierta para el prestador,  
**cuando** envía un valor de 0, de 6 o de 4.5,  
**entonces** el sistema rechaza el valor e indica que debe ser un entero de 1 a 5.  
*Origen del criterio: I2:RF-11-AC-3.*

#### RF-50-AC-4
**Dado** que el prestador envía su calificación sin comentario,  
**cuando** el sistema la registra,  
**entonces** la calificación se acepta.  
*Origen del criterio: I2:RF-11-AC-4.*

### RF-51 — Publicación de las evaluaciones

**Descripción:** Cuando un proyecto pasa a "concluido", ambas partes reciben su solicitud de calificación. Las reglas de publicación son:
- Las solicitudes vencen a los 7 días.
- Cada calificación se publica cuando ambas partes calificaron o cuando vence el plazo, lo que ocurra primero.
- Solo las calificaciones publicadas cuentan para el promedio (RF-07).

**Actor(es):** Cliente, Trabajador independiente, Organización de contratistas.

**Origen:** I2:RF-11 (AC-1, AC-5 a AC-7).

**Decisión asociada:** GAP adoptado mediante DEC-63; DEC-30.

**Criterios de aceptación:**

#### RF-51-AC-1
**Dado** un proyecto "terminado",  
**cuando** pasa a "concluido",  
**entonces** el cliente y el prestador reciben su solicitud de calificación en menos de 5 minutos.  
*Origen del criterio: I2:RF-11-AC-1.*

#### RF-51-AC-2
**Dado** que solo el cliente ha calificado y han pasado menos de 7 días,  
**cuando** se consulta el perfil del proveedor,  
**entonces** la nueva calificación no es visible y no afecta la calificación promedio.  
*Origen del criterio: I2:RF-11-AC-5.*

#### RF-51-AC-3
**Dado** que ambas partes calificaron,  
**cuando** se registra la segunda calificación,  
**entonces** ambas calificaciones se publican y la calificación promedio se recalcula.  
*Origen del criterio: I2:RF-11-AC-6.*

#### RF-51-AC-4
**Dado** que solo una parte calificó,  
**cuando** se cumplen 7 días desde la conclusión,  
**entonces** la calificación existente se publica y la solicitud de la otra parte pasa a "vencida".  
*Origen del criterio: I2:RF-11-AC-7.*

### 3.11 Privacidad y datos

### RF-52 — Revelación del domicilio del cliente

**Descripción:** El domicilio exacto del cliente no se pide para buscar. El cliente lo proporciona en el primer momento en que debe revelarse:
- al confirmar la cita de visita, si hay visita de valoración;
- en caso contrario, al aceptar la propuesta.

En ese momento el domicilio y las fotos o videos del lugar se revelan automáticamente, y solo al trabajador de ese proyecto. La acción del cliente cuenta como su autorización (RF-24). Antes de ese momento el trabajador solo ve la colonia y el municipio (RD-15). El trabajador deja de ver el domicilio 7 días después de que el proyecto queda "concluido".

**Actor(es):** Cliente, Trabajador independiente, Organización de contratistas.

**Origen:** I2:RNF-04 (revelación automática y ventana de 7 días); I3:RF-07-AC-3; I1:RF-54 (AC-1, AC-2); I2:RF-18-AC-1.

**Decisión asociada:** DEC-65, DEC-78, DEC-79 (modifican la regla original de DEC-41 y DEC-50); DEC-12, DEC-72.

**Criterios de aceptación:**

#### RF-52-AC-1
**Dado** un trabajador asociado a un proyecto sin cita de visita confirmada ni propuesta aceptada,  
**cuando** intenta ver el domicilio exacto o las fotos del domicilio del cliente,  
**entonces** el sistema solo le muestra la colonia y el municipio.  
*Origen del criterio: I1:RF-54-AC-1; I2:RNF-04 (primera parte), según DEC-65.*

#### RF-52-AC-2
**Dado** un proyecto sin visita de valoración,  
**cuando** el cliente acepta la propuesta del trabajador,  
**entonces** el sistema le pide su domicilio exacto y lo revela automáticamente, con las fotos o videos del domicilio, solo a ese trabajador.  
*Origen del criterio: Derivado de DEC-65 y DEC-79; I1:RF-54-AC-2 ("solo a él").*

#### RF-52-AC-3
**Dado** un proyecto con visita de valoración,  
**cuando** el cliente confirma la cita de visita,  
**entonces** el sistema le pide su domicilio exacto y lo revela automáticamente solo al trabajador de esa cita.  
*Origen del criterio: Derivado de DEC-78 y DEC-79.*

#### RF-52-AC-4
**Dado** un proyecto "concluido" cuyo domicilio fue revelado a su trabajador,  
**cuando** pasan 7 días desde la conclusión,  
**entonces** el trabajador deja de ver el domicilio exacto y las fotos del domicilio.  
*Origen del criterio: I2:RNF-04 (ventana de 7 días), según DEC-65.*

#### RF-52-AC-5
**Dado** un domicilio revelado al trabajador de un proyecto,  
**cuando** otro trabajador intenta consultarlo,  
**entonces** el sistema le niega el acceso.  
*Origen del criterio: I1:RF-54-AC-2; I3:RF-07-AC-3 ("únicamente con el proveedor asociado").*

### RF-53 — Visibilidad del domicilio del trabajador

**Descripción:** El domicilio de un trabajador con identidad verificada (RF-09) se muestra solo a los clientes que tienen una cita confirmada con él. El teléfono del trabajador no se revela (RD-15).

**Actor(es):** Cliente, Trabajador independiente.

**Origen:** I1:RF-58 (AC-1, AC-2, adaptados).

**Decisión asociada:** DEC-41 (identidad verificada), DEC-65 (clientes con cita confirmada).

**Criterios de aceptación:**

#### RF-53-AC-1
**Dado** un trabajador con identidad verificada y un cliente con una cita confirmada con él,  
**cuando** el cliente consulta el perfil del trabajador,  
**entonces** el sistema le muestra el domicilio del trabajador.  
*Origen del criterio: Derivado de DEC-41 y DEC-65 (adapta I1:RF-58-AC-2).*

#### RF-53-AC-2
**Dado** un trabajador sin identidad verificada,  
**cuando** un cliente con cita confirmada consulta su perfil,  
**entonces** el sistema no muestra el domicilio del trabajador.  
*Origen del criterio: Derivado de DEC-41 (adapta I1:RF-58-AC-1).*

#### RF-53-AC-3
**Dado** un trabajador con identidad verificada,  
**cuando** un cliente sin cita confirmada con él consulta su perfil,  
**entonces** el sistema no muestra el domicilio del trabajador.  
*Origen del criterio: Derivado de DEC-65.*

### RF-54 — Atención de solicitudes ARCO

**Descripción:** El administrador debe poder, desde la plataforma:
- exportar en JSON y PDF los datos personales de un usuario;
- rectificar sus datos, conservando el valor anterior;
- anonimizar sus datos personales cuando no tenga proyectos activos, sin alterar montos, fechas, estados ni el número de registros de la bitácora (RD-17);
- registrar cada solicitud con folio y fecha de respuesta.

El sistema genera un aviso para el administrador cuando faltan 5 días hábiles para vencer el plazo configurado. El plazo legal definitivo sigue abierto (PV-08).

**Actor(es):** Administrador, Cliente, Trabajador independiente, Organización de contratistas.

**Origen:** I2:RF-21 (AC-1 a AC-5); I1:RF-55 (AC-1, AC-2); I3:RF-15-AC-2.

**Decisión asociada:** DEC-37, DEC-35, DEC-77.

**Criterios de aceptación:**

#### RF-54-AC-1
**Dado** que un usuario con dos proyectos concluidos presentó una solicitud de acceso,  
**cuando** el administrador genera la exportación,  
**entonces** se descargan un archivo JSON y uno PDF con todos los datos personales de ese usuario y ningún dato personal de otro usuario.  
*Origen del criterio: I2:RF-21-AC-1.*

#### RF-54-AC-2
**Dado** que un usuario solicitó rectificar su nombre,  
**cuando** el administrador captura el nombre corregido,  
**entonces** el nombre se actualiza y quedan registrados el valor anterior, el nuevo, el autor y la fecha.  
*Origen del criterio: I2:RF-21-AC-2.*

#### RF-54-AC-3
**Dado** que un usuario sin proyectos activos solicitó la cancelación de sus datos,  
**cuando** el administrador ejecuta la anonimización,  
**entonces** el nombre, el teléfono, el domicilio, las fotos y las imágenes de identificación se eliminan o se reemplazan por un identificador seudónimo, y la bitácora conserva su número de registros, montos, fechas y estados.  
*Origen del criterio: I2:RF-21-AC-3 (sin transcripciones de voz, FP-01); I1:RF-55-AC-1 e I1:RF-55-AC-2; I3:RF-15-AC-2.*

#### RF-54-AC-4
**Dado** que un usuario tiene un proyecto que no está concluido,  
**cuando** el administrador intenta ejecutar la anonimización,  
**entonces** el sistema la bloquea e indica cuál es el proyecto activo.  
*Origen del criterio: I2:RF-21-AC-4 (el estado "en ejecución" se adapta a "proyecto no concluido", DEC-59).*

#### RF-54-AC-5
**Dado** una solicitud ARCO registrada con folio y un plazo de respuesta configurado de 20 días hábiles (valor inicial configurable),  
**cuando** faltan 5 días hábiles para el vencimiento sin respuesta registrada,  
**entonces** el administrador recibe un aviso de la solicitud.  
*Origen del criterio: I2:RF-21-AC-5 (la alerta a la bandeja de soporte se dirige al administrador, DEC-35).*

---

### 4. Requerimientos no funcionales

### RNF-01 — Usabilidad

**Descripción:** La interfaz debe ser sencilla, usar español cotidiano y requerir pocos pasos. Debe ser comprensible para usuarios sin conocimientos técnicos y mostrar los mensajes de validación junto al campo correspondiente. La métrica cuantitativa de usabilidad está pendiente (PV-13).

**Origen:** I1:RNF-01; I4:RNF-01; I3:RNF-08 (mensajes de validación por campo).

**Decisión:** Consenso; DEC-87.

**Criterio de aceptación:**

#### RNF-01-AC-1
**Dado** un usuario sin experiencia técnica,  
**cuando** usa la aplicación por primera vez,  
**entonces** completa las tareas principales (describir un proyecto y buscar un proveedor) sin ayuda externa.  
*Origen del criterio: I1:RNF-01-AC-1.*

#### RNF-01-AC-2
**Dado** un formulario con un dato inválido o faltante,  
**cuando** el usuario intenta enviarlo,  
**entonces** el mensaje de validación aparece junto al campo correspondiente.  
*Origen del criterio: I3:RNF-08.*

### RNF-02 — Uso móvil: web responsive y app nativa

**Descripción:** La plataforma debe estar disponible como aplicación web responsive y como app nativa para los cuatro actores. La versión web debe poder usarse desde un navegador móvil, en pantallas de 360 × 640 px, sin desplazamiento horizontal y sin instalar nada.

**Origen:** I3:RNF-02, I3:RNF-08; I1:RNF-02 (ajustado: la condición "sin instalación" aplica a la versión web); I4:RNF-06.

**Decisión:** DEC-01, DEC-42.

**Criterio de aceptación:**

#### RNF-02-AC-1
**Dado** un navegador móvil con una pantalla de 360 × 640 px,  
**cuando** un usuario crea una solicitud, revisa recomendaciones y aprueba un cambio,  
**entonces** completa los tres flujos sin desplazamiento horizontal y sin instalar ninguna aplicación.  
*Origen del criterio: I3:RNF-02-AC-1; I1:RNF-02-AC-1.*

#### RNF-02-AC-2
**Dado** un usuario de cualquiera de los cuatro actores,  
**cuando** usa la app nativa,  
**entonces** tiene disponibles las mismas funciones de su rol que en la aplicación web.  
*Origen del criterio: Derivado de DEC-01 y DEC-42.*

### RNF-03 — Autenticación obligatoria

**Descripción:** El sistema debe exigir autenticación para consultar, crear o modificar solicitudes, citas, propuestas, cambios y evaluaciones.

**Origen:** I3:RNF-03; I4:RNF-04.

**Decisión:** Consenso; DEC-02.

**Criterio de aceptación:**

#### RNF-03-AC-1
**Dado** una petición sin autenticar,  
**cuando** intenta consultar, crear o modificar una solicitud, cita, propuesta, cambio o evaluación,  
**entonces** recibe una respuesta de acceso denegado que no contiene domicilio, teléfono, archivos ni datos del proyecto.  
*Origen del criterio: I3:RNF-03/RNF-09-AC-1.*

### RNF-04 — Control de acceso por rol y propiedad

**Descripción:** En cada operación, el sistema debe verificar que el usuario autenticado sea propietario del recurso o tenga el rol autorizado para usarlo. Los intentos denegados no deben revelar datos del recurso.

**Origen:** I1:RNF-12, I1:RNF-08; I3:RNF-09; I4:RNF-03.

**Decisión:** Consenso.

**Criterio de aceptación:**

#### RNF-04-AC-1
**Dado** un usuario autenticado con un rol específico,  
**cuando** intenta acceder a una función o a un dato fuera de su rol,  
**entonces** el sistema le niega el acceso.  
*Origen del criterio: I1:RNF-12-AC-1.*

#### RNF-04-AC-2
**Dado** un usuario autenticado que no es propietario de un recurso ni tiene un rol autorizado,  
**cuando** intenta consultarlo,  
**entonces** recibe acceso denegado sin ningún dato del recurso.  
*Origen del criterio: I3:RNF-03/RNF-09-AC-1; I1:RNF-08-AC-1.*

### RNF-05 — Protección de datos sensibles

**Descripción:** El domicilio, los datos de contacto y las fotos y videos del domicilio deben transmitirse por HTTPS y almacenarse con control de acceso por rol.

**Origen:** I3:RNF-04; I1:RNF-08; I2:RNF-05 (parcial; los algoritmos de cifrado de I2 no se adoptaron).

**Decisión:** Consenso; DEC-58 (se retiran los comprobantes de la lista de datos sensibles).

**Criterio de aceptación:**

#### RNF-05-AC-1
**Dado** datos sensibles en tránsito y almacenados,  
**cuando** se inspecciona su transferencia y se prueba el acceso con un usuario de otro rol,  
**entonces** la transferencia usa HTTPS y el usuario de otro rol no puede ver ni descargar esos datos.  
*Origen del criterio: I3:RNF-04-AC-1.*

### RNF-06 — Acceso a imágenes y videos de referencia

**Descripción:** Las imágenes y videos de referencia y las representaciones visuales deben almacenarse con control de acceso por solicitud. Solo pueden consultarlos el cliente, los proveedores autorizados y el administrador.

**Origen:** I3:RNF-11; I3:LD-07.

**Decisión:** DEC-05, DEC-11.

**Criterio de aceptación:**

#### RNF-06-AC-1
**Dado** un usuario no vinculado a una solicitud,  
**cuando** intenta ver o descargar sus imágenes o videos de referencia o sus representaciones visuales,  
**entonces** el sistema no lo permite.  
*Origen del criterio: I3:RNF-11-AC-1.*

### RNF-07 — Uso consentido de fotos y conversaciones

**Descripción:** Las fotos y conversaciones del usuario no deben usarse para fines que el usuario no haya consentido. Las fotos se usan solo en el contexto necesario para atender la solicitud.

**Origen:** I1:RNF-07; I4 §2.4.

**Decisión:** GAP adoptado mediante DEC-74.

**Criterio de aceptación:**

#### RNF-07-AC-1
**Dado** una foto o una conversación capturada por la plataforma,  
**cuando** se revisa su uso,  
**entonces** no se emplea para ningún fin que el usuario no haya consentido.  
*Origen del criterio: I1:RNF-07-AC-1.*

### RNF-08 — Rendimiento

**Descripción:** Las búsquedas, los filtrados, las consultas de perfil y las acciones de crear solicitud, confirmar cita, enviar propuesta y aprobar o rechazar un cambio deben responder en máximo 3 segundos en el percentil 95, con hasta 100 usuarios concurrentes. El tiempo de carga de archivos no cuenta. Las respuestas generadas por IA dependen de un servicio externo y quedan fuera de este umbral; mientras se esperan, aplica el indicador de RF-25.

**Origen:** I3:RNF-01, I3:RNF-07; I4:RNF-02.

**Decisión:** DEC-39 (con su resolución posterior).

**Criterio de aceptación:**

#### RNF-08-AC-1
**Dado** una prueba de carga con 100 usuarios concurrentes y el conjunto de datos del piloto,  
**cuando** se miden la búsqueda, el filtrado y la consulta de perfil,  
**entonces** el percentil 95 es menor o igual a 3 segundos.  
*Origen del criterio: I3:RNF-01-AC-1.*

#### RNF-08-AC-2
**Dado** una prueba de carga con 100 usuarios concurrentes,  
**cuando** se miden las acciones de crear solicitud, confirmar cita, enviar propuesta y aprobar o rechazar un cambio, sin contar la carga de archivos,  
**entonces** el resultado se confirma al usuario en máximo 3 segundos en el percentil 95.  
*Origen del criterio: I3:RNF-07 (sin "registrar avance", movido a FP-15).*

#### RNF-08-AC-3
**Dado** una operación que espera una respuesta generada por IA,  
**cuando** se evalúa el cumplimiento de RNF-08,  
**entonces** el tiempo de esa respuesta no se incluye en la medición, por depender de un servicio externo.  
*Origen del criterio: Derivado de DEC-39 (resolución posterior; I4:RNF-02 excluye los retrasos de servicios externos).*

### RNF-09 — Disponibilidad

**Descripción:** El servicio debe tener al menos 99 % de disponibilidad mensual durante el piloto, sin contar los mantenimientos programados anunciados con 24 horas de anticipación. La disponibilidad se calcula como `(minutos del mes − minutos de indisponibilidad no planificada) / minutos del mes × 100`, y el resultado se publica al cierre de cada mes.

**Origen:** I1:RNF-05; I3:RNF-06, I3:RNF-10.

**Decisión:** DEC-40.

**Criterio de aceptación:**

#### RNF-09-AC-1
**Dado** el cierre de un mes del piloto,  
**cuando** se publica el reporte mensual,  
**entonces** el reporte contiene el cálculo de disponibilidad (≥ 99 %), los intervalos de indisponibilidad y la evidencia del aviso con 24 horas de los mantenimientos excluidos.  
*Origen del criterio: I3:RNF-06/RNF-10-AC-1; I1:RNF-05-AC-1.*

### RNF-10 — Orden de recomendaciones independiente de pagos

**Descripción:** El orden de las recomendaciones no debe depender de pagos ni de criterios que no se hayan comunicado al cliente.

**Origen:** I1:RNF-10.

**Decisión:** DEC-24.

**Criterio de aceptación:**

#### RNF-10-AC-1
**Dado** una lista de recomendaciones generada para un cliente,  
**cuando** el cliente pregunta por qué aparece cada opción,  
**entonces** la explicación no depende de pagos ni de criterios que no se le hayan comunicado.  
*Origen del criterio: I1:RNF-10-AC-1.*

### RNF-11 — Reglas de autenticación

**Descripción:** Las contraseñas deben tener al menos 10 caracteres. El administrador debe usar además un segundo factor de autenticación. Las sesiones se cierran tras 30 minutos de inactividad. Esto aplica en la aplicación web y en la app nativa.

**Origen:** I2:RNF-15 (sin la mención al rol de soporte).

**Decisión:** GAP adoptado mediante DEC-43; DEC-42.

**Criterio de aceptación:**

#### RNF-11-AC-1
**Dado** una persona que se registra o cambia su contraseña,  
**cuando** captura una contraseña de menos de 10 caracteres,  
**entonces** el sistema la rechaza.  
*Origen del criterio: Derivado de DEC-43 (verificación de I2:RNF-15).*

#### RNF-11-AC-2
**Dado** un administrador con credenciales válidas,  
**cuando** intenta iniciar sesión sin completar el segundo factor,  
**entonces** el sistema no le permite el acceso.  
*Origen del criterio: Derivado de DEC-43 (verificación de I2:RNF-15).*

#### RNF-11-AC-3
**Dado** una sesión iniciada,  
**cuando** pasan 30 minutos sin actividad,  
**entonces** el sistema cierra la sesión.  
*Origen del criterio: Derivado de DEC-43 (verificación de I2:RNF-15).*

### RNF-12 — Bitácora inalterable

**Descripción:** Cada aceptación, rechazo y contrapropuesta de propuestas y cambios debe quedar registrada en una bitácora con fecha, usuario y decisión. Los registros no pueden alterarse sin dejar rastro.

**Origen:** I3:RNF-05; I1:RNF-11.

**Decisión:** GAP adoptado mediante DEC-66.

**Criterio de aceptación:**

#### RNF-12-AC-1
**Dado** que el cliente o el proveedor acepta, rechaza o contrapropone una propuesta o un cambio,  
**cuando** el sistema procesa la decisión,  
**entonces** la bitácora registra la fecha, el usuario y la decisión.  
*Origen del criterio: I3:RNF-05.*

#### RNF-12-AC-2
**Dado** un registro de la bitácora o un acuerdo ya registrado,  
**cuando** alguien intenta modificarlo,  
**entonces** la modificación queda registrada con su propio rastro, sin borrar el original.  
*Origen del criterio: I1:RNF-11-AC-1.*

### RNF-13 — Continuidad ante caídas

**Descripción:** Si el servicio se cae o el usuario pierde la conexión, no deben perderse conversaciones, citas ni acuerdos. Al reconectarse, el usuario recupera su estado. Los valores de respaldo y recuperación (RPO, RTO) no se adoptaron.

**Origen:** I1:RNF-03.

**Decisión:** GAP adoptado mediante DEC-67.

**Criterio de aceptación:**

#### RNF-13-AC-1
**Dado** una conversación, cita o acuerdo en curso,  
**cuando** el servicio sufre una caída o el usuario pierde la conexión,  
**entonces** al reconectarse el usuario recupera el estado exacto de su conversación, cita o acuerdo.  
*Origen del criterio: I1:RNF-03-AC-1.*

### RNF-14 — Localización

**Descripción:** Todos los mensajes y pantallas deben estar en español de México, con fechas en formato DD/MM/AAAA, la hora del centro de México y montos en MXN con separador de miles (por ejemplo, $12,500.00).

**Origen:** I2:RNF-13.

**Decisión:** GAP adoptado mediante DEC-68.

**Criterio de aceptación:**

#### RNF-14-AC-1
**Dado** cualquier pantalla o mensaje que muestre una fecha, una hora o un monto,  
**cuando** se inspecciona,  
**entonces** la fecha usa DD/MM/AAAA, la hora corresponde al centro de México y el monto se expresa en MXN con separador de miles (por ejemplo, $12,500.00).  
*Origen del criterio: Derivado de DEC-68 (I2:RNF-13 se verifica por inspección).*

---

### 5. Reglas de negocio y dominio

| ID | Regla | Origen | DEC | RF / RNF relacionados |
|---|---|---|---|---|
| RD-01 | Un proveedor puede ser trabajador independiente u organización de contratistas, y su perfil indica la modalidad. | I3:RD-01; I1 §3; I2 §1.3; I4 §1.3 | Consenso | RF-03, RF-05, RF-07 |
| RD-02 | Un perfil solo se marca como "verificado" (identidad, experiencia u organización) después de la revisión de la plataforma. | I1:RD-02 | DEC-07 | RF-09, RF-10, RF-11, RF-12 |
| RD-03 | No se exigen certificados a todos los oficios: la verificación combina identificación oficial y evidencia de experiencia. | I1:RD-03 | DEC-07 | RF-09, RF-10 |
| RD-04 | "Cercano" significa que la colonia del cliente está dentro de la cobertura declarada por el proveedor o es vecina de ella. | I1:RD-04; I3:RF-04 | DEC-13, DEC-80 | RF-03, RF-26, RF-29 |
| RD-05 | "Disponible" significa tener espacio en la agenda en las fechas solicitadas; quien no lo tiene no se muestra como disponible. | I1:RD-05; I4:RD-02; I3 §1.3 | Consenso | RF-06, RF-26, RF-35 |
| RD-06 | Un proveedor solo se presenta como opción si al menos una de sus especialidades corresponde al servicio solicitado. | I4:RD-01; I2:RF-04 (b); I3:RF-04 | Consenso | RF-15, RF-26 |
| RD-07 | La IA puede recopilar información, recomendar, resumir y alertar, pero no decide medidas delicadas ni acepta citas, propuestas, pagos o cambios en nombre de los usuarios; la última palabra la tiene una persona. | I1:RD-06; I3:RD-04 | DEC-75 | RF-12, RF-24, RF-30, RF-42 |
| RD-08 | La representación visual generada por IA es una referencia de comunicación y no sustituye planos, permisos, cálculos estructurales ni la responsabilidad profesional del proveedor. | I3:RD-10 | DEC-05 | RF-23, RNF-06 |
| RD-09 | La IA puede señalar inconsistencias, faltantes o riesgos en la justificación de un cambio, pero no puede declararla válida ni aprobar o rechazar el cambio. | I3:RD-11 | DEC-05 | RF-42 |
| RD-10 | Ningún cambio de costo, material, alcance o fecha es válido sin la autorización explícita del cliente. | I1:RD-07; I3:RD-03 | DEC-21 | RF-24, RF-40, RF-41 |
| RD-11 | El administrador no interviene en decisiones comerciales (costos y acuerdos). Su papel se limita a verificar perfiles, atender solicitudes de soporte y solicitudes ARCO, y recibir avisos informativos. | I3 §2.3, §3.1.1 | DEC-34, DEC-20 (resolución), DEC-35, DEC-37, DEC-62 | RF-09, RF-10, RF-11, RF-12, RF-22, RF-41, RF-48, RF-54 |
| RD-12 | El precio de un trabajo lo define exclusivamente el proveedor; cualquier rango que muestre el sistema es solo de referencia. | I2:RD-04 | DEC-76 | RF-07, RF-29, RF-38 |
| RD-13 | Solo el cliente de un proyecto concluido puede evaluar al proveedor, y solo el prestador de ese proyecto puede evaluar al cliente. Cada evaluación queda asociada al servicio y a las partes que la originaron. | I1:RD-01; I3:RD-05; I4:RD-03, I4:RD-06; I2:RF-11 | Consenso; DEC-30 | RF-49, RF-50, RF-51 |
| RD-14 | La plataforma no procesa ni registra pagos: el pago se hace directamente entre cliente y proveedor. La plataforma solo registra los acuerdos (propuestas aceptadas y cambios). | I1 §10; I2:RD-02; I3:RD-06 (parte de acuerdos); I4 §2.4 | Consenso; DEC-23, DEC-58 | RF-39, RF-41, RF-43 |
| RD-15 | Antes de que se confirme la cita de visita o se acepte la propuesta, el proveedor solo ve la zona aproximada (colonia y municipio). El domicilio nunca es público y los teléfonos no se revelan entre las partes. | I3:RD-02; I4:RD-04; I2:RNF-04 (primera parte) | Consenso; DEC-36, DEC-65, DEC-78 | RF-31, RF-46, RF-52, RF-53 |
| RD-16 | El tratamiento de datos personales requiere aviso de privacidad y consentimiento previos, y la atención de derechos ARCO conforme a la LFPDPPP. | I2:RD-01; I1:RD-11 | DEC-37 | RF-02, RF-54, RNF-07 |
| RD-17 | Cuando se eliminan o anonimizan los datos de un usuario, la bitácora de decisiones se conserva anonimizada. | I3:RD-09; I1:RF-55-AC-2 | DEC-77 | RF-54, RNF-12 |
| RD-18 | La operación del piloto se limita a domicilios en Guadalajara, Zapopan, San Pedro Tlaquepaque, Tonalá, Tlajomulco de Zúñiga y El Salto (Jalisco), y a los 10 oficios del catálogo inicial: albañilería, plomería, electricidad, carpintería, herrería, pintura, pisos y azulejos, vidriería y cancelería, tablaroca e impermeabilización. | I2:RD-06; I2 Apéndice C | DEC-38 | RF-03, RF-05, RF-15, RF-16 |

---

### 6. Restricciones y decisiones de alcance

| ID | Tipo | Restricción o decisión | Origen | DEC |
|---|---|---|---|---|
| RE-01 | Alcance de producto | El MVP se entrega como aplicación web responsive y app nativa para los cuatro actores. WhatsApp queda fuera del MVP. | I1:RE-01; I3 §2.1; I4:RNF-06 | DEC-01, DEC-42 |
| RE-02 | Alcance de producto | La identidad del usuario se basa en una cuenta registrada para todos los roles. | I1:RF-30 | DEC-02 |
| RE-03 | Alcance de producto | El MVP incluye el agente de IA conversacional como componente interno y dos funciones de IA adicionales: la representación visual y el análisis de justificaciones. | I1 §2.4; I3:RF-16, I3:RF-18 | DEC-03, DEC-05 |
| RE-04 | Restricción técnica | El agente depende de un servicio de IA externo. Los servicios externos no aprueban ni modifican datos sin la acción de un usuario autorizado. Cuando la IA no está disponible, aplica la captura manual (RF-21). | I3 §2.5, §3.1.3; I1 §4.2 | DEC-03, DEC-39, DEC-46 |
| RE-05 | Alcance de producto | La solicitud admite texto, fotos y videos. Las notas de voz no se procesan en el MVP. | I3:RF-01; I1:RF-33 | DEC-04, DEC-11 |
| RE-06 | Fuera del MVP | La plataforma no procesa ni registra pagos y no maneja suscripciones de proveedores. | I1 §10; I2:RD-02; I3:RD-06; I4 §4.2 | DEC-23, DEC-24 |
| RE-07 | Alcance de producto | La privacidad de contacto se garantiza con un canal interno de mensajes, sin intercambio de teléfonos. | I3:RF-14 | DEC-36 |
| RE-08 | Restricción de negocio | El piloto opera en la zona y con el catálogo de RD-18, con moneda MXN y zona horaria `America/Mexico_City`. | I2:RD-06; I3 §2.4 | DEC-38 |
| RE-09 | Restricción técnica | Todas las interfaces usan HTTPS. | I3 §3.1.4; I3:RNF-04 | Consenso |

Las decisiones técnicas heredadas de un solo SRS y no aprobadas no son restricciones de este documento. Por ejemplo: la API de WhatsApp Business, la capa de abstracción del LLM, el cifrado AES-256 y la firma de webhooks, propuestos en uno de los SRS individuales.

---

## Apéndices

### 7. Funcionalidades posteriores al MVP

| ID | Funcionalidad | Origen | Decisión |
|---|---|---|---|
| FP-01 | Notas de voz y transcripción, incluida la propuesta dictada por voz | I1:RF-33; I2:RF-01 (voz), I2:RF-08-AC-7, I2:RNF-01 (voz) | DEC-04 |
| FP-02 | Integración con WhatsApp | I1 §10; I2:C-01, I2:RNF-10, I2:C-07, I2:RNF-16, I2:RNF-07 | DEC-01 |
| FP-03 | Gestión de plantilla, jerarquías, asignación de trabajadores y agenda por empleado de la organización | I1:RF-37; I2:RF-12, I2:RF-17 (plantilla), I2:RD-05, I2:RF-22-AC-5 | DEC-10 |
| FP-04 | Detección automática de desviaciones por umbral o análisis predictivo | I1:RF-46 | DEC-05 |
| FP-05 | Procesamiento de pagos y anticipos (escrow) | I1 §10; I2 §1.2; I3 §2.4; I4 §4.2 | DEC-23 |
| FP-06 | Registro de pagos declarados y disputas de pago | I2:RF-14 | DEC-23 |
| FP-07 | Suscripción de prestadores como requisito para aparecer en búsquedas | I2:RF-15, I2:RD-07, I2:RF-04 (criterio e) | DEC-24 |
| FP-08 | Cotización automática generada por IA | I1 §10 | Fuera del MVP en el SRS de origen |
| FP-09 | Estadísticas y reportes detallados | I1 §10 | Fuera del MVP en el SRS de origen |
| FP-10 | Atención de urgencias | I1 §10 | Fuera del MVP en el SRS de origen |
| FP-11 | Ampliar oficios y zonas más allá de los iniciales | I1 §10; I2 §1.2 | DEC-38 |
| FP-12 | Seguros, garantías financieras, penalizaciones económicas, reclamaciones financieras y gestión fiscal | I4 §4.2 | Fuera del MVP en el SRS de origen |
| FP-13 | Entrenamiento de un modelo de IA propio | I2 §1.2, I2:C-02 | Fuera del MVP en el SRS de origen |
| FP-14 | Reportes de irregularidades, moderación y sanciones (advertencias, suspensión, respuesta y revisión de evaluaciones) | I1:RF-26 a I1:RF-28, I1:RF-32, I1:RF-49 a I1:RF-52, I1:RF-61, I1:RD-08, I1:RD-09; I3:RF-12, I3:RF-13 (estado suspendido) | DEC-33 |
| FP-15 | Reportes periódicos de avance, resumen de avance por IA, recordatorios y escalamiento por falta de reporte | I1:RF-22, I1:RF-43, I1:RF-44, I1:RF-45, I1:RF-57; I2:RF-10; I3:RF-09 (reportes), I3:RF-10 (porcentaje de avance) | DEC-25, DEC-26, DEC-27 |
| FP-16 | Etapas acordadas del proyecto con validación por etapa | I3:RF-09, I3:RF-10, I3:RF-11-AC-1, I3:LD-05 | DEC-28 |
| FP-17 | Rol de agente de soporte con bandeja, horario, tickets y transferencia en vivo | I2:RF-13, I2:RF-23, I2:C-06 | DEC-35 |
| FP-18 | Catálogo de trabajadores, o ver todos los compatibles además de las recomendaciones | I4:RF-02 | DEC-52 |
| FP-19 | Cancelación tardía (dentro de las 24 h previas) y distinción entre emergencia y ausencia sin aviso | I1:RF-17-AC-2, I1:RD-10 | DEC-54 (g) |
| FP-20 | Aviso de proyectos sin movimiento | I3:RF-09-AC-4 (referencia) | DEC-60 |
| FP-21 | Cancelación o abandono del proyecto completo | I2:RF-19 | DEC-61, DEC-29 |
| FP-22 | Registro de comprobantes de compra y cálculo de gasto acumulado (fuera del alcance de la app, porque la revisión es presencial) | I3:RF-09-AC-2, I3:RD-06 (comprobantes), I3 §1.3; I1:RF-23 (lo gastado) | DEC-58 |
| FP-23 | Sugerencia de visita de valoración según los datos faltantes y marca "apta para cotización sin visita" | I3:RF-02-AC-3; I3:RF-03 (AC-2, AC-4) | DEC-71 |

---

### 8. Pendientes abiertos

#### PV-01 — Límites para videos

**Situación:** Falta definir la duración, el tamaño y la cantidad máximos de videos por solicitud.

**Origen:** DEC-47; DEC-11.

**Razón por la que permanece abierto:** Ningún SRS ni la elicitación aportan un valor, y el equipo no tiene información técnica para fijarlo.

**Impacto:** RF-17, RF-18, RNF-06.

#### PV-02 — Evidencia de experiencia aceptable sin certificados

**Situación:** Falta definir qué evidencia es suficiente para otorgar la marca "experiencia verificada" cuando el oficio no tiene certificados formales.

**Origen:** I1:PV-02; DEC-07, DEC-08.

**Razón por la que permanece abierto:** Requiere un criterio de negocio y operativo que ninguna fuente define.

**Impacto:** RF-10, RD-03.

#### PV-03 — Registro de organización: campos mínimos, "organización registrada" y RFC

**Situación:** Falta definir qué significa "organización registrada" y ante quién, qué campos adicionales exige el registro y si el RFC es obligatorio.

**Origen:** I1:PV-03; I2:RF-17; DEC-09, DEC-49.

**Razón por la que permanece abierto:** Depende de una definición legal que el equipo no posee.

**Impacto:** RF-05, RF-11.

#### PV-04 — Declaración de cobertura y "zona vecina"

**Situación:** Falta definir cómo declara el proveedor su cobertura y qué colonias cuentan como vecinas.

**Origen:** I1:PV-05; DEC-13, DEC-80.

**Razón por la que permanece abierto:** Requiere una definición operativa que ninguna fuente aporta.

**Impacto:** RF-03, RF-05, RF-26, RF-29, RD-04.

#### PV-05 — Precio comparable y viabilidad del filtro por precio

**Situación:** Falta definir cómo se captura el precio o rango del proveedor para que sea comparable entre proveedores.

**Origen:** I1:RF-36 (viabilidad no confirmada); DEC-14.

**Razón por la que permanece abierto:** Requiere confirmar con datos reales del piloto que el filtro es viable; el SRS de origen lo había dejado fuera precisamente por eso.

**Impacto:** RF-07, RF-29, RD-12.

#### PV-06 — Desacuerdo persistente sobre un cambio

**Situación:** Si cliente y proveedor no llegan a un acuerdo sobre un cambio, no existe un mecanismo formal para destrabar la parte afectada del trabajo.

**Origen:** I1 §11 (vacío documentado); DEC-20 (resolución posterior), DEC-34.

**Razón por la que permanece abierto:** Ninguna fuente define qué ocurre en ese caso, y el equipo decidió que el administrador no media en disputas de costo.

**Impacto:** RF-41, RD-10, RD-11.

#### PV-07 — Tiempo de atención del administrador

**Situación:** Falta definir en cuánto tiempo debe atender el administrador las solicitudes de soporte.

**Origen:** I1:PV-09; DEC-35.

**Razón por la que permanece abierto:** Depende de la capacidad operativa real del equipo, que no está confirmada.

**Impacto:** RF-22.

#### PV-08 — Aviso de privacidad, plazo legal ARCO y plazo de conservación

**Situación:** Faltan el texto del aviso de privacidad, el plazo legal definitivo para responder solicitudes ARCO y el plazo de conservación de los datos.

**Origen:** I1:PV-15; I2 Apéndice A; DEC-37.

**Razón por la que permanece abierto:** Requiere asesoría legal.

**Impacto:** RF-02, RF-54, RD-16, RD-17.

#### PV-09 — Modelo de ingreso de la plataforma

**Situación:** Falta definir cómo obtiene ingresos la plataforma.

**Origen:** I1:PV-14, I1:PV-17; I2:RD-07; DEC-24.

**Razón por la que permanece abierto:** Es una decisión de negocio fuera del alcance de los requerimientos de software.

**Impacto:** RNF-10, RE-06.

#### PV-10 — Valor legal de la propuesta aceptada

**Situación:** Falta definir si el acuerdo escrito aceptado en la plataforma tiene valor legal entre las partes.

**Origen:** I1:PV-11.

**Razón por la que permanece abierto:** Requiere asesoría legal.

**Impacto:** RF-38, RF-39, RF-43.

#### PV-11 — Capacidad del equipo y calendario

**Situación:** Falta confirmar si el equipo puede construir el alcance definido (web y app nativa, agente de IA y funciones de IA adicionales) en un tiempo razonable.

**Origen:** I1:PV-17, I1:PV-18; DEC-01, DEC-05, DEC-42.

**Razón por la que permanece abierto:** No se conocen el presupuesto, el calendario ni la capacidad real del equipo.

**Impacto:** Todo el MVP.

#### PV-12 — Alcance completo de la anonimización

**Situación:** Falta definir si la anonimización de RF-54 incluye también los mensajes del canal interno, los videos y la calificación del cliente.

**Origen:** DEC-86; I3:RF-15-AC-2 (archivos y conversación); I2:RF-21-AC-3.

**Razón por la que permanece abierto:** El equipo decidió no ampliar el alcance hasta contar con la revisión legal pendiente (PV-08). Las fuentes no coinciden: un SRS menciona archivos y conversación y otro no (ver Origen). La calificación del cliente no tiene fuente.

**Impacto:** RF-46, RF-50, RF-54, RD-17.

#### PV-13 — Métrica cuantitativa de usabilidad

**Situación:** RNF-01 tiene un criterio cualitativo; falta una métrica cuantitativa.

**Origen:** DEC-87; I1:RNF-01; I2:RNF-07 (referencia).

**Razón por la que permanece abierto:** La única métrica disponible (I2:RNF-07) estaba diseñada para tareas por WhatsApp. El equipo la definirá cuando conozca las tareas y los usuarios del piloto.

**Impacto:** RNF-01.

---

### 9. Matriz de trazabilidad

Cada RF, RNF y RD se rastrea hacia sus fuentes en los SRS individuales y hacia las decisiones del equipo. Un "—" indica que ese SRS no aporta origen para el elemento.

| ID definitivo | Tipo | Origen I1 | Origen I2 | Origen I3 | Origen I4 | DEC | Criterios |
|---|---|---|---|---|---|---|---|
| RF-01 | RF | I1:RF-30 | — | I3:RNF-03, I3:LD-01 | I4:RNF-04 | DEC-01, DEC-02, DEC-42 | RF-01-AC-1 a RF-01-AC-3 (3) |
| RF-02 | RF | — | I2:RF-20, I2:RD-01 | — | — | DEC-37, DEC-02 | RF-02-AC-1 a RF-02-AC-3 (3) |
| RF-03 | RF | I1:RF-07 | I2:RF-07 | — | I4:RF-10, I4:RD-05 | DEC-06, DEC-13, DEC-38 | RF-03-AC-1 a RF-03-AC-4 (4) |
| RF-04 | RF | I1:RF-34 | — | I3:RF-05-AC-2 | — | DEC-08 | RF-04-AC-1 a RF-04-AC-2 (2) |
| RF-05 | RF | I1:RF-15 | I2:RF-17 (parcial) | I3 §2.3 | I4:RF-10 | DEC-09, DEC-10 | RF-05-AC-1 a RF-05-AC-2 (2) |
| RF-06 | RF | I1:RF-08 | I2:RF-22 (parcial) | I3 §1.3 | I4:RF-10 | Consenso; DEC-10 | RF-06-AC-1 a RF-06-AC-3 (3) |
| RF-07 | RF | I1:RF-48 | I2:RF-11 (promedio) | I3:RF-05 | I4:RF-03 | Consenso; DEC-14, DEC-31, DEC-51, DEC-63, DEC-64 | RF-07-AC-1 a RF-07-AC-5 (5) |
| RF-08 | RF | I1:RF-10 | — | I3:RF-05-AC-3 | — | DEC-06, DEC-48 | RF-08-AC-1 a RF-08-AC-3 (3) |
| RF-09 | RF | I1:RF-09 | I2:RF-07 (identificación) | I3:RF-13-AC-1 | — | DEC-07, DEC-48 | RF-09-AC-1 a RF-09-AC-2 (2) |
| RF-10 | RF | I1:RF-35 | — | I3:RF-13 (portafolio) | — | DEC-07, DEC-08, DEC-48 | RF-10-AC-1 a RF-10-AC-2 (2) |
| RF-11 | RF | I1:RF-62 | I2:RF-17 (aprobación) | I3:RF-13 | — | DEC-09, DEC-48 | RF-11-AC-1 a RF-11-AC-2 (2) |
| RF-12 | RF | I1:RF-29 | — | — | — | DEC-07, DEC-35, DEC-48 | RF-12-AC-1 a RF-12-AC-2 (2) |
| RF-13 | RF | I1:RF-56 | — | — | — | DEC-44 | RF-13-AC-1 a RF-13-AC-2 (2) |
| RF-14 | RF | I1:RF-01 | I2:RF-02 | I3:RF-02 | — | DEC-03, DEC-71 | RF-14-AC-1 a RF-14-AC-5 (5) |
| RF-15 | RF | — | I2:RF-03 | — | — | DEC-45, DEC-35, DEC-38 | RF-15-AC-1 a RF-15-AC-4 (4) |
| RF-16 | RF | I1:RF-04 | — | I3:RF-01, I3:LD-02 | I4:RF-01 | DEC-12, DEC-69, DEC-79 | RF-16-AC-1 a RF-16-AC-5 (5) |
| RF-17 | RF | I1:RF-02 | I2:RF-01-AC-4 (ajustado) | I3:RF-01 | I4:RF-01-AC-2 | DEC-11, DEC-04 | RF-17-AC-1 a RF-17-AC-3 (3) |
| RF-18 | RF | — | I2:RF-01 (AC-1, AC-3, AC-5, AC-6) | — | — | DEC-47 | RF-18-AC-1 a RF-18-AC-4 (4) |
| RF-19 | RF | I1:RF-05 | — | — | — | DEC-03 | RF-19-AC-1 a RF-19-AC-2 (2) |
| RF-20 | RF | I1:RF-03 | I2:RF-02 (AC-3, AC-4) | I3:RF-03 (AC-1, AC-3) | — | DEC-03, DEC-59 | RF-20-AC-1 a RF-20-AC-4 (4) |
| RF-21 | RF | — | — | I3 §2.5 | I4:RF-01 | DEC-46, DEC-69 | RF-21-AC-1 a RF-21-AC-3 (3) |
| RF-22 | RF | I1:RF-06 | — | I3:RF-14-AC-1 | — | DEC-03, DEC-35 | RF-22-AC-1 a RF-22-AC-3 (3) |
| RF-23 | RF | — | — | I3:RF-16, I3:LD-07 | — | DEC-05 | RF-23-AC-1 a RF-23-AC-2 (2) |
| RF-24 | RF | I1:RF-20 | — | — | — | DEC-72, DEC-78 | RF-24-AC-1 a RF-24-AC-3 (3) |
| RF-25 | RF | I1:RF-53 | — | — | — | DEC-39 | RF-25-AC-1 a RF-25-AC-2 (2) |
| RF-26 | RF | I1:RF-11 | I2:RF-04 (a, b, d) | I3:RF-04 | I4:RF-04, I4:RD-01 | Consenso; DEC-06, DEC-13, DEC-24, DEC-48 | RF-26-AC-1 a RF-26-AC-4 (4) |
| RF-27 | RF | — | — | I3:RF-04-AC-2 | — | DEC-53 | RF-27-AC-1 (1) |
| RF-28 | RF | I1:RF-12 | — | — | — | DEC-06 | RF-28-AC-1 a RF-28-AC-2 (2) |
| RF-29 | RF | — | — | I3:RF-06 | — | DEC-14, DEC-51, DEC-80, DEC-82 | RF-29-AC-1 a RF-29-AC-6 (6) |
| RF-30 | RF | I1:RF-13 | I2:RF-04 (límite sin efecto) | I3:RF-04-AC-3 | I4:RF-05 | DEC-15 | RF-30-AC-1 a RF-30-AC-4 (4) |
| RF-31 | RF | I1:RF-13 | I2:RF-18-AC-1 | — | I4:RF-06 | Consenso | RF-31-AC-1 a RF-31-AC-3 (3) |
| RF-32 | RF | — | I2:RF-18 (AC-2 a AC-5) | — | — | DEC-54, DEC-16, DEC-59 | RF-32-AC-1 a RF-32-AC-4 (4) |
| RF-33 | RF | — | — | I3:RF-07 | — | DEC-54 | RF-33-AC-1 (1) |
| RF-34 | RF | I1:RF-38, I1:RF-42 | I2:RF-06 (AC-1 a AC-3), I2:RF-18-AC-5 | I3:RF-07-AC-2, I3:LD-03 | I4:RF-07-AC-1 | DEC-16, DEC-10, DEC-17, DEC-54, DEC-81, DEC-84 | RF-34-AC-1 a RF-34-AC-6 (6) |
| RF-35 | RF | — | I2:RF-06 (AC-2, AC-5, AC-7) | — | — | DEC-54 | RF-35-AC-1 a RF-35-AC-3 (3) |
| RF-36 | RF | I1:RF-39 | I2:RF-06-AC-6 | — | — | DEC-54 | RF-36-AC-1 a RF-36-AC-3 (3) |
| RF-37 | RF | I1:RF-17, I1:RF-40, I1:RF-41 | I2:RF-06 (AC-5, AC-8) | I3:RF-07-AC-4 | I4:RF-07-AC-2 | Consenso; DEC-29, DEC-54 | RF-37-AC-1 a RF-37-AC-3 (3) |
| RF-38 | RF | I1:RF-18 | I2:RF-08-AC-8 | I3:RF-08 (AC-1, AC-4), I3:LD-04 | — | DEC-17, DEC-55 | RF-38-AC-1 a RF-38-AC-3 (3) |
| RF-39 | RF | I1:RF-42 | I2:RF-08-AC-5 | — | — | DEC-18, DEC-19, DEC-55 | RF-39-AC-1 a RF-39-AC-5 (5) |
| RF-40 | RF | I1:RF-19, I1:RF-24 | I2:RF-09 (parcial) | I3:RF-08 (AC-2, AC-6), I3:RF-10 (AC-2, AC-3) | — | DEC-21, DEC-56 | RF-40-AC-1 a RF-40-AC-4 (4) |
| RF-41 | RF | I1:RF-19 | I2:RF-09 (AC-4, AC-6, AC-7) | I3:RF-08 (AC-2, AC-3) | — | DEC-20, DEC-22, DEC-34, DEC-57, DEC-85 | RF-41-AC-1 a RF-41-AC-8 (8) |
| RF-42 | RF | — | — | I3:RF-18 | — | DEC-05, DEC-21 | RF-42-AC-1 a RF-42-AC-2 (2) |
| RF-43 | RF | — | I2:RF-09-AC-4 | I3:RF-08-AC-7, I3:LD-04 | — | DEC-73 | RF-43-AC-1 a RF-43-AC-2 (2) |
| RF-44 | RF | I1:RF-23 | — | I3:RF-10 (presupuesto) | — | DEC-70, DEC-58 | RF-44-AC-1 a RF-44-AC-2 (2) |
| RF-45 | RF | I1:RF-60 | — | I3:RF-01-AC-1, I3:RF-03-AC-3 | I4:RF-08 | DEC-25, DEC-59, DEC-81, DEC-83, DEC-88 | RF-45-AC-1 a RF-45-AC-2 (2) |
| RF-46 | RF | — | — | I3:RF-14 | — | DEC-36 | RF-46-AC-1 a RF-46-AC-3 (3) |
| RF-47 | RF | I1:RF-59, I1:RF-60 | I2:RF-16 (AC-1 a AC-3) | I3:RF-11-AC-4 (ajustado) | I4:RF-08-AC-2 | Consenso; DEC-28, DEC-59 | RF-47-AC-1 a RF-47-AC-4 (4) |
| RF-48 | RF | — | I2:RF-16-AC-4 | — | — | DEC-62, DEC-34, DEC-35 | RF-48-AC-1 a RF-48-AC-2 (2) |
| RF-49 | RF | I1:RF-25 | I2:RF-11 (a) | I3:RF-11 (AC-2, AC-3) | I4:RF-09 | Consenso; DEC-31, DEC-32 | RF-49-AC-1 a RF-49-AC-5 (5) |
| RF-50 | RF | — | I2:RF-11 (b) | — | — | DEC-30, DEC-32 | RF-50-AC-1 a RF-50-AC-4 (4) |
| RF-51 | RF | — | I2:RF-11 (AC-1, AC-5 a AC-7) | — | — | DEC-63, DEC-30 | RF-51-AC-1 a RF-51-AC-4 (4) |
| RF-52 | RF | I1:RF-54 | I2:RNF-04, I2:RF-18-AC-1 | I3:RF-07-AC-3 | — | DEC-65, DEC-78, DEC-79, DEC-12, DEC-72 | RF-52-AC-1 a RF-52-AC-5 (5) |
| RF-53 | RF | I1:RF-58 | — | — | — | DEC-41, DEC-65 | RF-53-AC-1 a RF-53-AC-3 (3) |
| RF-54 | RF | I1:RF-55 | I2:RF-21 | I3:RF-15-AC-2 | — | DEC-37, DEC-35, DEC-77 | RF-54-AC-1 a RF-54-AC-5 (5) |
| RF-55 | RF | — | I2:RF-09-AC-7 (espejo) | I3:RF-08 (AC-2, AC-6, espejo) | — | DEC-85, DEC-56, DEC-57 | RF-55-AC-1 a RF-55-AC-5 (5) |
| RNF-01 | RNF | I1:RNF-01 | — | I3:RNF-08 | I4:RNF-01 | Consenso; DEC-87 | RNF-01-AC-1 a RNF-01-AC-2 (2) |
| RNF-02 | RNF | I1:RNF-02 (ajustado) | — | I3:RNF-02, I3:RNF-08 | I4:RNF-06 | DEC-01, DEC-42 | RNF-02-AC-1 a RNF-02-AC-2 (2) |
| RNF-03 | RNF | — | — | I3:RNF-03 | I4:RNF-04 | Consenso; DEC-02 | RNF-03-AC-1 (1) |
| RNF-04 | RNF | I1:RNF-12, I1:RNF-08 | — | I3:RNF-09 | I4:RNF-03 | Consenso | RNF-04-AC-1 a RNF-04-AC-2 (2) |
| RNF-05 | RNF | I1:RNF-08 | I2:RNF-05 (parcial) | I3:RNF-04 | — | Consenso; DEC-58 | RNF-05-AC-1 (1) |
| RNF-06 | RNF | — | — | I3:RNF-11, I3:LD-07 | — | DEC-05, DEC-11 | RNF-06-AC-1 (1) |
| RNF-07 | RNF | I1:RNF-07 | — | — | I4 §2.4 | DEC-74 | RNF-07-AC-1 (1) |
| RNF-08 | RNF | — | — | I3:RNF-01, I3:RNF-07 | I4:RNF-02 | DEC-39 | RNF-08-AC-1 a RNF-08-AC-3 (3) |
| RNF-09 | RNF | I1:RNF-05 | — | I3:RNF-06, I3:RNF-10 | — | DEC-40 | RNF-09-AC-1 (1) |
| RNF-10 | RNF | I1:RNF-10 | — | — | — | DEC-24 | RNF-10-AC-1 (1) |
| RNF-11 | RNF | — | I2:RNF-15 | — | — | DEC-43, DEC-42 | RNF-11-AC-1 a RNF-11-AC-3 (3) |
| RNF-12 | RNF | I1:RNF-11 | — | I3:RNF-05 | — | DEC-66 | RNF-12-AC-1 a RNF-12-AC-2 (2) |
| RNF-13 | RNF | I1:RNF-03 | — | — | — | DEC-67 | RNF-13-AC-1 (1) |
| RNF-14 | RNF | — | I2:RNF-13 | — | — | DEC-68 | RNF-14-AC-1 (1) |
| RD-01 | RD | I1 §3 | I2 §1.3 | I3:RD-01 | I4 §1.3 | Consenso | — (regla) |
| RD-02 | RD | I1:RD-02 | — | — | — | DEC-07 | — (regla) |
| RD-03 | RD | I1:RD-03 | — | — | — | DEC-07 | — (regla) |
| RD-04 | RD | I1:RD-04 | — | I3:RF-04 | — | DEC-13, DEC-80 | — (regla) |
| RD-05 | RD | I1:RD-05 | — | I3 §1.3 | I4:RD-02 | Consenso | — (regla) |
| RD-06 | RD | — | I2:RF-04 (b) | I3:RF-04 | I4:RD-01 | Consenso | — (regla) |
| RD-07 | RD | I1:RD-06 | — | I3:RD-04 | — | DEC-75 | — (regla) |
| RD-08 | RD | — | — | I3:RD-10 | — | DEC-05 | — (regla) |
| RD-09 | RD | — | — | I3:RD-11 | — | DEC-05 | — (regla) |
| RD-10 | RD | I1:RD-07 | — | I3:RD-03 | — | DEC-21 | — (regla) |
| RD-11 | RD | — | — | I3 §2.3, §3.1.1 | — | DEC-34, DEC-20, DEC-35, DEC-37, DEC-62 | — (regla) |
| RD-12 | RD | — | I2:RD-04 | — | — | DEC-76 | — (regla) |
| RD-13 | RD | I1:RD-01 | I2:RF-11 | I3:RD-05 | I4:RD-03, I4:RD-06 | Consenso; DEC-30 | — (regla) |
| RD-14 | RD | I1 §10 | I2:RD-02 | I3:RD-06 (acuerdos) | I4 §2.4 | Consenso; DEC-23, DEC-58 | — (regla) |
| RD-15 | RD | — | I2:RNF-04 (primera parte) | I3:RD-02 | I4:RD-04 | Consenso; DEC-36, DEC-65, DEC-78 | — (regla) |
| RD-16 | RD | I1:RD-11 | I2:RD-01 | — | — | DEC-37 | — (regla) |
| RD-17 | RD | I1:RF-55-AC-2 | — | I3:RD-09 | — | DEC-77 | — (regla) |
| RD-18 | RD | — | I2:RD-06, I2 Apéndice C | — | — | DEC-38 | — (regla) |

---

### 10. Correspondencia de numeración

Las decisiones históricas DEC-01 a DEC-81 y las secciones 1.1 a 1.8 de `matriz_correspondencia.md` usan la numeración **provisional**. DEC-82 a DEC-88 ya usan los IDs definitivos. Esta tabla permite interpretar las decisiones anteriores sin modificar `decisiones_equipo.md`. El cuerpo de este documento usa solo los IDs definitivos.

| ID provisional | ID definitivo |
|---|---|
| RF-01 (provisional) | RF-01 |
| RF-02 (provisional) | RF-02 |
| RF-03 (provisional) | RF-03 |
| RF-04 (provisional) | RF-04 |
| RF-05 (provisional) | RF-05 |
| RF-06 (provisional) | RF-06 |
| RF-07 (provisional) | RF-07 |
| RF-08 (provisional) | RF-08 |
| RF-09 (provisional) | RF-09 |
| RF-10 (provisional) | RF-10 |
| RF-11 (provisional) | RF-11 |
| RF-12 (provisional) | RF-12 |
| RF-13 (provisional) | RF-14 |
| RF-14 (provisional) | RF-16 |
| RF-15 (provisional) | RF-17 |
| RF-16 (provisional) | RF-19 |
| RF-17 (provisional) | RF-20 |
| RF-19 (provisional) | RF-22 |
| RF-20 (provisional) | RF-23 |
| RF-21 (provisional) | RF-24 |
| RF-22 (provisional) | RF-25 |
| RF-23 (provisional) | RF-26 |
| RF-24 (provisional) | RF-28 |
| RF-25 (provisional) | RF-29 |
| RF-26 (provisional) | RF-30 |
| RF-27 (provisional) | RF-31 |
| RF-28 (provisional) | RF-34 |
| RF-29 (provisional) | RF-37 |
| RF-30 (provisional) | RF-38 |
| RF-31 (provisional) | RF-39 |
| RF-32 (provisional) | RF-40 |
| RF-33 (provisional) | RF-41 |
| RF-34 (provisional) | RF-42 |
| RF-35 (provisional) | RF-43 |
| RF-36 (provisional) | RF-44 |
| RF-37 (provisional) | RF-45 |
| RF-38 (provisional) | RF-46 |
| RF-39 (provisional) | RF-47 |
| RF-40 (provisional) | RF-49 |
| RF-41 (provisional) | RF-50 |
| RF-42 (provisional) | RF-52 |
| RF-43 (provisional) | RF-53 |
| RF-44 (provisional) | RF-54 |
| RF-45 (provisional) | RF-13 |
| RF-46 (provisional) | RF-15 |
| RF-47 (provisional) | RF-21 |
| RF-48 (provisional) | RF-18 |
| RF-49 (provisional) | RF-27 |
| RF-50 (provisional) | RF-36 |
| RF-51 (provisional) | RF-35 |
| RF-52 (provisional) | RF-32 |
| RF-53 (provisional) | RF-33 |
| RF-54 (provisional) | RF-48 |
| RF-55 (provisional) | RF-51 |
| RF-18 (provisional, sugerencia de visita) | Sin ID definitivo: pasó a FP-23 (DEC-71) |
| — (creado en DEC-85 con ID definitivo) | RF-55 |
| — (creados en DEC-86 y DEC-87 con ID definitivo) | PV-12, PV-13 |
| RNF-01 a RNF-14 | Sin cambio |
| RD-01 a RD-18 | Sin cambio |
| RE-01 a RE-09 | Sin cambio |
| FP-01 a FP-23 | Sin cambio |
| PV-06 (provisional) | PV-01 |
| PV-08 (provisional) | PV-02 |
| PV-09 (provisional) | PV-03 |
| PV-11 (provisional) | PV-04 |
| PV-12 (provisional) | PV-05 |
| PV-20 (provisional) | PV-06 |
| PV-29 (provisional) | PV-07 |
| PV-31 (provisional) | PV-08 |
| PV-35 (provisional) | PV-09 |
| PV-38 (provisional) | PV-10 |
| PV-39 (provisional) | PV-11 |

---

### 11. Resumen cuantitativo

| Elemento | Total |
|---|---|
| Requerimientos funcionales (RF) del MVP | 55 |
| Requerimientos no funcionales (RNF) | 14 |
| Reglas de negocio y dominio (RD) | 18 |
| Restricciones y decisiones de alcance (RE) | 9 |
| Funcionalidades posteriores al MVP (FP) | 23 |
| Pendientes abiertos (PV) | 13 |
| Criterios de aceptación de RF | 183 |
| Criterios de aceptación de RNF | 22 |
| **Total de criterios de aceptación** | **205** |
| Decisiones del equipo que sustentan el documento | 88 (DEC-01 a DEC-88) |
