import { useContext } from 'react'
import { PerfilContext } from '../context/perfilContext'

/**
 * Hook personalizado para leer y guardar el perfil desde cualquier componente.
 *
 * @returns {{
 *   perfil: import('../services/perfilService').Perfil | null,
 *   cargando: boolean,
 *   guardarPerfil: (perfil: import('../services/perfilService').Perfil) => Promise<void>
 * }} `perfil` es `null` si el usuario aún no lo ha creado; `cargando` es `true` mientras se consulta.
 * @throws {Error} Si se usa fuera de `PerfilProvider`.
 *
 * @example
 * const { perfil } = usePerfil()
 * return <h1>¡Hola, {perfil.nombre}!</h1>
 */
export function usePerfil() {
  const contexto = useContext(PerfilContext)
  if (!contexto) {
    throw new Error('usePerfil debe usarse dentro de <PerfilProvider>')
  }
  return contexto
}
