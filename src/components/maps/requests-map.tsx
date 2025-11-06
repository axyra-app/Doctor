'use client';

import { useMemo } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { GOOGLE_MAPS_API_KEY, MAP_DEFAULT_CENTER, calculateDistance } from '@/lib/google-maps';
import { AppointmentRequest } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, MapPin } from 'lucide-react';

const mapContainerStyle = {
  width: '100%',
  height: '500px',
};

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

export function RequestsMap({ requests, currentLocation, onRequestClick }: RequestsMapProps) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  const mapCenter = useMemo(() => {
    if (currentLocation) {
      return currentLocation;
    }
    if (requests.length > 0 && requests[0].location) {
      return {
        lat: requests[0].location.lat,
        lng: requests[0].location.lng,
      };
    }
    return MAP_DEFAULT_CENTER;
  }, [currentLocation, requests]);

  const requestsWithLocation = useMemo(() => {
    return requests.filter((req) => req.location?.lat && req.location?.lng);
  }, [requests]);

  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Mapa de Solicitudes
          </CardTitle>
          <CardDescription>Google Maps API Key no configurada</CardDescription>
        </CardHeader>
        <CardContent className="h-[500px] flex items-center justify-center text-center">
          <div className="space-y-2">
            <p className="text-muted-foreground">
              Configura <code className="bg-muted px-1 rounded">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> para ver el mapa
            </p>
            <p className="text-xs text-muted-foreground">
              Ver <code className="bg-muted px-1 rounded">CONFIGURACION_APIS.md</code>
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!isLoaded) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-[500px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={mapCenter}
            zoom={12}
            options={{
              disableDefaultUI: false,
              zoomControl: true,
              streetViewControl: false,
              mapTypeControl: true,
              fullscreenControl: true,
            }}
          >
            {/* Current location marker */}
            {currentLocation && (
              <Marker
                position={currentLocation}
                icon={{
                  path: google.maps.SymbolPath.CIRCLE,
                  scale: 8,
                  fillColor: '#3b82f6',
                  fillOpacity: 1,
                  strokeColor: '#ffffff',
                  strokeWeight: 2,
                }}
                title="Tu ubicación"
              />
            )}

            {/* Request markers */}
            {requestsWithLocation.map((request) => {
              if (!request.location) return null;

              return (
                <Marker
                  key={request.id}
                  position={{ lat: request.location.lat, lng: request.location.lng }}
                  icon={{
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 10,
                    fillColor: urgencyColors[request.urgency || 'medium'],
                    fillOpacity: 0.8,
                    strokeColor: '#ffffff',
                    strokeWeight: 2,
                  }}
                  onClick={() => onRequestClick?.(request)}
                  title={request.description}
                />
              );
            })}
          </GoogleMap>
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-500" />
            <span>Baja</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-yellow-500" />
            <span>Media</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-orange-500" />
            <span>Alta</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500" />
            <span>Emergencia</span>
          </div>
          {currentLocation && (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-blue-600 border-2 border-white" />
              <span>Tu ubicación</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

