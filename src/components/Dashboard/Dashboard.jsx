import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Header/Header';
import './Dashboard.css'; // Import your custom styles if needed

const Dashboard = () => {
    // const location = useLocation(); // Hook to access location object
    const navigate = useNavigate(); // Hook to navigate programmatically
    const [username, setUsername] = React.useState('');

    React.useEffect(() => {
        // Retrieve state and expiration time from localStorage
        const storedState = localStorage.getItem('authState');
        // console.log(storedState);
        if (storedState) {
            const { username, flag } = JSON.parse(storedState);
            // const currentTime = new Date().getTime();

            // Check if the state has expired
            if (!flag) {
                // State has expired or flag is false; redirect to login
                // console.log("Logging Out: Session Expired!")
                localStorage.removeItem('authState'); // Clean up expired state
                navigate('/');
            }
            else {
            setUsername(username);
            }
        } else {
            // No state found; redirect to login
            navigate('/');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('authState'); // Remove auth state from localStorage
        navigate('/'); // Redirect to home page
    };

    // Define your function here
    const handleProfileClick = () => {
        // console.log('Profile section clicked');
        navigate('/profile'); // Navigate to profile page
    };

    const handleFinanceClick = () => {
        navigate('/finance'); // Navigate to financial section
    };

    const handleTravelClick = () => {
        navigate('/travel'); // Navigate to travel section
    };

    const handleConnectClick = () => {
        navigate('/connect'); // Navigate to connect section
    }
    const handleTicketClick = () => {
        navigate('/tickets'); // Navigate to travel section
    };

    return (
        <div className="dashboard">
            <Header username={username} />
    
            <div className="dashboard-container">
                <aside className="dashboard-sidebar">
                    <nav>
                        <ul>
                            <li><a href="#profile">Profile</a></li>
                            <li><a href="#finance">Finance</a></li>
                            <li><a href="#travel">Travel</a></li>
                        </ul>
                    </nav>
                </aside>
    
                <main className="dashboard-main">
                    <section id="profile">
                        <div className="box" onClick={handleProfileClick}>
                            <h3>Profile</h3>
                            <p>Manage your profile information and preferences.</p>
                        </div>
                    </section>

                    <section id="finance">
                        <div className="box" onClick={handleFinanceClick}>
                            <h3>Finance</h3>
                            <p>View and manage your financial information and reports.</p>
                        </div>
                    </section>

                    <section id="travel">
                        <div className="box" onClick={handleTravelClick}>
                            <h3>Travel</h3>
                            <p>Access and manage your travel plans and details.</p>
                        </div>
                    </section>

                    <section id="connect">
                        <div className="box" onClick={handleConnectClick}>
                            <h3>Connections</h3>
                            <p>Connect to people</p>
                        </div>
                    </section>

                    <section id="ticket">
                        <div className="box" onClick={handleTicketClick}>
                            <h3>Tickets</h3>
                            <p>Raise and Resolve Tickets</p>
                        </div>
                    </section>
                </main>
            </div>
    
            <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>
    );
    
    
};

export default Dashboard;
