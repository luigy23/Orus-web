import axiosClient from "../lib/Axios.js";

/**
 * Servicio para operaciones administrativas
 * Todas las llamadas requieren permisos de administrador
 */
const AdminService = {
  // ===== EMPRESAS =====
  
  /**
   * Obtener todas las empresas (vista admin)
   */
  getEmpresas: async () => {
    try {
      const { data } = await axiosClient.get("/api/admin/empresas");
      return data;
    } catch (error) {
      console.error("❌ Error en AdminService.getEmpresas:", error);
      throw error;
    }
  },

  /**
   * Crear una nueva empresa
   */
  crearEmpresa: async (empresaData) => {
    try {
      const { data } = await axiosClient.post("/api/admin/empresas", empresaData);
      return data;
    } catch (error) {
      console.error("❌ Error en AdminService.crearEmpresa:", error);
      throw error;
    }
  },

  /**
   * Actualizar una empresa existente
   */
  actualizarEmpresa: async (id, empresaData) => {
    try {
      const { data } = await axiosClient.put(`/api/admin/empresas/${id}`, empresaData);
      return data;
    } catch (error) {
      console.error("❌ Error en AdminService.actualizarEmpresa:", error);
      throw error;
    }
  },

  /**
   * Eliminar una empresa
   */
  eliminarEmpresa: async (id) => {
    try {
      const { data } = await axiosClient.delete(`/api/admin/empresas/${id}`);
      return data;
    } catch (error) {
      console.error("❌ Error en AdminService.eliminarEmpresa:", error);
      throw error;
    }
  },

  // ===== IMÁGENES =====

  /**
   * Subir imágenes a una empresa
   */
  subirImagenes: async (empresaId, imagenes) => {
    try {
      const formData = new FormData();
      
      // Agregar cada imagen al FormData
      imagenes.forEach((imagen, index) => {
        formData.append('imagenes', imagen);
      });

      const { data } = await axiosClient.post(
        `/api/admin/empresas/${empresaId}/imagenes`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return data;
    } catch (error) {
      console.error("❌ Error en AdminService.subirImagenes:", error);
      throw error;
    }
  },

  /**
   * Eliminar una imagen específica
   */
  eliminarImagen: async (empresaId, imagenId) => {
    try {
      const { data } = await axiosClient.delete(
        `/api/admin/empresas/${empresaId}/imagenes/${imagenId}`
      );
      return data;
    } catch (error) {
      console.error("❌ Error en AdminService.eliminarImagen:", error);
      throw error;
    }
  },

  /**
   * Marcar una imagen como principal
   */
  marcarImagenPrincipal: async (empresaId, imagenId) => {
    try {
      const { data } = await axiosClient.put(
        `/api/admin/empresas/${empresaId}/imagenes/${imagenId}/principal`
      );
      return data;
    } catch (error) {
      console.error("❌ Error en AdminService.marcarImagenPrincipal:", error);
      throw error;
    }
  },

  // ===== CATEGORÍAS =====

  /**
   * Obtener todas las categorías disponibles
   */
  getCategorias: async () => {
    try {
      const { data } = await axiosClient.get("/api/categorias");
      return data;
    } catch (error) {
      console.error("❌ Error en AdminService.getCategorias:", error);
      throw error;
    }
  },

  // ===== ESTADÍSTICAS =====

  /**
   * Obtener estadísticas del dashboard
   */
  getEstadisticas: async () => {
    try {
      const { data } = await axiosClient.get("/api/admin/estadisticas");
      return data;
    } catch (error) {
      console.error("❌ Error en AdminService.getEstadisticas:", error);
      throw error;
    }
  },
};

export default AdminService;