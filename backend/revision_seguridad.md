# Revisión de seguridad — módulo de autenticación JWT

**Proyecto:** UnCalificado — backend Flask + MySQL (`backend_uncalificado/`)
**Fecha:** 22 de octubre de 2026
**Alcance:** módulo de autenticación (`app/auth/`), middleware (`app/middleware/auth.py`), configuración (`app/config.py`, `.env.example`, `run.py`) y servicio de usuarios (`app/services/usuarios_service.py`).

## Método

1. Lectura del código con las cuatro preguntas de la revisión.
2. **Comprobación ejecutable** contra el servidor y una base MySQL real, *antes* de corregir: registro, login, tokens manipulados (payload alterado, firma truncada, otro secreto, `alg: none`, HS512, sin `exp`, expirado), arranque con configuraciones inseguras y medición del tiempo de respuesta del login.
3. Corrección de cada hallazgo y repetición de la misma comprobación *después*.
4. Pruebas de regresión en `tests/test_seguridad.py` (28 casos nuevos). Resultado final: **74/74 pruebas pasan**.

## Resumen

| # | Pregunta | Respuesta | Hallazgo |
|---|---|---|---|
| P1 | ¿El JWT tiene expiración explícita? | **Sí.** Todos los tokens llevan `exp` (15 min) y los que no lo traen se rechazan. | **H2**: la vigencia no tenía límite superior; `JWT_EXPIRATION=36500d` daba un token de 100 años. **Corregido.** |
| P2 | ¿`/register` devuelve la contraseña? | **No.** Ni la contraseña ni su hash aparecen en 201, 409 o 422. | Sin hallazgos. |
| P3 | ¿El middleware rechaza firma inválida o tokens expirados? | **Sí.** 401 `TOKEN_INVALIDO` en los 7 casos de manipulación y 401 `TOKEN_EXPIRADO` al vencer. | Sin hallazgos. |
| P4 | ¿El secreto está en código duro o en variable de entorno? | **En variable de entorno** (`os.getenv("JWT_SECRET")`), y la API no arranca sin él. | **H1**: el valor de ejemplo de `.env.example` era aceptado como secreto válido. **Corregido.** |
| — | Hallazgos adicionales | | **H3** (enumeración de correos por tiempo), **H4** (depurador expuesto en la red), **H5** (sin límite de tamaño del cuerpo). **Corregidos.** |

Severidad estimada: **H3 y H4 altas**, **H1 media-alta**, **H2 media**, **H5 baja**.

---

## P1. Expiración explícita del JWT

**Evidencia (correcto).**

- `app/auth/jwt_utils.py` → `emitir_token()` siempre agrega `"exp": ahora + vigencia` e `"iat": ahora`. La vigencia sale de `JWT_EXPIRATION` (por defecto `15m` = 900 s, como pide RNF-11).
- `verificar_token()` decodifica con `options={"require": ["sub", "rol", "exp", "iat"]}`: un token sin `exp` se rechaza aunque su firma sea válida.
- En la comprobación, un token recién emitido trae `exp - iat = 900`, y un token firmado con el secreto correcto pero **sin `exp`** recibe `401 TOKEN_INVALIDO`.

### H2 — La vigencia configurable no tenía tope · Media · Corregido

**Problema.** `parse_duration()` aceptaba cualquier valor positivo. Con `JWT_EXPIRATION=36500d` la API arrancaba y emitía tokens de 3 153 600 000 s (100 años). Formalmente esos tokens tienen `exp`, pero en la práctica equivalen a "sin expiración": si alguien roba un token, le sirve indefinidamente.

**Corrección** (`app/config.py`).

```python
JWT_EXPIRATION_MAX_SECONDS = 24 * 3600
...
segundos = parse_duration(cfg.get("JWT_EXPIRATION"))
if segundos > JWT_EXPIRATION_MAX_SECONDS:
    raise RuntimeError(f"JWT_EXPIRATION=... excede el máximo permitido (24 h). El contrato fija 15m.")
```

**Verificación.** `36500d`, `2d` y `86401` impiden arrancar. `0`, `-5`, `abc` y vacío también se rechazan (`test_p1_*`).

---

## P2. ¿`/register` devuelve la contraseña?

**Evidencia (correcto).**

- `usuarios_service.crear()` guarda solo `bcrypt.hashpw(...)` y devuelve el usuario con `obtener_por_id()`, cuya consulta (`_COLUMNAS`) **no selecciona** `contrasena_hash`.
- La respuesta se construye con `a_cuenta()`, que arma el objeto campo por campo (lista blanca): `id, nombre, correo, rol, consentimientoVigente, requiereAceptarAviso, creadaEn`.
- En el login, el hash se elimina del diccionario (`usuario.pop("contrasena_hash")`) antes de construir la respuesta.
- En la comprobación, ni la contraseña en claro ni el prefijo `$2b$` aparecen en las respuestas 201, 409 (correo duplicado), 422 (datos inválidos), `/login` ni `/me`. Los errores 500 devuelven un mensaje genérico, sin detalles internos.

**Sin hallazgos.** Las pruebas `test_p2_*` y `test_errores_500_no_filtran_detalles` lo fijan como regresión.

---

## P3. ¿El middleware rechaza firma inválida o tokens expirados?

**Evidencia (correcto).** `app/middleware/auth.py` exige `Authorization: Bearer <token>`. `jwt_utils.verificar_token()` usa una **lista fija** de algoritmos (`algorithms=["HS256"]`) y convierte `ExpiredSignatureError` en `401 TOKEN_EXPIRADO` y cualquier otro `InvalidTokenError` en `401 TOKEN_INVALIDO`. Después confirma en la BD que el usuario siga activo y con el mismo rol.

Resultado de la comprobación contra el servidor:

| Token enviado | Respuesta |
|---|---|
| Válido | 200 |
| Payload alterado (`rol: administrador`) con la firma original | 401 `TOKEN_INVALIDO` |
| Firma truncada | 401 `TOKEN_INVALIDO` |
| Firmado con otro secreto | 401 `TOKEN_INVALIDO` |
| `alg: none` (sin firma) | 401 `TOKEN_INVALIDO` |
| HS512 con el mismo secreto (confusión de algoritmo) | 401 `TOKEN_INVALIDO` |
| Sin `exp` | 401 `TOKEN_INVALIDO` |
| Expirado hace 1 s | 401 `TOKEN_EXPIRADO` |
| Cadena sin formato JWT | 401 `TOKEN_INVALIDO` |
| Sin encabezado, esquema `Basic`, o token en `?token=` | 401 `NO_AUTENTICADO` |
| Usuario desactivado o con rol cambiado en la BD | 401 `TOKEN_INVALIDO` |

**Sin hallazgos.** Lo cubren `test_p3_*` y las pruebas existentes de `test_auth.py`.

---

## P4. ¿Secreto en código duro o en variable de entorno?

**Evidencia (correcto).**

- `app/config.py` lee `JWT_SECRET = os.getenv("JWT_SECRET")`. Ningún archivo de `app/` contiene un secreto literal (`test_p4_no_hay_secretos_en_codigo_de_la_app` lo revisa en cada ejecución).
- `Config.validate()` impide arrancar si el secreto falta o tiene menos de 32 caracteres.
- `.env` está en `.gitignore`.
- El único secreto literal está en `tests/conftest.py` y solo firma tokens de la base de prueba temporal. Es aceptable.

### H1 — El valor de ejemplo de `.env.example` funcionaba como secreto real · Media-alta · Corregido

**Problema.** `.env.example` traía `JWT_SECRET=reemplaza_por_un_secreto_aleatorio_de_al_menos_32_caracteres`. Ese texto mide 61 caracteres, así que **pasaba la validación**. Quien hiciera `cp .env.example .env` y olvidara cambiarlo arrancaba la API con un secreto **público** (está en el repositorio). Con él, cualquiera puede firmar un token `{"rol": "administrador"}` válido. La comprobación lo confirmó: `create_app()` aceptó el valor.

**Corrección.**

1. `.env.example`: `JWT_SECRET=` queda **vacío**, con la instrucción para generar uno (`python -c "import secrets; print(secrets.token_hex(32))"`). Copiar la plantilla sin editarla ahora hace que la API no arranque.
2. `app/config.py`: además de la longitud mínima, se rechazan valores de ejemplo conocidos (`SECRETOS_DE_EJEMPLO`) y secretos con menos de 8 caracteres distintos (por ejemplo `"a" * 40`).

**Verificación.** El placeholder anterior, `"a"*40`, `"corto"` y la cadena vacía impiden arrancar (`test_p4_secretos_debiles_impiden_arrancar`). Además, `.env.example` ya no trae un secreto utilizable (`test_p4_env_example_no_trae_secreto_utilizable`).

---

## Hallazgos adicionales

### H3 — Enumeración de correos por tiempo de respuesta del login · Alta · Corregido

**Problema.** Para no revelar si un correo existe, el login compara contra un hash ficticio cuando el correo no está registrado. Ese hash se había generado con **costo 4**, mientras que los reales usan **costo 12**: unas 256 veces menos trabajo. El mensaje de error era idéntico, pero el tiempo no:

| | Correo inexistente | Correo registrado + contraseña incorrecta |
|---|---|---|
| **Antes** (BCRYPT_ROUNDS=12) | **31 ms** | **306 ms** |
| **Después** | 303 ms | 305 ms |

Midiendo la latencia, un atacante podía saber qué correos están registrados y concentrar en ellos un ataque de contraseñas. El README afirmaba que esto estaba protegido, y no era cierto. Las pruebas originales no lo detectaron porque corren con `BCRYPT_ROUNDS=4`, donde ambos tiempos coinciden.

**Corrección** (`app/services/usuarios_service.py`): el hash ficticio se genera con el **mismo costo configurado** (`current_app.config["BCRYPT_ROUNDS"]`) y se guarda en caché por costo.

**Verificación.** `test_h3_hash_ficticio_usa_el_mismo_costo` revisa el prefijo `$2b$<costo>$`. `test_h3_login_tarda_lo_mismo_exista_o_no_el_correo` mide ambos casos con costo 10 y exige una razón entre 0.5 y 2.

> **Nota:** `POST /api/auth/register` responde 409 `CORREO_REGISTRADO`, así que el registro también permite saber si un correo existe. Es una decisión del contrato (UX del registro), no un error de implementación; la mitigación es la limitación de intentos (ver Pendientes).

### H4 — Depurador de Werkzeug activo y expuesto en la red · Alta · Corregido

**Problema.** `.env.example` traía `FLASK_ENV=development`, y `run.py` activaba `debug=True` con ese valor y escuchaba en `host="0.0.0.0"`. Al copiar la plantilla, la API quedaba en modo depuración en **todas las interfaces de red**. La comprobación lo confirmó: `* Debugger is active!`, escucha en `0.0.0.0` y `GET /console → 200`. La consola de Werkzeug ejecuta código Python en el servidor. La protege un PIN, pero el PIN aparece en la salida del proceso y no está pensado como control de seguridad.

**Corrección.**

- `run.py`: `HOST` por defecto `127.0.0.1`. El depurador solo se activa con `FLASK_DEBUG=1` explícito, y **no se permite** si `HOST` no es loopback (el proceso termina con un mensaje).
- `.env.example`: `HOST=127.0.0.1`, `FLASK_DEBUG=0`. Se eliminó `FLASK_ENV`, que además está obsoleto en Flask 3.

**Verificación.** Con `FLASK_DEBUG=1` y `HOST=0.0.0.0`, `run.py` termina con código 1. `test_h4_*` fija los valores por defecto.

### H5 — Sin límite de tamaño del cuerpo · Baja · Corregido

**Problema.** No había `MAX_CONTENT_LENGTH`: un JSON de cientos de MB se leía completo en memoria antes de validarse. Era un vector de denegación de servicio, incluso en rutas públicas como `/register`.

**Corrección.** `MAX_CONTENT_LENGTH = 1 MB` en `Config`. Las peticiones mayores reciben **413**.

**Verificación.** `test_h5_cuerpo_demasiado_grande_413`.

---

## Aspectos revisados sin hallazgos

- **Inyección SQL:** todas las consultas usan parámetros `%s`. Las cuatro sentencias con *f-string* solo interpolan nombres de columna de listas fijas (`CAMPOS_EDITABLES`, `cliente_id`/`proveedor_id`), nunca valores del usuario.
- **Hash de contraseñas:** bcrypt con costo 12 y sal propia por usuario. Mínimo 10 caracteres (RNF-11-AC-1) y máximo 72 bytes, para evitar el truncamiento silencioso de bcrypt.
- **Mensajes de error:** 401 y 403 no incluyen datos del recurso (RNF-03-AC-1, RNF-04-AC-2). Los 500 no exponen excepciones ni configuración.
- **Autorización:** rol (`@roles_required`) y propiedad del recurso verificados en cada ruta CRUD (`test_rutas_protegidas.py`).

## Pendientes (fuera del alcance de esta actividad)

| Riesgo | Recomendación |
|---|---|
| Fuerza bruta contra `/login` y enumeración vía 409 en `/register` | Limitar intentos por IP y por correo (p. ej. Flask-Limiter: 5 intentos/min) y bloqueo temporal tras N fallos. |
| No hay revocación de tokens (no existe *logout*) | Implementar `DELETE /auth/sesion` con lista de `jti` revocados y token de renovación (RNF-11-AC-3). |
| El administrador entra sin segundo factor | Implementar `POST /auth/segundo-factor` (RNF-11-AC-2). |
| Transporte | Servir solo detrás de HTTPS (RE-09) con `Strict-Transport-Security`; agregar encabezados `X-Content-Type-Options: nosniff` y `Cache-Control: no-store` en respuestas de `/auth`. |
| Rotación del secreto | Soportar `kid` con dos secretos activos para rotar `JWT_SECRET` sin invalidar todas las sesiones de golpe. |

## Archivos modificados

| Archivo | Cambio |
|---|---|
| `app/config.py` | Tope de 24 h para `JWT_EXPIRATION`; rechazo de secretos de ejemplo o de baja variedad; `MAX_CONTENT_LENGTH`. |
| `app/services/usuarios_service.py` | Hash ficticio con el mismo costo bcrypt que los reales. |
| `run.py` | `HOST=127.0.0.1` por defecto; depurador solo con `FLASK_DEBUG=1` y en loopback. |
| `.env.example` | `JWT_SECRET` vacío, `HOST`, `FLASK_DEBUG=0`, máximo de vigencia documentado. |
| `tests/test_seguridad.py` | Nuevo: 28 pruebas de regresión de esta revisión. |
| `README.md` | Sección de seguridad corregida (la afirmación sobre el tiempo del login era falsa) y enlace a esta revisión. |
