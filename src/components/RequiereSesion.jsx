import { Navigate, Outlet, useLocation } from 'react-router-dom'
import SinConexion from './SinConexion'
import { useAuth } from '../hooks/useAuth'

/**
 * Guardián de rutas: solo deja entrar si hay una sesión iniciada.
 * - Mientras se comprueba el token guardado, no pinta nada.
 * - Si el servidor no responde, muestra `SinConexion` con "Reintentar".
 * - Si no hay sesión, manda a `/ingresar` y recuerda a qué página quería ir
 *   (en `state.desde`), para volver allí después de iniciar sesión.
 *
 * @returns {JSX.Element | null}
 */
function RequiereSesion() {
  const { usuario, cargando, error, reintentar } = useAuth()
  const location = useLocation()

  if (cargando) return null
  if (error) return <SinConexion onReintentar={reintentar} />
  if (!usuario) return <Navigate to="/ingresar" replace state={{ desde: location.pathname + location.search }} />

  return <Outlet />
}

export default RequiereSesion
