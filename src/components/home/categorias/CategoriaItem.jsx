import React from 'react'
import { Link } from 'react-router-dom';

const CategoriaItem = ({categoria, color = "text-gray-700"}) => {

    const {Nombre, Icono, id} = categoria;
    

  return (  
    <Link to={`/empresas/categoria/${Nombre}-${id}`}>
    <div key={id} className="flex flex-col items-center cursor-pointer group">
        <div className="bg-white h-16 w-16 rounded-full shadow-md p-4 mb-1 flex items-center justify-center
        hover:scale-105 hover:text-white transition-all duration-300
        ">
            {Icono}
        </div>
        <span className={`${color} text-sm group-hover:text-orus-primary transition-colors duration-300 block max-w-20 truncate text-center`}>{Nombre}</span>
    </div>
    </Link>
  )
  
}

export default CategoriaItem