import { useEffect, useRef, useState } from 'react'
import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import type { Rol } from '../../services/apiTypes'
import { ETIQUETAS_ROL } from '../../utils/catalogos'
import styles from './DemoComponentesPage.module.css'

const ROLES: Rol[] = ['cliente', 'trabajador', 'organizacion', 'administrador']

interface DemostracionComponentesProps {
  sesionSimulada: boolean
  rolSimulado: Rol
  nombreFicticio: string
  onCambiarSesion: (iniciada: boolean) => void
  onCambiarRol: (rol: Rol) => void
}

/**
 * Sección técnica de la actividad S07-S08-A1: muestra los componentes en sus distintos estados.
 * Cada control tiene un efecto visible y anunciado; ninguno envía datos ni crea tokens.
 */
export function DemostracionComponentes({
  sesionSimulada,
  rolSimulado,
  nombreFicticio,
  onCambiarSesion,
  onCambiarRol,
}: DemostracionComponentesProps) {
  const [ultimaAccion, setUltimaAccion] = useState('')
  const [cargandoDemo, setCargandoDemo] = useState(false)
  const temporizadorRef = useRef<number | undefined>(undefined)
  useEffect(() => () => window.clearTimeout(temporizadorRef.current), [])

  const probarCarga = () => {
    setUltimaAccion('')
    setCargandoDemo(true)
    temporizadorRef.current = window.setTimeout(() => {
      setCargandoDemo(false)
      setUltimaAccion('Terminó la carga simulada de 2 segundos.')
    }, 2000)
  }

  return (
    <section id="demostracion" aria-labelledby="titulo-demostracion" className={styles.seccionTecnica}>
      <div className={styles.contenedor}>
        <div className={styles.encabezadoSeccion}>
          <p className={styles.etiquetaTecnica}>Sección técnica · S07-S08-A1</p>
          <h2 id="titulo-demostracion" className={styles.subtitulo}>
            Demostración de componentes
          </h2>
          <p className={styles.textoSecundario}>
            Controles para revisar Button, InputField, Card y Navbar en sus distintos estados. Todo ocurre en el
            navegador: no se envían datos ni se crean tokens.
          </p>
        </div>

        <div className={styles.rejillaTecnica}>
          <Card as="section" id="simulacion-sesion" title="Simulación de sesión" headingLevel={3}>
            <p className={styles.textoSecundario}>
              Cambia la barra de navegación entre la vista pública y la vista con sesión.{' '}
              <strong>Es solo una simulación:</strong> no inicia una sesión real.
            </p>

            <div className={styles.controlSimulacion}>
              <label htmlFor="rol-simulado" className={styles.etiquetaSelect}>
                Rol simulado
              </label>
              <select
                id="rol-simulado"
                className={styles.select}
                value={rolSimulado}
                onChange={(evento) => onCambiarRol(evento.target.value as Rol)}
              >
                {ROLES.map((rol) => (
                  <option key={rol} value={rol}>
                    {ETIQUETAS_ROL[rol]}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.acciones}>
              {/* No se deshabilitan según el estado: un botón que se deshabilita al pulsarlo pierde el foco. */}
              <Button onClick={() => onCambiarSesion(true)}>Simular sesión iniciada</Button>
              <Button variant="secondary" onClick={() => onCambiarSesion(false)}>
                Simular sesión cerrada
              </Button>
            </div>

            <p className={styles.estadoSimulacion} role="status">
              Estado simulado:{' '}
              {sesionSimulada
                ? `sesión de ${nombreFicticio}, rol ${ETIQUETAS_ROL[rolSimulado]}.`
                : 'sin sesión (navegación pública).'}
            </p>
          </Card>

          <Card as="section" id="botones" title="Variantes y estados de Button" headingLevel={3}>
            <p className={styles.textoSecundario}>
              Al pulsarlos, los botones solo informan qué se activó; no ejecutan ninguna operación.
            </p>
            <div className={styles.muestrario}>
              <Button variant="primary" onClick={() => setUltimaAccion('Activaste el botón primario.')}>
                Primario
              </Button>
              <Button variant="secondary" onClick={() => setUltimaAccion('Activaste el botón secundario.')}>
                Secundario
              </Button>
              <Button disabled aria-describedby="nota-deshabilitado">
                Deshabilitado
              </Button>
            </div>
            <p id="nota-deshabilitado" className={styles.nota}>
              «Deshabilitado» es un ejemplo de botón no disponible: no se puede activar ni recibe el foco.
            </p>
            <div className={styles.acciones}>
              <Button variant="secondary" onClick={probarCarga} isLoading={cargandoDemo} loadingText="Procesando…">
                Probar estado de carga (2 s)
              </Button>
            </div>
            <p
              className={[styles.estadoDemostracion, ultimaAccion ? styles.conContenido : ''].filter(Boolean).join(' ')}
              role="status"
            >
              {ultimaAccion}
            </p>
          </Card>
        </div>
      </div>
    </section>
  )
}
