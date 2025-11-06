/**
 * Mapbox utilities and configuration
 */

export const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';

export const MAP_DEFAULT_CENTER = {
  lat: 4.7110, // Bogotá, Colombia
  lng: -74.0721,
};

export const MAP_DEFAULT_ZOOM = 13;

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Estimate travel time in minutes based on distance
 * Assumes average speed of 30 km/h in urban areas
 */
export function estimateTravelTime(distanceKm: number): number {
  const AVERAGE_SPEED_KMH = 30;
  return Math.round((distanceKm / AVERAGE_SPEED_KMH) * 60);
}

/**
 * Geocode an address using Mapbox Geocoding API
 */
export async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
  if (!MAPBOX_ACCESS_TOKEN) {
    console.warn('Mapbox access token not configured');
    return null;
  }

  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${MAPBOX_ACCESS_TOKEN}&limit=1&country=co&proximity=-74.0721,4.7110`
    );
    const data = await response.json();

    if (data.features && data.features.length > 0) {
      const [lng, lat] = data.features[0].center;
      return { lat, lng };
    }
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}

/**
 * Autocomplete addresses using Mapbox Geocoding API
 * Returns list of suggested addresses
 */
export interface AddressSuggestion {
  place_name: string;
  center: [number, number]; // [lng, lat]
  context?: Array<{ text: string }>;
}

export async function autocompleteAddress(
  query: string,
  limit: number = 5
): Promise<AddressSuggestion[]> {
  if (!MAPBOX_ACCESS_TOKEN) {
    console.warn('Mapbox access token not configured');
    return [];
  }

  if (!query || query.length < 3) {
    return [];
  }

  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${MAPBOX_ACCESS_TOKEN}&limit=${limit}&country=co&proximity=-74.0721,4.7110&types=address,poi,neighborhood,locality`
    );
    const data = await response.json();

    if (data.features && data.features.length > 0) {
      return data.features.map((feature: any) => ({
        place_name: feature.place_name,
        center: feature.center,
        context: feature.context,
      }));
    }
    return [];
  } catch (error) {
    console.error('Autocomplete error:', error);
    return [];
  }
}

/**
 * Reverse geocode coordinates to get address
 */
export async function reverseGeocode(lat: number, lng: number): Promise<string | null> {
  if (!MAPBOX_ACCESS_TOKEN) {
    console.warn('Mapbox access token not configured');
    return null;
  }

  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_ACCESS_TOKEN}&limit=1`
    );
    const data = await response.json();

    if (data.features && data.features.length > 0) {
      return data.features[0].place_name;
    }
    return null;
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return null;
  }
}

/**
 * Get real route between two points using Mapbox Directions API
 * Returns route geometry and estimated duration
 */
export async function getRoute(
  start: { lat: number; lng: number },
  end: { lat: number; lng: number }
): Promise<{ geometry: number[][]; duration: number; distance: number } | null> {
  if (!MAPBOX_ACCESS_TOKEN) {
    console.warn('Mapbox access token not configured');
    return null;
  }

  try {
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start.lng},${start.lat};${end.lng},${end.lat}?access_token=${MAPBOX_ACCESS_TOKEN}&geometries=geojson&overview=full`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
      const route = data.routes[0];
      return {
        geometry: route.geometry.coordinates,
        duration: Math.round(route.duration / 60), // Convert to minutes
        distance: route.distance / 1000, // Convert to kilometers
      };
    }
    return null;
  } catch (error) {
    console.error('Directions API error:', error);
    return null;
  }
}

