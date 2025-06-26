import React from 'react'

const Topbar = ({children, className}) => {
  return (
    <div className={`w-full h-12 flex items-center justify-between pt-4 px-4 ${className}`}>
        {children}
    </div>
  )
}

export default Topbar