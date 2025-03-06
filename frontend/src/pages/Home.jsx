import React from 'react';
import Navbar from '../components/navbar';
import membershipImage from '../images/membership.jpg.webp';
import programsImage from '../images/programs.webp';
import fitnessClass from '../images/fitnessclass.webp';
import kidsGroup from '../images/kids.webp';
import stretch from '../images/stretching.webp';
import { useNavigate } from 'react-router-dom';
import '../index.css';

//   const createProgram = async () => {
//     fetch('http://localhost:8000/programs', {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json" // Telling the server we’re sending JSON
//       },
//       body: JSON.stringify({
//         programName: 'Sharks',
//         time: '8:00am',
//         location: 'Mars',
//         capacity: 10,
//         price: 15,
//         desc: 'Swimming lessons'
//       })
//     })
//   }

// const deleteProgram = async () => {
//   fetch('http://localhost:8000/programs/67c7976a50fce705a4ca4286', {
//     method: "DELETE"
//   })
// }
        // <button className='bg-black text-white cursor-pointer' onClick={createProgram}>Create Program</button>
        // <button className='bg-black text-white cursor-pointer' onClick={deleteProgram}>Delete Program</button>

const Home = () => {
  const navigate = useNavigate();

  const goToMemberships = () => {
    navigate('/Membership')
  };

  const goToPrograms = () => {
    navigate('/Programs')
  };

    return (
    <div>
      <Navbar />
      <div class="banner" role="region" aria-label="Banner">
        <div class='banner-header'>
          <div class='YMCA'>YMCA</div>
          <div class="banner-text">
            <h1>A place for all to belong.</h1>
            <br></br>
            <h2>Discover how we can help you be your best self.</h2>
          </div>
        </div>
        <div class="banner-images">
          <img src={fitnessClass} alt="Banner Image 1" class="banner-image" />
          <img src={kidsGroup} alt="Banner Image 2" class="banner-image" />
          <img src={stretch} alt="Banner Image 3" class="banner-image" />
        </div>
      </div>

      <div class = "home-container">
        <button class="home-button" onClick={goToMemberships}>
          <img src={membershipImage} alt="Membership Image" />
          <span class="home-label">Membership</span>
        </button>

        <button class="home-button" onClick={goToPrograms}>
          <img src={programsImage} alt="Programs Image" />
          <span class="home-label">Programs</span>
        </button>
      </div>
    </div>
  );
};

export default Home;