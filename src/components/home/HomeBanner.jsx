import React from 'react';

const HomeBanner = ({className}) => (
  <div className={` ${className}`}>
    <div className="rounded-3xl overflow-hidden relative h-40 flex items-center justify-center bg-gray-200">
      <img
        src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=80"
        alt="Rebajas"
        className="absolute w-full h-full object-cover opacity-70"
      />
      <div className="relative z-10 text-center">
        <h2 className="text-4xl font-extrabold text-white tracking-widest">REBAJAS</h2>
        <p className="text-white font-semibold mt-2 bg-black/40 rounded px-2 inline-block">HASTA 50% OFF EN TODA LA COLECCIÓN</p>
      </div>
    </div>
  </div>
);

export default HomeBanner; 