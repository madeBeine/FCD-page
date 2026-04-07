import { useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const trackEvent = async (eventName: string, eventData: any = {}) => {
  try {
    const ua = navigator.userAgent;
    const getDeviceType = () => {
      if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) return 'Tablet';
      if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) return 'Mobile';
      return 'Desktop';
    };
    
    const getOS = () => {
      if (ua.includes('Win')) return 'Windows';
      if (ua.includes('Mac')) return 'macOS';
      if (ua.includes('Linux')) return 'Linux';
      if (ua.includes('Android')) return 'Android';
      if (ua.includes('like Mac')) return 'iOS';
      return 'Unknown';
    };

    // Get location data from session storage or fetch it
    let locationData = { country: 'Unknown', city: 'Unknown', latitude: null, longitude: null };
    const cachedLocation = sessionStorage.getItem('location_data');
    
    if (cachedLocation) {
      try {
        locationData = JSON.parse(cachedLocation);
      } catch (e) {}
    } else {
      try {
        const res = await fetch('https://ipwho.is/');
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            locationData = data;
            sessionStorage.setItem('location_data', JSON.stringify(locationData));
          }
        }
      } catch (e) {
        console.warn('Could not fetch location data for event');
      }
    }

    const data = {
      created_at: new Date().toISOString(),
      event_name: eventName,
      event_data: {
        ...eventData,
        location: {
          country: locationData.country || 'Unknown',
          city: locationData.city || 'Unknown',
          lat: locationData.latitude,
          lon: locationData.longitude
        }
      },
      device_type: getDeviceType(),
      os: getOS(),
      path: window.location.pathname,
    };

    if (supabase) {
      const { error } = await supabase.from('analytics_events').insert([data]);
      if (error) {
        saveEventToLocal(data);
      }
    } else {
      saveEventToLocal(data);
    }
  } catch (error) {
    console.error('Event tracking failed:', error);
  }
};

const saveEventToLocal = (data: any) => {
  const existing = JSON.parse(localStorage.getItem('mock_analytics_events') || '[]');
  existing.push({ ...data, id: Date.now().toString() });
  localStorage.setItem('mock_analytics_events', JSON.stringify(existing));
};

export const useAnalytics = () => {
  useEffect(() => {
    const trackVisit = async () => {
      // Only track once per session to avoid spamming
      if (sessionStorage.getItem('visit_tracked')) return;
      
      try {
        // Fetch location data from a free IP API
        let locationData = { country: 'Unknown', city: 'Unknown', latitude: null, longitude: null };
        const cachedLocation = sessionStorage.getItem('location_data');
        
        if (cachedLocation) {
          try {
            locationData = JSON.parse(cachedLocation);
          } catch (e) {}
        } else {
          try {
            const res = await fetch('https://ipwho.is/');
            if (res.ok) {
              const data = await res.json();
              if (data.success) {
                locationData = data;
                sessionStorage.setItem('location_data', JSON.stringify(locationData));
              }
            }
          } catch (e) {
            console.warn('Could not fetch location data');
          }
        }

        const ua = navigator.userAgent;
        const getDeviceType = () => {
          if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) return 'Tablet';
          if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) return 'Mobile';
          return 'Desktop';
        };
        
        const getOS = () => {
          if (ua.includes('Win')) return 'Windows';
          if (ua.includes('Mac')) return 'macOS';
          if (ua.includes('Linux')) return 'Linux';
          if (ua.includes('Android')) return 'Android';
          if (ua.includes('like Mac')) return 'iOS';
          return 'Unknown';
        };

        const visitData = {
          created_at: new Date().toISOString(),
          country: locationData.country || 'Unknown',
          city: locationData.city || 'Unknown',
          device_type: getDeviceType(),
          os: getOS(),
          path: window.location.pathname,
        };

        if (supabase) {
          // Attempt to insert into Supabase
          const { error } = await supabase.from('analytics').insert([visitData]);
          if (error) {
            // If table doesn't exist, fallback to local storage
            saveToLocal(visitData);
          }
        } else {
          // Fallback to local storage for demo purposes if Supabase is not configured
          saveToLocal(visitData);
        }

        sessionStorage.setItem('visit_tracked', 'true');
      } catch (error) {
        console.error('Analytics tracking failed:', error);
      }
    };

    const saveToLocal = (data: any) => {
      const existing = JSON.parse(localStorage.getItem('mock_analytics') || '[]');
      existing.push({ ...data, id: Date.now().toString() });
      localStorage.setItem('mock_analytics', JSON.stringify(existing));
    };

    // Small delay to ensure it doesn't block main render
    setTimeout(trackVisit, 2000);
  }, []);
};
