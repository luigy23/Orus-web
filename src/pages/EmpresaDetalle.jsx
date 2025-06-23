import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getEmpresaById } from '../services/empresas';
import IconOrus from '../assets/Icons/IconOrus';

const EmpresaDetalle = () => {
  const { slugId } = useParams();
  // El id es lo último después del último guion
  const id = slugId.split('-').pop();
  const [empresa, setEmpresa] = useState(null);
  const traeEmpresa = async () => {
    const empresa = await getEmpresaById(id);
    setEmpresa(empresa);
  }

  useEffect(() => {
    traeEmpresa();
  }, [id]);



  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center pb-10">
      <IconOrus className='h-10 mt-6 mb-2' />
      {empresa && (
        <div className="w-full max-w-md flex flex-col items-center">
          {/* Imagen principal */}
          <div className="w-full rounded-[2.5rem] overflow-hidden mb-4 mt-2 aspect-[2.1/1] bg-gray-200">
            <img
              src={empresa.Imagenes?.[0]?.Url || 'https://placehold.co/600x400/EEE/31343C'}
              alt={empresa.Nombre}
              className="object-cover w-full h-full"
            />
          </div>
          {/* Paginador fake */}
          <div className="flex justify-center items-center gap-2 mb-4">
            <span className="w-8 h-2 rounded-full bg-purple-300" />
            <span className="w-2 h-2 rounded-full bg-gray-300" />
            <span className="w-2 h-2 rounded-full bg-gray-300" />
            <span className="w-2 h-2 rounded-full bg-gray-300" />
          </div>
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
            href={`https://wa.me/57${empresa.Telefono}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full max-w-xs bg-[#5B3DF6] hover:bg-[#4b2fd6] text-white text-lg font-semibold py-4 rounded-full flex items-center justify-center gap-3 shadow-lg transition-all duration-200"
          >
            Contactame Ahora
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 14.487l-.012-.012a8.25 8.25 0 01-3.37 1.13c-1.5.13-2.97-.23-4.19-1.13a8.25 8.25 0 01-2.7-2.7c-.9-1.22-1.26-2.69-1.13-4.19.1-1.13.47-2.22 1.13-3.37l.012-.012a8.25 8.25 0 011.13-3.37c1.22-.9 2.69-1.26 4.19-1.13 1.13.1 2.22.47 3.37 1.13l.012.012a8.25 8.25 0 013.37 1.13c.9 1.22 1.26 2.69 1.13 4.19-.1 1.13-.47 2.22-1.13 3.37z" />
            </svg>
          </a>
        </div>
      )}
    </div>
  );
};

export default EmpresaDetalle; 