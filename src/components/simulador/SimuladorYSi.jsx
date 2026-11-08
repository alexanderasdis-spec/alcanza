import { useState } from 'react'
import { motion } from 'framer-motion'
import { RotateCcw, Rocket, Wand2 } from 'lucide-react'
import TarjetaInteractiva from '../animaciones/TarjetaInteractiva'
import Deslizador from '../formulario/Deslizador'
import { useMoneda } from '../../hooks/useMoneda'
import { usePerfil } from '../../hooks/usePerfil'
import { simularAlcance } from '../../utils/calculos'
import { formatearMes } from '../../utils/formato'

/** Paso de los deslizadores de dinero (en pesos). */
const PASO_DINERO = 10000

/**
 * Simulador "¿y si...?" del detalle de un antojo.
 * Tres controles cambian el escenario y la fecha se recalcula en vivo, sin consultar ninguna API:
 * - el ahorro mensual,
 * - un ingreso extra cada mes,
 * - comprar con o sin el descuento.
 *
 * Compara siempre con el escenario actual (el ahorro del perfil, con descuento) y dice
 * cuántos meses se gana o se pierde.
 *
 * @param {Object} props
 * @param {import('../../services/ofertasService').Antojo} props.antojo - Producto que se simula.
 * @returns {JSX.Element}
 */
function SimuladorYSi({ antojo }) {
  const { perfil } = usePerfil()
  const { tasas, formatear } = useMoneda()
  const [ahorro, setAhorro] = useState(perfil.ahorroMensual)
  const [extra, setExtra] = useState(0)
  const [conDescuento, setConDescuento] = useState(true)

  // El máximo del ahorro crece con el perfil: 3 veces lo que ahorra hoy (y al menos 1 millón).
  const maximoAhorro = Math.max(1_000_000, Math.ceil((perfil.ahorroMensual * 3) / PASO_DINERO) * PASO_DINERO)

  if (!tasas) {
    return <p className="text-sm text-slate-500 dark:text-slate-400">Cargando las tasas de cambio para simular…</p>
  }

  const base = { precioUSD: antojo.precio, descuento: antojo.descuento, tasas }
  const actual = simularAlcance({ ...base, aplicarDescuento: true, ahorroMensual: perfil.ahorroMensual })
  const simulado = simularAlcance({ ...base, aplicarDescuento: conDescuento, ahorroMensual: ahorro, ingresoExtra: extra })

  const diferencia = Number.isFinite(simulado.meses) ? actual.meses - simulado.meses : null
  const cambio = ahorro !== perfil.ahorroMensual || extra !== 0 || !conDescuento

  /** Vuelve al escenario actual. */
  const reiniciar = () => {
    setAhorro(perfil.ahorroMensual)
    setExtra(0)
    setConDescuento(true)
  }

  return (
    <TarjetaInteractiva className="p-6" inclinacion={3}>
      <div className="flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 font-titulo text-xl font-bold">
          <Wand2 className="size-5 text-violeta dark:text-violet-300" />
          Simulador "¿y si...?"
        </h2>
        {cambio && (
          <button
            type="button"
            onClick={reiniciar}
            className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm text-slate-500 transition hover:bg-violeta/10 hover:text-violeta"
          >
            <RotateCcw className="size-4" />
            Reiniciar
          </button>
        )}
      </div>

      <div className="mt-6 space-y-6">
        <Deslizador
          etiqueta="¿Y si ahorro cada mes…?"
          valor={ahorro}
          onCambiar={setAhorro}
          min={0}
          max={maximoAhorro}
          paso={PASO_DINERO}
          texto={formatear(ahorro, 'COP')}
        />
        <Deslizador
          etiqueta="¿Y si sumo un ingreso extra al mes?"
          valor={extra}
          onCambiar={setExtra}
          min={0}
          max={1_000_000}
          paso={PASO_DINERO}
          texto={formatear(extra, 'COP')}
        />
        {antojo.descuento > 0 && (
          <label className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl bg-rosa/5 px-4 py-3">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Comprar con el descuento del {antojo.descuento} %
            </span>
            <input
              type="checkbox"
              checked={conDescuento}
              onChange={(evento) => setConDescuento(evento.target.checked)}
              className="size-5 cursor-pointer accent-rosa"
            />
          </label>
        )}
      </div>

      {/* Resultado: la fecha cambia con una animación cada vez que se mueve algo */}
      <div className="mt-6 rounded-2xl bg-gradient-to-br from-violeta to-rosa p-5 text-white shadow-lg shadow-violeta/30">
        <p className="text-sm text-white/80">
          Precio {conDescuento ? 'con descuento' : 'completo'}: {formatear(simulado.precioCOP, 'COP')} · aportas{' '}
          {formatear(simulado.aporteMensual, 'COP')} al mes
        </p>
        {/* La key cambia con la fecha: React crea un párrafo nuevo y su animación de entrada se repite.
            No se espera a que salga el anterior, así el texto nunca se queda atrás al arrastrar. */}
        <motion.p
          key={simulado.fecha ? simulado.fecha.getTime() : 'nunca'}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="mt-2 font-titulo text-2xl font-bold"
        >
          {simulado.fecha
            ? `Lo alcanzas en ${simulado.meses} ${simulado.meses === 1 ? 'mes' : 'meses'}: ${formatearMes(simulado.fecha)}`
            : 'Con $ 0 al mes no llegas nunca 😅'}
        </motion.p>
        {diferencia !== null && diferencia !== 0 && (
          <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-sm font-semibold">
            <Rocket className="size-4" />
            {diferencia > 0
              ? `${diferencia} ${diferencia === 1 ? 'mes' : 'meses'} antes que con tu ahorro actual`
              : `${-diferencia} ${diferencia === -1 ? 'mes' : 'meses'} después que con tu ahorro actual`}
          </p>
        )}
      </div>
    </TarjetaInteractiva>
  )
}

export default SimuladorYSi
