import React from 'react'
import { FaSpinner } from 'react-icons/fa'

function Loader() {
  return (
    <div className='flex items-center justify-center'>
        <FaSpinner className='animate-spin text-white text-2xl' />
    </div>
  )
}

export default Loader