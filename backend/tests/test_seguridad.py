"""Pruebas de la revisión de seguridad (ver revision_seguridad.md).

Cada bloque responde una pregunta de la revisión o fija la corrección de un hallazgo.
"""
import base64
import json
import pathlib
import re
import statistics
import time

import jwt
import pytest

from app import create_app
from app.services import usuarios_service

from .conftest import SECRET, TEST_DB, registro

ROOT = pathlib.Path(__file__).resolve().parents[1]
BASE = {"DB_NAME": TEST_DB, "JWT_SECRET": SECRET}


def _login(client, correo="ana@example.com"):
    client.post("/api/auth/register", json=registro(correo))
    r = client.post("/api/auth/login", json={"correo": correo, "contrasena": "contrasena-segura"})
    return r.get_json()["tokenAcceso"]


def _me(client, token):
    r = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    return r.status_code, (r.get_json() or {}).get("codigo")


# ── P1. ¿El JWT tiene expiración explícita? ──────────────────────────────
def test_p1_token_emitido_trae_exp_igual_a_jwt_expiration(client):
    claims = jwt.decode(_login(client), SECRET, algorithms=["HS256"])
    assert "exp" in claims and claims["exp"] - claims["iat"] == 900


def test_p1_token_sin_exp_se_rechaza(client):
    claims = jwt.decode(_login(client), SECRET, algorithms=["HS256"])
    claims.pop("exp")
    assert _me(client, jwt.encode(claims, SECRET, algorithm="HS256")) == (401, "TOKEN_INVALIDO")


@pytest.mark.parametrize("valor", ["36500d", "2d", "86401"])
def test_p1_vigencia_excesiva_impide_arrancar(valor):           # corrección H2
    with pytest.raises(RuntimeError, match="excede"):
        create_app({**BASE, "JWT_EXPIRATION": valor})


@pytest.mark.parametrize("valor", ["0", "-5", "abc", ""])
def test_p1_vigencia_invalida_impide_arrancar(valor):
    with pytest.raises((RuntimeError, ValueError)):
        create_app({**BASE, "JWT_EXPIRATION": valor})


# ── P2. ¿/register devuelve la contraseña? ────────────────────────────────
@pytest.mark.parametrize("caso", ["ok", "duplicado", "invalido"])
def test_p2_register_nunca_devuelve_contrasena_ni_hash(client, caso):
    if caso == "duplicado":
        client.post("/api/auth/register", json=registro())
    body = registro(rol="otro") if caso == "invalido" else registro()
    r = client.post("/api/auth/register", json=body)
    texto = r.get_data(as_text=True)
    assert "contrasena-segura" not in texto
    assert "$2b$" not in texto and "contrasena_hash" not in texto
    if caso == "ok":
        assert r.status_code == 201
        assert set(r.get_json()) == {"id", "nombre", "correo", "rol", "consentimientoVigente",
                                     "requiereAceptarAviso", "creadaEn"}


def test_p2_login_y_me_tampoco_devuelven_hash(client):
    token = _login(client)
    r = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert "$2b$" not in r.get_data(as_text=True)


# ── P3. ¿El middleware rechaza firma inválida o tokens expirados? ─────────
def _alterar_payload(token, **cambios):
    h, p, s = token.split(".")
    payload = json.loads(base64.urlsafe_b64decode(p + "=="))
    payload.update(cambios)
    p2 = base64.urlsafe_b64encode(json.dumps(payload).encode()).rstrip(b"=").decode()
    return f"{h}.{p2}.{s}"


def test_p3_tokens_manipulados_se_rechazan(client):
    token = _login(client)
    claims = jwt.decode(token, SECRET, algorithms=["HS256"])
    casos = {
        "payload alterado (rol)": _alterar_payload(token, rol="administrador"),
        "payload alterado (exp)": _alterar_payload(token, exp=claims["exp"] + 10**6),
        "firma truncada": token[:-4],
        "otro secreto": jwt.encode(claims, "x" * 40, algorithm="HS256"),
        "alg none": jwt.encode(claims, None, algorithm="none"),
        "HS512 con el mismo secreto": jwt.encode(claims, SECRET, algorithm="HS512"),
        "basura": "abc.def.ghi",
    }
    for nombre, t in casos.items():
        assert _me(client, t) == (401, "TOKEN_INVALIDO"), nombre


def test_p3_token_expirado_se_rechaza(client):
    claims = jwt.decode(_login(client), SECRET, algorithms=["HS256"])
    claims["exp"] = int(time.time()) - 1
    assert _me(client, jwt.encode(claims, SECRET, algorithm="HS256")) == (401, "TOKEN_EXPIRADO")


def test_p3_token_en_query_string_no_se_acepta(client):
    token = _login(client)
    assert client.get(f"/api/auth/me?token={token}").status_code == 401


# ── P4. ¿El secreto está en código duro o en variable de entorno? ─────────
def test_p4_no_hay_secretos_en_codigo_de_la_app():
    patron = re.compile(r"JWT_SECRET\s*=\s*['\"][^'\"]+['\"]")
    for archivo in (ROOT / "app").rglob("*.py"):
        assert not patron.search(archivo.read_text(encoding="utf-8")), archivo
    assert 'os.getenv("JWT_SECRET")' in (ROOT / "app" / "config.py").read_text(encoding="utf-8")


def test_p4_env_example_no_trae_secreto_utilizable():           # corrección H1
    lineas = (ROOT / ".env.example").read_text(encoding="utf-8").splitlines()
    assert "JWT_SECRET=" in lineas


@pytest.mark.parametrize("secreto", [
    "reemplaza_por_un_secreto_aleatorio_de_al_menos_32_caracteres",   # placeholder anterior
    "a" * 40,                                                          # sin variedad
    "corto",
    "",
])
def test_p4_secretos_debiles_impiden_arrancar(secreto):          # corrección H1
    with pytest.raises(RuntimeError):
        create_app({**BASE, "JWT_SECRET": secreto})


def test_p4_env_esta_en_gitignore():
    assert ".env" in (ROOT / ".gitignore").read_text().splitlines()


# ── Hallazgos adicionales ────────────────────────────────────────────────
def test_h3_hash_ficticio_usa_el_mismo_costo(app):               # corrección H3
    for rounds in (4, 10):
        app.config["BCRYPT_ROUNDS"] = rounds
        with app.app_context():
            assert usuarios_service._dummy_hash().startswith(f"$2b${rounds:02d}$".encode())


def test_h3_login_tarda_lo_mismo_exista_o_no_el_correo(app, client):
    app.config["BCRYPT_ROUNDS"] = 10        # costo suficiente para medir la diferencia
    client.post("/api/auth/register", json=registro())

    def mediana(correo):
        xs = []
        for _ in range(5):
            t0 = time.perf_counter()
            client.post("/api/auth/login", json={"correo": correo, "contrasena": "mala-contrasena"})
            xs.append(time.perf_counter() - t0)
        return statistics.median(xs)

    inexistente, existente = mediana("nadie@example.com"), mediana("ana@example.com")
    assert 0.5 < inexistente / existente < 2.0, (inexistente, existente)


def test_h4_run_py_no_activa_debug_ni_expone_red_por_defecto():  # corrección H4
    codigo = (ROOT / "run.py").read_text(encoding="utf-8")
    assert 'os.getenv("HOST", "127.0.0.1")' in codigo
    assert 'os.getenv("FLASK_DEBUG") == "1"' in codigo
    assert "FLASK_DEBUG=0" in (ROOT / ".env.example").read_text(encoding="utf-8")


def test_h5_cuerpo_demasiado_grande_413(client):                 # corrección H5
    r = client.post("/api/auth/register", data="x" * (2 * 1024 * 1024), content_type="application/json")
    assert r.status_code == 413


def test_errores_500_no_filtran_detalles(app, client, monkeypatch):
    def falla(*_a, **_k):
        raise RuntimeError("password=supersecreta host=db-interno")
    monkeypatch.setattr(usuarios_service, "obtener_con_hash_por_correo", falla)
    r = client.post("/api/auth/login", json={"correo": "a@b.mx", "contrasena": "x"})
    assert r.status_code == 500 and "supersecreta" not in r.get_data(as_text=True)
