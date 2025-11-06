'use client';

import { useState, useCallback, useEffect } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, MapPin, Navigation, Search } from 'lucide-react';
import { GOOGLE_MAPS_API_KEY, MAP_DEFAULT_CENTER, geocodeAddress } from '@/lib/google-maps';
import { useGeolocation } from '@/hooks/use-geolocation';

const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

interface LocationPickerProps {
  onLocationSelect: (location: { lat: number; lng: number; address?: string }) => void;
  initialLocation?: { lat: number; lng: number };
  address?: string;
  disabled?: boolean;
}

export function LocationPicker({
  onLocationSelect,
  initialLocation,
  address,
  disabled = false,
}: LocationPickerProps) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  const { lat: currentLat, lng: currentLng, isLoading: isLoadingLocation } = useGeolocation();
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(
    initialLocation || null
  );
  const [mapCenter, setMapCenter] = useState(
    initialLocation || (currentLat && currentLng ? { lat: currentLat, lng: currentLng } : MAP_DEFAULT_CENTER)
  );
  const [searchAddress, setSearchAddress] = useState(address || '');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (initialLocation) {
      setSelectedLocation(initialLocation);
      setMapCenter(initialLocation);
    }
  }, [initialLocation]);

  useEffect(() => {
    if (address) {
      setSearchAddress(address);
    }
  }, [address]);

  const handleMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (disabled) return;
      if (e.latLng) {
        const location = {
          lat: e.latLng.lat(),
          lng: e.latLng.lng(),
        };
        setSelectedLocation(location);
        setMapCenter(location);
        onLocationSelect(location);
      }
    },
    [disabled, onLocationSelect]
  );

  const handleUseCurrentLocation = useCallback(() => {
    if (currentLat && currentLng) {
      const location = { lat: currentLat, lng: currentLng };
      setSelectedLocation(location);
      setMapCenter(location);
      onLocationSelect(location);
    }
  }, [currentLat, currentLng, onLocationSelect]);

  const handleSearchAddress = useCallback(async () => {
    if (!searchAddress.trim()) return;

    setIsSearching(true);
    try {
      const location = await geocodeAddress(searchAddress);
      if (location) {
        setSelectedLocation(location);
        setMapCenter(location);
        onLocationSelect({ ...location, address: searchAddress });
      }
    } catch (error) {
      console.error('Error searching address:', error);
    } finally {
      setIsSearching(false);
    }
  }, [searchAddress, onLocationSelect]);

  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center h-[400px] space-y-4 text-center">
          <MapPin className="h-12 w-12 text-muted-foreground" />
          <div>
            <p className="font-semibold">Google Maps API Key no configurada</p>
            <p className="text-sm text-muted-foreground mt-2">
              Agrega <code className="bg-muted px-1 rounded">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> en tu archivo <code className="bg-muted px-1 rounded">.env.local</code>
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Ver <code className="bg-muted px-1 rounded">CONFIGURACION_APIS.md</code> para instrucciones
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!isLoaded) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Seleccionar Ubicación
        </CardTitle>
        <CardDescription>
          Haz clic en el mapa o busca una dirección para seleccionar la ubicación
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Bar */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar dirección..."
              value={searchAddress}
              onChange={(e) => setSearchAddress(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearchAddress();
                }
              }}
              className="pl-10"
              disabled={disabled || isSearching}
            />
          </div>
          <Button
            onClick={handleSearchAddress}
            disabled={disabled || isSearching || !searchAddress.trim()}
            variant="outline"
          >
            {isSearching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
          <Button
            onClick={handleUseCurrentLocation}
            disabled={disabled || isLoadingLocation || !currentLat || !currentLng}
            variant="outline"
            title="Usar mi ubicación actual"
          >
            <Navigation className="h-4 w-4" />
          </Button>
        </div>

        {/* Map */}
        <div className="rounded-lg overflow-hidden border">
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={mapCenter}
            zoom={15}
            onClick={handleMapClick}
            options={{
              disableDefaultUI: false,
              zoomControl: true,
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: true,
            }}
          >
            {selectedLocation && (
              <Marker
                position={selectedLocation}
                draggable={!disabled}
                onDragEnd={(e) => {
                  if (e.latLng) {
                    const location = {
                      lat: e.latLng.lat(),
                      lng: e.latLng.lng(),
                    };
                    setSelectedLocation(location);
                    onLocationSelect(location);
                  }
                }}
              />
            )}
          </GoogleMap>
        </div>

        {selectedLocation && (
          <p className="text-sm text-muted-foreground">
            Ubicación seleccionada: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

