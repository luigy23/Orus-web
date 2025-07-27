import React, { useState } from 'react'
import IconChispasOrus from '../assets/Icons/IconChispasOrus'
import { Search } from 'lucide-react'
import CategoriasLista from '../components/home/categorias/CategoriasLista'
import { useAtom } from 'jotai'
import { searchAtom } from '../atoms/searchAtom'
import { useNavigate } from 'react-router-dom'
import Topbar from '../components/ui/navigation/Topbar'
import BackButtom from '../components/ui/navigation/BackButtom'
import BottomBar from '../components/ui/navigation/BottomBar';

const Buscador = () => {
  const [input, setInput] = useState("");
  const [, setSearch] = useAtom(searchAtom);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearch(input);
    navigate('/empresas');
  };

  return (
    <div className="min-h-screen bg-orus-gradient flex flex-col pb-20">
      <Topbar>
        <BackButtom iconClassName='text-white' />
      </Topbar>
      
      <main className='flex-1 flex flex-col items-center px-4 pt-8 text-white'>
        <IconChispasOrus className='h-12 w-12 mb-6' />
        <h1 className='text-2xl font-bold mb-8 text-center'>¿Qué estás buscando?</h1>
        
        <form onSubmit={handleSubmit} className="relative w-full max-w-xs mb-6">
          <input
            type="text"
            placeholder='Buscar empresa'
            className='py-3 px-4 pr-12 rounded-full bg-white/20 backdrop-blur-sm text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 w-full'
            value={input}
            onChange={handleInputChange}
          />
          <button
            type="submit"
            className="absolute right-1 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 flex items-center justify-center shadow hover:shadow-md transition-shadow"
            aria-label="Buscar"
          >
            <Search size={20} className="text-orus-primary" />
          </button>
        </form>
        
        <div className='bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6'>
          <span className='text-white font-medium'>📍 Medellín</span>
        </div>
        
        <div className='w-full max-w-md'>
          <h2 className='text-xl font-semibold mb-4 text-center'>Categorías populares:</h2>
          <CategoriasLista />
        </div>
        
        <div className='mt-auto mb-6 w-full max-w-xs'>
          <button 
            onClick={handleSubmit}
            className='bg-white/20 backdrop-blur-sm hover:bg-white/30 px-6 py-3 rounded-full flex justify-between items-center w-full transition-all duration-300 border border-white/30'
          >
            <span className='text-white font-medium'>Buscar todas</span>
            <Search size={20} className="text-white" />
          </button>
        </div>
      </main>
      
      <BottomBar />
    </div>
  )
}

export default Buscador