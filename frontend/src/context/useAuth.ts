import { useContext } from 'react'
import { AuthContext, type EstadoSesion } from './AuthContext'

export function useAuth(): EstadoSesion {
  const contexto = useContext(AuthContext)
  if (!contexto) {
    throw new Error('useAuth debe usarse dentro de <AuthProvider>.')
  }
  return contexto
}
