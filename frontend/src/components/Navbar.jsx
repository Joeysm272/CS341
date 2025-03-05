import React from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../images/Ylogo.webp'

const Navbar = () => {

  const navigate = useNavigate();

  return (
    <div className='bg-white flex items-center justify-between px-6 py-2 drop-shadow'>
      <img src={logo} alt="YMCA Logo" className="h-12 cursor-pointer" onClick={() => navigate('/')} />
      <button onClick={() => {navigate('/login')}} className='text-md white px-3 py-2 border rounded hover:white'>Login</button>
    </div>
  )
}

export default Navbar