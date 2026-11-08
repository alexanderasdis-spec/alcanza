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
 * @property {(antojo: Parameters<typeof metasService.crearMeta>[0]) => Promise<import('../services/metasService').Meta>} crear
 *   Convierte un antojo en meta (la API la guarda en el perfil del usuario).
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

  // La respuesta solo vale si es del perfil actual: al cerrar sesión (perfil null) no se muestran metas viejas.
  const vigente = perfilId !== null && respuesta.perfilId === perfilId && respuesta.intento === intento
  const cargando = perfilId !== null && !vigente

  const reintentar = useCallback(() => setIntento((n) => n + 1), [])

  /** Aplica un cambio a la lista de metas guardada. */
  const cambiarMetas = (cambio) => setRespuesta((actual) => ({ ...actual, metas: cambio(actual.metas) }))

  const crear = async (antojo) => {
    const meta = await metasService.crearMeta(antojo)
    cambiarMetas((metas) => [meta, ...metas])
    return meta
  }

  const abonar = async (id, monto) => {
    const anterior = respuesta.metas.find((meta) => meta.id === id)
    const { abono, meta: respuestaMeta } = await metasService.registrarAbono(id, { monto })
    // La API no devuelve la lista de abonos al abonar: se suma el nuevo a los que ya había (para el gráfico).
    const meta = { ...respuestaMeta, abonos: respuestaMeta.abonos ?? [...(anterior?.abonos ?? []), abono] }
    cambiarMetas((metas) => metas.map((actual) => (actual.id === id ? meta : actual)))
    return { meta, recienCumplida: anterior?.estado !== 'cumplida' && meta.estado === 'cumplida' }
  }

  const eliminar = async (id) => {
    await metasService.eliminarMeta(id)
    cambiarMetas((metas) => metas.filter((meta) => meta.id !== id))
  }

  const valor = {
    metas: vigente ? respuesta.metas : [],
    cargando,
    error: vigente ? respuesta.error : null,
    reintentar,
    crear,
    abonar,
    eliminar,
  }

  return <MetasContext.Provider value={valor}>{children}</MetasContext.Provider>
}
