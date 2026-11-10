# Refactorización del backend de UnCalificado

## Objetivo

Mejorar la calidad del código del backend mediante tres refactorizaciones basadas en los resultados del análisis estático con Mypy. El objetivo fue aclarar las validaciones, hacer consistentes los contratos de retorno y precisar el tipado sin alterar los flujos funcionales existentes.

## 1. Validación explícita en la autenticación

**Archivo:** `backend/app/auth/routes.py`.

**Hallazgo:** Mypy identificó cinco errores vinculados con valores opcionales de contraseña y usuario en el inicio de sesión.

### Antes

```python
if not isinstance(contrasena, str) or contrasena == "":
    v.error("contrasena", "Es obligatoria.")
if v.errores:
    raise validation(v.errores, "Faltan credenciales.")

# Más adelante, después de verificar la contraseña:
if not valido or not usuario["activo"]:
    raise unauthorized("CREDENCIALES_INVALIDAS", "Correo o contraseña incorrectos.")
```

### Después

```python
if not isinstance(contrasena, str) or contrasena == "":
    v.error("contrasena", "Es obligatoria.")
    raise validation(v.errores, "Faltan credenciales.")
if v.errores:
    raise validation(v.errores, "Faltan credenciales.")

# Más adelante, después de verificar la contraseña:
if not valido or usuario is None or not usuario["activo"]:
    raise unauthorized("CREDENCIALES_INVALIDAS", "Correo o contraseña incorrectos.")
```

### Justificación y resultado

Se hace explícita la comprobación de los valores antes de utilizarlos. El inicio de sesión conserva la verificación bcrypt con un hash ficticio cuando el correo no existe, por lo que no se elimina la protección existente contra la enumeración de cuentas. **Resultado:** Mypy pasó de 14 a 9 errores y las 74 pruebas siguieron aprobándose.

## 2. Comprobación centralizada de registros después de una escritura

**Archivos:** `backend/app/db.py`, `backend/app/services/usuarios_service.py`, `backend/app/services/solicitudes_service.py` y `backend/app/services/casos_service.py`.

**Hallazgo:** Cinco funciones declaradas con retorno `dict` devolvían directamente una consulta con tipo `dict | None`.

### Antes

Por ejemplo, al crear una solicitud, el retorno tenía esta forma:

```python
return obtener(solicitud_id)
```

La función `obtener()` puede devolver `None`, lo que contradice el contrato anunciado por `crear()`.

### Después

Se agregó una función compartida en `db.py`:

```python
def require_row(fila: dict | None, recurso: str) -> dict:
    """Comprueba que una escritura devolvió el registro esperado."""
    if fila is None:
        raise RuntimeError(
            f"No se pudo recuperar {recurso} después de la operación."
        )
    return fila
```

Las operaciones de escritura la utilizan al recuperar su resultado:

```python
return db.require_row(obtener(solicitud_id), "la solicitud")
```

El mismo patrón se aplicó a las funciones correspondientes de usuarios y casos de soporte.

### Justificación y resultado

La verificación se concentra en un solo lugar y evita repetir condiciones en cada servicio. Las búsquedas normales continúan pudiendo devolver `None`, mientras que las operaciones que prometen un registro fallan de forma explícita si no lo recuperan. **Resultado:** Mypy bajó de 9 a 4 errores; las 74 pruebas pasaron nuevamente.

**Consideración pendiente:** esta comprobación detecta la ausencia del registro después de la escritura, pero no revierte automáticamente la transacción ya confirmada. Conviene agregar pruebas específicas para ese escenario excepcional y definir el manejo del error a nivel HTTP.

## 3. Precisión del tipado en configuración, validación y JSON

**Archivos:** `backend/app/config.py`, `backend/app/validation.py` y `backend/app/__init__.py`.

**Hallazgo:** Mypy reportaba cuatro errores: uno por argumento opcional al interpretar la vigencia del JWT, uno por falta de anotación de la lista de errores y dos por atributos del proveedor JSON declarado con un tipo general.

### Antes

```python
segundos = parse_duration(cfg.get("JWT_EXPIRATION"))
```

```python
self.errores = []
```

```python
app.json.sort_keys = False
app.json.ensure_ascii = False
```

### Después

En `config.py`:

```python
duracion = cfg.get("JWT_EXPIRATION")
if not isinstance(duracion, str):
    raise ValueError("JWT_EXPIRATION debe ser texto.")
segundos = parse_duration(duracion)
```

En `validation.py`:

```python
self.errores: list[dict[str, str]] = []
```

En `app/__init__.py` se importó `DefaultJSONProvider` y se verificó el tipo concreto antes de usar sus propiedades:

```python
from flask.json.provider import DefaultJSONProvider

# Dentro de create_app():
assert isinstance(app.json, DefaultJSONProvider)
app.json.sort_keys = False
app.json.ensure_ascii = False
```

### Justificación y resultado

La comprobación de la duración evita pasar un valor de tipo incompatible; la anotación documenta la estructura de los errores de validación; y la comprobación del proveedor JSON hace explícita la dependencia de la implementación utilizada por Flask. **Resultado:** Mypy terminó sin errores en los 19 archivos analizados y las 74 pruebas funcionales siguieron aprobándose.

**Consideración pendiente:** el uso de `assert` para verificar el proveedor depende de que la aplicación conserve `DefaultJSONProvider`. Si se introduce un proveedor personalizado, debe revisarse esa decisión; además, las aserciones pueden deshabilitarse al ejecutar Python con optimización.

## Verificación de las mejoras

| Indicador | Diagnóstico inicial | Después de las refactorizaciones |
|---|---:|---:|
| Errores Mypy | 14 | 0 |
| Archivos analizados por Mypy | 19 | 19 |
| Pruebas automatizadas aprobadas | 74 | 74 |
| Pruebas fallidas | 0 | 0 |

**Salida final de Mypy:**

```text
Success: no issues found in 19 source files
```

**Salida final de pytest:**

```text
74 passed in 5.45s
```

Los cambios abarcaron ocho archivos Python y `git diff --check` no identificó problemas de espacios. El diagnóstico original se conserva en `S09_A1/output_linter.txt` para documentar el punto de partida.

## Conclusión

Las tres refactorizaciones atendieron los 14 errores de tipado inicialmente detectados sin introducir fallas en los 74 escenarios automatizados disponibles. La experiencia mostró que el análisis estático resulta más útil cuando los hallazgos se convierten en comprobaciones y contratos explícitos dentro del código. Sin embargo, superar Mypy y pytest no implica eliminar toda la deuda técnica: siguen pendientes los hallazgos de formato de Flake8 y la revisión de escenarios no cubiertos por las pruebas existentes.
