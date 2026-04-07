import { useCallback } from 'react';
import api from '../services/userService';
import { useAuth } from '../context/AuthContext';

const useAnalytics = () => {
    const { user } = useAuth();

    const trackEvent = useCallback(async (eventType, metadata = {}) => {
        try {
            await api.post('/analytics/track', {
                userId: user?.id || null,
                eventType,
                platform: 'WEB',
                deviceInfo: navigator.userAgent,
                location: 'Browser', // Could use geo-location if available
                metadata: JSON.stringify(metadata)
            });
        } catch (error) {
            // Silently fail for analytics to not disturb user flow
            console.warn('Analytics tracking failed', error);
        }
    }, [user?.id]);

    return { trackEvent };
};

export default useAnalytics;
