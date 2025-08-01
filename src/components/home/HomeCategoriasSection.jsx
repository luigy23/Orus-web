import React from 'react';
import { useCategorias } from '../../hooks/useCategorias';
import CategoriaItem from '../ui/CategoriaItem';

/**
 * Componente para mostrar categorías en la página de inicio
 */
const HomeCategoriasSection = ({ 
  title = "Explora por Categorías",
  showAll = false,
  maxItems = 8,
  onCategoriaClick = null
}) => {
  const { categorias, loading, error, recargar } = useCategorias();

  // Limitar el número de categorías mostradas
  const categoriasAMostrar = showAll ? categorias : categorias.slice(0, maxItems);

  if (loading) {
    return (
      <section className="py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 rounded-lg h-20 mb-2"></div>
                <div className="bg-gray-200 rounded h-4 w-3/4 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <svg className="w-12 h-12 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h3 className="text-lg font-medium text-red-900 mb-2">Error al cargar categorías</h3>
            <p className="text-red-700 mb-4">{error}</p>
            <button 
              onClick={recargar}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Reintentar
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (categoriasAMostrar.length === 0) {
    return (
      <section className="py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
          <div className="text-center py-8">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No hay categorías disponibles</h3>
            <p className="text-gray-500">Las categorías aparecerán aquí cuando estén disponibles.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          {!showAll && categorias.length > maxItems && (
            <button 
              className="text-blue-600 hover:text-blue-800 font-medium"
              onClick={() => {
                // Aquí podrías navegar a una página con todas las categorías
                console.log('Ver todas las categorías');
              }}
            >
              Ver todas ({categorias.length})
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
          {categoriasAMostrar.map((categoria) => (
            <CategoriaItem
              key={categoria.id}
              categoria={categoria}
              variant="card"
              size="md"
              onClick={onCategoriaClick}
              className="hover:scale-105 transform transition-transform duration-200"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeCategoriasSection;
