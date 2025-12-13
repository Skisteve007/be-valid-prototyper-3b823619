import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { MapPin, Navigation, Ghost, Clock, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

// Detect platform for native map integration
const detectPlatform = () => {
  const userAgent = navigator.userAgent || navigator.vendor;
  if (/iPad|iPhone|iPod/.test(userAgent)) return 'ios';
  if (/android/i.test(userAgent)) return 'android';
  return 'web';
};

// Generate native map URL based on platform
const getNativeMapUrl = (lat: number, lng: number, label?: string) => {
  const platform = detectPlatform();
  const encodedLabel = encodeURIComponent(label || "Shared Location");
  
  switch (platform) {
    case 'ios':
      // Apple Maps URL scheme
      return `maps://maps.apple.com/?ll=${lat},${lng}&q=${encodedLabel}`;
    case 'android':
      // Google Maps intent for Android
      return `geo:${lat},${lng}?q=${lat},${lng}(${encodedLabel})`;
    default:
      // Google Maps web fallback
      return `https://www.google.com/maps?q=${lat},${lng}`;
  }
};

// Get web fallback URL (always Google Maps web)
const getWebMapUrl = (lat: number, lng: number) => {
  return `https://www.google.com/maps?q=${lat},${lng}`;
};

const SharedLocation = () => {
  const { locationId } = useParams();
  const [searchParams] = useSearchParams();
  const [isGhosted, setIsGhosted] = useState(false);
  const [countdown, setCountdown] = useState(2);
  const [mapOpened, setMapOpened] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Parse location data from URL params
  const lat = parseFloat(searchParams.get("lat") || "0");
  const lng = parseFloat(searchParams.get("lng") || "0");
  const label = searchParams.get("label") || "Valid™ Shared Location";
  const ghosted = searchParams.get("ghosted") === "true";
  const fuzzy = searchParams.get("fuzzy") === "true";
  const expiry = searchParams.get("expiry");

  useEffect(() => {
    // Validate location data
    if (!lat || !lng || (lat === 0 && lng === 0)) {
      setError("Invalid or expired location link");
      return;
    }

    // Check if link has expired
    if (expiry && new Date(expiry) < new Date()) {
      setError("This location share has expired");
      return;
    }

    setIsGhosted(ghosted);

    // Immediately try to open native map
    const mapUrl = getNativeMapUrl(lat, lng, label);
    
    // Use a small delay to ensure the page renders first
    const openTimer = setTimeout(() => {
      window.location.href = mapUrl;
      setMapOpened(true);
    }, 100);

    // For ghosted mode, auto-close after 2 seconds
    if (ghosted) {
      const countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            // Close the window/tab after countdown (won't work for all browsers)
            window.close();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        clearTimeout(openTimer);
        clearInterval(countdownInterval);
      };
    }

    return () => clearTimeout(openTimer);
  }, [lat, lng, label, ghosted, expiry]);

  const handleOpenMap = () => {
    const mapUrl = getNativeMapUrl(lat, lng, label);
    window.location.href = mapUrl;
    setMapOpened(true);
  };

  const handleOpenWebMap = () => {
    const webUrl = getWebMapUrl(lat, lng);
    window.open(webUrl, "_blank");
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-sm">
          <div className="w-16 h-16 mx-auto rounded-full bg-red-500/20 flex items-center justify-center">
            <MapPin className="w-8 h-8 text-red-400" />
          </div>
          <h1 className="text-xl font-bold text-foreground">Location Unavailable</h1>
          <p className="text-sm text-muted-foreground">{error}</p>
          <Button
            onClick={() => window.location.href = "https://bevalid.app"}
            variant="outline"
            className="mt-4"
          >
            Go to Valid™
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-sm">
        {/* Icon */}
        <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center ${
          isGhosted 
            ? "bg-purple-500/20 animate-pulse" 
            : "bg-cyan-500/20"
        }`}>
          {isGhosted ? (
            <Ghost className="w-10 h-10 text-purple-400" />
          ) : (
            <Navigation className="w-10 h-10 text-cyan-400" />
          )}
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">
            {isGhosted ? "👻 Ghosted Location" : "📍 Location Shared"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isGhosted 
              ? "Opening in your maps app for 2 seconds..."
              : "Opening location in your maps app..."
            }
          </p>
        </div>

        {/* Ghosted Countdown */}
        {isGhosted && countdown > 0 && (
          <div className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-purple-500/10 border border-purple-400/30">
            <Clock className="w-4 h-4 text-purple-400 animate-pulse" />
            <span className="text-lg font-bold text-purple-400">{countdown}s</span>
            <span className="text-xs text-purple-400/80">until auto-close</span>
          </div>
        )}

        {/* Fuzzy indicator */}
        {fuzzy && (
          <p className="text-xs text-amber-400">
            📍 Approximate location (~100m radius)
          </p>
        )}

        {/* Manual buttons */}
        <div className="space-y-2 pt-4">
          <Button
            onClick={handleOpenMap}
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_15px_rgba(0,240,255,0.3)]"
          >
            <Navigation className="w-4 h-4 mr-2" />
            Open in Maps
          </Button>
          
          <Button
            onClick={handleOpenWebMap}
            variant="outline"
            className="w-full border-border text-muted-foreground hover:text-foreground"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Open in Browser
          </Button>
        </div>

        {/* Valid branding */}
        <div className="pt-6 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Shared via <span className="text-cyan-400 font-semibold">Valid™</span>
          </p>
          <p className="text-[10px] text-muted-foreground/60 mt-1">
            Secure, encrypted location sharing
          </p>
        </div>
      </div>
    </div>
  );
};

export default SharedLocation;