import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

/**
 * Guardián de las páginas de ingresar, registrarse y olvidé mi contraseña:
 * si ya hay sesión iniciada, no tiene sentido mostrarlas y manda a Inicio.
 *
 * @returns {JSX.Element | null}
 */
function SoloInvitados() {
  const { usuario, cargando } = useAuth()

  if (cargando) return null
  if (usuario) return <Navigate to="/" replace />

  return <Outlet />
}

export default SoloInvitados
