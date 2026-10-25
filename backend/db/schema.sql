-- ============================================================================
-- UnCalificado — Esquema de base de datos (MySQL 8.x)
-- Fuente: openapi.yaml (components/schemas) y SRS_equipo.md
--
-- Uso:
--   mysql -u root -p < db/schema.sql
-- Crea la base `uncalificado` (si no existe) y sus tablas.
-- Los identificadores son UUID v4 generados por la aplicación (CHAR(36)).
-- ============================================================================

CREATE DATABASE IF NOT EXISTS uncalificado
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE uncalificado;

-- ── Avisos de privacidad (RF-02) ──────────────────────────────────────────
-- La versión vigente es la de mayor número.
CREATE TABLE IF NOT EXISTS avisos_privacidad (
  version      INT          NOT NULL,
  contenido    TEXT         NOT NULL,
  publicado_en DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (version)
) ENGINE=InnoDB;

-- ── Usuarios / cuentas (RF-01, RNF-11) ────────────────────────────────────
-- La contraseña se guarda únicamente como hash bcrypt (60 caracteres).
CREATE TABLE IF NOT EXISTS usuarios (
  id                CHAR(36)     NOT NULL,
  nombre            VARCHAR(120) NOT NULL,
  correo            VARCHAR(254) NOT NULL,
  contrasena_hash   CHAR(60)     NOT NULL,
  rol               ENUM('cliente','trabajador','organizacion','administrador') NOT NULL,
  declara_mayor_edad TINYINT(1)  NOT NULL DEFAULT 0,
  activo            TINYINT(1)   NOT NULL DEFAULT 1,
  creado_en         DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_usuarios_correo (correo)
) ENGINE=InnoDB;

-- ── Consentimientos del aviso de privacidad (RF-02-AC-1, RF-02-AC-2) ──────
CREATE TABLE IF NOT EXISTS consentimientos (
  id            CHAR(36)  NOT NULL,
  usuario_id    CHAR(36)  NOT NULL,
  version_aviso INT       NOT NULL,
  aceptado_en   DATETIME  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY ix_consent_usuario (usuario_id),
  CONSTRAINT fk_consent_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  CONSTRAINT fk_consent_aviso   FOREIGN KEY (version_aviso) REFERENCES avisos_privacidad(version)
) ENGINE=InnoDB;

-- ── Solicitudes (RF-16, RF-20, RF-21, RF-45) ──────────────────────────────
CREATE TABLE IF NOT EXISTS solicitudes (
  id                 CHAR(36)      NOT NULL,
  cliente_id         CHAR(36)      NOT NULL,
  proveedor_id       CHAR(36)      NULL,
  estado             ENUM('borrador','confirmada','programado','en_proceso','terminado','concluido')
                                   NOT NULL DEFAULT 'borrador',
  origen             ENUM('manual','agente') NOT NULL DEFAULT 'manual',
  resultado_esperado VARCHAR(2000) NOT NULL,
  oficio             ENUM('albanileria','plomeria','electricidad','carpinteria','herreria','pintura',
                          'pisos_azulejos','vidrieria_canceleria','tablaroca','impermeabilizacion') NOT NULL,
  municipio          ENUM('guadalajara','zapopan','san_pedro_tlaquepaque','tonala',
                          'tlajomulco_de_zuniga','el_salto') NOT NULL,
  colonia            VARCHAR(120)  NOT NULL,
  tipo_trabajo       VARCHAR(200)  NULL,
  fecha_deseada      DATE          NULL,
  descripcion        VARCHAR(4000) NULL,
  medidas            VARCHAR(500)  NULL,
  materiales         VARCHAR(1000) NULL,
  creada_en          DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizada_en     DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY ix_solicitudes_cliente (cliente_id),
  KEY ix_solicitudes_proveedor (proveedor_id),
  KEY ix_solicitudes_estado (estado),
  CONSTRAINT fk_sol_cliente   FOREIGN KEY (cliente_id)   REFERENCES usuarios(id),
  CONSTRAINT fk_sol_proveedor FOREIGN KEY (proveedor_id) REFERENCES usuarios(id)
) ENGINE=InnoDB;

-- ── Casos de soporte humano (RF-22) ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS casos_soporte (
  id             CHAR(36)      NOT NULL,
  cliente_id     CHAR(36)      NOT NULL,
  solicitud_id   CHAR(36)      NULL,
  motivo         ENUM('agente_no_comprende','oficio_no_clasificado','ia_no_resolvio','otro') NOT NULL,
  comentario     VARCHAR(2000) NULL,
  estado         ENUM('pendiente','en_atencion','resuelto') NOT NULL DEFAULT 'pendiente',
  atendido_por   CHAR(36)      NULL,
  notas          VARCHAR(4000) NULL,
  creado_en      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY ix_casos_estado (estado),
  CONSTRAINT fk_caso_cliente   FOREIGN KEY (cliente_id)   REFERENCES usuarios(id),
  CONSTRAINT fk_caso_solicitud FOREIGN KEY (solicitud_id) REFERENCES solicitudes(id) ON DELETE SET NULL,
  CONSTRAINT fk_caso_admin     FOREIGN KEY (atendido_por) REFERENCES usuarios(id)
) ENGINE=InnoDB;

-- ── Datos iniciales ───────────────────────────────────────────────────────
INSERT IGNORE INTO avisos_privacidad (version, contenido)
VALUES (1, 'Aviso de privacidad de UnCalificado, versión 1 (piloto Jalisco).');
