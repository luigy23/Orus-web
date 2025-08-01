/**
 * Utilidades para manejo de imágenes en la aplicación
 */

/**
 * Construye la URL completa para una imagen de empresa
 * @param {string} filename - Nombre del archivo de imagen
 * @returns {string} URL completa de la imagen
 */
export const getImageUrl = (filename) => {
  if (!filename) {
    return 'https://placehold.co/600x400/EEE/31343C';
  }
  
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  return `${baseUrl}/uploads/empresas/${filename}`;
};

/**
 * Obtiene la imagen principal de una empresa o una imagen por defecto
 * @param {Array} imagenes - Array de imágenes de la empresa
 * @returns {string} URL de la imagen principal o imagen por defecto
 */
export const getMainImageUrl = (imagenes) => {
  if (!imagenes || imagenes.length === 0) {
    return 'https://placehold.co/600x400/EEE/31343C';
  }

  // Buscar imagen principal primero
  const imagenPrincipal = imagenes.find(img => img.EsPrincipal);
  if (imagenPrincipal) {
    return getImageUrl(imagenPrincipal.Url);
  }

  // Si no hay imagen principal, usar la primera ordenada por Orden
  const imagenOrdenada = imagenes.sort((a, b) => a.Orden - b.Orden)[0];
  return getImageUrl(imagenOrdenada.Url);
};

/**
 * Obtiene todas las URLs de imágenes de una empresa ordenadas
 * @param {Array} imagenes - Array de imágenes de la empresa
 * @returns {Array} Array de URLs ordenadas
 */
export const getAllImageUrls = (imagenes) => {
  if (!imagenes || imagenes.length === 0) {
    return ['https://placehold.co/600x400/EEE/31343C'];
  }

  return imagenes
    .sort((a, b) => a.Orden - b.Orden)
    .map(img => getImageUrl(img.Url));
};
