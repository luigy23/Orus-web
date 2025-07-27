import React from 'react'
import { IconHome } from '../../../assets/Icons/IconHome'
import IconOraculo from '../../../assets/Icons/IconOraculo'
import { IconUser } from '../../../assets/Icons/IconUser'
import { useNavigate } from 'react-router-dom'
import { useAtom } from 'jotai'
import { userDataAtom } from '../../../atoms/userAtom'

const BottomBar = () => {
    const navigate = useNavigate()
    const [userData] = useAtom(userDataAtom);
    const isAdmin = userData?.rol === "admin";

    return (
        <div className='fixed bottom-0 left-0 right-0 shadow-md flex items-center justify-center py-3 px-4'>
            <div className='flex items-center justify-between w-full'>
                {/* Home */}
                <button
                    onClick={() => navigate('/home')}
                    className='flex items-center justify-center bg-white shadow-md rounded-full p-2'>
                    <IconHome className='h-10 w-10 text-orus-primary' />
                </button>

                {/* Admin (solo si es admin) */}
                {isAdmin && (
                    <button
                        onClick={() => navigate('/admin')}
                        className='flex items-center justify-center bg-gradient-to-r from-orus-primary to-orus-primary/80 shadow-md rounded-full p-2'
                    >
                        <div className='h-10 w-10 bg-white rounded-full flex items-center justify-center'>
                            <span className='text-orus-primary font-bold text-lg'>A</span>
                        </div>
                    </button>
                )}

                {/* Buscar */}
                <button
                    onClick={() => navigate('/buscar')}
                    className='flex items-center justify-center bg-orus-primary shadow-md rounded-full p-2'>
                    <IconOraculo className='h-10 w-10 text-white' />
                </button>

                {/* Perfil */}
                <button
                    onClick={() => navigate('/perfil')}
                    className='flex items-center justify-center bg-white shadow-md rounded-full p-2'>
                    <IconUser className='h-10 w-10 text-orus-primary' />
                </button>
            </div>
        </div>
    )
}

export default BottomBar