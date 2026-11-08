import { useState } from 'react'
import { Card } from '../../components/Card'
import { Navbar, type NavbarLink } from '../../components/Navbar'
import type { Municipio, Oficio, Rol } from '../../services/apiTypes'
import {
  ETIQUETAS_ESTADO_SOLICITUD,
  ETIQUETAS_MUNICIPIO,
  ETIQUETAS_OFICIO,
} from '../../utils/catalogos'
import { formatearFecha } from '../../utils/formato'
import { PASOS, PUNTOS_CLAVE } from './contenidoProducto'
import styles from './DemoComponentesPage.module.css'
import { SOLICITUDES_FICTICIAS, USUARIO_FICTICIO } from './datosFicticios'
import { DemostracionComponentes } from './DemostracionComponentes'
import { FormularioLoginDemo } from './FormularioLoginDemo'

// Catálogo del piloto (RD-18), en el orden de OFICIOS y MUNICIPIOS de backend/app/validation.py.
const OFICIOS = Object.keys(ETIQUETAS_OFICIO) as Oficio[]
const MUNICIPIOS = Object.keys(ETIQUETAS_MUNICIPIO) as Municipio[]

/** Enlaces de la barra según la sesión simulada. Todos apuntan a secciones existentes de esta página. */
function enlacesPara(sesionIniciada: boolean, rol: Rol): NavbarLink[] {
  const enlaces: NavbarLink[] = [
    { label: 'Cómo funcionará', href: '#como-funciona' },
    { label: 'Oficios y zona', href: '#oficios-zona' },
  ]
  if (!sesionIniciada) {
    return [...enlaces, { label: 'Ejemplos', href: '#solicitudes' }]
  }
  // Coincide con los permisos de GET /api/solicitudes (cliente, trabajador, organizacion).
  // El administrador no lista solicitudes en el backend, así que no recibe ese enlace.
  if (rol === 'cliente') enlaces.push({ label: 'Mis solicitudes', href: '#solicitudes' })
  if (rol === 'trabajador' || rol === 'organizacion') {
    enlaces.push({ label: 'Solicitudes asignadas', href: '#solicitudes' })
  }
  return enlaces
}

/**
 * Pantalla principal de la vista previa de UnCalificado (nombre técnico conservado por trazabilidad
 * con la documentación de S07-S08-A1).
 *
 * Integra Button, InputField, Card y Navbar en una página orientada al producto. El estado de sesión
 * es local y simulado: no usa el AuthContext, no crea tokens y no llama a la API.
 */
export function DemoComponentesPage() {
  const [sesionSimulada, setSesionSimulada] = useState(false)
  const [rolSimulado, setRolSimulado] = useState<Rol>(USUARIO_FICTICIO.rolInicial)

  return (
    <div className={styles.pagina}>
      <a href="#contenido" className={styles.saltarContenido}>
        Saltar al contenido principal
      </a>

      <Navbar
        isAuthenticated={sesionSimulada}
        userName={USUARIO_FICTICIO.nombre}
        userRole={rolSimulado}
        onLogout={() => setSesionSimulada(false)}
        links={enlacesPara(sesionSimulada, rolSimulado)}
        loginHref="#iniciar-sesion"
        homeHref="#inicio"
      />

      <main id="contenido" tabIndex={-1} className={styles.contenido}>
        <p className={styles.avisoVistaPrevia} role="note">
          <span className={styles.contenedor}>
            <strong>Vista previa del MVP.</strong> Los datos son de ejemplo y no hay autenticación real ni conexión
            con el servidor.
          </span>
        </p>

        {/* ---------- Encabezado principal (SRS §1.2) ---------- */}
        <section id="inicio" aria-labelledby="titulo-principal" className={styles.hero}>
          <div className={`${styles.contenedor} ${styles.heroRejilla}`}>
            <div className={styles.heroMensaje}>
              <p className={styles.heroEtiqueta}>Piloto en seis municipios de Jalisco</p>
              <h1 id="titulo-principal" className={styles.titulo}>
                Trabajos de oficio en tu domicilio, con proveedores compatibles y decisiones en tus manos
              </h1>
              <p className={styles.heroDescripcion}>
                UnCalificado conectará a clientes que necesitan un trabajo de oficio en su domicilio con trabajadores
                independientes y organizaciones de contratistas. Un agente de IA, que siempre se identificará como
                asistente automático, te ayudará a describir lo que necesitas. Las decisiones que comprometen tu
                tiempo, tu dinero o tus datos siempre serán tuyas.
              </p>
              <ul className={styles.heroPuntos}>
                {PUNTOS_CLAVE.map((punto) => (
                  <li key={punto.texto}>{punto.texto}</li>
                ))}
              </ul>
              <div className={styles.heroEnlaces}>
                <a href="#como-funciona" className={styles.enlacePrincipal}>
                  Conoce cómo funcionará
                </a>
                <a href="#oficios-zona" className={styles.enlaceSecundario}>
                  Ver oficios y zona del piloto
                </a>
              </div>
            </div>

            <div className={styles.heroLogin}>
              <FormularioLoginDemo />
            </div>
          </div>
        </section>

        {/* ---------- Cómo funcionará (EP-02 a EP-05) ---------- */}
        <section id="como-funciona" aria-labelledby="titulo-como-funciona" className={styles.seccionProducto}>
          <div className={styles.contenedor}>
            <div className={styles.encabezadoSeccion}>
              <h2 id="titulo-como-funciona" className={styles.subtitulo}>
                Cómo funcionará UnCalificado
              </h2>
              <p className={styles.textoSecundario}>
                El MVP está en desarrollo. Así se organizará el servicio, de la primera conversación al cierre del
                trabajo.
              </p>
            </div>
            {/* role="list": algunos lectores de pantalla ignoran la semántica de lista con list-style: none. */}
            <ol className={styles.pasos} role="list">
              {PASOS.map((paso, indice) => (
                <li key={paso.titulo} className={styles.paso}>
                  <Card
                    title={
                      <>
                        <span className={styles.numeroPaso} aria-hidden="true">
                          {indice + 1}
                        </span>
                        {paso.titulo}
                      </>
                    }
                    headingLevel={3}
                    className={styles.tarjetaPaso}
                  >
                    <p>{paso.descripcion}</p>
                  </Card>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ---------- Oficios y zona del piloto (RD-18) ---------- */}
        <section id="oficios-zona" aria-labelledby="titulo-oficios-zona" className={styles.seccionAlterna}>
          <div className={styles.contenedor}>
            <div className={styles.encabezadoSeccion}>
              <h2 id="titulo-oficios-zona" className={styles.subtitulo}>
                Oficios y zona del piloto
              </h2>
              <p className={styles.textoSecundario}>
                El piloto atenderá domicilios en seis municipios de Jalisco y los diez oficios del catálogo inicial.
              </p>
            </div>
            <div className={styles.catalogo}>
              <Card title={`${OFICIOS.length} oficios`} headingLevel={3}>
                <ul className={styles.etiquetas} aria-label="Oficios del catálogo">
                  {OFICIOS.map((oficio) => (
                    <li key={oficio} className={styles.etiqueta}>
                      {ETIQUETAS_OFICIO[oficio]}
                    </li>
                  ))}
                </ul>
              </Card>
              <Card title={`${MUNICIPIOS.length} municipios de Jalisco`} headingLevel={3}>
                <ul className={styles.etiquetas} aria-label="Municipios del piloto">
                  {MUNICIPIOS.map((municipio) => (
                    <li key={municipio} className={styles.etiqueta}>
                      {ETIQUETAS_MUNICIPIO[municipio]}
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>
        </section>

        {/* ---------- Solicitudes de ejemplo (RF-16, esquema SolicitudResumen) ---------- */}
        <section id="solicitudes" aria-labelledby="titulo-solicitudes" className={styles.seccionProducto}>
          <div className={styles.contenedor}>
            <div className={styles.encabezadoSeccion}>
              <h2 id="titulo-solicitudes" className={styles.subtitulo}>
                Así se verán tus solicitudes{' '}
                <span className={styles.etiquetaEjemplo}>Ejemplos</span>
              </h2>
              <p className={styles.textoSecundario}>
                Datos de ejemplo: no son solicitudes reales. El domicilio exacto no aparece; solo la colonia y el
                municipio.
              </p>
            </div>

            <ul className={styles.rejilla}>
              {SOLICITUDES_FICTICIAS.map((solicitud) => (
                <li key={solicitud.id}>
                  <Card
                    title={ETIQUETAS_OFICIO[solicitud.oficio]}
                    headingLevel={3}
                    className={styles.tarjetaSolicitud}
                    footer={
                      <>
                        <span>
                          Actualizada el{' '}
                          <time dateTime={solicitud.actualizadaEn}>{formatearFecha(solicitud.actualizadaEn)}</time>
                        </span>
                        <span className={styles.etiquetaEjemplo}>Ejemplo</span>
                      </>
                    }
                  >
                    <p>{solicitud.resultadoEsperado}</p>
                    <dl className={styles.datosSolicitud}>
                      <div>
                        <dt>Estado</dt>
                        <dd>
                          <span className={styles.estado} data-estado={solicitud.estado}>
                            {ETIQUETAS_ESTADO_SOLICITUD[solicitud.estado]}
                          </span>
                        </dd>
                      </div>
                      <div>
                        <dt>Zona</dt>
                        <dd>
                          {solicitud.zona.colonia}, {ETIQUETAS_MUNICIPIO[solicitud.zona.municipio]}
                        </dd>
                      </div>
                    </dl>
                  </Card>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---------- Sección técnica de la actividad ---------- */}
        <DemostracionComponentes
          sesionSimulada={sesionSimulada}
          rolSimulado={rolSimulado}
          nombreFicticio={USUARIO_FICTICIO.nombre}
          onCambiarSesion={setSesionSimulada}
          onCambiarRol={setRolSimulado}
        />
      </main>

      <footer className={styles.pie}>
        <div className={styles.contenedor}>
          <p>
            <strong>UnCalificado</strong> · Vista previa académica (TC5062 Ingeniería de Software, S07-S08-A1). Datos de
            ejemplo, sin autenticación real ni conexión con el servidor.
          </p>
        </div>
      </footer>
    </div>
  )
}
