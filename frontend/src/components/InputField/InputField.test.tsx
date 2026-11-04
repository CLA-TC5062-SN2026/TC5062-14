import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it } from 'vitest'
import { axe } from '../../test/axe'
import { InputField, type InputFieldProps } from './InputField'

/** Envoltura controlada para probar la escritura. */
function Controlado(props: Omit<InputFieldProps, 'value' | 'onChange'>) {
  const [valor, setValor] = useState('')
  return <InputField {...props} value={valor} onChange={(e) => setValor(e.target.value)} />
}

describe('InputField', () => {
  it('asocia la etiqueta visible con el campo (htmlFor/id) y usa el name del backend', () => {
    render(<Controlado label="Correo electrónico" name="correo" type="email" />)
    const campo = screen.getByLabelText('Correo electrónico')
    expect(campo).toHaveAttribute('name', 'correo')
    expect(campo).toHaveAttribute('type', 'email')
    expect(campo.id).not.toBe('')
    expect(document.querySelector(`label[for="${campo.id}"]`)).toHaveTextContent('Correo electrónico')
  })

  it('genera ids únicos cuando hay varias instancias sin id explícito', () => {
    render(
      <>
        <Controlado label="Correo electrónico" name="correo" />
        <Controlado label="Contraseña" name="contrasena" type="password" />
      </>,
    )
    const correo = screen.getByLabelText('Correo electrónico')
    const contrasena = screen.getByLabelText('Contraseña')
    expect(correo.id).not.toBe(contrasena.id)
  })

  it('marca el campo obligatorio con texto visible y el atributo required', () => {
    render(<Controlado label="Contraseña" name="contrasena" type="password" required />)
    const campo = screen.getByLabelText(/Contraseña/)
    expect(campo).toBeRequired()
    expect(screen.getByText('(obligatorio)')).toBeVisible()
  })

  it('sin error: no expone aria-invalid y describe el campo con la ayuda', () => {
    render(<Controlado label="Contraseña" name="contrasena" helperText="Distingue mayúsculas y minúsculas." />)
    const campo = screen.getByLabelText('Contraseña')
    expect(campo).not.toHaveAttribute('aria-invalid')
    expect(campo).toHaveAccessibleDescription('Distingue mayúsculas y minúsculas.')
  })

  it('con error: aria-invalid="true", mensaje visible y asociado con aria-describedby (3.3.1)', () => {
    render(
      <InputField
        label="Correo electrónico"
        name="correo"
        value=""
        onChange={() => {}}
        helperText="Usa el correo con el que te registraste."
        error="Escribe tu correo electrónico."
      />,
    )
    const campo = screen.getByLabelText('Correo electrónico')
    expect(campo).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByText('Escribe tu correo electrónico.')).toBeVisible()
    // La descripción accesible incluye la ayuda y el error, con el prefijo "Error:".
    // Se tolera el espacio tras "Error:": jsdom (dom-accessibility-api) lo recorta, mientras que
    // Edge calcula "Error: Escribe…" (verificado con el árbol de accesibilidad vía CDP).
    expect(campo).toHaveAccessibleDescription(
      /^Usa el correo con el que te registraste. Error: ?Escribe tu correo electrónico.$/,
    )
  })

  it('conserva una aria-describedby externa además de la ayuda y el error', () => {
    render(
      <>
        <p id="nota-externa">Nota externa</p>
        <InputField label="Correo" name="correo" value="" onChange={() => {}} aria-describedby="nota-externa" error="Error de prueba" />
      </>,
    )
    expect(screen.getByLabelText('Correo').getAttribute('aria-describedby')).toMatch(/^nota-externa .+-error$/)
  })

  it('permite escribir con teclado y respeta readOnly sin perder el foco', async () => {
    const usuario = userEvent.setup()
    const { rerender } = render(<InputField label="Correo" name="correo" value="" onChange={() => {}} />)
    await usuario.tab()
    expect(screen.getByLabelText('Correo')).toHaveFocus()
    rerender(<InputField label="Correo" name="correo" value="" onChange={() => {}} readOnly />)
    expect(screen.getByLabelText('Correo')).toHaveFocus()
    expect(screen.getByLabelText('Correo')).toHaveAttribute('readonly')
  })

  it('actualiza el valor al escribir (componente controlado)', async () => {
    const usuario = userEvent.setup()
    render(<Controlado label="Correo electrónico" name="correo" type="email" />)
    await usuario.type(screen.getByLabelText('Correo electrónico'), 'persona@ejemplo.com')
    expect(screen.getByLabelText('Correo electrónico')).toHaveValue('persona@ejemplo.com')
  })

  it('no tiene violaciones axe detectables (con y sin error)', async () => {
    const { container } = render(
      <form>
        <Controlado label="Correo electrónico" name="correo" type="email" required />
        <InputField label="Contraseña" name="contrasena" type="password" value="" onChange={() => {}} error="Escribe tu contraseña." helperText="Distingue mayúsculas y minúsculas." required />
      </form>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
