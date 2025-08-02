import { useState, useRef, useEffect } from 'react';
import { useBuscarCiudades } from '../../hooks/useUbicacion.js';

/**
 * Componente de autocompletado para búsqueda de ciudades
 * @param {Object} props - Props del componente
 * @param {Function} props.onSelect - Función callback cuando se selecciona una ciudad
 * @param {string} props.placeholder - Texto placeholder
 * @param {string} props.className - Clases CSS adicionales
 * @param {number} props.departamentoId - ID del departamento para filtrar (opcional)
 * @param {number} props.delay - Delay en ms para el debounce
 * @param {number} props.minLength - Caracteres mínimos para iniciar búsqueda
 * @returns {JSX.Element}
 */
export const AutocompleteCiudad = ({
  onSelect,
  placeholder = 'Buscar ciudad...',
  className = '',
  departamentoId = null,
  delay = 300,
  minLength = 2,
  ...props
}) => {
  const [termino, setTermino] = useState('');
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const [ciudadSeleccionada, setCiudadSeleccionada] = useState(null);
  const inputRef = useRef(null);
  const resultadosRef = useRef(null);

  const { resultados, loading } = useBuscarCiudades(termino, departamentoId, delay);

  // Manejar clic fuera del componente para cerrar resultados
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        inputRef.current && 
        !inputRef.current.contains(event.target) &&
        resultadosRef.current && 
        !resultadosRef.current.contains(event.target)
      ) {
        setMostrarResultados(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e) => {
    const valor = e.target.value;
    setTermino(valor);
    
    if (valor.length >= minLength) {
      setMostrarResultados(true);
    } else {
      setMostrarResultados(false);
    }

    // Resetear selección si se modifica el texto
    if (ciudadSeleccionada && valor !== ciudadSeleccionada.Nombre) {
      setCiudadSeleccionada(null);
      if (onSelect) {
        onSelect(null);
      }
    }
  };

  const handleSelectCiudad = (ciudad) => {
    setCiudadSeleccionada(ciudad);
    setTermino(ciudad.Nombre);
    setMostrarResultados(false);
    
    if (onSelect) {
      onSelect(ciudad);
    }
  };

  const handleInputFocus = () => {
    if (termino.length >= minLength && resultados.length > 0) {
      setMostrarResultados(true);
    }
  };

  const limpiarSeleccion = () => {
    setTermino('');
    setCiudadSeleccionada(null);
    setMostrarResultados(false);
    if (onSelect) {
      onSelect(null);
    }
    inputRef.current?.focus();
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={termino}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          className="
            w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            disabled:bg-gray-100 disabled:cursor-not-allowed
          "
          {...props}
        />
        
        {/* Botón para limpiar */}
        {termino && (
          <button
            type="button"
            onClick={limpiarSeleccion}
            className="
              absolute right-2 top-1/2 transform -translate-y-1/2
              text-gray-400 hover:text-gray-600 focus:outline-none
            "
          >
            ✕
          </button>
        )}

        {/* Indicador de carga */}
        {loading && (
          <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>

      {/* Resultados del autocompletado */}
      {mostrarResultados && termino.length >= minLength && (
        <div
          ref={resultadosRef}
          className="
            absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg
            max-h-60 overflow-y-auto
          "
        >
          {loading && (
            <div className="px-3 py-2 text-gray-500 text-center">
              Buscando ciudades...
            </div>
          )}

          {!loading && resultados.length === 0 && (
            <div className="px-3 py-2 text-gray-500 text-center">
              No se encontraron ciudades
            </div>
          )}

          {!loading && resultados.length > 0 && (
            <>
              {resultados.map((ciudad) => (
                <button
                  key={ciudad.id}
                  type="button"
                  onClick={() => handleSelectCiudad(ciudad)}
                  className="
                    w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100
                    focus:outline-none first:rounded-t-lg last:rounded-b-lg
                  "
                >
                  <div className="font-medium">{ciudad.Nombre}</div>
                  <div className="text-sm text-gray-600">
                    {ciudad.Departamento?.Nombre}
                  </div>
                </button>
              ))}
            </>
          )}
        </div>
      )}

      {/* Información de la ciudad seleccionada */}
      {ciudadSeleccionada && (
        <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg">
          <div className="text-sm">
            <span className="font-medium text-green-800">Seleccionado:</span>
            <span className="ml-1">
              {ciudadSeleccionada.Nombre}, {ciudadSeleccionada.Departamento?.Nombre}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AutocompleteCiudad;
