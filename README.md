# UnCalificado

Marketplace de oficios para México: conecta a quien necesita un trabajo (albañilería, plomería, electricidad, etc.) con proveedores verificados, sin procesar pagos dentro de la aplicación.

Contrato de API (spec-first): [`contracts/openapi.yaml`](contracts/openapi.yaml). Trabajo pendiente: [`PLAN.md`](PLAN.md).

---

## 1. Descripción del proyecto

### Problema

Contratar un oficio de confianza en la Ciudad de México suele depender del “de boca en boca”, de anuncios opacos o de plataformas que mezclan publicidad, comisiones y datos personales. El cliente no ve con claridad quién está verificado, qué obra ha hecho ni en qué zona se mueve; el proveedor recibe contactos poco calificados y el domicilio exacto termina expuesto en chats o perfiles públicos.

### Valor que entrega

| Interesado | Valor |
|---|---|
| **Cliente** | Explora calificados y fotos de obra sin cuenta; contacta solo tras autenticarse; el domicilio exacto no se publica. |
| **Proveedor** | Perfil, portafolio, verificaciones y solicitudes acotadas a su zona; el pago se acuerda fuera de la app. |
| **Administrador** | Revisión de verificaciones y atención a derechos ARCO. |
| **Producto / operación** | API stateless con contrato OpenAPI 3.0.3, PostgreSQL como fuente transaccional y archivos vía URL temporal. |

UnCalificado **no cobra ni procesa pagos**. La IA, cuando existe, es informativa: no decide citas, propuestas ni revela domicilios.

Alcance actual del cliente web: índice público (zona + radio), ficha de calificado, autenticación (correo/OAuth), cuenta con preferencias de descubrimiento y flujos básicos de proyectos.

---

## 2. Arquitectura

### Diagrama de componentes

Vista del entorno local (Docker Compose): cliente → Vite → Flask → PostgreSQL, con JWT/RBAC, OAuth opcional y object store.

![Arquitectura local de UnCalificado](docs/architecture/uncalificado-architecture.png)

Archivos en el repo (visibles al clonar o en GitHub): [`PNG`](docs/architecture/uncalificado-architecture.png) · [`SVG`](docs/architecture/uncalificado-architecture.svg) · [HTML interactivo](docs/architecture/uncalificado-architecture.html)

### Descripción

1. **Cliente web ([`web/`](web/))** — SPA React servida por Vite en desarrollo. Habla con la API mediante proxy (`/api`, `/health`) para evitar CORS en local; en Compose el destino es el servicio `api`.
2. **API ([`app/`](app/))** — Flask + Gunicorn. Expone el contrato en `/api/v1` (y alias `/api`). Autenticación JWT (con `jti` revocable), OAuth opcional (Google, Facebook, TikTok), RBAC deny-by-default y rate limit en registro/login.
3. **PostgreSQL 16** — Fuente de verdad transaccional (usuarios, perfiles, solicitudes, citas, propuestas, mensajes, evaluaciones, verificaciones, bitácora). El esquema se versiona con Alembic.
4. **Object storage** — Los binarios no viven en la base; se guardan bajo `OBJECT_STORE_PATH` y se entregan con URL temporal firmada.
5. **Seed (perfil Compose)** — Carga cuentas y datos de demostración solo en entornos `development` / `test`.

Despliegue objetivo documentado en el contrato: API Gateway + Lambdas por capacidad. El entorno local actual empaqueta API, web y base con Docker Compose.

---

## 3. Stack tecnológico

| Tecnología | Versión | Propósito |
|---|---|---|
| Python | 3.12 (imagen Docker) | Runtime del backend |
| Flask | 3.1.0 | Framework HTTP de la API |
| Gunicorn | 23.0.0 | Servidor WSGI |
| SQLAlchemy | 2.0.37 | ORM / acceso a datos |
| Alembic | 1.14.1 | Migraciones de esquema |
| PostgreSQL | 16 (Alpine) | Base de datos transaccional |
| psycopg | 3.2.3 | Driver PostgreSQL |
| PyJWT | 2.10.1 | Emisión y validación de tokens |
| bcrypt | 4.2.1 | Hash de contraseñas |
| pydantic-settings | 2.7.1 | Configuración desde entorno |
| pytest | 8.3.4 | Pruebas automatizadas del backend |
| Node.js | 22 (imagen Docker) | Runtime del cliente web |
| React | 19.3.x | UI del cliente |
| React Router | 7.18.x | Enrutamiento SPA |
| TypeScript | 5.8.x | Tipado estático del front |
| Vite | 6.3.x | Bundler y servidor de desarrollo |
| Vitest + Testing Library | 3.2.x / 16.3.x | Pruebas unitarias del front |
| Docker Compose | 2.x+ | Orquestación local de db, api y web |
| OpenAPI | 3.0.3 | Contrato de la API |

---

## 4. Instalación y ejecución local

### Requisitos previos

- Git
- Docker y Docker Compose
- (Opcional) Node.js 22+ y Python 3.12+ si prefieres correr fuera de contenedores

### Paso a paso

1. **Clonar el repositorio**

```bash
git clone git@github.com:jesushl/un_calificado.git
cd un_calificado
```

2. **Configurar variables de entorno**

```bash
cp .env.example .env
```

Edita `.env` y define al menos `JWT_SECRET` con un valor largo y aleatorio. El resto puede quedarse con los valores de ejemplo para desarrollo.

3. **Construir e iniciar servicios**

Primera vez (o si cambian Dockerfiles / dependencias):

```bash
docker compose up -d --build
```

Uso diario (código montado; API y Vite recargan al guardar):

```bash
docker compose up -d
```

4. **Cargar datos de demostración**

```bash
docker compose --profile seed run --rm seed
```

5. **Verificar**

| Servicio | URL |
|---|---|
| Cliente web | http://localhost:5173 |
| API (salud) | http://localhost:8000/health |
| PostgreSQL | `localhost:5432` |

Cuentas demo (contraseña `DemoPass123!`):

- `demo.cliente@example.com`
- `demo.proveedor@example.com`
- `demo.admin@example.com`

Deben eliminarse o rotarse antes de un entorno compartido.

### Ejecución sin Docker (alternativa)

**Backend** (con PostgreSQL accesible según `DATABASE_URL`):

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
alembic upgrade head
gunicorn --bind 0.0.0.0:8000 --reload app.main:app
```

**Frontend**:

```bash
cd web
npm install
npm run dev
```

Guía visual: [`web/design/styleguide.html`](web/design/styleguide.html).

---

## 5. Guía de ejecución de pruebas

### Backend ([`tests/`](tests/))

Con dependencias instaladas y variables de entorno de prueba (SQLite en memoria vía fixtures):

```bash
pytest
```

O dentro del contenedor de la API:

```bash
docker compose exec api pytest
```

Cobertura actual: autenticación, plataforma, OAuth, exploración/geo, proveedores, solicitudes, contratación y privacidad ARCO.

### Cliente web

```bash
cd web
npm test
```

Pruebas E2E (Selenium; ver [`web/e2e/`](web/e2e/) y [`web/e2e/README.md`](web/e2e/README.md)). Requiere Compose arriba (`api` + `web`) y seed demo:

```bash
docker compose up -d
docker compose --profile seed run --rm seed
pip install -r web/e2e/requirements.txt
UX_BASE_URL=http://127.0.0.1:5173 pytest web/e2e
```

---

## 6. Variables de entorno

Valores reales **no** se documentan aquí. Usa `.env` local (no versionado). Referencia: [`.env.example`](.env.example).

| Variable | Obligatoria | Descripción |
|---|---|---|
| `APP_ENV` | No | Entorno lógico (`development`, `test`, …). El seed solo corre en development/test. |
| `DATABASE_URL` | Sí (API) | URL SQLAlchemy hacia PostgreSQL (o SQLite en pruebas). |
| `POSTGRES_DB` | Compose | Nombre de la base en el contenedor Postgres. |
| `POSTGRES_USER` | Compose | Usuario de Postgres. |
| `POSTGRES_PASSWORD` | Compose | Contraseña de Postgres. |
| `JWT_SECRET` | Sí | Secreto actual para firmar JWT. |
| `JWT_SECRET_PREVIOUS` | No | Secreto anterior para rotación sin cerrar sesiones de golpe. |
| `JWT_ALGORITHM` | No | Algoritmo JWT (por defecto `HS256`). |
| `JWT_EXPIRATION` | No | Vigencia del token en minutos. |
| `PASSWORD_MIN_LENGTH` | No | Longitud mínima de contraseña. |
| `AUTH_RATE_LIMIT` | No | Límite de intentos de registro/login. |
| `SIGNED_URL_TTL` | No | Segundos de validez de las URL temporales de archivos. |
| `OBJECT_STORE_PATH` | No | Ruta del almacenamiento de binarios. |
| `FRONTEND_ORIGIN` | No | Origen permitido del cliente web (CORS / redirects). |
| `OAUTH_REDIRECT_BASE` | No | Base pública de callbacks OAuth de la API. |
| `OAUTH_GOOGLE_CLIENT_ID` | No* | Cliente OAuth Google. |
| `OAUTH_GOOGLE_CLIENT_SECRET` | No* | Secreto OAuth Google. |
| `OAUTH_FACEBOOK_CLIENT_ID` | No* | Cliente OAuth Facebook. |
| `OAUTH_FACEBOOK_CLIENT_SECRET` | No* | Secreto OAuth Facebook. |
| `OAUTH_TIKTOK_CLIENT_KEY` | No* | Key OAuth TikTok. |
| `OAUTH_TIKTOK_CLIENT_SECRET` | No* | Secreto OAuth TikTok. |
| `API_PROXY_TARGET` | Compose web | Destino del proxy Vite (`http://api:8000` en Compose). |
| `CHOKIDAR_USEPOLLING` | Compose web | Activa polling de archivos en volúmenes Docker. |

\*Obligatorias solo si se habilita el proveedor OAuth correspondiente.

---

## 7. URL de la aplicación en producción

| Recurso | Estado |
|---|---|
| Dominio | **uncalificado.com** (registrado) |
| Despliegue público | **Aún no hay despliegue en producción** |
| Placeholder de API en contrato | `https://api.uncalificado.example.com/api/v1` (ejemplo OpenAPI; no operativo) |

Entorno local de desarrollo: http://localhost:5173 (web) y http://localhost:8000 (API).

---

## 8. Capturas de pantalla

Vistas principales del cliente web (entorno local con datos demo). Archivos en [`docs/screenshots/`](docs/screenshots/).

### Índice — descubrimiento por zona

![Índice: hero y zona de búsqueda](docs/screenshots/01-indice.png)

### Índice — calificados visibles

![Listado de calificados en el índice](docs/screenshots/02-indice-obra.png)

### Entrar

![Pantalla de inicio de sesión](docs/screenshots/03-entrar.png)

### Cuenta — radio de descubrimiento

![Preferencias de zona y distancia en Cuenta](docs/screenshots/04-cuenta.png)

### Ficha de calificado

![Perfil público de un proveedor verificado](docs/screenshots/05-ficha-calificado.png)
