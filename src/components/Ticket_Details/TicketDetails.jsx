import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './TicketDetails.css'; // Ensure this file is updated with the new styles

const TicketDetails = ({ ticket, onClose, onStatusChange, editable=true }) => {
    const apiUrl = process.env.REACT_APP_API_URL;
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
    if (!storedState) navigate('/');
    const { user_id } = JSON.parse(storedState);

    const fetchExistingFiles = React.useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch(`${apiUrl}/storage/readFiles`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ticket_id: ticket.ticket_id,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch existing files');
            }

            const data = await response.json();
            setExistingFiles(data);

        } catch (e) {
            console.error('Error fetching existing files:', e);
        } finally {
            setLoading(false);
        }
    }, [apiUrl, ticket.ticket_id]);

    useEffect(() => {
        fetchExistingFiles();
    }, [fetchExistingFiles]);

    const handleFileDelete = async (docId, fileId) => {
        try {
            const response = await fetch(`${apiUrl}/storage/deleteFile`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    doc_id: docId,
                    link: fileId
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to delete file');
            }

            setExistingFiles(prevFiles => prevFiles.filter(file => file.doc_id !== docId));
        } catch (e) {
            console.error('Error deleting file:', e);
        }
    };

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

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        const allowedTypes = ['image/png', 'image/jpeg', 'application/pdf'];
        const validFiles = [];
        const invalidFiles = [];

        files.forEach(file => {
            if (allowedTypes.includes(file.type)) {
                validFiles.push(file);
            } else {
                invalidFiles.push(file);
            }
        });

        if (invalidFiles.length > 0) {
            setError('Some files were not added because they are not in PNG, JPEG, JPG, or PDF format.');
        } else {
            setError('');
        }

        setAttachments(prevAttachments => [
            ...prevAttachments, 
            ...validFiles
        ]);

        setFileNames(prevFileNames => [
            ...prevFileNames, 
            ...validFiles.map(file => trimExtension(file.name))
        ]);
    };

    const handleFileNameChange = (index, event) => {
        const newFileNames = [...fileNames];
        newFileNames[index] = event.target.value;
        setFileNames(newFileNames);
    };

    const handleFileRemove = (index) => {
        setAttachments(prevAttachments => 
            prevAttachments.filter((_, i) => i !== index)
        );
        setFileNames(prevFileNames => 
            prevFileNames.filter((_, i) => i !== index)
        );
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();

        formData.append('user_id', user_id);
        formData.append('ticket_id', ticket.ticket_id);

        attachments.forEach((file, index) => {
            formData.append('files', file, `${fileNames[index] || trimExtension(file.name)}.${file.name.split('.').pop()}`);
        });

        try {
            const response = await fetch(`${apiUrl}/storage/uploadFile`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('File upload failed');
            }

            await response.json();
            setAttachments([]);
            setFileNames([]);

            await fetchExistingFiles();

        } catch (e) {
            console.error('Error submitting form:', e);
        }
    };

    const trimExtension = (filename) => {
        const lastDotIndex = filename.lastIndexOf('.');
        return lastDotIndex !== -1 ? filename.substring(0, lastDotIndex) : filename;
    };

    const renderAttachmentsPreview = () => {
        return attachments.map((file, index) => {
            const fileURL = URL.createObjectURL(file);
            const originalName = file.name;
            const baseName = trimExtension(originalName);
            const extension = originalName.split('.').pop();
            const displayName = fileNames[index] || baseName;
            const displayNameWithExtension = extension ? `${displayName}.${extension}` : displayName;

            return (
                <div key={index} className="attachment-preview">
                    <a href={fileURL} target="_blank" rel="noopener noreferrer">
                        <span>{displayNameWithExtension}</span>
                    </a>
                    {editable && (
                        <>
                            <input
                                type="text"
                                value={fileNames[index] || baseName}
                                placeholder="Rename File"
                                onChange={(e) => handleFileNameChange(index, e)}
                                onMouseOver={(e) => e.currentTarget.setAttribute('title', 'Do not add extension to filename')}
                            />
                            <span 
                                className="attachment-delete-icon"
                                title="Close"
                                onClick={() => handleFileRemove(index)}
                            >
                                ✘
                            </span>
                        </>
                    )}
                </div>
            );
        });
    };

    const openFile = async (fileId, fileExtension) => {
        try {
            const file = existingFiles.find(f => f.doc_id === fileId);

            if (file && file.content) {
                const base64Data = file.content;
                const mimeType = fileExtension === 'pdf' ? 'application/pdf' :
                                fileExtension === 'png' ? 'image/png' :
                                fileExtension === 'jpeg' || fileExtension === 'jpg' ? 'image/jpeg' :
                                'application/octet-stream';

                if (fileExtension === 'pdf') {
                    const byteCharacters = atob(base64Data);
                    const byteNumbers = new Array(byteCharacters.length);
                    for (let i = 0; i < byteCharacters.length; i++) {
                        byteNumbers[i] = byteCharacters.charCodeAt(i);
                    }
                    const byteArray = new Uint8Array(byteNumbers);
                    const blob = new Blob([byteArray], { type: mimeType });

                    const url = URL.createObjectURL(blob);
                    const newTab = window.open();
                    newTab.location.href = url;

                    newTab.onload = () => URL.revokeObjectURL(url);
                } else {
                    const dataUri = `data:${mimeType};base64,${base64Data}`;
                    const newTab = window.open();
                    newTab.document.open();
                    newTab.document.write(`<html>
                    <head>
                        <style>
                            body {
                                margin: 0;
                                padding: 0;
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                height: 100vh;
                                background-color: #f0f0f0;
                                overflow: hidden;
                            }
                            img {
                                max-width: 100%;
                                max-height: 100%;
                                display: block;
                                margin: auto;
                                object-fit: contain;
                            }
                        </style>
                    </head>
                    <body>
                        <img src="${dataUri}" />
                    </body>
                    </html>
                `);
                    newTab.document.close();
                }
            }
        } catch (error) {
            console.error('Error opening file:', error);
        }
    };

    const renderExistingFiles = () => {
        if (existingFiles && existingFiles.length > 0) {
            return existingFiles.map((file, index) => {
                const extension = file.doc_name.split('.').pop().toLowerCase();
                return (
                    <div key={index} className="existing-file-item">
                        <span onClick={() => openFile(file.doc_id, extension)}>{file.doc_name}</span>
                        {editable && (
                            <span
                                className="existing-file-delete-icon"
                                title="Delete"
                                onClick={() => handleFileDelete(file.doc_id, file.file_id)}>
                                ✘
                            </span>
                        )}
                    </div>
                );
            });
        } else {
            return <p>No Files Attached</p>;
        }
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
                            <div className="attachments-preview">
                                {renderAttachmentsPreview()}
                            </div>
                        </div>
                    )}

                    <div className="info-item">
                        <span className="info-label">Attached Files:</span>
                        <div className="existing-files-preview">
                            {loading ? <p>Loading existing files...</p> : renderExistingFiles()}
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
