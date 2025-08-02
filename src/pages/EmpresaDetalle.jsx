import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { getEmpresaById } from '../services/empresas';
import IconOrus from '../assets/Icons/IconOrus';
import EmpresaSlider from '../components/empresas/EmpresaSlider';
import IconWhatsapp from '../assets/Icons/IconWhatsapp';
import Topbar from '../components/ui/navigation/Topbar';
import BackButtom from '../components/ui/navigation/BackButtom';

const EmpresaDetalle = () => {
  const { slugId } = useParams();
  // El id es lo último después del último guion
  const id = slugId.split('-').pop();
  const [empresa, setEmpresa] = useState(null);
  const [imgIndex, setImgIndex] = useState(0);

  const traeEmpresa = useCallback(async () => {
    const empresa = await getEmpresaById(id);
    setEmpresa(empresa);
    setImgIndex(0); // Reiniciar al cambiar de empresa
  }, [id]);

  // Función para determinar si está abierto ahora
  const estaAbierto = (empresa) => {
    const ahora = new Date();
    const diaActual = ahora.getDay(); // 0 = Domingo, 1 = Lunes, etc.
    const horaActual = ahora.getHours() * 60 + ahora.getMinutes(); // En minutos desde medianoche
    
    const diasSemana = [
      'HorarioDomingo', 'HorarioLunes', 'HorarioMartes', 
      'HorarioMiercoles', 'HorarioJueves', 'HorarioViernes', 'HorarioSabado'
    ];
    
    const horarioHoy = empresa[diasSemana[diaActual]];
    
    if (!horarioHoy || horarioHoy === 'Cerrado' || horarioHoy.toLowerCase() === 'cerrado') {
      return false;
    }
    
    if (horarioHoy.includes('-')) {
      const [inicio, fin] = horarioHoy.split('-');
      const [horaInicio, minutoInicio] = inicio.trim().split(':').map(Number);
      const [horaFin, minutoFin] = fin.trim().split(':').map(Number);
      
      const tiempoInicio = horaInicio * 60 + minutoInicio;
      const tiempoFin = horaFin * 60 + minutoFin;
      
      return horaActual >= tiempoInicio && horaActual <= tiempoFin;
    }
    
    return false;
  };

  useEffect(() => {
    traeEmpresa();
  }, [traeEmpresa]); 

  return (
    <div className="min-h-screen overflow-y-auto bg-gray-50 flex flex-col items-center pb-20">
      <Topbar>
        <BackButtom />
        <IconOrus />
      </Topbar>
      {empresa && (
        <div className="w-full max-w-md flex flex-col items-center">
          {/* Slider extraído */}
          <EmpresaSlider
            imagenes={empresa.Imagenes}
            nombre={empresa.Nombre}
            imgIndex={imgIndex}
            setImgIndex={setImgIndex}
          />
          {/* Nombre */}
          <h2 className="text-3xl font-bold mb-2 text-center">{empresa.Nombre}</h2>
          {/* Categorías */}
          <div className="flex flex-wrap gap-2 justify-center mb-2">
            {empresa.Categorias?.map(cat => (
              <span key={cat.Categoria.id} className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">• {cat.Categoria.Nombre}</span>
            ))}
          </div>
          {/* Ciudad */}
          <div className="flex items-center text-gray-500 text-base mb-4 justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7-7.5 11-7.5 11s-7.5-4-7.5-11a7.5 7.5 0 1115 0z" />
            </svg>
            <span>
              {empresa.Ciudad?.Nombre 
                ? `${empresa.Ciudad.Nombre}, ${empresa.Ciudad.Departamento?.Nombre}` 
                : empresa.Ciudad || 'Ubicación no especificada'
              }
            </span>
          </div>
          {/* Descripción */}
          <div className="bg-white rounded-2xl p-5 mb-6 w-full text-center text-gray-700 text-lg shadow-sm">
            {empresa.Descripcion}
          </div>
          {/* Horario */}
          <div className="w-full flex flex-col items-center mb-8">
            <div className="flex items-center gap-2 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9z" />
              </svg>
              <span className="text-xl font-semibold text-gray-700">Horario de atención</span>
              {/* Indicador de estado actual */}
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                estaAbierto(empresa) 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  estaAbierto(empresa) ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                {estaAbierto(empresa) ? 'Abierto ahora' : 'Cerrado ahora'}
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-4 w-full shadow-sm">
              <div className="space-y-3">
                {[
                  { nombre: 'Lunes', campo: 'HorarioLunes' },
                  { nombre: 'Martes', campo: 'HorarioMartes' },
                  { nombre: 'Miércoles', campo: 'HorarioMiercoles' },
                  { nombre: 'Jueves', campo: 'HorarioJueves' },
                  { nombre: 'Viernes', campo: 'HorarioViernes' },
                  { nombre: 'Sábado', campo: 'HorarioSabado' },
                  { nombre: 'Domingo', campo: 'HorarioDomingo' }
                ].map((dia) => {
                  const horario = empresa[dia.campo];
                  const esCerrado = !horario || horario === 'Cerrado' || horario.toLowerCase() === 'cerrado';
                  
                  return (
                    <div key={dia.nombre} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                      <span className="text-gray-600 font-medium min-w-[80px]">{dia.nombre}:</span>
                      {esCerrado ? (
                        <span className="bg-red-100 text-red-700 rounded-full px-3 py-1 text-sm font-medium">
                          Cerrado
                        </span>
                      ) : horario.includes('-') ? (
                        <div className="flex items-center gap-2">
                          <span className="bg-green-100 text-green-700 rounded-full px-3 py-1 text-sm font-mono">
                            {horario.split('-')[0].trim()}
                          </span>
                          <span className="text-gray-400">—</span>
                          <span className="bg-green-100 text-green-700 rounded-full px-3 py-1 text-sm font-mono">
                            {horario.split('-')[1].trim()}
                          </span>
                        </div>
                      ) : (
                        <span className="bg-blue-100 text-blue-700 rounded-full px-3 py-1 text-sm font-medium">
                          {horario}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
              
              {/* Mensaje si no hay horarios configurados */}
              {!empresa.HorarioLunes && !empresa.HorarioMartes && !empresa.HorarioMiercoles && 
               !empresa.HorarioJueves && !empresa.HorarioViernes && !empresa.HorarioSabado && 
               !empresa.HorarioDomingo && (
                <div className="text-center text-gray-500 py-4">
                  <p>Horarios no configurados</p>
                  <p className="text-sm">Contacta directamente para conocer los horarios</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Botón WhatsApp */}
          <a
            href={`https://wa.me/57${empresa.Telefono}?text=${encodeURIComponent(`Hola ${empresa.Nombre} vengo de Orus`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-72 fixed bottom-6 left-1/2 -translate-x-1/2 max-w-xs bg-orus-primary hover:bg-orus-primary/80 text-white text-lg font-semibold py-4 rounded-full flex items-center justify-center gap-3 shadow-lg transition-all duration-200 z-50"
          >
            Contactame Ahora
            <IconWhatsapp />
          </a>
        </div>
      )}
    </div>
  );
};

// Animaciones CSS para slide
// Agrega esto a tu archivo index.css o tailwind.css:
// .animate-slide-left { transform: translateX(-100%); opacity: 0; }
// .animate-slide-right { transform: translateX(100%); opacity: 0; }

export default EmpresaDetalle; 