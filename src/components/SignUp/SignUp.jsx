// SignUp.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import './SignUp.css'; // Import the CSS file for styling
import {REACT_APP_API_URL, REACT_APP_SESSION_DURATION_MINS} from '../../config'


const SignUp = () => {
  const apiUrl = REACT_APP_API_URL; // Get API URL from environment variables
  const navigate = useNavigate(); // React Router hook for navigation

  // State variables
  const [otpSent, setOtpSent] = useState(false); // To check if OTP is sent
  const [otpValue, setOtpValue] = useState('');
  const [otp, setOtp] = useState(''); // To store OTP input value

  React.useEffect(() => {
    const storedState = localStorage.getItem('authState');
        if (storedState) {
            const { flag } = JSON.parse(storedState);
            if (flag) {
                // User is logged in, redirect them from login page
                navigate('/dashboard');
            }
        }
    }, [navigate]);

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission

    const formData = new FormData(event.target);
    const userData = {
      name: formData.get('name'),
      username: formData.get('username'),
      email: formData.get('email'),
      password: formData.get('password'),
    };

    try {
      const SKIP_OTP = true
      if (!otpSent) {
        // Send request to get OTP
        const response = await fetch(`${apiUrl}/sendOTP`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            'toID': userData.email,
          }),
        });

        // Parse the response
        const data = await response.json();
        // console.log(data)
        if (SKIP_OTP || typeof data.OTP === 'string') {
          setOtpSent(true); // Show OTP input field and button
          setOtpValue(data.OTP);
        } else {
          console.error('Failed to send OTP:', data.message);
          // alert('Failed to send OTP: ' + data.message);
        }
      } else {
        // Verify OTP and complete sign-up
        if(SKIP_OTP || otp === otpValue){
          const response = await fetch(`${apiUrl}/auth/signup`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              ...userData,
            }),
          });

          // Parse the response
          const data = await response.json();
          if (data.message === 'success') {

            //Write the details to the database
            const expirationTime = new Date().getTime() + REACT_APP_SESSION_DURATION_MINS * 60 * 1000;

            // navigate('/dashboard'); // Navigate on successful sign-up
            localStorage.setItem('authState', JSON.stringify({ user_id:data.user_id ,username:userData.username, email:userData.email, flag:true, auth_key:data.auth_key, expirationTime }));
            navigate('/dashboard', { state: { username:userData.username, flag: true } });
          } else {
            console.error('Sign up failed:', data.message);
            alert('Sign up failed: ' + data.message);
          }
        }
        else {
          alert('OTP Mismatch!');

          // Add Resend Feature
        }
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred: ' + error.message);
    }
  };

  return (
    <div className="SignUp-container">
      <h2 className="SignUp-title">Sign Up</h2>
      <form className="SignUp-form" onSubmit={handleSubmit}>
        <table className="SignUp-table">
          <tbody>
            <tr>
              <th><label htmlFor="name">Full Name:</label></th>
              <td><input type="text" id="name" name="name" required /></td>
            </tr>
            <tr>
              <th><label htmlFor="username">Username:</label></th>
              <td><input type="text" id="username" name="username" required /></td>
            </tr>
            <tr>
              <th><label htmlFor="email">Email:</label></th>
              <td><input type="email" id="email" name="email" required /></td>
            </tr>
            <tr>
              <th><label htmlFor="password">Password:</label></th>
              <td><input type="password" id="password" name="password" required /></td>
            </tr>
            {otpSent && (
              <>
                <tr>
                  <th><label htmlFor="otp">Enter OTP:</label></th>
                  <td><input type="text" id="otp" name="otp" value={otp} onChange={(e) => setOtp(e.target.value)} required /></td>
                </tr>
                <tr>
                  <td colSpan="2">
                    <button type="submit">Verify OTP</button>
                  </td>
                </tr>
              </>
            )}
            {!otpSent && (
              <tr>
                <td colSpan="2">
                  <button type="submit">Get OTP</button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </form>
    </div>
  );
}

export default SignUp;
