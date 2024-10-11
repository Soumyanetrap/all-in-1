// SignIn.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SignIn.css'; // Import the CSS file for styling
import {REACT_APP_API_URL, REACT_APP_SESSION_DURATION_MINS} from '../../config'


const SignIn = () => {
  const apiUrl = REACT_APP_API_URL;
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');
  const navigate = useNavigate(); // React Router hook for navigation

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
    const cred = {
      username: formData.get('username'),
      password: formData.get('password'),
    };

    try {
      // Send data to the server
      const response = await fetch(`${apiUrl}/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: cred.username,
          password: cred.password
        }),
      });

      // Parse the response
      const data = await response.json();
      // console.log(data.receivedData.email)

      // Check the response status or content and navigate accordingly
      if (data.message === 'success') {
        // Navigate to another page on successful login
        const expirationTime = new Date().getTime() + REACT_APP_SESSION_DURATION_MINS * 60 * 1000;

        // Store state and expiration time in localStorage
        localStorage.setItem('authState', JSON.stringify({ user_id:data.user_id, username:cred.username, email:data.email, flag: true, auth_key:data.auth_key, expirationTime }));
        navigate('/dashboard');
      } else {
        // Handle error response or show a message
        console.error('Login failed:', data.message);
        alert('Login failed: ' + data.message);
      }
    } catch (error) {
      // Handle any other errors
      console.error('Error:', error);
      alert('An error occurred: ' + error.message);
    }
  };
  return (
    <div className="SignIn-container">
      <h2 className="SignIn-title">Sign In</h2>
      <form className="SignIn-form" onSubmit={handleSubmit}>
        <table className="SignIn-table">
          <tbody>
            <tr>
              <th><label htmlFor="username">Username:</label></th>
              <td><input type="text" id="username" name="username" required /></td>
            </tr>
            <tr>
              <th><label htmlFor="password">Password:</label></th>
              <td><input type="password" id="password" name="password" required /></td>
            </tr>
            <tr>
              <td colSpan="2">
                <button type="submit">Sign In</button>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </div>
  );
}

export default SignIn;
