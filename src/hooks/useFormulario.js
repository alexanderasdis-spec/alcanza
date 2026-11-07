import { useState } from 'react'
import { erroresDeValidacion, esDemasiadosIntentos } from '../services/api'

/**
 * Hook personalizado con la lógica que comparten los formularios de cuenta
 * (ingresar, registrarse, olvidé y restablecer contraseña):
 *
 * 1. Guarda los valores de los campos (formulario controlado).
 * 2. Valida en el navegador antes de enviar; después del primer intento, valida mientras se escribe.
 * 3. Envía y, si la API responde 422, muestra sus mensajes junto a cada campo.
 * 4. Si el error no es de un campo (sin conexión, demasiados intentos), da un mensaje general.
 *
 * @template {Record<string, string>} T
 * @param {T} valoresIniciales - Valores de arranque de cada campo.
 * @param {(datos: T) => Record<string, string>} validar - Función de `utils/validaciones`.
 * @param {(datos: T) => Promise<void>} enviar - Lo que se hace al enviar si los datos son válidos.
 * @param {Record<string, string>} [nombresApi={}] - Traducción de campos de la API a los del formulario
 *   (por ejemplo `{ password_confirmation: 'confirmacion' }`).
 * @returns {{
 *   datos: T,
 *   errores: Record<string, string>,
 *   errorGeneral: string,
 *   enviando: boolean,
 *   alCambiar: (evento: import('react').ChangeEvent<HTMLInputElement>) => void,
 *   alEnviar: (evento: import('react').FormEvent) => Promise<void>
 * }}
 *
 * @example
 * const { datos, errores, alCambiar, alEnviar } = useFormulario({ email: '' }, validarCorreo, enviarCorreo)
 */
export function useFormulario(valoresIniciales, validar, enviar, nombresApi = {}) {
  const [datos, setDatos] = useState(valoresIniciales)
  const [errores, setErrores] = useState({})
  const [errorGeneral, setErrorGeneral] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [intentoEnviar, setIntentoEnviar] = useState(false)

  /** Actualiza el campo que cambió, usando el atributo `name` del input. */
  const alCambiar = (evento) => {
    const { name, value } = evento.target
    const nuevos = { ...datos, [name]: value }
    setDatos(nuevos)
    if (intentoEnviar) setErrores(validar(nuevos))
  }

  const alEnviar = async (evento) => {
    // Evita que el navegador recargue la página, que es lo que hace un <form> por defecto.
    evento.preventDefault()
    setIntentoEnviar(true)
    setErrorGeneral('')

    const encontrados = validar(datos)
    setErrores(encontrados)
    if (Object.keys(encontrados).length > 0) return

    setEnviando(true)
    try {
      await enviar(datos)
    } catch (error) {
      const delServidor = erroresDeValidacion(error, nombresApi)
      if (delServidor) setErrores(delServidor)
      else if (esDemasiadosIntentos(error)) setErrorGeneral('Demasiados intentos. Espera un minuto y vuelve a probar.')
      else setErrorGeneral('No pudimos conectar con el servidor. Revisa que esté encendido e inténtalo de nuevo.')
    } finally {
      setEnviando(false)
    }
  }

  return { datos, errores, errorGeneral, enviando, alCambiar, alEnviar }
}
