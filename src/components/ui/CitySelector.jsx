// src/components/ui/CitySelector.jsx
import React, { useState, useRef, useEffect } from 'react';
import { MapPin, ChevronDown, X, Check } from 'lucide-react';
import { useAtom } from 'jotai';
import { ciudadBusquedaAtom, ciudadBusquedaInfoAtom } from '../../atoms/ubicacionAtom';
import { userDataAtom } from '../../atoms/userAtom';
import SelectDepartamento from './SelectDepartamento';
import SelectCiudad from './SelectCiudad';
import ubicacionService from '../../services/ubicacion.service';

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
  const [isApplying, setIsApplying] = useState(false);
  
  const panelRef = useRef(null);
  const buttonRef = useRef(null);

  // Cerrar panel al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target) && 
          buttonRef.current && !buttonRef.current.contains(event.target)) {
        setShowCitySelector(false);
        setSelectedDepartamento(null);
        setSelectedCiudad(null);
      }
    };

    if (showCitySelector) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCitySelector]);

  // Obtener la ciudad a mostrar
  const getCiudadDisplay = () => {
    if (ciudadBusquedaInfo?.nombre && ciudadBusquedaInfo?.departamento) {
      return {
        city: ciudadBusquedaInfo.nombre,
        department: ciudadBusquedaInfo.departamento
      };
    } else if (ciudadBusquedaInfo?.nombre) {
      return {
        city: ciudadBusquedaInfo.nombre,
        department: ''
      };
    } else if (userData?.ciudad?.nombre && userData?.ciudad?.departamento) {
      return {
        city: userData.ciudad.nombre,
        department: userData.ciudad.departamento
      };
    } else if (userData?.ciudad?.nombre) {
      return {
        city: userData.ciudad.nombre,
        department: ''
      };
    }
    return {
      city: "Selecciona ubicación",
      department: ''
    };
  };

  const handleCityClick = () => {
    setShowCitySelector(!showCitySelector);
    if (!showCitySelector) {
      setSelectedDepartamento(null);
      setSelectedCiudad(null);
    }
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

    setIsApplying(true);
    try {
      // Usar el servicio de ubicación en lugar de fetch directo
      const ciudadData = await ubicacionService.getCiudadPorId(selectedCiudad);
      
      setCiudadBusqueda(ciudadData.id);
      setCiudadBusquedaInfo({
        id: ciudadData.id,
        nombre: ciudadData.Nombre,
        departamento: ciudadData.Departamento.Nombre
      });
      
      setShowCitySelector(false);
      setSelectedDepartamento(null);
      setSelectedCiudad(null);
    } catch (error) {
      console.error('Error al aplicar ciudad:', error);
      // Fallback en caso de error
      setCiudadBusqueda(selectedCiudad);
      setCiudadBusquedaInfo({ 
        id: selectedCiudad,
        nombre: "Ciudad seleccionada",
        departamento: ""
      });
      setShowCitySelector(false);
      setSelectedDepartamento(null);
      setSelectedCiudad(null);
    } finally {
      setIsApplying(false);
    }
  };

  // Estilos según variante y tamaño
  const getButtonStyles = () => {
    const baseStyles = "flex items-center gap-2 rounded-full transition-all duration-300 relative group";
    
    const sizeStyles = {
      small: "px-3 py-1.5 text-sm min-w-fit",
      default: "px-4 py-2.5",
      large: "px-6 py-3 text-lg"
    };

    const variantStyles = {
      primary: "bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border border-white/20",
      secondary: "bg-white text-gray-700 border border-gray-200 hover:border-gray-300 hover:shadow-md shadow-sm"
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
    if (size === 'small') {
      return "absolute top-full mt-2 right-0 bg-white rounded-2xl shadow-2xl border border-gray-100 p-5 z-50 w-80 transform transition-all duration-300 ease-out";
    }
    return "absolute top-full mt-2 left-0 right-0 bg-white rounded-2xl shadow-2xl border border-gray-100 p-5 z-50 min-w-80 transform transition-all duration-300 ease-out";
  };

  const cityDisplay = getCiudadDisplay();

  return (
    <div className="relative">
      {showLabel && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Ubicación
        </label>
      )}
      
      <button
        ref={buttonRef}
        onClick={handleCityClick}
        className={getButtonStyles()}
      >
        <MapPin size={getIconSize()} color={getIconColor()} />
        <div className="flex flex-col items-start min-w-0">
          <span className="truncate font-medium">{cityDisplay.city}</span>
          {cityDisplay.department && (
            <span className={`text-xs opacity-75 truncate ${variant === 'primary' ? 'text-white' : 'text-gray-500'}`}>
              {cityDisplay.department}
            </span>
          )}
        </div>
        <ChevronDown 
          size={getIconSize()} 
          color={getIconColor()}
          className={`transition-transform duration-300 ${showCitySelector ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* Panel selector con animación */}
      {showCitySelector && (
        <div 
          ref={panelRef}
          className={getPanelPositionClass()}
          style={{
            animation: 'slideIn 0.3s ease-out',
            transformOrigin: 'top'
          }}
        >
          {/* Header del panel */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-900 font-semibold text-lg">Selecciona tu ubicación</h3>
            <button
              onClick={() => setShowCitySelector(false)}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X size={18} className="text-gray-500" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Departamento</label>
              <SelectDepartamento
                value={selectedDepartamento || ''}
                onChange={handleDepartamentoChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-800 focus:ring-2 focus:ring-orus-primary focus:border-orus-primary transition-all duration-200 hover:border-gray-300"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ciudad</label>
              <SelectCiudad
                departamentoId={selectedDepartamento}
                value={selectedCiudad || ''}
                onChange={handleCiudadChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-800 focus:ring-2 focus:ring-orus-primary focus:border-orus-primary transition-all duration-200 hover:border-gray-300 disabled:bg-gray-50 disabled:text-gray-400"
                disabled={!selectedDepartamento}
              />
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCitySelector(false)}
                className="flex-1 px-4 py-3 text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={aplicarCiudadSeleccionada}
                disabled={!selectedCiudad || isApplying}
                className="flex-1 px-4 py-3 bg-orus-primary text-white rounded-xl hover:bg-orus-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium flex items-center justify-center gap-2"
              >
                {isApplying ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Aplicando...
                  </>
                ) : (
                  <>
                    <Check size={16} />
                    Aplicar
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Styles para la animación */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default CitySelector;
