import axiosClient from '../../lib/Axios.js';

/**
 * Servicio para administración de categorías
 */
const CategoriasAdminService = {
  // ===== CRUD BÁSICO =====
  
  /**
   * Obtener todas las categorías con información completa para administración
   */
  getCategorias: async (params = {}) => {
    try {
      const { data } = await axiosClient.get('/api/admin/categorias', { params });
      console.log('✅ Categorías admin obtenidas:', data.categorias?.length || 0);
      return data;
    } catch (error) {
      console.error('❌ Error en getCategorias admin:', error);
      throw error;
    }
  },

  /**
   * Obtener una categoría por ID
   */
  getCategoriaPorId: async (id) => {
    try {
      const { data } = await axiosClient.get(`/api/admin/categorias/${id}`);
      console.log('✅ Categoría admin obtenida:', data.categoria?.Nombre);
      return data;
    } catch (error) {
      console.error('❌ Error en getCategoriaPorId admin:', error);
      throw error;
    }
  },

  /**
   * Crear nueva categoría
   */
  crearCategoria: async (categoriaData) => {
    try {
      const { data } = await axiosClient.post('/api/admin/categorias', categoriaData);
      console.log('✅ Categoría creada:', data.categoria?.Nombre);
      return data;
    } catch (error) {
      console.error('❌ Error en crearCategoria:', error);
      throw error;
    }
  },

  /**
   * Actualizar categoría existente
   */
  actualizarCategoria: async (id, categoriaData) => {
    try {
      const { data } = await axiosClient.put(`/api/admin/categorias/${id}`, categoriaData);
      console.log('✅ Categoría actualizada:', data.categoria?.Nombre);
      return data;
    } catch (error) {
      console.error('❌ Error en actualizarCategoria:', error);
      throw error;
    }
  },

  /**
   * Eliminar categoría
   */
  eliminarCategoria: async (id) => {
    try {
      const { data } = await axiosClient.delete(`/api/admin/categorias/${id}`);
      console.log('✅ Categoría eliminada con ID:', id);
      return data;
    } catch (error) {
      console.error('❌ Error en eliminarCategoria:', error);
      throw error;
    }
  },

  // ===== GESTIÓN DE ICONOS =====

  /**
   * Subir archivo de icono (imagen o SVG)
   */
  subirIcono: async (file) => {
    try {
      const formData = new FormData();
      formData.append('icono', file);

      const { data } = await axiosClient.post(
        '/api/admin/categorias/upload-icon',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      console.log('✅ Icono subido:', data.filename);
      return data;
    } catch (error) {
      console.error('❌ Error en subirIcono:', error);
      throw error;
    }
  },

  // ===== OPERACIONES ESPECIALES =====

  /**
   * Reordenar categorías
   */
  reordenarCategorias: async (ordenamiento) => {
    try {
      const { data } = await axiosClient.put('/api/admin/categorias/reordenar', {
        orden: ordenamiento
      });
      console.log('✅ Categorías reordenadas');
      return data;
    } catch (error) {
      console.error('❌ Error en reordenarCategorias:', error);
      throw error;
    }
  },

  /**
   * Activar/desactivar categoría
   */
  toggleActivo: async (id) => {
    try {
      const { data } = await axiosClient.patch(`/api/admin/categorias/${id}/toggle-activo`);
      console.log('✅ Estado de categoría cambiado:', data.categoria?.Nombre);
      return data;
    } catch (error) {
      console.error('❌ Error en toggleActivo:', error);
      throw error;
    }
  }
};

export default CategoriasAdminService;
