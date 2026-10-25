"""CRUD de casos de soporte (tabla `casos_soporte`)."""
import uuid

from .. import db


def crear(cliente_id: str, solicitud_id: str | None, motivo: str, comentario: str | None) -> dict:
    caso_id = str(uuid.uuid4())
    db.execute(
        "INSERT INTO casos_soporte (id, cliente_id, solicitud_id, motivo, comentario) "
        "VALUES (%s, %s, %s, %s, %s)",
        (caso_id, cliente_id, solicitud_id, motivo, comentario),
    )
    return obtener(caso_id)


def obtener(caso_id: str) -> dict | None:
    return db.query_one("SELECT * FROM casos_soporte WHERE id = %s", (caso_id,))


def listar(estado: str | None, pagina: int, tamano: int) -> tuple[list, int]:
    condicion, params = ("WHERE estado = %s", [estado]) if estado else ("", [])
    total = db.query_one(f"SELECT COUNT(*) AS n FROM casos_soporte {condicion}", params)["n"]
    filas = db.query_all(
        f"SELECT * FROM casos_soporte {condicion} ORDER BY creado_en ASC, id LIMIT %s OFFSET %s",
        params + [tamano, (pagina - 1) * tamano],
    )
    return filas, total


def actualizar(caso_id: str, admin_id: str, estado: str | None, notas: str | None) -> dict:
    sets, params = ["atendido_por = %s"], [admin_id]
    if estado is not None:
        sets.append("estado = %s")
        params.append(estado)
    if notas is not None:
        sets.append("notas = %s")
        params.append(notas)
    db.execute(f"UPDATE casos_soporte SET {', '.join(sets)} WHERE id = %s", params + [caso_id])
    return obtener(caso_id)


def eliminar(caso_id: str) -> None:
    db.execute("DELETE FROM casos_soporte WHERE id = %s", (caso_id,))


def a_caso(fila: dict) -> dict:
    """Esquema `CasoSoporte`."""
    return {
        "id": fila["id"],
        "clienteId": fila["cliente_id"],
        "solicitudId": fila["solicitud_id"],
        "motivo": fila["motivo"],
        "comentario": fila["comentario"],
        "estado": fila["estado"],
        "atendidoPor": fila["atendido_por"],
        "notas": fila["notas"],
        "creadoEn": fila["creado_en"].isoformat(),
    }
