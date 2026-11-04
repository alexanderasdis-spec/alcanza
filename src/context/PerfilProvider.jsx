import { useCallback, useEffect, useState } from 'react'
import { PerfilContext } from './perfilContext'
import * as perfilService from '../services/perfilService'

/**
 * Proveedor del perfil. Carga el perfil desde la API al abrir la app y lo comparte
 * con todos los componentes (por ejemplo, el saludo de Inicio).
 *
 * No habla directamente con la API: todo pasa por `perfilService`.
 * Si el backend no responde, guarda el error para que `RequierePerfil` muestre
 * un mensaje con el botón "Reintentar" en vez de dejar la pantalla en blanco.
 *
 * @param {Object} props
 * @param {import('react').ReactNode} props.children - Componentes que tendrán acceso al perfil.
 * @returns {JSX.Element}
 */
export function PerfilProvider({ children }) {
  const [perfil, setPerfil] = useState(null)
  // Empieza en true: hasta no consultar el servicio no sabemos si hay perfil o no.
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  // Cambiar este número vuelve a ejecutar la consulta (botón "Reintentar").
  const [intento, setIntento] = useState(0)

  useEffect(() => {
    let activo = true
    perfilService
      .obtenerPerfil()
      .then((guardado) => {
        // Si el componente se desmontó mientras esperaba, no se actualiza el estado.
        if (activo) setPerfil(guardado)
      })
      .catch((problema) => {
        if (activo) setError(problema)
      })
      .finally(() => {
        if (activo) setCargando(false)
      })
    return () => {
      activo = false
    }
  }, [intento])

  /** Vuelve a consultar el perfil (por ejemplo, después de encender el backend). */
  const reintentar = useCallback(() => {
    setCargando(true)
    setError(null)
    setIntento((n) => n + 1)
  }, [])

  /**
   * Guarda el perfil en la API y actualiza el estado de la app.
   * Si la API rechaza los datos, el error sube al formulario que llamó.
   *
   * @param {import('../services/perfilService').Perfil} nuevoPerfil
   * @returns {Promise<void>}
   */
  const guardarPerfil = async (nuevoPerfil) => {
    const guardado = await perfilService.guardarPerfil(nuevoPerfil)
    setPerfil(guardado)
  }

  return (
    <PerfilContext.Provider value={{ perfil, cargando, error, reintentar, guardarPerfil }}>
      {children}
    </PerfilContext.Provider>
  )
}
