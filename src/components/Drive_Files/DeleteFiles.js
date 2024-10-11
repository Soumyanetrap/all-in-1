import { useCallback } from 'react';

const useFileDelete = (apiUrl, setExistingFiles) => {
    return useCallback(async (docId, fileId) => {
        try {
            const response = await fetch(`${apiUrl}/storage/deleteFile`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    doc_id: docId,
                    link: fileId,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to delete file');
            }

            setExistingFiles(prevFiles => prevFiles.filter(file => file.doc_id !== docId));
        } catch (e) {
            console.error('Error deleting file:', e);
        }
    }, [apiUrl, setExistingFiles]);
};

export default useFileDelete;
