    import React, { useState, useEffect } from 'react'
import { getCategorias } from '../../../services/categorias'
import CategoriaItem from './CategoriaItem'

const CategoriasLista = () => {

    const [categorias, setCategorias] = useState([])

    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const response = await getCategorias()
                console.log('🏠 CategoriasLista - Categorías recibidas:', response);
                
                // Asegurar que siempre tenemos un array
                if (Array.isArray(response)) {
                    setCategorias(response);
                } else {
                    console.warn('⚠️ CategoriasLista - Las categorías no son un array:', response);
                    setCategorias([]);
                }
            } catch (error) {
                console.error('❌ CategoriasLista - Error al cargar categorías:', error);
                setCategorias([]);
            }
        }
        fetchCategorias()
    }, [])


  return (
    <div>
        <div className='px-4 grid overflow-y-scroll hide-scrollbar h-80 grid-cols-4 md:grid-cols-6 gap-2 categorias-fade pt-2  pb-24'>
          {Array.isArray(categorias) && categorias.map((categoria) => (
            <CategoriaItem key={categoria.id} categoria={categoria} color="text-white" />
          ))}
        </div>
    </div>
  )
}

export default CategoriasLista