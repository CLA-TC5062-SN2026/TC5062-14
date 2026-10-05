# Especificación de Requerimientos de Software (SRS) — UnCalificado

## 1. Introducción

### 1.1 Propósito del documento

El propósito de este documento es especificar los requerimientos de software del sistema **UnCalificado**, a partir de las necesidades identificadas durante el proceso de elicitación realizado con un agente de IA en el rol de stakeholder ficticio y con un stakeholder real.

Este SRS establece el alcance funcional de la primera versión del sistema, los requerimientos funcionales, no funcionales y de dominio, así como los criterios de aceptación que permitirán verificar posteriormente su cumplimiento.

Los criterios de aceptación se presentan en formato **Given-When-Then** y cuentan con identificadores únicos para mantener la trazabilidad de los requerimientos durante las siguientes etapas de diseño, desarrollo y pruebas.

### 1.2 Alcance del sistema

**UnCalificado** será una plataforma orientada a facilitar la búsqueda y selección de trabajadores de oficio y prestadores de servicios, como albañiles, carpinteros, electricistas, plomeros y otros perfiles similares.

El problema identificado durante la elicitación es que actualmente la contratación de este tipo de servicios depende frecuentemente de recomendaciones personales, números telefónicos, mensajes de WhatsApp u otros medios informales. Esto puede dificultar la localización de trabajadores disponibles y genera incertidumbre respecto a su identidad, experiencia, cumplimiento y calidad del servicio.

La plataforma permitirá que un cliente describa el trabajo que necesita realizar y proporcione información como tipo de servicio, ubicación, medidas, fotografías y materiales. A partir de esta información, el sistema podrá mostrar trabajadores compatibles considerando factores como oficio, ubicación, disponibilidad, experiencia, evaluaciones y precio o rango de costo cuando se encuentre disponible.

El cliente podrá consultar información del trabajador, seleccionarlo, acordar una fecha y horario para el servicio, consultar el avance del trabajo y evaluar el servicio una vez finalizado.

La primera versión se concentrará en la búsqueda, selección, seguimiento y evaluación de trabajadores. El procesamiento de pagos dentro de la plataforma, seguros y otras funciones financieras se consideran posibles ampliaciones posteriores y no forman parte del alcance inicial.

### 1.3 Definiciones y acrónimos

* **SRS:** Software Requirements Specification.
* **RF:** Requerimiento Funcional.
* **RNF:** Requerimiento No Funcional.
* **RD:** Requerimiento de Dominio.
* **BDD:** Behaviour-Driven Development.
* **Given-When-Then:** estructura utilizada para expresar criterios de aceptación verificables.
* **Cliente:** persona que requiere contratar un trabajo o servicio.
* **Trabajador:** persona que ofrece uno o más servicios u oficios dentro de la plataforma.
* **Organización o contratista:** entidad que agrupa o administra trabajadores que ofrecen servicios.
* **Solicitud de servicio:** registro que contiene la necesidad expresada por el cliente y la información necesaria para buscar trabajadores compatibles.
* **Servicio:** trabajo solicitado por un cliente y asignado a un trabajador.
* **UnCalificado:** nombre tentativo del sistema especificado en este documento.

---

## 2. Descripción general

### 2.1 Perspectiva del producto

UnCalificado se plantea como una plataforma digital que centraliza información que actualmente suele encontrarse dispersa o depender de recomendaciones informales.

El sistema servirá como intermediario entre clientes que requieren un servicio y trabajadores u organizaciones que pueden realizarlo. Su función principal será facilitar que el cliente encuentre opciones compatibles con su necesidad y pueda tomar una decisión con mayor información sobre la persona que realizará el trabajo.

La plataforma deberá mantener información estructurada sobre solicitudes, perfiles de trabajadores, especialidades, ubicación, disponibilidad, evaluaciones y estado de los servicios.

### 2.2 Funciones principales del producto

La primera versión de UnCalificado deberá permitir:

1. Registrar una solicitud de servicio.
2. Capturar información y evidencia relacionada con el trabajo solicitado.
3. Consultar un catálogo de trabajadores.
4. Consultar el perfil de un trabajador.
5. Buscar trabajadores compatibles con una solicitud.
6. Generar recomendaciones de trabajadores.
7. Seleccionar a un trabajador.
8. Gestionar la fecha y horario de un servicio.
9. Dar seguimiento al estado del trabajo.
10. Evaluar el servicio y al trabajador una vez concluido.
11. Registrar información profesional de trabajadores y organizaciones de contratistas.
12. Proteger información privada relacionada con clientes y servicios.

### 2.3 Características de los usuarios

#### Cliente

Usuario que requiere realizar un trabajo y busca un trabajador adecuado. Debe poder describir su necesidad de manera sencilla, consultar opciones, seleccionar un trabajador, revisar el seguimiento del servicio y evaluar el resultado.

No se espera que el cliente tenga conocimientos técnicos especializados, por lo que la interacción deberá utilizar lenguaje comprensible y evitar procesos innecesariamente complejos.

#### Trabajador

Usuario que ofrece servicios asociados a uno o más oficios. Su perfil deberá contener información que permita identificarlo y conocer sus áreas de experiencia, disponibilidad y evaluaciones.

#### Organización o contratista

Entidad que puede registrar información relacionada con los servicios que ofrece y los trabajadores o especialidades que tiene disponibles.

### 2.4 Restricciones

* La primera versión no procesará pagos directamente dentro de la plataforma.
* Los seguros o garantías financieras asociadas al servicio quedan fuera del alcance inicial.
* El sistema no deberá mostrar públicamente información privada del cliente, como su dirección exacta o fotografías privadas relacionadas con su domicilio.
* Las fotografías proporcionadas para describir un servicio deberán utilizarse únicamente dentro del contexto necesario para atender la solicitud.
* Un trabajador solo deberá aparecer como opción cuando su oficio o especialidad sea compatible con el trabajo solicitado.
* La disponibilidad y ubicación deberán considerarse antes de presentar un trabajador como opción para un servicio.
* Las evaluaciones solo deberán asociarse a servicios registrados en la plataforma.

---

## 3. Requerimientos específicos

### 3.1 Requerimientos funcionales

### RF-01 — Registrar solicitud de servicio

El sistema deberá permitir al cliente registrar una solicitud indicando como mínimo el tipo de trabajo requerido y la ubicación general donde se realizará.

La solicitud podrá complementarse con una descripción, fotografías, medidas y materiales relacionados con el trabajo.

#### Criterios de aceptación

**RF-01-AC-1**

**Dado que** un cliente desea solicitar un servicio,
**cuando** proporciona el tipo de trabajo y la ubicación requerida y confirma el registro,
**entonces** el sistema deberá crear la solicitud y asignarle un identificador único.

**RF-01-AC-2**

**Dado que** el cliente se encuentra registrando una solicitud,
**cuando** agrega información complementaria como descripción, fotografías, medidas o materiales,
**entonces** el sistema deberá asociar esa información con la solicitud correspondiente.

---

### RF-02 — Consultar catálogo de trabajadores

El sistema deberá permitir al cliente consultar los trabajadores disponibles registrados en la plataforma y visualizar información general relacionada con los servicios que ofrecen.

#### Criterios de aceptación

**RF-02-AC-1**

**Dado que** existen trabajadores registrados y disponibles,
**cuando** el cliente consulta el catálogo,
**entonces** el sistema deberá mostrar los trabajadores disponibles y su oficio o especialidad.

**RF-02-AC-2**

**Dado que** el cliente consulta el catálogo,
**cuando** selecciona un oficio o tipo de servicio como criterio de búsqueda,
**entonces** el sistema deberá mostrar únicamente trabajadores asociados con ese criterio.

---

### RF-03 — Consultar perfil del trabajador

El sistema deberá permitir consultar el perfil de un trabajador antes de seleccionarlo. El perfil deberá mostrar información suficiente para identificarlo y evaluar su experiencia.

#### Criterios de aceptación

**RF-03-AC-1**

**Dado que** el cliente consulta un trabajador registrado,
**cuando** abre su perfil,
**entonces** el sistema deberá mostrar al menos su nombre, fotografía, oficio o especialidades y experiencia registrada.

**RF-03-AC-2**

**Dado que** un trabajador cuenta con evaluaciones de servicios anteriores,
**cuando** el cliente consulta su perfil,
**entonces** el sistema deberá mostrar las evaluaciones asociadas al trabajador sin revelar información privada de otros clientes.

---

### RF-04 — Buscar trabajadores compatibles

El sistema deberá buscar trabajadores compatibles con las características de una solicitud considerando al menos el tipo de trabajo, ubicación y disponibilidad.

#### Criterios de aceptación

**RF-04-AC-1**

**Dado que** existe una solicitud con un tipo de trabajo definido,
**cuando** el sistema realiza la búsqueda de trabajadores,
**entonces** deberá excluir a los trabajadores cuyo oficio o especialidad no corresponda al servicio solicitado.

**RF-04-AC-2**

**Dado que** existen varios trabajadores con la especialidad requerida,
**cuando** el sistema determina cuáles son compatibles,
**entonces** deberá considerar su ubicación y disponibilidad para el servicio solicitado.

---

### RF-05 — Generar recomendaciones de trabajadores

El sistema deberá presentar al cliente opciones de trabajadores compatibles considerando información relevante para apoyar su selección, incluyendo especialidad, ubicación, disponibilidad, experiencia, evaluaciones y precio o rango de costo cuando este dato se encuentre registrado.

#### Criterios de aceptación

**RF-05-AC-1**

**Dado que** existe una solicitud válida y existen trabajadores compatibles,
**cuando** el cliente solicita opciones para realizar el trabajo,
**entonces** el sistema deberá presentar trabajadores que cumplan con las condiciones principales de la solicitud.

**RF-05-AC-2**

**Dado que** se muestran trabajadores recomendados,
**cuando** el cliente consulta las opciones,
**entonces** deberá poder visualizar información relevante para compararlas, como experiencia, evaluación, disponibilidad y precio o rango de costo cuando esté disponible.

---

### RF-06 — Seleccionar trabajador

El sistema deberá permitir al cliente seleccionar a uno de los trabajadores compatibles para continuar con la gestión del servicio.

#### Criterios de aceptación

**RF-06-AC-1**

**Dado que** el cliente está consultando trabajadores compatibles,
**cuando** selecciona a un trabajador disponible,
**entonces** el sistema deberá asociarlo con la solicitud correspondiente.

**RF-06-AC-2**

**Dado que** un trabajador ya fue seleccionado para una solicitud,
**cuando** el cliente consulta dicha solicitud,
**entonces** el sistema deberá mostrar el trabajador asociado y el estado actual del servicio.

---

### RF-07 — Gestionar fecha y horario del servicio

El sistema deberá permitir registrar la fecha y horario acordados para realizar el servicio y gestionar cambios posteriores.

#### Criterios de aceptación

**RF-07-AC-1**

**Dado que** existe un trabajador seleccionado para una solicitud,
**cuando** se registra una fecha y horario válidos para el servicio,
**entonces** el sistema deberá guardar la programación asociada a la solicitud.

**RF-07-AC-2**

**Dado que** existe una fecha y horario previamente registrados,
**cuando** se realiza un cambio en la programación,
**entonces** el sistema deberá actualizar la fecha u horario y mantener registrada la modificación correspondiente.

---

### RF-08 — Dar seguimiento al estado del trabajo

El sistema deberá permitir consultar y actualizar estados que representen el avance del servicio desde su asignación hasta su finalización.

Como mínimo deberán distinguirse estados que permitan identificar que el servicio fue programado, que se encuentra en proceso y que fue terminado.

#### Criterios de aceptación

**RF-08-AC-1**

**Dado que** existe un servicio asociado a un trabajador,
**cuando** cambia una etapa válida del trabajo,
**entonces** el sistema deberá actualizar el estado del servicio y mostrarlo al cliente.

**RF-08-AC-2**

**Dado que** el trabajador registra el servicio como terminado,
**cuando** el cliente confirma que el trabajo fue concluido,
**entonces** el sistema deberá registrar el servicio como finalizado y habilitar su evaluación.

---

### RF-09 — Evaluar servicio y trabajador

El sistema deberá permitir que el cliente evalúe el servicio una vez finalizado, considerando aspectos relacionados con el cumplimiento del trabajo acordado.

#### Criterios de aceptación

**RF-09-AC-1**

**Dado que** un servicio se encuentra finalizado,
**cuando** el cliente registra una evaluación válida,
**entonces** el sistema deberá guardar la evaluación asociada al servicio y al trabajador correspondiente.

**RF-09-AC-2**

**Dado que** un servicio todavía no se encuentra finalizado,
**cuando** el cliente intenta evaluarlo,
**entonces** el sistema deberá impedir el registro de la evaluación e indicar que el servicio debe finalizar primero.

---

### RF-10 — Gestionar información profesional del trabajador u organización

El sistema deberá permitir registrar y mantener información relacionada con los servicios ofrecidos por trabajadores u organizaciones, incluyendo sus especialidades, experiencia, disponibilidad y datos relacionados con los trabajos que pueden realizar.

#### Criterios de aceptación

**RF-10-AC-1**

**Dado que** un trabajador u organización registra su información profesional,
**cuando** proporciona sus especialidades y servicios ofrecidos,
**entonces** el sistema deberá almacenar la información y asociarla con su perfil.

**RF-10-AC-2**

**Dado que** un trabajador u organización modifica información profesional previamente registrada,
**cuando** guarda los cambios,
**entonces** el sistema deberá actualizar su perfil y utilizar la información vigente en futuras búsquedas.

---

## 3.2 Requerimientos no funcionales

### RNF-01 — Usabilidad

El sistema deberá presentar una interfaz comprensible para usuarios sin conocimientos técnicos especializados y permitir que las funciones principales de solicitud, búsqueda, selección, seguimiento y evaluación puedan identificarse claramente.

**Categoría:** Usabilidad.

### RNF-02 — Rendimiento

Las consultas del catálogo, perfiles y resultados de búsqueda deberán responder en un tiempo máximo de **3 segundos** bajo condiciones normales de operación, sin considerar retrasos provocados por servicios externos.

**Categoría:** Rendimiento.

### RNF-03 — Seguridad y privacidad

El sistema deberá restringir el acceso a información privada del cliente, incluyendo dirección exacta y fotografías asociadas a una solicitud, de manera que solo pueda ser consultada por usuarios autorizados dentro del contexto del servicio correspondiente.

**Categoría:** Seguridad y privacidad.

### RNF-04 — Autenticación

Las funciones que permitan registrar solicitudes, seleccionar trabajadores, modificar información de servicios o registrar evaluaciones deberán requerir que el usuario se encuentre autenticado.

**Categoría:** Seguridad.

### RNF-05 — Integridad de la información

El sistema deberá conservar la relación entre cada solicitud, trabajador seleccionado, programación, seguimiento y evaluación, evitando que una evaluación o actualización de estado sea asociada a un servicio diferente.

**Categoría:** Integridad de datos.

### RNF-06 — Compatibilidad

La interfaz web deberá ser utilizable en las versiones vigentes de navegadores de escritorio y dispositivos móviles de uso común, manteniendo disponibles las funciones principales del sistema.

**Categoría:** Compatibilidad.

---

## 3.3 Requerimientos de dominio

### RD-01 — Compatibilidad del oficio

Un trabajador solo podrá ser presentado como opción compatible cuando al menos una de sus especialidades registradas corresponda con el tipo de servicio solicitado.

### RD-02 — Disponibilidad para el servicio

Un trabajador que no se encuentre disponible para atender un servicio en las condiciones de programación requeridas no deberá mostrarse como disponible para dicha programación.

### RD-03 — Evaluación posterior al servicio

Una evaluación solo podrá registrarse cuando exista un servicio asociado al cliente y al trabajador y dicho servicio haya sido marcado como finalizado.

### RD-04 — Protección de información del domicilio

La dirección exacta y las fotografías privadas proporcionadas para describir un trabajo no deberán formar parte de la información pública del cliente ni del catálogo general.

### RD-05 — Identificación del trabajador

El perfil mostrado al cliente deberá permitir identificar al trabajador mediante información básica y fotografía antes de que se concrete la realización del servicio.

### RD-06 — Correspondencia de la evaluación

Toda evaluación deberá permanecer asociada al servicio y trabajador que la originaron para evitar que una calificación sea atribuida a otro prestador de servicios.

---

## 4. Alcance de la primera versión

### 4.1 Funcionalidades incluidas

La primera versión de UnCalificado incluirá:

* Registro de solicitudes de servicio.
* Captura de información complementaria del trabajo.
* Catálogo de trabajadores.
* Consulta de perfiles.
* Búsqueda y recomendación de trabajadores compatibles.
* Selección de trabajador.
* Programación de fecha y horario.
* Seguimiento mediante estados del servicio.
* Evaluación posterior a la finalización del trabajo.
* Registro de especialidades e información profesional de trabajadores u organizaciones.
* Protección de información privada relacionada con el servicio.

### 4.2 Funcionalidades fuera del alcance inicial

Las siguientes funcionalidades se consideran posibles extensiones posteriores y **no forman parte de la primera versión**:

* Procesamiento de pagos dentro de UnCalificado.
* Gestión fiscal de pagos.
* Seguros asociados a los trabajos.
* Garantías financieras o mecanismos de apartado monetario.
* Penalizaciones económicas por cancelaciones o incumplimientos.
* Administración de reclamaciones financieras.

Estas funcionalidades se excluyen de la primera versión debido a que implican procesos adicionales de pagos, seguridad, cumplimiento fiscal y reglas de negocio que requieren un análisis específico.

---

## 5. Trazabilidad general

Los requerimientos funcionales `RF-01` a `RF-10` representan las principales capacidades identificadas durante la elicitación y se relacionan con los casos de uso documentados en `casos_de_uso.puml`.

Cada requerimiento funcional contiene criterios de aceptación identificados mediante el formato:

`RF-XX-AC-Y`

Estos identificadores deberán conservarse en las siguientes etapas del proyecto para permitir la trazabilidad entre requerimientos, diseño de API y pruebas.

---

## 6. Conclusión

Este documento define la especificación de la primera versión de **UnCalificado** a partir de las necesidades obtenidas durante la elicitación.

La especificación prioriza el problema principal identificado: facilitar que un cliente pueda localizar y seleccionar trabajadores de oficio con mayor información sobre su identidad, especialidad, disponibilidad, experiencia y evaluaciones, y posteriormente dar seguimiento al servicio realizado.

La delimitación del alcance permite concentrar la primera versión en la búsqueda, selección, programación, seguimiento y evaluación del servicio, dejando funciones de mayor complejidad financiera, como pagos, seguros y garantías monetarias, para fases posteriores del proyecto.
