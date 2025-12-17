import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Generate or retrieve session ID
const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem('valid_session_id');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem('valid_session_id', sessionId);
  }
  return sessionId;
};

// Parse user agent for device/browser info
const parseUserAgent = (ua: string) => {
  const isMobile = /Mobile|Android|iPhone|iPad/i.test(ua);
  const isTablet = /iPad|Tablet/i.test(ua);
  
  let deviceType = 'desktop';
  if (isTablet) deviceType = 'tablet';
  else if (isMobile) deviceType = 'mobile';

  let browser = 'unknown';
  if (ua.includes('Chrome') && !ua.includes('Edg')) browser = 'Chrome';
  else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari';
  else if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('Edg')) browser = 'Edge';
  else if (ua.includes('Opera') || ua.includes('OPR')) browser = 'Opera';

  let os = 'unknown';
  if (ua.includes('Windows')) os = 'Windows';
  else if (ua.includes('Mac')) os = 'macOS';
  else if (ua.includes('Linux')) os = 'Linux';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';

  return { deviceType, browser, os };
};

export const usePageViewTracking = (pagePath?: string) => {
  useEffect(() => {
    const trackPageView = async () => {
      try {
        const sessionId = getSessionId();
        const currentPath = pagePath || window.location.pathname;
        const referrer = document.referrer || null;
        const userAgent = navigator.userAgent;
        const { deviceType, browser, os } = parseUserAgent(userAgent);

        // Fetch geo data from free IP API (no API key needed)
        let country = null;
        let city = null;
        let region = null;
        
        try {
          const geoResponse = await fetch('https://ipapi.co/json/', { 
            signal: AbortSignal.timeout(3000) // 3 second timeout
          });
          if (geoResponse.ok) {
            const geoData = await geoResponse.json();
            country = geoData.country_name || null;
            city = geoData.city || null;
            region = geoData.region || null;
          }
        } catch {
          // Geo lookup failed, continue without it
        }

        // Insert page view
        const { error } = await supabase.from('page_views').insert({
          page_path: currentPath,
          referrer,
          user_agent: userAgent,
          session_id: sessionId,
          device_type: deviceType,
          browser,
          os,
          country,
          city,
          region
        });

        // Increment global visitor counter if insert succeeded
        if (!error) {
          await supabase.rpc('increment_global_stat', { 
            stat_name: 'total_visitors',
            increment_by: 1 
          });
        }
      } catch (error) {
        // Silently fail - don't break the app for analytics
        console.error('Page view tracking error:', error);
      }
    };

    trackPageView();
  }, [pagePath]);
};

// Function to get total page view count
export const getPageViewCount = async (): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from('page_views')
      .select('*', { count: 'exact', head: true });
    
    if (error) throw error;
    return count || 0;
  } catch {
    return 0;
  }
};
