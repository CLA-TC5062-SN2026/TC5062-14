"""Pruebas de control de acceso (token, rol y propiedad) sobre los servicios CRUD."""
import pytest

SOLICITUD = {
    "resultadoEsperado": "Cambiar la llave del lavabo que gotea",
    "oficio": "plomeria",
    "zona": {"municipio": "zapopan", "colonia": "Providencia"},
    "descripcion": "Gotea desde hace una semana",
}


def crear_solicitud(client, headers, **extra):
    body = {**SOLICITUD, **extra}
    r = client.post("/api/solicitudes", json=body, headers=headers)
    assert r.status_code == 201, r.get_json()
    return r.get_json()


# ── Sin token: todas las rutas protegidas responden 401 ──────────────────
@pytest.mark.parametrize("metodo,ruta", [
    ("post", "/api/solicitudes"),
    ("get", "/api/solicitudes"),
    ("get", "/api/solicitudes/00000000-0000-4000-8000-000000000000"),
    ("patch", "/api/solicitudes/00000000-0000-4000-8000-000000000000"),
    ("delete", "/api/solicitudes/00000000-0000-4000-8000-000000000000"),
    ("post", "/api/casos-soporte"),
    ("get", "/api/casos-soporte"),
    ("get", "/api/casos-soporte/00000000-0000-4000-8000-000000000000"),
    ("patch", "/api/casos-soporte/00000000-0000-4000-8000-000000000000"),
    ("delete", "/api/casos-soporte/00000000-0000-4000-8000-000000000000"),
])
def test_rutas_sin_token_401(client, metodo, ruta):
    r = getattr(client, metodo)(ruta, json={})
    assert r.status_code == 401
    assert r.get_json()["codigo"] == "NO_AUTENTICADO"


# ── Solicitudes ──────────────────────────────────────────────────────────
def test_crud_solicitud_cliente(client, login_as):
    h = login_as("cliente")
    s = crear_solicitud(client, h)
    assert s["estado"] == "borrador"

    lista = client.get("/api/solicitudes", headers=h).get_json()
    assert lista["paginacion"]["total"] == 1

    r = client.patch(f"/api/solicitudes/{s['id']}", json={"descripcion": "Ahora también la regadera"}, headers=h)
    assert r.status_code == 200
    assert r.get_json()["resumen"]["descripcion"] == "Ahora también la regadera"
    assert r.get_json()["resumen"]["oficio"] == "plomeria"     # PATCH parcial no borra otros campos

    assert client.delete(f"/api/solicitudes/{s['id']}", headers=h).status_code == 204
    assert client.get(f"/api/solicitudes/{s['id']}", headers=h).status_code == 404


def test_crear_solicitud_trabajador_403(client, login_as):
    h = login_as("trabajador")
    r = client.post("/api/solicitudes", json=SOLICITUD, headers=h)
    assert r.status_code == 403 and r.get_json()["codigo"] == "ACCESO_DENEGADO"


def test_crear_solicitud_campos_obligatorios_422(client, login_as):
    r = client.post("/api/solicitudes", json={"oficio": "plomeria"}, headers=login_as())
    assert r.status_code == 422
    campos = {e["campo"] for e in r.get_json()["errores"]}
    assert {"resultadoEsperado", "zona.municipio", "zona.colonia"} <= campos


def test_crear_solicitud_rechaza_domicilio_exacto(client, login_as):
    r = client.post("/api/solicitudes", json={**SOLICITUD, "calle": "Av. Patria"}, headers=login_as())
    assert r.status_code == 422


def test_cliente_no_ve_solicitud_ajena_403(client, login_as):
    s = crear_solicitud(client, login_as("cliente", "ana@example.com"))
    otro = login_as("cliente", "beto@example.com")
    r = client.get(f"/api/solicitudes/{s['id']}", headers=otro)
    assert r.status_code == 403
    assert "resumen" not in r.get_json()                   # no filtra datos del recurso
    assert client.patch(f"/api/solicitudes/{s['id']}", json={"descripcion": "x"}, headers=otro).status_code == 403
    assert client.delete(f"/api/solicitudes/{s['id']}", headers=otro).status_code == 403
    assert client.get("/api/solicitudes", headers=otro).get_json()["paginacion"]["total"] == 0


def test_admin_puede_consultar_pero_no_listar_ni_editar(client, login_as):
    s = crear_solicitud(client, login_as("cliente"))
    admin = login_as("administrador")
    assert client.get(f"/api/solicitudes/{s['id']}", headers=admin).status_code == 200
    assert client.get("/api/solicitudes", headers=admin).status_code == 403
    assert client.patch(f"/api/solicitudes/{s['id']}", json={"descripcion": "x"}, headers=admin).status_code == 403


def test_proveedor_no_asociado_403(client, login_as):
    s = crear_solicitud(client, login_as("cliente"))
    prov = login_as("trabajador")
    assert client.get(f"/api/solicitudes/{s['id']}", headers=prov).status_code == 403


def test_editar_solicitud_no_borrador_409(client, login_as):
    from .conftest import TEST_DB, _conn
    h = login_as()
    s = crear_solicitud(client, h)
    with _conn(TEST_DB) as c, c.cursor() as cur:
        cur.execute("UPDATE solicitudes SET estado='confirmada' WHERE id=%s", (s["id"],))
    r = client.patch(f"/api/solicitudes/{s['id']}", json={"descripcion": "x"}, headers=h)
    assert r.status_code == 409 and r.get_json()["codigo"] == "SOLICITUD_NO_EDITABLE"


def test_solicitud_id_invalido_404(client, login_as):
    assert client.get("/api/solicitudes/no-es-uuid", headers=login_as()).status_code == 404


# ── Casos de soporte ─────────────────────────────────────────────────────
def test_flujo_caso_soporte(client, login_as):
    cli = login_as("cliente")
    s = crear_solicitud(client, cli)
    r = client.post("/api/casos-soporte", json={"solicitudId": s["id"], "motivo": "agente_no_comprende"}, headers=cli)
    assert r.status_code == 201
    caso = r.get_json()
    assert caso["estado"] == "pendiente"

    # El cliente no puede ver la bandeja ni atender casos
    assert client.get("/api/casos-soporte", headers=cli).status_code == 403
    assert client.patch(f"/api/casos-soporte/{caso['id']}", json={"estado": "resuelto"}, headers=cli).status_code == 403
    # Pero sí consultar su propio caso
    assert client.get(f"/api/casos-soporte/{caso['id']}", headers=cli).status_code == 200

    admin = login_as("administrador")
    bandeja = client.get("/api/casos-soporte?estado=pendiente", headers=admin).get_json()
    assert bandeja["paginacion"]["total"] == 1
    r = client.patch(f"/api/casos-soporte/{caso['id']}", json={"estado": "en_atencion", "notas": "Llamar"}, headers=admin)
    assert r.status_code == 200
    assert r.get_json()["estado"] == "en_atencion" and r.get_json()["atendidoPor"] is not None
    assert client.delete(f"/api/casos-soporte/{caso['id']}", headers=admin).status_code == 204


def test_caso_con_solicitud_ajena_403(client, login_as):
    s = crear_solicitud(client, login_as("cliente", "ana@example.com"))
    otro = login_as("cliente", "beto@example.com")
    r = client.post("/api/casos-soporte", json={"solicitudId": s["id"], "motivo": "otro"}, headers=otro)
    assert r.status_code == 403


def test_cliente_no_ve_caso_ajeno_403(client, login_as):
    ana = login_as("cliente", "ana@example.com")
    caso = client.post("/api/casos-soporte", json={"motivo": "otro"}, headers=ana).get_json()
    beto = login_as("cliente", "beto@example.com")
    assert client.get(f"/api/casos-soporte/{caso['id']}", headers=beto).status_code == 403


def test_trabajador_no_crea_caso_403(client, login_as):
    r = client.post("/api/casos-soporte", json={"motivo": "otro"}, headers=login_as("trabajador"))
    assert r.status_code == 403
