import { useState, useCallback } from 'react';
import AdminService from '../services/admin.service';

/**
 * Hook personalizado para gestión de imágenes de empresas
 * Proporciona funcionalidades para subir, eliminar, reordenar y marcar como principal
 */
export const useImageUpload = () => {
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);

  /**
   * Validar archivos antes de subir
   */
  const validateFiles = useCallback((files) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxFiles = 10;

    // Verificar cantidad de archivos
    if (files.length > maxFiles) {
      throw new Error(`Máximo ${maxFiles} archivos permitidos`);
    }

    // Verificar cada archivo
    files.forEach((file) => {
      // Verificar tamaño
      if (file.size > maxSize) {
        throw new Error(`El archivo "${file.name}" es demasiado grande. Tamaño máximo: 5MB`);
      }

      // Verificar tipo
      if (!allowedTypes.includes(file.type)) {
        throw new Error(`El archivo "${file.name}" no es un tipo válido. Tipos permitidos: JPG, PNG, WEBP`);
      }
    });

    return true;
  }, []);

  /**
   * Cargar imágenes existentes de una empresa
   */
  const loadImages = useCallback(async (empresaId) => {
    try {
      setError(null);
      const response = await AdminService.obtenerImagenesEmpresa(empresaId);
      setImages(response.imagenes || []);
      return response.imagenes || [];
    } catch (error) {
      console.error('Error al cargar imágenes:', error);
      setError('Error al cargar las imágenes existentes');
      setImages([]);
      return [];
    }
  }, []);

  /**
   * Subir nuevas imágenes
   */
  const uploadImages = useCallback(async (empresaId, files) => {
    try {
      setUploading(true);
      setUploadProgress(0);
      setError(null);

      // Validar archivos
      validateFiles(files);

      // Simular progreso
      setUploadProgress(25);

      // Subir archivos
      const response = await AdminService.subirImagenes(empresaId, files);
      
      setUploadProgress(75);

      // Recargar imágenes para obtener estado actualizado
      const imagenesActualizadas = await loadImages(empresaId);
      
      setUploadProgress(100);

      return {
        success: true,
        message: response.mensaje,
        imagenes: imagenesActualizadas
      };

    } catch (error) {
      console.error('Error al subir imágenes:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Error al subir las imágenes';
      setError(errorMessage);
      
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  }, [validateFiles, loadImages]);

  /**
   * Eliminar una imagen
   */
  const deleteImage = useCallback(async (empresaId, imagenId) => {
    try {
      setError(null);
      
      await AdminService.eliminarImagen(empresaId, imagenId);
      
      // Actualizar estado local removiendo la imagen
      setImages(prev => prev.filter(img => img.id !== imagenId));
      
      return {
        success: true,
        message: 'Imagen eliminada exitosamente'
      };

    } catch (error) {
      console.error('Error al eliminar imagen:', error);
      const errorMessage = error.response?.data?.error || 'Error al eliminar la imagen';
      setError(errorMessage);
      
      return {
        success: false,
        error: errorMessage
      };
    }
  }, []);

  /**
   * Marcar imagen como principal
   */
  const markAsPrincipal = useCallback(async (empresaId, imagenId) => {
    try {
      setError(null);
      
      await AdminService.marcarImagenPrincipal(empresaId, imagenId);
      
      // Actualizar estado local
      setImages(prev => prev.map(img => ({
        ...img,
        EsPrincipal: img.id === imagenId
      })));
      
      return {
        success: true,
        message: 'Imagen marcada como principal'
      };

    } catch (error) {
      console.error('Error al marcar como principal:', error);
      const errorMessage = error.response?.data?.error || 'Error al marcar imagen como principal';
      setError(errorMessage);
      
      return {
        success: false,
        error: errorMessage
      };
    }
  }, []);

  /**
   * Reordenar imágenes
   */
  const reorderImages = useCallback(async (empresaId, newOrder) => {
    try {
      setError(null);
      
      // Actualizar estado local inmediatamente para mejor UX
      const ordenIds = newOrder.map(img => img.id);
      setImages(newOrder);
      
      // Enviar nuevo orden al servidor
      await AdminService.reordenarImagenes(empresaId, ordenIds);
      
      return {
        success: true,
        message: 'Imágenes reordenadas exitosamente'
      };

    } catch (error) {
      console.error('Error al reordenar imágenes:', error);
      const errorMessage = error.response?.data?.error || 'Error al reordenar las imágenes';
      setError(errorMessage);
      
      // Revertir cambios en caso de error
      await loadImages(empresaId);
      
      return {
        success: false,
        error: errorMessage
      };
    }
  }, [loadImages]);

  /**
   * Limpiar errores
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Limpiar estado
   */
  const resetState = useCallback(() => {
    setImages([]);
    setUploading(false);
    setUploadProgress(0);
    setError(null);
  }, []);

  return {
    // Estado
    images,
    uploading,
    uploadProgress,
    error,
    
    // Funciones
    loadImages,
    uploadImages,
    deleteImage,
    markAsPrincipal,
    reorderImages,
    clearError,
    resetState,
    
    // Utilidades
    validateFiles
  };
};
