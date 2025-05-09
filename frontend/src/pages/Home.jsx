
//This is the home page for the YMCA website. It includes a banner with a header and images, as well as buttons to navigate to the membership and programs pages. 
// The page is styled using CSS and includes a navbar component.
// The images used in the banner and buttons are imported from local files.
//Authors: Joey Smith, Macy Bindl


import React from 'react';
import Navbar from '../components/Navbar';
import membershipImage from '../images/membership.jpg.webp';
import programsImage from '../images/programs.webp';
import fitnessClass from '../images/fitnessclass.webp';
import kidsGroup from '../images/kids.webp';
import stretch from '../images/stretching.webp';
import { useNavigate } from 'react-router-dom';
import '../index.css';


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
          <span class="home-label">Account</span>
        </button>

        <button class="home-button" onClick={goToPrograms}>
          <img src={programsImage} alt="Programs Image" />
          <span class="home-label">Programs</span>
        </button>
      </div>

      {/* PDF link at the bottom */}
      <div style={{ textAlign: 'center', marginTop: '40px', marginBottom: '20px' }}>
      <a href="/UserManual.pdf" target="_blank" rel="noopener noreferrer">
        View Our User Manual
      </a>
      </div>
    </div>
  );
};

export default Home;