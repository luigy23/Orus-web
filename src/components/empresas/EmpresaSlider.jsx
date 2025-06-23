import React, { useRef, useState } from 'react';

const EmpresaSlider = ({ imagenes = [], nombre = '', imgIndex, setImgIndex }) => {
  const [slideDirection, setSlideDirection] = useState(null); // 'left' o 'right'
  const [isSliding, setIsSliding] = useState(false);
  const touchStartX = useRef(null);

  // Swipe handlers
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchEndX - touchStartX.current;
    if (Math.abs(diff) > 50 && imagenes.length > 1) {
      if (diff < 0 && imgIndex < imagenes.length - 1) {
        setSlideDirection('left');
        setIsSliding(true);
        setTimeout(() => {
          setImgIndex(imgIndex + 1);
          setIsSliding(false);
        }, 250);
      } else if (diff > 0 && imgIndex > 0) {
        setSlideDirection('right');
        setIsSliding(true);
        setTimeout(() => {
          setImgIndex(imgIndex - 1);
          setIsSliding(false);
        }, 250);
      }
    }
    touchStartX.current = null;
  };

  // Slide animation classes
  const getSlideClass = () => {
    if (!isSliding) return '';
    if (slideDirection === 'left') return 'animate-slide-left';
    if (slideDirection === 'right') return 'animate-slide-right';
    return '';
  };

  return (
    <>
    <div
      className="w-full rounded-[2.5rem] overflow-hidden mb-4 mt-2 aspect-[2.1/1] bg-gray-200 relative touch-pan-x"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <img
        src={imagenes?.[imgIndex]?.Url || 'https://placehold.co/600x400/EEE/31343C'}
        alt={nombre}
        className={`object-cover w-full h-full transition-all duration-300 ${getSlideClass()}`}
        draggable={false}
      />
     
    </div>
     {/* Paginador real */}
     {imagenes && imagenes.length > 1 && (
        <div className="flex justify-center items-center gap-2 mb-2">
          {imagenes.map((img, idx) => (
            <button
              key={img.id}
              onClick={() => setImgIndex(idx)}
              className={`w-4 h-2 rounded-full transition-all duration-200 ${imgIndex === idx ? 'bg-orus-primary w-8' : 'bg-gray-300'}`}
              aria-label={`Imagen ${idx + 1}`}
            />
          ))}
        </div>
      )}
      </>
  );
};

export default EmpresaSlider; 