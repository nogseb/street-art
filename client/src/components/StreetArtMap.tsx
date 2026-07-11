import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { spots, categoryColors, type Spot } from "@/data/spots";

interface StreetArtMapProps {
  selectedSpot: Spot | null;
  onSelectSpot: (spot: Spot) => void;
}

export default function StreetArtMap({ selectedSpot, onSelectSpot }: StreetArtMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const onSelectRef = useRef(onSelectSpot);
  onSelectRef.current = onSelectSpot;

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [-20.8790, 55.4475],
      zoom: 16,
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
    const routeCoords: L.LatLngExpression[] = spots.map((s) => [s.lat, s.lon]);
    L.polyline(routeCoords, {
      color: "#FF3E52",
      weight: 2.5,
      opacity: 0.6,
      dashArray: "8 6",
    }).addTo(map);

    // Add clickable markers using divIcon (lives in markerPane, always clickable)
    spots.forEach((spot) => {
      const color = categoryColors[spot.category];
      const icon = L.divIcon({
        html: `<div class="spot-marker" style="background-color:${color};width:28px;height:28px;border-radius:50%;border:2.5px solid white;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 2px 6px rgba(0,0,0,0.3);"><span style="color:white;font-weight:700;font-size:12px;font-family:'Space Mono',monospace;line-height:1;">${spot.id}</span></div>`,
        className: "custom-spot-marker",
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const marker = L.marker([spot.lat, spot.lon], { icon }).addTo(map);

      marker.on("click", () => {
        onSelectRef.current(spot);
      });

      // Tooltip
      marker.bindTooltip(spot.name, {
        direction: "top",
        offset: [0, -16],
        className: "spot-tooltip",
      });
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Pan to selected spot
  useEffect(() => {
    if (selectedSpot && mapRef.current) {
      mapRef.current.panTo([selectedSpot.lat, selectedSpot.lon], { animate: true, duration: 0.5 });
    }
  }, [selectedSpot]);

  return (
    <div ref={containerRef} className="w-full h-full" />
  );
}
