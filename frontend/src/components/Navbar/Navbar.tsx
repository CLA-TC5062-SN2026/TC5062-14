import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'
import type { Rol } from '../../services/apiTypes'
import { ETIQUETAS_ROL } from '../../utils/catalogos'
import { Button } from '../Button'
import styles from './Navbar.module.css'

export interface NavbarLink {
  label: string
  href: string
  /** Marca el enlace de la página actual (`aria-current="page"`). */
  current?: boolean
}

export interface NavbarProps {
  isAuthenticated: boolean
  /** Nombre que se muestra cuando hay sesión. */
  userName?: string
  /** Solo los roles del backend: cliente, trabajador, organizacion, administrador. */
  userRole?: Rol
  /** Lo decide el componente padre (p. ej. `cerrarSesion` del AuthContext). Navbar no toca tokens ni la API. */
  onLogout: () => void
  /** Enlaces de navegación; el padre los elige según la sesión y el rol. */
  links?: NavbarLink[]
  /** Destino del acceso al inicio de sesión cuando no hay sesión. */
  loginHref?: string
  /** Destino del logotipo. */
  homeHref?: string
}

export function Navbar({
  isAuthenticated,
  userName,
  userRole,
  onLogout,
  links = [],
  loginHref = '#iniciar-sesion',
  homeHref = '#inicio',
}: NavbarProps) {
  const [menuAbierto, setMenuAbierto] = useState(false)
  const idMenu = `menu-${useId()}`
  const botonMenuRef = useRef<HTMLButtonElement>(null)
  const enlaceLoginRef = useRef<HTMLAnchorElement>(null)
  const cerroSesionRef = useRef(false)

  // Al cerrar sesión desaparece el botón que tenía el foco; se lleva al acceso de inicio de sesión
  // para que el usuario de teclado o lector de pantalla no quede al inicio del documento.
  useEffect(() => {
    if (!isAuthenticated && cerroSesionRef.current) {
      cerroSesionRef.current = false
      enlaceLoginRef.current?.focus()
    }
  }, [isAuthenticated])

  const cerrarMenu = (devolverFoco: boolean) => {
    setMenuAbierto(false)
    if (devolverFoco) botonMenuRef.current?.focus()
  }

  const alPresionarTecla = (evento: KeyboardEvent<HTMLElement>) => {
    if (evento.key === 'Escape' && menuAbierto) {
      evento.stopPropagation()
      cerrarMenu(true)
    }
  }

  const alCerrarSesion = () => {
    // El menú se deja abierto a propósito: en móvil, el enlace "Iniciar sesión" vive dentro
    // del menú y no podría recibir el foco si este se ocultara (display: none).
    cerroSesionRef.current = true
    onLogout()
  }

  const etiquetaRol = userRole ? ETIQUETAS_ROL[userRole] : undefined

  return (
    <header className={styles.encabezado}>
      <nav className={styles.barra} aria-label="Principal" onKeyDown={alPresionarTecla}>
        <a href={homeHref} className={styles.marca}>
          UnCalificado
        </a>

        <button
          ref={botonMenuRef}
          type="button"
          className={styles.botonMenu}
          aria-expanded={menuAbierto}
          aria-controls={idMenu}
          onClick={() => setMenuAbierto((abierto) => !abierto)}
        >
          {/*
            El nombre accesible se mantiene ("Menú"): el estado lo comunica aria-expanded.
            Cambiar también el texto producía anuncios redundantes ("Cerrar menú, expandido").
            Visualmente, el ícono pasa de tres líneas a una X.
          */}
          <span
            className={[styles.iconoMenu, menuAbierto ? styles.iconoMenuAbierto : ''].filter(Boolean).join(' ')}
            aria-hidden="true"
          >
            <span />
            <span />
            <span />
          </span>
          Menú
        </button>

        <div id={idMenu} className={[styles.menu, menuAbierto ? styles.menuAbierto : ''].filter(Boolean).join(' ')}>
          {links.length > 0 && (
            <ul className={styles.enlaces}>
              {links.map((enlace) => (
                <li key={`${enlace.href}|${enlace.label}`}>
                  <a
                    href={enlace.href}
                    className={styles.enlace}
                    aria-current={enlace.current ? 'page' : undefined}
                    onClick={() => cerrarMenu(false)}
                  >
                    {enlace.label}
                  </a>
                </li>
              ))}
            </ul>
          )}

          <div className={styles.sesion}>
            {isAuthenticated ? (
              <>
                <p className={styles.usuario}>
                  <span className={styles.nombre}>{userName ?? 'Usuario'}</span>
                  {etiquetaRol && (
                    <span className={styles.rol}>
                      <span className="visualmente-oculto">Rol: </span>
                      {etiquetaRol}
                    </span>
                  )}
                </p>
                <Button variant="secondary" onClick={alCerrarSesion}>
                  Cerrar sesión
                </Button>
              </>
            ) : (
              <a ref={enlaceLoginRef} href={loginHref} className={styles.accesoLogin} onClick={() => cerrarMenu(false)}>
                Iniciar sesión
              </a>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}
