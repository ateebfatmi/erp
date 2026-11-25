import { describe, it, expect } from 'vitest';
import {
  evaluateCertificateStatus,
  evaluateDisasterSafetyAudit,
  INITIAL_CERTIFICATES,
  INITIAL_FIRE_EQUIPMENT,
  INITIAL_MOCK_DRILLS,
  StatutorySafetyCertificate,
  FireSafetyEquipment,
  EvacuationMockDrill,
} from '../disaster-management';

describe('CBSE Disaster Management & Fire Safety Engine', () => {
  it('correctly evaluates certificate expiration thresholds', () => {
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 2);
    expect(evaluateCertificateStatus(futureDate.toISOString().split('T')[0])).toBe('VALID');

    const nearExpiryDate = new Date();
    nearExpiryDate.setDate(nearExpiryDate.getDate() + 30);
    expect(evaluateCertificateStatus(nearExpiryDate.toISOString().split('T')[0])).toBe('EXPIRING_SOON');

    const pastDate = new Date();
    pastDate.setFullYear(pastDate.getFullYear() - 1);
    expect(evaluateCertificateStatus(pastDate.toISOString().split('T')[0])).toBe('EXPIRED');
  });

  it('computes composite safety audit score for fully compliant campus', () => {
    const audit = evaluateDisasterSafetyAudit(
      INITIAL_CERTIFICATES,
      INITIAL_FIRE_EQUIPMENT,
      INITIAL_MOCK_DRILLS
    );

    expect(audit.fireNocValid).toBe(true);
    expect(audit.structuralStabilityValid).toBe(true);
    expect(audit.biAnnualMockDrillCompliant).toBe(true);
    expect(audit.equipmentFunctionalRate).toBe(100);
    expect(audit.overallSafetyIndex).toBeGreaterThanOrEqual(85);
    expect(audit.complianceGrade).toBe('A_EXEMPLARY');
    expect(audit.statutoryDeficits.length).toBe(0);
  });

  it('identifies statutory deficits when Fire NOC is expired and mock drill is overdue', () => {
    const expiredCertificates: StatutorySafetyCertificate[] = [
      {
        id: 'CERT-EXP',
        certificateType: 'FIRE_SAFETY_NOC_FORM_5',
        certificateNumber: 'NOC-OLD',
        issuingAuthority: 'Fire Dept',
        issueDate: '2020-01-01',
        expiryDate: '2021-01-01', // Expired
        status: 'EXPIRED',
      },
    ];

    const outdatedDrills: EvacuationMockDrill[] = [
      {
        id: 'OLD-DRILL',
        drillType: 'FIRE_EVACUATION',
        scheduledDate: '2023-01-01', // Over 180 days ago
        drillStartTime: '10:00 AM',
        drillEndTime: '10:05 AM',
        totalOccupantsPresent: 1000,
        totalEvacuatedSafely: 1000,
        evacuationDurationSeconds: 240, // 4 mins (exceeds 3 min limit)
        safeAssemblyArea: 'Ground',
        floorWardensReporting: 8,
        unaccountedSimulatedCount: 0,
        evaluatorRemarks: 'Slow evacuation',
        correctiveActionsRequired: ['Improve warden speed'],
        status: 'COMPLETED',
      },
    ];

    const audit = evaluateDisasterSafetyAudit(expiredCertificates, [], outdatedDrills);

    expect(audit.fireNocValid).toBe(false);
    expect(audit.biAnnualMockDrillCompliant).toBe(false);
    expect(audit.statutoryDeficits.some((d) => d.includes('Fire Safety NOC'))).toBe(true);
    expect(audit.statutoryDeficits.some((d) => d.includes('mock drill overdue'))).toBe(true);
    expect(audit.complianceGrade).toBe('C_DEFICIT');
  });
});
