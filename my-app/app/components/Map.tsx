"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet's default icon issue in Next.js
const icon = L.icon({
  iconUrl: "/assets/marker-icon.png",
  shadowUrl: "/marker-shadow.png",
  iconSize: [30, 30],
  iconAnchor: [24, 24]
});

export default function MapComponent({
  lat,
  lng,
  locationName,
}: {
  lat: number;
  lng: number;
  locationName: string;
}) {
  return (
    <div className="w-full h-72 rounded-lg overflow-hidden mt-6">
      <MapContainer
        center={[lat, lng]}
        zoom={15}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={[lat, lng]} icon={icon}>
          <Popup>{locationName}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
