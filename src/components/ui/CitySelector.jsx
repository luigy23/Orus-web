// src/components/ui/CitySelector.jsx
import React, { useState } from 'react';
import { MapPin, ChevronDown } from 'lucide-react';
import { useAtom } from 'jotai';
import { ciudadBusquedaAtom, ciudadBusquedaInfoAtom } from '../../atoms/ubicacionAtom';
import { userDataAtom } from '../../atoms/userAtom';
import SelectDepartamento from './SelectDepartamento';
import SelectCiudad from './SelectCiudad';

const CitySelector = ({ 
  className = '', 
  showLabel = true,
  size = 'default', // 'small', 'default', 'large'
  variant = 'primary' // 'primary', 'secondary'
}) => {
  const [userData] = useAtom(userDataAtom);
  const [, setCiudadBusqueda] = useAtom(ciudadBusquedaAtom);
  const [ciudadBusquedaInfo, setCiudadBusquedaInfo] = useAtom(ciudadBusquedaInfoAtom);
  
  // Estados para el selector
  const [showCitySelector, setShowCitySelector] = useState(false);
  const [selectedDepartamento, setSelectedDepartamento] = useState(null);
  const [selectedCiudad, setSelectedCiudad] = useState(null);

  // Obtener la ciudad a mostrar
  const getCiudadDisplay = () => {
    if (ciudadBusquedaInfo?.nombre && ciudadBusquedaInfo?.departamento) {
      return `${ciudadBusquedaInfo.nombre}, ${ciudadBusquedaInfo.departamento}`;
    } else if (ciudadBusquedaInfo?.nombre) {
      return ciudadBusquedaInfo.nombre;
    } else if (userData?.ciudad?.nombre && userData?.ciudad?.departamento) {
      return `${userData.ciudad.nombre}, ${userData.ciudad.departamento}`;
    } else if (userData?.ciudad?.nombre) {
      return userData.ciudad.nombre;
    }
    return "Selecciona tu ciudad";
  };

  const handleCityClick = () => {
    setShowCitySelector(!showCitySelector);
    setSelectedDepartamento(null);
    setSelectedCiudad(null);
  };

  const handleDepartamentoChange = (departamentoId) => {
    setSelectedDepartamento(departamentoId);
    setSelectedCiudad(null);
  };

  const handleCiudadChange = (ciudadId) => {
    setSelectedCiudad(ciudadId);
  };

  const aplicarCiudadSeleccionada = async () => {
    if (!selectedCiudad) return;

    try {
      const response = await fetch(`http://localhost:3000/api/ubicacion/ciudad/${selectedCiudad}`);
      if (response.ok) {
        const ciudadData = await response.json();
        
        setCiudadBusqueda(ciudadData.id);
        setCiudadBusquedaInfo({
          id: ciudadData.id,
          nombre: ciudadData.Nombre,
          departamento: ciudadData.Departamento.Nombre
        });
      } else {
        setCiudadBusqueda(selectedCiudad);
        setCiudadBusquedaInfo({ 
          id: selectedCiudad,
          nombre: "Ciudad seleccionada",
          departamento: ""
        });
      }
      
      setShowCitySelector(false);
      setSelectedDepartamento(null);
      setSelectedCiudad(null);
    } catch (error) {
      console.error('Error al aplicar ciudad:', error);
      setCiudadBusqueda(selectedCiudad);
      setCiudadBusquedaInfo({ 
        id: selectedCiudad,
        nombre: "Ciudad seleccionada",
        departamento: ""
      });
      setShowCitySelector(false);
      setSelectedDepartamento(null);
      setSelectedCiudad(null);
    }
  };

  // Estilos según variante y tamaño
  const getButtonStyles = () => {
    const baseStyles = "flex items-center gap-2 rounded-full transition-all duration-300 relative";
    
    const sizeStyles = {
      small: "px-3 py-1 text-sm",
      default: "px-4 py-2",
      large: "px-6 py-3 text-lg"
    };

    const variantStyles = {
      primary: "bg-orus-primary/50 text-white hover:bg-orus-primary/70",
      secondary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 shadow-sm"
    };

    return `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`;
  };

  const getIconColor = () => {
    return variant === 'primary' ? 'white' : '#6B7280';
  };

  const getIconSize = () => {
    const sizes = {
      small: 14,
      default: 16,
      large: 18
    };
    return sizes[size];
  };

  const getPanelPositionClass = () => {
    // Para tamaño small, el panel se posiciona mejor a la derecha
    if (size === 'small') {
      return "absolute top-full mt-2 right-0 bg-white rounded-lg shadow-lg p-4 z-50 w-80";
    }
    return "absolute top-full mt-2 left-0 right-0 bg-white rounded-lg shadow-lg p-4 z-50 min-w-80";
  };

  return (
    <div className="relative">
      {showLabel && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Ubicación
        </label>
      )}
      
      <button
        onClick={handleCityClick}
        className={getButtonStyles()}
      >
        <MapPin size={getIconSize()} color={getIconColor()} />
        <span>{getCiudadDisplay()}</span>
        <ChevronDown 
          size={getIconSize()} 
          color={getIconColor()}
          className={`transition-transform ${showCitySelector ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* Panel selector */}
      {showCitySelector && (
        <div className={getPanelPositionClass()}>
          <h3 className="text-gray-800 font-medium mb-3">Selecciona tu ubicación</h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Departamento</label>
              <SelectDepartamento
                value={selectedDepartamento || ''}
                onChange={handleDepartamentoChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-orus-primary focus:border-orus-primary"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-600 mb-1">Ciudad</label>
              <SelectCiudad
                departamentoId={selectedDepartamento}
                value={selectedCiudad || ''}
                onChange={handleCiudadChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-orus-primary focus:border-orus-primary"
                disabled={!selectedDepartamento}
              />
            </div>
            
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setShowCitySelector(false)}
                className="flex-1 px-3 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={aplicarCiudadSeleccionada}
                disabled={!selectedCiudad}
                className="flex-1 px-3 py-2 bg-orus-primary text-white rounded-lg hover:bg-orus-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Aplicar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CitySelector;
