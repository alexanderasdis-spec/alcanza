import confetti from 'canvas-confetti'

/**
 * Celebración de Alcanza: confeti con los colores de la paleta "Fintech festival".
 *
 * @module utils/celebrar
 */

/** Colores del confeti: violeta, rosa, amarillo y menta. */
const COLORES = ['#7c3aed', '#ec4899', '#facc15', '#10b981']

/**
 * Lanza confeti desde las dos esquinas inferiores de la pantalla durante un momento,
 * como en el cierre de un festival. Se usa cuando una meta llega al 100 %.
 *
 * Respeta la opción "reducir movimiento" del sistema: en ese caso no lanza nada.
 *
 * @param {number} [duracion=1800] - Milisegundos que dura la lluvia de confeti.
 * @returns {void}
 *
 * @example
 * if (recienCumplida) lanzarConfeti()
 */
export function lanzarConfeti(duracion = 1800) {
  const fin = Date.now() + duracion
  const opciones = { particleCount: 6, spread: 70, startVelocity: 55, colors: COLORES, disableForReducedMotion: true }

  // Cada cuadro de animación lanza un poco de confeti desde cada lado, hasta que se acaba el tiempo.
  const lanzar = () => {
    confetti({ ...opciones, angle: 60, origin: { x: 0, y: 0.9 } })
    confetti({ ...opciones, angle: 120, origin: { x: 1, y: 0.9 } })
    if (Date.now() < fin) requestAnimationFrame(lanzar)
  }
  lanzar()
}
