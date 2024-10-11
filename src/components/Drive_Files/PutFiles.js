import { useCallback } from 'react';

const useFileUpload = (apiUrl, fetchExistingFiles) => {
    return useCallback(async (formData) => {
        try {
            const response = await fetch(`${apiUrl}/storage/uploadFile`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('File upload failed');
            }

            await response.json();
            await fetchExistingFiles(); // Fetch existing files after upload
        } catch (e) {
            console.error('Error submitting form:', e);
        }
    }, [apiUrl, fetchExistingFiles]);
};

export default useFileUpload;
