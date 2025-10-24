import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home-container">
      <div className="home-card">
        <h1 className="home-title">Welcome Home</h1>
        <p className="home-subtitle">You are now logged in. Explore your profile!</p>
        <Link to="/profile" className="profile-btn">Go to Profile</Link>
      </div>
    </div>
  );
}

export default Home;
