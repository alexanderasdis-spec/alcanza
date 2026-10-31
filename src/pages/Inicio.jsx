import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CalendarHeart, Headphones, PiggyBank, Smartphone, Sparkles, Target, Footprints } from 'lucide-react'
import Aparecer from '../components/animaciones/Aparecer'
import BarraProgreso from '../components/animaciones/BarraProgreso'
import ContadorAnimado from '../components/animaciones/ContadorAnimado'
import EtiquetaDescuento from '../components/animaciones/EtiquetaDescuento'
import Magnetico from '../components/animaciones/Magnetico'
import TarjetaInteractiva from '../components/animaciones/TarjetaInteractiva'
import { usePerfil } from '../hooks/usePerfil'
import { formatearMoneda } from '../utils/formato'
import { CURVA_SALIDA } from '../utils/animaciones'

/**
 * Arma las cifras del resumen. El ahorro mensual sale del perfil real;
 * metas activas y ya ahorrado son DATOS DE EJEMPLO hasta construir las metas.
 *
 * @param {number} ahorroMensual - Ahorro mensual del perfil.
 * @returns {{ titulo: string, valor: number, formato?: (v: number) => string, Icono: import('lucide-react').LucideIcon, color: string }[]}
 */
const armarResumen = (ahorroMensual) => [
  { titulo: 'Ahorro mensual', valor: ahorroMensual, formato: formatearMoneda, Icono: PiggyBank, color: 'text-menta' },
  { titulo: 'Metas activas', valor: 3, Icono: Target, color: 'text-violeta dark:text-violet-300' },
  { titulo: 'Ya ahorrado', valor: 1280000, formato: formatearMoneda, Icono: Sparkles, color: 'text-rosa' },
]

/**
 * Antojos de muestra. DATOS DE EJEMPLO hasta conectar la API de productos.
 *
 * @type {{ id: number, nombre: string, precio: number, descuento: number, progreso: number, meses: number, Icono: import('lucide-react').LucideIcon, colorEtiqueta: 'rosa' | 'amarillo' }[]}
 */
const ANTOJOS_EJEMPLO = [
  { id: 1, nombre: 'Audífonos inalámbricos', precio: 420000, descuento: 15, progreso: 72, meses: 1, Icono: Headphones, colorEtiqueta: 'rosa' },
  { id: 2, nombre: 'Celular gama media', precio: 1450000, descuento: 10, progreso: 38, meses: 4, Icono: Smartphone, colorEtiqueta: 'amarillo' },
  { id: 3, nombre: 'Tenis para correr', precio: 380000, descuento: 25, progreso: 90, meses: 1, Icono: Footprints, colorEtiqueta: 'rosa' },
]

/**
 * Página de inicio (ruta `/`).
 * Saludo con el nombre del perfil, resumen de metas y antojos destacados.
 *
 * Salvo el nombre y el ahorro mensual, usa datos de ejemplo para mostrar el sistema de animaciones:
 * banner con texto animado, botón magnético, contadores, tarjetas 3D con foco de luz,
 * etiquetas tipo manilla y barras de progreso con brillo.
 *
 * @returns {JSX.Element}
 */
function Inicio() {
  // RequierePerfil garantiza que aquí el perfil ya existe.
  const { perfil } = usePerfil()

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
        {armarResumen(perfil.ahorroMensual).map(({ titulo, valor, formato, Icono, color }, i) => (
          <Aparecer key={titulo} orden={i}>
            <TarjetaInteractiva className="p-6" inclinacion={6}>
              <Icono className={`size-7 ${color}`} />
              <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">{titulo}</p>
              <ContadorAnimado valor={valor} formato={formato} className="font-titulo text-3xl font-bold" />
            </TarjetaInteractiva>
          </Aparecer>
        ))}
      </section>

      {/* Antojos destacados */}
      <section>
        <Aparecer>
          <h2 className="font-titulo text-2xl font-bold">Tus antojos</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Datos de ejemplo mientras conectamos las APIs.</p>
        </Aparecer>

        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ANTOJOS_EJEMPLO.map((antojo, i) => (
            <Aparecer key={antojo.id} orden={i}>
              <TarjetaInteractiva className="p-6">
                <div className="flex items-start justify-between">
                  <div className="grid size-16 place-items-center rounded-2xl bg-gradient-to-br from-violeta/15 to-rosa/15 dark:from-violeta/30 dark:to-rosa/30">
                    <antojo.Icono className="size-8 text-violeta dark:text-violet-300" />
                  </div>
                  <EtiquetaDescuento porcentaje={antojo.descuento} color={antojo.colorEtiqueta} />
                </div>

                <h3 className="mt-5 font-titulo text-lg font-semibold">{antojo.nombre}</h3>
                <p className="font-titulo text-2xl font-bold text-menta">{formatearMoneda(antojo.precio)}</p>

                <div className="mt-5 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">Progreso</span>
                    <span className="font-semibold">{antojo.progreso}%</span>
                  </div>
                  <BarraProgreso porcentaje={antojo.progreso} etiqueta={`Progreso de ${antojo.nombre}`} />
                </div>

                <p className="mt-4 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <CalendarHeart className="size-4 text-rosa" />
                  Lo alcanzas en {antojo.meses} {antojo.meses === 1 ? 'mes' : 'meses'}
                </p>
              </TarjetaInteractiva>
            </Aparecer>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Inicio
