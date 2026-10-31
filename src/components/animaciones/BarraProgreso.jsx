import { motion } from 'framer-motion'
import { TRANSICION_ENTRADA } from '../../utils/animaciones'

/**
 * Barra de progreso de una meta.
 * Se llena desde 0 cuando aparece en pantalla y un destello de luz la recorre
 * una y otra vez, para que el avance se sienta vivo.
 *
 * @param {Object} props
 * @param {number} props.porcentaje - Avance de 0 a 100. Si se pasa de 100 se queda en 100.
 * @param {string} [props.etiqueta='Progreso de la meta'] - Texto para lectores de pantalla.
 * @returns {JSX.Element}
 *
 * @example
 * <BarraProgreso porcentaje={65} />
 */
function BarraProgreso({ porcentaje, etiqueta = 'Progreso de la meta' }) {
  const avance = Math.min(Math.max(porcentaje, 0), 100)

  return (
    <div
      role="progressbar"
      aria-label={etiqueta}
      aria-valuenow={avance}
      aria-valuemin={0}
      aria-valuemax={100}
      className="h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"
    >
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: `${avance}%` }}
        viewport={{ once: true }}
        transition={{ ...TRANSICION_ENTRADA, duration: 1.2 }}
        className="relative h-full overflow-hidden rounded-full bg-gradient-to-r from-menta to-amarillo dark:shadow-[0_0_12px] dark:shadow-menta/60"
      >
        {/* Destello que recorre la barra (animación "brillo" definida en index.css) */}
        <span
          aria-hidden="true"
          className="absolute inset-y-0 -left-1/2 w-1/2 animate-brillo bg-gradient-to-r from-transparent via-white/70 to-transparent motion-reduce:hidden"
        />
      </motion.div>
    </div>
  )
}

export default BarraProgreso
