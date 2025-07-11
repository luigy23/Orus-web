import React from 'react';
import { Link } from 'react-router-dom';

const HomeSearchBar = () => (
  <Link to="/buscar" className='w-full'>

    <div className="flex items-center bg-white rounded-2xl shadow px-4 py-2">
      <input
        type="text"
        placeholder="Buscar..."
        className="flex-1 bg-transparent outline-none text-lg text-gray-700"
      />
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-400">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
      </svg>
    </div>

  </Link>
);

export default HomeSearchBar; 