"use client";
import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  type: "emergency" | "hospital" | "ambulance" | "user" | "family" | "danger";
  label?: string;
  severity?: "critical" | "moderate" | "low";
  pulse?: boolean;
  popup?: string;
}

export interface MapRoute {
  from: [number, number];
  to: [number, number];
  color?: string;
  dashed?: boolean;
}

interface EmergencyMapProps {
  markers?: MapMarker[];
  routes?: MapRoute[];
  center?: [number, number];
  zoom?: number;
  height?: string;
  className?: string;
  onMarkerClick?: (marker: MapMarker) => void;
  interactive?: boolean;
  showZoom?: boolean;
}

const TILE_URL = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";

const markerIcons: Record<MapMarker["type"], { emoji: string; color: string; size: number }> = {
  emergency: { emoji: "🚨", color: "#ef4444", size: 32 },
  hospital: { emoji: "🏥", color: "#22c55e", size: 28 },
  ambulance: { emoji: "🚑", color: "#3b82f6", size: 28 },
  user: { emoji: "📍", color: "#3b82f6", size: 24 },
  family: { emoji: "👤", color: "#a855f7", size: 26 },
  danger: { emoji: "⚠️", color: "#f59e0b", size: 26 },
};

function createCustomIcon(marker: MapMarker) {
  const config = markerIcons[marker.type];
  const severity = marker.severity;
  const color = severity === "critical" ? "#ef4444" : severity === "moderate" ? "#f59e0b" : config.color;

  const pulseRings = marker.pulse
    ? `<div style="position:absolute;inset:-8px;border-radius:50%;border:2px solid ${color};opacity:0.4;animation:map-ping 1.5s ease-out infinite"></div>
       <div style="position:absolute;inset:-16px;border-radius:50%;border:1px solid ${color};opacity:0.2;animation:map-ping 1.5s ease-out 0.3s infinite"></div>`
    : "";

  return L.divIcon({
    className: "custom-map-marker",
    html: `
      <div style="position:relative;display:flex;align-items:center;justify-content:center">
        ${pulseRings}
        <div style="width:${config.size}px;height:${config.size}px;border-radius:50%;background:${color}22;border:2px solid ${color};display:flex;align-items:center;justify-content:center;font-size:${config.size * 0.5}px;backdrop-filter:blur(4px);position:relative;z-index:2">
          ${config.emoji}
        </div>
      </div>
    `,
    iconSize: [config.size + 20, config.size + 20],
    iconAnchor: [(config.size + 20) / 2, (config.size + 20) / 2],
    popupAnchor: [0, -(config.size / 2 + 10)],
  });
}

// Delhi as default center
const DEFAULT_CENTER: [number, number] = [28.6139, 77.209];
const DEFAULT_ZOOM = 12;

export function EmergencyMap({
  markers = [],
  routes = [],
  center = DEFAULT_CENTER,
  zoom = DEFAULT_ZOOM,
  height = "h-80",
  className = "",
  onMarkerClick,
  interactive = true,
  showZoom = true,
}: EmergencyMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center,
      zoom,
      zoomControl: showZoom,
      scrollWheelZoom: interactive,
      dragging: interactive,
      doubleClickZoom: interactive,
      touchZoom: interactive,
      attributionControl: false,
    });

    L.tileLayer(TILE_URL, {
      maxZoom: 18,
      subdomains: "abcd",
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  // Update markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Polyline || layer instanceof L.CircleMarker) {
        map.removeLayer(layer);
      }
    });

    // Add markers
    markers.forEach((m) => {
      const icon = createCustomIcon(m);
      const marker = L.marker([m.lat, m.lng], { icon }).addTo(map);

      if (m.popup || m.label) {
        marker.bindPopup(
          `<div style="padding:4px 0">
            <div style="font-weight:700;font-size:13px;margin-bottom:2px">${m.label || m.type}</div>
            ${m.popup ? `<div style="font-size:12px;opacity:0.7">${m.popup}</div>` : ""}
          </div>`,
          { closeButton: false, className: "ll-popup" }
        );
      }

      if (onMarkerClick) {
        marker.on("click", () => onMarkerClick(m));
      }
    });

    // Add routes
    routes.forEach((route) => {
      L.polyline([route.from, route.to], {
        color: route.color || "#3b82f6",
        weight: 3,
        opacity: 0.7,
        dashArray: route.dashed ? "8 8" : undefined,
      }).addTo(map);
    });
  }, [markers, routes, onMarkerClick]);

  if (!mounted) {
    return (
      <div className={`${height} bg-ll-surface border border-ll-border rounded-2xl ${className}`}>
        <div className="w-full h-full flex items-center justify-center">
          <div className="skeleton w-full h-full rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div
      ref={mapRef}
      className={`${height} rounded-2xl overflow-hidden border border-ll-border ${className}`}
    />
  );
}
