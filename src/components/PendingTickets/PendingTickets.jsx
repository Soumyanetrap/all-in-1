import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './PendingTickets.css'; // Import your custom styles if needed
import Header from '../Header/Header';
import TicketDetails from '../Ticket_Details/TicketDetails'; // Import the new component
import TicketSections from './TicketSections'; // Import the new TicketSections component

const PendingTickets = () => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const navigate = useNavigate();
    const [user_id, setUserid] = useState('');
    const [username, setUsername] = useState('');
    const [auth_key, setAuthKey] = useState('');
    const [tickets, setTickets] = useState([]);
    const [activeSection, setActiveSection] = useState('New'); // Default to 'New'
    const [selectedTicket, setSelectedTicket] = useState(null); // State for selected ticket

    const fetchPendingRequests = useCallback(async () => {
        try {
            const response = await fetch(`${apiUrl}/ticket/pending`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_id: user_id }),
            });
            const data = await response.json();
            setTickets(data);
        } catch (error) {
            console.error(error);
        }
    }, [apiUrl, user_id]);

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
                fetchPendingRequests();
            }
        } else {
            // No state found; redirect to login
            navigate('/');
        }
    }, [navigate, fetchPendingRequests]);

    const handleBackClick = () => {
        navigate('/tickets'); // Navigate back to the dashboard
    };

    // Separate tickets into "New Tickets" and "Tickets Underway"
    const newTickets = tickets.filter(ticket => ticket.status === 'New');
    const ticketsUnderway = tickets.filter(ticket => ticket.status === 'In Progress');

    // Toggle between sections
    const handleSectionToggle = (section) => {
        setActiveSection(activeSection === section ? '' : section);
    };

    // Show ticket details
    const handleTicketClick = (ticket) => {
        // console.log(ticket);
        setSelectedTicket(ticket);
    };

    // Close ticket details view
    const handleCloseDetails = () => {
        setSelectedTicket(null);
    };

    const handleStatusChange = async (ticket_id, allUpdates) => {
        const { status } = allUpdates;
    
        try {
            let response;
            if (status === 'In Progress') {
                response = await fetch(`${apiUrl}/ticket/update_ticket`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        ticket_id,
                        ...allUpdates, // Spread all updates here
                        auth_key
                    }),
                });
            } else if (status === 'Resolved') {
                response = await fetch(`${apiUrl}/ticket/resolve`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        ticket_id,
                        ...allUpdates,
                        auth_key
                    }),
                });
            } else {
                // Assuming 'Declined' status here
                response = await fetch(`${apiUrl}/ticket/declined`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        ticket_id,
                        ...allUpdates,
                        auth_key
                    }),
                });
            }
    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            // const data = await response.json();
            // console.log('Update successful:', data);
    
        } catch (error) {
            console.error('Error handling status change:', error);
        }
    }
    
    return (
        <div className="pending">
            <Header username={username} />

            <main className="pending-main">
                {selectedTicket ? (
                    <TicketDetails 
                        ticket={selectedTicket} 
                        onClose={handleCloseDetails} 
                        onStatusChange={handleStatusChange}
                        editable={true}
                    />
                ) : (
                    <TicketSections 
                        activeSection={activeSection}
                        newTickets={newTickets}
                        ticketsUnderway={ticketsUnderway}
                        handleSectionToggle={handleSectionToggle}
                        handleTicketClick={handleTicketClick}
                    />
                )}
            </main>

            <button className="back-button" onClick={handleBackClick}>Back to Tickets</button>
        </div>
    );
};

export default PendingTickets;
