import React from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../images/Ylogo.webp'

const Navbar = () => {

  const navigate = useNavigate();

  return (
    <div className='bg-white flex items-center justify-between px-6 py-2 drop-shadow'>
      <div className='flex space-x-5'>
        <h1 className='text-xl font-medium text-black py-2'>YMCA</h1>
        <button onClick={() => {navigate('/')}} className='hover:underline'>Home</button>
      </div>
      <button onClick={() => {navigate('/login')}} className='text-md bg-[#00968b] px-3 py-2 border rounded hover:bg-[#007b70]'>Logout</button>

    </div>
  )
}

export default Navbar