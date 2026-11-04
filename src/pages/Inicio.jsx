import { useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, CalendarHeart, PiggyBank, Sparkles, Target, Trophy } from 'lucide-react'
import Aparecer from '../components/animaciones/Aparecer'
import BarraProgreso from '../components/animaciones/BarraProgreso'
import ContadorAnimado from '../components/animaciones/ContadorAnimado'
import EtiquetaDescuento from '../components/animaciones/EtiquetaDescuento'
import Magnetico from '../components/animaciones/Magnetico'
import TarjetaInteractiva from '../components/animaciones/TarjetaInteractiva'
import { useMetas, useResumenMetas } from '../hooks/useMetas'
import { useMoneda } from '../hooks/useMoneda'
import { usePerfil } from '../hooks/usePerfil'
import { mesesParaAlcanzar } from '../utils/calculos'
import { formatearMoneda } from '../utils/formato'
import { CURVA_SALIDA } from '../utils/animaciones'

/** Cuántas metas se muestran en Inicio; el resto está en "Mis metas". */
const METAS_EN_INICIO = 3

/**
 * Arma las cifras del resumen a partir del perfil y de las metas reales.
 * Los montos llegan en pesos y se pasan a la moneda elegida.
 *
 * @param {number} ahorroMensual - Ahorro mensual del perfil, en COP.
 * @param {{ activas: number, ahorrado: number }} resumen - Resumen de las metas (ahorrado en COP).
 * @param {(valor: number) => number} aMonedaElegida - Convierte un valor en COP a la moneda elegida.
 * @param {(valor: number) => string} formatoMoneda - Formatea un valor ya convertido.
 * @returns {{ titulo: string, valor: number, formato?: (v: number) => string, Icono: import('lucide-react').LucideIcon, color: string }[]}
 */
const armarResumen = (ahorroMensual, resumen, aMonedaElegida, formatoMoneda) => [
  { titulo: 'Ahorro mensual', valor: aMonedaElegida(ahorroMensual), formato: formatoMoneda, Icono: PiggyBank, color: 'text-menta' },
  { titulo: 'Metas activas', valor: resumen.activas, Icono: Target, color: 'text-violeta dark:text-violet-300' },
  { titulo: 'Ya ahorrado', valor: aMonedaElegida(resumen.ahorrado), formato: formatoMoneda, Icono: Sparkles, color: 'text-rosa' },
]

/**
 * Página de inicio (ruta `/`).
 * Saludo con el nombre del perfil, resumen de las metas (activas y total ahorrado)
 * y las metas más recientes con su progreso.
 *
 * @returns {JSX.Element}
 */
function Inicio() {
  // RequierePerfil garantiza que aquí el perfil ya existe.
  const { perfil } = usePerfil()
  const { metas, cargando } = useMetas()
  const resumen = useResumenMetas(metas)
  const { moneda, convertir, formatear } = useMoneda()
  // Primero las metas en progreso, que son las que todavía necesitan abonos.
  const destacadas = [...metas].sort((a, b) => (a.estado === b.estado ? 0 : a.estado === 'en_progreso' ? -1 : 1)).slice(0, METAS_EN_INICIO)

  // Mientras no hay tasas, convertir() devuelve null: los montos se quedan en pesos.
  const hayConversion = convertir(1, 'COP') !== null
  const monedaVisible = hayConversion ? moneda : 'COP'
  const aMonedaElegida = (valor) => convertir(valor, 'COP') ?? valor
  // Estable mientras no cambie la moneda, para que los contadores no reinicien sin motivo.
  const formatoMoneda = useCallback((valor) => formatearMoneda(valor, monedaVisible), [monedaVisible])

  return (
    <div className="space-y-10">
      {/* Banner principal con el degradado violeta → rosa */}
      <Aparecer>
        <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-violeta via-fuchsia-600 to-rosa p-8 text-white shadow-2xl shadow-violeta/30 sm:p-12">
          {/* Destellos decorativos que giran lentamente */}
          <motion.div
            aria-hidden="true"
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
            className="absolute -top-24 -right-24 size-72 rounded-full border-[18px] border-dashed border-white/15"
          />
          <motion.div
            aria-hidden="true"
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute right-16 bottom-8 hidden size-16 rounded-2xl bg-amarillo/90 shadow-lg shadow-amarillo/40 sm:block"
          />

          <div className="relative max-w-xl">
            <p className="font-medium text-white/80">¡Hola, {perfil.nombre}! 👋</p>
            <h1 className="mt-2 font-titulo text-4xl leading-tight font-bold sm:text-5xl">
              {/* Cada palabra entra por separado, en cascada */}
              {'¿Qué te quieres comprar?'.split(' ').map((palabra, i) => (
                <motion.span
                  key={palabra}
                  initial={{ opacity: 0, y: 30, rotate: 6 }}
                  animate={{ opacity: 1, y: 0, rotate: 0 }}
                  transition={{ duration: 0.6, ease: CURVA_SALIDA, delay: 0.2 + i * 0.1 }}
                  className="mr-3 inline-block"
                >
                  {palabra}
                </motion.span>
              ))}
            </h1>
            <p className="mt-4 text-white/85">
              Convierte tu antojo en una meta con fecha y mira cómo cada abono te acerca.
            </p>
            <div className="mt-8">
              <Magnetico>
                <Link
                  to="/antojos"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-violeta shadow-xl transition hover:shadow-2xl hover:shadow-amarillo/40"
                >
                  <Sparkles className="size-5" />
                  Crear antojo
                </Link>
              </Magnetico>
            </div>
          </div>
        </section>
      </Aparecer>

      {/* Resumen con contadores */}
      <section className="grid gap-4 sm:grid-cols-3">
        {armarResumen(perfil.ahorroMensual, resumen, aMonedaElegida, formatoMoneda).map(({ titulo, valor, formato, Icono, color }, i) => (
          <Aparecer key={titulo} orden={i}>
            <TarjetaInteractiva className="p-6" inclinacion={6}>
              <Icono className={`size-7 ${color}`} />
              <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">{titulo}</p>
              <ContadorAnimado valor={valor} formato={formato} className="font-titulo text-3xl font-bold" />
            </TarjetaInteractiva>
          </Aparecer>
        ))}
      </section>

      {/* Metas más recientes */}
      <section>
        <Aparecer className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-titulo text-2xl font-bold">Tus metas</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Los antojos que ya convertiste en meta de ahorro.</p>
          </div>
          {metas.length > 0 && (
            <Link
              to="/metas"
              className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-violeta hover:underline dark:text-violet-300"
            >
              Ver todas
              <ArrowRight className="size-4" />
            </Link>
          )}
        </Aparecer>

        {!cargando && metas.length === 0 ? (
          <Aparecer className="mt-6">
            <TarjetaInteractiva className="flex flex-col items-center p-8 text-center" inclinacion={4}>
              <Sparkles className="size-10 text-violeta dark:text-violet-300" />
              <p className="mt-3 font-titulo text-lg font-semibold">Todavía no tienes metas</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Busca un antojo en el catálogo y toca "Convertir en meta".
              </p>
            </TarjetaInteractiva>
          </Aparecer>
        ) : (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {destacadas.map((meta, i) => {
              const meses = mesesParaAlcanzar(Math.max(0, meta.precioFinal - meta.ahorrado), perfil.ahorroMensual)
              return (
                <Aparecer key={meta.id} orden={i}>
                  <Link to="/metas" className="block h-full rounded-3xl">
                    <TarjetaInteractiva className="h-full p-6">
                      <div className="flex items-start justify-between">
                        <div className="grid size-16 place-items-center overflow-hidden rounded-2xl bg-gradient-to-br from-violeta/15 to-rosa/15 dark:from-violeta/30 dark:to-rosa/30">
                          {meta.imagen ? (
                            <img src={meta.imagen} alt="" className="size-full object-contain p-1.5" />
                          ) : (
                            <Trophy className="size-8 text-violeta dark:text-violet-300" />
                          )}
                        </div>
                        {meta.descuento > 0 && (
                          <EtiquetaDescuento porcentaje={meta.descuento} color={i % 2 ? 'amarillo' : 'rosa'} />
                        )}
                      </div>

                      <h3 className="mt-5 line-clamp-2 font-titulo text-lg font-semibold">{meta.nombreProducto}</h3>
                      <p className="font-titulo text-2xl font-bold text-menta">{formatear(meta.precioFinal, 'COP')}</p>

                      <div className="mt-5 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-500 dark:text-slate-400">Progreso</span>
                          <span className="font-semibold">{meta.progreso} %</span>
                        </div>
                        <BarraProgreso porcentaje={meta.progreso} etiqueta={`Progreso de ${meta.nombreProducto}`} />
                      </div>

                      <p className="mt-4 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                        {meta.estado === 'cumplida' ? (
                          <>
                            <Trophy className="size-4 text-amarillo" />
                            ¡Meta cumplida!
                          </>
                        ) : (
                          <>
                            <CalendarHeart className="size-4 text-rosa" />
                            Lo alcanzas en {meses} {meses === 1 ? 'mes' : 'meses'}
                          </>
                        )}
                      </p>
                    </TarjetaInteractiva>
                  </Link>
                </Aparecer>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}

export default Inicio
