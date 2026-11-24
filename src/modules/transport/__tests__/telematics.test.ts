import { describe, it, expect } from 'vitest';
import {
  calculateEtaMinutes,
  checkSpeedCompliance,
  computeRouteProgress,
} from '../telematics';

describe('Transport Telematics & Fleet Monitoring Engine', () => {
  it('correctly calculates ETA minutes from distance and velocity', () => {
    // 15 km at 30 km/h = 0.5 hours = 30 minutes
    const eta1 = calculateEtaMinutes(15, 30);
    expect(eta1).toBe(30);

    // 4 km at 40 km/h = 0.1 hours = 6 minutes
    const eta2 = calculateEtaMinutes(4, 40);
    expect(eta2).toBe(6);

    // 0 speed returns 0
    expect(calculateEtaMinutes(10, 0)).toBe(0);
  });

  it('verifies Delhi STA speed governor limits (40 km/h max)', () => {
    // Under limit
    const safe = checkSpeedCompliance(35, 40);
    expect(safe.isOverspeed).toBe(false);
    expect(safe.severity).toBe('normal');

    // Warning: slightly above limit
    const warning = checkSpeedCompliance(45, 40);
    expect(warning.isOverspeed).toBe(true);
    expect(warning.severity).toBe('warning');

    // Critical: > 50 km/h
    const critical = checkSpeedCompliance(55, 40);
    expect(critical.isOverspeed).toBe(true);
    expect(critical.severity).toBe('critical');
    expect(critical.statusText).toContain('CRITICAL OVERSPEED');
  });

  it('computes stop progression percentage across school route', () => {
    const totalStops = 6;

    // At first stop (index 0)
    const p0 = computeRouteProgress(0, totalStops);
    expect(p0.percentage).toBe(0);
    expect(p0.remainingStops).toBe(5);

    // At middle stop (index 3 of 6)
    const p3 = computeRouteProgress(3, totalStops);
    expect(p3.percentage).toBe(60); // 3 / 5 = 60%
    expect(p3.remainingStops).toBe(2);

    // At destination stop (index 5 of 6)
    const p5 = computeRouteProgress(5, totalStops);
    expect(p5.percentage).toBe(100);
    expect(p5.remainingStops).toBe(0);
  });
});
