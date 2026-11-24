import { describe, it, expect } from 'vitest';
import {
  recordParentalConsent,
  calculateConsentManifestSummary,
  getAuthorizedPassengerManifest,
  INITIAL_STUDENT_CONSENTS,
  INITIAL_CONSENT_CAMPAIGNS,
  StudentConsentRecord,
} from '../consent';

describe('Parental Digital Consent & Field Trip Authorization Engine', () => {
  it('records parent digital consent decision with emergency contact and medical declarations', () => {
    const records = [...INITIAL_STUDENT_CONSENTS];
    const updated = recordParentalConsent(
      records,
      'cmp-02',
      'stu-01',
      'GRANTED',
      'Mr. Rajesh Mehta',
      '+91 98101 23456',
      'Asthma inhaler in sports backpack'
    );

    const check = updated.find((r) => r.campaignId === 'cmp-02' && r.studentId === 'stu-01');
    expect(check).toBeDefined();
    expect(check?.status).toBe('GRANTED');
    expect(check?.parentName).toBe('Mr. Rajesh Mehta');
    expect(check?.emergencyPhone).toBe('+91 98101 23456');
    expect(check?.specialMedicalNotes).toBe('Asthma inhaler in sports backpack');
    expect(check?.decidedAt).toBeDefined();
  });

  it('records a decline decision with parental reason', () => {
    const records = [...INITIAL_STUDENT_CONSENTS];
    const updated = recordParentalConsent(
      records,
      'cmp-01',
      'stu-03',
      'DECLINED',
      'Mrs. Kavita Verma',
      '+91 98300 11223',
      'Prior medical appointment'
    );

    const check = updated.find((r) => r.campaignId === 'cmp-01' && r.studentId === 'stu-03');
    expect(check?.status).toBe('DECLINED');
    expect(check?.specialMedicalNotes).toBe('Prior medical appointment');
  });

  it('calculates campaign manifest summary metrics accurately', () => {
    const summary = calculateConsentManifestSummary(INITIAL_STUDENT_CONSENTS, 'cmp-01');
    // Initial cmp-01 has 4 records: 2 GRANTED, 1 PENDING, 1 DECLINED
    expect(summary.totalStudents).toBe(4);
    expect(summary.grantedCount).toBe(2);
    expect(summary.pendingCount).toBe(1);
    expect(summary.declinedCount).toBe(1);
    expect(summary.consentPercentage).toBe(50); // 2/4 = 50%
  });

  it('filters authorized passenger manifest strictly for students with GRANTED status', () => {
    const manifest = getAuthorizedPassengerManifest(INITIAL_STUDENT_CONSENTS, 'cmp-01');
    expect(manifest).toHaveLength(2);
    expect(manifest.map((s) => s.studentName)).toEqual(['Aarav Mehta', 'Diya Sharma']);
    expect(manifest.every((s) => s.status === 'GRANTED')).toBe(true);
  });
});
