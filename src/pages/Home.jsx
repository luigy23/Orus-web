import React from 'react';
import HomeSearchBar from '../components/HomeSearchBar';
import HomeBanner from '../components/home/HomeBanner';
import HomeCategories from '../components/home/HomeCategories';
import AsesoriasBanner from '../components/home/AsesoriasBanner';
import Topbar from '../components/ui/navigation/Topbar';
import IconOrus from '../assets/Icons/IconOrus';
import { IconUser } from '../assets/Icons/IconUser'
import { Link, useNavigate } from 'react-router-dom'


const Home = () => {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen flex flex-col gap-4  bg-orus-background ">
      <Topbar>
        <div className='flex items-center justify-center gap-2 w-full relative'>
          <div className="absolute left-0 flex items-center h-full pl-2">
            {/* Espacio para otros botones si los hay */}
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
      <div className='w-full flex-col items-center justify-center px-4 mt-4'>
        <HomeSearchBar />
        <HomeBanner className='mt-4 mb-4' />
        <HomeCategories />
        <h3 className="text-2xl font-semibold mb-2">Asesorías:</h3>
        <Link to="/asesorias">  
          <AsesoriasBanner />
        </Link>
      </div>

    </div>
  );
};

export default Home;