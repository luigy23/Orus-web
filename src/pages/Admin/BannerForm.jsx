// src/pages/Admin/BannerForm.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import BannerService from '../../services/banner.service';

/**
 * Formulario para crear y editar banners
 */
const BannerForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  // Estados del formulario
  const [formData, setFormData] = useState({
    titulo: '',
    subtitulo: '',
    imagenUrl: '',
    textoBoton: '',
    enlaceBoton: '',
    activo: true,
    orden: 0,
    fechaInicio: '',
    fechaFin: ''
  });

  // Estados auxiliares
  const [loading, setLoading] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(isEditing);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  /**
   * Cargar datos de banner para edición
   */
  const cargarBanner = useCallback(async () => {
    if (!isEditing) return;
    
    try {
      setLoadingInitial(true);
      const banner = await BannerService.getBannerPorId(id);
      
      setFormData({
        titulo: banner.titulo || '',
        subtitulo: banner.subtitulo || '',
        imagenUrl: banner.imagenUrl || '',
        textoBoton: banner.textoBoton || '',
        enlaceBoton: banner.enlaceBoton || '',
        activo: banner.activo,
        orden: banner.orden || 0,
        fechaInicio: banner.fechaInicio ? banner.fechaInicio.split('T')[0] : '',
        fechaFin: banner.fechaFin ? banner.fechaFin.split('T')[0] : ''
      });

      setImagePreview(banner.imagenUrl);
      
    } catch (error) {
      console.error('❌ Error al cargar banner:', error);
      setError('Error al cargar los datos del banner.');
    } finally {
      setLoadingInitial(false);
    }
  }, [id, isEditing]);

  // Cargar datos iniciales
  useEffect(() => {
    cargarBanner();
  }, [cargarBanner]);

  /**
   * Manejar cambios en campos de texto
   */
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Actualizar preview de imagen
    if (name === 'imagenUrl') {
      setImagePreview(value);
    }
  };

  /**
   * Validar formulario antes de envío
   */
  const validarFormulario = () => {
    const errores = [];
    
    if (!formData.titulo.trim()) errores.push('El título es obligatorio');
    if (!formData.imagenUrl.trim()) errores.push('La URL de la imagen es obligatoria');
    
    // Validar URL de imagen
    try {
      new URL(formData.imagenUrl);
    } catch {
      errores.push('La URL de la imagen no es válida');
    }

    // Validar URL de enlace si se proporciona
    if (formData.enlaceBoton.trim()) {
      const enlace = formData.enlaceBoton.trim();
      // Permitir URLs internas (que empiecen con /) o URLs completas
      if (!enlace.startsWith('/') && !enlace.startsWith('http')) {
        errores.push('La URL del enlace debe empezar con "/" para enlaces internos o "http" para enlaces externos');
      } else if (enlace.startsWith('http')) {
        try {
          new URL(enlace);
        } catch {
          errores.push('La URL del enlace externo no es válida');
        }
      }
    }

    // Validar fechas
    if (formData.fechaInicio && formData.fechaFin) {
      const inicio = new Date(formData.fechaInicio);
      const fin = new Date(formData.fechaFin);
      if (inicio >= fin) {
        errores.push('La fecha de fin debe ser posterior a la fecha de inicio');
      }
    }

    return errores;
  };

  /**
   * Enviar formulario (crear o actualizar)
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar formulario
    const errores = validarFormulario();
    if (errores.length > 0) {
      setError(errores.join(', '));
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Preparar datos para envío - limpiar campos vacíos y validar tipos
      const datosBanner = {};
      
      // Campo obligatorio
      datosBanner.titulo = formData.titulo.trim();
      datosBanner.imagenUrl = formData.imagenUrl.trim();
      datosBanner.activo = formData.activo;
      datosBanner.orden = parseInt(formData.orden) || 0;
      
      // Campos opcionales - solo incluir si tienen valor
      if (formData.subtitulo && formData.subtitulo.trim()) {
        datosBanner.subtitulo = formData.subtitulo.trim();
      }
      
      if (formData.textoBoton && formData.textoBoton.trim()) {
        datosBanner.textoBoton = formData.textoBoton.trim();
      }
      
      if (formData.enlaceBoton && formData.enlaceBoton.trim()) {
        datosBanner.enlaceBoton = formData.enlaceBoton.trim();
      }
      
      if (formData.fechaInicio && formData.fechaInicio.trim()) {
        datosBanner.fechaInicio = formData.fechaInicio.trim();
      }
      
      if (formData.fechaFin && formData.fechaFin.trim()) {
        datosBanner.fechaFin = formData.fechaFin.trim();
      }

      if (isEditing) {
        await BannerService.actualizarBanner(id, datosBanner);
        setSuccess('Banner actualizado exitosamente');
      } else {
        await BannerService.crearBanner(datosBanner);
        setSuccess('Banner creado exitosamente');
      }

      // Redirigir después de un breve delay
      setTimeout(() => {
        navigate('/admin/banners');
      }, 2000);

    } catch (error) {
      console.error('❌ Error al guardar banner:', error);
      setError(error.response?.data?.error || 'Error al guardar el banner');
    } finally {
      setLoading(false);
    }
  };

  // Mostrar spinner mientras carga datos iniciales
  if (loadingInitial) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orus-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {isEditing ? 'Editar Banner' : 'Nuevo Banner'}
              </h1>
              <p className="text-gray-600 mt-1">
                {isEditing 
                  ? 'Modifica la información del banner publicitario' 
                  : 'Crea un nuevo banner para el home'
                }
              </p>
            </div>
            <button
              onClick={() => navigate('/admin/banners')}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>

        {/* Mensajes de estado */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="text-red-800">
                <strong>Error:</strong> {error}
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex">
              <div className="text-green-800">
                <strong>Éxito:</strong> {success}
              </div>
            </div>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información básica */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Información del Banner</h3>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título *
                  </label>
                  <input
                    type="text"
                    name="titulo"
                    value={formData.titulo}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orus-primary focus:border-orus-primary"
                    placeholder="REBAJAS, OFERTAS, etc."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Orden de Visualización
                  </label>
                  <input
                    type="number"
                    name="orden"
                    value={formData.orden}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orus-primary focus:border-orus-primary"
                    placeholder="0"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subtítulo
                  </label>
                  <input
                    type="text"
                    name="subtitulo"
                    value={formData.subtitulo}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orus-primary focus:border-orus-primary"
                    placeholder="Hasta 50% OFF en toda la colección"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL de la Imagen *
                  </label>
                  <input
                    type="url"
                    name="imagenUrl"
                    value={formData.imagenUrl}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orus-primary focus:border-orus-primary"
                    placeholder="https://ejemplo.com/imagen.jpg"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Recomendado: 600x320px o similar (16:9)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Preview de imagen */}
          {imagePreview && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Vista Previa</h3>
              </div>
              <div className="px-6 py-4">
                <div className="rounded-lg overflow-hidden relative h-40 flex items-center justify-center bg-gray-200">
                  <img
                    src={imagePreview}
                    alt="Vista previa"
                    className="absolute w-full h-full object-cover opacity-70"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <div className="relative z-10 text-center">
                    <h2 className="text-4xl font-extrabold text-white tracking-widest">
                      {formData.titulo || 'TÍTULO'}
                    </h2>
                    {formData.subtitulo && (
                      <p className="text-white font-semibold mt-2 bg-black/40 rounded px-2 inline-block">
                        {formData.subtitulo}
                      </p>
                    )}
                    {formData.textoBoton && (
                      <button className="mt-3 px-4 py-2 bg-white text-gray-800 rounded-lg font-semibold">
                        {formData.textoBoton}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Botón de acción */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Botón de Acción (Opcional)</h3>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Texto del Botón
                  </label>
                  <input
                    type="text"
                    name="textoBoton"
                    value={formData.textoBoton}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orus-primary focus:border-orus-primary"
                    placeholder="Ver Ofertas, Comprar Ahora, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enlace del Botón
                  </label>
                  <input
                    type="url"
                    name="enlaceBoton"
                    value={formData.enlaceBoton}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orus-primary focus:border-orus-primary"
                    placeholder="https://ejemplo.com/ofertas"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Configuración */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Configuración</h3>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Inicio
                  </label>
                  <input
                    type="date"
                    name="fechaInicio"
                    value={formData.fechaInicio}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orus-primary focus:border-orus-primary"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Dejar vacío para mostrar desde ahora
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Fin
                  </label>
                  <input
                    type="date"
                    name="fechaFin"
                    value={formData.fechaFin}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orus-primary focus:border-orus-primary"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Dejar vacío para mostrar indefinidamente
                  </p>
                </div>
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="activo"
                    checked={formData.activo}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-orus-primary focus:ring-orus-primary"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    Banner activo
                  </span>
                </label>
                <p className="text-sm text-gray-500 mt-1">
                  Solo los banners activos se muestran en el home
                </p>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate('/admin/banners')}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-orus-primary text-white rounded-lg hover:bg-orus-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                {loading && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                )}
                <span>{isEditing ? 'Actualizar Banner' : 'Crear Banner'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default BannerForm;
