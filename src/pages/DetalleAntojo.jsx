import { useParams } from 'react-router-dom'

/**
 * Página de detalle de un antojo (ruta con parámetro `/antojos/:id`).
 * Foto, precio, descuento, fecha en que se logra, simulador "¿y si...?" y botón de compartir.
 *
 * Por ahora solo muestra el `id` que llega en la URL, para comprobar que la ruta funciona.
 *
 * @returns {JSX.Element}
 */
function DetalleAntojo() {
  // useParams lee los parámetros de la URL: en /antojos/5, id vale "5".
  const { id } = useParams()

  return (
    <section>
      <h1 className="font-titulo text-3xl font-bold">Detalle del antojo #{id}</h1>
      <p className="mt-2 text-slate-500 dark:text-slate-400">
        Aquí irá la foto, el precio, la fecha estimada y el simulador "¿y si...?".
      </p>
    </section>
  )
}

export default DetalleAntojo
