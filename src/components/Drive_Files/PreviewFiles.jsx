import React from 'react';

const AttachmentsPreview = ({ attachments, fileNames, editable, handleFileNameChange, handleFileRemove }) => {
    const renderAttachmentsPreview = () => {
        return attachments.map((file, index) => {
            const fileURL = URL.createObjectURL(file);
            const originalName = file.name;
            const baseName = originalName.replace(/\.[^/.]+$/, ""); // Trim extension
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

    return (
        <div className="attachments-preview">
            {renderAttachmentsPreview()}
        </div>
    );
};

export default AttachmentsPreview;
