import { useId, type ChangeEvent, type InputHTMLAttributes, type Ref } from 'react'
import styles from './InputField.module.css'

export type InputFieldType = 'text' | 'email' | 'password' | 'tel' | 'url' | 'search' | 'number'

export interface InputFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'onChange' | 'id' | 'name'> {
  /** Texto visible de la etiqueta (DoD-13). */
  label: string
  /** Nombre del campo; conviene que coincida con el del backend (p. ej. `correo`, `contrasena`). */
  name: string
  /** Si no se indica, se genera uno único con `useId`. */
  id?: string
  type?: InputFieldType
  value: string
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  /** Mensaje de error; si existe, se muestra debajo del campo (RNF-01-AC-2). */
  error?: string
  /** Texto de ayuda permanente debajo de la etiqueta. */
  helperText?: string
  required?: boolean
  disabled?: boolean
  /** React 19: `ref` es una prop normal (permite enfocar el campo, p. ej. el primero con error). */
  ref?: Ref<HTMLInputElement>
}

export function InputField({
  label,
  name,
  id,
  type = 'text',
  value,
  onChange,
  error,
  helperText,
  required = false,
  disabled = false,
  className,
  'aria-describedby': describedByExterno,
  ref,
  ...rest
}: InputFieldProps) {
  const idGenerado = useId()
  const idCampo = id ?? `campo-${idGenerado}`
  const idAyuda = `${idCampo}-ayuda`
  const idError = `${idCampo}-error`
  const tieneError = Boolean(error)

  // La ayuda se anuncia antes que el error; ambos se suman a cualquier descripción externa.
  const describedBy =
    [describedByExterno, helperText ? idAyuda : null, tieneError ? idError : null].filter(Boolean).join(' ') ||
    undefined

  return (
    <div className={[styles.campo, className ?? ''].filter(Boolean).join(' ')}>
      <label htmlFor={idCampo} className={styles.etiqueta}>
        {label}
        {required && <span className={styles.obligatorio}> (obligatorio)</span>}
      </label>

      {helperText && (
        <p id={idAyuda} className={styles.ayuda}>
          {helperText}
        </p>
      )}

      <input
        {...rest}
        ref={ref}
        id={idCampo}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        aria-invalid={tieneError || undefined}
        aria-describedby={describedBy}
        className={[styles.control, tieneError ? styles.controlConError : ''].filter(Boolean).join(' ')}
      />

      {tieneError && (
        <p id={idError} className={styles.error}>
          <span className={styles.errorIcono} aria-hidden="true">
            !
          </span>
          <span>
            <span className="visualmente-oculto">Error: </span>
            {error}
          </span>
        </p>
      )}
    </div>
  )
}
