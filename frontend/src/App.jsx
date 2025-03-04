import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import './index.css';
import Login from './pages/Login';
import Home from './pages/Home';
import SignUp from './pages/SignUp';

const routes = (
  <Router>
    <Routes>
      <Route path='/login' exact element={<Login />}/>
      <Route path='/home' exact element={<Home />}/>
      <Route path='/sign-up' exact element={<SignUp />}/>
    </Routes>
  </Router>
);


const App = () => {
  return (
    <div>
      {routes}
    </div>
  )
}

export default App
