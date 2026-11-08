import type { Rol, SolicitudResumen } from '../../services/apiTypes'

/**
 * DATOS FICTICIOS PARA DEMOSTRACIÓN (DoD-12).
 * No provienen del backend ni de personas reales. Siguen la forma del esquema
 * `SolicitudResumen` que devuelve GET /api/solicitudes para que las tarjetas
 * puedan conectarse después a datos reales sin cambiar su presentación.
 */
export const SOLICITUDES_FICTICIAS: SolicitudResumen[] = [
  {
    id: '00000000-0000-4000-8000-000000000001',
    oficio: 'plomeria',
    resultadoEsperado: 'Que el lavabo del baño deje de gotear y el agua drene sin problema.',
    estado: 'borrador',
    zona: { municipio: 'guadalajara', colonia: 'Colonia de ejemplo 1' },
    actualizadaEn: '2026-10-30T17:45:00Z',
  },
  {
    id: '00000000-0000-4000-8000-000000000002',
    oficio: 'electricidad',
    resultadoEsperado: 'Instalar dos contactos nuevos en la cocina con su propia pastilla.',
    estado: 'confirmada',
    zona: { municipio: 'zapopan', colonia: 'Colonia de ejemplo 2' },
    actualizadaEn: '2026-10-28T15:10:00Z',
  },
  {
    id: '00000000-0000-4000-8000-000000000003',
    oficio: 'impermeabilizacion',
    resultadoEsperado: 'Impermeabilizar la azotea de 60 m² antes de la próxima temporada de lluvias.',
    estado: 'en_proceso',
    zona: { municipio: 'tlajomulco_de_zuniga', colonia: 'Colonia de ejemplo 3' },
    actualizadaEn: '2026-10-21T19:30:00Z',
  },
  {
    id: '00000000-0000-4000-8000-000000000004',
    oficio: 'pintura',
    resultadoEsperado: 'Pintar la fachada y el portón con el color actual.',
    estado: 'concluido',
    zona: { municipio: 'san_pedro_tlaquepaque', colonia: 'Colonia de ejemplo 4' },
    actualizadaEn: '2026-10-02T16:00:00Z',
  },
]

/** Usuario ficticio para simular la vista con sesión en la barra de navegación. */
export const USUARIO_FICTICIO: { nombre: string; rolInicial: Rol } = {
  nombre: 'Ana Ejemplo (ficticia)',
  rolInicial: 'cliente',
}
