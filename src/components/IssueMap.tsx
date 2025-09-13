'use client';
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Issue } from '../types';

interface ChangeViewProps {
  center: [number, number];
  zoom: number;
}

function ChangeView({ center, zoom }: ChangeViewProps) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

interface IssueMapProps {
  issues: Issue[];
  mapView: { center: [number, number], zoom: number } | null;
}

const IssueMap: React.FC<IssueMapProps> = ({ issues, mapView }) => {
  const center: [number, number] = issues.length > 0 ? [issues[0].location.lat, issues[0].location.lng] : [16.5062, 80.6480];

  return (
    <div className="h-[400px] w-full p-4">
      <MapContainer center={center} zoom={13} scrollWheelZoom={true} style={{ height: '100%', width: '100%', borderRadius: '12px' }}>
        {mapView && <ChangeView center={mapView.center} zoom={mapView.zoom} />}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {issues.map(issue => (
          <Marker key={issue.id} position={[issue.location.lat, issue.location.lng]}>
            <Popup>
              <div className="w-56">
                <img src={issue.imageUrl} alt={issue.title} className="w-full h-24 object-cover rounded-md mb-2" />
                <h3 className="font-bold text-base mb-1">{issue.title}</h3>
                <p className="text-xs text-gray-600 mb-1">Department: {issue.department}</p>
                <p className="text-xs text-gray-600 mb-1">ID: {issue.id}</p>
                <p className="text-xs text-gray-600 mb-2">Distance: {issue.distance} miles away</p>
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${issue.status === 'Pending' ? 'text-red-600 bg-red-100' : 'text-green-600 bg-green-100'}`}>
                    {issue.status}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(issue.submittedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default IssueMap;
