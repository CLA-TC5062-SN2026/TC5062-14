# Consolidación del diagrama de clases — UnCalificado

**Actividad:** S05_S06_A1, paso 3 · **Fecha:** 25 de octubre de 2026
**Resultado:** `diagrama_clases_equipo.puml` (detalle; 41 clases al consolidar y 43 tras sincronizarlo con `esquema_bd.sql` v1.2, ver `05_base_datos/revision_sql.md` §6) y `diagrama_clases_equipo_vista_general.puml` (vista sin atributos), con sus `.png`.

Este documento compara los diagramas de clases del dominio de los cuatro integrantes. Clasifica cada clase en consenso, gap o conflicto, resuelve cada conflicto y define el modelo único del equipo. Ese modelo es el **insumo directo del esquema de base de datos de la Parte 1**, por eso la §7 incluye su correspondencia con tablas.

## 1. Insumos

| Integrante | Archivo | Notación | Clases | Enumeraciones | Rasgos distintivos |
|---|---|---|---|---|---|
| David | `01_insumos/david/diagrama_clases.mmd` | Mermaid | 14 | — | Modelo compacto. Separa `Cuenta` de los perfiles `Cliente` y `Proveedor`. Incluye `Autorizacion` y `EventoAuditoria`. |
| Israel | `01_insumos/israel/diagrama_clases.puml` | PlantUML | 37 | 4 | Derivado del contrato y de `schema.sql`. Usa objetos de valor y marca en verde lo implementado. |
| Jesús | `01_insumos/jesus/diagrama_clases.puml` | PlantUML | 15 | 3 | Atributos técnicos de almacenamiento (`objectKey`, `mimeType`). Bitácora encadenada por `eventoAnteriorId`. |
| Norman | `01_insumos/norman/diagrama_clases.puml` | PlantUML | 30 | — | Jerarquía `Usuario` ← `Cliente`/`Proveedor`/`Administrador`. Separa `Propuesta` de `VersionPropuesta`. Agrega `Contrapropuesta`, `SolicitudCierre` y `RevelacionDomicilio`. |
| **Equipo** | `03_diagrama_clases/diagrama_clases_equipo.puml` | PlantUML | **41** (37 entidades y 4 objetos de valor) | 4 visibles | Ver §3 |

## 2. Método

1. **Inventario.** Se listaron, por integrante, las clases con sus atributos, tipos y multiplicidades, y las relaciones con su tipo: herencia, composición, agregación, asociación y dependencia.
2. **Emparejamiento por concepto.** Se agruparon las clases que representan el mismo concepto del SRS aunque tengan otro nombre, por ejemplo `Proyecto`, `Solicitud` y `SolicitudTrabajo`.
3. **Clasificación de cada concepto:**
   - **Consenso:** dos o más integrantes lo modelan con atributos y relaciones compatibles; las diferencias solo agregan información y no se contradicen.
   - **Gap:** solo un integrante lo modela. Se adopta si un requerimiento del SRS lo necesita; si no, se descarta.
   - **Conflicto:** la misma clase aparece con **atributos** distintos (nombre, tipo o ubicación) o con **relaciones** distintas (tipo, multiplicidad o clase destino), según la versión.
4. **Criterios de resolución,** en este orden:
   1. el SRS manda;
   2. el modelo debe poder llevarse a tablas sin ambigüedad (es el insumo de la Parte 1);
   3. consistencia con `openapi_equipo.yaml` (OA-G1: mismos nombres en español);
   4. mayoría;
   5. lo ya implementado en `schema.sql`.

## 3. Resumen de resultados

| Resultado | Clases del modelo del equipo |
|---|---|
| Consenso | 5 entidades (`Consentimiento`, `SolicitudArco`, `Franja`, `MensajeConversacion`, `RepresentacionVisual`) y 2 objetos de valor (`HorarioAtencion`, `Domicilio`) |
| Conflicto resuelto | 23 entidades y 2 objetos de valor (`Zona`, `DimensionesEvaluacion`) |
| Gap adoptado | 9 entidades: 6 de Israel y 3 de Norman |
| **Total** | **41 clases** |
| Descartadas o fusionadas | 7 (§4.4) |

En el diagrama, cada clase lleva un color: blanco para consenso, azul para conflicto resuelto, amarillo para gap adoptado y gris para objeto de valor.

## 4. Diferencias por concepto

Abreviaturas: **D** David · **I** Israel · **J** Jesús · **N** Norman.

### 4.1 Consenso

| Clase del equipo | D | I | J | N | Observación |
|---|---|---|---|---|---|
| `Consentimiento` | — | `Consentimiento` | (atributo `consentimientoVigente`) | `ConsentimientoPrivacidad` | I y N coinciden: cada aceptación de una versión del aviso es un registro (RF-02-AC-3). El atributo de J se deriva del último registro. |
| `SolicitudArco` | — | `SolicitudArco` | — | `SolicitudARCO` | Atributos complementarios: N aporta `derecho` y que la atiende el administrador; I aporta `fechaLimite` y `porVencer` (RF-54-AC-5). `porVencer` queda como atributo derivado. |
| `Franja` | — | `Franja` | `Set<Franja>` en `Disponibilidad` | — | Bloques de tiempo no disponibles (RF-06). |
| `MensajeConversacion` | (`Mensaje`, mezclado) | `MensajeConversacion` | — | `MensajeConversacion` | Ver DC-06. |
| `RepresentacionVisual` | — | `RepresentacionVisual` | — | `RepresentacionVisual` | Se adopta la asociación de N con las imágenes de referencia (RF-23). |
| `HorarioAtencion` «valor» | — | `HorarioAtencion` | — | atributo `horarioAtencion` | El mismo dato en I y N; se modela como objeto de valor. |
| `Domicilio` «valor» | — | `Domicilio` | — | tipo `Domicilio` | Se usa para el domicilio del trabajador (RF-53) y el del cliente (RF-52). |

### 4.2 Conflictos

| # | Clase del equipo | D | I | J | N | Tipo | Decisión |
|---|---|---|---|---|---|---|---|
| 1 | `Usuario` | `Cuenta` y `Cliente` | `Usuario` (rol con 4 valores) | `Usuario` (rol con 3 valores) | `Usuario` abstracta ← `Cliente`, `Proveedor`, `Administrador` | relaciones (herencia contra asociación), atributos (`estado` contra `activo`) | DC-01 |
| 2 | `Proveedor` y sus subclases | `Proveedor` ← `Trabajador`, `Organizacion` | `PerfilProveedor` ← `PerfilTrabajador`, `PerfilOrganizacion` | `Proveedor` ← `TrabajadorIndependiente`, `OrganizacionContratistas` | `Proveedor` (subclase de `Usuario`) y `PerfilProveedor` 1-1 | nombres, ubicación de atributos (`oficio`, `experienciaAnios`, `nombre`), relación con `Usuario` | DC-02 |
| 3 | `Disponibilidad` | atributo `disponible : bool` | clase; `disponibilidadGeneral` es enumeración | clase | atributos en las subclases; `disponibilidadGeneral` es texto | atributos (tipo y ubicación) | DC-03 |
| 4 | `Verificacion` | atributo `verificacion` del proveedor | clase con 5 estados (incluye `pendiente` y `vencida`) | clase | clase con 3 estados; asociación «solicita»; resuelta por `Administrador` | atributos (estados), relaciones (composición contra asociación) | DC-04 |
| 5 | `Solicitud` | `Proyecto` | `Solicitud` (`origen`, `medidas`, `materiales`) | `Solicitud` | `SolicitudTrabajo` (`modoCaptura`, `domicilioExacto`) | nombres, atributos, destino de «proveedor asociado» (`Usuario` en I; `Proveedor` en los demás) | DC-05 |
| 6 | `Conversacion` | (`Mensaje` en `Proyecto`) | `Conversacion` 0..1 con la solicitud | — | `ConversacionAgente` del cliente; cada mensaje se refiere a una solicitud | nombres de los contadores, relaciones | DC-06 |
| 7 | `MensajeCanal` | `Mensaje` (compartido con el agente) | `MensajeCanal` con `emisorRol` | `Mensaje` con emisor `Usuario` | `MensajeProyecto` con emisor `Usuario` | nombres; emisor como atributo o como asociación | DC-06 |
| 8 | `CasoSoporte` | — | `CasoSoporte` (`motivo`, `estado`, `notas`) | — | `SolicitudSoporte` (`origen`) | nombre y atributos | DC-06 |
| 9 | `Adjunto` | `Archivo` (`rutaPrivada`) | `Adjunto` (sin clave de almacenamiento), 0..10 | `Archivo` (`objectKey`, `propietarioId`) | `ArchivoMultimedia` (`tamanoMB`) | nombres, atributos, multiplicidad | DC-07 |
| 10 | `Propuesta` y `VersionPropuesta` | `Propuesta` con `version` | `Propuesta` con `version` y autoasociación «revisa» | `Propuesta` con `version` | `Propuesta` ◆ 1..* `VersionPropuesta` | estructura de versiones | DC-08 |
| 11 | `ConceptoPropuesta` y `MaterialPropuesta` | — | dos clases independientes | `Material` (en el contrato) | `ConceptoPropuesta` con `categoria` | relaciones (independencia contra herencia) | DC-08 |
| 12 | `VersionPresupuesto` | — | de `Solicitud`, 1..* | de `Propuesta` ◆ 1..*; muchos a muchos con `Cambio` | de `Solicitud`; 0..1 con el cambio | clase dueña, multiplicidad con `Cambio`, nombres de atributos | DC-09 |
| 13 | `Cambio` | de `Propuesta` (`deltaCosto`); → `Autorizacion` | de `Solicitud` (`montoAdicional`, `presupuestoActualizado`) | de `Solicitud` (`diferenciaMxn`) | `SolicitudCambio` (`montoAjuste`) ◆ `Contrapropuesta` | clase dueña, nombres y atributos | DC-10 |
| 14 | `ConjuntoRecomendaciones` y `Recomendacion` | — | conjunto ◆ 0..4 recomendaciones | (en el contrato) | `Recomendacion` → 1..4 `Proveedor`, con `explicaciones[1..4]` | estructura y multiplicidad | DC-11 |
| 15 | `Invitacion` | (asociación «elegido») | `Invitacion` | — | `SeleccionProveedor` | nombre y atributos | DC-14 |
| 16 | `Cita` | `aceptaCliente` y `aceptaProveedor : bool` | marcas de tiempo de confirmación; `tipo` enumerado | `esVisita : bool`; `costoMxn` | `fechaHora` única; `tipo` | atributos (tipos y nombres) | DC-14 |
| 17 | `RegistroBitacora` | `EventoAuditoria` (`tipo`) | `RegistroBitacora` (`hashEncadenado`) | `BitacoraEvento` (`actorId`, `eventoAnteriorId`) | `RegistroBitacora` → autor, versión y cambio | nombres, encadenamiento, clase dueña | DC-12 |
| 18 | `Evaluacion` y `DimensionesEvaluacion` | `calificacion` única; 0..2 | `direccion` y objeto de valor con las dimensiones; 0..2 | 4 dimensiones como atributos; sujeto `Proveedor` | `estadoSolicitud`, `calificacion [0..1]`; 0..* | atributos y destino «evaluado» | DC-13 |
| 19 | `Zona` «valor» | `string zona` | `Zona {municipio, colonia}` | tipo `Zona` | `ZonaAproximada` y `ZonaCobertura` | tipo del atributo | DC-05 |

### 4.3 Gaps adoptados

| Clase | Propuesta por | Requerimiento que la exige | Motivo |
|---|---|---|---|
| `AvisoPrivacidad` | I | RF-02-AC-3 | Una nueva versión del aviso obliga a aceptar de nuevo; la versión debe existir como dato. Ya está implementada. |
| `Notificacion` | I | RF-12, RF-32, RF-36, RF-48, RF-54-AC-5 | Los avisos con plazo («en menos de 1 minuto», «5 días antes») necesitan registro y estado de leída. |
| `FotoPortafolio` | I | RF-04 | Portafolio opcional con altas y bajas individuales. |
| `ResumenSolicitud` | I | RF-14-AC-5, RF-20 | Resumen editable y confirmado, con valores «desconocido» explícitos (no inventar). |
| `ModificacionCita` | I | RF-37 | Cancelación, cambio de fecha y retraso con su motivo, conservados en la historia. |
| `AnalisisIA` | I | RF-42 | Análisis informativo de la justificación de un cambio; no decide. |
| `Contrapropuesta` | N | RF-41-AC-6 a AC-8 | La contrapropuesta tiene sus propios términos, plazo de 24 h y estado (incluido «rechazada automáticamente»). |
| `SolicitudCierre` | N | RF-47-AC-2 a AC-4, RF-48 | La solicitud de cierre debe quedar registrada y visible, y conservar la descripción de pendientes. El aviso al administrador a las 72 h necesita su fecha. En la API se crea al hacer `PATCH /solicitudes/{id}/estado` hacia `terminado`. |
| `RevelacionDomicilio` | N | RF-52-AC-2 a AC-5, RF-24-AC-3 | Registra qué evento reveló el domicilio, a qué trabajador y hasta cuándo (conclusión + 7 días). |

### 4.4 Clases descartadas o fusionadas

| Clase | Propuesta por | Destino | Motivo |
|---|---|---|---|
| `Cliente` | D, N | Valor `cliente` de `Rol` | No tiene atributos propios: la zona de D pertenece a cada solicitud (DC-01). |
| `Administrador` | N | Valor `administrador` de `Rol` y atributo `segundoFactorActivo` | Su único atributo (`segundoFactor`) pasa a `Usuario` (RNF-11-AC-2) (DC-01). |
| `PerfilProveedor` (1-1 con `Proveedor`) | N | Se fusiona con `Proveedor` | Una composición 1-1 sin ciclo de vida propio solo agrega un JOIN (DC-02). |
| `Autorizacion` | D | Se registra en `RegistroBitacora` | Igual que OA-25: aceptar o confirmar es la autorización (RF-24-AC-3); no hace falta una entidad aparte. |
| `Mensaje` (único) | D | Se divide en `MensajeConversacion` y `MensajeCanal` | Mezcla al agente con el canal entre las partes (DC-06, OA-13). |
| Atributo `modalidad` | I, J | Discriminador de la subclase | Repetía lo que ya expresa la herencia `TrabajadorIndependiente` / `OrganizacionContratistas`. |
| Atributo `nombre` de `Proveedor` | J | `Usuario.nombre` y `OrganizacionContratistas.nombreLegalOComercial` | Duplicaba datos de la cuenta. |

## 5. Decisiones de consolidación

| ID | Decisión | Justificación |
|---|---|---|
| **DC-01** | **`Usuario` concreto con `rol : Rol {cliente, trabajador, organizacion, administrador}`**, en lugar de la jerarquía `Usuario` ← `Cliente`/`Proveedor`/`Administrador` de N o del par `Cuenta`/`Cliente` de D. El proveedor se asocia como perfil `Usuario 1 — 0..1 Proveedor`. `estado : EstadoCuenta {activa, inactiva, anonimizada}` sustituye al booleano `activo` de I. | `Cliente` y `Administrador` no tienen datos propios. Heredar de `Usuario` obligaría a una tabla por subclase sin columnas. El rol de una cuenta no cambia, y el JWT ya lleva el claim `rol` con esos cuatro valores. El estado `anonimizada` es necesario para RF-54-AC-3, y un booleano no puede expresarlo. Criterios 2, 3 y 5. |
| **DC-02** | **`Proveedor` abstracto ← `TrabajadorIndependiente` y `OrganizacionContratistas`.** Los cuatro integrantes usan herencia; se toman los nombres de J y N, que son los actores del SRS. En `Proveedor` quedan `oficios [1..*]`, `cobertura : Zona [1..*]`, `garantia` y `rangoPrecioReferencia`. En el trabajador quedan `foto`, `aniosExperiencia` y `domicilio`; en la organización, `nombreLegalOComercial` y `representanteContacto`. | RF-03 pide «uno o más oficios» y la cobertura como «colonias que atiende» (RD-04), así que ambos atributos son multivaluados y estructurados. La experiencia solo se exige al trabajador (RF-03-AC-1, frente a RF-05). La relación con `Usuario` es asociación, como proponen D, I y J (criterio 4). |
| **DC-03** | **`Disponibilidad` como clase compuesta del proveedor**, con `fechasNoDisponibles` y franjas para el trabajador y `disponibilidadGeneral : {aceptando_proyectos, sin_capacidad}` para la organización. | RF-06-AC-3 da dos ejemplos y exige que la disponibilidad «se refleje en las búsquedas». Un texto libre (N) no puede filtrarse de forma confiable, y un booleano (D) no distingue la fecha. Si en el piloto surgen otros valores, se amplía la enumeración. Criterios 1 y 2. |
| **DC-04** | **`Verificacion` 0..* compuesta del proveedor**, con `estado {pendiente, aprobada, rechazada, retirada}`. El vencimiento del documento es un **retiro** con `motivo = vencimiento`, y queda la asociación `resueltaPor` → `Usuario` (administrador). | N señala que el SRS no define un estado «en revisión», pero la bandeja del administrador (`GET /verificaciones`) necesita distinguir lo que todavía no se resuelve: se conserva `pendiente`, propuesto por I. `vencida` (I) se elimina porque RF-12 trata el vencimiento como retiro. La composición sigue a I y J: sin proveedor, la verificación no existe. |
| **DC-05** | **`Solicitud`** (OA-G1), con `modoCaptura {agente, manual}` (de N; I lo llamaba `origen`), `zonaAproximada : Zona`, `oficio [0..1]` y `tipoTrabajo [0..1]` (de N), `domicilioExacto [0..1]` y el objeto de valor `ResumenSolicitud`. La asociación `proveedorAsociado` apunta a `Proveedor` y se fija al aceptar la invitación (RF-32-AC-4). | `oficio` admite 0..1 porque la clasificación puede fallar (RF-15). `Zona {municipio, colonia}` es el mismo tipo que la cobertura del proveedor, y eso hace posible la comparación de RF-26 y RD-04. Se guarda la asociación con el proveedor (I la apuntaba a `Usuario`; N la derivaba) porque todas las reglas de autorización de RNF-04 la consultan. |
| **DC-06** | **Tres clases separadas** para la comunicación: `Conversacion` y `MensajeConversacion` (agente), `MensajeCanal` (entre las partes, con emisor `Usuario`) y `CasoSoporte` (soporte humano). `Usuario 1 — 0..* Conversacion` (de N) y `Conversacion 0..1 → 0..1 Solicitud` «genera» (de I). | Mismo criterio que OA-13: distintos participantes, reglas y retención (RNF-07). El emisor como asociación (J y N) permite auditar quién escribió; `emisorRol` (I) se deriva del emisor. `CasoSoporte` toma el nombre ya implementado y ganó la asociación opcional con la conversación, porque el soporte se ofrece antes de que exista una solicitud (RF-22-AC-1). |
| **DC-07** | **`Adjunto`** con `claveAlmacenamiento` (de D y J; faltaba en I), `mime`, `tamanoBytes` y `esDelDomicilio`, con la restricción `{máx. 10 imágenes}` en la composición. | El binario vive fuera de la base de datos y la fila guarda su clave. `esDelDomicilio` es necesario para RF-52-AC-1: el trabajador no ve las fotos del domicilio antes de la revelación. El límite viene de RF-18 (máximo 10 imágenes por proyecto); la multiplicidad 0..10 de I no consideraba los videos. |
| **DC-08** | **`Propuesta` ◆ 1..* `VersionPropuesta` ◆ 1..* `ConceptoPropuesta`**, tomado de N. `MaterialPropuesta` **hereda** de `ConceptoPropuesta` y agrega `cantidad`, `unidad` y `precioUnitario`. | La propuesta representa la negociación con un proveedor: estado, emisor y plazo de 72 h. Cada revisión trae su propio desglose y total, y RF-39-AC-2 exige que ambas partes acepten *la misma versión*. Con una fila por versión (D, I y J), el plazo y el proveedor se duplican en cada fila. Este modelo coincide con OA-20 (`POST /propuestas/{id}/versiones`). La herencia permite validar en un solo lugar los subtotales que suman el total (RF-38-AC-2) y exigir los campos extra solo a los materiales. |
| **DC-09** | **`VersionPresupuesto` pertenece a `Solicitud`.** La primera versión apunta a la `VersionPropuesta` aceptada y las siguientes a un `Cambio` aceptado (0..1 con 0..1). `esInicial` es un atributo derivado (`numero = 1`). | El historial de presupuesto (RF-43) abarca la propuesta y todos los cambios posteriores, así que no puede colgar de una sola propuesta como en J. La relación muchos a muchos de J no tiene sustento: cada cambio aceptado produce exactamente una versión. |
| **DC-10** | **`Cambio` pertenece a `Solicitud`** (de I, J y N), con `iniciadoPor`, `montoAjuste` (con signo), `venceEn` y `parteAfectadaEnPausa`. Compone a `Contrapropuesta` (N) y a `AnalisisIA` (I). Se elimina `presupuestoActualizado`, que se deriva de `VersionPresupuesto`. | RF-55 permite que el cliente inicie un cambio aun sin que se haya modificado una propuesta concreta, así que el dueño de un cambio de alcance es el proyecto y no la propuesta (D). |
| **DC-11** | **`ConjuntoRecomendaciones` ◆ 1..4 `Recomendacion`**, con `posicion` y `explicacion`, y cada recomendación → 1 `Proveedor`. | Cada proveedor sugerido tiene su propia explicación, que es un atributo del vínculo; el arreglo paralelo `explicaciones[1..4]` de N pierde esa correspondencia. `posicion` hace auditable el orden independiente de pagos (RNF-10). La multiplicidad 1..4 sigue a N y a RF-30 («al menos 1»): sin candidatos no se genera conjunto y la API responde 409. Esto corrige el 0..4 de I. |
| **DC-12** | **`RegistroBitacora`** compuesto por `Solicitud` (D y J), con `decision`, `fecha`, `hashEncadenado` (I) y la autoasociación `anterior` (J). Se asocia al autor y, opcionalmente, a la `VersionPropuesta` o al `Cambio` decidido (N e I). | RNF-12 exige una bitácora inalterable: el hash encadenado detecta alteraciones y el vínculo con el registro anterior permite recorrer la cadena. Según RD-17, la bitácora sobrevive a la anonimización: el autor se conserva como ID anonimizado. |
| **DC-13** | **`Evaluacion` 0..2 por solicitud** (una por dirección), con `estado {pendiente, registrada, publicada, vencida}`, `calificacion [0..1]` y el objeto de valor `DimensionesEvaluacion` solo para la dirección cliente → proveedor. «Evaluado» apunta a `Usuario`. | RF-51-AC-1 crea la *solicitud* de calificación al concluir, y RF-51-AC-4 la vence a los 7 días. N modela la solicitud y la evaluación como un mismo objeto, y así se adopta. Las cuatro dimensiones solo aplican a RF-49; RF-50 usa una calificación única, por eso el objeto de valor es opcional (I) en lugar de cuatro atributos obligatorios (J). El proveedor también evalúa al cliente, así que «evaluado» no puede ser solo `Proveedor` (J). |
| **DC-14** | **`Invitacion`** (no `SeleccionProveedor`), con `enviadaEn`, `venceEn` y `respondidaEn`. **`Cita`** con `tipo : TipoCita {visita_valoracion, ejecucion}`, `inicio` y `fin`, `costo : Dinero [0..1]` (nulo significa sin costo), `confirmadaPorProveedorEn` y `confirmadaPorClienteEn` y `expiraEn`. | Mismo nombre que el contrato (OA-10). Para la doble confirmación de RF-34, las marcas de tiempo valen más que los booleanos de D: indican quién confirmó y cuándo, y el booleano se deriva. Una enumeración (`tipo`) admite más tipos en el futuro sin cambiar el esquema, a diferencia de `esVisita` (J). |
| **DC-15** | **`RevelacionDomicilio`** (N) compuesta por la solicitud, con `disparador {propuesta_aceptada, visita_confirmada}`, `reveladoEn` y `/accesoHasta` (derivado: conclusión + 7 días), y la asociación → `TrabajadorIndependiente`. | Es la forma verificable de RF-52-AC-2 a AC-5 y de RF-24-AC-3. El domicilio agregado de I solo decía *qué* se revela, no *a quién* ni *hasta cuándo*. N anota, y se conserva como pendiente para el PO, que el SRS no define la revelación para organizaciones. |

## 6. Coherencia con `openapi_equipo.yaml`

| Clase del dominio | Esquema del contrato | Estado |
|---|---|---|
| `Usuario` | `Cuenta` | Distinto nombre a propósito: `Cuenta` es la vista pública del usuario, sin `contrasenaHash` ni `segundoFactorActivo`. |
| `Proveedor` y sus subclases | `PerfilPropio`, `PerfilProveedorPublico`, `PerfilTrabajadorRequest`, `PerfilOrganizacionRequest` | Vistas (DTO) de la misma jerarquía. |
| `Propuesta` y `VersionPropuesta` | `Propuesta` (negociación) y `VersionPropuesta` | Alineados en `openapi_equipo.yaml` v1.1.0 (DC-08; ver `05_base_datos/revision_sql.md` §6). |
| `Contrapropuesta` | `DecisionCambioRequest` (decisión `contraproponer`) | La contrapropuesta llega en la respuesta al cambio y se guarda como entidad. |
| `SolicitudCierre` | `PATCH /solicitudes/{id}/estado` | La transición a `terminado` crea la entidad, y la respuesta del cliente la completa (OA-16). |
| `RevelacionDomicilio` | `GET /solicitudes/{id}/domicilio` | La API devuelve el domicilio o solo colonia y municipio, según la revelación vigente. |
| Las demás clases | Esquema con el mismo nombre | Alineadas (OA-G1). |

## 7. Insumo para el esquema de base de datos (Parte 1)

Reglas de transformación propuestas para MySQL 8:

1. **Entidad con `id`** → una tabla en plural y snake_case (`solicitudes`, `versiones_propuesta`). La composición se convierte en una llave foránea `NOT NULL` con `ON DELETE CASCADE`; la asociación, en una llave foránea con `ON DELETE RESTRICT` o `SET NULL`, según su multiplicidad mínima.
2. **Herencia `Proveedor`** → una tabla por clase: `proveedores` con la llave hacia `usuarios`, más `trabajadores_independientes` y `organizaciones_contratistas`, cada una con PK que también es FK. `ConceptoPropuesta`/`MaterialPropuesta` → una sola tabla `conceptos_propuesta` con las columnas de material como nulables, porque la subclase solo agrega tres columnas.
3. **Objetos de valor** (`Zona`, `Domicilio`, `HorarioAtencion`, `DimensionesEvaluacion`, `ResumenSolicitud`) → columnas embebidas con prefijo (`domicilio_calle`, `zona_municipio`). Cuando son multivaluados (`Proveedor.cobertura`, `Proveedor.oficios`) → tablas puente (`proveedor_zonas`, `proveedor_oficios`).
4. **Enumeraciones** → columnas `ENUM`, salvo `Oficio`: es un catálogo ampliable (FP-11) y va como tabla `oficios`.
5. **Atributos derivados** (`/calificacionPromedio`, `/perfilCompleto`, `/porVencer`, `/accesoHasta`, `/esInicial`) → no se guardan; se resuelven con vistas o en la capa de servicios.
6. **Restricciones del diagrama** → `UNIQUE (solicitud_id, direccion)` en `evaluaciones` (0..2); `UNIQUE (propuesta_id, numero)` en `versiones_propuesta`; `CHECK` de 1 a 5 en las calificaciones; el máximo de 10 imágenes se valida en la capa de servicios.
7. **Tablas ya existentes** en `schema.sql` (`usuarios`, `avisos_privacidad`, `consentimientos`, `solicitudes`, `casos_soporte`): se conservan. Los cambios que pide el modelo son:
   - en `usuarios`: agregar `telefono`, `estado` y `segundo_factor_activo`;
   - en `solicitudes`: agregar `modo_captura`, `zona_*` y `domicilio_*`;
   - en `casos_soporte`: agregar `conversacion_id`.

## 8. Pendientes para el equipo

- Validar DC-01 (rol como atributo) con Norman y DC-08 (propuesta con versiones) con David, Israel y Jesús, porque contradicen su versión individual.
- Preguntar al PO si la revelación del domicilio aplica a las organizaciones (DC-15).
- ~~Ajustar el esquema `Propuesta` del contrato~~: hecho en `openapi_equipo.yaml` v1.1.0.
