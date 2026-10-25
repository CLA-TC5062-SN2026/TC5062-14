# S05_S06_A1 — Diseños técnicos compartidos del equipo

Esta carpeta convierte los diseños individuales de David, Israel, Jesús y Norman en los diseños técnicos compartidos del equipo. El diagrama de clases consolidado es el insumo directo del esquema de base de datos de la Parte 1.

| Paso de la actividad | Dónde se cumple |
|---|---|
| **1.** Reunir los `openapi.yaml`, los diagramas de arquitectura y los diagramas de clases individuales | `01_insumos/<integrante>/` |
| **2.** Consolidar la especificación OpenAPI (consenso, gaps y conflictos de nombre, método, cuerpo y códigos) y generar `openapi_equipo.yaml` con `x-acceptance-criteria` del `SRS_equipo.md` | `02_openapi/analisis_openapi.md` y `02_openapi/openapi_equipo.yaml` |
| **3.** Consolidar el diagrama de clases (consenso, gaps y conflictos de atributos y relaciones) | `03_diagrama_clases/analisis_diagrama_clases.md` y `diagrama_clases_equipo.puml` / `.png` |
| **4.** Consolidar la arquitectura a partir de los diagramas de componentes individuales | `04_arquitectura/arquitectura_equipo.md`, `arquitectura_equipo_componentes.puml` / `.png` y `arquitectura_equipo_despliegue.puml` / `.png` |
| **5.** Documentar qué aportó cada integrante, qué conflictos hubo y cómo se resolvieron | `diferencias_diseno.md` |
| **6.** Generar el esquema de base de datos a partir del diagrama de clases y del contrato | `05_base_datos/esquema_bd.sql` (con `esquema_bd.md` y `probar_esquema.py`) |
| **7.** Revisar el SQL con criterio propio y documentar las correcciones | `05_base_datos/revision_sql.md` |
| **8.** Generar el diagrama entidad-relación desde el SQL y sincronizar el diagrama de clases y el contrato | `05_base_datos/diagrama_er.puml` / `.png` (más `diagrama_er_compacto` y `er_por_modulo/`); `diagrama_clases_equipo.puml` y `openapi_equipo.yaml` v1.1.0 actualizados |

## Contenido

### 01_insumos (copias sin cambios)

| Integrante | OpenAPI | Arquitectura | Diagrama de clases |
|---|---|---|---|
| David | `openapi.yaml` (69 operaciones) | `decision_arquitectonica.md`, `diagrama_componentes.mmd`, `diagrama_despliegue.mmd`, `imagenes/` | `diagrama_clases.mmd` |
| Israel | `openapi.yaml` v0.2.0 (84 operaciones) | `decision_arquitectonica.md`, `arquitectura_02_contenedores`, `arquitectura_04_componentes_uml`, `arquitectura_05_despliegue` (`.puml` + `imagenes/`) | `diagrama_clases.puml` |
| Jesús | `openapi.yaml` (42 operaciones) | `diagrama_componentes.puml`, `diagrama_despliegue.puml`, `imagenes/` | `diagrama_clases.puml` |
| Norman | — (no entregó) | `decision_arquitectonica.md`, `diagrama_componentes.puml`, `diagrama_despliegue.puml`, `imagenes/` | `diagrama_clases.puml` |

### 02_openapi

- **`openapi_equipo.yaml`**: el contrato consolidado v1.0.0, con 88 operaciones en 69 rutas bajo `/api/v1`. Cubre los 183 criterios RF del SRS. Cada operación declara `x-acceptance-criteria` y `x-consolidacion` (estado, quién la propuso, decisión). Valida con `openapi-spec-validator`.
- **`openapi_equipo.yaml`** está en la v1.1.0, alineada con el esquema de base de datos (ver su descripción y `revision_sql.md` §6).
- **`analisis_openapi.md`**: el análisis de diferencias, con 18 consensos, 36 conflictos, 34 gaps adoptados y 18 operaciones descartadas, y las decisiones OA-G1 a OA-G6 y OA-01 a OA-27.

### 03_diagrama_clases

- **`diagrama_clases_equipo.puml` / `.png`**: el modelo del dominio consolidado, con 43 clases, atributos tipados y multiplicidades; está sincronizado con `esquema_bd.sql` v1.2. Colores: blanco = consenso, azul = conflicto resuelto, amarillo = gap adoptado.
- **`diagrama_clases_equipo_vista_general.puml` / `.png`**: la misma estructura sin atributos, para leer las relaciones.
- **`analisis_diagrama_clases.md`**: el análisis de diferencias (5 consensos, 23 conflictos, 9 gaps adoptados y 7 clases descartadas), las decisiones DC-01 a DC-15 y las reglas para pasar el modelo a tablas MySQL (Parte 1).

### 04_arquitectura

- **`arquitectura_equipo.md`**: la comparación de los cuatro diagramas de componentes y las decisiones AR-01 a AR-09. También incluye la correspondencia de módulos, las interfaces entre contenedores, los atributos de calidad y los riesgos.
- **`arquitectura_equipo_componentes.puml` / `.png`**: el diagrama definitivo (C4 de contenedores y componentes): cliente-servidor con un monolito modular de 12 módulos en tres capas.
- **`arquitectura_equipo_despliegue.puml` / `.png`**: el despliegue en un servidor con Docker Compose (proxy, api, planificador, db), más el almacenamiento de objetos y la gestión de secretos.

### 05_base_datos

- **`esquema_bd.sql`** (v1.2): el esquema MySQL 8. Tiene 42 tablas con PK, 70 llaves foráneas (13 compuestas), 32 restricciones `UNIQUE`, 69 `CHECK` y 106 índices, más 5 vistas para los atributos derivados y 7 triggers (bitácora inalterable, máximo de imágenes, franjas sin traslape, partes de la evaluación).
- **`diagrama_er.puml` / `.png`**: el diagrama entidad-relación completo, generado desde el SQL cargado con `generar_er.py`. `diagrama_er_compacto` muestra solo PK, FK y únicas, y `er_por_modulo/` tiene una vista por módulo, más fácil de leer.
- **`esquema_bd.md`**: la correspondencia entre clases y tablas, los tipos según el contrato, los índices, las diferencias con el contrato y la migración desde `schema.sql`.
- **`probar_esquema.py`**: una prueba de humo que recorre un flujo completo y comprueba que los datos inválidos se rechacen (97 de 97 correctas).
- **`revision_sql.md`**: la revisión crítica del SQL (entidades, atributos, FK, tipos y restricciones) las 18 correcciones aplicadas (R-01 a R-18) y la alineación con el contrato (C-01 a C-06).

### diferencias_diseno.md

Resume, para los tres artefactos, qué aportó cada integrante, qué conflictos aparecieron, cómo se resolvieron y qué decisiones debe validar el equipo.

## Pendientes para la reunión del equipo

1. Validar las decisiones que contradicen la mayoría o una versión individual:
   - OA-G1: rutas en español;
   - OA-18: anidamiento superficial;
   - DC-01: el rol como atributo;
   - DC-08: la propuesta con versiones;
   - AR-02: MySQL 8 en lugar de PostgreSQL.
2. Ajustar el backend del Sprint 1:
   - cambiar el prefijo de las rutas a `/api/v1`;
   - mover `GET /auth/me` a `GET /usuarios/yo`.
3. Preguntar al PO si la revelación del domicilio aplica a las organizaciones.
