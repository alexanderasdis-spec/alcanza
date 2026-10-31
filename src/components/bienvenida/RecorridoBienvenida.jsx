import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, PartyPopper, PiggyBank, ShoppingBag } from 'lucide-react'
import Magnetico from '../animaciones/Magnetico'
import { CURVA_SALIDA } from '../../utils/animaciones'

/**
 * Las tres pantallas del recorrido. Agregar o quitar una pantalla es solo editar esta lista.
 *
 * @type {{ titulo: string, texto: string, Icono: import('lucide-react').LucideIcon, fondo: string }[]}
 */
const PANTALLAS = [
  {
    titulo: 'Elige tu antojo',
    texto: 'Unos audífonos, un celular, unos tenis… Escoge del catálogo eso que tanto quieres.',
    Icono: ShoppingBag,
    fondo: 'from-violeta to-fuchsia-500',
  },
  {
    titulo: 'Dinos cuánto ahorras',
    texto: 'Con tu ahorro mensual calculamos la fecha exacta en que lo alcanzas, y cómo llegar antes.',
    Icono: PiggyBank,
    fondo: 'from-menta to-teal-400',
  },
  {
    titulo: 'Abona y celebra',
    texto: 'Registra cada abono, mira cómo avanza tu meta y celebra con confeti al llegar al 100%.',
    Icono: PartyPopper,
    fondo: 'from-rosa to-amarillo',
  },
]

/** Píxeles que hay que arrastrar con el dedo para cambiar de pantalla. */
const UMBRAL_ARRASTRE = 80

/**
 * Animación de cada pantalla según la dirección: si se avanza, la nueva entra por la derecha;
 * si se retrocede, entra por la izquierda. `direccion` llega por la prop `custom`.
 */
const variantes = {
  entrar: (direccion) => ({ opacity: 0, x: direccion * 120, rotate: direccion * 4 }),
  centro: { opacity: 1, x: 0, rotate: 0 },
  salir: (direccion) => ({ opacity: 0, x: direccion * -120, rotate: direccion * -4 }),
}

/**
 * Recorrido de bienvenida de tres pantallas que explica cómo funciona Alcanza.
 * Se puede avanzar con los botones, con los puntos o arrastrando con el dedo.
 *
 * @param {Object} props
 * @param {() => void} props.onTerminar - Se llama al terminar o al saltar el recorrido.
 * @returns {JSX.Element}
 */
function RecorridoBienvenida({ onTerminar }) {
  // Se guardan juntos el índice y la dirección, porque siempre cambian a la vez.
  const [[indice, direccion], setPosicion] = useState([0, 1])
  const pantalla = PANTALLAS[indice]
  const esUltima = indice === PANTALLAS.length - 1

  /**
   * Va a otra pantalla, calculando hacia qué lado debe animarse.
   *
   * @param {number} destino - Índice de la pantalla a mostrar.
   */
  const irA = (destino) => {
    if (destino < 0 || destino >= PANTALLAS.length) return
    setPosicion([destino, destino > indice ? 1 : -1])
  }

  const siguiente = () => (esUltima ? onTerminar() : irA(indice + 1))

  /** Al soltar el arrastre, decide si se pasó a la siguiente o a la anterior. */
  const alSoltar = (_evento, { offset }) => {
    if (offset.x < -UMBRAL_ARRASTRE) siguiente()
    else if (offset.x > UMBRAL_ARRASTRE) irA(indice - 1)
  }

  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative h-80 w-full overflow-hidden">
        <AnimatePresence mode="wait" custom={direccion}>
          <motion.div
            key={indice}
            custom={direccion}
            variants={variantes}
            initial="entrar"
            animate="centro"
            exit="salir"
            transition={{ duration: 0.45, ease: CURVA_SALIDA }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.6}
            onDragEnd={alSoltar}
            className="flex h-full cursor-grab flex-col items-center justify-center px-2 active:cursor-grabbing"
          >
            <motion.div
              initial={{ scale: 0.5, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 14, delay: 0.1 }}
              className={`grid size-28 place-items-center rounded-[2rem] bg-gradient-to-br ${pantalla.fondo} text-white shadow-2xl shadow-violeta/30`}
            >
              <pantalla.Icono className="size-14" strokeWidth={1.6} />
            </motion.div>
            <h2 className="mt-8 font-titulo text-3xl font-bold">{pantalla.titulo}</h2>
            <p className="mt-3 max-w-sm text-slate-600 dark:text-slate-300">{pantalla.texto}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Puntos indicadores: el activo se estira como una píldora */}
      <div className="mt-4 flex gap-2">
        {PANTALLAS.map((p, i) => (
          <button
            key={p.titulo}
            type="button"
            onClick={() => irA(i)}
            aria-label={`Ir a la pantalla ${i + 1}: ${p.titulo}`}
            aria-current={i === indice}
            className="py-2"
          >
            <motion.span
              animate={{ width: i === indice ? 28 : 10 }}
              className={`block h-2.5 rounded-full ${i === indice ? 'bg-violeta' : 'bg-slate-300 dark:bg-slate-600'}`}
            />
          </button>
        ))}
      </div>

      <div className="mt-8 flex w-full items-center justify-between">
        <button
          type="button"
          onClick={onTerminar}
          className="rounded-full px-4 py-2 font-medium text-slate-500 transition hover:text-violeta dark:text-slate-400 dark:hover:text-violet-300"
        >
          Saltar
        </button>
        <Magnetico>
          <button
            type="button"
            onClick={siguiente}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violeta to-rosa px-6 py-3 font-semibold text-white shadow-lg shadow-violeta/30"
          >
            {esUltima ? 'Empezar' : 'Siguiente'}
            <ArrowRight className="size-5" />
          </button>
        </Magnetico>
      </div>
    </div>
  )
}

export default RecorridoBienvenida
