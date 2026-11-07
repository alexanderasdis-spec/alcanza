import { useId, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Eye, EyeOff } from 'lucide-react'

/**
 * Campo de formulario con etiqueta, mensaje de error animado y estilo de Alcanza.
 * Si es de tipo contraseña, agrega un botón para mostrarla u ocultarla.
 *
 * Es un input controlado: el valor y el cambio los maneja el formulario que lo usa.
 *
 * @param {Object} props
 * @param {string} props.etiqueta - Texto de la etiqueta.
 * @param {string} props.name - Nombre del campo (lo usa el manejador `onChange` del formulario).
 * @param {string} props.value - Valor actual.
 * @param {(evento: import('react').ChangeEvent<HTMLInputElement>) => void} props.onChange
 * @param {string} [props.type='text'] - Tipo de input (`text`, `email`, `password`…).
 * @param {string} [props.error] - Mensaje de error; si hay, el borde se pone rosa.
 * @param {string} [props.ayuda] - Texto de ayuda debajo del campo (cuando no hay error).
 * @param {string} [props.autoComplete] - Pista para el autocompletado del navegador.
 * @param {string} [props.placeholder]
 * @returns {JSX.Element}
 *
 * @example
 * <CampoTexto etiqueta="Correo" name="email" type="email" value={datos.email} onChange={alCambiar} error={errores.email} />
 */
function CampoTexto({ etiqueta, name, value, onChange, type = 'text', error, ayuda, autoComplete, placeholder }) {
  // useId crea un id único para conectar la etiqueta, el input y el mensaje (accesibilidad).
  const id = useId()
  const [visible, setVisible] = useState(false)
  const esContrasena = type === 'password'
  const idMensaje = `${id}-mensaje`

  return (
    <div>
      <label htmlFor={id} className="font-medium">
        {etiqueta}
      </label>
      <div className="relative mt-2">
        <input
          id={id}
          name={name}
          type={esContrasena && visible ? 'text' : type}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          aria-describedby={error || ayuda ? idMensaje : undefined}
          className={`w-full rounded-2xl border bg-white/90 px-4 py-3 outline-none transition focus:ring-4 dark:bg-slate-900/80 ${
            esContrasena ? 'pr-12' : ''
          } ${
            error
              ? 'border-rosa focus:ring-rosa/20'
              : 'border-slate-200 focus:border-violeta focus:ring-violeta/20 dark:border-slate-700'
          }`}
        />
        {esContrasena && (
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            className="absolute top-1/2 right-3 grid size-8 -translate-y-1/2 place-items-center rounded-full text-slate-400 transition hover:bg-violeta/10 hover:text-violeta"
          >
            {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        )}
      </div>
      <AnimatePresence mode="wait" initial={false}>
        {error ? (
          <motion.p
            key="error"
            id={idMensaje}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="mt-1.5 text-sm font-medium text-rosa"
          >
            {error}
          </motion.p>
        ) : (
          ayuda && (
            <p key="ayuda" id={idMensaje} className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
              {ayuda}
            </p>
          )
        )}
      </AnimatePresence>
    </div>
  )
}

export default CampoTexto
