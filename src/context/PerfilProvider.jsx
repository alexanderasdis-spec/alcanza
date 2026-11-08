import { useCallback, useEffect, useState } from 'react'
import { PerfilContext } from './perfilContext'
import { useAuth } from '../hooks/useAuth'
import * as perfilService from '../services/perfilService'

/**
 * Proveedor del perfil del usuario que inició sesión. Lo consulta a la API cuando hay sesión
 * y lo comparte con todos los componentes (por ejemplo, el saludo de Inicio).
 *
 * Cada respuesta guarda para qué usuario e intento se pidió: si el usuario cambia
 * (cerró sesión o entró otro), la respuesta vieja deja de valer y se consulta de nuevo.
 * Si el backend no responde, guarda el error para que `RequierePerfil` muestre "Reintentar".
 *
 * @param {Object} props
 * @param {import('react').ReactNode} props.children - Componentes que tendrán acceso al perfil.
 * @returns {JSX.Element}
 */
export function PerfilProvider({ children }) {
  const { usuario } = useAuth()
  const usuarioId = usuario?.id ?? null
  // Cambiar este número vuelve a ejecutar la consulta (botón "Reintentar").
  const [intento, setIntento] = useState(0)
  const [respuesta, setRespuesta] = useState({ usuarioId: null, intento: -1, perfil: null, error: null })

  useEffect(() => {
    if (usuarioId === null) return
    let activo = true
    perfilService
      .obtenerPerfil()
      .then((perfil) => activo && setRespuesta({ usuarioId, intento, perfil, error: null }))
      .catch((error) => activo && setRespuesta({ usuarioId, intento, perfil: null, error }))
    return () => {
      activo = false
    }
  }, [usuarioId, intento])

  const vigente = usuarioId !== null && respuesta.usuarioId === usuarioId && respuesta.intento === intento
  const cargando = usuarioId !== null && !vigente

  /** Vuelve a consultar el perfil (por ejemplo, después de encender el backend). */
  const reintentar = useCallback(() => setIntento((n) => n + 1), [])

  /**
   * Guarda el perfil en la API y actualiza el estado de la app.
   * Si la API rechaza los datos, el error sube al formulario que llamó.
   *
   * @param {import('../services/perfilService').Perfil} nuevoPerfil
   * @returns {Promise<void>}
   */
  const guardarPerfil = async (nuevoPerfil) => {
    const guardado = await perfilService.guardarPerfil(nuevoPerfil)
    setRespuesta({ usuarioId, intento, perfil: guardado, error: null })
  }

  /**
   * Sube una foto nueva y la muestra en toda la app.
   *
   * @param {Blob} imagen
   * @returns {Promise<void>}
   */
  const cambiarFoto = async (imagen) => {
    const guardado = await perfilService.subirFoto(imagen)
    setRespuesta({ usuarioId, intento, perfil: guardado, error: null })
  }

  /**
   * Quita la foto; la app vuelve a mostrar la inicial del nombre.
   *
   * @returns {Promise<void>}
   */
  const quitarFoto = async () => {
    const guardado = await perfilService.eliminarFoto()
    setRespuesta({ usuarioId, intento, perfil: guardado, error: null })
  }

  const valor = {
    perfil: vigente ? respuesta.perfil : null,
    cargando,
    error: vigente ? respuesta.error : null,
    reintentar,
    guardarPerfil,
    cambiarFoto,
    quitarFoto,
  }

  return <PerfilContext.Provider value={valor}>{children}</PerfilContext.Provider>
}
