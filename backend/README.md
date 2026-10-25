# UnCalificado — Backend (Flask + MySQL + JWT)

API REST del MVP de UnCalificado. Implementa servicios CRUD conectados a MySQL y un módulo de
autenticación con JWT: solo los usuarios autenticados consumen los servicios y, cuando el contrato
lo pide (`x-roles` en `openapi.yaml`), solo los usuarios con el rol correcto y dueños del recurso.

## Estructura

```
backend_uncalificado/
├── app/
│   ├── __init__.py            # create_app(): registra blueprints y manejadores de error
│   ├── config.py              # lee .env (JWT_SECRET, JWT_EXPIRATION, BD) y valida al arrancar
│   ├── db.py                  # conexión PyMySQL por petición
│   ├── errors.py              # formato de error del contrato {codigo, mensaje, errores}
│   ├── validation.py          # validación de entrada → 422 con cada campo identificado
│   ├── auth/
│   │   ├── routes.py          # POST /api/auth/register · POST /api/auth/login · GET /api/auth/me
│   │   └── jwt_utils.py       # emisión y verificación del JWT (HS256)
│   ├── middleware/
│   │   └── auth.py            # @token_required (401) y @roles_required(...) (403)
│   ├── services/              # acceso a datos (SQL parametrizado)
│   │   ├── usuarios_service.py    # bcrypt, cuentas, consentimientos
│   │   ├── solicitudes_service.py
│   │   └── casos_service.py
│   └── routes/                # servicios REST protegidos
│       ├── solicitudes.py
│       └── casos_soporte.py
├── db/schema.sql              # esquema MySQL 8
├── scripts/crear_admin.py     # aprovisiona administradores (el registro público no lo permite)
├── tests/                     # 74 pruebas pytest contra MySQL real
├── openapi.yaml               # contrato v0.2.0 (rutas /api/auth/*)
├── revision_seguridad.md      # revisión de seguridad: hallazgos y correcciones
├── .env.example
└── requirements.txt
```

## Puesta en marcha

Requisitos: Python 3.10+ y MySQL 8 (o MariaDB 10.6+).

```bash
python -m venv .venv
source .venv/bin/activate            # Windows: .venv\Scripts\activate
pip install -r requirements.txt

# 1. Base de datos
mysql -u root -p < db/schema.sql
mysql -u root -p -e "CREATE USER 'uncalificado'@'localhost' IDENTIFIED BY 'tu_contrasena';
                     GRANT ALL ON uncalificado.* TO 'uncalificado'@'localhost';
                     GRANT ALL ON uncalificado_test.* TO 'uncalificado'@'localhost';"

# 2. Variables de entorno
cp .env.example .env
python -c "import secrets; print(secrets.token_hex(32))"   # pega el resultado en JWT_SECRET
# edita DB_PASSWORD en .env

# 3. (Opcional) crear un administrador
python scripts/crear_admin.py "Admin" admin@uncalificado.mx "ContrasenaSegura123"

# 4. Levantar la API en http://localhost:5000
python run.py
```

La API **no arranca** si `JWT_SECRET` falta, tiene menos de 32 caracteres o es un valor de ejemplo.
`JWT_EXPIRATION` acepta segundos (`900`) o sufijos (`15m`, `1h`); el máximo es 24 h.
Por defecto el servidor escucha solo en `127.0.0.1` y sin depurador (`HOST`, `FLASK_DEBUG` en `.env`).

## Endpoints

| Método | Ruta | Acceso |
|---|---|---|
| GET | `/api/health` | pública |
| POST | `/api/auth/register` | pública → **201** con la cuenta (sin contraseña) |
| POST | `/api/auth/login` | pública → **200** con `tokenAcceso` · **401** si las credenciales no son válidas |
| GET | `/api/auth/me` | token |
| POST | `/api/solicitudes` | cliente |
| GET | `/api/solicitudes` | cliente (las suyas) · trabajador/organización (asociadas) |
| GET | `/api/solicitudes/{id}` | dueño · proveedor asociado · administrador |
| PATCH | `/api/solicitudes/{id}` | cliente dueño, solo en `borrador` (si no, 409) |
| DELETE | `/api/solicitudes/{id}` | cliente dueño, solo en `borrador` |
| POST | `/api/casos-soporte` | cliente |
| GET | `/api/casos-soporte` | administrador |
| GET | `/api/casos-soporte/{id}` | cliente dueño · administrador |
| PATCH / DELETE | `/api/casos-soporte/{id}` | administrador |

Respuestas de seguridad:

- **401** `NO_AUTENTICADO`: no hay encabezado `Authorization: Bearer <token>`.
- **401** `TOKEN_INVALIDO`: firma alterada, otro secreto, `alg: none`, usuario desactivado o rol cambiado.
- **401** `TOKEN_EXPIRADO`: pasó la vigencia (`exp`).
- **403** `ACCESO_DENEGADO`: el rol no está permitido o el recurso pertenece a otro usuario. No incluye datos del recurso.

## Ejemplo rápido (curl)

```bash
B=http://localhost:5000/api

curl -X POST $B/auth/register -H 'Content-Type: application/json' -d '{
  "nombre":"Ana López","correo":"ana@demo.mx","contrasena":"contrasena-123","rol":"cliente",
  "aceptaAvisoPrivacidad":true,"versionAviso":1,"declaraMayorDeEdad":true}'

TOKEN=$(curl -s -X POST $B/auth/login -H 'Content-Type: application/json' \
  -d '{"correo":"ana@demo.mx","contrasena":"contrasena-123"}' | python -c "import sys,json;print(json.load(sys.stdin)['tokenAcceso'])")

curl $B/auth/me -H "Authorization: Bearer $TOKEN"

curl -X POST $B/solicitudes -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' -d '{
  "resultadoEsperado":"Pintar la recámara","oficio":"pintura",
  "zona":{"municipio":"guadalajara","colonia":"Americana"}}'
```

## Pruebas

```bash
pytest -q
```

Las pruebas crean y eliminan la base `uncalificado_test` con las credenciales del `.env`.
Cubren registro (hash bcrypt, duplicados, validaciones, rol administrador bloqueado), login (200/401
con el mismo mensaje exista o no el correo), `/me`, el middleware (sin token, esquema distinto a Bearer,
token alterado, otro secreto, `alg: none`, token expirado, usuario desactivado) y el control por rol y
propiedad en todas las rutas CRUD.

## Decisiones de seguridad

- Contraseñas con **bcrypt** (costo configurable con `BCRYPT_ROUNDS`, 12 por defecto); mínimo 10 caracteres (RNF-11) y máximo 72 bytes (límite de bcrypt).
- El login hace la comparación bcrypt aunque el correo no exista, con un hash ficticio del mismo costo, para no revelar qué correos están registrados por diferencia de tiempo.
- El JWT siempre lleva `exp`; los tokens sin `exp` se rechazan y la vigencia configurable tiene un máximo de 24 h.
- El JWT se verifica con una lista fija de algoritmos (`HS256`), así que se rechazan tokens `alg: none` o firmados con otro algoritmo.
- El secreto solo vive en `.env` (no versionado); valores vacíos, cortos o de ejemplo impiden arrancar.
- El depurador de Werkzeug está apagado por defecto y no puede activarse si el servidor escucha en la red.
- Cuerpos de petición limitados a 1 MB.

Detalle de la revisión en [`revision_seguridad.md`](revision_seguridad.md).
- En cada petición se vuelve a leer el usuario de la BD: un token vigente deja de servir si la cuenta se desactiva o cambia de rol.
- Todo el SQL usa parámetros (`%s`); no se concatenan valores del usuario.

## Pendiente respecto al contrato

- Segundo factor del administrador (`/auth/segundo-factor`, RNF-11-AC-2): hoy el administrador recibe el token directamente.
- Renovación de sesión y cierre por inactividad (`/auth/renovacion`, `/auth/sesion`, RNF-11-AC-3).
- `Idempotency-Key` en los POST (RNF-13) y el resto de recursos del contrato.
