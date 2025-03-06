import React from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../images/Ylogo.webp'

const Navbar = () => {

  const navigate = useNavigate();

  return (
    <div className='bg-white flex items-center justify-between px-6 py-2 drop-shadow'>
        <h1 className='text-xl font-medium text-black py-2'>YMCA</h1>
        <button onClick={() => {navigate('/login')}} className='text-md bg-blue-500 px-3 py-2 border rounded hover:bg-blue-600'>Logout</button>
    </div>
  )
}

export default Navbar