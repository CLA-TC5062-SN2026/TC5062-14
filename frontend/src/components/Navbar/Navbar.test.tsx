import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import type { Rol } from '../../services/apiTypes'
import { axe } from '../../test/axe'
import { Navbar, type NavbarLink } from './Navbar'

const ENLACES: NavbarLink[] = [
  { label: 'Inicio', href: '#inicio', current: true },
  { label: 'Botones', href: '#botones' },
]

/** Navbar con estado de sesión local, para probar el cierre de sesión y el retorno del foco. */
function ConSesion({ rol = 'cliente' as Rol }) {
  const [autenticado, setAutenticado] = useState(true)
  return (
    <Navbar
      isAuthenticated={autenticado}
      userName="Ana Ejemplo (ficticia)"
      userRole={rol}
      onLogout={() => setAutenticado(false)}
      links={ENLACES}
    />
  )
}

describe('Navbar', () => {
  it('expone header y nav con nombre, y marca el enlace actual con aria-current', () => {
    render(<Navbar isAuthenticated={false} onLogout={() => {}} links={ENLACES} />)
    expect(screen.getByRole('banner')).toBeInTheDocument()
    const nav = screen.getByRole('navigation', { name: 'Principal' })
    expect(within(nav).getByRole('link', { name: 'Inicio' })).toHaveAttribute('aria-current', 'page')
    expect(within(nav).getByRole('link', { name: 'Botones' })).not.toHaveAttribute('aria-current')
  })

  describe('sin sesión', () => {
    it('muestra la navegación pública y el acceso a "Iniciar sesión"', () => {
      render(<Navbar isAuthenticated={false} onLogout={() => {}} links={ENLACES} loginHref="#login" />)
      expect(screen.getByRole('link', { name: 'Iniciar sesión' })).toHaveAttribute('href', '#login')
      expect(screen.queryByRole('button', { name: 'Cerrar sesión' })).not.toBeInTheDocument()
    })
  })

  describe('con sesión', () => {
    it.each<[Rol, string]>([
      ['cliente', 'Cliente'],
      ['trabajador', 'Trabajador independiente'],
      ['organizacion', 'Organización de contratistas'],
      ['administrador', 'Administrador'],
    ])('rol %s: muestra nombre, rol (%s) y "Cerrar sesión"', (rol, etiqueta) => {
      render(<Navbar isAuthenticated userName="Ana Ejemplo (ficticia)" userRole={rol} onLogout={() => {}} />)
      expect(screen.getByText('Ana Ejemplo (ficticia)')).toBeInTheDocument()
      // El rol lleva el prefijo "Rol:" oculto visualmente para lectores de pantalla.
      expect(screen.getByText(etiqueta)).toHaveTextContent(`Rol: ${etiqueta}`)
      expect(screen.getByRole('button', { name: 'Cerrar sesión' })).toBeInTheDocument()
      expect(screen.queryByRole('link', { name: 'Iniciar sesión' })).not.toBeInTheDocument()
    })

    it('"Cerrar sesión" llama a onLogout y no toca la API', async () => {
      const usuario = userEvent.setup()
      const alCerrar = vi.fn()
      const espiaFetch = vi.spyOn(globalThis, 'fetch')
      render(<Navbar isAuthenticated userName="Ana" userRole="cliente" onLogout={alCerrar} />)
      await usuario.click(screen.getByRole('button', { name: 'Cerrar sesión' }))
      expect(alCerrar).toHaveBeenCalledTimes(1)
      expect(espiaFetch).not.toHaveBeenCalled()
      espiaFetch.mockRestore()
    })

    it('tras cerrar sesión con teclado, el foco pasa a "Iniciar sesión" (2.4.3)', async () => {
      const usuario = userEvent.setup()
      render(<ConSesion />)
      screen.getByRole('button', { name: 'Cerrar sesión' }).focus()
      await usuario.keyboard('{Enter}')
      expect(screen.getByRole('link', { name: 'Iniciar sesión' })).toHaveFocus()
    })
  })

  describe('menú compacto', () => {
    it('el botón tiene nombre estable, aria-controls y aria-expanded=false al inicio', () => {
      render(<Navbar isAuthenticated={false} onLogout={() => {}} links={ENLACES} />)
      const boton = screen.getByRole('button', { name: 'Menú' })
      expect(boton).toHaveAttribute('aria-expanded', 'false')
      const idMenu = boton.getAttribute('aria-controls')
      expect(idMenu).toBeTruthy()
      expect(document.getElementById(idMenu!)).toBeInTheDocument()
    })

    it('se abre y se cierra con Enter y Espacio; el nombre no cambia (4.1.2)', async () => {
      const usuario = userEvent.setup()
      render(<Navbar isAuthenticated={false} onLogout={() => {}} links={ENLACES} />)
      const boton = screen.getByRole('button', { name: 'Menú' })
      boton.focus()
      await usuario.keyboard('{Enter}')
      expect(boton).toHaveAttribute('aria-expanded', 'true')
      expect(boton).toHaveAccessibleName('Menú')
      await usuario.keyboard(' ')
      expect(boton).toHaveAttribute('aria-expanded', 'false')
    })

    it('Escape cierra el menú y devuelve el foco al botón', async () => {
      const usuario = userEvent.setup()
      render(<Navbar isAuthenticated={false} onLogout={() => {}} links={ENLACES} />)
      const boton = screen.getByRole('button', { name: 'Menú' })
      await usuario.click(boton)
      await usuario.tab()
      expect(screen.getByRole('link', { name: 'Inicio' })).toHaveFocus()
      await usuario.keyboard('{Escape}')
      expect(boton).toHaveAttribute('aria-expanded', 'false')
      expect(boton).toHaveFocus()
    })

    it('elegir un enlace cierra el menú', async () => {
      const usuario = userEvent.setup()
      render(<Navbar isAuthenticated={false} onLogout={() => {}} links={ENLACES} />)
      const boton = screen.getByRole('button', { name: 'Menú' })
      await usuario.click(boton)
      await usuario.click(screen.getByRole('link', { name: 'Botones' }))
      expect(boton).toHaveAttribute('aria-expanded', 'false')
    })
  })

  it('no tiene violaciones axe detectables (sin sesión, con sesión y menú abierto)', async () => {
    const usuario = userEvent.setup()
    const { container, rerender } = render(<Navbar isAuthenticated={false} onLogout={() => {}} links={ENLACES} />)
    expect(await axe(container)).toHaveNoViolations()
    rerender(<Navbar isAuthenticated userName="Ana" userRole="trabajador" onLogout={() => {}} links={ENLACES} />)
    await usuario.click(screen.getByRole('button', { name: 'Menú' }))
    expect(await axe(container)).toHaveNoViolations()
  })
})
