import React, { useState, useEffect } from 'react';
import BannerService from '../../services/banner.service';

const HomeBanner = ({ className }) => {
  const [banners, setBanners] = useState([]);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar banners activos
  useEffect(() => {
    const cargarBanners = async () => {
      try {
        setLoading(true);
        const bannersActivos = await BannerService.getBannersActivos();
        setBanners(bannersActivos);
        
        if (bannersActivos.length === 0) {
          // Banner por defecto si no hay banners configurados
          setBanners([{
            id: 'default',
            titulo: 'REBAJAS',
            subtitulo: 'HASTA 50% OFF EN TODA LA COLECCIÓN',
            imagenUrl: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=80',
            textoBoton: null,
            enlaceBoton: null
          }]);
        }
      } catch (error) {
        console.error('Error al cargar banners:', error);
        setError('Error al cargar banners');
        // Banner de fallback en caso de error
        setBanners([{
          id: 'fallback',
          titulo: 'ORUS',
          subtitulo: 'Encuentra las mejores empresas de tu ciudad',
          imagenUrl: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=80',
          textoBoton: null,
          enlaceBoton: null
        }]);
      } finally {
        setLoading(false);
      }
    };

    cargarBanners();
  }, []);

  // Rotación automática de banners si hay más de uno
  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentBanner(prev => (prev + 1) % banners.length);
      }, 5000); // Cambiar cada 5 segundos

      return () => clearInterval(interval);
    }
  }, [banners.length]);

  if (loading) {
    return (
      <div className={`${className}`}>
        <div className="rounded-3xl overflow-hidden relative h-40 flex items-center justify-center bg-gray-200 animate-pulse">
          <div className="text-gray-400">Cargando...</div>
        </div>
      </div>
    );
  }

  if (error || banners.length === 0) {
    return (
      <div className={`${className}`}>
        <div className="rounded-3xl overflow-hidden relative h-40 flex items-center justify-center bg-gray-200">
          <div className="text-gray-500">No hay banners disponibles</div>
        </div>
      </div>
    );
  }

  const banner = banners[currentBanner];

  const handleBannerClick = () => {
    if (banner.enlaceBoton) {
      if (banner.enlaceBoton.startsWith('http')) {
        // Enlace externo
        window.open(banner.enlaceBoton, '_blank');
      } else {
        // Enlace interno - aquí puedes usar navigate si necesitas
        window.location.href = banner.enlaceBoton;
      }
    }
  };

  return (
    <div className={`${className}`}>
      <div 
        className={`rounded-3xl overflow-hidden relative h-40 flex items-center justify-center bg-gray-200 ${
          banner.enlaceBoton ? 'cursor-pointer hover:opacity-90 transition-opacity' : ''
        }`}
        onClick={handleBannerClick}
      >
        <img
          src={banner.imagenUrl}
          alt={banner.titulo}
          className="absolute w-full h-full object-cover opacity-70"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=80';
          }}
        />
        <div className="relative z-10 text-center px-4">
          <h2 className="text-4xl font-extrabold text-white tracking-widest">
            {banner.titulo}
          </h2>
          {banner.subtitulo && (
            <p className="text-white font-semibold mt-2 bg-black/40 rounded px-2 inline-block">
              {banner.subtitulo}
            </p>
          )}
          {banner.textoBoton && banner.enlaceBoton && (
            <button className="mt-3 px-4 py-2 bg-white text-gray-800 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              {banner.textoBoton}
            </button>
          )}
        </div>
        
        {/* Indicadores de banner si hay más de uno */}
        {banners.length > 1 && (
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {banners.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentBanner ? 'bg-white' : 'bg-white/50'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentBanner(index);
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeBanner; 