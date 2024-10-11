import React from 'react';

const ExistingFilesList = ({ existingFiles, openFile, handleFileDelete, editable }) => {
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

    return (
        <>
            {renderExistingFiles()}
        </>
    );
};

export default ExistingFilesList;
