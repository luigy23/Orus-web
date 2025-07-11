import React from 'react'
import { IconArrowBack } from '../../../assets/Icons/IconArrowBack'
import { useNavigate } from 'react-router-dom'

const BackButtom = ({className, iconClassName}) => {
  const navigate = useNavigate()
  return (
    <button
    onClick={() => navigate(-1)}
    className={`bg-white/20 rounded-full p-2 h-10 w-10 flex items-center justify-center hover:bg-white/30 transition-all duration-300 ${className}`}>
    <IconArrowBack className={`h-6 w-6 text-orus-primary ${iconClassName}`} />
  </button>
  )
}

export default BackButtom