import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Vacation.css';
import Header from '../Header/Header';

const Vaccation = () => {
    const navigate = useNavigate();
    const [username, setUsername] = React.useState('');
    useEffect(() => {
            const storedState = localStorage.getItem('authState');
            if (storedState) {
                const {username, flag, expirationTime } = JSON.parse(storedState);
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

    }, [navigate]); // Added dataFetched to dependencies
    const handleOptionClick = (option) => {
        navigate(`/${option}`);
    }
    const handleCloseForm = () => {
        navigate('/travel'); // Navigate to the home or appropriate page
    };
    return (
        <div className="vacation">
            <Header username={username}/>
            <main className="vacation-main">
                <button className="close-button" onClick={handleCloseForm}>
                    ✘
                </button>
                <h1 className="vacation-title">Vacation</h1>
                <section className="vacation-container">
                    <div className="vacation-item" onClick={() => handleOptionClick('plan_vac')}>
                        <div className="vacation-text">Plan Vacation</div>
                    </div>
                    <div className="vacation-item" onClick={() => handleOptionClick('uc_vac')}>
                        <div className="vacation-text">See Upcoming Vacations</div>
                    </div>
                    <div className="vacation-item" onClick={() => handleOptionClick('past_vac')}>
                        <div className="vacation-text">See Where Have You Been</div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Vaccation;
