import { describe, it, expect } from 'vitest';
import {
  validateCandidateLOC,
  calculateLOCSummary,
  formatParikshaSangamRow,
  INITIAL_LOC_CANDIDATES,
  LOCCandidate,
} from '../board-loc';

describe('CBSE Board LOC & Pariksha Sangam Verification Engine', () => {
  it('validates a compliant Class 10 candidate with 6 subjects and computes fee', () => {
    const candidate = INITIAL_LOC_CANDIDATES.find((c) => c.id === 'loc-001')!;
    const validation = validateCandidateLOC(candidate);

    expect(validation.isValid).toBe(true);
    expect(validation.errors.length).toBe(0);
    // Base 1500 (5 sub) + 300 (6th sub) = 1800
    expect(validation.calculatedFee).toBe(1800);
  });

  it('validates a Class 12 candidate with practicals and migration certificate fee', () => {
    const candidate = INITIAL_LOC_CANDIDATES.find((c) => c.id === 'loc-004')!;
    const validation = validateCandidateLOC(candidate);

    expect(validation.isValid).toBe(true);
    // Base 1500 + 3 practicals * 150 (450) + migration 350 = 2300
    expect(validation.calculatedFee).toBe(2300);
  });

  it('detects multiple CBSE errors: conflicting Math, short UDISE PEN, invalid Aadhar, missing photo', () => {
    const invalidCandidate = INITIAL_LOC_CANDIDATES.find((c) => c.id === 'loc-003')!;
    const validation = validateCandidateLOC(invalidCandidate);

    expect(validation.isValid).toBe(false);
    expect(validation.errors).toContain('Invalid UDISE+ PEN: Expected 11 digits, found 7');
    expect(validation.errors).toContain('Invalid Aadhar Number: Expected 12 digits, found 6');
    expect(validation.errors).toContain(
      'Conflicting Mathematics: Cannot enroll in both Math Standard (041) and Math Basic (241).'
    );
    expect(validation.errors).toContain(
      'CBSE Photo Verification Pending: Photo must have candidate name & capture date printed at bottom.'
    );
  });

  it('aggregates cohort statistics and total CBSE board examination fee liability', () => {
    const summary = calculateLOCSummary(INITIAL_LOC_CANDIDATES);

    expect(summary.totalCandidates).toBe(5);
    expect(summary.class10Count).toBe(3);
    expect(summary.class12Count).toBe(2);
    expect(summary.verifiedCount).toBe(4);
    expect(summary.dataErrorCount).toBe(1);
    expect(summary.cwsnCount).toBe(1);
    expect(summary.totalCBSEFeeLiability).toBeGreaterThan(9000);
  });

  it('generates standardized CSV export string for CBSE Pariksha Sangam upload', () => {
    const candidate = INITIAL_LOC_CANDIDATES[0];
    const csvRow = formatParikshaSangamRow(candidate);

    expect(csvRow).toContain(candidate.cbseRegNo);
    expect(csvRow).toContain(candidate.candidateName);
    expect(csvRow).toContain(candidate.udisePEN);
    expect(csvRow).toContain('184;002;041;086;087;402;501;502');
  });
});
