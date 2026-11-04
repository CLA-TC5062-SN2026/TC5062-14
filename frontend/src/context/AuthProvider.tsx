import { useCallback, useMemo, useState, type ReactNode } from 'react'
import type { CredencialesLogin, Cuenta } from '../services/apiTypes'
import * as authService from '../services/authService'
import { AuthContext, type EstadoSesion } from './AuthContext'

interface Sesion {
  token: string
  cuenta: Cuenta
}

/**
 * Estado de sesión con useState + Context API.
 * Preparado para JWT; las pantallas que lo usan (inicio de sesión, Navbar) llegan en la Parte 2.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [sesion, setSesion] = useState<Sesion | null>(null)

  const iniciarSesion = useCallback(async (credenciales: CredencialesLogin) => {
    const respuesta = await authService.iniciarSesion(credenciales)
    setSesion({ token: respuesta.tokenAcceso, cuenta: respuesta.cuenta })
    return respuesta.cuenta
  }, [])

  const cerrarSesion = useCallback(() => setSesion(null), [])

  const valor = useMemo<EstadoSesion>(
    () => ({
      token: sesion?.token ?? null,
      cuenta: sesion?.cuenta ?? null,
      autenticado: sesion !== null,
      iniciarSesion,
      cerrarSesion,
    }),
    [sesion, iniciarSesion, cerrarSesion],
  )

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>
}
