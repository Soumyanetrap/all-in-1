import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Tickets.css'; // Import your custom styles if needed
import Header from '../Header/Header';

const Tickets = () => {
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

    const handleBackClick = () => {
        navigate('/dashboard'); // Navigate back to the dashboard
    };

    const handleItemClick = (item) => {
        navigate(`/${item}`)
        // Add your logic here. For example, navigate to a different page or open a modal.
    };

    return (
        <div className="ticket">
            <Header username={username} />

            <main className="ticket-main">
                <section>
                    <div className="box">
                        <h3>Tickets Overview</h3>
                        <p>View and manage your financial information and reports here.</p>
                    </div>
                </section>

                <section className="grid-container">
                    <section className="first-grid-container">
                        <p>Raise</p>
                        <div className="grid-item" onClick={() => handleItemClick('iraise')}>Raise Request</div>
                        <div className="grid-item" onClick={() => handleItemClick('ipending')}>Pending Requests</div>
                        <div className="grid-item" onClick={() => handleItemClick('iresolved')}>Resolved Requests</div>
                    </section>

                    <section className="second-grid">
                        <p>Resolve</p>
                        <section className="second-grid-container">
                            <div className="grid-item" onClick={() => handleItemClick('pending')}>Pending Tickets</div>
                            <div className="grid-item" onClick={() => handleItemClick('resolved')}>Resolved Requests</div>
                        </section>
                    </section>
                 </section>
            </main>

            <button className="back-button" onClick={handleBackClick}>Back to Dashboard</button>
        </div>

    );
};

export default Tickets;
