import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { CalendarHeart, RefreshCw, Scale, Trophy, WifiOff } from 'lucide-react'
import Aparecer from '../components/animaciones/Aparecer'
import EtiquetaDescuento from '../components/animaciones/EtiquetaDescuento'
import TarjetaInteractiva from '../components/animaciones/TarjetaInteractiva'
import ImagenAntojo from '../components/antojos/ImagenAntojo'
import EstadoMensaje from '../components/EstadoMensaje'
import { CATEGORIAS } from '../data/categorias'
import { useFetch } from '../hooks/useFetch'
import { useMoneda } from '../hooks/useMoneda'
import { usePerfil } from '../hooks/usePerfil'
import { obtenerAntojos } from '../services/ofertasService'
import { precioConDescuento, simularAlcance } from '../utils/calculos'
import { formatearMes } from '../utils/formato'

/**
 * Lista desplegable para elegir un antojo, con los productos agrupados por categoría.
 *
 * @param {Object} props
 * @param {string} props.etiqueta - Texto de la etiqueta ("Primer antojo"…).
 * @param {string} props.valor - Id del antojo elegido ('' si ninguno).
 * @param {(id: string) => void} props.onCambiar
 * @param {import('../services/ofertasService').Antojo[]} props.antojos
 * @returns {JSX.Element}
 */
function SelectorAntojo({ etiqueta, valor, onCambiar, antojos }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{etiqueta}</span>
      <select
        value={valor}
        onChange={(evento) => onCambiar(evento.target.value)}
        className="mt-2 w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 outline-none transition focus:border-violeta focus:ring-4 focus:ring-violeta/20 dark:border-slate-700 dark:bg-slate-900/80"
      >
        <option value="">Elige un antojo…</option>
        {CATEGORIAS.map((categoria) => (
          <optgroup key={categoria.id} label={categoria.nombre}>
            {antojos
              .filter((antojo) => antojo.categoria === categoria.id)
              .map((antojo) => (
                <option key={antojo.id} value={antojo.id}>
                  {antojo.nombre}
                </option>
              ))}
          </optgroup>
        ))}
      </select>
    </label>
  )
}

/**
 * Columna con los datos de un antojo para comparar.
 *
 * @param {Object} props
 * @param {import('../services/ofertasService').Antojo} props.antojo
 * @param {{ meses: number, fecha: Date | null }} props.alcance - Cuándo se alcanza con el ahorro del perfil.
 * @param {boolean} props.ganador - Si es el que se alcanza primero.
 * @returns {JSX.Element}
 */
function ColumnaAntojo({ antojo, alcance, ganador }) {
  const { formatear } = useMoneda()
  const precioFinal = precioConDescuento(antojo.precio, antojo.descuento)

  return (
    <TarjetaInteractiva className="flex h-full flex-col p-5" inclinacion={5}>
      <div className="relative">
        <ImagenAntojo antojo={antojo} className="aspect-square rounded-2xl" />
        {antojo.descuento > 0 && <EtiquetaDescuento porcentaje={antojo.descuento} className="absolute -top-1 -right-1" />}
        <AnimatePresence>
          {ganador && (
            <motion.span
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: -6 }}
              exit={{ scale: 0 }}
              className="absolute -bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-amarillo px-3 py-1 font-titulo text-xs font-bold text-slate-900 shadow-lg"
            >
              <Trophy className="size-3.5" />
              Lo alcanzas primero
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      <h2 className="mt-6 line-clamp-2 font-titulo text-lg font-semibold">{antojo.nombre}</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400">{antojo.marca}</p>

      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between gap-3">
          <dt className="text-slate-500 dark:text-slate-400">Precio</dt>
          <dd className={antojo.descuento > 0 ? 'text-slate-400 line-through' : ''}>{formatear(antojo.precio)}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-slate-500 dark:text-slate-400">Con descuento</dt>
          <dd className="font-titulo text-lg font-bold text-menta">{formatear(precioFinal)}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-slate-500 dark:text-slate-400">Calificación</dt>
          <dd>⭐ {antojo.calificacion.toFixed(1)}</dd>
        </div>
      </dl>

      <p className="mt-auto flex items-center gap-2 pt-5 text-sm font-medium">
        <CalendarHeart className="size-4 shrink-0 text-rosa" />
        {alcance.fecha
          ? `En ${alcance.meses} ${alcance.meses === 1 ? 'mes' : 'meses'}: ${formatearMes(alcance.fecha)}`
          : 'Calculando…'}
      </p>
      <Link to={`/antojos/${antojo.id}`} className="mt-3 text-sm font-semibold text-violeta hover:underline dark:text-violet-300">
        Ver detalle
      </Link>
    </TarjetaInteractiva>
  )
}

/**
 * Página del comparador (ruta `/comparador`).
 * Dos antojos lado a lado con precio, descuento y en cuánto tiempo se alcanza cada uno
 * con el ahorro del perfil. Los elegidos se guardan en la URL (`?a=78&b=ent-2`),
 * así la comparación se puede compartir y el detalle puede abrirla con un antojo ya elegido.
 *
 * @returns {JSX.Element}
 */
function Comparador() {
  const { datos: antojos, cargando, error, reintentar } = useFetch(obtenerAntojos)
  const [parametros, setParametros] = useSearchParams()
  const { tasas, formatear } = useMoneda()
  const { perfil } = usePerfil()

  const idA = parametros.get('a') ?? ''
  const idB = parametros.get('b') ?? ''
  const antojoA = antojos?.find((antojo) => antojo.id === idA)
  const antojoB = antojos?.find((antojo) => antojo.id === idB)

  /** Cambia el antojo de una columna sin perder el de la otra. */
  const elegir = (clave, id) =>
    setParametros(
      (actuales) => {
        const nuevos = new URLSearchParams(actuales)
        if (id) nuevos.set(clave, id)
        else nuevos.delete(clave)
        return nuevos
      },
      { replace: true },
    )

  // Cuándo se alcanza cada antojo con el ahorro del perfil (con descuento).
  const alcance = useMemo(() => {
    /** @param {import('../services/ofertasService').Antojo | undefined} antojo */
    const calcular = (antojo) =>
      antojo && tasas
        ? simularAlcance({
            precioUSD: antojo.precio,
            descuento: antojo.descuento,
            aplicarDescuento: true,
            ahorroMensual: perfil.ahorroMensual,
            tasas,
          })
        : { meses: Infinity, fecha: null, precioCOP: 0 }
    return { a: calcular(antojoA), b: calcular(antojoB) }
  }, [antojoA, antojoB, tasas, perfil.ahorroMensual])

  const ambos = antojoA && antojoB && tasas
  const diferenciaMeses = ambos ? Math.abs(alcance.a.meses - alcance.b.meses) : 0
  const diferenciaPrecio = ambos ? Math.abs(alcance.a.precioCOP - alcance.b.precioCOP) : 0

  if (error) {
    return (
      <EstadoMensaje
        Icono={WifiOff}
        titulo="No pudimos traer los antojos"
        texto="Revisa tu conexión a internet e inténtalo de nuevo."
        accion={
          <button
            type="button"
            onClick={reintentar}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violeta to-rosa px-6 py-3 font-semibold text-white"
          >
            <RefreshCw className="size-4" />
            Reintentar
          </button>
        }
      />
    )
  }

  return (
    <div className="space-y-8">
      <Aparecer>
        <h1 className="flex items-center gap-3 font-titulo text-3xl font-bold sm:text-4xl">
          <Scale className="size-8 text-violeta dark:text-violet-300" />
          Comparador
        </h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          ¿No te decides? Pon dos antojos lado a lado y mira cuál alcanzas primero.
        </p>
      </Aparecer>

      {cargando ? (
        <div className="grid animate-pulse gap-4 sm:grid-cols-2">
          <div className="h-14 rounded-2xl bg-slate-200 dark:bg-slate-800" />
          <div className="h-14 rounded-2xl bg-slate-200 dark:bg-slate-800" />
        </div>
      ) : (
        <>
          <Aparecer orden={1} className="grid gap-4 sm:grid-cols-2">
            <SelectorAntojo etiqueta="Primer antojo" valor={idA} onCambiar={(id) => elegir('a', id)} antojos={antojos} />
            <SelectorAntojo etiqueta="Segundo antojo" valor={idB} onCambiar={(id) => elegir('b', id)} antojos={antojos} />
          </Aparecer>

          {ambos && (
            <motion.p
              key={`${idA}-${idB}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl bg-gradient-to-r from-violeta to-rosa px-5 py-4 text-center font-medium text-white shadow-lg shadow-violeta/30"
            >
              {diferenciaMeses === 0
                ? `Los dos los alcanzas en el mismo mes. La diferencia de precio es de ${formatear(diferenciaPrecio, 'COP')}.`
                : `${alcance.a.meses < alcance.b.meses ? antojoA.nombre : antojoB.nombre} lo alcanzas ${diferenciaMeses} ${
                    diferenciaMeses === 1 ? 'mes' : 'meses'
                  } antes y cuesta ${formatear(diferenciaPrecio, 'COP')} ${
                    alcance.a.meses < alcance.b.meses === alcance.a.precioCOP < alcance.b.precioCOP ? 'menos' : 'más'
                  }.`}
            </motion.p>
          )}

          <div className="grid gap-6 sm:grid-cols-2">
            {[
              { clave: 'a', antojo: antojoA, rival: 'b' },
              { clave: 'b', antojo: antojoB, rival: 'a' },
            ].map(({ clave, antojo, rival }) =>
              antojo ? (
                <Aparecer key={`${clave}-${antojo.id}`}>
                  <ColumnaAntojo
                    antojo={antojo}
                    alcance={alcance[clave]}
                    ganador={Boolean(ambos) && alcance[clave].meses < alcance[rival].meses}
                  />
                </Aparecer>
              ) : (
                <div
                  key={clave}
                  className="grid min-h-64 place-items-center rounded-3xl border-2 border-dashed border-slate-300 p-6 text-center text-slate-400 dark:border-slate-700"
                >
                  Elige un antojo arriba para verlo aquí
                </div>
              ),
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default Comparador
