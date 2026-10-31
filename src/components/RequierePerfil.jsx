import { Navigate, Outlet } from 'react-router-dom'
import { usePerfil } from '../hooks/usePerfil'

/**
 * Guardián de rutas: solo deja entrar a las páginas si el usuario ya creó su perfil.
 * Si no lo tiene, lo manda a `/bienvenida`.
 *
 * Se usa como ruta "padre" en `App.jsx`, por eso pinta `<Outlet />` (la ruta hija).
 *
 * @returns {JSX.Element | null}
 */
function RequierePerfil() {
  const { perfil, cargando } = usePerfil()

  // Mientras se consulta el perfil no se pinta nada, para no redirigir antes de tiempo.
  if (cargando) return null

  if (!perfil) return <Navigate to="/bienvenida" replace />

  return <Outlet />
}

export default RequierePerfil
