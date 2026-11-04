/** Formatos de presentación para es-MX (RNF-14: DD/MM/AAAA, hora del centro de México). */

const ZONA_HORARIA = 'America/Mexico_City'

const formatoFecha = new Intl.DateTimeFormat('es-MX', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  timeZone: ZONA_HORARIA,
})

/** Convierte una fecha ISO 8601 en DD/MM/AAAA. Devuelve el texto original si no es una fecha válida. */
export function formatearFecha(iso: string): string {
  const fecha = new Date(iso)
  return Number.isNaN(fecha.getTime()) ? iso : formatoFecha.format(fecha)
}
