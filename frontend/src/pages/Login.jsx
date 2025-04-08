import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'


const Login = () => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const hangleLogin = async (e) => {
    e.preventDefault();

    setError('');

    if(!username){
      setError('Please enter username');
      return;
    }

    if(!password){
      setError('Please enter a password');
      return;
    }

    const response = await fetch('http://localhost:8000/login', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({
        username: username,
        password: password,
      })
    });

    const data = await response.json();

    localStorage.setItem('userId', data._id);
    localStorage.setItem('username', data.username);
<<<<<<< HEAD
    localStorage.setItem('firstName', data.firstname);
    localStorage.setItem('lastName', data.lastName);
    localStorage.setItem('email', data.email);
=======
    localStorage.setItem('firstName', data.firstName);
    localStorage.setItem('lastName', data.lastName);
    localStorage.setItem('email', data.email);
    localStorage.setItem('phone', data.phone);
>>>>>>> 681f6447b33ae00b9978e192f9e93bc8f6c278a3

    console.log(data);

    if(data){
      setError('');
      if(username === 'staff'){
        navigate('/staffHome');
        return;
      }
      navigate('/');
    }

    setError('User not Found');
  }

  return (
    <div>

        <div className='flex items-center justify-center mt-28'>
          <div className='border rounded px-7 py-10 w-96'>
            <form onSubmit={hangleLogin}>

              <h4 className='text-2xl font-medium mb-7'>Login</h4>

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

              <button className='w-full text-sm bg-blue-500 text-white p-2 rounded hover:bg-blue-600' type='submit'>Login</button>
            </form>
            <p className='text-sm text-center mt-4'>Don't have an account? <Link to='/sign-up' className='font-medium text-blue-400 underline'>Sign Up</Link></p>
          </div>
        </div>  
    </div>
  )
}

export default Login