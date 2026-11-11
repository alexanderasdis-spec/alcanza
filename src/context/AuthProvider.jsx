import { useCallback, useEffect, useState } from 'react'
import { AuthContext } from './authContext'
import { EVENTO_SESION_VENCIDA } from '../services/api'
import * as authService from '../services/authService'

/**
 * Lo que comparte el contexto de sesión.
 *
 * @typedef {Object} ValorAuth
 * @property {import('../services/authService').Usuario | null} usuario - Usuario con sesión iniciada, o `null`.
 * @property {boolean} cargando - `true` mientras se comprueba si el token guardado sigue sirviendo.
 * @property {Error | null} error - Error si la API no respondió al comprobar la sesión.
 * @property {() => void} reintentar - Vuelve a comprobar la sesión.
 * @property {(email: string, password: string, turnstile: string) => Promise<void>} iniciarSesion
 * @property {(datos: Parameters<typeof authService.registrar>[0]) => Promise<void>} registrarse
 * @property {() => Promise<void>} cerrarSesion
 */

/**
 * Proveedor de la sesión. Al abrir la app revisa si hay un token guardado y, si sigue
 * sirviendo, recupera el usuario: así la sesión continúa aunque se recargue la página.
 *
 * Todo lo que depende del usuario (perfil y metas) cuelga de este contexto: al cerrar sesión,
 * esos datos se vacían solos.
 *
 * @param {Object} props
 * @param {import('react').ReactNode} props.children
 * @returns {JSX.Element}
 */
export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [intento, setIntento] = useState(0)

  // Comprueba el token guardado al abrir la app (y al reintentar).
  useEffect(() => {
    let activo = true
    authService
      .obtenerUsuario()
      .then((actual) => activo && setUsuario(actual))
      .catch((problema) => activo && setError(problema))
      .finally(() => activo && setCargando(false))
    return () => {
      activo = false
    }
  }, [intento])

  // Si la API rechaza el token en cualquier petición (401), se cierra la sesión en la app.
  useEffect(() => {
    const alVencer = () => setUsuario(null)
    window.addEventListener(EVENTO_SESION_VENCIDA, alVencer)
    return () => window.removeEventListener(EVENTO_SESION_VENCIDA, alVencer)
  }, [])

  const reintentar = useCallback(() => {
    setCargando(true)
    setError(null)
    setIntento((n) => n + 1)
  }, [])

  const iniciarSesion = async (email, password, turnstile) => {
    setUsuario(await authService.iniciarSesion(email, password, turnstile))
  }

  const registrarse = async (datos) => {
    setUsuario(await authService.registrar(datos))
  }

  const cerrarSesion = async () => {
    await authService.cerrarSesion()
    setUsuario(null)
  }

  return (
    <AuthContext.Provider value={{ usuario, cargando, error, reintentar, iniciarSesion, registrarse, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  )
}
