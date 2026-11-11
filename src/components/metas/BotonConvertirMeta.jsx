import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CheckCircle2, Sparkles } from 'lucide-react'
import Magnetico from '../animaciones/Magnetico'
import { useAlcance } from '../../hooks/useAlcance'
import { useMetas } from '../../hooks/useMetas'
import { useMoneda } from '../../hooks/useMoneda'
import { mensajeDeError } from '../../services/api'
import { convertirMoneda, precioConDescuento } from '../../utils/calculos'
import { aFechaApi } from '../../utils/formato'

/**
 * Botón "Crear antojo" del detalle: convierte el producto en una meta de ahorro.
 *
 * La meta se guarda en pesos colombianos (la moneda del ahorro del usuario), así que
 * el precio en dólares se convierte con las tasas del día antes de enviarlo a la API.
 * Si el producto ya es una meta, en lugar del botón muestra un enlace a Mis metas.
 *
 * @param {Object} props
 * @param {import('../../services/ofertasService').Antojo} props.antojo - Producto a convertir.
 * @returns {JSX.Element}
 */
function BotonConvertirMeta({ antojo }) {
  const { metas, cargando, crear } = useMetas()
  const { tasas } = useMoneda()
  const alcance = useAlcance(precioConDescuento(antojo.precio, antojo.descuento))
  const navigate = useNavigate()
  const [creando, setCreando] = useState(false)
  const [error, setError] = useState('')

  const yaEsMeta = metas.some((meta) => meta.productoId === antojo.id)

  if (yaEsMeta) {
    return (
      <Link
        to="/metas"
        className="inline-flex items-center gap-2 rounded-full bg-menta/15 px-6 py-3 font-semibold text-emerald-700 dark:text-menta"
      >
        <CheckCircle2 className="size-5" />
        Ya es una de tus metas · Ver progreso
      </Link>
    )
  }

  const alCrear = async () => {
    setCreando(true)
    setError('')
    try {
      await crear({
        productoId: antojo.id,
        nombreProducto: antojo.nombre,
        imagen: antojo.imagen,
        precio: Math.round(convertirMoneda(antojo.precio, 'USD', 'COP', tasas)),
        moneda: 'COP',
        descuento: antojo.descuento,
        fechaEstimada: alcance ? aFechaApi(alcance.fecha) : null,
      })
      navigate('/metas')
    } catch (problema) {
      setError(mensajeDeError(problema, 'No pudimos crear la meta. Revisa que el servidor esté encendido e inténtalo de nuevo.'))
      setCreando(false)
    }
  }

  // Sin tasas no se puede pasar el precio a pesos; mientras cargan las metas no se sabe si ya existe.
  const deshabilitado = creando || cargando || !tasas

  return (
    <div>
      <Magnetico>
        <button
          type="button"
          onClick={alCrear}
          disabled={deshabilitado}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violeta to-rosa px-7 py-3 font-semibold text-white shadow-lg shadow-violeta/30 disabled:opacity-60"
        >
          <Sparkles className="size-5" />
          {creando ? 'Creando tu meta…' : 'Convertir en meta'}
        </button>
      </Magnetico>
      {error && (
        <p role="alert" className="mt-3 text-sm font-medium text-rosa">
          {error}
        </p>
      )}
    </div>
  )
}

export default BotonConvertirMeta
