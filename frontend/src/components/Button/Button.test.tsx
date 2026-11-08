import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { axe } from '../../test/axe'
import { Button } from './Button'

describe('Button', () => {
  it('se renderiza como <button> con nombre accesible y type="button" por defecto', () => {
    render(<Button>Guardar</Button>)
    const boton = screen.getByRole('button', { name: 'Guardar' })
    expect(boton).toHaveAttribute('type', 'button')
    expect(boton).toBeEnabled()
  })

  it('respeta type="submit" y ejecuta onClick con teclado (Enter y Espacio)', async () => {
    const usuario = userEvent.setup()
    const alHacerClic = vi.fn()
    render(
      <Button type="submit" onClick={alHacerClic}>
        Enviar
      </Button>,
    )
    const boton = screen.getByRole('button', { name: 'Enviar' })
    expect(boton).toHaveAttribute('type', 'submit')
    await usuario.tab()
    expect(boton).toHaveFocus()
    await usuario.keyboard('{Enter}')
    await usuario.keyboard(' ')
    expect(alHacerClic).toHaveBeenCalledTimes(2)
  })

  it('con disabled usa el atributo nativo y no ejecuta onClick', async () => {
    const usuario = userEvent.setup()
    const alHacerClic = vi.fn()
    render(
      <Button disabled onClick={alHacerClic}>
        No disponible
      </Button>,
    )
    const boton = screen.getByRole('button', { name: 'No disponible' })
    expect(boton).toBeDisabled()
    await usuario.click(boton)
    expect(alHacerClic).not.toHaveBeenCalled()
  })

  describe('estado de carga (isLoading)', () => {
    it('expone aria-busy, aria-disabled y el texto de carga como nombre, sin disabled nativo', () => {
      render(
        <Button isLoading loadingText="Guardando…">
          Guardar
        </Button>,
      )
      const boton = screen.getByRole('button', { name: 'Guardando…' })
      expect(boton).toHaveAttribute('aria-busy', 'true')
      expect(boton).toHaveAttribute('aria-disabled', 'true')
      // Sin `disabled` nativo: el botón sigue en el orden de tabulación y conserva el foco.
      expect(boton).not.toHaveAttribute('disabled')
    })

    it('conserva el foco y bloquea clic, Enter y Espacio', async () => {
      const usuario = userEvent.setup()
      const alHacerClic = vi.fn()
      render(
        <Button isLoading onClick={alHacerClic}>
          Guardar
        </Button>,
      )
      const boton = screen.getByRole('button')
      await usuario.tab()
      expect(boton).toHaveFocus()
      await usuario.click(boton)
      await usuario.keyboard('{Enter}')
      await usuario.keyboard(' ')
      expect(alHacerClic).not.toHaveBeenCalled()
      expect(boton).toHaveFocus()
    })

    it('impide el envío del formulario, incluido el envío implícito con Enter desde un campo', async () => {
      const usuario = userEvent.setup()
      const alEnviar = vi.fn((evento: SubmitEvent) => evento.preventDefault())
      render(
        <form
          onSubmit={(e) => {
            alEnviar(e.nativeEvent as SubmitEvent)
          }}
        >
          <label htmlFor="campo">Campo</label>
          <input id="campo" />
          <Button type="submit" isLoading>
            Enviar
          </Button>
        </form>,
      )
      await usuario.click(screen.getByRole('button'))
      await usuario.type(screen.getByLabelText('Campo'), 'texto{Enter}')
      expect(alEnviar).not.toHaveBeenCalled()
    })

    it('el spinner es decorativo (aria-hidden) y el texto visible queda oculto para lectores', () => {
      const { container } = render(<Button isLoading>Guardar</Button>)
      const ocultos = container.querySelectorAll('[aria-hidden="true"]')
      expect(ocultos.length).toBe(2) // spinner y contenido visible
      expect(screen.getByRole('button')).toHaveAccessibleName('Cargando…')
    })
  })

  it('no tiene violaciones axe detectables (variantes, deshabilitado y carga)', async () => {
    const { container } = render(
      <div>
        <Button>Primario</Button>
        <Button variant="secondary">Secundario</Button>
        <Button disabled>Deshabilitado</Button>
        <Button isLoading>Guardar</Button>
      </div>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
