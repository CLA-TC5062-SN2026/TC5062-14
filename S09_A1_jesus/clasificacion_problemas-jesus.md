# Clasificación de problemas — Jesús

Auditoría de la rama `feature/s09-a1-auditoria-jesus`. El backend revisado es el del árbol actual: `backend/main.py` (CRUD de casos de soporte, Flask y PyMySQL). El paquete de `origin/feature/s05-s06-a2-auth` no está en esta rama y no entra en este informe.

## Estrategia

Para el backend elegí **pylint 3.3.9**, no flake8 + mypy.

El módulo no tiene anotaciones de tipo. mypy, sin un esfuerzo previo de tipar el archivo, solo repetiría “falta anotación”. flake8 cubriría estilo y algunos errores de sintaxis, y se quedaría corto en las señales de diseño (`too-many-branches`, `too-many-return-statements`) que pylint sí emite y que esta actividad pide separar de los problemas de estilo.

El reporte crudo está en `output_linter-jesus.txt`. Comando: `pylint backend/main.py` sobre el código anterior a la refactorización. Nota: **7.80/10**. No hubo mensajes `E` (error) ni `F` (fatal). Hubo 31 mensajes: 27 de convención (`C`) y 4 de refactor (`R`).

La configuración quedó en `backend/pylintrc` (ignora `.venv`, límite de 100 columnas, que es el default de pylint) y la dependencia de desarrollo en `backend/requirements-dev.txt`. El reporte guardado se generó con las reglas por defecto, antes de añadir ese archivo, para no ocultar avisos.

## Frontend

ESLint ya estaba configurado con las reglas recomendadas en `frontend/eslint.config.js`: `js.configs.recommended`, `tseslint.configs.recommended`, más las de React Hooks y React Refresh. `npm run lint` en `frontend/` terminó sin avisos. No hay hallazgos de frontend que clasificar.

## Críticos

Ninguno en la salida de pylint.

Un crítico, para esta actividad, es algo que puede causar un bug o un problema de seguridad. pylint no reportó variables indefinidas, imports rotos ni excepciones mal capturadas a nivel de sintaxis. Los riesgos de seguridad del módulo (usuario de MySQL por defecto, identidad de demostración heredada, `rollback` que puede tapar la excepción original) no salen en este reporte: pylint no ejecuta el programa ni modela el contrato de PyMySQL. Están en `code_review-jesus.md`, no aquí, para no presentar como hallazgo del linter algo que el linter no dijo.

## Importantes

Afectan la mantenibilidad. Son los cuatro mensajes `R` de pylint, los dos sobre cada vista:

| Código | Dónde | Qué dice | Por qué importa |
|---|---|---|---|
| R0912 | `backend/main.py:68` `casos` | 14 ramas, tope 12 | Alta y listado comparten una función. Un cambio en la validación del POST pasa por el mismo bloque que el GET. |
| R0911 | `backend/main.py:68` `casos` | 10 returns, tope 6 | Cada validación y cada error de base sale por su propio `return`. El flujo no se lee de una pasada. |
| R0912 | `backend/main.py:124` `caso_detalle` | 16 ramas, tope 12 | GET, DELETE y PATCH, más la validación del cuerpo, viven en un solo `try`. |
| R0911 | `backend/main.py:124` `caso_detalle` | 11 returns, tope 6 | El mismo problema, con el añadido de que la validación ocurre ya con la conexión abierta. |

Estos cuatro avisos describen el mismo defecto de diseño: dos funciones hacen de controlador, validador y acceso a datos.

## Menores

Estilo y forma. No cambian el comportamiento.

| Código | Cuántos | Qué es |
|---|---|---|
| C0301 `line-too-long` | 11 | Líneas de 102 a 119 caracteres (tope 100). Están en SQL, mensajes de error y cabeceras. |
| C0116 `missing-function-docstring` | 7 | `conexion`, `respuesta_error`, `usuario_demo`, `serializar`, `health`, `casos`, `caso_detalle` no tienen docstring. El módulo sí explica el alcance al inicio del archivo. |
| C0321 `multiple-statements` | 9 | Dos instrucciones en una línea (`try: uuid.UUID(...)`, `finally: db.close()`, `changes=[]; params=[]`). Dificultan el diff y el breakpoint. |

## Cómo leer esta clasificación

pylint midió forma y complejidad local. La nota 7.80 sale sobre todo de líneas largas, docstrings y de las dos funciones gordas. No mide si `root` con contraseña vacía es aceptable, ni si un `except Exception` se come un `IntegrityError`. Esa lectura está en la revisión manual.
