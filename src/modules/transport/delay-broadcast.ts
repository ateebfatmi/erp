/**
 * School Bus Route Delay Broadcast & Proximity Geofencing Engine
 * Handles real-time traffic delay notifications to parents,
 * 800m stop geofence approach alerts, and Supreme Court speed compliance audits.
 */

export type DelayReason =
  | 'TRAFFIC_CONGESTION'
  | 'ROAD_DIVERSION'
  | 'MECHANICAL_ISSUE'
  | 'WEATHER_FOG'
  | 'VIP_MOVEMENT'
  | 'ACCIDENT_GRIDLOCK';

export type AlertType = 'DELAY_BROADCAST' | 'GEOFENCE_PROXIMITY' | 'SPEED_WARNING';
export type AlertSeverity = 'INFO' | 'WARNING' | 'CRITICAL';
export type NotificationChannel = 'SMS' | 'WHATSAPP' | 'APP_PUSH';

export interface TransportAlert {
  id: string;
  routeId: string;
  busNumber: string;
  timestamp: string;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  message: string;
  affectedStops: string[];
  delayMinutes?: number;
  revisedEtaMinutes?: number;
  channels: NotificationChannel[];
  broadcastBy: string;
}

/**
 * Creates an authorized transport delay broadcast to affected parents
 */
export function createDelayBroadcast(params: {
  routeId: string;
  busNumber: string;
  delayMinutes: number;
  reason: DelayReason;
  customNote?: string;
  affectedStops: string[];
  broadcastBy: string;
}): TransportAlert {
  if (params.delayMinutes <= 0) {
    throw new Error('Delay duration must be greater than 0 minutes');
  }

  const reasonLabels: Record<DelayReason, string> = {
    TRAFFIC_CONGESTION: 'Heavy Traffic & Congestion',
    ROAD_DIVERSION: 'Municipal Road Work / Diversion',
    MECHANICAL_ISSUE: 'Vehicle Mechanical Inspection',
    WEATHER_FOG: 'Dense Winter Fog / Low Visibility',
    VIP_MOVEMENT: 'City VIP Motorcade Route Hold',
    ACCIDENT_GRIDLOCK: 'External Highway Bottleneck',
  };

  const severity: AlertSeverity =
    params.delayMinutes >= 20 ? 'CRITICAL' : params.delayMinutes >= 10 ? 'WARNING' : 'INFO';

  // For delays >= 15 min, activate full multichannel SMS + WhatsApp + Push
  const channels: NotificationChannel[] =
    params.delayMinutes >= 15
      ? ['APP_PUSH', 'WHATSAPP', 'SMS']
      : ['APP_PUSH', 'WHATSAPP'];

  const now = new Date();
  const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

  const message = `Dear Parent, School Bus ${params.busNumber} (Route ${params.routeId}) is running approximately ${
    params.delayMinutes
  } mins delayed due to ${reasonLabels[params.reason]}.${
    params.customNote ? ` Note: ${params.customNote}` : ''
  } Please track live position on VidyaOS app.`;

  return {
    id: `ALT-DLY-${Date.now().toString().slice(-6)}`,
    routeId: params.routeId,
    busNumber: params.busNumber,
    timestamp: timeString,
    type: 'DELAY_BROADCAST',
    severity,
    title: `Bus ${params.busNumber} Delayed by ~${params.delayMinutes} Mins`,
    message,
    affectedStops: params.affectedStops,
    delayMinutes: params.delayMinutes,
    channels,
    broadcastBy: params.broadcastBy,
  };
}

/**
 * Evaluates geofence distance to designated stop and triggers approach alert
 */
export function evaluateGeofenceProximity(params: {
  distanceToStopMeters: number;
  busNumber: string;
  routeId: string;
  stopName: string;
}): { triggerAlert: boolean; alert?: TransportAlert } {
  // Proximity trigger zone: between 50m and 800m
  if (params.distanceToStopMeters <= 800 && params.distanceToStopMeters >= 50) {
    const estimatedMinutes = Math.max(2, Math.round(params.distanceToStopMeters / 250));
    const now = new Date();
    const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const alert: TransportAlert = {
      id: `ALT-GEO-${Date.now().toString().slice(-6)}`,
      routeId: params.routeId,
      busNumber: params.busNumber,
      timestamp: timeString,
      type: 'GEOFENCE_PROXIMITY',
      severity: 'INFO',
      title: `Bus Approaching: ${params.stopName}`,
      message: `Bus ${params.busNumber} is ~${params.distanceToStopMeters}m away from ${params.stopName} (approx ${estimatedMinutes} mins). Please ensure the student is at the stop.`,
      affectedStops: [params.stopName],
      revisedEtaMinutes: estimatedMinutes,
      channels: ['APP_PUSH'],
      broadcastBy: 'AIS-140 Automated Geofence Engine',
    };

    return { triggerAlert: true, alert };
  }

  return { triggerAlert: false };
}

/**
 * Evaluates speed compliance under Supreme Court of India guidelines (Max 40 km/h)
 */
export function evaluateSpeedCompliance(params: {
  currentSpeedKmh: number;
  busNumber: string;
  routeId: string;
  speedLimitKmh?: number;
}): { isCompliant: boolean; speedAlert?: TransportAlert } {
  const limit = params.speedLimitKmh ?? 40;

  if (params.currentSpeedKmh > limit) {
    const now = new Date();
    const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const speedAlert: TransportAlert = {
      id: `ALT-SPD-${Date.now().toString().slice(-6)}`,
      routeId: params.routeId,
      busNumber: params.busNumber,
      timestamp: timeString,
      type: 'SPEED_WARNING',
      severity: 'CRITICAL',
      title: `Speed Limit Violation: ${params.currentSpeedKmh} km/h`,
      message: `Bus ${params.busNumber} exceeded statutory speed limit of ${limit} km/h (Recorded: ${params.currentSpeedKmh} km/h). Immediate speed governor notification dispatched.`,
      affectedStops: ['En Route'],
      channels: ['APP_PUSH', 'SMS'],
      broadcastBy: 'AIS-140 Telematics Speed Governor',
    };

    return { isCompliant: false, speedAlert };
  }

  return { isCompliant: true };
}

/**
 * Pre-seeded Transport Alerts
 */
export const INITIAL_TRANSPORT_ALERTS: TransportAlert[] = [
  {
    id: 'ALT-DLY-001',
    routeId: 'ROUTE-04',
    busNumber: 'DL-01-AB-1044',
    timestamp: '07:22 AM',
    type: 'DELAY_BROADCAST',
    severity: 'WARNING',
    title: 'Bus DL-01-AB-1044 Delayed by ~15 Mins',
    message: 'Dear Parent, School Bus DL-01-AB-1044 (Route 4) is running approximately 15 mins delayed due to Heavy Traffic & Congestion at Outer Ring Road. Please track live position on VidyaOS app.',
    affectedStops: ['Sector 14 Market', 'Green Park Metro Gate 2', 'Hauz Khas Enclave'],
    delayMinutes: 15,
    channels: ['APP_PUSH', 'WHATSAPP', 'SMS'],
    broadcastBy: 'Rajiv Sharma (Transport Supervisor)',
  },
  {
    id: 'ALT-GEO-002',
    routeId: 'ROUTE-04',
    busNumber: 'DL-01-AB-1044',
    timestamp: '07:35 AM',
    type: 'GEOFENCE_PROXIMITY',
    severity: 'INFO',
    title: 'Bus Approaching: Green Park Metro Gate 2',
    message: 'Bus DL-01-AB-1044 is ~450m away from Green Park Metro Gate 2 (approx 3 mins). Please ensure the student is at the designated stop.',
    affectedStops: ['Green Park Metro Gate 2'],
    revisedEtaMinutes: 3,
    channels: ['APP_PUSH'],
    broadcastBy: 'AIS-140 Automated Geofence Engine',
  },
];
