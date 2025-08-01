import React from 'react';
import { Link } from 'react-router-dom';
import { renderCategoriaIcon, getCategoriaBackgroundColor } from '../../../utils/iconUtils.jsx';

const CategoriaItem = ({ categoria, color = "text-gray-700" }) => {
  // Compatibilidad: si es el formato antiguo (solo string), usar estructura legacy
  if (typeof categoria === 'string' || !categoria.TipoIcono) {
    const { Nombre, Icono, id } = categoria;
    
    return (  
      <Link to={`/empresas/categoria/${Nombre}-${id}`}>
        <div key={id} className="flex flex-col items-center cursor-pointer group">
          <div className="bg-white h-16 w-16 rounded-full shadow-md p-4 mb-1 flex items-center justify-center
          hover:scale-105 hover:text-white transition-all duration-300">
            {Icono}
          </div>
          <span className={`${color} text-sm group-hover:text-orus-primary transition-colors duration-300 block max-w-20 truncate text-center`}>
            {Nombre}
          </span>
        </div>
      </Link>
    );
  }

  // Nuevo formato con sistema avanzado de iconos
  const { Nombre, id, Slug, ColorPrimario } = categoria;
  const backgroundColor = getCategoriaBackgroundColor(categoria, 0.1);
  
  return (  
    <Link to={`/empresas/categoria/${Slug || `${Nombre}-${id}`}`}>
      <div className="flex flex-col items-center cursor-pointer group">
        <div 
          className="h-16 w-16 rounded-full shadow-md p-3 mb-1 flex items-center justify-center
          hover:scale-105 transition-all duration-300 border-2"
          style={{ 
            backgroundColor: backgroundColor,
            borderColor: ColorPrimario || '#6366f1'
          }}
        >
          {renderCategoriaIcon(categoria, 'md')}
        </div>
        <span 
          className={`text-sm group-hover:transition-colors duration-300 block max-w-20 truncate text-center`}
          style={{ 
            color: color === "text-gray-700" ? '#374151' : color,
            '--hover-color': ColorPrimario || '#6366f1'
          }}
          onMouseEnter={(e) => {
            e.target.style.color = ColorPrimario || '#6366f1';
          }}
          onMouseLeave={(e) => {
            e.target.style.color = color === "text-gray-700" ? '#374151' : color;
          }}
        >
          {Nombre}
        </span>
      </div>
    </Link>
  );
};

export default CategoriaItem;