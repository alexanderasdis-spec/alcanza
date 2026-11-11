import { useCallback, useState } from 'react'

/** Mensaje cuando se intenta enviar sin haber hecho la verificación. */
const MENSAJE_FALTA = 'Confirma que no eres un robot.'

/**
 * Guarda el código de Cloudflare Turnstile de un formulario y permite reiniciar el widget.
 *
 * Cada código sirve para un solo envío: si el envío falla, hay que llamar a `reiniciar`,
 * que borra el código y cambia `vuelta` (se usa como `key` del widget para crear uno nuevo).
 *
 * @returns {{
 *   token: string,
 *   vuelta: number,
 *   error: string,
 *   alCambiar: (token: string) => void,
 *   exigir: () => boolean,
 *   reiniciar: () => void
 * }}
 *
 * @example
 * const verificacion = useVerificacion()
 * if (!verificacion.exigir()) return // todavía no se hizo la verificación
 * await iniciarSesion(email, password, verificacion.token)
 */
export function useVerificacion() {
  const [token, setToken] = useState('')
  const [vuelta, setVuelta] = useState(0)
  const [falta, setFalta] = useState(false)

  /** Lo llama el widget: con el código al aprobar, o con '' si vence o falla. */
  const alCambiar = useCallback((nuevo) => {
    setToken(nuevo)
    if (nuevo) setFalta(false)
  }, [])

  /** Prepara un widget nuevo, porque el código anterior ya se usó. */
  const reiniciar = useCallback(() => {
    setToken('')
    setVuelta((n) => n + 1)
  }, [])

  /**
   * Revisa que haya código antes de enviar.
   *
   * @returns {boolean} `true` si se puede enviar.
   */
  const exigir = () => {
    if (token) return true
    setFalta(true)
    return false
  }

  return { token, vuelta, error: falta ? MENSAJE_FALTA : '', alCambiar, exigir, reiniciar }
}
