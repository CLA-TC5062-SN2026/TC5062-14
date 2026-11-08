# Revisión crítica de los componentes generados con IA

> **Actividad:** S07-S08-A1, revisión de la Parte 2 (componentes esenciales de UI).
> **Insumos:** [`evidencias/notas_generacion_ia.md`](evidencias/notas_generacion_ia.md) (registro del agente durante la generación) y el código de `frontend/src/`.
> **Seguimiento:** el Navbar volvió a modificarse durante la Parte 3 (hallazgos A3-1, A3-3 y A3-4: menú desplazable con zoom de 400 %, nombre estable del botón «Menú» y contorno de foco sin recorte). Esos cambios están documentados en [`accesibilidad.md`](accesibilidad.md), sección 5.1. Esta revisión describe el estado previo a la Parte 3. Después, el rediseño de la pantalla orientado al producto movió el paso a barra horizontal del Navbar de 768 a 1024 px (R-1) y reorganizó `DemoComponentesPage`; ver [`accesibilidad.md`](accesibilidad.md), sección 9.
> **Estado:** revisión técnica preparada con apoyo del agente de IA, **revisada y aprobada por el equipo** como parte de la propuesta de la actividad S07-S08-A1. Esta revisión no es la auditoría formal WCAG 2.1 de la Parte 3. Las comprobaciones manuales de la sección 8 siguen pendientes.

## 1. Cómo se hizo la revisión

1. **Lectura del código** de `Button`, `InputField`, `Card`, `Navbar` y `DemoComponentesPage` / `FormularioLoginDemo`, comparándolo con las decisiones registradas en [`evidencias/notas_generacion_ia.md`](evidencias/notas_generacion_ia.md).
2. **Pruebas en un navegador real** con un script automatizado (`playwright-core` 1.64.1, que controla Microsoft Edge instalado en el equipo, en modo *headless*) sobre el servidor de desarrollo `http://localhost:5173/`.
   - `playwright-core` se instaló en una carpeta temporal **fuera del repositorio**; no es dependencia del proyecto.
   - Una copia del script (versión corregida) está en [`evidencias/revisar.mjs`](evidencias/revisar.mjs). Las salidas originales de esta revisión se transcribieron en [`evidencias/revision_navegador_sesion.txt`](evidencias/revision_navegador_sesion.txt), y una reejecución sobre el código actual está en [`evidencias/revision_navegador_reejecucion.txt`](evidencias/revision_navegador_reejecucion.txt). La versión inicial del script, con los dos errores descritos más abajo, no se conservó.
   - El script hace 34 comprobaciones: ausencia de desplazamiento horizontal a 320, 360, 768 y 1280 px; teclado (Tab, Enter, Espacio, Escape); retorno del foco; errores del formulario; carga; envíos duplicados; enlaces por rol; y errores en la consola.
   - Para contar los envíos se intercepta `setTimeout` con el retardo de 1500 ms de la simulación.
3. **Revisión visual** de capturas de pantalla a 360 px (página completa, menú abierto y errores del formulario) y a 1280 px (sesión simulada).
4. **Verificación de los datos** contra la rama `origin/feature/s05-s06-a2-auth`: `backend/app/validation.py`, `backend/app/routes/solicitudes.py`, `backend/app/services/solicitudes_service.py` y `backend/app/auth/routes.py`.

### Resultado de las pruebas automatizadas

| Ejecución | Comprobaciones | Fallas | Análisis |
|---|---|---|---|
| Antes de las correcciones de esta revisión | 34 | 9 | **3 fallas reales** del código y **6 errores del propio script** (ver abajo) |
| Después de las correcciones | 34 | **0** | Sin errores en la consola del navegador |

**Fallas reales (antes):**
- Durante la carga del botón «Iniciar sesión», el foco quedaba en `BODY`.
- Al terminar la carga, el foco también quedaba en `BODY`.
- El botón «Probar estado de carga» perdía el foco al activarse.

**Errores del script, no del código:**
- Cinco comprobaciones de rol (el rol en el menú móvil y los cuatro roles en escritorio) buscaban el texto exacto «Cliente», pero el elemento contiene «Rol: Cliente» (prefijo oculto para lectores de pantalla).
- Una comprobación reportó dos envíos. El botón se localizaba por su nombre accesible, que cambia durante la carga a «Iniciando sesión (simulación)…». Playwright esperó a que el botón recuperara su nombre, ya terminada la carga, y entonces hizo un clic válido, que generó un segundo envío legítimo.

Ambos errores se corrigieron en el script: el rol se busca como texto contenido y el botón se localiza con `form button[type="submit"]`. Se documentan aquí para no atribuir al código fallas que no tiene.

## 2. Button

### Propuesta original del agente (Parte 2)

`Button` extiende los atributos nativos de `<button>`. El `type` por defecto es `"button"`. Las variantes son `primary` y `secondary`, con altura mínima de 44 px y la opción `fullWidth`. Con `isLoading`, el botón recibía **`disabled` nativo** y `aria-busy`, mostraba un spinner con `aria-hidden` y un texto oculto (`loadingText`), y el contenido quedaba oculto a la vista sin cambiar el tamaño del botón.

### Problemas identificados

| # | Problema | Cómo se detectó |
|---|---|---|
| B1 | Con `disabled` nativo durante la carga, el botón **pierde el foco**: el navegador lo saca del orden de tabulación y el foco cae en `BODY`. Al terminar la carga tampoco regresa. Quien usa teclado o lector de pantalla pierde su posición en la página. | Prueba en el navegador (3 fallas reales). Ya estaba anotado como limitación en `evidencias/notas_generacion_ia.md` §7.1 |
| B2 | Cambiar a `aria-disabled` sin más bloquea solo visualmente: el botón seguiría respondiendo a clics, a Enter y Espacio sobre él, y al **envío implícito** con Enter desde un campo. Podrían producirse envíos duplicados. | Análisis del comportamiento de formularios en HTML |

### Modificaciones realizadas

| Momento | Cambio | Archivo |
|---|---|---|
| Parte 2 | Ninguno en el componente. La prevención del doble envío se reforzó con un bloqueo síncrono (`useRef`) en el formulario de la demostración (corrección 7 de las notas). | `FormularioLoginDemo.tsx` |
| Revisión | Durante `isLoading`, el botón usa **`aria-disabled="true"`** en lugar de `disabled`. El manejador `alHacerClic` llama a `preventDefault()` y no ejecuta `onClick`. El `disabled` nativo se conserva solo cuando el padre lo pide de forma explícita (`disabled`). | `components/Button/Button.tsx` |
| Revisión | Los estilos de carga ya no dependen de `:disabled`. La clase `.cargando` conserva el color de la variante, usa `cursor: progress` y anula el efecto *hover*. | `components/Button/Button.module.css` |

### Justificación técnica

- `aria-disabled` comunica «no disponible» a las tecnologías de asistencia sin sacar el botón del orden de tabulación, así que **el foco se conserva**.
- El envío implícito con Enter desde un campo se ejecuta como un clic sintético sobre el botón de envío. Por eso `preventDefault()` en el clic cancela **los tres caminos de activación**: clic del ratón, Enter o Espacio sobre el botón, y Enter desde un campo.
- El bloqueo síncrono del formulario (`enviandoRef`) se mantiene como segunda barrera, por ejemplo ante `form.requestSubmit()`.

**Verificación en el navegador:**
- Durante la carga el foco permanece en el campo o en el botón, y al terminar el foco está en «Iniciar sesión».
- Enter en el campo, un clic, Enter y Espacio sobre el botón y `requestSubmit()` durante la carga **no generan envíos nuevos** (`envíos = 1`).

### Impacto

| Aspecto | Efecto |
|---|---|
| Accesibilidad | Se conserva la posición del foco (WCAG 2.4.3) y el estado sigue anunciándose (`aria-busy`, `aria-disabled` y el texto de `loadingText`). |
| Usabilidad | No hay envíos duplicados aunque se pulse varias veces. |
| Reutilización | La API del componente no cambió (`isLoading`, `disabled`, `onClick`), así que los usos existentes no requieren cambios. |
| Mantenibilidad | El comportamiento queda concentrado en un manejador comentado; ya no depende de la semántica de `disabled`. |

## 3. InputField

### Propuesta original del agente (Parte 2)

`InputField` es un componente controlado con:
- `<label htmlFor>` siempre visible e `id` generado con `useId` si no se recibe;
- `aria-invalid` solo cuando hay error y `aria-describedby` que combina la ayuda y el error;
- un mensaje de error debajo del campo con ícono, prefijo oculto «Error:» y borde más grueso;
- el texto «(obligatorio)» en los campos requeridos;
- un tamaño de fuente de al menos 16 px y una altura mínima de 44 px.

Se usa con los campos reales del login: `correo` (`type="email"`, `autoComplete="email"`) y `contrasena` (`type="password"`, `autoComplete="current-password"`).

### Problemas identificados

| # | Problema | Cómo se detectó |
|---|---|---|
| I1 | La primera versión usaba `forwardRef`, un patrón que en React 19 (versión instalada: 19.3.1) ya no es necesario. | Revisión durante la Parte 2 (corrección 1 de las notas) |
| I2 | El texto deshabilitado (`#6b7280` sobre `#e5e7eb`) tenía un contraste de 3.90:1. | Cálculo de contraste durante la Parte 2 (corrección 2 de las notas) |
| I3 | La validación nativa del navegador (`required`, `type="email"`) mostraba burbujas propias que no coinciden con RNF-01-AC-2. | Revisión durante la Parte 2 (corrección 9 de las notas) |
| I4 | En la demostración, los campos se marcaban `disabled` durante el envío. Si se enviaba con Enter desde el campo de contraseña, ese campo se deshabilitaba y **el foco se perdía**. | Prueba en el navegador. Mismo origen que B1 |

### Modificaciones realizadas

| Momento | Cambio | Archivo |
|---|---|---|
| Parte 2 | `forwardRef` se sustituyó por `ref` como prop normal. | `components/InputField/InputField.tsx` |
| Parte 2 | `--color-deshabilitado` cambió de `#6b7280` a `#4b5563` (6.10:1). | `index.css` |
| Parte 2 | `noValidate` en el formulario y validación propia con mensajes junto al campo. | `FormularioLoginDemo.tsx`, `utils/validacionLogin.ts` |
| Revisión | Durante el envío, los campos usan **`readOnly`** en lugar de `disabled`. El componente no cambió: `readOnly` ya llegaba al `<input>` por las props nativas. | `pages/DemoComponentes/FormularioLoginDemo.tsx` |
| Revisión | Se agregó un estilo para `:read-only` (fondo `--color-fondo`) que distingue el campo bloqueado. | `components/InputField/InputField.module.css` |

### Justificación técnica

- `readOnly` impide editar el campo sin quitarle el foco, a diferencia de `disabled`. El valor tampoco se descarta del formulario.
- Un Enter en el campo de solo lectura dispara el envío implícito, que ahora bloquea el `Button` (B2).
- La relación entre la etiqueta y el campo, `aria-invalid` y `aria-describedby` **se verificaron en el navegador**:
  - Al enviar el formulario vacío, el foco va al correo con `aria-invalid="true"`.
  - Las descripciones asociadas contienen «Error: Escribe tu correo electrónico.».
  - El correo mal formado produce el mensaje específico.

### Impacto

| Aspecto | Efecto |
|---|---|
| Accesibilidad | El foco se conserva durante el envío; el error se comunica con texto, ícono y borde, no solo con color (1.4.1, 3.3.1). |
| Usabilidad | Mensajes en español junto a cada campo (RNF-01-AC-2), sin burbujas del navegador. |
| Reutilización | `ref` como prop permite enfocar el primer campo con error desde cualquier formulario; el estilo `:read-only` sirve en cualquier uso. |
| Mantenibilidad | Sin `forwardRef`, el componente es una función simple con las props tipadas. |

## 4. Card

### Propuesta original del agente (Parte 2)

`Card` es un contenedor sin dependencia de ningún modelo de datos. Sus props son:
- `as`: `article` (por defecto), `section` o `div`;
- `headingLevel`: de 2 a 4;
- `title`, `footer` y `className`.

Cuando hay título y el elemento es `article` o `section`, se etiqueta con `aria-labelledby`. Usa `overflow-wrap: anywhere` y `min-width: 0` para evitar desbordes. En la demostración se usa como `section` para el formulario y la simulación, y como `article` para los resúmenes de solicitudes.

### Problemas identificados

| # | Hallazgo | Resultado |
|---|---|---|
| C1 | ¿Los textos largos de las solicitudes (por ejemplo, «Tlajomulco de Zúñiga» o «San Pedro Tlaquepaque») provocan desbordes a 320 o 360 px? | **No.** Sin desplazamiento horizontal a 320, 360, 768 y 1280 px (prueba en el navegador y captura a 360 px). |
| C2 | ¿La jerarquía de encabezados es coherente? | **Sí.** 1 `h1`, 4 `h2` (secciones) y 4 `h3` (tarjetas de solicitudes). |
| C3 | Un `div` sin rol no puede tener nombre accesible. | Ya estaba resuelto en la propuesta original: con `as="div"` no se agrega `aria-labelledby`. |

No se encontraron fallas que justificaran cambios.

### Modificaciones realizadas

**Ninguna** en la Parte 2 ni en esta revisión.

### Justificación técnica

El componente cumple su propósito para formularios y resúmenes sin acoplarse a `SolicitudResumen`: los datos de la solicitud se arman en la página (`DemoComponentesPage`), no dentro de `Card`. Hacer cambios sin un problema detectado añadiría riesgo sin beneficio.

### Impacto

| Aspecto | Evaluación |
|---|---|
| Reutilización | Alta: el contenido, el elemento semántico y el nivel de encabezado los decide quien la usa. |
| Accesibilidad | Las tarjetas con título se exponen como regiones o artículos con nombre (1.3.1). |
| Limitación | Si el padre elige un `headingLevel` incorrecto, la jerarquía de la página se rompe; el componente no puede detectarlo. |

## 5. Navbar

### Propuesta original del agente (Parte 2)

Navbar es un componente de presentación con `header` > `nav[aria-label="Principal"]`.
- **Props:** `isAuthenticated`, `userName`, `userRole` (tipo `Rol` con los 4 valores del backend), `onLogout`, `links`, `loginHref` y `homeHref`.
- **Móvil:** el menú se abre con un botón «Menú» que tiene `aria-expanded` y `aria-controls`, y se cierra con Escape (el foco regresa al botón) o al elegir un enlace.
- **Escritorio** (desde 768 px): barra horizontal, sin el botón de menú.
- **Independencia:** no importa servicios HTTP ni el `AuthContext`.

### Problemas identificados

| # | Problema | Cómo se detectó |
|---|---|---|
| N1 | Al cerrar sesión desaparecía el botón que tenía el foco. | Revisión durante la Parte 2 (corrección 4 de las notas) |
| N2 | En móvil, cerrar el menú al cerrar sesión ocultaba el enlace «Iniciar sesión», así que N1 no funcionaba. | Revisión durante la Parte 2 (corrección 5 de las notas) |
| N3 | Los enlaces podían sugerir rutas inexistentes. | Revisión durante la Parte 2 (corrección 10 de las notas) |
| N4 | La `key` de cada enlace era solo `href`. Si un padre pasa dos enlaces con el mismo destino, React genera claves duplicadas. | Revisión de código en esta revisión |

### Modificaciones realizadas

| Momento | Cambio | Archivo |
|---|---|---|
| Parte 2 | Después de `onLogout`, el foco pasa al enlace «Iniciar sesión». | `components/Navbar/Navbar.tsx` |
| Parte 2 | El menú queda abierto después de cerrar sesión. | `components/Navbar/Navbar.tsx` |
| Parte 2 | Los enlaces de la demostración apuntan solo a secciones de la página. El enlace según el rol sigue los permisos reales de `GET /api/solicitudes` (`cliente`, `trabajador`, `organizacion`), así que el administrador no recibe un enlace de solicitudes. | `DemoComponentesPage.tsx` |
| Revisión | La `key` de cada enlace es ahora `href` + `label`. | `components/Navbar/Navbar.tsx` |

### Justificación técnica y verificación

**Verificado en el navegador:**

| Comportamiento | Resultado |
|---|---|
| Tab desde el inicio | Pasa por «Saltar al contenido», luego la marca y luego «Menú» |
| Enter sobre «Menú» | Abre el menú (`aria-expanded="true"`); Tab entra al primer enlace |
| Escape | Cierra el menú y el foco regresa a «Menú» |
| Elegir un enlace | Cierra el menú |
| Cerrar sesión con Enter desde el menú móvil | El foco queda en el enlace «Iniciar sesión» |
| Enlaces y etiqueta por rol | Cliente → «Mis solicitudes»; Trabajador independiente y Organización de contratistas → «Solicitudes asignadas»; Administrador → sin enlace de solicitudes |
| Menú abierto a 360 px | Sin desplazamiento horizontal; nombre, rol y «Cerrar sesión» visibles (captura) |

### Impacto

| Aspecto | Efecto |
|---|---|
| Accesibilidad | Retorno del foco con Escape y al cerrar sesión (2.4.3); estado del menú expuesto (4.1.2); página actual con subrayado además del color (1.4.1). |
| Reutilización | Funciona con la sesión real (`useAuth`) o con la simulada, porque solo recibe props. La nueva `key` evita advertencias cuando dos enlaces comparten destino. |
| Mantenibilidad | Las etiquetas de rol vienen de `utils/catalogos.ts`, tipado con `Record<Rol, string>`: si el backend agrega un rol, TypeScript obliga a darle etiqueta. |

## 6. Página de demostración, roles y datos ficticios

| Comprobación | Resultado |
|---|---|
| Roles | Solo `cliente`, `trabajador`, `organizacion` y `administrador` (`ROLES` en `validation.py`). |
| Oficios y municipios | Coinciden con `OFICIOS` y `MUNICIPIOS` de `validation.py`. Las colonias se nombran «Colonia de ejemplo N» para no usar direcciones reales. |
| Estados de solicitud | `borrador`, `confirmada`, `en_proceso` y `concluido`, todos dentro de `ESTADOS` de `solicitudes.py`. |
| Forma de los datos | `SolicitudResumen` sigue a `a_resumen` de `solicitudes_service.py`: `id`, `oficio`, `resultadoEsperado`, `estado`, `zona{municipio, colonia}` y `actualizadaEn`. |
| Identificación como ficticio | Aviso al inicio de la página, nombre «Ana Ejemplo (ficticia)», etiqueta «Dato ficticio» en cada tarjeta e IDs `00000000-…` evidentes (DoD-12). |
| Autenticación | Ningún control crea tokens ni llama a la API; la sesión simulada solo cambia el estado local de la página. El único mensaje del backend que se reproduce, «Correo o contraseña incorrectos.», es el real de `auth/routes.py` y se presenta como «Simulación de respuesta 401». |
| Fechas | Formato DD/MM/AAAA en hora de `America/Mexico_City` (RNF-14). |

## 7. Resumen de archivos modificados en esta revisión

| Archivo | Cambio |
|---|---|
| `frontend/src/components/Button/Button.tsx` | `aria-disabled` y `preventDefault` durante la carga, en lugar de `disabled` |
| `frontend/src/components/Button/Button.module.css` | Estilos de carga sin depender de `:disabled` |
| `frontend/src/components/InputField/InputField.module.css` | Estilo para `:read-only` |
| `frontend/src/pages/DemoComponentes/FormularioLoginDemo.tsx` | Campos con `readOnly` en lugar de `disabled` durante el envío |
| `frontend/src/components/Navbar/Navbar.tsx` | `key` de los enlaces formada por `href` y `label` |

## 8. Pendientes y comprobaciones que requieren intervención manual

1. **Lector de pantalla** (NVDA o Narrador): falta comprobar cómo se anuncian «Iniciando sesión (simulación)…» con el foco en el botón, `aria-disabled`, el `role="status"` del resultado y el `role="alert"` del error 401. Las pruebas automatizadas verifican atributos y foco, no lo que escucha el usuario.
2. **Otros navegadores y dispositivos:** solo se probó Edge (Chromium) en modo *headless*. Faltan Firefox, Safari en iOS y un dispositivo táctil real.
3. **Zoom y alto contraste:** zoom de 200 % y 400 % en escritorio, y el modo de alto contraste de Windows (`forced-colors`).
4. **Menú móvil:** no atrapa el foco ni se cierra al hacer clic fuera; es un desplegable en línea, no un modal. Si se cambia de móvil a escritorio y de regreso con el menú abierto, el menú conserva su estado.
5. **Contraseña:** no hay opción para mostrar u ocultar la contraseña.
6. **`InicioPage.tsx`:** pantalla de la Parte 1 que ya no se muestra; falta decidir si se conserva.
7. **Pruebas automatizadas en el repositorio:** ~~pendiente~~ **atendido en la Parte 3.** Se incorporaron Vitest, React Testing Library, jest-dom, user-event, jest-axe y jsdom como dependencias de desarrollo de `frontend/` (`npm run test`: 41 pruebas). Ver [`accesibilidad.md`](accesibilidad.md), sección 6.1. Las pruebas en navegador (Edge vía `playwright-core`) siguen fuera de las dependencias del proyecto: los scripts se conservan en `evidencias/` para reproducirlos, e incorporarlas como pruebas E2E queda como trabajo futuro.
8. **Validación del equipo:** ~~pendiente~~ **atendido.** El cambio de `disabled` a `aria-disabled` en `Button`, que modifica el comportamiento del foco durante la carga, forma parte de la propuesta aprobada por el equipo.
