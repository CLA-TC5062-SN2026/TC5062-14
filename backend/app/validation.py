"""Utilidades de validación de entrada (sin dependencias externas)."""
import re
from datetime import date

from flask import request

from .errors import bad_request, validation

ROLES = ("cliente", "trabajador", "organizacion", "administrador")
OFICIOS = ("albanileria", "plomeria", "electricidad", "carpinteria", "herreria", "pintura",
           "pisos_azulejos", "vidrieria_canceleria", "tablaroca", "impermeabilizacion")
MUNICIPIOS = ("guadalajara", "zapopan", "san_pedro_tlaquepaque", "tonala",
              "tlajomulco_de_zuniga", "el_salto")
EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
UUID_RE = re.compile(r"^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$")


def json_body() -> dict:
    """Devuelve el cuerpo JSON como dict o lanza 400."""
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        raise bad_request("El cuerpo debe ser un objeto JSON válido.")
    return data


class Validator:
    """Acumula errores por campo para responder un único 422."""

    def __init__(self, data: dict):
        self.data = data
        self.errores = []

    def error(self, campo, mensaje):
        self.errores.append({"campo": campo, "mensaje": mensaje})

    def string(self, campo, required=False, min_len=None, max_len=None, value=None, label=None):
        v = self.data.get(campo) if value is None else value
        if v is None or (isinstance(v, str) and v.strip() == ""):
            if required:
                self.error(label or campo, "Es obligatorio.")
            return None
        if not isinstance(v, str):
            self.error(label or campo, "Debe ser texto.")
            return None
        v = v.strip()
        if min_len is not None and len(v) < min_len:
            self.error(label or campo, f"Debe tener al menos {min_len} caracteres.")
        if max_len is not None and len(v) > max_len:
            self.error(label or campo, f"Debe tener como máximo {max_len} caracteres.")
        return v

    def email(self, campo, required=True):
        v = self.string(campo, required=required, max_len=254)
        if v and not EMAIL_RE.match(v):
            self.error(campo, "No es un correo válido.")
        return v.lower() if v else v

    def enum(self, campo, opciones, required=False, value=None, label=None):
        v = self.data.get(campo) if value is None else value
        if v is None:
            if required:
                self.error(label or campo, "Es obligatorio.")
            return None
        if v not in opciones:
            self.error(label or campo, f"Valor no permitido. Opciones: {', '.join(opciones)}.")
            return None
        return v

    def boolean(self, campo, required=False):
        v = self.data.get(campo)
        if v is None:
            if required:
                self.error(campo, "Es obligatorio.")
            return None
        if not isinstance(v, bool):
            self.error(campo, "Debe ser true o false.")
            return None
        return v

    def integer(self, campo, required=False, minimum=None):
        v = self.data.get(campo)
        if v is None:
            if required:
                self.error(campo, "Es obligatorio.")
            return None
        if isinstance(v, bool) or not isinstance(v, int):
            self.error(campo, "Debe ser un número entero.")
            return None
        if minimum is not None and v < minimum:
            self.error(campo, f"Debe ser mayor o igual a {minimum}.")
        return v

    def iso_date(self, campo):
        v = self.data.get(campo)
        if v is None:
            return None
        try:
            return date.fromisoformat(v).isoformat()
        except (TypeError, ValueError):
            self.error(campo, "Debe ser una fecha AAAA-MM-DD.")
            return None

    def uuid(self, campo, required=False):
        v = self.data.get(campo)
        if v is None:
            if required:
                self.error(campo, "Es obligatorio.")
            return None
        if not isinstance(v, str) or not UUID_RE.match(v):
            self.error(campo, "Debe ser un UUID.")
            return None
        return v.lower()

    def raise_if_errors(self, mensaje="Hay datos inválidos."):
        if self.errores:
            raise validation(self.errores, mensaje)


def pagination_args():
    """Lee ?pagina y ?tamanoPagina (1..100)."""
    try:
        pagina = int(request.args.get("pagina", 1))
        tamano = int(request.args.get("tamanoPagina", 20))
    except ValueError:
        raise bad_request("pagina y tamanoPagina deben ser enteros.")
    if pagina < 1 or not 1 <= tamano <= 100:
        raise bad_request("pagina ≥ 1 y tamanoPagina entre 1 y 100.")
    return pagina, tamano
