// src/pages/Admin/Banners.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import BannerService from '../../services/banner.service';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Search,
  ExternalLink,
  Calendar,
  Image as ImageIcon
} from 'lucide-react';

/**
 * Página de administración de banners
 */
const Banners = () => {
  const navigate = useNavigate();
  
  // Estados
  const [banners, setBanners] = useState([]);
  const [filteredBanners, setFilteredBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  /**
   * Cargar banners desde el servidor
   */
  const cargarBanners = async () => {
    try {
      setLoading(true);
      const data = await BannerService.getBanners();
      setBanners(data);
      setFilteredBanners(data);
    } catch (error) {
      console.error('❌ Error al cargar banners:', error);
      setError('Error al cargar los banners');
    } finally {
      setLoading(false);
    }
  };

  // Cargar banners al montar el componente
  useEffect(() => {
    cargarBanners();
  }, []);

  // Filtrar banners según término de búsqueda
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredBanners(banners);
    } else {
      const filtered = banners.filter(banner =>
        banner.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (banner.subtitulo && banner.subtitulo.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredBanners(filtered);
    }
  }, [searchTerm, banners]);

  /**
   * Eliminar banner
   */
  const handleEliminar = async (id, titulo) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar el banner "${titulo}"?`)) {
      try {
        await BannerService.eliminarBanner(id);
        await cargarBanners(); // Recargar lista
      } catch (error) {
        console.error('❌ Error al eliminar banner:', error);
        alert('Error al eliminar el banner');
      }
    }
  };

  /**
   * Activar/desactivar banner
   */
  const handleToggle = async (id) => {
    try {
      await BannerService.toggleBanner(id);
      await cargarBanners(); // Recargar lista
    } catch (error) {
      console.error('❌ Error al cambiar estado del banner:', error);
      alert('Error al cambiar el estado del banner');
    }
  };

  /**
   * Formatear fecha para mostrar
   */
  const formatearFecha = (fecha) => {
    if (!fecha) return 'Sin fecha';
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  /**
   * Determinar si un banner está vigente
   */
  const esBannerVigente = (banner) => {
    const ahora = new Date();
    const inicio = banner.fechaInicio ? new Date(banner.fechaInicio) : null;
    const fin = banner.fechaFin ? new Date(banner.fechaFin) : null;
    
    const despuesInicio = !inicio || inicio <= ahora;
    const antesFin = !fin || fin >= ahora;
    
    return despuesInicio && antesFin;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gestión de Banners</h1>
              <p className="text-gray-600 mt-1">
                Administra los banners publicitarios del home
              </p>
            </div>
            <button
              onClick={() => navigate('/admin/banners/nuevo')}
              className="inline-flex items-center px-4 py-2 bg-orus-primary text-white rounded-lg hover:bg-orus-primary/90 transition-colors"
            >
              <Plus size={20} className="mr-2" />
              Nuevo Banner
            </button>
          </div>

          {/* Búsqueda */}
          <div className="mt-4">
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar banners por título o subtítulo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orus-primary focus:border-orus-primary"
              />
            </div>
          </div>
        </div>

        {/* Mensajes de estado */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="text-red-800">{error}</div>
          </div>
        )}

        {/* Lista de banners */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orus-primary"></div>
            </div>
          ) : filteredBanners.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'No se encontraron banners' : 'No hay banners'}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm 
                  ? 'Intenta con otros términos de búsqueda'
                  : 'Comienza creando tu primer banner publicitario'
                }
              </p>
              {!searchTerm && (
                <button
                  onClick={() => navigate('/admin/banners/nuevo')}
                  className="inline-flex items-center px-4 py-2 bg-orus-primary text-white rounded-lg hover:bg-orus-primary/90 transition-colors"
                >
                  <Plus size={20} className="mr-2" />
                  Crear Primer Banner
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Banner
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vigencia
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
                  {filteredBanners.map((banner) => (
                    <tr key={banner.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-16 w-24">
                            <img
                              className="h-16 w-24 rounded-lg object-cover"
                              src={banner.imagenUrl}
                              alt={banner.titulo}
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/96x64?text=Banner';
                              }}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {banner.titulo}
                            </div>
                            {banner.subtitulo && (
                              <div className="text-sm text-gray-500">
                                {banner.subtitulo.length > 50 
                                  ? `${banner.subtitulo.substring(0, 50)}...` 
                                  : banner.subtitulo
                                }
                              </div>
                            )}
                            {banner.enlaceBoton && (
                              <div className="flex items-center text-xs text-blue-600 mt-1">
                                <ExternalLink size={12} className="mr-1" />
                                {banner.textoBoton || 'Enlace'}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col space-y-1">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            banner.activo
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {banner.activo ? 'Activo' : 'Inactivo'}
                          </span>
                          {banner.activo && (
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              esBannerVigente(banner)
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {esBannerVigente(banner) ? 'Vigente' : 'No vigente'}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar size={14} />
                          <div>
                            <div>{formatearFecha(banner.fechaInicio)}</div>
                            <div>{formatearFecha(banner.fechaFin)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {banner.orden}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => navigate(`/admin/banners/${banner.id}/editar`)}
                            className="text-orus-primary hover:text-orus-primary/80 p-1"
                            title="Editar banner"
                          >
                            <Edit size={18} />
                          </button>
                          
                          <button
                            onClick={() => handleToggle(banner.id)}
                            className={`p-1 ${
                              banner.activo 
                                ? 'text-yellow-600 hover:text-yellow-700' 
                                : 'text-green-600 hover:text-green-700'
                            }`}
                            title={banner.activo ? 'Desactivar' : 'Activar'}
                          >
                            {banner.activo ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                          
                          <button
                            onClick={() => handleEliminar(banner.id, banner.titulo)}
                            className="text-red-600 hover:text-red-700 p-1"
                            title="Eliminar banner"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Información adicional */}
        {!loading && filteredBanners.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex">
              <div className="text-blue-800 text-sm">
                <strong>Información:</strong> Los banners se muestran en orden ascendente. 
                Solo los banners activos y vigentes aparecen en el home. 
                Si hay múltiples banners vigentes, rotan automáticamente cada 5 segundos.
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Banners;
