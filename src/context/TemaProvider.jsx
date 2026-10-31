import { useEffect } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { TemaContext } from './temaContext'

/**
 * Revisa si el sistema operativo del usuario está en modo oscuro.
 * Se usa solo la primera vez, cuando todavía no hay una preferencia guardada.
 *
 * @returns {boolean} `true` si el sistema prefiere el tema oscuro.
 */
function sistemaPrefiereOscuro() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

/**
 * Proveedor del tema. Envuelve toda la app para que cualquier componente
 * pueda saber si está activo el modo oscuro y cambiarlo.
 *
 * Pone o quita la clase `dark` en `<html>`, que es la que usa Tailwind
 * (`@custom-variant dark` en `index.css`) para aplicar los estilos oscuros.
 *
 * @param {Object} props
 * @param {import('react').ReactNode} props.children - Componentes que tendrán acceso al tema.
 * @returns {JSX.Element}
 */
export function TemaProvider({ children }) {
  const [oscuro, setOscuro] = useLocalStorage('alcanza-tema-oscuro', sistemaPrefiereOscuro)

  // Sincroniza la clase de <html> con el estado del tema.
  useEffect(() => {
    document.documentElement.classList.toggle('dark', oscuro)
  }, [oscuro])

  /** Cambia de claro a oscuro y viceversa. */
  const alternarTema = () => setOscuro((actual) => !actual)

  return <TemaContext.Provider value={{ oscuro, alternarTema }}>{children}</TemaContext.Provider>
}
