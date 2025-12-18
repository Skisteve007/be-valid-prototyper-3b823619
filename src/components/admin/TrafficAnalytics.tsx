import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Globe, MapPin, Monitor, Smartphone, Tablet, TrendingUp, Users, Clock, Bot, UserCheck } from 'lucide-react';

interface PageView {
  id: string;
  created_at: string;
  page_path: string;
  referrer: string | null;
  country: string | null;
  city: string | null;
  region: string | null;
  device_type: string | null;
  browser: string | null;
  os: string | null;
  session_id: string | null;
}

interface AnalyticsSummary {
  totalViews: number;
  uniqueSessions: number;
  todayViews: number;
  realHumans: number;
  botsServers: number;
  realHumanCities: { name: string; count: number }[];
  countries: { name: string; count: number }[];
  cities: { name: string; count: number }[];
  devices: { type: string; count: number }[];
  browsers: { name: string; count: number }[];
  topPages: { path: string; count: number }[];
  topReferrers: { source: string; count: number }[];
}

// Detect if a page view is likely from a bot/server vs real human
const isLikelyBot = (view: PageView): boolean => {
  const referrer = view.referrer || '';
  
  // Known infrastructure/bot patterns
  const botPatterns = [
    'lovableproject.com',
    'vercel.com',
    'netlify.com',
    '__lovable_token',
  ];
  
  // If referrer contains bot patterns = bot
  if (botPatterns.some(pattern => referrer.includes(pattern))) {
    return true;
  }
  
  // No referrer AND from known cloud infrastructure locations = likely bot
  // (Amsterdam, Ashburn, Dublin, Frankfurt, Singapore are common data center cities)
  const dataCenterCities = ['Amsterdam', 'Ashburn', 'Dublin', 'Frankfurt', 'Singapore', 'Hounslow', 'Aulnay-sous-Bois'];
  if (!view.referrer && view.city && dataCenterCities.includes(view.city)) {
    return true;
  }
  
  // Has real external referrer = human
  if (referrer && !botPatterns.some(pattern => referrer.includes(pattern))) {
    return false;
  }
  
  // No referrer = could be direct traffic or bot, mark as bot for safety
  if (!view.referrer) {
    return true;
  }
  
  return false;
};

const TrafficAnalytics: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [recentViews, setRecentViews] = useState<PageView[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
    
    // Subscribe to realtime updates
    const channel = supabase
      .channel('page_views_realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'page_views' },
        () => {
          fetchAnalytics();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchAnalytics = async () => {
    try {
      const { data: views, error } = await supabase
        .from('page_views')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const pageViews = views as PageView[];
      
      // Separate real humans from bots/servers
      const humanViews = pageViews.filter(v => !isLikelyBot(v));
      const botViews = pageViews.filter(v => isLikelyBot(v));
      
      // Calculate today's views
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayViews = pageViews.filter(v => new Date(v.created_at) >= today).length;

      // Unique sessions
      const uniqueSessions = new Set(pageViews.map(v => v.session_id).filter(Boolean)).size;

      // Country breakdown
      const countryMap = new Map<string, number>();
      pageViews.forEach(v => {
        if (v.country) {
          countryMap.set(v.country, (countryMap.get(v.country) || 0) + 1);
        }
      });
      const countries = Array.from(countryMap.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      // City breakdown (all traffic)
      const cityMap = new Map<string, number>();
      pageViews.forEach(v => {
        if (v.city) {
          const cityLabel = v.region ? `${v.city}, ${v.region}` : v.city;
          cityMap.set(cityLabel, (cityMap.get(cityLabel) || 0) + 1);
        }
      });
      const cities = Array.from(cityMap.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      // Real human cities only (for advertising focus)
      const realHumanCityMap = new Map<string, number>();
      humanViews.forEach(v => {
        if (v.city) {
          const cityLabel = v.region ? `${v.city}, ${v.region}` : v.city;
          realHumanCityMap.set(cityLabel, (realHumanCityMap.get(cityLabel) || 0) + 1);
        }
      });
      const realHumanCities = Array.from(realHumanCityMap.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      // Device breakdown
      const deviceMap = new Map<string, number>();
      pageViews.forEach(v => {
        if (v.device_type) {
          deviceMap.set(v.device_type, (deviceMap.get(v.device_type) || 0) + 1);
        }
      });
      const devices = Array.from(deviceMap.entries())
        .map(([type, count]) => ({ type, count }))
        .sort((a, b) => b.count - a.count);

      // Browser breakdown
      const browserMap = new Map<string, number>();
      pageViews.forEach(v => {
        if (v.browser) {
          browserMap.set(v.browser, (browserMap.get(v.browser) || 0) + 1);
        }
      });
      const browsers = Array.from(browserMap.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);

      // Top pages
      const pageMap = new Map<string, number>();
      pageViews.forEach(v => {
        pageMap.set(v.page_path, (pageMap.get(v.page_path) || 0) + 1);
      });
      const topPages = Array.from(pageMap.entries())
        .map(([path, count]) => ({ path, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      // Top referrers
      const referrerMap = new Map<string, number>();
      pageViews.forEach(v => {
        if (v.referrer) {
          try {
            const url = new URL(v.referrer);
            const source = url.hostname;
            referrerMap.set(source, (referrerMap.get(source) || 0) + 1);
          } catch {
            referrerMap.set(v.referrer, (referrerMap.get(v.referrer) || 0) + 1);
          }
        }
      });
      const topReferrers = Array.from(referrerMap.entries())
        .map(([source, count]) => ({ source, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      setAnalytics({
        totalViews: pageViews.length,
        uniqueSessions,
        todayViews,
        realHumans: humanViews.length,
        botsServers: botViews.length,
        realHumanCities,
        countries,
        cities,
        devices,
        browsers,
        topPages,
        topReferrers
      });

      setRecentViews(pageViews.slice(0, 20));
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'mobile': return <Smartphone className="w-4 h-4" />;
      case 'tablet': return <Tablet className="w-4 h-4" />;
      default: return <Monitor className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-400">
        Loading analytics...
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="p-6 text-center text-gray-400">
        No analytics data available yet.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Real Humans vs Bots - TOP PRIORITY */}
      <Card className="bg-gradient-to-r from-emerald-900/60 via-black/40 to-red-900/40 border-emerald-500/40">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-white flex items-center gap-2">
            🎯 Traffic Quality (Advertise Here)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/30">
              <div className="flex items-center gap-3 mb-2">
                <UserCheck className="w-6 h-6 text-emerald-400" />
                <span className="text-emerald-400 font-semibold">Real Humans</span>
              </div>
              <p className="text-3xl font-bold text-white">{analytics.realHumans.toLocaleString()}</p>
              <p className="text-xs text-emerald-300/70 mt-1">Visitors with referrer source</p>
            </div>
            <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/30">
              <div className="flex items-center gap-3 mb-2">
                <Bot className="w-6 h-6 text-red-400" />
                <span className="text-red-400 font-semibold">Bots & Servers</span>
              </div>
              <p className="text-3xl font-bold text-white">{analytics.botsServers.toLocaleString()}</p>
              <p className="text-xs text-red-300/70 mt-1">Build servers, crawlers, CDN</p>
            </div>
          </div>
          
          {/* Real Human Cities - Where to Advertise */}
          {analytics.realHumanCities.length > 0 && (
            <div className="mt-4 p-4 bg-emerald-500/5 rounded-lg border border-emerald-500/20">
              <p className="text-sm font-semibold text-emerald-400 mb-2">📍 Real Human Locations (Advertise Here)</p>
              <div className="flex flex-wrap gap-2">
                {analytics.realHumanCities.map(city => (
                  <Badge 
                    key={city.name} 
                    className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  >
                    {city.name} ({city.count})
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-cyan-900/40 to-cyan-800/20 border-cyan-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-500/20 rounded-lg">
                <TrendingUp className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{analytics.totalViews.toLocaleString()}</p>
                <p className="text-xs text-gray-400">Total Page Views</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-900/40 to-green-800/20 border-green-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Users className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{analytics.uniqueSessions.toLocaleString()}</p>
                <p className="text-xs text-gray-400">Unique Sessions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 border-purple-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Clock className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{analytics.todayViews.toLocaleString()}</p>
                <p className="text-xs text-gray-400">Today's Views</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-900/40 to-orange-800/20 border-orange-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <Globe className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{analytics.countries.length}</p>
                <p className="text-xs text-gray-400">Countries Reached</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Geographic Data */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-black/40 border-cyan-500/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-white">
              <Globe className="w-5 h-5 text-cyan-400" />
              Top Countries
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analytics.countries.length > 0 ? (
              <div className="space-y-2">
                {analytics.countries.map((country, i) => (
                  <div key={country.name} className="flex items-center justify-between">
                    <span className="text-gray-300">{i + 1}. {country.name}</span>
                    <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-400">
                      {country.count}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No country data yet</p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-white">
              <MapPin className="w-5 h-5 text-purple-400" />
              Top Cities
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analytics.cities.length > 0 ? (
              <div className="space-y-2">
                {analytics.cities.map((city, i) => (
                  <div key={city.name} className="flex items-center justify-between">
                    <span className="text-gray-300 truncate">{i + 1}. {city.name}</span>
                    <Badge variant="secondary" className="bg-purple-500/20 text-purple-400">
                      {city.count}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No city data yet</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Device & Browser */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-black/40 border-green-500/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-white">
              <Monitor className="w-5 h-5 text-green-400" />
              Devices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.devices.map(device => (
                <div key={device.type} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-300">
                    {getDeviceIcon(device.type)}
                    <span className="capitalize">{device.type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: `${(device.count / analytics.totalViews) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-400 w-12 text-right">
                      {Math.round((device.count / analytics.totalViews) * 100)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-orange-500/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-white">
              <Globe className="w-5 h-5 text-orange-400" />
              Browsers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.browsers.map(browser => (
                <div key={browser.name} className="flex items-center justify-between">
                  <span className="text-gray-300">{browser.name}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-orange-500 rounded-full"
                        style={{ width: `${(browser.count / analytics.totalViews) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-400 w-12 text-right">
                      {Math.round((browser.count / analytics.totalViews) * 100)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Traffic Sources & Top Pages */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-black/40 border-cyan-500/20">
          <CardHeader>
            <CardTitle className="text-lg text-white">Top Pages</CardTitle>
          </CardHeader>
          <CardContent>
            {analytics.topPages.length > 0 ? (
              <div className="space-y-2">
                {analytics.topPages.map((page, i) => (
                  <div key={page.path} className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm truncate max-w-[200px]">{page.path}</span>
                    <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-400">
                      {page.count}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No page data yet</p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-green-500/20">
          <CardHeader>
            <CardTitle className="text-lg text-white">Traffic Sources</CardTitle>
          </CardHeader>
          <CardContent>
            {analytics.topReferrers.length > 0 ? (
              <div className="space-y-2">
                {analytics.topReferrers.map((ref, i) => (
                  <div key={ref.source} className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm truncate max-w-[200px]">{ref.source}</span>
                    <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                      {ref.count}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No referrer data yet (direct traffic)</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="bg-black/40 border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg text-white">Recent Visitors (Live)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {recentViews.map(view => {
              const isBot = isLikelyBot(view);
              return (
                <div 
                  key={view.id} 
                  className={`flex items-center justify-between p-2 rounded text-sm ${
                    isBot ? 'bg-red-900/20 border border-red-500/20' : 'bg-emerald-900/20 border border-emerald-500/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {isBot ? (
                      <Bot className="w-4 h-4 text-red-400" />
                    ) : (
                      <UserCheck className="w-4 h-4 text-emerald-400" />
                    )}
                    {getDeviceIcon(view.device_type || 'desktop')}
                    <div>
                      <span className="text-gray-300">{view.page_path}</span>
                      {view.city && view.country && (
                        <span className="text-gray-500 ml-2">
                          from {view.city}, {view.country}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={isBot ? 'bg-red-500/20 text-red-400 text-xs' : 'bg-emerald-500/20 text-emerald-400 text-xs'}>
                      {isBot ? 'Bot' : 'Human'}
                    </Badge>
                    <span className="text-gray-500 text-xs">
                      {new Date(view.created_at).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrafficAnalytics;
