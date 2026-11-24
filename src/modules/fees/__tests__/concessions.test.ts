import { describe, it, expect } from 'vitest';
import {
  calculateFeeConcession,
  createConcessionApplication,
  sanctionConcessionApplication,
  rejectConcessionApplication,
  INITIAL_CONCESSION_APPLICATIONS,
} from '../concessions';

describe('CBSE Institutional Fee Concession & Merit Scholarship Engine', () => {
  it('calculates statutory fee concessions, quarterly savings, and annual savings accurately', () => {
    // 20% sibling discount on ₹20,000 tuition
    const sib = calculateFeeConcession(20000, 'SIBLING_DISCOUNT');
    expect(sib.discountPercentage).toBe(20);
    expect(sib.quarterlySavings).toBe(4000);
    expect(sib.discountedQuarterlyTuition).toBe(16000);
    expect(sib.annualSavings).toBe(16000); // 4000 * 4

    // 100% defense martyr ward full tuition waiver
    const martyr = calculateFeeConcession(25000, 'DEFENSE_MARTYR_WARD');
    expect(martyr.discountPercentage).toBe(100);
    expect(martyr.discountedQuarterlyTuition).toBe(0);
    expect(martyr.quarterlySavings).toBe(25000);
    expect(martyr.annualSavings).toBe(100000);
  });

  it('rejects non-positive original tuition amounts', () => {
    expect(() => calculateFeeConcession(0, 'SINGLE_GIRL_CHILD')).toThrow(
      'Original quarterly tuition must be greater than zero'
    );
  });

  it('creates a new fee concession application in PENDING_SANCTION status', () => {
    const app = createConcessionApplication({
      admissionNumber: 'DPGA/2025/2001',
      studentName: 'Zara Khan',
      gradeClass: 'Class 5B',
      concessionType: 'SINGLE_GIRL_CHILD',
      originalQuarterlyTuition: 18000,
      supportingDocDescription: 'Single Girl Child Magistrate Affidavit',
    });

    expect(app.status).toBe('PENDING_SANCTION');
    expect(app.discountPercentage).toBe(50);
    expect(app.quarterlySavings).toBe(9000);
    expect(app.discountedQuarterlyTuition).toBe(9000);
    expect(app.annualSavings).toBe(36000);
    expect(app.sanctionedBy).toBeUndefined();
  });

  it('sanctions a pending fee concession application by Principal / Bursar', () => {
    const updatedList = sanctionConcessionApplication(
      INITIAL_CONCESSION_APPLICATIONS,
      'CNC-005',
      'Dr. Anita Roy (Principal)'
    );

    const sanctioned = updatedList.find((a) => a.id === 'CNC-005');
    expect(sanctioned?.status).toBe('APPROVED_ACTIVE');
    expect(sanctioned?.sanctionedBy).toBe('Dr. Anita Roy (Principal)');
    expect(sanctioned?.bursarReconciled).toBe(true);
  });

  it('rejects a fee concession application with official auditor remarks', () => {
    const updatedList = rejectConcessionApplication(
      INITIAL_CONCESSION_APPLICATIONS,
      'CNC-005',
      'Elder sibling already graduated; no longer eligible for active sibling discount'
    );

    const rejected = updatedList.find((a) => a.id === 'CNC-005');
    expect(rejected?.status).toBe('REJECTED');
    expect(rejected?.rejectionReason).toContain('Elder sibling already graduated');
  });
});
