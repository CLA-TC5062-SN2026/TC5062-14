"""Errores de la API con el formato `Error` del contrato: {codigo, mensaje, errores?}."""
from flask import jsonify
from werkzeug.exceptions import HTTPException


class ApiError(Exception):
    def __init__(self, status, codigo, mensaje, errores=None):
        super().__init__(mensaje)
        self.status = status
        self.codigo = codigo
        self.mensaje = mensaje
        self.errores = errores

    def to_response(self):
        body = {"codigo": self.codigo, "mensaje": self.mensaje}
        if self.errores:
            body["errores"] = self.errores
        return jsonify(body), self.status


# Atajos de uso frecuente
def bad_request(mensaje="Petición mal formada."):
    return ApiError(400, "PETICION_INVALIDA", mensaje)


def unauthorized(codigo="NO_AUTENTICADO", mensaje="Inicia sesión para continuar."):
    return ApiError(401, codigo, mensaje)


def forbidden(mensaje="No tienes permiso para esta acción."):
    return ApiError(403, "ACCESO_DENEGADO", mensaje)


def not_found(mensaje="El recurso no existe."):
    return ApiError(404, "NO_ENCONTRADO", mensaje)


def conflict(codigo, mensaje):
    return ApiError(409, codigo, mensaje)


def validation(errores, mensaje="Hay datos inválidos.", codigo="VALIDACION"):
    return ApiError(422, codigo, mensaje, errores)


def register_error_handlers(app):
    @app.errorhandler(ApiError)
    def _api_error(err):
        return err.to_response()

    @app.errorhandler(HTTPException)
    def _http_error(err):
        codigos = {400: "PETICION_INVALIDA", 401: "NO_AUTENTICADO", 403: "ACCESO_DENEGADO",
                   404: "NO_ENCONTRADO", 405: "METODO_NO_PERMITIDO", 415: "TIPO_NO_SOPORTADO"}
        body = {"codigo": codigos.get(err.code, "ERROR_HTTP"), "mensaje": err.description}
        return jsonify(body), err.code

    @app.errorhandler(Exception)
    def _unexpected(err):
        app.logger.exception("Error no controlado: %s", err)
        return jsonify({"codigo": "ERROR_INTERNO", "mensaje": "Ocurrió un error. Intenta de nuevo."}), 500
