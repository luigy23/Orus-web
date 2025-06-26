import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getEmpresaById } from '../services/empresas';
import IconOrus from '../assets/Icons/IconOrus';
import EmpresaSlider from '../components/empresas/EmpresaSlider';
import IconWhatsapp from '../assets/Icons/IconWhatsapp';
import Topbar from '../components/ui/navigation/Topbar';
import BackButtom from '../components/ui/navigation/BackButtom';

const EmpresaDetalle = () => {
  const { slugId } = useParams();
  // El id es lo último después del último guion
  const id = slugId.split('-').pop();
  const [empresa, setEmpresa] = useState(null);
  const [imgIndex, setImgIndex] = useState(0);

  const traeEmpresa = async () => {
    const empresa = await getEmpresaById(id);
    setEmpresa(empresa);
    setImgIndex(0); // Reiniciar al cambiar de empresa
  }

  useEffect(() => {
    traeEmpresa();
  }, [id]); 

  return (
    <div className="min-h-screen overflow-y-auto bg-gray-50 flex flex-col items-center pb-20">
      <Topbar>
        <BackButtom />
        <IconOrus />
      </Topbar>
      {empresa && (
        <div className="w-full max-w-md flex flex-col items-center">
          {/* Slider extraído */}
          <EmpresaSlider
            imagenes={empresa.Imagenes}
            nombre={empresa.Nombre}
            imgIndex={imgIndex}
            setImgIndex={setImgIndex}
          />
          {/* Nombre */}
          <h2 className="text-3xl font-bold mb-2 text-center">{empresa.Nombre}</h2>
          {/* Categorías */}
          <div className="flex flex-wrap gap-2 justify-center mb-2">
            {empresa.Categorias?.map(cat => (
              <span key={cat.Categoria.id} className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">• {cat.Categoria.Nombre}</span>
            ))}
          </div>
          {/* Ciudad */}
          <div className="flex items-center text-gray-500 text-base mb-4 justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7-7.5 11-7.5 11s-7.5-4-7.5-11a7.5 7.5 0 1115 0z" />
            </svg>
            <span>{empresa.Ciudad}</span>
          </div>
          {/* Descripción */}
          <div className="bg-white rounded-2xl p-5 mb-6 w-full text-center text-gray-700 text-lg shadow-sm">
            {empresa.Descripcion}
          </div>
          {/* Horario */}
          <div className="w-full flex flex-col items-center mb-8">
            <div className="flex items-center gap-2 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9z" />
              </svg>
              <span className="text-xl font-semibold text-gray-700">Horario de atención</span>
            </div>
            <div className="flex flex-col gap-2 w-full max-w-xs">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Lunes a Viernes:</span>
                <span className="bg-green-100 text-green-700 rounded-full px-3 py-1 text-sm font-mono">8:00am</span>
                <span className="text-gray-400">—</span>
                <span className="bg-green-100 text-green-700 rounded-full px-3 py-1 text-sm font-mono">5:30 pm</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Sabado:</span>
                <span className="bg-green-100 text-green-700 rounded-full px-3 py-1 text-sm font-mono">8:00am</span>
                <span className="text-gray-400">—</span>
                <span className="bg-green-100 text-green-700 rounded-full px-3 py-1 text-sm font-mono">12:00 pm</span>
              </div>
            </div>
          </div>
          
          {/* Botón WhatsApp */}
          <a
            href={`https://wa.me/57${empresa.Telefono}?text=${encodeURIComponent(`Hola ${empresa.Nombre} vengo de Orus`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-72 fixed bottom-6 left-1/2 -translate-x-1/2 max-w-xs bg-orus-primary hover:bg-orus-primary/80 text-white text-lg font-semibold py-4 rounded-full flex items-center justify-center gap-3 shadow-lg transition-all duration-200 z-50"
          >
            Contactame Ahora
            <IconWhatsapp />
          </a>
        </div>
      )}
    </div>
  );
};

// Animaciones CSS para slide
// Agrega esto a tu archivo index.css o tailwind.css:
// .animate-slide-left { transform: translateX(-100%); opacity: 0; }
// .animate-slide-right { transform: translateX(100%); opacity: 0; }

export default EmpresaDetalle; 