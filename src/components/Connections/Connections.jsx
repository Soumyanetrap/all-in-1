// Connections.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import ConnectionsContainer from './ConnectionsContainer';

const Connections = () => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const navigate = useNavigate();
    const [user_id, setUserid] = React.useState('');
    const [admin_id, setAdminid] = React.useState(null);
    const [tgt_grp_info, setTgtGrpInfo] = React.useState('');
    const [username, setUsername] = React.useState('');
    const [connections, setConnections] = React.useState([]);
    const [groups, setGroups] = React.useState([]);
    const [suggestions, setSuggestions] = React.useState([]);
    const [makeConnections, setMakeConnections] = React.useState([]);
    const [requestedConnections, setRequestedConnections] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [showSearch, setShowSearch] = React.useState(false);
    const [showPopup, setShowPopup] = React.useState(false);
    const [selectedID, setSelectedID] = React.useState("");
    const [selectedUsername, setSelectedUsername] = React.useState("");
    const [options, setOptions] = React.useState([]);
    const [showDropdown, setShowDropdown] = React.useState(false);
    const [showCreateGroupPopup, setShowCreateGroupPopup] = React.useState(false);
    const [selectedPeople, setSelectedPeople] = React.useState([]);
    const [groupName, setGroupName] = React.useState("");
    const [srcConnections, setSrcConnections] = React.useState([]);
    const [showChgAdminPopup, setShowChgAdminPopup] = React.useState(false);
    // const [resolvePromise, setResolvePromise] = React.useState(null);
    const adminIdRef = React.useRef(admin_id);

    

    const handleCreateGroupClick = () => {
        setShowCreateGroupPopup(true);
    };

    const handleGroupPopupClose = () => {
        setShowCreateGroupPopup(false);
        setSelectedPeople([]);
        setSrcConnections([]);
        setGroupName('');
    };

    const handleChgAdminpPopupClose = () => {
        setShowChgAdminPopup(false)
        setTgtGrpInfo([])
        setAdminid(null)
        // setResolvePromise(null)
    }

    const handleNameChange = (e) => {
        const inputValue = e.target.value.toLowerCase(); // Convert input to lowercase for case-insensitive comparison
        if (inputValue !== '') {
            
            // Assuming `connections` is a list of objects with a `username` field
            const filteredConnections = connections.filter(connection =>
                connection.username.toLowerCase().includes(inputValue)
            );        
            // Update the state with the filtered connections
            setSrcConnections(filteredConnections);
        } else {
            setSrcConnections([]);
        }
    };

    const handleAddPeopleToGroup = (person) => {
        setSelectedPeople((prev) => [...prev, person]);
    };

    const handleRemovePeopleFromGroup = (person) => {
        setSelectedPeople((prev) => prev.filter(p => p !== person));
    };

    const handleGroupCreation = async () => {
        // Implement the logic to create the group here
        if (groupName) {
            if (selectedPeople.length > 1) {
                //Write the logic to send the details to the server to handle group creation
                const response = await fetch(`${apiUrl}/connections/set_group`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        user_id: user_id,
                        group_name: groupName,
                        members: selectedPeople.map(person => person.friend_id),
                    }),
                });
                if (response.status === 200) {
                    handleGroupPopupClose();
                    fetchGroups();
                } else {
                    console.error('Error creating group:', response.statusText);
                }
                
            } else {
                alert("Group must contain atleast 3 members")
            }
        } else {
            alert('Please Enter a Group Name');
        }
    };

    const searchInputRef = React.useRef(null);

    const fetchConnections = React.useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch(`${apiUrl}/connections/get_con`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: user_id
                }),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setConnections(data);
            setSuggestions([]);
        } catch (error) {
            console.error('Error fetching connections:', error);
        } finally {
            setLoading(false);
        }
    }, [apiUrl, user_id]);

    const fetchGroups = React.useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch(`${apiUrl}/connections/get_groups`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: user_id
                }),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setGroups(data);
        } catch {
            console.error('Error fetching groups');
        } finally {
            setLoading(false);
        }
    }, [apiUrl, user_id]);

    const handleConnections = React.useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch(`${apiUrl}/connections/make_con`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: user_id
                }),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setMakeConnections(data);
        } catch (error) {
            console.error('Error fetching make connections:', error);
        } finally {
            setLoading(false);
        }
    }, [apiUrl, user_id]);

    const fetchRequestedConnections = React.useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch(`${apiUrl}/connections/get_requests`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: user_id
                }),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setRequestedConnections(data);
        } catch (error) {
            console.error('Error fetching requested connections:', error);
        } finally {
            setLoading(false);
        }
    }, [apiUrl, user_id]);

    const fetchRelatedPeople = async (selectedValue) => {
        try {
            const response = await fetch(`${apiUrl}/connections/src_people`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ "search_key": selectedValue }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            return data;

        } catch (error) {
            console.error('Error fetching related people:', error);
            return [];
        }
    };

    const handleAcceptRequest = async (friend_id) => {
        try {
            const response = await fetch(`${apiUrl}/connections/accept_request`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_id:friend_id, friend_id:user_id }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            // Update local state or refetch data here
            fetchConnections()
            handleConnections()
            // console.log('Request accepted');
        } catch (error) {
            console.error('Error accepting request:', error);
        }
    };

    const handleRejectRequest = async (friend_id) => {
        try {
            const response = await fetch(`${apiUrl}/connections/reject_request`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_id:friend_id, friend_id:user_id }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            // Update local state or refetch data here
            handleConnections();

            // console.log('Request rejected');
        } catch (error) {
            console.error('Error rejecting request:', error);
        }
    };
    const handleRevokeRequest = async (friend_id) => {
        try {
            const response = await fetch(`${apiUrl}/connections/reject_request`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_id:user_id, friend_id:friend_id }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            // Update local state or refetch data here
            fetchRequestedConnections();

            // console.log('Request rejected');
        } catch (error) {
            console.error('Error rejecting request:', error);
        }
    };
    
    React.useEffect(() => {
        const storedState = localStorage.getItem('authState');
        if (storedState) {
            const { user_id, username, flag, expirationTime } = JSON.parse(storedState);
            const currentTime = new Date().getTime();

            if (currentTime > expirationTime || !flag) {
                localStorage.removeItem('authState');
                navigate('/');
            } else {
                setUsername(username);
                setUserid(user_id);
                fetchConnections();
                fetchGroups();
                handleConnections();
                fetchRequestedConnections();
            }
        } else {
            navigate('/');
        }
    }, [navigate, fetchConnections,fetchGroups, handleConnections, fetchRequestedConnections]);

    const handleAddPeople = () => {
        setShowSearch(prev => !prev);
        setOptions([]);
    };

    const searchRelatedPeople = async (event) => {
        const selectedValue = event.target.value;
        if (selectedValue !== undefined && selectedValue !== "") {
            try {
                // Fetch the related people
                const rows = await fetchRelatedPeople(selectedValue);

                // Apply filtering based on whether requestedConnections has items
                const filteredRows = requestedConnections.length > 0
                    ? rows.filter(row => 
                        row.username !== username &&  // Exclude the current user
                        !requestedConnections.some(conn => conn.username === row.username)  // Exclude already requested connections
                    )
                    : rows.filter(row => 
                        row.username !== username  // Only exclude the current user if requestedConnections is empty
                    );


                // Map the filtered rows to user options
                const userOptions = filteredRows.map(row => ({
                    username: row.username,
                    user_id: row.user_id
                }));

                setOptions(userOptions);
                setShowDropdown(userOptions.length > 0);
                await fetchRequestedConnections();
            } catch (error) {
                console.error('Error during search:', error);
            }
        } else {
            setShowDropdown(false);
        }
    };

    const handleOptionClick = (option) => {
        setSelectedID(option.user_id);
        setSelectedUsername(option.username);
        setShowPopup(true);
        setShowDropdown(false);
        if (searchInputRef.current) {
            searchInputRef.current.value = '';
        }
    };

    const handlePopupClose = () => {
        setShowPopup(false);
    };

    const handleSendRequest = async () => {
        try {
            const response = await fetch(`${apiUrl}/connections/add_request`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id,
                    requested_user_id: selectedID
                }),
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            // Refetch the requested connections to update the state
            await fetchRequestedConnections();
    
            // console.log('Request sent successfully');
            setShowPopup(false);
        } catch (error) {
            console.error('Error sending request:', error);
        }
    };

    const onCloseRequest = async (connection_id) => {
        try {
            const response = await fetch(`${apiUrl}/connections/close_request`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    connection_id:connection_id,
                }),
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            // Refetch the requested connections to update the state
            fetchConnections();
    
            // console.log('Request sent successfully');
            setShowPopup(false);
        } catch (error) {
            console.error('Error sending request:', error);
        }
    }
    const handleGroupDelete = async (group_id) => {
        try {
            const response = await fetch(`${apiUrl}/connections/dlt_group`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    group_id: group_id,
                }),
            });
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            fetchGroups()
        } catch (e) {
            console.error('Error sending request:', e);
        }
    }

    // Function to change group admin
const changeGroupAdmin = React.useCallback(async (group_id, admin_id) => {
    try {
        const response = await fetch(`${apiUrl}/connections/ch_grp_admin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                group_id: group_id,
                admin_id: admin_id,
            }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        // Optionally parse the response if needed
        // const data = await response.json();

        // Return true to indicate success
        return true;
    } catch (e) {
        console.error('Error sending request:', e);
        // Return false to indicate failure
        return false;
    }
}, [apiUrl]);

// Function to exit a group
const exitGroup = React.useCallback(async (group_id) => {
    try {
        const response = await fetch(`${apiUrl}/connections/ext_group`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: user_id,
                group_id: group_id,
            }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        // Return true to indicate success
        return true;
    } catch (e) {
        console.error('Error sending request:', e);
        // Return false to indicate failure
        return false;
    }
}, [apiUrl, user_id]);

// Function to get group members
const getMembers = React.useCallback(async (group_id) => {
    try {
        const response = await fetch(`${apiUrl}/connections/members`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                group_id: group_id,
            }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data;
    } catch (e) {
        console.error('Error sending request:', e);
        return [];
    }
}, [apiUrl]);

    // Function to handle group exit
    const handleGroupExit = async (group) => {
        try {
            if (group.created_by === user_id) {
                // Prepare to change admin
                const grp_members = await getMembers(group.group_id);
                const flt_grp_members = grp_members.filter(member => member.user_id !== user_id);
                setTgtGrpInfo({ group_name: group.group_name, members: flt_grp_members });
                setShowChgAdminPopup(true);
                
                const timeout = setInterval(async () => {
                    if (adminIdRef.current) {
        
                        // Change group admin
                        const adminChangeResult = await changeGroupAdmin(group.group_id, adminIdRef.current);
                        if (!adminChangeResult) {
                            throw new Error('Failed to change group admin');
                        }
            
                        // Exit the group only after admin change is successful
                        const exitResult = await exitGroup(group.group_id);
                        if (!exitResult) {
                            throw new Error('Failed to exit the group');
                        }
            
                        // Optionally, close the popup here or in `handleAdminIdChange`
                        handleChgAdminpPopupClose()
                        fetchGroups()
                        clearInterval(timeout)
                    }
                }, 100)
            } else {
                // If not created by user, just exit the group
                const exitResult = await exitGroup(group.group_id);
                if (!exitResult) {
                    throw new Error('Failed to exit the group');
                }
                fetchGroups()
            }
        } catch (error) {
            console.error('Error handling group exit:', error);
            // Optionally, handle the error, e.g., show a notification to the user
        }
    };
    
    React.useEffect(() => {
        adminIdRef.current = admin_id;
    }, [admin_id]);

    const handleBackClick = () => {
        navigate('/dashboard');
    };

    return (
        <ConnectionsContainer
            username={username}
            user_id={user_id}
            connections={connections}
            groups={groups}
            groupName = {groupName}
            suggestions={suggestions}
            makeConnections={makeConnections}
            requestedConnections={requestedConnections}
            loading={loading}
            showSearch={showSearch}
            showDropdown={showDropdown}
            options={options}
            searchRelatedPeople={searchRelatedPeople}
            handleOptionClick={handleOptionClick}
            showGroupPopup={showCreateGroupPopup}
            selectedPeople={selectedPeople}
            srcConnections={srcConnections}
            searchInputRef={searchInputRef}
            showPopup={showPopup}
            selectedUsername={selectedUsername}
            setGroupName={setGroupName}
            setAdminid={setAdminid}
            tgt_grp_info={tgt_grp_info}
            showChgAdminPopup={showChgAdminPopup}
            handlePopupClose={handlePopupClose}
            handleSendRequest={handleSendRequest}
            handleBackClick={handleBackClick}
            handleAddPeople={handleAddPeople}
            onAcceptRequest={handleAcceptRequest}
            onRejectRequest={handleRejectRequest}
            onCloseRequest={onCloseRequest}
            onRevokeRequest={handleRevokeRequest}
            onCreateGroupClick={handleCreateGroupClick}
            onNameChange={handleNameChange}
            onAddToGroup={handleAddPeopleToGroup}
            onRemoveFromGroup={handleRemovePeopleFromGroup}
            onCreateGroup={handleGroupCreation}
            onGroupPopupClose={handleGroupPopupClose}
            onChgAdminPopupClose={handleChgAdminpPopupClose}
            onGroupDelete={handleGroupDelete}
            onExitGroup={handleGroupExit}
        />
    );
};

export default Connections;
