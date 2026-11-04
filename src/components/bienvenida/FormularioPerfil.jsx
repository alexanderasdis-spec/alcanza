import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import Magnetico from '../animaciones/Magnetico'
import { formatearMoneda } from '../../utils/formato'
import { validarPerfil } from '../../utils/validaciones'
import { erroresDeValidacion } from '../../services/api'

/** Valores iniciales del formulario: los inputs siempre guardan texto. */
const DATOS_INICIALES = { nombre: '', ahorroMensual: '' }

/**
 * Mensaje de error animado debajo de un campo.
 *
 * @param {Object} props
 * @param {string} props.id - Id del mensaje, para conectarlo al input con `aria-describedby`.
 * @param {string} [props.mensaje] - Texto del error. Si no hay, no se muestra nada.
 * @returns {JSX.Element}
 */
function MensajeError({ id, mensaje }) {
  return (
    <AnimatePresence>
      {mensaje && (
        <motion.p
          id={id}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          className="mt-1.5 text-sm font-medium text-rosa"
        >
          {mensaje}
        </motion.p>
      )}
    </AnimatePresence>
  )
}

/**
 * Formulario controlado del perfil rápido: nombre y ahorro mensual.
 *
 * - **Controlado:** el valor de cada input vive en el estado `datos`, no en el DOM.
 * - **Validación:** al enviar se revisan los datos con `validarPerfil`. Después del primer
 *   intento, los errores se actualizan mientras el usuario escribe.
 *
 * @param {Object} props
 * @param {(perfil: { nombre: string, ahorroMensual: number }) => Promise<void>} props.onGuardar
 *   Se llama con los datos ya limpios y convertidos a número.
 * @returns {JSX.Element}
 */
function FormularioPerfil({ onGuardar }) {
  const [datos, setDatos] = useState(DATOS_INICIALES)
  const [errores, setErrores] = useState({})
  const [intentoEnviar, setIntentoEnviar] = useState(false)
  const [enviando, setEnviando] = useState(false)
  // Mensaje cuando falla el guardado por algo que no es un campo (por ejemplo, sin conexión).
  const [errorGeneral, setErrorGeneral] = useState('')

  /** Actualiza el campo que cambió, usando el atributo `name` del input. */
  const alCambiar = (evento) => {
    const { name, value } = evento.target
    const nuevosDatos = { ...datos, [name]: value }
    setDatos(nuevosDatos)
    if (intentoEnviar) setErrores(validarPerfil(nuevosDatos))
  }

  const alEnviar = async (evento) => {
    // Evita que el navegador recargue la página, que es lo que hace un <form> por defecto.
    evento.preventDefault()
    setIntentoEnviar(true)

    const encontrados = validarPerfil(datos)
    setErrores(encontrados)
    if (Object.keys(encontrados).length > 0) return

    setEnviando(true)
    setErrorGeneral('')
    try {
      await onGuardar({ nombre: datos.nombre.trim(), ahorroMensual: Number(datos.ahorroMensual) })
    } catch (error) {
      // Si la API rechazó algún campo (422), se muestra junto a ese campo; si no, un aviso general.
      const delServidor = erroresDeValidacion(error, { ahorro_mensual: 'ahorroMensual' })
      if (delServidor) setErrores(delServidor)
      else setErrorGeneral('No pudimos guardar tu perfil. Revisa que el servidor esté encendido e inténtalo de nuevo.')
      setEnviando(false)
    }
  }

  const ahorro = Number(datos.ahorroMensual)
  const clasesInput =
    'mt-2 w-full rounded-2xl border bg-white/90 px-4 py-3 text-lg outline-none transition focus:ring-4 dark:bg-slate-900/80'
  const clasesEstado = (campo) =>
    errores[campo]
      ? 'border-rosa focus:ring-rosa/20'
      : 'border-slate-200 focus:border-violeta focus:ring-violeta/20 dark:border-slate-700'

  return (
    <form onSubmit={alEnviar} noValidate className="text-left">
      <h2 className="font-titulo text-3xl font-bold">Cuéntanos de ti</h2>
      <p className="mt-2 text-slate-600 dark:text-slate-300">
        Sin registro: solo tu nombre y cuánto ahorras al mes.
      </p>

      <div className="mt-8">
        <label htmlFor="nombre" className="font-medium">
          ¿Cómo te llamas?
        </label>
        <input
          id="nombre"
          name="nombre"
          type="text"
          autoComplete="given-name"
          placeholder="Tu nombre"
          value={datos.nombre}
          onChange={alCambiar}
          aria-invalid={Boolean(errores.nombre)}
          aria-describedby="error-nombre"
          className={`${clasesInput} ${clasesEstado('nombre')}`}
        />
        <MensajeError id="error-nombre" mensaje={errores.nombre} />
      </div>

      <div className="mt-6">
        <label htmlFor="ahorroMensual" className="font-medium">
          ¿Cuánto ahorras al mes?
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute top-1/2 left-4 mt-1 -translate-y-1/2 text-lg text-slate-400">
            $
          </span>
          <input
            id="ahorroMensual"
            name="ahorroMensual"
            type="number"
            inputMode="numeric"
            min="1"
            step="1000"
            placeholder="350000"
            value={datos.ahorroMensual}
            onChange={alCambiar}
            aria-invalid={Boolean(errores.ahorroMensual)}
            aria-describedby="error-ahorro ayuda-ahorro"
            className={`${clasesInput} pl-9 ${clasesEstado('ahorroMensual')}`}
          />
        </div>
        <MensajeError id="error-ahorro" mensaje={errores.ahorroMensual} />
        {/* Vista previa del monto con formato, para confirmar que se escribió bien */}
        {!errores.ahorroMensual && ahorro > 0 && (
          <p id="ayuda-ahorro" className="mt-1.5 text-sm text-menta">
            {formatearMoneda(ahorro)} al mes en pesos colombianos
          </p>
        )}
      </div>

      {errorGeneral && (
        <p role="alert" className="mt-6 rounded-2xl bg-rosa/10 px-4 py-3 text-sm font-medium text-rosa">
          {errorGeneral}
        </p>
      )}

      <div className="mt-10 flex justify-end">
        <Magnetico>
          <button
            type="submit"
            disabled={enviando}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violeta to-rosa px-7 py-3 font-semibold text-white shadow-lg shadow-violeta/30 disabled:opacity-60"
          >
            <Sparkles className="size-5" />
            {enviando ? 'Guardando…' : '¡Listo, vamos!'}
          </button>
        </Magnetico>
      </div>
    </form>
  )
}

export default FormularioPerfil
