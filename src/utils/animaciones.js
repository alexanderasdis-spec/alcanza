/**
 * Ajustes de movimiento compartidos por todas las animaciones de Alcanza.
 *
 * Todos los componentes animados usan estos mismos valores. Así los efectos
 * se sienten como una sola familia: el fondo, las tarjetas y los botones
 * responden al mouse con el mismo "carácter", en lugar de que cada uno se mueva a su manera.
 *
 * @module utils/animaciones
 */

/**
 * Resorte lento y elástico. Para cosas grandes que siguen al mouse
 * con retraso, como las luces del fondo.
 *
 * @type {{ stiffness: number, damping: number, mass: number }}
 */
export const RESORTE_SUAVE = { stiffness: 40, damping: 18, mass: 1.2 }

/**
 * Resorte ágil. Para elementos pequeños que reaccionan al instante,
 * como la inclinación de las tarjetas y los botones magnéticos.
 *
 * @type {{ stiffness: number, damping: number, mass: number }}
 */
export const RESORTE_RAPIDO = { stiffness: 260, damping: 20, mass: 0.6 }

/**
 * Curva de aceleración de las entradas: arranca rápido y frena suave al final.
 *
 * @type {number[]}
 */
export const CURVA_SALIDA = [0.22, 1, 0.36, 1]

/**
 * Transición estándar con la que aparecen los elementos y cambian las páginas.
 *
 * @type {{ duration: number, ease: number[] }}
 */
export const TRANSICION_ENTRADA = { duration: 0.6, ease: CURVA_SALIDA }

/**
 * Segundos de diferencia entre un elemento y el siguiente en una entrada en cascada.
 *
 * @type {number}
 */
export const PASO_CASCADA = 0.08
