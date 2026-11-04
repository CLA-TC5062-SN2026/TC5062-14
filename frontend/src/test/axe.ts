import { configureAxe } from 'jest-axe'

/**
 * axe configurado con las reglas de WCAG 2.0 y 2.1, niveles A y AA.
 *
 * Limitaciones (jsdom no calcula diseño ni estilos reales):
 *  - `color-contrast` no puede evaluarse aquí; el contraste se calcula aparte
 *    (S07_S08_A1/evidencias/contraste.txt) y axe se ejecuta también en Edge.
 *  - Una prueba axe aprobada NO garantiza el cumplimiento de WCAG: axe detecta
 *    solo una parte de los problemas que se pueden automatizar.
 */
export const axe = configureAxe({
  runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] },
  rules: {
    'color-contrast': { enabled: false },
  },
})
