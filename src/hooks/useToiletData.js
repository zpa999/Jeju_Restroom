import { useState, useEffect } from 'react';
import toiletData from '../data/jeju_toilet_v1.json';

const useToiletData = () => {
    const [toilets, setToilets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        try {
            // JSON structure: response.body.items.item
            const items = toiletData?.response?.body?.items?.item;
            if (Array.isArray(items)) {
                setToilets(items);
            } else if (items) {
                // In case it's a single object not an array (though usually it is array)
                setToilets([items]);
            } else {
                setToilets([]);
            }
            setLoading(false);
        } catch (err) {
            console.error("Failed to load toilet data", err);
            setError(err);
            setLoading(false);
        }
    }, []);

    return { toilets, loading, error };
};

export default useToiletData;
