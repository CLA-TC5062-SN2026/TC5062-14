"""Genera el diagrama entidad-relación (PlantUML) a partir del esquema cargado en MySQL.

Uso:
    mysql -u root -p < esquema_bd.sql
    python generar_er.py --usuario root --contrasena ... > diagrama_er.puml
    python generar_er.py --compacto ...                 > diagrama_er_compacto.puml

Lee information_schema: así el diagrama refleja exactamente lo que crea
esquema_bd.sql (tablas, columnas, tipos, PK, FK, UNIQUE y nulabilidad).
"""
import argparse
import collections

import pymysql

MODULOS = [
    ("Cuentas y privacidad", "#E3F2FD",
     ["usuarios", "avisos_privacidad", "consentimientos", "solicitudes_arco", "notificaciones"]),
    ("Proveedores y verificación", "#E8F5E9",
     ["proveedores", "trabajadores_independientes", "organizaciones_contratistas", "oficios", "proveedor_oficios",
      "proveedor_zonas", "fechas_no_disponibles", "franjas_bloqueadas", "fotos_portafolio", "verificaciones",
      "documentos_verificacion"]),
    ("Solicitud y agente de IA", "#FFF8E1",
     ["solicitudes", "historial_estados_solicitud", "conversaciones", "mensajes_conversacion", "adjuntos",
      "representaciones_visuales", "representacion_adjuntos", "casos_soporte"]),
    ("Búsqueda, invitación y citas", "#F3E5F5",
     ["conjuntos_recomendaciones", "recomendaciones", "invitaciones", "citas", "modificaciones_cita"]),
    ("Propuestas y control de costos", "#FBE9E7",
     ["propuestas", "versiones_propuesta", "conceptos_propuesta", "cambios", "cambio_evidencias", "contrapropuestas",
      "analisis_ia", "versiones_presupuesto", "registros_bitacora"]),
    ("Seguimiento, mensajes y evaluaciones", "#E0F2F1",
     ["mensajes_canal", "solicitudes_cierre", "revelaciones_domicilio", "evaluaciones"]),
]


def tipo_corto(column_type):
    t = column_type
    if t.startswith("enum("):
        n = t.count("','") + 1
        return f"ENUM({n})" if len(t) > 46 else t.upper().replace("ENUM(", "ENUM(")
    if t.startswith("set("):
        return "SET(dias)"
    return t.upper().replace(" UNSIGNED", "↑").replace("TINYINT(1)", "BOOLEAN")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--host", default="localhost")
    ap.add_argument("--usuario", default="root")
    ap.add_argument("--contrasena", default="")
    ap.add_argument("--compacto", action="store_true", help="solo PK, FK y columnas únicas")
    ap.add_argument("--modulo", type=int, default=0,
                    help="1-6: solo las tablas de ese módulo (completas) y, en gris, las tablas vecinas")
    a = ap.parse_args()
    cx = pymysql.connect(host=a.host, user=a.usuario, password=a.contrasena, database="information_schema")
    cur = cx.cursor()
    db = "uncalificado"

    cur.execute("""SELECT c.table_name, c.column_name, c.column_type, c.is_nullable, c.column_key, c.extra,
                          c.ordinal_position
                   FROM columns c JOIN tables t ON t.table_schema = c.table_schema AND t.table_name = c.table_name
                   WHERE c.table_schema=%s AND t.table_type = 'BASE TABLE'
                   ORDER BY c.table_name, c.ordinal_position""", (db,))
    columnas = collections.defaultdict(list)
    for t, c, ty, nul, key, extra, _ in cur.fetchall():
        columnas[t].append(dict(nombre=c, tipo=ty, nulo=(nul == "YES"), generada="GENERATED" in (extra or "")))

    cur.execute("""SELECT k.table_name, k.constraint_name, k.column_name, k.referenced_table_name,
                          k.referenced_column_name, k.ordinal_position
                   FROM key_column_usage k
                   WHERE k.table_schema=%s AND k.referenced_table_name IS NOT NULL
                   ORDER BY k.table_name, k.constraint_name, k.ordinal_position""", (db,))
    fks = collections.OrderedDict()
    for t, cn, col, rt, rc, _ in cur.fetchall():
        fks.setdefault((t, cn), dict(tabla=t, ref=rt, cols=[], refcols=[]))
        fks[(t, cn)]["cols"].append(col)
        fks[(t, cn)]["refcols"].append(rc)

    cur.execute("""SELECT table_name, index_name, GROUP_CONCAT(COALESCE(column_name,'<expr>') ORDER BY seq_in_index)
                   FROM statistics WHERE table_schema=%s AND non_unique=0
                   GROUP BY table_name, index_name""", (db,))
    unicos = collections.defaultdict(list)
    pks = {}
    for t, idx, cols in cur.fetchall():
        lista = cols.split(",")
        if idx == "PRIMARY":
            pks[t] = lista
        else:
            unicos[t].append(lista)

    cur.execute("SELECT table_name, table_comment FROM tables WHERE table_schema=%s AND table_type='BASE TABLE'", (db,))
    comentarios = {t: (c or "").split(".")[0] for t, c in cur.fetchall()}

    gen = {t: {c["nombre"] for c in cs if c["generada"]} for t, cs in columnas.items()}
    fk_cols = collections.defaultdict(set)
    for f in fks.values():
        for c in f["cols"]:
            if c not in gen[f["tabla"]]:
                fk_cols[f["tabla"]].add(c)
    uq_cols = {t: {c for u in us if len(u) == 1 for c in u} for t, us in unicos.items()}

    L = []
    w = L.append
    nombre = "diagrama_er_compacto" if a.compacto else "diagrama_er"
    foco = None
    if a.modulo:
        titulo_mod, _, foco = MODULOS[a.modulo - 1]
        foco = set(foco)
        nombre = f"diagrama_er_{a.modulo}"
    w(f"@startuml {nombre}")
    w("' =====================================================================")
    w("' UnCalificado — Diagrama entidad-relación de la base de datos (MySQL 8)")
    w("' GENERADO por generar_er.py a partir de information_schema después de")
    w("' cargar esquema_bd.sql. No editar a mano: regenerar si cambia el SQL.")
    w("' Notación: * = NOT NULL · <<PK>> · <<FK>> · <<UQ>> (único) ·")
    w("' ||--o{ = uno a muchos · |o--o{ = FK opcional · ||--o| = uno a uno")
    w("' =====================================================================")
    sub = "vista compacta: PK, FK y columnas únicas" if a.compacto else "todas las columnas"
    if foco:
        w(f"title UnCalificado — Modelo entidad-relación · {titulo_mod}\\n<size:11>{len(foco)} tablas del módulo con todas sus columnas · en gris, tablas de otros módulos relacionadas · * = NOT NULL</size>")
    else:
        w(f"title UnCalificado — Modelo entidad-relación (esquema_bd.sql v1.2)\\n<size:11>{len(columnas)} tablas · {sub} · * = NOT NULL</size>")
    w("hide circle")
    w("skinparam linetype ortho")
    w("skinparam shadowing false")
    w("skinparam nodesep 40")
    w("skinparam ranksep 70")
    w("skinparam defaultFontSize 11")
    w("skinparam class {\n  BorderColor #546E7A\n  ArrowColor #546E7A\n}")
    w("")
    vecinos = set()
    if foco:
        for f in fks.values():
            if f["tabla"] in foco and f["ref"] not in foco:
                vecinos.add(f["ref"])
            if f["ref"] in foco and f["tabla"] not in foco:
                vecinos.add(f["tabla"])
    colocadas = set()
    for titulo, color, tablas in MODULOS:
        if foco:
            tablas = [t for t in tablas if t in foco or t in vecinos]
            colocadas.update(set(columnas) - foco - vecinos)
            if not tablas:
                continue
            if not (set(tablas) & foco):
                color = "#F5F5F5"
        w(f'package "{titulo}" {color} {{')
        for t in tablas:
            colocadas.add(t)
            if foco and t in vecinos:
                pkv = ", ".join(pks.get(t, []))
                w(f'  entity "{t}" as {t} #EEEEEE {{\n    * {pkv} <<PK>>\n  }}')
                continue
            w(f'  entity "{t}" as {t} {{')
            pk = pks.get(t, [])
            for c in columnas[t]:
                if c["nombre"] in pk:
                    w(f'    * **{c["nombre"]}** : {tipo_corto(c["tipo"])} <<PK>>{" <<FK>>" if c["nombre"] in fk_cols[t] else ""}')
            w("    --")
            for c in columnas[t]:
                n = c["nombre"]
                if n in pk or c["generada"]:
                    continue
                etiquetas = []
                if n in fk_cols[t]:
                    etiquetas.append("<<FK>>")
                if n in uq_cols.get(t, set()):
                    etiquetas.append("<<UQ>>")
                if a.compacto and not etiquetas:
                    continue
                marca = "*" if not c["nulo"] else " "
                w(f'    {marca} {n} : {tipo_corto(c["tipo"])} {" ".join(etiquetas)}'.rstrip())
            w("  }")
        w("}")
        w("")
    faltan = set(columnas) - colocadas
    assert not faltan, f"tablas sin módulo: {faltan}"

    w("' ── Relaciones (una por FK; las FK compuestas con columna de rol generada")
    w("'    se dibujan con su columna real) ──")
    vistas = set()
    for f in fks.values():
        t, rt = f["tabla"], f["ref"]
        cols = [c for c in f["cols"] if c not in gen[t]]
        clave = (t, rt, tuple(cols))
        if foco and t not in foco and rt not in foco:
            continue
        if clave in vistas or not cols:
            continue
        vistas.add(clave)
        nulo = any(next(x for x in columnas[t] if x["nombre"] == c)["nulo"] for c in cols)
        cols_set = set(cols)
        uno_a_uno = (set(pks.get(t, [])) == cols_set) or any(set(u) == cols_set for u in unicos.get(t, []))
        lado_padre = "|o" if nulo else "||"
        lado_hijo = "o|" if uno_a_uno else "o{"
        etiqueta = ", ".join(cols)
        if t == rt:
            w(f'{rt} {lado_padre}--{lado_hijo} {t} : {etiqueta}')
        else:
            w(f'{rt} {lado_padre}--{lado_hijo} {t} : {etiqueta}')
    w("")
    w("legend right")
    w("  |= Símbolo |= Significado |")
    w("  | * columna | NOT NULL |")
    w("  | <<PK>> / <<FK>> / <<UQ>> | llave primaria / foránea / única |")
    w("  | línea con doble barra → pata de gallo | uno (FK obligatoria) a muchos |")
    w("  | línea con círculo y barra → pata de gallo | cero o uno (FK opcional) a muchos |")
    w("  | línea con doble barra → círculo y barra | uno a cero o uno (FK única) |")
    w("  | ENUM(n) | enumeración de n valores (ver esquema_bd.sql) |")
    w("  | ↑ | UNSIGNED |")
    w("endlegend")
    w("@enduml")
    print("\n".join(L))


if __name__ == "__main__":
    main()
