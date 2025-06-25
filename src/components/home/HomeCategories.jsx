import React, { useState, useEffect, useRef } from 'react';
import { getCategorias } from '../../services/categorias';
import CategoriaItem from './categorias/CategoriaItem';

const HomeCategories = () => {
  const [categories, setCategories] = useState([]);
  const scrollRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  useEffect(() => {
    const fetchCategories = async () => {
      const categories = await getCategorias();
      setCategories(categories);
    }
    fetchCategories();
  }, []);

  // Funciones para drag-to-scroll
  const handleMouseDown = (e) => {
    isDragging.current = true;
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeft.current = scrollRef.current.scrollLeft;
    scrollRef.current.classList.add('cursor-grabbing');
  };

  const handleMouseLeave = () => {
    isDragging.current = false;
    scrollRef.current.classList.remove('cursor-grabbing');
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    scrollRef.current.classList.remove('cursor-grabbing');
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5; // velocidad
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };

  return (<div className="mb-6">
    <div className="flex justify-between items-center mb-2">
      <h3 className="text-2xl font-semibold">Categorías:</h3>
      <button className="text-orus-primary ">Ver todo</button>
    </div>
    <div
      ref={scrollRef}
      className="flex gap-4 justify-between overflow-x-auto hide-scrollbar cursor-grab"
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      style={{ userSelect: isDragging.current ? 'none' : 'auto' }}
    >
      {categories.map((cat) => (
        <CategoriaItem key={cat.id} categoria={cat} />
      ))}
    </div>
  </div>
  );
};

export default HomeCategories; 