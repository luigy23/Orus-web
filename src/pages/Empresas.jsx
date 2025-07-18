import React, { useState, useEffect } from 'react'
import IconOrus from '../assets/Icons/IconOrus'
import HomeSearchBar from '../components/HomeSearchBar'
import { getEmpresas, getEmpresasByCategoria } from '../services/empresas'
import EmpresaItem from '../components/empresas/EmpresaItem'
import { useParams } from 'react-router-dom'
import EtiquetaCategoria from '../components/home/categorias/EtiquetaCategoria'
import { useNavigate } from 'react-router-dom'
import { useAtom } from 'jotai'
import { searchAtom } from '../atoms/searchAtom'
import Topbar from '../components/ui/navigation/Topbar'
import BackButtom from '../components/ui/navigation/BackButtom'
import BottomBar from '../components/ui/navigation/BottomBar'

const Empresas = () => {
  const navigate = useNavigate()
  const { categoria } = useParams();
  const [empresas, setEmpresas] = useState([])
  const [value, setValue] = useAtom(searchAtom)
  const [empresasFiltradas, setEmpresasFiltradas] = useState([])

  const id = categoria ? categoria.split('-').pop() : null
  const nombre = categoria ? categoria.split('-').slice(0, -1).join(' ') : ''

  const traeEmpresas = async () => {
    if (id) {
      const empresas = await getEmpresasByCategoria(id)
      console.log("empresas", empresas)
      setEmpresas(empresas)
    } else {
      const empresas = await getEmpresas()
      console.log("empresas", empresas)
      setEmpresas(empresas)   
    }
  }

  useEffect(() => {
    traeEmpresas()
  }, [categoria])

  useEffect(() => {
    if (value.trim() === "") {
      setEmpresasFiltradas(empresas);
    } else {
      const filtro = value.toLowerCase();
      setEmpresasFiltradas(
        empresas.filter((empresa) => {
          const nombreMatch = empresa.Nombre.toLowerCase().includes(filtro);
          const descripcionMatch = empresa.Descripcion && empresa.Descripcion.toLowerCase().includes(filtro);
          const categoriasMatch = Array.isArray(empresa.Categorias) && empresa.Categorias.some(
            (cat) =>
              cat.Categoria &&
              cat.Categoria.Nombre &&
              cat.Categoria.Nombre.toLowerCase().includes(filtro)
          );
          return nombreMatch || descripcionMatch || categoriasMatch;
        })
      );
    }
  }, [value, empresas])

  const onChange = (e) => {
    setValue(e.target.value)
  }

  return (
    <div className='min-h-screen  bg-orus-background pb-24  flex flex-col items-center justify-start'>
      <Topbar>
        <div className='flex items-center justify-between gap-2 w-full'>
          <BackButtom className='bg-white shadow-md' />
          <IconOrus className='h-10' />
          <div className='w-10'></div>
        </div>
      </Topbar>
      <div className='w-full flex-col items-center justify-center px-4 mt-4 '>
      <Buscador value={value} onChange={onChange} />
      <div className='w-full flex items-center justify-start  gap-2 mt-3 mb-4'>
        <button
          onClick={() => navigate('/empresas')}

          className={`px-3 py-1 rounded-full text-xs transition-colors ${
            !categoria 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Todas las categorías
        </button>
        <EtiquetaCategoria categoria={nombre} />
      </div>
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full'>
        {empresasFiltradas.map((empresa) => (
          <EmpresaItem key={empresa.id} empresa={empresa} />
        ))}
      </div>
      </div>
      <BottomBar />
    </div>
  )
}

const Buscador = ({value, onChange}) => {
  return (
    <div className="w-full">
      <div className="flex items-center bg-white rounded-2xl shadow px-4 py-2">
        <input
          type="text"
          placeholder="Buscar..."
          className="flex-1 bg-transparent outline-none text-lg text-gray-700"
          value={value}
          onChange={onChange}
        />
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-400">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
        </svg>
      </div>
    </div>
  )
}

export default Empresas