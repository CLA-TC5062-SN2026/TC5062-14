/**
 * Textos de producto de la pantalla principal.
 *
 * Cada texto se deriva del SRS del equipo (S03_A1/SRS_equipo.md) y del backlog
 * (S03_A1/backlog_completo.md). Las capacidades que todavía no están implementadas
 * se redactan en FUTURO: describen el MVP previsto, no funciones disponibles hoy.
 */

export interface PasoProducto {
  titulo: string
  descripcion: string
  /** Requisitos del SRS y épica del backlog que respaldan el texto (solo trazabilidad). */
  referencias: string
}

/** Puntos clave del encabezado principal (SRS §1.2 y §2). */
export const PUNTOS_CLAVE: { texto: string; referencias: string }[] = [
  {
    texto: 'Te recomendará de 3 a 4 proveedores compatibles, y tú elegirás.',
    referencias: 'RF-30, RF-31',
  },
  {
    texto: 'Tu domicilio exacto no se pedirá para buscar; solo se compartirá con el trabajador que elijas.',
    referencias: 'RF-16-AC-5, RF-52',
  },
  {
    texto: 'Ningún cambio de costo, material, alcance o fecha se aplicará sin tu autorización.',
    referencias: 'RF-24, RF-41',
  },
]

/** Los cuatro pasos corresponden a las épicas EP-02 a EP-05 del backlog. */
export const PASOS: PasoProducto[] = [
  {
    titulo: 'Describe tu necesidad',
    descripcion:
      'Conversarás con un agente de IA que se identificará como asistente automático. Te ayudará a precisar el oficio y el resultado que buscas, y te mostrará un resumen para que lo confirmes. Si la IA no está disponible, podrás capturar tu solicitud manualmente.',
    referencias: 'EP-02 · RF-13, RF-14, RF-20, RF-21',
  },
  {
    titulo: 'Compara y elige',
    descripcion:
      'Recibirás de 3 a 4 proveedores compatibles con la explicación de por qué se recomiendan, y distinguirás la información verificada de la declarada. La decisión será tuya: la IA no asigna proveedores.',
    referencias: 'EP-03 · RF-08, RF-26, RF-30, RF-31',
  },
  {
    titulo: 'Acuerda cita y propuesta',
    descripcion:
      'Las citas se confirmarán por ambas partes y el trabajo se acordará con una propuesta escrita con desglose. Los cambios de costo, material, alcance o fecha requerirán tu autorización.',
    referencias: 'EP-03, EP-04 · RF-34, RF-38, RF-41, RF-24',
  },
  {
    titulo: 'Sigue y cierra el trabajo',
    descripcion:
      'Seguirás el avance por estados y te comunicarás por un canal interno, sin intercambiar teléfonos. Tú confirmarás el cierre y ambas partes se evaluarán.',
    referencias: 'EP-05 · RF-45, RF-46, RF-47, RF-49, RF-50, RD-15',
  },
]
