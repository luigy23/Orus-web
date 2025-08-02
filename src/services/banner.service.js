// src/services/banner.service.js
import axios from '../lib/Axios';

/**
 * Servicio para gestión de banners
 */
class BannerService {
  
  /**
   * Obtener todos los banners (para admin)
   */
  static async getBanners() {
    try {
      const response = await axios.get('/api/banners');
      return response.data;
    } catch (error) {
      console.error('❌ Error en BannerService.getBanners:', error);
      throw error;
    }
  }

  /**
   * Obtener banners activos (para frontend público)
   */
  static async getBannersActivos() {
    try {
      const response = await axios.get('/api/banners/activos');
      return response.data;
    } catch (error) {
      console.error('❌ Error en BannerService.getBannersActivos:', error);
      throw error;
    }
  }

  /**
   * Obtener un banner específico por ID
   */
  static async getBannerPorId(id) {
    try {
      const response = await axios.get(`/api/banners/${id}`);
      return response.data;
    } catch (error) {
      console.error('❌ Error en BannerService.getBannerPorId:', error);
      throw error;
    }
  }

  /**
   * Crear un nuevo banner
   */
  static async crearBanner(datoBanner) {
    try {
      const response = await axios.post('/api/banners', datoBanner);
      return response.data;
    } catch (error) {
      console.error('❌ Error en BannerService.crearBanner:', error);
      throw error;
    }
  }

  /**
   * Actualizar un banner existente
   */
  static async actualizarBanner(id, datoBanner) {
    try {
      const response = await axios.put(`/api/banners/${id}`, datoBanner);
      return response.data;
    } catch (error) {
      console.error('❌ Error en BannerService.actualizarBanner:', error);
      throw error;
    }
  }

  /**
   * Eliminar un banner
   */
  static async eliminarBanner(id) {
    try {
      const response = await axios.delete(`/api/banners/${id}`);
      return response.data;
    } catch (error) {
      console.error('❌ Error en BannerService.eliminarBanner:', error);
      throw error;
    }
  }

  /**
   * Activar/desactivar un banner
   */
  static async toggleBanner(id) {
    try {
      const response = await axios.patch(`/api/banners/${id}/toggle`);
      return response.data;
    } catch (error) {
      console.error('❌ Error en BannerService.toggleBanner:', error);
      throw error;
    }
  }
}

export default BannerService;
