// WorkInProgress.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const WorkInProgress = () => {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1); // Navigate back to the previous page
    };

    return (
        <div style={{ textAlign: 'center', padding: '50px' }}>
            <h1>Work In Progress</h1>
            <p>This page is under construction. Please check back later!</p>
            <button onClick={handleBack} style={{ padding: '10px 20px', marginTop: '20px' }}>
                Go Back
            </button>
        </div>
    );
};

export default WorkInProgress;
