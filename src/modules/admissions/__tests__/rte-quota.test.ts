import { describe, it, expect } from 'vitest';
import {
  calculateRteQuota,
  verifyRteApplicant,
  calculateStateReimbursementClaim,
  runRteDrawOfLots,
  INITIAL_RTE_APPLICANTS,
  RteApplicant,
} from '../rte-quota';

describe('RTE Act 2009 Section 12(1)(c) Statutory 25% Quota Engine', () => {
  it('calculates the statutory 25% quota seats accurately', () => {
    const quota120 = calculateRteQuota(120);
    expect(quota120.mandatoryRteSeats).toBe(30);
    expect(quota120.generalSeats).toBe(90);

    const quota160 = calculateRteQuota(160);
    expect(quota160.mandatoryRteSeats).toBe(40);
    expect(quota160.generalSeats).toBe(120);
  });

  it('rejects invalid non-positive intake capacities', () => {
    expect(() => calculateRteQuota(0)).toThrow('Total intake capacity must be greater than zero');
  });

  it('verifies EWS applicant criteria and flags over-income or missing docs', () => {
    const validEws: RteApplicant = {
      id: 'test-1',
      applicationNumber: 'RTE-TEST-01',
      studentName: 'Rahul Kumar',
      dob: '2021-02-10',
      gender: 'MALE',
      category: 'EWS',
      parentName: 'Ramu',
      annualFamilyIncome: 80000,
      neighbourhoodDistanceKm: 0.8,
      targetClass: 'Class 1',
      documentsSubmitted: {
        birthCertificate: true,
        incomeCertificate: true,
        casteOrMedicalCertificate: false,
        residenceProof: true,
      },
      verificationStatus: 'VERIFIED_ELIGIBLE',
      allocationStatus: 'WAITLISTED',
    };

    const resValid = verifyRteApplicant(validEws);
    expect(resValid.isEligible).toBe(true);
    expect(resValid.status).toBe('VERIFIED_ELIGIBLE');

    // Over income ceiling test (> 1 Lakh)
    const richEws = { ...validEws, annualFamilyIncome: 140000 };
    const resRich = verifyRteApplicant(richEws, 100000);
    expect(resRich.isEligible).toBe(false);
    expect(resRich.status).toBe('REJECTED_OVER_INCOME');

    // Out of statutory 3.0 km zone
    const outOfZone = { ...validEws, neighbourhoodDistanceKm: 4.5 };
    const resZone = verifyRteApplicant(outOfZone);
    expect(resZone.isEligible).toBe(false);
    expect(resZone.status).toBe('REJECTED_OUT_OF_ZONE');
  });

  it('computes state reimbursement claim under Section 12(2) using the lower of actual fee or state cap', () => {
    // Case 1: State cap (₹26,000) is lower than School actual fee (₹55,000)
    const claim1 = calculateStateReimbursementClaim({
      confirmedStudentsCount: 30,
      schoolAnnualTuitionPerChild: 55000,
      stateNotifiedPerChildCap: 26000,
    });

    expect(claim1.perChildReimbursed).toBe(26000);
    expect(claim1.totalClaimAmount).toBe(30 * 26000); // ₹7,80,000
    expect(claim1.reimbursableCapUsed).toBe('STATE_CAP');

    // Case 2: Actual fee (₹20,000) is lower than State cap (₹26,000)
    const claim2 = calculateStateReimbursementClaim({
      confirmedStudentsCount: 20,
      schoolAnnualTuitionPerChild: 20000,
      stateNotifiedPerChildCap: 26000,
    });

    expect(claim2.perChildReimbursed).toBe(20000);
    expect(claim2.totalClaimAmount).toBe(20 * 20000); // ₹4,00,000
    expect(claim2.reimbursableCapUsed).toBe('ACTUAL_FEE');
  });

  it('runs transparent computerized draw of lots prioritizing closer neighbourhood tiers', () => {
    const { allotted, waitlisted } = runRteDrawOfLots(INITIAL_RTE_APPLICANTS, 2);

    expect(allotted.length).toBe(2);
    expect(waitlisted.length).toBe(2); // Suraj Bhan was REJECTED_OVER_INCOME, so 4 eligible total
    // Priority distance check: first allotted must be closest (0.7 km)
    expect(allotted[0].studentName).toBe('Chahat Kumari');
    expect(allotted[0].drawOfLotsSerial).toBe(1);
    expect(allotted[1].studentName).toBe('Mohammed Zaid');
    expect(allotted[1].drawOfLotsSerial).toBe(2);
  });
});
