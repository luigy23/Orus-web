import React from 'react';
import { renderCategoriaIcon, getCategoriaBackgroundColor } from '../../../utils/iconUtils.jsx';

const EtiquetaCategoria = ({ categoria, size = 'sm', showIcon = true }) => {
  // Si categoria es un string (compatibilidad con código antiguo)
  if (typeof categoria === 'string') {
    return (
      <div className='bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs'>
        {categoria}
      </div>
    );
  }

  // Si categoria es un objeto con el nuevo formato
  const backgroundColor = getCategoriaBackgroundColor(categoria, 0.15);
  const textColor = categoria.ColorPrimario || '#6366f1';
  
  const sizeClasses = {
    xs: 'px-2 py-0.5 text-xs gap-1',
    sm: 'px-3 py-1 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-5 py-2.5 text-base gap-2.5'
  };

  return (
    <div 
      className={`inline-flex items-center rounded-full font-medium ${sizeClasses[size]}`}
      style={{ 
        backgroundColor,
        color: textColor
      }}
    >
      {showIcon && (
        <span className="flex-shrink-0">
          {renderCategoriaIcon(categoria, 'sm')}
        </span>
      )}
      <span>{categoria.Nombre}</span>
    </div>
  );
};

export default EtiquetaCategoria;