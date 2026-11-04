import { useCallback, useEffect, useState } from 'react'
import { MetasContext } from './metasContext'
import { usePerfil } from '../hooks/usePerfil'
import * as metasService from '../services/metasService'

/**
 * Lo que comparte el contexto de metas.
 *
 * @typedef {Object} ValorMetas
 * @property {import('../services/metasService').Meta[]} metas - Metas del usuario, la más reciente primero.
 * @property {boolean} cargando - `true` mientras se consultan las metas.
 * @property {Error | null} error - Error si la API no respondió.
 * @property {() => void} reintentar - Vuelve a consultar las metas.
 * @property {(antojo: Omit<Parameters<typeof metasService.crearMeta>[0], 'perfilId'>) => Promise<import('../services/metasService').Meta>} crear
 *   Convierte un antojo en meta (el perfil se agrega solo).
 * @property {(id: number, monto: number) => Promise<{ meta: import('../services/metasService').Meta, recienCumplida: boolean }>} abonar
 *   Registra un abono. `recienCumplida` es `true` si con ese abono la meta llegó al 100 %.
 * @property {(id: number) => Promise<void>} eliminar - Elimina una meta y sus abonos.
 */

/**
 * Proveedor de las metas. Las consulta a la API cuando hay perfil y las comparte con
 * Inicio (resumen), el detalle de un antojo (para saber si ya es meta) y Mis metas.
 *
 * Después de crear, abonar o eliminar, actualiza la lista localmente con lo que
 * responde la API, sin volver a pedir todas las metas.
 *
 * @param {Object} props
 * @param {import('react').ReactNode} props.children
 * @returns {JSX.Element}
 */
export function MetasProvider({ children }) {
  const { perfil } = usePerfil()
  const perfilId = perfil?.id ?? null
  // Cambiar este número vuelve a consultar (botón "Reintentar").
  const [intento, setIntento] = useState(0)
  // La respuesta guarda para qué perfil e intento se pidió: si no coincide con los actuales, sigue cargando.
  const [respuesta, setRespuesta] = useState({ perfilId: null, intento: -1, metas: [], error: null })

  useEffect(() => {
    if (perfilId === null) return
    let activo = true
    metasService
      .listarMetas()
      .then((metas) => activo && setRespuesta({ perfilId, intento, metas, error: null }))
      .catch((error) => activo && setRespuesta({ perfilId, intento, metas: [], error }))
    return () => {
      activo = false
    }
  }, [perfilId, intento])

  const cargando = perfilId !== null && (respuesta.perfilId !== perfilId || respuesta.intento !== intento)

  const reintentar = useCallback(() => setIntento((n) => n + 1), [])

  /** Aplica un cambio a la lista de metas guardada. */
  const cambiarMetas = (cambio) => setRespuesta((actual) => ({ ...actual, metas: cambio(actual.metas) }))

  const crear = async (antojo) => {
    const meta = await metasService.crearMeta({ ...antojo, perfilId })
    cambiarMetas((metas) => [meta, ...metas])
    return meta
  }

  const abonar = async (id, monto) => {
    const anterior = respuesta.metas.find((meta) => meta.id === id)
    const { meta } = await metasService.registrarAbono(id, { monto })
    cambiarMetas((metas) => metas.map((actual) => (actual.id === id ? meta : actual)))
    return { meta, recienCumplida: anterior?.estado !== 'cumplida' && meta.estado === 'cumplida' }
  }

  const eliminar = async (id) => {
    await metasService.eliminarMeta(id)
    cambiarMetas((metas) => metas.filter((meta) => meta.id !== id))
  }

  const valor = {
    metas: cargando ? [] : respuesta.metas,
    cargando,
    error: cargando ? null : respuesta.error,
    reintentar,
    crear,
    abonar,
    eliminar,
  }

  return <MetasContext.Provider value={valor}>{children}</MetasContext.Provider>
}
