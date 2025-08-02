import { useCiudades } from '../../hooks/useUbicacion.js';

/**
 * Componente Select para seleccionar ciudades
 * @param {Object} props - Props del componente
 * @param {string|number} props.departamentoId - ID del departamento para filtrar ciudades
 * @param {string|number} props.value - Valor seleccionado
 * @param {Function} props.onChange - Función callback cuando cambia la selección
 * @param {string} props.placeholder - Texto placeholder
 * @param {boolean} props.disabled - Si está deshabilitado
 * @param {string} props.className - Clases CSS adicionales
 * @param {boolean} props.required - Si es campo requerido
 * @param {string} props.name - Nombre del campo
 * @param {string} props.id - ID del elemento
 * @param {boolean} props.autoReset - Si debe resetear cuando cambia el departamento
 * @returns {JSX.Element}
 */
export const SelectCiudad = ({
  departamentoId,
  value = '',
  onChange,
  placeholder = 'Selecciona una ciudad',
  disabled = false,
  className = '',
  required = false,
  name = 'ciudad',
  id = 'ciudad-select',
  autoReset = true,
  ...props
}) => {
  const { ciudades, loading, error } = useCiudades(
    { departamentoId },
    !!departamentoId // Solo auto-fetch si hay departamentoId
  );

  const handleChange = (e) => {
    const selectedValue = e.target.value;
    if (onChange) {
      onChange(selectedValue ? parseInt(selectedValue) : null);
    }
  };

  // Auto-reset cuando cambia el departamento
  if (autoReset && value && departamentoId && ciudades.length > 0) {
    const ciudadExiste = ciudades.some(ciudad => ciudad.id === parseInt(value));
    if (!ciudadExiste && onChange) {
      onChange(null);
    }
  }

  if (error) {
    return (
      <div className="text-red-600 text-sm">
        Error al cargar ciudades: {error}
      </div>
    );
  }

  const isDisabled = disabled || loading || !departamentoId;
  
  let placeholderText = placeholder;
  if (!departamentoId) {
    placeholderText = 'Primero selecciona un departamento';
  } else if (loading) {
    placeholderText = 'Cargando ciudades...';
  }

  return (
    <select
      id={id}
      name={name}
      value={value || ''}
      onChange={handleChange}
      disabled={isDisabled}
      required={required}
      className={`
        w-full px-3 py-2 border border-gray-300 rounded-lg
        focus:ring-2 focus:ring-blue-500 focus:border-blue-500
        disabled:bg-gray-100 disabled:cursor-not-allowed
        ${className}
      `}
      {...props}
    >
      <option value="">
        {placeholderText}
      </option>
      {ciudades.map((ciudad) => (
        <option key={ciudad.id} value={ciudad.id}>
          {ciudad.Nombre}
        </option>
      ))}
    </select>
  );
};

export default SelectCiudad;
