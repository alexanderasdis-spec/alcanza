import { useEffect, useState } from 'react'

/**
 * Lee el valor guardado en localStorage para una clave.
 * Si no existe o no se puede leer (modo privado, datos corruptos), devuelve el valor inicial.
 *
 * @template T
 * @param {string} clave - Nombre con el que se guarda el dato en localStorage.
 * @param {T | (() => T)} valorInicial - Valor por defecto, o una función que lo calcula.
 * @returns {T} El valor guardado o el valor inicial.
 */
function leerValor(clave, valorInicial) {
  const porDefecto = typeof valorInicial === 'function' ? valorInicial() : valorInicial
  try {
    const guardado = localStorage.getItem(clave)
    return guardado !== null ? JSON.parse(guardado) : porDefecto
  } catch {
    return porDefecto
  }
}

/**
 * Hook personalizado que funciona como `useState`, pero recuerda el valor en localStorage.
 * Así la preferencia sigue ahí aunque el usuario recargue o cierre la página.
 * Solo se usa para preferencias (tema, moneda, recorrido visto), no para datos del usuario.
 *
 * @template T
 * @param {string} clave - Nombre con el que se guarda el dato en localStorage.
 * @param {T | (() => T)} valorInicial - Valor que se usa si todavía no hay nada guardado.
 * @returns {[T, import('react').Dispatch<import('react').SetStateAction<T>>]}
 *   El valor actual y la función para cambiarlo, igual que `useState`.
 *
 * @example
 * const [moneda, setMoneda] = useLocalStorage('alcanza-moneda', 'USD')
 */
export function useLocalStorage(clave, valorInicial) {
  const [valor, setValor] = useState(() => leerValor(clave, valorInicial))

  // Cada vez que el valor cambia, se guarda en localStorage.
  useEffect(() => {
    try {
      localStorage.setItem(clave, JSON.stringify(valor))
    } catch {
      // Si el navegador bloquea localStorage, la app sigue funcionando sin recordar la preferencia.
    }
  }, [clave, valor])

  return [valor, setValor]
}
