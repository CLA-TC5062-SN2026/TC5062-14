# Evaluación de accesibilidad básica (WCAG 2.1): componentes de UnCalificado

> **Actividad:** S07-S08-A1, Parte 3.
> **Documentos relacionados:** [`decision_stack_frontend.md`](decision_stack_frontend.md) (Parte 0), [`evidencias/notas_generacion_ia.md`](evidencias/notas_generacion_ia.md) (Parte 2) y [`revision_componentes.md`](revision_componentes.md) (revisión crítica).
> **Estado:** evaluación técnica preparada con apoyo de un agente de IA (Claude Code), **pendiente de revisión por el equipo**. No es una auditoría de conformidad WCAG completa: ver la sección 7.

## 1. Objetivo y alcance

**Objetivo.** Evaluar si los componentes `Button`, `InputField`, `Card` y `Navbar` cumplen los criterios de WCAG 2.1 (niveles A y AA) más relevantes para su función, corregir los problemas reales encontrados y dejar evidencia verificable. La evaluación también sirve para comprobar DoD-13 («Accesibilidad básica»), RNF-01 (mensajes de validación junto al campo) y RNF-02 (uso a 360 × 640 px sin desplazamiento horizontal).

**Alcance:**

- **Incluido:**
  - los cuatro componentes de `frontend/src/components/`;
  - la pantalla `DemoComponentesPage` y su formulario `FormularioLoginDemo`, que los integran con datos ficticios;
  - los estilos globales de `frontend/src/index.css`.
- **Excluido:**
  - `InicioPage.tsx` (pantalla de la Parte 1 que ya no se muestra);
  - la integración con el backend, porque la demostración no realiza peticiones;
  - la app nativa (RNF-02);
  - los criterios de WCAG 2.2.

## 2. Metodología

Se combinaron cinco técnicas, porque ninguna es suficiente por sí sola.

| # | Técnica | Herramienta | Qué detecta | Qué no detecta |
|---|---|---|---|---|
| 1 | Revisión de código | Lectura de los `.tsx` y `.module.css` | Semántica, relaciones ARIA, manejo del foco | Lo que depende del renderizado |
| 2 | Cálculo de contraste | Script propio con la fórmula de luminancia relativa de WCAG, que lee los colores de `index.css` | Relaciones de contraste reales de 26 pares de colores en uso | Combinaciones que no se listaron |
| 3 | Pruebas de componentes | Vitest 5.1, React Testing Library 16.3, jest-dom 7.0, user-event 14.6, jest-axe 11.0 (axe-core 4.12.1), jsdom 30.1 | Nombres y descripciones accesibles, roles, estados ARIA, teclado, foco; reglas axe WCAG A/AA | jsdom no calcula diseño ni aplica CSS: no evalúa contraste, visibilidad ni *reflow* |
| 4 | Pruebas en navegador real | Microsoft Edge (*headless*) controlado con `playwright-core` 1.64.1; axe-core 4.12.1 inyectado en la página | *Reflow*, zoom emulado, orden y visibilidad del foco, recortes, árbol de accesibilidad real (vía CDP), axe con estilos reales | Experiencia con lector de pantalla, otros navegadores |
| 5 | Revisión visual | Capturas a 360 px, 1280 px y zoom de 400 % | Problemas visibles (recortes, solapamientos) | — |

**Zoom.** WCAG 1.4.10 define el *reflow* como el uso del contenido en un ancho de 320 px CSS, equivalente a una ventana de 1280 px con zoom de 400 %. El zoom se **emuló** con ventanas equivalentes:
- 200 %: 640 × 512 px CSS con `deviceScaleFactor` 2;
- 400 %: 320 × 256 px CSS con `deviceScaleFactor` 4.

No se usó el zoom del navegador (Ctrl + «+»); esa comprobación queda pendiente (sección 7).

**Secuencia de trabajo:**
1. Ejecutar la auditoría en el navegador **antes** de corregir nada (`evidencias/navegador_antes.txt`).
2. Corregir los hallazgos reales.
3. Volver a ejecutar la auditoría (`evidencias/navegador_despues.txt`) y las pruebas de Vitest.

## 3. Resultados por componente

### 3.1 Button

| Aspecto | Resultado |
|---|---|
| Semántica (4.1.2) | `<button>` nativo con `type="button"` por defecto; el nombre accesible es el texto visible. |
| Teclado (2.1.1) | Enter y Espacio activan el botón (prueba de Vitest). |
| Foco visible (2.4.7) | Contorno de 3 px de `#0b5cad` con 2 px de separación: 6.67:1 sobre blanco y 6.16:1 sobre el fondo gris. |
| Contraste (1.4.3) | Texto del primario: blanco sobre `#0b5cad`, 6.67:1. Texto del secundario: `#0b5cad` sobre blanco, 6.67:1. |
| Contraste no textual (1.4.11) | Borde del secundario, 6.67:1; fondo del primario frente al fondo de la página, 6.16:1; spinner, 6.67:1. |
| Carga | `aria-busy="true"`, `aria-disabled="true"` y nombre accesible igual a `loadingText`. El botón **conserva el foco** y bloquea clic, Enter, Espacio y el envío implícito (verificado en Vitest y en Edge). |
| axe | Sin violaciones (variantes, deshabilitado y carga). |

### 3.2 InputField

| Aspecto | Resultado |
|---|---|
| Etiqueta (1.3.1, 3.3.2, 4.1.2) | `<label htmlFor>` visible, asociado al `id`. Edge calcula el nombre «Correo electrónico (obligatorio)» (árbol de accesibilidad vía CDP). |
| Obligatorio (3.3.2) | Texto visible «(obligatorio)» y atributo `required`. |
| Error (3.3.1) | Mensaje de texto debajo del campo, `aria-invalid="true"` y `aria-describedby` hacia el mensaje. Edge calcula la descripción «Error: Escribe tu correo electrónico.». El error no depende solo del color: lleva texto, ícono y borde de 2 px. |
| Sugerencia (3.3.3) | El correo mal formado muestra un ejemplo: «Escribe un correo válido, por ejemplo: nombre@dominio.com.». |
| Contraste | Texto de error: 6.57:1. Borde normal: 4.83:1 sobre blanco. Borde con error: 6.57:1. Borde frente al interior en solo lectura: 4.47:1. |
| Foco | Al enviar con errores, el foco va al primer campo inválido. En solo lectura (durante el envío), el campo conserva el foco. |
| axe | Sin violaciones, con y sin error. |

### 3.3 Card

| Aspecto | Resultado |
|---|---|
| Semántica (1.3.1) | `article` o `section` con encabezado de nivel configurable y `aria-labelledby`. Con `as="div"` no se asigna nombre (un `div` sin rol no lo admite). |
| Jerarquía | En la demostración: 1 `h1`, 4 `h2` y 4 `h3`, sin saltos. |
| Contraste | El borde de la tarjeta (`#d5dbe3`, 1.39:1) es **decorativo**: no identifica un control ni es necesario para entender el contenido, así que 1.4.11 no aplica. El texto interior cumple (14.76:1 y 7.56:1). |
| *Reflow* | Sin desbordes con textos largos a 320 px (por ejemplo, «Tlajomulco de Zúñiga»). |
| axe | Sin violaciones en sus variantes. |

### 3.4 Navbar

| Aspecto | Resultado |
|---|---|
| Semántica (1.3.1, 4.1.2) | `header` > `nav[aria-label="Principal"]`. El enlace actual tiene `aria-current="page"` y subrayado. El botón del menú tiene `aria-expanded` y `aria-controls`. |
| Teclado (2.1.1, 2.1.2) | Enter y Espacio abren y cierran el menú; Escape lo cierra y devuelve el foco al botón; elegir un enlace lo cierra. No hay trampas de foco. |
| Orden del foco (2.4.3) | Enlace de salto → marca → enlaces → sesión → contenido, igual al orden visual. Al cerrar sesión, el foco pasa a «Iniciar sesión». |
| Estados | Sin sesión: navegación pública y «Iniciar sesión». Con sesión: nombre, rol (los 4 roles del backend) y «Cerrar sesión». Navbar no llama a la API (prueba con `fetch` espiado). |
| *Reflow* (1.4.10) | **Hallazgo A3-1:** con zoom de 400 %, el menú abierto dejaba «Cerrar sesión» fuera de la ventana. Corregido (sección 5). |
| Foco visible (2.4.7) | **Hallazgo A3-4:** la primera corrección de A3-1 recortaba los lados del contorno de foco dentro del menú. Corregido. |
| Nombre del botón | **Hallazgo A3-3:** el texto cambiaba de «Menú» a «Cerrar menú» además de `aria-expanded`. Corregido. |
| axe | Sin violaciones: sin sesión, con sesión y con el menú abierto. |

## 4. Criterios WCAG evaluados

**Leyenda:** **Cumple** = sin incumplimientos detectados en el alcance probado. **Cumple tras corrección** = se encontró un problema y se corrigió en esta auditoría. **Corregido antes** = el problema se corrigió en la Parte 2 o en la revisión crítica.

| Criterio | Nivel | Componentes | Método | Resultado |
|---|---|---|---|---|
| **1.3.1** Información y relaciones | A | Todos | Código, Vitest, axe (jsdom y Edge) | **Cumple.** Etiquetas asociadas, landmarks, encabezados, listas, `dl` para datos de solicitudes. |
| **1.4.3** Contraste mínimo | AA | Todos | Cálculo (`evidencias/contraste.txt`) y axe `color-contrast` en Edge | **Cumple.** El texto va de 5.75:1 a 14.76:1 (mínimo exigido 4.5:1). No hay texto que dependa del umbral de 3:1 para texto grande. |
| **1.4.11** Contraste no textual | AA | Button, InputField, Navbar | Cálculo | **Cumple.** Bordes de controles, entre 4.47:1 y 6.67:1. Indicador de foco, entre 6.16:1 y 6.67:1 (medido sobre el fondo real en Edge). Spinner, 6.67:1. |
| **2.1.1** Teclado | A | Todos | Vitest (user-event) y Edge | **Cumple.** Todas las acciones con Tab, Enter, Espacio y Escape. |
| **2.4.3** Orden del foco | A | Button, InputField, Navbar | Edge (recorrido completo con Tab) y Vitest | **Cumple.** Corregido antes: el foco se perdía al cerrar sesión (Parte 2) y durante la carga (revisión crítica). |
| **2.4.7** Foco visible | AA | Todos | Edge: estilo, ancho, contraste y recorte del contorno en cada elemento enfocable | **Cumple tras corrección** (A3-1, A3-4). |
| **3.3.1** Identificación de errores | A | InputField | Vitest y Edge | **Cumple.** Texto junto al campo, `aria-invalid` y `aria-describedby`. |
| **3.3.2** Etiquetas o instrucciones | A | InputField | Vitest y código | **Cumple.** Etiqueta visible, «(obligatorio)» y texto de ayuda. |
| **4.1.2** Nombre, función y valor | A | Todos | Vitest, axe y árbol de accesibilidad vía CDP | **Cumple.** Mejora aplicada en A3-3 (nombre estable del botón del menú). |
| **1.4.10** *Reflow* | AA | Todos | Edge a 320 y 360 px, y zoom emulado de 200 % y 400 % | **Cumple tras corrección** (A3-1). Sin desplazamiento horizontal en ningún escenario. |
| 4.1.3 Mensajes de estado (adicional) | AA | Formulario de la demo | Árbol de accesibilidad vía CDP | **Cumple tras corrección** (A3-2). |
| 1.4.1 Uso del color (adicional) | A | InputField, Navbar, Card | Código y capturas | **Cumple.** Errores, página actual y estados con texto o subrayado, además del color. |
| 2.4.1 Evitar bloques (adicional) | A | Página | Edge | **Cumple.** El enlace «Saltar al contenido principal» es visible al recibir el foco y lleva al `main`. |
| 1.4.12 Espaciado del texto (adicional) | AA | Página | Edge con los espaciados de WCAG inyectados | Sin desplazamiento horizontal a 360 px. No se revisaron recortes de texto en detalle. |
| 3.1.1 Idioma de la página (adicional) | A | Página | Código | **Cumple.** `lang="es-MX"`. |

## 5. Problemas detectados y correcciones

### 5.1 Hallazgos corregidos durante esta auditoría (Parte 3)

#### A3-1. El menú abierto queda fuera de la ventana con zoom de 400 %

- **Componente:** Navbar (`Navbar.module.css`).
- **Criterios:** 1.4.10 *Reflow* (AA) y 2.4.7 Foco visible (AA). El criterio 2.4.11 de WCAG 2.2 describe el mismo efecto, pero está fuera del alcance.
- **Problema original:** la barra es `position: sticky`. En 320 × 256 px CSS (1280 px al 400 %), el menú abierto mide más que la ventana. Su parte inferior (rol y «Cerrar sesión») queda fuera de la pantalla y, como la barra es fija, ese contenido no puede verse desplazando la página. Al llegar con Tab, «Cerrar sesión» recibía el foco fuera de la vista: `top=286`, `bottom=330`, con una ventana de `256` px de alto (`evidencias/navegador_antes.txt`; captura `evidencias/zoom400_menu_antes.png`).

**Antes:**

```css
.menu-abierto {
  display: flex;
}
```

**Después** (versión final, que incluye el ajuste de A3-4):

```css
.menu-abierto {
  display: flex;
  max-height: calc(100vh - 4rem);
  max-height: calc(100dvh - 4rem);
  overflow-y: auto;
  overscroll-behavior: contain;
  flex-basis: calc(100% + 0.75rem);
  margin-inline: -0.375rem;
  padding-inline: 0.375rem;
}
```

En escritorio (≥ 48rem) se restablecen `max-height: none`, `overflow: visible`, `padding-inline: 0` y `margin-inline: 0`.

- **Justificación:** limitar el alto del menú a la ventana, menos la fila de la marca, y permitir el desplazamiento interno hace que todo su contenido sea alcanzable. Al tabular, el navegador desplaza ese contenedor hasta el elemento enfocado. Se descartó quitar `sticky` al abrir el menú: si la página estaba desplazada, la barra saltaría al inicio del documento y el menú abierto desaparecería de la vista.
- **Resultado posterior:** con zoom de 400 %, «Cerrar sesión» queda visible al recibir el foco (`top=198`, `bottom=242`, ventana de `256`; `evidencias/navegador_despues.txt`, captura `zoom400_menu_despues.png`). Sin desplazamiento horizontal en ningún escenario. Sin cambios a 360 px ni en escritorio.

#### A3-2. La región de estado del formulario no existía en el árbol de accesibilidad antes de actualizarse

- **Componente:** formulario de demostración que integra InputField y Button (`FormularioLoginDemo.tsx`, `DemoComponentesPage.module.css`).
- **Criterio:** 4.1.3 Mensajes de estado (AA).
- **Problema original:** el párrafo `role="status"` que anuncia el resultado del envío se ocultaba con `display: none` mientras estaba vacío. Un elemento con `display: none` no forma parte del árbol de accesibilidad: la región viva aparecía al mismo tiempo que su contenido, y algunos lectores de pantalla no anuncian regiones que no existían antes del cambio. En Edge, el árbol de accesibilidad (`Accessibility.getFullAXTree` vía CDP) mostraba **1** región `status` (la de la simulación de sesión) en lugar de **2**.

**Antes:**

```css
.estado-formulario:empty {
  display: none;
}

.estado-formulario,
.estado-simulacion {
  padding: var(--espacio-3) var(--espacio-4);
  /* … */
}
```

```tsx
<p className={styles.estadoFormulario} role="status">
  {resultado}
</p>
```

**Después:**

```css
.estado-formulario.con-contenido,
.estado-simulacion {
  padding: var(--espacio-3) var(--espacio-4);
  /* … */
}
```

```tsx
<p
  className={[styles.estadoFormulario, resultado ? styles.conContenido : ''].filter(Boolean).join(' ')}
  role="status"
>
  {resultado}
</p>
```

- **Justificación:** la región se mantiene siempre en el DOM y en el árbol de accesibilidad; solo su recuadro visual depende de que tenga contenido.
- **Resultado posterior:** el árbol de accesibilidad expone **2** regiones `status` antes de cualquier cambio. La prueba de Vitest «durante la carga… anuncia el resultado en role=status» verifica que la región existe vacía y luego recibe el texto. **Pendiente:** confirmar el anuncio con un lector de pantalla real.

#### A3-3. El botón del menú cambiaba su nombre además de `aria-expanded`

- **Componente:** Navbar (`Navbar.tsx`, `Navbar.module.css`).
- **Criterio:** relacionado con 4.1.2 Nombre, función y valor. **No es un incumplimiento**: es una mejora de buenas prácticas.
- **Problema original:** el texto del botón alternaba entre «Menú» y «Cerrar menú», y además cambiaba `aria-expanded`. Un lector de pantalla anunciaba el estado dos veces y de forma contradictoria («Cerrar menú, expandido»), y el nombre del control cambiaba entre interacciones.

**Antes:**

```tsx
<span className={styles.iconoMenu} aria-hidden="true">
  <span /><span /><span />
</span>
{menuAbierto ? 'Cerrar menú' : 'Menú'}
```

**Después:**

```tsx
<span
  className={[styles.iconoMenu, menuAbierto ? styles.iconoMenuAbierto : ''].filter(Boolean).join(' ')}
  aria-hidden="true"
>
  <span /><span /><span />
</span>
Menú
```

Además, en CSS, `.icono-menu-abierto` transforma las tres líneas en una X.

- **Justificación:** el estado lo comunica `aria-expanded`; el nombre se mantiene estable. La indicación visual de «abierto» la da el ícono X, que es decorativo (`aria-hidden`).
- **Resultado posterior:** en Edge, el nombre es «Menú» en ambos estados a 320 y 360 px. La prueba de Vitest «se abre y se cierra con Enter y Espacio; el nombre no cambia (4.1.2)» lo verifica. La captura `foco_menu_completo_final.png` muestra la X.

#### A3-4. Regresión introducida por la primera versión de A3-1: contorno de foco recortado

- **Componente:** Navbar (`Navbar.module.css`).
- **Criterio:** 2.4.7 Foco visible (AA).
- **Problema:** la primera versión de A3-1 agregó `overflow-y: auto`. Por especificación de CSS, eso convierte también `overflow-x` en `auto`, así que el contenedor recortaba los lados del contorno de foco (3 px + 2 px de separación) de los elementos a todo lo ancho. Una comprobación en Edge reportó «RECORTADO» en «Inicio», «Botones», «Mis solicitudes» y «Cerrar sesión», a 360 px y con zoom de 400 % (captura `evidencias/foco_menu_recortado_intermedio.png`). **Este problema lo causó la propia corrección; no existía en el código previo a la auditoría.**

**Antes** (versión intermedia):

```css
.menu-abierto {
  display: flex;
  max-height: calc(100vh - 4rem);
  max-height: calc(100dvh - 4rem);
  overflow-y: auto;
  overscroll-behavior: contain;
}
```

**Después:** se añadieron `flex-basis: calc(100% + 0.75rem)`, `margin-inline: -0.375rem` y `padding-inline: 0.375rem` (ver el bloque final en A3-1).

- **Justificación:** el margen interno de 6 px cubre lo que sobresale el contorno (5 px), y el margen negativo conserva la alineación del contenido.
- **Resultado posterior:** el contorno queda completo en los cuatro elementos, a 360 px y con zoom de 400 % (comprobación «Contorno de foco completo» en `navegador_despues.txt`; captura `foco_menu_completo_final.png`). Esta comprobación se incorporó de forma permanente al script de auditoría.

### 5.2 Hallazgos corregidos antes de esta auditoría

Se documentaron en [`evidencias/notas_generacion_ia.md`](evidencias/notas_generacion_ia.md) y [`revision_componentes.md`](revision_componentes.md); aquí solo se relacionan con WCAG.

| ID | Componente | Problema | Criterio | Corrección | Cuándo |
|---|---|---|---|---|---|
| R-1 | Button | Con `disabled` nativo durante la carga, el foco caía en `BODY` (3 fallas en la prueba en navegador). | 2.4.3 | `aria-disabled` y `preventDefault` durante la carga | Revisión crítica |
| R-2 | InputField (uso en el formulario) | Los campos se deshabilitaban al enviar con Enter y el foco se perdía. | 2.4.3 | `readOnly` en lugar de `disabled` | Revisión crítica |
| P2-1 | Navbar | Al cerrar sesión desaparecía el botón enfocado. | 2.4.3 | El foco pasa a «Iniciar sesión»; el menú móvil queda abierto | Parte 2 |
| P2-2 | Formulario | Burbujas de validación nativas del navegador. | 3.3.1 | `noValidate` y mensajes propios junto al campo | Parte 2 |
| P2-3 | Tokens de color | Texto deshabilitado con 3.90:1 (los controles deshabilitados están exentos en 1.4.3). | 1.4.3 (referencia) | `#6b7280` → `#4b5563` (6.10:1) | Parte 2 |

### 5.3 Observaciones que no requirieron cambios en el código

- **Descripción accesible en jsdom.** En jsdom, la descripción del error se calcula como «Error:Escribe…» (sin espacio); Edge la calcula como «Error: Escribe…» (verificado vía CDP). Es una diferencia de la biblioteca de jsdom, no del componente; la prueba tolera ese espacio y lo documenta.
- **Primera ejecución del script.** Cargó axe-core 3.5.6, que llega con `@types/jest-axe`, en lugar de la 4.12.1 que usa jest-axe. Se corrigió la ruta y todos los resultados reportados usan la 4.12.1.

## 6. Evidencia

Los archivos están en `S07_S08_A1/evidencias/`.

| Archivo | Contenido |
|---|---|
| `resultado_vitest.txt` | Salida detallada de `vitest run` (41 pruebas) |
| `navegador_antes.txt` | Auditoría en Edge antes de las correcciones: 41 comprobaciones, 2 fallas (A3-1 y A3-2) |
| `navegador_despues.txt` | Auditoría en Edge después: 43 comprobaciones (incluye las 2 nuevas de recorte del foco), 0 fallas |
| `contraste.txt` | Tabla de 26 pares de colores con relación, mínimo y uso |
| `zoom400_menu_antes.png` / `zoom400_menu_despues.png` | Menú abierto con zoom de 400 % antes y después de A3-1 |
| `foco_menu_recortado_intermedio.png` / `foco_menu_completo_final.png` | Contorno de foco en «Cerrar sesión» antes y después de A3-4 |
| `foco_campo_1280.png` | Indicador de foco del campo de correo en escritorio |
| `auditar.mjs`, `contraste.mjs` | Scripts usados. `auditar.mjs` requiere `playwright-core` y el servidor de desarrollo: `node auditar.mjs <etiqueta> <ruta-a-frontend>`. |

**Otros archivos de la carpeta** (de etapas anteriores; no forman parte de esta auditoría):

| Archivo | Contenido |
|---|---|
| `notas_generacion_ia.md` | Registro del agente durante la Parte 2 (se movió aquí desde `S07_S08_A1/`) |
| `revisar.mjs` | Script de las 34 comprobaciones de la revisión crítica (versión corregida) |
| `revision_navegador_sesion.txt` | Salidas originales de la revisión crítica, transcritas desde la sesión |
| `revision_navegador_reejecucion.txt` | Reejecución de `revisar.mjs` sobre el código actual |

### 6.1 Pruebas automatizadas (Vitest)

**Resultado:** `npm run test` da 5 archivos y **41 pruebas aprobadas, 0 fallidas**.

| Archivo | Pruebas | Qué verifican |
|---|---|---|
| `Button.test.tsx` | 8 | Nombre y `type`; teclado; `disabled` nativo; carga con `aria-busy` y `aria-disabled` sin `disabled`; conservación del foco; bloqueo de clic, Enter, Espacio y envío implícito; spinner decorativo; axe |
| `InputField.test.tsx` | 9 | Etiqueta asociada; ids únicos; obligatorio; descripción con ayuda; error con `aria-invalid` y `aria-describedby`; `aria-describedby` externa; teclado y `readOnly` con foco; componente controlado; axe |
| `Card.test.tsx` | 6 | `article` y `section` con nombre; `div` sin nombre; sin título; pie y atributos; axe |
| `Navbar.test.tsx` | 13 | Landmarks y `aria-current`; estado sin sesión; los 4 roles con sesión; `onLogout` sin llamadas a `fetch`; foco tras cerrar sesión; menú (nombre estable, `aria-controls`, Enter, Espacio, Escape, cierre al elegir un enlace); axe en tres estados |
| `FormularioLoginDemo.test.tsx` | 5 | Errores y foco al enviar vacío; retiro de errores al corregir; carga con foco conservado, un solo envío y región de estado; alerta 401; axe |

**Durante el desarrollo de las pruebas** hubo 6 fallas, todas atribuibles a las propias pruebas:
- 4 por la forma de buscar el rol con `getByText`;
- 1 por un usuario simulado configurado con temporizadores falsos;
- 1 por la diferencia de jsdom descrita en 5.3.

No se modificó código de producción para que las pruebas pasaran.

### 6.2 Pruebas en navegador (Edge)

| Grupo | Comprobaciones (después) | Resultado |
|---|---|---|
| axe-core 4.12.1, reglas WCAG 2.0 y 2.1 A/AA (incluye contraste con estilos reales) | 6 estados: inicial, errores, alerta 401, menú móvil con sesión, escritorio con sesión, formulario en carga | 0 violaciones; 27–28 reglas aprobadas por estado; 0 resultados para revisión manual |
| *Reflow*: 320 px, 360 px, 200 %, 400 % y 1280 px | 18 | Sin desplazamiento horizontal; «Cerrar sesión» visible al recibir el foco en todos los tamaños móviles |
| Foco: orden y visibilidad (1280 y 360 px), y recorte dentro del menú (360 px y 400 %) | 6 | Contorno ≥ 2 px y ≥ 3:1 en todos los elementos enfocables (mínimo 6.67:1); sin recortes |
| Menú a 320 y 360 px | 6 | Enter abre, Espacio cierra y Escape cierra y devuelve el foco; el nombre se mantiene en «Menú» |
| Formulario | 5 | Error asociado y foco en el correo; carga con `aria-disabled` y sin `disabled`; un solo envío ante reintentos; resultado en `role="status"`; 2 regiones de estado expuestas |
| Espaciado de texto (1.4.12) y consola | 2 | Sin desplazamiento horizontal; sin errores en la consola |

**Orden de tabulación medido en escritorio con sesión simulada:**

> Saltar al contenido principal → UnCalificado → Inicio → Botones → Mis solicitudes → Cerrar sesión → Rol simulado → Simular sesión iniciada → Simular sesión cerrada → correo → contraseña → Iniciar sesión → Simular credenciales incorrectas → Primario → Secundario → Guardar (en carga) → Probar estado de carga

El botón «Deshabilitado» no aparece, como corresponde a un `disabled` nativo.

### 6.3 Pruebas manuales

**Solo se realizó la revisión visual de capturas de pantalla.** No se hicieron pruebas manuales con teclado físico, lector de pantalla ni dispositivos reales (ver sección 7).

## 7. Limitaciones y pruebas pendientes

1. **No es una auditoría de conformidad.** axe detecta solo una parte de los problemas automatizables, y una prueba axe aprobada no garantiza el cumplimiento de WCAG. No se evaluaron todos los criterios de WCAG 2.1, sino los de la tabla de la sección 4.
2. **Lector de pantalla (pendiente).** NVDA con Edge/Chrome y Narrador. Hay que confirmar los anuncios de errores, de «Iniciando sesión (simulación)…» con el foco en el botón, de `aria-disabled`, de `role="status"` (A3-2) y de `role="alert"`.
3. **Zoom real del navegador (pendiente).** El zoom de 200 % y 400 % se emuló con ventanas equivalentes. Falta comprobarlo con Ctrl + «+» y con el ajuste de tamaño de texto del sistema (1.4.4).
4. **Otros navegadores y dispositivos (pendiente).** Firefox, Safari en iOS y Chrome en Android, con dispositivos táctiles reales.
5. **Alto contraste (pendiente).** Hay reglas `forced-colors`, pero no se probaron con el modo de alto contraste de Windows.
6. **Limitaciones de jsdom.** En las pruebas de Vitest no se aplica CSS ni se calcula el diseño: el contraste, la visibilidad, el *reflow* y A3-1, A3-2 y A3-4 solo se verifican en el navegador.
7. **Script de navegador fuera del proyecto.** `playwright-core` no es dependencia de `frontend/`; el script se conserva en `evidencias/` para reproducirlo. Incorporar pruebas E2E al proyecto queda como trabajo futuro.
8. **Limitaciones conocidas de los componentes:**
   - el menú móvil no se cierra al hacer clic fuera;
   - no existe la opción de mostrar u ocultar la contraseña;
   - el párrafo de estado vacío (A3-2) añade el espacio de separación de la rejilla al final del formulario;
   - en la demostración, `aria-current` siempre marca «Inicio», porque no hay enrutamiento.
9. **Dependencias de desarrollo.** `npm audit` reporta 12 vulnerabilidades moderadas en la cadena de ESLint (`minimatch`). No afectan al código que se entrega al navegador (`npm audit --omit=dev`: 0) y las dependencias de prueba no agregan ninguna.

## 8. Conclusiones

1. **Los cuatro componentes cumplen**, en el alcance probado, los diez criterios de WCAG 2.1 solicitados, más cinco adicionales (4.1.3, 1.4.1, 2.4.1, 1.4.12 y 3.1.1). Hay 41 pruebas de componentes aprobadas y 43 comprobaciones en navegador sin fallas, y la evidencia es reproducible.
2. **Las herramientas automáticas no bastaron.** axe no reportó violaciones ni antes ni después de las correcciones, pero las pruebas de comportamiento en el navegador encontraron dos problemas reales (A3-1 y A3-2), y la verificación posterior detectó una regresión causada por la propia corrección (A3-4).
3. **Relación con DoD-13:**
   - todos los campos tienen etiqueta visible: cumple;
   - los errores se comunican con texto, no solo con color: cumple;
   - los formularios se completan con teclado: cumple;
   - el texto es legible sin zoom a 360 px: sin desplazamiento horizontal y con fuente mínima de 16 px en los campos.
4. **Relación con RNF-01-AC-2 y RNF-02:** cumplen en las pruebas automatizadas.
5. **Antes de considerar la evaluación concluida**, el equipo debe hacer las pruebas manuales de la sección 7, en especial con un lector de pantalla, y validar las decisiones de diseño: `aria-disabled` en Button y el menú desplazable en Navbar.

## 9. Addendum: re-verificación tras el rediseño orientado al producto

> Las secciones 1 a 8 describen la evaluación de la pantalla anterior, que funcionaba como un catálogo de componentes, y **se conservan sin cambios** como registro histórico. Este addendum documenta la re-verificación posterior al rediseño. Las evidencias anteriores no se sobrescribieron: las nuevas usan el prefijo `rediseno` o el sufijo `_rediseno`.

### 9.1 Qué cambió

`DemoComponentesPage` conserva su nombre técnico, pero ahora presenta el producto:
- Navbar;
- aviso discreto de vista previa;
- encabezado principal (hero) con el propósito de UnCalificado (SRS §1.2) y el formulario de inicio de sesión;
- «Cómo funcionará UnCalificado» (épicas EP-02 a EP-05, en futuro);
- oficios y zona del piloto (RD-18);
- solicitudes de ejemplo;
- al final, la sección técnica «Demostración de componentes».

Las APIs de Button, InputField, Card y Navbar no cambiaron. El único cambio en un componente es de CSS (9.2, R-1).

### 9.2 Hallazgos del rediseño

| ID | Componente | Problema | Criterio | Corrección | Verificación |
|---|---|---|---|---|---|
| R-1 | Navbar (`Navbar.module.css`) | Con los enlaces de producto y la sesión simulada, entre 768 y 1023 px los textos de la barra se partían en dos líneas y la barra crecía de 62 a 108 px (rol «Organización de contratistas»). No había desplazamiento horizontal, pero la legibilidad empeoraba y la barra fija ocupaba más pantalla. | Relacionado con 1.4.10 (presentación del contenido al reducir el ancho); calidad de presentación | El paso a barra horizontal se movió de `@media (min-width: 48rem)` a `@media (min-width: 64rem)`; por debajo de 1024 px se usa el menú compacto. | Barra de 62–63 px en 320, 360, 768, 900, 1024 y 1280 px para los estados público, cliente y organización. Sin desplazamiento horizontal |
| R-2 | Página (encabezado principal) | **Riesgo identificado antes de implementar, no un defecto encontrado:** el indicador de foco global (`#0b5cad`) sería invisible sobre el fondo azul del hero. | 2.4.7, 1.4.11 | `.hero-mensaje :focus-visible { outline-color: var(--color-foco-sobre-oscuro) }` (blanco). La tarjeta de inicio de sesión, que es blanca, conserva el foco azul. | Edge: foco blanco de 3 px con 6.67:1 sobre `#0b5cad` (captura `rediseno_foco_hero.png`) |
| R-3 | Página (CSS) | Durante la implementación, la tarjeta de inicio de sesión mostraba un relleno vertical excesivo: el formulario usa la clase `.seccion` como `className` de Card, y esa clase se había reutilizado para dar relleno a las secciones de la página. No es un problema de accesibilidad; se detectó en la revisión visual. | — | Las secciones de la página usan `.seccion-producto`, y `.seccion` vuelve a aplicarse solo a la tarjeta. | Captura `rediseno_1280.png` |

**Antes y después de R-1** (`frontend/src/components/Navbar/Navbar.module.css`):

```css
/* Antes */
@media (min-width: 48rem) {
  /* barra horizontal: oculta el botón «Menú» y muestra enlaces y sesión en fila */
}

/* Después */
@media (min-width: 64rem) {
  /* mismo contenido; el menú compacto se mantiene hasta 1023 px */
}
```

### 9.3 Resultados

| Verificación | Resultado | Evidencia |
|---|---|---|
| Vitest | 6 archivos, **50 pruebas aprobadas, 0 fallidas**. Las 41 anteriores se conservan sin cambios y hay 9 nuevas en `DemoComponentesPage.test.tsx`: landmarks, un solo `h1`, aviso de vista previa, los 10 oficios y 6 municipios exactos, los 4 pasos, las solicitudes marcadas «Ejemplo», enlaces internos con destino existente, sesión que solo cambia con la simulación, login simulado que no cambia la sesión, botones de demostración con efecto anunciado y axe en la página completa | [`evidencias/resultado_vitest_rediseno.txt`](evidencias/resultado_vitest_rediseno.txt) |
| Edge con `playwright-core` y axe-core 4.12.1 | **53 comprobaciones, 0 fallas**: axe en 7 estados (incluye 768 px con menú abierto); reflow sin desplazamiento horizontal en 320, 360, 768, 1024 y 1280 px y con zoom emulado de 200 % y 400 %; «Cerrar sesión» visible al recibir el foco con el menú abierto en todos los anchos menores de 1024 px; contorno de foco ≥ 2 px y ≥ 3:1 en todo el recorrido de tabulación; contorno sin recorte en el menú; menú con Enter, Espacio y Escape a 320 y 360 px; formulario (errores, carga, un solo envío, `role="status"`); 3 regiones de estado expuestas en el árbol de accesibilidad; enlaces internos; foco blanco en el hero | [`evidencias/navegador_rediseno.txt`](evidencias/navegador_rediseno.txt), script [`evidencias/auditar_rediseno.mjs`](evidencias/auditar_rediseno.mjs) |
| Contraste | **38 pares, 0 incumplimientos**. Pares nuevos: texto blanco sobre el hero (6.67:1 a 9.69:1), párrafo del hero `#e8f1fb` (5.85:1), aviso de vista previa y etiquetas (8.49:1), sección técnica (6.72:1), foco blanco sobre el hero (6.67:1) | [`evidencias/contraste_rediseno.txt`](evidencias/contraste_rediseno.txt), script [`evidencias/contraste_rediseno.mjs`](evidencias/contraste_rediseno.mjs) |
| Revisión visual | Hero, secciones y tarjetas a 360 y 1280 px; foco en el hero; menú con zoom de 400 % | `rediseno_360.png`, `rediseno_1280.png`, `rediseno_foco_hero.png`, `rediseno_zoom400_menu.png` |

**Orden de tabulación medido en escritorio con sesión simulada:**

> Saltar al contenido principal → UnCalificado → Cómo funcionará → Oficios y zona → Mis solicitudes → Cerrar sesión → Conoce cómo funcionará → Ver oficios y zona del piloto → correo → contraseña → Iniciar sesión → Simular credenciales incorrectas → Rol simulado → Simular sesión iniciada → Simular sesión cerrada → Primario → Secundario → Probar estado de carga (2 s)

El orden coincide con el orden visual. «Deshabilitado» queda fuera porque usa `disabled` nativo, y su nota lo explica.

### 9.4 Observaciones

- **Scripts anteriores.** `auditar.mjs` y `revisar.mjs` se diseñaron para la pantalla anterior: buscan, por ejemplo, el enlace «Botones», 2 regiones de estado y la barra horizontal desde 768 px. Se conservan sin cambios como evidencia histórica y no se espera que pasen con la pantalla actual. Para el diseño actual se usa `auditar_rediseno.mjs`.
- **Contenido de producto.** El contenido se limita al SRS y al backend: los 10 oficios y 6 municipios de RD-18 (tomados de `OFICIOS` y `MUNICIPIOS` del backend), los flujos de EP-02 a EP-05 y el propósito de §1.2. No incluye estadísticas, proveedores, calificaciones ni precios. Las capacidades no implementadas están redactadas en futuro, y cada texto lleva su referencia al SRS en `frontend/src/pages/DemoComponentes/contenidoProducto.ts`.
- **Limitaciones.** Las de la sección 7 siguen vigentes: lector de pantalla, zoom real del navegador, otros navegadores y dispositivos, y alto contraste.
