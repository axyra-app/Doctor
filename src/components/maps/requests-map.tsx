'use client';

import { useMemo, useState } from 'react';
import Map, { Marker, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MAPBOX_ACCESS_TOKEN, MAP_DEFAULT_CENTER, calculateDistance } from '@/lib/mapbox';
import { AppointmentRequest } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, MapPin } from 'lucide-react';

interface RequestsMapProps {
  requests: AppointmentRequest[];
  currentLocation?: { lat: number; lng: number };
  onRequestClick?: (request: AppointmentRequest) => void;
}

const urgencyColors = {
  low: '#3b82f6',
  medium: '#eab308',
  high: '#f97316',
  emergency: '#ef4444',
};

const urgencyLabels = {
  low: 'Baja',
  medium: 'Media',
  high: 'Alta',
  emergency: 'Emergencia',
};

export function RequestsMap({ requests, currentLocation, onRequestClick }: RequestsMapProps) {
  const [selectedRequest, setSelectedRequest] = useState<AppointmentRequest | null>(null);
  const [viewState, setViewState] = useState({
    longitude: currentLocation?.lng || MAP_DEFAULT_CENTER.lng,
    latitude: currentLocation?.lat || MAP_DEFAULT_CENTER.lat,
    zoom: 12,
  });

  const mapCenter = useMemo(() => {
    if (currentLocation) {
      return { lat: currentLocation.lat, lng: currentLocation.lng };
    }
    if (requests.length > 0 && requests[0].location) {
      return {
        lat: requests[0].location.lat,
        lng: requests[0].location.lng,
      };
    }
    return MAP_DEFAULT_CENTER;
  }, [currentLocation, requests]);

  // Update viewState when mapCenter changes
  useMemo(() => {
    setViewState({
      longitude: mapCenter.lng,
      latitude: mapCenter.lat,
      zoom: 12,
    });
  }, [mapCenter]);

  const requestsWithLocation = useMemo(() => {
    return requests.filter((req) => req.location?.lat && req.location?.lng);
  }, [requests]);

  if (!MAPBOX_ACCESS_TOKEN) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Mapa de Solicitudes
          </CardTitle>
          <CardDescription>Mapbox Access Token no configurado</CardDescription>
        </CardHeader>
        <CardContent className="h-[500px] flex items-center justify-center text-center">
          <div className="space-y-2">
            <p className="text-muted-foreground">
              Configura <code className="bg-muted px-1 rounded">NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN</code> para ver el mapa
            </p>
            <p className="text-xs text-muted-foreground">
              Obtén tu token en: <a href="https://account.mapbox.com/access-tokens/" target="_blank" rel="noopener noreferrer" className="text-primary underline">account.mapbox.com</a>
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (requestsWithLocation.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Mapa de Solicitudes
          </CardTitle>
          <CardDescription>No hay solicitudes con ubicación disponible</CardDescription>
        </CardHeader>
        <CardContent className="h-[500px] flex items-center justify-center text-muted-foreground">
          Las solicitudes aparecerán aquí cuando tengan una ubicación geográfica
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Mapa de Solicitudes ({requestsWithLocation.length})
        </CardTitle>
        <CardDescription>
          Visualiza las solicitudes cercanas en el mapa. El color indica el nivel de urgencia.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg overflow-hidden border">
          <Map
            {...viewState}
            onMove={(evt) => setViewState(evt.viewState)}
            style={{ width: '100%', height: 500 }}
            mapStyle="mapbox://styles/mapbox/streets-v12"
            mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
          >
            {/* Current location marker */}
            {currentLocation && (
              <Marker longitude={currentLocation.lng} latitude={currentLocation.lat} anchor="center">
                <div className="relative">
                  <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg"></div>
                </div>
              </Marker>
            )}

            {/* Request markers */}
            {requestsWithLocation.map((request) => {
              if (!request.location) return null;

              const color = urgencyColors[request.urgency || 'medium'];
              const distance = currentLocation
                ? calculateDistance(
                    currentLocation.lat,
                    currentLocation.lng,
                    request.location.lat,
                    request.location.lng
                  )
                : null;

              return (
                <Marker
                  key={request.id}
                  longitude={request.location.lng}
                  latitude={request.location.lat}
                  anchor="bottom"
                  onClick={() => {
                    setSelectedRequest(request);
                    onRequestClick?.(request);
                  }}
                >
                  <div
                    className="cursor-pointer"
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      backgroundColor: color,
                      border: '2px solid white',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                    }}
                  />
                </Marker>
              );
            })}

            {/* Popup for selected request */}
            {selectedRequest && selectedRequest.location && (
              <Popup
                longitude={selectedRequest.location.lng}
                latitude={selectedRequest.location.lat}
                anchor="bottom"
                onClose={() => setSelectedRequest(null)}
                closeButton={true}
                closeOnClick={false}
              >
                <div className="p-2 min-w-[200px]">
                  <h3 className="font-semibold text-sm mb-1 line-clamp-2">{selectedRequest.description}</h3>
                  {selectedRequest.urgency && (
                    <Badge
                      className="text-xs mb-2"
                      style={{
                        backgroundColor: urgencyColors[selectedRequest.urgency] + '20',
                        color: urgencyColors[selectedRequest.urgency],
                        borderColor: urgencyColors[selectedRequest.urgency],
                      }}
                    >
                      {urgencyLabels[selectedRequest.urgency]}
                    </Badge>
                  )}
                  <p className="text-xs text-muted-foreground line-clamp-2">{selectedRequest.address}</p>
                  {currentLocation && selectedRequest.location && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {calculateDistance(
                        currentLocation.lat,
                        currentLocation.lng,
                        selectedRequest.location.lat,
                        selectedRequest.location.lng
                      ).toFixed(1)}{' '}
                      km
                    </p>
                  )}
                </div>
              </Popup>
            )}
          </Map>
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          {currentLocation && (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-blue-600 border-2 border-white" />
              <span>Tu ubicación</span>
            </div>
          )}
          {Object.entries(urgencyLabels).map(([key, label]) => (
            <div key={key} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full border-2 border-white"
                style={{ backgroundColor: urgencyColors[key] }}
              />
              <span>Urgencia {label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
