import React from 'react';
import './Popup.css'; // Import your custom styles

const Popup = ({ selectedUsername, onClose, onSendRequest }) => {
    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <span className="close-icon" onClick={onClose}>&times;</span>
                <h4>Send Connection Request</h4>
                <p>Do you want to send a connection request to <strong>{selectedUsername}</strong>?</p>
                <button className="send-request-button" onClick={onSendRequest}>Send Request</button>
            </div>
        </div>
    );
};

export default Popup;
