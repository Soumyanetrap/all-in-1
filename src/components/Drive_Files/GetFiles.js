import { useCallback } from 'react';

const useFetchExistingFiles = (apiUrl, setLoading, setExistingFiles, ticket_id=null, trip_id=null) => {
    return useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch(`${apiUrl}/storage/readFiles`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify((ticket_id)?{ticket_id: ticket_id}:{trip_id: trip_id}),
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
    }, [apiUrl, ticket_id, trip_id, setLoading, setExistingFiles]);
};

export default useFetchExistingFiles;