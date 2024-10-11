import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useFetchExistingFiles from '../Drive_Files/GetFiles'
import useFileUpload from '../Drive_Files/PutFiles'
import useOpenFile from '../Drive_Files/OpenFiles'
import useFileDelete from '../Drive_Files/DeleteFiles'
import useFileHandler from '../Drive_Files/HandleFiles'
import ExistingFilesList from '../Drive_Files/RenderFiles'
import './TicketDetails.css'; // Ensure this file is updated with the new styles
import AttachmentsPreview from '../Drive_Files/PreviewFiles';
import {REACT_APP_API_URL} from '../../config'


const TicketDetails = ({ ticket, onClose, onStatusChange, editable=true }) => {
    const apiUrl = REACT_APP_API_URL;
    const navigate = useNavigate();
    const [status, setStatus] = useState(ticket.status);
    const [priority, setPriority] = useState(ticket.priority);
    const [remarks, setRemarks] = useState(ticket.remarks || ''); // Initialize with existing remarks
    const [attachments, setAttachments] = useState([]);
    const [fileNames, setFileNames] = useState([]);
    const [error, setError] = useState('');
    const [existingFiles, setExistingFiles] = useState([]);
    const [loading, setLoading] = useState(true);

    const storedState = localStorage.getItem('authState');
    if (!storedState) {navigate('/')};
    const { user_id } = JSON.parse(storedState);

    const fetchExistingFiles = useFetchExistingFiles(apiUrl, setLoading, setExistingFiles, ticket.ticket_id, null);
    const uploadFiles = useFileUpload(apiUrl, fetchExistingFiles);
    const openFile = useOpenFile(existingFiles);
    const handleFileDelete = useFileDelete(apiUrl, setExistingFiles);

    useEffect(() => {
        fetchExistingFiles();
    }, [fetchExistingFiles]);

    const handleStatusChange = (newStatus) => {
        setStatus(newStatus);
        const allUpdates = {
            status: newStatus,
            priority: priority,
            remarks: remarks
        };
        onStatusChange(ticket.ticket_id, allUpdates);
    };

    const handlePriorityChange = (event) => {
        setPriority(event.target.value);
    };

    const handleRemarksChange = (event) => {
        setRemarks(event.target.value);
    };

    const {
        trimExtension,
        handleFileChange,
        handleFileNameChange,
        handleFileRemove,
    } = useFileHandler(fileNames, setAttachments, setFileNames, setError);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();

        formData.append('user_id', user_id);
        formData.append('ticket_id', ticket.ticket_id);

        attachments.forEach((file, index) => {
            formData.append('files', file, `${fileNames[index] || trimExtension(file.name)}.${file.name.split('.').pop()}`);
        });

        await uploadFiles(formData);
    };

    const hasUnsavedFiles = attachments.length > 0;

    return (
        <div className="ticket-details-container">
            <div className="ticket-details-card">
                <span
                    className="cross-icon"
                    title="Close"
                    onClick={onClose}
                >
                    ✘
                </span>
                <h2 className="ticket-title">Ticket Details</h2>
                <div className="ticket-info">
                    <div className="info-row">
                        <div className="info-item">
                            <span className="info-label">Domain:</span>
                            <span className="info-value">{ticket.domain}</span>
                        </div>
                        {editable? (
                            <div className="info-item">
                                <span className="info-label">Priority:</span>
                                <select
                                    className="priority-dropdown"
                                    value={priority}
                                    onChange={handlePriorityChange}
                                >
                                    <option value="Low">LOW</option>
                                    <option value="Medium">MEDIUM</option>
                                    <option value="High">HIGH</option>
                                    <option value="Emergency">EMERGENCY</option>
                                </select>
                            </div>
                        ) : (
                            <div className="info-item">
                                <span className="info-label">Priority:</span>
                                <p>{priority}</p>
                            </div>
                        )}
                    </div>
                    <div className="info-row">
                        <div className="info-item">
                            <span className="info-label">Raised By:</span>
                            <span className="info-value">{ticket.username}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Raised On:</span>
                            <span className="info-value">{new Date(ticket.raised_on).toLocaleString()}</span>
                        </div>
                    </div>
                    <div className="info-row">
                        <div className="info-item">
                            <span className="info-label">Status:</span>
                            <span className="info-value">{status}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Subject:</span>
                            <span className="info-value">{ticket.subject}</span>
                        </div>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Description:</span>
                        <p className="info-value">{ticket.description}</p>
                    </div>
                    {(editable || ticket.remarks) && (
                        <div className="info-item">
                            <span className="info-label">Remarks:</span>
                            {editable ? (
                                <textarea
                                    className="remarks-textarea"
                                    value={remarks}
                                    onChange={handleRemarksChange}
                                    placeholder="Add remarks here..."
                                />
                            ) : (
                                <p className="info-value">{ticket.remarks}</p>
                            )}
                        </div>
                    )}
                    {editable && (
                        <div className="info-item">
                            <span className="info-label">Attachments:</span>
                            <form onSubmit={handleSubmit}>
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
                                {hasUnsavedFiles && (
                                    <button type="submit">Save Attachments</button>
                                )}
                            </form>
                            {error && <p className="error-message">{error}</p>}
                            <AttachmentsPreview 
                                attachments={attachments}
                                fileNames={fileNames}
                                editable={editable}
                                handleFileNameChange={handleFileNameChange}
                                handleFileRemove={handleFileRemove}
                            />
                        </div>
                    )}

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

                    {editable && (
                        <div className="button-group">
                            <button
                                className="change-status-button in-progress-button"
                                onClick={() => handleStatusChange('In Progress')}
                            >
                                Mark as In Progress
                            </button>
                            <button
                                className="change-status-button resolved-button"
                                onClick={() => handleStatusChange('Resolved')}
                            >
                                Mark as Resolved
                            </button>
                            <button
                                className="change-status-button declined-button"
                                onClick={() => handleStatusChange('Declined')}
                            >
                                Mark as Declined
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TicketDetails;
