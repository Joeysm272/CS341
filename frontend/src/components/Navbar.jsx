//Navbar component for the application
//This component is responsible for rendering the navigation bar at the top of the page
//It includes the logo, home button, and login/logout functionality based on user authentication status
//It akso conditionally renders a staff portal button for users with the 'staff' role
//Authors: Joey Smith, Macy Bindl, Preston Piranio

import React from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../images/Ylogo.webp'

const Navbar = () => {
  const navigate = useNavigate()

  // Get user information from local storage
  const userId   = localStorage.getItem('userId')
  const username = localStorage.getItem('username')
  const role     = localStorage.getItem('role')
 
  return (
    <div className='bg-white flex items-center justify-between px-6 py-2 drop-shadow'>
      <button
        onClick={() => navigate("/")}
        className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 transition"
      >
        <img src={logo} alt="Logo" className="h-8 w-8" />
        <span className="text-gray-700 font-medium">Home</span>
      </button>

      {userId ? (
        <div className='flex items-center gap-3'>
          <div>
            <p className='mb-0'>Welcome</p>
            <p className='mb-0'>{username}</p>
          </div>

          {/* only show for staff */}
          {role === 'staff' && (
            <button
              onClick={() => navigate('/staffHome')}
              className='text-md bg-[#00968b] px-3 py-2 border rounded hover:bg-[#007b70]'
            >
              Staff Portal
            </button>
          )}

          <button
            onClick={() => {
              localStorage.clear()
              navigate('/login')
            }}
            className='text-md bg-[#00968b] px-3 py-2 border rounded hover:bg-[#007b70]'
          >
            Logout
          </button>
        </div>
      ) : (
        <button
          onClick={() => navigate('/login')}
          className='text-md bg-[#00968b] px-3 py-2 border rounded hover:bg-[#007b70]'
        >
          Login
        </button>
      )}
    </div>
  )
}

export default Navbar
