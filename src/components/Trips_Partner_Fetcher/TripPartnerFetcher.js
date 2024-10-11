import { useCallback } from 'react';
const useTravelPartnersFetcher = (apiUrl, userId, setTravellers) => {
    return useCallback(async (goto) => {
        try {
            const response = await fetch(`${apiUrl}/${goto}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_id: userId }),
            });
            const data = await response.json();
            setTravellers(data);
        } catch (error) {
            console.error('Failed to fetch travel partners:', error);
        }
    }, [apiUrl, userId, setTravellers]);
};

export default useTravelPartnersFetcher;
