"""Middleware de seguridad.

- `token_required`: exige `Authorization: Bearer <token>` válido; si no, 401.
  Deja el usuario autenticado en `g.usuario` (leído de la BD, sin contraseña).
- `roles_required(*roles)`: además del token, exige uno de los roles; si no, 403 (RNF-04-AC-1).

Uso:
    @bp.get("/ruta")
    @roles_required("cliente", "administrador")
    def handler(): ...
"""
from functools import wraps

from flask import g, request

from ..auth.jwt_utils import TokenExpirado, TokenInvalido, verificar_token
from ..errors import forbidden, unauthorized
from ..services import usuarios_service


def _extraer_bearer() -> str:
    header = request.headers.get("Authorization", "")
    partes = header.split()
    if len(partes) != 2 or partes[0].lower() != "bearer" or not partes[1]:
        raise unauthorized()
    return partes[1]


def autenticar_peticion() -> dict:
    token = _extraer_bearer()
    try:
        claims = verificar_token(token)
    except TokenExpirado:
        raise unauthorized("TOKEN_EXPIRADO", "Tu sesión expiró. Inicia sesión de nuevo.")
    except TokenInvalido:
        raise unauthorized("TOKEN_INVALIDO", "Token inválido.")

    # El token puede seguir vigente aunque la cuenta se haya desactivado o eliminado:
    # se confirma contra la BD en cada petición.
    usuario = usuarios_service.obtener_por_id(claims["sub"])
    if usuario is None or not usuario["activo"]:
        raise unauthorized("TOKEN_INVALIDO", "Token inválido.")
    # Si el rol cambió en la BD, el token anterior ya no representa al usuario.
    if usuario["rol"] != claims["rol"]:
        raise unauthorized("TOKEN_INVALIDO", "Tu rol cambió. Inicia sesión de nuevo.")

    g.usuario = usuario
    g.token_claims = claims
    return usuario


def token_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        autenticar_peticion()
        return fn(*args, **kwargs)
    return wrapper


def roles_required(*roles):
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            usuario = autenticar_peticion()
            if usuario["rol"] not in roles:
                raise forbidden()
            return fn(*args, **kwargs)
        return wrapper
    return decorator
