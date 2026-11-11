import axios from 'axios'

/**
 * Cliente de Axios para la API propia de Alcanza (Laravel).
 *
 * La dirección sale de la variable `VITE_API_URL` del archivo `.env`
 * (por ejemplo `http://localhost/api`). Si no está definida, se usa esa misma por defecto.
 * Vite solo expone al navegador las variables que empiezan por `VITE_`.
 *
 * Además maneja el token de la sesión: lo agrega a cada petición y lo borra si la API
 * responde 401 (token vencido o cerrado en otro lado).
 *
 * @module services/api
 */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost/api',
  timeout: 10000,
  // Pide siempre JSON: así Laravel responde los errores (422, 404) en JSON y no en HTML.
  headers: { Accept: 'application/json' },
})

/** Clave del token de sesión en localStorage. */
const CLAVE_TOKEN = 'alcanza-token'

/** Evento que se lanza cuando la API rechaza el token, para que `AuthProvider` cierre la sesión. */
export const EVENTO_SESION_VENCIDA = 'alcanza:sesion-vencida'

/**
 * Lee el token de la sesión guardado en el navegador.
 * Se guarda en localStorage para que la sesión siga abierta al recargar la página.
 *
 * @returns {string | null}
 */
export function obtenerToken() {
  try {
    return localStorage.getItem(CLAVE_TOKEN)
  } catch {
    return null
  }
}

/**
 * Guarda el token de la sesión (o lo borra si se pasa `null`).
 *
 * @param {string | null} token
 * @returns {void}
 */
export function guardarToken(token) {
  try {
    if (token) localStorage.setItem(CLAVE_TOKEN, token)
    else localStorage.removeItem(CLAVE_TOKEN)
  } catch {
    // Si el navegador bloquea localStorage, la sesión dura solo mientras la página esté abierta.
  }
}

// Interceptor de salida: antes de cada petición agrega "Authorization: Bearer <token>".
api.interceptors.request.use((config) => {
  const token = obtenerToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Interceptor de llegada: si la API dice 401 con un token guardado, la sesión ya no sirve.
api.interceptors.response.use(
  (respuesta) => respuesta,
  (error) => {
    if (error.response?.status === 401 && obtenerToken()) {
      guardarToken(null)
      window.dispatchEvent(new Event(EVENTO_SESION_VENCIDA))
    }
    return Promise.reject(error)
  },
)

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
 * // { ahorroMensual: 'El ahorro debe ser mayor que cero.' }
 */
export function erroresDeValidacion(error, nombres = {}) {
  if (!axios.isAxiosError(error) || error.response?.status !== 422) return null
  const errores = error.response.data?.errors ?? {}
  return Object.fromEntries(
    Object.entries(errores).map(([campo, mensajes]) => [nombres[campo] ?? campo, mensajes[0]]),
  )
}

/**
 * Indica si un error de Axios es porque se superó el límite de intentos (respuesta 429).
 *
 * @param {unknown} error
 * @returns {boolean}
 */
export function esDemasiadosIntentos(error) {
  return axios.isAxiosError(error) && error.response?.status === 429
}

/** Mensaje cuando la API frena por exceso de peticiones (429). */
export const MENSAJE_DEMASIADAS = 'Hiciste demasiadas peticiones seguidas. Espera un minuto y vuelve a intentarlo.'

/**
 * Elige el mensaje para un error que no es de un campo: si fue un 429 pide esperar;
 * si no, usa el mensaje que se pasa.
 *
 * @param {unknown} error
 * @param {string} porDefecto - Mensaje para cualquier otro error.
 * @returns {string}
 *
 * @example
 * setError(mensajeDeError(error, 'No pudimos registrar el abono.'))
 */
export function mensajeDeError(error, porDefecto) {
  return esDemasiadosIntentos(error) ? MENSAJE_DEMASIADAS : porDefecto
}
