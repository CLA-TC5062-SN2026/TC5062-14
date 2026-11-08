import type { ButtonHTMLAttributes, MouseEvent, ReactNode } from 'react'
import styles from './Button.module.css'

export type ButtonVariant = 'primary' | 'secondary'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  /** Estilo visual. Por defecto, `primary`. */
  variant?: ButtonVariant
  /** Muestra un indicador de carga y bloquea nuevas activaciones mientras dura la operación. */
  isLoading?: boolean
  /** Texto para lectores de pantalla mientras `isLoading` es verdadero. */
  loadingText?: string
  /** Ocupa todo el ancho disponible (útil en formularios en móvil). */
  fullWidth?: boolean
  /** Por defecto `button`, para no enviar formularios por accidente. */
  type?: 'button' | 'submit' | 'reset'
}

export function Button({
  children,
  variant = 'primary',
  isLoading = false,
  loadingText = 'Cargando…',
  fullWidth = false,
  type = 'button',
  disabled = false,
  className,
  onClick,
  ...rest
}: ButtonProps) {
  // Dos mecanismos distintos:
  // - `disabled` (prop del usuario): deshabilitado nativo; el botón sale del orden de tabulación.
  // - `isLoading`: `aria-disabled` en lugar de `disabled`, para que el botón CONSERVE EL FOCO.
  //   Las activaciones se bloquean en `alHacerClic`: preventDefault cancela también el envío
  //   del formulario, incluido el envío implícito con Enter desde un campo (el navegador lo
  //   ejecuta como un clic sintético sobre el botón de envío).
  const bloqueadoPorCarga = isLoading && !disabled

  const alHacerClic = (evento: MouseEvent<HTMLButtonElement>) => {
    if (bloqueadoPorCarga) {
      evento.preventDefault()
      return
    }
    onClick?.(evento)
  }

  const clases = [
    styles.boton,
    styles[variant],
    fullWidth ? styles.anchoCompleto : '',
    isLoading ? styles.cargando : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      {...rest}
      type={type}
      className={clases}
      disabled={disabled}
      aria-disabled={bloqueadoPorCarga || undefined}
      aria-busy={isLoading || undefined}
      onClick={alHacerClic}
    >
      {isLoading && (
        <>
          <span className={styles.spinner} aria-hidden="true" />
          <span className="visualmente-oculto">{loadingText}</span>
        </>
      )}
      <span className={styles.contenido} aria-hidden={isLoading || undefined}>
        {children}
      </span>
    </button>
  )
}
