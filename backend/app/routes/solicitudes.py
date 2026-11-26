"""Servicios REST de solicitudes, protegidos con JWT + rol + propiedad (RNF-04)."""
from flask import Blueprint, g, jsonify, request

from ..errors import bad_request, conflict, forbidden, not_found
from ..middleware.auth import roles_required
from ..services import solicitudes_service as svc
from ..validation import MUNICIPIOS, OFICIOS, UUID_RE, Validator, json_body, pagination_args

bp = Blueprint("solicitudes", __name__, url_prefix="/api/solicitudes")

ESTADOS = ("borrador", "confirmada", "programado", "en_proceso", "terminado", "concluido")


def _cargar(solicitud_id: str) -> dict:
    if not UUID_RE.match(solicitud_id):
        raise not_found()
    fila = svc.obtener(solicitud_id.lower())
    if fila is None:
        raise not_found()
    return fila


def _puede_ver(usuario: dict, fila: dict) -> bool:
    rol = usuario["rol"]
    if rol == "administrador":
        return True
    if rol == "cliente":
        return fila["cliente_id"] == usuario["id"]
    return fila["proveedor_id"] == usuario["id"]     # trabajador / organizacion


def _exigir_dueno(fila: dict) -> None:
    if fila["cliente_id"] != g.usuario["id"]:
        raise forbidden()


def _validar_campos(data: dict, parcial: bool) -> dict:
    v = Validator(data)
    zona = data.get("zona")
    if zona is not None and not isinstance(zona, dict):
        v.error("zona", "Debe ser un objeto {municipio, colonia}.")
        zona = {}
    exigir_zona = not parcial or zona is not None
    zona = zona or {}

    datos = {
        "resultadoEsperado": v.string("resultadoEsperado", required=not parcial, min_len=1, max_len=2000),
        "oficio": v.enum("oficio", OFICIOS, required=not parcial),
        "municipio": v.enum("municipio", MUNICIPIOS, required=exigir_zona,
                            value=zona.get("municipio"), label="zona.municipio"),
        "colonia": v.string("colonia", required=exigir_zona, max_len=120,
                            value=zona.get("colonia"), label="zona.colonia"),
        "tipoTrabajo": v.string("tipoTrabajo", max_len=200),
        "fechaDeseada": v.iso_date("fechaDeseada"),
        "descripcion": v.string("descripcion", max_len=4000),
        "medidas": v.string("medidas", max_len=500),
        "materiales": v.string("materiales", max_len=1000),
    }
    if not parcial:
        datos["origen"] = v.enum("origen", ("manual", "agente")) or "manual"
    # RF-16-AC-5: la solicitud no pide calle ni número.
    for prohibido in ("calle", "numeroExterior", "domicilio"):
        if prohibido in data:
            v.error(prohibido, "No se solicita domicilio exacto al crear o editar la solicitud.")
    v.raise_if_errors("Faltan datos obligatorios." if not parcial else "Hay datos inválidos.")
    if parcial:
        # Solo los campos que realmente llegaron en el cuerpo
        presentes = {k for k in data if k in svc.CAMPOS_EDITABLES}
        if "zona" in data:
            presentes |= {"municipio", "colonia"}
        datos = {k: datos[k] for k in presentes}
    return datos


@bp.post("")
@roles_required("cliente")
def crear():
    datos = _validar_campos(json_body(), parcial=False)
    fila = svc.crear(g.usuario["id"], datos)
    resp = jsonify(svc.a_solicitud(fila))
    resp.status_code = 201
    resp.headers["Location"] = f"/api/solicitudes/{fila['id']}"
    return resp


@bp.get("")
@roles_required("cliente", "trabajador", "organizacion")
def listar():
    estado = request.args.get("estado")
    if estado is not None and estado not in ESTADOS:
        raise bad_request(f"estado debe ser uno de: {', '.join(ESTADOS)}.")
    pagina, tamano = pagination_args()
    filas, total = svc.listar(g.usuario, estado, pagina, tamano)
    return jsonify({
        "elementos": [svc.a_resumen(f) for f in filas],
        "paginacion": {"pagina": pagina, "tamanoPagina": tamano, "total": total},
    })


@bp.get("/<solicitud_id>")
@roles_required("cliente", "trabajador", "organizacion", "administrador")
def obtener(solicitud_id):
    fila = _cargar(solicitud_id)
    if not _puede_ver(g.usuario, fila):
        raise forbidden()          # sin datos del recurso (RNF-04-AC-2)
    return jsonify(svc.a_solicitud(fila))


@bp.patch("/<solicitud_id>")
@roles_required("cliente")
def actualizar(solicitud_id):
    fila = _cargar(solicitud_id)
    _exigir_dueno(fila)
    data = json_body()
    if fila["estado"] != "borrador":
        raise conflict("SOLICITUD_NO_EDITABLE", "La solicitud ya no está en borrador.")
    cambios = _validar_campos(data, parcial=True)
    return jsonify(svc.a_solicitud(svc.actualizar(fila["id"], cambios)))


@bp.delete("/<solicitud_id>")
@roles_required("cliente")
def eliminar(solicitud_id):
    fila = _cargar(solicitud_id)
    _exigir_dueno(fila)
    if fila["estado"] != "borrador":
        raise conflict("SOLICITUD_NO_ELIMINABLE", "Solo se pueden eliminar solicitudes en borrador.")
    svc.eliminar(fila["id"])
    return "", 204
