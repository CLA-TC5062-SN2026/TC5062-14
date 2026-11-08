import { useId, type HTMLAttributes, type ReactNode } from 'react'
import styles from './Card.module.css'

export type CardElement = 'article' | 'section' | 'div'
export type CardHeadingLevel = 2 | 3 | 4

export interface CardProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Título visible; si existe, también da nombre accesible a la tarjeta. */
  title?: ReactNode
  children: ReactNode
  className?: string
  /**
   * Elemento semántico. `article` (por defecto) para contenido autónomo, como el resumen
   * de una solicitud; `section` para agrupar un formulario; `div` si solo es decorativa.
   */
  as?: CardElement
  /** Nivel del encabezado del título, para respetar la jerarquía de la página. Por defecto, 3. */
  headingLevel?: CardHeadingLevel
  /** Contenido de pie (acciones, metadatos). */
  footer?: ReactNode
}

export function Card({
  title,
  children,
  className,
  as: Elemento = 'article',
  headingLevel = 3,
  footer,
  'aria-labelledby': labelledByExterno,
  ...rest
}: CardProps) {
  const idTitulo = `tarjeta-${useId()}-titulo`
  const Encabezado = `h${headingLevel}` as const

  // Un <div> sin rol no admite nombre accesible; solo article/section se etiquetan con el título.
  const labelledBy = labelledByExterno ?? (title && Elemento !== 'div' ? idTitulo : undefined)

  return (
    <Elemento
      {...rest}
      aria-labelledby={labelledBy}
      className={[styles.tarjeta, className ?? ''].filter(Boolean).join(' ')}
    >
      {title && (
        <Encabezado id={idTitulo} className={styles.titulo}>
          {title}
        </Encabezado>
      )}
      <div className={styles.cuerpo}>{children}</div>
      {footer && <div className={styles.pie}>{footer}</div>}
    </Elemento>
  )
}
