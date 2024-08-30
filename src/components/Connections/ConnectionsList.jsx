// ConnectionsList.jsx
import React from 'react';

const ConnectionsList = ({ connections, onCloseRequest, loading }) => (
    <div className="box">
        <h3>Connections</h3>
        {loading ? (
            <p>Loading...</p>
        ) : (
                <ul>
                {connections.length > 0 ? (
                    connections.map((connection) => (
                        <li key={connection.friend_id} className="connection-item">
                            <span className="friend-name">{connection.username}</span>
                            <span
                                    className="cross-icon"
                                    title="Remove"
                                    onClick={() => onCloseRequest(connection.connection_id)}
                                >
                                    ✘
                            </span>
                        </li>
                    ))
                ) : (
                    <p>No connections found.</p>
                )}
            </ul>
        )}
    </div>
);

export default ConnectionsList;
