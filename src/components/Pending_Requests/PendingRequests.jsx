import React, { useState, useEffect, useCallback } from 'react';
import {REACT_APP_API_URL} from '../../config'
import { useNavigate } from 'react-router-dom';
import './PendingRequests.css'; // Import your custom styles if needed
import Header from '../Header/Header';
import TicketDetails from '../Ticket_Details/TicketDetails'; // Import the TicketDetails component

const PendingRequests = () => {
    const apiUrl = REACT_APP_API_URL;
    const navigate = useNavigate();
    const [user_id, setUserid] = useState('');
    const [username, setUsername] = useState('');
    const [authKey, setAuthKey] = useState('');
    const [tickets, setTickets] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState(null); // State for selected ticket

    const fetchResolveRequests = useCallback(async () => {
        try {
            const response = await fetch(`${apiUrl}/ticket/ipending`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_id: user_id, authKey: authKey }),
            });

            const data = await response.json();

            if (Array.isArray(data)) {
                const filteredTickets = data.filter(ticket => 
                    ticket.status === 'New' || ticket.status === 'In Progress'
                );
                setTickets(filteredTickets);
            } else {
                console.error('Unexpected data format:', data);
                setTickets([]);
            }
        } catch (error) {
            console.error('Error fetching tickets:', error);
            setTickets([]);
        }
    }, [apiUrl, user_id, authKey]);

    useEffect(() => {
        const storedState = localStorage.getItem('authState');
        if (storedState) {
            const { user_id, username, flag, expirationTime, auth_key } = JSON.parse(storedState);
            const currentTime = new Date().getTime();

            if (currentTime > expirationTime || !flag) {
                localStorage.removeItem('authState');
                navigate('/');
            } else {
                setUserid(user_id);
                setUsername(username);
                setAuthKey(auth_key);
                fetchResolveRequests();
            }
        } else {
            navigate('/');
        }
    }, [navigate, fetchResolveRequests]);

    const handleBackClick = () => {
        navigate('/tickets');
    };

    const handleTicketClick = (ticket) => {
        ticket.username = username
        setSelectedTicket(ticket);
    };

    const handleCloseDetails = () => {
        setSelectedTicket(null);
    };

    const handleStatusChange = async (ticket_id, allUpdates) => {
        const { status } = allUpdates;

        try {
            let response;
            if (status === 'Resolved') {
                response = await fetch(`${apiUrl}/ticket/resolve`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        ticket_id,
                        ...allUpdates,
                        authKey
                    }),
                });
            } else if (status === 'Declined') {
                response = await fetch(`${apiUrl}/ticket/declined`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        ticket_id,
                        ...allUpdates,
                        authKey
                    }),
                });
            }

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

        } catch (error) {
            console.error('Error handling status change:', error);
        }
    }

    return (
        <div className="ipending">
            <Header username={username} />

            <main className="ipending-main">
                {selectedTicket ? (
                    <TicketDetails 
                        ticket={selectedTicket} 
                        onClose={handleCloseDetails} 
                        onStatusChange={handleStatusChange}
                        editable={true} // Make ticket details non-editable
                    />
                ) : (
                    <ul>
                        {tickets.length > 0 ? (
                            tickets.map((ticket) => (
                                <li 
                                    key={ticket.ticket_id} 
                                    className="connection-item"
                                    onClick={() => handleTicketClick(ticket)}
                                >
                                    <span className="subject">{ticket.subject}</span>
                                    <span className="status">{ticket.status}</span>
                                    <span
                                        className="cross-icon"
                                        title="Withdraw"
                                        // Add onClick handler if needed for withdraw functionality
                                    >
                                        ✘
                                    </span>
                                </li>
                            ))
                        ) : ("No Resolved Tickets")}
                    </ul>
                )}
            </main>

            <button className="back-button" onClick={handleBackClick}>Back to Tickets</button>
        </div>
    );
};

export default PendingRequests;
