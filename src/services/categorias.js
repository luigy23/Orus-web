import axiosClient from "../lib/Axios";

/**
 * Servicio para gestión de categorías
 */
const CategoriasService = {
  // ===== OPERACIONES PÚBLICAS =====
  
  /**
   * Obtener todas las categorías activas
   */
  getCategorias: async (params = {}) => {
    try {
      const response = await axiosClient.get('/api/categorias', { params });
      console.log('✅ Categorías obtenidas:', response.data.length);
      return response.data;
    } catch (error) {
      console.error('❌ Error al obtener las categorías:', error);
      throw error;
    }
  },

  /**
   * Obtener categoría por ID
   */
  getCategoriaPorId: async (id) => {
    try {
      const response = await axiosClient.get(`/api/categorias/${id}`);
      console.log('✅ Categoría obtenida:', response.data.Nombre);
      return response.data;
    } catch (error) {
      console.error('❌ Error al obtener la categoría:', error);
      throw error;
    }
  },

  /**
   * Obtener categoría por slug
   */
  getCategoriaPorSlug: async (slug) => {
    try {
      const response = await axiosClient.get(`/api/categorias/slug/${slug}`);
      console.log('✅ Categoría obtenida por slug:', response.data.Nombre);
      return response.data;
    } catch (error) {
      console.error('❌ Error al obtener la categoría por slug:', error);
      throw error;
    }
  },

  // ===== OPERACIONES ADMINISTRATIVAS =====

  /**
   * Crear nueva categoría (requiere autenticación)
   */
  crearCategoria: async (categoriaData) => {
    try {
      const response = await axiosClient.post('/api/categorias', categoriaData);
      console.log('✅ Categoría creada:', response.data.categoria.Nombre);
      return response.data;
    } catch (error) {
      console.error('❌ Error al crear categoría:', error);
      throw error;
    }
  },

  /**
   * Actualizar categoría (requiere autenticación)
   */
  actualizarCategoria: async (id, categoriaData) => {
    try {
      const response = await axiosClient.put(`/api/categorias/${id}`, categoriaData);
      console.log('✅ Categoría actualizada:', response.data.categoria.Nombre);
      return response.data;
    } catch (error) {
      console.error('❌ Error al actualizar categoría:', error);
      throw error;
    }
  },

  /**
   * Eliminar categoría (requiere autenticación)
   */
  eliminarCategoria: async (id) => {
    try {
      const response = await axiosClient.delete(`/api/categorias/${id}`);
      console.log('✅ Categoría eliminada:', response.data.categoria);
      return response.data;
    } catch (error) {
      console.error('❌ Error al eliminar categoría:', error);
      throw error;
    }
  },

  /**
   * Activar/desactivar categoría (requiere autenticación)
   */
  toggleActivoCategoria: async (id) => {
    try {
      const response = await axiosClient.patch(`/api/categorias/${id}/toggle-activo`);
      console.log('✅ Estado de categoría cambiado:', response.data.mensaje);
      return response.data;
    } catch (error) {
      console.error('❌ Error al cambiar estado de categoría:', error);
      throw error;
    }
  }
};

// Exportar como default y named exports para compatibilidad
export default CategoriasService;

// Mantener compatibilidad con el código existente
export const getCategorias = CategoriasService.getCategorias;
export const getCategoriaPorId = CategoriasService.getCategoriaPorId;
export const getCategoriaPorSlug = CategoriasService.getCategoriaPorSlug;