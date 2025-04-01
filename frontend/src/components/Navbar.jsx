import React from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../images/Ylogo.webp'

const Navbar = () => {

  const navigate = useNavigate();

  return (
    <div className='bg-white flex items-center justify-between px-6 py-2 drop-shadow'>
<<<<<<< HEAD
      <button onClick={() => navigate("/")} className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 transition">
      <img src={logo} alt="Logo" className="h-8 w-8" />
      <span className="text-gray-700 font-medium">Home</span>
      </button>
      <button onClick={() => {navigate('/login')}} className='text-md bg-[#00968b] px-3 py-2 border rounded hover:bg-[#007b70]'>Logout</button>
=======
<<<<<<< HEAD
      <div className='flex space-x-5'>
        <h1 className='text-xl font-medium text-black py-2'>YMCA</h1>
        <button onClick={() => {navigate('/')}} className='hover:underline'>Home</button>
      </div>
      <button onClick={() => {navigate('/login')}} className='text-md bg-[#00968b] px-3 py-2 border rounded hover:bg-[#007b70]'>Logout</button>
=======
      <div className='flex items-center cursor-pointer' onClick={() => navigate('/')}>
        <img src={logo} alt="YMCA Logo" className="w-18 h-18 mr-2" />
      </div>
        <button onClick={() => {navigate('/login')}} className='text-md bg-[#00968b] px-3 py-2 border rounded hover:bg-[#007b70]'>Logout</button>
>>>>>>> 1ebcb8ee1d5a98f57aacb5d058a52c6abb1fb856

>>>>>>> 855107116ad0df9bd9ab973015ec4be6e8083ca1
    </div>
  )
}

export default Navbar