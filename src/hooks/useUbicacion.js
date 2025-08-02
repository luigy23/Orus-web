import { useState, useEffect, useCallback, useMemo } from 'react';
import UbicacionService from '../services/ubicacion.service.js';

/**
 * Hook para gestionar departamentos
 * @param {boolean} incluirCiudades - Si incluir ciudades en la respuesta
 * @returns {Object} Estado y funciones para departamentos
 */
export const useDepartamentos = (incluirCiudades = true) => {
  const [departamentos, setDepartamentos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDepartamentos = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await UbicacionService.getDepartamentos(incluirCiudades);
      setDepartamentos(data);
    } catch (err) {
      setError(err.message);
      console.error('Error en useDepartamentos:', err);
    } finally {
      setLoading(false);
    }
  }, [incluirCiudades]);

  useEffect(() => {
    fetchDepartamentos();
  }, [fetchDepartamentos]);

  return {
    departamentos,
    loading,
    error,
    refetch: fetchDepartamentos
  };
};

/**
 * Hook para gestionar ciudades con filtros
 * @param {Object} filtros - Filtros para las ciudades
 * @param {number} filtros.departamentoId - ID del departamento
 * @param {string} filtros.busqueda - Término de búsqueda
 * @param {boolean} autoFetch - Si debe cargar automáticamente
 * @returns {Object} Estado y funciones para ciudades
 */
export const useCiudades = (filtros = {}, autoFetch = true) => {
  const [ciudades, setCiudades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Memorizar filtros para evitar recreaciones constantes
  const filtrosMemo = useMemo(() => ({
    departamentoId: filtros.departamentoId,
    busqueda: filtros.busqueda,
    activas: filtros.activas
  }), [
    filtros.departamentoId,
    filtros.busqueda,
    filtros.activas
  ]);

  const fetchCiudades = useCallback(async (nuevosFiltros = filtrosMemo) => {
    // No hacer fetch si no hay departamentoId y autoFetch está activado
    if (autoFetch && !nuevosFiltros.departamentoId && !nuevosFiltros.busqueda) {
      setCiudades([]);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const data = await UbicacionService.getCiudades(nuevosFiltros);
      setCiudades(data);
    } catch (err) {
      setError(err.message);
      console.error('Error en useCiudades:', err);
    } finally {
      setLoading(false);
    }
  }, [filtrosMemo, autoFetch]);

  useEffect(() => {
    if (autoFetch) {
      fetchCiudades();
    }
  }, [fetchCiudades, autoFetch]);

  return {
    ciudades,
    loading,
    error,
    fetchCiudades,
    refetch: () => fetchCiudades(filtros)
  };
};

/**
 * Hook para obtener ciudades de un departamento específico
 * @param {number} departamentoId - ID del departamento
 * @param {string} busqueda - Término de búsqueda opcional
 * @returns {Object} Estado y funciones para ciudades del departamento
 */
export const useCiudadesPorDepartamento = (departamentoId, busqueda = '') => {
  const [data, setData] = useState({ departamento: null, ciudades: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCiudadesDepartamento = useCallback(async () => {
    if (!departamentoId) {
      setData({ departamento: null, ciudades: [] });
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const responseData = await UbicacionService.getCiudadesPorDepartamento(departamentoId, busqueda);
      setData(responseData);
    } catch (err) {
      setError(err.message);
      console.error('Error en useCiudadesPorDepartamento:', err);
    } finally {
      setLoading(false);
    }
  }, [departamentoId, busqueda]);

  useEffect(() => {
    fetchCiudadesDepartamento();
  }, [fetchCiudadesDepartamento]);

  return {
    departamento: data.departamento,
    ciudades: data.ciudades,
    loading,
    error,
    refetch: fetchCiudadesDepartamento
  };
};

/**
 * Hook para obtener una ciudad específica
 * @param {number} ciudadId - ID de la ciudad
 * @returns {Object} Estado y funciones para la ciudad
 */
export const useCiudad = (ciudadId) => {
  const [ciudad, setCiudad] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCiudad = useCallback(async () => {
    if (!ciudadId) {
      setCiudad(null);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const data = await UbicacionService.getCiudadPorId(ciudadId);
      setCiudad(data);
    } catch (err) {
      setError(err.message);
      console.error('Error en useCiudad:', err);
    } finally {
      setLoading(false);
    }
  }, [ciudadId]);

  useEffect(() => {
    fetchCiudad();
  }, [fetchCiudad]);

  return {
    ciudad,
    loading,
    error,
    refetch: fetchCiudad
  };
};

/**
 * Hook para búsqueda de ciudades con debounce
 * @param {string} termino - Término de búsqueda
 * @param {number} departamentoId - ID del departamento (opcional)
 * @param {number} delay - Delay en ms para el debounce
 * @returns {Object} Estado y funciones para búsqueda
 */
export const useBuscarCiudades = (termino = '', departamentoId = null, delay = 300) => {
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // No buscar si el término es muy corto
    if (termino.length < 2) {
      setResultados([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await UbicacionService.buscarCiudades(termino, departamentoId);
        setResultados(data);
      } catch (err) {
        setError(err.message);
        console.error('Error en useBuscarCiudades:', err);
      } finally {
        setLoading(false);
      }
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [termino, departamentoId, delay]);

  return {
    resultados,
    loading,
    error
  };
};

/**
 * Hook para gestión completa de ubicación (departamentos y ciudades)
 * Útil para formularios que necesitan ambos selectores
 * @returns {Object} Estado y funciones para gestión completa
 */
export const useUbicacion = () => {
  const { departamentos, loading: loadingDepartamentos } = useDepartamentos(false);
  const [ciudades, setCiudades] = useState([]);
  const [loadingCiudades, setLoadingCiudades] = useState(false);
  const [error, setError] = useState(null);

  const cargarCiudadesPorDepartamento = async (departamentoId) => {
    if (!departamentoId) {
      setCiudades([]);
      return;
    }

    setLoadingCiudades(true);
    setError(null);
    
    try {
      const data = await UbicacionService.getCiudades({ departamentoId });
      setCiudades(data);
    } catch (err) {
      setError(err.message);
      console.error('Error al cargar ciudades:', err);
    } finally {
      setLoadingCiudades(false);
    }
  };

  return {
    departamentos,
    ciudades,
    loading: loadingDepartamentos || loadingCiudades,
    error,
    cargarCiudadesPorDepartamento
  };
};

/**
 * Hook para estadísticas geográficas (admin)
 * @returns {Object} Estado y funciones para estadísticas
 */
export const useEstadisticasGeograficas = () => {
  const [estadisticas, setEstadisticas] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEstadisticas = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await UbicacionService.getEstadisticasGeograficas();
      setEstadisticas(data);
    } catch (err) {
      setError(err.message);
      console.error('Error en useEstadisticasGeograficas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEstadisticas();
  }, []);

  return {
    estadisticas,
    loading,
    error,
    refetch: fetchEstadisticas
  };
};
