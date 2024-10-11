import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUmbrellaBeach, FaPlaneDeparture } from 'react-icons/fa'; // Updated icons
import './Travel.css'; // Import your custom styles if needed
import Header from '../Header/Header';

const Travel = () => {
    const navigate = useNavigate();
    const [username, setUsername] = React.useState('');

    React.useEffect(() => {
        // Retrieve state and expiration time from localStorage
        const storedState = localStorage.getItem('authState');
        if (storedState) {
            const { username, flag, expirationTime } = JSON.parse(storedState);
            const currentTime = new Date().getTime();

            // Check if the state has expired
            if (currentTime > expirationTime || !flag) {
                // State has expired or flag is false; redirect to login
                localStorage.removeItem('authState'); // Clean up expired state
                navigate('/');
            } else {
                // Handle valid state here
                setUsername(username);
            }
        } else {
            // No state found; redirect to login
            navigate('/');
        }
    }, [navigate]);

    const handleOptionClick = (option) => {
        navigate(`/${option}`);
    };

    const handleBackClick = () => {
        navigate('/dashboard'); // Navigate back to the dashboard
    };

    return (
        <div className="travel">
            <Header username={username} />

            <main className="travel-main">
                <h1 className="travel-title">Choose Your Adventure</h1>
                <section className="options-container">
                    <div className="option-item" onClick={() => handleOptionClick('vacation')}>
                        <div className="option-icon"><FaUmbrellaBeach /></div>
                        <div className="option-text">Vacation</div>
                    </div>
                    <div className="option-item" onClick={() => handleOptionClick('trips')}>
                        <div className="option-icon"><FaPlaneDeparture /></div>
                        <div className="option-text">Trips</div>
                    </div>
                </section>
            </main>
            <button className="back-button" onClick={handleBackClick}>Back to Dashboard</button>
        </div>
    );
};

export default Travel;
