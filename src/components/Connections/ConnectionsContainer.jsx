// ConnectionsContainer.jsx
import React from 'react';
import Header from '../Header/Header';
import ConnectionsList from './ConnectionsList';
import MakeConnections from './MakeConnections';
import PeopleYouMightKnow from './PeopleYouMightKnow';
import RequestedConnections from './RequestedConnections';
import Groups from './Groups';
import SearchBar from './SearchBar';
import BackButton from './BackButton';
import Popup from './Popup';
import './Connections.css'; // Import your custom styles
import GroupPopup from './GroupPopup';
import AdminPopup from './AdminPopup';

const ConnectionsContainer = ({
    username, 
    user_id,
    tgt_grp_info,
    connections = [], 
    groups = [],
    groupName,
    suggestions,
    makeConnections, 
    requestedConnections, 
    loading, 
    showSearch, 
    showDropdown,
    showGroupPopup,
    selectedPeople,
    srcConnections,
    onNameChange,
    options, 
    searchRelatedPeople, 
    handleOptionClick, 
    searchInputRef, 
    showPopup, 
    showChgAdminPopup,
    selectedUsername, 
    setGroupName,
    setAdminid,
    handlePopupClose, 
    handleSendRequest, 
    handleBackClick, 
    handleAddPeople,
    onAcceptRequest,
    onRejectRequest,
    onCloseRequest,
    onRevokeRequest,
    onCreateGroupClick,
    onAddToGroup,
    onRemoveFromGroup,
    onCreateGroup,
    onGroupPopupClose,
    onExitGroup,
    onGroupDelete,
    onChgAdminPopupClose
}) => (
    <div className="connection">
        <Header username={username} />

        <main className="connection-main">
            <section>
                <ConnectionsList connections={connections} onCloseRequest={onCloseRequest} loading={loading} />
                <MakeConnections makeConnections={makeConnections} onAcceptRequest={onAcceptRequest} onRejectRequest={onRejectRequest} loading={loading} />
                <RequestedConnections requestedConnections={requestedConnections} onRevokeRequest={onRevokeRequest} loading={loading} />
                <Groups groups={groups} onExitGroup={onExitGroup} onGroupDelete={onGroupDelete} user_id={user_id} loading={loading}  />
                <PeopleYouMightKnow suggestions={suggestions} loading={loading} />
            </section>
            <section className="container-grid">
                <button className="conn-buttons" id='add-people-btn' onClick={handleAddPeople}>Add More People</button>
                {showSearch && (
                    <SearchBar
                        onChange={searchRelatedPeople}
                        onClick={handleOptionClick}
                        options={options}
                        showDropdown={showDropdown}
                        searchInputRef={searchInputRef}
                    />
                )}
                {(connections && connections.length > 1) ? (
                    <button className="conn-buttons" id='make-group-btn' onClick={onCreateGroupClick}>
                        Create Group
                    </button>
                ) : null}
            </section>
        </main>

        <BackButton onClick={handleBackClick} />

        {showPopup && (
            <Popup
                selectedUsername={selectedUsername}
                onClose={handlePopupClose}
                onSendRequest={handleSendRequest}
            />
        )}

        {showGroupPopup && (
            <GroupPopup
                groupName = {groupName} 
                selectedPeople={selectedPeople}
                srcConnections={srcConnections}
                onNameChange={onNameChange}
                onAddPeople={onAddToGroup}
                onRemovePeople={onRemoveFromGroup}
                setGroupName={setGroupName}
                onSubmit={onCreateGroup}
                onClose={onGroupPopupClose}
            />
        )}

        { showChgAdminPopup &&
            (
                <AdminPopup
                    tgt_grp_info={tgt_grp_info}
                    setAdminid={setAdminid}
                    onClose={onChgAdminPopupClose}
                />
            )
        }
    </div>
);

export default ConnectionsContainer;
