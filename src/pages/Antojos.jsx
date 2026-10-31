import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { RefreshCw, SearchX, WifiOff } from 'lucide-react'
import Aparecer from '../components/animaciones/Aparecer'
import Buscador from '../components/antojos/Buscador'
import FiltroCategorias from '../components/antojos/FiltroCategorias'
import TarjetaAntojo from '../components/antojos/TarjetaAntojo'
import EstadoMensaje from '../components/EstadoMensaje'
import { buscarCategoria } from '../data/categorias'
import { useFetch } from '../hooks/useFetch'
import { obtenerAntojos } from '../services/ofertasService'

/** Cantidad de tarjetas "fantasma" que se muestran mientras carga el catálogo. */
const TARJETAS_CARGANDO = 8

/**
 * Pasa un texto a minúsculas y le quita las tildes, para que buscar "tecnologia"
 * encuentre "Tecnología".
 *
 * @param {string} texto
 * @returns {string}
 */
function normalizar(texto) {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
}

/**
 * Indica si un antojo coincide con lo que el usuario escribió en el buscador.
 * Busca en el nombre, la marca y el nombre de la categoría.
 *
 * @param {import('../services/ofertasService').Antojo} antojo
 * @param {string} busqueda - Texto ya normalizado.
 * @returns {boolean}
 */
function coincide(antojo, busqueda) {
  if (!busqueda) return true
  const texto = `${antojo.nombre} ${antojo.marca} ${buscarCategoria(antojo.categoria)?.nombre ?? ''}`
  return normalizar(texto).includes(busqueda)
}

/**
 * Tarjeta gris que "late" mientras llegan los productos (esqueleto de carga).
 *
 * @returns {JSX.Element}
 */
function TarjetaCargando() {
  return (
    <div className="animate-pulse rounded-3xl border border-slate-200/80 bg-white/60 p-4 dark:border-slate-700/60 dark:bg-slate-900/50">
      <div className="aspect-square rounded-2xl bg-slate-200 dark:bg-slate-800" />
      <div className="mt-4 h-3 w-1/3 rounded bg-slate-200 dark:bg-slate-800" />
      <div className="mt-3 h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-800" />
      <div className="mt-6 h-6 w-1/2 rounded bg-slate-200 dark:bg-slate-800" />
    </div>
  )
}

/**
 * Página del catálogo de antojos (ruta `/antojos`).
 *
 * - Los productos llegan del servicio de ofertas (DummyJSON + Entretenimiento propio) con `useFetch`.
 * - La categoría y la búsqueda se guardan en la URL (`?categoria=moda&q=reloj`), así el botón
 *   "atrás" del navegador y los enlaces compartidos conservan el filtro.
 * - El filtrado se hace en el navegador con `useMemo`, sin volver a consultar la API.
 *
 * @returns {JSX.Element}
 */
function Antojos() {
  const { datos: antojos, cargando, error, reintentar } = useFetch(obtenerAntojos)
  const [parametros, setParametros] = useSearchParams()
  const categoria = parametros.get('categoria') ?? 'todas'
  const busqueda = parametros.get('q') ?? ''

  /**
   * Cambia un parámetro de la URL sin perder los demás.
   * `replace` evita llenar el historial con una entrada por cada tecla.
   *
   * @param {string} clave - `'categoria'` o `'q'`.
   * @param {string} valor - Nuevo valor; si es el valor por defecto, se quita de la URL.
   */
  const cambiarParametro = (clave, valor) => {
    // Se usa la forma con función para partir siempre de la URL más reciente
    // (si no, al escribir rápido se podía perder la categoría elegida).
    setParametros(
      (actuales) => {
        const nuevos = new URLSearchParams(actuales)
        if (!valor || valor === 'todas') nuevos.delete(clave)
        else nuevos.set(clave, valor)
        return nuevos
      },
      { replace: true },
    )
  }

  // Productos que coinciden con la búsqueda (sin importar la categoría), para los conteos de los chips.
  const coincidenBusqueda = useMemo(() => {
    const texto = normalizar(busqueda.trim())
    return (antojos ?? []).filter((antojo) => coincide(antojo, texto))
  }, [antojos, busqueda])

  const conteos = useMemo(() => {
    const resultado = { todas: coincidenBusqueda.length }
    coincidenBusqueda.forEach((antojo) => {
      resultado[antojo.categoria] = (resultado[antojo.categoria] ?? 0) + 1
    })
    return resultado
  }, [coincidenBusqueda])

  const visibles =
    categoria === 'todas' ? coincidenBusqueda : coincidenBusqueda.filter((antojo) => antojo.categoria === categoria)

  return (
    <div>
      <Aparecer>
        <h1 className="font-titulo text-3xl font-bold sm:text-4xl">
          Encuentra tu próximo{' '}
          <span className="bg-gradient-to-r from-violeta to-rosa bg-clip-text text-transparent">antojo</span>
        </h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Productos con descuento listos para convertirse en tu próxima meta.
        </p>
      </Aparecer>

      <Aparecer orden={1} className="mt-8 space-y-4">
        <Buscador valor={busqueda} onCambiar={(texto) => cambiarParametro('q', texto)} />
        <FiltroCategorias
          seleccionada={categoria}
          onCambiar={(id) => cambiarParametro('categoria', id)}
          conteos={antojos ? conteos : undefined}
        />
      </Aparecer>

      <div className="mt-8">
        {/* Renderizado condicional según el estado de la consulta */}
        {error ? (
          <EstadoMensaje
            Icono={WifiOff}
            titulo="No pudimos traer los antojos"
            texto="Revisa tu conexión a internet e inténtalo de nuevo."
            accion={
              <button
                type="button"
                onClick={reintentar}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violeta to-rosa px-6 py-3 font-semibold text-white shadow-lg shadow-violeta/30"
              >
                <RefreshCw className="size-4" />
                Reintentar
              </button>
            }
          />
        ) : cargando ? (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: TARJETAS_CARGANDO }, (_, i) => (
              <TarjetaCargando key={i} />
            ))}
          </div>
        ) : visibles.length === 0 ? (
          <EstadoMensaje
            Icono={SearchX}
            titulo="Sin resultados"
            texto={`No encontramos antojos para "${busqueda}". Prueba con otra palabra o categoría.`}
          />
        ) : (
          <>
            <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
              {visibles.length} {visibles.length === 1 ? 'antojo' : 'antojos'}
            </p>
            <motion.div layout className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
              <AnimatePresence mode="popLayout">
                {visibles.map((antojo, i) => (
                  <motion.div
                    key={antojo.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    // Solo las primeras tarjetas esperan en cascada; las demás aparecen enseguida.
                    transition={{ duration: 0.35, delay: Math.min(i, 8) * 0.04 }}
                  >
                    <TarjetaAntojo antojo={antojo} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </>
        )}
      </div>
    </div>
  )
}

export default Antojos
