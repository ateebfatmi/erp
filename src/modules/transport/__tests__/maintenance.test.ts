import { describe, it, expect } from 'vitest';
import {
  checkRtoComplianceStatus,
  calculateFleetFuelEfficiency,
  INITIAL_FLEET_RECORDS,
  INITIAL_FUEL_LOGS,
} from '../maintenance';

describe('Supreme Court & RTO School Bus Compliance Engine', () => {
  it('detects critical RTO non-compliance issues such as expired FC or offline CCTV', () => {
    const expiredBus = INITIAL_FLEET_RECORDS[1]; // Bus DL-01-GB-7719: FC expired 2024-10-15, CCTV false
    const audit = checkRtoComplianceStatus(expiredBus, '2024-11-25');

    expect(audit.isCompliant).toBe(false);
    expect(audit.criticalIssues.length).toBeGreaterThanOrEqual(2);
    expect(audit.criticalIssues.some((i) => i.includes('Fitness Certificate EXPIRED'))).toBe(true);
    expect(audit.criticalIssues.some((i) => i.includes('CCTV camera'))).toBe(true);
  });

  it('validates compliant fleet vehicles and calculates days to next statutory expiry', () => {
    const validBus = INITIAL_FLEET_RECORDS[0]; // Bus DL-01-GB-8842
    const audit = checkRtoComplianceStatus(validBus, '2024-11-25');

    expect(audit.isCompliant).toBe(true);
    expect(audit.criticalIssues.length).toBe(0);
    // Closest expiry is PUC on 2025-02-15 (approx 82 days)
    expect(audit.daysToNextExpiry).toBeGreaterThan(0);
  });

  it('computes fleet fuel efficiency (km/L) and total fuel expenditure correctly', () => {
    const result = calculateFleetFuelEfficiency(INITIAL_FUEL_LOGS);

    // 270 km + 330 km = 600 km
    expect(result.totalKmTraveled).toBe(600);
    // 48 L + 60 L = 108 L
    expect(result.totalFuelLiters).toBe(108);
    // 600 / 108 = 5.56 km/L
    expect(result.averageMileageKmPerL).toBe(5.56);
    // 4296 + 5370 = 9666
    expect(result.totalExpenditure).toBe(9666);
  });
});
