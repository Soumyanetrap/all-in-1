import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './UcVacations.css'; // Import custom styles
import Header from '../Header/Header';
import {REACT_APP_API_URL} from '../../config'

const UcVacations = () => {
    const apiUrl = REACT_APP_API_URL;
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [user_id, setUserid] = useState('');
    const [vacations, setVacations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchTravelPartners = useCallback(async () => {
        try {
            const response = await fetch(`${apiUrl}/connections/get_groups`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_id }),
            });
            const groups = await response.json();
            const group_ids = groups.map((group) => group.group_id);
            const vacation_rsp = await fetch(`${apiUrl}/trip/get_vacations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ partner_id:group_ids }),
            })
            const vacations = await vacation_rsp.json();
            setVacations((prevVacations) => [...prevVacations, ...vacations]);
            // setTravellers(data);
        } catch (error) {
            console.error('Failed to fetch travel partners:', error);
        }
    }, [apiUrl, user_id]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Retrieve state and expiration time from localStorage
                const storedState = localStorage.getItem('authState');
                if (storedState) {
                    const { user_id, username, flag, expirationTime } = JSON.parse(storedState);
                    const currentTime = new Date().getTime();

                    // Check if the state has expired
                    if (currentTime > expirationTime || !flag) {
                        // State has expired or flag is false; redirect to login
                        localStorage.removeItem('authState'); // Clean up expired state
                        navigate('/');
                    } else {
                        // Handle valid state
                        setUsername(username);
                        setUserid(user_id);
                        
                        // Fetch vacations data
                        const response = await fetch(`${apiUrl}/trip/get_vacations`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ partner_id: user_id }), // Send user_id as partner_id
                        });
                        
                        if (!response.ok) {
                            throw new Error('Failed to fetch vacations');
                        }
                        
                        const data = await response.json(); 
                        setVacations(data); // Adjust according to your API response structure
                    }
                } else {
                    // No state found; redirect to login
                    navigate('/');
                }
            } catch (error) {
                console.error('Error fetching vacations:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        fetchTravelPartners()
    }, [navigate, apiUrl, fetchTravelPartners]);

    

    const handleCloseForm = () => {
        navigate('/vacation'); // Navigate to the home or appropriate page
    };
    const handleTripDetails = (vacation) => {
        navigate('/vacation_container', { state: { vacation } }); // Navigate to the vacation details page
    }
    return (
        <div className="vacations">
            <Header username={username} />
            <main className="uc-vacations-main">
                <button className="close-button" onClick={handleCloseForm} title="Close Form">
                    ✘
                </button>
                <h1 className="vacations-title">Your Vacations</h1>
                {loading && <p>Loading vacations...</p>}
                {error && <p className="error-message">Error: {error}</p>}
                <div className="search-vacations">
                    <ul className="search-results">
                        {vacations.map(vacation => (
                            <li key={vacation.vacation_id} className="vacation-item" onClick={() => handleTripDetails(vacation)}>
                                <span className="vacation-name">{vacation.vacation_name}</span>
                                <span className="vacation-route">
                                    {vacation.from_dest} <span className="arrow">→</span> {vacation.to_dest}
                                </span>
                            </li>
// Adjust according to your vacations data structure
                        ))}
                    </ul>
                </div>
            </main>
        </div>
    );
};

export default UcVacations;
