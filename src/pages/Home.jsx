import React from 'react';
import HomeSearchBar from '../components/HomeSearchBar';
import HomeBanner from '../components/home/HomeBanner';
import HomeCategories from '../components/home/HomeCategories';
import AsesoriasBanner from '../components/home/AsesoriasBanner';
import Topbar from '../components/ui/navigation/Topbar';
import BottomBar from '../components/ui/navigation/BottomBar';
import IconOrus from '../assets/Icons/IconOrus';
import { IconUser } from '../assets/Icons/IconUser'
import { Link, useNavigate } from 'react-router-dom'
import { useAtom } from 'jotai';
import { userDataAtom } from '../atoms/userAtom';

const Home = () => {
  const navigate = useNavigate()
  const [userData] = useAtom(userDataAtom);

  // Verificar si el usuario es admin
  const isAdmin = userData?.rol === "admin";

  return (
    <div className="min-h-screen flex flex-col gap-4 bg-orus-background pb-20">
      <Topbar>
        <div className='flex items-center justify-center gap-2 w-full relative'>
          <div className="absolute left-0 flex items-center h-full pl-2">
            {/* Botón de Admin si es admin */}
            {isAdmin && (
              <button 
                onClick={() => navigate('/admin')}
                className="bg-gradient-to-r from-orus-primary to-orus-primary/80 text-white px-3 py-1.5 rounded-full text-sm font-medium shadow hover:shadow-md transition-all"
                aria-label="Panel Admin"
              >
                Admin
              </button>
            )}
          </div>
          <IconOrus className='h-10 mx-auto' />
          <div className="absolute right-0 flex items-center h-full pr-2" >
            <button onClick={() => navigate('/perfil')}
              className="rounded-full p-2 bg-white/80 hover:bg-white shadow transition-colors focus:outline-none"
              aria-label="Usuario"
            >
              <IconUser className="h-7 w-7 text-orus-primary" />
            </button>
          
          </div>
        </div>
      </Topbar>
      
      {/* Mensaje de bienvenida personalizado */}
      <div className='w-full px-4 mt-2'>
        <div className='bg-white/50 backdrop-blur-sm rounded-lg p-3 border border-white/20'>
          <h1 className='text-lg font-semibold text-orus-primary'>
            ¡Hola, {userData?.nombre || 'Usuario'}! 👋
          </h1>
          <p className='text-sm text-gray-600'>
            {isAdmin ? '¡Bienvenido administrador! Puedes acceder al panel de admin desde el botón superior.' : 'Bienvenido a Orus, encuentra lo que necesitas.'}
          </p>
        </div>
      </div>

      <div className='w-full flex-col items-center justify-center px-4'>
        <HomeSearchBar />
        <HomeBanner className='mt-4 mb-4' />
        <HomeCategories />
        <h3 className="text-2xl font-semibold mb-2">Asesorías:</h3>
        <Link to="/asesorias">  
          <AsesoriasBanner />
        </Link>
      </div>

      <BottomBar />
    </div>
  );
};

export default Home;