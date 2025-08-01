import React from 'react'
import { Link } from 'react-router-dom';
import slugify from '../../utils/slugify';
import { getMainImageUrl } from '../../utils/imageUtils';
import EtiquetaCategoria from '../home/categorias/EtiquetaCategoria';

// "Categorias": [
// //           {
// //               "id": 1,
// //               "Empresa_id": 1,
// //               "Categoria_id": 2
// //           }
// //       ],


const EmpresaItem = ({ empresa }) => {
  // Obtener la imagen principal usando la utilidad
  const imagenUrl = getMainImageUrl(empresa.Imagenes);

  const PrimeraCategoria = empresa.Categorias[0]?.Categoria?.Nombre || 'Sin categoría';
  // Obtener la(s) categoría(s) (puede requerir ajuste si tienes nombres de categorías por ahora ponemos la primera)
  // Aquí solo se muestra un ejemplo genérico


  // Ciudad
  const ciudad = empresa.Ciudad || 'Sin ciudad';

  return (
    <Link to={`/empresas/${slugify(empresa.Nombre)}-${empresa.id}`} className="bg-white rounded-3xl shadow-md flex flex-col items-center w-full pb-4 transition-transform hover:scale-105 cursor-pointer text-inherit no-underline">
      <div className="w-full h-[97px] rounded-2xl overflow-hidden mb-4">
        <img
          src={imagenUrl}
          alt={empresa.Nombre}
          className="object-cover w-full h-full"
        />
      </div>
      <h2 className="text-base font-semibold mb-2 text-center">{empresa.Nombre}</h2>
      <EtiquetaCategoria categoria={PrimeraCategoria} />
      <div className="flex items-center text-gray-500 text-base mt-1">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7-7.5 11-7.5 11s-7.5-4-7.5-11a7.5 7.5 0 1115 0z" />
        </svg>
        <span className='text-xs'>{ciudad}</span>
      </div>
    </Link>
  )
}

export default EmpresaItem