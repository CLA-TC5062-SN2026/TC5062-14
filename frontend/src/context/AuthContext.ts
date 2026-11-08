import { createContext } from 'react'
import type { CredencialesLogin, Cuenta } from '../services/apiTypes'

export interface EstadoSesion {
  /** JWT de acceso. Se conserva solo en memoria (ver decision_stack_frontend.md, sección 5). */
  token: string | null
  cuenta: Cuenta | null
  autenticado: boolean
  iniciarSesion: (credenciales: CredencialesLogin) => Promise<Cuenta>
  /** Descarta la sesión local. El backend no implementa cierre de sesión en el servidor. */
  cerrarSesion: () => void
}

export const AuthContext = createContext<EstadoSesion | null>(null)
