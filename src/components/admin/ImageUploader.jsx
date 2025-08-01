import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { useImageUpload } from '../../hooks/useImageUpload';
import { getImageUrl } from '../../utils/imageUtils';

/**
 * Componente para gestión de imágenes de empresas
 * Incluye drag & drop, preview, reordenamiento y marcado como principal
 */
const ImageUploader = ({ 
  empresaId, 
  initialImages = [], 
  onImagesChange,
  className = "",
  maxImages = 10 
}) => {
  const {
    images,
    uploading,
    uploadProgress,
    error,
    loadImages,
    uploadImages,
    deleteImage,
    markAsPrincipal,
    reorderImages,
    clearError
  } = useImageUpload();

  const [draggedIndex, setDraggedIndex] = useState(null);
  const [success, setSuccess] = useState(null);

  // Cargar imágenes iniciales
  useEffect(() => {
    if (empresaId && initialImages.length === 0) {
      loadImages(empresaId);
    } else if (initialImages.length > 0) {
      // Si se proporcionan imágenes iniciales, usarlas
      loadImages(empresaId);
    }
  }, [empresaId, initialImages.length, loadImages]);

  // Notificar cambios al componente padre
  useEffect(() => {
    if (onImagesChange) {
      onImagesChange(images);
    }
  }, [images, onImagesChange]);

  // Configuración de react-dropzone
  const onDrop = useCallback(async (acceptedFiles) => {
    if (!empresaId) {
      console.error('No se ha proporcionado empresaId');
      return;
    }

    clearError();
    setSuccess(null);

    const result = await uploadImages(empresaId, acceptedFiles);
    
    if (result.success) {
      setSuccess(result.message);
      setTimeout(() => setSuccess(null), 3000);
    }
  }, [empresaId, uploadImages, clearError]);

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
      'image/webp': ['.webp']
    },
    maxFiles: maxImages,
    maxSize: 5 * 1024 * 1024, // 5MB
    disabled: uploading
  });

  // Manejar eliminación de imagen
  const handleDeleteImage = async (imagenId) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta imagen?')) {
      return;
    }

    const result = await deleteImage(empresaId, imagenId);
    
    if (result.success) {
      setSuccess(result.message);
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  // Manejar marcado como principal
  const handleMarkAsPrincipal = async (imagenId) => {
    const result = await markAsPrincipal(empresaId, imagenId);
    
    if (result.success) {
      setSuccess(result.message);
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  // Manejar inicio de drag para reordenamiento
  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  // Manejar drop para reordenamiento
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e, dropIndex) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      return;
    }

    // Crear nuevo orden
    const newImages = [...images];
    const draggedImage = newImages[draggedIndex];
    newImages.splice(draggedIndex, 1);
    newImages.splice(dropIndex, 0, draggedImage);

    const result = await reorderImages(empresaId, newImages);
    
    if (result.success) {
      setSuccess(result.message);
      setTimeout(() => setSuccess(null), 3000);
    }

    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Área de drop para subir imágenes */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive 
            ? 'border-orus-primary bg-orus-primary/5' 
            : isDragReject 
            ? 'border-red-400 bg-red-50'
            : 'border-gray-300 hover:border-orus-primary hover:bg-gray-50'
          }
          ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="space-y-2">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          
          {isDragActive ? (
            <p className="text-orus-primary font-medium">Suelta las imágenes aquí...</p>
          ) : isDragReject ? (
            <p className="text-red-600">Algunos archivos no son válidos</p>
          ) : (
            <div>
              <p className="text-gray-600">
                Arrastra y suelta imágenes aquí, o{' '}
                <span className="text-orus-primary font-medium">haz clic para seleccionar</span>
              </p>
              <p className="text-sm text-gray-400 mt-1">
                JPG, PNG o WEBP (máx. 5MB cada una, hasta {maxImages} imágenes)
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Barra de progreso durante la subida */}
      {uploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Subiendo imágenes...</span>
            <span className="text-gray-600">{uploadProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-orus-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Mensajes de error y éxito */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <div className="flex">
            <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
            <button
              onClick={clearError}
              className="ml-auto text-red-400 hover:text-red-600"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-md p-3">
          <div className="flex">
            <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="ml-3 text-sm text-green-800">{success}</p>
          </div>
        </div>
      )}

      {/* Grid de imágenes existentes */}
      {images.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-900">
            Imágenes ({images.length})
          </h4>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images
              .sort((a, b) => a.Orden - b.Orden)
              .map((imagen, index) => (
              <div
                key={imagen.id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
                className={`
                  relative group rounded-lg overflow-hidden border-2 transition-all cursor-move
                  ${imagen.EsPrincipal 
                    ? 'border-green-400 ring-2 ring-green-200' 
                    : 'border-gray-200 hover:border-orus-primary'
                  }
                  ${draggedIndex === index ? 'opacity-50' : ''}
                `}
              >
                {/* Imagen */}
                <div className="aspect-square">
                  <img
                    src={getImageUrl(imagen.Url)}
                    alt={`Imagen ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://placehold.co/200x200/EEE/999?text=Error';
                    }}
                  />
                </div>

                {/* Overlay con acciones */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                    {/* Botón marcar como principal */}
                    {!imagen.EsPrincipal && (
                      <button
                        onClick={() => handleMarkAsPrincipal(imagen.id)}
                        className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
                        title="Marcar como principal"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      </button>
                    )}

                    {/* Botón eliminar */}
                    <button
                      onClick={() => handleDeleteImage(imagen.id)}
                      className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                      title="Eliminar imagen"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Indicadores */}
                <div className="absolute top-2 left-2 flex space-x-1">
                  {imagen.EsPrincipal && (
                    <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                      Principal
                    </span>
                  )}
                  <span className="bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full">
                    #{imagen.Orden}
                  </span>
                </div>

                {/* Indicador de drag */}
                <div className="absolute top-2 right-2">
                  <svg className="h-4 w-4 text-white opacity-0 group-hover:opacity-75 transition-opacity" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </div>
              </div>
            ))}
          </div>

          {/* Instrucciones de uso */}
          <p className="text-xs text-gray-500 mt-2">
            💡 Arrastra las imágenes para reordenarlas. La imagen marcada como "Principal" se mostrará primero.
          </p>
        </div>
      )}

      {/* Mensaje cuando no hay imágenes */}
      {images.length === 0 && !uploading && (
        <div className="text-center py-8">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="mt-2 text-sm text-gray-500">No hay imágenes cargadas</p>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
