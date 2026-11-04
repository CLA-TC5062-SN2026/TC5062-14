import { version as versionReact } from 'react'
import { useAuth } from '../context/useAuth'
import { API_URL } from '../services/httpClient'
import styles from './InicioPage.module.css'

/**
 * Pantalla inicial del scaffolding (Parte 1).
 * Solo confirma que el frontend arranca; no consulta al backend, de modo que se muestra
 * igual con o sin el servidor Flask en ejecución.
 */
export function InicioPage() {
  const { autenticado, cuenta } = useAuth()

  return (
    <div className={styles.pagina}>
      <header className={styles.encabezado}>
        <div className={styles.contenedor}>
          <p className={styles.marca}>UnCalificado</p>
          <p className={styles.etiquetaEntorno}>Entorno de desarrollo</p>
        </div>
      </header>

      <main className={styles.contenedor}>
        <section className={styles.presentacion} aria-labelledby="titulo-principal">
          <h1 id="titulo-principal" className={styles.titulo}>
            UnCalificado
          </h1>
          <p className={styles.descripcion}>
            Plataforma que conecta a clientes que necesitan un trabajo de oficio en su domicilio con trabajadores
            independientes y organizaciones de contratistas.
          </p>
        </section>

        <section className={styles.panel} aria-labelledby="titulo-estado">
          <h2 id="titulo-estado" className={styles.subtitulo}>
            Estado del frontend
          </h2>

          <p className={styles.indicador}>
            <span className={styles.indicadorIcono} aria-hidden="true">
              ✓
            </span>
            El frontend está en funcionamiento.
          </p>

          <dl className={styles.datos}>
            <div className={styles.dato}>
              <dt>Tecnología</dt>
              <dd>React {versionReact} · Vite · TypeScript</dd>
            </div>
            <div className={styles.dato}>
              <dt>Modo</dt>
              <dd>{import.meta.env.MODE}</dd>
            </div>
            <div className={styles.dato}>
              <dt>Prefijo de la API</dt>
              <dd>
                <code className={styles.codigo}>{API_URL}</code>
              </dd>
            </div>
            <div className={styles.dato}>
              <dt>Sesión</dt>
              <dd>{autenticado && cuenta ? `Iniciada como ${cuenta.nombre}` : 'Sin sesión iniciada'}</dd>
            </div>
          </dl>

          <p className={styles.nota}>
            Esta pantalla no se comunica con el backend. En desarrollo, las peticiones a{' '}
            <code className={styles.codigo}>{API_URL}</code> se reenvían al servidor Flask mediante el proxy de Vite.
          </p>
        </section>

        <section className={styles.panel} aria-labelledby="titulo-siguientes">
          <h2 id="titulo-siguientes" className={styles.subtitulo}>
            Siguientes pasos
          </h2>
          <ul className={styles.lista}>
            <li>Parte 2: componentes reutilizables Button, InputField, Card y Navbar.</li>
            <li>Parte 3: revisión crítica del código generado con IA y evaluación de accesibilidad WCAG 2.1.</li>
          </ul>
        </section>
      </main>

      <footer className={styles.pie}>
        <div className={styles.contenedor}>
          <p>TC5062 Ingeniería de Software · S07-S08-A1 · Parte 1: scaffolding</p>
        </div>
      </footer>
    </div>
  )
}
