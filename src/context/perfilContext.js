import { createContext } from 'react'

/**
 * Contexto del perfil del usuario.
 * El valor lo entrega `PerfilProvider` y se lee con el hook `usePerfil`.
 *
 * @type {import('react').Context<{
 *   perfil: import('../services/perfilService').Perfil | null,
 *   cargando: boolean,
 *   error: Error | null,
 *   reintentar: () => void,
 *   guardarPerfil: (perfil: import('../services/perfilService').Perfil) => Promise<void>
 * } | null>}
 */
export const PerfilContext = createContext(null)
