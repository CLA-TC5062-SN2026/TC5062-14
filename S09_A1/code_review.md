# Revisión de código — Backend de UnCalificado

**Actividad:** S09_A1 — Auditoría de Calidad de Código (individual)  
**Alcance:** Backend Python/Flask, autenticación JWT, servicios de acceso a datos y validaciones.  
**Base de comparación:** `feature/integracion-backend-jwt` (antes de las refactorizaciones).  
**Rama de trabajo individual:** `feature/s09-a1-auditoria-raul`.

## 1. Objetivo y método

Se revisaron funciones de autenticación, validación y persistencia para identificar problemas de claridad, tipado, mantenimiento y posibles riesgos de ejecución. La revisión combina resultados de **Flake8**, **Mypy**, lectura del código y pruebas funcionales con **pytest**. Los números de línea siguientes corresponden a la **versión anterior a los cambios** y pueden desplazarse después de refactorizar.

**Diagnóstico inicial:** Flake8 registró 185 incidencias (184 `E501` y una `E305`). Mypy identificó 14 errores en siete archivos, al analizar 19 archivos fuente. Las 74 pruebas funcionales existentes aprobaron. Estos datos no prueban por sí solos que el código carezca de vulnerabilidades.

## 2. Hallazgos específicos y correcciones

### H-01. Contraseña y usuario opcionales durante el inicio de sesión

- **Ubicación:** `backend/app/auth/routes.py`, función `login()`, líneas 60–81 de la versión inicial.
- **Prioridad:** Importante.
- **Evidencia:** Mypy registró errores de argumento opcional, indexación y acceso a atributos de un usuario que podía ser `None`. La rama original utiliza cortocircuito lógico, por lo que esto no demuestra que el inicio de sesión fallara efectivamente.
- **Impacto:** La seguridad de los valores utilizados queda menos explícita para el lector y para el analizador estático.

**Antes:**

```python
if not isinstance(contrasena, str) or contrasena == "":
    v.error("contrasena", "Es obligatoria.")
if v.errores:
    raise validation(v.errores, "Faltan credenciales.")

# Después de consultar al usuario y comprobar la contraseña:
if not valido or not usuario["activo"]:
    raise unauthorized("CREDENCIALES_INVALIDAS", "Correo o contraseña incorrectos.")
```

**Después:**

```python
if not isinstance(contrasena, str) or contrasena == "":
    v.error("contrasena", "Es obligatoria.")
    raise validation(v.errores, "Faltan credenciales.")
if v.errores:
    raise validation(v.errores, "Faltan credenciales.")

# Después de consultar al usuario y comprobar la contraseña:
if not valido or usuario is None or not usuario["activo"]:
    raise unauthorized("CREDENCIALES_INVALIDAS", "Correo o contraseña incorrectos.")
```

La verificación de bcrypt se mantiene antes del rechazo de credenciales, incluso si el correo no existe. Con ello se conserva la medida que busca evitar diferencias evidentes de tiempo entre usuarios registrados y no registrados.

### H-02. Retornos de servicios incompatibles con el tipo declarado

- **Ubicaciones:** `backend/app/services/usuarios_service.py:67`, `solicitudes_service.py:30,61`, `casos_service.py:14,40` (versión inicial).
- **Prioridad:** Importante.
- **Evidencia:** Cinco errores `return-value` de Mypy. Las funciones prometían `dict`, pero la consulta posterior a una escritura podía producir `dict | None`.
- **Impacto:** Los consumidores esperan un registro válido; un valor nulo inesperado podría causar un error al construir la respuesta.

**Antes (ejemplo en solicitudes):**

```python
return obtener(solicitud_id)
```

**Después:**

```python
def require_row(fila: dict | None, recurso: str) -> dict:
    """Comprueba que una escritura devolvió el registro esperado."""
    if fila is None:
        raise RuntimeError(
            f"No se pudo recuperar {recurso} después de la operación."
        )
    return fila

# En el servicio:
return db.require_row(obtener(solicitud_id), "la solicitud")
```

El método `require_row()` se incorporó en `backend/app/db.py` y se reutilizó en las cinco operaciones correspondientes. **Límite de la solución:** reporta de forma explícita la ausencia del registro, pero no sustituye el diseño de transacciones atómicas ni determina por sí mismo la causa de una consulta nula.

### H-03. Vigencia JWT sin comprobación explícita de tipo

- **Ubicación:** `backend/app/config.py:65` (versión inicial).
- **Prioridad:** Importante para la calidad del contrato de configuración.
- **Evidencia:** Error `arg-type` de Mypy porque `cfg.get("JWT_EXPIRATION")` puede devolver `None` u otro valor.

**Antes:**

```python
segundos = parse_duration(cfg.get("JWT_EXPIRATION"))
```

**Después:**

```python
duracion = cfg.get("JWT_EXPIRATION")
if not isinstance(duracion, str):
    raise ValueError("JWT_EXPIRATION debe ser texto.")
segundos = parse_duration(duracion)
```

La comprobación explicita qué formato acepta la configuración. Se conserva el procesamiento posterior que limita la duración del token.

### H-04. Anotación incompleta para errores de validación

- **Ubicación:** `backend/app/validation.py:31` (versión inicial).
- **Prioridad:** Menor.
- **Evidencia:** Error `var-annotated` de Mypy.

**Antes:** `self.errores = []`  
**Después:** `self.errores: list[dict[str, str]] = []`

La estructura de errores por campo queda documentada en el propio código y se facilita el análisis estático.

### H-05. Propiedades del proveedor JSON de Flask

- **Ubicación:** `backend/app/__init__.py:15–16` (versión inicial).
- **Prioridad:** Menor / compatibilidad de tipado.
- **Evidencia:** Dos errores `attr-defined` de Mypy: la anotación general `JSONProvider` no garantiza los atributos `sort_keys` y `ensure_ascii`.

**Antes:**

```python
app.json.sort_keys = False
app.json.ensure_ascii = False
```

**Después:**

```python
from flask.json.provider import DefaultJSONProvider

# Dentro de create_app():
assert isinstance(app.json, DefaultJSONProvider)
app.json.sort_keys = False
app.json.ensure_ascii = False
```

El cambio documenta el supuesto de que la aplicación emplea `DefaultJSONProvider`. Si en el futuro se configura otro proveedor, habrá que adaptar este punto. El `assert` utilizado es una comprobación de tipo, no una política de seguridad.

### H-06. Líneas extensas y separación de definiciones

- **Ubicación:** Varios archivos de `app/`, `tests/` y `scripts/`, conforme a `S09_A1/output_linter.txt`.
- **Prioridad:** Menor.
- **Evidencia:** 184 hallazgos `E501` por superar 79 caracteres y un `E305` por separación insuficiente entre definiciones.
- **Recomendación:** Dar formato a las líneas extensas sin alterar su lógica, con una configuración de estilo acordada por el equipo. Estos hallazgos **permanecen como deuda pendiente**; no se declara que hayan sido corregidos.

### H-07. Revisión adicional de actualización parcial de ubicación

- **Ubicación:** `backend/app/routes/solicitudes.py`, función `_validar_campos()`.
- **Prioridad:** Requiere revisión; no se considera defecto confirmado.
- **Observación de lectura:** Al recibir `zona` en un `PATCH`, la función incorpora `municipio` y `colonia` a los campos presentes. Conviene probar explícitamente qué sucede si el cliente envía solo uno de ellos.
- **Recomendación:** Agregar pruebas para actualizaciones parciales de `zona` y definir si ambos valores deben proporcionarse juntos. No se modificó este flujo durante la presente auditoría.

## 3. Evaluación de los cinco principios SOLID

| Principio | Observación sobre el código revisado | Evaluación y propuesta |
|---|---|---|
| **S — Responsabilidad única** | `app/auth/routes.py` agrupa validación, coordinación del login y construcción de respuesta; la persistencia está separada en servicios. | Cumplimiento parcial. Mantener la separación de servicios y valorar extraer la validación de registro/inicio de sesión si aumenta su complejidad. |
| **O — Abierto/cerrado** | El conjunto `CAMPOS_EDITABLES` de `solicitudes_service.py` delimita atributos permitidos, pero añadir reglas nuevas requiere editar lógica existente. | Cumplimiento parcial. Centralizar esquemas o reglas extensibles cuando el alcance crezca, sin sobreingeniería para el MVP. |
| **L — Sustitución de Liskov** | No existe una jerarquía de clases de dominio que permita verificar sustitución entre subtipos; sí hay distintos contratos de retorno entre servicios. | No evaluable directamente para herencia. Los retornos ahora explícitos favorecen contratos coherentes, pero no constituyen por sí solos una prueba de LSP. |
| **I — Segregación de interfaces** | Los módulos de servicios separan usuarios, solicitudes y casos de soporte; no hay interfaces formales grandes. | Separación modular favorable. Evitar servicios únicos con operaciones ajenas a un mismo contexto. |
| **D — Inversión de dependencias** | Los servicios importan directamente `db` y dependen de PyMySQL a través de una capa de funciones compartidas. | Cumplimiento parcial. Para pruebas unitarias aisladas, considerar inyección de una abstracción de repositorio; no es indispensable cambiar la arquitectura en esta actividad. |

La aplicación de SOLID se evalúa de acuerdo con la estructura real del proyecto. No todos los principios pueden demostrarse en igual medida en un backend basado principalmente en funciones y módulos.

## 4. Validación de las mejoras

| Indicador | Línea base | Después de las tres refactorizaciones |
|---|---:|---:|
| Errores Mypy | 14 en 7 archivos | 0 en 19 archivos analizados |
| Pruebas pytest | 74 aprobadas | 74 aprobadas, 0 fallidas |
| Flake8 | 185 incidencias | No se ejecutó un recuento final; permanecen observaciones de estilo |
| Revisión de espacios | Sin incidencias en el diff inicial | `git diff --check` sin incidencias |

**Evidencias:** `output_linter.txt` (análisis original), resultados de Mypy y pytest ejecutados en Codespaces, y diferencias de código en la rama `feature/s09-a1-auditoria-raul`.

## 5. Conclusión

La revisión permitió pasar de 14 errores de tipado a cero sin fallos en los 74 casos automatizados disponibles. Las correcciones más relevantes consistieron en manejar explícitamente datos opcionales y reforzar los contratos de retorno. Esto mejora la comprensión del código y la capacidad de detectar inconsistencias antes de ejecutar la aplicación. Las incidencias de formato y los escenarios no cubiertos por pruebas deben tratarse como trabajo pendiente y priorizarse según su impacto.
