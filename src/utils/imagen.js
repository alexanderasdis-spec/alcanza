/**
 * Funciones para preparar imágenes en el navegador antes de enviarlas a la API.
 *
 * @module utils/imagen
 */

/** Tipos de archivo que se aceptan como foto de perfil. */
export const TIPOS_FOTO = ['image/jpeg', 'image/png', 'image/webp']

/** Peso máximo del archivo original (8 MB). Después de recortarlo pesa mucho menos. */
export const PESO_MAXIMO_FOTO = 8 * 1024 * 1024

/** Lado en píxeles de la foto que se guarda. */
const LADO_FOTO = 320

/**
 * Revisa un archivo elegido como foto de perfil.
 *
 * @param {File} archivo
 * @returns {string | undefined} El mensaje de error, o `undefined` si está bien.
 */
export function errorFoto(archivo) {
  if (!TIPOS_FOTO.includes(archivo.type)) return 'La foto debe ser JPG, PNG o WebP.'
  if (archivo.size > PESO_MAXIMO_FOTO) return 'La foto no puede pasar de 8 MB.'
  return undefined
}

/**
 * Recorta el centro de una imagen en un cuadrado y la reduce a 320 × 320 píxeles.
 * Así la foto siempre se ve bien en un círculo y la subida pesa poco.
 *
 * @param {Blob} archivo - Imagen original.
 * @returns {Promise<Blob>} Imagen JPEG lista para subir.
 * @throws {Error} Si el archivo no se puede leer como imagen.
 */
export async function recortarCuadrada(archivo) {
  const imagen = await createImageBitmap(archivo)
  const lado = Math.min(imagen.width, imagen.height)
  const lienzo = document.createElement('canvas')
  lienzo.width = LADO_FOTO
  lienzo.height = LADO_FOTO

  const contexto = lienzo.getContext('2d')
  // JPEG no tiene transparencia: sin este fondo, las zonas transparentes saldrían negras.
  contexto.fillStyle = '#ffffff'
  contexto.fillRect(0, 0, LADO_FOTO, LADO_FOTO)
  contexto.drawImage(imagen, (imagen.width - lado) / 2, (imagen.height - lado) / 2, lado, lado, 0, 0, LADO_FOTO, LADO_FOTO)
  imagen.close()

  return new Promise((resolver, rechazar) => {
    lienzo.toBlob((resultado) => (resultado ? resolver(resultado) : rechazar(new Error('No se pudo crear la imagen'))), 'image/jpeg', 0.9)
  })
}
