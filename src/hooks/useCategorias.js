import { useState, useEffect, useCallback } from 'react';
import CategoriasService from '../services/categorias';

/**
 * Hook personalizado para gestionar categorías
 */
export const useCategorias = (options = {}) => {
  const {
    autoLoad = true,
    filterActive = true,
    onError = null
  } = options;

  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Cargar categorías
   */
  const cargarCategorias = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = {
        activo: filterActive,
        includeInactive: !filterActive,
        ...params
      };

      const data = await CategoriasService.getCategorias(queryParams);
      setCategorias(data);
      
      return { success: true, data };
    } catch (error) {
      const mensaje = error.response?.data?.error || 'Error al cargar categorías';
      setError(mensaje);
      
      if (onError) {
        onError(error);
      }
      
      console.error('Error en useCategorias:', error);
      return { success: false, error: mensaje };
    } finally {
      setLoading(false);
    }
  }, [filterActive, onError]);

  /**
   * Obtener categoría por ID
   */
  const obtenerCategoriaPorId = async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      const categoria = await CategoriasService.getCategoriaPorId(id);
      return { success: true, data: categoria };
    } catch (error) {
      const mensaje = error.response?.data?.error || 'Error al obtener categoría';
      setError(mensaje);
      return { success: false, error: mensaje };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Obtener categoría por slug
   */
  const obtenerCategoriaPorSlug = async (slug) => {
    try {
      setLoading(true);
      setError(null);
      
      const categoria = await CategoriasService.getCategoriaPorSlug(slug);
      return { success: true, data: categoria };
    } catch (error) {
      const mensaje = error.response?.data?.error || 'Error al obtener categoría';
      setError(mensaje);
      return { success: false, error: mensaje };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Recargar categorías
   */
  const recargar = useCallback(() => {
    return cargarCategorias();
  }, [cargarCategorias]);

  /**
   * Limpiar error
   */
  const limpiarError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Buscar categorías
   */
  const buscarCategorias = useCallback((termino) => {
    if (!termino.trim()) {
      return categorias;
    }

    const terminoLower = termino.toLowerCase();
    return categorias.filter(categoria => 
      categoria.Nombre.toLowerCase().includes(terminoLower) ||
      (categoria.Descripcion && categoria.Descripcion.toLowerCase().includes(terminoLower)) ||
      categoria.Slug.toLowerCase().includes(terminoLower)
    );
  }, [categorias]);

  /**
   * Obtener categorías por tipo de icono
   */
  const obtenerPorTipoIcono = useCallback((tipo) => {
    return categorias.filter(categoria => categoria.TipoIcono === tipo);
  }, [categorias]);

  /**
   * Obtener estadísticas de categorías
   */
  const estadisticas = useCallback(() => {
    const total = categorias.length;
    const activas = categorias.filter(c => c.Activo).length;
    const inactivas = total - activas;
    
    const porTipo = categorias.reduce((acc, categoria) => {
      acc[categoria.TipoIcono] = (acc[categoria.TipoIcono] || 0) + 1;
      return acc;
    }, {});

    const conEmpresas = categorias.filter(c => c._count?.Empresas > 0).length;

    return {
      total,
      activas,
      inactivas,
      porTipo,
      conEmpresas
    };
  }, [categorias]);

  // Auto-cargar categorías al montar
  useEffect(() => {
    if (autoLoad) {
      cargarCategorias();
    }
  }, [autoLoad, cargarCategorias]);

  return {
    // Estado
    categorias,
    loading,
    error,
    
    // Acciones
    cargarCategorias,
    obtenerCategoriaPorId,
    obtenerCategoriaPorSlug,
    recargar,
    limpiarError,
    
    // Utilidades
    buscarCategorias,
    obtenerPorTipoIcono,
    estadisticas
  };
};

/**
 * Hook específico para administración de categorías (con operaciones CRUD)
 */
export const useCategoriasAdmin = () => {
  const {
    categorias,
    loading,
    error,
    cargarCategorias,
    obtenerCategoriaPorId,
    limpiarError
  } = useCategorias({ 
    filterActive: false // En admin mostrar todas las categorías
  });

  /**
   * Crear categoría
   */
  const crearCategoria = async (categoriaData) => {
    try {
      const response = await CategoriasService.crearCategoria(categoriaData);
      
      // Recargar la lista
      await cargarCategorias();
      
      return { success: true, data: response.categoria };
    } catch (error) {
      const mensaje = error.response?.data?.error || 'Error al crear categoría';
      return { success: false, error: mensaje };
    }
  };

  /**
   * Actualizar categoría
   */
  const actualizarCategoria = async (id, categoriaData) => {
    try {
      const response = await CategoriasService.actualizarCategoria(id, categoriaData);
      
      // Recargar la lista para obtener datos actualizados
      await cargarCategorias();
      
      return { success: true, data: response.categoria };
    } catch (error) {
      const mensaje = error.response?.data?.error || 'Error al actualizar categoría';
      return { success: false, error: mensaje };
    }
  };

  /**
   * Eliminar categoría
   */
  const eliminarCategoria = async (id) => {
    try {
      await CategoriasService.eliminarCategoria(id);
      
      // Recargar la lista
      await cargarCategorias();
      
      return { success: true };
    } catch (error) {
      const mensaje = error.response?.data?.error || 'Error al eliminar categoría';
      return { success: false, error: mensaje };
    }
  };

  /**
   * Cambiar estado activo/inactivo
   */
  const toggleActivo = async (id) => {
    try {
      const response = await CategoriasService.toggleActivoCategoria(id);
      
      // Recargar la lista
      await cargarCategorias();
      
      return { success: true, data: response.categoria };
    } catch (error) {
      const mensaje = error.response?.data?.error || 'Error al cambiar estado';
      return { success: false, error: mensaje };
    }
  };

  return {
    // Estado heredado
    categorias,
    loading,
    error,
    
    // Acciones heredadas
    cargarCategorias,
    obtenerCategoriaPorId,
    limpiarError,
    
    // Acciones CRUD
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria,
    toggleActivo
  };
};
