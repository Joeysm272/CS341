import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import './index.css';
import Login from './pages/Login';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import StaffHome from './pages/StaffHome';
import Membership from './pages/Membership';
import Programs from './pages/Programs';

const routes = (
  <Router>
    <Routes>
      <Route path='/login' exact element={<Login />}/>
      <Route path='/' exact element={<Home />}/>
      <Route path='/sign-up' exact element={<SignUp />}/>
      <Route path='/StaffHome' exact element={<StaffHome />}/>
      <Route path='/Membership' exact element={<Membership />}/>
      <Route path='/Programs' exact element={<Programs />}/>
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
