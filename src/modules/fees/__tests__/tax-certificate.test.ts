import { describe, it, expect } from 'vitest';
import {
  convertNumberToIndianWords,
  generateSection80CCertificate,
  SAMPLE_80C_PAYMENTS,
} from '../tax-certificate';

describe('Section 80C Tuition Fee Certificate Engine', () => {
  it('should accurately convert numbers into Indian currency words', () => {
    expect(convertNumberToIndianWords(0)).toBe('Zero Rupees Only');
    expect(convertNumberToIndianWords(16500)).toBe('Sixteen Thousand Five Hundred Rupees Only');
    expect(convertNumberToIndianWords(66000)).toBe('Sixty Six Thousand Rupees Only');
    expect(convertNumberToIndianWords(125000)).toBe('One Lakh Twenty Five Thousand Rupees Only');
  });

  it('should compile an official Section 80C certificate with strict segregation of tuition fee from other charges', () => {
    const cert = generateSection80CCertificate({
      financialYear: '2024-25',
      student: {
        fullName: 'Aarav Mehta',
        admissionNumber: 'ADM-2024-001',
        gradeClass: 'Class 10',
        section: 'A',
        rollNumber: '1014',
      },
      parent: {
        fatherOrGuardianName: 'Rajesh Mehta',
        motherName: 'Sunita Mehta',
      },
      feePayments: SAMPLE_80C_PAYMENTS,
    });

    // 4 quarters * 16,500 = 66,000 eligible tuition fee
    expect(cert.totalEligibleAmount).toBe(66000);
    // 4 quarters * 6,000 = 24,000 ineligible (transport + lab)
    expect(cert.totalIneligibleAmount).toBe(24000);
    expect(cert.assessmentYear).toBe('2025-26');
    expect(cert.totalEligibleAmountInWords).toBe('Sixty Six Thousand Rupees Only');
    expect(cert.certificateNumber).toContain('SEC80C/2024-25/ADM2024001');
    expect(cert.verificationHash).toContain('VER-80C-');
    expect(cert.quarterlyBreakdown.length).toBe(4);
  });

  it('should handle partial or single term payments accurately', () => {
    const singleTermCert = generateSection80CCertificate({
      financialYear: '2024-25',
      student: {
        fullName: 'Tanvi Saxena',
        admissionNumber: 'ADM-2024-002',
        gradeClass: 'Class 12',
        section: 'B',
        rollNumber: '1205',
      },
      parent: {
        fatherOrGuardianName: 'Vikas Saxena',
        motherName: 'Anita Saxena',
      },
      feePayments: [
        {
          receiptNumber: 'RCP-2024-5001',
          paymentDate: '2024-04-15',
          quarter: 'Q1 (Apr-Jun)',
          totalAmountPaid: 25000,
          eligibleTuitionFee: 18000,
          ineligibleOtherCharges: 7000,
          paymentMode: 'Bank Transfer',
        },
      ],
    });

    expect(singleTermCert.totalEligibleAmount).toBe(18000);
    expect(singleTermCert.totalIneligibleAmount).toBe(7000);
    expect(singleTermCert.totalEligibleAmountInWords).toBe('Eighteen Thousand Rupees Only');
  });
});
