// src/components/ui/FiltrosGeograficos.jsx
import React, { useState, useEffect } from 'react';
import SelectDepartamento from './SelectDepartamento';
import SelectCiudad from './SelectCiudad';

/**
 * Componente para filtros geográficos combinados
 * Maneja la coordinación entre departamento y ciudad
 */
const FiltrosGeograficos = ({ 
  departamentoId, 
  ciudadId, 
  onChange, 
  className = "",
  showLabels = true,
  placeholder = {
    departamento: "Seleccionar departamento",
    ciudad: "Seleccionar ciudad"
  }
}) => {
  const [departamentoSeleccionado, setDepartamentoSeleccionado] = useState(departamentoId);

  // Sincronizar con props cuando cambien externamente
  useEffect(() => {
    setDepartamentoSeleccionado(departamentoId);
  }, [departamentoId]);

  // Manejar cambio de departamento
  const handleDepartamentoChange = (nuevoDepartamentoId) => {
    setDepartamentoSeleccionado(nuevoDepartamentoId);
    
    // Notificar cambios al componente padre
    onChange({
      departamentoId: nuevoDepartamentoId,
      ciudadId: null // Reset ciudad cuando cambia departamento
    });
  };

  // Manejar cambio de ciudad
  const handleCiudadChange = (nuevaCiudadId) => {
    onChange({
      departamentoId: departamentoSeleccionado,
      ciudadId: nuevaCiudadId
    });
  };

  // Limpiar filtros
  const handleLimpiar = () => {
    setDepartamentoSeleccionado(null);
    onChange({
      departamentoId: null,
      ciudadId: null
    });
  };

  return (
    <div className={className}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Selector de Departamento */}
        <div>
          {showLabels && (
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Departamento
            </label>
          )}
          <SelectDepartamento
            value={departamentoSeleccionado}
            onChange={handleDepartamentoChange}
            placeholder={placeholder.departamento}
            className="w-full"
          />
        </div>

        {/* Selector de Ciudad */}
        <div>
          {showLabels && (
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ciudad
            </label>
          )}
          <SelectCiudad
            departamentoId={departamentoSeleccionado}
            value={ciudadId}
            onChange={handleCiudadChange}
            placeholder={placeholder.ciudad}
            disabled={!departamentoSeleccionado}
            className="w-full"
          />
        </div>
      </div>

      {/* Botón para limpiar filtros (opcional) */}
      {(departamentoSeleccionado || ciudadId) && (
        <div className="mt-2 flex justify-end">
          <button
            onClick={handleLimpiar}
            className="text-sm text-gray-500 hover:text-gray-700 underline focus:outline-none"
          >
            Limpiar ubicación
          </button>
        </div>
      )}
    </div>
  );
};

export default FiltrosGeograficos;
