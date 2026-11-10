"""Fixtures de pytest contra una BD MySQL de prueba real.

Crea (o recrea) la base `<DB_NAME>_test` con db/schema.sql y la vacía entre pruebas.
Requiere un MySQL accesible con las credenciales del .env.
"""
import os
import pathlib

import pymysql
import pytest

from app import create_app
from app.services import usuarios_service

ROOT = pathlib.Path(__file__).resolve().parents[1]
TEST_DB = os.getenv("DB_NAME", "uncalificado") + "_test"
SECRET = "secreto-de-pruebas-0123456789abcdef0123456789"


def _conn(database=None):
    return pymysql.connect(
        host=os.getenv("DB_HOST", "localhost"), port=int(os.getenv("DB_PORT", "3306")),
        user=os.getenv("DB_USER", "uncalificado"), password=os.getenv("DB_PASSWORD", ""),
        database=database, charset="utf8mb4",
        client_flag=pymysql.constants.CLIENT.MULTI_STATEMENTS, autocommit=True,
    )


@pytest.fixture(scope="session", autouse=True)
def _schema():
    sql = (ROOT / "db" / "schema.sql").read_text(encoding="utf-8")
    sql = (sql.replace("CREATE DATABASE IF NOT EXISTS uncalificado", f"CREATE DATABASE IF NOT EXISTS {TEST_DB}")
              .replace("USE uncalificado;", f"USE {TEST_DB};"))
    with _conn() as c, c.cursor() as cur:
        cur.execute(f"DROP DATABASE IF EXISTS {TEST_DB}")
        cur.execute(sql)
        while cur.nextset():
            pass
    yield
    with _conn() as c, c.cursor() as cur:
        cur.execute(f"DROP DATABASE IF EXISTS {TEST_DB}")


@pytest.fixture()
def app():
    application = create_app({
        "TESTING": True, "DB_NAME": TEST_DB, "JWT_SECRET": SECRET,
        "JWT_EXPIRATION": "15m", "BCRYPT_ROUNDS": 4,
    })
    yield application
    with _conn(TEST_DB) as c, c.cursor() as cur:
        for tabla in ("casos_soporte", "solicitudes", "consentimientos", "usuarios"):
            cur.execute(f"DELETE FROM {tabla}")


@pytest.fixture()
def client(app):
    return app.test_client()


def registro(correo="ana@example.com", rol="cliente", **extra):
    body = {
        "nombre": "Ana López", "correo": correo, "contrasena": "contrasena-segura",
        "rol": rol, "aceptaAvisoPrivacidad": True, "versionAviso": 1, "declaraMayorDeEdad": True,
    }
    body.update(extra)
    return body


@pytest.fixture()
def login_as(client, app):
    """Crea un usuario con el rol indicado y devuelve sus encabezados Authorization."""
    def _login(rol="cliente", correo=None):
        correo = correo or f"{rol}@example.com"
        if rol == "administrador":
            with app.app_context():
                usuarios_service.crear("Admin", correo, "contrasena-segura", "administrador", True, 1)
        else:
            assert client.post("/api/auth/register", json=registro(correo, rol)).status_code == 201
        r = client.post("/api/auth/login", json={"correo": correo, "contrasena": "contrasena-segura"})
        assert r.status_code == 200, r.get_json()
        return {"Authorization": f"Bearer {r.get_json()['tokenAcceso']}"}
    return _login
