import { AnimatePresence, motion } from 'framer-motion'

/**
 * Aviso dentro de un formulario: rosa para errores generales y menta para confirmaciones.
 * Usa `role="alert"` para que los lectores de pantalla lo anuncien apenas aparece.
 *
 * @param {Object} props
 * @param {string} [props.mensaje] - Texto del aviso; si está vacío no se muestra nada.
 * @param {'error' | 'exito'} [props.tipo='error']
 * @returns {JSX.Element}
 */
function AvisoFormulario({ mensaje, tipo = 'error' }) {
  const colores = tipo === 'exito' ? 'bg-menta/15 text-emerald-700 dark:text-menta' : 'bg-rosa/10 text-rosa'

  return (
    <AnimatePresence>
      {mensaje && (
        <motion.p
          role="alert"
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className={`rounded-2xl px-4 py-3 text-sm font-medium ${colores}`}
        >
          {mensaje}
        </motion.p>
      )}
    </AnimatePresence>
  )
}

export default AvisoFormulario
