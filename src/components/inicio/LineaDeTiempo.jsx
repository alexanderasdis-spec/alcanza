import { motion } from 'framer-motion'
import { Flag, Trophy } from 'lucide-react'
import { useMoneda } from '../../hooks/useMoneda'
import { fechaEstimada, mesesParaAlcanzar } from '../../utils/calculos'
import { formatearMes } from '../../utils/formato'
import { CURVA_SALIDA } from '../../utils/animaciones'

/**
 * Ordena las metas en progreso y calcula en qué mes llega cada una si el usuario
 * ahorra para una a la vez, empezando por la que menos le falta.
 * Por eso el faltante se va sumando: la segunda meta llega cuando se juntó lo de la primera más lo suyo.
 *
 * @param {import('../../services/metasService').Meta[]} metas
 * @param {number} ahorroMensual - Ahorro mensual del perfil, en COP.
 * @returns {{ meta: import('../../services/metasService').Meta, faltante: number, fecha: Date }[]}
 */
function armarLineaDeTiempo(metas, ahorroMensual) {
  let acumulado = 0
  return metas
    .filter((meta) => meta.estado === 'en_progreso')
    .map((meta) => ({ meta, faltante: Math.max(0, meta.precioFinal - meta.ahorrado) }))
    .sort((a, b) => a.faltante - b.faltante)
    .map((paso) => {
      acumulado += paso.faltante
      return { ...paso, fecha: fechaEstimada(mesesParaAlcanzar(acumulado, ahorroMensual)) }
    })
}

/**
 * Línea de tiempo de Inicio: las metas en progreso puestas en el calendario,
 * con un punto por meta que se va dibujando de arriba hacia abajo.
 *
 * @param {Object} props
 * @param {import('../../services/metasService').Meta[]} props.metas
 * @param {number} props.ahorroMensual - Ahorro mensual del perfil, en COP.
 * @returns {JSX.Element | null} `null` si no hay metas en progreso.
 */
function LineaDeTiempo({ metas, ahorroMensual }) {
  const { formatear } = useMoneda()
  const pasos = armarLineaDeTiempo(metas, ahorroMensual)

  if (pasos.length === 0) return null

  return (
    <ol className="relative ml-3 border-l-2 border-dashed border-violeta/30 pl-8">
      {pasos.map(({ meta, faltante, fecha }, i) => (
        <motion.li
          key={meta.id}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, ease: CURVA_SALIDA, delay: i * 0.08 }}
          className="relative pb-8 last:pb-0"
        >
          {/* Punto sobre la línea; el último lleva bandera de llegada */}
          <span
            className={`absolute top-1 -left-[2.65rem] grid size-7 place-items-center rounded-full text-white shadow-lg ${
              i === pasos.length - 1 ? 'bg-amarillo text-slate-900 shadow-amarillo/40' : 'bg-gradient-to-br from-violeta to-rosa shadow-violeta/30'
            }`}
          >
            {i === pasos.length - 1 ? <Flag className="size-3.5" /> : <Trophy className="size-3.5" />}
          </span>
          <p className="font-titulo text-sm font-bold text-violeta first-letter:uppercase dark:text-violet-300">{formatearMes(fecha)}</p>
          <p className="mt-0.5 font-semibold">{meta.nombreProducto}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Te faltan {formatear(faltante, 'COP')} · {meta.progreso} % ahorrado
          </p>
        </motion.li>
      ))}
    </ol>
  )
}

export default LineaDeTiempo
