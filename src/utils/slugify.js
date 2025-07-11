function slugify(text) {
  return text
    .toString()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Quitar acentos
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // Reemplazar no alfanumérico por guion
    .replace(/^-+|-+$/g, ''); // Quitar guiones al inicio/final
}

export default slugify; 