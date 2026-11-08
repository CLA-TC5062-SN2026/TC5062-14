# Notas de generación con IA: Parte 2 (componentes de UI)

> **Documento temporal de trabajo.** Registra lo que propuso e implementó el agente de IA (Claude Code) durante la Parte 2 de S07-S08-A1, para usarlo como evidencia al redactar `revision_componentes.md`. **No sustituye ese entregable** y no representa una revisión del equipo: las decisiones descritas son del agente y están pendientes de revisión humana.

> **Ubicación:** este archivo se movió de `S07_S08_A1/` a `S07_S08_A1/evidencias/` durante el cierre de la entrega, para que la carpeta principal contenga solo los entregables obligatorios. El contenido no cambió.
>
> **Seguimiento:** la revisión posterior está en [`revision_componentes.md`](../revision_componentes.md). Allí se atendió la limitación 7.1: `Button` ahora usa `aria-disabled` durante la carga y los campos usan `readOnly` durante el envío. Este registro conserva la descripción original de la Parte 2.

## 1. Alcance de lo generado

| Archivo | Contenido |
|---|---|
| `frontend/src/components/Button/` | `Button.tsx`, `Button.module.css`, `index.ts` |
| `frontend/src/components/InputField/` | `InputField.tsx`, `InputField.module.css`, `index.ts` |
| `frontend/src/components/Card/` | `Card.tsx`, `Card.module.css`, `index.ts` |
| `frontend/src/components/Navbar/` | `Navbar.tsx`, `Navbar.module.css`, `index.ts` |
| `frontend/src/pages/DemoComponentes/` | `DemoComponentesPage.tsx` y su `.module.css`, `FormularioLoginDemo.tsx`, `datosFicticios.ts` |
| `frontend/src/utils/` | `catalogos.ts` (etiquetas en español de roles, oficios, municipios y estados), `formato.ts` (fechas DD/MM/AAAA), `validacionLogin.ts` |
| `frontend/src/services/apiTypes.ts` | Se agregaron los tipos `SolicitudResumen`, `EstadoSolicitud`, `Oficio` y `Municipio`, tomados del backend |
| `frontend/src/index.css` | Se agregaron colores de error, aviso y deshabilitado, y la clase global `.visualmente-oculto` |
| `frontend/src/App.tsx` | Ahora muestra la demostración en lugar de `InicioPage` |

**Fuentes usadas para no inventar datos:**

- Rama `origin/feature/s05-s06-a2-auth`:
  - `backend/app/validation.py`: `ROLES`, `OFICIOS`, `MUNICIPIOS` y `EMAIL_RE`.
  - `backend/app/routes/solicitudes.py`: `ESTADOS` y los roles que pueden listar solicitudes.
  - `backend/app/services/solicitudes_service.py`: el esquema `a_resumen`.
  - `backend/app/auth/routes.py`: los campos del login y el mensaje `CREDENCIALES_INVALIDAS`.
- `S03_A1/SRS_equipo.md`: RNF-01, RNF-02, RNF-14 y los nombres de los actores.
- `definition_of_done.md`: DoD-12 y DoD-13.

## 2. Diseño inicial elegido por el agente

| Componente | Decisión principal | Motivo |
|---|---|---|
| Button | Extiende `ButtonHTMLAttributes`. El `type` por defecto es `"button"`. Con `isLoading` usa `disabled` nativo y `aria-busy`. | Que el tipo no sea `submit` por defecto evita enviar formularios por accidente. El `disabled` nativo bloquea los clics y también el envío implícito con Enter, lo que evita envíos duplicados. |
| InputField | `<label htmlFor>` visible, `id` generado con `useId` si no se recibe, `aria-describedby` que combina ayuda y error, y `aria-invalid` solo cuando hay error. | Cumple DoD-13 (etiqueta visible) y RNF-01-AC-2 (error junto al campo), y permite usar varias instancias en la misma página sin ids repetidos. |
| Card | Prop `as` (`article`, `section` o `div`), `headingLevel` (2 a 4) y `aria-labelledby` hacia el título. | La misma tarjeta sirve para un formulario (`section`) y para un resumen de solicitud (`article`), y respeta la jerarquía de encabezados de cada página. |
| Navbar | Componente de presentación: recibe los enlaces y `onLogout` del padre y no importa servicios HTTP ni el `AuthContext`. Menú desplegable en móvil y barra horizontal desde 768 px. | Cumple el requisito de no autenticar ni acceder a la API por su cuenta y permite usarla con la sesión real (`useAuth`) o con la simulada. |
| Demostración | Todo el estado es local (`useState`), con un aviso visible de «datos ficticios» y controles de sesión marcados como simulación. | Muestra los estados autenticado y no autenticado sin crear tokens ni aparentar un inicio de sesión real (DoD-12). |

## 3. Props de cada componente

### Button (`ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>`)

| Prop | Tipo | Por defecto | Nota |
|---|---|---|---|
| `children` | `ReactNode` | — | Obligatoria |
| `variant` | `'primary' \| 'secondary'` | `'primary'` | |
| `isLoading` | `boolean` | `false` | Deshabilita el botón, muestra el spinner y oculta el texto a la vista sin cambiar el tamaño del botón |
| `loadingText` | `string` | `'Cargando…'` | Lo anuncian los lectores de pantalla durante la carga |
| `disabled` | `boolean` | `false` | |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | |
| `fullWidth` | `boolean` | `false` | Agregada por el agente para los formularios en móvil |
| `onClick` y el resto de atributos nativos | — | — | `onClick` no se conecta mientras el botón está bloqueado |

### InputField (`InputFieldProps extends Omit<InputHTMLAttributes, 'type' | 'value' | 'onChange' | 'id' | 'name'>`)

| Prop | Tipo | Por defecto | Nota |
|---|---|---|---|
| `label` | `string` | — | Obligatoria y siempre visible |
| `name` | `string` | — | Debe coincidir con el campo del backend (`correo`, `contrasena`) |
| `id` | `string` | generado con `useId` | |
| `type` | `'text' \| 'email' \| 'password' \| 'tel' \| 'url' \| 'search' \| 'number'` | `'text'` | |
| `value` / `onChange` | `string` / `(e) => void` | — | Componente controlado |
| `error` | `string` | — | Muestra el mensaje y activa `aria-invalid` y `aria-describedby` |
| `helperText` | `string` | — | |
| `required` | `boolean` | `false` | Además del atributo nativo, muestra el texto «(obligatorio)» |
| `disabled` | `boolean` | `false` | |
| `ref` | `Ref<HTMLInputElement>` | — | Prop normal en React 19; sirve para enfocar el primer campo con error |
| Atributos nativos | — | — | Por ejemplo `autoComplete`, `inputMode` y `spellCheck` |

### Card (`CardProps extends Omit<HTMLAttributes<HTMLElement>, 'title'>`)

| Prop | Tipo | Por defecto |
|---|---|---|
| `title` | `ReactNode` | — |
| `children` | `ReactNode` | — |
| `className` | `string` | — |
| `as` | `'article' \| 'section' \| 'div'` | `'article'` |
| `headingLevel` | `2 \| 3 \| 4` | `3` |
| `footer` | `ReactNode` | — |

### Navbar (`NavbarProps`)

| Prop | Tipo | Por defecto |
|---|---|---|
| `isAuthenticated` | `boolean` | — |
| `userName` | `string` | — |
| `userRole` | `Rol` = `'cliente' \| 'trabajador' \| 'organizacion' \| 'administrador'` | — |
| `onLogout` | `() => void` | — |
| `links` | `NavbarLink[]` (`label`, `href`, `current?`) | `[]` |
| `loginHref` | `string` | `'#iniciar-sesion'` |
| `homeHref` | `string` | `'#inicio'` |

## 4. Estilos y responsividad

- **CSS Modules en todos los componentes.** Las clases se escriben en kebab-case y se usan en camelCase gracias a `localsConvention: 'camelCaseOnly'`, configurado en la Parte 1. La única clase global es `.visualmente-oculto`, en `index.css`.
- **Variables de diseño.** Todos los colores salen de variables en `:root`. Ningún componente define colores propios, salvo el blanco sobre el color primario.
- **Mobile-first**, con puntos de quiebre en 48rem (768 px) y 64rem (1024 px):
  - Navbar: menú desplegable en móvil; desde 768 px, barra horizontal y el botón «Menú» se oculta.
  - Demostración: una columna en móvil; las tarjetas de solicitudes pasan a 2 columnas desde 768 px; el formulario y los botones quedan lado a lado desde 1024 px.
  - Los botones del formulario ocupan todo el ancho en móvil y recuperan su ancho natural desde 768 px.
- **Tamaño de los controles.** Botones, campos, enlaces del menú y el `select` miden al menos 44 px de alto. La fuente de los campos es de al menos 16 px, para evitar el zoom automático de iOS al enfocarlos.
- **Textos largos.** Se usa `overflow-wrap: anywhere` en títulos y contenido de las tarjetas, y `min-width: 0` en los elementos de grid y flex, para evitar el desplazamiento horizontal (RNF-02).
- **Barra fija.** La barra de navegación es `sticky`; los destinos de los enlaces internos tienen `scroll-margin-top` para que no queden ocultos detrás de ella.

## 5. Consideraciones iniciales de accesibilidad

Estas son las intenciones de diseño del agente. **No constituyen una evaluación WCAG**, que corresponde a la Parte 3.

| Aspecto | Implementación | Criterio WCAG 2.1 relacionado |
|---|---|---|
| Etiquetas | `<label htmlFor>` visible en cada campo y en el `select` | 1.3.1, 3.3.2, 4.1.2 |
| Errores | Texto debajo del campo con prefijo oculto «Error:», ícono, borde más grueso, `aria-invalid` y `aria-describedby`. Al enviar, el foco pasa al primer campo con error | 3.3.1, 1.4.1 |
| Obligatorios | Texto «(obligatorio)», no solo un asterisco | 3.3.2 |
| Foco visible | Contorno de 3 px de `--color-foco` en botones, campos y enlaces | 2.4.7 |
| Teclado | Elementos nativos (`button`, `a`, `input`, `select`); el menú móvil se cierra con Escape y el foco regresa al botón | 2.1.1, 2.1.2 |
| Menú móvil | `aria-expanded`, `aria-controls` y texto visible «Menú» / «Cerrar menú» | 4.1.2 |
| Página actual | `aria-current="page"`, con subrayado además del color | 1.4.1 |
| Carga | `aria-busy`, texto oculto con `loadingText`, spinner con `aria-hidden` y animación lenta con `prefers-reduced-motion` | 4.1.2, 2.3.3 (AAA, como referencia) |
| Mensajes de estado | `role="status"` para el resultado de la simulación; `role="alert"` para el error general | 4.1.3 |
| Estructura | `header` > `nav[aria-label="Principal"]`, `main`, `footer`; un solo `h1`; los `h2` y `h3` siguen la jerarquía; enlace «Saltar al contenido principal» | 1.3.1, 2.4.1 |
| Contraste | Calculado con la fórmula de luminancia relativa: texto entre 5.75:1 y 14.76:1; borde de los controles 4.83:1 | 1.4.3, 1.4.11 |
| Idioma | `lang="es-MX"` (Parte 1) y fechas DD/MM/AAAA en hora de `America/Mexico_City` | 3.1.1; RNF-14 |
| Alto contraste | Reglas `forced-colors` para bordes de botones, tarjetas y errores | — |

## 6. Problemas identificados durante la implementación y correcciones

| # | Problema | Corrección | Motivo |
|---|---|---|---|
| 1 | El primer `InputField` usaba `forwardRef`. | Se cambió a `ref` como prop normal. | En React 19 (versión instalada: 19.3.1), `ref` es una prop más y `forwardRef` dejará de ser necesario. |
| 2 | El color de texto deshabilitado (`#6b7280` sobre `#e5e7eb`) tenía un contraste de **3.90:1**. | Se cambió a `#4b5563`, que da **6.10:1**. | WCAG exime a los controles deshabilitados del criterio 1.4.3, pero el texto debe seguir siendo legible (DoD-13). |
| 3 | Los comentarios de `index.css` indicaban contrastes estimados (por ejemplo 6.4:1 o 6.0:1) que no coincidían con el cálculo real. | Se recalcularon todos los pares y se corrigieron los valores. | Evitar documentar datos no verificados. |
| 4 | Al cerrar sesión en la Navbar desaparece el botón que tenía el foco, y el foco se iría al inicio del documento. | Se mueve el foco al enlace «Iniciar sesión». | Mantener la orientación de quien usa teclado o lector de pantalla (2.4.3). |
| 5 | En móvil, cerrar el menú al cerrar sesión ocultaba (`display: none`) el enlace «Iniciar sesión», así que no podía recibir el foco. | El menú permanece abierto después de cerrar sesión. | Sin este ajuste, la corrección 4 no funcionaba en móvil. |
| 6 | Los botones «Simular sesión iniciada» y «Simular sesión cerrada» se deshabilitaban según el estado, así que el botón pulsado perdía el foco. | Ahora siempre están habilitados. | Mismo problema de pérdida de foco. |
| 7 | Dos envíos muy rápidos del formulario podían pasar antes de que React actualizara `isLoading`. | Se agregó un bloqueo síncrono con `useRef` en `FormularioLoginDemo`, además del `disabled` del botón. | Evitar envíos duplicados. |
| 8 | Los temporizadores de la simulación podían seguir activos al desmontar el componente. | Se limpian con `clearTimeout` en el `useEffect` de limpieza. | Evitar actualizaciones de estado tras el desmontaje. |
| 9 | La validación nativa del navegador (`required`, `type="email"`) muestra burbujas propias, distintas en cada navegador y que no siempre leen los lectores de pantalla. | Se usa `noValidate` en el formulario y validación propia con mensajes junto al campo. | Cumplir RNF-01-AC-2 de forma consistente. |
| 10 | La lista de enlaces de la Navbar podía sugerir rutas que no existen. | Los enlaces apuntan solo a secciones de la demostración. El enlace según el rol sigue los permisos reales de `GET /api/solicitudes`, así que el administrador no recibe «Mis solicitudes». | No inventar funcionalidades. |

## 7. Limitaciones conocidas y puntos para la revisión humana

1. **Pérdida de foco durante la carga.** El `Button` con `isLoading` usa `disabled` nativo, así que el botón pierde el foco mientras dura la carga. La alternativa (`aria-disabled` y bloquear `onClick`) conserva el foco, pero permite el envío implícito con Enter. Se eligió priorizar la prevención de envíos duplicados. Conviene que el equipo valide esta decisión.
2. **Menú sin trampa de foco.** El menú móvil no atrapa el foco ni se cierra al hacer clic fuera. Es un menú desplegable en línea, no un diálogo modal, y se consideró aceptable, pero conviene probarlo con un lector de pantalla.
3. **Sin botón para mostrar la contraseña.** El campo de contraseña no tiene la opción «Mostrar u ocultar contraseña».
4. **Validación del correo.** La validación del cliente usa la misma expresión regular que el backend (`EMAIL_RE`). Solo verifica la forma, no que el correo exista.
5. **`InicioPage` sin uso.** La pantalla de la Parte 1 (`InicioPage.tsx`) ya no se muestra; se conserva como evidencia de esa parte. Hay que decidir si se elimina.
6. **Comprobaciones pendientes.** No se ha comprobado la pantalla en un navegador real a 360 px ni en escritorio. Tampoco se han probado con un lector de pantalla los anuncios de `role="status"` y `role="alert"`.
7. **Sin pruebas automatizadas de interacción.** No existen pruebas de abrir y cerrar el menú, de la tecla Escape ni del envío duplicado. Se recomienda agregar Vitest, Testing Library y `jest-axe` en la Parte 3.
