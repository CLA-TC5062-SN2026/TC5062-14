"""CRUD de solicitudes (tabla `solicitudes`)."""
import uuid

from .. import db

# Campos editables: nombre en la API -> columna en la BD
CAMPOS_EDITABLES = {
    "resultadoEsperado": "resultado_esperado",
    "oficio": "oficio",
    "tipoTrabajo": "tipo_trabajo",
    "fechaDeseada": "fecha_deseada",
    "descripcion": "descripcion",
    "medidas": "medidas",
    "materiales": "materiales",
    "municipio": "municipio",   # viene de zona.municipio
    "colonia": "colonia",       # viene de zona.colonia
}


def crear(cliente_id: str, datos: dict) -> dict:
    solicitud_id = str(uuid.uuid4())
    db.execute(
        "INSERT INTO solicitudes (id, cliente_id, origen, resultado_esperado, oficio, municipio, colonia, "
        "tipo_trabajo, fecha_deseada, descripcion, medidas, materiales) "
        "VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)",
        (solicitud_id, cliente_id, datos.get("origen") or "manual", datos["resultadoEsperado"],
         datos["oficio"], datos["municipio"], datos["colonia"], datos.get("tipoTrabajo"),
         datos.get("fechaDeseada"), datos.get("descripcion"), datos.get("medidas"), datos.get("materiales")),
    )
    return obtener(solicitud_id)


def obtener(solicitud_id: str) -> dict | None:
    return db.query_one("SELECT * FROM solicitudes WHERE id = %s", (solicitud_id,))


def listar(usuario: dict, estado: str | None, pagina: int, tamano: int) -> tuple[list, int]:
    """Cliente: sus solicitudes. Trabajador/organización: aquellas a las que está asociado."""
    columna = "cliente_id" if usuario["rol"] == "cliente" else "proveedor_id"
    where, params = [f"{columna} = %s"], [usuario["id"]]
    if estado:
        where.append("estado = %s")
        params.append(estado)
    condicion = " AND ".join(where)
    total = db.query_one(f"SELECT COUNT(*) AS n FROM solicitudes WHERE {condicion}", params)["n"]
    filas = db.query_all(
        f"SELECT * FROM solicitudes WHERE {condicion} ORDER BY actualizada_en DESC, id "
        f"LIMIT %s OFFSET %s",
        params + [tamano, (pagina - 1) * tamano],
    )
    return filas, total


def actualizar(solicitud_id: str, cambios: dict) -> dict:
    if cambios:
        asignaciones = ", ".join(f"{CAMPOS_EDITABLES[k]} = %s" for k in cambios)
        db.execute(
            f"UPDATE solicitudes SET {asignaciones} WHERE id = %s",
            list(cambios.values()) + [solicitud_id],
        )
    return obtener(solicitud_id)


def eliminar(solicitud_id: str) -> None:
    db.execute("DELETE FROM solicitudes WHERE id = %s", (solicitud_id,))


def _iso(valor):
    return valor.isoformat() if valor is not None else None


def a_resumen(fila: dict) -> dict:
    """Esquema `SolicitudResumen`."""
    return {
        "id": fila["id"],
        "oficio": fila["oficio"],
        "resultadoEsperado": fila["resultado_esperado"],
        "estado": fila["estado"],
        "zona": {"municipio": fila["municipio"], "colonia": fila["colonia"]},
        "actualizadaEn": _iso(fila["actualizada_en"]),
    }


def a_solicitud(fila: dict) -> dict:
    """Esquema `Solicitud` (subconjunto implementado en este sprint)."""
    zona = {"municipio": fila["municipio"], "colonia": fila["colonia"]}
    return {
        "id": fila["id"],
        "clienteId": fila["cliente_id"],
        "estado": fila["estado"],
        "origen": fila["origen"],
        "resumen": {
            "resultadoEsperado": fila["resultado_esperado"],
            "oficio": fila["oficio"],
            "tipoTrabajo": fila["tipo_trabajo"],
            "zona": zona,
            "fechaDeseada": _iso(fila["fecha_deseada"]),
            "descripcion": fila["descripcion"],
            "medidas": fila["medidas"],
            "materiales": fila["materiales"],
        },
        "zona": zona,
        "proveedorAsociado": {"id": fila["proveedor_id"]} if fila["proveedor_id"] else None,
        "creadaEn": _iso(fila["creada_en"]),
        "actualizadaEn": _iso(fila["actualizada_en"]),
    }
