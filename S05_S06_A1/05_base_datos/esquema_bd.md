# Esquema de base de datos — notas de diseño

**Archivo principal:** `esquema_bd.sql` (MySQL 8.0.16 o superior, InnoDB, utf8mb4). El motor sigue la decisión AR-02.
**Fuentes:** `03_diagrama_clases/diagrama_clases_equipo.puml` y `02_openapi/openapi_equipo.yaml`. Las reglas de transformación son las de `analisis_diagrama_clases.md` §7.
**Versión:** v1.2.
**Verificación:** el script se cargó sin errores en MySQL 8.0.46, y `probar_esquema.py` pasa 97 de 97 comprobaciones: 45 inserciones de un flujo completo y 52 datos inválidos rechazados.
**Revisión:** las correcciones de la revisión crítica (R-01 a R-18) y de la alineación con el contrato (C-01 a C-06) están en `revision_sql.md`.
**Diagrama entidad-relación:** `diagrama_er.puml` / `.png` (completo), `diagrama_er_compacto.puml` / `.png` (solo PK, FK y únicas) y `er_por_modulo/` (una vista por módulo). Se generan con `generar_er.py` a partir de `information_schema`, así que siempre reflejan el SQL cargado.

## 1. Resumen

| Elemento | Cantidad |
|---|---|
| Tablas | 42 (todas con `PRIMARY KEY`) |
| Llaves foráneas | 70 (13 compuestas, para exigir rol, subclase o pertenencia al mismo proyecto) |
| Restricciones `UNIQUE` | 32 (6 funcionales, para «una sola vigente») |
| Restricciones `CHECK` | 69 |
| Índices secundarios | 106 (incluye los de las FK y los `UNIQUE`) |
| Vistas para atributos derivados | 5 |
| Triggers y procedimientos | 7 triggers y 1 procedimiento: bitácora append-only (RNF-12), máximo de 10 imágenes (RF-18), franjas sin traslape (RF-35) y partes de la evaluación (RD-13) |

## 2. Correspondencia entre clases y tablas

| Clase del diagrama | Tabla | Transformación |
|---|---|---|
| `Usuario` | `usuarios` | Entidad; `rol` y `estado` como `ENUM` (DC-01) |
| `AvisoPrivacidad`, `Consentimiento` | `avisos_privacidad`, `consentimientos` | Entidades; composición con `usuarios` |
| `SolicitudArco` | `solicitudes_arco` | PK natural `folio` |
| `Notificacion` | `notificaciones` | Composición con `usuarios` |
| `Proveedor` (abstracta) | `proveedores` | Una tabla por clase; discriminador `modalidad` |
| `TrabajadorIndependiente`, `OrganizacionContratistas` | `trabajadores_independientes`, `organizaciones_contratistas` | La PK es también FK a `proveedores` |
| `Proveedor.oficios [1..*]` | `proveedor_oficios` → catálogo `oficios` | Tabla puente; el catálogo es tabla porque es ampliable (FP-11) |
| `Proveedor.cobertura : Zona [1..*]` | `proveedor_zonas` | Tabla puente |
| `HorarioAtencion` «valor» | columnas `horario_*` de `proveedores` | Embebido; `dias` como `SET` |
| `Disponibilidad` (1-1, sin id) | `proveedores.disponibilidad_general`, `fechas_no_disponibles` | Columna embebida y tabla para la colección |
| `Franja` | `franjas_bloqueadas` | Entidad con id sustituto y `cita_id` (contrato) |
| `FotoPortafolio` | `fotos_portafolio` | Composición con el trabajador |
| `Verificacion` | `verificaciones` | — |
| `Solicitud` | `solicitudes` | Embebe `Zona` (`zona_*`), `Domicilio` (`domicilio_*`) y `ResumenSolicitud` (`resumen_*`) |
| `Conversacion`, `MensajeConversacion` | `conversaciones`, `mensajes_conversacion` | `UNIQUE (solicitud_id)` implementa la relación 0..1 «genera» |
| `Adjunto` | `adjuntos` | Composición con la solicitud; agregación con el mensaje (`SET NULL`) |
| `RepresentacionVisual` | `representaciones_visuales` + `representacion_adjuntos` | La relación muchos a muchos «referencias» va en una tabla puente |
| `CasoSoporte` | `casos_soporte` | Asociaciones opcionales con `SET NULL` |
| `ConjuntoRecomendaciones`, `Recomendacion` | `conjuntos_recomendaciones`, `recomendaciones` | PK compuesta `(conjunto_id, posicion)` con `CHECK` de 1 a 4 |
| `Invitacion`, `Cita`, `ModificacionCita` | `invitaciones`, `citas`, `modificaciones_cita` | — |
| `Propuesta`, `VersionPropuesta` | `propuestas`, `versiones_propuesta` | La versión recibe un id sustituto porque la referencian otras tablas; `UNIQUE (propuesta_id, numero)`. El estado del contrato (`EstadoPropuesta`) está en la versión; la propuesta guarda el de la negociación (R-08) |
| `ConceptoPropuesta` ◁ `MaterialPropuesta` | `conceptos_propuesta` | Una sola tabla; `CHECK` según la `categoria` |
| `VersionPresupuesto` | `versiones_presupuesto` | `CHECK`: el origen es una versión de propuesta o un cambio, nunca ambos |
| `Cambio`, `Contrapropuesta`, `AnalisisIA` | `cambios`, `contrapropuestas`, `analisis_ia` | Los arreglos de `AnalisisIA` van en columnas JSON; la contrapropuesta usa los campos del contrato (C-01) |
| `Cambio` 0..* — 0..* `Adjunto` «evidencias» | `cambio_evidencias` | Tabla puente con FK compuestas: el adjunto debe ser del mismo proyecto (C-03) |
| `CambioEstadoSolicitud` | `historial_estados_solicitud` | Historial de estados de RF-45 (C-06) |
| `DocumentoVerificacion` | `documentos_verificacion` | Composición con la verificación |
| `RegistroBitacora` | `registros_bitacora` | FK con `RESTRICT`, autorreferencias `anterior_id` y `corrige_registro_id`, y triggers que bloquean UPDATE y DELETE |
| `MensajeCanal`, `SolicitudCierre` | `mensajes_canal`, `solicitudes_cierre` | — |
| `RevelacionDomicilio` | `revelaciones_domicilio` | 0..* por solicitud, una por trabajador (R-02); FK solo a trabajadores |
| `Evaluacion` + `DimensionesEvaluacion` | `evaluaciones` | Dimensiones embebidas; `UNIQUE (solicitud_id, direccion)` limita a dos por solicitud |
| Atributos derivados (`/…`) | vistas `v_calificacion_proveedor`, `v_perfil_completo`, `v_arco_por_vencer`, `v_acceso_domicilio`, `v_versiones_presupuesto` | No se guardan |

## 3. Tipos de dato según el contrato

| Tipo del contrato (`openapi_equipo.yaml`) | Tipo en MySQL |
|---|---|
| `string/uuid` | `CHAR(36)` (UUID v4 generado por la aplicación, igual que el backend actual) |
| `string` con `maxLength` | `VARCHAR(n)` con la misma `n`: `nombre` 120, `resultadoEsperado` 2000, `descripcion` 4000, `trabajo` 4000, `motivo` 1000 o 2000, `comentario` 1000… |
| `Monto` (MXN con 2 decimales, ≥ 0) | `DECIMAL(12,2)` con `CHECK >= 0` |
| `MontoConSigno` | `DECIMAL(12,2)` sin `CHECK` de signo |
| `string/date`, `string/date-time` | `DATE`, `DATETIME` (`DATETIME(3)` en la bitácora y los mensajes, para ordenar dentro del mismo segundo) |
| Enumeraciones (`Rol`, `EstadoProyecto`, `TipoCita`, `EstadoCambio`, `Municipio`, `Notificacion.tipo`…) | `ENUM` con los mismos valores |
| `Oficio` | FK al catálogo `oficios`, que se carga con los 10 valores del contrato |
| Patrones (`^\d{10}$`, `^\d{5}$`) | `CHAR(10)` / `CHAR(5)` con `CHECK … REGEXP` |
| Rangos (`aniosExperiencia` 0–80, calificaciones 1–5, `tamanoBytes` ≤ 5 242 880) | `CHECK` |
| Arreglos sin estructura (`AnalisisIA`, `elementosAfectados`) | `JSON` con `CHECK JSON_TYPE = 'ARRAY'` |
| Objetos anidados (`Recomendacion.explicacion`) | `JSON` con `CHECK JSON_TYPE = 'OBJECT'` y `texto` obligatorio |
| URL de archivo (`url`, `imagenUrl`, `fotoUrl`) | `VARCHAR(255)` con la **clave de almacenamiento**; la URL firmada se genera en cada petición (AR-07) |

## 4. Índices para búsquedas frecuentes

| Necesidad | Índice |
|---|---|
| Inicio de sesión y registro | `uq_usuarios_correo` (único) |
| Búsqueda de usuarios por nombre (administración, ARCO) | `ix_usuarios_nombre`, `ix_org_nombre` |
| Búsqueda de proveedores compatibles (RF-26) | `ix_provof_oficio`, `ix_provzona_zona`, `ix_fnd_fecha`, `ix_proveedores_busqueda` |
| «Mis solicitudes» del cliente y del proveedor | `ix_sol_cliente_estado`, `ix_sol_proveedor_estado` |
| Bandejas: proveedor, administrador, notificaciones | `ix_inv_proveedor_estado`, `ix_verif_bandeja`, `ix_casos_bandeja`, `ix_notif_bandeja` |
| Agenda y choques de horario | `ix_citas_agenda_proveedor`, `ix_franja_proveedor` |
| Plazos del planificador (AR-06) | `ix_inv_vencimiento`, `ix_citas_vencimiento`, `ix_citas_recordatorio`, `ix_prop_vencimiento`, `ix_cambios_vencimiento`, `ix_contra_vencimiento`, `ix_cierre_sin_respuesta`, `ix_eval_vencimiento`, `ix_arco_pendientes`, `ix_verif_vencimiento` |
| Historiales ordenados (conversación, canal, bitácora) | `(…_id, enviado_en)` y `(solicitud_id, fecha)` |
| Perfil público y promedio de calificaciones | `ix_eval_evaluado` |

## 5. Alineación con el contrato

Las diferencias entre el contrato y el esquema que quedaban pendientes en v1.1 se resolvieron en `openapi_equipo.yaml` v1.1.0 y en `esquema_bd.sql` v1.2. El detalle está en `revision_sql.md` §6. Las diferencias que siguen son **solo de nombre**: las resuelve la capa de repositorios y no cambian datos.

| Contrato | Columna |
|---|---|
| `Cambio.montoAdicional` | `cambios.monto_ajuste` |
| `Cambio.decisionVenceEn`, `Cambio.registradoEn` | `cambios.vence_en`, `cambios.creado_en` |
| `VersionPresupuesto.version`, `.fecha` | `versiones_presupuesto.numero`, `.creada_en` |
| `RegistroBitacora.usuarioId` | `registros_bitacora.autor_id` |
| `SolicitudArco.tipo` | `solicitudes_arco.derecho` |
| `AvisoPrivacidad.texto` | `avisos_privacidad.contenido` |
| `ModificacionCita.nuevoInicio` | `modificaciones_cita.nueva_fecha` |
| URL de archivo (`url`, `imagenUrl`, `fotoUrl`) | `*_clave` (la URL firmada se genera al responder) |

## 6. Migración desde el `schema.sql` del Sprint 1

Este archivo es para una **instalación nueva**: usa `CREATE TABLE` sin `IF NOT EXISTS`, así que falla de inmediato si encuentra tablas viejas. Sobre la base de desarrollo actual se requieren estos cambios:
- `usuarios`: `activo` → `estado`; agregar `telefono` y las columnas de segundo factor.
- `solicitudes`:
  - `origen` → `modo_captura`;
  - `municipio`/`colonia` → `zona_municipio`/`zona_colonia`;
  - `medidas`/`materiales` → `resumen_*`;
  - el campo `oficio` deja de ser `ENUM` y pasa a ser FK al catálogo, y sigue siendo obligatorio;
  - `proveedor_id` ahora apunta a `proveedores`;
  - agregar `domicilio_*` y `confirmada_en`.
- `casos_soporte`: agregar `conversacion_id` y `resumen_conversacion`.

Hay que actualizar también los repositorios de `solicitudes_service` y `usuarios_service` del backend.
