import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { MapPin, Clock, MapPinOff, Navigation, Share2, Check, Ghost, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";

// Live location durations
const LOCATION_DURATIONS = [
  { value: "15", label: "15 Minutes" },
  { value: "60", label: "1 Hour" },
  { value: "360", label: "6 Hours" },
  { value: "720", label: "12 Hours" },
  { value: "0.033", label: "Two second ghosted. Ha ha ha.", sublabel: "2 sec ghosted", isGhosted: true },
];

// Static location durations (1-hour intervals only)
const STATIC_DURATIONS = [
  { value: "60", label: "1 Hour" },
  { value: "120", label: "2 Hours" },
  { value: "180", label: "3 Hours" },
  { value: "240", label: "4 Hours" },
];

type LocationType = "live" | "static" | null;

// Generate fuzzy offset (50-100 meters) for approximate location
const generateFuzzyOffset = () => {
  const offset = 50 + Math.random() * 50;
  const angle = Math.random() * 2 * Math.PI;
  const latOffset = (offset / 111320) * Math.cos(angle);
  const lngOffset = (offset / (111320 * Math.cos(0))) * Math.sin(angle);
  return { latOffset, lngOffset };
};

// Detect platform for native map integration
const detectPlatform = () => {
  const userAgent = navigator.userAgent || navigator.vendor;
  if (/iPad|iPhone|iPod/.test(userAgent)) return 'ios';
  if (/android/i.test(userAgent)) return 'android';
  return 'web';
};

interface LocationPulseSectionProps {
  onLocationChange?: (locationData: Record<string, any> | null) => void;
}

const LocationPulseSection = ({ onLocationChange }: LocationPulseSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [locationType, setLocationType] = useState<LocationType>(null);
  const [locationDuration, setLocationDuration] = useState<string | null>(null);
  const [locationActive, setLocationActive] = useState(false);
  const [locationExpiry, setLocationExpiry] = useState<Date | null>(null);
  const [fuzzyLocation, setFuzzyLocation] = useState(false);
  const [staticAddress, setStaticAddress] = useState("");
  const [staticDuration, setStaticDuration] = useState<string | null>(null);
  const [localMetadata, setLocalMetadata] = useState<Record<string, any>>({});

  const activateLocationShare = () => {
    if (locationType === "live" && !locationDuration) return;
    if (locationType === "static" && (!staticAddress || !staticDuration)) return;
    
    const durationMinutes = locationType === "live" 
      ? parseFloat(locationDuration!) 
      : parseInt(staticDuration!);
    const expiry = new Date(Date.now() + durationMinutes * 60 * 1000);
    const isGhostedMode = locationDuration === "0.033";
    
    const fuzzyOffset = fuzzyLocation ? generateFuzzyOffset() : null;
    
    const locationToken = {
      type: locationType,
      duration: durationMinutes,
      expiry: expiry.toISOString(),
      fuzzy: fuzzyLocation,
      fuzzyOffset: fuzzyOffset,
      isGhosted: isGhostedMode,
      peakDuration: isGhostedMode ? 2000 : null,
      staticAddress: locationType === "static" ? staticAddress : null,
      platform: detectPlatform(),
      encrypted: true,
      timestamp: Date.now()
    };
    
    setLocationExpiry(expiry);
    setLocationActive(true);
    
    const newMetadata = { 
      mode: "location",
      location_type: locationType,
      location_duration: durationMinutes,
      location_expiry: expiry.toISOString(),
      fuzzy_location: fuzzyLocation,
      fuzzy_offset: fuzzyOffset,
      is_ghosted: isGhostedMode,
      peak_duration: isGhostedMode ? 2000 : null,
      static_address: locationType === "static" ? staticAddress : null,
      location_token: locationToken,
      qr_embedded: true
    };
    setLocalMetadata(newMetadata);
    onLocationChange?.(newMetadata);
    
    toast.success(
      isGhostedMode 
        ? "👻 Ghosted mode activated - 2 second peak view embedded in QR"
        : locationType === "live" 
          ? `Live location embedded in QR for ${durationMinutes} minutes`
          : `Static location embedded in QR for ${durationMinutes / 60} hour(s)`
    );
  };

  const deactivateLocationShare = () => {
    setLocationActive(false);
    setLocationExpiry(null);
    setLocationDuration(null);
    setLocationType(null);
    setStaticAddress("");
    setStaticDuration(null);
    setFuzzyLocation(false);
    setLocalMetadata({});
    onLocationChange?.(null);
  };

  const handleExternalShare = async () => {
    if (!locationActive) return;
    
    try {
      // Get current position for live sharing
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        });
      });

      let lat = position.coords.latitude;
      let lng = position.coords.longitude;

      // Apply fuzzy offset if enabled
      if (fuzzyLocation) {
        const offset = generateFuzzyOffset();
        lat += offset.latOffset;
        lng += offset.lngOffset;
      }

      // Build the share URL with location data
      const isGhostedMode = locationDuration === "0.033";
      const params = new URLSearchParams({
        lat: lat.toString(),
        lng: lng.toString(),
        label: "Valid™ Location",
        ghosted: isGhostedMode.toString(),
        fuzzy: fuzzyLocation.toString(),
        expiry: locationExpiry?.toISOString() || ""
      });

      const shareUrl = `https://bevalid.app/location/${Date.now()}?${params.toString()}`;
      const shareText = locationType === "static" && staticAddress
        ? `📍 Meet me at: ${staticAddress}`
        : `📍 Here's my live location via Valid™`;
      
      if (navigator.share) {
        await navigator.share({
          title: 'Valid™ Location',
          text: shareText,
          url: shareUrl
        });
        toast.success("Location shared!");
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Location link copied!");
      }
    } catch (error: any) {
      if (error.code === 1) {
        toast.error("Location permission denied");
      } else if (error.name !== "AbortError") {
        toast.error("Failed to get location");
      }
    }
  };

  return (
    <div className="rounded-xl border border-red-400/30 bg-red-500/5 overflow-hidden">
      {/* Header - Always visible */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-3 flex items-center justify-between hover:bg-red-500/10 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            locationActive ? "bg-red-500 animate-pulse" : "bg-red-500/20"
          }`}>
            <MapPin className={`w-4 h-4 ${locationActive ? "text-white" : "text-red-400"}`} />
          </div>
          <div className="text-left">
            <span className="font-semibold text-foreground text-sm flex items-center gap-2">
              LOCATION PULSE
              {locationActive && (
                <span className="text-[8px] font-bold text-red-400 bg-red-500/20 px-1.5 py-0.5 rounded-full border border-red-400/50 animate-pulse">
                  LIVE
                </span>
              )}
            </span>
            <p className="text-xs text-muted-foreground">Share live or static location</p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>

      {/* Expandable Content */}
      {isExpanded && (
        <div className="p-3 pt-0 border-t border-red-400/20 animate-fade-in">
          {!locationActive ? (
            <div className="space-y-3 pt-3">
              {/* Type Toggle */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => { setLocationType("live"); setStaticAddress(""); setStaticDuration(null); }}
                  className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
                    locationType === "live"
                      ? "bg-red-500/20 text-red-400 border border-red-400"
                      : "bg-card border border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Navigation className="w-3.5 h-3.5" />
                  Live
                </button>
                <button
                  type="button"
                  onClick={() => { setLocationType("static"); setLocationDuration(null); }}
                  className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
                    locationType === "static"
                      ? "bg-red-500/20 text-red-400 border border-red-400"
                      : "bg-card border border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <MapPinOff className="w-3.5 h-3.5" />
                  Static
                </button>
              </div>

              {/* Live Location */}
              {locationType === "live" && (
                <div className="space-y-2 animate-fade-in">
                  {/* Map Placeholder */}
                  <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <span className="text-4xl">📍</span>
                      <p className="text-muted-foreground mt-2">Live location coming soon</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-1.5 px-2 rounded bg-card/50 border border-border">
                    <span className="text-xs text-foreground flex items-center gap-1.5">
                      <MapPinOff className="w-3 h-3 text-amber-400" />
                      Fuzzy (~1mi)
                    </span>
                    <Switch
                      checked={fuzzyLocation}
                      onCheckedChange={setFuzzyLocation}
                      className="scale-75 data-[state=checked]:bg-amber-500"
                    />
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {LOCATION_DURATIONS.map((d) => (
                      <button
                        key={d.value}
                        type="button"
                        onClick={() => setLocationDuration(d.value)}
                        className={`py-1.5 px-2.5 rounded text-xs transition-all flex items-center gap-1 ${
                          locationDuration === d.value
                            ? d.value === "0.033" 
                              ? "bg-purple-500/80 text-white shadow-[0_0_12px_rgba(168,85,247,0.6)] animate-pulse" 
                              : "bg-red-500 text-white"
                            : "bg-card border border-border text-foreground hover:border-red-400/50"
                        } ${d.value === "0.033" && locationDuration !== d.value ? "text-purple-400 font-semibold border-purple-400/30" : ""}`}
                      >
                        {d.value === "0.033" && <Ghost className="w-3 h-3" />}
                        {d.value === "0.033" ? d.label : (d.sublabel || d.label)}
                      </button>
                    ))}
                  </div>

                  <Button
                    onClick={activateLocationShare}
                    disabled={!locationDuration}
                    size="sm"
                    className="w-full h-8 bg-red-500 hover:bg-red-600 text-white text-xs disabled:opacity-50"
                  >
                    {locationDuration === "0.033" ? "👻 Go Ghosted" : "Activate"}
                  </Button>
                </div>
              )}

              {/* Static Location */}
              {locationType === "static" && (
                <div className="space-y-2 animate-fade-in">
                  {/* Map Placeholder */}
                  <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <span className="text-4xl">📍</span>
                      <p className="text-muted-foreground mt-2">Map preview coming soon</p>
                    </div>
                  </div>

                  <Input
                    value={staticAddress}
                    onChange={(e) => setStaticAddress(e.target.value)}
                    placeholder="Enter address..."
                    className="h-8 text-xs bg-background border-border"
                  />

                  <div className="flex items-center justify-between py-1.5 px-2 rounded bg-card/50 border border-border">
                    <span className="text-xs text-foreground flex items-center gap-1.5">
                      <MapPinOff className="w-3 h-3 text-amber-400" />
                      Fuzzy Area
                    </span>
                    <Switch
                      checked={fuzzyLocation}
                      onCheckedChange={setFuzzyLocation}
                      className="scale-75 data-[state=checked]:bg-amber-500"
                    />
                  </div>

                  <div className="flex gap-1.5">
                    {STATIC_DURATIONS.map((d) => (
                      <button
                        key={d.value}
                        type="button"
                        onClick={() => setStaticDuration(d.value)}
                        className={`flex-1 py-1.5 rounded text-xs transition-all ${
                          staticDuration === d.value
                            ? "bg-red-500 text-white"
                            : "bg-card border border-border text-foreground hover:border-red-400/50"
                        }`}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>

                  <Button
                    onClick={activateLocationShare}
                    disabled={!staticAddress || !staticDuration}
                    size="sm"
                    className="w-full h-8 bg-red-500 hover:bg-red-600 text-white text-xs disabled:opacity-50"
                  >
                    Set Location
                  </Button>
                </div>
              )}
            </div>
          ) : (
            /* Active State */
            <div className="space-y-2 pt-3">
              <div className="flex items-center justify-between py-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-xs font-medium text-red-400">
                    {localMetadata.is_ghosted ? (
                      <span className="flex items-center gap-1">
                        <Ghost className="w-3 h-3" /> Ghosted (2s Peak)
                      </span>
                    ) : (
                      <>
                        {locationType === "live" ? "Live" : "Static"}
                        {fuzzyLocation && <span className="ml-1 text-amber-400">(~100m Fuzzy)</span>}
                      </>
                    )}
                  </span>
                </div>
                <span className="text-[10px] text-muted-foreground">
                  Until {locationExpiry?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <div className="flex items-center gap-2 py-2 px-2.5 rounded bg-green-500/10 border border-green-400/30">
                <Check className="w-3.5 h-3.5 text-green-400" />
                <span className="text-[10px] text-green-400 font-medium">
                  Location embedded in your QR code
                </span>
              </div>

              <p className="text-[10px] text-muted-foreground leading-relaxed">
                When a verified peer scans your QR, they'll see your location in an encrypted in-app map view
                {localMetadata.is_ghosted && " that auto-closes after 2 seconds"}
                {fuzzyLocation && ". Location is fuzzy (~50-100m offset)"}.
              </p>

              <div className="flex gap-2">
                <Button
                  onClick={handleExternalShare}
                  variant="outline"
                  size="sm"
                  className="flex-1 h-7 text-[10px] border-border text-muted-foreground hover:text-foreground"
                >
                  <Share2 className="w-3 h-3 mr-1" />
                  Share Externally
                </Button>
                <Button
                  onClick={deactivateLocationShare}
                  variant="ghost"
                  size="sm"
                  className="flex-1 h-7 text-xs text-red-400 hover:bg-red-500/10"
                >
                  Stop Sharing
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LocationPulseSection;
