import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Banks.css'; // Import your custom styles if needed
import Header from '../Header/Header';

const Banks = () => {
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
        navigate('/finance'); // Navigate back to the dashboard
    };

    const handleItemClick = (item) => {
        navigate(`/${item}`)
    };

    return (
        <div className="banks">
            <Header username={username}/>

            <main className="banks-main">
                <section>
                    <div className="box">
                        <h3>Bank Overview</h3>
                        <p>View and manage your bank account information and reports here.</p>
                    </div>
                </section>

                <section className="grid-container">
                    <div className="grid-item" onClick={() => handleItemClick('add_ac')}>Add Bank Account</div>
                    <div className="grid-item" onClick={() => handleItemClick('rm_ac')}>Remove Bank Account</div>
                    <div className="grid-item" onClick={() => handleItemClick('ed_ac')}>Edit Bank Account</div>
                </section>
            </main>
            

            <button className="back-button" onClick={handleBackClick}>Back to Finance</button>
        </div>

    );
};

export default Banks;
