"""UnCalificado - módulo CRUD de casos de soporte (práctica S05-S06-A1).
La autenticación/autorización queda expresamente fuera del alcance de esta actividad.
No ejecutar este servidor de demostración expuesto a Internet.
"""
import os
import uuid
from contextlib import contextmanager
from datetime import datetime

import pymysql
from flask import Flask, jsonify, request

app = Flask(__name__)
PREFIX = '/api/v1'
MOTIVOS = {'agente_no_comprende', 'oficio_no_clasificado', 'ia_no_resolvio', 'otro'}
ESTADOS = {'en_atencion', 'resuelto'}
COLUMNAS_PARCHE = {'estado', 'notas', 'atendido_por'}


class ConfiguracionBDError(RuntimeError):
    """Faltan DB_USER, DB_PASSWORD o DB_NAME para abrir MySQL."""


class ErrorNegocio(Exception):
    """Fallo de validación o de base, ya traducido a código HTTP."""

    def __init__(self, codigo, mensaje, status):
        super().__init__(mensaje)
        self.codigo = codigo
        self.mensaje = mensaje
        self.status = status


def conexion():
    faltantes = [
        nombre for nombre in ('DB_USER', 'DB_NAME')
        if os.environ.get(nombre, '').strip() == ''
    ]
    if 'DB_PASSWORD' not in os.environ:
        faltantes.append('DB_PASSWORD')
    if faltantes:
        raise ConfiguracionBDError(
            'Faltan variables de entorno obligatorias: ' + ', '.join(faltantes)
        )
    return pymysql.connect(
        host=os.getenv('DB_HOST', '127.0.0.1'),
        port=int(os.getenv('DB_PORT', '3306')),
        user=os.environ['DB_USER'],
        password=os.environ['DB_PASSWORD'],
        database=os.environ['DB_NAME'],
        charset='utf8mb4',
        cursorclass=pymysql.cursors.DictCursor,
        autocommit=False,
        connect_timeout=5,
    )


def respuesta_error(codigo, mensaje, status):
    return jsonify({'codigo': codigo, 'mensaje': mensaje}), status


@app.errorhandler(ConfiguracionBDError)
def configuracion_bd_incompleta(error):
    return respuesta_error('CONFIGURACION_BD', str(error), 503)


@app.errorhandler(ErrorNegocio)
def error_negocio(error):
    return respuesta_error(error.codigo, error.mensaje, error.status)


def usuario_demo():
    value = request.headers.get('X-Demo-User-Id')
    try:
        return str(uuid.UUID(value))
    except (ValueError, TypeError, AttributeError):
        return None


def serializar(row):
    if not row:
        return None
    keys = {
        'id': 'id',
        'cliente_id': 'clienteId',
        'solicitud_id': 'solicitudId',
        'resumen_conversacion': 'resumenConversacion',
        'motivo': 'motivo',
        'comentario': 'comentario',
        'estado': 'estado',
        'atendido_por': 'atendidoPor',
        'notas': 'notas',
        'creado_en': 'creadoEn',
    }
    return {
        out: (row[key].isoformat() if isinstance(row[key], datetime) else row[key])
        for key, out in keys.items() if key in row
    }


def revertir(db):
    try:
        db.rollback()
    except pymysql.MySQLError:
        pass


@contextmanager
def con_conexion(escribir=False):
    db = conexion()
    try:
        yield db
        if escribir:
            db.commit()
    except Exception:
        if escribir:
            revertir(db)
        raise
    finally:
        db.close()


def error_mysql(error, mensaje_integridad, mensaje_generico):
    if isinstance(error, pymysql.IntegrityError):
        return ErrorNegocio('REFERENCIA_INVALIDA', mensaje_integridad, 400)
    return ErrorNegocio('ERROR_BD', mensaje_generico, 500)


def validar_alta(body):
    if not isinstance(body, dict):
        raise ErrorNegocio('DATOS_INVALIDOS', 'Se requiere un objeto JSON', 400)
    motivo = body.get('motivo')
    if motivo not in MOTIVOS:
        raise ErrorNegocio('DATOS_INVALIDOS', 'Motivo no permitido', 400)
    comentario = body.get('comentario')
    if comentario is not None and (
        not isinstance(comentario, str) or len(comentario) > 2000
    ):
        raise ErrorNegocio('DATOS_INVALIDOS', 'Comentario inválido', 400)
    for campo in ('solicitudId', 'conversacionId'):
        if body.get(campo):
            try:
                uuid.UUID(body[campo])
            except (ValueError, TypeError, AttributeError) as error:
                raise ErrorNegocio(
                    'DATOS_INVALIDOS', f'{campo} inválido', 400
                ) from error
    return {
        'motivo': motivo,
        'comentario': comentario,
        'solicitud_id': body.get('solicitudId'),
        'conversacion_id': body.get('conversacionId'),
    }


def validar_parche(body):
    campos = {'estado', 'notas'}
    if not isinstance(body, dict) or not body or not set(body).issubset(campos):
        raise ErrorNegocio('DATOS_INVALIDOS', 'Se esperan estado y/o notas', 400)
    if 'estado' in body and body['estado'] not in ESTADOS:
        raise ErrorNegocio('DATOS_INVALIDOS', 'Estado inválido', 400)
    if 'notas' in body and (not isinstance(body['notas'], str) or len(body['notas']) > 4000):
        raise ErrorNegocio('DATOS_INVALIDOS', 'Notas inválidas', 400)
    cambios = []
    if 'estado' in body:
        cambios.append(('estado', body['estado']))
    if 'notas' in body:
        cambios.append(('notas', body['notas']))
    if 'estado' in body:
        try:
            admin_id = str(uuid.UUID(os.getenv('DEMO_ADMIN_ID', '')))
        except (ValueError, TypeError, AttributeError) as error:
            raise ErrorNegocio(
                'ADMIN_DEMO_REQUERIDO', 'Configura DEMO_ADMIN_ID', 400
            ) from error
        cambios.append(('atendido_por', admin_id))
    return cambios


def insertar_caso(cliente_id, datos):
    caso_id = str(uuid.uuid4())
    try:
        with con_conexion(escribir=True) as db:
            with db.cursor() as cursor:
                cursor.execute(
                    '''INSERT INTO casos_soporte
                    (id, cliente_id, solicitud_id, conversacion_id, motivo, comentario)
                    VALUES (%s, %s, %s, %s, %s, %s)''',
                    (
                        caso_id, cliente_id, datos['solicitud_id'],
                        datos['conversacion_id'], datos['motivo'], datos['comentario'],
                    ),
                )
                cursor.execute('SELECT * FROM casos_soporte WHERE id=%s', (caso_id,))
                row = cursor.fetchone()
    except pymysql.MySQLError as error:
        raise error_mysql(
            error,
            'Usuario o recurso relacionado inexistente',
            'No fue posible guardar el caso',
        ) from error
    return caso_id, row


def listar_casos(cliente_id):
    try:
        with con_conexion() as db:
            with db.cursor() as cursor:
                cursor.execute(
                    '''SELECT * FROM casos_soporte
                    WHERE cliente_id=%s ORDER BY creado_en DESC''',
                    (cliente_id,),
                )
                return cursor.fetchall()
    except pymysql.MySQLError as error:
        raise ErrorNegocio('ERROR_BD', 'No fue posible consultar casos', 500) from error


def obtener_caso(cliente_id, caso_id):
    try:
        with con_conexion() as db:
            with db.cursor() as cursor:
                cursor.execute(
                    'SELECT * FROM casos_soporte WHERE id=%s AND cliente_id=%s',
                    (caso_id, cliente_id),
                )
                return cursor.fetchone()
    except pymysql.MySQLError as error:
        raise ErrorNegocio('ERROR_BD', 'Error en la operación', 500) from error


def eliminar_caso(cliente_id, caso_id):
    try:
        with con_conexion(escribir=True) as db:
            with db.cursor() as cursor:
                cursor.execute(
                    'SELECT id FROM casos_soporte WHERE id=%s AND cliente_id=%s',
                    (caso_id, cliente_id),
                )
                if cursor.fetchone() is None:
                    return False
                cursor.execute(
                    'DELETE FROM casos_soporte WHERE id=%s AND cliente_id=%s',
                    (caso_id, cliente_id),
                )
        return True
    except pymysql.MySQLError as error:
        raise error_mysql(
            error,
            'Administrador de prueba inexistente o sin rol',
            'Error en la operación',
        ) from error


def actualizar_caso(cliente_id, caso_id, cambios):
    asignaciones = []
    params = []
    for columna, valor in cambios:
        if columna not in COLUMNAS_PARCHE:
            raise ErrorNegocio('DATOS_INVALIDOS', 'Se esperan estado y/o notas', 400)
        asignaciones.append(f'{columna}=%s')
        params.append(valor)
    params.extend([caso_id, cliente_id])
    sql = (
        'UPDATE casos_soporte SET ' + ', '.join(asignaciones)
        + ' WHERE id=%s AND cliente_id=%s'
    )
    try:
        with con_conexion(escribir=True) as db:
            with db.cursor() as cursor:
                cursor.execute(
                    'SELECT id FROM casos_soporte WHERE id=%s AND cliente_id=%s',
                    (caso_id, cliente_id),
                )
                if cursor.fetchone() is None:
                    return None
                cursor.execute(sql, params)
                cursor.execute('SELECT * FROM casos_soporte WHERE id=%s', (caso_id,))
                return cursor.fetchone()
    except pymysql.MySQLError as error:
        raise error_mysql(
            error,
            'Administrador de prueba inexistente o sin rol',
            'Error en la operación',
        ) from error


@app.get(PREFIX + '/health')
def health():
    try:
        with con_conexion() as db:
            with db.cursor() as cursor:
                cursor.execute('SELECT 1')
        return jsonify({'estado': 'ok'}), 200
    except pymysql.MySQLError:
        return respuesta_error(
            'BD_NO_DISPONIBLE', 'No se pudo conectar a la base de datos', 500
        )


@app.route(PREFIX + '/casos-soporte', methods=['GET', 'POST'])
def casos():
    cliente = usuario_demo()
    if not cliente:
        return respuesta_error(
            'CLIENTE_DEMO_REQUERIDO', 'Indica X-Demo-User-Id válido', 400
        )
    if request.method == 'POST':
        datos = validar_alta(request.get_json(silent=True))
        caso_id, row = insertar_caso(cliente, datos)
        resp = jsonify(serializar(row))
        resp.status_code = 201
        resp.headers['Location'] = f'{PREFIX}/casos-soporte/{caso_id}'
        return resp
    rows = listar_casos(cliente)
    return jsonify({
        'elementos': [serializar(fila) for fila in rows],
        'paginacion': {'pagina': 1, 'tamanoPagina': len(rows), 'total': len(rows)},
    }), 200


@app.route(PREFIX + '/casos-soporte/<uuid:caso_id>', methods=['GET', 'PATCH', 'DELETE'])
def caso_detalle(caso_id):
    cliente = usuario_demo()
    if not cliente:
        return respuesta_error(
            'CLIENTE_DEMO_REQUERIDO', 'Indica X-Demo-User-Id válido', 400
        )
    ident = str(caso_id)
    if request.method == 'GET':
        return responder_lectura(cliente, ident)
    if request.method == 'DELETE':
        return responder_borrado(cliente, ident)
    return responder_parche(cliente, ident)


def responder_lectura(cliente, ident):
    row = obtener_caso(cliente, ident)
    if not row:
        return respuesta_error('NO_ENCONTRADO', 'Caso inexistente', 404)
    return jsonify(serializar(row)), 200


def responder_borrado(cliente, ident):
    if not eliminar_caso(cliente, ident):
        return respuesta_error('NO_ENCONTRADO', 'Caso inexistente', 404)
    return '', 204


def responder_parche(cliente, ident):
    if obtener_caso(cliente, ident) is None:
        return respuesta_error('NO_ENCONTRADO', 'Caso inexistente', 404)
    cambios = validar_parche(request.get_json(silent=True))
    result = actualizar_caso(cliente, ident, cambios)
    if result is None:
        return respuesta_error('NO_ENCONTRADO', 'Caso inexistente', 404)
    return jsonify(serializar(result)), 200


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=int(os.getenv('PORT', '5000')), debug=False)
