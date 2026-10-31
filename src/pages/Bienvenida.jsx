/**
 * Página de bienvenida (ruta `/bienvenida`).
 * Solo se muestra la primera vez: recorrido de tres pantallas y perfil rápido
 * con el nombre y el ahorro mensual del usuario.
 *
 * Por ahora es un marcador de posición; el recorrido se construye en una etapa posterior.
 *
 * @returns {JSX.Element}
 */
function Bienvenida() {
  return (
    <main className="min-h-screen grid place-items-center p-6 text-center">
      <div>
        <h1 className="font-titulo text-4xl font-bold bg-gradient-to-r from-violeta to-rosa bg-clip-text text-transparent">
          Bienvenida
        </h1>
        <p className="mt-3 text-slate-500 dark:text-slate-400">
          Aquí irá el recorrido de tres pantallas y el perfil rápido.
        </p>
      </div>
    </main>
  )
}

export default Bienvenida
