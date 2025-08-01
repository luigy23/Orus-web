import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminService from '../../services/admin.service';
import { getMainImageUrl } from '../../utils/imageUtils';

/**
 * Página de administración de empresas
 * Permite listar, filtrar, buscar y gestionar empresas
 */
const EmpresasAdmin = () => {
  
  // Estados principales
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estados para filtros y paginación
  const [filtros, setFiltros] = useState({
    busqueda: '',
    estado: 'TODOS',
  });
  const [paginacion, setPaginacion] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  // Cargar empresas al montar el componente y cuando cambien los filtros
  useEffect(() => {
    cargarEmpresas();
  }, [filtros, paginacion.page]);

  /**
   * Cargar lista de empresas desde la API
   */
  const cargarEmpresas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Construir parámetros de query
      const params = {
        page: paginacion.page,
        limit: paginacion.limit,
        ...(filtros.estado !== 'TODOS' && { estado: filtros.estado }),
        ...(filtros.busqueda && { busqueda: filtros.busqueda })
      };

      const response = await AdminService.getEmpresas(params);
      
      setEmpresas(response.empresas || []);
      setPaginacion(prev => ({
        ...prev,
        total: response.pagination?.total || 0,
        pages: response.pagination?.pages || 0
      }));
      
    } catch (error) {
      console.error('❌ Error al cargar empresas:', error);
      setError('Error al cargar las empresas. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  }, [filtros, paginacion.page, paginacion.limit]);

  /**
   * Manejar cambios en los filtros
   */
  const handleFiltroChange = (key, value) => {
    setFiltros(prev => ({ ...prev, [key]: value }));
    // Resetear a página 1 cuando se cambian filtros
    setPaginacion(prev => ({ ...prev, page: 1 }));
  };

  /**
   * Manejar cambio de página
   */
  const handlePageChange = (newPage) => {
    setPaginacion(prev => ({ ...prev, page: newPage }));
  };

  /**
   * Eliminar empresa con confirmación
   */
  const handleEliminarEmpresa = async (empresa) => {
    if (!window.confirm(`¿Estás seguro de que quieres eliminar la empresa "${empresa.Nombre}"?`)) {
      return;
    }

    try {
      await AdminService.eliminarEmpresa(empresa.id);
      
      // Mostrar mensaje de éxito
      alert(`Empresa "${empresa.Nombre}" eliminada correctamente`);
      
      // Recargar lista
      cargarEmpresas();
      
    } catch (error) {
      console.error('❌ Error al eliminar empresa:', error);
      alert('Error al eliminar la empresa. Por favor, inténtalo de nuevo.');
    }
  };

  /**
   * Cambiar estado de una empresa
   */
  const handleCambiarEstado = async (empresa, nuevoEstado) => {
    try {
      await AdminService.cambiarEstadoEmpresa(empresa.id, nuevoEstado);
      
      // Mostrar mensaje de éxito
      alert(`Estado de "${empresa.Nombre}" cambiado a ${nuevoEstado}`);
      
      // Recargar lista
      cargarEmpresas();
      
    } catch (error) {
      console.error('❌ Error al cambiar estado:', error);
      alert('Error al cambiar el estado. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <AdminLayout title="Gestión de Empresas">
      <div className="space-y-6">
        
        {/* Header con botón de crear */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Lista de Empresas
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Gestiona todas las empresas del directorio
            </p>
          </div>
          <Link
            to="/admin/empresas/nueva"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orus-primary hover:bg-orus-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orus-primary transition-colors"
          >
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Nueva Empresa
          </Link>
        </div>

        {/* Filtros */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Búsqueda */}
            <div>
              <label htmlFor="busqueda" className="block text-sm font-medium text-gray-700 mb-1">
                Buscar
              </label>
              <input
                type="text"
                id="busqueda"
                placeholder="Nombre, ciudad, email..."
                value={filtros.busqueda}
                onChange={(e) => handleFiltroChange('busqueda', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orus-primary focus:border-orus-primary text-sm"
              />
            </div>

            {/* Estado */}
            <div>
              <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                id="estado"
                value={filtros.estado}
                onChange={(e) => handleFiltroChange('estado', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orus-primary focus:border-orus-primary text-sm"
              >
                <option value="TODOS">Todos los estados</option>
                <option value="ACTIVO">Activo</option>
                <option value="INACTIVO">Inactivo</option>
                <option value="PENDIENTE">Pendiente</option>
              </select>
            </div>

            {/* Botón limpiar filtros */}
            <div className="flex items-end">
              <button
                onClick={() => {
                  setFiltros({ busqueda: '', estado: 'TODOS' });
                  setPaginacion(prev => ({ ...prev, page: 1 }));
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orus-primary transition-colors"
              >
                Limpiar Filtros
              </button>
            </div>
          </div>
        </div>

        {/* Estado de carga */}
        {loading && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orus-primary"></div>
              <span className="ml-3 text-gray-600">Cargando empresas...</span>
            </div>
          </div>
        )}

        {/* Mensaje de error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Tabla de empresas */}
        {!loading && !error && (
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
            {empresas.length === 0 ? (
              <div className="p-8 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No hay empresas</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {filtros.busqueda || filtros.estado !== 'TODOS' 
                    ? 'No se encontraron empresas con los filtros aplicados.'
                    : 'Comienza creando tu primera empresa.'
                  }
                </p>
                {(!filtros.busqueda && filtros.estado === 'TODOS') && (
                  <div className="mt-6">
                    <Link
                      to="/admin/empresas/nueva"
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orus-primary hover:bg-orus-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orus-primary"
                    >
                      <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Nueva Empresa
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* Tabla */}
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Empresa
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Contacto
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Estado
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Categorías
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Dueño
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {empresas.map((empresa) => (
                        <tr key={empresa.id} className="hover:bg-gray-50">
                          
                          {/* Información de empresa */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {empresa.Imagenes && empresa.Imagenes.length > 0 ? (
                                <img
                                  className="h-10 w-10 rounded-lg object-cover"
                                  src={getMainImageUrl(empresa.Imagenes)}
                                  alt={empresa.Nombre}
                                />
                              ) : (
                                <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                                  <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                  </svg>
                                </div>
                              )}
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {empresa.Nombre}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {empresa.Ciudad || 'Sin ciudad'}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Contacto */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {empresa.Telefono || 'Sin teléfono'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {empresa.Email || 'Sin email'}
                            </div>
                          </td>

                          {/* Estado */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              value={empresa.Estado}
                              onChange={(e) => handleCambiarEstado(empresa, e.target.value)}
                              className={`text-xs font-medium px-2 py-1 rounded-full border-0 focus:ring-2 focus:ring-offset-2 focus:ring-orus-primary ${
                                empresa.Estado === 'ACTIVO'
                                  ? 'bg-green-100 text-green-800'
                                  : empresa.Estado === 'INACTIVO'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              <option value="ACTIVO">Activo</option>
                              <option value="INACTIVO">Inactivo</option>
                              <option value="PENDIENTE">Pendiente</option>
                            </select>
                          </td>

                          {/* Categorías */}
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1">
                              {empresa.Categorias?.slice(0, 2).map((cat) => (
                                <span
                                  key={cat.Categoria.id}
                                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                                >
                                  {cat.Categoria.Nombre}
                                </span>
                              ))}
                              {empresa.Categorias?.length > 2 && (
                                <span className="text-xs text-gray-500">
                                  +{empresa.Categorias.length - 2} más
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Dueño */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {empresa.Usuario?.Nombre || 'Sin asignar'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {empresa.Usuario?.Correo || ''}
                            </div>
                          </td>

                          {/* Acciones */}
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <Link
                                to={`/admin/empresas/${empresa.id}`}
                                className="text-orus-primary hover:text-orus-primary/80 transition-colors"
                                title="Ver detalles"
                              >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              </Link>
                              <Link
                                to={`/admin/empresas/${empresa.id}/editar`}
                                className="text-blue-600 hover:text-blue-800 transition-colors"
                                title="Editar"
                              >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </Link>
                              <button
                                onClick={() => handleEliminarEmpresa(empresa)}
                                className="text-red-600 hover:text-red-800 transition-colors"
                                title="Eliminar"
                              >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Paginación */}
                {paginacion.pages > 1 && (
                  <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 flex justify-between sm:hidden">
                        <button
                          onClick={() => handlePageChange(paginacion.page - 1)}
                          disabled={paginacion.page <= 1}
                          className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Anterior
                        </button>
                        <button
                          onClick={() => handlePageChange(paginacion.page + 1)}
                          disabled={paginacion.page >= paginacion.pages}
                          className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Siguiente
                        </button>
                      </div>
                      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm text-gray-700">
                            Mostrando{' '}
                            <span className="font-medium">
                              {((paginacion.page - 1) * paginacion.limit) + 1}
                            </span>{' '}
                            a{' '}
                            <span className="font-medium">
                              {Math.min(paginacion.page * paginacion.limit, paginacion.total)}
                            </span>{' '}
                            de{' '}
                            <span className="font-medium">{paginacion.total}</span>{' '}
                            resultados
                          </p>
                        </div>
                        <div>
                          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                            {/* Botón anterior */}
                            <button
                              onClick={() => handlePageChange(paginacion.page - 1)}
                              disabled={paginacion.page <= 1}
                              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </button>

                            {/* Números de página */}
                            {Array.from({ length: Math.min(paginacion.pages, 5) }, (_, i) => {
                              let pageNum;
                              if (paginacion.pages <= 5) {
                                pageNum = i + 1;
                              } else if (paginacion.page <= 3) {
                                pageNum = i + 1;
                              } else if (paginacion.page >= paginacion.pages - 2) {
                                pageNum = paginacion.pages - 4 + i;
                              } else {
                                pageNum = paginacion.page - 2 + i;
                              }

                              return (
                                <button
                                  key={pageNum}
                                  onClick={() => handlePageChange(pageNum)}
                                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                    pageNum === paginacion.page
                                      ? 'z-10 bg-orus-primary border-orus-primary text-white'
                                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                  }`}
                                >
                                  {pageNum}
                                </button>
                              );
                            })}

                            {/* Botón siguiente */}
                            <button
                              onClick={() => handlePageChange(paginacion.page + 1)}
                              disabled={paginacion.page >= paginacion.pages}
                              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </nav>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default EmpresasAdmin;
