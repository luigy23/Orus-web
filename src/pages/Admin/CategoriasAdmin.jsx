import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useCategoriasAdmin } from '../../hooks/useCategoriasAdmin';
import IconPreview from '../../components/admin/categorias/IconPreview';
import CategoriaFormModal from '../../components/admin/categorias/CategoriaFormModal';
import CategoriaDeleteModal from '../../components/admin/categorias/CategoriaDeleteModal';
import { TIPOS_ICONO } from '../../utils/iconUtils.jsx';

/**
 * Página principal de administración de categorías
 */
const CategoriasAdmin = () => {
  const {
    categorias,
    loading,
    error,
    pagination,
    filtros,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria,
    toggleActivoCategoria,
    clearError,
    updateFiltros,
    resetFiltros,
    changePage
  } = useCategoriasAdmin();

  const [modalForm, setModalForm] = useState({ open: false, categoria: null });
  const [modalDelete, setModalDelete] = useState({ open: false, categoria: null });

  /**
   * Abrir modal para crear nueva categoría
   */
  const handleCrear = () => {
    setModalForm({ open: true, categoria: null });
  };

  /**
   * Abrir modal para editar categoría
   */
  const handleEditar = (categoria) => {
    setModalForm({ open: true, categoria });
  };

  /**
   * Abrir modal para eliminar categoría
   */
  const handleEliminar = (categoria) => {
    setModalDelete({ open: true, categoria });
  };

  /**
   * Alternar estado activo/inactivo
   */
  const handleToggleActivo = async (categoria) => {
    const result = await toggleActivoCategoria(categoria.id);
    if (!result.success) {
      console.error('Error al cambiar estado:', result.error);
    }
  };

  /**
   * Enviar formulario de crear/editar
   */
  const handleSubmitForm = async (data) => {
    const result = modalForm.categoria
      ? await actualizarCategoria(modalForm.categoria.id, data)
      : await crearCategoria(data);

    if (result.success) {
      setModalForm({ open: false, categoria: null });
    }

    return result;
  };

  /**
   * Confirmar eliminación
   */
  const handleConfirmDelete = async () => {
    const result = await eliminarCategoria(modalDelete.categoria.id);
    
    if (result.success) {
      setModalDelete({ open: false, categoria: null });
    }

    return result;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Gestión de Categorías
            </h1>
            <p className="text-gray-600">
              Administra las categorías del sistema
            </p>
          </div>
          
          <button
            onClick={handleCrear}
            className="bg-orus-primary text-white px-4 py-2 rounded-lg hover:bg-orus-primary/80 transition-colors flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Nueva Categoría</span>
          </button>
        </div>

        {/* Filtros y búsqueda */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Búsqueda */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Buscar
              </label>
              <input
                type="text"
                placeholder="Buscar categorías..."
                value={filtros.busqueda}
                onChange={(e) => updateFiltros({ busqueda: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orus-primary focus:border-transparent"
              />
            </div>

            {/* Filtro por estado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                value={filtros.activo ?? ''}
                onChange={(e) => updateFiltros({ 
                  activo: e.target.value === '' ? undefined : e.target.value === 'true'
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orus-primary focus:border-transparent"
              >
                <option value="">Todos los estados</option>
                <option value="true">Activos</option>
                <option value="false">Inactivos</option>
              </select>
            </div>

            {/* Filtro por tipo de icono */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Icono
              </label>
              <select
                value={filtros.tipoIcono || ''}
                onChange={(e) => updateFiltros({ 
                  tipoIcono: e.target.value === '' ? undefined : e.target.value 
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orus-primary focus:border-transparent"
              >
                <option value="">Todos los tipos</option>
                {TIPOS_ICONO.map(tipo => (
                  <option key={tipo.value} value={tipo.value}>
                    {tipo.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Botón limpiar filtros */}
            <div className="flex items-end">
              <button
                onClick={resetFiltros}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Limpiar filtros
              </button>
            </div>
          </div>
        </div>

        {/* Mensajes de error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-red-800">{error}</p>
              </div>
              <button
                onClick={clearError}
                className="text-red-400 hover:text-red-600"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Tabla de categorías */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orus-primary"></div>
              <span className="ml-2 text-gray-600">Cargando categorías...</span>
            </div>
          ) : categorias.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No hay categorías</h3>
              <p className="mt-1 text-sm text-gray-500">Comienza creando una nueva categoría.</p>
              <div className="mt-6">
                <button
                  onClick={handleCrear}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orus-primary hover:bg-orus-primary/80"
                >
                  <svg className="-ml-1 mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Nueva Categoría
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Tabla */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Categoría
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Icono
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Empresas
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Orden
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {categorias.map((categoria) => (
                      <tr key={categoria.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {categoria.Nombre}
                            </div>
                            {categoria.Descripcion && (
                              <div className="text-sm text-gray-500">
                                {categoria.Descripcion}
                              </div>
                            )}
                            <div className="text-xs text-gray-400">
                              /{categoria.Slug}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            <IconPreview categoria={categoria} size="md" />
                            <div className="text-xs text-gray-500">
                              {TIPOS_ICONO.find(t => t.value === categoria.TipoIcono)?.label || categoria.TipoIcono}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {categoria._count?.Empresas || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleToggleActivo(categoria)}
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full transition-colors ${
                              categoria.Activo
                                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                : 'bg-red-100 text-red-800 hover:bg-red-200'
                            }`}
                          >
                            {categoria.Activo ? 'Activo' : 'Inactivo'}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {categoria.Orden}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleEditar(categoria)}
                              className="text-indigo-600 hover:text-indigo-900 transition-colors"
                              title="Editar categoría"
                            >
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleEliminar(categoria)}
                              className={`transition-colors ${
                                categoria._count?.Empresas > 0
                                  ? 'text-gray-400 cursor-not-allowed'
                                  : 'text-red-600 hover:text-red-900'
                              }`}
                              disabled={categoria._count?.Empresas > 0}
                              title={categoria._count?.Empresas > 0 ? 'No se puede eliminar (tiene empresas asociadas)' : 'Eliminar categoría'}
                            >
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
              {pagination.totalPages > 1 && (
                <div className="px-6 py-3 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      Mostrando {((pagination.page - 1) * pagination.limit) + 1} a{' '}
                      {Math.min(pagination.page * pagination.limit, pagination.total)} de{' '}
                      {pagination.total} resultados
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => changePage(pagination.page - 1)}
                        disabled={pagination.page === 1}
                        className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        Anterior
                      </button>
                      
                      <span className="text-sm text-gray-700">
                        Página {pagination.page} de {pagination.totalPages}
                      </span>
                      
                      <button
                        onClick={() => changePage(pagination.page + 1)}
                        disabled={pagination.page === pagination.totalPages}
                        className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        Siguiente
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modales */}
      <CategoriaFormModal
        open={modalForm.open}
        categoria={modalForm.categoria}
        onClose={() => setModalForm({ open: false, categoria: null })}
        onSubmit={handleSubmitForm}
      />

      <CategoriaDeleteModal
        open={modalDelete.open}
        categoria={modalDelete.categoria}
        onClose={() => setModalDelete({ open: false, categoria: null })}
        onConfirm={handleConfirmDelete}
      />
    </AdminLayout>
  );
};

export default CategoriasAdmin;
