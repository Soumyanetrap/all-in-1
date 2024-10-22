import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../Header/Header';
import TripDetails from '../Trip_Details/TripDetails';
import TripChat from '../Trip_Chat/TripChat';
import './TripContainer.css';

const TripContainer = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [username, setUsername] = useState('');
    const [ws, setWS] = useState('');
    const trip = location.state?.trip; 

    // State to manage the visibility of TripDetails and TripChat
    const [showChat, setShowChat] = useState(false);

    useEffect(() => {
        const storedState = localStorage.getItem('authState');
        if (storedState) {
            const { username, flag, expirationTime } = JSON.parse(storedState);
            const currentTime = new Date().getTime();
            if (currentTime > expirationTime || !flag) {
                localStorage.removeItem('authState');
                navigate('/');
            } else {
                setUsername(username);
            }
        }
    }, [setUsername, navigate]);

    const handleClose = () => {
        if (ws)
            ws.close();
        navigate(-1);
    };

    const toggleView = () => {
        setShowChat((prev) => !prev); // Toggle between chat and details
    };

    return (
        <div className="trip-container">
            <Header username={username} />
            <main className="uc-tc-main">
                <button className="close-button" onClick={handleClose} title="Close Form">
                    ✘
                </button>
                <div className="toggle-switch">
                    <button onClick={toggleView}>
                        {showChat ? 'Show Details' : 'Show Chat'}
                    </button>
                </div>
                <div className="trip-details-holder" style={{ display: showChat ? 'none' : 'block' }}>
                    <TripDetails trip={trip} />
                </div>
                <div className="trip-chat-holder" style={{ display: showChat ? 'block' : 'none' }}>
                    <TripChat trip={trip} onWsOpen={(ws) => { setWS(ws) }} showChat={showChat} />
                </div>

            </main>
        </div>
    );
};

export default TripContainer;
