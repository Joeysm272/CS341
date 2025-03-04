import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/navbar'

const SignUp = () => {
  return (
    <div>
      <Navbar />
      Go to 
      <Link to='/login'>Login</Link>
    </div>
  )
}

export default SignUp