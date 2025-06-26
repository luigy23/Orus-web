import React from 'react'

const EtiquetaCategoria = ({categoria}) => {
  return (
    <div className='bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs mb-2'>
        {categoria}
    </div>
  )
}

export default EtiquetaCategoria