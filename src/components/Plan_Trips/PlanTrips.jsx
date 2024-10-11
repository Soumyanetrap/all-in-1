import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './PlanTrips.css'; // Import custom styles
import Header from '../Header/Header';
import useTravelPartnersFetcher from '../Trips_Partner_Fetcher/TripPartnerFetcher'
import { FaBus, FaTrain, FaPlane } from 'react-icons/fa'; // Icons for travel modes
import AttachmentsPreview from '../Drive_Files/PreviewFiles';
import useFileHandler from '../Drive_Files/HandleFiles'
import {REACT_APP_API_URL} from '../../config'


const PlanTrips = () => {
    const apiUrl = REACT_APP_API_URL;
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [auth_key, setAuthKey] = useState([]);
    const [user_id, setUserid] = useState('');
    const [traveller, setTravellers] = useState(null);
    const [filteredTravellers, setFilteredTravellers] = useState([]);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        trip_name: '',
        from_dest: '',
        to_dest: '',
        dept_date: '',
        arv_date: '',
        trip_with: 'Self', // Default value
        mode: 'Bus',
        notes: '',
        searchQuery: '' // Add a state for the search query
    });
    const [minDepartureTime, setMinDepartureTime] = useState('');
    const [minArrivalTime, setMinArrivalTime] = useState('');
    const [isSelectingTraveller, setIsSelectingTraveller] = useState(false);
    const [attachments, setAttachments] = useState([]);
    const [fileNames, setFileNames] = useState([]);

    useEffect(() => {
        // Set the minimum departure time to the current date and time
        const currentDateTime = new Date().toISOString().slice(0, 16);
        setMinDepartureTime(currentDateTime);
    }, []);

    useEffect(() => {
        // Update the minimum arrival time whenever the departure time changes
        if (formData.dept_date) {
            setMinArrivalTime(formData.dept_date);
        }
    }, [formData.dept_date]);

    useEffect(() => {
        // Retrieve state and expiration time from localStorage
        const storedState = localStorage.getItem('authState');
        if (storedState) {
            const { user_id, username, flag, expirationTime, auth_key} = JSON.parse(storedState);
            const currentTime = new Date().getTime();

            // Check if the state has expired
            if (currentTime > expirationTime || !flag) {
                // State has expired or flag is false; redirect to login
                localStorage.removeItem('authState'); // Clean up expired state
                navigate('/');
            } else {
                // Handle valid state here
                setUsername(username);
                setUserid(user_id);
                setAuthKey(auth_key);
            }
        } else {
            // No state found; redirect to login
            navigate('/');
        }
    }, [navigate]);

    const fetchTravelPartners = useTravelPartnersFetcher(apiUrl,user_id,setTravellers)

    useEffect(() => {
        // Reset searchQuery and filteredTravellers whenever trip_with changes
        setFormData(prevFormData => ({
            ...prevFormData,
            searchQuery: ''
        }));
        setFilteredTravellers([]);

        // Fetch travel partners based on the new trip_with value
        if (formData.trip_with === 'Group') {
            fetchTravelPartners('connections/get_groups');
        } else if (formData.trip_with === 'Behalf') {
            fetchTravelPartners('connections/get_con');
        } else {
            setFilteredTravellers([]);
        }
    }, [formData.trip_with, fetchTravelPartners]);

    useEffect(() => {
        if (!isSelectingTraveller) {
            if (traveller) {
                if (formData.searchQuery.trim() === '') {
                    setFilteredTravellers([]);
                } else {
                    const filtered = traveller.filter((item) => {
                        const searchLower = formData.searchQuery.toLowerCase();
                        
                        if (formData.trip_with === 'Group') {
                            return item.group_name && item.group_name.toLowerCase().startsWith(searchLower);
                        } else if (formData.trip_with === 'Behalf') {
                            return item.username && item.username.toLowerCase().startsWith(searchLower);
                        } else {
                            return false;
                        }
                    });
                    setFilteredTravellers(filtered);
                }
            } else {
                setFilteredTravellers([]);
            }
        }
    }, [formData.searchQuery, formData.trip_with, traveller, isSelectingTraveller]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevFormData) => {
            // Check if the value for searchQuery is being updated
            if (name === 'searchQuery') {
                setIsSelectingTraveller(false); // Set this flag only for searchQuery changes
            }
            
            // Update the form data state
            return {
                ...prevFormData,
                [name]: value
            };
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        // Determine partner_id based on trip_with
        const partner_id = formData.trip_with === 'Self' ? user_id : formData.partner_id;
    
        // Create a new object for the request payload, excluding searchQuery
        const { searchQuery, ...payload } = formData;
        payload.auth_key = auth_key;
    
        try {
            // Step 1: Send form data to create the trip
            const response = await fetch(`${apiUrl}/trip/create_trip`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...payload, // Spread the payload object without searchQuery
                    user_id, // Include user_id in the payload
                    partner_id, // Use partner_id
                    authKey: auth_key
                }),
            });
    
            if (!response.ok) {
                throw new Error('Trip creation request failed');
            }
    
            // Parse the response to get the trip_id
            const trip_id  = await response.json();
    
            // Check if trip_id is an integer
            if (!Number.isInteger(trip_id)) {
                throw new Error('Invalid trip_id received from the server');
            }
    
            // Step 2: Prepare and send the file upload request
            if (attachments.length > 0) {
                const formDataForUpload = new FormData();
    
                // Append the trip_id to the formData
                formDataForUpload.append('trip_id', trip_id);
                formDataForUpload.append('user_id', user_id);
                formDataForUpload.append('auth_key', auth_key);
    
                // Append each file
                attachments.forEach((file, index) => {
                    formDataForUpload.append('files', file, `${fileNames[index] || trimExtension(file.name)}.${file.name.split('.').pop()}`);
                });
    
                const uploadResponse = await fetch(`${apiUrl}/storage/uploadFile`, {
                    method: 'POST',
                    body: formDataForUpload,
                });
    
                if (!uploadResponse.ok) {
                    throw new Error('File upload failed');
                }
    
                const id = await uploadResponse.json(); // Assuming you want to handle the response
    
                // Clear attachments and file names after upload
                setAttachments([]);
                setFileNames([]);
                if(Number.isInteger(id))
                    alert("Trip Successfully Planned")
                else
                    alert("Unsuccessful")
            } else {
                alert("Trip Successfully Planned")
            }
    
            navigate('/trips')
    
        } catch (e) {
            console.error('Error submitting form:', e);
        }
    };
    
    const handleCloseForm = () => {
        navigate('/trips'); // Navigate to the home or appropriate page
    };

    const handleTraveller = (selectedTraveller) => {
        setIsSelectingTraveller(true); // Set flag to prevent filtering during selection
        setFormData(prevFormData => ({
            ...prevFormData,
            partner_id: selectedTraveller.friend_id || selectedTraveller.group_id, // Set partner_id
            searchQuery: selectedTraveller.username || selectedTraveller.group_name
        }));
        setFilteredTravellers([]); // Clear the options list
    };

    const {
        trimExtension,
        handleFileChange,
        handleFileNameChange,
        handleFileRemove,
    } = useFileHandler(fileNames, setAttachments, setFileNames, setError);

    return (
        <div className="trips">
            <Header username={username} />
            <main className="trips-main">
                <button className="close-button" onClick={handleCloseForm} title="Close Form">
                    ✘
                </button>
                <h1 className="trips-title">Plan Your Trip</h1>
                <form className="trip-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="trip_name">Travel Name</label>
                        <input
                            type="text"
                            id="trip_name"
                            name="trip_name"
                            value={formData.trip_name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-row">
                        <div className="form-group form-group-half">
                            <label htmlFor="from_dest">Departure Destination</label>
                            <input
                                type="text"
                                id="from_dest"
                                name="from_dest"
                                value={formData.from_dest}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group form-group-half">
                            <label htmlFor="to_dest">Arrival Destination</label>
                            <input
                                type="text"
                                id="to_dest"
                                name="to_dest"
                                value={formData.to_dest}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group form-group-half">
                            <label htmlFor="dept_date">Departure Time</label>
                            <input
                                type="datetime-local"
                                id="dept_date"
                                name="dept_date"
                                value={formData.dept_date}
                                onChange={handleChange}
                                required
                                min={minDepartureTime} // Set minimum allowed departure time
                            />
                        </div>
                        <div className="form-group form-group-half">
                            <label htmlFor="arv_date">Arrival Time</label>
                            <input
                                type="datetime-local"
                                id="arv_date"
                                name="arv_date"
                                value={formData.arv_date}
                                onChange={handleChange}
                                required
                                min={minArrivalTime} // Set minimum allowed arrival time based on departure time
                                disabled={!formData.dept_date} // Disable if dept_date is not set
                                title={!formData.dept_date ? "Set departure time" : ""} // Hint for disabled state
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group form-group-quarter">
                            <label htmlFor="trip_with">Travel With</label>
                            <select
                                id="trip_with"
                                name="trip_with"
                                value={formData.trip_with}
                                onChange={handleChange}
                            >
                                <option value="Self">Self</option>
                                <option value="Group">Group</option>
                                <option value="Behalf">On Behalf Of</option>
                            </select>
                        </div>
                        <div className="form-group form-group-quarter">
                            <label htmlFor="mode">Travel Mode</label>
                            <select
                                id="mode"
                                name="mode"
                                value={formData.mode}
                                onChange={handleChange}
                            >
                                <option value="Bus">Bus <FaBus /></option>
                                <option value="Train">Train <FaTrain /></option>
                                <option value="Flight">Flight <FaPlane /></option>
                                <option value="Others">Others</option>
                            </select>
                        </div>
                    </div>
                    {(formData.trip_with === 'Group' || formData.trip_with === 'Behalf') && (
                        <div className="form-group">
                            <label htmlFor="searchQuery">Search</label>
                            <input
                                type="text"
                                id="searchQuery"
                                name="searchQuery"
                                value={formData.searchQuery}
                                onChange={handleChange}
                                className="search-input"
                                placeholder="Search for Friend or Group"
                            />
                            <ul className="search-results">
                                {filteredTravellers.length > 0 && (
                                    filteredTravellers.map((traveller, index) => (
                                        <li key={index} onClick={() => handleTraveller(traveller)}>
                                            <span className="traveller-name">{traveller.username || traveller.group_name}</span>
                                            <span
                                                className="tick-icon"
                                                title="Select"
                                            >
                                                ✔
                                            </span>
                                        </li>
                                    ))
                                )}
                            </ul>
                        </div>
                    )}
                    <div className="form-group">
                        <label htmlFor="notes">Additional Notes</label>
                        <textarea
                            id="notes"
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label className="file-input-label">
                            <input
                                type="file"
                                name="files"
                                className="attachments-input"
                                multiple
                                accept=".png, .jpeg, .jpg, .pdf"
                                onChange={handleFileChange}
                            />
                            <span className="file-input-button">Choose Files</span>
                        </label>
                        {error && <p className="error-message">{error}</p>}
                        <AttachmentsPreview 
                            attachments={attachments}
                            fileNames={fileNames}
                            editable={true}
                            handleFileNameChange={handleFileNameChange}
                            handleFileRemove={handleFileRemove}
                        />
                    </div>
                    <button type="submit" className="create-button">Create</button>
                </form>
            </main>
        </div>
    );
};

export default PlanTrips;
