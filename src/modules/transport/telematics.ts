export interface GeoPoint {
  latitude: number;
  longitude: number;
}

export interface RouteStop {
  id: string;
  name: string;
  scheduledTime: string;
  location: GeoPoint;
  studentsCount: number;
  status: 'passed' | 'current' | 'upcoming';
  actualArrival?: string;
}

export interface VehicleTelemetry {
  vehicleId: string;
  vehicleNumber: string;
  routeName: string;
  driverName: string;
  driverPhone: string;
  speedKmh: number;
  speedLimitKmh: number;
  currentLocation: GeoPoint;
  fuelPercent: number;
  studentsOnboard: number;
  capacity: number;
  sosStatus: 'normal' | 'emergency';
  currentStopIndex: number;
  stops: RouteStop[];
}

/**
 * Calculates Estimated Time of Arrival (ETA) in minutes based on distance and average speed
 */
export function calculateEtaMinutes(distanceKm: number, speedKmh: number): number {
  if (speedKmh <= 0) return 0;
  const hours = distanceKm / speedKmh;
  return Math.max(1, Math.round(hours * 60));
}

/**
 * Validates speed compliance according to Delhi/State Transport Authority (STA) school bus guidelines (40 km/h)
 */
export function checkSpeedCompliance(speedKmh: number, speedLimitKmh: number = 40): {
  isOverspeed: boolean;
  statusText: string;
  severity: 'normal' | 'warning' | 'critical';
} {
  if (speedKmh > speedLimitKmh + 10) {
    return {
      isOverspeed: true,
      statusText: `CRITICAL OVERSPEED: ${speedKmh} km/h (Limit: ${speedLimitKmh} km/h)`,
      severity: 'critical',
    };
  }
  if (speedKmh > speedLimitKmh) {
    return {
      isOverspeed: true,
      statusText: `WARNING: Exceeding Speed Limit by ${speedKmh - speedLimitKmh} km/h`,
      severity: 'warning',
    };
  }
  return {
    isOverspeed: false,
    statusText: `Within Safe Speed Limit (${speedKmh} km/h)`,
    severity: 'normal',
  };
}

/**
 * Computes route completion percentage and remaining stops
 */
export function computeRouteProgress(currentStopIndex: number, totalStops: number): {
  percentage: number;
  remainingStops: number;
} {
  if (totalStops <= 0) return { percentage: 0, remainingStops: 0 };
  const completed = Math.min(currentStopIndex, totalStops - 1);
  const percentage = Math.round((completed / (totalStops - 1)) * 100);
  const remainingStops = Math.max(0, totalStops - 1 - completed);
  return { percentage, remainingStops };
}
