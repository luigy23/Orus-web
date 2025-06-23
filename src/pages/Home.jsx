import React from 'react';
import HomeSearchBar from '../components/HomeSearchBar';
import HomeBanner from '../components/home/HomeBanner';
import HomeCategories from '../components/home/HomeCategories';
import AsesoriasBanner from '../components/home/AsesoriasBanner';

const Home = () => {
  return (
    <div className="min-h-screen mt-4 bg-gray-50 pb-24 px-4">
   
      <HomeSearchBar />
      <HomeBanner />
      <HomeCategories />
      <h3 className="text-2xl font-semibold mb-2">Asesorías:</h3>
      <AsesoriasBanner />  

    </div>
  );
};

export default Home;