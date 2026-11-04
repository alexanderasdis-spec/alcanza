import { useContext, useMemo } from 'react'
import { MetasContext } from '../context/metasContext'

/**
 * Hook personalizado para leer y modificar las metas desde cualquier componente.
 *
 * @returns {import('../context/MetasProvider').ValorMetas}
 * @throws {Error} Si se usa fuera de `MetasProvider`.
 *
 * @example
 * const { metas, abonar } = useMetas()
 * const { recienCumplida } = await abonar(meta.id, 50000)
 */
export function useMetas() {
  const contexto = useContext(MetasContext)
  if (!contexto) {
    throw new Error('useMetas debe usarse dentro de <MetasProvider>')
  }
  return contexto
}

/**
 * Hook que resume un grupo de metas: cuántas siguen activas, cuántas se cumplieron
 * y cuánto se ha ahorrado en total. Se recalcula solo cuando cambian las metas.
 *
 * @param {import('../services/metasService').Meta[]} metas
 * @returns {{ activas: number, cumplidas: number, ahorrado: number }} `ahorrado` va en pesos (COP).
 *
 * @example
 * const { activas, ahorrado } = useResumenMetas(metas)
 */
export function useResumenMetas(metas) {
  return useMemo(
    () => ({
      activas: metas.filter((meta) => meta.estado === 'en_progreso').length,
      cumplidas: metas.filter((meta) => meta.estado === 'cumplida').length,
      ahorrado: metas.reduce((total, meta) => total + meta.ahorrado, 0),
    }),
    [metas],
  )
}
