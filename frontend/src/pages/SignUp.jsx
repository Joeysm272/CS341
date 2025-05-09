//this is a React component for a Sign Up page
// It includes a form for users to enter their first name, last name, username, password, email, and phone number
//Author: Joey Smith
import React, {useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

const SignUp = () => {

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate();

  const userSignUp = async () => {
    setError('');

    if(!username){
      setError('Please enter username');
      return;
    }

    if(!password){
      setError('Please enter password');
      return;
    }

    if(!firstName){
      setError('Please enter first name');
      return;
    }

    if(!lastName){
      setError('Please enter last name');
      return;
    }

    if(!email){
      setError('Please enter email');
      return;
    }

    if(!phone){
      setError('Please enter phone');
      return;
    }

    const response = await fetch('http://localhost:8000/sign-up', {
      method: "POST",
      headers: {
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
        username: username,
        password: password,
        email: email,
        phone: phone
      })
    });


    const data = await response.json();
    if(data){
      if(username === 'staff'){
        navigate('/staffHome');
        return;
      }
      navigate('/');
    }
  }

  function handleSignUp(e) {
    e.preventDefault();
    userSignUp();
  }

  return (
    <div>
        <div className='flex items-center justify-center mt-28'>
            <div className='border rounded px-7 py-10 w-96'>
              <form onSubmit={handleSignUp}>

                <h4 className='text-2xl font-medium mb-7'>Sign Up</h4>

                <input className='w-full text-sm bg-transparent border-[1.5px] px-5 py-3 rounded mb-4 outline-none'
                type="text" 
                placeholder='First Name' 
                value={firstName} 
                onChange={(e) => setFirstName(e.target.value)}/>

                <input className='w-full text-sm bg-transparent border-[1.5px] px-5 py-3 rounded mb-4 outline-none'
                type="text" 
                placeholder='Last Name' 
                value={lastName} 
                onChange={(e) => setLastName(e.target.value)}/>

                <input className='w-full text-sm bg-transparent border-[1.5px] px-5 py-3 rounded mb-4 outline-none'
                type="text" 
                placeholder='Username' 
                value={username} 
                onChange={(e) => setUsername(e.target.value)}/>


                <input className=' w-full text-sm bg-transparent border-[1.5px] px-5 py-3 rounded mb-4 outline-none' 
                type="password" 
                placeholder='Password' 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}/>

                <input className='w-full text-sm bg-transparent border-[1.5px] px-5 py-3 rounded mb-4 outline-none'
                type="text" 
                placeholder='Email' 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}/>

                <input className='w-full text-sm bg-transparent border-[1.5px] px-5 py-3 rounded mb-4 outline-none'
                type="text" 
                placeholder='Phone Number' 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)}/>

                {error && <p className='text-red-600 text-sm pb-1'>{error}</p>}

                <button className='w-full text-sm bg-blue-500 text-white p-2 rounded hover:bg-blue-600' type='submit'>Sign Up</button>
              </form>
              <p className='text-sm text-center mt-4' >Already have an account? <Link to='/login' className='font-medium text-blue-400 underline'>Login</Link></p>
            </div>
          </div>
    </div>
  )
}

export default SignUp