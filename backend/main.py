"""UnCalificado - módulo CRUD de casos de soporte (práctica S05-S06-A1).
La autenticación/autorización queda expresamente fuera del alcance de esta actividad.
No ejecutar este servidor de demostración expuesto a Internet.
"""
import os
import uuid
from datetime import datetime

import pymysql
from flask import Flask, jsonify, request

app = Flask(__name__)
PREFIX = '/api/v1'
MOTIVOS = {'agente_no_comprende', 'oficio_no_clasificado', 'ia_no_resolvio', 'otro'}
ESTADOS = {'en_atencion', 'resuelto'}


def conexion():
    return pymysql.connect(
        host=os.getenv('DB_HOST', '127.0.0.1'),
        port=int(os.getenv('DB_PORT', '3306')),
        user=os.getenv('DB_USER', 'root'),
        password=os.getenv('DB_PASSWORD', ''),
        database=os.getenv('DB_NAME', 'uncalificado'),
        charset='utf8mb4', cursorclass=pymysql.cursors.DictCursor,
        autocommit=False, connect_timeout=5,
    )


def respuesta_error(codigo, mensaje, status):
    return jsonify({'codigo': codigo, 'mensaje': mensaje}), status


def usuario_demo():
    value = request.headers.get('X-Demo-User-Id', os.getenv('DEMO_CLIENTE_ID', ''))
    try:
        return str(uuid.UUID(value))
    except (ValueError, TypeError, AttributeError):
        return None


def serializar(row):
    if not row:
        return None
    keys = {'id':'id','cliente_id':'clienteId','solicitud_id':'solicitudId',
            'resumen_conversacion':'resumenConversacion','motivo':'motivo',
            'comentario':'comentario','estado':'estado','atendido_por':'atendidoPor',
            'notas':'notas','creado_en':'creadoEn'}
    return {out: (row[key].isoformat() if isinstance(row[key], datetime) else row[key])
            for key,out in keys.items() if key in row}


@app.get(PREFIX + '/health')
def health():
    try:
        db = conexion()
        try:
            with db.cursor() as cursor:
                cursor.execute('SELECT 1')
        finally:
            db.close()
        return jsonify({'estado': 'ok'}), 200
    except pymysql.MySQLError:
        return respuesta_error('BD_NO_DISPONIBLE', 'No se pudo conectar a la base de datos', 500)


@app.route(PREFIX + '/casos-soporte', methods=['GET', 'POST'])
def casos():
    cliente = usuario_demo()
    if not cliente:
        return respuesta_error('CLIENTE_DEMO_REQUERIDO', 'Indica X-Demo-User-Id válido', 400)
    if request.method == 'POST':
        body = request.get_json(silent=True)
        if not isinstance(body, dict):
            return respuesta_error('DATOS_INVALIDOS', 'Se requiere un objeto JSON', 400)
        motivo = body.get('motivo')
        if motivo not in MOTIVOS:
            return respuesta_error('DATOS_INVALIDOS', 'Motivo no permitido', 400)
        comentario = body.get('comentario')
        if comentario is not None and (not isinstance(comentario, str) or len(comentario) > 2000):
            return respuesta_error('DATOS_INVALIDOS', 'Comentario inválido', 400)
        for campo in ('solicitudId','conversacionId'):
            if body.get(campo):
                try: uuid.UUID(body[campo])
                except (ValueError, TypeError, AttributeError):
                    return respuesta_error('DATOS_INVALIDOS', f'{campo} inválido', 400)
        ident = str(uuid.uuid4())
        try:
            db = conexion()
            try:
                with db.cursor() as cursor:
                    cursor.execute('''INSERT INTO casos_soporte
                        (id,cliente_id,solicitud_id,conversacion_id,motivo,comentario)
                        VALUES (%s,%s,%s,%s,%s,%s)''',
                        (ident, cliente, body.get('solicitudId'), body.get('conversacionId'), motivo, comentario))
                    cursor.execute('SELECT * FROM casos_soporte WHERE id=%s', (ident,))
                    row = cursor.fetchone()
                db.commit()
            except Exception:
                db.rollback()
                raise
            finally: db.close()
        except pymysql.IntegrityError:
            return respuesta_error('REFERENCIA_INVALIDA', 'Usuario o recurso relacionado inexistente', 400)
        except pymysql.MySQLError:
            return respuesta_error('ERROR_BD', 'No fue posible guardar el caso', 500)
        resp = jsonify(serializar(row)); resp.status_code = 201
        resp.headers['Location'] = f'{PREFIX}/casos-soporte/{ident}'
        return resp
    try:
        db = conexion()
        try:
            with db.cursor() as cursor:
                cursor.execute('SELECT * FROM casos_soporte WHERE cliente_id=%s ORDER BY creado_en DESC', (cliente,))
                rows = cursor.fetchall()
        finally: db.close()
        return jsonify({'elementos': [serializar(r) for r in rows],
                        'paginacion': {'pagina': 1, 'tamanoPagina': len(rows), 'total': len(rows)}}), 200
    except pymysql.MySQLError:
        return respuesta_error('ERROR_BD', 'No fue posible consultar casos', 500)


@app.route(PREFIX + '/casos-soporte/<uuid:caso_id>', methods=['GET','PATCH','DELETE'])
def caso_detalle(caso_id):
    cliente = usuario_demo()
    if not cliente:
        return respuesta_error('CLIENTE_DEMO_REQUERIDO', 'Indica X-Demo-User-Id válido', 400)
    try:
        db = conexion()
        try:
            with db.cursor() as cursor:
                cursor.execute('SELECT * FROM casos_soporte WHERE id=%s AND cliente_id=%s', (str(caso_id), cliente))
                row = cursor.fetchone()
                if not row:
                    return respuesta_error('NO_ENCONTRADO', 'Caso inexistente', 404)
                if request.method == 'GET':
                    return jsonify(serializar(row)), 200
                if request.method == 'DELETE':
                    cursor.execute('DELETE FROM casos_soporte WHERE id=%s AND cliente_id=%s', (str(caso_id), cliente))
                    db.commit()
                    return '', 204
                body = request.get_json(silent=True)
                if not isinstance(body, dict) or not body or not set(body).issubset({'estado','notas'}):
                    return respuesta_error('DATOS_INVALIDOS', 'Se esperan estado y/o notas', 400)
                if 'estado' in body and body['estado'] not in ESTADOS:
                    return respuesta_error('DATOS_INVALIDOS', 'Estado inválido', 400)
                if 'notas' in body and (not isinstance(body['notas'], str) or len(body['notas']) > 4000):
                    return respuesta_error('DATOS_INVALIDOS', 'Notas inválidas', 400)
                # La restricción ck_caso_atencion exige administrador para atender/resolver.
                admin = os.getenv('DEMO_ADMIN_ID', '')
                if 'estado' in body:
                    try: admin = str(uuid.UUID(admin))
                    except (ValueError, TypeError, AttributeError):
                        return respuesta_error('ADMIN_DEMO_REQUERIDO', 'Configura DEMO_ADMIN_ID', 400)
                changes=[]; params=[]
                for field in ('estado','notas'):
                    if field in body:
                        changes.append(f'{field}=%s'); params.append(body[field])
                if 'estado' in body:
                    changes.append('atendido_por=%s'); params.append(admin)
                params.extend([str(caso_id),cliente])
                cursor.execute('UPDATE casos_soporte SET '+', '.join(changes)+' WHERE id=%s AND cliente_id=%s', params)
                cursor.execute('SELECT * FROM casos_soporte WHERE id=%s', (str(caso_id),))
                result = cursor.fetchone()
                db.commit()
                return jsonify(serializar(result)), 200
        except Exception:
            db.rollback()
            raise
        finally: db.close()
    except pymysql.IntegrityError:
        return respuesta_error('REFERENCIA_INVALIDA', 'Administrador de prueba inexistente o sin rol', 400)
    except pymysql.MySQLError:
        return respuesta_error('ERROR_BD', 'Error en la operación', 500)


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=int(os.getenv('PORT', '5000')), debug=False)
