import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminService from '../../services/admin.service';

/**
 * Vista detallada de empresa para administradores
 * Permite ver información completa y gestionar imágenes
 */
const EmpresaDetalleAdmin = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Estados
  const [empresa, setEmpresa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Cargar datos de la empresa
   */
  const cargarEmpresa = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const empresaData = await AdminService.getEmpresaPorId(id);
      setEmpresa(empresaData);
    } catch (error) {
      console.error('❌ Error al cargar empresa:', error);
      setError('Error al cargar los datos de la empresa.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Cargar empresa al montar
  useEffect(() => {
    cargarEmpresa();
  }, [cargarEmpresa]);

  /**
   * Eliminar empresa con confirmación
   */
  const handleEliminarEmpresa = async () => {
    if (!window.confirm(`¿Estás seguro de que quieres eliminar la empresa "${empresa.Nombre}"?`)) {
      return;
    }

    try {
      await AdminService.eliminarEmpresa(empresa.id);
      alert(`Empresa "${empresa.Nombre}" eliminada correctamente`);
      navigate('/admin/empresas');
    } catch (error) {
      console.error('❌ Error al eliminar empresa:', error);
      alert('Error al eliminar la empresa. Por favor, inténtalo de nuevo.');
    }
  };

  /**
   * Cambiar estado de la empresa
   */
  const handleCambiarEstado = async (nuevoEstado) => {
    try {
      await AdminService.cambiarEstadoEmpresa(empresa.id, nuevoEstado);
      alert(`Estado cambiado a ${nuevoEstado}`);
      cargarEmpresa(); // Recargar datos
    } catch (error) {
      console.error('❌ Error al cambiar estado:', error);
      alert('Error al cambiar el estado. Por favor, inténtalo de nuevo.');
    }
  };

  // Loading state
  if (loading) {
    return (
      <AdminLayout title="Cargar Empresa">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orus-primary"></div>
            <span className="ml-3 text-gray-600">Cargando datos de la empresa...</span>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <AdminLayout title="Error">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8">
          <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-red-800">Error al cargar empresa</h3>
            <p className="mt-1 text-sm text-red-600">{error}</p>
            <div className="mt-6">
              <button
                onClick={() => navigate('/admin/empresas')}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Volver a Lista
              </button>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // No empresa encontrada
  if (!empresa) {
    return (
      <AdminLayout title="Empresa no encontrada">
        <div className="bg-gray-50 rounded-lg p-8">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900">Empresa no encontrada</h3>
            <p className="mt-1 text-sm text-gray-600">La empresa solicitada no existe.</p>
            <div className="mt-6">
              <Link
                to="/admin/empresas"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orus-primary hover:bg-orus-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orus-primary"
              >
                Volver a Lista
              </Link>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={`Empresa: ${empresa.Nombre}`}>
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header con acciones */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{empresa.Nombre}</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Información detallada de la empresa
                </p>
              </div>
              <div className="flex items-center space-x-3">
                
                {/* Estado */}
                <select
                  value={empresa.Estado}
                  onChange={(e) => handleCambiarEstado(e.target.value)}
                  className={`text-xs font-medium px-3 py-1 rounded-full border-0 focus:ring-2 focus:ring-offset-2 focus:ring-orus-primary ${
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

                {/* Botones de acción */}
                <Link
                  to={`/admin/empresas/${empresa.id}/editar`}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orus-primary transition-colors"
                >
                  <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Editar
                </Link>
                
                <button
                  onClick={handleEliminarEmpresa}
                  className="inline-flex items-center px-3 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                >
                  <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Eliminar
                </button>
                
                <button
                  onClick={() => navigate('/admin/empresas')}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orus-primary transition-colors"
                >
                  ← Volver
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Información principal */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Información básica */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Información Básica</h3>
              </div>
              <div className="px-6 py-4">
                <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Nombre</dt>
                    <dd className="mt-1 text-sm text-gray-900">{empresa.Nombre}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Ciudad</dt>
                    <dd className="mt-1 text-sm text-gray-900">{empresa.Ciudad || 'No especificada'}</dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">Descripción</dt>
                    <dd className="mt-1 text-sm text-gray-900">{empresa.Descripcion || 'Sin descripción'}</dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">Dirección</dt>
                    <dd className="mt-1 text-sm text-gray-900">{empresa.Direccion || 'No especificada'}</dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Información de contacto */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Información de Contacto</h3>
              </div>
              <div className="px-6 py-4">
                <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Teléfono</dt>
                    <dd className="mt-1 text-sm text-gray-900">{empresa.Telefono || 'No especificado'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {empresa.Email ? (
                        <a href={`mailto:${empresa.Email}`} className="text-orus-primary hover:underline">
                          {empresa.Email}
                        </a>
                      ) : 'No especificado'}
                    </dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">Sitio Web</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {empresa.SitioWeb ? (
                        <a href={empresa.SitioWeb} target="_blank" rel="noopener noreferrer" className="text-orus-primary hover:underline">
                          {empresa.SitioWeb}
                        </a>
                      ) : 'No especificado'}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Horarios */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Horarios de Atención</h3>
              </div>
              <div className="px-6 py-4">
                <dl className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {[
                    { key: 'HorarioLunes', label: 'Lunes' },
                    { key: 'HorarioMartes', label: 'Martes' },
                    { key: 'HorarioMiercoles', label: 'Miércoles' },
                    { key: 'HorarioJueves', label: 'Jueves' },
                    { key: 'HorarioViernes', label: 'Viernes' },
                    { key: 'HorarioSabado', label: 'Sábado' },
                    { key: 'HorarioDomingo', label: 'Domingo' }
                  ].map(({ key, label }) => (
                    <div key={key} className="flex justify-between py-1">
                      <dt className="text-sm font-medium text-gray-500">{label}:</dt>
                      <dd className="text-sm text-gray-900">{empresa[key] || 'No especificado'}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            {/* Imágenes */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Imágenes ({empresa.Imagenes?.length || 0})</h3>
              </div>
              <div className="px-6 py-4">
                {empresa.Imagenes && empresa.Imagenes.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {empresa.Imagenes
                      .sort((a, b) => a.Orden - b.Orden)
                      .map((imagen, index) => (
                      <div key={imagen.id} className="relative group">
                        <img
                          src={imagen.Url}
                          alt={`${empresa.Nombre} - ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border"
                        />
                        {imagen.EsPrincipal && (
                          <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                            Principal
                          </div>
                        )}
                        <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                          #{imagen.Orden}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="mt-2 text-sm text-gray-500">No hay imágenes cargadas</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar con información adicional */}
          <div className="space-y-6">
            
            {/* Metadatos */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Metadatos</h3>
              </div>
              <div className="px-6 py-4">
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">ID</dt>
                    <dd className="mt-1 text-sm text-gray-900 font-mono">{empresa.id}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Estado</dt>
                    <dd className="mt-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        empresa.Estado === 'ACTIVO'
                          ? 'bg-green-100 text-green-800'
                          : empresa.Estado === 'INACTIVO'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {empresa.Estado}
                      </span>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Fecha de Creación</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {empresa.FechaCreacion ? new Date(empresa.FechaCreacion).toLocaleDateString() : 'No disponible'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Última Actualización</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {empresa.FechaActualizacion ? new Date(empresa.FechaActualizacion).toLocaleDateString() : 'No disponible'}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Usuario dueño */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Usuario Dueño</h3>
              </div>
              <div className="px-6 py-4">
                {empresa.Usuario ? (
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-orus-primary flex items-center justify-center">
                        <span className="text-sm font-medium text-white">
                          {empresa.Usuario.Nombre.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{empresa.Usuario.Nombre}</p>
                      <p className="text-sm text-gray-500">{empresa.Usuario.Correo}</p>
                      {empresa.Usuario.Telefono && (
                        <p className="text-sm text-gray-500">{empresa.Usuario.Telefono}</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Sin usuario asignado</p>
                )}
              </div>
            </div>

            {/* Categorías */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Categorías</h3>
              </div>
              <div className="px-6 py-4">
                {empresa.Categorias && empresa.Categorias.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {empresa.Categorias.map((cat) => (
                      <span
                        key={cat.Categoria.id}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                      >
                        {cat.Categoria.Nombre}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Sin categorías asignadas</p>
                )}
              </div>
            </div>

            {/* Coordenadas */}
            {(empresa.Latitud || empresa.Longitud) && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Ubicación</h3>
                </div>
                <div className="px-6 py-4">
                  <dl className="space-y-2">
                    {empresa.Latitud && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Latitud</dt>
                        <dd className="mt-1 text-sm text-gray-900 font-mono">{empresa.Latitud}</dd>
                      </div>
                    )}
                    {empresa.Longitud && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Longitud</dt>
                        <dd className="mt-1 text-sm text-gray-900 font-mono">{empresa.Longitud}</dd>
                      </div>
                    )}
                  </dl>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default EmpresaDetalleAdmin;
