import { describe, it, expect } from 'vitest';
import {
  convertDateToWords,
  issueTransferCertificate,
  verifyTransferCertificate,
  INITIAL_TC_REGISTRY,
  TransferCertificateRecord,
} from '../transfer-certificate';

describe('CBSE Statutory School Transfer Certificate (TC) Engine', () => {
  it('converts date strings into formal English words as per statutory CBSE formats', () => {
    const words1 = convertDateToWords('2010-04-14');
    expect(words1).toBe('Fourteenth April Two Thousand Ten');

    const words2 = convertDateToWords('2015-08-15');
    expect(words2).toBe('Fifteenth August Two Thousand Fifteen');
  });

  it('issues a valid Transfer Certificate when all dues are cleared and attendance is verified', () => {
    const tc = issueTransferCertificate({
      admissionNumber: 'DPGA/2021/1042',
      studentName: 'Aarav Mehta',
      motherName: 'Mrs. Sunita Mehta',
      fatherName: 'Mr. Rajesh Mehta',
      dateOfBirth: '2010-04-14',
      dateOfFirstAdmission: '05-Apr-2021 in Class 5',
      lastClassStudied: 'Class 10 (Tenth)',
      schoolBoardExamResult: 'CBSE Class 10 Passed',
      subjectsStudied: ['English', 'Math', 'Science'],
      qualifiedForPromotion: true,
      promotionClass: 'Class 11',
      totalWorkingDays: 220,
      daysPresent: 208,
      duesCleared: true,
      monthUpToWhichDuesPaid: 'March 2026',
      reasonForLeaving: 'PARENT_JOB_TRANSFER',
    });

    expect(tc.status).toBe('ISSUED_VALID');
    expect(tc.tcNumber).toMatch(/^TC\/2026\/\d{4}$/);
    expect(tc.dateOfBirthWords).toBe('Fourteenth April Two Thousand Ten');
    expect(tc.verificationHash).toContain('VOS-TC-SIG-');
    expect(tc.duesCleared).toBe(true);
  });

  it('blocks TC issuance if school dues are unpaid', () => {
    expect(() =>
      issueTransferCertificate({
        admissionNumber: 'DPGA/2021/9999',
        studentName: 'Defaulter Student',
        motherName: 'Mother',
        fatherName: 'Father',
        dateOfBirth: '2010-01-01',
        dateOfFirstAdmission: '2021 in Class 5',
        lastClassStudied: 'Class 10',
        schoolBoardExamResult: 'Passed',
        subjectsStudied: ['English'],
        qualifiedForPromotion: true,
        totalWorkingDays: 220,
        daysPresent: 180,
        duesCleared: false, // Dues unpaid!
        monthUpToWhichDuesPaid: 'December 2025',
        reasonForLeaving: 'PERSONAL_REASON',
      })
    ).toThrow('Cannot issue Transfer Certificate: Outstanding dues pending');
  });

  it('validates TC attendance bounds (days present cannot exceed working days)', () => {
    expect(() =>
      issueTransferCertificate({
        admissionNumber: 'DPGA/2021/1042',
        studentName: 'Aarav Mehta',
        motherName: 'Mother',
        fatherName: 'Father',
        dateOfBirth: '2010-04-14',
        dateOfFirstAdmission: '2021 in Class 5',
        lastClassStudied: 'Class 10',
        schoolBoardExamResult: 'Passed',
        subjectsStudied: ['English'],
        qualifiedForPromotion: true,
        totalWorkingDays: 200,
        daysPresent: 225, // Exceeds total!
        duesCleared: true,
        monthUpToWhichDuesPaid: 'March 2026',
        reasonForLeaving: 'HIGHER_STUDIES',
      })
    ).toThrow('Days present cannot exceed total working days');
  });

  it('verifies existing TC records by TC number or admission number and flags revoked TCs', () => {
    // Verified query by TC Number
    const res1 = verifyTransferCertificate(INITIAL_TC_REGISTRY, {
      tcNumber: 'TC/2026/1042',
    });
    expect(res1.isValid).toBe(true);
    expect(res1.certificate?.studentName).toBe('Aarav Mehta');

    // Verified query by Admission Number
    const res2 = verifyTransferCertificate(INITIAL_TC_REGISTRY, {
      admissionNumber: 'DPGA/2021/1089',
    });
    expect(res2.isValid).toBe(true);
    expect(res2.certificate?.studentName).toBe('Diya Sharma');

    // Unknown TC
    const resUnknown = verifyTransferCertificate(INITIAL_TC_REGISTRY, {
      tcNumber: 'TC/2026/9999',
    });
    expect(resUnknown.isValid).toBe(false);
    expect(resUnknown.reason).toContain('No matching Transfer Certificate found');

    // Revoked TC check
    const revokedRegistry: TransferCertificateRecord[] = [
      {
        ...INITIAL_TC_REGISTRY[0],
        id: 'tc-revoked',
        tcNumber: 'TC/2026/7777',
        status: 'REVOKED',
      },
    ];
    const resRevoked = verifyTransferCertificate(revokedRegistry, {
      tcNumber: 'TC/2026/7777',
    });
    expect(resRevoked.isValid).toBe(false);
    expect(resRevoked.reason).toContain('REVOKED');
  });
});
