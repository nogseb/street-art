import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { spots, categoryColors, type Spot } from "@/data/spots";
import type { CustomSpot } from "@/hooks/useCustomSpots";

interface StreetArtMapProps {
  selectedSpot: Spot | null;
  onSelectSpot: (spot: Spot) => void;
  customSpots?: CustomSpot[];
  onSelectCustomSpot?: (spot: CustomSpot) => void;
}

export default function StreetArtMap({ selectedSpot, onSelectSpot, customSpots = [], onSelectCustomSpot }: StreetArtMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const onSelectRef = useRef(onSelectSpot);
  const onSelectCustomRef = useRef(onSelectCustomSpot);
  const userMarkerRef = useRef<L.CircleMarker | null>(null);
  const userAccuracyRef = useRef<L.Circle | null>(null);
  const customMarkersRef = useRef<L.Marker[]>([]);
  const [locating, setLocating] = useState(false);
  onSelectRef.current = onSelectSpot;
  onSelectCustomRef.current = onSelectCustomSpot;

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const isMobile = window.innerWidth < 768;
    const markerSize = isMobile ? 36 : 28;
    const fontSize = isMobile ? 14 : 12;
    const borderWidth = isMobile ? 3 : 2.5;

    const map = L.map(containerRef.current, {
      center: [-20.8830, 55.4490],
      zoom: isMobile ? 14 : 15,
      zoomControl: false,
      attributionControl: false,
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 19,
    }).addTo(map);

    L.control.zoom({ position: "bottomright" }).addTo(map);
    L.control.attribution({ position: "bottomleft" }).addTo(map);

    // Draw route line
    // Draw walking route (spots 1-7) as dashed line
    const walkingSpots = spots.filter(s => s.id <= 7);
    const walkingCoords: L.LatLngExpression[] = walkingSpots.map((s) => [s.lat, s.lon]);
    L.polyline(walkingCoords, {
      color: "#FF3E52",
      weight: isMobile ? 3 : 2.5,
      opacity: 0.6,
      dashArray: "8 6",
    }).addTo(map);

    // Draw car route to spot 8 (dotted, different style)
    const spot7 = spots.find(s => s.id === 7);
    const spot8 = spots.find(s => s.id === 8);
    if (spot7 && spot8) {
      L.polyline([[spot7.lat, spot7.lon], [spot8.lat, spot8.lon]], {
        color: "#1A237E",
        weight: isMobile ? 2.5 : 2,
        opacity: 0.5,
        dashArray: "4 8",
      }).addTo(map);
    }

    // Add clickable markers
    spots.forEach((spot) => {
      const color = categoryColors[spot.category];
      const icon = L.divIcon({
        html: `<div class="spot-marker" style="background-color:${color};width:${markerSize}px;height:${markerSize}px;border-radius:50%;border:${borderWidth}px solid white;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,0.35);-webkit-tap-highlight-color:transparent;"><span style="color:white;font-weight:700;font-size:${fontSize}px;font-family:'Space Mono',monospace;line-height:1;">${spot.id}</span></div>`,
        className: "custom-spot-marker",
        iconSize: [markerSize, markerSize],
        iconAnchor: [markerSize / 2, markerSize / 2],
      });

      const marker = L.marker([spot.lat, spot.lon], { icon }).addTo(map);

      marker.on("click", () => {
        onSelectRef.current(spot);
      });

      // Tooltip only on desktop (hover)
      if (!isMobile) {
        marker.bindTooltip(spot.name, {
          direction: "top",
          offset: [0, -16],
          className: "spot-tooltip",
        });
      }
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Render custom spots as markers
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    const isMobile = window.innerWidth < 768;
    const size = isMobile ? 40 : 34;

    // Remove old custom markers
    customMarkersRef.current.forEach((m) => map.removeLayer(m));
    customMarkersRef.current = [];

    customSpots.forEach((cs) => {
      const icon = L.divIcon({
        html: `<div style="width:${size}px;height:${size}px;border-radius:8px;border:3px solid #FF3E52;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.4);cursor:pointer;-webkit-tap-highlight-color:transparent;"><img src="${cs.photoDataUrl}" style="width:100%;height:100%;object-fit:cover;" /></div>`,
        className: "custom-photo-marker",
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      });

      const marker = L.marker([cs.lat, cs.lon], { icon }).addTo(map);
      marker.on("click", () => {
        onSelectCustomRef.current?.(cs);
      });
      customMarkersRef.current.push(marker);
    });
  }, [customSpots]);

  // Geolocation handler
  const handleGeolocate = () => {
    if (!mapRef.current) return;
    if (!navigator.geolocation) {
      alert("La géolocalisation n'est pas supportée par votre navigateur.");
      return;
    }

    setLocating(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const map = mapRef.current;
        if (!map) return;

        // Remove previous user marker
        if (userMarkerRef.current) {
          map.removeLayer(userMarkerRef.current);
        }
        if (userAccuracyRef.current) {
          map.removeLayer(userAccuracyRef.current);
        }

        // Add accuracy circle
        userAccuracyRef.current = L.circle([latitude, longitude], {
          radius: accuracy,
          color: "#4285F4",
          fillColor: "#4285F4",
          fillOpacity: 0.1,
          weight: 1,
          opacity: 0.3,
        }).addTo(map);

        // Add user position marker (blue dot)
        userMarkerRef.current = L.circleMarker([latitude, longitude], {
          radius: 8,
          color: "#ffffff",
          weight: 3,
          fillColor: "#4285F4",
          fillOpacity: 1,
        }).addTo(map);

        // Pan to user position
        map.setView([latitude, longitude], 16, { animate: true, duration: 0.6 });
        setLocating(false);
      },
      (error) => {
        setLocating(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            alert("Accès à la position refusé. Activez la géolocalisation dans les réglages.");
            break;
          case error.POSITION_UNAVAILABLE:
            alert("Position indisponible.");
            break;
          case error.TIMEOUT:
            alert("Délai dépassé pour obtenir la position.");
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      }
    );
  };

  // Pan to selected spot with offset for mobile bottom sheet
  useEffect(() => {
    if (selectedSpot && mapRef.current) {
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        // Offset upward so the marker stays visible above the bottom sheet
        const targetPoint = mapRef.current.latLngToContainerPoint([selectedSpot.lat, selectedSpot.lon]);
        const offsetPoint = L.point(targetPoint.x, targetPoint.y + 80);
        const targetLatLng = mapRef.current.containerPointToLatLng(offsetPoint);
        mapRef.current.panTo(targetLatLng, { animate: true, duration: 0.4 });
      } else {
        mapRef.current.panTo([selectedSpot.lat, selectedSpot.lon], { animate: true, duration: 0.5 });
      }
    }
  }, [selectedSpot]);

  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="w-full h-full touch-manipulation" />
      {/* Geolocation button */}
      <button
        onClick={handleGeolocate}
        disabled={locating}
        className="absolute top-4 right-4 z-[1000] w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center border border-gray-200 active:scale-[0.92] transition-transform hover:bg-gray-50 disabled:opacity-60"
        aria-label="Centrer sur ma position"
        title="Ma position"
      >
        {locating ? (
          <svg className="w-5 h-5 text-[#4285F4] animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : (
          <svg className="w-5 h-5 text-[#333]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="4" />
            <line x1="12" y1="2" x2="12" y2="6" />
            <line x1="12" y1="18" x2="12" y2="22" />
            <line x1="2" y1="12" x2="6" y2="12" />
            <line x1="18" y1="12" x2="22" y2="12" />
          </svg>
        )}
      </button>
    </div>
  );
}
