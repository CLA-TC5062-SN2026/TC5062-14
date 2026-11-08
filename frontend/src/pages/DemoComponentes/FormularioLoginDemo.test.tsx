import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { axe } from '../../test/axe'
import { FormularioLoginDemo } from './FormularioLoginDemo'

describe('FormularioLoginDemo (integración de InputField, Button y Card)', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  const preparar = () => userEvent.setup({ advanceTimers: vi.advanceTimersByTime })

  it('al enviar vacío muestra los errores junto a cada campo y enfoca el primero (3.3.1, RNF-01-AC-2)', async () => {
    const usuario = preparar()
    render(<FormularioLoginDemo />)
    await usuario.click(screen.getByRole('button', { name: 'Iniciar sesión' }))
    const correo = screen.getByLabelText(/Correo electrónico/)
    const contrasena = screen.getByLabelText(/^Contraseña/)
    expect(correo).toHaveFocus()
    expect(correo).toHaveAttribute('aria-invalid', 'true')
    expect(correo).toHaveAccessibleDescription(/Escribe tu correo electrónico/)
    expect(contrasena).toHaveAttribute('aria-invalid', 'true')
    expect(contrasena).toHaveAccessibleDescription(/Escribe tu contraseña/)
  })

  it('corregir un campo retira solo su error', async () => {
    const usuario = preparar()
    render(<FormularioLoginDemo />)
    await usuario.click(screen.getByRole('button', { name: 'Iniciar sesión' }))
    await usuario.type(screen.getByLabelText(/Correo electrónico/), 'a')
    expect(screen.getByLabelText(/Correo electrónico/)).not.toHaveAttribute('aria-invalid')
    expect(screen.getByLabelText(/^Contraseña/)).toHaveAttribute('aria-invalid', 'true')
  })

  it('durante la carga conserva el foco, bloquea reenvíos y anuncia el resultado en role=status', async () => {
    const usuario = preparar()
    const espiaTemporizador = vi.spyOn(window, 'setTimeout')
    render(<FormularioLoginDemo />)
    const region = screen.getAllByRole('status').at(-1)!
    // La región de estado existe vacía antes de cambiar (4.1.3).
    expect(region).toBeEmptyDOMElement()

    await usuario.type(screen.getByLabelText(/Correo electrónico/), 'persona@ejemplo.com')
    await usuario.type(screen.getByLabelText(/^Contraseña/), 'ContrasenaFicticia1{Enter}')

    const boton = screen.getByRole('button', { name: 'Iniciando sesión (simulación)…' })
    expect(boton).toHaveAttribute('aria-busy', 'true')
    expect(boton).toHaveAttribute('aria-disabled', 'true')
    const contrasena = screen.getByLabelText(/^Contraseña/)
    expect(contrasena).toHaveFocus()
    expect(contrasena).toHaveAttribute('readonly')

    // Reintentos: Enter en el campo, clic, Enter y Espacio en el botón.
    await usuario.keyboard('{Enter}')
    await usuario.click(boton)
    boton.focus()
    await usuario.keyboard('{Enter} ')
    const envios = espiaTemporizador.mock.calls.filter(([, ms]) => ms === 1500).length
    expect(envios).toBe(1)

    await act(async () => {
      vi.advanceTimersByTime(1600)
    })
    expect(region).toHaveTextContent(/Simulación terminada/)
    expect(screen.getByRole('button', { name: 'Iniciar sesión' })).toHaveFocus()
    espiaTemporizador.mockRestore()
  })

  it('la simulación 401 muestra el mensaje real del backend en role=alert', async () => {
    const usuario = preparar()
    render(<FormularioLoginDemo />)
    await usuario.click(screen.getByRole('button', { name: 'Simular credenciales incorrectas' }))
    expect(screen.getByRole('alert')).toHaveTextContent('Correo o contraseña incorrectos.')
  })

  it('no tiene violaciones axe detectables en estado inicial ni con errores', async () => {
    vi.useRealTimers()
    const usuario = userEvent.setup()
    const { container } = render(<FormularioLoginDemo />)
    expect(await axe(container)).toHaveNoViolations()
    await usuario.click(screen.getByRole('button', { name: 'Iniciar sesión' }))
    expect(await axe(container)).toHaveNoViolations()
  })
})
