import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!username) {
      setError('Please enter username');
      return;
    }

    if (!password) {
      setError('Please enter a password');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      // Check if response is not OK
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Login failed:", errorData.error);
        setError(errorData.error || "Login failed");
        return;
      }

      const data = await response.json();

      // Logging for debugging
      console.log("Login successful. User data:", data);

      // Save user details in localStorage
      localStorage.setItem('userId', data._id);
      localStorage.setItem('username', data.username);
      localStorage.setItem('firstName', data.firstName);
      localStorage.setItem('lastName', data.lastName);
      localStorage.setItem('email', data.email);
      localStorage.setItem('phone', data.phone);
      localStorage.setItem('role', data.role);

      // Navigate based on user role
      if (data.role === 'staff') {
        navigate('/staffHome');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error("Error during login:", err);
      setError("Login failed due to server error.");
    }
  };

  return (
    <div>
      <Navbar />
      <div className='flex items-center justify-center mt-28'>
        <div className='border rounded px-7 py-10 w-96'>
          <form onSubmit={handleLogin}>
            <h4 className='text-2xl font-medium mb-7'>Login</h4>
            <input
              className='w-full text-sm bg-transparent border-[1.5px] px-5 py-3 rounded mb-4 outline-none'
              type="text"
              placeholder='username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              className='w-full text-sm bg-transparent border-[1.5px] px-5 py-3 rounded mb-4 outline-none'
              type="password"
              placeholder='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p className='text-red-600 text-sm pb-1'>{error}</p>}
            <button className='w-full text-sm bg-blue-500 text-white p-2 rounded hover:bg-blue-600' type='submit'>
              Login
            </button>
          </form>
          <p className='text-sm text-center mt-4'>
            Don't have an account? <Link to='/sign-up' className='font-medium text-blue-400 underline'>Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
