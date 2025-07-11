import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { asesores } from '../../data/asesores'
import Topbar from '../../components/ui/navigation/Topbar'
import BackButtom from '../../components/ui/navigation/BackButtom'

const PerfilAsesor = () => {
    const { id } = useParams()
    const asesor = asesores.find(a => a.id === id)
    const navigate = useNavigate()
    if (!asesor) {
        return <div className="min-h-screen flex items-center justify-center">Asesor no encontrado</div>
    }

    return (
        <div className="min-h-screen bg-orus-background flex flex-col relative overflow-y-scroll hide-scrollbar">
     
            {/* Portada con imagen difuminada y overlay */}
            <div className="relative w-full h-32 -mb-2 bg-orus-primary overflow-hidden">
                <Topbar className='absolute top-0 left-0 w-full z-20'>
                    <BackButtom  iconClassName='text-white' className='bg-white/40 border-white  border-solid border-2' onClick={() => navigate(-1)} />
                </Topbar>
                <img src={asesor.imagen} alt="portada" className="w-full h-full object-cover blur-md scale-110" />
                <div className="absolute inset-0 bg-[#57499F] opacity-20" />
            </div>
    

            {/* Info principal */}
            <div className="flex-1 flex flex-col items-center justify-start px-4 bg-white rounded-t-3xl z-20 -mt-4 pb-8">
                <div className="w-36 h-36  rounded-full border-4 border-white shadow-lg overflow-hidden bg-white -mt-12 ">
                    <img src={asesor.imagen} alt={asesor.nombre} className="w-full h-full object-cover" />
                </div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 text-center mb-1 mt-4">{asesor.nombre}</h2>
                <h3 className="text-lg sm:text-xl text-orus-primary text-center mb-4 font-medium">{asesor.titulo}</h3>
                <p className="text-sm sm:text-base text-gray-600 text-center mb-6 px-2">{asesor.descripcionLarga}</p>
                {/* Tarjetas de info */}
                <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
                    {/* Columna 1: item grande */}
                    <div className="md:row-span-2 bg-gray-900 text-white rounded-2xl p-4 sm:p-6 flex flex-col items-center justify-center text-center min-h-[120px] sm:min-h-[160px]">
                        <span className="text-2xl sm:text-3xl font-bold">{asesor.experiencia}</span>
                        <span className="text-sm sm:text-base mt-2">{asesor.detalles[0]?.texto}</span>
                    </div>
                    {/* Columna 2: dos items pequeños */}
                    <div className="bg-[#E3DEFF] text-gray-900 rounded-2xl p-3 sm:p-4 flex items-center justify-center text-center min-h-[60px] sm:min-h-[70px]">
                        <span className="text-xs sm:text-sm">{asesor.detalles[1]?.texto}</span>
                    </div>
                    <div className="border border-gray-900 rounded-2xl p-3 sm:p-4 flex items-center justify-center text-center min-h-[60px] sm:min-h-[70px]">
                        <span className="text-xs sm:text-sm">{asesor.detalles[2]?.texto}</span>
                    </div>
                </div>
                <button className="w-full max-w-xs bg-orus-primary text-white py-3 rounded-full font-semibold shadow-lg hover:bg-orus-primary/90 transition-colors text-base sm:text-lg mt-2 flex items-center justify-center gap-2">
                    Contáctame Ahora
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L21 12m0 0l-3.75 5.25M21 12H3" />
                    </svg>
                </button>
            </div>
        </div>
    )
}

export default PerfilAsesor 