import { useState, useEffect, useCallback } from 'react';
import CategoriasAdminService from '../services/admin/categorias.admin.service.js';

/**
 * Hook personalizado para manejo de categorías en admin
 */
export const useCategoriasAdmin = () => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  const [filtros, setFiltros] = useState({
    busqueda: '',
    activo: undefined,
    tipoIcono: undefined,
    sortBy: 'Orden',
    sortOrder: 'asc'
  });

  /**
   * Cargar lista de categorías
   */
  const cargarCategorias = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = {
        ...filtros,
        page: pagination.page,
        limit: pagination.limit
      };

      const response = await CategoriasAdminService.getCategorias(params);
      
      setCategorias(response.categorias || []);
      setPagination(prev => ({
        ...prev,
        ...response.pagination
      }));
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Error al cargar categorías';
      setError(errorMsg);
      console.error('Error cargando categorías:', error);
    } finally {
      setLoading(false);
    }
  }, [filtros, pagination.page, pagination.limit]);

  /**
   * Crear nueva categoría
   */
  const crearCategoria = async (categoriaData) => {
    try {
      setLoading(true);
      const response = await CategoriasAdminService.crearCategoria(categoriaData);
      
      // Recargar la lista para reflejar los cambios
      await cargarCategorias();
      
      return { success: true, data: response.categoria };
    } catch (error) {
      const mensaje = error.response?.data?.error || 'Error al crear categoría';
      setError(mensaje);
      return { success: false, error: mensaje };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Actualizar categoría existente
   */
  const actualizarCategoria = async (id, categoriaData) => {
    try {
      setLoading(true);
      const response = await CategoriasAdminService.actualizarCategoria(id, categoriaData);
      
      // Actualizar la categoría en la lista local
      setCategorias(prev => 
        prev.map(cat => 
          cat.id === id ? response.categoria : cat
        )
      );
      
      return { success: true, data: response.categoria };
    } catch (error) {
      const mensaje = error.response?.data?.error || 'Error al actualizar categoría';
      setError(mensaje);
      return { success: false, error: mensaje };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Eliminar categoría
   */
  const eliminarCategoria = async (id) => {
    try {
      setLoading(true);
      await CategoriasAdminService.eliminarCategoria(id);
      
      // Remover de la lista local
      setCategorias(prev => prev.filter(cat => cat.id !== id));
      
      return { success: true };
    } catch (error) {
      const mensaje = error.response?.data?.error || 'Error al eliminar categoría';
      setError(mensaje);
      return { success: false, error: mensaje };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Alternar estado activo/inactivo
   */
  const toggleActivoCategoria = async (id) => {
    try {
      const response = await CategoriasAdminService.toggleActivo(id);
      
      // Actualizar en la lista local
      setCategorias(prev => 
        prev.map(cat => 
          cat.id === id ? response.categoria : cat
        )
      );
      
      return { success: true, data: response.categoria };
    } catch (error) {
      const mensaje = error.response?.data?.error || 'Error al cambiar estado';
      setError(mensaje);
      return { success: false, error: mensaje };
    }
  };

  /**
   * Limpiar error actual
   */
  const clearError = () => setError(null);

  /**
   * Actualizar filtros de búsqueda
   */
  const updateFiltros = (nuevosFiltros) => {
    setFiltros(prev => ({ ...prev, ...nuevosFiltros }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset a página 1
  };

  /**
   * Cambiar página
   */
  const changePage = (nuevaPagina) => {
    setPagination(prev => ({ ...prev, page: nuevaPagina }));
  };

  /**
   * Resetear filtros
   */
  const resetFiltros = () => {
    setFiltros({
      busqueda: '',
      activo: undefined,
      tipoIcono: undefined,
      sortBy: 'Orden',
      sortOrder: 'asc'
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Cargar categorías al montar el componente y cuando cambien filtros/página
  useEffect(() => {
    cargarCategorias();
  }, [cargarCategorias]);

  return {
    // Estado
    categorias,
    loading,
    error,
    pagination,
    filtros,
    
    // Acciones
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria,
    toggleActivoCategoria,
    cargarCategorias,
    clearError,
    updateFiltros,
    resetFiltros,
    changePage
  };
};
