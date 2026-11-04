import { Navigate, Outlet } from 'react-router-dom'
import SinConexion from './SinConexion'
import { usePerfil } from '../hooks/usePerfil'

/**
 * Guardián de rutas: solo deja entrar a las páginas si el usuario ya creó su perfil.
 * - Mientras se consulta la API, no pinta nada (para no redirigir antes de tiempo).
 * - Si la API no responde, muestra `SinConexion` con el botón "Reintentar".
 * - Si no hay perfil, manda a `/bienvenida`.
 *
 * Se usa como ruta "padre" en `App.jsx`, por eso pinta `<Outlet />` (la ruta hija).
 *
 * @returns {JSX.Element | null}
 */
function RequierePerfil() {
  const { perfil, cargando, error, reintentar } = usePerfil()

  if (cargando) return null

  if (error) return <SinConexion onReintentar={reintentar} />

  if (!perfil) return <Navigate to="/bienvenida" replace />

  return <Outlet />
}

export default RequierePerfil
