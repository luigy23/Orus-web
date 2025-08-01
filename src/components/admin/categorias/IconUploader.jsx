import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, FileImage, AlertCircle, CheckCircle } from 'lucide-react';
import CategoriasAdminService from '../../../services/admin/categorias.admin.service.js';

/**
 * Componente para subir iconos de categorías
 * Maneja imágenes (JPG, PNG, WEBP) y archivos SVG
 */
const IconUploader = ({ 
  onIconUploaded, 
  className = "",
  disabled = false
}) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  // Limpiar mensajes después de un tiempo
  const clearMessages = useCallback(() => {
    setTimeout(() => {
      setSuccess(null);
      setError(null);
    }, 3000);
  }, []);

  // Manejar upload de archivo
  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    setError(null);
    setSuccess(null);
    setUploading(true);

    try {
      // Crear preview local
      const previewUrl = URL.createObjectURL(file);
      setPreview({ file, url: previewUrl });

      // Subir archivo al servidor
      const result = await CategoriasAdminService.subirIcono(file);
      
      if (result.success) {
        setSuccess('Icono subido exitosamente');
        
        // Notificar al componente padre
        if (onIconUploaded) {
          onIconUploaded({
            filename: result.icono.filename,
            tipoIcono: result.icono.tipoIcono,
            file: file
          });
        }
        
        clearMessages();
      }
    } catch (error) {
      console.error('Error subiendo icono:', error);
      setError(error.response?.data?.error || 'Error al subir el icono');
      setPreview(null);
      clearMessages();
    } finally {
      setUploading(false);
    }
  }, [onIconUploaded, clearMessages]);

  // Configuración de react-dropzone
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject
  } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
      'image/svg+xml': ['.svg']
    },
    maxFiles: 1,
    maxSize: 2 * 1024 * 1024, // 2MB
    disabled: uploading || disabled
  });

  // Remover preview
  const removePreview = useCallback(() => {
    if (preview?.url) {
      URL.revokeObjectURL(preview.url);
    }
    setPreview(null);
    setSuccess(null);
    setError(null);
  }, [preview]);

  // Estilos dinámicos para la zona de drop
  const getDropzoneStyles = () => {
    let baseStyles = "border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 cursor-pointer ";
    
    if (disabled || uploading) {
      baseStyles += "border-gray-200 bg-gray-50 cursor-not-allowed ";
    } else if (isDragReject) {
      baseStyles += "border-red-300 bg-red-50 ";
    } else if (isDragActive) {
      baseStyles += "border-blue-400 bg-blue-50 ";
    } else {
      baseStyles += "border-gray-300 hover:border-gray-400 hover:bg-gray-50 ";
    }
    
    return baseStyles;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Zona de drop */}
      <div {...getRootProps()} className={getDropzoneStyles()}>
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center space-y-2">
          {uploading ? (
            <>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="text-sm text-gray-600">Subiendo icono...</p>
            </>
          ) : (
            <>
              <Upload size={32} className="text-gray-400" />
              
              {isDragReject ? (
                <p className="text-sm text-red-600">
                  Tipo de archivo no válido
                </p>
              ) : isDragActive ? (
                <p className="text-sm text-blue-600">
                  Suelta el archivo aquí...
                </p>
              ) : (
                <div className="text-sm text-gray-600">
                  <p className="font-medium">
                    Arrastra un icono aquí o haz clic para seleccionar
                  </p>
                  <p className="text-xs mt-1">
                    Formatos: JPG, PNG, WEBP, SVG (máx. 2MB)
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Preview del archivo subido */}
      {preview && (
        <div className="border rounded-lg p-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded border flex items-center justify-center bg-white">
                {preview.file.type.startsWith('image/') ? (
                  <img 
                    src={preview.url} 
                    alt="Preview" 
                    className="w-10 h-10 object-contain rounded"
                  />
                ) : (
                  <FileImage size={20} className="text-gray-400" />
                )}
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {preview.file.name}
                </p>
                <p className="text-xs text-gray-500">
                  {(preview.file.size / 1024).toFixed(1)} KB • {preview.file.type}
                </p>
              </div>
            </div>
            
            <button
              onClick={removePreview}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              disabled={uploading}
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Mensajes de estado */}
      {error && (
        <div className="flex items-center space-x-2 text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
          <AlertCircle size={16} />
          <p className="text-sm">{error}</p>
        </div>
      )}
      
      {success && (
        <div className="flex items-center space-x-2 text-green-600 bg-green-50 border border-green-200 rounded-lg p-3">
          <CheckCircle size={16} />
          <p className="text-sm">{success}</p>
        </div>
      )}

      {/* Información adicional */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>• Tamaño máximo: 2MB por archivo</p>
        <p>• Formatos soportados: JPG, PNG, WEBP, SVG</p>
        <p>• Se recomienda usar iconos cuadrados (ej: 64x64px)</p>
      </div>
    </div>
  );
};

export default IconUploader;
