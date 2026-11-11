import { useEffect, useRef, useState } from 'react'
import { ShieldCheck } from 'lucide-react'

/** Script oficial de Cloudflare Turnstile; "render=explicit" deja que React decida dónde dibujarlo. */
const URL_SCRIPT = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'

/**
 * Clave pública del sitio. En desarrollo es la de prueba de Cloudflare, que siempre aprueba;
 * al desplegar se pone la real en VITE_TURNSTILE_SITE_KEY.
 */
const CLAVE_SITIO = import.meta.env.VITE_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'

/** Ancho mínimo del widget normal; si no cabe, se usa la versión compacta. */
const ANCHO_NORMAL = 300

/** Promesa compartida: el script se descarga una sola vez aunque haya varios formularios. */
let cargaScript = null

/**
 * Descarga el script de Turnstile (una sola vez) y entrega el objeto `window.turnstile`.
 *
 * @returns {Promise<any>}
 */
function cargarTurnstile() {
  if (window.turnstile) return Promise.resolve(window.turnstile)
  cargaScript ??= new Promise((resolver, rechazar) => {
    const script = document.createElement('script')
    script.src = URL_SCRIPT
    script.async = true
    script.onload = () => resolver(window.turnstile)
    script.onerror = () => {
      cargaScript = null
      rechazar(new Error('No se pudo cargar Turnstile'))
    }
    document.head.appendChild(script)
  })
  return cargaScript
}

/**
 * Verificación "no soy un robot" de Cloudflare Turnstile.
 * Casi siempre es invisible para la persona: Cloudflare decide solo si hace falta un desafío.
 *
 * Al aprobar entrega un código por `onCambiar`; el backend lo comprueba con Cloudflare.
 * Para crear un widget nuevo (después de un envío fallido), el formulario le cambia la `key`.
 *
 * @param {Object} props
 * @param {(token: string) => void} props.onCambiar - Recibe el código, o '' si vence o falla.
 * @param {string} [props.error] - Mensaje de error para mostrar debajo.
 * @returns {JSX.Element}
 */
function VerificacionHumana({ onCambiar, error }) {
  const contenedor = useRef(null)
  const [fallaCarga, setFallaCarga] = useState(false)
  // Se guarda en una ref para que el widget no se vuelva a crear cada vez que cambia la función.
  const alCambiar = useRef(onCambiar)
  useEffect(() => {
    alCambiar.current = onCambiar
  })

  useEffect(() => {
    let activo = true
    let id = null
    cargarTurnstile()
      .then((turnstile) => {
        if (!activo || !contenedor.current) return
        id = turnstile.render(contenedor.current, {
          sitekey: CLAVE_SITIO,
          language: 'es',
          theme: 'auto',
          size: contenedor.current.offsetWidth < ANCHO_NORMAL ? 'compact' : 'flexible',
          callback: (token) => alCambiar.current(token),
          'expired-callback': () => alCambiar.current(''),
          'error-callback': () => alCambiar.current(''),
        })
      })
      .catch(() => activo && setFallaCarga(true))
    // Al desmontar se quita el widget para no dejarlo huérfano en la página.
    return () => {
      activo = false
      if (id !== null) window.turnstile?.remove(id)
    }
  }, [])

  const mensaje = fallaCarga ? 'No se pudo cargar la verificación. Revisa tu conexión y recarga la página.' : error

  return (
    <div>
      <p className="mb-2 flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-300">
        <ShieldCheck className="size-4 text-menta" />
        Verificación de seguridad
      </p>
      <div ref={contenedor} className="min-h-[65px] w-full" />
      {mensaje && (
        <p role="alert" className="mt-1.5 text-sm font-medium text-rosa">
          {mensaje}
        </p>
      )}
    </div>
  )
}

export default VerificacionHumana
