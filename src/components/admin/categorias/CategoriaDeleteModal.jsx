import React, { useState } from 'react';
import IconPreview from './IconPreview';

/**
 * Modal para confirmar eliminación de categorías
 */
const CategoriaDeleteModal = ({ open, categoria, onClose, onConfirm }) => {
  const [deleting, setDeleting] = useState(false);

  /**
   * Manejar confirmación de eliminación
   */
  const handleConfirm = async () => {
    setDeleting(true);
    
    try {
      const result = await onConfirm();
      
      if (result.success) {
        onClose();
      }
    } catch (error) {
      console.error('Error eliminando categoría:', error);
    } finally {
      setDeleting(false);
    }
  };

  if (!open || !categoria) return null;

  const hasEmpresas = categoria._count?.Empresas > 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-4">
        {/* Overlay */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">
              Eliminar Categoría
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

          {/* Content */}
          <div className="p-6">
            {/* Categoría a eliminar */}
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg mb-4">
              <IconPreview categoria={categoria} size="lg" />
              <div>
                <h3 className="text-lg font-medium text-gray-900">{categoria.Nombre}</h3>
                {categoria.Descripcion && (
                  <p className="text-sm text-gray-600">{categoria.Descripcion}</p>
                )}
                <p className="text-xs text-gray-500">
                  {categoria._count?.Empresas || 0} empresa(s) asociada(s)
                </p>
              </div>
            </div>

            {/* Advertencia */}
            <div className="space-y-3">
              {hasEmpresas ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-red-400 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <h4 className="text-sm font-medium text-red-800">
                        No se puede eliminar esta categoría
                      </h4>
                      <p className="text-sm text-red-700 mt-1">
                        Esta categoría tiene {categoria._count?.Empresas} empresa(s) asociada(s). 
                        Primero debes reasignar o eliminar esas empresas.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-yellow-400 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <h4 className="text-sm font-medium text-yellow-800">
                        Confirma la eliminación
                      </h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        Esta acción no se puede deshacer. La categoría será eliminada permanentemente.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <p className="text-sm text-gray-600">
                ¿Estás seguro que deseas eliminar la categoría <strong>"{categoria.Nombre}"</strong>?
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={hasEmpresas || deleting}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {deleting ? 'Eliminando...' : 'Eliminar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoriaDeleteModal;
