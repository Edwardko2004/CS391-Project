"use client";

import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";

const markerIcon = L.icon({
  iconUrl: "/assets/marker-icon.png",
  shadowUrl: "/marker-shadow.png",
  iconSize: [24, 24],
  iconAnchor: [12, 41],
});

export default function MapPicker({ onSelect }: { onSelect: (lat: number, lng: number, address: string) => void }) {
  const [position, setPosition] = useState<[number, number]>([40.7128, -74.0060]); // Default NYC
  const [search, setSearch] = useState("");

  // Click handler to set marker + reverse geocode
  function MapClickHandler() {
    useMapEvents({
      click: async (e) => {
        const { lat, lng } = e.latlng;
        setPosition([lat, lng]);

        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
        );
        const data = await res.json();
        onSelect(lat, lng, data.display_name || "");
      },
    });
    return null;
  }
  function RecenterMap({ position }: { position: [number, number] }) {
    const map = useMapEvents({});
    useEffect(() => {
        map.setView(position);
    }, [position]);
    return null;
    }

  // Search → forward geocode
  const handleSearch = async () => {
    if (!search.trim()) return;

    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(search)}&format=json`
    );
    const results = await res.json();

    if (results.length > 0) {
      const place = results[0];
      const lat = parseFloat(place.lat);
      const lon = parseFloat(place.lon);

      setPosition([lat, lon]);
      onSelect(lat, lon, place.display_name);
    }
  };

  return (
    <div className="w-full">
      {/* Search Bar */}
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search a place..."
          className="flex-1 px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-cyan-500 outline-none"
        />
        <button
          type="button"
          onClick={handleSearch}
          className="px-4 py-2 rounded-lg bg-cyan-600 text-black font-semibold hover:bg-cyan-500"
        >
          Go
        </button>
      </div>

      {/* Map */}
      <MapContainer
        center={position}
        zoom={14}
        scrollWheelZoom={true}
        className="h-72 w-full rounded-xl border border-gray-700"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap"
        />
        <MapClickHandler />
        <RecenterMap position={position} />
        <Marker position={position} icon={markerIcon} />
      </MapContainer>
    </div>
  );
}
