import React from 'react';
import './GroupPopup.css'; // Import your custom styles

const GroupPopup = ({
    groupName,
    selectedPeople,
    srcConnections,
    onNameChange,
    onAddPeople,
    onRemovePeople,
    setGroupName,
    onSubmit,
    onClose
}) => {
    // Filter srcConnections to exclude those already in selectedPeople
    const filteredConnections = srcConnections.filter(
        (connection) => !selectedPeople.some(person => person.connection_id === connection.connection_id)
    );

    return (
        <div className="popup-overlay">
            <div className="popup-content create-group-content">
                <span className="close-icon" onClick={onClose}>&times;</span>
                <h4>Create New Group</h4>
                <input
                    type="text"
                    placeholder="Enter group name"
                    onChange={(e) => setGroupName(e.target.value)}
                    required
                />
                <input
                    type="text"
                    onChange={onNameChange}
                    placeholder="Search Connections to Add"
                />
                <div className="people-list">
                    {selectedPeople.length > 0 ? (
                        <div>
                            <h5>{groupName ? `People in ${groupName}`:('People')}</h5>
                            <ul>
                                {selectedPeople.map((connection) => (
                                    <li key={connection.connection_id} className="connection-item">
                                        <span className="friend-name">{connection.username}</span>
                                        <span
                                            className="cross-icon"
                                            title="Remove"
                                            onClick={() => onRemovePeople(connection)}
                                        >
                                            ✘
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : null}
                </div>
                <div className="people-list">
                    {filteredConnections.length > 0 ? (
                        <div>
                            <h5>Select People</h5>
                            <ul>
                                {filteredConnections.map((connection) => (
                                    <li key={connection.connection_id} className="connection-item">
                                        <span className="friend-name">{connection.username}</span>
                                        <span
                                            className="tick-icon"
                                            title="Add"
                                            onClick={() => onAddPeople(connection)}
                                        >
                                            ✔
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <p>Type in the username to search for Connections</p>
                    )}
                </div>
                <button className="submit-button" onClick={onSubmit}>Create Group</button>
            </div>
        </div>
    );
};

export default GroupPopup;
