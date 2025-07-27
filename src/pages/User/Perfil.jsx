import React from 'react'
import Topbar from '../../components/ui/navigation/Topbar'
import BackButtom from '../../components/ui/navigation/BackButtom'
import IconOrus from '../../assets/Icons/IconOrus'
import { useAtom } from 'jotai'
import { userDataAtom } from '../../atoms/userAtom'
import { useLogin } from '../../hooks/useLogin'
import { useNavigate } from 'react-router-dom'
import { IconUser } from '../../assets/Icons/IconUser'

const Perfil = () => {
    const navigate = useNavigate()
    const [userData] = useAtom(userDataAtom)
    const { logoutUser } = useLogin()
    
    const handleLogout = () => {
        logoutUser()
        // Ya no necesitamos navegar aquí porque logoutUser ya navega a "/"
    }

    const isAdmin = userData?.rol === "admin";

    return (
        <div className='min-h-screen flex flex-col gap-4  bg-orus-background '>
            <Topbar>
                <div className='flex items-center justify-between gap-2 w-full'>
                    <BackButtom className='bg-white shadow-md' />
                    <IconOrus className='h-10' />
                </div>
            </Topbar>
            <div className='w-full flex flex-col items-center justify-center px-4 mt-8'>
                <div className='bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center w-full max-w-sm'>
                    <div className='bg-orus-primary/10 rounded-full p-3 mb-4'>
                        <IconUser className='h-16 w-16 text-orus-primary' />
                    </div>
                    <h2 className='text-2xl font-bold text-orus-primary mb-1 capitalize'>
                        {userData.nombre || 'Usuario'}
                    </h2>
                    <p className='text-gray-500 mb-2'>{userData.correo}</p>
                    
                    {/* Mostrar rol si es admin */}
                    {isAdmin && (
                        <div className='bg-gradient-to-r from-orus-primary to-orus-primary/80 text-white px-3 py-1 rounded-full text-xs font-medium mb-4'>
                            Administrador
                        </div>
                    )}

                    {/* Información adicional del usuario */}
                    <div className='w-full space-y-2 mb-6'>
                        {userData.telefono && (
                            <div className='bg-gray-50 rounded-lg p-3'>
                                <p className='text-sm text-gray-600'>Teléfono</p>
                                <p className='font-medium'>{userData.telefono}</p>
                            </div>
                        )}
                        {userData.ciudad && (
                            <div className='bg-gray-50 rounded-lg p-3'>
                                <p className='text-sm text-gray-600'>Ciudad</p>
                                <p className='font-medium'>{userData.ciudad}</p>
                            </div>
                        )}
                    </div>

                    {/* Botón de Admin si es admin */}
                    {isAdmin && (
                        <button
                            onClick={() => navigate('/admin')}
                            className='w-full bg-gradient-to-r from-orus-primary to-orus-primary/80 text-white py-2 rounded-full font-semibold shadow hover:shadow-md transition-all text-lg mb-3'
                        >
                            Panel de Administración
                        </button>
                    )}

                    <button
                        onClick={handleLogout}
                        className='w-full bg-red-500 text-white py-2 rounded-full font-semibold shadow hover:bg-red-600 transition-colors text-lg'
                    >
                        Cerrar sesión
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Perfil