import { useDepartamentos } from '../../hooks/useUbicacion.js';

/**
 * Componente Select para seleccionar departamentos
 * @param {Object} props - Props del componente
 * @param {string|number} props.value - Valor seleccionado
 * @param {Function} props.onChange - Función callback cuando cambia la selección
 * @param {string} props.placeholder - Texto placeholder
 * @param {boolean} props.disabled - Si está deshabilitado
 * @param {string} props.className - Clases CSS adicionales
 * @param {boolean} props.required - Si es campo requerido
 * @param {string} props.name - Nombre del campo
 * @param {string} props.id - ID del elemento
 * @returns {JSX.Element}
 */
export const SelectDepartamento = ({
  value = '',
  onChange,
  placeholder = 'Selecciona un departamento',
  disabled = false,
  className = '',
  required = false,
  name = 'departamento',
  id = 'departamento-select',
  ...props
}) => {
  const { departamentos, loading, error } = useDepartamentos(false);

  const handleChange = (e) => {
    const selectedValue = e.target.value;
    if (onChange) {
      onChange(selectedValue ? parseInt(selectedValue) : null);
    }
  };

  if (error) {
    return (
      <div className="text-red-600 text-sm">
        Error al cargar departamentos: {error}
      </div>
    );
  }

  return (
    <select
      id={id}
      name={name}
      value={value || ''}
      onChange={handleChange}
      disabled={disabled || loading}
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
        {loading ? 'Cargando departamentos...' : placeholder}
      </option>
      {departamentos.map((departamento) => (
        <option key={departamento.id} value={departamento.id}>
          {departamento.Nombre}
        </option>
      ))}
    </select>
  );
};

export default SelectDepartamento;
