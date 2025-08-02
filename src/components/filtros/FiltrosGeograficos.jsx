import { useState, useEffect } from 'react';
import SelectDepartamento from '../ui/SelectDepartamento.jsx';
import SelectCiudad from '../ui/SelectCiudad.jsx';

/**
 * Componente de filtros geográficos combinados
 * Maneja la selección de departamento y ciudad de forma coordinada
 * @param {Object} props - Props del componente
 * @param {Function} props.onFilterChange - Callback cuando cambian los filtros
 * @param {Object} props.filtros - Filtros iniciales
 * @param {string} props.filtros.departamentoId - ID del departamento
 * @param {string} props.filtros.ciudadId - ID de la ciudad
 * @param {boolean} props.showClearButton - Si mostrar botón de limpiar
 * @param {string} props.className - Clases CSS adicionales
 * @param {string} props.layout - Layout: 'horizontal' | 'vertical'
 * @returns {JSX.Element}
 */
export const FiltrosGeograficos = ({
  onFilterChange,
  filtros = { departamentoId: '', ciudadId: '' },
  showClearButton = true,
  className = '',
  layout = 'horizontal'
}) => {
  const [filtrosInternos, setFiltrosInternos] = useState(filtros);

  // Sincronizar con filtros externos
  useEffect(() => {
    setFiltrosInternos(filtros);
  }, [filtros]);

  const handleDepartamentoChange = (departamentoId) => {
    const nuevosFiltros = { 
      departamentoId, 
      ciudadId: '' // Reset ciudad cuando cambia departamento
    };
    setFiltrosInternos(nuevosFiltros);
    
    if (onFilterChange) {
      onFilterChange(nuevosFiltros);
    }
  };

  const handleCiudadChange = (ciudadId) => {
    const nuevosFiltros = { 
      ...filtrosInternos, 
      ciudadId 
    };
    setFiltrosInternos(nuevosFiltros);
    
    if (onFilterChange) {
      onFilterChange(nuevosFiltros);
    }
  };

  const limpiarFiltros = () => {
    const filtrosVacios = { departamentoId: '', ciudadId: '' };
    setFiltrosInternos(filtrosVacios);
    
    if (onFilterChange) {
      onFilterChange(filtrosVacios);
    }
  };

  const hayFiltros = filtrosInternos.departamentoId || filtrosInternos.ciudadId;

  const containerClass = layout === 'vertical' 
    ? 'space-y-4' 
    : 'flex flex-col sm:flex-row gap-4';

  return (
    <div className={`filtros-geograficos ${className}`}>
      <div className={containerClass}>
        {/* Selector de Departamento */}
        <div className="flex-1">
          <label htmlFor="departamento-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Departamento
          </label>
          <SelectDepartamento
            id="departamento-filter"
            value={filtrosInternos.departamentoId}
            onChange={handleDepartamentoChange}
            placeholder="Todos los departamentos"
            className="w-full"
          />
        </div>

        {/* Selector de Ciudad */}
        <div className="flex-1">
          <label htmlFor="ciudad-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Ciudad
          </label>
          <SelectCiudad
            id="ciudad-filter"
            departamentoId={filtrosInternos.departamentoId}
            value={filtrosInternos.ciudadId}
            onChange={handleCiudadChange}
            placeholder="Todas las ciudades"
            className="w-full"
          />
        </div>

        {/* Botón de limpiar filtros */}
        {showClearButton && hayFiltros && (
          <div className={layout === 'vertical' ? '' : 'flex items-end'}>
            <button
              type="button"
              onClick={limpiarFiltros}
              className="
                px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 
                rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 
                focus:ring-offset-2 focus:ring-blue-500
                w-full sm:w-auto
              "
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </div>

      {/* Indicador de filtros activos */}
      {hayFiltros && (
        <div className="mt-3 flex flex-wrap gap-2">
          {filtrosInternos.departamentoId && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Departamento filtrado
            </span>
          )}
          {filtrosInternos.ciudadId && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Ciudad filtrada
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default FiltrosGeograficos;
