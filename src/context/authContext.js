import { createContext } from 'react'

/**
 * Contexto de la sesión del usuario.
 * El valor lo entrega `AuthProvider` y se lee con el hook `useAuth`.
 *
 * @type {import('react').Context<import('./AuthProvider').ValorAuth | null>}
 */
export const AuthContext = createContext(null)
