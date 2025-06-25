    import React, { useState, useEffect } from 'react'
import { getCategorias } from '../../../services/categorias'
import CategoriaItem from './CategoriaItem'

const CategoriasLista = () => {

    const [categorias, setCategorias] = useState([])

    useEffect(() => {
        const fetchCategorias = async () => {
            const response = await getCategorias()
            setCategorias(response)
        }
        fetchCategorias()
    }, [])


  return (
    <div>
        <div className='px-4 grid overflow-y-scroll hide-scrollbar h-80 grid-cols-4 md:grid-cols-6 gap-2 categorias-fade pt-2  pb-24'>
          {categorias.map((categoria) => (
            <CategoriaItem key={categoria.id} categoria={categoria} color="text-white" />
          ))}
        </div>
    </div>
  )
}

export default CategoriasLista