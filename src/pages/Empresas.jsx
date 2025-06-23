import React, { useState, useEffect } from 'react'
import IconOrus from '../assets/Icons/IconOrus'
import HomeSearchBar from '../components/HomeSearchBar'
import { getEmpresas } from '../services/empresas'
import EmpresaItem from '../components/empresas/EmpresaItem'

const Empresas = () => {

  const [empresas, setEmpresas] = useState([])

  useEffect(() => {
    getEmpresas().then(setEmpresas)
  }, [])

  console.log(empresas)

  return (
    <div className='min-h-screen mt-4 bg-gray-50 pb-24 px-4 flex flex-col items-center justify-start'>
      <IconOrus className='h-10' />
      <HomeSearchBar />
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full'>
        {empresas.map((empresa) => (
          <EmpresaItem key={empresa.id} empresa={empresa} />
        ))}
      </div>
    </div>
  )
}

export default Empresas