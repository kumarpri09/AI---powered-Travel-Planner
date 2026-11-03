/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Facility, LocationPoint, TransportMode, TravelOption } from '../types/travel';

interface InteractiveMapProps {
  origin: LocationPoint;
  destination: LocationPoint;
  selectedOption: TravelOption | null;
  facilities: Facility[];
  isNavigating: boolean;
  navPosition: [number, number] | null;
  navStepIndex: number;
  onSelectFacility?: (facility: Facility) => void;
  selectedHotelIds: string[];
  selectedDiningIds: string[];
}

const MODE_COLORS: Record<TransportMode, string> = {
  bike: '#10b981', // emerald
  metro: '#4f46e5', // indigo
  bus: '#f59e0b', // amber
  train: '#8b5cf6', // purple
  flight: '#0ea5e9', // sky
  multi: '#2563eb', // blue
};

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  origin,
  destination,
  selectedOption,
  facilities,
  isNavigating,
  navPosition,
  navStepIndex,
  onSelectFacility,
  selectedHotelIds,
  selectedDiningIds,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const polylineLayerRef = useRef<L.Polyline | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const navMarkerRef = useRef<L.Marker | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [(origin.lat + destination.lat) / 2, (origin.lng + destination.lng) / 2],
      zoom: 12,
      zoomControl: false,
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      subdomains: 'abcd',
    }).addTo(map);

    const markersGroup = L.layerGroup().addTo(map);
    markersLayerRef.current = markersGroup;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Route Polyline and Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    // 1. Polyline for selected travel option
    if (polylineLayerRef.current) {
      polylineLayerRef.current.remove();
      polylineLayerRef.current = null;
    }

    if (selectedOption && selectedOption.pathCoordinates.length > 0) {
      const color = MODE_COLORS[selectedOption.mode] || '#4f46e5';
      const polyline = L.polyline(selectedOption.pathCoordinates, {
        color: color,
        weight: 5,
        opacity: 0.85,
        dashArray: selectedOption.mode === 'bike' ? '8, 8' : undefined,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(map);

      polylineLayerRef.current = polyline;

      // Fit bounds to include route with padding
      const bounds = polyline.getBounds();
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    } else {
      const bounds = L.latLngBounds([[origin.lat, origin.lng], [destination.lat, destination.lng]]);
      map.fitBounds(bounds, { padding: [60, 60] });
    }

    // 2. Origin Marker
    const originIcon = L.divIcon({
      className: 'custom-map-icon',
      html: `
        <div style="background-color: #10b981; color: white; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 13px; border: 3px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.25);">
          A
        </div>
      `,
      iconSize: [34, 34],
      iconAnchor: [17, 17],
    });

    const originMarker = L.marker([origin.lat, origin.lng], { icon: originIcon }).addTo(markersGroup);
    originMarker.bindPopup(`
      <div style="font-size: 13px;">
        <span style="font-size: 11px; text-transform: uppercase; color: #10b981; font-weight: 600;">Origin</span>
        <div style="font-weight: 700; color: #0f172a; margin-top: 2px;">${origin.name}</div>
        <div style="color: #64748b; font-size: 12px;">${origin.city}, ${origin.country}</div>
      </div>
    `);

    // 3. Destination Marker
    const destIcon = L.divIcon({
      className: 'custom-map-icon',
      html: `
        <div style="background-color: #ef4444; color: white; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 13px; border: 3px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.25);">
          B
        </div>
      `,
      iconSize: [34, 34],
      iconAnchor: [17, 17],
    });

    const destMarker = L.marker([destination.lat, destination.lng], { icon: destIcon }).addTo(markersGroup);
    destMarker.bindPopup(`
      <div style="font-size: 13px;">
        <span style="font-size: 11px; text-transform: uppercase; color: #ef4444; font-weight: 600;">Destination</span>
        <div style="font-weight: 700; color: #0f172a; margin-top: 2px;">${destination.name}</div>
        <div style="color: #64748b; font-size: 12px;">${destination.city}, ${destination.country}</div>
      </div>
    `);

    // 4. Facility Markers (Hotels, Hostels, Dining, Bike Docks)
    facilities.forEach((facility) => {
      let iconColor = '#0284c7';
      let iconSymbol = '📍';
      const isSelected = selectedHotelIds.includes(facility.id) || selectedDiningIds.includes(facility.id);

      if (facility.type === 'hotel' || facility.type === 'hostel') {
        iconColor = '#8b5cf6';
        iconSymbol = '🏨';
      } else if (facility.type === 'restaurant' || facility.type === 'cafe') {
        iconColor = '#ea580c';
        iconSymbol = '🍽️';
      } else if (facility.type === 'bike_dock') {
        iconColor = '#10b981';
        iconSymbol = '🚲';
      } else if (facility.type === 'metro_station') {
        iconColor = '#4f46e5';
        iconSymbol = '🚇';
      }

      const facilityIcon = L.divIcon({
        className: 'custom-map-icon',
        html: `
          <div style="
            background-color: ${isSelected ? '#059669' : 'white'};
            color: ${isSelected ? 'white' : '#1e293b'};
            width: ${isSelected ? '32px' : '28px'};
            height: ${isSelected ? '32px' : '28px'};
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 13px;
            border: 2px solid ${isSelected ? '#10b981' : iconColor};
            box-shadow: 0 3px 8px rgba(0,0,0,0.18);
            cursor: pointer;
            transition: transform 0.2s;
          ">
            ${iconSymbol}
          </div>
        `,
        iconSize: isSelected ? [32, 32] : [28, 28],
        iconAnchor: isSelected ? [16, 16] : [14, 14],
      });

      const facilityMarker = L.marker([facility.lat, facility.lng], { icon: facilityIcon }).addTo(markersGroup);

      const popupHtml = `
        <div style="font-family: inherit; min-width: 190px;">
          <div style="font-size: 11px; color: ${iconColor}; font-weight: 600; text-transform: uppercase;">
            ${facility.category}
          </div>
          <div style="font-weight: 700; color: #0f172a; font-size: 13px; margin: 2px 0 4px;">
            ${facility.name}
          </div>
          <div style="font-size: 12px; color: #475569; margin-bottom: 6px;">
            ${facility.priceTier} · Rating ★${facility.rating.toFixed(1)} (${facility.reviewsCount})
          </div>
          <div style="font-size: 11px; color: #64748b; margin-bottom: 8px;">
            ${facility.distanceKmFromDest} km from terminal hub
          </div>
          <button id="add-fac-${facility.id}" style="
            width: 100%;
            background-color: ${isSelected ? '#e2e8f0' : '#0f172a'};
            color: ${isSelected ? '#334155' : 'white'};
            border: none;
            padding: 6px 10px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 600;
            cursor: pointer;
          ">
            ${isSelected ? '✓ In Your Trip' : '+ Add to Trip Plan'}
          </button>
        </div>
      `;

      facilityMarker.bindPopup(popupHtml);

      facilityMarker.on('popupopen', () => {
        const btn = document.getElementById(`add-fac-${facility.id}`);
        if (btn && onSelectFacility) {
          btn.onclick = () => {
            onSelectFacility(facility);
            facilityMarker.closePopup();
          };
        }
      });
    });
  }, [origin, destination, selectedOption, facilities, selectedHotelIds, selectedDiningIds, onSelectFacility]);

  // Live Navigation Simulated Marker
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (!isNavigating || !navPosition) {
      if (navMarkerRef.current) {
        navMarkerRef.current.remove();
        navMarkerRef.current = null;
      }
      return;
    }

    const currentMode = selectedOption?.mode || 'metro';
    const vehicleEmoji =
      currentMode === 'bike' ? '🚲' :
      currentMode === 'metro' ? '🚇' :
      currentMode === 'bus' ? '🚌' :
      currentMode === 'flight' ? '✈️' : '🚆';

    const liveIcon = L.divIcon({
      className: 'live-nav-marker',
      html: `
        <div style="position: relative; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;">
          <div class="transit-radar" style="position: absolute; inset: 0; border-radius: 50%; background-color: #3b82f6; opacity: 0.35;"></div>
          <div style="position: relative; background-color: #1e3a8a; color: white; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; border: 3px solid #60a5fa; box-shadow: 0 4px 14px rgba(30, 58, 138, 0.45);">
            ${vehicleEmoji}
          </div>
        </div>
      `,
      iconSize: [44, 44],
      iconAnchor: [22, 22],
    });

    if (!navMarkerRef.current) {
      navMarkerRef.current = L.marker(navPosition, { icon: liveIcon, zIndexOffset: 1000 }).addTo(map);
    } else {
      navMarkerRef.current.setLatLng(navPosition);
      navMarkerRef.current.setIcon(liveIcon);
    }

    // Follow traveler smoothly during active navigation
    map.panTo(navPosition, { animate: true, duration: 0.5 });
  }, [isNavigating, navPosition, navStepIndex, selectedOption]);

  return (
    <div className="relative w-full h-full min-h-[420px] rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs">
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Floating Map Legend & Mode Indicator */}
      <div className="absolute top-4 left-4 z-20 bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-slate-200/90 shadow-md text-xs space-y-1.5 max-w-xs pointer-events-auto">
        <div className="flex items-center justify-between gap-3 font-semibold text-slate-800">
          <span>Transit Routing Layer</span>
          {selectedOption && (
            <span
              className="text-[11px] font-mono px-2 py-0.5 rounded text-white"
              style={{ backgroundColor: MODE_COLORS[selectedOption.mode] }}
            >
              {selectedOption.mode.toUpperCase()}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 text-[11px] text-slate-600 pt-1 border-t border-slate-100 flex-wrap">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Start
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" /> End
          </span>
          <span className="flex items-center gap-1">🏨 Hotel</span>
          <span className="flex items-center gap-1">🍽️ Dining</span>
          <span className="flex items-center gap-1">🚲 Bikeshare</span>
        </div>
      </div>
    </div>
  );
};
