# Estado verificable y ejecución de la Parte 2 / Parte 3

## Alcance de esta iteración

Se conservaron sin modificar los archivos recibidos de las Partes 0 y 1. Se añadió `backend/main.py`, una API Flask/PyMySQL para el **módulo de casos de soporte**, con las rutas que existen en `02_openapi/openapi_equipo.yaml`:

- `GET /api/v1/health`
- `POST /api/v1/casos-soporte`
- `GET /api/v1/casos-soporte`
- `GET /api/v1/casos-soporte/{casoId}`
- `PATCH /api/v1/casos-soporte/{casoId}`
- `DELETE /api/v1/casos-soporte/{casoId}`

**No se implementaron las restantes rutas del OpenAPI consolidado**. El código generado es un módulo demostrativo y no representa todavía la implementación integral de las 12 capacidades de la arquitectura. No se añadió seguridad, tal como permite la actividad, por lo que debe ejecutarse solo en entorno local.

## Requisitos

- Python 3.10+
- MySQL 8.0.16+ local
- `pip install -r backend/requirements.txt`

## Preparación

1. Crear/importar la base de datos con `mysql -u root -p < S05_S06_A1/05_base_datos/esquema_bd.sql`. **Atención:** verificar primero que la base no contenga información importante.
2. Importar datos de demostración con `mysql -u root -p < S05_S06_A1/06_pruebas/datos_demo.sql`.
3. Configurar las variables indicadas en `backend/.env.example` en el entorno o en la terminal. El ejemplo es informativo: este backend lee variables de entorno, no carga automáticamente el archivo `.env`.
4. Ejecutar `python backend/main.py` desde la raíz de este paquete.
5. En Postman, importar `S05_S06_A1/06_pruebas/coleccion_postman.json` y ejecutar los cinco requests **en el orden numerado**. El primer request captura `casoId` automáticamente.
6. Grabar la pantalla con Postman, en una toma continua de **máximo un minuto**, mostrando URL, body y status. Guardar como `S05_S06_A1/pruebas_postman.mp4`.
7. Confirmar en MySQL `SELECT * FROM casos_soporte;` después del POST y antes del DELETE, si se necesita evidencia adicional.

## Estado de verificación y riesgos

- Se validó localmente la sintaxis Python (`py_compile`) y el JSON de la colección de Postman.
- **No se ejecutó una prueba real de conexión MySQL ni una ejecución real de Postman** en este entorno; no hay servidor MySQL ni paquetes Flask/PyMySQL instalados, y la instalación de dependencias no fue posible por falta de acceso a red.
- El ZIP **no incluye un video**. No se debe declarar la Parte 3 completa sin grabar las pruebas reales.
- La ruta PATCH requiere `DEMO_ADMIN_ID` porque el SQL exige `atendido_por` para los estados `en_atencion` y `resuelto`.
- El contrato incluye controles de autenticación, pero la actividad excluye seguridad en esta entrega. La cabecera `X-Demo-User-Id` es un mecanismo **solo de demostración**, nunca debe usarse en producción.
- `revision_sql.md` del equipo conserva la revisión de SQL. Esta implementación nueva no se ha integrado aún con el backend previo de Sprint 1 ni verificado contra toda la especificación.

## Correcciones al código generado: revisión pendiente

Antes de calificar el módulo como terminado se debe ejecutar una prueba de integración real y comparar todas las respuestas con los schemas OpenAPI. No se consignan correcciones verificadas inexistentes.
