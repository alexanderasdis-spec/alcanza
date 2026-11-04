import { createContext } from 'react'

/**
 * Contexto de las metas de ahorro del usuario.
 * El valor lo entrega `MetasProvider` y se lee con el hook `useMetas`.
 *
 * @type {import('react').Context<import('./MetasProvider').ValorMetas | null>}
 */
export const MetasContext = createContext(null)
