"""CRUD de usuarios y lógica de credenciales (bcrypt)."""
import uuid

import bcrypt
import pymysql
from flask import current_app

from .. import db

# Hash ficticio para igualar el tiempo de respuesta cuando el correo no existe
# (evita enumerar correos registrados midiendo la latencia del login).
# Debe tener el MISMO costo que los hashes reales; si no, el login con un correo
# inexistente responde mucho más rápido y delata qué correos están registrados.
_DUMMY_HASHES: dict[int, bytes] = {}


def _dummy_hash() -> bytes:
    rounds = current_app.config["BCRYPT_ROUNDS"]
    if rounds not in _DUMMY_HASHES:
        _DUMMY_HASHES[rounds] = bcrypt.hashpw(b"dummy-password-uncalificado", bcrypt.gensalt(rounds=rounds))
    return _DUMMY_HASHES[rounds]

_COLUMNAS = "id, nombre, correo, rol, activo, creado_en"


class CorreoDuplicado(Exception):
    pass


def hash_contrasena(contrasena: str) -> str:
    rounds = current_app.config["BCRYPT_ROUNDS"]
    return bcrypt.hashpw(contrasena.encode("utf-8"), bcrypt.gensalt(rounds=rounds)).decode("utf-8")


def verificar_contrasena(contrasena: str, hash_guardado: str | None) -> bool:
    objetivo = hash_guardado.encode("utf-8") if hash_guardado else _dummy_hash()
    ok = bcrypt.checkpw(contrasena.encode("utf-8"), objetivo)
    return ok and hash_guardado is not None


def version_aviso_vigente() -> int | None:
    fila = db.query_one("SELECT MAX(version) AS v FROM avisos_privacidad")
    return fila["v"] if fila else None


def crear(nombre, correo, contrasena, rol, declara_mayor_edad, version_aviso) -> dict:
    usuario_id = str(uuid.uuid4())
    conn = db.get_db()
    try:
        with conn.cursor() as cur:
            cur.execute(
                "INSERT INTO usuarios (id, nombre, correo, contrasena_hash, rol, declara_mayor_edad) "
                "VALUES (%s, %s, %s, %s, %s, %s)",
                (usuario_id, nombre, correo, hash_contrasena(contrasena), rol, int(declara_mayor_edad)),
            )
            if version_aviso is not None:
                cur.execute(
                    "INSERT INTO consentimientos (id, usuario_id, version_aviso) VALUES (%s, %s, %s)",
                    (str(uuid.uuid4()), usuario_id, version_aviso),
                )
        conn.commit()
    except pymysql.err.IntegrityError as exc:
        conn.rollback()
        if exc.args and exc.args[0] == 1062:  # Duplicate entry
            raise CorreoDuplicado() from exc
        raise
    return obtener_por_id(usuario_id)


def obtener_por_id(usuario_id: str) -> dict | None:
    return db.query_one(f"SELECT {_COLUMNAS} FROM usuarios WHERE id = %s", (usuario_id,))


def obtener_con_hash_por_correo(correo: str) -> dict | None:
    return db.query_one(
        f"SELECT {_COLUMNAS}, contrasena_hash FROM usuarios WHERE correo = %s", (correo,)
    )


def consentimiento_vigente(usuario_id: str) -> dict | None:
    return db.query_one(
        "SELECT version_aviso, aceptado_en FROM consentimientos "
        "WHERE usuario_id = %s ORDER BY version_aviso DESC, aceptado_en DESC LIMIT 1",
        (usuario_id,),
    )


def a_cuenta(usuario: dict) -> dict:
    """Representación pública `Cuenta` (nunca incluye la contraseña ni su hash)."""
    consentimiento = consentimiento_vigente(usuario["id"])
    vigente = version_aviso_vigente()
    aceptada = consentimiento["version_aviso"] if consentimiento else None
    return {
        "id": usuario["id"],
        "nombre": usuario["nombre"],
        "correo": usuario["correo"],
        "rol": usuario["rol"],
        "consentimientoVigente": (
            {"versionAviso": aceptada, "aceptadoEn": consentimiento["aceptado_en"].isoformat()}
            if consentimiento else None
        ),
        "requiereAceptarAviso": vigente is not None and (aceptada is None or aceptada < vigente),
        "creadaEn": usuario["creado_en"].isoformat(),
    }
