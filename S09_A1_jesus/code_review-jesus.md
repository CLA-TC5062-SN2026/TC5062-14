# Code review — Jesús

Archivo revisado: `backend/main.py`, el único módulo del backend en esta rama y el que concentra toda la lógica (validación, SQL y HTTP). Las líneas de esta sección son las del código **antes** de la refactorización de la parte 4.

La revisión la hizo el revisor [Revisión de main.py](f6587d77-aa65-408b-81be-7250b18f7674). La sección SOLID, el revisor [Evaluación SOLID](f2e1f718-aa15-441d-b76b-cf7c6282dcf5).

Las consultas usan placeholders `%s`. En el `UPDATE`, los nombres de columna salen de la tupla fija `('estado', 'notas')` y del literal `atendido_por`. Eso no es inyección SQL. `serializar` solo copia las claves de su mapa, así que columnas extra de la fila no salen en el JSON.

## Hallazgos

### La cabecera ausente hereda un cliente fijo

- Gravedad: Importante
- Dónde: `backend/main.py:34-39`
- Problema: si la petición no trae `X-Demo-User-Id`, `usuario_demo()` usa `DEMO_CLIENTE_ID`. Con ese UUID, el listado, el detalle, el borrado y el parche operan como ese cliente. El 400 `CLIENTE_DEMO_REQUERIDO` solo aparece cuando ni la cabecera ni la variable son un UUID.
- Por qué es un problema: quien alcanza el proceso en `127.0.0.1` y omite la cabecera actúa como el cliente de demostración. El filtro `cliente_id=%s` limita las filas, pero la identidad se elige sola. La respuesta incluye `comentario`, `notas` y `resumenConversacion`.

```python
def usuario_demo():
    value = request.headers.get('X-Demo-User-Id')
    try:
        return str(uuid.UUID(value))
    except (ValueError, TypeError, AttributeError):
        return None
```

### La conexión cae en root con contraseña vacía

- Gravedad: Importante
- Dónde: `backend/main.py:18-27`
- Problema: si faltan `DB_USER` y `DB_PASSWORD`, `conexion()` entra a MySQL como `root` y con contraseña `''`. El nombre de la base también tiene default (`uncalificado`).
- Por qué es un problema: en un MySQL local que acepte ese par, la app abre sesión de superusuario. Un fallo posterior corre con el privilegio del administrador de la base, no con el de un usuario limitado al esquema. La contraseña no se imprime ni se devuelve al cliente, pero el default sigue siendo peligroso el día que alguien arranque el proceso sin variables de entorno.

```python
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
```

`DB_PASSWORD` definida y vacía se acepta: hay instalaciones locales así. Lo que se quita es el default silencioso.

### `except Exception` puede sustituir el error original

- Gravedad: Importante
- Dónde: `backend/main.py:99-106` y `backend/main.py:167-174`
- Problema: el `except Exception` hace `db.rollback()` y luego `raise`. `IntegrityError` es subclase de `MySQLError`. Si `rollback()` lanza otro `MySQLError`, esa segunda excepción es la que ven los `except` de afuera, y un fallo de llave foránea puede salir como 500 en lugar de 400 `REFERENCIA_INVALIDA`. En `caso_detalle`, ese `try` también envuelve el 404, la validación del PATCH y los `return`.
- Por qué es un problema: el código intenta conservar el error original y, en el caso en que el `rollback` también falla, lo pierde. Además, cualquier excepción que no sea `pymysql.MySQLError` sale de la vista y Flask responde HTML, fuera del cuerpo `{codigo, mensaje}`.

```python
def revertir(db):
    try:
        db.rollback()
    except pymysql.MySQLError:
        pass
```

El `raise` posterior relanza la excepción del `execute` o del `commit`, no la del `rollback`. La validación del PATCH queda fuera de ese `try`.

### Dos vistas concentran varios casos de uso

- Gravedad: Importante
- Dónde: `backend/main.py:68-120` (`casos`) y `backend/main.py:124-174` (`caso_detalle`)
- Problema: `casos` valida el alta, inserta y lista. `caso_detalle` lee, borra, valida el parche y actualiza, con la validación dentro de la transacción abierta en la línea 130.
- Por qué es un problema: un cambio en el PATCH comparte conexión, `commit` y `except` con el GET y el DELETE. Es el mismo defecto que pylint marcó como `R0911` y `R0912`. La función ya no cabe en la cabeza de quien la modifica.

La corrección parte la validación (`validar_alta`, `validar_parche`) y la persistencia (`insertar_caso`, `listar_casos`, `obtener_caso`, `eliminar_caso`, `actualizar_caso`). Las rutas solo leen HTTP y traducen el resultado. El detalle está en `refactorizacion-jesus.md`.

### El ciclo de conexión está copiado

- Gravedad: Menor
- Dónde: `backend/main.py:56-61`, `89-106`, `111-116` y `129-174`
- Problema: abrir, usar cursor y cerrar en `finally` se repite en health, POST, listado y detalle. El par `IntegrityError` / `MySQLError` está en las líneas 103-106 y 171-174. El UUID se parsea en tres sitios (36-39, 82-86, 152-154).
- Por qué es un problema: el siguiente cambio de cierre o de traducción de errores hay que copiarlo en cada sitio. El GET de la colección no hace `rollback`; el detalle envuelve toda la operación. La diferencia es fácil de perder.

```python
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

### `ident` y `admin` no dicen qué valor guardan

- Gravedad: Menor
- Dónde: `backend/main.py:87-108` y `backend/main.py:150-160`
- Problema: `ident` es el id nuevo del caso. `admin` empieza como el texto de `DEMO_ADMIN_ID` y, si el cuerpo trae `estado`, pasa a ser el UUID que se escribe en `atendido_por`.
- Por qué es un problema: en el UPDATE hay que recordar si `admin` ya fue validado. `ident` se confunde con el `caso_id` de la otra ruta, que es el id de la URL.

```python
caso_id = str(uuid.uuid4())
admin_id = str(uuid.UUID(os.getenv('DEMO_ADMIN_ID', '')))
```

## Sección SOLID

El módulo es un conjunto de funciones. No hay clases de dominio, ni interfaces, ni subtipos. `conexion`, `respuesta_error`, `usuario_demo` y `serializar` tienen un solo trabajo. El peso de SOLID cae en `casos` y `caso_detalle`.

| Principio | ¿Se respeta? | Ejemplo en el código | Propuesta de corrección |
|---|---|---|---|
| Single Responsibility (SRP) | No | `casos` (`backend/main.py:67-120`) valida el alta, inserta y lista. `caso_detalle` (`backend/main.py:123-174`) lee, borra, valida el parche y actualiza. | Dejar cada ruta como traducción HTTP y mover validación y SQL a funciones aparte. |
| Open/Closed (OCP) | Parcialmente | Un motivo nuevo solo se agrega en `MOTIVOS` (`backend/main.py:14`); el chequeo ya está en `backend/main.py:77`. Lo mismo con `ESTADOS` (`backend/main.py:15` y `:145`). Un campo nuevo de PATCH obliga a editar la lista blanca y el `UPDATE` (`backend/main.py:143-162`). | Un mapa campo-columna para el PATCH, y una sola traducción de `IntegrityError` y `MySQLError`, hoy duplicada en `backend/main.py:103-106` y `:171-174`. |
| Liskov Substitution (LSP) | Parcialmente | No hay jerarquía. El módulo son las funciones de `backend/main.py:18-174`. No existe un supertipo que un sustituto pueda romper. | No inventar herencia. Si más adelante hay un puerto de persistencia, la implementación PyMySQL y un doble de prueba deben devolver los mismos resultados y los mismos errores de dominio. |
| Interface Segregation (ISP) | Parcialmente | No hay ABC ni Protocol. `casos` agrupa GET y POST (`backend/main.py:67-68`); `caso_detalle` agrupa GET, PATCH y DELETE (`backend/main.py:123-124`). El cliente HTTP elige el método y no implementa operaciones que no usa. | Al extraer persistencia, separar lectura y escritura. No hace falta una clase con las cinco operaciones. |
| Dependency Inversion (DIP) | No | `conexion` (`backend/main.py:18-27`) construye `pymysql.connect`. Las rutas la llaman directo (`backend/main.py:89`, `:111`, `:129`) y capturan `pymysql.IntegrityError` y `pymysql.MySQLError` (`backend/main.py:103-106` y `:171-174`). | Traducir las excepciones del driver en el borde de persistencia. La ruta no debería nombrar a PyMySQL. |

**SRP.** Partir las dos rutas. `validar_alta` y `validar_parche` devuelven datos ya revisados o un error. `insertar_caso`, `listar_casos`, `obtener_caso`, `actualizar_caso` y `eliminar_caso` se quedan con el SQL y el `commit`. Las rutas leen el header, llaman y arman el status. `health`, `serializar` y `respuesta_error` pueden quedarse como están.

**OCP.** El punto abierto no son los catálogos `MOTIVOS` y `ESTADOS`, que ya se extienden en un solo conjunto. El punto cerrado es el PATCH: la lista blanca y el armado del `SET` están escritos a mano. Un diccionario de campos permitidos evita otro `if` dentro de `caso_detalle` cuando aparezca un campo nuevo. La otra repetición es la traducción de errores de MySQL, que conviene dejar en una función.

**LSP.** No hay un contrato de supertipo que se esté rompiendo. Inventar una clase base de casos no acerca el diseño a LSP. El momento en que sí aplica es el puerto de persistencia: «no encontrado», «referencia inválida» y el registro guardado tienen que significar lo mismo para PyMySQL y para un sustituto de prueba, sin filtrar el cursor ni las excepciones del driver.

**ISP.** Agrupar métodos HTTP en una vista Flask es una decisión de ruta, no una interfaz que el cliente esté obligado a implementar. No hace falta dividir las URLs. Al extraer la persistencia, quien solo lista no debería depender de `eliminar`.

**DIP.** El siguiente paso, después de extraer las funciones de SQL, es que esas funciones sean el único lugar que importa el driver. La ruta recibe un error de dominio (`ErrorNegocio`) y deja de capturar `IntegrityError`. `usuario_demo` puede seguir leyendo el header: en este módulo el request de Flask es el borde HTTP, y moverlo a un argumento no cambia la dependencia del driver.
