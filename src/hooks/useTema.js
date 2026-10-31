import { useContext } from 'react'
import { TemaContext } from '../context/temaContext'

/**
 * Hook personalizado para leer y cambiar el tema desde cualquier componente.
 *
 * @returns {{ oscuro: boolean, alternarTema: () => void }}
 *   `oscuro` indica si el modo oscuro está activo y `alternarTema` lo cambia.
 * @throws {Error} Si se usa fuera de `TemaProvider`.
 *
 * @example
 * const { oscuro, alternarTema } = useTema()
 */
export function useTema() {
  const contexto = useContext(TemaContext)
  if (!contexto) {
    throw new Error('useTema debe usarse dentro de <TemaProvider>')
  }
  return contexto
}
