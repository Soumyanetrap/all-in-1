// TripDetails.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useFetchExistingFiles from '../Drive_Files/GetFiles';
import useOpenFile from '../Drive_Files/OpenFiles';
import useFileDelete from '../Drive_Files/DeleteFiles';
import useFileHandler from '../Drive_Files/HandleFiles';
import useTravelPartnersFetcher from '../Trips_Partner_Fetcher/TripPartnerFetcher';
import ExistingFilesList from '../Drive_Files/RenderFiles';
import {REACT_APP_API_URL} from '../../config'

import AttachmentsPreview from '../Drive_Files/PreviewFiles';
import './TripDetails.css'; // Import the same styles

const TripDetails = ({ trip, editable = true }) => {
    const apiUrl = REACT_APP_API_URL;
    const navigate = useNavigate();
    const [user_id, setUserid] = useState('');
    const [existingFiles, setExistingFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filteredTravellers, setFilteredTravellers] = useState([]);
    const [formData, setFormData] = useState({
        ...trip,
        dept_date: trip.dept_date ? trip.dept_date.slice(0, 16) : '',
        arv_date: trip.arv_date ? trip.arv_date.slice(0, 16) : ''
    });
    const [initialFormData, setInitialFormData] = useState(formData);
    const [attachments, setAttachments] = useState([]);
    const [fileNames, setFileNames] = useState([]);
    const [isSelectingTraveller, setIsSelectingTraveller] = useState(false);
    const [traveller, setTravellers] = useState(null);
    const [error, setError] = useState('');

    const {
        trimExtension,
        handleFileChange,
        handleFileNameChange,
        handleFileRemove,
    } = useFileHandler(fileNames, setAttachments, setFileNames, setError);

    // Format dates
    const fromDate = new Date(formData.dept_date).toLocaleString();
    const toDate = new Date(formData.arv_date).toLocaleString();

    const fetchExistingFiles = useFetchExistingFiles(apiUrl, setLoading, setExistingFiles, null, formData.trip_id);
    const openFile = useOpenFile(existingFiles);
    const handleFileDelete = useFileDelete(apiUrl, setExistingFiles);

    const fetchTravelPartners = useTravelPartnersFetcher(apiUrl,user_id,setTravellers)

    useEffect(() => {
        fetchExistingFiles();
        // setInitialFormData(formData);
    }, [fetchExistingFiles]);

    useEffect(() => {
        // Retrieve state and expiration time from localStorage
        const storedState = localStorage.getItem('authState');
        if (storedState) {
            const { user_id, flag, expirationTime} = JSON.parse(storedState);
            const currentTime = new Date().getTime();

            // Check if the state has expired
            if (currentTime > expirationTime || !flag) {
                // State has expired or flag is false; redirect to login
                localStorage.removeItem('authState'); // Clean up expired state
                navigate('/');
            } else {
                // Handle valid state here
                // setUsername(username);
                setUserid(user_id);
                // setAuthKey(auth_key);
            }
        } else {
            // No state found; redirect to login
            navigate('/');
        }
    }, [navigate]);

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        // Create a new object for the request payload, excluding searchQuery
        const { searchQuery, ...payload } = formData;

        const isDataChanged = Object.keys(payload).some(key => payload[key] !== initialFormData[key]);

        let {trip_id} = payload

        if (isDataChanged) {
            try {
                // Step 1: Send form data to create the trip
                const response = await fetch(`${apiUrl}/trip/update_trip`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        ...payload, // Spread the payload object without searchQuery
                    }),
                });
        
                if (!response.ok) {
                    throw new Error('Trip creation request failed');
                }
        
                // Parse the response to get the trip_id
                trip_id  = await response.json();
        
                // Check if trip_id is an integer
                if (!Number.isInteger(trip_id)) {
                    throw new Error('Invalid trip_id received from the server');
                }else{
                    setInitialFormData(formData);
                    alert("Trip Successfully Updated")
                }
            } catch (e) {
                console.error('Error submitting form:', e);
            }
        }
        else {
            alert("No New Changes to Update")
        }
    
        try {
            // Step 2: Prepare and send the file upload request
            if (attachments.length > 0) {
                const formDataForUpload = new FormData();
    
                // Append the trip_id to the formData
                formDataForUpload.append('trip_id', trip_id);
                formDataForUpload.append('user_id', user_id);
    
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
                if (Number.isInteger(id)) {
                    fetchExistingFiles();
                    alert("Attachments Successfully Updated")
                }
                else
                    alert("Unsuccessful")
            }
        }
        catch (error) {
            console.error('Error attaching file:', error);
        }
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

    return (
        <div className="trip-details">
            <main className="uc-trips-main">
                <h1 className="trips-title">{formData.trip_name}</h1>
                <form className="trip-form" onSubmit={handleSubmit}>
                    <table className="trip-details-table">
                        <tbody>
                            <tr>
                                <td><strong>From:</strong></td>
                                <td>
                                    {editable ? (
                                        <input
                                            type="text"
                                            name="from_dest"
                                            value={formData.from_dest}
                                            onChange={handleChange}
                                            required
                                        />
                                    ) : (
                                        formData.from_dest
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <td><strong>To:</strong></td>
                                <td>
                                    {editable ? (
                                        <input
                                            type="text"
                                            name="to_dest"
                                            value={formData.to_dest}
                                            onChange={handleChange}
                                            required
                                        />
                                    ) : (
                                        formData.to_dest
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <td><strong>Departure Date:</strong></td>
                                <td>
                                    {editable ? (
                                        <input
                                            type="datetime-local"
                                            name="dept_date"
                                            value={formData.dept_date}
                                            onChange={handleChange}
                                            required
                                        />
                                    ) : (
                                        fromDate
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <td><strong>Arrival Date:</strong></td>
                                <td>
                                    {editable ? (
                                        <input
                                            type="datetime-local"
                                            name="arv_date"
                                            value={formData.arv_date}
                                            onChange={handleChange}
                                            required
                                        />
                                    ) : (
                                        toDate
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <td><strong>Travel Mode:</strong></td>
                                <td>
                                    {editable ? (
                                        <select
                                            name="mode"
                                            value={formData.mode}
                                            onChange={handleChange}
                                        >
                                            <option value="Bus">Bus</option>
                                            <option value="Train">Train</option>
                                            <option value="Flight">Flight</option>
                                            <option value="Others">Others</option>
                                        </select>
                                    ) : (
                                        formData.mode
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <td><strong>Travel With:</strong></td>
                                <td>
                                    {editable ? (
                                        <select
                                            name="trip_with"
                                            value={formData.trip_with}
                                            onChange={handleChange}
                                        >
                                            <option value="Self">Self</option>
                                            <option value="Group">Group</option>
                                            <option value="Behalf">On Behalf Of</option>
                                        </select>
                                    ) : (
                                        formData.trip_with
                                    )}
                                </td>
                            </tr>
                        </tbody>
                    </table>

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
                                editable={editable}
                                handleFileNameChange={handleFileNameChange}
                                handleFileRemove={handleFileRemove}
                            />
                    </div>

                    <button type="submit" className="create-button">Submit</button>
                </form>

                <div className="info-item">
                    <span className="info-label">Attached Files:</span>
                    <div className="existing-files-preview">
                        {loading ? <p>Loading existing files...</p> : 
                            <ExistingFilesList
                                existingFiles={existingFiles}
                                openFile={openFile}
                                handleFileDelete={handleFileDelete}
                                editable={editable}
                            />
                        }
                    </div>
                </div>
            </main>
        </div>
    );
};

export default TripDetails;
