# Refactorización — Jesús

Tres cambios, los de mayor peso del code review y de SOLID. Cada propuesta salió de un revisor distinto y el código final las junta en `backend/main.py` para que no se pisen.

- Excepciones: [Propuesta de excepciones](fedad0d2-4fbe-4a0d-9a55-37c54d4d2f85)
- Separación de responsabilidades: [Propuesta de separar rutas](d5d586d0-d6ea-4d9a-88e0-78e5fe778be5)
- Credenciales e identidad: [Propuesta de secretos por defecto](4b8807c1-f2c2-46cb-ab51-8a3dad3699b1)

pylint sobre el resultado: **8.94/10** (antes 7.80). Desaparecieron `too-many-branches`, `too-many-return-statements`, `line-too-long` y `multiple-statements`. Quedan docstrings ausentes, que esta ronda no tocaba.

El contrato que se conserva: prefijo `/api/v1`, códigos `DATOS_INVALIDOS`, `CLIENTE_DEMO_REQUERIDO`, `NO_ENCONTRADO`, `REFERENCIA_INVALIDA`, `ADMIN_DEMO_REQUERIDO`, `ERROR_BD` y `BD_NO_DISPONIBLE`, el 201 con `Location`, el 204 vacío, y el SQL con parámetros. Un caso inexistente sigue respondiendo 404 antes de validar el cuerpo del PATCH.

## 1. El rollback ya no se come la excepción original

**Justificación.** `IntegrityError` es un `MySQLError`. El `except Exception` hacía `rollback()` y luego `raise`. Si `rollback()` lanzaba otro error de MySQL, el `except pymysql.IntegrityError` de afuera ya no veía la causa y un 400 pasaba a 500. En el detalle, la validación del PATCH estaba dentro de ese `try`.

**Antes** (`caso_detalle`, el POST repetía el mismo patrón):

```python
        try:
            with db.cursor() as cursor:
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
```

**Después.** `revertir` absorbe un fallo de `rollback` y el `raise` del contexto relanza la excepción del `execute` o del `commit`. La validación vive en `validar_parche`, fuera de la transacción. `error_mysql` distingue integridad (400) de cualquier otro error del driver (500) en un solo sitio.

```python
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
```

## 2. Las rutas dejan de validar y de hablar con MySQL

**Justificación.** SRP, y los avisos `R0911` / `R0912` de pylint. `casos` y `caso_detalle` mezclaban reglas de negocio, SQL y status HTTP. Un cambio en el PATCH compartía `commit` y `except` con el GET y el DELETE.

**Antes.** Una sola función, de la línea 68 a la 120, con el alta y el listado. `caso_detalle` (124-174) hacía lo mismo con tres métodos.

**Después.** La ruta solo identifica al cliente y elige la operación. `ErrorNegocio` viaja hasta un `errorhandler`, así la vista no captura excepciones del driver.

```python
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
```

`validar_alta` y `validar_parche` concentran las reglas. `insertar_caso`, `listar_casos`, `obtener_caso`, `eliminar_caso` y `actualizar_caso` concentran el SQL. El nombre `caso_id` sustituye a `ident` en el alta; `admin_id` solo existe después de validar `DEMO_ADMIN_ID`.

Las columnas del `UPDATE` siguen saliendo de un conjunto fijo (`COLUMNAS_PARCHE`: `estado`, `notas`, `atendido_por`). Los valores van por `%s`.

## 3. Ya no hay usuario root ni cliente de demostración por omisión

**Justificación.** Dos defaults inseguros. Sin `DB_USER` / `DB_PASSWORD`, la app entraba como `root` con contraseña vacía. Sin `X-Demo-User-Id`, usaba `DEMO_CLIENTE_ID` y operaba como ese cliente. El servidor escucha en `127.0.0.1`, pero el default no debería depender de que nadie lo publique.

**Antes:**

```python
def conexion():
    return pymysql.connect(
        host=os.getenv('DB_HOST', '127.0.0.1'),
        port=int(os.getenv('DB_PORT', '3306')),
        user=os.getenv('DB_USER', 'root'),
        password=os.getenv('DB_PASSWORD', ''),
        database=os.getenv('DB_NAME', 'uncalificado'),
        ...
    )

def usuario_demo():
    value = request.headers.get('X-Demo-User-Id', os.getenv('DEMO_CLIENTE_ID', ''))
    try:
        return str(uuid.UUID(value))
    except (ValueError, TypeError, AttributeError):
        return None
```

**Después.** `conexion()` exige `DB_USER`, `DB_NAME` y que `DB_PASSWORD` esté definida (puede ir vacía si el laboratorio lo necesita). Si falta algo, lanza `ConfiguracionBDError` antes de llamar a PyMySQL. Un `errorhandler` la responde en JSON, 503 `CONFIGURACION_BD`, porque esa excepción no es un `MySQLError` y, sin el manejador, Flask la ocultaría en un 500 HTML. Host y puerto siguen en `127.0.0.1` y `3306`.

`usuario_demo()` solo lee `X-Demo-User-Id`. Sin cabecera, o con un valor que no es UUID, devuelve `None` y las rutas responden 400 `CLIENTE_DEMO_REQUERIDO`.

**Cambio observable, a propósito.** Arrancar sin variables de base ya no intenta `root`. Una petición sin cabecera ya no hereda `DEMO_CLIENTE_ID`. Hay que exportar `DB_USER`, `DB_PASSWORD` y `DB_NAME`, y enviar `X-Demo-User-Id` en cada llamada.
