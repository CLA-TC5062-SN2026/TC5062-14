"""Servicios REST de casos de soporte, protegidos con JWT + rol + propiedad (RNF-04)."""
from flask import Blueprint, g, jsonify, request

from ..errors import bad_request, forbidden, not_found
from ..middleware.auth import roles_required
from ..services import casos_service as svc
from ..services import solicitudes_service
from ..validation import UUID_RE, Validator, json_body, pagination_args

bp = Blueprint("casos_soporte", __name__, url_prefix="/api/casos-soporte")

MOTIVOS = ("agente_no_comprende", "oficio_no_clasificado", "ia_no_resolvio", "otro")
ESTADOS = ("pendiente", "en_atencion", "resuelto")


def _cargar(caso_id: str) -> dict:
    if not UUID_RE.match(caso_id):
        raise not_found()
    fila = svc.obtener(caso_id.lower())
    if fila is None:
        raise not_found()
    return fila


@bp.post("")
@roles_required("cliente")
def crear():
    v = Validator(json_body())
    solicitud_id = v.uuid("solicitudId")
    motivo = v.enum("motivo", MOTIVOS, required=True)
    comentario = v.string("comentario", max_len=2000)
    v.raise_if_errors()
    if solicitud_id:
        solicitud = solicitudes_service.obtener(solicitud_id)
        if solicitud is None:
            raise not_found("La solicitud indicada no existe.")
        if solicitud["cliente_id"] != g.usuario["id"]:
            raise forbidden()
    fila = svc.crear(g.usuario["id"], solicitud_id, motivo, comentario)
    resp = jsonify(svc.a_caso(fila))
    resp.status_code = 201
    resp.headers["Location"] = f"/api/casos-soporte/{fila['id']}"
    return resp


@bp.get("")
@roles_required("administrador")
def listar():
    estado = request.args.get("estado")
    if estado is not None and estado not in ESTADOS:
        raise bad_request(f"estado debe ser uno de: {', '.join(ESTADOS)}.")
    pagina, tamano = pagination_args()
    filas, total = svc.listar(estado, pagina, tamano)
    return jsonify({
        "elementos": [svc.a_caso(f) for f in filas],
        "paginacion": {"pagina": pagina, "tamanoPagina": tamano, "total": total},
    })


@bp.get("/<caso_id>")
@roles_required("cliente", "administrador")
def obtener(caso_id):
    fila = _cargar(caso_id)
    if g.usuario["rol"] == "cliente" and fila["cliente_id"] != g.usuario["id"]:
        raise forbidden()
    return jsonify(svc.a_caso(fila))


@bp.patch("/<caso_id>")
@roles_required("administrador")
def actualizar(caso_id):
    fila = _cargar(caso_id)
    v = Validator(json_body())
    estado = v.enum("estado", ("en_atencion", "resuelto"))
    notas = v.string("notas", max_len=4000)
    if estado is None and notas is None and not v.errores:
        v.error("estado", "Envía estado o notas.")
    v.raise_if_errors()
    return jsonify(svc.a_caso(svc.actualizar(fila["id"], g.usuario["id"], estado, notas)))


@bp.delete("/<caso_id>")
@roles_required("administrador")
def eliminar(caso_id):
    fila = _cargar(caso_id)
    svc.eliminar(fila["id"])
    return "", 204
