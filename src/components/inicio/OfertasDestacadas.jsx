import Aparecer from '../animaciones/Aparecer'
import TarjetaAntojo from '../antojos/TarjetaAntojo'
import { useFetch } from '../../hooks/useFetch'
import { obtenerAntojos } from '../../services/ofertasService'

/** Cuántas ofertas se muestran en Inicio. */
const CANTIDAD_OFERTAS = 4

/**
 * Elige los antojos con mayor descuento del catálogo.
 *
 * @param {import('../../services/ofertasService').Antojo[]} antojos
 * @param {number} [cantidad=CANTIDAD_OFERTAS]
 * @returns {import('../../services/ofertasService').Antojo[]}
 */
function mejoresOfertas(antojos, cantidad = CANTIDAD_OFERTAS) {
  return [...antojos]
    .filter((antojo) => antojo.descuento > 0)
    .sort((a, b) => b.descuento - a.descuento)
    .slice(0, cantidad)
}

/**
 * Ofertas destacadas de Inicio: los antojos con mayor descuento, con la misma tarjeta del catálogo.
 * Si el catálogo no carga, la sección no se muestra (Inicio sigue funcionando sin ella).
 *
 * @returns {JSX.Element | null}
 */
function OfertasDestacadas() {
  const { datos: antojos, cargando, error } = useFetch(obtenerAntojos)

  if (error) return null

  if (cargando) {
    return (
      <div className="grid animate-pulse gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: CANTIDAD_OFERTAS }, (_, i) => (
          <div key={i} className="aspect-[3/4] rounded-3xl bg-slate-200 dark:bg-slate-800" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {mejoresOfertas(antojos ?? []).map((antojo, i) => (
        <Aparecer key={antojo.id} orden={i}>
          <TarjetaAntojo antojo={antojo} />
        </Aparecer>
      ))}
    </div>
  )
}

export default OfertasDestacadas
