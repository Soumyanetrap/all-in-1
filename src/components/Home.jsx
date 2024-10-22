// Home.js

import React, { useState } from 'react';
import SignIn from './SignIn/SignIn';
import SignUp from './SignUp/SignUp';
import './Home.css'; // Import the CSS file for styling

const Home = () => {
  const [showSignIn, setShowSignIn] = useState(true); // Default to showing sign-in

  const toggleForm = () => {
    setShowSignIn(!showSignIn);
  }

  return (
    <div className="Home-container">
      <h1 className="Home-title">Track Everything From One Place</h1>
      {showSignIn ? (
        <div className="Home-form">
          <SignIn />
          <p className="Home-toggle">Don't have an account? <button onClick={toggleForm}>Sign Up</button></p>
        </div>
      ) : (
        <div className="Home-form">
          <SignUp />
          <p className="Home-toggle">Already have an account? <button onClick={toggleForm}>Sign In</button></p>
        </div>
      )}
    </div>
  );
}

export default Home;
