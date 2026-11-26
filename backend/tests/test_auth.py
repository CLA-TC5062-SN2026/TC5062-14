"""Pruebas del módulo de autenticación y del middleware JWT."""
import time

import jwt

from app.auth import jwt_utils
from app.config import parse_duration

from .conftest import SECRET, TEST_DB, _conn, registro


# ── POST /api/auth/register ──────────────────────────────────────────────
def test_register_201_sin_contrasena(client):
    r = client.post("/api/auth/register", json=registro())
    assert r.status_code == 201
    body = r.get_json()
    assert body["correo"] == "ana@example.com"
    assert body["rol"] == "cliente"
    assert "contrasena" not in body and "contrasena_hash" not in body
    assert body["consentimientoVigente"]["versionAviso"] == 1
    assert r.headers["Location"] == "/api/auth/me"


def test_register_guarda_hash_bcrypt(client):
    client.post("/api/auth/register", json=registro())
    with _conn(TEST_DB) as c, c.cursor() as cur:
        cur.execute("SELECT contrasena_hash FROM usuarios WHERE correo='ana@example.com'")
        (h,) = cur.fetchone()
    assert h.startswith("$2b$") and "contrasena-segura" not in h


def test_register_correo_duplicado_409(client):
    client.post("/api/auth/register", json=registro())
    r = client.post("/api/auth/register", json=registro(correo="ANA@example.com"))
    assert r.status_code == 409
    assert r.get_json()["codigo"] == "CORREO_REGISTRADO"


def test_register_contrasena_corta_422(client):
    r = client.post("/api/auth/register", json=registro(contrasena="corta"))
    assert r.status_code == 422
    assert r.get_json()["errores"][0]["campo"] == "contrasena"


def test_register_rol_administrador_422(client):
    r = client.post("/api/auth/register", json=registro(rol="administrador"))
    assert r.status_code == 422
    assert r.get_json()["codigo"] == "ROL_NO_PERMITIDO"


def test_register_sin_consentimiento_422(client):
    r = client.post("/api/auth/register", json=registro(aceptaAvisoPrivacidad=False))
    assert r.status_code == 422
    assert r.get_json()["codigo"] == "CONSENTIMIENTO_REQUERIDO"


def test_register_campos_faltantes_identificados(client):
    r = client.post("/api/auth/register", json={"correo": "x"})
    assert r.status_code == 422
    campos = {e["campo"] for e in r.get_json()["errores"]}
    assert {"nombre", "correo", "contrasena", "rol"} <= campos


def test_register_json_invalido_400(client):
    r = client.post("/api/auth/register", data="no-json", content_type="application/json")
    assert r.status_code == 400


# ── POST /api/auth/login ─────────────────────────────────────────────────
def test_login_200_devuelve_jwt(client):
    client.post("/api/auth/register", json=registro())
    r = client.post("/api/auth/login", json={"correo": "ana@example.com", "contrasena": "contrasena-segura"})
    assert r.status_code == 200
    body = r.get_json()
    assert body["tipoToken"] == "Bearer" and body["expiraEn"] == 900
    claims = jwt.decode(body["tokenAcceso"], SECRET, algorithms=["HS256"])
    assert claims["sub"] == body["cuenta"]["id"]
    assert claims["rol"] == "cliente"
    assert claims["exp"] - claims["iat"] == 900


def test_login_contrasena_incorrecta_401(client):
    client.post("/api/auth/register", json=registro())
    r = client.post("/api/auth/login", json={"correo": "ana@example.com", "contrasena": "otra-contrasena"})
    assert r.status_code == 401
    assert r.get_json()["codigo"] == "CREDENCIALES_INVALIDAS"


def test_login_correo_inexistente_401_mismo_mensaje(client):
    client.post("/api/auth/register", json=registro())
    r1 = client.post("/api/auth/login", json={"correo": "nadie@example.com", "contrasena": "contrasena-segura"})
    r2 = client.post("/api/auth/login", json={"correo": "ana@example.com", "contrasena": "mala-contrasena"})
    assert r1.status_code == r2.status_code == 401
    assert r1.get_json() == r2.get_json()


def test_login_sin_campos_422(client):
    assert client.post("/api/auth/login", json={}).status_code == 422


# ── GET /api/auth/me y middleware ────────────────────────────────────────
def test_me_con_token(client, login_as):
    h = login_as("cliente")
    r = client.get("/api/auth/me", headers=h)
    assert r.status_code == 200
    assert r.get_json()["correo"] == "cliente@example.com"
    assert "contrasena_hash" not in r.get_json()


def test_me_sin_token_401(client):
    r = client.get("/api/auth/me")
    assert r.status_code == 401
    assert r.get_json()["codigo"] == "NO_AUTENTICADO"


def test_me_esquema_distinto_a_bearer_401(client, login_as):
    token = login_as()["Authorization"].split()[1]
    assert client.get("/api/auth/me", headers={"Authorization": f"Basic {token}"}).status_code == 401
    assert client.get("/api/auth/me", headers={"Authorization": token}).status_code == 401


def test_me_token_manipulado_401(client, login_as):
    token = login_as()["Authorization"].split()[1]
    alterado = token[:-3] + ("aaa" if token[-3:] != "aaa" else "bbb")
    r = client.get("/api/auth/me", headers={"Authorization": f"Bearer {alterado}"})
    assert r.status_code == 401 and r.get_json()["codigo"] == "TOKEN_INVALIDO"


def test_me_token_otro_secreto_401(client, login_as):
    login_as()
    falso = jwt.encode({"sub": "x", "rol": "administrador", "iat": int(time.time()),
                        "exp": int(time.time()) + 60}, "otro-secreto" * 4, algorithm="HS256")
    assert client.get("/api/auth/me", headers={"Authorization": f"Bearer {falso}"}).status_code == 401


def test_me_alg_none_401(client, login_as):
    login_as()
    sin_firma = jwt.encode({"sub": "x", "rol": "cliente", "iat": 1, "exp": 9999999999}, None, algorithm="none")
    assert client.get("/api/auth/me", headers={"Authorization": f"Bearer {sin_firma}"}).status_code == 401


def test_me_token_expirado_401(client, app, login_as):
    login_as()
    with app.app_context():
        app.config["JWT_EXPIRATION_SECONDS"] = 1
        user = client.get("/api/auth/me", headers=login_as(correo="b@example.com")).get_json()
        token, _ = jwt_utils.emitir_token({"id": user["id"], "rol": "cliente"}, 1)
    time.sleep(2)
    r = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert r.status_code == 401 and r.get_json()["codigo"] == "TOKEN_EXPIRADO"


def test_token_de_usuario_desactivado_401(client, login_as):
    h = login_as()
    with _conn(TEST_DB) as c, c.cursor() as cur:
        cur.execute("UPDATE usuarios SET activo = 0")
    assert client.get("/api/auth/me", headers=h).status_code == 401


def test_health_publico(client):
    assert client.get("/api/health").status_code == 200


# ── Configuración ────────────────────────────────────────────────────────
def test_parse_duration():
    assert parse_duration("900") == 900
    assert parse_duration("15m") == 900
    assert parse_duration("1h") == 3600
    assert parse_duration("1d") == 86400


def test_app_no_arranca_sin_secret():
    import pytest

    from app import create_app
    with pytest.raises(RuntimeError):
        create_app({"JWT_SECRET": ""})
    with pytest.raises(RuntimeError):
        create_app({"JWT_SECRET": "corto"})
