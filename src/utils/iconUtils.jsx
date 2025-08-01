import React from 'react';

/**
 * Utilidades para manejo de iconos de categorías
 */

/**
 * Obtiene el componente de icono según el tipo
 */
export const getIconComponent = (categoria) => {
  const { TipoIcono, IconoData, ColorPrimario = '#6366f1' } = categoria;

  switch (TipoIcono) {
    case 'EMOJI':
      return {
        type: 'emoji',
        content: IconoData,
        style: { fontSize: '1.5rem' }
      };

    case 'SVG_INLINE':
      return {
        type: 'svg',
        content: IconoData,
        style: { color: ColorPrimario, width: '24px', height: '24px' }
      };

    case 'SVG_FILE':
    case 'IMAGE': {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      return {
        type: 'image',
        content: `${baseUrl}/uploads/categorias/${IconoData}`,
        style: { width: '24px', height: '24px' }
      };
    }

    default:
      return {
        type: 'emoji',
        content: '❓',
        style: { fontSize: '1.5rem' }
      };
  }
};

/**
 * Renderiza un icono de categoría como JSX
 */
export const renderCategoriaIcon = (categoria, size = 'md') => {
  const iconData = getIconComponent(categoria);
  
  const sizeClasses = {
    sm: 'w-4 h-4 text-sm',
    md: 'w-6 h-6 text-base', 
    lg: 'w-8 h-8 text-lg',
    xl: 'w-12 h-12 text-xl'
  };

  const baseClasses = `flex items-center justify-center ${sizeClasses[size]}`;

  switch (iconData.type) {
    case 'emoji':
      return (
        <span 
          className={baseClasses}
          style={iconData.style}
          role="img" 
          aria-label={categoria.Nombre}
        >
          {iconData.content}
        </span>
      );

    case 'svg':
      return (
        <div 
          className={baseClasses}
          dangerouslySetInnerHTML={{ __html: iconData.content }}
          style={iconData.style}
        />
      );

    case 'image':
      return (
        <img
          src={iconData.content}
          alt={categoria.Nombre}
          className={`${baseClasses} object-contain`}
          style={iconData.style}
          onError={(e) => {
            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyUzYuNDggMjIgMTIgMjJTMjIgMTcuNTIgMjIgMTJTMTcuNTIgMiAxMiAyWk0xMyAxN0gxMVYxNUgxM1YxN1pNMTMgMTNIMTFWN0gxM1YxM1oiIGZpbGw9IiM5OTk5OTkiLz4KPHN2Zz4K';
          }}
        />
      );

    default:
      return (
        <span className={baseClasses}>❓</span>
      );
  }
};

/**
 * Obtiene el color de fondo para una categoría
 */
export const getCategoriaBackgroundColor = (categoria, opacity = 0.1) => {
  const color = categoria.ColorPrimario || '#6366f1';
  return `${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`;
};

/**
 * Obtiene el color del borde para una categoría
 */
export const getCategoriaBorderColor = (categoria, opacity = 0.3) => {
  const color = categoria.ColorPrimario || '#6366f1';
  return `${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`;
};

/**
 * Genera estilos CSS personalizados para una categoría
 */
export const getCategoriaCSSVars = (categoria) => {
  return {
    '--categoria-color-primary': categoria.ColorPrimario || '#6366f1',
    '--categoria-color-secondary': categoria.ColorSecundario || '#ffffff'
  };
};

/**
 * Valida si un emoji es válido
 */
export const isValidEmoji = (emoji) => {
  const emojiRegex = /^[\u{1f600}-\u{1f64f}]|[\u{1f300}-\u{1f5ff}]|[\u{1f680}-\u{1f6ff}]|[\u{1f700}-\u{1f77f}]|[\u{1f780}-\u{1f7ff}]|[\u{1f800}-\u{1f8ff}]|[\u{2600}-\u{26ff}]|[\u{2700}-\u{27bf}]/u;
  return emojiRegex.test(emoji);
};

/**
 * Valida si un SVG es válido
 */
export const isValidSVG = (svgString) => {
  return svgString.includes('<svg') && svgString.includes('</svg>');
};

/**
 * Lista de emojis comunes para categorías
 */
export const EMOJIS_CATEGORIAS = [
  '🍽️', '💻', '🏥', '📚', '⚽', '👗', '✈️', '💄', '🐶', '🏠',
  '🚗', '🎵', '🎨', '💼', '🔧', '🌱', '📱', '☕', '🎯', '💎',
  '🎪', '🏋️', '🍕', '🛒', '📸', '🎮', '🧘', '🍰', '🔑', '🌟'
];

/**
 * Tipos de iconos disponibles
 */
export const TIPOS_ICONO = [
  { value: 'EMOJI', label: 'Emoji', description: 'Emoji Unicode' },
  { value: 'SVG_INLINE', label: 'SVG Inline', description: 'Código SVG directo' },
  { value: 'SVG_FILE', label: 'Archivo SVG', description: 'Archivo SVG subido' },
  { value: 'IMAGE', label: 'Imagen', description: 'Imagen PNG, JPG, WEBP' }
];
