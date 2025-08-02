import axiosClient from '../lib/Axios.js';

/**
 * Servicio centralizado para gestión de ubicaciones geográficas
 * Maneja toda la lógica de ciudades y departamentos
 */
class UbicacionService {
  
  /**
   * Obtener todos los departamentos
   * @param {boolean} incluirCiudades - Si incluir las ciudades de cada departamento
   * @returns {Promise<Array>} Lista de departamentos
   */
  async getDepartamentos(incluirCiudades = true) {
    try {
      const response = await axiosClient.get('/api/departamentos', {
        params: { incluirCiudades: incluirCiudades.toString() }
      });
      return response.data;
    } catch (error) {
      console.error('❌ Error al obtener departamentos:', error);
      throw new Error(error.response?.data?.error || 'Error al cargar departamentos');
    }
  }

  /**
   * Obtener un departamento específico por ID
   * @param {number} departamentoId - ID del departamento
   * @returns {Promise<Object>} Departamento con sus ciudades
   */
  async getDepartamentoPorId(departamentoId) {
    try {
      const response = await axiosClient.get(`/api/departamentos/${departamentoId}`);
      return response.data;
    } catch (error) {
      console.error('❌ Error al obtener departamento:', error);
      throw new Error(error.response?.data?.error || 'Error al cargar departamento');
    }
  }

  /**
   * Obtener todas las ciudades con filtros opcionales
   * @param {Object} filtros - Filtros para las ciudades
   * @param {number} filtros.departamentoId - ID del departamento
   * @param {string} filtros.busqueda - Término de búsqueda
   * @returns {Promise<Array>} Lista de ciudades
   */
  async getCiudades(filtros = {}) {
    try {
      const params = {};
      
      if (filtros.departamentoId) {
        params.departamentoId = filtros.departamentoId;
      }
      
      if (filtros.busqueda) {
        params.busqueda = filtros.busqueda;
      }
      
      const response = await axiosClient.get('/api/ciudades', { params });
      return response.data;
    } catch (error) {
      console.error('❌ Error al obtener ciudades:', error);
      throw new Error(error.response?.data?.error || 'Error al cargar ciudades');
    }
  }

  /**
   * Obtener ciudades de un departamento específico
   * @param {number} departamentoId - ID del departamento
   * @param {string} busqueda - Término de búsqueda opcional
   * @returns {Promise<Object>} Departamento con sus ciudades
   */
  async getCiudadesPorDepartamento(departamentoId, busqueda = '') {
    try {
      const params = {};
      
      if (busqueda) {
        params.busqueda = busqueda;
      }
      
      const response = await axiosClient.get(`/api/departamentos/${departamentoId}/ciudades`, { params });
      return response.data;
    } catch (error) {
      console.error('❌ Error al obtener ciudades del departamento:', error);
      throw new Error(error.response?.data?.error || 'Error al cargar ciudades');
    }
  }

  /**
   * Obtener una ciudad específica por ID
   * @param {number} ciudadId - ID de la ciudad
   * @returns {Promise<Object>} Ciudad con información del departamento
   */
  async getCiudadPorId(ciudadId) {
    try {
      const response = await axiosClient.get(`/api/ciudades/${ciudadId}`);
      return response.data;
    } catch (error) {
      console.error('❌ Error al obtener ciudad:', error);
      throw new Error(error.response?.data?.error || 'Error al cargar ciudad');
    }
  }

  /**
   * Buscar ciudades por término de búsqueda
   * @param {string} termino - Término de búsqueda
   * @param {number} departamentoId - ID del departamento (opcional)
   * @returns {Promise<Array>} Lista de ciudades que coinciden
   */
  async buscarCiudades(termino, departamentoId = null) {
    try {
      const filtros = { busqueda: termino };
      
      if (departamentoId) {
        filtros.departamentoId = departamentoId;
      }
      
      return await this.getCiudades(filtros);
    } catch (error) {
      console.error('❌ Error en búsqueda de ciudades:', error);
      throw error;
    }
  }

  /**
   * Obtener estadísticas geográficas (solo admin)
   * @returns {Promise<Object>} Estadísticas completas
   */
  async getEstadisticasGeograficas() {
    try {
      const response = await axiosClient.get('/api/departamentos/stats');
      return response.data;
    } catch (error) {
      console.error('❌ Error al obtener estadísticas:', error);
      throw new Error(error.response?.data?.error || 'Error al cargar estadísticas');
    }
  }

  // ===== MÉTODOS ADMIN (CRUD) =====

  /**
   * Crear nueva ciudad (solo admin)
   * @param {Object} ciudadData - Datos de la ciudad
   * @param {string} ciudadData.Nombre - Nombre de la ciudad
   * @param {number} ciudadData.departamentoId - ID del departamento
   * @returns {Promise<Object>} Ciudad creada
   */
  async crearCiudad(ciudadData) {
    try {
      const response = await axiosClient.post('/api/ciudades', ciudadData);
      return response.data;
    } catch (error) {
      console.error('❌ Error al crear ciudad:', error);
      throw new Error(error.response?.data?.error || 'Error al crear ciudad');
    }
  }

  /**
   * Actualizar ciudad existente (solo admin)
   * @param {number} ciudadId - ID de la ciudad
   * @param {Object} ciudadData - Datos actualizados
   * @returns {Promise<Object>} Ciudad actualizada
   */
  async actualizarCiudad(ciudadId, ciudadData) {
    try {
      const response = await axiosClient.put(`/api/ciudades/${ciudadId}`, ciudadData);
      return response.data;
    } catch (error) {
      console.error('❌ Error al actualizar ciudad:', error);
      throw new Error(error.response?.data?.error || 'Error al actualizar ciudad');
    }
  }

  /**
   * Eliminar ciudad (solo admin)
   * @param {number} ciudadId - ID de la ciudad
   * @returns {Promise<Object>} Resultado de la eliminación
   */
  async eliminarCiudad(ciudadId) {
    try {
      const response = await axiosClient.delete(`/api/ciudades/${ciudadId}`);
      return response.data;
    } catch (error) {
      console.error('❌ Error al eliminar ciudad:', error);
      throw new Error(error.response?.data?.error || 'Error al eliminar ciudad');
    }
  }

  /**
   * Crear nuevo departamento (solo admin)
   * @param {Object} departamentoData - Datos del departamento
   * @param {string} departamentoData.Nombre - Nombre del departamento
   * @returns {Promise<Object>} Departamento creado
   */
  async crearDepartamento(departamentoData) {
    try {
      const response = await axiosClient.post('/api/departamentos', departamentoData);
      return response.data;
    } catch (error) {
      console.error('❌ Error al crear departamento:', error);
      throw new Error(error.response?.data?.error || 'Error al crear departamento');
    }
  }

  /**
   * Actualizar departamento existente (solo admin)
   * @param {number} departamentoId - ID del departamento
   * @param {Object} departamentoData - Datos actualizados
   * @returns {Promise<Object>} Departamento actualizado
   */
  async actualizarDepartamento(departamentoId, departamentoData) {
    try {
      const response = await axiosClient.put(`/api/departamentos/${departamentoId}`, departamentoData);
      return response.data;
    } catch (error) {
      console.error('❌ Error al actualizar departamento:', error);
      throw new Error(error.response?.data?.error || 'Error al actualizar departamento');
    }
  }

  /**
   * Eliminar departamento (solo admin)
   * @param {number} departamentoId - ID del departamento
   * @returns {Promise<Object>} Resultado de la eliminación
   */
  async eliminarDepartamento(departamentoId) {
    try {
      const response = await axiosClient.delete(`/api/departamentos/${departamentoId}`);
      return response.data;
    } catch (error) {
      console.error('❌ Error al eliminar departamento:', error);
      throw new Error(error.response?.data?.error || 'Error al eliminar departamento');
    }
  }
}

// Exportar instancia única (singleton)
export default new UbicacionService();
