import React from 'react'
import { IconHome } from '../../../assets/Icons/IconHome'
import IconOraculo from '../../../assets/Icons/IconOraculo'
import { useNavigate } from 'react-router-dom'

const BottomBar = () => {
    const navigate = useNavigate()
  return (
    <div className='fixed bottom-0 left-0 right-0 shadow-md flex items-center justify-center py-3 px-4'>
        <div className='flex items-center justify-between w-full'>
            <button
            onClick={() => navigate('/home')}
            className='flex items-center justify-center bg-white shadow-md rounded-full p-2'>
                <IconHome className='h-10    w-10 text-orus-primary' />
            </button>
            <button
            onClick={() => navigate('/buscar')}
            className='flex items-center justify-center bg-orus-primary rounded-full p-2'>
                <IconOraculo className='h-10 w-10 text-white' />
            </button>
        </div>
    </div>
  )
}

export default BottomBar