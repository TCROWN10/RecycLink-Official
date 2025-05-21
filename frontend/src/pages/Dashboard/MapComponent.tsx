import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

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
  React.useEffect(() => {
    if (map) {
      map.setView(center);
    }
  }, [center, map]);
  return null;
}

const MapComponent: React.FC<MapComponentProps> = ({ center, recyclingPoints }) => {
  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ height: '100%', width: '100%' }}
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
  );
};

export default MapComponent; 