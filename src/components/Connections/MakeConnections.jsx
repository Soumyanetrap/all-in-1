// MakeConnections.jsx
import React from 'react';

const MakeConnections = ({ makeConnections, loading, onAcceptRequest, onRejectRequest }) => (
    <div className="box">
        <h3>Make New Friends</h3>
        {loading ? (
            <p>Loading...</p>
        ) : (
            <ul>
                {makeConnections.length > 0 ? (
                    makeConnections.map((connection) => (
                        <li key={connection.friend_id} className="connection-item">
                            <span className="friend-name">{connection.friend_name}</span>
                            <span className="status-icon">
                                <span
                                    className="tick-icon"
                                    title="Accept"
                                    onClick={() => onAcceptRequest(connection.friend_id)}
                                >
                                    ✔
                                </span>
                                <span
                                    className="cross-icon"
                                    title="Reject"
                                    onClick={() => onRejectRequest(connection.friend_id)}
                                >
                                    ✘
                                </span>
                            </span>
                        </li>
                    ))
                ) : (
                    <p>No Requests found.</p>
                )}
            </ul>
        )}
    </div>
);

export default MakeConnections;
