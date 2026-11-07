import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import { TemaProvider } from './context/TemaProvider'
import { AuthProvider } from './context/AuthProvider'
import { PerfilProvider } from './context/PerfilProvider'
import { MonedaProvider } from './context/MonedaProvider'
import { MetasProvider } from './context/MetasProvider'
import FondoAnimado from './components/animaciones/FondoAnimado'
import RequierePerfil from './components/RequierePerfil'
import RequiereSesion from './components/RequiereSesion'
import SoloInvitados from './components/SoloInvitados'
import LayoutPrincipal from './layouts/LayoutPrincipal'
import Bienvenida from './pages/Bienvenida'
import IniciarSesion from './pages/IniciarSesion'
import Registro from './pages/Registro'
import OlvideContrasena from './pages/OlvideContrasena'
import RestablecerContrasena from './pages/RestablecerContrasena'
import Inicio from './pages/Inicio'
import Antojos from './pages/Antojos'
import DetalleAntojo from './pages/DetalleAntojo'
import Comparador from './pages/Comparador'
import MisMetas from './pages/MisMetas'
import NoEncontrada from './pages/NoEncontrada'

/**
 * Componente raíz de Alcanza.
 * Envuelve la app con los proveedores de contexto y define todas las rutas.
 *
 * Orden de los proveedores: la sesión (`AuthProvider`) va por fuera del perfil, y el perfil
 * por fuera de las metas, porque cada uno depende del anterior.
 *
 * `MotionConfig reducedMotion="user"` hace que todas las animaciones de Framer Motion
 * respeten la opción "reducir movimiento" del sistema: se quitan los desplazamientos
 * y solo quedan cambios suaves de opacidad.
 * `FondoAnimado` va por fuera de las rutas para que las luces no se reinicien al cambiar de página.
 *
 * Rutas:
 * - Solo sin sesión (`SoloInvitados`): `/ingresar`, `/registro` y `/olvide-contrasena`.
 * - `/restablecer` es pública: se abre desde el enlace del correo.
 * - Con sesión (`RequiereSesion`): `/bienvenida` (sin menú ni pie) y, dentro de `RequierePerfil`
 *   y `LayoutPrincipal`, el resto de páginas.
 * - `*` atrapa cualquier URL que no exista y muestra la página 404.
 *
 * @returns {JSX.Element}
 */
function App() {
  return (
    <TemaProvider>
      <AuthProvider>
        <PerfilProvider>
          <MetasProvider>
            <MonedaProvider>
              <MotionConfig reducedMotion="user">
                <FondoAnimado />
                <BrowserRouter>
                  <Routes>
                    <Route element={<SoloInvitados />}>
                      <Route path="/ingresar" element={<IniciarSesion />} />
                      <Route path="/registro" element={<Registro />} />
                      <Route path="/olvide-contrasena" element={<OlvideContrasena />} />
                    </Route>
                    <Route path="/restablecer" element={<RestablecerContrasena />} />

                    <Route element={<RequiereSesion />}>
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
                    </Route>
                  </Routes>
                </BrowserRouter>
              </MotionConfig>
            </MonedaProvider>
          </MetasProvider>
        </PerfilProvider>
      </AuthProvider>
    </TemaProvider>
  )
}

export default App
