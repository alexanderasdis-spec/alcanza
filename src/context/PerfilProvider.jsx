import { useEffect, useState } from 'react'
import { PerfilContext } from './perfilContext'
import * as perfilService from '../services/perfilService'

/**
 * Proveedor del perfil. Carga el perfil al abrir la app y lo comparte
 * con todos los componentes (por ejemplo, el saludo de Inicio).
 *
 * No habla directamente con localStorage ni con la API: todo pasa por `perfilService`,
 * así el día que llegue Laravel este archivo no cambia.
 *
 * @param {Object} props
 * @param {import('react').ReactNode} props.children - Componentes que tendrán acceso al perfil.
 * @returns {JSX.Element}
 */
export function PerfilProvider({ children }) {
  const [perfil, setPerfil] = useState(null)
  // Empieza en true: hasta no consultar el servicio no sabemos si hay perfil o no.
  const [cargando, setCargando] = useState(true)

  // Carga el perfil una sola vez, al montar la app.
  useEffect(() => {
    let activo = true
    perfilService.obtenerPerfil().then((guardado) => {
      // Si el componente se desmontó mientras esperaba, no se actualiza el estado.
      if (!activo) return
      setPerfil(guardado)
      setCargando(false)
    })
    return () => {
      activo = false
    }
  }, [])

  /**
   * Guarda el perfil en el servicio y actualiza el estado de la app.
   *
   * @param {import('../services/perfilService').Perfil} nuevoPerfil
   * @returns {Promise<void>}
   */
  const guardarPerfil = async (nuevoPerfil) => {
    const guardado = await perfilService.guardarPerfil(nuevoPerfil)
    setPerfil(guardado)
  }

  return (
    <PerfilContext.Provider value={{ perfil, cargando, guardarPerfil }}>{children}</PerfilContext.Provider>
  )
}
