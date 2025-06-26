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
        navigate('/login')
    }

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
                <h2 className='text-2xl font-bold text-orus-primary mb-1 capitalize'>{userData.nombre || 'Usuario'}</h2>
                <p className='text-gray-500 mb-6'>{userData.correo}</p>
                <button
                    onClick={handleLogout}
                    className='w-full bg-orus-primary text-white py-2 rounded-full font-semibold shadow hover:bg-orus-primary/90 transition-colors text-lg mt-2'
                >
                    Cerrar sesión
                </button>
            </div>
        </div>
    </div>
  )
}

export default Perfil