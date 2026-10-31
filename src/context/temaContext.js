import { createContext } from 'react'

/**
 * Contexto del tema (claro u oscuro).
 * El valor lo entrega `TemaProvider` y se lee con el hook `useTema`.
 *
 * @type {import('react').Context<{ oscuro: boolean, alternarTema: () => void } | null>}
 */
export const TemaContext = createContext(null)
