# Revisión crítica de `esquema_bd.sql`

**Fecha:** 25 de octubre de 2026 · **Versión revisada:** v1.0 → v1.1 (revisión crítica, §1–§5) → **v1.2** (alineación con el contrato, §6)
**Rol del revisor:** revisor técnico independiente. Se partió de cero, sin dar por buena la generación anterior.
**Referencias:**
- modelo: `03_diagrama_clases/diagrama_clases_equipo.puml`;
- contrato: `02_openapi/openapi_equipo.yaml`;
- reglas de negocio: `S03_A1/SRS_equipo.md`.

## 1. Método

| Pregunta | Cómo se verificó |
|---|---|
| ¿Están todas las entidades? | Se listaron las 41 clases del diagrama y se buscó la tabla o las columnas embebidas de cada una. |
| ¿Están todos los atributos? | Un script cruzó cada atributo del `.puml` con las columnas reales de `information_schema` y revisó a mano los casos que no coincidían por nombre. |
| ¿Las FK reflejan las relaciones? | Se revisó cada relación del diagrama: tabla destino, multiplicidad, acción `ON DELETE` y si podía apuntar a un registro de **otro** proyecto. |
| ¿Los tipos coinciden con el contrato? | Un script extrajo todos los `maxLength`, `enum`, `pattern` y rangos de `openapi_equipo.yaml` y los comparó con las columnas. |
| ¿Faltan restricciones de negocio? | Se leyeron los criterios Dado/cuando/entonces de RF-03 a RF-55 buscando reglas que la base de datos pueda garantizar. |

Cada corrección se probó con un caso negativo en `probar_esquema.py`. Antes había 69 comprobaciones; ahora hay **93 de 93 correctas**: 43 inserciones válidas y 50 datos inválidos rechazados. El script corregido se volvió a cargar en MySQL 8.0.46 sin errores.

## 2. Respuestas a las preguntas de revisión

### 2.1 ¿Están representadas todas las entidades?

**Sí.** Las 37 entidades tienen tabla propia y los 4 objetos de valor (`Zona`, `Domicilio`, `HorarioAtencion`, `DimensionesEvaluacion`) están embebidos como columnas con prefijo. `ResumenSolicitud` (columnas `resumen_*`) y `Disponibilidad` (1-1, sin id) también se embebieron. Hay una tabla que no viene del diagrama, `documentos_verificacion`: la exige el contrato (`Verificacion.documentos`). Lo que sí estaba mal era la **multiplicidad** de una entidad (R-02).

### 2.2 ¿Están todos los atributos?

**Faltaban dos que el contrato expone**, y un atributo del diagrama tenía la opcionalidad equivocada:

- `ResumenSolicitud.requiereMateriales` y `RepresentacionVisual.esVersionReferencia` no tenían columna (R-03).
- `Solicitud.oficio` estaba como opcional (`[0..1]`) en el diagrama, pero RF-16-AC-1/AC-2 lo exige para guardar el borrador (R-04).

El cruce automático dejó 6 atributos sin coincidencia por nombre. Todos están cubiertos por diseño:
- `oficios`, `cobertura` y `fechasNoDisponibles` están en tablas puente;
- `rangoPrecioReferencia` está en `rango_precio_*`;
- `zonaAproximada` y `domicilioExacto` están en `zona_*` y `domicilio_*`.

### 2.3 ¿Las llaves foráneas reflejan las relaciones?

Las tablas destino eran correctas, pero había **cuatro tipos de defecto**:
1. **Multiplicidad:** `RevelacionDomicilio` estaba como 0..1 por solicitud y debe ser 0..* (R-02).
2. **Acciones `ON DELETE` incoherentes con la política de anonimizar en lugar de borrar** (R-09, R-12).
3. **Referencias cruzadas entre proyectos:** una bitácora o una versión de presupuesto podía apuntar al cambio de otro proyecto (R-10).
4. **Rol y subclase sin garantizar:**
   - un proveedor con `modalidad` distinta del rol de su cuenta;
   - un perfil de organización colgado de un proveedor trabajador;
   - una verificación «resuelta» por un cliente;
   - una solicitud creada por un trabajador (R-13, R-14).

### 2.4 ¿Los tipos son coherentes con el contrato?

**Casi.** Se corrigieron cinco discrepancias de longitud o estructura (R-06, R-07). Las columnas `ENUM` que tienen equivalente en el contrato (`Rol`, `Municipio`, `EstadoProyecto`, `TipoCita`, `EstadoCita`, `EstadoInvitacion`, `TipoCambio`, `EstadoCambio`, `EstadoPropuesta`, `Notificacion.tipo`, `CasoSoporte.motivo`/`estado`, `Adjunto.tipo`/`mime`, entre otras) coinciden valor por valor, salvo dos diferencias **intencionales**. Las demás, como el estado de la contrapropuesta o el disparador de la revelación, vienen del diagrama y no tienen enumeración en el contrato. Las dos diferencias son:
- `EstadoVerificacion` sin `vencida` (DC-04);
- el estado de la negociación en `propuestas` (R-08).

Ambas están en la lista de ajustes del contrato (`esquema_bd.md` §5).

### 2.5 ¿Faltan restricciones que el negocio requiere?

**Sí, varias.** El esquema v1.0 validaba bien cada fila aislada, pero no reglas entre filas como estas:
- «solo una vigente» (R-15);
- «máximo 10 imágenes» (R-16);
- «sin traslape de franjas» (R-17);
- «solo evalúan las partes» (R-18).

Tampoco validaba varias coherencias de estado y plazo (R-09, R-11).

## 3. Correcciones realizadas

| ID | Tipo | Problema encontrado | Corrección | Fundamento |
|---|---|---|---|---|
| **R-01** | Entidades | Sin defecto: las 41 clases están representadas | — (se documenta la verificación) | Diagrama de clases |
| **R-02** | Cardinalidad | `revelaciones_domicilio` tenía PK `solicitud_id`, es decir, una revelación por proyecto. Si tras una visita confirmada no hay acuerdo en 72 h (RF-39-AC-4) y el cliente elige a otro trabajador, la segunda revelación era imposible. | PK sustituta `id` con `UNIQUE (solicitud_id, trabajador_id)`. La vista `v_acceso_domicilio` agrega `es_prestador_vigente` para RF-52-AC-5. **Se corrigió también el diagrama** (0..1 → 0..*). | RF-52-AC-2/3/5, RF-39-AC-4 |
| **R-03** | Atributos | Faltaban `resumen_requiere_materiales` y `es_version_referencia`. | Columnas agregadas. | `ResumenSolicitud`, `RepresentacionVisual` del contrato |
| **R-04** | Atributos / `NOT NULL` | `solicitudes.oficio` admitía `NULL` siguiendo el diagrama (`[0..1]`), pero el SRS no permite guardar un borrador sin oficio. Si la clasificación falla, la conversación ofrece soporte y no se crea la solicitud. | `oficio NOT NULL`. **Se corrigió el diagrama** (`oficio : Oficio`). | RF-16-AC-1/AC-2, `CrearSolicitudRequest.required` |
| **R-05** | `NOT NULL` | `foto_clave` y `anios_experiencia` eran `NOT NULL`, lo que impedía guardar un perfil por partes. Eso contradice el atributo derivado `/perfilCompleto` y el campo del contrato `datosMinimosFaltantes`. Además, la vista `v_perfil_completo` solo comprobaba que existiera la fila de la subclase. | Las columnas pasan a `NULL` (también `representante_contacto`). La vista ahora exige los datos mínimos reales: foto, años, oficio y zona para el trabajador; nombre, representante, oficio y zona para la organización. | RF-03-AC-1, RF-05-AC-1, `PerfilPropio` |
| **R-06** | Tipos | Cinco longitudes no coincidían con el contrato: `fotos_portafolio.descripcion` 500 (contrato 280), `mensajes_canal.contenido` 2000 (contrato 4000), `solicitudes_arco.respuesta` `TEXT` (contrato 4000), y `mensajes_conversacion.contenido` `VARCHAR(4000)`, que truncaría los resúmenes del agente. | `VARCHAR(280)`, `VARCHAR(4000)` y `VARCHAR(4000)`. El mensaje de conversación pasa a `TEXT` con `CHECK`: ≤ 4000 solo si lo envía el cliente (`MensajeClienteRequest`). | `maxLength` del contrato |
| **R-07** | Tipos | `recomendaciones.explicacion` era `VARCHAR(500)`, pero en el contrato es un **objeto** `{texto, oficio, cobertura, disponibilidad, estadoVerificacion}`. | `JSON` con `CHECK`: debe ser objeto y contener `texto`. | `Recomendacion.explicacion` |
| **R-08** | Modelo / tipos | `propuestas.estado` mezclaba el estado de la negociación con el de cada versión: `sustituida` y `ajuste_solicitado` solo tienen sentido por versión, y en el contrato `Propuesta` representa una versión. | `versiones_propuesta.estado` usa `EstadoPropuesta` del contrato y `propuestas.estado` pasa a `{en_negociacion, aceptada, rechazada, expirada}`. Se agregaron `CHECK` entre `estado` y `aceptada_en`, y entre `ajuste_solicitado` y su texto. **Se corrigió el diagrama** (`VersionPropuesta.estado`, `aceptadaEn`). | RF-39-AC-2, DC-08 |
| **R-09** | FK y coherencia de estado | `solicitudes.proveedor_id ON DELETE SET NULL` podía dejar un proyecto `en_proceso` sin proveedor, y nada impedía `programado` sin proveedor ni `confirmada` sin resumen confirmado. Tampoco se validaban plazos ni datos incompletos. | FK con `RESTRICT` y estos `CHECK`: | RF-45, RF-20, RF-32-AC-2, RF-39-AC-4, RF-41-AC-5, RF-06-AC-3, RF-12, RF-47 |
| | | | • estado ≥ `programado` exige proveedor; | |
| | | | • `confirmada` exige `resumen_confirmado`; | |
| | | | • domicilio completo o vacío; | |
| | | | • plazos posteriores a la creación (invitación, propuesta, cambio); | |
| | | | • un cambio de `fecha` exige `fecha_propuesta`; | |
| | | | • el rechazo o retiro de una verificación exige motivo; | |
| | | | • un caso atendido exige administrador; | |
| | | | • `disponibilidad_general` solo para organizaciones; | |
| | | | • la versión 1 del presupuesto tiene diferencia 0. | |
| **R-10** | FK (integridad entre proyectos) | Una entrada de bitácora o una versión de presupuesto podía referenciar el cambio de **otro** proyecto, y la cadena de la bitácora podía saltar entre proyectos. | FK compuestas `(solicitud_id, cambio_id)` → `cambios(solicitud_id, id)`, y `(solicitud_id, anterior_id)` y `(solicitud_id, corrige_registro_id)` → `registros_bitacora(solicitud_id, id)`. Se agregó `CHECK` contra autorreferencias. | RNF-12, RF-43 |
| **R-11** | Restricción faltante | Una evaluación cliente → proveedor podía registrarse sin las 4 dimensiones. | `CHECK`: si está registrada o publicada, las 4 dimensiones son obligatorias. | RF-49, `EvaluacionDeProveedorRequest.required` |
| **R-12** | FK (`ON DELETE`) | `consentimientos` y `conversaciones` borraban en cascada al borrar un usuario. Esto contradice la política de **anonimizar, no borrar** (RF-54-AC-3, RD-17) y destruiría la evidencia del consentimiento. | `ON DELETE RESTRICT`. | RF-02, RF-54-AC-3, RD-17 |
| **R-13** | FK (rol) | Las FK a `usuarios(id)` no garantizaban el rol: un cliente podía «resolver» una verificación, un trabajador podía ser dueño de una solicitud, y la modalidad de un proveedor podía no coincidir con su rol. | `UNIQUE (id, rol)` en `usuarios` y **FK compuestas con una columna generada constante** (`cliente_rol AS ('cliente')`, `resuelta_por_rol AS ('administrador')`…) en solicitudes, verificaciones, casos de soporte y ARCO. `proveedores.modalidad` usa el mismo tipo que `rol` y referencia `usuarios(id, rol)`. Además, un administrador debe tener secreto de segundo factor. | RNF-04, RD-11, RNF-11-AC-2 |
| **R-14** | FK (herencia) | Las subclases no eran disjuntas: un mismo proveedor podía tener fila en `trabajadores_independientes` **y** en `organizaciones_contratistas`. | Cada subclase tiene un discriminador generado (`AS ('trabajador')` o `AS ('organizacion')`) y una FK compuesta a `proveedores(id, modalidad)`. | DC-02 |
| **R-15** | Restricciones faltantes | No se impedía tener varias vigentes a la vez. | Índices `UNIQUE` **funcionales** (MySQL ≥ 8.0.13): `UNIQUE ((CASE WHEN estado = … THEN id_padre END))`. Cubren: | RF-31, RF-39-AC-2, RF-41-AC-6, RF-47, RF-09 a RF-11 |
| | | | • una verificación pendiente o aprobada por proveedor y tipo; | |
| | | | • una invitación activa por solicitud; | |
| | | | • un acuerdo aceptado por solicitud; | |
| | | | • una versión aceptada por propuesta; | |
| | | | • una contrapropuesta pendiente por cambio; | |
| | | | • una solicitud de cierre abierta por proyecto. | |
| **R-16** | Restricción faltante | El máximo de 10 imágenes por proyecto solo estaba en un comentario. | Trigger `trg_adjuntos_max_imagenes`. | RF-18 |
| **R-17** | Restricción faltante | Dos franjas bloqueadas del mismo prestador podían traslaparse. | Triggers `trg_franjas_sin_traslape_ins/_upd`. El servicio debe bloquear la fila del proveedor (`SELECT … FOR UPDATE`) para que «prevalezca la registrada primero». | RF-35-AC-1/AC-3 |
| **R-18** | Restricción faltante | Cualquier usuario podía evaluar cualquier proyecto, incluso uno no concluido. | Procedimiento `validar_partes_evaluacion` y triggers de `INSERT` y `UPDATE`: el proyecto debe estar `concluido`, y el evaluador y el evaluado deben ser el cliente y el prestador en el sentido correcto. | RD-13, RF-47-AC-3 |

### Cifras antes y después

| Elemento | v1.0 | v1.1 |
|---|---|---|
| Tablas | 40 | 40 |
| Llaves foráneas | 66 | 66 (11 compuestas) |
| `UNIQUE` | 20 | 31 (6 funcionales) |
| `CHECK` | 45 | 64 |
| Triggers y procedimientos | 2 | 7 + 1 |
| Comprobaciones de `probar_esquema.py` | 69 | 93 (todas correctas) |

## 4. Reglas que se dejaron en la capa de servicios (y por qué)

| Regla | Por qué no va en la base de datos |
|---|---|
| El prestador de una cita o propuesta debe ser el proveedor asociado de la solicitud | Una FK compuesta a `solicitudes(id, proveedor_id)` impediría cambiar de proveedor cuando el acuerdo expira (RF-39-AC-4): las citas y propuestas históricas bloquearían la actualización. |
| La `version_propuesta_id` de la bitácora y del presupuesto debe ser del mismo proyecto | Está a dos saltos (versión → propuesta → solicitud). Copiar `solicitud_id` en la versión desnormaliza; se valida en el servicio de propuestas. |
| El tipo de verificación corresponde a la modalidad (`organizacion` solo para organizaciones) | Requeriría duplicar `modalidad` en `verificaciones`; regla simple de servicio. |
| La cita de ejecución exige propuesta aceptada (RF-34-AC-6); el canal interno exige cita confirmada (RF-46) | Dependen del estado de otras entidades en el momento de la acción; triggers aquí harían el modelo frágil. |
| Mínimo de 1 recomendación, `menos_opciones_de_las_habituales` si hay menos de 3, y suma de subtotales igual al total | Dependen de varias filas insertadas en la misma transacción; un `CHECK` por fila no puede verlos. |
| Plazo ARCO en días hábiles (RF-54-AC-5) | Requiere un calendario de días inhábiles; la vista `v_arco_por_vencer` es una aproximación. |

## 5. Impacto en otros artefactos

- **`diagrama_clases_equipo.puml`** (y la vista general), corregido y renderizado de nuevo:
  - `Solicitud.oficio` pasa a ser obligatorio (R-04);
  - `VersionPropuesta` gana `estado` y `aceptadaEn`, y `Propuesta.estado` pasa a `EstadoNegociacion` (R-08);
  - `RevelacionDomicilio` pasa a 0..*, una por trabajador (R-02).
- **`openapi_equipo.yaml`:** no requiere cambios por esta revisión. El contrato ya trataba `Propuesta` como versión y su `explicacion` como objeto; la base de datos se alineó a él. Los ajustes pendientes del contrato siguen siendo los de `esquema_bd.md` §5.
- **`esquema_bd.md`:** se actualizaron las cifras y las filas de correspondencia afectadas.
- **Backend:** el servicio de citas debe usar `SELECT … FOR UPDATE` sobre el proveedor al confirmar (R-17), y los servicios deben cubrir las reglas de la §4.

## 6. Segunda pasada: alineación con el contrato y el diagrama (v1.2)

Al generar el diagrama entidad-relación se cruzaron, campo por campo, los esquemas de respuesta de `openapi_equipo.yaml` con las columnas de la base de datos. El cruce encontró **datos que el contrato promete y que la base de datos no guardaba**, y **campos de la base de datos que el contrato no exponía**. Se corrigieron los tres artefactos.

### 6.1 Ajustes a las tablas

| ID | Problema | Corrección en `esquema_bd.sql` |
|---|---|---|
| **C-01** | `contrapropuestas` guardaba `terminos` y `monto_propuesto`, pero el contrato (`DecisionCambioRequest.contrapropuesta`) envía `montoAdicional`, `presupuestoActualizado`, `fechaPropuesta` y `comentario`. | Las columnas son ahora las del contrato. Se agregaron `CHECK` de presupuesto ≥ 0 y de plazo posterior a la creación. |
| **C-02** | `cambios` no guardaba `presupuestoActualizado`, que es obligatorio en `CambioRequest` y no se puede derivar mientras el cambio está pendiente, ni `pendienteNuevoAcuerdo` (RF-41-AC-3). | Columnas `presupuesto_actualizado` y `pendiente_nuevo_acuerdo`. |
| **C-03** | `CambioRequest.evidenciaAdjuntos` no tenía dónde guardarse. | Tabla `cambio_evidencias`, con FK compuestas a `cambios(solicitud_id, id)` y `adjuntos(solicitud_id, id)`: la evidencia debe ser del mismo proyecto. |
| **C-04** | `ConjuntoRecomendaciones.proveedoresExcluidos` y `criteriosAplicados` no se guardaban, así que no se podía auditar por qué se excluyó a un proveedor (RF-32-AC-3) ni que el orden no dependiera de pagos (RNF-10). | Columnas JSON `proveedores_excluidos` (arreglo) y `criterios_aplicados` (objeto), con `CHECK` de tipo. |
| **C-05** | `Solicitud.solicitudCierre.nota` no tenía columna. | `solicitudes_cierre.nota`. |
| **C-06** | `Solicitud.historialEstados` (RF-45) no tenía de dónde salir: la bitácora solo registra decisiones sobre propuestas y cambios. | Tabla `historial_estados_solicitud` (estado, quién, cuándo). |

Resultado: 42 tablas, 70 FK (13 compuestas), 32 `UNIQUE`, 69 `CHECK` y 106 índices. `probar_esquema.py` pasa **97 de 97** comprobaciones; se agregaron casos para la evidencia de otro proyecto y para el JSON de exclusiones.

### 6.2 Cambios en el diagrama de clases

`diagrama_clases_equipo.puml` pasa de 41 a **43 clases** y queda sincronizado con las tablas:

- **Clases nuevas:** `DocumentoVerificacion` (compuesta por `Verificacion`) y `CambioEstadoSolicitud` (historial de la solicitud, con `cambiadoPor` → `Usuario`).
- **Relaciones nuevas:**
  - `Cambio` 0..* — 0..* `Adjunto` «evidencias»;
  - `Franja` → 0..1 `Cita` «bloqueada por»;
  - `ModificacionCita` → `Usuario` «solicitadaPor».
- **Atributos agregados o corregidos:**

| Clase | Cambio |
|---|---|
| `Contrapropuesta` | Campos del contrato (C-01) |
| `Cambio` | `presupuestoActualizado`, `elementosAfectados`, `fechaPropuesta`, `necesarioParaContinuar`, `pendienteNuevoAcuerdo`, `registradoEn` |
| `ConjuntoRecomendaciones` | `proveedoresExcluidos`, `criteriosAplicados` |
| `SolicitudCierre` | `nota`, `avisoAdminEn` |
| `ResumenSolicitud` | `requiereMateriales`, `presupuestoCliente` |
| `RepresentacionVisual` | `esVersionReferencia` |
| `Recomendacion` | `explicacion : ExplicacionRecomendacion` |
| `Invitacion` | `motivo` |
| `ModificacionCita` | `nuevoInicio`, `retrasoMinutos` |
| `MaterialPropuesta` | `marcaOCalidad` |
| `Notificacion` | `cuerpo`, `referencia` |
| `Evaluacion` | `solicitadaEn`, `registradaEn` |
| `Usuario` | `segundoFactorSecreto` |
| `TrabajadorIndependiente` | `foto` y `aniosExperiencia` opcionales (R-05) |
| `OrganizacionContratistas` | `representanteContacto` opcional (R-05) |

- Ya estaban aplicados desde v1.1: `oficio` obligatorio (R-04), estado por versión de propuesta (R-08) y `RevelacionDomicilio` 0..* (R-02).

### 6.3 Cambios en `openapi_equipo.yaml` (v1.0.0 → v1.1.0)

| Cambio | Motivo |
|---|---|
| `EstadoVerificacion` sin `vencida` | DC-04: el vencimiento es un retiro con motivo, igual que en la base de datos |
| `Solicitud.origen` y `CrearSolicitudRequest.origen` → `modoCaptura` | Mismo nombre que la clase y la columna (DC-05) |
| `Propuesta` = negociación (`EstadoNegociacion`, plazo, `versiones`) y nuevo esquema `VersionPropuesta`. `POST /propuestas/{id}/versiones` responde `VersionPropuesta`; `RespuestaPropuestaRequest` exige `numeroVersion`; se elimina `revisaPropuestaId` | DC-08 y R-08: el contrato modelaba cada versión como una propuesta suelta |
| `Evaluacion.publicada` → `estado` (`EstadoEvaluacion`) y nuevo campo `solicitadaEn`. Se documenta su equivalencia con `SolicitudCalificacion` | DC-13 |
| Nuevos esquemas `Contrapropuesta` (con estado y plazo) y `SolicitudCierre` (con respuesta y pendientes) | C-01, C-05 y RF-47 |
| `RegistroBitacora.anteriorId`, `Invitacion.motivo`, `ModificacionCita.nuevoInicio` y `retrasoMinutos` | Datos que la base de datos ya guardaba y el contrato no exponía |

El contrato sigue siendo OpenAPI 3.0.3 válido: no tiene `$ref` rotos, conserva sus 88 operaciones y cubre los 183 criterios RF.

### 6.4 Diagrama entidad-relación

`generar_er.py` lee `information_schema` después de cargar el SQL y produce:
- `diagrama_er.puml` (todas las columnas);
- `diagrama_er_compacto.puml` (solo PK, FK y únicas);
- seis vistas por módulo en `er_por_modulo/`, cada una con las tablas del módulo completas y, en gris, las tablas vecinas.

Las relaciones usan la notación de pata de gallo según la nulabilidad y unicidad real de cada FK. Como el diagrama se genera desde la base de datos, no puede desalinearse del SQL: si el esquema cambia, se vuelve a generar.
