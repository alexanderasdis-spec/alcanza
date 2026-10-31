import { useCallback, useEffect, useMemo, useState } from 'react'

/**
 * Hook personalizado para consultar datos de forma asíncrona (APIs externas o la API de Laravel).
 * Se encarga de los tres estados de toda consulta: cargando, error y datos listos.
 *
 * Recibe una función que devuelve una promesa (normalmente una función de `services/`),
 * en lugar de una URL, para que las páginas nunca hablen directo con las APIs.
 *
 * Importante: la función debe ser estable. Si depende de algo (como un `id`),
 * se envuelve en `useCallback` para que solo cambie cuando ese algo cambia.
 *
 * @template T
 * @param {() => Promise<T>} cargar - Función que trae los datos.
 * @returns {{ datos: T | null, cargando: boolean, error: Error | null, reintentar: () => void }}
 *
 * @example
 * const { datos: antojos, cargando, error, reintentar } = useFetch(obtenerAntojos)
 *
 * const cargarAntojo = useCallback(() => obtenerAntojo(id), [id])
 * const { datos: antojo } = useFetch(cargarAntojo)
 */
export function useFetch(cargar) {
  // Cambiar este número obliga a repetir la consulta (botón "Reintentar").
  const [intento, setIntento] = useState(0)

  // Cada consulta tiene su propio "ticket": un objeto nuevo cuando cambia la función o el intento.
  const consulta = useMemo(() => ({ cargar, intento }), [cargar, intento])

  // La última respuesta recibida, junto con el ticket de la consulta que la pidió.
  const [respuesta, setRespuesta] = useState({ consulta: null, datos: null, error: null })

  useEffect(() => {
    // Evita guardar una respuesta vieja si el componente se desmontó
    // o si empezó otra consulta antes de que esta terminara.
    let vigente = true
    consulta
      .cargar()
      .then((datos) => vigente && setRespuesta({ consulta, datos, error: null }))
      .catch((error) => vigente && setRespuesta({ consulta, datos: null, error }))
    return () => {
      vigente = false
    }
  }, [consulta])

  const reintentar = useCallback(() => setIntento((n) => n + 1), [])

  // Si la respuesta guardada no es de la consulta actual, es porque la actual sigue cargando.
  const cargando = respuesta.consulta !== consulta

  return {
    datos: cargando ? null : respuesta.datos,
    cargando,
    error: cargando ? null : respuesta.error,
    reintentar,
  }
}
