// Calcula relaciones de contraste WCAG 2.1 de los pares de colores del REDISEÑO orientado al producto.
// Copia de contraste.mjs con los pares nuevos (hero, aviso de vista previa, catálogo y sección técnica).
// Lee los valores de las variables directamente de frontend/src/index.css.
import fs from 'node:fs'

const css = fs.readFileSync(process.argv[2], 'utf8')
const tokens = Object.fromEntries([...css.matchAll(/--(color-[\w-]+):\s*(#[0-9a-fA-F]{6})/g)].map((m) => [m[1], m[2].toLowerCase()]))
tokens['blanco'] = '#ffffff'

const lin = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4 }
const lum = (hex) => { const n = parseInt(hex.slice(1), 16); return 0.2126 * lin((n >> 16) & 255) + 0.7152 * lin((n >> 8) & 255) + 0.0722 * lin(n & 255) }
const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05) }
const v = (n) => { if (!tokens[n]) throw new Error(`Variable no encontrada: ${n}`); return tokens[n] }

// [primer plano, fondo, uso, tipo] — tipo: 'texto' (4.5:1), 'grande' (3:1), 'no-texto' (3:1, 1.4.11), 'exento'
const pares = [
  ['color-texto', 'blanco', 'Texto principal en tarjetas, campos y Navbar', 'texto'],
  ['color-texto', 'color-fondo', 'Texto del campo en solo lectura; texto sobre el fondo de la página', 'texto'],
  ['color-texto-secundario', 'blanco', '«(obligatorio)», ayuda, rol en Navbar, pie de Card, estado «Borrador»', 'texto'],
  ['color-texto-secundario', 'color-fondo', 'Textos secundarios sobre el fondo de la página', 'texto'],
  ['color-primario', 'blanco', 'Marca, texto del botón secundario, enlace actual de Navbar, estados en curso', 'texto'],
  ['blanco', 'color-primario', 'Texto del botón primario, «Iniciar sesión» de Navbar, enlace de salto', 'texto'],
  ['blanco', 'color-primario-oscuro', 'Texto del botón primario en hover', 'texto'],
  ['color-primario-oscuro', 'blanco', 'Botón secundario y enlaces en hover', 'texto'],
  ['color-primario-oscuro', 'color-fondo', 'Botón secundario y enlaces de Navbar en hover (fondo gris)', 'texto'],
  ['color-error', 'blanco', 'Mensaje de error debajo del campo', 'texto'],
  ['color-error', 'color-error-fondo', 'Alerta de credenciales incorrectas (simulación 401)', 'texto'],
  ['blanco', 'color-error', 'Ícono «!» del error (texto en negrita de 13 px)', 'texto'],
  ['color-aviso', 'color-aviso-fondo', 'Aviso de datos ficticios y etiqueta «Dato ficticio»', 'texto'],
  ['color-exito', 'blanco', 'Estados «Terminado» y «Concluido»', 'texto'],
  ['color-deshabilitado', 'color-deshabilitado-fondo', 'Texto de controles deshabilitados (exentos en 1.4.3; se verifica igual)', 'exento'],
  ['color-borde-control', 'blanco', 'Borde de InputField, select y botón «Menú» sobre tarjeta o encabezado blanco', 'no-texto'],
  ['color-borde-control', 'color-fondo', 'Borde de InputField frente a su interior en solo lectura', 'no-texto'],
  ['color-error', 'blanco', 'Borde de 2 px de InputField con error', 'no-texto'],
  ['color-primario', 'blanco', 'Borde del botón secundario; fondo del primario frente a la tarjeta; spinner del secundario', 'no-texto'],
  ['color-primario', 'color-fondo', 'Fondo del botón primario frente al fondo de la página', 'no-texto'],
  ['blanco', 'color-primario', 'Spinner del botón primario (blanco sobre azul)', 'no-texto'],
  ['color-foco', 'blanco', 'Indicador de foco (outline de 3 px) sobre tarjetas y encabezado', 'no-texto'],
  ['color-foco', 'color-fondo', 'Indicador de foco sobre el fondo de la página (p. ej. enlace de salto)', 'no-texto'],
  ['color-error', 'blanco', 'Indicador de foco de InputField con error', 'no-texto'],
  ['color-texto', 'blanco', 'Icono de tres líneas del botón «Menú»', 'no-texto'],
  // ---- Pares nuevos del rediseño ----
  ['color-texto-sobre-oscuro', 'color-hero', 'Título y puntos del hero (punto más claro del degradado)', 'texto'],
  ['color-texto-sobre-oscuro', 'color-hero-fin', 'Título y puntos del hero (punto más oscuro del degradado)', 'texto'],
  ['color-texto-sobre-oscuro-suave', 'color-hero', 'Párrafo descriptivo del hero', 'texto'],
  ['color-primario-oscuro', 'blanco', 'Texto del enlace principal del hero (fondo blanco)', 'texto'],
  ['color-primario-oscuro', 'color-info-fondo', 'Enlace principal del hero en hover; aviso de vista previa; etiquetas de oficios y municipios', 'texto'],
  ['color-texto-sobre-oscuro', 'color-hero-fin', 'Enlace secundario del hero en hover', 'texto'],
  ['color-texto-secundario', 'color-fondo-tecnico', 'Textos de la sección técnica de demostración', 'texto'],
  ['color-foco-sobre-oscuro', 'color-hero', 'Indicador de foco de los enlaces del hero', 'no-texto'],
  ['color-texto-sobre-oscuro', 'color-hero', 'Borde de 2 px de los enlaces del hero y de la etiqueta del piloto', 'no-texto'],
  ['color-primario', 'color-info-fondo', 'Borde de las etiquetas de oficios y municipios (no son controles)', 'exento'],
  ['color-borde-control', 'color-fondo-tecnico', 'Borde discontinuo que separa la sección técnica (decorativo)', 'exento'],
  ['color-foco', 'color-fondo-tecnico', 'Indicador de foco sobre el fondo de la sección técnica', 'no-texto'],
  ['color-borde', 'blanco', 'Borde de Card y separadores (decorativos: no identifican un control)', 'exento'],
]

const minimo = { texto: 4.5, grande: 3, 'no-texto': 3, exento: null }
console.log('Variables leídas de index.css:', Object.entries(tokens).map(([k, h]) => `${k}=${h}`).join(', '))
console.log('\n| Primer plano | Fondo | Relación | Mínimo | Resultado | Uso |')
console.log('|---|---|---|---|---|---|')
let fallas = 0
for (const [fg, bg, uso, tipo] of pares) {
  const r = ratio(v(fg), v(bg))
  const min = minimo[tipo]
  const ok = min === null ? 'No aplica' : r >= min ? 'Cumple' : 'NO CUMPLE'
  if (ok === 'NO CUMPLE') fallas++
  console.log(`| \`${fg}\` ${v(fg)} | \`${bg}\` ${v(bg)} | ${r.toFixed(2)}:1 | ${min ? min + ':1' : '—'} | ${ok} | ${uso} |`)
}
console.log(`\nPares evaluados: ${pares.length}; pares que no cumplen: ${fallas}`)
