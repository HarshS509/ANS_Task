import { Info, Loader2, MapPin, Navigation } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

const LocationMap = () => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );
    setIsDarkMode(darkModeMediaQuery.matches);

    const handleChange = (e) => {
      setIsDarkMode(e.matches);
    };

    darkModeMediaQuery.addEventListener("change", handleChange);
    return () => darkModeMediaQuery.removeEventListener("change", handleChange);
  }, []);

  const updateMapStyle = useCallback(() => {
    if (!mapInstanceRef.current || !mapRef.current) return;

    const L = window.L;
    const newTileLayer = L.tileLayer(
      isDarkMode
        ? "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
        : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution: isDarkMode
          ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          : "© OpenStreetMap contributors",
        maxZoom: 19,
      }
    );

    mapInstanceRef.current.removeLayer(mapRef.current);
    newTileLayer.addTo(mapInstanceRef.current);
    mapRef.current = newTileLayer;
  }, [isDarkMode]);

  useEffect(() => {
    if (typeof window !== "undefined" && !mapInstanceRef.current) {
      const L = window.L;
      const map = L.map("map").setView([0, 0], 2);

      const tileLayer = L.tileLayer(
        isDarkMode
          ? "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
          : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          attribution: isDarkMode
            ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            : "© OpenStreetMap contributors",
          maxZoom: 19,
        }
      ).addTo(map);

      mapInstanceRef.current = map;
      mapRef.current = tileLayer;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        mapRef.current = null;
        markerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    updateMapStyle();
  }, [isDarkMode, updateMapStyle]);

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          const isDark = document.documentElement.classList.contains("dark");
          setIsDarkMode(isDark);
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const getCurrentLocation = useCallback(() => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });

        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([latitude, longitude], 15, {
            animate: true,
            duration: 1,
          });

          if (markerRef.current) {
            markerRef.current.setLatLng([latitude, longitude]);
          } else {
            const L = window.L;
            const customIcon = L.divIcon({
              className: "bg-transparent",
              html: `<div class="relative p-2">
                      <div class="absolute w-4 h-4 bg-blue-500 dark:bg-blue-400 rounded-full animate-ping"></div>
                      <div class="relative w-4 h-4 bg-blue-600 dark:bg-blue-500 rounded-full"></div>
                    </div>`,
              iconSize: [24, 24],
              iconAnchor: [12, 12],
            });

            const newMarker = L.marker([latitude, longitude], {
              icon: customIcon,
            }).addTo(mapInstanceRef.current);
            markerRef.current = newMarker;
          }
        }

        setLoading(false);
      },
      (error) => {
        setError("Unable to retrieve your location");
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  }, []);

  useEffect(() => {
    getCurrentLocation();
  }, [getCurrentLocation]);

  return (
    <div className="w-full h-full bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <MapPin className="h-6 w-6" />
          Your Location
        </h2>

        <div className="relative">
          <button
            onClick={getCurrentLocation}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-md hover:bg-blue-50 dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Navigation className="h-4 w-4" />
            )}
            Refresh
          </button>

          {showTooltip && (
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-sm text-white bg-black rounded">
              Update your current location
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 p-6 w-full">
        <div className="lg:w-1/3 space-y-4 flex-shrink-0">
          {error && (
            <div className="flex items-center gap-2 p-4 text-red-800 bg-red-100 dark:bg-red-900/30 dark:text-red-200 rounded-md">
              <Info className="h-4 w-4 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {location && (
            <div className="flex flex-col gap-4 text-sm bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                  <span className="font-medium text-gray-700 dark:text-gray-200">
                    Latitude:
                  </span>
                  <span className="text-gray-600 dark:text-gray-300">
                    {location.latitude.toFixed(6)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-purple-500 dark:text-purple-400" />
                  <span className="font-medium text-gray-700 dark:text-gray-200">
                    Longitude:
                  </span>
                  <span className="text-gray-600 dark:text-gray-300">
                    {location.longitude.toFixed(6)}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                <div className="space-y-2 text-gray-600 dark:text-gray-300">
                  <p className="flex items-center gap-2">
                    <span className="w-24">Last Updated:</span>
                    <span>{new Date().toLocaleTimeString()}</span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="lg:w-2/3 flex-grow">
          <div
            id="map"
            className="h-[500px] w-full rounded-md border border-gray-200 dark:border-gray-600 shadow-inner overflow-hidden"
          />
        </div>
      </div>
    </div>
  );
};

export default LocationMap;
