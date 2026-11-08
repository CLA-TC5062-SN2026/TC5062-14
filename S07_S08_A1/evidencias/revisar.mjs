// Revisión funcional automatizada de la demo de componentes (Edge vía playwright-core).
// Uso: node revisar.mjs <etiqueta>   (las capturas se guardan como captura-<etiqueta>-*.png)
import { chromium } from 'playwright-core'

const URL = 'http://localhost:5173/'
const etiqueta = process.argv[2] ?? 'run'
const resultados = []
const registrar = (nombre, ok, detalle = '') => {
  resultados.push({ nombre, ok, detalle })
  console.log(`${ok ? 'OK  ' : 'FALLA'} ${nombre}${detalle ? ' — ' + detalle : ''}`)
}

const descFoco = (page) =>
  page.evaluate(() => {
    const el = document.activeElement
    if (!el || el === document.body) return 'BODY'
    const texto = (el.getAttribute('aria-label') || el.textContent || el.getAttribute('name') || '').trim().slice(0, 40)
    return `${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''} "${texto}"`
  })

const browser = await chromium.launch({ channel: 'msedge', headless: true })
const erroresConsola = []

async function nuevaPagina(ancho, alto) {
  const context = await browser.newContext({ viewport: { width: ancho, height: alto }, locale: 'es-MX' })
  const page = await context.newPage()
  page.on('console', (m) => m.type() === 'error' && erroresConsola.push(m.text()))
  page.on('pageerror', (e) => erroresConsola.push(String(e)))
  // Cuenta los temporizadores de envío simulado (1500 ms) para detectar envíos duplicados.
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

const desbordeHorizontal = (page) =>
  page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    culpables: [...document.querySelectorAll('body *')]
      .filter((el) => el.getBoundingClientRect().right > document.documentElement.clientWidth + 1)
      .slice(0, 5)
      .map((el) => `${el.tagName.toLowerCase()}.${[...el.classList].join('.')}`),
  }))

try {
  // ---------- 1. Responsividad ----------
  for (const [ancho, alto] of [[320, 640], [360, 640], [768, 1024], [1280, 800]]) {
    const page = await nuevaPagina(ancho, alto)
    const d = await desbordeHorizontal(page)
    registrar(`Sin desplazamiento horizontal a ${ancho}px`, d.scrollWidth <= d.clientWidth, `scrollWidth=${d.scrollWidth} clientWidth=${d.clientWidth} ${d.culpables.join(', ')}`)
    const botonMenuVisible = await page.getByRole('button', { name: /Menú/ }).isVisible()
    registrar(`Botón "Menú" ${ancho < 768 ? 'visible' : 'oculto'} a ${ancho}px`, ancho < 768 ? botonMenuVisible : !botonMenuVisible)
    if (ancho === 360 || ancho === 1280) {
      await page.screenshot({ path: `captura-${etiqueta}-${ancho}.png`, fullPage: true })
    }
    if (ancho === 360) {
      // Menú abierto con sesión simulada, para revisar el diseño compacto.
      await page.getByRole('button', { name: 'Simular sesión iniciada' }).click()
      await page.getByRole('button', { name: 'Menú' }).click()
      await page.evaluate(() => window.scrollTo(0, 0))
      await page.screenshot({ path: `captura-${etiqueta}-360-menu.png` })
      const d2 = await desbordeHorizontal(page)
      registrar('Sin desplazamiento horizontal con menú abierto a 360px', d2.scrollWidth <= d2.clientWidth, d2.culpables.join(', '))
    }
    await page.context().close()
  }

  // ---------- 2. Teclado en móvil: enlace de salto, menú, Escape ----------
  {
    const page = await nuevaPagina(360, 640)
    await page.keyboard.press('Tab')
    const f1 = await descFoco(page)
    const saltoVisible = await page.evaluate(() => {
      const r = document.activeElement.getBoundingClientRect()
      return r.bottom > 0 && r.top >= 0
    })
    registrar('Primer Tab: enlace "Saltar al contenido" visible', f1.includes('Saltar') && saltoVisible, f1)
    await page.keyboard.press('Enter')
    registrar('Enter en el enlace de salto mueve el foco a <main>', (await descFoco(page)).startsWith('main#contenido'), await descFoco(page))

    await page.goto(URL, { waitUntil: 'networkidle' })
    await page.keyboard.press('Tab') // salto
    await page.keyboard.press('Tab') // marca
    await page.keyboard.press('Tab') // botón menú
    registrar('Tab llega al botón "Menú"', (await descFoco(page)).includes('Menú'), await descFoco(page))
    await page.keyboard.press('Enter')
    const expandido = await page.getByRole('button', { name: /menú/i }).getAttribute('aria-expanded')
    registrar('Enter abre el menú (aria-expanded=true)', expandido === 'true')
    await page.keyboard.press('Tab')
    registrar('Tab entra al primer enlace del menú', (await descFoco(page)).includes('Inicio'), await descFoco(page))
    await page.keyboard.press('Escape')
    const tras = await descFoco(page)
    const exp2 = await page.getByRole('button', { name: /menú/i }).getAttribute('aria-expanded')
    registrar('Escape cierra el menú y devuelve el foco al botón', exp2 === 'false' && tras.includes('Menú'), `${tras}, aria-expanded=${exp2}`)

    // Cerrar sesión desde el menú móvil: el foco debe ir a "Iniciar sesión".
    await page.getByRole('button', { name: 'Simular sesión iniciada' }).click()
    await page.getByRole('button', { name: 'Menú' }).click()
    const visibleNombre = await page.getByText('Ana Ejemplo (ficticia)').first().isVisible()
    const rolVisible = (await page.locator('nav').innerText()).includes('Cliente')
    registrar('Con sesión: nombre y rol visibles en el menú', visibleNombre && rolVisible)
    await page.getByRole('button', { name: 'Cerrar sesión' }).focus()
    await page.keyboard.press('Enter')
    const fLogout = await descFoco(page)
    registrar('Cerrar sesión (Enter) mueve el foco a "Iniciar sesión"', fLogout.includes('Iniciar sesión') && fLogout.startsWith('a'), fLogout)

    // Seleccionar un enlace del menú lo cierra.
    await page.getByRole('link', { name: 'Botones' }).click()
    const exp3 = await page.getByRole('button', { name: /menú/i }).getAttribute('aria-expanded')
    registrar('Elegir un enlace cierra el menú', exp3 === 'false')
    await page.context().close()
  }

  // ---------- 3. Roles: enlaces según el rol simulado (escritorio) ----------
  {
    const page = await nuevaPagina(1280, 800)
    await page.getByRole('button', { name: 'Simular sesión iniciada' }).click()
    for (const [valor, etiquetaRol, enlaceEsperado] of [
      ['cliente', 'Cliente', 'Mis solicitudes'],
      ['trabajador', 'Trabajador independiente', 'Solicitudes asignadas'],
      ['organizacion', 'Organización de contratistas', 'Solicitudes asignadas'],
      ['administrador', 'Administrador', null],
    ]) {
      await page.getByLabel('Rol simulado').selectOption(valor)
      const nav = page.locator('nav')
      const rolOk = (await nav.innerText()).includes(etiquetaRol)
      const enlaces = await nav.getByRole('link').allInnerTexts()
      const enlaceOk = enlaceEsperado ? enlaces.includes(enlaceEsperado) : !enlaces.some((t) => /solicitudes/i.test(t))
      registrar(`Rol ${valor}: etiqueta y enlaces`, rolOk && enlaceOk, enlaces.join(' | '))
    }
    await page.screenshot({ path: `captura-${etiqueta}-1280-sesion.png` })
    await page.context().close()
  }

  // ---------- 4. Formulario: errores, carga, foco y envíos duplicados ----------
  {
    const page = await nuevaPagina(360, 640)
    const correo = page.getByLabel(/Correo electrónico/)
    const contrasena = page.getByLabel(/^Contraseña/)
    // Localizador estable: el nombre accesible del botón cambia durante la carga.
    const enviar = page.locator('form button[type="submit"]')

    await enviar.click()
    const fErr = await descFoco(page)
    const invalido = await correo.getAttribute('aria-invalid')
    const descr = await correo.evaluate((el) =>
      (el.getAttribute('aria-describedby') || '').split(' ').map((id) => document.getElementById(id)?.textContent).join(' / '),
    )
    registrar('Envío vacío: foco en el correo con aria-invalid', fErr.includes('correo') && invalido === 'true', fErr)
    registrar('aria-describedby del correo contiene el mensaje de error', /Escribe tu correo/.test(descr), descr)
    registrar('La contraseña también muestra su error', (await page.getByText('Escribe tu contraseña.').count()) === 1)
    await page.screenshot({ path: `captura-${etiqueta}-360-errores.png`, clip: await page.locator('#iniciar-sesion').boundingBox() })

    await correo.fill('correo-sin-arroba')
    await enviar.click()
    registrar('Correo mal formado: mensaje específico', (await page.getByText(/correo válido/).count()) === 1)

    await correo.fill('persona@ejemplo.com')
    await contrasena.fill('ContrasenaFicticia1')
    // Envío con Enter desde el campo de contraseña.
    await contrasena.focus()
    await page.keyboard.press('Enter')
    await page.waitForTimeout(100)
    const ocupado = await page.locator('button[aria-busy="true"]').first().evaluate((b) => ({
      disabled: b.disabled,
      ariaDisabled: b.getAttribute('aria-disabled'),
      texto: b.textContent,
    }))
    registrar('Durante la carga: aria-busy y aria-disabled, sin disabled nativo', ocupado.ariaDisabled === 'true' && !ocupado.disabled, JSON.stringify(ocupado))
    const fCarga = await descFoco(page)
    registrar('Durante la carga: el foco no se pierde (no queda en BODY)', fCarga !== 'BODY', fCarga)
    // Intentos de reenvío durante la carga: Enter en el campo, clic y Enter en el botón.
    await page.keyboard.press('Enter')
    await enviar.click({ force: true, timeout: 1000 }).catch(() => {})
    await enviar.focus()
    await page.keyboard.press('Enter')
    await page.keyboard.press('Space')
    await page.locator('form').evaluate((f) => f.requestSubmit())
    const enviosDurante = await page.evaluate(() => window.__envios)
    registrar('Reintentos durante la carga no generan envíos nuevos', enviosDurante === 1, `envíos=${enviosDurante}`)
    await page.waitForTimeout(1700)
    const res = await page.getByRole('status').filter({ hasText: 'Simulación terminada' }).count()
    registrar('Al terminar: mensaje de simulación en role=status', res === 1)
    const fFin = await descFoco(page)
    registrar('Al terminar: foco en un control del formulario', fFin !== 'BODY', fFin)

    await page.getByRole('button', { name: 'Simular credenciales incorrectas' }).click()
    registrar('Simulación 401: alerta con el mensaje real del backend', (await page.getByRole('alert').filter({ hasText: 'Correo o contraseña incorrectos.' }).count()) === 1)

    // Botón de demostración de carga: conservar el foco y no reactivar.
    await page.getByRole('button', { name: /Probar estado de carga/ }).focus()
    await page.keyboard.press('Enter')
    await page.waitForTimeout(100)
    const fDemo = await descFoco(page)
    registrar('"Probar estado de carga": el foco se conserva durante la carga', fDemo !== 'BODY', fDemo)
    await page.context().close()
  }
} finally {
  await browser.close()
}

registrar('Sin errores en la consola del navegador', erroresConsola.length === 0, erroresConsola.join(' | '))
const fallas = resultados.filter((r) => !r.ok).length
console.log(`\nTotal: ${resultados.length} comprobaciones, ${fallas} fallas`)
