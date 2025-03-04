import React, {useState} from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/navbar'

const SignUp = () => {

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  function hangleSignUp() {

  }

  return (
    <div>
      <Navbar />
        <div className='flex items-center justify-center mt-28'>
            <div className='border rounded px-7 py-10 w-96'>
              <form onSubmit={hangleSignUp}>

                <h4 className='text-2xl font-medium mb-7'>Sign Up</h4>

                <input className='w-full text-sm bg-transparent border-[1.5px] px-5 py-3 rounded mb-4 outline-none'
                type="text" 
                placeholder='username' 
                value={username} 
                onChange={(e) => setUsername(e.target.value)}/>


                <input className=' w-full text-sm bg-transparent border-[1.5px] px-5 py-3 rounded mb-4 outline-none' 
                type="password" 
                placeholder='password' 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}/>

                {error && <p className='text-red-600 text-sm pb-1'>{error}</p>}

                <button className='w-full text-sm bg-blue-500 text-white p-2 rounded hover:bg-blue-600' type='submit'>Sign Up</button>
              </form>
              <p className='text-sm text-center mt-4'>Already have an account? <Link to='/login' className='font-medium text-blue-400 underline'>Login</Link></p>
            </div>
          </div>
    </div>
  )
}

export default SignUp