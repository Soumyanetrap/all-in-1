// RequestedConnections.jsx
import React from 'react';

const RequestedConnections = ({ requestedConnections,onRevokeRequest, loading }) => (
    <div className="box">
        <h3>Requested Connections</h3>
        {loading ? (
            <p>Loading...</p>
        ) : (
            <ul>
                    {requestedConnections.length > 0 ? (
                    requestedConnections.map((connection) => (
                        <li key={connection.friend_id} className="requested-connection-item">
                            <span className="friend-name">{connection.username}</span>
                            <span
                                    className="cross-icon"
                                    title="Remove"
                                    onClick={() => onRevokeRequest(connection.friend_id)}
                                >
                                    ✘
                            </span>
                        </li>
                    ))
                ) : (
                    <p>No requested connections found.</p>
                )}
            </ul>
        )}
    </div>
);

export default RequestedConnections;
