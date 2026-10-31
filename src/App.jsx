import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import { TemaProvider } from './context/TemaProvider'
import { PerfilProvider } from './context/PerfilProvider'
import FondoAnimado from './components/animaciones/FondoAnimado'
import RequierePerfil from './components/RequierePerfil'
import LayoutPrincipal from './layouts/LayoutPrincipal'
import Bienvenida from './pages/Bienvenida'
import Inicio from './pages/Inicio'
import Antojos from './pages/Antojos'
import DetalleAntojo from './pages/DetalleAntojo'
import Comparador from './pages/Comparador'
import MisMetas from './pages/MisMetas'
import NoEncontrada from './pages/NoEncontrada'

/**
 * Componente raíz de Alcanza.
 * Envuelve la app con el proveedor del tema y define todas las rutas.
 *
 * `MotionConfig reducedMotion="user"` hace que todas las animaciones de Framer Motion
 * respeten la opción "reducir movimiento" del sistema: se quitan los desplazamientos
 * y solo quedan cambios suaves de opacidad.
 * `FondoAnimado` va por fuera de las rutas para que las luces no se reinicien al cambiar de página.
 *
 * - `/bienvenida` va sin menú ni pie, porque es el recorrido de pantalla completa de la primera visita.
 * - El resto de páginas van dentro de `RequierePerfil` (si no hay perfil, manda a la bienvenida)
 *   y de `LayoutPrincipal` (menú arriba y pie abajo).
 * - `*` atrapa cualquier URL que no exista y muestra la página 404.
 *
 * @returns {JSX.Element}
 */
function App() {
  return (
    <TemaProvider>
      <PerfilProvider>
        <MotionConfig reducedMotion="user">
          <FondoAnimado />
          <BrowserRouter>
            <Routes>
              <Route path="/bienvenida" element={<Bienvenida />} />

              <Route element={<RequierePerfil />}>
                <Route element={<LayoutPrincipal />}>
                  <Route path="/" element={<Inicio />} />
                  <Route path="/antojos" element={<Antojos />} />
                  <Route path="/antojos/:id" element={<DetalleAntojo />} />
                  <Route path="/comparador" element={<Comparador />} />
                  <Route path="/metas" element={<MisMetas />} />
                  <Route path="*" element={<NoEncontrada />} />
                </Route>
              </Route>
            </Routes>
          </BrowserRouter>
        </MotionConfig>
      </PerfilProvider>
    </TemaProvider>
  )
}

export default App
