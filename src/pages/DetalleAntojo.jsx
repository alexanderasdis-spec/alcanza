import { useCallback, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, PackageSearch, RefreshCw, Star, WifiOff } from 'lucide-react'
import Aparecer from '../components/animaciones/Aparecer'
import EtiquetaDescuento from '../components/animaciones/EtiquetaDescuento'
import TarjetaInteractiva from '../components/animaciones/TarjetaInteractiva'
import ImagenAntojo from '../components/antojos/ImagenAntojo'
import EstadoMensaje from '../components/EstadoMensaje'
import { buscarCategoria } from '../data/categorias'
import { useFetch } from '../hooks/useFetch'
import { obtenerAntojo } from '../services/ofertasService'
import { precioConDescuento } from '../utils/calculos'
import { formatearMoneda } from '../utils/formato'

/** Clases del botón principal con el degradado de la marca. */
const CLASES_BOTON =
  'inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violeta to-rosa px-6 py-3 font-semibold text-white shadow-lg shadow-violeta/30'

/**
 * Galería de fotos: una grande y miniaturas para cambiarla.
 *
 * @param {Object} props
 * @param {import('../services/ofertasService').Antojo} props.antojo
 * @returns {JSX.Element}
 */
function Galeria({ antojo }) {
  const [activa, setActiva] = useState(0)
  const fotos = antojo.imagenes.length > 0 ? antojo.imagenes : [antojo.imagen]

  return (
    <div>
      <TarjetaInteractiva className="p-3" inclinacion={5}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activa}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.25 }}
          >
            <ImagenAntojo antojo={antojo} src={fotos[activa]} className="aspect-square rounded-2xl" />
          </motion.div>
        </AnimatePresence>
      </TarjetaInteractiva>

      {fotos.length > 1 && (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
          {fotos.map((foto, i) => (
            <button
              key={`${i}-${foto}`}
              type="button"
              onClick={() => setActiva(i)}
              aria-label={`Ver foto ${i + 1}`}
              aria-pressed={i === activa}
              className={`shrink-0 rounded-2xl border-2 transition ${
                i === activa ? 'border-violeta' : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <ImagenAntojo antojo={antojo} src={foto} className="size-20 rounded-xl" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/**
 * Página de detalle de un antojo (ruta con parámetro `/antojos/:id`).
 * Muestra fotos, precio con descuento, marca, calificación y descripción.
 *
 * Pendiente para las siguientes etapas: fecha en que se logra, simulador "¿y si...?",
 * convertir en meta y botón de compartir.
 *
 * @returns {JSX.Element}
 */
function DetalleAntojo() {
  // useParams lee los parámetros de la URL: en /antojos/5, id vale "5".
  const { id } = useParams()
  // useCallback crea la función de carga una sola vez por cada id:
  // si el usuario cambia de producto sin salir de la página, useFetch vuelve a consultar.
  const cargarAntojo = useCallback(() => obtenerAntojo(id), [id])
  const { datos: antojo, cargando, error, reintentar } = useFetch(cargarAntojo)

  const volver = (
    <Link
      to="/antojos"
      className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-violeta dark:text-slate-400 dark:hover:text-violet-300"
    >
      <ArrowLeft className="size-4" />
      Volver al catálogo
    </Link>
  )

  if (error) {
    return (
      <EstadoMensaje
        Icono={WifiOff}
        titulo="No pudimos traer este antojo"
        texto="Revisa tu conexión a internet e inténtalo de nuevo."
        accion={
          <button type="button" onClick={reintentar} className={CLASES_BOTON}>
            <RefreshCw className="size-4" />
            Reintentar
          </button>
        }
      />
    )
  }

  if (cargando) {
    return (
      <div className="grid animate-pulse gap-10 md:grid-cols-2">
        <div className="aspect-square rounded-3xl bg-slate-200 dark:bg-slate-800" />
        <div className="space-y-4">
          <div className="h-4 w-1/4 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-8 w-3/4 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-24 rounded bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>
    )
  }

  if (!antojo) {
    return (
      <EstadoMensaje
        Icono={PackageSearch}
        titulo="Saldo insuficiente"
        texto="Este antojo no existe o ya no está disponible."
        accion={
          <Link to="/antojos" className={CLASES_BOTON}>
            Ver el catálogo
          </Link>
        }
      />
    )
  }

  const categoria = buscarCategoria(antojo.categoria)
  const precioFinal = precioConDescuento(antojo.precio, antojo.descuento)
  const ahorro = antojo.precio - precioFinal

  return (
    <div>
      {volver}

      <div className="mt-6 grid gap-10 md:grid-cols-2">
        <Aparecer>
          {/* La key reinicia la galería (foto activa) al cambiar de producto */}
          <Galeria key={antojo.id} antojo={antojo} />
        </Aparecer>

        <Aparecer orden={1}>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            {categoria && (
              <Link
                to={`/antojos?categoria=${categoria.id}`}
                className="inline-flex items-center gap-1.5 rounded-full bg-violeta/10 px-3 py-1 font-medium text-violeta dark:bg-violeta/20 dark:text-violet-300"
              >
                <categoria.Icono className="size-4" />
                {categoria.nombre}
              </Link>
            )}
            <span className="text-slate-500 dark:text-slate-400">{antojo.marca}</span>
            <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
              <Star className="size-4 fill-amarillo text-amarillo" />
              {antojo.calificacion.toFixed(1)}
            </span>
          </div>

          <h1 className="mt-4 font-titulo text-3xl leading-tight font-bold sm:text-4xl">{antojo.nombre}</h1>
          <p className="mt-4 text-slate-600 dark:text-slate-300">{antojo.descripcion}</p>

          <TarjetaInteractiva className="mt-8 p-6" inclinacion={4}>
            <div className="flex items-start justify-between gap-4">
              <div>
                {antojo.descuento > 0 && (
                  <p className="text-slate-400 line-through">{formatearMoneda(antojo.precio, 'USD')}</p>
                )}
                <p className="font-titulo text-4xl font-bold text-menta">{formatearMoneda(precioFinal, 'USD')}</p>
                {ahorro > 0 && (
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Te ahorras {formatearMoneda(ahorro, 'USD')}
                  </p>
                )}
              </div>
              {antojo.descuento > 0 && <EtiquetaDescuento porcentaje={antojo.descuento} />}
            </div>
            <p className="mt-6 rounded-2xl bg-amarillo/15 px-4 py-3 text-sm text-slate-700 dark:text-amarillo/90">
              Pronto: aquí verás en qué fecha lo alcanzas con tu ahorro y el simulador "¿y si...?".
            </p>
          </TarjetaInteractiva>
        </Aparecer>
      </div>
    </div>
  )
}

export default DetalleAntojo
