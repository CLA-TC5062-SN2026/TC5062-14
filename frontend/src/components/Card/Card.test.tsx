import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { axe } from '../../test/axe'
import { Card } from './Card'

describe('Card', () => {
  it('por defecto es un <article> con encabezado h3 que le da nombre accesible', () => {
    render(<Card title="Plomería">Contenido</Card>)
    const tarjeta = screen.getByRole('article', { name: 'Plomería' })
    expect(tarjeta).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: 'Plomería' })).toBeInTheDocument()
  })

  it('como <section> con h2 forma una región con nombre (formularios)', () => {
    render(
      <Card as="section" title="Inicio de sesión" headingLevel={2}>
        <form aria-label="Formulario de prueba" />
      </Card>,
    )
    expect(screen.getByRole('region', { name: 'Inicio de sesión' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'Inicio de sesión' })).toBeInTheDocument()
  })

  it('como <div> no intenta asignar nombre accesible (un div sin rol no lo admite)', () => {
    const { container } = render(
      <Card as="div" title="Decorativa">
        Texto
      </Card>,
    )
    expect(container.firstElementChild?.tagName).toBe('DIV')
    expect(container.firstElementChild).not.toHaveAttribute('aria-labelledby')
  })

  it('sin título no crea encabezado ni aria-labelledby', () => {
    render(<Card>Solo contenido</Card>)
    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
    expect(screen.getByRole('article')).not.toHaveAttribute('aria-labelledby')
  })

  it('renderiza el pie y conserva className y atributos adicionales', () => {
    render(
      <Card title="Solicitud" className="extra" id="tarjeta-1" footer={<span>Dato ficticio</span>}>
        Cuerpo
      </Card>,
    )
    const tarjeta = screen.getByRole('article', { name: 'Solicitud' })
    expect(tarjeta).toHaveClass('extra')
    expect(tarjeta).toHaveAttribute('id', 'tarjeta-1')
    expect(screen.getByText('Dato ficticio')).toBeInTheDocument()
  })

  it('no tiene violaciones axe detectables en sus variantes', async () => {
    const { container } = render(
      <main>
        <h1>Prueba</h1>
        <Card as="section" title="Sección" headingLevel={2}>
          <p>Texto</p>
        </Card>
        <Card title="Artículo" footer="Pie">
          <p>Texto</p>
        </Card>
      </main>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
