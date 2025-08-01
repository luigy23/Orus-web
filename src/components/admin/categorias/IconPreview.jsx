import React from 'react';
import { renderCategoriaIcon, getCategoriaBackgroundColor } from '../../../utils/iconUtils.jsx';

/**
 * Componente para mostrar preview de iconos de categorías en admin
 */
const IconPreview = ({ categoria, size = 'md', showBorder = true }) => {
  const sizeClasses = {
    xs: 'w-4 h-4',
    sm: 'w-6 h-6',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const backgroundColor = getCategoriaBackgroundColor(categoria, 0.1);
  const borderColor = categoria.ColorPrimario || '#6366f1';

  return (
    <div 
      className={`${sizeClasses[size]} flex items-center justify-center rounded-lg transition-all duration-200 ${
        showBorder ? 'border-2' : ''
      }`}
      style={{ 
        backgroundColor: backgroundColor,
        borderColor: showBorder ? borderColor : 'transparent'
      }}
    >
      {renderCategoriaIcon(categoria, size)}
    </div>
  );
};

export default IconPreview;
