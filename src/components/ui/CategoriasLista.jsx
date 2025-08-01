import { useState, useEffect } from 'react';
import CategoriaItem from '../ui/CategoriaItem';
import CategoriasService from '../../services/categorias';

/**
 * Componente para mostrar una lista de categorías
 */
const CategoriasLista = ({ 
  variant = 'grid', // grid, list, horizontal
  showDescription = false,
  onCategoriaClick = null,
  filterActive = true,
  className = ''
}) => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar categorías al montar el componente
  useEffect(() => {
    const cargarCategorias = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const params = {
          activo: filterActive,
          includeInactive: !filterActive
        };
        
        const data = await CategoriasService.getCategorias(params);
        console.log('🎯 CategoriasLista (UI) - Categorías recibidas:', data);
        
        // Asegurar que siempre tenemos un array
        if (Array.isArray(data)) {
          setCategorias(data);
        } else {
          console.warn('⚠️ CategoriasLista (UI) - Las categorías no son un array:', data);
          setCategorias([]);
        }
      } catch (error) {
        console.error('Error cargando categorías:', error);
        setError('Error al cargar las categorías');
      } finally {
        setLoading(false);
      }
    };

    cargarCategorias();
  }, [filterActive]);

  // Clases CSS según el variant
  const variantClasses = {
    grid: 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4',
    list: 'space-y-2',
    horizontal: 'flex flex-wrap gap-2'
  };

  const containerClasses = `${variantClasses[variant]} ${className}`;

  // Estados de carga y error
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Cargando categorías...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <span className="text-red-800">{error}</span>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (categorias.length === 0) {
    return (
      <div className="text-center py-8">
        <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-1">No hay categorías</h3>
        <p className="text-gray-500">No se encontraron categorías disponibles.</p>
      </div>
    );
  }

  return (
    <div className={containerClasses}>
      {categorias.map((categoria) => (
        <CategoriaItem
          key={categoria.id}
          categoria={categoria}
          variant={variant === 'horizontal' ? 'badge' : variant === 'grid' ? 'card' : 'default'}
          showDescription={showDescription}
          onClick={onCategoriaClick}
          size={variant === 'horizontal' ? 'sm' : 'md'}
        />
      ))}
    </div>
  );
};

export default CategoriasLista;
