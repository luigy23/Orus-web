import { renderCategoriaIcon, getCategoriaBackgroundColor, getCategoriaBorderColor } from '../../utils/iconUtils.jsx';

/**
 * Componente para mostrar una categoría individual
 */
const CategoriaItem = ({ 
  categoria, 
  size = 'md', 
  showDescription = false, 
  onClick = null,
  className = '',
  variant = 'default' // default, card, badge
}) => {
  const sizeClasses = {
    sm: 'p-2 text-sm gap-2',
    md: 'p-3 text-base gap-3',
    lg: 'p-4 text-lg gap-4'
  };

  const variantClasses = {
    default: 'flex items-center rounded-lg transition-colors duration-200',
    card: 'flex flex-col items-center text-center rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border',
    badge: 'inline-flex items-center rounded-full px-3 py-1 text-sm font-medium'
  };

  const baseClasses = `${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
  
  const backgroundColor = getCategoriaBackgroundColor(categoria, 0.1);
  const borderColor = getCategoriaBorderColor(categoria, 0.2);
  
  const customStyle = {
    backgroundColor: variant === 'card' || variant === 'badge' ? backgroundColor : 'transparent',
    borderColor: variant === 'card' ? borderColor : 'transparent',
    cursor: onClick ? 'pointer' : 'default'
  };

  const handleClick = () => {
    if (onClick) {
      onClick(categoria);
    }
  };

  return (
    <div 
      className={baseClasses}
      style={customStyle}
      onClick={handleClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      } : undefined}
    >
      {/* Icono */}
      <div className="flex-shrink-0">
        {renderCategoriaIcon(categoria, size)}
      </div>
      
      {/* Contenido */}
      <div className={variant === 'card' ? 'text-center' : 'flex-1'}>
        <h3 
          className={`font-medium ${size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg' : 'text-base'}`}
          style={{ color: categoria.ColorPrimario }}
        >
          {categoria.Nombre}
        </h3>
        
        {showDescription && categoria.Descripcion && (
          <p className={`text-gray-600 mt-1 ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
            {categoria.Descripcion}
          </p>
        )}
        
        {/* Metadatos adicionales para variant card */}
        {variant === 'card' && categoria._count && (
          <div className="mt-2 text-xs text-gray-500">
            {categoria._count.Empresas > 0 && (
              <span>{categoria._count.Empresas} empresas</span>
            )}
          </div>
        )}
      </div>
      
      {/* Indicador de estado (solo para admin) */}
      {!categoria.Activo && (
        <div className="flex-shrink-0">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Inactiva
          </span>
        </div>
      )}
    </div>
  );
};

export default CategoriaItem;
