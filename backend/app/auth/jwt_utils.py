"""Emisión y verificación de JWT (HS256) con el secreto y la vigencia del .env."""
import time
import uuid

import jwt
from flask import current_app


class TokenExpirado(Exception):
    pass


class TokenInvalido(Exception):
    pass


def emitir_token(usuario: dict, aviso_version: int | None) -> tuple[str, int]:
    """Devuelve (token, segundos_de_vigencia).

    Claims según el contrato (securitySchemes.bearerAuth):
      sub (usuarioId), rol, avisoVersion, iat, exp; jti para trazabilidad.
    """
    cfg = current_app.config
    ahora = int(time.time())
    vigencia = cfg["JWT_EXPIRATION_SECONDS"]
    payload = {
        "sub": usuario["id"],
        "rol": usuario["rol"],
        "avisoVersion": aviso_version,
        "iat": ahora,
        "exp": ahora + vigencia,
        "jti": str(uuid.uuid4()),
    }
    token = jwt.encode(payload, cfg["JWT_SECRET"], algorithm=cfg["JWT_ALGORITHM"])
    return token, vigencia


def verificar_token(token: str) -> dict:
    cfg = current_app.config
    try:
        return jwt.decode(
            token,
            cfg["JWT_SECRET"],
            algorithms=[cfg["JWT_ALGORITHM"]],   # lista fija: evita el ataque alg=none / cambio de algoritmo
            options={"require": ["sub", "rol", "exp", "iat"]},
        )
    except jwt.ExpiredSignatureError as exc:
        raise TokenExpirado() from exc
    except jwt.InvalidTokenError as exc:
        raise TokenInvalido() from exc
