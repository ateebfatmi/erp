import { describe, it, expect } from 'vitest';
import {
  createDelayBroadcast,
  evaluateGeofenceProximity,
  evaluateSpeedCompliance,
} from '../delay-broadcast';

describe('School Bus Route Delay Broadcast & Proximity Geofencing Engine', () => {
  it('creates an informative delay broadcast and enables multichannel SMS for >=15 min delays', () => {
    const alert = createDelayBroadcast({
      routeId: 'ROUTE-04',
      busNumber: 'DL-01-AB-1044',
      delayMinutes: 20,
      reason: 'TRAFFIC_CONGESTION',
      affectedStops: ['Stop A', 'Stop B'],
      broadcastBy: 'Transport Manager',
      customNote: 'Flyover maintenance work',
    });

    expect(alert.severity).toBe('CRITICAL');
    expect(alert.delayMinutes).toBe(20);
    expect(alert.channels).toContain('SMS');
    expect(alert.channels).toContain('WHATSAPP');
    expect(alert.channels).toContain('APP_PUSH');
    expect(alert.message).toContain('Heavy Traffic & Congestion');
    expect(alert.message).toContain('Flyover maintenance work');
  });

  it('rejects invalid delay durations <= 0 minutes', () => {
    expect(() =>
      createDelayBroadcast({
        routeId: 'ROUTE-04',
        busNumber: 'DL-01-AB-1044',
        delayMinutes: 0,
        reason: 'ROAD_DIVERSION',
        affectedStops: ['Stop A'],
        broadcastBy: 'Admin',
      })
    ).toThrow('Delay duration must be greater than 0 minutes');
  });

  it('evaluates geofence proximity correctly within the 800m arrival boundary', () => {
    const approachResult = evaluateGeofenceProximity({
      distanceToStopMeters: 450,
      busNumber: 'DL-01-AB-1044',
      routeId: 'ROUTE-04',
      stopName: 'Green Park Metro Gate 2',
    });

    expect(approachResult.triggerAlert).toBe(true);
    expect(approachResult.alert?.type).toBe('GEOFENCE_PROXIMITY');
    expect(approachResult.alert?.title).toContain('Green Park Metro Gate 2');

    // Far away (> 800m) should not trigger
    const farResult = evaluateGeofenceProximity({
      distanceToStopMeters: 1500,
      busNumber: 'DL-01-AB-1044',
      routeId: 'ROUTE-04',
      stopName: 'Green Park Metro Gate 2',
    });

    expect(farResult.triggerAlert).toBe(false);
  });

  it('evaluates Supreme Court speed limits and raises critical warning if exceeded', () => {
    const compliant = evaluateSpeedCompliance({
      currentSpeedKmh: 36,
      busNumber: 'DL-01-AB-1044',
      routeId: 'ROUTE-04',
    });
    expect(compliant.isCompliant).toBe(true);
    expect(compliant.speedAlert).toBeUndefined();

    const overspeed = evaluateSpeedCompliance({
      currentSpeedKmh: 52,
      busNumber: 'DL-01-AB-1044',
      routeId: 'ROUTE-04',
      speedLimitKmh: 40,
    });
    expect(overspeed.isCompliant).toBe(false);
    expect(overspeed.speedAlert?.severity).toBe('CRITICAL');
    expect(overspeed.speedAlert?.title).toContain('Speed Limit Violation: 52 km/h');
  });
});
