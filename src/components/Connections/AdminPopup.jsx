import React from 'react';
import './GroupPopup.css'; // Import your custom styles

const AdminPopup = ({
    tgt_grp_info,
    setAdminid,
    onClose
}) => {
    return (
        <div className="popup-overlay">
            <div className="popup-content create-group-content">
                <span className="close-icon" onClick={onClose}>&times;</span>
                <h4>Set New Admin</h4>
                <h5>Group Name: {tgt_grp_info.group_name}</h5>
                {tgt_grp_info.members.length > 0 ? (
                    <div>
                        <ul>
                            {tgt_grp_info.members.map((member) => (
                                <li key={member.user_id} className="connection-item">
                                    <span className="friend-name">{member.username}</span>
                                    <span
                                            className="tick-icon"
                                            title="Add"
                                            onClick={() => setAdminid(member.user_id)}
                                        >
                                            ✔
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default AdminPopup;
