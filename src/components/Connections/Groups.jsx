import React from 'react';

const Groups = ({ groups, onExitGroup, onGroupDelete, loading, user_id }) => (
    <div className="box">
        <h3>Groups</h3>
        {loading ? (
            <p>Loading...</p>
        ) : (
            <ul>
                {groups && groups.length > 0 ? (
                    groups.map((group) => (
                        <li key={group.group_id} className="connection-item">
                            <span className="friend-name">{group.group_name}</span>
                            <span className="status-icons">
                                <span
                                    className="exit-icon"
                                    title="Exit"
                                    onClick={() => onExitGroup(group)}
                                >
                                    ↩
                                </span>
                                {group.created_by === user_id && (
                                    <span
                                        className="cross-icon"
                                        title="Delete"
                                        onClick={() => onGroupDelete(group.group_id)}
                                    >
                                        ✘
                                    </span>
                                )}
                            </span>
                        </li>
                    ))
                ) : (
                    <p>No Groups found.</p>
                )}
            </ul>
        )}
    </div>
);

export default Groups;
