import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Header/Header';
import './Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const [username, setUsername] = React.useState('');
    const [isSidebarOpen, setSidebarOpen] = React.useState(false); // State for sidebar visibility

    React.useEffect(() => {
        const storedState = localStorage.getItem('authState');
        if (storedState) {
            const { username, flag } = JSON.parse(storedState);
            if (!flag) {
                localStorage.removeItem('authState');
                navigate('/');
            } else {
                setUsername(username);
            }
        } else {
            navigate('/');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('authState');
        navigate('/');
    };

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen); // Toggle sidebar state
    };

    const handleProfileClick = () => {
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
    };

    const handleTicketClick = () => {
        navigate('/tickets'); // Navigate to tickets section
    };

    return (
        <div className="dashboard">
            <Header username={username} />
            <button className="hamburger" onClick={toggleSidebar}>
                &#9776; {/* Hamburger icon */}
            </button>

            <div className={`dashboard-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
                <aside className="dashboard-sidebar">
                    <nav>
                        <ul>
                            <li onClick={handleProfileClick}>Profile</li>
                            <li onClick={handleFinanceClick}>Finance</li>
                            <li onClick={handleTravelClick}>Travel</li>
                            <li onClick={handleConnectClick}>Connections</li>
                            <li onClick={handleTicketClick}>Tickets</li>
                            <li onClick={handleLogout}>Logout</li> {/* Logout as a menu item */}
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
        </div>
    );
};

export default Dashboard;
