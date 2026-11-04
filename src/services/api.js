import axios from 'axios'

/**
 * Cliente de Axios para la API propia de Alcanza (Laravel).
 *
 * La dirección sale de la variable `VITE_API_URL` del archivo `.env`
 * (por ejemplo `http://localhost/api`). Si no está definida, se usa esa misma por defecto.
 * Vite solo expone al navegador las variables que empiezan por `VITE_`.
 *
 * @module services/api
 */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost/api',
  timeout: 10000,
  // Pide siempre JSON: así Laravel responde los errores (422, 404) en JSON y no en HTML.
  headers: { Accept: 'application/json' },
})

/**
 * Convierte los errores de validación de Laravel (respuesta 422) a un objeto
 * `{ campo: 'primer mensaje' }`, con los nombres de campo que usa el frontend.
 *
 * @param {unknown} error - Error lanzado por Axios.
 * @param {Record<string, string>} [nombres={}] - Traducción de nombres de la API a los del frontend,
 *   por ejemplo `{ ahorro_mensual: 'ahorroMensual' }`.
 * @returns {Record<string, string> | null} Los mensajes por campo, o `null` si no fue un error de validación.
 *
 * @example
 * erroresDeValidacion(error, { ahorro_mensual: 'ahorroMensual' })
 * // { ahorroMensual: 'The ahorro mensual field must be greater than 0.' }
 */
export function erroresDeValidacion(error, nombres = {}) {
  if (!axios.isAxiosError(error) || error.response?.status !== 422) return null
  const errores = error.response.data?.errors ?? {}
  return Object.fromEntries(
    Object.entries(errores).map(([campo, mensajes]) => [nombres[campo] ?? campo, mensajes[0]]),
  )
}
