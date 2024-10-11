import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './UcTrips.css'; // Import custom styles
import Header from '../Header/Header';
import {REACT_APP_API_URL} from '../../config'

const UcTrips = () => {
    const apiUrl = REACT_APP_API_URL;
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [user_id, setUserid] = useState('');
    const [trips, setTrips] = useState([]);
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
            const trip_rsp = await fetch(`${apiUrl}/trip/get_trips`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ partner_id:group_ids }),
            })
            const trips = await trip_rsp.json();
            setTrips((prevTrips) => [...prevTrips, ...trips]);
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
                        
                        // Fetch trips data
                        const response = await fetch(`${apiUrl}/trip/get_trips`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ partner_id: user_id }), // Send user_id as partner_id
                        });
                        
                        if (!response.ok) {
                            throw new Error('Failed to fetch trips');
                        }
                        
                        const data = await response.json(); 
                        setTrips(data); // Adjust according to your API response structure
                    }
                } else {
                    // No state found; redirect to login
                    navigate('/');
                }
            } catch (error) {
                console.error('Error fetching trips:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        fetchTravelPartners()
    }, [navigate, apiUrl, fetchTravelPartners]);

    

    const handleCloseForm = () => {
        navigate('/trips'); // Navigate to the home or appropriate page
    };
    const handleTripDetails = (trip) => {
        navigate('/trip_container', { state: { trip } }); // Navigate to the trip details page
    }
    return (
        <div className="trips">
            <Header username={username} />
            <main className="uc-trips-main">
                <button className="close-button" onClick={handleCloseForm} title="Close Form">
                    ✘
                </button>
                <h1 className="trips-title">Your Trips</h1>
                {loading && <p>Loading trips...</p>}
                {error && <p className="error-message">Error: {error}</p>}
                <div className="search-trips">
                    <ul className="search-results">
                        {trips.map(trip => (
                            <li key={trip.trip_id} className="trip-item" onClick={() => handleTripDetails(trip)}>
                                <span className="trip-name">{trip.trip_name}</span>
                                <span className="trip-route">
                                    {trip.from_dest} <span className="arrow">→</span> {trip.to_dest}
                                </span>
                            </li>
// Adjust according to your trips data structure
                        ))}
                    </ul>
                </div>
            </main>
        </div>
    );
};

export default UcTrips;
