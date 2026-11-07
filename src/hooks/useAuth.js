import { useContext } from 'react'
import { AuthContext } from '../context/authContext'

/**
 * Hook personalizado para leer la sesión y para iniciar o cerrar sesión desde cualquier componente.
 *
 * @returns {import('../context/AuthProvider').ValorAuth}
 * @throws {Error} Si se usa fuera de `AuthProvider`.
 *
 * @example
 * const { usuario, cerrarSesion } = useAuth()
 * return <button onClick={cerrarSesion}>Salir, {usuario.nombre}</button>
 */
export function useAuth() {
  const contexto = useContext(AuthContext)
  if (!contexto) {
    throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  }
  return contexto
}
