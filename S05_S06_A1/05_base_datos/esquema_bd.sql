-- ============================================================================
-- UnCalificado — Esquema de base de datos del equipo (v1.2: revisión R-01 a R-18 y alineación con el contrato C-01 a C-06, ver revision_sql.md)
-- Motor: MySQL 8.0.16 o superior (InnoDB, utf8mb4). Decisión AR-02 de
--        S05_S06_A1/04_arquitectura/arquitectura_equipo.md.
--
-- Fuentes:
--   * S05_S06_A1/03_diagrama_clases/diagrama_clases_equipo.puml  (entidades,
--     atributos, relaciones y multiplicidades)
--   * S05_S06_A1/02_openapi/openapi_equipo.yaml  (tipos, longitudes y
--     enumeraciones de components/schemas)
--   * Reglas de transformación: analisis_diagrama_clases.md §7
--
-- Convenciones:
--   * Tablas en plural y snake_case; columnas en snake_case.
--   * Identificadores UUID v4 generados por la aplicación: CHAR(36).
--   * Montos en MXN (único valor de `Moneda`): DECIMAL(12,2).
--   * Fechas y horas en DATETIME, en hora de America/Mexico_City (RE-08).
--   * Composición del diagrama → FK NOT NULL con ON DELETE CASCADE.
--     Asociación → FK con RESTRICT o SET NULL, según su multiplicidad mínima.
--   * Objetos de valor (Zona, Domicilio, HorarioAtencion, ResumenSolicitud,
--     DimensionesEvaluacion) → columnas embebidas con prefijo.
--   * Atributos multivaluados → tablas puente.
--   * Atributos derivados (/calificacionPromedio, /perfilCompleto, /porVencer,
--     /accesoHasta, /esInicial) → vistas al final del archivo; no se guardan.
--
-- Uso (instalación nueva):
--   mysql -u root -p < esquema_bd.sql
-- Para reinstalar, descomente la siguiente línea (borra todos los datos):
-- DROP DATABASE IF EXISTS uncalificado;
-- ============================================================================

CREATE DATABASE IF NOT EXISTS uncalificado
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE uncalificado;

SET NAMES utf8mb4;

-- ############################################################################
-- 1. CUENTAS Y PRIVACIDAD
-- ############################################################################

-- ── Usuario (DC-01): el rol es un atributo, no una subclase ────────────────
-- OpenAPI: Cuenta, RegistroCuentaRequest (nombre ≤ 120), ActualizarCuentaRequest.
CREATE TABLE usuarios (
  id                     CHAR(36)      NOT NULL,
  nombre                 VARCHAR(120)  NOT NULL,
  correo                 VARCHAR(254)  NOT NULL,                 -- RFC 5321
  contrasena_hash        CHAR(60)      NOT NULL,                 -- bcrypt, costo 12
  telefono               CHAR(10)      NULL,                     -- ^\d{10}$; nunca se muestra a la contraparte (RD-15)
  rol                    ENUM('cliente','trabajador','organizacion','administrador') NOT NULL,
  estado                 ENUM('activa','inactiva','anonimizada') NOT NULL DEFAULT 'activa',
  declara_mayor_edad     BOOLEAN       NOT NULL,
  segundo_factor_activo  BOOLEAN       NOT NULL DEFAULT FALSE,   -- obligatorio para administrador (RNF-11-AC-2)
  segundo_factor_secreto VARCHAR(128)  NULL,                     -- secreto TOTP cifrado por la aplicación
  creado_en              DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en         DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_usuarios_correo (correo),                      -- la intercalación _ci la hace insensible a mayúsculas
  UNIQUE KEY uq_usuarios_id_rol (id, rol),                     -- destino de las FK que exigen un rol (R-13)
  KEY ix_usuarios_nombre (nombre),
  KEY ix_usuarios_rol_estado (rol, estado),
  CONSTRAINT ck_usuarios_telefono CHECK (telefono IS NULL OR telefono REGEXP '^[0-9]{10}$'),
  CONSTRAINT ck_usuarios_mayor_edad CHECK (declara_mayor_edad = TRUE OR estado = 'anonimizada'),
  CONSTRAINT ck_usuarios_admin_2fa CHECK (rol <> 'administrador'
    OR (segundo_factor_activo = TRUE AND segundo_factor_secreto IS NOT NULL)),
  CONSTRAINT ck_usuarios_2fa_secreto CHECK (segundo_factor_activo = FALSE OR segundo_factor_secreto IS NOT NULL)
) ENGINE=InnoDB COMMENT='Usuario (DC-01). OpenAPI: Cuenta. Los usuarios no se borran: se anonimizan (RF-54-AC-3)';

-- ── AvisoPrivacidad (RF-02-AC-3): la versión vigente es la de mayor número ─
CREATE TABLE avisos_privacidad (
  version      INT UNSIGNED  NOT NULL,
  contenido    TEXT          NOT NULL,
  publicado_en DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (version),
  CONSTRAINT ck_avisos_version CHECK (version >= 1)
) ENGINE=InnoDB COMMENT='AvisoPrivacidad. OpenAPI: AvisoPrivacidad';

-- ── Consentimiento: Usuario 1 ◆ 0..* Consentimiento; 0..* → 1 AvisoPrivacidad
CREATE TABLE consentimientos (
  id            CHAR(36)      NOT NULL,
  usuario_id    CHAR(36)      NOT NULL,
  version_aviso INT UNSIGNED  NOT NULL,
  aceptado_en   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_consent_usuario_version (usuario_id, version_aviso),
  KEY ix_consent_aviso (version_aviso),
  CONSTRAINT fk_consent_usuario FOREIGN KEY (usuario_id)    REFERENCES usuarios(id)           ON DELETE RESTRICT,  -- evidencia legal (R-12)
  CONSTRAINT fk_consent_aviso   FOREIGN KEY (version_aviso) REFERENCES avisos_privacidad(version) ON DELETE RESTRICT
) ENGINE=InnoDB COMMENT='Consentimiento (RF-02). OpenAPI: Consentimiento';

-- ── SolicitudArco (RF-54): la registra y atiende el administrador (OA-24) ──
CREATE TABLE solicitudes_arco (
  folio          VARCHAR(20)   NOT NULL,
  usuario_id     CHAR(36)      NOT NULL,                         -- titular de los datos
  derecho        ENUM('acceso','rectificacion','cancelacion','oposicion') NOT NULL,
  registrada_en  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fecha_limite   DATE          NOT NULL,                         -- 20 días hábiles por defecto (RF-54-AC-5)
  respuesta      VARCHAR(4000) NULL,                             -- maxLength del contrato (R-06)
  respondida_en  DATETIME      NULL,
  atendida_por   CHAR(36)      NULL,                             -- administrador
  atendida_por_rol ENUM('cliente','trabajador','organizacion','administrador')
                 AS ('administrador') STORED,                    -- R-13: solo un administrador atiende
  PRIMARY KEY (folio),
  KEY ix_arco_usuario (usuario_id),
  KEY ix_arco_pendientes (respondida_en, fecha_limite),          -- aviso de vencimiento del planificador
  KEY ix_arco_admin (atendida_por, atendida_por_rol),
  CONSTRAINT fk_arco_usuario FOREIGN KEY (usuario_id)   REFERENCES usuarios(id) ON DELETE RESTRICT,
  CONSTRAINT fk_arco_admin   FOREIGN KEY (atendida_por, atendida_por_rol) REFERENCES usuarios(id, rol) ON DELETE RESTRICT,
  CONSTRAINT ck_arco_respuesta CHECK ((respuesta IS NULL) = (respondida_en IS NULL))
) ENGINE=InnoDB COMMENT='SolicitudArco. OpenAPI: SolicitudArco (campo tipo = derecho)';

-- ── Notificacion: Usuario 1 ◆ 0..* Notificacion ─────────────────────────────
CREATE TABLE notificaciones (
  id              CHAR(36)      NOT NULL,
  usuario_id      CHAR(36)      NOT NULL,
  tipo            ENUM('verificacion_aprobada','verificacion_rechazada','verificacion_retirada',
                       'verificacion_vencida','invitacion_rechazada','invitacion_expirada',
                       'cita_propuesta','cita_confirmada','cita_expirada','cita_cancelada',
                       'cita_modificada','recordatorio_cita','propuesta_recibida',
                       'cambio_registrado','cambio_resuelto','cierre_solicitado',
                       'cierre_rechazado','cierre_sin_respuesta','solicitud_calificacion',
                       'arco_por_vencer','mensaje_nuevo') NOT NULL,
  titulo          VARCHAR(150)  NOT NULL,
  cuerpo          VARCHAR(1000) NULL,
  referencia_tipo VARCHAR(40)   NULL,                            -- p. ej. 'solicitud', 'cita', 'cambio'
  referencia_id   VARCHAR(36)   NULL,                            -- UUID o folio ARCO
  leida           BOOLEAN       NOT NULL DEFAULT FALSE,
  creada_en       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY ix_notif_bandeja (usuario_id, leida, creada_en),
  CONSTRAINT fk_notif_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB COMMENT='Notificacion. OpenAPI: Notificacion';

-- ############################################################################
-- 2. CATÁLOGOS
-- ############################################################################

-- ── Oficio: catálogo ampliable (RD-18; FP-11), por eso es tabla y no ENUM ──
CREATE TABLE oficios (
  clave  VARCHAR(30)  NOT NULL,                                  -- valores del enum Oficio del contrato
  nombre VARCHAR(80)  NOT NULL,
  activo BOOLEAN      NOT NULL DEFAULT TRUE,
  PRIMARY KEY (clave),
  UNIQUE KEY uq_oficios_nombre (nombre)
) ENGINE=InnoDB COMMENT='Catálogo de oficios. OpenAPI: Oficio';

INSERT INTO oficios (clave, nombre) VALUES
  ('albanileria','Albañilería'), ('plomeria','Plomería'), ('electricidad','Electricidad'),
  ('carpinteria','Carpintería'), ('herreria','Herrería'), ('pintura','Pintura'),
  ('pisos_azulejos','Pisos y azulejos'), ('vidrieria_canceleria','Vidriería y cancelería'),
  ('tablaroca','Tablaroca'), ('impermeabilizacion','Impermeabilización');

-- ############################################################################
-- 3. PROVEEDORES Y VERIFICACIÓN
-- ############################################################################

-- ── Proveedor (abstracta, DC-02): una tabla por clase ───────────────────────
-- Usuario 1 — 0..1 Proveedor. `modalidad` es el discriminador de la subclase.
-- Embebe HorarioAtencion (valor) y Disponibilidad (composición 1-1 sin id).
CREATE TABLE proveedores (
  id                       CHAR(36)      NOT NULL,
  usuario_id               CHAR(36)      NOT NULL,
  -- Mismo tipo que usuarios.rol para poder exigir, con una FK compuesta, que la
  -- modalidad coincida con el rol de la cuenta (R-13).
  modalidad                ENUM('cliente','trabajador','organizacion','administrador') NOT NULL,
  rango_precio_minimo      DECIMAL(12,2) NULL,                   -- RangoPrecio: solo referencia (RD-12)
  rango_precio_maximo      DECIMAL(12,2) NULL,
  rango_precio_unidad      VARCHAR(40)   NULL,
  garantia                 VARCHAR(500)  NULL,
  horario_dias             SET('lun','mar','mie','jue','vie','sab','dom') NULL,
  horario_hora_inicio      TIME          NULL,
  horario_hora_fin         TIME          NULL,
  disponibilidad_general   ENUM('aceptando_proyectos','sin_capacidad') NULL,  -- organizaciones (RF-06-AC-3)
  creado_en                DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en           DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_proveedores_usuario (usuario_id),
  UNIQUE KEY uq_proveedores_id_modalidad (id, modalidad),        -- destino de las FK de las subclases (R-14)
  KEY ix_proveedores_usuario_rol (usuario_id, modalidad),
  KEY ix_proveedores_busqueda (modalidad, disponibilidad_general),
  CONSTRAINT fk_prov_usuario FOREIGN KEY (usuario_id, modalidad) REFERENCES usuarios(id, rol) ON DELETE RESTRICT,
  CONSTRAINT ck_prov_modalidad CHECK (modalidad IN ('trabajador','organizacion')),
  CONSTRAINT ck_prov_disp_general CHECK (modalidad = 'organizacion' OR disponibilidad_general IS NULL),
  CONSTRAINT ck_prov_rango CHECK (rango_precio_minimo IS NULL OR rango_precio_maximo IS NULL
                                  OR (rango_precio_minimo >= 0 AND rango_precio_maximo >= rango_precio_minimo)),
  CONSTRAINT ck_prov_horario CHECK (horario_hora_inicio IS NULL OR horario_hora_fin IS NULL
                                    OR horario_hora_fin > horario_hora_inicio)
) ENGINE=InnoDB COMMENT='Proveedor (abstracta). OpenAPI: PerfilPropio, PerfilProveedorPublico';

-- ── TrabajadorIndependiente ◁ Proveedor (RF-03, RF-53) ─────────────────────
-- foto y años pueden faltar mientras el perfil está incompleto: el perfil se
-- guarda por partes y solo aparece en búsquedas cuando está completo (R-05).
CREATE TABLE trabajadores_independientes (
  proveedor_id               CHAR(36)     NOT NULL,
  modalidad                  ENUM('cliente','trabajador','organizacion','administrador')
                             AS ('trabajador') STORED,           -- R-14: subclases disjuntas
  foto_clave                 VARCHAR(255) NULL,                  -- clave en el almacenamiento de objetos
  anios_experiencia          TINYINT UNSIGNED NULL,
  domicilio_calle            VARCHAR(150) NULL,                  -- Domicilio [0..1] (RF-53)
  domicilio_numero_exterior  VARCHAR(20)  NULL,
  domicilio_colonia          VARCHAR(120) NULL,
  domicilio_municipio        ENUM('guadalajara','zapopan','san_pedro_tlaquepaque','tonala',
                                  'tlajomulco_de_zuniga','el_salto') NULL,
  domicilio_codigo_postal    CHAR(5)      NULL,
  PRIMARY KEY (proveedor_id),
  KEY ix_trab_modalidad (proveedor_id, modalidad),
  CONSTRAINT fk_trab_proveedor FOREIGN KEY (proveedor_id, modalidad) REFERENCES proveedores(id, modalidad) ON DELETE CASCADE,
  CONSTRAINT ck_trab_experiencia CHECK (anios_experiencia IS NULL OR anios_experiencia <= 80),
  CONSTRAINT ck_trab_cp CHECK (domicilio_codigo_postal IS NULL OR domicilio_codigo_postal REGEXP '^[0-9]{5}$'),
  CONSTRAINT ck_trab_domicilio CHECK (
    (domicilio_calle IS NULL AND domicilio_numero_exterior IS NULL AND domicilio_colonia IS NULL
     AND domicilio_municipio IS NULL AND domicilio_codigo_postal IS NULL)
    OR (domicilio_calle IS NOT NULL AND domicilio_numero_exterior IS NOT NULL AND domicilio_colonia IS NOT NULL
     AND domicilio_municipio IS NOT NULL AND domicilio_codigo_postal IS NOT NULL))
) ENGINE=InnoDB COMMENT='TrabajadorIndependiente. OpenAPI: PerfilTrabajadorRequest';

-- ── OrganizacionContratistas ◁ Proveedor (RF-05) ───────────────────────────
CREATE TABLE organizaciones_contratistas (
  proveedor_id             CHAR(36)     NOT NULL,
  modalidad                ENUM('cliente','trabajador','organizacion','administrador')
                           AS ('organizacion') STORED,           -- R-14: subclases disjuntas
  nombre_legal_o_comercial VARCHAR(200) NOT NULL,
  representante_contacto   VARCHAR(120) NULL,                    -- puede faltar en un perfil incompleto (R-05)
  PRIMARY KEY (proveedor_id),
  KEY ix_org_modalidad (proveedor_id, modalidad),
  KEY ix_org_nombre (nombre_legal_o_comercial),
  CONSTRAINT fk_org_proveedor FOREIGN KEY (proveedor_id, modalidad) REFERENCES proveedores(id, modalidad) ON DELETE CASCADE
) ENGINE=InnoDB COMMENT='OrganizacionContratistas. OpenAPI: PerfilOrganizacionRequest';

-- ── Proveedor.oficios : Oficio [1..*] → tabla puente ───────────────────────
CREATE TABLE proveedor_oficios (
  proveedor_id CHAR(36)    NOT NULL,
  oficio       VARCHAR(30) NOT NULL,
  PRIMARY KEY (proveedor_id, oficio),
  KEY ix_provof_oficio (oficio),                                 -- búsqueda por oficio (RF-26)
  CONSTRAINT fk_provof_proveedor FOREIGN KEY (proveedor_id) REFERENCES proveedores(id) ON DELETE CASCADE,
  CONSTRAINT fk_provof_oficio    FOREIGN KEY (oficio)       REFERENCES oficios(clave)  ON DELETE RESTRICT
) ENGINE=InnoDB COMMENT='Proveedor.oficios [1..*]';

-- ── Proveedor.cobertura : Zona [1..*] → tabla puente (RD-04) ───────────────
CREATE TABLE proveedor_zonas (
  proveedor_id CHAR(36)     NOT NULL,
  municipio    ENUM('guadalajara','zapopan','san_pedro_tlaquepaque','tonala',
                    'tlajomulco_de_zuniga','el_salto') NOT NULL,
  colonia      VARCHAR(120) NOT NULL,
  PRIMARY KEY (proveedor_id, municipio, colonia),
  KEY ix_provzona_zona (municipio, colonia),                     -- búsqueda por cobertura (RF-26)
  CONSTRAINT fk_provzona_proveedor FOREIGN KEY (proveedor_id) REFERENCES proveedores(id) ON DELETE CASCADE
) ENGINE=InnoDB COMMENT='Proveedor.cobertura [1..*]. OpenAPI: Zona';

-- ── Disponibilidad.fechasNoDisponibles : Date [0..*] ───────────────────────
CREATE TABLE fechas_no_disponibles (
  proveedor_id CHAR(36) NOT NULL,
  fecha        DATE     NOT NULL,
  PRIMARY KEY (proveedor_id, fecha),
  KEY ix_fnd_fecha (fecha),                                      -- disponibilidad en la fecha deseada (RF-26)
  CONSTRAINT fk_fnd_proveedor FOREIGN KEY (proveedor_id) REFERENCES proveedores(id) ON DELETE CASCADE
) ENGINE=InnoDB COMMENT='Disponibilidad.fechasNoDisponibles';

-- ── FotoPortafolio: TrabajadorIndependiente 1 ◆ 0..* (RF-04) ───────────────
CREATE TABLE fotos_portafolio (
  id                   CHAR(36)     NOT NULL,
  trabajador_id        CHAR(36)     NOT NULL,
  clave_almacenamiento VARCHAR(255) NOT NULL,
  descripcion          VARCHAR(280) NULL,                        -- maxLength del contrato (R-06)
  creada_en            DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_fotoport_clave (clave_almacenamiento),
  KEY ix_fotoport_trabajador (trabajador_id),
  CONSTRAINT fk_fotoport_trabajador FOREIGN KEY (trabajador_id)
    REFERENCES trabajadores_independientes(proveedor_id) ON DELETE CASCADE
) ENGINE=InnoDB COMMENT='FotoPortafolio. OpenAPI: FotoPortafolio';

-- ── Verificacion: Proveedor 1 ◆ 0..*; resueltaPor → 0..1 Usuario (DC-04) ───
CREATE TABLE verificaciones (
  id                          CHAR(36)      NOT NULL,
  proveedor_id                CHAR(36)      NOT NULL,
  tipo                        ENUM('identidad','experiencia','organizacion') NOT NULL,
  estado                      ENUM('pendiente','aprobada','rechazada','retirada') NOT NULL DEFAULT 'pendiente',
  fecha_vencimiento_documento DATE          NULL,
  motivo                      VARCHAR(1000) NULL,               -- rechazo o retiro (incluido el vencimiento)
  resuelta_por                CHAR(36)      NULL,
  resuelta_por_rol            ENUM('cliente','trabajador','organizacion','administrador')
                              AS ('administrador') STORED,      -- R-13: solo un administrador resuelve
  resuelta_en                 DATETIME      NULL,
  creada_en                   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY ix_verif_proveedor (proveedor_id, tipo),
  -- R-15: una sola verificación vigente (pendiente o aprobada) por proveedor y tipo.
  UNIQUE KEY uq_verif_vigente ((CASE WHEN estado IN ('pendiente','aprobada') THEN proveedor_id END), tipo),
  KEY ix_verif_bandeja (estado, creada_en),                      -- bandeja del administrador
  KEY ix_verif_vencimiento (estado, fecha_vencimiento_documento),-- retiro por vencimiento (RF-12-AC-1)
  KEY ix_verif_admin (resuelta_por, resuelta_por_rol),
  CONSTRAINT fk_verif_proveedor FOREIGN KEY (proveedor_id) REFERENCES proveedores(id) ON DELETE CASCADE,
  CONSTRAINT fk_verif_admin     FOREIGN KEY (resuelta_por, resuelta_por_rol) REFERENCES usuarios(id, rol) ON DELETE RESTRICT,
  CONSTRAINT ck_verif_resolucion CHECK (estado = 'pendiente'
    OR (resuelta_en IS NOT NULL AND resuelta_por IS NOT NULL)),
  CONSTRAINT ck_verif_motivo CHECK (estado NOT IN ('rechazada','retirada') OR motivo IS NOT NULL)
) ENGINE=InnoDB COMMENT='Verificacion. OpenAPI: Verificacion';

-- Documentos de evidencia de una verificación. No figuran como clase en el
-- diagrama; los exige el contrato (Verificacion.documentos y
-- GET /verificaciones/{id}/documentos/{documentoId}).
CREATE TABLE documentos_verificacion (
  id                   CHAR(36)     NOT NULL,
  verificacion_id      CHAR(36)     NOT NULL,
  clave_almacenamiento VARCHAR(255) NOT NULL,
  mime                 VARCHAR(100) NOT NULL,
  tamano_bytes         INT UNSIGNED NOT NULL,
  subido_en            DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_docverif_clave (clave_almacenamiento),
  KEY ix_docverif_verificacion (verificacion_id),
  CONSTRAINT fk_docverif_verificacion FOREIGN KEY (verificacion_id) REFERENCES verificaciones(id) ON DELETE CASCADE
) ENGINE=InnoDB COMMENT='Documentos de verificación (RNF-05)';

-- ############################################################################
-- 4. SOLICITUD Y AGENTE DE IA
-- ############################################################################

-- ── Solicitud (DC-05) ───────────────────────────────────────────────────────
-- Embebe Zona (zonaAproximada), Domicilio [0..1] (domicilioExacto) y
-- ResumenSolicitud [0..1] (columnas resumen_*).
-- OpenAPI: Solicitud, CrearSolicitudRequest, ResumenSolicitud.
-- ValorDesconocible → VARCHAR que admite el texto 'desconocido' (RF-14-AC-5).
CREATE TABLE solicitudes (
  id                             CHAR(36)      NOT NULL,
  cliente_id                     CHAR(36)      NOT NULL,
  cliente_rol                    ENUM('cliente','trabajador','organizacion','administrador')
                                 AS ('cliente') STORED,          -- R-13: el dueño debe tener rol cliente
  proveedor_id                   CHAR(36)      NULL,              -- proveedorAsociado (RF-32-AC-4)
  estado                         ENUM('borrador','confirmada','programado','en_proceso','terminado','concluido')
                                               NOT NULL DEFAULT 'borrador',
  modo_captura                   ENUM('agente','manual') NOT NULL, -- OpenAPI: campo `origen`
  resultado_esperado             VARCHAR(2000) NOT NULL,
  oficio                         VARCHAR(30)   NOT NULL,          -- RF-16-AC-1/AC-2: obligatorio para guardar el borrador (R-04)
  tipo_trabajo                   VARCHAR(200)  NULL,
  zona_municipio                 ENUM('guadalajara','zapopan','san_pedro_tlaquepaque','tonala',
                                      'tlajomulco_de_zuniga','el_salto') NOT NULL,
  zona_colonia                   VARCHAR(120)  NOT NULL,
  fecha_deseada                  DATE          NULL,
  descripcion                    VARCHAR(4000) NULL,
  domicilio_calle                VARCHAR(150)  NULL,              -- se pide al revelarse (RF-52)
  domicilio_numero_exterior      VARCHAR(20)   NULL,
  domicilio_colonia              VARCHAR(120)  NULL,
  domicilio_municipio            ENUM('guadalajara','zapopan','san_pedro_tlaquepaque','tonala',
                                      'tlajomulco_de_zuniga','el_salto') NULL,
  domicilio_codigo_postal        CHAR(5)       NULL,
  resumen_medidas                VARCHAR(500)  NULL,
  resumen_condiciones_espacio    VARCHAR(1000) NULL,
  resumen_materiales             VARCHAR(1000) NULL,
  resumen_requiere_materiales    BOOLEAN       NULL,              -- ResumenSolicitud.requiereMateriales (R-03)
  resumen_comprador_materiales   ENUM('cliente','proveedor','desconocido') NULL,
  resumen_presupuesto_cliente    DECIMAL(12,2) NULL,
  resumen_confirmado             BOOLEAN       NOT NULL DEFAULT FALSE,
  confirmada_en                  DATETIME      NULL,
  creada_en                      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizada_en                 DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY ix_sol_cliente_estado (cliente_id, estado),
  KEY ix_sol_cliente_rol (cliente_id, cliente_rol),
  KEY ix_sol_proveedor_estado (proveedor_id, estado),
  KEY ix_sol_estado_oficio_zona (estado, oficio, zona_municipio), -- búsquedas y reportes
  KEY ix_sol_oficio (oficio),
  CONSTRAINT fk_sol_cliente   FOREIGN KEY (cliente_id, cliente_rol) REFERENCES usuarios(id, rol) ON DELETE RESTRICT,
  CONSTRAINT fk_sol_proveedor FOREIGN KEY (proveedor_id) REFERENCES proveedores(id) ON DELETE RESTRICT,  -- R-09
  CONSTRAINT fk_sol_oficio    FOREIGN KEY (oficio)       REFERENCES oficios(clave)  ON DELETE RESTRICT,
  CONSTRAINT ck_sol_cp CHECK (domicilio_codigo_postal IS NULL OR domicilio_codigo_postal REGEXP '^[0-9]{5}$'),
  CONSTRAINT ck_sol_confirmada CHECK (estado = 'borrador' OR (confirmada_en IS NOT NULL AND resumen_confirmado = TRUE)),
  -- R-09: desde «programado» el proyecto ya tiene proveedor asociado (RF-45)
  CONSTRAINT ck_sol_proveedor CHECK (estado IN ('borrador','confirmada') OR proveedor_id IS NOT NULL),
  CONSTRAINT ck_sol_domicilio CHECK (
    (domicilio_calle IS NULL AND domicilio_numero_exterior IS NULL AND domicilio_colonia IS NULL
     AND domicilio_municipio IS NULL AND domicilio_codigo_postal IS NULL)
    OR (domicilio_calle IS NOT NULL AND domicilio_numero_exterior IS NOT NULL AND domicilio_colonia IS NOT NULL
     AND domicilio_municipio IS NOT NULL AND domicilio_codigo_postal IS NOT NULL)),
  CONSTRAINT ck_sol_presupuesto CHECK (resumen_presupuesto_cliente IS NULL OR resumen_presupuesto_cliente >= 0)
) ENGINE=InnoDB COMMENT='Solicitud (= proyecto). OpenAPI: Solicitud';

-- ── Conversacion: Usuario 1 — 0..*; 0..1 → 0..1 Solicitud «genera» (DC-06) ─
CREATE TABLE conversaciones (
  id                        CHAR(36) NOT NULL,
  cliente_id                CHAR(36) NOT NULL,
  solicitud_id              CHAR(36) NULL,
  es_asistente_automatico   BOOLEAN  NOT NULL DEFAULT TRUE,      -- RF-13-AC-2
  aclaraciones_realizadas   TINYINT UNSIGNED NOT NULL DEFAULT 0,
  correcciones_consecutivas TINYINT UNSIGNED NOT NULL DEFAULT 0,
  creada_en                 DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_conv_solicitud (solicitud_id),
  KEY ix_conv_cliente (cliente_id, creada_en),
  CONSTRAINT fk_conv_cliente   FOREIGN KEY (cliente_id)   REFERENCES usuarios(id)    ON DELETE RESTRICT,  -- R-12
  CONSTRAINT fk_conv_solicitud FOREIGN KEY (solicitud_id) REFERENCES solicitudes(id) ON DELETE SET NULL,
  CONSTRAINT ck_conv_asistente CHECK (es_asistente_automatico = TRUE),
  CONSTRAINT ck_conv_aclaraciones CHECK (aclaraciones_realizadas <= 2)
) ENGINE=InnoDB COMMENT='Conversacion. OpenAPI: Conversacion';

-- ── MensajeConversacion: Conversacion 1 ◆ 1..* ─────────────────────────────
CREATE TABLE mensajes_conversacion (
  id              CHAR(36)      NOT NULL,
  conversacion_id CHAR(36)      NOT NULL,
  emisor          ENUM('cliente','agente') NOT NULL,
  contenido       TEXT          NOT NULL,                        -- el agente no tiene límite (resúmenes); R-06
  enviado_en      DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  KEY ix_msgconv_conversacion (conversacion_id, enviado_en),
  CONSTRAINT ck_msgconv_longitud CHECK (CHAR_LENGTH(contenido) >= 1
    AND (emisor = 'agente' OR CHAR_LENGTH(contenido) <= 4000)),  -- MensajeClienteRequest.contenido ≤ 4000
  CONSTRAINT fk_msgconv_conversacion FOREIGN KEY (conversacion_id) REFERENCES conversaciones(id) ON DELETE CASCADE
) ENGINE=InnoDB COMMENT='MensajeConversacion. OpenAPI: MensajeConversacion';

-- ── Adjunto: Solicitud 1 ◆ 0..* {máx. 10 imágenes}; MensajeConversacion o 0..* (DC-07)
-- El límite de 10 imágenes y los 5 MB (RF-18) los valida la capa de servicios.
CREATE TABLE adjuntos (
  id                       CHAR(36)     NOT NULL,
  solicitud_id             CHAR(36)     NOT NULL,
  mensaje_conversacion_id  CHAR(36)     NULL,
  tipo                     ENUM('imagen','video') NOT NULL,
  mime                     ENUM('image/jpeg','image/png','video/mp4','video/quicktime') NOT NULL,
  tamano_bytes             INT UNSIGNED NOT NULL,
  clave_almacenamiento     VARCHAR(255) NOT NULL,
  es_del_domicilio         BOOLEAN      NOT NULL DEFAULT FALSE,  -- RF-52-AC-1
  creado_en                DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_adjuntos_clave (clave_almacenamiento),
  UNIQUE KEY uq_adjuntos_solicitud_id (solicitud_id, id),        -- destino de FK compuestas (C-03)
  KEY ix_adjuntos_solicitud (solicitud_id, tipo),
  KEY ix_adjuntos_mensaje (mensaje_conversacion_id),
  CONSTRAINT fk_adj_solicitud FOREIGN KEY (solicitud_id)            REFERENCES solicitudes(id)           ON DELETE CASCADE,
  CONSTRAINT fk_adj_mensaje   FOREIGN KEY (mensaje_conversacion_id) REFERENCES mensajes_conversacion(id) ON DELETE SET NULL,
  CONSTRAINT ck_adj_tipo_mime CHECK ((tipo = 'imagen' AND mime IN ('image/jpeg','image/png'))
                                  OR (tipo = 'video'  AND mime IN ('video/mp4','video/quicktime'))),
  CONSTRAINT ck_adj_tamano CHECK (tipo <> 'imagen' OR tamano_bytes <= 5242880)
) ENGINE=InnoDB COMMENT='Adjunto. OpenAPI: Adjunto';

-- ── RepresentacionVisual: Solicitud 1 ◆ 0..* (RF-23) ───────────────────────
CREATE TABLE representaciones_visuales (
  id           CHAR(36)      NOT NULL,
  solicitud_id CHAR(36)      NOT NULL,
  descripcion  VARCHAR(2000) NOT NULL,
  clave_imagen VARCHAR(255)  NOT NULL,
  aprobada     BOOLEAN       NOT NULL DEFAULT FALSE,
  es_version_referencia BOOLEAN NOT NULL DEFAULT FALSE,          -- RepresentacionVisual.esVersionReferencia (R-03)
  leyenda      VARCHAR(40)   NOT NULL DEFAULT 'No es plano técnico',
  creada_en    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY ix_repvis_solicitud (solicitud_id),
  CONSTRAINT fk_repvis_solicitud FOREIGN KEY (solicitud_id) REFERENCES solicitudes(id) ON DELETE CASCADE,
  CONSTRAINT ck_repvis_leyenda CHECK (leyenda = 'No es plano técnico')
) ENGINE=InnoDB COMMENT='RepresentacionVisual. OpenAPI: RepresentacionVisual';

-- RepresentacionVisual 0..* → 0..* Adjunto «referencias» → tabla puente
CREATE TABLE representacion_adjuntos (
  representacion_id CHAR(36) NOT NULL,
  adjunto_id        CHAR(36) NOT NULL,
  PRIMARY KEY (representacion_id, adjunto_id),
  KEY ix_repadj_adjunto (adjunto_id),
  CONSTRAINT fk_repadj_representacion FOREIGN KEY (representacion_id) REFERENCES representaciones_visuales(id) ON DELETE CASCADE,
  CONSTRAINT fk_repadj_adjunto        FOREIGN KEY (adjunto_id)        REFERENCES adjuntos(id)                  ON DELETE CASCADE
) ENGINE=InnoDB COMMENT='Imágenes de referencia de una representación visual';

-- ── CasoSoporte (RF-22) ─────────────────────────────────────────────────────
-- Usuario 1 — 0..* «abre»; → 0..1 Solicitud; → 0..1 Conversacion; → 0..1 administrador.
CREATE TABLE casos_soporte (
  id                    CHAR(36)      NOT NULL,
  cliente_id            CHAR(36)      NOT NULL,
  solicitud_id          CHAR(36)      NULL,
  conversacion_id       CHAR(36)      NULL,
  motivo                ENUM('agente_no_comprende','oficio_no_clasificado','ia_no_resolvio','otro') NOT NULL,
  comentario            VARCHAR(2000) NULL,
  resumen_conversacion  TEXT          NULL,
  estado                ENUM('pendiente','en_atencion','resuelto') NOT NULL DEFAULT 'pendiente',
  atendido_por          CHAR(36)      NULL,
  atendido_por_rol      ENUM('cliente','trabajador','organizacion','administrador')
                        AS ('administrador') STORED,             -- R-13: solo un administrador atiende
  notas                 VARCHAR(4000) NULL,
  creado_en             DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en        DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY ix_casos_bandeja (estado, creado_en),
  KEY ix_casos_cliente (cliente_id),
  KEY ix_casos_solicitud (solicitud_id),
  KEY ix_casos_conversacion (conversacion_id),
  KEY ix_casos_admin (atendido_por, atendido_por_rol),
  CONSTRAINT fk_caso_cliente      FOREIGN KEY (cliente_id)      REFERENCES usuarios(id)       ON DELETE RESTRICT,
  CONSTRAINT fk_caso_solicitud    FOREIGN KEY (solicitud_id)    REFERENCES solicitudes(id)    ON DELETE SET NULL,
  CONSTRAINT fk_caso_conversacion FOREIGN KEY (conversacion_id) REFERENCES conversaciones(id) ON DELETE SET NULL,
  CONSTRAINT fk_caso_admin        FOREIGN KEY (atendido_por, atendido_por_rol) REFERENCES usuarios(id, rol) ON DELETE RESTRICT,
  CONSTRAINT ck_caso_atencion CHECK (estado = 'pendiente' OR atendido_por IS NOT NULL)
) ENGINE=InnoDB COMMENT='CasoSoporte. OpenAPI: CasoSoporte';

-- ############################################################################
-- 5. BÚSQUEDA, INVITACIÓN Y CITAS
-- ############################################################################

-- ── ConjuntoRecomendaciones: Solicitud 1 ◆ 0..* (DC-11) ────────────────────
CREATE TABLE conjuntos_recomendaciones (
  id                              CHAR(36) NOT NULL,
  solicitud_id                    CHAR(36) NOT NULL,
  menos_opciones_de_las_habituales BOOLEAN NOT NULL DEFAULT FALSE,
  -- C-04: instantánea para auditar el orden sin pagos (RNF-10) y la exclusión
  -- de quienes rechazaron o dejaron expirar la invitación (RF-32-AC-3)
  proveedores_excluidos           JSON     NOT NULL DEFAULT (JSON_ARRAY()),
  criterios_aplicados             JSON     NULL,
  generado_en                     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY ix_conjrec_solicitud (solicitud_id, generado_en),
  CONSTRAINT fk_conjrec_solicitud FOREIGN KEY (solicitud_id) REFERENCES solicitudes(id) ON DELETE CASCADE,
  CONSTRAINT ck_conjrec_excluidos CHECK (JSON_TYPE(proveedores_excluidos) = 'ARRAY'),
  CONSTRAINT ck_conjrec_criterios CHECK (criterios_aplicados IS NULL OR JSON_TYPE(criterios_aplicados) = 'OBJECT')
) ENGINE=InnoDB COMMENT='ConjuntoRecomendaciones. OpenAPI: ConjuntoRecomendaciones';

-- ── Recomendacion: Conjunto 1 ◆ 1..4; → 1 Proveedor (RF-30, RNF-10) ────────
CREATE TABLE recomendaciones (
  conjunto_id  CHAR(36)     NOT NULL,
  posicion     TINYINT UNSIGNED NOT NULL,
  proveedor_id CHAR(36)     NOT NULL,
  -- OpenAPI: Recomendacion.explicacion es un objeto {texto, oficio, cobertura,
  -- disponibilidad, estadoVerificacion}, no un texto (R-07).
  explicacion  JSON         NOT NULL,
  PRIMARY KEY (conjunto_id, posicion),
  UNIQUE KEY uq_rec_conjunto_proveedor (conjunto_id, proveedor_id),
  KEY ix_rec_proveedor (proveedor_id),
  CONSTRAINT fk_rec_conjunto  FOREIGN KEY (conjunto_id)  REFERENCES conjuntos_recomendaciones(id) ON DELETE CASCADE,
  CONSTRAINT fk_rec_proveedor FOREIGN KEY (proveedor_id) REFERENCES proveedores(id)               ON DELETE RESTRICT,
  CONSTRAINT ck_rec_posicion CHECK (posicion BETWEEN 1 AND 4),
  CONSTRAINT ck_rec_explicacion CHECK (JSON_TYPE(explicacion) = 'OBJECT'
                                   AND JSON_CONTAINS_PATH(explicacion, 'one', '$.texto'))
) ENGINE=InnoDB COMMENT='Recomendacion. OpenAPI: Recomendacion';

-- ── Invitacion: Solicitud 1 ◆ 0..*; → 1 Proveedor (DC-14, RF-31, RF-32) ────
CREATE TABLE invitaciones (
  id            CHAR(36) NOT NULL,
  solicitud_id  CHAR(36) NOT NULL,
  proveedor_id  CHAR(36) NOT NULL,
  estado        ENUM('pendiente','aceptada','rechazada','expirada') NOT NULL DEFAULT 'pendiente',
  motivo        VARCHAR(500) NULL,                               -- motivo del rechazo
  enviada_en    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  vence_en      DATETIME NOT NULL,                               -- 4 h hábiles (RF-32-AC-2)
  respondida_en DATETIME NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_inv_solicitud_proveedor (solicitud_id, proveedor_id),
  -- R-15: el cliente selecciona un proveedor a la vez (RF-31); solo una
  -- invitación pendiente o aceptada por solicitud.
  UNIQUE KEY uq_inv_activa ((CASE WHEN estado IN ('pendiente','aceptada') THEN solicitud_id END)),
  KEY ix_inv_proveedor_estado (proveedor_id, estado),            -- bandeja del proveedor
  KEY ix_inv_vencimiento (estado, vence_en),                     -- planificador
  CONSTRAINT fk_inv_solicitud FOREIGN KEY (solicitud_id) REFERENCES solicitudes(id) ON DELETE CASCADE,
  CONSTRAINT fk_inv_proveedor FOREIGN KEY (proveedor_id) REFERENCES proveedores(id) ON DELETE RESTRICT,
  CONSTRAINT ck_inv_respuesta CHECK (estado IN ('pendiente','expirada') OR respondida_en IS NOT NULL),
  CONSTRAINT ck_inv_plazo CHECK (vence_en > enviada_en)
) ENGINE=InnoDB COMMENT='Invitacion. OpenAPI: Invitacion';

-- ── Cita: Solicitud 1 ◆ 0..*; → 1 Proveedor «prestador» (DC-14, RF-33 a RF-37)
-- costo NULL = sin costo. La regla «la cita de ejecución requiere una
-- propuesta aceptada» (RF-34-AC-6) es una dependencia: la valida el servicio.
CREATE TABLE citas (
  id                          CHAR(36)      NOT NULL,
  solicitud_id                CHAR(36)      NOT NULL,
  proveedor_id                CHAR(36)      NOT NULL,
  tipo                        ENUM('visita_valoracion','ejecucion') NOT NULL,
  estado                      ENUM('pendiente','confirmada','cancelada','expirada','rechazada') NOT NULL DEFAULT 'pendiente',
  inicio                      DATETIME      NOT NULL,
  fin                         DATETIME      NOT NULL,
  costo                       DECIMAL(12,2) NULL,
  confirmada_por_proveedor_en DATETIME      NULL,
  confirmada_por_cliente_en   DATETIME      NULL,
  expira_en                   DATETIME      NOT NULL,            -- 24 h tras la propuesta (RF-34-AC-3)
  creada_en                   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY ix_citas_solicitud (solicitud_id),
  KEY ix_citas_agenda_proveedor (proveedor_id, inicio),          -- GET /citas y choques de agenda
  KEY ix_citas_vencimiento (estado, expira_en),                  -- planificador
  KEY ix_citas_recordatorio (estado, inicio),                    -- recordatorio de 24 h (RF-36-AC-3)
  CONSTRAINT fk_citas_solicitud FOREIGN KEY (solicitud_id) REFERENCES solicitudes(id) ON DELETE CASCADE,
  CONSTRAINT fk_citas_proveedor FOREIGN KEY (proveedor_id) REFERENCES proveedores(id) ON DELETE RESTRICT,
  CONSTRAINT ck_citas_horario CHECK (fin > inicio),
  CONSTRAINT ck_citas_costo CHECK (costo IS NULL OR costo >= 0),
  CONSTRAINT ck_citas_confirmada CHECK (estado <> 'confirmada'
    OR (confirmada_por_proveedor_en IS NOT NULL AND confirmada_por_cliente_en IS NOT NULL))
) ENGINE=InnoDB COMMENT='Cita. OpenAPI: Cita';

-- ── ModificacionCita: Cita 1 ◆ 0..* (RF-37) ────────────────────────────────
CREATE TABLE modificaciones_cita (
  id              CHAR(36)      NOT NULL,
  cita_id         CHAR(36)      NOT NULL,
  tipo            ENUM('cancelacion','cambio_fecha','retraso','reprogramacion') NOT NULL,
  motivo          VARCHAR(1000) NOT NULL,
  nueva_fecha     DATETIME      NULL,                            -- cambio_fecha / reprogramacion
  retraso_minutos SMALLINT UNSIGNED NULL,                        -- retraso
  solicitada_por  CHAR(36)      NOT NULL,
  solicitada_en   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY ix_modcita_cita (cita_id, solicitada_en),
  KEY ix_modcita_usuario (solicitada_por),
  CONSTRAINT fk_modcita_cita    FOREIGN KEY (cita_id)        REFERENCES citas(id)    ON DELETE CASCADE,
  CONSTRAINT fk_modcita_usuario FOREIGN KEY (solicitada_por) REFERENCES usuarios(id) ON DELETE RESTRICT,
  CONSTRAINT ck_modcita_datos CHECK (
    (tipo = 'retraso' AND retraso_minutos >= 1)
    OR (tipo IN ('cambio_fecha','reprogramacion') AND nueva_fecha IS NOT NULL)
    OR tipo = 'cancelacion')
) ENGINE=InnoDB COMMENT='ModificacionCita. OpenAPI: ModificacionCita';

-- ── Franja bloqueada: Disponibilidad 1 ◆ 0..* Franja ───────────────────────
-- OpenAPI: Franja {inicio, fin, citaId}. Se crea al confirmarse una cita.
CREATE TABLE franjas_bloqueadas (
  id           CHAR(36) NOT NULL,
  proveedor_id CHAR(36) NOT NULL,
  inicio       DATETIME NOT NULL,
  fin          DATETIME NOT NULL,
  cita_id      CHAR(36) NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_franja_cita (cita_id),
  KEY ix_franja_proveedor (proveedor_id, inicio, fin),
  CONSTRAINT fk_franja_proveedor FOREIGN KEY (proveedor_id) REFERENCES proveedores(id) ON DELETE CASCADE,
  CONSTRAINT fk_franja_cita      FOREIGN KEY (cita_id)      REFERENCES citas(id)       ON DELETE CASCADE,
  CONSTRAINT ck_franja_horario CHECK (fin > inicio)
) ENGINE=InnoDB COMMENT='Disponibilidad.franjas. OpenAPI: Franja';

-- ############################################################################
-- 6. PROPUESTAS Y CONTROL DE COSTOS
-- ############################################################################

-- ── Propuesta: Solicitud 1 ◆ 0..*; → 1 Proveedor «emitida por» (DC-08) ─────
-- Representa la negociación con un proveedor: estado y plazo de 72 h.
CREATE TABLE propuestas (
  id                      CHAR(36) NOT NULL,
  solicitud_id            CHAR(36) NOT NULL,
  proveedor_id            CHAR(36) NOT NULL,
  -- R-08: estado de la NEGOCIACIÓN. Los estados por versión del contrato
  -- (enviada, ajuste_solicitado, sustituida…) viven en versiones_propuesta.
  estado                  ENUM('en_negociacion','aceptada','rechazada','expirada')
                                   NOT NULL DEFAULT 'en_negociacion',
  fecha_primera_emision   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  plazo_acuerdo_vence_en  DATETIME NOT NULL,                     -- 72 h (RF-39-AC-4)
  PRIMARY KEY (id),
  UNIQUE KEY uq_prop_solicitud_proveedor (solicitud_id, proveedor_id),
  -- R-15: un proyecto tiene a lo sumo un acuerdo aceptado.
  UNIQUE KEY uq_prop_aceptada ((CASE WHEN estado = 'aceptada' THEN solicitud_id END)),
  KEY ix_prop_proveedor (proveedor_id, estado),
  KEY ix_prop_vencimiento (estado, plazo_acuerdo_vence_en),      -- planificador
  CONSTRAINT fk_prop_solicitud FOREIGN KEY (solicitud_id) REFERENCES solicitudes(id) ON DELETE CASCADE,
  CONSTRAINT fk_prop_proveedor FOREIGN KEY (proveedor_id) REFERENCES proveedores(id) ON DELETE RESTRICT,
  CONSTRAINT ck_prop_plazo CHECK (plazo_acuerdo_vence_en > fecha_primera_emision)
) ENGINE=InnoDB COMMENT='Propuesta (negociación). OpenAPI: Propuesta';

-- ── VersionPropuesta: Propuesta 1 ◆ 1..* (RF-38, RF-39-AC-2) ──────────────
-- El diagrama no le da id; se agrega uno sustituto porque la referencian
-- VersionPresupuesto y RegistroBitacora. (propuesta_id, numero) es único.
CREATE TABLE versiones_propuesta (
  id                 CHAR(36)      NOT NULL,
  propuesta_id       CHAR(36)      NOT NULL,
  numero             SMALLINT UNSIGNED NOT NULL,
  trabajo            VARCHAR(4000) NOT NULL,
  fecha_inicio       DATE          NOT NULL,
  fecha_fin          DATE          NOT NULL,
  total              DECIMAL(12,2) NOT NULL,
  estado             ENUM('enviada','ajuste_solicitado','sustituida','aceptada','rechazada','expirada')
                     NOT NULL DEFAULT 'enviada',                 -- = EstadoPropuesta del contrato (R-08)
  ajuste_solicitado  VARCHAR(2000) NULL,                         -- RespuestaPropuestaRequest.ajusteSolicitado
  aceptada_en        DATETIME      NULL,
  enviada_en         DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_verprop_numero (propuesta_id, numero),
  -- R-15: una sola versión aceptada por propuesta (RF-39-AC-2).
  UNIQUE KEY uq_verprop_aceptada ((CASE WHEN estado = 'aceptada' THEN propuesta_id END)),
  CONSTRAINT fk_verprop_propuesta FOREIGN KEY (propuesta_id) REFERENCES propuestas(id) ON DELETE CASCADE,
  CONSTRAINT ck_verprop_numero CHECK (numero >= 1),
  CONSTRAINT ck_verprop_fechas CHECK (fecha_fin >= fecha_inicio),
  CONSTRAINT ck_verprop_total CHECK (total >= 0),
  CONSTRAINT ck_verprop_aceptada CHECK ((estado = 'aceptada') = (aceptada_en IS NOT NULL)),
  CONSTRAINT ck_verprop_ajuste CHECK (estado <> 'ajuste_solicitado' OR ajuste_solicitado IS NOT NULL)
) ENGINE=InnoDB COMMENT='VersionPropuesta. OpenAPI: Propuesta (version)';

-- ── ConceptoPropuesta ◁ MaterialPropuesta (DC-08): una sola tabla ─────────
-- VersionPropuesta 1 ◆ 1..*. Las columnas de material se exigen solo si
-- categoria = 'material' (RF-38-AC-2). La suma de subtotales = total la
-- valida el servicio.
CREATE TABLE conceptos_propuesta (
  id                  CHAR(36)      NOT NULL,
  version_propuesta_id CHAR(36)     NOT NULL,
  categoria           ENUM('mano_de_obra','material','costo_adicional') NOT NULL,
  descripcion         VARCHAR(500)  NOT NULL,
  subtotal            DECIMAL(12,2) NOT NULL,
  cantidad            DECIMAL(10,3) NULL,
  unidad              VARCHAR(30)   NULL,
  precio_unitario     DECIMAL(12,2) NULL,
  marca_o_calidad     VARCHAR(120)  NULL,
  PRIMARY KEY (id),
  KEY ix_concepto_version (version_propuesta_id, categoria),
  CONSTRAINT fk_concepto_version FOREIGN KEY (version_propuesta_id) REFERENCES versiones_propuesta(id) ON DELETE CASCADE,
  CONSTRAINT ck_concepto_subtotal CHECK (subtotal >= 0),
  CONSTRAINT ck_concepto_material CHECK (
    (categoria = 'material' AND cantidad IS NOT NULL AND cantidad >= 0
       AND unidad IS NOT NULL AND precio_unitario IS NOT NULL AND precio_unitario >= 0)
    OR (categoria <> 'material' AND cantidad IS NULL AND unidad IS NULL
       AND precio_unitario IS NULL AND marca_o_calidad IS NULL))
) ENGINE=InnoDB COMMENT='ConceptoPropuesta y MaterialPropuesta. OpenAPI: ConceptoPropuesta, MaterialPropuesta';

-- ── Cambio: Solicitud 1 ◆ 0..* (DC-10, RF-40 a RF-42, RF-55) ───────────────
CREATE TABLE cambios (
  id                       CHAR(36)      NOT NULL,
  solicitud_id             CHAR(36)      NOT NULL,
  iniciado_por             ENUM('proveedor','cliente') NOT NULL,
  tipo                     ENUM('costo','material','alcance','fecha') NOT NULL,
  motivo                   VARCHAR(2000) NOT NULL,
  monto_ajuste             DECIMAL(12,2) NOT NULL,               -- con signo; negativo = ahorro. OpenAPI: montoAdicional
  presupuesto_actualizado  DECIMAL(12,2) NOT NULL,               -- C-02: total propuesto mientras el cambio está pendiente
  elementos_afectados      JSON          NULL,                   -- CambioRequest.elementosAfectados
  fecha_propuesta          DATE          NULL,                   -- CambioRequest.fechaPropuesta
  necesario_para_continuar BOOLEAN       NOT NULL DEFAULT FALSE,
  estado                   ENUM('pendiente_decision','contrapropuesta_pendiente','aceptado',
                                'rechazado','no_aceptado','expirado') NOT NULL DEFAULT 'pendiente_decision',
  vence_en                 DATETIME      NOT NULL,               -- 24 h (RF-41-AC-5, RF-55-AC-5)
  parte_afectada_en_pausa  BOOLEAN       NOT NULL DEFAULT FALSE,
  pendiente_nuevo_acuerdo  BOOLEAN       NOT NULL DEFAULT FALSE,  -- C-02: RF-41-AC-3
  creado_en                DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_cambios_solicitud_id (solicitud_id, id),         -- destino de FK compuestas (R-10)
  KEY ix_cambios_solicitud (solicitud_id, creado_en),
  KEY ix_cambios_vencimiento (estado, vence_en),                 -- planificador
  CONSTRAINT fk_cambios_solicitud FOREIGN KEY (solicitud_id) REFERENCES solicitudes(id) ON DELETE CASCADE,
  CONSTRAINT ck_cambios_plazo CHECK (vence_en > creado_en),
  CONSTRAINT ck_cambios_fecha CHECK (tipo <> 'fecha' OR fecha_propuesta IS NOT NULL),
  CONSTRAINT ck_cambios_elementos CHECK (elementos_afectados IS NULL OR JSON_TYPE(elementos_afectados) = 'ARRAY'),
  CONSTRAINT ck_cambios_presupuesto CHECK (presupuesto_actualizado >= 0)
) ENGINE=InnoDB COMMENT='Cambio. OpenAPI: Cambio, CambioRequest';

-- ── C-03: evidencias de un cambio (CambioRequest.evidenciaAdjuntos) ────────
-- Cambio 0..* — 0..* Adjunto. Las FK compuestas exigen que el adjunto sea del
-- mismo proyecto que el cambio.
CREATE TABLE cambio_evidencias (
  cambio_id    CHAR(36) NOT NULL,
  adjunto_id   CHAR(36) NOT NULL,
  solicitud_id CHAR(36) NOT NULL,
  PRIMARY KEY (cambio_id, adjunto_id),
  KEY ix_camev_cambio (solicitud_id, cambio_id),
  KEY ix_camev_adjunto (solicitud_id, adjunto_id),
  CONSTRAINT fk_camev_cambio  FOREIGN KEY (solicitud_id, cambio_id)  REFERENCES cambios(solicitud_id, id)  ON DELETE CASCADE,
  CONSTRAINT fk_camev_adjunto FOREIGN KEY (solicitud_id, adjunto_id) REFERENCES adjuntos(solicitud_id, id) ON DELETE CASCADE
) ENGINE=InnoDB COMMENT='Evidencias de un cambio. OpenAPI: CambioRequest.evidenciaAdjuntos';

-- ── Contrapropuesta: Cambio 1 ◆ 0..* (RF-41-AC-6 a AC-8) ───────────────────
CREATE TABLE contrapropuestas (
  id              CHAR(36)      NOT NULL,
  cambio_id       CHAR(36)      NOT NULL,
  -- C-01: mismos campos que DecisionCambioRequest.contrapropuesta del contrato
  monto_adicional         DECIMAL(12,2) NOT NULL,                -- con signo (MontoConSigno)
  presupuesto_actualizado DECIMAL(12,2) NOT NULL,
  fecha_propuesta         DATE          NULL,
  comentario              VARCHAR(2000) NULL,
  estado          ENUM('pendiente','aceptada','rechazada','rechazada_automaticamente') NOT NULL DEFAULT 'pendiente',
  vence_en        DATETIME      NOT NULL,                        -- nuevo plazo de 24 h
  creada_en       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  -- R-15: una sola contrapropuesta pendiente por cambio (una ronda, RF-41).
  UNIQUE KEY uq_contra_pendiente ((CASE WHEN estado = 'pendiente' THEN cambio_id END)),
  KEY ix_contra_cambio (cambio_id),
  KEY ix_contra_vencimiento (estado, vence_en),
  CONSTRAINT fk_contra_cambio FOREIGN KEY (cambio_id) REFERENCES cambios(id) ON DELETE CASCADE,
  CONSTRAINT ck_contra_presupuesto CHECK (presupuesto_actualizado >= 0),
  CONSTRAINT ck_contra_plazo CHECK (vence_en > creada_en)
) ENGINE=InnoDB COMMENT='Contrapropuesta. OpenAPI: Contrapropuesta, DecisionCambioRequest.contrapropuesta';

-- ── AnalisisIA: Cambio 1 ◆ 0..1 (RF-42); los arreglos se guardan como JSON ─
CREATE TABLE analisis_ia (
  id              CHAR(36) NOT NULL,
  cambio_id       CHAR(36) NOT NULL,
  consistencias   JSON     NOT NULL,
  datos_faltantes JSON     NOT NULL,
  riesgos         JSON     NOT NULL,
  generado_en     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_analisis_cambio (cambio_id),
  CONSTRAINT fk_analisis_cambio FOREIGN KEY (cambio_id) REFERENCES cambios(id) ON DELETE CASCADE,
  CONSTRAINT ck_analisis_json CHECK (JSON_TYPE(consistencias) = 'ARRAY'
                                 AND JSON_TYPE(datos_faltantes) = 'ARRAY' AND JSON_TYPE(riesgos) = 'ARRAY')
) ENGINE=InnoDB COMMENT='AnalisisIA. OpenAPI: AnalisisIA';

-- ── VersionPresupuesto: Solicitud 1 ◆ 0..* (DC-09, RF-43, RF-44) ───────────
-- La versión 1 apunta a la VersionPropuesta aceptada; las siguientes, al
-- Cambio aceptado que las originó (exactamente uno de los dos).
CREATE TABLE versiones_presupuesto (
  id                        CHAR(36)      NOT NULL,
  solicitud_id              CHAR(36)      NOT NULL,
  numero                    SMALLINT UNSIGNED NOT NULL,
  total_anterior            DECIMAL(12,2) NOT NULL,
  total_actualizado         DECIMAL(12,2) NOT NULL,
  diferencia_contra_inicial DECIMAL(12,2) NOT NULL,              -- con signo
  version_propuesta_id      CHAR(36)      NULL,
  cambio_id                 CHAR(36)      NULL,
  creada_en                 DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_verpres_numero (solicitud_id, numero),
  UNIQUE KEY uq_verpres_version_propuesta (version_propuesta_id),
  UNIQUE KEY uq_verpres_cambio (cambio_id),
  CONSTRAINT fk_verpres_solicitud FOREIGN KEY (solicitud_id)         REFERENCES solicitudes(id)         ON DELETE CASCADE,
  CONSTRAINT fk_verpres_verprop   FOREIGN KEY (version_propuesta_id) REFERENCES versiones_propuesta(id) ON DELETE RESTRICT,
  -- R-10: el cambio que origina la versión debe ser del mismo proyecto.
  CONSTRAINT fk_verpres_cambio    FOREIGN KEY (solicitud_id, cambio_id) REFERENCES cambios(solicitud_id, id) ON DELETE RESTRICT,
  CONSTRAINT ck_verpres_origen CHECK ((version_propuesta_id IS NULL) <> (cambio_id IS NULL)),
  CONSTRAINT ck_verpres_inicial CHECK ((numero = 1) = (version_propuesta_id IS NOT NULL)),
  CONSTRAINT ck_verpres_totales CHECK (total_anterior >= 0 AND total_actualizado >= 0),
  CONSTRAINT ck_verpres_diferencia_inicial CHECK (numero <> 1 OR diferencia_contra_inicial = 0)
) ENGINE=InnoDB COMMENT='VersionPresupuesto. OpenAPI: VersionPresupuesto';

-- ── RegistroBitacora: Solicitud 1 ◆ 0..* (DC-12, RNF-12, RD-17) ────────────
-- Append-only: los triggers del final impiden UPDATE y DELETE. Las FK usan
-- RESTRICT para que la bitácora nunca pierda registros. Al anonimizar a un
-- usuario se conserva su fila (estado = 'anonimizada'), así que `autor_id`
-- sigue siendo válido.
CREATE TABLE registros_bitacora (
  id                   CHAR(36)    NOT NULL,
  solicitud_id         CHAR(36)    NOT NULL,
  autor_id             CHAR(36)    NOT NULL,
  entidad              ENUM('propuesta','cambio') NOT NULL,
  version_propuesta_id CHAR(36)    NULL,
  cambio_id            CHAR(36)    NULL,
  decision             ENUM('aceptacion','rechazo','contrapropuesta','ajuste_solicitado','expiracion') NOT NULL,
  fecha                DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  anterior_id          CHAR(36)    NULL,                         -- registro previo de la cadena
  corrige_registro_id  CHAR(36)    NULL,                         -- OpenAPI: corrigeRegistroId
  hash_encadenado      CHAR(64)    NOT NULL,                     -- SHA-256 hexadecimal
  PRIMARY KEY (id),
  UNIQUE KEY uq_bitacora_hash (hash_encadenado),
  UNIQUE KEY uq_bitacora_solicitud_id (solicitud_id, id),        -- destino de las autorreferencias (R-10)
  UNIQUE KEY uq_bitacora_anterior (anterior_id),                 -- la cadena no se bifurca
  KEY ix_bitacora_solicitud (solicitud_id, fecha),
  KEY ix_bitacora_autor (autor_id),
  KEY ix_bitacora_verprop (version_propuesta_id),
  KEY ix_bitacora_cambio (solicitud_id, cambio_id),
  KEY ix_bitacora_anterior (solicitud_id, anterior_id),
  KEY ix_bitacora_corrige (solicitud_id, corrige_registro_id),
  CONSTRAINT fk_bitacora_solicitud FOREIGN KEY (solicitud_id)         REFERENCES solicitudes(id)         ON DELETE RESTRICT,
  CONSTRAINT fk_bitacora_autor     FOREIGN KEY (autor_id)             REFERENCES usuarios(id)            ON DELETE RESTRICT,
  CONSTRAINT fk_bitacora_verprop   FOREIGN KEY (version_propuesta_id) REFERENCES versiones_propuesta(id) ON DELETE RESTRICT,
  -- R-10: el cambio, el registro anterior y el registro corregido deben ser del mismo proyecto.
  CONSTRAINT fk_bitacora_cambio    FOREIGN KEY (solicitud_id, cambio_id)           REFERENCES cambios(solicitud_id, id)            ON DELETE RESTRICT,
  CONSTRAINT fk_bitacora_anterior  FOREIGN KEY (solicitud_id, anterior_id)         REFERENCES registros_bitacora(solicitud_id, id) ON DELETE RESTRICT,
  CONSTRAINT fk_bitacora_corrige   FOREIGN KEY (solicitud_id, corrige_registro_id) REFERENCES registros_bitacora(solicitud_id, id) ON DELETE RESTRICT,
  CONSTRAINT ck_bitacora_no_ciclo CHECK ((anterior_id IS NULL OR anterior_id <> id)
                                     AND (corrige_registro_id IS NULL OR corrige_registro_id <> id)),
  CONSTRAINT ck_bitacora_entidad CHECK (
    (entidad = 'propuesta' AND version_propuesta_id IS NOT NULL AND cambio_id IS NULL)
    OR (entidad = 'cambio' AND cambio_id IS NOT NULL AND version_propuesta_id IS NULL)),
  CONSTRAINT ck_bitacora_hash CHECK (hash_encadenado REGEXP '^[0-9a-f]{64}$')
) ENGINE=InnoDB COMMENT='RegistroBitacora (append-only). OpenAPI: RegistroBitacora';

-- ############################################################################
-- 7. SEGUIMIENTO, MENSAJES Y EVALUACIONES
-- ############################################################################

-- ── MensajeCanal: Solicitud 1 ◆ 0..*; → 1 Usuario «emisor» (RF-46) ─────────
CREATE TABLE mensajes_canal (
  id           CHAR(36)      NOT NULL,
  solicitud_id CHAR(36)      NOT NULL,
  emisor_id    CHAR(36)      NOT NULL,
  contenido    VARCHAR(4000) NOT NULL,                           -- maxLength del contrato (R-06)
  enviado_en   DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  KEY ix_msgcanal_solicitud (solicitud_id, enviado_en),
  KEY ix_msgcanal_emisor (emisor_id),
  CONSTRAINT fk_msgcanal_solicitud FOREIGN KEY (solicitud_id) REFERENCES solicitudes(id) ON DELETE CASCADE,
  CONSTRAINT fk_msgcanal_emisor    FOREIGN KEY (emisor_id)    REFERENCES usuarios(id)    ON DELETE RESTRICT
) ENGINE=InnoDB COMMENT='MensajeCanal. OpenAPI: MensajeCanal';

-- ── SolicitudCierre: Solicitud 1 ◆ 0..* (RF-47, RF-48) ─────────────────────
-- Se crea con PATCH /solicitudes/{id}/estado hacia `terminado` (OA-16).
CREATE TABLE solicitudes_cierre (
  id                     CHAR(36)      NOT NULL,
  solicitud_id           CHAR(36)      NOT NULL,
  solicitada_en          DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  nota                   VARCHAR(1000) NULL,                     -- C-05: nota del prestador al marcar «terminado»
  respuesta              ENUM('confirmado','rechazado') NULL,
  descripcion_pendientes VARCHAR(2000) NULL,
  respondida_en          DATETIME      NULL,
  aviso_admin_en         DATETIME      NULL,                     -- aviso a las 72 h sin respuesta (RF-48)
  PRIMARY KEY (id),
  -- R-15: una sola solicitud de cierre abierta por proyecto.
  UNIQUE KEY uq_cierre_abierto ((CASE WHEN respondida_en IS NULL THEN solicitud_id END)),
  KEY ix_cierre_solicitud (solicitud_id, solicitada_en),
  KEY ix_cierre_sin_respuesta (respondida_en, solicitada_en),    -- planificador
  CONSTRAINT fk_cierre_solicitud FOREIGN KEY (solicitud_id) REFERENCES solicitudes(id) ON DELETE CASCADE,
  CONSTRAINT ck_cierre_respuesta CHECK ((respuesta IS NULL) = (respondida_en IS NULL)),
  CONSTRAINT ck_cierre_pendientes CHECK (respuesta IS NULL OR respuesta = 'confirmado' OR descripcion_pendientes IS NOT NULL)
) ENGINE=InnoDB COMMENT='SolicitudCierre. OpenAPI: Solicitud.solicitudCierre';

-- ── C-06: historial de estados del proyecto (Solicitud.historialEstados) ──
-- Solicitud 1 ◆ 0..*; → 1 Usuario «cambiado por». RF-45: el cliente ve los
-- estados en todo momento. La primera fila es «borrador».
CREATE TABLE historial_estados_solicitud (
  id           CHAR(36)    NOT NULL,
  solicitud_id CHAR(36)    NOT NULL,
  estado       ENUM('borrador','confirmada','programado','en_proceso','terminado','concluido') NOT NULL,
  cambiado_por CHAR(36)    NOT NULL,
  cambiado_en  DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  KEY ix_histest_solicitud (solicitud_id, cambiado_en),
  KEY ix_histest_usuario (cambiado_por),
  CONSTRAINT fk_histest_solicitud FOREIGN KEY (solicitud_id) REFERENCES solicitudes(id) ON DELETE CASCADE,
  CONSTRAINT fk_histest_usuario   FOREIGN KEY (cambiado_por) REFERENCES usuarios(id)    ON DELETE RESTRICT
) ENGINE=InnoDB COMMENT='CambioEstadoSolicitud. OpenAPI: Solicitud.historialEstados';

-- ── RevelacionDomicilio: Solicitud 1 ◆ 0..*; → 1 TrabajadorIndependiente ───
-- (RF-52, RF-24-AC-3, DC-15). R-02: el diagrama decía 0..1, pero si tras una
-- visita confirmada no hay acuerdo en 72 h (RF-39-AC-4) el cliente puede elegir
-- a otro trabajador, que también necesita la revelación. Se permite una por
-- trabajador y proyecto.
CREATE TABLE revelaciones_domicilio (
  id            CHAR(36) NOT NULL,
  solicitud_id  CHAR(36) NOT NULL,
  trabajador_id CHAR(36) NOT NULL,
  disparador    ENUM('propuesta_aceptada','visita_confirmada') NOT NULL,
  revelado_en   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_revdom_solicitud_trabajador (solicitud_id, trabajador_id),
  KEY ix_revdom_trabajador (trabajador_id),
  CONSTRAINT fk_revdom_solicitud  FOREIGN KEY (solicitud_id)  REFERENCES solicitudes(id) ON DELETE CASCADE,
  CONSTRAINT fk_revdom_trabajador FOREIGN KEY (trabajador_id)
    REFERENCES trabajadores_independientes(proveedor_id) ON DELETE RESTRICT
) ENGINE=InnoDB COMMENT='RevelacionDomicilio';

-- ── Evaluacion: Solicitud 1 ◆ 0..2 (una por dirección, DC-13, RF-49 a RF-51)
-- Embebe DimensionesEvaluacion (solo cliente → proveedor).
CREATE TABLE evaluaciones (
  id                CHAR(36)      NOT NULL,
  solicitud_id      CHAR(36)      NOT NULL,
  direccion         ENUM('cliente_a_proveedor','proveedor_a_cliente') NOT NULL,
  evaluador_id      CHAR(36)      NOT NULL,
  evaluado_id       CHAR(36)      NOT NULL,
  estado            ENUM('pendiente','registrada','publicada','vencida') NOT NULL DEFAULT 'pendiente',
  calificacion      DECIMAL(3,2)  NULL,                          -- 1 a 5; en cliente → proveedor, promedio de las 4 dimensiones
  puntualidad       TINYINT UNSIGNED NULL,
  calidad           TINYINT UNSIGNED NULL,
  limpieza          TINYINT UNSIGNED NULL,
  apego_presupuesto TINYINT UNSIGNED NULL,
  comentario        VARCHAR(1000) NULL,
  solicitada_en     DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  registrada_en     DATETIME      NULL,
  publicada_en      DATETIME      NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_eval_solicitud_direccion (solicitud_id, direccion),
  KEY ix_eval_evaluado (evaluado_id, estado),                    -- perfil público y promedio
  KEY ix_eval_evaluador (evaluador_id),
  KEY ix_eval_vencimiento (estado, solicitada_en),               -- publicación o vencimiento a los 7 días
  CONSTRAINT fk_eval_solicitud FOREIGN KEY (solicitud_id) REFERENCES solicitudes(id) ON DELETE CASCADE,
  CONSTRAINT fk_eval_evaluador FOREIGN KEY (evaluador_id) REFERENCES usuarios(id)    ON DELETE RESTRICT,
  CONSTRAINT fk_eval_evaluado  FOREIGN KEY (evaluado_id)  REFERENCES usuarios(id)    ON DELETE RESTRICT,
  CONSTRAINT ck_eval_partes CHECK (evaluador_id <> evaluado_id),
  CONSTRAINT ck_eval_calificacion CHECK (calificacion IS NULL OR calificacion BETWEEN 1 AND 5),
  CONSTRAINT ck_eval_dimensiones_rango CHECK (
    (puntualidad IS NULL OR puntualidad BETWEEN 1 AND 5) AND (calidad IS NULL OR calidad BETWEEN 1 AND 5)
    AND (limpieza IS NULL OR limpieza BETWEEN 1 AND 5) AND (apego_presupuesto IS NULL OR apego_presupuesto BETWEEN 1 AND 5)),
  CONSTRAINT ck_eval_dimensiones_direccion CHECK (
    direccion = 'cliente_a_proveedor'
    OR (puntualidad IS NULL AND calidad IS NULL AND limpieza IS NULL AND apego_presupuesto IS NULL)),
  CONSTRAINT ck_eval_registrada CHECK (estado IN ('pendiente','vencida')
    OR (calificacion IS NOT NULL AND registrada_en IS NOT NULL)),
  -- R-11: la evaluación del cliente exige las 4 dimensiones (RF-49; EvaluacionDeProveedorRequest.dimensiones es obligatorio)
  CONSTRAINT ck_eval_dimensiones_completas CHECK (direccion <> 'cliente_a_proveedor'
    OR estado IN ('pendiente','vencida')
    OR (puntualidad IS NOT NULL AND calidad IS NOT NULL AND limpieza IS NOT NULL AND apego_presupuesto IS NOT NULL)),
  CONSTRAINT ck_eval_publicada CHECK (estado <> 'publicada' OR publicada_en IS NOT NULL)
) ENGINE=InnoDB COMMENT='Evaluacion. OpenAPI: Evaluacion, SolicitudCalificacion';

-- ############################################################################
-- 8. REGLAS QUE EXIGEN TRIGGERS
--    Bitácora inalterable (RNF-12), máximo de imágenes (RF-18), franjas sin
--    traslape (RF-35) y partes de la evaluación (RD-13).
-- ############################################################################
DELIMITER $$

CREATE TRIGGER trg_bitacora_sin_update
BEFORE UPDATE ON registros_bitacora
FOR EACH ROW
BEGIN
  SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'registros_bitacora es append-only (RNF-12): registre una corrección nueva';
END$$

CREATE TRIGGER trg_bitacora_sin_delete
BEFORE DELETE ON registros_bitacora
FOR EACH ROW
BEGIN
  SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'registros_bitacora es append-only (RNF-12): no se permite borrar';
END$$

-- ── R-16: máximo 10 imágenes por proyecto (RF-18) ─────────────────────────
CREATE TRIGGER trg_adjuntos_max_imagenes
BEFORE INSERT ON adjuntos
FOR EACH ROW
BEGIN
  IF NEW.tipo = 'imagen' AND
     (SELECT COUNT(*) FROM adjuntos WHERE solicitud_id = NEW.solicitud_id AND tipo = 'imagen') >= 10 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El proyecto ya tiene 10 imágenes (RF-18)';
  END IF;
END$$

-- ── R-17: franjas bloqueadas sin traslape para un mismo prestador (RF-35) ──
-- La regla «prevalece la registrada primero» (RF-35-AC-3) requiere que el
-- servicio bloquee la fila del proveedor (SELECT … FOR UPDATE) antes de
-- confirmar; el trigger es la red de seguridad.
CREATE TRIGGER trg_franjas_sin_traslape_ins
BEFORE INSERT ON franjas_bloqueadas
FOR EACH ROW
BEGIN
  IF EXISTS (SELECT 1 FROM franjas_bloqueadas f
             WHERE f.proveedor_id = NEW.proveedor_id
               AND f.inicio < NEW.fin AND NEW.inicio < f.fin) THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'La franja se traslapa con otra ya bloqueada (RF-35)';
  END IF;
END$$

CREATE TRIGGER trg_franjas_sin_traslape_upd
BEFORE UPDATE ON franjas_bloqueadas
FOR EACH ROW
BEGIN
  IF EXISTS (SELECT 1 FROM franjas_bloqueadas f
             WHERE f.proveedor_id = NEW.proveedor_id AND f.id <> NEW.id
               AND f.inicio < NEW.fin AND NEW.inicio < f.fin) THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'La franja se traslapa con otra ya bloqueada (RF-35)';
  END IF;
END$$

-- ── R-18: solo evalúan las partes de un proyecto concluido (RD-13) ─────────
CREATE PROCEDURE validar_partes_evaluacion(
  IN p_solicitud CHAR(36), IN p_direccion VARCHAR(30),
  IN p_evaluador CHAR(36), IN p_evaluado CHAR(36))
BEGIN
  DECLARE v_cliente CHAR(36);
  DECLARE v_prestador CHAR(36);
  DECLARE v_estado VARCHAR(20);
  SELECT s.cliente_id, p.usuario_id, s.estado
    INTO v_cliente, v_prestador, v_estado
    FROM solicitudes s LEFT JOIN proveedores p ON p.id = s.proveedor_id
   WHERE s.id = p_solicitud;
  IF v_estado IS NULL OR v_estado <> 'concluido' THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Solo se evalúa un proyecto concluido (RD-13)';
  END IF;
  IF NOT ((p_direccion = 'cliente_a_proveedor' AND p_evaluador = v_cliente AND p_evaluado = v_prestador)
       OR (p_direccion = 'proveedor_a_cliente' AND p_evaluador = v_prestador AND p_evaluado = v_cliente)) THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Evaluador o evaluado no son las partes del proyecto (RD-13)';
  END IF;
END$$

CREATE TRIGGER trg_evaluaciones_partes_ins
BEFORE INSERT ON evaluaciones
FOR EACH ROW
BEGIN
  CALL validar_partes_evaluacion(NEW.solicitud_id, NEW.direccion, NEW.evaluador_id, NEW.evaluado_id);
END$$

CREATE TRIGGER trg_evaluaciones_partes_upd
BEFORE UPDATE ON evaluaciones
FOR EACH ROW
BEGIN
  IF NOT (NEW.evaluador_id <=> OLD.evaluador_id) OR NOT (NEW.evaluado_id <=> OLD.evaluado_id)
     OR NOT (NEW.direccion <=> OLD.direccion) OR NOT (NEW.solicitud_id <=> OLD.solicitud_id) THEN
    CALL validar_partes_evaluacion(NEW.solicitud_id, NEW.direccion, NEW.evaluador_id, NEW.evaluado_id);
  END IF;
END$$

DELIMITER ;

-- ############################################################################
-- 9. ATRIBUTOS DERIVADOS (vistas)
-- ############################################################################

-- Proveedor./calificacionPromedio: solo evaluaciones publicadas (RF-51-AC-2).
CREATE VIEW v_calificacion_proveedor AS
SELECT p.id                     AS proveedor_id,
       ROUND(AVG(e.calificacion), 2) AS calificacion_promedio,
       COUNT(e.id)              AS numero_evaluaciones
FROM proveedores p
LEFT JOIN evaluaciones e
       ON e.evaluado_id = p.usuario_id
      AND e.direccion   = 'cliente_a_proveedor'
      AND e.estado      = 'publicada'
GROUP BY p.id;

-- Proveedor./perfilCompleto: datos mínimos para aparecer en búsquedas.
-- R-05: trabajador = nombre, foto, oficio, años de experiencia y zona (RF-03-AC-1);
--       organización = nombre legal o comercial, representante, oficio y zona (RF-05-AC-1).
CREATE VIEW v_perfil_completo AS
SELECT p.id AS proveedor_id,
       (EXISTS (SELECT 1 FROM proveedor_oficios o WHERE o.proveedor_id = p.id)
        AND EXISTS (SELECT 1 FROM proveedor_zonas z WHERE z.proveedor_id = p.id)
        AND (EXISTS (SELECT 1 FROM trabajadores_independientes t
                     WHERE t.proveedor_id = p.id AND t.foto_clave IS NOT NULL AND t.anios_experiencia IS NOT NULL)
             OR EXISTS (SELECT 1 FROM organizaciones_contratistas g
                        WHERE g.proveedor_id = p.id AND g.representante_contacto IS NOT NULL))
       ) AS perfil_completo
FROM proveedores p;

-- SolicitudArco./porVencer: faltan 5 días o menos sin respuesta (aproximación
-- en días naturales; el cálculo en días hábiles lo hace el planificador).
CREATE VIEW v_arco_por_vencer AS
SELECT folio, usuario_id, fecha_limite,
       (respondida_en IS NULL AND DATEDIFF(fecha_limite, CURDATE()) <= 5) AS por_vencer
FROM solicitudes_arco;

-- RevelacionDomicilio./accesoHasta: 7 días después de la conclusión (RF-52-AC-4).
-- La fecha de conclusión es la última confirmación de cierre.
CREATE VIEW v_acceso_domicilio AS
SELECT r.id, r.solicitud_id, r.trabajador_id, r.disparador, r.revelado_en,
       (r.trabajador_id = s.proveedor_id) AS es_prestador_vigente,  -- RF-52-AC-5
       CASE WHEN s.estado = 'concluido'
            THEN DATE_ADD(c.confirmada_en, INTERVAL 7 DAY)
            ELSE NULL END AS acceso_hasta
FROM revelaciones_domicilio r
JOIN solicitudes s ON s.id = r.solicitud_id
LEFT JOIN (SELECT solicitud_id, MAX(respondida_en) AS confirmada_en
           FROM solicitudes_cierre
           WHERE respuesta = 'confirmado'
           GROUP BY solicitud_id) c ON c.solicitud_id = r.solicitud_id;

-- VersionPresupuesto./esInicial
CREATE VIEW v_versiones_presupuesto AS
SELECT vp.*, (vp.numero = 1) AS es_inicial
FROM versiones_presupuesto vp;

-- ############################################################################
-- 10. DATOS INICIALES
-- ############################################################################
INSERT INTO avisos_privacidad (version, contenido)
VALUES (1, 'Aviso de privacidad de UnCalificado, versión 1 (piloto Jalisco).');
