import React from 'react';
import Navbar from '../components/navbar';
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
      <div className="banner" role="region" aria-label="Banner">
        <div className='banner-header'>
          <div className='YMCA'>YMCA</div>
          <div className="banner-text">
            <p1>A place for all to belong.</p1>
            <br></br>
            <p2>Discover how we can help you be your best self.</p2>
          </div>
        </div>
        <div className="banner-images">
          <img src={fitnessClass} alt="Banner Image 1" className="banner-image" />
          <img src={kidsGroup} alt="Banner Image 2" className="banner-image" />
          <img src={stretch} alt="Banner Image 3" className="banner-image" />
        </div>
      </div>

      <div className = "home-container">
        <button className="home-button" onClick={goToMemberships}>
          <img src={membershipImage} alt="Membership Image" />
          <span className="home-label">Membership</span>
        </button>

        <button className="home-button" onClick={goToPrograms}>
          <img src={programsImage} alt="Programs Image" />
          <span className="home-label">Programs</span>
        </button>
      </div>

      <style>{`

        .YMCA {
          text-align: left;
          color: white;
          font-size: 8rem;
          font-family: Garamond, serif;
        }

        .banner {
          text-align: left;
          color: white;
          background-color: #00968b;
          padding: 1rem 2rem;
        }

        .banner-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .banner-text p1 {
          text-align: right;
          font-size: 3rem;
          font-family: Garamond, serif;
        }
        
        .banner-text p2 {
          text-align: right;
          font-size: 1.5rem;
          font-family: Garamond, serif;
        }

        .banner-images {
          display: flex;
          gap: 1rem;
        }

        .banner-image {
          width: 150px;
          height: 200px;
          object-fit: cover; 
          flex: 1;
        }

        .home-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 45vh;
          gap: 1rem;
        }
        .home-button {
          position: relative;
          display: inline-block;
          border: none;
          padding: 0;
          cursor: pointer;
          overflow: hidden;
        }

        .home-button img {
          display: block;
          width: 100%;
          height: auto;
        }

        .home-label {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: white;
          font-size: 2rem;
          font-weight: bold;
          text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.7);
        }
      `}</style>
    </div>
  );
};

export default Home;