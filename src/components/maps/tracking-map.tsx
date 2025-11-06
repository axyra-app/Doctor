'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import Map, { Marker, Popup, Source, Layer } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MAPBOX_ACCESS_TOKEN, MAP_DEFAULT_CENTER, calculateDistance, estimateTravelTime, getRoute } from '@/lib/mapbox';
import { AppointmentRequest } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, MapPin, Navigation, Clock, CheckCircle } from 'lucide-react';
import { useGeolocation } from '@/hooks/use-geolocation';
import { useDocument } from '@/firebase/firestore/use-document';
import { updateDocument } from '@/firebase/firestore/update-document';
import { useAuth } from '@/hooks/use-auth-provider';
import { toast } from 'sonner';

interface TrackingMapProps {
  appointment: AppointmentRequest;
  isDoctor?: boolean;
  isPatient?: boolean;
}

export function TrackingMap({ appointment, isDoctor = false, isPatient = false }: TrackingMapProps) {
  const { user: currentUser } = useAuth();
  const { lat: currentLat, lng: currentLng } = useGeolocation();
  const { data: updatedAppointment } = useDocument<AppointmentRequest>(
    `appointments/${appointment.id}`
  );

  // Use updated appointment if available, otherwise use the passed one
  const activeAppointment = updatedAppointment || appointment;

  const [viewState, setViewState] = useState({
    longitude: activeAppointment.location?.lng || MAP_DEFAULT_CENTER.lng,
    latitude: activeAppointment.location?.lat || MAP_DEFAULT_CENTER.lat,
    zoom: 13,
  });

  const [isUpdatingLocation, setIsUpdatingLocation] = useState(false);
  const [locationUpdateInterval, setLocationUpdateInterval] = useState<NodeJS.Timeout | null>(null);
  const [routeGeometry, setRouteGeometry] = useState<number[][] | null>(null);
  const [routeETA, setRouteETA] = useState<number | null>(null);
  const [routeDistance, setRouteDistance] = useState<number | null>(null);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);

  // Update viewState when appointment location changes
  useEffect(() => {
    if (activeAppointment.location) {
      setViewState({
        longitude: activeAppointment.location.lng,
        latitude: activeAppointment.location.lat,
        zoom: 13,
      });
    }
  }, [activeAppointment.location]);

  // Fetch real route when doctor starts route or location updates
  useEffect(() => {
    if (
      activeAppointment.status === 'en-route' &&
      activeAppointment.doctorLocation &&
      activeAppointment.location
    ) {
      // Debounce route fetching to avoid too many API calls
      const timeoutId = setTimeout(() => {
        setIsLoadingRoute(true);
        getRoute(
          { lat: activeAppointment.doctorLocation!.lat, lng: activeAppointment.doctorLocation!.lng },
          { lat: activeAppointment.location.lat, lng: activeAppointment.location.lng }
        )
          .then((route) => {
            if (route) {
              setRouteGeometry(route.geometry);
              setRouteETA(route.duration);
              setRouteDistance(route.distance);
            } else {
              // Fallback to straight line if route fails
              const distance = calculateDistance(
                activeAppointment.doctorLocation!.lat,
                activeAppointment.doctorLocation!.lng,
                activeAppointment.location.lat,
                activeAppointment.location.lng
              );
              setRouteDistance(distance);
              setRouteETA(estimateTravelTime(distance));
            }
          })
          .catch((error) => {
            console.error('Error fetching route:', error);
            // Fallback
            if (activeAppointment.doctorLocation && activeAppointment.location) {
              const distance = calculateDistance(
                activeAppointment.doctorLocation.lat,
                activeAppointment.doctorLocation.lng,
                activeAppointment.location.lat,
                activeAppointment.location.lng
              );
              setRouteDistance(distance);
              setRouteETA(estimateTravelTime(distance));
            }
          })
          .finally(() => {
            setIsLoadingRoute(false);
          });
      }, 2000); // Wait 2 seconds before fetching route to debounce

      return () => clearTimeout(timeoutId);
    } else {
      setRouteGeometry(null);
      setRouteETA(null);
      setRouteDistance(null);
    }
  }, [activeAppointment.status, activeAppointment.doctorLocation?.lat, activeAppointment.doctorLocation?.lng, activeAppointment.location]);

  // Calculate distance and ETA (use route data if available, otherwise calculate)
  const distanceAndETA = useMemo(() => {
    if (
      !activeAppointment.doctorLocation ||
      !activeAppointment.location ||
      activeAppointment.status !== 'en-route'
    ) {
      return null;
    }

    // Use route data if available, otherwise calculate
    if (routeDistance !== null && routeETA !== null) {
      return { distance: routeDistance, eta: routeETA };
    }

    const distance = calculateDistance(
      activeAppointment.doctorLocation.lat,
      activeAppointment.doctorLocation.lng,
      activeAppointment.location.lat,
      activeAppointment.location.lng
    );

    const eta = estimateTravelTime(distance);

    return { distance, eta };
  }, [activeAppointment, routeDistance, routeETA]);

  // Update doctor location in real-time
  const updateDoctorLocation = useCallback(async () => {
    if (!isDoctor || !currentUser || !currentLat || !currentLng || isUpdatingLocation) return;

    if (activeAppointment.status !== 'en-route') return;

    setIsUpdatingLocation(true);
    try {
      await updateDocument('appointments', activeAppointment.id, {
        doctorLocation: {
          lat: currentLat,
          lng: currentLng,
          updatedAt: Date.now(),
        },
      });
    } catch (error) {
      console.error('Error updating doctor location:', error);
    } finally {
      setIsUpdatingLocation(false);
    }
  }, [isDoctor, currentUser, currentLat, currentLng, activeAppointment, isUpdatingLocation]);

  // Start/stop location tracking
  useEffect(() => {
    if (isDoctor && activeAppointment.status === 'en-route' && currentLat && currentLng) {
      // Update immediately
      updateDoctorLocation();

      // Then update every 10 seconds
      const interval = setInterval(() => {
        updateDoctorLocation();
      }, 10000);

      setLocationUpdateInterval(interval);

      return () => {
        if (interval) clearInterval(interval);
      };
    } else {
      if (locationUpdateInterval) {
        clearInterval(locationUpdateInterval);
        setLocationUpdateInterval(null);
      }
    }
  }, [isDoctor, activeAppointment.status, currentLat, currentLng, updateDoctorLocation]);

  const handleStartRoute = async () => {
    if (!currentUser || !currentLat || !currentLng) {
      toast.error('Error', { description: 'No se pudo obtener tu ubicación actual.' });
      return;
    }

    try {
      await updateDocument('appointments', activeAppointment.id, {
        status: 'en-route',
        enRouteAt: Date.now(),
        doctorLocation: {
          lat: currentLat,
          lng: currentLng,
          updatedAt: Date.now(),
        },
      });
      toast.success('En Camino', { description: 'Tu ubicación se está compartiendo con el paciente.' });
    } catch (error) {
      toast.error('Error', { description: 'No se pudo iniciar el seguimiento.' });
    }
  };

  const handleArrived = async () => {
    try {
      await updateDocument('appointments', activeAppointment.id, {
        arrivedAt: Date.now(),
      });
      toast.success('Llegaste', { description: 'El paciente ha sido notificado de tu llegada.' });
    } catch (error) {
      toast.error('Error', { description: 'No se pudo registrar tu llegada.' });
    }
  };

  const handleComplete = async () => {
    try {
      await updateDocument('appointments', activeAppointment.id, {
        status: 'completed',
        completedAt: Date.now(),
      });
      toast.success('Cita Completada', { description: 'La cita ha sido marcada como completada.' });
    } catch (error) {
      toast.error('Error', { description: 'No se pudo completar la cita.' });
    }
  };

  if (!MAPBOX_ACCESS_TOKEN) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-[400px] text-center">
          <div className="space-y-2">
            <p className="text-muted-foreground">Mapbox Access Token no configurado</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!activeAppointment.location) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-[400px] text-center">
          <p className="text-muted-foreground">No hay ubicación disponible para esta cita</p>
        </CardContent>
      </Card>
    );
  }

  const patientLocation = activeAppointment.location;
  const doctorLocation = activeAppointment.doctorLocation;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          {activeAppointment.status === 'en-route' ? 'Seguimiento en Tiempo Real' : 'Ubicación de la Cita'}
        </CardTitle>
        <CardDescription>
          {activeAppointment.status === 'en-route'
            ? 'Sigue la ubicación del doctor en tiempo real'
            : 'Ubicación donde se realizará la atención médica'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status and ETA */}
        {activeAppointment.status === 'en-route' && distanceAndETA && (
          <div className="flex flex-wrap items-center gap-4 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            {isLoadingRoute && (
              <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-xs">Calculando ruta...</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Navigation className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <div>
                <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">En Camino</p>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  {distanceAndETA.distance.toFixed(1)} km de distancia
                  {routeGeometry && <span className="ml-1">(ruta real)</span>}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <div>
                <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                  Llegada estimada: {distanceAndETA.eta} min
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  {routeGeometry ? 'Basado en ruta real' : 'Tiempo aproximado'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Map */}
        <div className="rounded-lg overflow-hidden border">
          <Map
            {...viewState}
            onMove={(evt) => setViewState(evt.viewState)}
            style={{ width: '100%', height: 400 }}
            mapStyle="mapbox://styles/mapbox/streets-v12"
            mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
          >
            {/* Patient location marker */}
            <Marker longitude={patientLocation.lng} latitude={patientLocation.lat} anchor="bottom">
              <div className="relative">
                <div className="w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-white" fill="currentColor" />
                </div>
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                  <Badge variant="destructive" className="text-xs">Paciente</Badge>
                </div>
              </div>
            </Marker>

            {/* Doctor location marker (if en-route) */}
            {activeAppointment.status === 'en-route' && doctorLocation && (
              <Marker
                longitude={doctorLocation.lng}
                latitude={doctorLocation.lat}
                anchor="center"
              >
                <div className="relative">
                  <div className="w-8 h-8 bg-blue-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center animate-pulse">
                    <Navigation className="h-5 w-5 text-white" />
                  </div>
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                    <Badge variant="default" className="text-xs">Doctor</Badge>
                  </div>
                </div>
              </Marker>
            )}

            {/* Route line (if en-route) - Use real route if available, otherwise straight line */}
            {activeAppointment.status === 'en-route' && doctorLocation && (
              <Source
                id="route"
                type="geojson"
                data={{
                  type: 'Feature',
                  geometry: {
                    type: 'LineString',
                    coordinates: routeGeometry || [
                      [doctorLocation.lng, doctorLocation.lat],
                      [patientLocation.lng, patientLocation.lat],
                    ],
                  },
                }}
              >
                <Layer
                  id="route"
                  type="line"
                  layout={{
                    'line-join': 'round',
                    'line-cap': 'round',
                  }}
                  paint={{
                    'line-color': routeGeometry ? '#3b82f6' : '#94a3b8',
                    'line-width': routeGeometry ? 4 : 3,
                    'line-dasharray': routeGeometry ? undefined : [2, 2],
                  }}
                />
              </Source>
            )}
          </Map>
        </div>

        {/* Doctor Actions */}
        {isDoctor && currentUser?.uid === activeAppointment.doctorId && (
          <div className="space-y-2">
            {activeAppointment.status === 'accepted' && (
              <Button onClick={handleStartRoute} className="w-full" size="lg">
                <Navigation className="mr-2 h-5 w-5" />
                Iniciar Ruta (En Camino)
              </Button>
            )}

            {activeAppointment.status === 'en-route' && (
              <div className="flex gap-2">
                <Button onClick={handleArrived} className="flex-1" size="lg" variant="default">
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Llegué
                </Button>
                <Button onClick={handleComplete} className="flex-1" size="lg" variant="secondary">
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Completar Cita
                </Button>
              </div>
            )}

            {activeAppointment.arrivedAt && activeAppointment.status !== 'completed' && (
              <Button onClick={handleComplete} className="w-full" size="lg" variant="default">
                <CheckCircle className="mr-2 h-5 w-5" />
                Completar Cita
              </Button>
            )}
          </div>
        )}

        {/* Patient Info */}
        {isPatient && activeAppointment.status === 'en-route' && doctorLocation && (
          <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
              El doctor está en camino
            </p>
            {distanceAndETA && (
              <div className="space-y-1 text-xs text-blue-700 dark:text-blue-300">
                <p>Distancia: {distanceAndETA.distance.toFixed(1)} km</p>
                <p>Tiempo estimado: {distanceAndETA.eta} minutos</p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                  La ubicación se actualiza automáticamente cada 10 segundos
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

