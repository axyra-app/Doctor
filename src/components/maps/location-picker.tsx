'use client';

import { useState, useCallback, useEffect } from 'react';
import Map, { Marker, MapRef } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, MapPin, Navigation, Search } from 'lucide-react';
import { MAPBOX_ACCESS_TOKEN, MAP_DEFAULT_CENTER, geocodeAddress } from '@/lib/mapbox';
import { useGeolocation } from '@/hooks/use-geolocation';
import { toast } from 'sonner';

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
  const { lat: currentLat, lng: currentLng, isLoading: isLoadingLocation } = useGeolocation();
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(
    initialLocation || null
  );
  const [viewState, setViewState] = useState({
    longitude: initialLocation?.lng || currentLng || MAP_DEFAULT_CENTER.lng,
    latitude: initialLocation?.lat || currentLat || MAP_DEFAULT_CENTER.lat,
    zoom: 15,
  });
  const [searchAddress, setSearchAddress] = useState(address || '');
  const [isSearching, setIsSearching] = useState(false);
  const [mapRef, setMapRef] = useState<MapRef | null>(null);

  useEffect(() => {
    if (initialLocation) {
      setSelectedLocation(initialLocation);
      setViewState({
        longitude: initialLocation.lng,
        latitude: initialLocation.lat,
        zoom: 15,
      });
    }
  }, [initialLocation]);

  useEffect(() => {
    if (address) {
      setSearchAddress(address);
    }
  }, [address]);

  const handleMapClick = useCallback(
    (e: any) => {
      if (disabled) return;
      const location = {
        lat: e.lngLat.lat,
        lng: e.lngLat.lng,
      };
      setSelectedLocation(location);
      setViewState({
        ...viewState,
        longitude: location.lng,
        latitude: location.lat,
      });
      onLocationSelect(location);
    },
    [disabled, onLocationSelect, viewState]
  );

  const handleUseCurrentLocation = useCallback(() => {
    if (currentLat && currentLng) {
      const location = { lat: currentLat, lng: currentLng };
      setSelectedLocation(location);
      setViewState({
        longitude: currentLng,
        latitude: currentLat,
        zoom: 15,
      });
      onLocationSelect(location);
      toast.info('Ubicación', { description: 'Tu ubicación actual ha sido seleccionada.' });
    } else if (isLoadingLocation) {
      toast.info('Ubicación', { description: 'Obteniendo tu ubicación...' });
    } else {
      toast.error('Error de Geolocalización', { description: 'No se pudo obtener tu ubicación actual.' });
    }
  }, [currentLat, currentLng, isLoadingLocation, onLocationSelect]);

  const handleSearchAddress = useCallback(async () => {
    if (!searchAddress.trim()) return;

    setIsSearching(true);
    try {
      const location = await geocodeAddress(searchAddress);
      if (location) {
        setSelectedLocation(location);
        setViewState({
          longitude: location.lng,
          latitude: location.lat,
          zoom: 15,
        });
        onLocationSelect({ ...location, address: searchAddress });
        toast.success('Dirección encontrada', { description: 'Ubicación seleccionada en el mapa.' });
      } else {
        toast.error('Error', { description: 'No se pudo encontrar la dirección. Intenta con otra búsqueda.' });
      }
    } catch (error) {
      console.error('Error searching address:', error);
      toast.error('Error', { description: 'Hubo un problema al buscar la dirección.' });
    } finally {
      setIsSearching(false);
    }
  }, [searchAddress, onLocationSelect]);

  if (!MAPBOX_ACCESS_TOKEN) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center h-[400px] space-y-4 text-center">
          <MapPin className="h-12 w-12 text-muted-foreground" />
          <div>
            <p className="font-semibold">Mapbox Access Token no configurado</p>
            <p className="text-sm text-muted-foreground mt-2">
              Agrega <code className="bg-muted px-1 rounded">NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN</code> en tu archivo <code className="bg-muted px-1 rounded">.env.local</code>
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Obtén tu token en: <a href="https://account.mapbox.com/access-tokens/" target="_blank" rel="noopener noreferrer" className="text-primary underline">account.mapbox.com</a>
            </p>
          </div>
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
            {isLoadingLocation ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Navigation className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Map */}
        <div className="rounded-lg overflow-hidden border">
          <Map
            {...viewState}
            onMove={(evt) => setViewState(evt.viewState)}
            onClick={handleMapClick}
            style={{ width: '100%', height: 400 }}
            mapStyle="mapbox://styles/mapbox/streets-v12"
            mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
            ref={setMapRef}
            doubleClickZoom={false}
          >
            {selectedLocation && (
              <Marker
                longitude={selectedLocation.lng}
                latitude={selectedLocation.lat}
                draggable={!disabled}
                onDragEnd={(e) => {
                  const location = {
                    lat: e.lngLat.lat,
                    lng: e.lngLat.lng,
                  };
                  setSelectedLocation(location);
                  onLocationSelect(location);
                }}
                anchor="bottom"
              >
                <div className="relative">
                  <MapPin className="h-8 w-8 text-primary drop-shadow-lg" fill="currentColor" />
                </div>
              </Marker>
            )}
          </Map>
        </div>

        {selectedLocation && (
          <p className="text-sm text-muted-foreground text-center">
            Ubicación seleccionada: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
