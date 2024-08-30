import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './PendingRequests.css'; // Import your custom styles if needed
import Header from '../Header/Header';

const PendingRequests = () => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const navigate = useNavigate();
    const [user_id, setUserid] = useState('');
    const [username, setUsername] = useState('');
    const [tickets, setTickets] = useState([]);
    const [authKey, setAuthKey] = useState('');

    const fetchPendingRequests = React.useCallback(async () => {
        try {
            const response = await fetch(`${apiUrl}/ticket/ipending`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_id: user_id, authKey: authKey }),
            })
            const data = await response.json();
            setTickets(data)
        }
        catch (error) {
            console.error(error);
        }
    }, [apiUrl, user_id, authKey, setTickets]);

    useEffect(() => {
        // Retrieve state and expiration time from localStorage
        const storedState = localStorage.getItem('authState');
        if (storedState) {
            const { user_id, username, flag, expirationTime, auth_key } = JSON.parse(storedState);
            const currentTime = new Date().getTime();

            // Check if the state has expired
            if (currentTime > expirationTime || !flag) {
                // State has expired or flag is false; redirect to login
                localStorage.removeItem('authState'); // Clean up expired state
                navigate('/');
            } else {
                // Handle valid state here
                setUserid(user_id);
                setUsername(username);
                setAuthKey(auth_key);
                fetchPendingRequests()
            }
        } else {
            // No state found; redirect to login
            navigate('/');
        }
    }, [navigate, fetchPendingRequests]);

    const handleBackClick = () => {
        navigate('/tickets'); // Navigate back to the dashboard
    };

    return (
        <div className="ipending">
            <Header username={username}/>

            <main className="ipending-main">
                        <ul>
                                {tickets.length > 0 ? (
                                    tickets.map((ticket) => (
                                        <li key={ticket.ticket_id} className="connection-item" onClick="">
                                            <span className="subject" >{ticket.subject}</span>
                                            <span className="status" >{ticket.status}</span>
                                            <span
                                                className="cross-icon"
                                                title="Withdraw"
                                                onClick=""
                                            >
                                            ✘
                                            </span>
                                        </li>
                                    ))
                                ): ("No Pending Tickets")}
                            </ul>
            </main>

            <button className="back-button" onClick={handleBackClick}>Back to Tickets</button>
        </div>
    );
};

export default PendingRequests;
