// Auditoría de accesibilidad del REDISEÑO orientado al producto (Microsoft Edge vía playwright-core).
// Copia adaptada de auditar.mjs (que se conserva sin cambios como evidencia histórica). Cambios:
//  - 3 regiones role=status (simulación, formulario y demostración de Button);
//  - menú compacto hasta 1023 px (Navbar pasa a barra horizontal en 64rem);
//  - anchos adicionales 768 y 1024 px; enlaces internos; foco blanco sobre el hero azul.
// Uso: node auditar.mjs <etiqueta> <ruta-a-frontend>
//   - axe-core (el mismo que usa jest-axe en el proyecto) sobre la página renderizada.
//   - Reflow a 320/360 px y zoom emulado de 200 % y 400 % (viewport CSS equivalente + deviceScaleFactor).
//   - Indicadores de foco: estilo de outline y contraste contra el fondo adyacente.
//   - Orden de tabulación, menú móvil, errores y carga del formulario.
import { chromium } from 'playwright-core'
import path from 'node:path'

const URL = 'http://localhost:5173/'
const etiqueta = process.argv[2] ?? 'run'
const frontend = process.argv[3]
const AXE = path.join(frontend, 'node_modules', 'jest-axe', 'node_modules', 'axe-core', 'axe.min.js')

const resultados = []
const registrar = (grupo, nombre, ok, detalle = '') => {
  resultados.push({ grupo, nombre, ok, detalle })
  console.log(`${ok === null ? 'PEND ' : ok ? 'OK   ' : 'FALLA'} [${grupo}] ${nombre}${detalle ? ' — ' + detalle : ''}`)
}

const browser = await chromium.launch({ channel: 'msedge', headless: true })
const erroresConsola = []

async function nuevaPagina({ width, height, dpr = 1 }) {
  const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: dpr, locale: 'es-MX' })
  const page = await context.newPage()
  page.on('console', (m) => m.type() === 'error' && erroresConsola.push(m.text()))
  page.on('pageerror', (e) => erroresConsola.push(String(e)))
  await page.addInitScript(() => {
    window.__envios = 0
    const original = window.setTimeout
    window.setTimeout = (fn, ms, ...args) => {
      if (ms === 1500) window.__envios++
      return original(fn, ms, ...args)
    }
  })
  await page.goto(URL, { waitUntil: 'networkidle' })
  return page
}

async function correrAxe(page, escenario) {
  await page.addScriptTag({ path: AXE })
  const r = await page.evaluate(async () => {
    // eslint-disable-next-line no-undef
    const res = await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] } })
    return {
      version: res.testEngine.version,
      violaciones: res.violations.map((v) => `${v.id} (${v.impact}): ${v.nodes.length} nodo(s) — ${v.nodes.map((n) => n.target.join(' ')).slice(0, 3).join(' | ')}`),
      incompletos: res.incomplete.map((v) => `${v.id}: ${v.nodes.length}`),
      aprobadas: res.passes.length,
    }
  })
  registrar('axe', `Sin violaciones WCAG 2.0/2.1 A-AA: ${escenario}`, r.violaciones.length === 0,
    `axe ${r.version}; reglas aprobadas=${r.aprobadas}; violaciones=[${r.violaciones.join('; ')}]; revisión manual=[${r.incompletos.join(', ')}]`)
}

const medirDesborde = (page) =>
  page.evaluate(() => {
    const ancho = document.documentElement.clientWidth
    return {
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: ancho,
      culpables: [...document.querySelectorAll('body *')]
        .filter((el) => {
          const r = el.getBoundingClientRect()
          return r.width > 0 && r.right > ancho + 1
        })
        .slice(0, 4)
        .map((el) => `${el.tagName.toLowerCase()}.${[...el.classList].join('.')}`),
    }
  })

// Contraste WCAG entre dos colores rgb(a) del navegador.
const funcionesColor = `
  const parse = (c) => { const m = c.match(/rgba?\\(([^)]+)\\)/); if (!m) return null; const p = m[1].split(/[ ,\\/]+/).filter(Boolean).map(Number); return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 } }
  const lum = ({ r, g, b }) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4 }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b) }
  const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05) }
  const fondo = (el) => { let n = el.parentElement; while (n) { const c = parse(getComputedStyle(n).backgroundColor); if (c && c.a > 0) return c; n = n.parentElement } return { r: 255, g: 255, b: 255, a: 1 } }
`

async function inspeccionarFoco(page) {
  return page.evaluate((fx) => {
    // eslint-disable-next-line no-new-func
    const { parse, ratio, fondo } = new Function(`${fx}; return { parse, ratio, fondo }`)()
    const el = document.activeElement
    if (!el || el === document.body) return { nombre: 'BODY' }
    const cs = getComputedStyle(el)
    const color = parse(cs.outlineColor)
    const bg = fondo(el)
    const r = el.getBoundingClientRect()
    return {
      nombre: `${el.tagName.toLowerCase()} "${(el.getAttribute('aria-label') || el.textContent || el.name || '').trim().slice(0, 30)}"`,
      estilo: cs.outlineStyle,
      ancho: parseFloat(cs.outlineWidth),
      contraste: color ? Number(ratio(color, bg).toFixed(2)) : 0,
      visibleEnPantalla: r.bottom > 0 && r.top < window.innerHeight && r.right > 0 && r.left < window.innerWidth,
      focusVisible: el.matches(':focus-visible'),
    }
  }, funcionesColor)
}

try {
  // ---------- 1. axe-core en distintos estados ----------
  {
    const page = await nuevaPagina({ width: 360, height: 640 })
    await correrAxe(page, 'estado inicial a 360 px')
    await page.locator('form button[type="submit"]').click()
    await correrAxe(page, 'formulario con errores a 360 px')
    await page.getByRole('button', { name: 'Simular credenciales incorrectas' }).click()
    await correrAxe(page, 'alerta 401 simulada a 360 px')
    await page.getByRole('button', { name: 'Simular sesión iniciada' }).click()
    await page.getByRole('button', { name: /Menú/ }).click()
    await correrAxe(page, 'menú móvil abierto con sesión a 360 px')
    await page.context().close()

    const tablet = await nuevaPagina({ width: 768, height: 1024 })
    await tablet.getByRole('button', { name: 'Simular sesión iniciada' }).click()
    await tablet.getByRole('button', { name: /Menú/ }).click()
    await tablet.getByRole('button', { name: 'Primario' }).click()
    await correrAxe(tablet, '768 px con sesión, menú abierto y demostración de Button activada')
    await tablet.context().close()

    const desk = await nuevaPagina({ width: 1280, height: 800 })
    await desk.getByRole('button', { name: 'Simular sesión iniciada' }).click()
    await correrAxe(desk, 'escritorio 1280 px con sesión')
    await desk.getByLabel(/Correo electrónico/).fill('persona@ejemplo.com')
    await desk.getByLabel(/^Contraseña/).fill('ContrasenaFicticia1')
    await desk.locator('form button[type="submit"]').click()
    await desk.waitForTimeout(100)
    await correrAxe(desk, 'formulario en carga (escritorio)')
    await desk.context().close()
  }

  // ---------- 2. Reflow (1.4.10) y zoom emulado ----------
  const vistas = [
    { nombre: '320 px', width: 320, height: 640 },
    { nombre: '360 px', width: 360, height: 640 },
    { nombre: 'zoom 200 % (1280×1024 → 640×512 CSS px)', width: 640, height: 512, dpr: 2 },
    { nombre: 'zoom 400 % (1280×1024 → 320×256 CSS px)', width: 320, height: 256, dpr: 4 },
    { nombre: '768 px', width: 768, height: 1024 },
    { nombre: '1024 px', width: 1024, height: 768 },
    { nombre: '1280 px', width: 1280, height: 1024 },
  ]
  for (const vista of vistas) {
    const page = await nuevaPagina(vista)
    let d = await medirDesborde(page)
    registrar('reflow', `Sin desplazamiento horizontal — ${vista.nombre}`, d.scrollWidth <= d.clientWidth, `scrollWidth=${d.scrollWidth}, clientWidth=${d.clientWidth} ${d.culpables.join(', ')}`)
    // Errores del formulario
    await page.locator('form button[type="submit"]').click()
    d = await medirDesborde(page)
    registrar('reflow', `Sin desplazamiento horizontal con errores — ${vista.nombre}`, d.scrollWidth <= d.clientWidth, d.culpables.join(', '))
    if (vista.width < 1024) {
      await page.getByRole('button', { name: 'Simular sesión iniciada' }).click()
      await page.evaluate(() => window.scrollTo(0, 0))
      await page.getByRole('button', { name: /Menú/ }).click()
      d = await medirDesborde(page)
      registrar('reflow', `Sin desplazamiento horizontal con menú abierto — ${vista.nombre}`, d.scrollWidth <= d.clientWidth, d.culpables.join(', '))
      // ¿Se puede alcanzar y ver "Cerrar sesión" con el menú abierto? (la barra es sticky)
      await page.getByRole('button', { name: 'Cerrar sesión' }).focus()
      const visible = await page.getByRole('button', { name: 'Cerrar sesión' }).evaluate((b) => {
        const r = b.getBoundingClientRect()
        return { top: Math.round(r.top), bottom: Math.round(r.bottom), alto: window.innerHeight }
      })
      registrar('reflow', `"Cerrar sesión" visible al recibir el foco con el menú abierto — ${vista.nombre}`,
        visible.top >= 0 && visible.bottom <= visible.alto, `top=${visible.top}, bottom=${visible.bottom}, alto de ventana=${visible.alto}`)
      if (vista.dpr === 4) await page.screenshot({ path: `audit-${etiqueta}-zoom400-menu.png` })
    }
    await page.context().close()
  }

  // ---------- 3. Orden de tabulación y foco visible ----------
  for (const vista of [{ nombre: 'escritorio 1280 px', width: 1280, height: 800 }, { nombre: 'móvil 360 px', width: 360, height: 640 }]) {
    const page = await nuevaPagina(vista)
    await page.getByRole('button', { name: 'Simular sesión iniciada' }).click()
    // Punto de partida: el enlace de salto (primer elemento enfocable del documento).
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.locator('a[href="#contenido"]').focus()
    const orden = [(await inspeccionarFoco(page)).nombre]
    let peor = null
    let sinIndicador = []
    for (let i = 0; i < 45; i++) {
      await page.keyboard.press('Tab')
      const f = await inspeccionarFoco(page)
      if (f.nombre === 'BODY') break
      orden.push(f.nombre)
      const okIndicador = f.estilo !== 'none' && f.ancho >= 2 && f.contraste >= 3 && f.focusVisible
      if (!okIndicador) sinIndicador.push(`${f.nombre} (${f.estilo} ${f.ancho}px, ${f.contraste}:1)`)
      if (!f.visibleEnPantalla) sinIndicador.push(`${f.nombre} fuera de pantalla`)
      if (!peor || f.contraste < peor.contraste) peor = f
    }
    registrar('foco', `Orden de tabulación — ${vista.nombre}`, true, orden.join(' → '))
    registrar('foco', `Indicador de foco visible (outline ≥ 2 px, ≥ 3:1) en todos los elementos — ${vista.nombre}`, sinIndicador.length === 0,
      sinIndicador.length ? sinIndicador.join('; ') : `menor contraste del indicador: ${peor?.contraste}:1 en ${peor?.nombre}`)
    if (vista.width === 1280) {
      await page.getByLabel(/Correo electrónico/).focus()
      await page.keyboard.press('Shift+Tab')
      await page.keyboard.press('Tab')
      await page.screenshot({ path: `audit-${etiqueta}-foco-campo.png`, clip: await page.locator('#iniciar-sesion').boundingBox() })
    }
    await page.context().close()
  }

  // ---------- 4. Menú móvil a 320 y 360 px con teclado ----------
  for (const width of [320, 360]) {
    const page = await nuevaPagina({ width, height: 640 })
    const boton = page.locator('nav button[aria-controls]')
    await boton.focus()
    const nombreCerrado = (await boton.innerText()).trim()
    await page.keyboard.press('Enter')
    const abierto = await boton.getAttribute('aria-expanded')
    const nombreAbierto = (await boton.innerText()).trim()
    const menuVisible = await page.locator(`#${await boton.getAttribute('aria-controls')}`.replace(/:/g, '\\:')).isVisible()
    registrar('menú', `Enter abre el menú a ${width} px`, abierto === 'true' && menuVisible, `nombre cerrado="${nombreCerrado}", abierto="${nombreAbierto}"`)
    await page.keyboard.press('Space')
    registrar('menú', `Espacio cierra el menú a ${width} px`, (await boton.getAttribute('aria-expanded')) === 'false')
    await page.keyboard.press('Space')
    await page.keyboard.press('Tab')
    await page.keyboard.press('Escape')
    const foco = await page.evaluate(() => document.activeElement?.getAttribute('aria-controls') !== null)
    registrar('menú', `Escape cierra y devuelve el foco al botón a ${width} px`, (await boton.getAttribute('aria-expanded')) === 'false' && foco)
    await page.context().close()
  }

  // ---------- 4b. El contorno de foco no se recorta dentro del menú desplegable (2.4.7) ----------
  for (const vista of [{ width: 360, height: 640, dpr: 1, nombre: '360 px' }, { width: 320, height: 256, dpr: 4, nombre: 'zoom 400 %' }]) {
    const page = await nuevaPagina(vista)
    await page.getByRole('button', { name: 'Simular sesión iniciada' }).click()
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.locator('nav button[aria-controls]').focus()
    await page.keyboard.press('Enter')
    const recortados = []
    const medidos = []
    for (let i = 0; i < 4; i++) {
      await page.keyboard.press('Tab')
      const r = await page.evaluate(() => {
        const el = document.activeElement
        const menu = el.closest('[id^="menu-"]')
        const cs = getComputedStyle(el)
        const extra = parseFloat(cs.outlineWidth) + parseFloat(cs.outlineOffset)
        const a = el.getBoundingClientRect()
        const m = menu.getBoundingClientRect()
        return { nombre: el.textContent.trim(), recortado: a.left - extra < m.left - 0.5 || a.right + extra > m.right + 0.5 }
      })
      medidos.push(r.nombre)
      if (r.recortado) recortados.push(r.nombre)
    }
    registrar('foco', `Contorno de foco completo (sin recorte) en los elementos del menú abierto — ${vista.nombre}`, recortados.length === 0, recortados.length ? `recortados: ${recortados.join(', ')}` : `medidos: ${medidos.join(', ')}`)
    await page.context().close()
  }

  // ---------- 5. Formulario: errores y carga ----------
  {
    const page = await nuevaPagina({ width: 360, height: 640 })
    const enviar = page.locator('form button[type="submit"]')
    await page.getByLabel(/Correo electrónico/).focus()
    await page.keyboard.press('Enter')
    const correo = page.getByLabel(/Correo electrónico/)
    const desc = await correo.evaluate((el) => (el.getAttribute('aria-describedby') || '').split(' ').map((id) => document.getElementById(id)?.textContent).join(' / '))
    registrar('formulario', 'Enter con campos vacíos: foco en el correo, aria-invalid y mensaje asociado',
      (await correo.evaluate((el) => el === document.activeElement)) && (await correo.getAttribute('aria-invalid')) === 'true' && desc.includes('Escribe tu correo'), desc)
    await correo.fill('persona@ejemplo.com')
    await page.getByLabel(/^Contraseña/).fill('ContrasenaFicticia1')
    await page.getByLabel(/^Contraseña/).press('Enter')
    await page.waitForTimeout(100)
    const estado = await enviar.evaluate((b) => ({ ariaDisabled: b.getAttribute('aria-disabled'), ariaBusy: b.getAttribute('aria-busy'), disabled: b.disabled, nombre: b.innerText }))
    registrar('formulario', 'Carga: aria-busy y aria-disabled, sin disabled nativo', estado.ariaBusy === 'true' && estado.ariaDisabled === 'true' && !estado.disabled, JSON.stringify(estado))
    await page.keyboard.press('Enter')
    await enviar.focus()
    await page.keyboard.press('Enter')
    await page.keyboard.press('Space')
    registrar('formulario', 'Reintentos durante la carga no generan envíos nuevos', (await page.evaluate(() => window.__envios)) === 1, `envíos=${await page.evaluate(() => window.__envios)}`)
    await page.waitForTimeout(1700)
    const estadoTexto = await page.locator('form [role="status"]').innerText()
    registrar('formulario', 'Resultado anunciado en role=status', estadoTexto.includes('Simulación terminada'), estadoTexto.slice(0, 60))
    await page.context().close()
  }

  // ---------- 5b. ¿La región role=status del formulario existe en el árbol de accesibilidad antes de cambiar? ----------
  {
    const page = await nuevaPagina({ width: 360, height: 640 })
    const cdp = await page.context().newCDPSession(page)
    const { nodes } = await cdp.send('Accessibility.getFullAXTree')
    const regiones = nodes.filter((n) => !n.ignored && n.role?.value === 'status').length
    registrar('formulario', 'Las 3 regiones role=status (simulación, formulario y demostración) están en el árbol de accesibilidad antes de actualizarse', regiones === 3, `regiones status expuestas=${regiones}`)
    await page.context().close()
  }

  // ---------- 5c. Enlaces internos y foco sobre el hero azul ----------
  {
    const page = await nuevaPagina({ width: 1280, height: 800 })
    const rotos = await page.evaluate(() => [...document.querySelectorAll('a[href^="#"]')].map((a) => a.getAttribute('href')).filter((h) => !document.querySelector(h)))
    registrar('enlaces', 'Todos los enlaces internos apuntan a una sección existente', rotos.length === 0, rotos.join(', '))
    await page.locator('a[href="#como-funciona"]').last().focus()
    await page.keyboard.press('Shift+Tab')
    await page.keyboard.press('Tab')
    const foco = await inspeccionarFoco(page)
    registrar('foco', 'Enlace del hero (fondo azul): foco blanco con contraste ≥ 3:1', foco.estilo !== 'none' && foco.contraste >= 3, `${foco.nombre}: ${foco.estilo} ${foco.ancho}px, ${foco.contraste}:1`)
    await page.screenshot({ path: `audit-${etiqueta}-foco-hero.png`, clip: { x: 0, y: 0, width: 1280, height: 800 } })
    await page.keyboard.press('Enter')
    await page.waitForTimeout(600)
    const llego = await page.evaluate(() => { const r = document.getElementById('como-funciona').getBoundingClientRect(); return r.top >= 0 && r.top < window.innerHeight })
    registrar('enlaces', 'Enter en «Conoce cómo funcionará» lleva a la sección', llego)
    await page.context().close()
  }

  // ---------- 6. Espaciado de texto (1.4.12, comprobación complementaria) ----------
  {
    const page = await nuevaPagina({ width: 360, height: 640 })
    await page.addStyleTag({ content: '* { line-height: 1.5 !important; letter-spacing: 0.12em !important; word-spacing: 0.16em !important; } p { margin-bottom: 2em !important; }' })
    const d = await medirDesborde(page)
    registrar('extra', 'Espaciado de texto 1.4.12 a 360 px: sin desplazamiento horizontal', d.scrollWidth <= d.clientWidth, d.culpables.join(', '))
    await page.context().close()
  }
} finally {
  await browser.close()
}

registrar('consola', 'Sin errores en la consola del navegador', erroresConsola.length === 0, erroresConsola.join(' | '))
const fallas = resultados.filter((r) => r.ok === false).length
console.log(`\nTotal: ${resultados.length} comprobaciones, ${fallas} fallas`)
