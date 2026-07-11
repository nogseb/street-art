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

    const isMobile = window.innerWidth < 768;
    const markerSize = isMobile ? 36 : 28;
    const fontSize = isMobile ? 14 : 12;
    const borderWidth = isMobile ? 3 : 2.5;

    const map = L.map(containerRef.current, {
      center: [-20.8790, 55.4475],
      zoom: isMobile ? 15 : 16,
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
      weight: isMobile ? 3 : 2.5,
      opacity: 0.6,
      dashArray: "8 6",
    }).addTo(map);

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
    <div ref={containerRef} className="w-full h-full touch-manipulation" />
  );
}
