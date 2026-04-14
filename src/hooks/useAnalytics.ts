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
      // 1. Always try to get basic info from IP first (for City/Country names)
      try {
        const res = await fetch('https://ipwho.is/');
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            locationData = {
              country: data.country,
              city: data.city,
              latitude: data.latitude,
              longitude: data.longitude
            };
          }
        } else {
          // Fallback to ipapi.co
          const res2 = await fetch('https://ipapi.co/json/');
          if (res2.ok) {
            const data2 = await res2.json();
            locationData = {
              country: data2.country_name,
              city: data2.city,
              latitude: data2.latitude,
              longitude: data2.longitude
            };
          }
        }
      } catch (e) {
        // Final fallback to ipapi.co if fetch fails
        try {
          const res2 = await fetch('https://ipapi.co/json/');
          if (res2.ok) {
            const data2 = await res2.json();
            locationData = {
              country: data2.country_name,
              city: data2.city,
              latitude: data2.latitude,
              longitude: data2.longitude
            };
          }
        } catch (e2) {
          console.warn('All IP location fetches failed');
        }
      }

      // 2. Try to refine coordinates with GPS if available
      if ("geolocation" in navigator) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 3000 });
          });
          locationData.latitude = position.coords.latitude as any;
          locationData.longitude = position.coords.longitude as any;
        } catch (e) {
          // GPS failed or denied, we still have IP data
        }
      }
      sessionStorage.setItem('location_data', JSON.stringify(locationData));
    }

    const data = {
      created_at: new Date().toISOString(),
      event_name: eventName,
      event_data: {
        ...eventData,
        location_info: {
          country: locationData.country,
          city: locationData.city,
          lat: locationData.latitude,
          lon: locationData.longitude
        }
      },
      latitude: locationData.latitude,
      longitude: locationData.longitude,
      device_type: getDeviceType(),
      os: getOS(),
      path: window.location.pathname,
    };

    if (supabase) {
      // Try full insert first
      const { error } = await supabase.from('analytics_events').insert([data]);
      
      if (error) {
        console.warn('Full event insert failed, trying safe insert:', error.message);
        // Safe insert: remove coordinates in case columns are missing
        const { latitude, longitude, ...safeData } = data;
        const { error: retryError } = await supabase.from('analytics_events').insert([safeData]);
        if (retryError) saveEventToLocal(data);
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
        // Get location data from session storage or fetch it
        let locationData = { country: 'Unknown', city: 'Unknown', latitude: null, longitude: null };
        const cachedLocation = sessionStorage.getItem('location_data');
        
        if (cachedLocation) {
          try {
            locationData = JSON.parse(cachedLocation);
          } catch (e) {}
        } else {
          // 1. Always try to get basic info from IP first (for City/Country names)
          try {
            const res = await fetch('https://ipwho.is/');
            if (res.ok) {
              const data = await res.json();
              if (data.success) {
                locationData = {
                  country: data.country,
                  city: data.city,
                  latitude: data.latitude,
                  longitude: data.longitude
                };
              }
            }
          } catch (e) {
            console.warn('IP location fetch failed');
          }

          // 2. Try to refine coordinates with GPS if available
          if ("geolocation" in navigator) {
            try {
              const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 3000 });
              });
              locationData.latitude = position.coords.latitude as any;
              locationData.longitude = position.coords.longitude as any;
            } catch (e) {
              // GPS failed or denied
            }
          }
          sessionStorage.setItem('location_data', JSON.stringify(locationData));
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
          latitude: locationData.latitude,
          longitude: locationData.longitude,
          device_type: getDeviceType(),
          os: getOS(),
          path: window.location.pathname,
        };

        if (supabase) {
          // Attempt to insert into Supabase
          const { error } = await supabase.from('analytics').insert([visitData]);
          if (error) {
            console.warn('Full visit insert failed, trying safe insert:', error.message);
            // Safe insert: remove coordinates in case columns are missing
            const { latitude, longitude, ...safeData } = visitData;
            const { error: retryError } = await supabase.from('analytics').insert([safeData]);
            if (retryError) saveToLocal(visitData);
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
