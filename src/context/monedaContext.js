import { createContext } from 'react'

/**
 * Contexto de la moneda elegida y las tasas de cambio.
 * El valor lo entrega `MonedaProvider` y se lee con el hook `useMoneda`.
 *
 * @type {import('react').Context<import('./MonedaProvider').ValorMoneda | null>}
 */
export const MonedaContext = createContext(null)
