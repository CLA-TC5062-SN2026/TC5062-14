import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import { InputField } from '../../components/InputField'
import type { CredencialesLogin } from '../../services/apiTypes'
import { validarCredenciales, type CampoLogin, type ErroresLogin } from '../../utils/validacionLogin'
import styles from './DemoComponentesPage.module.css'

const DEMORA_SIMULADA_MS = 1500

/**
 * Formulario de inicio de sesión con los campos reales del backend (`correo`, `contrasena`).
 * SIMULACIÓN: no llama a la API ni al AuthContext y no crea tokens. En la integración real,
 * `alEnviar` llamará a `iniciarSesion` de `useAuth()`.
 */
export function FormularioLoginDemo() {
  const [valores, setValores] = useState<CredencialesLogin>({ correo: '', contrasena: '' })
  const [errores, setErrores] = useState<ErroresLogin>({})
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)
  const [resultado, setResultado] = useState('')

  const correoRef = useRef<HTMLInputElement>(null)
  const contrasenaRef = useRef<HTMLInputElement>(null)
  // Bloqueo síncrono: el estado `enviando` no se actualiza hasta el siguiente render,
  // así que dos envíos muy seguidos podrían pasar; la referencia lo impide.
  const enviandoRef = useRef(false)
  const temporizadorRef = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(temporizadorRef.current), [])

  const alCambiar = (evento: ChangeEvent<HTMLInputElement>) => {
    const campo = evento.target.name as CampoLogin
    setValores((previos) => ({ ...previos, [campo]: evento.target.value }))
    // Al corregir un campo se retira su error; los demás se conservan.
    if (errores[campo]) {
      setErrores((previos) => ({ ...previos, [campo]: undefined }))
    }
  }

  const alEnviar = (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault()
    if (enviandoRef.current) return

    setErrorGeneral(null)
    setResultado('')
    const nuevosErrores = validarCredenciales(valores)
    setErrores(nuevosErrores)

    // Se lleva el foco al primer campo con error para que se lea su mensaje.
    if (nuevosErrores.correo) {
      correoRef.current?.focus()
      return
    }
    if (nuevosErrores.contrasena) {
      contrasenaRef.current?.focus()
      return
    }

    enviandoRef.current = true
    setEnviando(true)
    temporizadorRef.current = window.setTimeout(() => {
      enviandoRef.current = false
      setEnviando(false)
      setResultado(
        'Simulación terminada: no se envió ninguna petición al servidor ni se inició sesión. ' +
          'En la integración real, este formulario llamará a POST /api/auth/login.',
      )
    }, DEMORA_SIMULADA_MS)
  }

  const simularCredencialesIncorrectas = () => {
    if (enviandoRef.current) return
    setResultado('')
    setErrores({})
    // Mensaje real de backend/app/auth/routes.py para el código CREDENCIALES_INVALIDAS (401).
    setErrorGeneral('Correo o contraseña incorrectos.')
  }

  return (
    <Card as="section" id="iniciar-sesion" title="Inicio de sesión" headingLevel={2} className={styles.seccion}>
      <p className={styles.textoSecundario}>
        <strong>Vista previa:</strong> el formulario valida tus datos, pero todavía no se conecta al servidor ni inicia
        sesión.
      </p>

      <form className={styles.formulario} noValidate onSubmit={alEnviar} aria-describedby="login-aviso">
        <p id="login-aviso" className="visualmente-oculto">
          Simulación: este formulario no inicia una sesión real.
        </p>

        {errorGeneral && (
          <div className={styles.alertaError} role="alert">
            <strong>Simulación de respuesta 401:</strong> {errorGeneral}
          </div>
        )}

        <InputField
          ref={correoRef}
          label="Correo electrónico"
          name="correo"
          type="email"
          autoComplete="email"
          inputMode="email"
          spellCheck={false}
          value={valores.correo}
          onChange={alCambiar}
          error={errores.correo}
          required
          readOnly={enviando}
        />

        <InputField
          ref={contrasenaRef}
          label="Contraseña"
          name="contrasena"
          type="password"
          autoComplete="current-password"
          value={valores.contrasena}
          onChange={alCambiar}
          error={errores.contrasena}
          helperText="Distingue mayúsculas y minúsculas."
          required
          readOnly={enviando}
        />

        <div className={styles.acciones}>
          <Button type="submit" isLoading={enviando} loadingText="Iniciando sesión (simulación)…" fullWidth>
            Iniciar sesión
          </Button>
          <Button variant="secondary" onClick={simularCredencialesIncorrectas} disabled={enviando} fullWidth>
            Simular credenciales incorrectas
          </Button>
        </div>

        <p
          className={[styles.estadoFormulario, resultado ? styles.conContenido : ''].filter(Boolean).join(' ')}
          role="status"
        >
          {resultado}
        </p>
      </form>
    </Card>
  )
}
