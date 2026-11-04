import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { axe } from '../../test/axe'
import { DemoComponentesPage } from './DemoComponentesPage'

describe('DemoComponentesPage (pantalla principal de la vista previa)', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('tiene los landmarks y una jerarquía de encabezados con un solo h1', () => {
    render(<DemoComponentesPage />)
    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: 'Principal' })).toBeInTheDocument()
    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    const h2 = screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)
    expect(h2).toEqual([
      'Inicio de sesión',
      'Cómo funcionará UnCalificado',
      'Oficios y zona del piloto',
      'Así se verán tus solicitudes Ejemplos',
      'Demostración de componentes',
    ])
  })

  it('comunica el propósito del producto y aclara que es una vista previa sin autenticación real', () => {
    render(<DemoComponentesPage />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Trabajos de oficio en tu domicilio/)
    expect(screen.getByRole('note')).toHaveTextContent(/Vista previa del MVP/)
    expect(screen.getByRole('note')).toHaveTextContent(/no hay autenticación real ni conexión con el servidor/)
  })

  it('muestra exactamente los 10 oficios y los 6 municipios del piloto (RD-18)', () => {
    render(<DemoComponentesPage />)
    const oficios = within(screen.getByRole('list', { name: 'Oficios del catálogo' })).getAllByRole('listitem')
    const municipios = within(screen.getByRole('list', { name: 'Municipios del piloto' })).getAllByRole('listitem')
    expect(oficios.map((o) => o.textContent)).toEqual([
      'Albañilería',
      'Plomería',
      'Electricidad',
      'Carpintería',
      'Herrería',
      'Pintura',
      'Pisos y azulejos',
      'Vidriería y cancelería',
      'Tablaroca',
      'Impermeabilización',
    ])
    expect(municipios.map((m) => m.textContent)).toEqual([
      'Guadalajara',
      'Zapopan',
      'San Pedro Tlaquepaque',
      'Tonalá',
      'Tlajomulco de Zúñiga',
      'El Salto',
    ])
  })

  it('presenta los 4 pasos de «Cómo funcionará» y las solicitudes marcadas como ejemplo', () => {
    render(<DemoComponentesPage />)
    const pasos = within(screen.getByRole('region', { name: 'Cómo funcionará UnCalificado' })).getAllByRole('article')
    expect(pasos).toHaveLength(4)
    const solicitudes = within(screen.getByRole('region', { name: /Así se verán tus solicitudes/ })).getAllByRole('article')
    expect(solicitudes).toHaveLength(4)
    for (const tarjeta of solicitudes) {
      expect(within(tarjeta).getByText('Ejemplo')).toBeInTheDocument()
    }
  })

  it('todos los enlaces internos apuntan a secciones que existen', () => {
    const { container } = render(<DemoComponentesPage />)
    const destinos = [...container.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')].map((a) => a.getAttribute('href')!)
    expect(destinos.length).toBeGreaterThan(0)
    for (const destino of destinos) {
      expect(container.querySelector(destino), `destino ${destino}`).not.toBeNull()
    }
  })

  it('la sesión solo cambia con los controles de simulación y la Navbar refleja el rol', async () => {
    const usuario = userEvent.setup()
    render(<DemoComponentesPage />)
    const nav = screen.getByRole('navigation', { name: 'Principal' })
    expect(within(nav).getByRole('link', { name: 'Iniciar sesión' })).toBeInTheDocument()

    await usuario.click(screen.getByRole('button', { name: 'Simular sesión iniciada' }))
    expect(within(nav).getByText('Ana Ejemplo (ficticia)')).toBeInTheDocument()
    expect(within(nav).getByRole('link', { name: 'Mis solicitudes' })).toBeInTheDocument()
    expect(screen.getByText(/Estado simulado: sesión de Ana Ejemplo/)).toBeInTheDocument()

    await usuario.selectOptions(screen.getByLabelText('Rol simulado'), 'administrador')
    expect(within(nav).queryByRole('link', { name: /solicitudes/i })).not.toBeInTheDocument()

    await usuario.click(within(nav).getByRole('button', { name: 'Cerrar sesión' }))
    expect(within(nav).getByRole('link', { name: 'Iniciar sesión' })).toBeInTheDocument()
  })

  it('el envío simulado del login no cambia la sesión de la Navbar ni afirma un inicio de sesión real', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    const usuario = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<DemoComponentesPage />)
    await usuario.type(screen.getByLabelText(/Correo electrónico/), 'persona@ejemplo.com')
    await usuario.type(screen.getByLabelText(/^Contraseña/), 'ContrasenaFicticia1{Enter}')
    await act(async () => {
      vi.advanceTimersByTime(1600)
    })
    expect(screen.getByText(/no se envió ninguna petición al servidor ni se inició sesión/)).toBeInTheDocument()
    const nav = screen.getByRole('navigation', { name: 'Principal' })
    expect(within(nav).getByRole('link', { name: 'Iniciar sesión' })).toBeInTheDocument()
    expect(within(nav).queryByRole('button', { name: 'Cerrar sesión' })).not.toBeInTheDocument()
  })

  it('los botones de demostración tienen un efecto anunciado (no son decorativos)', async () => {
    const usuario = userEvent.setup()
    render(<DemoComponentesPage />)
    const region = screen.getByRole('region', { name: 'Variantes y estados de Button' })
    const estado = within(region).getByRole('status')
    expect(estado).toBeEmptyDOMElement()
    await usuario.click(within(region).getByRole('button', { name: 'Primario' }))
    expect(estado).toHaveTextContent('Activaste el botón primario.')
    await usuario.click(within(region).getByRole('button', { name: 'Secundario' }))
    expect(estado).toHaveTextContent('Activaste el botón secundario.')
    const deshabilitado = within(region).getByRole('button', { name: 'Deshabilitado' })
    expect(deshabilitado).toBeDisabled()
    expect(deshabilitado).toHaveAccessibleDescription(/ejemplo de botón no disponible/)
  })

  it('no tiene violaciones axe detectables en la página completa (sin sesión y con sesión)', async () => {
    const usuario = userEvent.setup()
    const { container } = render(<DemoComponentesPage />)
    expect(await axe(container)).toHaveNoViolations()
    await usuario.click(screen.getByRole('button', { name: 'Simular sesión iniciada' }))
    expect(await axe(container)).toHaveNoViolations()
  })
})
