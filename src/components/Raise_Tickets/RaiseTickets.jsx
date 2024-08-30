import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './RaiseTickets.css'; // Import your custom styles if needed
import Header from '../Header/Header';

const RaiseTickets = () => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const navigate = useNavigate();
    const [user_id, setUserid] = useState('');
    const [username, setUsername] = useState('');
    const [connections, setConnections] = useState('');
    const [resolver, setRaiseTicketTo] = useState(null);
    const [options, setOptions] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [authKey, setAuthKey] = useState('');
    const fetchConnections = React.useCallback(async () => {
        try {
            const response = await fetch(`${apiUrl}/connections/get_con`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_id: user_id}),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setConnections(data)

        } catch (error) {
            console.error('Error fetching related people:', error);
            return [];
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
                setUsername(username);
                setUserid(user_id);
                setAuthKey(auth_key);
                fetchConnections();
            }
        } else {
            // No state found; redirect to login
            navigate('/');
        }
    }, [navigate, fetchConnections]);

    const handleBackClick = () => {
        navigate('/tickets'); // Navigate back to the dashboard
    };

    const handleSubmit = React.useCallback(async (event) => {
        event.preventDefault(); // Prevent default form submission
    
        // Extract form data from FormData object
        const formData = new FormData(event.target);
        const subject = formData.get('subject');
        const domain = formData.get('domain');
        const priority = formData.get('priority');
        const description = formData.get('description');
    
        // Construct the payload
        const payload = {
            user_id,subject,domain,resolver,priority,description, authKey
        };
    
        try {
            // Send the data to the server
            const response = await fetch(`${apiUrl}/ticket/iraise`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const responseData = await response.json();
            
            if (Number.isInteger(responseData)) {
                alert("Ticket Raised Successfully!")
                navigate('/tickets'); // Redirect to a success page or display a success message
            }
    
        } catch (error) {
            console.error('Error submitting the form:', error);
            // Handle errors here, e.g., show an error message to the user
        }
    },[apiUrl,resolver, user_id,authKey, navigate]);

    
    

    const fetchRelatedPeople = (search_key) => {
        return connections.filter(connection =>
            connection.username.toLowerCase().startsWith(search_key.toLowerCase())
        );
    };

    const searchRelatedPeople = (selectedValue) => {
        if (selectedValue !== undefined && selectedValue !== "") {
            try {
                // Fetch the related people
                const rows = fetchRelatedPeople(selectedValue);
                const userOptions = rows.map(row => ({
                    username: row.username,
                    friend_id: row.friend_id
                }));

                setOptions(userOptions);
            } catch (error) {
                console.error('Error during search:', error);
            }
        } else {
            setOptions([]);
        }
    };

    const handleResolver = (connection) => {
        setRaiseTicketTo(connection.friend_id); // Store selected value
        setSearchInput(connection.username); // Update input with selected value
        setOptions([]); // Clear the options list
    };

    const handleSearchInputChange = (event) => {
        const newValue = event.target.value;
        setSearchInput(newValue);
        searchRelatedPeople(newValue);
    };

    return (
        <div className="iraise">
            <Header username={username}/>

            <main className="iraise-main">
                <section className="form-section">
                    <h3>Raise a New Ticket</h3>
                    <p>Please fill out the form below to raise a new ticket. Ensure all fields are completed accurately.</p>

                    <form onSubmit={handleSubmit} className="ticket-form">
                        <div className="form-group">
                            <label htmlFor="subject">Subject</label>
                            <input
                                type="text"
                                id="subject"
                                name="subject"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="domain">Domain</label>
                            <select
                                id="domain"
                                name='domain'
                            >
                                <option value="Travel">Travel</option>
                                <option value="Gift">Gift</option>
                                <option value="Investment">Investment</option>
                                <option value="Others">Others</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="raiseTicketTo">Raise Ticket To</label>
                            <input
                                type="text"
                                id="raiseTicketTo"
                                name="raiseTicketTo"
                                value={searchInput}
                                onChange={handleSearchInputChange}
                                required
                            />
                            <ul>
                                {options.length > 0 ? (
                                    options.map((connection) => (
                                        <li key={connection.friend_id} className="connection-item" onClick={() => handleResolver(connection)}>
                                            <span className="friend-name" >{connection.username}</span>
                                            <span
                                                className="tick-icon"
                                                title="Select"
                                                onClick={() => handleResolver(connection)}
                                            >
                                                ✔
                                            </span>
                                        </li>
                                    ))
                                ): null}
                            </ul>
                        </div>

                        <div className="form-group">
                            <label htmlFor="priority">Priority</label>
                            <select
                                id="priority"
                                name="priority"
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                                <option value="Emergency">Emergency</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="description">Description</label>
                            <textarea
                                id="description"
                                name='description'
                                required
                            />
                        </div>

                        <button type="submit">Submit Ticket</button>
                    </form>
                </section>
            </main>

            <button className="back-button" onClick={handleBackClick}>Back to Tickets</button>
        </div>
    );
};

export default RaiseTickets;
