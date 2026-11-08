import type { EstadoSolicitud, Municipio, Oficio, Rol } from '../services/apiTypes'

/**
 * Textos en español para los valores que el backend maneja como códigos.
 * Las claves son exactamente las del backend; `Record<...>` obliga a cubrir todos los valores.
 */

export const ETIQUETAS_ROL: Record<Rol, string> = {
  cliente: 'Cliente',
  trabajador: 'Trabajador independiente',
  organizacion: 'Organización de contratistas',
  administrador: 'Administrador',
}

export const ETIQUETAS_OFICIO: Record<Oficio, string> = {
  albanileria: 'Albañilería',
  plomeria: 'Plomería',
  electricidad: 'Electricidad',
  carpinteria: 'Carpintería',
  herreria: 'Herrería',
  pintura: 'Pintura',
  pisos_azulejos: 'Pisos y azulejos',
  vidrieria_canceleria: 'Vidriería y cancelería',
  tablaroca: 'Tablaroca',
  impermeabilizacion: 'Impermeabilización',
}

export const ETIQUETAS_MUNICIPIO: Record<Municipio, string> = {
  guadalajara: 'Guadalajara',
  zapopan: 'Zapopan',
  san_pedro_tlaquepaque: 'San Pedro Tlaquepaque',
  tonala: 'Tonalá',
  tlajomulco_de_zuniga: 'Tlajomulco de Zúñiga',
  el_salto: 'El Salto',
}

export const ETIQUETAS_ESTADO_SOLICITUD: Record<EstadoSolicitud, string> = {
  borrador: 'Borrador',
  confirmada: 'Confirmada',
  programado: 'Programado',
  en_proceso: 'En proceso',
  terminado: 'Terminado',
  concluido: 'Concluido',
}
