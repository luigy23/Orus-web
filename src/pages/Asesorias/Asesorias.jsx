import React from 'react'
import Topbar from '../../components/ui/navigation/Topbar'
import BackButtom from '../../components/ui/navigation/BackButtom'

import { ItemAsesor } from './ItemAsesor'
import { asesores } from '../../data/asesores'

const Asesorias = () => {
  return (
    <div className='min-h-screen flex flex-col gap-4 bg-orus-background'>
      <Topbar>
        <div className='flex items-center justify-between gap-2 w-full'>
          <BackButtom className='bg-white shadow-md' />
        </div>
      </Topbar>
      <div className='w-full flex-col items-center justify-center px-4'>
        <h1 className='text-2xl font-bold text-center text-orus-primary mt-2'>Asesorías</h1>
        <p className='text-gray-500 p-4 text-center'>Las asesorías son un espacio exclusivo donde puedes potenciar tus ideas de negocio junto a personas altamente capacitadas, listas para guiarte, aportarte visión estratégica y ayudarte a llevar tu proyecto al siguiente nivel.</p>
      </div>
      <div className="w-full flex flex-col items-center justify-center px-4 mt-2 gap-4">
        {asesores.map((asesor) => (
          <ItemAsesor key={asesor.id} {...asesor} />
        ))}
      </div>
    </div>
  )
}

export default Asesorias