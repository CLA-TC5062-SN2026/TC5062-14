# Clasificación de problemas de calidad de código

## Contexto

La auditoría se realizó sobre el backend de UnCalificado, desarrollado en Python con Flask y MySQL. Se utilizaron Flake8 y Mypy para identificar problemas de estilo y tipado antes de realizar modificaciones.

## Resultados iniciales

| Herramienta | Resultado |
|---|---|
| Flake8 | 185 hallazgos: 184 E501 y 1 E305 |
| Mypy | 14 errores distribuidos en 7 archivos |
| Pruebas funcionales previas | 74 aprobadas |

## Problemas críticos

No se confirmó ningún problema crítico mediante estas ejecuciones. Los resultados de análisis estático no permiten asegurar que la aplicación esté libre de vulnerabilidades.

## Problemas importantes

### Posibles retornos nulos en los servicios

**Archivos:** `usuarios_service.py`, `solicitudes_service.py` y `casos_service.py`.

Mypy identifica cinco retornos declarados como `dict` que, por las funciones de consulta utilizadas, también pueden ser `None`. Conviene establecer una respuesta explícita cuando una consulta posterior a una escritura no recupera el registro esperado.

### Manejo de valores opcionales durante el login

**Archivo:** `app/auth/routes.py`.

Se identificaron advertencias relacionadas con la contraseña, el usuario recuperado y el acceso a sus atributos. Aunque el flujo actual utiliza evaluación de cortocircuito, se puede mejorar la comprobación explícita de los valores antes de utilizarlos.

### Tipado de configuración y validación

**Archivos:** `app/config.py` y `app/validation.py`.

Mypy reporta un argumento opcional en la configuración de vigencia JWT y la falta de una anotación para la colección de errores de validación. Son oportunidades para precisar los contratos entre funciones.

## Problemas menores

### Longitud de líneas

Flake8 reportó 184 incidencias E501 porque distintas líneas superan el límite de 79 caracteres. Esto dificulta la lectura en algunos casos, pero no demuestra un defecto funcional.

### Separación entre definiciones

Se identificó una incidencia E305, relacionada con la separación requerida después de una función o clase.

### Atributos del proveedor JSON de Flask

Mypy señaló dos accesos a propiedades de `JSONProvider` en `app/__init__.py`. Corresponde revisar el tipo declarado del proveedor frente a la implementación concreta de Flask antes de considerar estos mensajes como defectos funcionales.

## Priorización de mejoras

Se dará prioridad al manejo de valores opcionales en autenticación, la consistencia de los retornos de los servicios y la claridad de las validaciones. Los ajustes de formato se consideran de menor impacto.

La clasificación distingue los hallazgos de las herramientas de los fallos funcionales comprobados. Las 74 pruebas aprobadas son evidencia de los escenarios evaluados, pero no sustituyen la revisión de calidad.
