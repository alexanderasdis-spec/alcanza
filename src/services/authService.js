import axios from 'axios'
import { api, guardarToken, obtenerToken } from './api'

/**
 * Servicio de cuentas: registro, inicio y cierre de sesión, y recuperación de contraseña.
 * Habla con la API de Laravel (`/api/registro`, `/api/login`, `/api/logout`, `/api/usuario`,
 * `/api/olvide-contrasena` y `/api/restablecer-contrasena`).
 *
 * Al registrarse o iniciar sesión, la API devuelve un token de Sanctum; este servicio lo guarda
 * y el cliente `api` lo envía solo en cada petición.
 *
 * @module services/authService
 */

/**
 * Datos públicos del usuario (nunca incluye la contraseña).
 *
 * @typedef {Object} Usuario
 * @property {number} id
 * @property {string} nombre
 * @property {string} email
 */

/**
 * Crea una cuenta y deja la sesión iniciada.
 *
 * @param {{ nombre: string, email: string, password: string, confirmacion: string }} datos
 * @returns {Promise<Usuario>}
 * @throws {Error} 422 si algún dato no es válido o el correo ya existe.
 */
export async function registrar({ nombre, email, password, confirmacion }) {
  const { data } = await api.post('/registro', { nombre, email, password, password_confirmation: confirmacion })
  guardarToken(data.token)
  return data.usuario
}

/**
 * Inicia sesión con correo y contraseña.
 *
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Usuario>}
 * @throws {Error} 422 si el correo o la contraseña no son correctos; 429 si hubo demasiados intentos.
 */
export async function iniciarSesion(email, password) {
  const { data } = await api.post('/login', { email, password })
  guardarToken(data.token)
  return data.usuario
}

/**
 * Consulta el usuario dueño del token guardado.
 *
 * @returns {Promise<Usuario | null>} `null` si no hay token o ya no sirve (401).
 * @throws {Error} Si el servidor no responde.
 */
export async function obtenerUsuario() {
  if (!obtenerToken()) return null
  try {
    const { data } = await api.get('/usuario')
    return data
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) return null
    throw error
  }
}

/**
 * Cierra la sesión: invalida el token en la API y lo borra del navegador.
 * Aunque la API no responda, el token se borra igual.
 *
 * @returns {Promise<void>}
 */
export async function cerrarSesion() {
  try {
    await api.post('/logout')
  } catch {
    // Si el servidor no responde, igual se cierra la sesión en este navegador.
  } finally {
    guardarToken(null)
  }
}

/**
 * Pide el correo con el enlace para cambiar la contraseña.
 *
 * @param {string} email
 * @returns {Promise<string>} Mensaje de la API (el mismo exista o no la cuenta).
 */
export async function olvideContrasena(email) {
  const { data } = await api.post('/olvide-contrasena', { email })
  return data.message
}

/**
 * Cambia la contraseña con el token que llegó en el enlace del correo.
 *
 * @param {{ token: string, email: string, password: string, confirmacion: string }} datos
 * @returns {Promise<string>} Mensaje de confirmación.
 * @throws {Error} 422 si el enlace no es válido, venció o la contraseña no cumple las reglas.
 */
export async function restablecerContrasena({ token, email, password, confirmacion }) {
  const { data } = await api.post('/restablecer-contrasena', {
    token,
    email,
    password,
    password_confirmation: confirmacion,
  })
  return data.message
}
