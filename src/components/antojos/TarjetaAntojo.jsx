import { Link } from 'react-router-dom'
import { ArrowRight, CalendarHeart, Star } from 'lucide-react'
import TarjetaInteractiva from '../animaciones/TarjetaInteractiva'
import EtiquetaDescuento from '../animaciones/EtiquetaDescuento'
import ImagenAntojo from './ImagenAntojo'
import { buscarCategoria } from '../../data/categorias'
import { useAlcance } from '../../hooks/useAlcance'
import { useMoneda } from '../../hooks/useMoneda'
import { precioConDescuento } from '../../utils/calculos'

/**
 * Tarjeta de un producto del catálogo: foto, descuento, nombre, marca, precio
 * en la moneda elegida y en cuántos meses lo alcanza el usuario con su ahorro.
 * Toda la tarjeta es un enlace a la página de detalle del antojo.
 *
 * @param {Object} props
 * @param {import('../../services/ofertasService').Antojo} props.antojo - Producto a mostrar.
 * @returns {JSX.Element}
 */
function TarjetaAntojo({ antojo }) {
  const categoria = buscarCategoria(antojo.categoria)
  const precioFinal = precioConDescuento(antojo.precio, antojo.descuento)
  const { formatear } = useMoneda()
  const alcance = useAlcance(precioFinal)
  // Se alternan los colores de la manilla para que el catálogo se vea más festivo.
  const colorEtiqueta = Number.parseInt(antojo.id.replace(/\D/g, '') || '0', 10) % 2 ? 'rosa' : 'amarillo'

  return (
    <Link to={`/antojos/${antojo.id}`} className="group block h-full rounded-3xl focus-visible:outline-4 focus-visible:outline-violeta/40">
      <TarjetaInteractiva className="flex h-full flex-col p-4" inclinacion={8}>
        <div className="relative">
          <ImagenAntojo antojo={antojo} className="aspect-square rounded-2xl" />
          {antojo.descuento > 0 && (
            <EtiquetaDescuento porcentaje={antojo.descuento} color={colorEtiqueta} className="absolute -top-1 -right-1" />
          )}
        </div>

        <div className="mt-4 flex flex-1 flex-col">
          <p className="flex items-center justify-between text-xs font-medium tracking-wide text-slate-500 uppercase dark:text-slate-400">
            <span className="truncate">{antojo.marca}</span>
            <span className="ml-2 flex shrink-0 items-center gap-1 normal-case">
              <Star className="size-3.5 fill-amarillo text-amarillo" />
              {antojo.calificacion.toFixed(1)}
            </span>
          </p>
          <h3 className="mt-1 line-clamp-2 font-titulo font-semibold">{antojo.nombre}</h3>
          {categoria && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{categoria.nombre}</p>}

          <div className="mt-auto flex items-end justify-between pt-4">
            <div className="min-w-0">
              {antojo.descuento > 0 && (
                <p className="truncate text-sm text-slate-400 line-through">{formatear(antojo.precio)}</p>
              )}
              <p className="truncate font-titulo text-xl font-bold text-menta">{formatear(precioFinal)}</p>
              {alcance && (
                <p className="mt-1 flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                  <CalendarHeart className="size-3.5 shrink-0 text-rosa" />
                  En {alcance.meses} {alcance.meses === 1 ? 'mes' : 'meses'}
                </p>
              )}
            </div>
            <span className="grid size-9 place-items-center rounded-full bg-violeta/10 text-violeta transition group-hover:bg-violeta group-hover:text-white dark:text-violet-300">
              <ArrowRight className="size-4" />
            </span>
          </div>
        </div>
      </TarjetaInteractiva>
    </Link>
  )
}

export default TarjetaAntojo
