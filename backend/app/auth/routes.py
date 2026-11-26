"""Módulo de autenticación: /api/auth/register, /api/auth/login, /api/auth/me."""
from flask import Blueprint, g, jsonify

from ..errors import ApiError, conflict, unauthorized, validation
from ..middleware.auth import token_required
from ..services import usuarios_service
from ..validation import ROLES, Validator, json_body
from .jwt_utils import emitir_token

bp = Blueprint("auth", __name__, url_prefix="/api/auth")


@bp.post("/register")
def register():
    """Registro público. Devuelve 201 con la `Cuenta` creada (sin contraseña)."""
    data = json_body()
    v = Validator(data)
    nombre = v.string("nombre", required=True, max_len=120)
    correo = v.email("correo")
    contrasena = data.get("contrasena")
    if not isinstance(contrasena, str) or contrasena == "":
        v.error("contrasena", "Es obligatoria.")
    elif len(contrasena) < 10:
        v.error("contrasena", "Debe tener al menos 10 caracteres.")      # RNF-11-AC-1
    elif len(contrasena.encode("utf-8")) > 72:
        v.error("contrasena", "Debe tener como máximo 72 bytes.")       # límite de bcrypt
    rol = v.enum("rol", ROLES, required=True)
    acepta = v.boolean("aceptaAvisoPrivacidad", required=True)
    version_aviso = v.integer("versionAviso", required=True, minimum=1)
    mayor_edad = v.boolean("declaraMayorDeEdad", required=True)

    # RF-01-AC-3: las cuentas de administrador se aprovisionan internamente.
    if rol == "administrador":
        raise ApiError(422, "ROL_NO_PERMITIDO", "Las cuentas de administrador se aprovisionan internamente.",
                       [{"campo": "rol", "mensaje": "Rol no permitido en el registro público."}])
    # RF-02-AC-2: sin consentimiento no se presta el servicio.
    if acepta is False:
        raise ApiError(422, "CONSENTIMIENTO_REQUERIDO", "No podemos prestar el servicio sin tu consentimiento.",
                       [{"campo": "aceptaAvisoPrivacidad", "mensaje": "Debes aceptar el aviso de privacidad."}])
    if mayor_edad is False:
        v.error("declaraMayorDeEdad", "Debes ser mayor de edad para registrarte.")
    if version_aviso is not None:
        vigente = usuarios_service.version_aviso_vigente()
        if vigente is None or version_aviso != vigente:
            v.error("versionAviso", f"Debes aceptar la versión vigente del aviso ({vigente}).")
    v.raise_if_errors()

    try:
        usuario = usuarios_service.crear(nombre, correo, contrasena, rol, mayor_edad, version_aviso)
    except usuarios_service.CorreoDuplicado:
        raise conflict("CORREO_REGISTRADO", "El correo ya está registrado.")

    resp = jsonify(usuarios_service.a_cuenta(usuario))
    resp.status_code = 201
    resp.headers["Location"] = "/api/auth/me"
    return resp


@bp.post("/login")
def login():
    """Autenticación con correo y contraseña. 200 con JWT; 401 si las credenciales no son válidas."""
    data = json_body()
    v = Validator(data)
    correo = v.string("correo", required=True, max_len=254)
    contrasena = data.get("contrasena")
    if not isinstance(contrasena, str) or contrasena == "":
        v.error("contrasena", "Es obligatoria.")
    if v.errores:
        raise validation(v.errores, "Faltan credenciales.")

    usuario = usuarios_service.obtener_con_hash_por_correo(correo.lower())
    hash_guardado = usuario["contrasena_hash"] if usuario else None
    # Mismo mensaje y mismo costo de cómputo exista o no el correo (RF-01-AC-2).
    valido = usuarios_service.verificar_contrasena(contrasena, hash_guardado)
    if not valido or not usuario["activo"]:
        raise unauthorized("CREDENCIALES_INVALIDAS", "Correo o contraseña incorrectos.")

    usuario.pop("contrasena_hash", None)
    cuenta = usuarios_service.a_cuenta(usuario)
    aviso = cuenta["consentimientoVigente"]["versionAviso"] if cuenta["consentimientoVigente"] else None
    token, expira_en = emitir_token(usuario, aviso)
    return jsonify({
        "tokenAcceso": token,
        "tipoToken": "Bearer",
        "expiraEn": expira_en,
        "segundoFactorRequerido": False,
        "requiereAceptarAviso": cuenta["requiereAceptarAviso"],
        "cuenta": cuenta,
    }), 200


@bp.get("/me")
@token_required
def me():
    """Datos del usuario autenticado a partir del JWT."""
    return jsonify(usuarios_service.a_cuenta(g.usuario)), 200
