import React, { useState, useEffect } from 'react'
import IconChispasOrus from '../assets/Icons/IconChispasOrus'
import { Search } from 'lucide-react'
import CategoriasLista from '../components/home/categorias/CategoriasLista'
import { useAtom } from 'jotai'
import { searchAtom } from '../atoms/searchAtom'
import { userDataAtom } from '../atoms/userAtom'
import { ciudadBusquedaAtom, ciudadBusquedaInfoAtom } from '../atoms/ubicacionAtom'
import { useNavigate } from 'react-router-dom'
import Topbar from '../components/ui/navigation/Topbar'
import BackButtom from '../components/ui/navigation/BackButtom'
import CitySelector from '../components/ui/CitySelector'

const Buscador = () => {
  const [input, setInput] = useState("");
  const [, setSearch] = useAtom(searchAtom);
  const [userData] = useAtom(userDataAtom);
  const [ciudadBusqueda, setCiudadBusqueda] = useAtom(ciudadBusquedaAtom);
  const [, setCiudadBusquedaInfo] = useAtom(ciudadBusquedaInfoAtom);
  const navigate = useNavigate();

  // Inicializar ciudad de búsqueda con la del usuario si no hay una seleccionada
  useEffect(() => {
    if (!ciudadBusqueda && userData?.ciudad?.id) {
      setCiudadBusqueda(userData.ciudad.id);
      setCiudadBusquedaInfo({
        id: userData.ciudad.id,
        nombre: userData.ciudad.nombre,
        departamento: userData.ciudad.departamento
      });
    }
  }, [userData, ciudadBusqueda, setCiudadBusqueda, setCiudadBusquedaInfo]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearch(input);
    navigate('/empresas');
  };

  return (
    <>
      <main className='h-screen bg-orus-gradient flex flex-col items-center pb-20 text-white relative'>
        <Topbar>
          <BackButtom iconClassName='text-white' />
        </Topbar>
        <IconChispasOrus className='h-10 w-10' />
        <h1 className='text-2xl font-bold'>¿Qué estás buscando?</h1>
        <form onSubmit={handleSubmit} className="relative w-full max-w-xs mt-4">
          <input
            type="text"
            placeholder='Buscar empresa'
            className='py-2 px-4 pr-12 rounded-full bg-[#57499F] text-white focus:outline-none w-full'
            value={input}
            onChange={handleInputChange}
          />
          <button
            type="submit"
            className="absolute right-1 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 flex items-center justify-center shadow"
            aria-label="Buscar"
          >
            <Search size={20} className="" color="#4B427B" />
          </button>
        </form>
        
        {/* Selector de Ciudad usando el nuevo componente */}
        <div className="mt-4 mb-4">
          <CitySelector 
            variant="primary" 
            size="default"
            showLabel={false}
          />
        </div>

        <CategoriasLista />
        <div className='absolute bottom-6 w-full flex flex-col items-center justify-center gap-4 p-4'>
          <button onClick={handleSubmit}
            className='bg-orus-primary/50 px-4 py-2 rounded-full flex justify-between items-center w-3/4 hover:bg-orus-primary/70 transition-all duration-300'>
            <span>Buscar</span>
            <Search size={20} className="" color="white" />
          </button>
        </div>
      </main>
    </>
  )
}

export default Buscador