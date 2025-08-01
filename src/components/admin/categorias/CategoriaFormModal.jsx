import React, { useState, useEffect } from 'react';
import IconPreview from './IconPreview';
import IconUploader from './IconUploader';
import { TIPOS_ICONO, EMOJIS_CATEGORIAS, isValidEmoji, isValidSVG } from '../../../utils/iconUtils';

/**
 * Modal para crear/editar categorías
 */
const CategoriaFormModal = ({ open, categoria, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    Nombre: '',
    Descripcion: '',
    TipoIcono: 'EMOJI',
    IconoData: '🏪',
    ColorPrimario: '#6366f1',
    ColorSecundario: '#ffffff',
    Activo: true,
    Orden: 0
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Resetear formulario cuando se abre/cierra modal o cambia categoría
  useEffect(() => {
    if (open) {
      if (categoria) {
        // Editar: cargar datos existentes
        setFormData({
          Nombre: categoria.Nombre || '',
          Descripcion: categoria.Descripcion || '',
          TipoIcono: categoria.TipoIcono || 'EMOJI',
          IconoData: categoria.IconoData || '🏪',
          ColorPrimario: categoria.ColorPrimario || '#6366f1',
          ColorSecundario: categoria.ColorSecundario || '#ffffff',
          Activo: categoria.Activo !== undefined ? categoria.Activo : true,
          Orden: categoria.Orden || 0
        });
      } else {
        // Crear: valores por defecto
        setFormData({
          Nombre: '',
          Descripcion: '',
          TipoIcono: 'EMOJI',
          IconoData: '🏪',
          ColorPrimario: '#6366f1',
          ColorSecundario: '#ffffff',
          Activo: true,
          Orden: 0
        });
      }
      setErrors({});
    }
  }, [open, categoria]);

  /**
   * Validar formulario
   */
  const validateForm = () => {
    const newErrors = {};

    // Nombre requerido
    if (!formData.Nombre.trim()) {
      newErrors.Nombre = 'El nombre es requerido';
    } else if (formData.Nombre.trim().length < 2) {
      newErrors.Nombre = 'El nombre debe tener al menos 2 caracteres';
    } else if (formData.Nombre.trim().length > 50) {
      newErrors.Nombre = 'El nombre no puede exceder 50 caracteres';
    }

    // Descripción opcional pero con límite
    if (formData.Descripcion && formData.Descripcion.length > 200) {
      newErrors.Descripcion = 'La descripción no puede exceder 200 caracteres';
    }

    // Validar datos del icono según tipo
    if (!formData.IconoData.trim()) {
      newErrors.IconoData = 'Los datos del icono son requeridos';
    } else {
      switch (formData.TipoIcono) {
        case 'EMOJI':
          if (!isValidEmoji(formData.IconoData)) {
            newErrors.IconoData = 'Por favor selecciona un emoji válido';
          }
          break;
        case 'SVG_INLINE':
          if (!isValidSVG(formData.IconoData)) {
            newErrors.IconoData = 'Por favor introduce un SVG válido';
          }
          break;
        default:
          break;
      }
    }

    // Validar colores
    const colorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (!colorRegex.test(formData.ColorPrimario)) {
      newErrors.ColorPrimario = 'Color primario debe ser un hexadecimal válido';
    }
    if (!colorRegex.test(formData.ColorSecundario)) {
      newErrors.ColorSecundario = 'Color secundario debe ser un hexadecimal válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Manejar envío del formulario
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    
    try {
      const result = await onSubmit(formData);
      
      if (result.success) {
        onClose();
      }
    } catch (error) {
      console.error('Error enviando formulario:', error);
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Actualizar campo del formulario
   */
  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar error del campo si existe
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  /**
   * Manejar archivo de icono subido
   */
  const handleIconUploaded = (iconData) => {
    setFormData(prev => ({
      ...prev,
      TipoIcono: iconData.tipoIcono,
      IconoData: iconData.filename
    }));
    
    // Limpiar errores del icono
    if (errors.IconoData) {
      setErrors(prev => ({ ...prev, IconoData: undefined }));
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-4">
        {/* Overlay */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">
              {categoria ? 'Editar Categoría' : 'Nueva Categoría'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Preview de la categoría */}
            <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="mb-2">
                  <IconPreview categoria={formData} size="xl" />
                </div>
                <p className="text-sm text-gray-600">Preview</p>
              </div>
            </div>

            {/* Información básica */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre *
                </label>
                <input
                  type="text"
                  value={formData.Nombre}
                  onChange={(e) => updateField('Nombre', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orus-primary focus:border-transparent ${
                    errors.Nombre ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Ej: Restaurantes"
                />
                {errors.Nombre && (
                  <p className="mt-1 text-sm text-red-600">{errors.Nombre}</p>
                )}
              </div>

              {/* Orden */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Orden
                </label>
                <input
                  type="number"
                  value={formData.Orden}
                  onChange={(e) => updateField('Orden', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orus-primary focus:border-transparent"
                  min="0"
                />
              </div>
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                value={formData.Descripcion}
                onChange={(e) => updateField('Descripcion', e.target.value)}
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orus-primary focus:border-transparent ${
                  errors.Descripcion ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Descripción de la categoría (opcional)"
              />
              {errors.Descripcion && (
                <p className="mt-1 text-sm text-red-600">{errors.Descripcion}</p>
              )}
            </div>

            {/* Configuración de icono */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Configuración de Icono</h3>
              
              {/* Tipo de icono */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Icono
                </label>
                <select
                  value={formData.TipoIcono}
                  onChange={(e) => {
                    updateField('TipoIcono', e.target.value);
                    // Resetear datos del icono al cambiar tipo
                    if (e.target.value === 'EMOJI') {
                      updateField('IconoData', '🏪');
                    } else {
                      updateField('IconoData', '');
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orus-primary focus:border-transparent"
                >
                  {TIPOS_ICONO.map(tipo => (
                    <option key={tipo.value} value={tipo.value}>
                      {tipo.label} - {tipo.description}
                    </option>
                  ))}
                </select>
              </div>

              {/* Datos del icono según tipo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {formData.TipoIcono === 'EMOJI' ? 'Emoji' : 
                   formData.TipoIcono === 'SVG_INLINE' ? 'Código SVG' : 'Datos del Icono'} *
                </label>
                
                {formData.TipoIcono === 'EMOJI' ? (
                  <div>
                    <div className="grid grid-cols-8 gap-2 p-3 border border-gray-300 rounded-lg max-h-32 overflow-y-auto">
                      {EMOJIS_CATEGORIAS.map(emoji => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => updateField('IconoData', emoji)}
                          className={`p-2 text-xl hover:bg-gray-100 rounded ${
                            formData.IconoData === emoji ? 'bg-orus-primary text-white' : ''
                          }`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      value={formData.IconoData}
                      onChange={(e) => updateField('IconoData', e.target.value)}
                      className={`mt-2 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orus-primary focus:border-transparent ${
                        errors.IconoData ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="O escribe un emoji"
                    />
                  </div>
                ) : formData.TipoIcono === 'SVG_INLINE' ? (
                  <textarea
                    value={formData.IconoData}
                    onChange={(e) => updateField('IconoData', e.target.value)}
                    rows={4}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orus-primary focus:border-transparent font-mono text-sm ${
                      errors.IconoData ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="<svg>...</svg>"
                  />
                ) : formData.TipoIcono === 'SVG_FILE' || formData.TipoIcono === 'IMAGE' ? (
                  <div className="space-y-3">
                    <IconUploader 
                      onIconUploaded={handleIconUploaded}
                      disabled={submitting}
                    />
                    {formData.IconoData && (
                      <div className="text-sm text-gray-600">
                        <strong>Archivo actual:</strong> {formData.IconoData}
                      </div>
                    )}
                  </div>
                ) : (
                  <input
                    type="text"
                    value={formData.IconoData}
                    onChange={(e) => updateField('IconoData', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orus-primary focus:border-transparent ${
                      errors.IconoData ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Nombre del archivo o datos del icono"
                  />
                )}
                
                {errors.IconoData && (
                  <p className="mt-1 text-sm text-red-600">{errors.IconoData}</p>
                )}
              </div>
            </div>

            {/* Colores */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Color primario */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color Primario
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={formData.ColorPrimario}
                    onChange={(e) => updateField('ColorPrimario', e.target.value)}
                    className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.ColorPrimario}
                    onChange={(e) => updateField('ColorPrimario', e.target.value)}
                    className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orus-primary focus:border-transparent ${
                      errors.ColorPrimario ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="#6366f1"
                  />
                </div>
                {errors.ColorPrimario && (
                  <p className="mt-1 text-sm text-red-600">{errors.ColorPrimario}</p>
                )}
              </div>

              {/* Color secundario */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color Secundario
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={formData.ColorSecundario}
                    onChange={(e) => updateField('ColorSecundario', e.target.value)}
                    className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.ColorSecundario}
                    onChange={(e) => updateField('ColorSecundario', e.target.value)}
                    className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orus-primary focus:border-transparent ${
                      errors.ColorSecundario ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="#ffffff"
                  />
                </div>
                {errors.ColorSecundario && (
                  <p className="mt-1 text-sm text-red-600">{errors.ColorSecundario}</p>
                )}
              </div>
            </div>

            {/* Estado activo */}
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.Activo}
                  onChange={(e) => updateField('Activo', e.target.checked)}
                  className="w-4 h-4 text-orus-primary border-gray-300 rounded focus:ring-orus-primary"
                />
                <span className="ml-2 text-sm text-gray-700">Categoría activa</span>
              </label>
            </div>

            {/* Botones */}
            <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 text-sm font-medium text-white bg-orus-primary border border-transparent rounded-lg hover:bg-orus-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Guardando...' : (categoria ? 'Actualizar' : 'Crear')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CategoriaFormModal;
