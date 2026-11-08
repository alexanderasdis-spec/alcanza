import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Download, Sparkles, X } from 'lucide-react'
import Logo from '../Logo'
import { formatearMes } from '../../utils/formato'

/** Imagen transparente de 1×1 que se usa si una foto no se puede copiar a la imagen final. */
const PIXEL_VACIO = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='

/**
 * Convierte un nombre en algo seguro para un nombre de archivo ("Apple MacBook" → "apple-macbook").
 *
 * @param {string} texto
 * @returns {string}
 */
function nombreArchivo(texto) {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40)
}

/**
 * Ventana para "Compartir mi antojo": muestra una tarjeta festiva con el antojo y la fecha
 * en que se alcanza ("¡En marzo de 2027 lo tendré!") y permite descargarla como imagen PNG.
 *
 * La imagen se crea con `html-to-image`, que "fotografía" el elemento de la tarjeta.
 * Se cierra con la X, con la tecla Escape o haciendo clic fuera de la tarjeta.
 *
 * @param {Object} props
 * @param {boolean} props.abierto - Si la ventana se muestra.
 * @param {() => void} props.onCerrar
 * @param {string} props.nombre - Nombre del antojo.
 * @param {string | null} [props.imagen] - Foto del antojo.
 * @param {Date | null} props.fecha - Mes en que se alcanza (o `null` si no se puede calcular).
 * @param {number} [props.progreso] - Avance de 0 a 100, si ya es una meta.
 * @param {boolean} [props.cumplida=false] - Si la meta ya se cumplió.
 * @returns {JSX.Element}
 */
function ModalCompartir({ abierto, onCerrar, nombre, imagen, fecha, progreso, cumplida = false }) {
  const tarjeta = useRef(null)
  const [generando, setGenerando] = useState(false)
  const [error, setError] = useState('')

  // Cierra la ventana con la tecla Escape.
  useEffect(() => {
    if (!abierto) return
    const alTecla = (evento) => evento.key === 'Escape' && onCerrar()
    document.addEventListener('keydown', alTecla)
    return () => document.removeEventListener('keydown', alTecla)
  }, [abierto, onCerrar])

  const frase = cumplida
    ? '¡Lo logré! Ya tengo mi antojo'
    : fecha
      ? `¡En ${formatearMes(fecha)} lo tendré!`
      : '¡Estoy ahorrando para esto!'

  /** Convierte la tarjeta en PNG y la descarga. */
  const descargar = async () => {
    setGenerando(true)
    setError('')
    try {
      // La librería se descarga solo cuando alguien pide la imagen.
      const { toPng } = await import('html-to-image')
      const datos = await toPng(tarjeta.current, { pixelRatio: 2, cacheBust: true, imagePlaceholder: PIXEL_VACIO })
      const enlace = document.createElement('a')
      enlace.href = datos
      enlace.download = `alcanza-${nombreArchivo(nombre)}.png`
      enlace.click()
    } catch {
      setError('No pudimos crear la imagen. Inténtalo de nuevo.')
    } finally {
      setGenerando(false)
    }
  }

  // createPortal pinta la ventana directamente en <body>: si quedara dentro de una tarjeta
  // inclinada en 3D (que usa transform), "fixed" no cubriría toda la pantalla.
  return createPortal(
    <AnimatePresence>
      {abierto && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCerrar}
          className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-4 backdrop-blur-sm"
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Compartir mi antojo"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            // Evita que un clic dentro de la ventana la cierre.
            onClick={(evento) => evento.stopPropagation()}
            className="w-full max-w-sm"
          >
            {/* Esta es la tarjeta que se convierte en imagen */}
            <div
              ref={tarjeta}
              className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-violeta via-fuchsia-600 to-rosa p-7 text-white"
            >
              <div aria-hidden="true" className="absolute -top-16 -right-16 size-48 rounded-full border-[14px] border-dashed border-white/20" />
              <div aria-hidden="true" className="absolute -bottom-10 -left-10 size-32 rounded-full bg-amarillo/40 blur-2xl" />
              <Logo claro className="relative" />
              <div className="relative mt-5 grid size-36 place-items-center overflow-hidden rounded-3xl bg-white">
                {imagen ? (
                  <img src={imagen} alt="" crossOrigin="anonymous" className="size-full object-contain p-3" />
                ) : (
                  <Sparkles className="size-14 text-violeta" />
                )}
              </div>
              <p className="relative mt-5 font-titulo text-3xl leading-tight font-bold">{frase}</p>
              <p className="relative mt-2 text-white/90">{nombre}</p>
              {progreso !== undefined && (
                <div className="relative mt-5">
                  <div className="h-3 overflow-hidden rounded-full bg-white/30">
                    <div className="h-full rounded-full bg-amarillo" style={{ width: `${Math.min(progreso, 100)}%` }} />
                  </div>
                  <p className="mt-1 text-sm font-semibold">{progreso} % ahorrado</p>
                </div>
              )}
              <p className="relative mt-6 text-xs text-white/70">¿Cuándo me lo compro? · alcanza</p>
            </div>

            <div className="mt-4 flex gap-3">
              <button
                type="button"
                onClick={descargar}
                disabled={generando}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-white px-5 py-3 font-semibold text-violeta shadow-xl disabled:opacity-60"
              >
                <Download className="size-5" />
                {generando ? 'Creando imagen…' : 'Descargar imagen'}
              </button>
              <button
                type="button"
                onClick={onCerrar}
                aria-label="Cerrar"
                className="grid size-12 place-items-center rounded-full bg-white/20 text-white transition hover:bg-white/30"
              >
                <X className="size-5" />
              </button>
            </div>
            {error && <p role="alert" className="mt-3 text-center text-sm font-medium text-white">{error}</p>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}

export default ModalCompartir
