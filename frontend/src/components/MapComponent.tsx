import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface RecyclingPoint {
  id: string;
  name: string;
  location: [number, number];
  totalRecycled: number;
  lastUpdated: string;
}

interface MapComponentProps {
  center: [number, number];
  recyclingPoints: RecyclingPoint[];
}

// Component to handle map center updates
function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    if (map) {
      map.setView(center);
    }
  }, [center, map]);
  return null;
}

const MapComponent: React.FC<MapComponentProps> = ({ center, recyclingPoints }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className="h-full w-full bg-[#983279]/10 animate-pulse rounded-lg" />;
  }

  return (
    <div className="h-full w-full">
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
        whenCreated={(map) => {
          // Ensure map is properly initialized
          map.invalidateSize();
        }}
      >
        <ChangeView center={center} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {recyclingPoints.map((point) => (
          <Marker key={`marker-${point.id}`} position={point.location}>
            <Popup>
              <div className="text-foreground">
                <h3 className="font-semibold">{point.name}</h3>
                <p>Total Recycled: {point.totalRecycled} kg</p>
                <p>Last Updated: {point.lastUpdated}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent; 