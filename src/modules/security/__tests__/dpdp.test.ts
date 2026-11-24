import { describe, it, expect } from 'vitest';
import {
  isOffHoursAccess,
  detectSecurityAnomalies,
  generateDpdpComplianceScorecard,
  AuditEvent,
} from '../dpdp-compliance';

describe('VidyaOS Security & DPDP Compliance Engine', () => {
  it('correctly detects access outside operational school hours in Indian Standard Time (IST)', () => {
    // 02:30 AM IST is off-hours
    expect(isOffHoursAccess('2024-11-25T02:30:00+05:30')).toBe(true);

    // 11:30 PM (23:30) IST is off-hours
    expect(isOffHoursAccess('2024-11-25T23:30:00+05:30')).toBe(true);

    // 10:30 AM IST is regular school operating hours
    expect(isOffHoursAccess('2024-11-25T10:30:00+05:30')).toBe(false);
  });

  it('detects multiple security anomalies (off-hours PII access, excessive exports, brute force)', () => {
    const events: AuditEvent[] = [
      {
        id: 'ev-1',
        tenantId: 'dpga',
        tenantName: 'Delhi Public Global Academy',
        category: 'STUDENT_PII',
        action: 'student:pii_batch_view',
        actorId: 'usr-admin-1',
        actorRole: 'Senior Bursar',
        actorIp: '103.21.144.12',
        severity: 'MEDIUM',
        timestamp: '2024-11-25T03:15:00+05:30', // 03:15 AM IST off-hours
        details: 'Accessed Class 10 Aadhaar & Parent Contact Directory',
      },
      {
        id: 'ev-2',
        tenantId: 'dpga',
        tenantName: 'Delhi Public Global Academy',
        category: 'SYSTEM_EXPORT',
        action: 'udise:export_csv',
        actorId: 'usr-admin-1',
        actorRole: 'Senior Bursar',
        actorIp: '103.21.144.12',
        severity: 'HIGH',
        timestamp: '2024-11-25T10:00:00Z',
        details: 'Downloaded U-DISE+ Annual Census',
      },
      {
        id: 'ev-3',
        tenantId: 'dpga',
        tenantName: 'Delhi Public Global Academy',
        category: 'SYSTEM_EXPORT',
        action: 'students:export_csv',
        actorId: 'usr-admin-1',
        actorRole: 'Senior Bursar',
        actorIp: '103.21.144.12',
        severity: 'HIGH',
        timestamp: '2024-11-25T10:02:00Z',
        details: 'Downloaded Active Student SIS Directory',
      },
      {
        id: 'ev-4',
        tenantId: 'dpga',
        tenantName: 'Delhi Public Global Academy',
        category: 'SYSTEM_EXPORT',
        action: 'fees:export_csv',
        actorId: 'usr-admin-1',
        actorRole: 'Senior Bursar',
        actorIp: '103.21.144.12',
        severity: 'HIGH',
        timestamp: '2024-11-25T10:04:00Z',
        details: 'Downloaded Fee Defaulters Ledger',
      },
      {
        id: 'ev-5',
        tenantId: 'stjoseph',
        tenantName: "St. Joseph's Academy",
        category: 'AUTH',
        action: 'auth:failed_login',
        actorId: 'unknown',
        actorRole: 'Anonymous',
        actorIp: '185.220.101.5',
        severity: 'HIGH',
        timestamp: '2024-11-25T11:00:00Z',
        details: 'Invalid password attempt 1',
      },
      {
        id: 'ev-6',
        tenantId: 'stjoseph',
        tenantName: "St. Joseph's Academy",
        category: 'AUTH',
        action: 'auth:failed_login',
        actorId: 'unknown',
        actorRole: 'Anonymous',
        actorIp: '185.220.101.5',
        severity: 'HIGH',
        timestamp: '2024-11-25T11:01:00Z',
        details: 'Invalid password attempt 2',
      },
      {
        id: 'ev-7',
        tenantId: 'stjoseph',
        tenantName: "St. Joseph's Academy",
        category: 'AUTH',
        action: 'auth:failed_login',
        actorId: 'unknown',
        actorRole: 'Anonymous',
        actorIp: '185.220.101.5',
        severity: 'HIGH',
        timestamp: '2024-11-25T11:02:00Z',
        details: 'Invalid password attempt 3',
      },
    ];

    const anomalies = detectSecurityAnomalies(events);
    expect(anomalies.length).toBeGreaterThanOrEqual(3);

    const offHours = anomalies.find((a) => a.anomalyType === 'OFF_HOURS_ACCESS');
    expect(offHours).toBeDefined();

    const rapidExport = anomalies.find((a) => a.anomalyType === 'EXCESSIVE_EXPORT_RATE');
    expect(rapidExport).toBeDefined();
    expect(rapidExport?.severity).toBe('CRITICAL');

    const bruteForce = anomalies.find((a) => a.anomalyType === 'BRUTE_FORCE_SUSPECT');
    expect(bruteForce).toBeDefined();
    expect(bruteForce?.severity).toBe('CRITICAL');
  });

  it('generates a DPDP Act 2023 compliance scorecard with statutory pillar ratings', () => {
    const regularEvents: AuditEvent[] = [
      {
        id: 'ev-normal',
        tenantId: 'dpga',
        tenantName: 'Delhi Public Global Academy',
        category: 'FINANCIAL',
        action: 'fee:collected',
        actorId: 'usr-bursar',
        actorRole: 'Bursar',
        actorIp: '103.21.144.12',
        severity: 'INFO',
        timestamp: '2024-11-25T10:00:00Z',
        details: 'Logged fee payment #REC-9821',
      },
    ];

    const scorecard = generateDpdpComplianceScorecard(regularEvents);
    expect(scorecard.overallScorePercent).toBeGreaterThanOrEqual(95);
    expect(scorecard.isFullyCompliant).toBe(true);
    expect(scorecard.pillars.parentalConsentTracking.status).toBe('COMPLIANT');
    expect(scorecard.pillars.encryptionStandards.score).toBe(100);
  });
});
