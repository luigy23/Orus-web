import React, { useState, useEffect } from 'react';
import { getCategorias } from '../../services/categorias';
import CategoriaItem from './categorias/CategoriaItem';


const HomeCategories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const categories = await getCategorias();
      setCategories(categories);
    }
    fetchCategories();
  }, []);

  return (<div className="mb-6">
    <div className="flex justify-between items-center mb-2">
      <h3 className="text-2xl font-semibold">Categorías:</h3>
      <button className="text-orus-primary ">Ver todo</button>
    </div>
    <div className="flex gap-4 justify-between">
      {categories.map((cat) => (
        <CategoriaItem key={cat.id} categoria={cat} />
      ))}
    </div>
  </div>
  );
};

export default HomeCategories; 