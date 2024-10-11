import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCalendarPlus, FaCalendarCheck, FaMapMarkerAlt } from 'react-icons/fa'; // Icons for the options
import './Trips.css'; // Import custom styles if needed
import Header from '../Header/Header';

const Trips = () => {
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
        
        // Scroll to the top of the page
        window.scrollTo(0, 0);

    }, [navigate]);

    const handleOptionClick = (option) => {
        navigate(`/${option}`);
    };
    const handleCloseForm = () => {
        navigate('/travel'); // Navigate to the home or appropriate page
    };

    return (
        <div className="trips">
            <Header username={username} />
            <main className="trips-main">
                <button className="close-button" onClick={handleCloseForm} title="Close Form">
                    ✘
                </button>
                <h1 className="trips-title">Manage Your Trips</h1>
                <section className="options-container">
                    <div className="option-item" onClick={() => handleOptionClick('plan_trip')}>
                        <div className="option-icon"><FaCalendarPlus /></div>
                        <div className="option-text">Plan Trip</div>
                    </div>
                    <div className="option-item" onClick={() => handleOptionClick('uc_trips')}>
                        <div className="option-icon"><FaCalendarCheck /></div>
                        <div className="option-text">See Upcoming Trips</div>
                    </div>
                    <div className="option-item" onClick={() => handleOptionClick('past_trips')}>
                        <div className="option-icon"><FaMapMarkerAlt /></div>
                        <div className="option-text">See Where Have You Been</div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Trips;